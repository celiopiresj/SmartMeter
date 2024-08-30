import { Request, Response, NextFunction } from "express";
import connection from "../database/database";
import SmartMeterModel from "../models/SmartMeterModel";
import { BaseError, IncorrectRequest, NotFound } from "../errors";
import { getImageType, isValidISODateTime, saveImage, validateBase64, validateMeasuretype } from "../utils/helpers";
import { uploadFile } from "../utils/geminiClient";
import { v4 as uuidv4 } from "uuid";

export default class SmartMeterController {
	private smartMeterModel: SmartMeterModel;

	constructor() {
		this.smartMeterModel = new SmartMeterModel(connection);
	}

	async upload(req: Request, res: Response, next: NextFunction) {
		const { image, customer_code, measure_datetime, measure_type } = req.body;

		if (!image || !customer_code || !measure_datetime || !measure_type) {
			return next(new IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos", "INVALID_DATA"));
		}

		if (!validateBase64(image)) {
			return next(new IncorrectRequest("O campo image deve ser estar em base64.", "INVALID_DATA"));
		}

		if (typeof customer_code !== "string") {
			return next(new IncorrectRequest("O campo customer_code deve ser uma string.", "INVALID_DATA"));
		}

		if (!isValidISODateTime(measure_datetime)) {
			return next(new IncorrectRequest("O campo measure_datetime deve estar no formato: YYYY-MM-DDTHH:mm:ssZ", "INVALID_DATA"));
		}

		const resultValidateMeasuretype = validateMeasuretype(measure_type);

		if (resultValidateMeasuretype instanceof IncorrectRequest) {
			return next(resultValidateMeasuretype);
		}

		const typeImage = getImageType(image);

		if (!typeImage) {
			return next(new IncorrectRequest("O tipo da imagem é ínvalido", "INVALID_DATA"));
		}

		try {
			// const path = await saveImage(image, typeImage);
			// const response = await uploadFile(path, typeImage);
			const response = { image_url: "ssfsfs", measure_value: "345522" };
			const measure_uuid = uuidv4();

			const data = {
				measure_uuid,
				image_url: response.image_url,
				measure_datetime: new Date(measure_datetime),
				measure_type: String(measure_type).toUpperCase(),
				customer_code,
			};

			const result = await this.smartMeterModel.createMeasurement(data);

			if (result) {
				res.status(200).send({ ...response, measure_uuid });
			} else {
				throw new BaseError("Erro ao cadastrar a medição.");
			}
		} catch (error) {
			next(error);
		}
	}

	async get(req: Request, res: Response, next: NextFunction) {
		const customerCode = req.params.customerCode;
		const measureType = req.query.measure_type as string;

		if (measureType) {
			if (validateMeasuretype(measureType) !== true) {
				return next(new IncorrectRequest("Tipo de medição não permitida", "INVALID_TYPE"));
			}
		} else {
			if (Object.keys(req.query).length > 0) {
				return next(new IncorrectRequest(`Parametro invalido: ${Object.keys(req.query).join(", ")}`, "INVALID_PARAMETER"));
			}
		}

		try {
			const result = await this.smartMeterModel.getAll(customerCode, measureType);
			if (result.length > 0) {
				const data = {
					customer_code: customerCode,
					measures: result,
				};
				res.status(200).send(data);
			} else {
				next(new NotFound("Nenhuma leitura encontrada", "MEASURES_NOT_FOUND"));
			}
		} catch (error) {
			next(error);
		}
	}
}
