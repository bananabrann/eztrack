import { apiFetch } from "./api";

export type ToolStatus = "AVAILABLE" | "CHECKEDOUT" | "ARCHIVE";

export interface Tool {
	id: string;
	name: string;
	status: ToolStatus;
	created_at: string;
	checked_out_by?: string | null;
	checked_out_by_user_id?: string | null;
	checked_out_by_me?: boolean;
}

export const toolsApi = {
	getAll: (status?: ToolStatus) =>
		apiFetch<{ data: Tool[] }>(`/tools${status ? `?status=${status}` : ""}`),

	update: (toolId: string, payload: { name?: string; status?: ToolStatus }) =>
		apiFetch<{ data: Tool }>(`/tools/${toolId}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		}),

	checkout: (toolId: string) =>
		apiFetch(`/tools/${toolId}/checkout`, { method: "POST" }),

	return: (toolId: string) =>
		apiFetch(`/tools/${toolId}/return`, { method: "POST" }),
};
