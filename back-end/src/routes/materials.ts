import { Router } from "express";

const router = Router();

/**
 * API for deleting a material from a project
 * DELETE /api/materials/:id
 */
router.delete("/:id", (req, res) => {
	const materialId = req.params.id;
	// TODO: Implement actual deletion logic using materialId
	return res
		.status(200)
		.json({ message: `Materials ${materialId} was deleted successfully.` });
});

export default router;
