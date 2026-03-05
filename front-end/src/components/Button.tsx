import type { ReactNode } from "react";

type Variant = "blue" | "orange";
type Size = "sm" | "md";

type ButtonProps = {
	label: string;
	variant: Variant;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
	icon?: ReactNode;
	ariaLabel?: string;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
	size?: Size;
};

export function Button({
	label,
	variant,
	onClick,
	icon,
	ariaLabel,
	disabled = false,
	type = "button",
	size = "md",
}: ButtonProps) {
	let variantClasses = "";
	const sizeClasses =
		size === "sm"
			? "max-w-[220px] px-4 py-2 text-sm"
			: "max-w-[420px] px-6 py-3";

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
				"w-full",
				"rounded-md",
				"inline-flex items-center justify-center gap-2",
				"text-white font-semibold",
				sizeClasses,
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
