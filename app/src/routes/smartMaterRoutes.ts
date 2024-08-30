import { Router, Request, Response } from "express";
import SmartMeterController from "../controllers/SmartMeterController";

const smartMeterController = new SmartMeterController();
const routes = Router();

routes.route("/upload").post(smartMeterController.upload.bind(smartMeterController));
routes.route("/:customer_code/list").get(smartMeterController.get.bind(smartMeterController));
routes.route("/confirm").put(smartMeterController.confirm.bind(smartMeterController));

export default routes;
