import { Request, Response } from "express";
import supabaseClient from "../config/supabase";

/**
 * This is the types for the Project table
 * Make sure it will match the database
 */
export enum ProjectStatus {
	ACTIVE = "ACTIVE",
	COMPLETED = "COMPLETED",
}

export interface Project {
	id: string;
	user_id: string;
	project_name: string;
	status: ProjectStatus;
	start_date: string;
	end_date: string;
	created_at?: string;
}

// Request type definitions
type GetProjectsRequest = Request<{}, {}, {}, { status?: string }>;
type CreateProjectRequest = Request<
	{},
	{},
	{
		projectName: string;
		startDate: string;
		endDate: string;
		status?: ProjectStatus;
	}
>;
type UpdateProjectRequest = Request<
	{ id: string },
	{},
	{
		projectName?: string;
		status?: ProjectStatus;
		startDate?: string;
		endDate?: string;
	}
>;
type DeleteProjectRequest = Request<{ id: string }>;

/**
 * This is the Project Controller
 */
export default class ProjectsController {
	/**
	 * [GET] /api/projects
	 * Get all projects with optional status filtering
	 */
	static async get(req: GetProjectsRequest, res: Response): Promise<void> {
		try {
			// Validates and extract status filter from the query
			const { status } = ProjectsController._validateGetRequest(req);

			// Start building the query to select all projects
			let query = supabaseClient.from("projects").select("*");

			// If status filter is provided, add it to the query
			if (status) {
				query = query.eq("status", status);
			}

			// Implement the query and sort it by newest created first
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
	 * Create a new project for authenticated user
	 */
	static async post(req: CreateProjectRequest, res: Response): Promise<void> {
		try {
			// Validate request body and extract validated data
			const validation = ProjectsController._validatePostRequest(req);
			const { projectName, startDate, endDate, status } = validation;

			// Insert new project data into the database and return the inserted record
			const { data, error } = await supabaseClient
				.from("projects")
				.insert([
					{
						project_name: projectName,
						start_date: startDate,
						end_date: endDate,
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
			// Extract project ID from URL params
			const { id } = req.params;
			const validation = ProjectsController._validatePatchRequest(req);

			// Check if project exists
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

			// Build update object - only include fields that were provided
			const updateData: Partial<Project> = {};
			if (validation.projectName !== undefined)
				updateData.project_name = validation.projectName;
			if (validation.status !== undefined)
				updateData.status = validation.status;
			if (validation.startDate !== undefined)
				updateData.start_date = validation.startDate;
			if (validation.endDate !== undefined)
				updateData.end_date = validation.endDate;

			// Execute the update query
			const { data, error } = await supabaseClient
				.from("projects")
				.update(updateData)
				.eq("id", id)
				.select();

			// Guard error of the database
			if (error) throw error;

			// Return success response with updated project
			res.status(200).json({
				message: "Project updated successfully",
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
	 * [DELETE] /api/projects/:id
	 * Delete a project (only if belongs to authenticated user)
	 */
	static async delete(req: DeleteProjectRequest, res: Response): Promise<void> {
		try {
			// Extract project ID from URL params
			const { id } = req.params;

			// Check if project exists in database
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
	 * Validate GET request query parameters
	 * Checks if status filter is valid enum value
	 */
	private static _validateGetRequest(req: GetProjectsRequest) {
		const { status } = req.query;

		if (
			status &&
			!Object.values(ProjectStatus).includes(status as ProjectStatus)
		) {
			throw new Error(
				`Validation: Invalid status filter. Must be one of: ${Object.values(ProjectStatus).join(", ")}`,
			);
		}

		return { status: status as string | undefined };
	}

	/**
	 * Validate POST request body for creating a project
	 */
	private static _validatePostRequest(req: CreateProjectRequest) {
		const {
			projectName,
			startDate,
			endDate,
			status = ProjectStatus.ACTIVE,
		} = req.body;

		// Validate projectName
		if (
			!projectName ||
			typeof projectName !== "string" ||
			projectName.trim() === ""
		) {
			throw new Error(
				"Validation: Project name is required and must be a non-empty string",
			);
		}

		// Validate startDate
		if (!startDate || typeof startDate !== "string") {
			throw new Error(
				"Validation: Start date is required and must be a string",
			);
		}

		const startDateObject = new Date(startDate);
		if (isNaN(startDateObject.getTime())) {
			throw new Error("Validation: Start date must be a valid date");
		}

		// Validate endDate (required)
		if (!endDate || typeof endDate !== "string") {
			throw new Error("Validation: End date is required and must be a string");
		}

		const endDateObject = new Date(endDate);
		if (isNaN(endDateObject.getTime())) {
			throw new Error("Validation: End date must be a valid date");
		}

		// Validate endDate >= startDate
		if (endDateObject < startDateObject) {
			throw new Error("Validation: End date cannot be earlier than start date");
		}

		// Validate status
		if (!Object.values(ProjectStatus).includes(status)) {
			throw new Error(
				`Validation: Status must be one of: ${Object.values(ProjectStatus).join(", ")}`,
			);
		}

		return {
			projectName: projectName.trim(),
			startDate,
			endDate,
			status,
		};
	}

	/**
	 * Validation for PATCH (Updating a project)
	 */
	private static _validatePatchRequest(req: UpdateProjectRequest) {
		const { projectName, status, startDate, endDate } = req.body;

		// Validate projectName if provided
		if (projectName !== undefined) {
			if (typeof projectName !== "string" || projectName.trim() === "") {
				throw new Error("Validation: Project name must be a non-empty string");
			}
		}

		// Validate status if provided
		if (status !== undefined) {
			if (!Object.values(ProjectStatus).includes(status)) {
				throw new Error(
					`Validation: Status must be one of: ${Object.values(ProjectStatus).join(", ")}`,
				);
			}
		}

		// Validate startDate if provided
		let startDateObj: Date | null = null;
		if (startDate !== undefined) {
			if (typeof startDate !== "string") {
				throw new Error("Validation: Start date must be a string");
			}
			startDateObj = new Date(startDate);
			if (isNaN(startDateObj.getTime())) {
				throw new Error("Validation: Start date must be a valid date");
			}
		}

		// Validate endDate if provided
		let endDateObj: Date | null = null;
		if (endDate !== undefined) {
			if (typeof endDate !== "string") {
				throw new Error("Validation: End date must be a string");
			}
			endDateObj = new Date(endDate);
			if (isNaN(endDateObj.getTime())) {
				throw new Error("Validation: End date must be a valid date");
			}
		}

		// Validate endDate >= startDate (if both provided or if only endDate provided with existing startDate)
		if (startDateObj && endDateObj && endDateObj < startDateObj) {
			throw new Error("Validation: End date cannot be earlier than start date");
		}

		return { projectName, status, startDate, endDate };
	}
}
