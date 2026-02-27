const API_BASE = "/api";

export async function apiFetch<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<T> {
	const token = localStorage.getItem("token");

	const response = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			Authorization: token ? `Bearer ${token}` : "",
			...options?.headers,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || `API error: ${response.status}`);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json();
}
