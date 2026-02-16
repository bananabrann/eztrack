import { Router } from "express";
import { projects } from "../faked/projects";

const router = Router();

// GET projects endpoint
router.get("/", (req, res) => {
	return res.status(200).json(projects);
});

/**
 * API for creating new project
 * POST /api/projects
 */
router.post("/", (req, res) => {
	// Inject response, we don't have actual data yet
	// TODO: remove this later when controller is being created
	const fakedProjectData = {
		id: "9d7aca13-0490-4dd7-9e23-d56d4eb64a1c",
		projectName: "Dirty Laundry: Laundromat",
		status: "ACTIVE",
		startDate: "2026-02-11",
		endDate: "2026-08-01",
	};

	return res.status(200).json(fakedProjectData);
});

// DELETE projects endpoint

router.delete("/:id", (req, res) => {
	return res.status(200).json({ message: "Project was deleted successfully." });
});

/**
 * API for updating a project
 * PATCH /api/projects/:id
 */
router.patch("/:id", (req, res) => {
	const projectId = req.params.id;
	const updateData = req.body;

	const projectIndex = projects.findIndex(project => project.id === projectId);

	if (projectIndex === -1) {
		return res.status(404).json({ message: "Project not found" });
	}

	// update the project
	projects[projectIndex] = { ...projects[projectIndex], ...updateData };
	const updatedProject = projects[projectIndex];
	return res
		.status(200)
		.json({ message: "The project was updated successfully.", updatedProject });
});

export default router;
