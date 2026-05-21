"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRef } from "react";

type GlimmerCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function GlimmerCard({ children, className = "" }: GlimmerCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(50);
  const y = useMotionValue(50);

  const background = useMotionTemplate`radial-gradient(520px circle at ${x}% ${y}%, rgba(0, 122, 255, 0.18), transparent 42%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width) * 100);
    y.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(50);
        y.set(50);
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`group relative overflow-hidden rounded-glass glass-panel ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-glass opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 60%, rgba(0,122,255,0.08) 100%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
