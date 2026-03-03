interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function SearchBar({
	value,
	onChange,
	placeholder = "Search...",
}: SearchBarProps) {
	return (
		<div className="w-11/12 max-w-md mx-auto mb-6 flex items-center justify-center">
			<input
				type="text"
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder={placeholder}
				aria-label={placeholder}
				className="w-full border-[--tertiary-color] border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[--secondary-color]"
			/>
		</div>
	);
}
