"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = __importDefault(require("./BaseError"));
class MySQLDatabaseError extends BaseError_1.default {
    constructor(message = "Erro no banco de dados") {
        super(message, 500, "MYSQL_ERROR");
    }
}
exports.default = MySQLDatabaseError;
