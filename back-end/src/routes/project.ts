import { Router } from "express";

const router = Router();

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

export default router;
