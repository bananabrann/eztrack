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
      "w-full",
      "max-w-md",         
      "min-h-24",        
      "sm:min-h-28",     
      "card",
      "bg-base-100",
      "border",
      "border-outline",
      "shadow-sm",
      "text-left",
      "transition",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-tertiary",
      "focus-visible:ring-offset-2",

      disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:shadow-md active:shadow-sm hover:border-tertiary active:border-tertiary",
    ].join(" ")}>
    <div className="card-body flex items-center justify-center text-center p-6">
      <span className="text-primary font-semibold text-lg">{label}</span>
    </div>
  </button>
);
}
