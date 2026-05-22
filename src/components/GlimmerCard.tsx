"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

type GlimmerCardProps = {
  children: React.ReactNode;
  className?: string;
};

const TILT_MAX = 8;

export function GlimmerCard({ children, className = "" }: GlimmerCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const rotateX = useSpring(0, { stiffness: 300, damping: 24 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 24 });

  const glowBackground = useMotionTemplate`radial-gradient(520px circle at ${x}% ${y}%, rgba(0, 122, 255, 0.18), transparent 42%)`;
  const reflexHighlight = useMotionTemplate`radial-gradient(400px circle at ${x}% ${y}%, rgba(255, 255, 255, 0.12), transparent 50%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px * 100);
    y.set(py * 100);
    rotateX.set((0.5 - py) * TILT_MAX);
    rotateY.set((px - 0.5) * TILT_MAX);
  }

  function onLeave() {
    x.set(50);
    y.set(50);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div style={{ perspective: "800px" }} className="h-full">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`group relative h-full overflow-hidden rounded-glass glass-panel ${className}`}
      >
        {/* Blue glow that follows cursor */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glowBackground }}
        />
        {/* White reflex highlight that follows cursor */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-glass opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: reflexHighlight }}
        />
        {/* Edge light gradient */}
        <div
          className="pointer-events-none absolute inset-0 rounded-glass opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 35%, transparent 65%, rgba(0,122,255,0.06) 100%)",
          }}
        />
        <div className="relative z-10 h-full">{children}</div>
      </motion.div>
    </div>
  );
}
