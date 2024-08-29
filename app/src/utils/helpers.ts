import { IncorrectRequest } from "../errors";
import geminiClient from "./geminiClient";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export function validateMeasuretype(measure_type?: string): true | IncorrectRequest {
	const validTypes = ["WATER", "GAS"];

	if (typeof measure_type !== "string") {
		return new IncorrectRequest("O campo measure_type deve ser uma string.", "INVALID_DATA");
	}

	const normalizedMeasureType = measure_type.toUpperCase();

	if (!validTypes.includes(normalizedMeasureType)) {
		return new IncorrectRequest(`O tipo fornecido no campo measure_type é inválido: ${measure_type}. Os valores válidos são 'WATER' ou 'GAS'.`, "INVALID_DATA");
	}

	return true;
}

export function validateBase64(base64: string): boolean {
	const base64Regex = /^data:image\/(png|jpeg|jpg|webp);base64,[a-zA-Z0-9+/=]+$/;
	return base64Regex.test(base64);
}

export async function uploadToGemini(imageBase64: string) {
	const data = {};

	const response = await geminiClient("/media/upload", {
		method: "POST",
		body: JSON.stringify(data),
	});
}
