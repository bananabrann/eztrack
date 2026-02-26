import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    // redirect "/" -> "/login"
    index("./routes/_index.tsx"),
    // routes to login page
    route("login", "./routes/login.tsx"),
    // routes to dashboard page
    route("dashboard", "./routes/dashboard.tsx"),
    // routes to foreman dashboard
    route("dashboard/foreman", "./routes/dashboard.foreman.tsx"),
    // routes to crew dashboard
    route("dashboard/crew", "./routes/dashboard.crew.tsx"),
] satisfies RouteConfig;