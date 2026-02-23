import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    // redirect "/" -> "/login"
    index("./routes/_index.tsx"),
    // routes to login page
    route("login", "./routes/login.tsx"),

] satisfies RouteConfig;