"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const ContainerScroll = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.2", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0, 25]);
  const rotateY = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0, -6]);
  const scale = useTransform(scrollYProgress, [0, 0.35, 1], [1, 1, 0.88]);
  const translateY = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0, -100]);
  const opacity = useTransform(scrollYProgress, [0.3, 0.85], [1, 0]);

  return (
    <div ref={containerRef} className="relative px-4 md:px-8">
      <div style={{ perspective: "1200px" }}>
        <motion.div
          style={{
            rotateX,
            rotateY,
            scale,
            y: translateY,
            opacity,
            transformStyle: "preserve-3d",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.4), 0 40px 80px rgba(0, 0, 0, 0.25)",
          }}
          className="mx-auto max-w-5xl"
        >
          <div className="glass-panel-strong overflow-hidden rounded-glass aspect-video">
            {children}
          </div>
        </motion.div>
      </div>
      <div className="h-20 md:h-28" aria-hidden />
    </div>
  );
};
