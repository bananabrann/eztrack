import { Request, Response } from "express";
import { createSupabaseUserClient } from "../config/supabase";
import { Database, Constants } from "../types/database.types";
import { TOOL_STATUS } from "./tools-controller";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type MaterialUsage =
	Database["public"]["Tables"]["material_usage"]["Row"];
export type Material = Database["public"]["Tables"]["materials"]["Row"];
export type ProjectStatus = Database["public"]["Enums"]["project_status"];

export const PROJECT_STATUS = {
	ACTIVE: "ACTIVE",
	COMPLETED: "COMPLETED",
} as const satisfies Record<string, ProjectStatus>;

// Use the array directly from database types
export const PROJECT_STATUS_VALUES = Constants.public.Enums.project_status;

// Request type definitions
type GetProjectsRequest = Request<{}, {}, {}, { status?: string }>;
type CreateProjectRequest = Request<
	{},
	{},
	{
		project_name: string;
		start_date: string;
		end_date: string;
		status?: ProjectStatus;
	}
>;
type UpdateProjectRequest = Request<
	{ id: string },
	{},
	{
		project_name?: string;
		status?: ProjectStatus;
		start_date?: string;
		end_date?: string;
	}
>;
type DeleteProjectRequest = Request<{ id: string }>;
type MaterialCostRequest = Request<{ id: string }>;

/**
 * Projects Controller including material cost calculations
 */
export default class ProjectsController {
	/**
	 * GET /api/projects
	 * Get all projects with optional status filtering
	 */
	static async get(req: GetProjectsRequest, res: Response): Promise<void> {
		try {
			const supabaseClient = ProjectsController._supabaseForRequest(req);

			// Validates and extract status filter from the query
			const { status } = ProjectsController._validateGetRequest(req);

			// Start building the query to select all projects
			let query = supabaseClient.from("projects").select("*");

			// If status filter is provided, add it to the query
			if (status) {
				query = query.eq("status", status);
			}

			// Fetch the project data by sorting it from newest created project
			const { data, error } = await query.order("created_at", {
				ascending: false,
			});

			// Guard for database query error
			if (error) throw error;

			// Return the success response
			res.status(200).json({
				message: "Projects retrieved successfully",
				data: data || [],
			});
		} catch (error) {
			console.error("Get projects error:", error);
			res.status(500).json({ error: "Failed to fetch projects" });
		}
	}

	/**
	 * POST /api/projects
	 * Create a new project
	 */
	static async post(req: CreateProjectRequest, res: Response): Promise<void> {
		try {
			const supabaseClient = ProjectsController._supabaseForRequest(req);

			// Validate request body and extract validated data
			const validation = ProjectsController._validatePostRequest(req);
			const { project_name, start_date, end_date, status } = validation;

			// Insert new project data into the database and return the inserted record
			const { data, error } = await supabaseClient
				.from("projects")
				.insert([
					{
						project_name,
						start_date,
						end_date,
						status,
					},
				])
				.select();

			// Guard for database error
			if (error) throw error;

			// Return success response with created project
			res.status(201).json({
				message: "Project created successfully",
				data: data[0],
			});
		} catch (error: any) {
			console.error("Create project error:", error);
			if (error.message?.includes("Validation")) {
				res.status(400).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Failed to create project" });
			}
		}
	}

