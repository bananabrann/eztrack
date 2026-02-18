import { Router } from "express";

import { materials } from "../faked/materials";

const randUUID = crypto.randomUUID();

const router = Router();
// GET materials endpoint
router.get("/", (req, res) => {
	return res.status(200).json(materials);
});

// POST materials endpoint
router.post("/", (req, res) => {
	const { name, unitQty, unitCost, lowStockThreshold, projectId } =
		req.body ?? {};

	if (name.trim().length === 0 || typeof name !== "string") {
		return res.status(400).json({ error: "Invalid name" });
	}

	if (projectId.trim().length === 0 || typeof projectId !== "string") {
		return res.status(400).json({ error: "Invalid projectId" });
	}

	if (typeof unitQty !== "number" || unitQty < 0) {
		return res.status(400).json({ error: "Invalid unitQty" });
	}

	if (typeof unitCost !== "number" || unitCost < 0) {
		return res.status(400).json({ error: "Invalid unitCost" });
	}

	if (typeof lowStockThreshold !== "number" || lowStockThreshold < 0) {
		return res.status(400).json({ error: "Invalid lowStockThreshold" });
	}

	const newMaterial = {
		id: randUUID,
		name: name.trim(),
		unitQty,
		unitCost,
		lowStockThreshold,
		projectId: projectId.trim(),
	};

	materials.push(newMaterial);

	return res.status(200).json(newMaterial);
});

// GET low stock materials
router.get("/low-stock-alerts", (req, res) => {
	const lowStockMaterial = materials.filter(
		material => material.unitQty < material.lowStockThreshold,
	);

	return res.status(200).json(
		lowStockMaterial.map(material => ({
			id: material.id,
			name: material.name,
			unitQty: material.unitQty,
			lowStockMaterial: material.lowStockThreshold,
			projectId: material.projectId,
		})),
	);
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
