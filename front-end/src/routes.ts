import {
	type RouteConfig,
	route,
	index,
	layout,
} from "@react-router/dev/routes";

export default [
	// routes to login page
	route("login", "./routes/login.tsx"),

	layout("./components/ProtectedLayout.tsx", [
		// redirect "/" -> "/login" or dashboard based on role
		index("./routes/_index.tsx"),
		// routes to tools page
		route("tools", "./routes/tools.tsx"),
		// routes to tools management page
		route("toolsManagement", "./routes/toolsManagement.tsx"),
		// routes to materials page
		route("materials", "./routes/materials.tsx"),
		// routes to projects page
		route("projects", "./routes/projects.tsx"),
		// routes to foremand dashboard
		route("dashboard/foreman", "./routes/dashboard.foreman.tsx"),
		// routes to crew dashboard
		route("dashboard/crew", "./routes/dashboard.crew.tsx"),
	]),

	route("*", "./routes/404.Not.Found.tsx"),
] satisfies RouteConfig;
