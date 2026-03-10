import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import crew from "../assets/crew_cropped.png";
import { getSupabaseClient } from "../lib/supabase";
import { Calendar, Clock, Toolbox } from "lucide-react";
import { toolsApi } from "../api/tools-api";
import { getProjects } from "../api/projects-api";
import { ModuleCard } from "../components/ModuleCard";

export default function Crew() {
	const navigate = useNavigate();
	const [firstName, setFirstName] = useState("Crew");
	const [currentProjectName, setCurrentProjectName] = useState("Loading...");
	const [checkedOutToolNames, setCheckedOutToolNames] = useState<string[]>([]);
	const [currentTime, setCurrentTime] = useState(
		new Intl.DateTimeFormat("en-US", {
			hour: "numeric",
			minute: "2-digit",
			second: "2-digit",
		}).format(new Date()),
	);
	const currentDate = new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(new Date());

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
		const loadCurrentProject = async () => {
			try {
				const [{ data: tools }, { data: projects }] = await Promise.all([
					toolsApi.getAll({ status: "CHECKEDOUT" }),
					getProjects("ACTIVE"),
				]);

				const myCheckedOutTools = tools.filter(tool => tool.checked_out_by_me);
				setCheckedOutToolNames(myCheckedOutTools.map(tool => tool.name));
				const myCheckedOutToolsWithProject = myCheckedOutTools.filter(
					tool => tool.project_id,
				);

				if (myCheckedOutToolsWithProject.length === 0) {
					setCurrentProjectName("No active project assigned");
					return;
				}

				// Select project with most currently checked-out tools by this user.
				const projectUsageCount = new Map<string, number>();
				for (const tool of myCheckedOutToolsWithProject) {
					const projectId = tool.project_id;
					if (!projectId) continue;
					projectUsageCount.set(projectId, (projectUsageCount.get(projectId) ?? 0) + 1);
				}

				const [projectId] = [...projectUsageCount.entries()].sort(
					(a, b) => b[1] - a[1],
				)[0] ?? [undefined];

				if (!projectId) {
					setCurrentProjectName("No active project assigned");
					return;
				}

				const project = projects.find(p => p.id === projectId);
				setCurrentProjectName(project?.project_name ?? "Unknown active project");
			} catch {
				setCurrentProjectName("Unable to load project");
				setCheckedOutToolNames([]);
			}
		};

		loadCurrentProject();
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
		<main className="min-h-screen bg-background px-2">
			<div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-4xl flex-col items-center justify-start gap-6 py-6">

				<div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row lg:items-end">
					<div className="flex w-full max-w-xl flex-col items-center gap-6 lg:self-end">
						<div className="card w-full max-w-md bg-base-100 card-sm shadow-sm">
							<div className="card-body">
								<h2 className="card-title text-[--tertiary-color] font-bold text-xl md:text-xl lg:text-2xl">Welcome, {firstName}</h2>
								<h4 className="text-md">Current Project: {currentProjectName}</h4>
								<h4 className="text-md mb-3">
									Checked Out Tools:{" "}
									{checkedOutToolNames.length > 0
										? checkedOutToolNames.join(", ")
										: "No tools checked out"}
								</h4>
								<h4 className="text-md">
									<Calendar className="inline-block mr-2 text-[--tertiary-color]" />
									{currentDate}
								</h4>
								<h4 className="text-md">
									<Clock className="inline-block mr-2 text-[--tertiary-color]" />
									{currentTime}
								</h4>

							</div>
						</div>
						<div className="w-full max-w-md">
							<ModuleCard
								label="Tool Management"
								variant="blue"
								icon={<Toolbox className="h-7 w-7" aria-hidden="true" />}
								onClick={() => navigate("/toolsManagement")}
							/>
						</div>
					</div>
					<div className="w-full max-w-md lg:self-end">
						<img src={crew} alt="Crew" className="w-full" />
					</div>
				</div>
			</div>
		</main>
	);
}
