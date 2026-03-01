import { Router } from "express";
import { verifyAuth } from "../middleware/auth-middleware";
import ProjectsController from "../controllers/projects-controller";

const router = Router();

/**
 * API for retrieving all projects with optional status filtering
 * GET /api/projects
 */
router.get("/", verifyAuth, ProjectsController.get.bind(ProjectsController));

/**
 * API for creating a new project
 * POST /api/projects
 */
router.post("/", verifyAuth, ProjectsController.post.bind(ProjectsController));

/**
 * API for updating a project
 * PATCH /api/projects/:id
 */
router.patch(
	"/:id",
	verifyAuth,
	ProjectsController.patch.bind(ProjectsController),
);

/**
 * API for deleting a project
 * DELETE /api/projects/:id
 */
router.delete(
	"/:id",
	verifyAuth,
	ProjectsController.delete.bind(ProjectsController),
);

/**
 * API for calculating total material cost for a project
 * GET /api/projects/:id/material-cost
 */
router.get(
	"/:id/material-cost",
	verifyAuth,
	ProjectsController.materialCost.bind(ProjectsController),
);

export default router;
