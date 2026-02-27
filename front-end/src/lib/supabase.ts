import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
	import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingEnvVars = [
	!supabaseUrl && "VITE_SUPABASE_URL",
	!supabaseKey && "VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)",
].filter(Boolean);

let supabaseClient: SupabaseClient | null = null;
if (missingEnvVars.length === 0 && supabaseUrl && supabaseKey) {
	supabaseClient = createClient(supabaseUrl, supabaseKey);
}

export function getSupabaseClient() {
	if (!supabaseClient) {
		throw new Error(`Missing Supabase environment variable(s): ${missingEnvVars.join(", ")}`);
	}
	return supabaseClient;
}
