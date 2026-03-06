import { Links, Outlet, Scripts, useLocation } from "react-router";
import type { Route } from "./+types/root";
import stylesheet from "./styles.css?url";
import Footer from "./components/Footer";

export const links: Route.LinksFunction = () => [
	{ rel: "stylesheet", href: stylesheet },
];

export default function App() {
	const location = useLocation();
	const hideFooter = location.pathname === "/login";

	return (
		<html lang="en" data-theme="light">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Links />
			</head>
			<body className="min-h-screen flex flex-col">
				<Outlet />
				{!hideFooter && <Footer />}
				<Scripts />
			</body>
		</html>
	);
}
