import crypto from "crypto";
import { Router } from "express";
import { tools } from "../faked/tools";
import { toolManagement } from "../faked/toolManagement";
import ToolsController from "../controllers/tools-controller";
import { verifyAuth } from "../middleware/auth-middleware";

const router = Router();

/**
 * API for fetching all the tools with optional status filtering
 * GET /api/tools/
 */
router.get("/", ToolsController.get.bind(ToolsController));

/**
 * API for creating a new tool (requires authentication)
 * POST /api/tools
 */
router.post("/", verifyAuth, ToolsController.post.bind(ToolsController));
// POST tools endpoint

// router.post("/", (req, res) => {
// 	const fakedToolData = {
// 		id: "9d7aca13-0490-4dd7-9e23-d56d4eb64a1c",
// 		name: "Cordless Drill",
// 		status: "AVAILABLE",
// 		qty: 1,
// 	};

// 	return res.status(200).json(fakedToolData);
// });

/**
 * POST /api/tools/:id/checkout
 * checkout a tool and track when/who
 */
router.post("/:id/checkout", (req, res) => {
	const toolId = req.params.id;
	const toolIdx = tools.findIndex(tool => tool.id === toolId);
	if (toolIdx === -1) {
		return res.status(404).json({ message: "Tool not found" });
	}
	const tool = tools[toolIdx];

	if (tool.status !== "AVAILABLE") {
		return res.status(404).json({ message: "Tool is not available" });
	}

	tools[toolIdx] = { ...tool, status: "CHECKEDOUT" };

	const checkoutId = crypto.randomUUID();
	const checkedOut = new Date().toISOString();
	const userId = "1";
	toolManagement.push({
		id: checkoutId,
		toolId,
		userId,
		checkedOut: checkedOut,
		checkedIn: null,
	});

	return res.status(200).json({
		checkoutId,
		toolId,
		userId,
		checkedOut,
		message: "Tool checked out successfully",
	});
});

/**
 * DELETE tools endpoint
 * delete a tool
 */
router.delete("/:id", (req, res) => {
	return res.status(200).json({ message: "Tool was deleted successfully." });
});

export default router;

/**
 * RETURN Tools Endpoint
 * return a tool and mark the tool as available again
 */

router.post("/:id/return", (req, res) => {
	const toolId = req.params.id;
	const toolIdx = tools.findIndex(tool => tool.id === toolId);

	if (toolIdx === -1) {
		return res.status(404).json({ message: "Tool not found" });
	}

	const tool = tools[toolIdx];

	if (tool.status !== "CHECKEDOUT") {
		return res.status(404).json({ message: "Tool is not checked out" });
	}

	tools[toolIdx] = { ...tool, status: "AVAILABLE" };

	const recordIdx = toolManagement.findIndex(
		record => record.toolId === toolId && record.checkedIn === null,
	);

	if (recordIdx === -1) {
		return res.status(500).json({ message: "No active checkout record found" });
	}

	const checkedIn = new Date().toISOString();
	toolManagement[recordIdx].checkedIn = checkedIn;

	return res.status(200).json({
		toolId,
		checkedIn,
		message: "Tool returned successfully",
	});
});
