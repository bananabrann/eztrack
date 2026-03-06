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
			// Validates and extract status filter from the query
			const { status } = ToolsController._validateGetRequest(req);

			// Get user-scoped Supabase client
			const supabaseClient = getSupabaseClient(req);

			// Start building the query to select all tools with checkout info
			let query = supabaseClient.from("tools").select(`
					*,
					tool_management(
						user_id,
						checked_out,
						checked_in,
						accounts(name)
					)
				`);

			// If status filter is provided, add it to the query params
			if (status) {
				query = query.eq("status", status);
			}

			// Fetch the tool data by sorting it from newest created tool
			const { data, error } = await query.order("created_at", {
				ascending: false,
			});

			// Guard for database query error
			if (error) throw error;

			// Transform data to include active checkout metadata for frontend permissions/UI
			const checkedOutInfo = data?.map(tool => {
				const activeCheckout = tool.tool_management?.find(
					(tm: any) => tm.checked_in === null,
				);
				const account = Array.isArray(activeCheckout?.accounts)
					? activeCheckout?.accounts[0]
					: activeCheckout?.accounts;

				return {
					...tool,
					checked_out_by_user_id: activeCheckout?.user_id ?? null,
					checked_out_by: account?.name ?? null,
					checked_out_by_me: activeCheckout?.user_id === req.authUser?.id,
					tool_management: undefined,
				};
			});

			// Return success
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
			// Validate the tools input using the private function
			const validation = ToolsController._validatePostRequest(req);
			const { name, status } = validation;

			// Get user-scoped Supabase client
			const supabaseClient = getSupabaseClient(req);

			// Insert new tool data into the database and return the inserted record
			const { data, error } = await supabaseClient
				.from("tools")
				.insert([{ name: name.trim(), status }])
				.select();

			// Guard error for database
			if (error) throw error;

			// Return success message and the response with newly created tool data
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
			// Extract the tool ID from the request path parameters
			const { id } = req.params;

			// Validate the update input using the validation function
			const validation = ToolsController._validatePatchRequest(req);

			// Get user-scoped Supabase client
			const supabaseClient = getSupabaseClient(req);

			// Query the database to check if the tool with the given ID exists
			const { data: existingTool, error: fetchError } = await supabaseClient
				.from("tools")
				.select("*")
				.eq("id", id)
				.single();

			// Guard error for checking the ID if it existed
			if (fetchError || !existingTool) {
				res.status(404).json({ error: "Tool not found" });
				return;
			}

			// Initialize an empty object to hold the fields to update
			const updateData: Partial<Tool> = {};
			if (validation.name !== undefined) updateData.name = validation.name;
			if (validation.status !== undefined)
				updateData.status = validation.status;

			// Update the tool in the database with the new data and return the updated record
			const { data, error } = await supabaseClient
				.from("tools")
				.update(updateData)
				.eq("id", id)
				.select();

			// Check if there was an error updating the tool
			if (error) throw error;

			// Return a 200 success response with the updated tool data
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
			// Extract the tool Id from the request path parameters
			const { id } = req.params;

			// Get user-scoped Supabase client
			const supabaseClient = getSupabaseClient(req);

			// Query the database to fetch the tool with the given ID
			const { data: tool, error: fetchError } = await supabaseClient
				.from("tools")
				.select("*")
				.eq("id", id)
				.single();

			// Check if there was an error fetching the tool or if no tool was found
			if (fetchError || !tool) {
				res.status(404).json({ error: "Tool not found" });
				return;
			}

			// Check if the tool is currently checked out
			if (tool.status === TOOL_STATUS.CHECKEDOUT) {
				res.status(400).json({
					error: "Cannot delete tool that is currently checked out",
				});
				return;
			}

			// Archive the tool by updating the status to ARCHIVE (soft delete)
			const { error: deleteError } = await supabaseClient
				.from("tools")
				.update({ status: TOOL_STATUS.ARCHIVE })
				.eq("id", id);

			// Guard for the database error
			if (deleteError) {
				throw deleteError;
			}

			// Return a 200 success response confirming tool deletion
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
			// Extract the tool ID from the request path parameters
			const { id } = req.params;

			// Extract the user ID from the authenticated user object attached by middleware
			const userId = req.authUser?.id;

			// If the userId doesn't match in the database, throw an error
			if (!userId) {
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

			// Guard for the database error in fetching the tool by ID
			if (fetchError || !tool) {
				res.status(404).json({ error: "Tool not found" });
				return;
			}

			// Check if the tool status is not AVAILABLE, meaning it cannot be checked out
			if (tool.status !== TOOL_STATUS.AVAILABLE) {
				res.status(400).json({
					error: "Tool is not available for checkout",
				});
				return;
			}

			// Check if user already has an active checkout for this tool
			const { data: existingCheckout, error: existingError } =
				await supabaseClient
					.from("tool_management")
					.select("*")
					.eq("tool_id", id)
					.eq("user_id", userId)
					.is("checked_in", null)
					.maybeSingle();

			// Guard for the database error in fetching existing checkout
			if (existingError) throw existingError;

			// Prevent duplicate checkouts by the same user and same tool
			if (existingCheckout) {
				res.status(400).json({
					error:
						"You already have this tool checked out. Return it first to checkout again.",
				});
				return;
			}

			// Get the current date and time in ISO format for the checkout timestamp
			const checkedOutDate = new Date().toISOString();

			// Insert a new checkout record in the tool_management table to track this checkout
			const { data: toolManagement, error: managementError } =
				await supabaseClient
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

			// Check if there was an error inserting the checkout record
			if (managementError) throw managementError;
			if (!toolManagement || toolManagement.length === 0) {
				throw new Error("Failed to create checkout record");
			}

			// Update tool status and require one affected row.
			const { data: updatedToolRows, error: updateError } = await supabaseClient
				.from("tools")
				.update({ status: TOOL_STATUS.CHECKEDOUT })
				.eq("id", id)
				.select("id");

			// Guard for database error and partial/no-op updates.
			if (updateError || !updatedToolRows || updatedToolRows.length === 0) {
				const rollbackCheckedInDate = new Date().toISOString();
				await supabaseClient
					.from("tool_management")
					.update({ checked_in: rollbackCheckedInDate })
					.eq("id", toolManagement[0].id);
				if (!updateError) {
					res.status(409).json({
						error: "Tool checkout state conflict.",
					});
					return;
				}
				throw updateError;
			}

			// Return a 200 success response with checkout details
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
			// Extract the tool ID from the request path parameters
			const { id } = req.params;
			// Extract the user ID from the authenticated user object attached by middleware
			const userId = req.authUser?.id;

			// Check if the user ID was not found (user not authenticated)
			if (!userId) {
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

			// Check if there was an error fetching the tool or if no tool was found
			if (fetchError || !tool) {
				res.status(404).json({ error: "Tool not found" });
				return;
			}

			// Query the tool_management table to find the active checkout record for this tool by this user
			const { data: checkoutRecord, error: checkoutError } =
				await supabaseClient
					.from("tool_management")
					.select("*")
					.eq("tool_id", id)
					.eq("user_id", userId)
					.is("checked_in", null)
					.single();

			// Check if there was an error fetching the checkout record or if no active checkout was found
			if (checkoutError || !checkoutRecord) {
				res.status(404).json({
					error: "No active checkout found for this tool",
				});
				return;
			}

			// Verify user who is returning the tool
			if (checkoutRecord.user_id !== userId) {
				res.status(403).json({
					error: "Only the user who checked out the tool can return it",
				});
				return;
			}

			// Get the current date and time in ISO format for the return timestamp
			const checkedInDate = new Date().toISOString();

			// Update tool status and require one affected row.
			const { data: updatedToolRows, error: updateError } = await supabaseClient
				.from("tools")
				.update({ status: TOOL_STATUS.AVAILABLE })
				.eq("id", id)
				.select("id");

			// If no rows were updated, do not close checkout record and return non-200.
			if (updateError) throw updateError;
			if (!updatedToolRows || updatedToolRows.length === 0) {
				res.status(403).json({
					error: "Unable to update tool status for return",
				});
				return;
			}

			// Close the active checkout record for this user/tool.
			const { error: managementError } = await supabaseClient
				.from("tool_management")
				.update({ checked_in: checkedInDate })
				.eq("id", checkoutRecord.id);

			// If checkout-record update fails, rollback tool status to preserve consistency.
			if (managementError) {
				await supabaseClient
					.from("tools")
					.update({ status: TOOL_STATUS.CHECKEDOUT })
					.eq("id", id);
				throw managementError;
			}

			// Return a 200 success response with return details
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
