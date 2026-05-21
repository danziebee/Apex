"use client";

import { YOUTUBE_VIDEO_ID } from "@/lib/content";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function HeroVSL() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoPlaneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const videoPlane = videoPlaneRef.current;
    if (!section || !videoPlane) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.set(videoPlane, {
        transformPerspective: 1400,
        transformOrigin: "50% 50%",
        transformStyle: "preserve-3d",
      });

      gsap.fromTo(
        videoPlane,
        {
          rotateX: 0,
          y: 0,
          scale: 1,
          opacity: 1,
        },
        {
          rotateX: 82,
          y: -120,
          scale: 0.72,
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: section,
            start: "top 20%",
            end: "bottom 15%",
            scrub: 1.2,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const embedSrc = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`;

  return (
    <section
      ref={sectionRef}
      className="relative pb-16 pt-4 md:pb-24"
      aria-label="Video introduction"
    >
      <div className="apex-container-wide">
        <div
          className="apex-container flex justify-start"
          style={{ perspective: "1400px" }}
        >
        <div
          ref={videoPlaneRef}
          className="relative aspect-video w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-glass-lg backdrop-blur-sm"
          style={{ transformStyle: "preserve-3d" }}
        >
          <iframe
            src={embedSrc}
            title="Apex | Growth Operations"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
        </div>
        </div>
      </div>
    </section>
  );
}
