import { getAccessToken } from "../features/auth/authApi";

const API_BASE = "/api";

export async function apiFetch<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<T> {
	// Get the token from Auth
	const token = await getAccessToken();

	const response = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options?.headers,
		},
	});

	// Guard for the response
	if (!response.ok) {
		const responseText = await response.text();
		let message = `API error: ${response.status}`;

		if (responseText) {
			try {
				const parsed = JSON.parse(responseText);
				message = parsed.message || parsed.error || message;
			} catch {
				message = responseText;
			}
		}

		throw new Error(message);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json();
}
