import { Request, Response } from "express";
import { Database } from "../types/database.types";
import { createSupabaseUserClient } from "../config/supabase";

export type Material = Database["public"]["Tables"]["materials"]["Row"];
export type MaterialUsage =
	Database["public"]["Tables"]["material_usage"]["Row"];

// Request type definitions
type GetMaterialsRequest = Request<{}, {}, {}, { project_id?: string }>;
type CreateMaterialRequest = Request<
	{},
	{},
	{
		name: string;
		unit_qty: number;
		unit_cost: number;
		low_stock_threshold: number;
		project_id: string;
	}
>;
type UpdateMaterialRequest = Request<
	{ id: string },
	{},
	{
		name?: string;
		unit_qty?: number;
		unit_cost?: number;
		low_stock_threshold?: number;
	}
>;
type DeleteMaterialRequest = Request<{ id: string }>;
type CreateUsageRequest = Request<
	{ id: string },
	{},
	{
		quantity_used: number;
		project_id: string;
	}
>;

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
 * Materials Controller including material usage tracking
 */
export default class MaterialsController {
	/**
	 * GET /api/materials
	 * Get all materials with optional project_id filtering
	 */
	static async get(req: GetMaterialsRequest, res: Response): Promise<void> {
		try {
			// Validate and extract query params
			const { project_id } = MaterialsController._validateGetRequest(req);

			// Get user-scoped Supabase client
			const supabaseClient = getSupabaseClient(req);

			// Start building the query to select all materials
			let query = supabaseClient.from("materials").select("*");

			// If project_id filter is provided, add it to the query
			if (project_id) {
				query = query.eq("project_id", project_id);
			}

			// Fetch the material data
			const { data, error } = await query;

			// Guard for database query error
			if (error) throw error;

			// Return success
			res.status(200).json({
				message: "Materials retrieved successfully",
				data: data || [],
			});
		} catch (error) {
			console.error("Get materials error:", error);
			res.status(500).json({ error: "Failed to fetch materials" });
		}
	}

	/**
	 * POST /api/materials
	 * Create a new material
	 */
	static async post(req: CreateMaterialRequest, res: Response): Promise<void> {
		try {
			// Validate the materials input using the private function
			const validation = MaterialsController._validatePostRequest(req);
			const { name, unit_qty, unit_cost, low_stock_threshold, project_id } =
				validation;

			// Get user-scoped Supabase client with RLS
			const supabaseClient = getSupabaseClient(req);

			// Insert new material data into the database and return the inserted record
			const { data, error } = await supabaseClient
				.from("materials")
				.insert([
					{ name, unit_qty, unit_cost, low_stock_threshold, project_id },
				])
				.select();

			// Guard error for database
			if (error) throw error;

			// Return success message and the response with newly created material data
			res.status(201).json({
				message: "Material created successfully",
				data: data[0],
			});
		} catch (error: any) {
			console.error("Create material error:", error);
			if (error.message?.includes("Validation")) {
				res.status(400).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Failed to create material" });
			}
		}
	}

	/**
	 * PATCH /api/materials/:id
	 * Update a material
	 */
	static async patch(req: UpdateMaterialRequest, res: Response): Promise<void> {
		try {
			// Extract the material ID from the request path parameters
			const { id } = req.params;

			// Validate the update input using the validation function
			const validation = MaterialsController._validatePatchRequest(req);

			// Get user-scoped Supabase client with RLS
			const supabaseClient = getSupabaseClient(req);

			// Query the database to check if the material with the given ID exists
			const { data: existingMaterial, error: fetchError } = await supabaseClient
				.from("materials")
				.select("*")
				.eq("id", id)
				.single();

			// Guard error for checking the ID if it existed
			if (fetchError || !existingMaterial) {
				res.status(404).json({ error: "Material not found" });
				return;
			}

			// Initialize an empty object to hold the fields to update
			const updateData: Partial<Material> = {};
			if (validation.name !== undefined) updateData.name = validation.name;
			if (validation.unit_qty !== undefined)
				updateData.unit_qty = validation.unit_qty;
			if (validation.unit_cost !== undefined)
				updateData.unit_cost = validation.unit_cost;
			if (validation.low_stock_threshold !== undefined)
				updateData.low_stock_threshold = validation.low_stock_threshold;

			// Update the material in the database with the new data and return the updated record
			const { data, error } = await supabaseClient
				.from("materials")
				.update(updateData)
				.eq("id", id)
				.select();

			// Check if there was an error updating the material
			if (error) throw error;

			// Return a 200 success response with the updated material data
			res.status(200).json({
				message: "Material updated successfully",
				data: data[0],
			});
		} catch (error: any) {
			console.error("Update material error:", error);
			if (error.message?.includes("Validation")) {
				res.status(400).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Failed to update material" });
			}
		}
	}

