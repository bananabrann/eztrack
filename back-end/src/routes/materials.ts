import { Router } from "express";
import { verifyAuth } from "../middleware/auth-middleware";
import MaterialsController from "../controllers/materials-controller";

const router = Router();

/**
 * API for retrieving all materials with optional project_id filtering
 * GET /api/materials
 */
router.get("/", verifyAuth, MaterialsController.get.bind(MaterialsController));

/**
 * API for retrieving low stock materials
 * GET /api/materials/low-stock
 */
router.get(
	"/low-stock",
	verifyAuth,
	MaterialsController.getLowStock.bind(MaterialsController),
);

/**
 * API for creating a new material
 * POST /api/materials
 */
router.post(
	"/",
	verifyAuth,
	MaterialsController.post.bind(MaterialsController),
);

/**
 * API for updating a material
 * PATCH /api/materials/:id
 */
router.patch(
	"/:id",
	verifyAuth,
	MaterialsController.patch.bind(MaterialsController),
);

/**
 * API for deleting a material
 * DELETE /api/materials/:id
 */
router.delete(
	"/:id",
	verifyAuth,
	MaterialsController.delete.bind(MaterialsController),
);

/**
 * API for creating a material usage record
 * POST /api/materials/:id/usage
 */
router.post(
	"/:id/usage",
	verifyAuth,
	MaterialsController.createUsage.bind(MaterialsController),
);

export default router;
