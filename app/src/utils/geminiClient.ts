import { GoogleAIFileManager } from '@google/generative-ai/server';

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiApiUrl = process.env.GEMINI_API_URL;

export default async function geminiClient(endpoint: string, options: RequestInit) {
	const response = await fetch(`${geminiApiUrl}${endpoint}`, {
		...options,
		headers: {
			Authorization: `Bearer ${geminiApiKey}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
	}

	return response.json();
}
