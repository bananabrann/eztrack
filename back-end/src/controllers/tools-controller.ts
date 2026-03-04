import { Request, Response } from "express";
import { createSupabaseUserClient } from "../config/supabase";
import { Database, Constants } from "../types/database.types";

export type Tool = Database["public"]["Tables"]["tools"]["Row"];
export type ToolManagement =
	Database["public"]["Tables"]["tool_management"]["Row"];
export type ToolStatus = Database["public"]["Enums"]["tool_status"];

export const TOOL_STATUS = {
	AVAILABLE: "AVAILABLE",
	CHECKEDOUT: "CHECKEDOUT",
	ARCHIVE: "ARCHIVE",
} as const satisfies Record<string, ToolStatus>;

// Use the array directly from database types
export const TOOL_STATUS_VALUES = Constants.public.Enums.tool_status;

// Request type definitions
type GetToolsRequest = Request<{}, {}, {}, { status?: string }>;
type CreateToolRequest = Request<{}, {}, { name: string; status?: ToolStatus }>;
type UpdateToolRequest = Request<
	{ id: string },
	{},
	{ name?: string; status?: ToolStatus }
>;
type DeleteToolRequest = Request<{ id: string }>;
type CheckOutToolRequest = Request<{ id: string }>;
type ReturnToolRequest = Request<{ id: string }>;

/**
 * Helper function to get the user-scoped Supabase client
 */
function getSupabaseClient(req: Request) {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		throw new Error("No authorization token provided");
	}
	return createSupabaseUserClient(token);
}

/**
 * Tools Controller including the tools management
 */
