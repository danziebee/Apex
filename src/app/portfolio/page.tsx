import Link from "next/link";

export const metadata = {
  title: "Portfolio | Apex Growth Operations",
  description: "Selected work and case studies from Apex Growth Operations.",
};

export default function Portfolio() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        Portfolio
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-apex-muted">
        Our case studies and client results are coming soon.
      </p>
      <Link
        href="/"
        className="mt-10 text-sm font-medium text-white/60 transition-colors hover:text-white"
      >
        &larr; Back to home
      </Link>
    </main>
  );
}
