"use client";

import { partnerships } from "@/lib/content";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

type TiltState = { rx: number; ry: number; highlightX: number; highlightY: number };

const TILT_MAX = 4;

export function PartnershipFolders() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState(1);
  const [tilt, setTilt] = useState<TiltState>({
    rx: 0,
    ry: 0,
    highlightX: 50,
    highlightY: 50,
  });
  const unitRef = useRef<HTMLDivElement>(null);

  const active = partnerships[activeIndex];
  const isBlue = active.theme === "blue";

  const selectTab = (index: number) => {
    if (index === activeIndex) return;
    setFlipDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = unitRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - y) * TILT_MAX * 2,
      ry: (x - 0.5) * TILT_MAX * 2,
      highlightX: x * 100,
      highlightY: y * 100,
    });
  }, []);

  const resetTilt = useCallback(() => {
    setTilt({ rx: 0, ry: 0, highlightX: 50, highlightY: 50 });
  }, []);

  return (
    <div className="relative w-full max-w-4xl" style={{ perspective: "1200px" }}>
      <div
        className="pointer-events-none absolute inset-0 translate-y-4 translate-x-2 rounded-[2rem] bg-apex-blue/15 blur-sm"
        aria-hidden
      />

      <motion.div
        ref={unitRef}
        role="tablist"
        aria-label="Partnership options"
        onPointerMove={onPointerMove}
        onPointerLeave={resetTilt}
        animate={{
          rotateX: tilt.rx,
          rotateY: tilt.ry,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        style={{
          transformStyle: "preserve-3d",
          boxShadow: `${6 + tilt.ry * 0.5}px ${20 + Math.abs(tilt.rx)}px 50px rgba(0,0,0,0.4)`,
        }}
        className="relative"
      >
        {/* Tabs flush left with card */}
        <div className="flex items-end gap-1">
          {partnerships.map((p, i) => {
            const isActive = i === activeIndex;
            const tabBlue = p.theme === "blue";
            return (
              <motion.button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectTab(i)}
                whileHover={{ scale: isActive ? 1 : 1.06 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`relative rounded-t-[1.25rem] px-6 py-3 text-sm font-semibold md:px-8 md:py-3.5 md:text-base ${
                  isActive
                    ? "z-20 text-white"
                    : "text-white/50 hover:text-white/70"
                }`}
                style={
                  isActive
                    ? {
                        background: tabBlue ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(32px) saturate(160%)",
                        WebkitBackdropFilter: "blur(32px) saturate(160%)",
                        boxShadow: [
                          "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
                          "inset 1px 0 0 0 rgba(255, 255, 255, 0.1)",
                          "inset -1px 0 0 0 rgba(255, 255, 255, 0.1)",
                          "inset 1.8px 3px 0 -2px rgba(255, 255, 255, 0.2)",
                        ].join(", "),
                        marginBottom: "-1px",
                      }
                    : {
                        background: "rgba(255, 255, 255, 0.02)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
                        marginBottom: "-2px",
                      }
                }
              >
                {p.tabLabel}
              </motion.button>
            );
          })}
        </div>

        {/* Folder body */}
        <motion.div
          role="tabpanel"
          className={`relative overflow-hidden rounded-[2rem] rounded-tl-none px-8 py-9 md:px-11 md:py-11 text-white ${
            isBlue
              ? "bg-white/[0.05]"
              : "bg-white/[0.08]"
          }`}
          style={{
            backdropFilter: "blur(32px) saturate(160%)",
            WebkitBackdropFilter: "blur(32px) saturate(160%)",
            boxShadow: [
              "inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
              "inset 1.8px 3px 0 -2px rgba(255, 255, 255, 0.2)",
              "inset -2px -2px 0 -2px rgba(255, 255, 255, 0.12)",
              "inset -3px -8px 1px -6px rgba(255, 255, 255, 0.06)",
              "inset -0.3px -1px 4px 0 rgba(0, 0, 0, 0.15)",
              "0 1px 5px rgba(0, 0, 0, 0.1)",
              "0 40px 100px rgba(0, 0, 0, 0.35)",
            ].join(", "),
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(520px circle at ${tilt.highlightX}% ${tilt.highlightY}%, rgba(${isBlue ? "0, 122, 255" : "100, 160, 255"}, 0.15), transparent 52%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(400px circle at ${tilt.highlightX}% ${tilt.highlightY}%, rgba(255, 255, 255, 0.08), transparent 50%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 42%, transparent 58%, rgba(0,0,0,0.04) 100%)",
            }}
          />

          <div className="relative z-10" style={{ perspective: "900px" }}>
            <AnimatePresence mode="wait" custom={flipDirection}>
              <motion.div
                key={active.id}
                custom={flipDirection}
                variants={{
                  enter: (dir: number) => ({
                    opacity: 0,
                    rotateY: dir * -22,
                    x: dir * 24,
                  }),
                  center: {
                    opacity: 1,
                    rotateY: 0,
                    x: 0,
                  },
                  exit: (dir: number) => ({
                    opacity: 0,
                    rotateY: dir * 22,
                    x: dir * -24,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <h3 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {active.title}
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
                  {active.summary}
                </p>

                <div className="mt-9 space-y-7">
                  {active.sections.map((section) => (
                    <div key={section.heading}>
                      <h4 className="text-lg font-bold">{section.heading}</h4>
                      <p className="mt-2 max-w-2xl leading-relaxed text-white/70">
                        {section.body}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
