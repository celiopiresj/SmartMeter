import { Request, Response, NextFunction } from "express";
import BaseError from "../errors/BaseError";

export default function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
	if (error instanceof BaseError) {
		error.sendResponse(res);
	} else {
		new BaseError().sendResponse(res);
	}
}
