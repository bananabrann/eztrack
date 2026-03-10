import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { ModuleCard } from "../components/ModuleCard";
import foreman from "../assets/foreman_cropped.png";
import { getSupabaseClient } from "../lib/supabase";

import { Boxes, Calendar, Clock, FolderKanban, Toolbox } from "lucide-react";

export default function Foreman() {
	const navigate = useNavigate();
	const [firstName, setFirstName] = useState("Foreman");
	const [currentTime, setCurrentTime] = useState(
		new Intl.DateTimeFormat("en-US", {
			hour: "numeric",
			minute: "2-digit",
			second: "2-digit",
		}).format(new Date()),
	);

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

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setCurrentTime(
				new Intl.DateTimeFormat("en-US", {
					hour: "numeric",
					minute: "2-digit",
					second: "2-digit",
				}).format(new Date()),
			);
		}, 1000);

		return () => window.clearInterval(intervalId);
	}, []);

	return (
		<main className="min-h-screen bg-background px-6">
			<div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-4xl flex-col items-center justify-center gap-6 py-10">
				<h1 className="text-[--tertiary-color] font-bold text-2xl md:text-3xl lg:text-4xl flex items-center justify-center">
					Welcome {firstName}
				</h1>
				<p className="flex items-center gap-4 text-md text-muted-foreground whitespace-nowrap">
					<span className="inline-flex items-center gap-2">
						<Calendar className="h-5 w-5" aria-hidden="true" />
						{new Date().toLocaleDateString(undefined, {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
					<span className="inline-flex items-center gap-2">
						<Clock className="h-5 w-5" aria-hidden="true" />
						{currentTime}
					</span>
				</p>

				<div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row lg:items-end">
					<div className="flex w-full max-w-md flex-col items-center gap-6">
						<ModuleCard
							label="Tool Management"
							variant="blue"
							icon={<Toolbox className="h-7 w-7" aria-hidden="true" />}
							onClick={() => navigate("/toolsManagement")}
						/>
						<ModuleCard
							label="Materials Management"
							variant="blue"
							icon={<Boxes className="h-7 w-7" aria-hidden="true" />}
							onClick={() => navigate("/materials")}
						/>
						<ModuleCard
							label="Project Management"
							variant="blue"
							icon={<FolderKanban className="h-7 w-7" aria-hidden="true" />}
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