	/**
	 * PATCH /api/projects/:id
	 * Update a project
	 */
	static async patch(req: UpdateProjectRequest, res: Response): Promise<void> {
		try {
			const supabaseClient = ProjectsController._supabaseForRequest(req);

			// Extract project ID from URL params
			const { id } = req.params;

			// Validate the update input using the validation function
			const validation = ProjectsController._validatePatchRequest(req);

			// Query the database to check if the project with the given ID exists
			const { data: existingProject, error: fetchError } = await supabaseClient
				.from("projects")
				.select("*")
				.eq("id", id)
				.single();

			// Guard error if project not found
			if (fetchError || !existingProject) {
				res.status(404).json({ error: "Project not found" });
				return;
			}

			// Initialize an empty object to hold the fields to update
			const updateData: Partial<Project> = {};
			if (validation.project_name !== undefined)
				updateData.project_name = validation.project_name;
			if (validation.status !== undefined)
				updateData.status = validation.status;
			if (validation.start_date !== undefined)
				updateData.start_date = validation.start_date;
			if (validation.end_date !== undefined)
				updateData.end_date = validation.end_date;

			// Execute the update query and return the updated record
			const { data, error } = await supabaseClient
				.from("projects")
				.update(updateData)
				.eq("id", id)
				.select();

			// Guard error of the database
			if (error) throw error;

			// If the project was marked COMPLETED, archive all associated tools

			let toolsArchived = false;

			if (
				updateData.status === PROJECT_STATUS.COMPLETED &&
				existingProject.status !== PROJECT_STATUS.COMPLETED
			) {
				const { error: archiveError } = await supabaseClient
					.from("tools")
					.update({ status: TOOL_STATUS.ARCHIVE })
					.eq("project_id", id);

				if (archiveError) throw archiveError;

				toolsArchived = true;
			}

			// Return success response with updated project
			res.status(200).json({
				message: "Project updated successfully",
				details: toolsArchived
					? "All associated tools have been archived successfully"
					: undefined,
				data: data[0],
			});
		} catch (error: any) {
			console.error("Update project error:", error);
			if (error.message?.includes("Validation")) {
				res.status(400).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Failed to update project" });
			}
		}
	}

	/**
	 * DELETE /api/projects/:id
	 * Delete a project
	 */
	static async delete(req: DeleteProjectRequest, res: Response): Promise<void> {
		try {
			const supabaseClient = ProjectsController._supabaseForRequest(req);

			// Extract project ID from URL params
			const { id } = req.params;

			// Query the database to fetch the project with the given ID
			const { data: project, error: fetchError } = await supabaseClient
				.from("projects")
				.select("*")
				.eq("id", id)
				.single();

			// Guard for data not found and will return 404
			if (fetchError || !project) {
				res.status(404).json({ error: "Project not found" });
				return;
			}

			// Delete project from database
			const { error: deleteError } = await supabaseClient
				.from("projects")
				.delete()
				.eq("id", id);

			// Guard for database error
			if (deleteError) throw deleteError;

			// Return success response
			res.status(200).json({ message: "Project deleted successfully" });
		} catch (error) {
			console.error("Delete project error:", error);
			res.status(500).json({ error: "Failed to delete project" });
		}
	}

	/**
	 * GET /api/projects/:id/material-cost
	 * Calculate the total material cost for a project using material_usage records
	 */
	static async materialCost(
		req: MaterialCostRequest,
		res: Response,
	): Promise<void> {
		try {
			const supabaseClient = ProjectsController._supabaseForRequest(req);

			// Extract the project ID from the request path parameters
			const { id: project_id } =
				ProjectsController._validateMaterialCostRequest(req);

			// Query the database to verify the project exists
			const { data: project, error: projectError } = await supabaseClient
				.from("projects")
				.select("*")
				.eq("id", project_id)
				.single();

			// Guard error if project not found
			if (projectError || !project) {
				res.status(404).json({ error: "Project not found" });
				return;
			}

			// Fetch all material_usage rows for this project, joining material data
			const { data: usageRows, error: usageError } = await supabaseClient
				.from("material_usage")
				.select("*, materials(*)")
				.eq("project_id", project_id);

			// Guard for database query error
			if (usageError) throw usageError;

			// If no usage records exist, return zero cost
			if (!usageRows || usageRows.length === 0) {
				res.status(200).json({
					message: "Material cost retrieved successfully",
					data: {
						project_id,
						total_cost: 0,
						materials: [],
					},
				});
				return;
			}

			// Accumulate total cost and build the materials breakdown list
			let total_cost = 0;

			const materials = usageRows
				.map(usage => {
					const material = usage.materials as Material | null;
					if (!material) return null;

					total_cost = Math.round((total_cost + usage.total_cost) * 100) / 100;

					return {
						material_id: material.id,
						name: material.name,
						quantity_used: usage.quantity_used,
						unit_cost: material.unit_cost,
						cost: usage.total_cost,
					};
				})
				.filter(Boolean);

			// Return a 200 success response with the cost breakdown
			res.status(200).json({
				message: "Material cost retrieved successfully",
				data: {
					project_id,
					total_cost,
					materials,
				},
			});
		} catch (error) {
			console.error("Material cost error:", error);
			res.status(500).json({ error: "Failed to calculate material cost" });
		}
	}

