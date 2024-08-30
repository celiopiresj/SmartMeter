"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseError extends Error {
    constructor(message = "Erro interno do servidor", status = 500, error_code = "UNKNOWN_ERROR") {
        super(message);
        this.message = message;
        this.status = status;
        this.error_code = error_code;
        this.name = this.constructor.name;
    }
    sendResponse(res) {
        return res.status(this.status).send({
            error_code: this.error_code,
            error_description: this.message,
        });
    }
}
exports.default = BaseError;
