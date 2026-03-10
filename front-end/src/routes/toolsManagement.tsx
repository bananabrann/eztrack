import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { FilterBar } from "../components/FilterBar";
import { SearchBar } from "../components/SearchBar";
import ToolsManagement from "../features/tools/ToolsManagement";
import { getProjects } from "../api/projects-api";

export default function ToolsManagementRoute() {
	const outletContext = useOutletContext<{ role: string | null } | undefined>();
	const role = outletContext?.role ?? null;
	const isForeman = role === "FOREMAN";

	const TOOL_FILTERS = [
		{ value: "AVAILABLE", label: "Available" },
		{ value: "CHECKEDOUT", label: "Checked Out" },
		{ value: "ARCHIVE", label: "Archive" },
	];

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("");
	const [projectFilter, setProjectFilter] = useState("");
	const [projectOptions, setProjectOptions] = useState<
		{ value: string; label: string }[]
	>([]);

	useEffect(() => {
		const loadProjects = async () => {
			try {
				const response = await getProjects();
				const options = response.data.map(p => ({
					value: p.id,
					label: p.project_name,
				}));
				setProjectOptions([...options]);
			} catch (error) {
				console.error("Failed to fetch projects for filter:", error);
			}
		};
		loadProjects();
	}, []);

	return (
		<>
			<main className="max-w-7xl mx-auto px-6 py-16 min-h-screen">
				<h1 className="text-[--tertiary-color] font-bold text-2xl md:text-3xl lg:text-4xl mb-6 flex items-center justify-center">
					Tools Management
				</h1>
				<div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-3xl mx-auto">
					<div className="flex-1">
						<SearchBar
							value={search}
							onChange={setSearch}
							placeholder="Search Tool..."
						/>
					</div>
					<div className="flex-1">
						<FilterBar
							value={filter}
							onChange={setFilter}
							options={TOOL_FILTERS}
							label="Filter Status"
						/>
					</div>
					<div className="flex-1">
						<FilterBar
							value={projectFilter}
							onChange={setProjectFilter}
							options={projectOptions}
							label="Filter Project"
						/>
					</div>
				</div>
				<ToolsManagement
					search={search}
					filter={{
						status: filter ? (filter as any) : undefined,
						project_id: projectFilter ? projectFilter : undefined,
					}}
					isForeman={isForeman}
				/>
			</main>
		</>
	);
}
