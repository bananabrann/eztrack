import { Router } from "express";
import ToolsController from "../controllers/tools-controller";
import { verifyAuth } from "../middleware/auth-middleware";

const router = Router();

/**
 * API for fetching all the tools with optional status filtering
 * GET /api/tools/
 */
router.get("/", verifyAuth, ToolsController.get.bind(ToolsController));

/**
 * API for creating a new tool (requires authentication)
 * POST /api/tools
 */
router.post("/", verifyAuth, ToolsController.post.bind(ToolsController));

/**
 * API for updating a tool
 * PATCH /api/tools/:id
 */
router.patch("/:id", verifyAuth, ToolsController.patch.bind(ToolsController));

/**
 * API for deleting a tool
 * DELETE /api/tools/:id
 */
router.delete("/:id", verifyAuth, ToolsController.delete.bind(ToolsController));

/**
 * API for checkout a tool and track when/who
 * POST /api/tools/:id/checkout
 */
router.post(
	"/:id/checkout",
	verifyAuth,
	ToolsController.checkout.bind(ToolsController),
);

/**
 * RETURN Tools Endpoint
 * return a tool and mark the tool as available again
 */
router.post(
	"/:id/return",
	verifyAuth,
	ToolsController.return.bind(ToolsController),
);

export default router;
