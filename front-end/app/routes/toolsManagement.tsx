import { useState } from "react";
import { FilterBar } from "../../src/components/FilterBar";
import { SearchBar } from "../../src/components/SearchBar";
import ToolsManagement from "../../src/components/ToolsManagement";

export default function ToolsManagementRoute() {
	const TOOL_FILTERS = [
		{ value: "AVAILABLE", label: "Available" },
		{ value: "CHECKEDOUT", label: "Checkedout" },
		{ value: "ARCHIVE", label: "Archive" },
	];

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("");

	return (
		<>
			<main className="max-w-7xl mx-auto px-6 py-16">
				<h1 className="text-[--tertiary-color] text-3xl font-bold mb-6 flex items-center justify-center">
					Tools Management
				</h1>
				<SearchBar
					value={search}
					onChange={setSearch}
					placeholder="Search Tool..."
				/>
				<FilterBar value={filter} onChange={setFilter} options={TOOL_FILTERS} />
				<ToolsManagement />
			</main>
		</>
	);
}
