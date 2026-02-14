import Header from "./components/Header";
import ToolsManagement from "./components/ToolsManagement";

function App() {
	return (
		<>
			<Header />
			<ToolsManagement />
			<div className="flex justify-center items-center h-screen">
				<img src="/eztrack-logo.png" alt="eztrack logo" className="max-w-md" />
			</div>
		</>
	);
}

export default App;
