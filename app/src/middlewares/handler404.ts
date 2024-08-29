import { Request, Response, NextFunction } from "express";
import NotFound from "../errors/NotFound";

function handler404(req: Request, res: Response, next: NextFunction) {
	const error404 = new NotFound();
	next(error404);
}

export default handler404;
