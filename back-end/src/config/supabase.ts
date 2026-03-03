import { createClient } from "@supabase/supabase-js";

/**
 * Validate environment variables
 */
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
	throw new Error("Missing required Supabase environment variables");
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

/**
 * App-level Supabase client (no user JWT attached).
 */
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Request-scoped client with Authorization header so RLS evaluates auth.uid()
 * for the current user.
 */
export const createSupabaseUserClient = (accessToken: string) =>
	createClient(supabaseUrl, supabaseAnonKey, {
		global: {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	});

export default supabaseClient;
