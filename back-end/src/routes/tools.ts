import { Router } from "express";
import { tools } from "../faked/tools";

const router = Router();

// GET tools endpoint



// POST tools endpoint

router.post("/", (req, res) => {
    const fakedToolData = {
        id: "9d7aca13-0490-4dd7-9e23-d56d4eb64a1c",
        name: "Cordless Drill",
        status: "AVAILABLE",
        qty: 1,
    }

    return res.status(200).json(fakedToolData);
});

// DELETE tools endpoint

router.delete("/:id", (req, res) => {
    return res.status(200).json({ message: "Tool was deleted successfully." });
})

export default router;