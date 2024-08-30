import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { IncorrectRequest, MySQLDatabaseError, NotFound } from "../errors";

interface Measurement {
	measure_uuid: string;
	image_url: string;
	measure_datetime: Date;
	measure_type: string;
	measure_value: number;
	customer_code: string;
}

interface MeasurementUpdate {
	measure_uuid?: string;
	image_url?: string;
	measure_datetime?: Date;
	has_confirmed?: boolean | number;
	measure_type?: string;
	measure_value?: number;
	customer_code?: string;
}

interface RowMeasurement extends RowDataPacket {
	measure_uuid: string;
	image_url: string;
	measure_datetime: Date;
	has_confirmed: boolean | number;
	measure_type: string;
	customer_code?: string;
}

export class SmartMeterModel {
	private connection: Pool;

	constructor(connection: Pool) {
		this.connection = connection;
	}

	async createMeasurement(data: Measurement): Promise<ResultSetHeader> {
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
			const [result] = await this.connection.execute<ResultSetHeader>(query, values);
			return result;
		} catch (error) {
			const mysqlError = error as any;
			throw new MySQLDatabaseError(mysqlError.sqlMessage);
		}
	}

	async updateByUuid(measure_uuid: string, data: MeasurementUpdate): Promise<ResultSetHeader> {
		try {
			if (!measure_uuid) {
				throw new IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos", "INVALID_DATA");
			}

			const measureExist = await this.checkReadingExistsByUuid(measure_uuid);

			if (!measureExist) {
				throw new NotFound("Leitura não encontrada ", "MEASURE_NOT_FOUND");
			}

			const fields = ["image_url", "measure_datetime", "measure_type", "has_confirmed", "customer_code"];

			const updateData = Object.fromEntries(fields.map((field) => [field, Reflect.get(data, field)]).filter(([_, value]) => value !== undefined && value !== null && value !== ""));

			if (Object.keys(updateData).length === 0) {
				throw new IncorrectRequest("Os dados fornecidos no corpo da requisição são inválidos", "INVALID_DATA");
			}

			const query = `
				UPDATE measurements
				SET
					${Object.keys(updateData)
						.map((field) => `${field} = ?`)
						.join(", ")}
				WHERE measure_uuid = ?
			`;

			const [result] = await this.connection.execute<ResultSetHeader>(query, [...Object.values(updateData), measure_uuid]);
			return result;
		} catch (error) {
			const mysqlError = error as any;
			throw new MySQLDatabaseError(mysqlError.sqlMessage);
		}
	}

	async getMeasurementsByCustomerCode(customer_code: string, measure_type?: string): Promise<RowMeasurement[]> {
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
			const [result] = await this.connection.execute<RowMeasurement[]>(query, values);

			const updatedResult = result.map((row) => ({
				...row,
				has_confirmed: row.has_confirmed === 1,
			}));
			return updatedResult;
		} catch (error) {
			const mysqlError = error as any;
			throw new MySQLDatabaseError(mysqlError.sqlMessage);
		}
	}

	async getMeasurementsByUuid(measure_uuid: string): Promise<RowMeasurement[]> {
		let query = `
			SELECT measure_uuid, measure_datetime, measure_type, has_confirmed, image_url, customer_code
			FROM measurements
			WHERE measure_uuid = ?
        `;

		try {
			const [result] = await this.connection.execute<RowMeasurement[]>(query, [measure_uuid]);

			const updatedResult = result.map((row) => ({
				...row,
				has_confirmed: row.has_confirmed === 1,
			}));
			return updatedResult;
		} catch (error) {
			const mysqlError = error as any;
			throw new MySQLDatabaseError(mysqlError.sqlMessage);
		}
	}

	async checkReadingExistsByUuid(measure_uuid: string): Promise<boolean> {
		let query = `
			SELECT measure_uuid
			FROM measurements
			WHERE measure_uuid = ?
        `;

		try {
			const [result] = await this.connection.execute<[RowDataPacket]>(query, [measure_uuid]);
			return result.length > 0;
		} catch (error) {
			const mysqlError = error as any;
			throw new MySQLDatabaseError(mysqlError.sqlMessage);
		}
	}

	async checkReadingExistsByTypeAndCustomeCode(measure_type: string, customer_code: string, measure_datetime: Date): Promise<boolean> {
		try {
			const query = `
				SELECT measure_type, measure_datetime
				FROM measurements
				WHERE MONTH(measure_datetime) = MONTH(?)
				AND YEAR(measure_datetime) = YEAR(?)
				AND measure_type = ?
				AND customer_code = ?
			`;

			const [result] = await this.connection.execute<RowDataPacket[]>(query, [measure_datetime, measure_datetime, measure_type, customer_code]);
			return result.length > 0;
		} catch (error) {
			const mysqlError = error as any;
			throw new MySQLDatabaseError(mysqlError.sqlMessage);
		}
	}
}
