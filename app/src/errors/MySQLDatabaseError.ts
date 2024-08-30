import BaseError from "./BaseError";

export default class MySQLDatabaseError extends BaseError {
	constructor(message = "Erro no banco de dados") {
		super(message, 500, "MYSQL_ERROR");
	}
}
