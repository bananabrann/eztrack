import { Links, Outlet, Scripts } from "react-router";
import type { Route } from "./+types/root";
import stylesheet from "./styles.css?url";

import Header from "./components/Header";

export const links: Route.LinksFunction = () => [
	{ rel: "stylesheet", href: stylesheet },
];

export default function App() {
	return (
		<html lang="en" data-theme="light">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Links />
			</head>
			<body>
				<Header />
				<Outlet />
				<Scripts />
			</body>
		</html>
	);
}
