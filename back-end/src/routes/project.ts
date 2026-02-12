import { Router } from "express";
import { projects } from "../faked/projects";

const router = Router();

// GET projects endpoint
router.get("/", (req, res) => {
	return res.status(200).json(projects);
});

export default router;
