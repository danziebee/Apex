"use client";

import { YOUTUBE_VIDEO_ID } from "@/lib/content";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroVSL() {
  const embedSrc = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`;

  return (
    <section aria-label="Video introduction">
      <ContainerScroll>
        <iframe
          src={embedSrc}
          title="Apex | Growth Operations"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </ContainerScroll>
    </section>
  );
}
