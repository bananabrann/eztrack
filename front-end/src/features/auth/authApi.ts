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

/**
 * Returns the current Supabase access token, or null if not authenticated
 */
export async function getAccessToken(): Promise<string | null> {
	const supabase = getSupabaseClient();
	const { data } = await supabase.auth.getSession();
	return data.session?.access_token ?? null;
}

/**
 * Signup function
 */
export async function signUp(
	email: string,
	password: string,
	name: string,
	role: string,
) {
	const supabase = getSupabaseClient();
	const result = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				name,
				role,
			},
		},
	});
	return result;
}