	/**
	 * Validation for GET method
	 */
	private static _validateGetRequest(req: GetProjectsRequest) {
		const { status } = req.query;

		if (status && !PROJECT_STATUS_VALUES.includes(status as ProjectStatus)) {
			throw new Error(
				`Validation: Invalid status filter. Must be one of: ${PROJECT_STATUS_VALUES.join(", ")}`,
			);
		}

		return { status: status as string | undefined };
	}

	private static _supabaseForRequest(req: Request) {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			throw new Error("Validation: Missing bearer token");
		}

		return createSupabaseUserClient(token);
	}

	/**
	 * Validation for POST method
	 */
	private static _validatePostRequest(req: CreateProjectRequest) {
		const {
			project_name,
			start_date,
			end_date,
			status = PROJECT_STATUS.ACTIVE,
		} = req.body;

		// Validate project_name
		if (
			!project_name ||
			typeof project_name !== "string" ||
			project_name.trim() === ""
		) {
			throw new Error(
				"Validation: project_name is required and must be a non-empty string",
			);
		}

		// Validate start_date
		if (!start_date || typeof start_date !== "string") {
			throw new Error(
				"Validation: start_date is required and must be a string",
			);
		}

		const startDateObject = new Date(start_date);
		if (isNaN(startDateObject.getTime())) {
			throw new Error("Validation: start_date must be a valid date");
		}

		// Validate end_date
		if (!end_date || typeof end_date !== "string") {
			throw new Error("Validation: end_date is required and must be a string");
		}

		const endDateObject = new Date(end_date);
		if (isNaN(endDateObject.getTime())) {
			throw new Error("Validation: end_date must be a valid date");
		}

		// Validate end_date >= start_date
		if (endDateObject < startDateObject) {
			throw new Error("Validation: end_date cannot be earlier than start_date");
		}

		// Validate status
		if (!PROJECT_STATUS_VALUES.includes(status)) {
			throw new Error(
				`Validation: status must be one of: ${PROJECT_STATUS_VALUES.join(", ")}`,
			);
		}

		return {
			project_name: project_name.trim(),
			start_date,
			end_date,
			status,
		};
	}

	/**
	 * Validation for PATCH method
	 */
	private static _validatePatchRequest(req: UpdateProjectRequest) {
		const { project_name, status, start_date, end_date } = req.body;

		// Validate project_name if provided
		if (project_name !== undefined) {
			if (typeof project_name !== "string" || project_name.trim() === "") {
				throw new Error("Validation: project_name must be a non-empty string");
			}
		}

		// Validate status if provided
		if (status !== undefined) {
			if (!PROJECT_STATUS_VALUES.includes(status)) {
				throw new Error(
					`Validation: status must be one of: ${PROJECT_STATUS_VALUES.join(", ")}`,
				);
			}
		}

		// Validate start_date if provided
		let startDateObj: Date | null = null;
		if (start_date !== undefined) {
			if (typeof start_date !== "string") {
				throw new Error("Validation: start_date must be a string");
			}
			startDateObj = new Date(start_date);
			if (isNaN(startDateObj.getTime())) {
				throw new Error("Validation: start_date must be a valid date");
			}
		}

		// Validate end_date if provided
		let endDateObj: Date | null = null;
		if (end_date !== undefined) {
			if (typeof end_date !== "string") {
				throw new Error("Validation: end_date must be a string");
			}
			endDateObj = new Date(end_date);
			if (isNaN(endDateObj.getTime())) {
				throw new Error("Validation: end_date must be a valid date");
			}
		}

		// Validate end_date >= start_date if both are provided
		if (startDateObj && endDateObj && endDateObj < startDateObj) {
			throw new Error("Validation: end_date cannot be earlier than start_date");
		}

		return {
			project_name: project_name?.trim(),
			status,
			start_date,
			end_date,
		};
	}

	/**
	 * Validation for materialCost method
	 */
	private static _validateMaterialCostRequest(req: MaterialCostRequest) {
		const { id } = req.params;

		if (!id || typeof id !== "string" || id.trim() === "") {
			throw new Error(
				"Validation: project id is required and must be a non-empty string",
			);
		}

		return { id: id.trim() };
	}
}
