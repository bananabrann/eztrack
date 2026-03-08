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
	project_id?: string;
}

export const toolsApi = {
	getAll: (params?: { status?: ToolStatus; project_id?: string }) => {
		const searchParams = new URLSearchParams();
		if (params?.status) searchParams.append("status", params.status);
		if (params?.project_id)
			searchParams.append("project_id", params.project_id);
		const qs = searchParams.toString();
		return apiFetch<{ data: Tool[] }>(`/tools${qs ? `?${qs}` : ""}`);
	},

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
