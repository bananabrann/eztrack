type ModuleCardProps = {
	label: string;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
	ariaLabel?: string;
	disabled?: boolean;
	icon?: React.ReactNode;
	variant?: "default" | "blue";
};

export function ModuleCard({
	label,
	onClick,
	ariaLabel,
	disabled = false,
	icon,
	variant = "default",
}: ModuleCardProps) {
	const isBlue = variant === "blue";

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={ariaLabel ?? label}
			disabled={disabled}
			className={[
				"w-full",
				"max-w-md",
				"min-h-24",
				"sm:min-h-28",
				"card",
				isBlue ? "bg-primary text-white" : "bg-base-100",
				"border",
				isBlue ? "border-primary" : "border-outline",
				"shadow-sm",
				"text-left",
				"transition",
				"focus-visible:outline-none",
				"focus-visible:ring-2",
				"focus-visible:ring-tertiary",
				"focus-visible:ring-offset-2",

				disabled
					? "opacity-50 cursor-not-allowed"
					: isBlue
						? "hover:opacity-90 active:opacity-75"
						: "hover:shadow-md active:shadow-sm hover:border-tertiary active:border-tertiary",
			].join(" ")}
		>
			<div className="card-body flex items-center justify-center text-center p-6">
				<span
					className={[
						"inline-flex items-center gap-2 font-semibold text-lg",
						isBlue ? "text-white" : "text-primary",
					].join(" ")}
				>
					{icon ? <span>{icon}</span> : null}
					{label}
				</span>
			</div>
		</button>
	);
}
