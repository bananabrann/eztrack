import { Navigate, useOutletContext } from "react-router";

export default function IndexRedirect() {
	const { role } = useOutletContext<{ role: string | null }>();

	if (role === "CREW") {
		return <Navigate to="/dashboard/crew" replace />;
	}

	if (role === "FOREMAN") {
		return <Navigate to="/dashboard/foreman" replace />;
	}

	// fallback if role is unrecognized or null
	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
			<h1 className="text-2xl font-bold mb-2">Unrecognized Role</h1>
			<p>Your account does not have a recognized role associated with it.</p>
		</main>
	);
}
