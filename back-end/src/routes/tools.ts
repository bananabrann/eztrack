import crypto from "crypto";
import { Router } from "express";
import { tools } from "../faked/tools";
import { toolManagement } from "../faked/toolManagement";

const router = Router();

/**
 * API for fetching all the tools
 * GET /api/tools/
 */
router.get("/", (req, res) => {
	return res.status(200).json({ tools });
});

// POST tools endpoint

router.post("/", (req, res) => {
	const fakedToolData = {
		id: "9d7aca13-0490-4dd7-9e23-d56d4eb64a1c",
		name: "Cordless Drill",
		status: "AVAILABLE",
		qty: 1,
	};

	return res.status(200).json(fakedToolData);
});

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

// DELETE tools endpoint

router.delete("/:id", (req, res) => {
	return res.status(200).json({ message: "Tool was deleted successfully." });
});

export default router;
