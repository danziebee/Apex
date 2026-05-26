"use client";

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black" aria-hidden>
      <div className="ambient-blob ambient-blob-1" />
      <div className="ambient-blob ambient-blob-2" />
      <div className="ambient-blob ambient-blob-3" />
      <div className="ambient-blob ambient-blob-4" />
      <div className="ambient-blob ambient-blob-5" />
      <div className="noise-overlay absolute inset-0 opacity-25 mix-blend-overlay" />
    </div>
  );
}
