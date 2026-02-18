type Variant = "blue" | "orange";

type ButtonProps = {
	label: string;
	variant: Variant;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
	ariaLabel?: string;
	disabled?: boolean;
};

export function Button({
	label,
	variant,
	onClick,
	ariaLabel,
	disabled = false,
}: ButtonProps) {
	let variantClasses = "";

	if (variant === "blue") {
		variantClasses =
			"bg-tertiary hover:bg-[#3f4b60] active:bg-[#2f394a] focus-visible:ring-tertiary";
	} else {
		variantClasses =
			"bg-secondary hover:bg-[#cf4f18] active:bg-[#b94414] focus-visible:ring-secondary";
	}

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={ariaLabel ?? label}
			disabled={disabled}
			className={[
				"w-full max-w-[420px]",
				"rounded-md px-6 py-3",
				"text-white font-semibold",
				"transition-colors",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
				disabled
					? "bg-disabled text-gray-500 cursor-not-allowed"
					: variantClasses,
			].join(" ")}
		>
			{label}
		</button>
	);
}
