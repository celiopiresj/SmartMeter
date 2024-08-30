declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: string;
			DB_HOST: string;
			DB_USER: string;
			DB_PASSWORD: string;
			DB_NAME: string;
			DB_DATABASE: string;
			GEMINI_API_KEY: string;
			GEMINI_API_URL: string;
		}
	}
}

export {};
