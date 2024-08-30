"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var database_1 = __importDefault(require("../database/database"));
var SmartMeterController_1 = __importDefault(require("../controllers/SmartMeterController"));
var smartMeterController = new SmartMeterController_1.default(database_1.default);
var routes = (0, express_1.Router)();
routes.route("/upload").post(smartMeterController.upload.bind(smartMeterController));
routes.route("/:customer_code/list").get(smartMeterController.get.bind(smartMeterController));
routes.route("/confirm").put(smartMeterController.confirm.bind(smartMeterController));
exports.default = routes;
