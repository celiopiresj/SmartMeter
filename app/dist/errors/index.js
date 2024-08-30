"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLDatabaseError = exports.NotFound = exports.IncorrectRequest = exports.ConflictError = exports.BaseError = void 0;
// Importa as classes dos módulos
var BaseError_1 = __importDefault(require("./BaseError"));
exports.BaseError = BaseError_1.default;
var ConflictError_1 = __importDefault(require("./ConflictError"));
exports.ConflictError = ConflictError_1.default;
var IncorrectRequest_1 = __importDefault(require("./IncorrectRequest"));
exports.IncorrectRequest = IncorrectRequest_1.default;
var NotFound_1 = __importDefault(require("./NotFound"));
exports.NotFound = NotFound_1.default;
var MySQLDatabaseError_1 = __importDefault(require("./MySQLDatabaseError"));
exports.MySQLDatabaseError = MySQLDatabaseError_1.default;
