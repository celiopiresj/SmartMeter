import * as fs from "fs";
import * as path from "path";

export function validateMeasuretype(measure_type: string): boolean {
	const validTypes = ["WATER", "GAS"];

	const normalizedMeasureType = measure_type.toUpperCase();

	if (!validTypes.includes(normalizedMeasureType)) {
		return false;
	}

	return true;
}

export function validateBase64(base64: string): boolean {
	const base64Regex = /^data:image\/(png|jpeg|jpg|webp|heic|heif);base64,[a-zA-Z0-9+/=]+$/;
	return base64Regex.test(base64);
}

export function validateImageType(base64: string): boolean {
	const base64Regex = /^data:image\/(png|jpeg|jpg|webp|heic|heif);base64,[a-zA-Z0-9+/=]+$/;
	const match = base64.match(base64Regex);
	return match ? true : false;
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

console.log(dirname);

export function saveImage(base64: string, format: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const imageBase64 = removeBase64Prefix(base64);
		const buffer = Buffer.from(imageBase64, "base64");

		const imageDir = path.join(dirname, "..", "images");
		const filePath = path.join(imageDir, `image.${format}`);

		fs.mkdir(imageDir, { recursive: true }, (err) => {
			if (err) {
				reject(err);
				return;
			}

			fs.writeFile(filePath, buffer, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve(filePath);
				}
			});
		});
	});
}

export function isValidISODateTime(dateTimeStr: string): boolean {
	const date = new Date(dateTimeStr);
	return !isNaN(date.getTime());
}
