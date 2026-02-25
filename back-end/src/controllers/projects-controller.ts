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
	end_date: string | null;
	created_at?: string;
	updated_at?: string;
}

// Request type definitions
type GetProjectsRequest = Request<{}, {}, {}, { status?: string }>;
type CreateProjectRequest = Request<
	{},
	{},
	{
		projectName: string;
		startDate: string;
		endDate?: string;
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
	 * GET /api/projects
	 * Get all projects for authenticated user with optional status filtering
	 */
	static async get(req: GetProjectsRequest, res: Response): Promise<void> {
		try {
			const userId = req.authUser?.id;

			if (!userId) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}

			const { status } = ProjectsController._validateGetRequest(req);

			let query = supabaseClient
				.from("projects")
				.select("*")
				.eq("user_id", userId);

			if (status) {
				query = query.eq("status", status);
			}

			const { data, error } = await query.order("created_at", {
				ascending: false,
			});

			if (error) throw error;

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
			const userId = req.authUser?.id;

			if (!userId) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}

			const validation = ProjectsController._validatePostRequest(req);
			const { projectName, startDate, endDate, status } = validation;

			const { data, error } = await supabaseClient
				.from("projects")
				.insert([
					{
						user_id: userId,
						project_name: projectName.trim(),
						start_date: startDate,
						end_date: endDate || null,
						status,
					},
				])
				.select();

			if (error) throw error;

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
	 * PUT /api/projects/:id
	 * Update a project
	 */
	static async put(req: UpdateProjectRequest, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const userId = req.authUser?.id;

			if (!userId) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}

			const validation = ProjectsController._validatePutRequest(req);

			// Check if project exists and belongs to user
			const { data: existingProject, error: fetchError } = await supabaseClient
				.from("projects")
				.select("*")
				.eq("id", id)
				.eq("user_id", userId)
				.single();

			if (fetchError || !existingProject) {
				res.status(404).json({ error: "Project not found" });
				return;
			}

			// Build update object
			const updateData: any = {};
			if (validation.projectName !== undefined)
				updateData.project_name = validation.projectName.trim();
			if (validation.status !== undefined)
				updateData.status = validation.status;
			if (validation.startDate !== undefined)
				updateData.start_date = validation.startDate;
			if (validation.endDate !== undefined)
				updateData.end_date = validation.endDate;

			const { data, error } = await supabaseClient
				.from("projects")
				.update(updateData)
				.eq("id", id)
				.eq("user_id", userId)
				.select();

			if (error) throw error;

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
			const { id } = req.params;
			const userId = req.authUser?.id;

			if (!userId) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}

			const { data: project, error: fetchError } = await supabaseClient
				.from("projects")
				.select("*")
				.eq("id", id)
				.eq("user_id", userId)
				.single();

			if (fetchError || !project) {
				res.status(404).json({ error: "Project not found" });
				return;
			}

			const { error: deleteError } = await supabaseClient
				.from("projects")
				.delete()
				.eq("id", id)
				.eq("user_id", userId);

			if (deleteError) throw deleteError;

			res.status(200).json({ message: "Project deleted successfully" });
		} catch (error) {
			console.error("Delete project error:", error);
			res.status(500).json({ error: "Failed to delete project" });
		}
	}
	/**
	 * [VALIDATE @ GET]
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
	 * [VALIDATE @ POST]
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

		const startDateObj = new Date(startDate);
		if (isNaN(startDateObj.getTime())) {
			throw new Error("Validation: Start date must be a valid date");
		}

		// Validate endDate if provided
		let endDateObj: Date | null = null;
		if (endDate) {
			endDateObj = new Date(endDate);
			if (isNaN(endDateObj.getTime())) {
				throw new Error("Validation: End date must be a valid date");
			}

			// Validate endDate >= startDate
			if (endDateObj < startDateObj) {
				throw new Error(
					"Validation: End date cannot be earlier than start date",
				);
			}
		}

		// Validate status
		if (!Object.values(ProjectStatus).includes(status)) {
			throw new Error(
				`Validation: Status must be one of: ${Object.values(ProjectStatus).join(", ")}`,
			);
		}

		return {
			projectName,
			startDate,
			endDate: endDate || null,
			status,
		};
	}

	/**
	 * [VALIDATE @ PUT]
	 */
	private static _validatePutRequest(req: UpdateProjectRequest) {
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
