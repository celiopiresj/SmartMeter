import { Request, Response, NextFunction } from "express";
import { BaseError, MySQLDatabaseError } from "../errors/";
import { GoogleGenerativeAIFetchError } from "@google/generative-ai";

export default function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
	if (error instanceof GoogleGenerativeAIFetchError) {
		if (error.status === 500) {
			new BaseError(`Erro ao gerar resposta, verifique a imagem passada. responseService: ${error.statusText}`, error.status, "GEMINI_PROCESSING_ERROR").sendResponse(res);
		} else {
			new BaseError(`responseService: ${error.statusText}`, error.status, "GEMINI_PROCESSING_ERROR").sendResponse(res);
		}
	} else if (error instanceof MySQLDatabaseError) {
		new BaseError().sendResponse(res);
	} else if (error instanceof BaseError) {
		error.sendResponse(res);
	} else {
		new BaseError().sendResponse(res);
	}

	console.error("Last-error:", error);
}
