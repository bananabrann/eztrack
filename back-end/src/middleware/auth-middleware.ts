import { Request, Response, NextFunction } from "express";
import supabaseClient from "../config/supabase";

/**
 * User roles enum in Supabase database
 */
export enum UserRole {
	FOREMAN = "FOREMAN",
	CREW = "CREW",
}

/**
 * Extend Express Request type to include our custom authUser property
 * Express don't have build-in authUser that's why we declare global
 */
declare global {
	namespace Express {
		interface Request {
			authUser?: {
				id: string;
				name?: string;
				email?: string;
				role?: UserRole;
			};
		}
	}
}

/**
 * Middleware to verify Supabase JWT tokens
 * Checks Authorization header for Bearer token and validates it
 */
export const verifyAuth = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		// Extract JWT token from Authorization header, split by space and take the second part
		const token = req.headers.authorization?.split(" ")[1];

		// If token is not found, user is not authenticated
		if (!token) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		// Validate the JWT token with Supabase, this verifies the token signature
		const {
			data: { user },
			error,
		} = await supabaseClient.auth.getUser(token);

		// If token is invalid or expired, reject the request
		if (error || !user) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		// Fetch the user's profile from the database
		const { data: account, error: accountError } = await supabaseClient
			.from("accounts")
			.select("role, name")
			.eq("id", user.id)
			.single();

		// Guard error for fetching
		if (accountError) {
			res.status(500).json({ error: "Failed to fetch user profile" });
			return;
		}

		// Attach user data to the request object, this makes user info available in all subsequent route handlers
		req.authUser = {
			id: user.id,
			email: user.email,
			name: account.name,
			role: account.role as UserRole,
		};

		// User is authenticated, proceed to the next route handler
		next();
	} catch (error) {
		res.status(500).json({ error: "Authentication failed" });
	}
};
