"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SmartMeterModel_1 = require("../models/SmartMeterModel");
const errors_1 = require("../errors");
const helpers_1 = require("../utils/helpers");
const uuid_1 = require("uuid");
const geminiClient_1 = require("../utils/geminiClient");
class SmartMeterController {
    constructor(connection) {
        this.smartMeterModel = new SmartMeterModel_1.SmartMeterModel(connection);
    }
    validateRequestBody(req) {
        const data = req.body;
        const fields = {
            image: "O campo image deve ser estar em base64 e usar um dos seguintes tipos de imagem: png, jpeg, jpg, webp, heic ou heif.",
            customer_code: "O campo customer_code deve ser uma string.",
            measure_datetime: "O campo measure_datetime deve estar no formato: YYYY-MM-DDTHH:mm:ssZ.",
            measure_type: "O tipo fornecido no campo measure_type é inválido, os valores válidos são 'WATER' ou 'GAS'.",
        };
        const validationFunctions = {
            customer_code: (value) => typeof value === "string",
            image: (value) => (0, helpers_1.validateBase64)(value) && (0, helpers_1.validateImageType)(value),
            measure_datetime: (value) => (0, helpers_1.isValidISODateTime)(value),
            measure_type: (value) => (0, helpers_1.validateMeasuretype)(value),
        };
        for (const field of Object.keys(fields)) {
            if (!Object.prototype.hasOwnProperty.call(data, field)) {
                return new errors_1.IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos.", "INVALID_DATA");
            }
            else {
                const errorMessage = fields[field];
                const value = Reflect.get(data, field);
                if (validationFunctions[field] ? validationFunctions[field](value) : value) {
                    continue;
                }
                return new errors_1.IncorrectRequest(errorMessage, "INVALID_DATA");
            }
        }
        return null;
    }
    upload(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { image, customer_code, measure_datetime, measure_type } = req.body;
            const validationError = this.validateRequestBody(req);
            if (validationError) {
                return next(validationError);
            }
            try {
                const measureExist = yield this.smartMeterModel.checkReadingExistsByTypeAndCustomeCode(String(measure_type).toUpperCase(), String(customer_code).toLowerCase(), new Date(measure_datetime));
                if (measureExist) {
                    return next(new errors_1.ConflictError("Leitura do mês já realizada.", "DOUBLE_REPORT"));
                }
                const image_type = (0, helpers_1.getImageType)(image);
                if (typeof image_type !== "string") {
                    return next(new errors_1.ConflictError("O campo image deve ser estar em base64 e usar um dos seguintes tipos de imagem: png, jpeg, jpg, webp, heic ou heif.", "INVALID_DATA"));
                }
                const path = yield (0, helpers_1.saveImage)(image, image_type);
                const response = yield (0, geminiClient_1.uploadFile)(path, image_type);
                const measure_uuid = (0, uuid_1.v4)();
                const data = {
                    measure_uuid,
                    image_url: response.image_url,
                    measure_datetime: new Date(measure_datetime),
                    measure_type: String(measure_type).toUpperCase(),
                    measure_value: Number(response.measure_value),
                    customer_code,
                };
                const result = yield this.smartMeterModel.createMeasurement(data);
                if (result.affectedRows > 0) {
                    res.status(200).json(Object.assign(Object.assign({}, response), { measure_uuid }));
                }
                else {
                    throw new errors_1.BaseError("Erro ao cadastrar a medição.");
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    confirm(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { measure_uuid, confirmed_value } = req.body;
            try {
                if (!measure_uuid || !confirmed_value) {
                    return next(new errors_1.IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos.", "INVALID_DATA"));
                }
                if (typeof measure_uuid !== "string") {
                    return next(new errors_1.IncorrectRequest("O valor  do campo measure_uuid deve ser uma string", "INVALID_DATA"));
                }
                if (!Number.isInteger(confirmed_value)) {
                    return next(new errors_1.IncorrectRequest("O valor para confirmação deve ser um número inteiro.", "INVALID_DATA"));
                }
                const measureExist = yield this.smartMeterModel.getMeasurementsByUuid(measure_uuid);
                if (measureExist.length === 0) {
                    return next(new errors_1.NotFound("Leitura não encontrada.", "MEASURE_NOT_FOUND"));
                }
                if (measureExist[0].has_confirmed) {
                    return next(new errors_1.NotFound("Leitura do mês já confirmada.", "CONFIRMATION_DUPLICATE"));
                }
                const data = {
                    measure_value: confirmed_value,
                    has_confirmed: true,
                };
                const result = yield this.smartMeterModel.updateByUuid(measure_uuid, data);
                if (result.affectedRows > 0) {
                    res.status(200).json({ success: true });
                }
                else {
                    throw new errors_1.BaseError("Erro ao confirmar a medição.");
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { customer_code } = req.params;
            const { measure_type } = req.query;
            if (measure_type) {
                if ((0, helpers_1.validateMeasuretype)(measure_type) !== true) {
                    return next(new errors_1.IncorrectRequest("Tipo de medição não permitida.", "INVALID_TYPE"));
                }
            }
            else {
                if (Object.keys(req.query).length > 0) {
                    return next(new errors_1.IncorrectRequest(`Parametro invalido: ${Object.keys(req.query).join(", ")}`, "INVALID_PARAMETER"));
                }
            }
            try {
                const result = yield this.smartMeterModel.getMeasurementsByCustomerCode(customer_code, measure_type);
                if (result.length > 0) {
                    const data = {
                        customer_code,
                        measures: result,
                    };
                    res.status(200).json(data);
                }
                else {
                    next(new errors_1.NotFound("Nenhuma leitura encontrada", "MEASURES_NOT_FOUND"));
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = SmartMeterController;
