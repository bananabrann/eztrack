import { Router } from "express";
import { materials } from "../faked/materials";

const router = Router();

// GET materials endpoint
router.get("/", (req, res) => {
	return res.status(200).json(materials);
});

export default router;
