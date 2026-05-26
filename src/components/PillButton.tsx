import Link from "next/link";

type PillButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "glass" | "blue";
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
    glass: [
      "text-white",
      "bg-white/[0.06] backdrop-blur-2xl",
      "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),inset_0_0_0_1px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.2)]",
      "hover:bg-white/[0.12] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),inset_0_0_0_1px_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.3)]",
    ].join(" "),
    blue: [
      "text-white",
      "bg-gradient-to-b from-apex-blue/30 to-apex-blue/15 backdrop-blur-2xl",
      "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_0_0_1px_rgba(0,122,255,0.25),0_2px_8px_rgba(0,122,255,0.12),0_8px_24px_rgba(0,122,255,0.08)]",
      "hover:from-apex-blue/40 hover:to-apex-blue/20 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),inset_0_0_0_1px_rgba(0,122,255,0.35),0_4px_12px_rgba(0,122,255,0.18),0_12px_32px_rgba(0,122,255,0.12)]",
    ].join(" "),
  };

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