export default class ToolsController {
	/**
	 * GET /api/tools
	 * Get all tools with optional status filtering
	 */
	static async get(req: GetToolsRequest, res: Response): Promise<void> {
		try {
			const { status } = ToolsController._validateGetRequest(req);
			const token = req.headers.authorization?.split(" ")[1];
			if (!token) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}
			// Get user-scoped Supabase client
			const supabaseClient = getSupabaseClient(req);

			// Start building the query to select all tools
			let query = supabaseClient.from("tools").select("*");

			if (status) {
				query = query.eq("status", status);
			}

			const { data, error } = await query.order("created_at", {
				ascending: false,
			});

			if (error) throw error;

			// Transform data to include checked_out_by info
			const checkedOutInfo = data?.map(tool => {
				const activeCheckout = tool.tool_management?.find(
					(tm: any) => tm.checked_in === null,
				);
				return {
					...tool,
					checked_out_by: activeCheckout?.accounts?.name || null,
					tool_management: undefined,
				};
			});

			res.status(200).json({
				message: "Tools retrieved successfully",
				data: checkedOutInfo || [],
			});
		} catch (error) {
			console.error("Get tools error:", error);
			res.status(500).json({ error: "Failed to fetch tools" });
		}
	}
	/**
	 * POST /api/tools
	 * Create a new tool
	 */
	static async post(req: CreateToolRequest, res: Response): Promise<void> {
		try {
			const validation = ToolsController._validatePostRequest(req);
			const { name, status } = validation;
			const token = req.headers.authorization?.split(" ")[1];
			if (!token) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}

			// Get user-scoped Supabase client
			const supabaseClient = getSupabaseClient(req);

			// Insert new tool data into the database and return the inserted record
			const { data, error } = await supabaseClient
				.from("tools")
				.insert([{ name: name.trim(), status }])
				.select();

			if (error) throw error;

			res.status(201).json({
				message: "Tool created successfully",
				data: data[0],
			});
		} catch (error: any) {
			console.error("Create tool error:", error);
			if (error.message?.includes("Validation")) {
				res.status(400).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Failed to create tool" });
			}
		}
	}

	/**
	 * PATCH /api/tools/:id
	 * Update a tool
	 */
	static async patch(req: UpdateToolRequest, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const validation = ToolsController._validatePatchRequest(req);
			const token = req.headers.authorization?.split(" ")[1];
			if (!token) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}

			// Get user-scoped Supabase client
			const supabaseClient = getSupabaseClient(req);

			// Query the database to check if the tool with the given ID exists
			const { data: existingTool, error: fetchError } = await supabaseClient

				.from("tools")
				.select("*")
				.eq("id", id)
				.single();

			if (fetchError || !existingTool) {
				res.status(404).json({ error: "Tool not found" });
				return;
			}

			const updateData: Partial<Tool> = {};
			if (validation.name !== undefined) updateData.name = validation.name;
			if (validation.status !== undefined)
				updateData.status = validation.status;

			const { data, error } = await supabase
				.from("tools")
				.update(updateData)
				.eq("id", id)
				.select();

			if (error) throw error;

			res.status(200).json({
				message: "Tool updated successfully",
				data: data[0],
			});
		} catch (error: any) {
			console.error("Update tool error:", error);
			if (error.message?.includes("Validation")) {
				res.status(400).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Failed to update tool" });
			}
		}
	}

	/**
	 * DELETE /api/tools/:id
	 * Soft delete a tool (prevent if checked out)
	 * This is archiving the tools
	 */
	static async delete(req: DeleteToolRequest, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const token = req.headers.authorization?.split(" ")[1];
			if (!token) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}

			// Get user-scoped Supabase client
			const supabaseClient = getSupabaseClient(req);

			// Query the database to fetch the tool with the given ID
			const { data: tool, error: fetchError } = await supabaseClient

				.from("tools")
				.select("*")
				.eq("id", id)
				.single();

			if (fetchError || !tool) {
				res.status(404).json({ error: "Tool not found" });
				return;
			}

			if (tool.status === TOOL_STATUS.CHECKEDOUT) {
				res.status(400).json({
					error: "Cannot delete tool that is currently checked out",
				});
				return;
			}

			const { error: deleteError } = await supabase
				.from("tools")
				.update({ status: TOOL_STATUS.ARCHIVE })
				.eq("id", id);

			if (deleteError) {
				throw deleteError;
			}

			res.status(200).json({ message: "Tool deleted successfully" });
		} catch (error) {
			console.error("Delete tool error:", error);
			res.status(500).json({ error: "Failed to delete tool" });
		}
	}

	/**
	 * POST /api/tools/:id/checkout
	 * Check out a tool
	 */
	static async checkout(
		req: CheckOutToolRequest,
		res: Response,
	): Promise<void> {
		try {
			const { id } = req.params;
			const userId = req.authUser?.id;
			const token = req.headers.authorization?.split(" ")[1];

			if (!userId || !token) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}

			// Get user-scoped Supabase client
			const supabaseClient = getSupabaseClient(req);

			// Query the database to fetch the tool with the given ID
			const { data: tool, error: fetchError } = await supabaseClient

				.from("tools")
				.select("*")
				.eq("id", id)
				.single();

			if (fetchError || !tool) {
				res.status(404).json({ error: "Tool not found" });
				return;
			}

			if (tool.status !== TOOL_STATUS.AVAILABLE) {
				res.status(400).json({
					error: "Tool is not available for checkout",
				});
				return;
			}

			const { data: existingCheckout, error: existingError } = await supabase
				.from("tool_management")
				.select("*")
				.eq("tool_id", id)
				.eq("user_id", userId)
				.is("checked_in", null)
				.maybeSingle();

			if (existingError) throw existingError;

			if (existingCheckout) {
				res.status(400).json({
					error:
						"You already have this tool checked out. Return it first to checkout again.",
				});
				return;
			}

			const checkedOutDate = new Date().toISOString();

			const { error: updateError } = await supabase
				.from("tools")
				.update({ status: TOOL_STATUS.CHECKEDOUT })
				.eq("id", id);

			if (updateError) throw updateError;

			const { data: toolManagement, error: managementError } = await supabase
				.from("tool_management")
				.insert([
					{
						tool_id: id,
						user_id: userId,
						checked_out: checkedOutDate,
						checked_in: null,
					},
				])
				.select();

			if (managementError) throw managementError;

			res.status(200).json({
				message: "Tool checked out successfully",
				data: {
					toolId: id,
					checkoutId: toolManagement[0].id,
					checkedOut: checkedOutDate,
				},
			});
		} catch (error) {
			console.error("Checkout tool error:", error);
			res.status(500).json({ error: "Failed to checkout tool" });
		}
	}

	/**
	 * POST /api/tools/:id/return
	 * Return a checked out tool
	 */
	static async return(req: ReturnToolRequest, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const userId = req.authUser?.id;
			const token = req.headers.authorization?.split(" ")[1];

			if (!userId || !token) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}

			// Get user-scoped Supabase client
			const supabaseClient = getSupabaseClient(req);

			// Query the database to fetch the tool with the given ID
			const { data: tool, error: fetchError } = await supabaseClient

				.from("tools")
				.select("*")
				.eq("id", id)
				.single();

			if (fetchError || !tool) {
				res.status(404).json({ error: "Tool not found" });
				return;
			}

			const { data: checkoutRecord, error: checkoutError } = await supabase
				.from("tool_management")
				.select("*")
				.eq("tool_id", id)
				.eq("user_id", userId)
				.is("checked_in", null)
				.single();

			if (checkoutError || !checkoutRecord) {
				res.status(404).json({
					error: "No active checkout found for this tool",
				});
				return;
			}

			if (checkoutRecord.user_id !== userId) {
				res.status(403).json({
					error: "Only the user who checked out the tool can return it",
				});
				return;
			}

			const checkedInDate = new Date().toISOString();

			const { error: updateError } = await supabase
				.from("tools")
				.update({ status: TOOL_STATUS.AVAILABLE })
				.eq("id", id);

			if (updateError) throw updateError;

			const { error: managementError } = await supabase
				.from("tool_management")
				.update({ checked_in: checkedInDate })
				.eq("id", checkoutRecord.id)
				.select();

			if (managementError) throw managementError;

			res.status(200).json({
				message: "Tool returned successfully",
				data: {
					toolId: id,
					checkoutId: checkoutRecord.id,
					checkedIn: checkedInDate,
				},
			});
		} catch (error) {
			console.error("Return tool error:", error);
			res.status(500).json({ error: "Failed to return tool" });
		}
	}
	/**
	 * Validation for GET method
	 */
	private static _validateGetRequest(req: GetToolsRequest) {
		const { status } = req.query;

		if (status && !TOOL_STATUS_VALUES.includes(status as ToolStatus)) {
			throw new Error(
				`Validation: Invalid status filter. Must be one of: ${TOOL_STATUS_VALUES.join(", ")}`,
			);
		}

		return { status: status as string | undefined };
	}

	/**
	 * Validation for POST method
	 */
	private static _validatePostRequest(req: CreateToolRequest) {
		const { name, status = TOOL_STATUS.AVAILABLE } = req.body;

		if (!name || typeof name !== "string" || name.trim() === "") {
			throw new Error(
				"Validation: Name is required and must be a non-empty string",
			);
		}

		if (!TOOL_STATUS_VALUES.includes(status)) {
			throw new Error(
				`Validation: Status must be one of: ${TOOL_STATUS_VALUES.join(", ")}`,
			);
		}

		return { name: name.trim(), status };
	}

	/**
	 * Validation for PATCH
	 */
	private static _validatePatchRequest(req: UpdateToolRequest) {
		const { name, status } = req.body;

		if (name !== undefined) {
			if (typeof name !== "string" || name.trim() === "") {
				throw new Error("Validation: Name must be a non-empty string");
			}
		}

		if (status !== undefined) {
			if (!TOOL_STATUS_VALUES.includes(status)) {
				throw new Error(
					`Validation: Status must be one of: ${TOOL_STATUS_VALUES.join(", ")}`,
				);
			}
		}

		return { name, status };
	}
}
