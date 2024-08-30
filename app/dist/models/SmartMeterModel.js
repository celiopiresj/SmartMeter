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
exports.SmartMeterModel = void 0;
const errors_1 = require("../errors");
class SmartMeterModel {
    constructor(connection) {
        this.connection = connection;
    }
    createMeasurement(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            INSERT INTO measurements (
                measure_uuid,
                image_url,
                measure_datetime,
                measure_type,
				measure_value,
                customer_code
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
            const values = [data.measure_uuid, data.image_url, data.measure_datetime, data.measure_type, data.measure_value, String(data.customer_code).toLowerCase()];
            try {
                const [result] = yield this.connection.execute(query, values);
                return result;
            }
            catch (error) {
                const mysqlError = error;
                throw new errors_1.MySQLDatabaseError(mysqlError.sqlMessage);
            }
        });
    }
    updateByUuid(measure_uuid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!measure_uuid) {
                    throw new errors_1.IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos", "INVALID_DATA");
                }
                const measureExist = yield this.checkReadingExistsByUuid(measure_uuid);
                if (!measureExist) {
                    throw new errors_1.NotFound("Leitura não encontrada ", "MEASURE_NOT_FOUND");
                }
                const fields = ["image_url", "measure_datetime", "measure_type", "has_confirmed", "customer_code"];
                const updateData = Object.fromEntries(fields.map((field) => [field, Reflect.get(data, field)]).filter(([_, value]) => value !== undefined && value !== null && value !== ""));
                if (Object.keys(updateData).length === 0) {
                    throw new errors_1.IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos", "INVALID_DATA");
                }
                const query = `
				UPDATE measurements
				SET
					${Object.keys(updateData)
                    .map((field) => `${field} = ?`)
                    .join(", ")}
				WHERE measure_uuid = ?
			`;
                const [result] = yield this.connection.execute(query, [...Object.values(updateData), measure_uuid]);
                return result;
            }
            catch (error) {
                const mysqlError = error;
                throw new errors_1.MySQLDatabaseError(mysqlError.sqlMessage);
            }
        });
    }
    getMeasurementsByCustomerCode(customer_code, measure_type) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `
			SELECT measure_uuid, measure_datetime, measure_type, has_confirmed, image_url
			FROM measurements
			WHERE customer_code = ?
        `;
            const values = [String(customer_code).toLowerCase()];
            if (measure_type) {
                query += " AND measure_type = ?";
                values.push(String(measure_type).toUpperCase());
            }
            try {
                const [result] = yield this.connection.execute(query, values);
                const updatedResult = result.map((row) => (Object.assign(Object.assign({}, row), { has_confirmed: row.has_confirmed === 1 })));
                return updatedResult;
            }
            catch (error) {
                const mysqlError = error;
                throw new errors_1.MySQLDatabaseError(mysqlError.sqlMessage);
            }
        });
    }
    getMeasurementsByUuid(measure_uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `
			SELECT measure_uuid, measure_datetime, measure_type, has_confirmed, image_url, customer_code
			FROM measurements
			WHERE measure_uuid = ?
        `;
            try {
                const [result] = yield this.connection.execute(query, [measure_uuid]);
                const updatedResult = result.map((row) => (Object.assign(Object.assign({}, row), { has_confirmed: row.has_confirmed === 1 })));
                return updatedResult;
            }
            catch (error) {
                const mysqlError = error;
                throw new errors_1.MySQLDatabaseError(mysqlError.sqlMessage);
            }
        });
    }
    checkReadingExistsByUuid(measure_uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `
			SELECT measure_uuid
			FROM measurements
			WHERE measure_uuid = ?
        `;
            try {
                const [result] = yield this.connection.execute(query, [measure_uuid]);
                return result.length > 0;
            }
            catch (error) {
                const mysqlError = error;
                throw new errors_1.MySQLDatabaseError(mysqlError.sqlMessage);
            }
        });
    }
    checkReadingExistsByTypeAndCustomeCode(measure_type, customer_code, measure_datetime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
				SELECT measure_type, measure_datetime
				FROM measurements
				WHERE MONTH(measure_datetime) = MONTH(?)
				AND YEAR(measure_datetime) = YEAR(?)
				AND measure_type = ?
				AND customer_code = ?
			`;
                const [result] = yield this.connection.execute(query, [measure_datetime, measure_datetime, measure_type, customer_code]);
                return result.length > 0;
            }
            catch (error) {
                const mysqlError = error;
                throw new errors_1.MySQLDatabaseError(mysqlError.sqlMessage);
            }
        });
    }
}
exports.SmartMeterModel = SmartMeterModel;
