import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
	import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
	throw new Error("VITE_SUPABASE_URL is required");
}

if (!supabaseKey) {
	throw new Error(
		"Supabase key is required. Set VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY."
	);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
