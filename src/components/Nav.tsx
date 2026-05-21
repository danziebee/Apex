import { BOOK_CALL_URL } from "@/lib/content";
import { ApexLogo } from "./ApexLogo";
import { PillButton } from "./PillButton";

export function Nav() {
  return (
    <header className="relative z-10 py-6">
      <div className="apex-container-wide flex items-center justify-between">
        <ApexLogo />
        <PillButton href={BOOK_CALL_URL} variant="white">
          Book A Call
        </PillButton>
      </div>
    </header>
  );
}
