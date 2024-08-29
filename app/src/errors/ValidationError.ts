import IncorrectRequest from "./IncorrectRequest";

interface ErrorDetail {
	message: string;
}

interface ValidationErrorDetails {
	errors: Record<string, ErrorDetail>;
}

export default class ValidationError extends IncorrectRequest {
	constructor(error: ValidationErrorDetails) {
		const messageError = Object.values(error.errors)
			.map((errorDetail) => errorDetail.message)
			.join("; ");
		super(`Os seguintes erros foram encontrados: ${messageError}`);
	}
}
