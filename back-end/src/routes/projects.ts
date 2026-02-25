import { Router } from "express";
import { materialUsage } from "../faked/materialUsage";
import { materials } from "../faked/materials";
import { verifyAuth } from "../middleware/auth-middleware";
import ProjectsController from "../controllers/projects-controller";

const router = Router();

/**
 * API for retrieving all projects with optional status filtering
 * GET /api/projects
 */
router.get("/", verifyAuth, ProjectsController.get.bind(ProjectsController));

/**
 * API for creating new project
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
 * GET /api/:id/material-cost
 * calculate the total material cost for a project
*/

router.get("/:id/material-cost", (req, res) => {
  const projectId = req.params.id;

	const usageRows = materialUsage.filter(
    usage => usage.projectId === projectId,
	);

	if (usageRows.length === 0) {
    return res.status(200).json({
      projectId,
			totalCost: 0,
			materials: [],
		});
	}

	let totalCost = 0;

	const materialsList = usageRows
  .map(usage => {
    const material = materials.find(m => m.id === usage.materialId);
    if (!material) return null;

    totalCost += usage.totalCost;

    return {
      materialId: material.id,
      name: material.name,
      quantityUsed: usage.quantityUsed,
      unitCost: material.unitCost,
      cost: usage.totalCost,
    };
  })
  .filter(Boolean);

	return res.status(200).json({
    projectId,
		totalCost,
		materials: materialsList,
	});
});

export default router;

/**
 * GET /api/:id/material-cost
 * calculate the total material cost for a project
 */

router.get("/:id/material-cost", (req, res) => {
	const projectId = req.params.id;

	const usageRows = materialUsage.filter(
		usage => usage.projectId === projectId,
	);

	if (usageRows.length === 0) {
		return res.status(200).json({
			projectId,
			totalCost: 0,
			materials: [],
		});
	}

	let totalCost = 0;

	const materialsList = usageRows
		.map(usage => {
			const material = materials.find(m => m.id === usage.materialId);
			if (!material) return null;

			totalCost += usage.totalCost;

			return {
				materialId: material.id,
				name: material.name,
				quantityUsed: usage.quantityUsed,
				unitCost: material.unitCost,
				cost: usage.totalCost,
			};
		})
		.filter(Boolean);

	return res.status(200).json({
		projectId,
		totalCost,
		materials: materialsList,
	});
});
