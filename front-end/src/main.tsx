import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ToolsManagement from "./pages/ToolsManagement";
import ToolsCheck from "./pages/ToolsCheck";
import Layout from "./layouts/Layout";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: (
					<div className="flex justify-center items-center h-screen">
						<img
							src="/eztrack-logo.png"
							alt="eztrack logo"
							className="max-w-md"
						/>
					</div>
				),
			},
			{
				path: "/tools-management",
				element: <ToolsManagement />,
			},
			{
				path: "/tools-check",
				element: <ToolsCheck />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
