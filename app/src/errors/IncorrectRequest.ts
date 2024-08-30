import BaseError from "./BaseError";

export default class IncorrectRequest extends BaseError {
	constructor(message = "Um ou mais dados fornecidos estão incorretos.", error_code = "INVALID_DATA") {
		super(message, 400, error_code);
	}
}
