"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var SmartMeterModel_1 = require("../models/SmartMeterModel");
var errors_1 = require("../errors");
var helpers_1 = require("../utils/helpers");
var uuid_1 = require("uuid");
var geminiClient_1 = require("../utils/geminiClient");
var SmartMeterController = /** @class */ (function () {
    function SmartMeterController(connection) {
        this.smartMeterModel = new SmartMeterModel_1.SmartMeterModel(connection);
    }
    SmartMeterController.prototype.validateRequestBody = function (req) {
        var data = req.body;
        var fields = {
            image: "O campo image deve ser estar em base64 e usar um dos seguintes tipos de imagem: png, jpeg, jpg, webp, heic ou heif.",
            customer_code: "O campo customer_code deve ser uma string.",
            measure_datetime: "O campo measure_datetime deve estar no formato: YYYY-MM-DDTHH:mm:ssZ.",
            measure_type: "O tipo fornecido no campo measure_type é inválido, os valores válidos são 'WATER' ou 'GAS'.",
        };
        var validationFunctions = {
            customer_code: function (value) { return typeof value === "string"; },
            image: function (value) { return (0, helpers_1.validateBase64)(value) && (0, helpers_1.validateImageType)(value); },
            measure_datetime: function (value) { return (0, helpers_1.isValidISODateTime)(value); },
            measure_type: function (value) { return (0, helpers_1.validateMeasuretype)(value); },
        };
        for (var _i = 0, _a = Object.keys(fields); _i < _a.length; _i++) {
            var field = _a[_i];
            if (!Object.prototype.hasOwnProperty.call(data, field)) {
                return new errors_1.IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos.", "INVALID_DATA");
            }
            else {
                var errorMessage = fields[field];
                var value = Reflect.get(data, field);
                if (validationFunctions[field] ? validationFunctions[field](value) : value) {
                    continue;
                }
                return new errors_1.IncorrectRequest(errorMessage, "INVALID_DATA");
            }
        }
        return null;
    };
    SmartMeterController.prototype.upload = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, image, customer_code, measure_datetime, measure_type, validationError, measureExist, image_type, path, response, measure_uuid, data, result, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, image = _a.image, customer_code = _a.customer_code, measure_datetime = _a.measure_datetime, measure_type = _a.measure_type;
                        validationError = this.validateRequestBody(req);
                        if (validationError) {
                            return [2 /*return*/, next(validationError)];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.smartMeterModel.checkReadingExistsByTypeAndCustomeCode(String(measure_type).toUpperCase(), String(customer_code).toLowerCase(), new Date(measure_datetime))];
                    case 2:
                        measureExist = _b.sent();
                        if (measureExist) {
                            return [2 /*return*/, next(new errors_1.ConflictError("Leitura do mês já realizada.", "DOUBLE_REPORT"))];
                        }
                        image_type = (0, helpers_1.getImageType)(image);
                        if (typeof image_type !== "string") {
                            return [2 /*return*/, next(new errors_1.ConflictError("O campo image deve ser estar em base64 e usar um dos seguintes tipos de imagem: png, jpeg, jpg, webp, heic ou heif.", "INVALID_DATA"))];
                        }
                        return [4 /*yield*/, (0, helpers_1.saveImage)(image, image_type)];
                    case 3:
                        path = _b.sent();
                        return [4 /*yield*/, (0, geminiClient_1.uploadFile)(path, image_type)];
                    case 4:
                        response = _b.sent();
                        measure_uuid = (0, uuid_1.v4)();
                        data = {
                            measure_uuid: measure_uuid,
                            image_url: response.image_url,
                            measure_datetime: new Date(measure_datetime),
                            measure_type: String(measure_type).toUpperCase(),
                            measure_value: Number(response.measure_value),
                            customer_code: customer_code,
                        };
                        return [4 /*yield*/, this.smartMeterModel.createMeasurement(data)];
                    case 5:
                        result = _b.sent();
                        if (result.affectedRows > 0) {
                            res.status(200).json(__assign(__assign({}, response), { measure_uuid: measure_uuid }));
                        }
                        else {
                            throw new errors_1.BaseError("Erro ao cadastrar a medição.");
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _b.sent();
                        next(error_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SmartMeterController.prototype.confirm = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, measure_uuid, confirmed_value, measureExist, data, result, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, measure_uuid = _a.measure_uuid, confirmed_value = _a.confirmed_value;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        if (!measure_uuid || !confirmed_value) {
                            return [2 /*return*/, next(new errors_1.IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos.", "INVALID_DATA"))];
                        }
                        if (typeof measure_uuid !== "string") {
                            return [2 /*return*/, next(new errors_1.IncorrectRequest("O valor  do campo measure_uuid deve ser uma string", "INVALID_DATA"))];
                        }
                        if (!Number.isInteger(confirmed_value)) {
                            return [2 /*return*/, next(new errors_1.IncorrectRequest("O valor para confirmação deve ser um número inteiro.", "INVALID_DATA"))];
                        }
                        return [4 /*yield*/, this.smartMeterModel.getMeasurementsByUuid(measure_uuid)];
                    case 2:
                        measureExist = _b.sent();
                        console.log(measureExist);
                        if (measureExist.length === 0) {
                            return [2 /*return*/, next(new errors_1.NotFound("Leitura não encontrada.", "MEASURE_NOT_FOUND"))];
                        }
                        if (measureExist[0].has_confirmed) {
                            return [2 /*return*/, next(new errors_1.NotFound("Leitura do mês já confirmada.", "CONFIRMATION_DUPLICATE"))];
                        }
                        data = {
                            measure_value: confirmed_value,
                            has_confirmed: true,
                        };
                        return [4 /*yield*/, this.smartMeterModel.updateByUuid(measure_uuid, data)];
                    case 3:
                        result = _b.sent();
                        if (result.affectedRows > 0) {
                            res.status(200).json({ success: true });
                        }
                        else {
                            throw new errors_1.BaseError("Erro ao confirmar a medição.");
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        next(error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SmartMeterController.prototype.get = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var customer_code, measure_type, result, data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customer_code = req.params.customer_code;
                        measure_type = req.query.measure_type;
                        if (measure_type) {
                            if ((0, helpers_1.validateMeasuretype)(measure_type) !== true) {
                                return [2 /*return*/, next(new errors_1.IncorrectRequest("Tipo de medição não permitida.", "INVALID_TYPE"))];
                            }
                        }
                        else {
                            if (Object.keys(req.query).length > 0) {
                                return [2 /*return*/, next(new errors_1.IncorrectRequest("Parametro invalido: ".concat(Object.keys(req.query).join(", ")), "INVALID_PARAMETER"))];
                            }
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.smartMeterModel.getMeasurementsByCustomerCode(customer_code, measure_type)];
                    case 2:
                        result = _a.sent();
                        if (result.length > 0) {
                            data = {
                                customer_code: customer_code,
                                measures: result,
                            };
                            res.status(200).json(data);
                        }
                        else {
                            next(new errors_1.NotFound("Nenhuma leitura encontrada", "MEASURES_NOT_FOUND"));
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        next(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return SmartMeterController;
}());
exports.default = SmartMeterController;
