/**
 * Test Supabase connection on server startup
 */
export const testSupabaseConnection = async () => {
	try {
		// Supabase's Auth health check endpoint from documentation
		const healthUrl = `${process.env.SUPABASE_URL}/auth/v1/health`;

		const response = await fetch(healthUrl, {
			headers: {
				apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
			},
		});

		// Guard
		if (!response.ok) {
			const text = await response.text();
			throw new Error(`Health check failed: ${response.status} - ${text}`);
		}

		const health = await response.json();
		console.log("Supabase Connected:", health);
	} catch (error) {
		console.error(" Supabase connection error:", error);
	}
};
