import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
	res.json({ message: "hello world with Typescript" });
});

export default router;
