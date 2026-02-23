export type ToolManagement = {
	id: string;
	toolId: string;
	userId: string;
	checkedOut: string;
	checkedIn: string | null;
};

export const toolManagement: ToolManagement[] = [];
