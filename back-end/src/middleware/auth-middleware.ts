import { Request, Response, NextFunction } from "express";
import supabaseClient from "../config/supabase";

/**
 * Extend Express Request to include authUser
 */
declare global {
	namespace Express {
		interface Request {
			authUser?: {
				id: string;
				email?: string;
			};
		}
	}
}

/**
 * Middleware to verify Supabase JWT tokens
 * Checks Authorization header for Bearer token and validates it
 */
// export const verifyAuth = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) = {
//   try {

//   }
// }
