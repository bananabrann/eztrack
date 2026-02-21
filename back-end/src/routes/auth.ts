import { Router, Request, Response } from "express";
import {
	verifyAuth,
	UserRole,
	requireRole,
} from "../middleware/auth-middleware";

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

// TODO all these tests can be deleted later 
// Only FOREMAN can access
router.get(
	"/foreman-only",
	verifyAuth,
	requireRole([UserRole.FOREMAN]),
	(req: Request, res: Response) => {
		res.status(200).json({
			message: "Only FORMANs can access this",
			user: req.authUser,
		});
	},
);

// Only CREW can access
router.get(
	"/crew-only",
	verifyAuth,
	requireRole([UserRole.CREW]),
	(req: Request, res: Response) => {
		res.status(200).json({
			message: "Only CREW can access this",
			user: req.authUser,
		});
	},
);

/**
 * Test endpoint: Both FOREMAN and CREW can access
 */
router.get(
	"/both",
	verifyAuth,
	requireRole([UserRole.FOREMAN, UserRole.CREW]),
	(req: Request, res: Response) => {
		res.status(200).json({
			message: "You are authorized",
			user: req.authUser,
		});
	},
);

export default router;
