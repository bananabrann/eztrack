import { ModuleCard } from "../components/ModuleCard";

export default function Foreman() {
	const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
		// no routing yet
	};

	return (
		<div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
			<div className="flex flex-col items-center gap-10">
				<h1 className="text-2xl font-semibold text-primary">Welcome Foreman</h1>

				<div className="flex flex-col gap-6">
					<ModuleCard label="Tool Management" onClick={handleClick} />
					<ModuleCard label="Materials Management" onClick={handleClick} />
					<ModuleCard label="Project Management" onClick={handleClick} />
				</div>
			</div>
		</div>
	);
}
