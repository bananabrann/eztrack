import { useNavigate } from "react-router";
import { ModuleCard } from "../components/ModuleCard";
import foreman from "../assets/foreman_cropped.png";

export default function Foreman() {
	const navigate = useNavigate();

	return (
		<main className="min-h-screen bg-background px-6">
			<div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-xl flex-col items-center justify-center gap-6 py-10">
				<h1 className="text-[--tertiary-color] font-bold text-2xl md:text-3xl lg:text-4xl mb-6 flex items-center justify-center">
					Welcome Foreman
				</h1>

				<div className="flex w-full flex-col items-center gap-6">
					<ModuleCard
						label="Tool Management"
						onClick={() => navigate("/toolsManagement")}
					/>
					<ModuleCard
						label="Materials Management"
						onClick={() => navigate("/materials")}
					/>
					<ModuleCard
						label="Project Management"
						onClick={() => navigate("/projects")}
					/>
				</div>
				<div className="mt-10">
					<img src={foreman} alt="Foreman" className="w-64 h-auto" />
				</div>
			</div>
		</main>
	);
}
