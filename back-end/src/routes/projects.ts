import { Router } from "express";

import { projects } from "../fake/projects";

const router = Router();

// DELETE project endpoint

router.delete("/:id", (req, res) => {
	return res.status(200).json({ message: "Project was deleted successfully." });
});

export default router;
