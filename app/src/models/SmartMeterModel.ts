import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { MySQLDatabaseError } from "../errors";

interface Measurement {
	measure_uuid: string;
	image_url: string;
	measure_datetime: Date;
	has_confirmed?: boolean | number;
	measure_type: string;
	customer_code?: string;
}

interface RowMeasurement extends RowDataPacket {
	measure_uuid: string;
	image_url: string;
	measure_datetime: Date;
	has_confirmed?: boolean | number;
	measure_type: string;
	customer_code?: string;
}

export default class SmartMeterModel {
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
                customer_code
            ) VALUES (?, ?, ?, ?, ?)
        `;

		const values = [data.measure_uuid, data.image_url, data.measure_datetime, data.measure_type, , String(data.customer_code).toLowerCase()];

		try {
			const [result] = await this.connection.execute<ResultSetHeader>(query, values);
			return result;
		} catch (error) {
			const mysqlError = error as any;
			throw new MySQLDatabaseError(mysqlError.sqlMessage);
		}
	}

	async getAll(customerCode: string, measureType?: string): Promise<RowMeasurement[]> {
		let query = `
			SELECT measure_uuid, measure_datetime, measure_type, has_confirmed, image_url
			FROM measurements
			WHERE customer_code = ?
        `;

		const values = [String(customerCode).toLowerCase()];

		if (measureType) {
			query += " AND measure_type = ?";
			values.push(String(measureType).toUpperCase());
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
}
