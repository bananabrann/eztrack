type LogoSize = "sm" | "md" | "lg";

type LogoProps = {
  size?: LogoSize;
  className?: string;
};

const sizeMap: Record<LogoSize, string> = {
  sm: "w-32",
  md: "w-48", 
  lg: "w-80",   
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <img
      src="/eztrack-logo.png"
      alt="EZTrack Logo"
      className={`${sizeMap[size]} h-auto object-contain ${className}`}
    />
  );
}