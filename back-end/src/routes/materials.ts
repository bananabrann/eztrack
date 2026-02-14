import { Router } from "express";


import { materials } from "../faked/materials";

const router = Router();

// GET materials endpoint
router.get("/", (req, res) => {
	return res.status(200).json(materials);
});

/**
 * API for updating a material from a project
 * PATCH /api/materials/:id
 */
router.patch("/:id", (req, res) => {
	const materialId = req.params.id;
  const updateData = req.body

	// TODO: Implement actual update logic using materialId and updateData
// For now, return a mock updated material
  const updatedMaterial = {
    id: materialId,
    name: updateData.name,
    unitQty: updateData.unitQty,
    unitCost: updateData.unitCost,
    lowStockThreshold: updateData.lowStockThreshold,
projectId: "projec"
  }
	return res
		.status(200)
		.json({ message: `Materials ${materialId} was deleted successfully.` });
});

export default router;
