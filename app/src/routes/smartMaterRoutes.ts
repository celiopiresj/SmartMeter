import { Router, Request, Response } from "express";
import SmartMeterController from "../controllers/SmartMeterController";

const smartMeterController = new SmartMeterController();
const routes = Router();

routes.route("/upload").post(smartMeterController.upload.bind(smartMeterController));
routes.route("/:customerCode/list").get(smartMeterController.get.bind(smartMeterController));

export default routes;
