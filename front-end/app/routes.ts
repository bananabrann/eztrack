import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    // redirect "/" -> "/login"
    index("./routes/_index.tsx"),
    // routes to login page
    route("login", "./routes/login.tsx"),
    // routes to tools page
	route("tools", "./routes/tools.tsx"),
    // routes to materials page
	route("materials", "./routes/materials.tsx"),
    // routes to projects page
	route("projects", "./routes/projects.tsx"),

] satisfies RouteConfig;