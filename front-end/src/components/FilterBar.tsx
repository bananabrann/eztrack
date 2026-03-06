interface FilterOption {
	value: string;
	label: string;
}

interface FilterBarProps {
	value: string;
	onChange: (value: string) => void;
	options: FilterOption[];
	label?: string;
	containerClassName?: string;
}

export function FilterBar({
	value,
	onChange,
	options,
	label = "Filter by",
	containerClassName = "w-48 max-w-md",
}: FilterBarProps) {
	return (
		<div
			className={`${containerClassName} mx-auto mb-6 flex items-center justify-center`}
		>
			<select
				value={value}
				onChange={e => onChange(e.target.value)}
				className="w-full border-[--tertiary-color] border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[--secondary-color]"
			>
				<option value="">{label}</option>
				{options.map(o => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</select>
		</div>
	);
}
