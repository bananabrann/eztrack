import { ModuleCard } from "../../src/components/ModuleCard";

export default function Foreman() {
	const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
		// no routing yet
	};
return (
  <main className="min-h-screen bg-background px-6">
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-xl flex-col items-center justify-center gap-6 py-10">
      <h1 className="text-2xl font-semibold text-primary">
        Welcome Foreman
      </h1>

      <div className="flex w-full flex-col items-center gap-6">
        <ModuleCard label="Tool Management" onClick={handleClick} />
        <ModuleCard label="Materials Management" onClick={handleClick} />
        <ModuleCard label="Project Management" onClick={handleClick} />
      </div>
    </div>
  </main>
);
}
