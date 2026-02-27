import { supabase } from "../../lib/supabase";

export async function login(email: string, password: string) {
	const result = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	return result;
}

export async function logout() {
	const result = await supabase.auth.signOut();
	return result;
}
