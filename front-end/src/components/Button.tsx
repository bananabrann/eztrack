import type { ReactNode } from "react";

type Variant = "blue" | "orange";

type ButtonProps = {
	label: string;
	variant: Variant;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
	icon?: ReactNode;
	ariaLabel?: string;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
};

export function Button({
	label,
	variant,
	onClick,
	icon,
	ariaLabel,
	disabled = false,
	type = "button",
}: ButtonProps) {
	let variantClasses = "";

	if (variant === "blue") {
		variantClasses =
			"bg-primary hover:bg-secondary active:bg-tertiary focus-visible:ring-tertiary";
	} else {
		variantClasses =
			"bg-secondary hover:bg-tertiary active:bg-enabled focus-visible:ring-secondary";
	}

	return (
		<button
			type={type}
			onClick={onClick}
			aria-label={ariaLabel ?? label}
			disabled={disabled}
			className={[
				"w-full max-w-[420px]",
				"rounded-md px-6 py-3",
				"inline-flex items-center justify-center gap-2",
				"text-white font-semibold",
				"transition-colors",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
				disabled
					? "bg-disabled text-gray-500 cursor-not-allowed"
					: variantClasses,
			].join(" ")}
		>
			{icon}
			{label}
		</button>
	);
}
