import { createClient } from "@supabase/supabase-js";

/**
 * Validate environment variables
 */
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
	throw new Error("Missing required Supabase environment variables");
}

/**
 * Initialize a single Supabase client
 */
const supabaseClient = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY,
);

export default supabaseClient;
