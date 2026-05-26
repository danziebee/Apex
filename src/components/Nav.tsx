import { BOOK_CALL_URL } from "@/lib/content";
import { ApexLogo } from "./ApexLogo";
import { PillButton } from "./PillButton";

const navLinks = [
  { label: "About Us", href: "#about" },
  { label: "Our Services", href: "#services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact Us", href: BOOK_CALL_URL },
];

export function Nav() {
  return (
    <header className="relative z-10 py-6">
      <div className="apex-container-wide flex items-center justify-between">
        <ApexLogo />
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <PillButton href={BOOK_CALL_URL} variant="glass">
          Book A Call
        </PillButton>
      </div>
    </header>
  );
}
