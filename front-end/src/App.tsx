import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ToolsManagement from "./components/ToolsManagement";
import ToolsCheck from "./components/ToolsCheck";

function App() {
	return (
		<>
			<Header />

			<Routes>
				<Route
					path="/"
					element={
						<div className="flex justify-center items-center h-screen">
							<img
								src="/eztrack-logo.png"
								alt="eztrack logo"
								className="max-w-md"
							/>
						</div>
					}
				/>

				<Route path="/tools-management" element={<ToolsManagement />} />
				<Route path="/tools-check" element={<ToolsCheck />} />
			</Routes>
		</>
	);
}

export default App;
