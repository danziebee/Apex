import Link from "next/link";

type PillButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "white" | "blue";
  className?: string;
};

export function PillButton({
  href,
  children,
  variant = "blue",
  className = "",
}: PillButtonProps) {
  const base =
    "relative inline-flex items-center justify-center rounded-pill px-8 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]";

  const variants = {
    white: [
      "text-black",
      "bg-white/90 backdrop-blur-xl",
      "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9),inset_1.8px_3px_0_-2px_rgba(255,255,255,0.95),inset_-2px_-2px_0_-2px_rgba(255,255,255,0.8),inset_-0.3px_-1px_4px_0_rgba(0,0,0,0.06),0_1px_5px_0_rgba(0,0,0,0.08),0_8px_24px_0_rgba(255,255,255,0.12)]",
      "hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,1),inset_1.8px_3px_0_-2px_rgba(255,255,255,1),inset_-2px_-2px_0_-2px_rgba(255,255,255,0.9),0_12px_32px_rgba(255,255,255,0.18)]",
    ].join(" "),
    blue: [
      "text-white",
      "bg-apex-blue/80 backdrop-blur-xl",
      "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),inset_1.8px_3px_0_-2px_rgba(255,255,255,0.25),inset_-2px_-2px_0_-2px_rgba(255,255,255,0.12),inset_-3px_-8px_1px_-6px_rgba(255,255,255,0.08),inset_-0.3px_-1px_4px_0_rgba(0,0,0,0.15),0_1px_5px_rgba(0,122,255,0.2),0_12px_40px_rgba(0,122,255,0.25)]",
      "hover:bg-apex-blue/90 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),inset_1.8px_3px_0_-2px_rgba(255,255,255,0.3),inset_-2px_-2px_0_-2px_rgba(255,255,255,0.15),0_16px_48px_rgba(0,122,255,0.35)]",
    ].join(" "),
  };

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
