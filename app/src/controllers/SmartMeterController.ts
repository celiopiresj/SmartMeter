import { Request, Response, NextFunction } from "express";
import { SmartMeterModel } from "../models/SmartMeterModel";
import { BaseError, ConflictError, IncorrectRequest, NotFound } from "../errors";
import { getImageType, isValidISODateTime, saveImage, validateBase64, validateImageType, validateMeasuretype } from "../utils/helpers";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../utils/geminiClient";
import { Pool } from "mysql2/promise";

interface MeasurementRequestBodyPost {
	image: string;
	customer_code: string;
	measure_datetime: string;
	measure_type: string;
}

interface MeasurementRequestPost extends Request {
	body: MeasurementRequestBodyPost;
}

interface MeasurementRequestBodyUpdate {
	measure_uuid: string;
	confirmed_value: number;
}

interface MeasurementRequestUpdate extends Request {
	body: MeasurementRequestBodyUpdate;
}

interface MeasurementQueryParams {
	measure_type?: string;
}

interface MeasurementParams {
	customer_code: string;
}

interface MeasurementRequestGet extends Request<{}, any, any, MeasurementQueryParams> {
	params: MeasurementParams;
	query: MeasurementQueryParams;
}

export default class SmartMeterController {
	private smartMeterModel: SmartMeterModel;

	constructor(connection: Pool) {
		this.smartMeterModel = new SmartMeterModel(connection);
	}

	private validateRequestBody(req: MeasurementRequestPost): IncorrectRequest | null {
		const data = req.body;

		const fields = {
			image: "O campo image deve ser estar em base64 e usar um dos seguintes tipos de imagem: png, jpeg, jpg, webp, heic ou heif.",
			customer_code: "O campo customer_code deve ser uma string.",
			measure_datetime: "O campo measure_datetime deve estar no formato: YYYY-MM-DDTHH:mm:ssZ.",
			measure_type: "O tipo fornecido no campo measure_type é inválido, os valores válidos são 'WATER' ou 'GAS'.",
		};

		const validationFunctions: { [key: string]: (value: any) => boolean } = {
			customer_code: (value) => typeof value === "string",
			image: (value) => validateBase64(value) && validateImageType(value),
			measure_datetime: (value) => isValidISODateTime(value),
			measure_type: (value) => validateMeasuretype(value),
		};

		for (const field of Object.keys(fields)) {
			if (!Object.prototype.hasOwnProperty.call(data, field)) {
				return new IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos.", "INVALID_DATA");
			} else {
				const errorMessage = fields[field as keyof typeof fields];
				const value = Reflect.get(data, field);

				if (validationFunctions[field] ? validationFunctions[field](value) : value) {
					continue;
				}

				return new IncorrectRequest(errorMessage, "INVALID_DATA");
			}
		}

		return null;
	}

	async upload(req: MeasurementRequestPost, res: Response, next: NextFunction) {
		const { image, customer_code, measure_datetime, measure_type } = req.body;

		const validationError = this.validateRequestBody(req);

		if (validationError) {
			return next(validationError);
		}

		try {
			const measureExist = await this.smartMeterModel.checkReadingExistsByTypeAndCustomeCode(String(measure_type).toUpperCase(), String(customer_code).toLowerCase(), new Date(measure_datetime));

			if (measureExist) {
				return next(new ConflictError("Leitura do mês já realizada.", "DOUBLE_REPORT"));
			}

			const image_type = getImageType(image);

			if (typeof image_type !== "string") {
				return next(new ConflictError("O campo image deve ser estar em base64 e usar um dos seguintes tipos de imagem: png, jpeg, jpg, webp, heic ou heif.", "INVALID_DATA"));
			}

			const path = await saveImage(image, image_type);
			const response = await uploadFile(path, image_type);

			const measure_uuid = uuidv4();

			const data = {
				measure_uuid,
				image_url: response.image_url,
				measure_datetime: new Date(measure_datetime),
				measure_type: String(measure_type).toUpperCase(),
				measure_value: Number(response.measure_value),
				customer_code,
			};

			const result = await this.smartMeterModel.createMeasurement(data);

			if (result.affectedRows > 0) {
				res.status(200).json({ ...response, measure_uuid });
			} else {
				throw new BaseError("Erro ao cadastrar a medição.");
			}
		} catch (error) {
			next(error);
		}
	}

	async confirm(req: MeasurementRequestUpdate, res: Response, next: NextFunction) {
		const { measure_uuid, confirmed_value } = req.body;

		try {
			if (!measure_uuid || !confirmed_value) {
				return next(new IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos.", "INVALID_DATA"));
			}

			if (typeof measure_uuid !== "string") {
				return next(new IncorrectRequest("O valor  do campo measure_uuid deve ser uma string", "INVALID_DATA"));
			}

			if (!Number.isInteger(confirmed_value)) {
				return next(new IncorrectRequest("O valor para confirmação deve ser um número inteiro.", "INVALID_DATA"));
			}

			const measureExist = await this.smartMeterModel.getMeasurementsByUuid(measure_uuid);

			if (measureExist.length === 0) {
				return next(new NotFound("Leitura não encontrada.", "MEASURE_NOT_FOUND"));
			}

			if (measureExist[0].has_confirmed) {
				return next(new NotFound("Leitura do mês já confirmada.", "CONFIRMATION_DUPLICATE"));
			}

			const data = {
				measure_value: confirmed_value,
				has_confirmed: true,
			};

			const result = await this.smartMeterModel.updateByUuid(measure_uuid, data);

			if (result.affectedRows > 0) {
				res.status(200).json({ success: true });
			} else {
				throw new BaseError("Erro ao confirmar a medição.");
			}
		} catch (error) {
			next(error);
		}
	}

	async get(req: MeasurementRequestGet, res: Response, next: NextFunction) {
		const { customer_code } = req.params;
		const { measure_type } = req.query;

		if (measure_type) {
			if (validateMeasuretype(measure_type) !== true) {
				return next(new IncorrectRequest("Tipo de medição não permitida.", "INVALID_TYPE"));
			}
		} else {
			if (Object.keys(req.query).length > 0) {
				return next(new IncorrectRequest(`Parametro invalido: ${Object.keys(req.query).join(", ")}`, "INVALID_PARAMETER"));
			}
		}

		try {
			const result = await this.smartMeterModel.getMeasurementsByCustomerCode(customer_code, measure_type);

			if (result.length > 0) {
				const data = {
					customer_code,
					measures: result,
				};

				res.status(200).json(data);
			} else {
				next(new NotFound("Nenhuma leitura encontrada", "MEASURES_NOT_FOUND"));
			}
		} catch (error) {
			next(error);
		}
	}
}
