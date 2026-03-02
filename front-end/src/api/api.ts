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
			Authorization: token ? `Bearer ${token}` : "",
			...options?.headers,
		},
	});

	// Guard for the response
	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || error.error || `API error: ${response.status}`);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json();
}
