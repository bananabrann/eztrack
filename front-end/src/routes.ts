import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
	// redirect "/" -> "/login"
	index("./routes/_index.tsx"),
	// routes to login page
	route("login", "./routes/login.tsx"),
	// routes to tools page
	route("tools", "./routes/tools.tsx"),
	// routes to tools management page
	route("toolsManagement", "./routes/toolsManagement.tsx"),
	// routes to materials page
	route("materials", "./routes/materials.tsx"),
	// routes to projects page
	route("projects", "./routes/projects.tsx"),
	// routes to dashboard page
	route("dashboard", "./routes/dashboard.tsx"),
	// routes to foremand dashboard
	route("dashboard/foreman", "./routes/dashboard.foreman.tsx"),
	// routes to crew dashboard
	route("dashboard/crew", "./routes/dashboard.crew.tsx"),
] satisfies RouteConfig;
