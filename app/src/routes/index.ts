import express, { Express, Router, Request, Response } from "express";
import smartMaterRouters from "./smartMaterRoutes";

const routes = (app: Express) => {
	app.route("/").get((req: Request, res: Response) => res.status(200).send("Agua e Gás"));
	app.use(express.json({ limit: "50mb" }), smartMaterRouters);
};

export default routes;
