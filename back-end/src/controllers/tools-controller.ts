import { Request, Response } from "express";
import supabaseClient from "../config/supabase";

/**
 * Export the types and enums for tools
 */
export enum ToolStatus {
	AVAILABLE = "AVAILABLE",
	CHECKEDOUT = "CHECKEDOUT",
}

export interface Tool {
	id: string;
	name: string;
	status: ToolStatus;
	qty: number;
	created_at?: string;
}

export interface ToolManagement {
	id: string;
	tool_id: string;
	user_id: string;
	checked_out: string;
	checked_in: string;
	created_at?: string;
}

// Request type definitions
type GetToolsRequest = Request<{}, {}, {}, { status?: string }>;
type GetToolRequest = Request<{ id: string }>;
type CreateToolRequest = Request<
	{},
	{},
	{ name: string; qty: number; status?: ToolStatus }
>;
type UpdateToolRequest = Request<
	{ id: string },
	{},
	{ name?: string; qty?: number; status?: ToolStatus }
>;
type DeleteToolRequest = Request<{ id: string }>;
type CheckOutToolRequest = Request<{ id: string }>;
type ReturnToolRequest = Request<{ id: string }>;

/**
 * Tools Controller including the tools management
 */
export default class ToolsController {
	/**
	 * GET /api/tools
	 * Get all tools with optional status filtering
	 */
	static async get(req: GetToolRequest, res: Response): Promise<void> {
		try {
			const { status } = ToolsController._validateGetRequest(req);

			let query = supabaseClient.from("tools").select("*");

			if (status) {
				query = query.eq("status", status);
			}

			const { data, error } = await query.order("created_at", {
				ascending: false,
			});

			if (error) throw error;

			res.status(200).json({
				message: "Tools retrieved successfully",
				data: data || [],
			});
		} catch (error) {
			console.error("Get tools error:", error);
			res.status(500).json({ error: "Failed to fetch tools" });
		}
	}
	/**
	 * [POST] /api/tools
	 * Create a new tool
	 */
	static async post(req: CreateToolRequest, res: Response): Promise<void> {
		try {
			console.log("===== POST /api/tools =====");
			console.log("req.body:", req.body);
			console.log("req.headers:", req.headers);
      
			const validation = ToolsController._validatePostRequest(req);
			const { name, qty, status } = validation;

			const { data, error } = await supabaseClient
				.from("tools")
				.insert([{ name: name.trim(), qty, status }])
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
	 * [PUT] /api/tools/:id
	 * Update a tool
	 */
	static async put(req: UpdateToolRequest, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const validation = ToolsController._validatePutRequest(req);

			// Check if tool exists
			const { data: existingTool, error: fetchError } = await supabaseClient
				.from("tools")
				.select("*")
				.eq("id", id)
				.single();

			if (fetchError || !existingTool) {
				res.status(404).json({ error: "Tool not found" });
				return;
			}

			// Build update object
			const updateData: any = {};
			if (validation.name !== undefined)
				updateData.name = validation.name.trim();
			if (validation.status !== undefined)
				updateData.status = validation.status;
			if (validation.qty !== undefined) updateData.qty = validation.qty;

			const { data, error } = await supabaseClient
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
	 * [DELETE] /api/tools/:id
	 * Delete a tool (prevent if checked out)
	 */
	static async delete(req: DeleteToolRequest, res: Response): Promise<void> {
		try {
			const { id } = req.params;

			const { data: tool, error: fetchError } = await supabaseClient
				.from("tools")
				.select("*")
				.eq("id", id)
				.single();

			if (fetchError || !tool) {
				res.status(404).json({ error: "Tool not found" });
				return;
			}

			if (tool.status === ToolStatus.CHECKEDOUT) {
				res.status(400).json({
					error: "Cannot delete tool that is currently checked out",
				});
				return;
			}

			const { error: deleteError } = await supabaseClient
				.from("tools")
				.delete()
				.eq("id", id);

			if (deleteError) throw deleteError;

			res.status(200).json({ message: "Tool deleted successfully" });
		} catch (error) {
			console.error("Delete tool error:", error);
			res.status(500).json({ error: "Failed to delete tool" });
		}
	}

	/**
	 * [POST] /api/tools/:id/checkout
	 * Check out a tool
	 */
	static async checkout(
		req: CheckOutToolRequest,
		res: Response,
	): Promise<void> {
		try {
			const { id } = req.params;
			const userId = req.authUser?.id;

			if (!userId) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}

			const { data: tool, error: fetchError } = await supabaseClient
				.from("tools")
				.select("*")
				.eq("id", id)
				.single();

			if (fetchError || !tool) {
				res.status(404).json({ error: "Tool not found" });
				return;
			}

			if (tool.status !== ToolStatus.AVAILABLE) {
				res.status(400).json({
					error: "Tool is not available for checkout",
				});
				return;
			}

			if (tool.qty === 0) {
				res.status(400).json({
					error: "Cannot checkout tool with zero quantity",
				});
				return;
			}

			const checkedOutDate = new Date().toISOString();

			// Update tool status
			await supabaseClient
				.from("tools")
				.update({ status: ToolStatus.CHECKEDOUT })
				.eq("id", id);

			// Create checkout record
			const { data: toolManagement, error: mgmtError } = await supabaseClient
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

			if (mgmtError) throw mgmtError;

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
	 * [POST] /api/tools/:id/return
	 * Return a checked out tool
	 */
	static async return(req: ReturnToolRequest, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const userId = req.authUser?.id;

			if (!userId) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}

			const { data: tool, error: fetchError } = await supabaseClient
				.from("tools")
				.select("*")
				.eq("id", id)
				.single();

			if (fetchError || !tool) {
				res.status(404).json({ error: "Tool not found" });
				return;
			}

			// Find active checkout
			const { data: checkoutRecord, error: checkoutError } =
				await supabaseClient
					.from("tool_management")
					.select("*")
					.eq("tool_id", id)
					.is("checked_in", null)
					.single();

			if (checkoutError || !checkoutRecord) {
				res.status(404).json({
					error: "No active checkout found for this tool",
				});
				return;
			}

			// Verify user
			if (checkoutRecord.user_id !== userId) {
				res.status(403).json({
					error: "Only the user who checked out the tool can return it",
				});
				return;
			}

			const checkedInDate = new Date().toISOString();

			// Update tool status
			await supabaseClient
				.from("tools")
				.update({ status: ToolStatus.AVAILABLE })
				.eq("id", id);

			// Update checkout record
			const { data: updatedRecord, error: mgmtError } = await supabaseClient
				.from("tool_management")
				.update({ checked_in: checkedInDate })
				.eq("id", checkoutRecord.id)
				.select();

			if (mgmtError) throw mgmtError;

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
	 * [VALIDATE @ GET]
	 */
	private static _validateGetRequest(req: GetToolsRequest) {
		const { status } = req.query;

		if (status && !Object.values(ToolStatus).includes(status as ToolStatus)) {
			throw new Error(
				`Validation: Invalid status filter. Must be one of: ${Object.values(ToolStatus).join(", ")}`,
			);
		}

		return { status: status as string | undefined };
	}

	/**
	 * [VALIDATE @ POST]
	 */
	private static _validatePostRequest(req: CreateToolRequest) {
		const { name, qty, status = ToolStatus.AVAILABLE } = req.body;

		if (!name || typeof name !== "string" || name.trim() === "") {
			throw new Error(
				"Validation: Name is required and must be a non-empty string",
			);
		}

		if (
			qty === undefined ||
			qty === null ||
			!Number.isInteger(qty) ||
			qty < 0
		) {
			throw new Error("Validation: Quantity must be a non-negative integer");
		}

		if (!Object.values(ToolStatus).includes(status)) {
			throw new Error(
				`Validation: Status must be one of: ${Object.values(ToolStatus).join(", ")}`,
			);
		}

		return { name, qty, status };
	}

	/**
	 * [VALIDATE @ PUT]
	 */
	private static _validatePutRequest(req: UpdateToolRequest) {
		const { name, qty, status } = req.body;

		if (name !== undefined) {
			if (typeof name !== "string" || name.trim() === "") {
				throw new Error("Validation: Name must be a non-empty string");
			}
		}

		if (qty !== undefined) {
			if (!Number.isInteger(qty) || qty < 0) {
				throw new Error("Validation: Quantity must be a non-negative integer");
			}
		}

		if (status !== undefined) {
			if (!Object.values(ToolStatus).includes(status)) {
				throw new Error(
					`Validation: Status must be one of: ${Object.values(ToolStatus).join(", ")}`,
				);
			}
		}

		return { name, qty, status };
	}
}
