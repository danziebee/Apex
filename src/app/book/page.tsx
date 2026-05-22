import { Metadata } from "next";
import { TALLY_FORM_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Book a Strategy Call | Apex Growth Operations",
};

export default function BookPage() {
  return (
    <main>
      <iframe
        src={TALLY_FORM_URL}
        width="100%"
        title="Book a Strategy Call"
        className="h-[calc(100vh-80px)] w-full border-0"
      />
    </main>
  );
}
