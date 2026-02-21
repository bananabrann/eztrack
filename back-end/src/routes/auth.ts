import { Router, Request, Response } from "express";
import { verifyAuth } from "../middleware/auth-middleware";

const router = Router();

/**
 * GET /api/auth/me
 * Retrieve current users profile information
 * Protected route - this requires valid JWT token in Authorization header
 */
router.get("/me", verifyAuth, (req: Request, res: Response) => {
	try {
		// authUser is attached by verifyAuth middleware
		if (!req.authUser) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		// Return user profile data
		res.status(200).json({
			id: req.authUser.id,
			email: req.authUser.email,
			name: req.authUser.name,
			role: req.authUser.role,
		});
	} catch (error) {
		res.status(500).json({ error: "Failed to retrieve user profile" });
	}
});

export default router;
