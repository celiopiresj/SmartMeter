"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler404 = exports.errorHandler = void 0;
var errorHandler_1 = __importDefault(require("./errorHandler"));
exports.errorHandler = errorHandler_1.default;
var handler404_1 = __importDefault(require("./handler404"));
exports.handler404 = handler404_1.default;