	/**
	 * DELETE /api/materials/:id
	 * Delete a material
	 */
	static async delete(
		req: DeleteMaterialRequest,
		res: Response,
	): Promise<void> {
		try {
			// Extract the material ID from the request path parameters
			const { id } = req.params;

			// Get user-scoped Supabase client with RLS
			const supabaseClient = getSupabaseClient(req);

			// Query the database to fetch the material with the given ID
			const { data: material, error: fetchError } = await supabaseClient
				.from("materials")
				.select("*")
				.eq("id", id)
				.single();

			// Check if there was an error fetching the material or if no material was found
			if (fetchError || !material) {
				res.status(404).json({ error: "Material not found" });
				return;
			}

			// Delete the material from the database
			const { error: deleteError } = await supabaseClient
				.from("materials")
				.delete()
				.eq("id", id);

			// Guard for the database error
			if (deleteError) throw deleteError;

			// Return a 200 success response confirming material deletion
			res.status(200).json({ message: "Material deleted successfully" });
		} catch (error) {
			console.error("Delete material error:", error);
			res.status(500).json({ error: "Failed to delete material" });
		}
	}

	/**
	 * POST /api/materials/:id/usage
	 * Create a material usage record and decrement material quantity
	 */
	static async createUsage(
		req: CreateUsageRequest,
		res: Response,
	): Promise<void> {
		try {
			// Extract the material ID from the request path parameters
			const { id: material_id } = req.params;

			// Validate the usage input using the private function
			const { quantity_used, project_id } =
				MaterialsController._validateCreateUsageRequest(req);

			// Get user-scoped Supabase client with RLS
			const supabaseClient = getSupabaseClient(req);

			// Query the database to fetch the material with the given ID
			const { data: material, error: materialError } = await supabaseClient
				.from("materials")
				.select("*")
				.eq("id", material_id)
				.single();

			// Guard error for fetching the material
			if (materialError || !material) {
				res.status(404).json({ error: "Material not found" });
				return;
			}

			// Check if there is sufficient quantity available
			if (material.unit_qty < quantity_used) {
				res.status(400).json({ error: "Insufficient unit_qty" });
				return;
			}

			// Calculate remaining quantity and total cost
			const remaining_qty = material.unit_qty - quantity_used;
			const total_cost =
				Math.round(quantity_used * material.unit_cost * 100) / 100;

			// Update the material quantity in the database
			const { error: updateError } = await supabaseClient
				.from("materials")
				.update({ unit_qty: remaining_qty })
				.eq("id", material_id);

			// Guard for the database error in updating the material
			if (updateError) throw updateError;

			// Insert a new usage record into the material_usage table
			const { data: usageRows, error: usageError } = await supabaseClient
				.from("material_usage")
				.insert([
					{
						material_id: material.id,
						project_id,
						quantity_used,
						total_cost,
					},
				])
				.select();

			// Check if there was an error inserting the usage record
			if (usageError) throw usageError;

			// Return a 200 success response with usage details
			res.status(200).json({
				message: "Material usage created successfully",
				data: {
					material_id: material.id,
					project_id,
					quantity_used,
					remaining_qty,
					total_cost,
					usage_id: usageRows[0].id,
				},
			});
		} catch (error: any) {
			console.error("Create material usage error:", error);
			if (error.message?.includes("Validation")) {
				res.status(400).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Failed to create material usage" });
			}
		}
	}

