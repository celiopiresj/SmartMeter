"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = __importDefault(require("./BaseError"));
class IncorrectRequest extends BaseError_1.default {
    constructor(message = "Um ou mais dados fornecidos estão incorretos.", error_code = "INVALID_DATA") {
        super(message, 400, error_code);
    }
}
exports.default = IncorrectRequest;
