"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var NotFound_1 = __importDefault(require("../errors/NotFound"));
function handler404(req, res, next) {
    var error404 = new NotFound_1.default();
    next(error404);
}
exports.default = handler404;
