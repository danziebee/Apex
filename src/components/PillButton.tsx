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
    "inline-flex items-center justify-center rounded-pill px-8 py-3.5 text-sm font-semibold transition-all duration-300";
  const variants = {
    white:
      "bg-white text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_24px_rgba(255,255,255,0.12)] hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(255,255,255,0.18)]",
    blue:
      "bg-apex-blue text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_12px_40px_rgba(0,122,255,0.35)] hover:scale-[1.02] hover:bg-[#1a86ff] hover:shadow-[0_16px_48px_rgba(0,122,255,0.45)]",
  };

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
