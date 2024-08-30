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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartMeterModel = void 0;
var errors_1 = require("../errors");
var SmartMeterModel = /** @class */ (function () {
    function SmartMeterModel(connection) {
        this.connection = connection;
    }
    SmartMeterModel.prototype.createMeasurement = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var query, values, result, error_1, mysqlError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            INSERT INTO measurements (\n                measure_uuid,\n                image_url,\n                measure_datetime,\n                measure_type,\n\t\t\t\tmeasure_value,\n                customer_code\n            ) VALUES (?, ?, ?, ?, ?, ?)\n        ";
                        values = [data.measure_uuid, data.image_url, data.measure_datetime, data.measure_type, data.measure_value, String(data.customer_code).toLowerCase()];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute(query, values)];
                    case 2:
                        result = (_a.sent())[0];
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _a.sent();
                        mysqlError = error_1;
                        throw new errors_1.MySQLDatabaseError(mysqlError.sqlMessage);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartMeterModel.prototype.updateByUuid = function (measure_uuid, data) {
        return __awaiter(this, void 0, void 0, function () {
            var measureExist, fields, updateData, query, result, error_2, mysqlError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!measure_uuid) {
                            throw new errors_1.IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos", "INVALID_DATA");
                        }
                        return [4 /*yield*/, this.checkReadingExistsByUuid(measure_uuid)];
                    case 1:
                        measureExist = _a.sent();
                        if (!measureExist) {
                            throw new errors_1.NotFound("Leitura não encontrada ", "MEASURE_NOT_FOUND");
                        }
                        fields = ["image_url", "measure_datetime", "measure_type", "has_confirmed", "customer_code"];
                        updateData = Object.fromEntries(fields.map(function (field) { return [field, Reflect.get(data, field)]; }).filter(function (_a) {
                            var _ = _a[0], value = _a[1];
                            return value !== undefined && value !== null && value !== "";
                        }));
                        if (Object.keys(updateData).length === 0) {
                            throw new errors_1.IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos", "INVALID_DATA");
                        }
                        query = "\n\t\t\t\tUPDATE measurements\n\t\t\t\tSET\n\t\t\t\t\t".concat(Object.keys(updateData)
                            .map(function (field) { return "".concat(field, " = ?"); })
                            .join(", "), "\n\t\t\t\tWHERE measure_uuid = ?\n\t\t\t");
                        return [4 /*yield*/, this.connection.execute(query, __spreadArray(__spreadArray([], Object.values(updateData), true), [measure_uuid], false))];
                    case 2:
                        result = (_a.sent())[0];
                        return [2 /*return*/, result];
                    case 3:
                        error_2 = _a.sent();
                        mysqlError = error_2;
                        throw new errors_1.MySQLDatabaseError(mysqlError.sqlMessage);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartMeterModel.prototype.getMeasurementsByCustomerCode = function (customer_code, measure_type) {
        return __awaiter(this, void 0, void 0, function () {
            var query, values, result, updatedResult, error_3, mysqlError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n\t\t\tSELECT measure_uuid, measure_datetime, measure_type, has_confirmed, image_url\n\t\t\tFROM measurements\n\t\t\tWHERE customer_code = ?\n        ";
                        values = [String(customer_code).toLowerCase()];
                        if (measure_type) {
                            query += " AND measure_type = ?";
                            values.push(String(measure_type).toUpperCase());
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute(query, values)];
                    case 2:
                        result = (_a.sent())[0];
                        updatedResult = result.map(function (row) { return (__assign(__assign({}, row), { has_confirmed: row.has_confirmed === 1 })); });
                        return [2 /*return*/, updatedResult];
                    case 3:
                        error_3 = _a.sent();
                        mysqlError = error_3;
                        throw new errors_1.MySQLDatabaseError(mysqlError.sqlMessage);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartMeterModel.prototype.getMeasurementsByUuid = function (measure_uuid) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, updatedResult, error_4, mysqlError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n\t\t\tSELECT measure_uuid, measure_datetime, measure_type, has_confirmed, image_url, customer_code\n\t\t\tFROM measurements\n\t\t\tWHERE measure_uuid = ?\n        ";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute(query, [measure_uuid])];
                    case 2:
                        result = (_a.sent())[0];
                        updatedResult = result.map(function (row) { return (__assign(__assign({}, row), { has_confirmed: row.has_confirmed === 1 })); });
                        return [2 /*return*/, updatedResult];
                    case 3:
                        error_4 = _a.sent();
                        mysqlError = error_4;
                        throw new errors_1.MySQLDatabaseError(mysqlError.sqlMessage);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartMeterModel.prototype.checkReadingExistsByUuid = function (measure_uuid) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_5, mysqlError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n\t\t\tSELECT measure_uuid\n\t\t\tFROM measurements\n\t\t\tWHERE measure_uuid = ?\n        ";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute(query, [measure_uuid])];
                    case 2:
                        result = (_a.sent())[0];
                        return [2 /*return*/, result.length > 0];
                    case 3:
                        error_5 = _a.sent();
                        mysqlError = error_5;
                        throw new errors_1.MySQLDatabaseError(mysqlError.sqlMessage);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartMeterModel.prototype.checkReadingExistsByTypeAndCustomeCode = function (measure_type, customer_code, measure_datetime) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_6, mysqlError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n\t\t\t\tSELECT measure_type, measure_datetime\n\t\t\t\tFROM measurements\n\t\t\t\tWHERE MONTH(measure_datetime) = MONTH(?)\n\t\t\t\tAND YEAR(measure_datetime) = YEAR(?)\n\t\t\t\tAND measure_type = ?\n\t\t\t\tAND customer_code = ?\n\t\t\t";
                        return [4 /*yield*/, this.connection.execute(query, [measure_datetime, measure_datetime, measure_type, customer_code])];
                    case 1:
                        result = (_a.sent())[0];
                        return [2 /*return*/, result.length > 0];
                    case 2:
                        error_6 = _a.sent();
                        mysqlError = error_6;
                        throw new errors_1.MySQLDatabaseError(mysqlError.sqlMessage);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SmartMeterModel;
}());
exports.SmartMeterModel = SmartMeterModel;
