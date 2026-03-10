import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ModuleCard } from "../components/ModuleCard";
import foreman from "../assets/foreman_cropped.png";
import { getSupabaseClient } from "../lib/supabase";

export default function Foreman() {
	const navigate = useNavigate();
	const [firstName, setFirstName] = useState("Foreman");

	useEffect(() => {
		const loadFirstName = async () => {
			try {
				const supabase = getSupabaseClient();
				const {
					data: { session },
				} = await supabase.auth.getSession();
				const fullName = session?.user?.user_metadata?.name;
				if (typeof fullName === "string" && fullName.trim()) {
					const [name] = fullName.trim().split(/\s+/);
					if (name) setFirstName(name);
				}
			} catch {
				// Keep fallback heading if session lookup fails.
			}
		};

		loadFirstName();
	}, []);

	return (
		<main className="min-h-screen bg-background px-6">
			<div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-4xl flex-col items-center justify-center gap-6 py-10">
				<h1 className="text-[--tertiary-color] font-bold text-2xl md:text-3xl lg:text-4xl mb-6 flex items-center justify-center">
					Welcome {firstName}
				</h1>

				<div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row lg:items-start">
					<div className="flex w-full max-w-xl flex-col items-center gap-6">
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
					<div className="w-full max-w-md">
						<img src={foreman} alt="Foreman" className="w-full" />
					</div>
				</div>
			</div>
		</main>
	);
}
