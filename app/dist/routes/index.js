"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const smartMaterRoutes_1 = __importDefault(require("./smartMaterRoutes"));
const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("Agua e Gás"));
    app.use(express_1.default.json({ limit: "50mb" }), smartMaterRoutes_1.default);
};
exports.default = routes;
