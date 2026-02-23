type ModuleCardProps = {
	label: string;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
	ariaLabel?: string;
	disabled?: boolean;
};

export function ModuleCard({
	label,
	onClick,
	ariaLabel,
	disabled = false,
}: ModuleCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={ariaLabel ?? label}
			disabled={disabled}
			className={[
				"w-80 h-28",
				"rounded-md",
				"bg-white",
				"text-primary font-semibold",
				"border",
				"border-outline",
				"transition",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2",
				disabled
					? "opacity-50 cursor-not-allowed"
					: [
							"hover:shadow-md",
							"active:shadow-sm",
							"hover:border-tertiary",
							"active:border-tertiary",
						].join(" "),
			].join(" ")}
		>
			{label}
		</button>
	);
}
