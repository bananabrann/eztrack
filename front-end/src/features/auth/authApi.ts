import { getSupabaseClient } from "../../lib/supabase";

export async function login(email: string, password: string) {
	const supabase = getSupabaseClient();
	const result = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	return result;
}

export async function logout() {
	const supabase = getSupabaseClient();
	const result = await supabase.auth.signOut();
	return result;
}
