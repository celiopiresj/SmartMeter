"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const errors_1 = require("../errors/");
const generative_ai_1 = require("@google/generative-ai");
function errorHandler(error, req, res, next) {
    if (error instanceof generative_ai_1.GoogleGenerativeAIFetchError) {
        if (error.status === 500) {
            new errors_1.BaseError(`Erro ao gerar resposta, verifique a imagem passada. responseService: ${error.statusText}`, error.status, "GEMINI_PROCESSING_ERROR").sendResponse(res);
        }
        else {
            new errors_1.BaseError(`responseService: ${error.statusText}`, error.status, "GEMINI_PROCESSING_ERROR").sendResponse(res);
        }
    }
    else if (error instanceof errors_1.MySQLDatabaseError) {
        new errors_1.BaseError().sendResponse(res);
    }
    else if (error instanceof errors_1.BaseError) {
        error.sendResponse(res);
    }
    else {
        new errors_1.BaseError().sendResponse(res);
    }
    console.error("Last-error:", error);
}
