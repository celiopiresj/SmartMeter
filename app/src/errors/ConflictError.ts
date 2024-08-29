import BaseError from "./BaseError";

export default class ConflictError extends BaseError {
	constructor(message = "A solicitação não pôde ser processada devido a um conflito com o estado atual do recurso.", error_code = "CONFLICT") {
		super(message, 409, error_code);
	}
}
