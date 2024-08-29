import { Request, Response, NextFunction } from "express";
import connection from "../database/database";
import SmartMeterModel from "../models/SmartMeterModel";
import { IncorrectRequest, NotFound } from "../errors";
import { validateBase64, validateMeasuretype } from "../utils/helpers";

export default class SmartMeterController {
	private smartMeterModel: SmartMeterModel;

	constructor() {
		this.smartMeterModel = new SmartMeterModel(connection);
	}

	async upload(req: Request, res: Response, next: NextFunction) {
		const { image, customer_code, measure_datetime, measure_type } = req.body;

		if (!image || !customer_code || !measure_datetime || !measure_type) {
			next(new IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos", "INVALID_DATA"));
		}

		if (!validateBase64(image)) {
			next(new IncorrectRequest("O campo image deve ser estar em base64.", "INVALID_DATA"));
		}

		if (typeof customer_code !== "string") {
			next(new IncorrectRequest("O campo customer_code deve ser uma string.", "INVALID_DATA"));
		}

		const resultValidateMeasuretype = validateMeasuretype(measure_type);

		if (resultValidateMeasuretype instanceof IncorrectRequest) {
			next(resultValidateMeasuretype);
		}
	}
}
