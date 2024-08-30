import { Router, Request, Response } from "express";
import connection from "../database/database";
import SmartMeterController from "../controllers/SmartMeterController";

const smartMeterController = new SmartMeterController(connection);
const routes = Router();

routes.route("/upload").post(smartMeterController.upload.bind(smartMeterController));
routes.route("/:customer_code/list").get(smartMeterController.get.bind(smartMeterController));
routes.route("/confirm").put(smartMeterController.confirm.bind(smartMeterController));

export default routes;
