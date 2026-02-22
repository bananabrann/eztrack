import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error(
		"Missing Supabase env vars. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
	);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
