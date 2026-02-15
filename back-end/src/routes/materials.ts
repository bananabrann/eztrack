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
	const updateData = req.body;

	const materialIndex = materials.findIndex(
		material => material.id === materialId,
	);

	if (materialIndex === -1) {
		return res.status(404).json({ message: "Material not found" });
	}

	// update the material
	materials[materialIndex] = { ...materials[materialIndex], ...updateData };
	const updatedMaterial = materials[materialIndex];
	return res.status(200).json(updatedMaterial);
});

/**
 * API for deleting a material from a project
 * DELETE /api/materials/:id
 */
router.delete("/:id", (req, res) => {
	const materialId = req.params.id;

	const materialIndex = materials.findIndex(m => m.id === materialId);
	if (materialIndex === -1) {
		return res.status(404).json({ message: "Material not found" });
	}

	// Remove the material from the fake data
	materials.splice(materialIndex, 1);

	return res
		.status(200)
		.json({ message: `Material ${materialId} deleted successfully.` });
});

export default router;
