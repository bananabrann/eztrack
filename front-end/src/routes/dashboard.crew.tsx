import { useNavigate } from "react-router";
import { ModuleCard } from "../components/ModuleCard";

export default function Crew() {
	const navigate = useNavigate();
	const handleToolsClick = () => navigate("/toolsManagement");

	return (
		<main className="min-h-screen bg-background px-6">
			<div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-xl flex-col items-center justify-center gap-6 py-10">
				<h1 className="text-[--tertiary-color] font-bold text-2xl md:text-3xl lg:text-4xl mb-6 flex items-center justify-center">
					Welcome Crew
				</h1>

				<div className="flex w-full flex-col items-center gap-6">
					<ModuleCard label="Tool Management" onClick={handleToolsClick} />
				</div>
			</div>
		</main>
	);
}
