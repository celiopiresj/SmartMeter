"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = __importDefault(require("./BaseError"));
class ConflictError extends BaseError_1.default {
    constructor(message = "A solicitação não pôde ser processada devido a um conflito com o estado atual do recurso.", error_code = "CONFLICT") {
        super(message, 409, error_code);
    }
}
exports.default = ConflictError;
