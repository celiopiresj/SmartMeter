import BaseError from "./BaseError";

export default class NotFound extends BaseError {
	constructor(message = "Não encontrado", error_code = "NOT_FOUND") {
		super(message, 404, error_code);
	}
}
