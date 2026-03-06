import { useState } from "react";
import { FilterBar } from "../components/FilterBar";
import { SearchBar } from "../components/SearchBar";
import ToolsManagement from "../features/tools/ToolsManagement";

export default function ToolsManagementRoute() {
	const TOOL_FILTERS = [
		{ value: "", label: "All" },
		{ value: "AVAILABLE", label: "Available" },
		{ value: "CHECKEDOUT", label: "Checked Out" },
		{ value: "ARCHIVE", label: "Archive" },
	];

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("");

	return (
		<>
			<main className="max-w-7xl mx-auto px-6 py-16 min-h-screen">
				<h1 className="text-[--tertiary-color] text-3xl font-bold mb-6 flex items-center justify-center">
					Tools Management
				</h1>
				<SearchBar
					value={search}
					onChange={setSearch}
					placeholder="Search Tool..."
				/>
				<FilterBar value={filter} onChange={setFilter} options={TOOL_FILTERS} />
				<ToolsManagement search={search} filter={filter} />
			</main>
		</>
	);
}
