Date.prototype.toISOString = function (): string {
	return (
		this.getFullYear() +
		"-" +
		String(this.getMonth() + 1).padStart(2, "0") +
		"-" +
		String(this.getDate()).padStart(2, "0") +
		" " +
		String(this.getHours()).padStart(2, "0") +
		":" +
		String(this.getMinutes()).padStart(2, "0") +
		":" +
		String(this.getSeconds()).padStart(2, "0") +
		"." +
		String(this.getMilliseconds()).padStart(3, "0")
	);
};

export default class DateConvert {
	static nowDate(): Date {
		const [day, month, year, hour, minute, second] = DateConvert.nowPtBR()
			.replace(",", "")
			.split(/[\/\s:]/);
		return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
	}

	static nowPtBR(): string {
		const date = new Date();
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			timeZone: "America/Sao_Paulo",
			hour12: false,
		};

		const formatter = new Intl.DateTimeFormat("pt-BR", options);
		return formatter.format(date);
	}

	/**
	 *
	 * @param {String} dateString - String de data dd/mm/aaaa
	 */
	static toDateFromPtBRString(dateString: string): Date {
		const [day, month, year] = dateString.split("/").map(Number);
		return new Date(year, month - 1, day);
	}

	/**
	 *
	 * @param {String} dateString - String de data aaaa-mm-dd
	 */
	static stringToDate(dateString: string): Date {
		const [year, month, day] = dateString.split("-").map(Number);
		return new Date(year, month - 1, day);
	}

	static toStringEnUS(date: Date): string {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			timeZone: "America/Sao_Paulo",
		};

		const formatter = new Intl.DateTimeFormat("pt-BR", options);
		const [day, month, year] = formatter.format(date).split("/");

		return `${year}-${month}-${day}`;
	}

	static toStringPtBR(date: Date): string {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			timeZone: "America/Sao_Paulo",
		};

		const formatter = new Intl.DateTimeFormat("pt-BR", options);
		return formatter.format(date);
	}
}
