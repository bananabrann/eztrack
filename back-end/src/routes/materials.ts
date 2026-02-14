import { Router } from "express";

const router = Router();

/**
 * API for updating a material from a project
 * PATCH /api/materials/:id
 */
router.patch("/:id", (req, res) => {
	const materialId = req.params.id;
	const updateData = req.body;

	// TODO: Implement actual update logic using materialId and updateData
	// For now, return a mock updated material
	const updatedMaterial = {
		id: materialId,
		name: updateData.name,
		unitQty: updateData.unitQty,
		unitCost: updateData.unitCost,
		lowStockThreshold: updateData.lowStockThreshold,
		projectId: "proj-324827364-ag4s3g2837",
	};
	return res.status(200).json(updatedMaterial);
});

export default router;
