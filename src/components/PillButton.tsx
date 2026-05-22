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
      "bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-2xl",
      "shadow-[inset_0_1px_0_0_rgba(255,255,255,1),inset_0_0_0_1px_rgba(255,255,255,0.7),inset_0_-1px_2px_0_rgba(0,0,0,0.08),0_2px_8px_rgba(255,255,255,0.12),0_8px_24px_rgba(255,255,255,0.08),0_0_60px_-10px_rgba(255,255,255,0.1)]",
      "hover:from-white hover:to-white/90 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,1),inset_0_0_0_1px_rgba(255,255,255,0.85),0_4px_12px_rgba(255,255,255,0.18),0_12px_32px_rgba(255,255,255,0.12),0_0_80px_-8px_rgba(255,255,255,0.12)]",
    ].join(" "),
    blue: [
      "text-white",
      "bg-gradient-to-b from-apex-blue/90 to-apex-blue/70 backdrop-blur-2xl",
      "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.12),inset_0_-1px_2px_0_rgba(0,0,0,0.2),inset_1.8px_3px_0_-2px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,122,255,0.3),0_12px_40px_rgba(0,122,255,0.25),0_0_80px_-12px_rgba(0,122,255,0.15)]",
      "hover:from-apex-blue/95 hover:to-apex-blue/80 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),inset_0_0_0_1px_rgba(255,255,255,0.18),inset_0_-1px_2px_0_rgba(0,0,0,0.15),0_4px_12px_rgba(0,122,255,0.4),0_16px_48px_rgba(0,122,255,0.35),0_0_100px_-10px_rgba(0,122,255,0.2)]",
    ].join(" "),
  };

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
