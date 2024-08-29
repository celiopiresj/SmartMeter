import { Pool } from "mysql2/promise";

export default class SmartMeterModel {
	private connection: Pool;

	constructor(connection: Pool) {
		this.connection = connection;
	}
}
