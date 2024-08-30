import * as fs from "fs";
import * as path from "path";

import { IncorrectRequest } from "../errors";

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
	const base64Regex = /^data:image\/(png|jpeg|jpg|webp|heic|heif);base64,[a-zA-Z0-9+/=]+$/;
	return base64Regex.test(base64);
}

export function getImageType(base64: string): string | null {
	const base64Regex = /^data:image\/(png|jpeg|jpg|webp|heic|heif);base64,[a-zA-Z0-9+/=]+$/;
	const match = base64.match(base64Regex);
	return match ? match[1] : null;
}

export function removeBase64Prefix(imageBase64: string): string {
	const base64Prefix = /^data:image\/[a-zA-Z]+;base64,/;
	return imageBase64.replace(base64Prefix, "");
}

const dirname = __dirname;

export function saveImage(base64: string, format: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const imageBase64 = removeBase64Prefix(base64);
		const buffer = Buffer.from(imageBase64, "base64");

		const filePath = path.join(dirname, "..", "images", `image.${format}`);

		fs.writeFile(filePath, buffer, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(filePath);
			}
		});
	});
}

export function isValidISODateTime(dateTimeStr: string): boolean {
	const date = new Date(dateTimeStr);
	return !isNaN(date.getTime());
}
