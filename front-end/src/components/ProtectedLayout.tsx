import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import Header from "./Header";
import { getSupabaseClient } from "../lib/supabase";

export default function ProtectedLayout() {
	const navigate = useNavigate();
	const location = useLocation();
	const supabase = getSupabaseClient();
	const [isLoading, setIsLoading] = useState(true);
	const [userRole, setUserRole] = useState<string | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			setIsLoading(true);
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				setIsLoading(false);
				navigate("/login", { replace: true });
				return;
			}

			// Fetch user role from backend auth endpoint
			const response = await fetch("/api/auth/me", {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			});

			if (response.status === 401) {
				setIsLoading(false);
				navigate("/login", { replace: true });
				return;
			}

			let role = null;
			if (response.ok) {
				const me = await response.json();
				role = me.role?.toUpperCase() || null;
				setUserRole(role);
			} else {
				console.error("Failed to fetch user role from /api/auth/me");
			}

			// Granular route protection
			if (role === "CREW") {
				const path = location.pathname.toLowerCase();
				if (path.startsWith("/materials") || path.startsWith("/projects")) {
					navigate("/dashboard/crew", { replace: true });
				}
			}

			setIsLoading(false);
		};

		checkAuth();
	}, [navigate, supabase, location.pathname]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				<p className="text-xl">Loading...</p>
			</div>
		);
	}

	return (
		<>
			<Header role={userRole} />
			<main>
				<Outlet context={{ role: userRole }} />
			</main>
		</>
	);
}