	/**
	 * GET /api/materials/low-stock
	 * Get materials that are at or below their low stock threshold
	 */
	static async getLowStock(req: Request, res: Response): Promise<void> {
		try {
			// Get user-scoped Supabase client with RLS
			const supabaseClient = getSupabaseClient(req);

			// Fetch all materials from the database
			const { data, error } = await supabaseClient
				.from("materials")
				.select("*");

			// Guard for database query error
			if (error) throw error;

			const materials = (data as Material[]) || [];

			// Filter materials where unit_qty is at or below the low_stock_threshold
			const lowStock = materials.filter(
				material => material.unit_qty <= material.low_stock_threshold,
			);

			// Return a 200 success response with the low stock materials
			res.status(200).json({
				message: "Low stock materials retrieved successfully",
				data: lowStock.map(material => ({
					id: material.id,
					name: material.name,
					unit_qty: material.unit_qty,
					low_stock_threshold: material.low_stock_threshold,
					project_id: material.project_id,
				})),
			});
		} catch (error) {
			console.error("Get low stock alerts error:", error);
			res.status(500).json({ error: "Failed to fetch low stock alerts" });
		}
	}

	/**
	 * Validation for GET method
	 */
	private static _validateGetRequest(req: GetMaterialsRequest) {
		const { project_id } = req.query;

		if (
			project_id !== undefined &&
			(typeof project_id !== "string" || project_id.trim() === "")
		) {
			throw new Error(
				"Validation: project_id, if provided, must be a non-empty string",
			);
		}

		return { project_id: project_id as string | undefined };
	}

	/**
	 * Validation for POST method
	 */
	private static _validatePostRequest(req: CreateMaterialRequest) {
		const { name, unit_qty, unit_cost, low_stock_threshold, project_id } =
			req.body ?? {};

		if (!name || typeof name !== "string" || name.trim() === "") {
			throw new Error(
				"Validation: name is required and must be a non-empty string",
			);
		}

		if (typeof unit_qty !== "number" || unit_qty <= 0) {
			throw new Error("Validation: unit_qty is required and must be > 0");
		}

		if (typeof unit_cost !== "number" || unit_cost <= 0) {
			throw new Error("Validation: unit_cost is required and must be > 0");
		}

		if (typeof low_stock_threshold !== "number" || low_stock_threshold < 0) {
			throw new Error(
				"Validation: low_stock_threshold is required and must be >= 0",
			);
		}

		if (
			!project_id ||
			typeof project_id !== "string" ||
			project_id.trim() === ""
		) {
			throw new Error(
				"Validation: project_id is required and must be a non-empty string",
			);
		}

		return {
			name: name.trim(),
			unit_qty,
			unit_cost,
			low_stock_threshold,
			project_id: project_id.trim(),
		};
	}

	/**
	 * Validation for PATCH method
	 */
	private static _validatePatchRequest(req: UpdateMaterialRequest) {
		const { name, unit_qty, unit_cost, low_stock_threshold } = req.body ?? {};

		if (name !== undefined) {
			if (typeof name !== "string" || name.trim() === "") {
				throw new Error(
					"Validation: name, if provided, must be a non-empty string",
				);
			}
		}

		if (unit_qty !== undefined) {
			if (typeof unit_qty !== "number" || unit_qty < 0) {
				throw new Error("Validation: unit_qty, if provided, must be >= 0");
			}
		}

		if (unit_cost !== undefined) {
			if (typeof unit_cost !== "number" || unit_cost < 0) {
				throw new Error("Validation: unit_cost, if provided, must be >= 0");
			}
		}

		if (low_stock_threshold !== undefined) {
			if (typeof low_stock_threshold !== "number" || low_stock_threshold < 0) {
				throw new Error(
					"Validation: low_stock_threshold, if provided, must be >= 0",
				);
			}
		}

		return {
			name: name?.trim(),
			unit_qty,
			unit_cost,
			low_stock_threshold,
		};
	}

	/**
	 * Validation for createUsage method
	 */
	private static _validateCreateUsageRequest(req: CreateUsageRequest) {
		const { quantity_used, project_id } = req.body ?? {};

		if (typeof quantity_used !== "number" || quantity_used <= 0) {
			throw new Error("Validation: quantity_used is required and must be > 0");
		}

		if (
			!project_id ||
			typeof project_id !== "string" ||
			project_id.trim() === ""
		) {
			throw new Error(
				"Validation: project_id is required and must be a non-empty string",
			);
		}

		return { quantity_used, project_id: project_id.trim() };
	}
}
