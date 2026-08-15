"use client";

import { useRef } from "react";
import type { Project } from "@/lib/content";
import LegacyProjectCard from "./LegacyProjectCard";

interface LegacyProjectCarouselProps {
  projects: Project[];
  dark?: boolean; // white prev/next buttons, for dark section backgrounds
}

/**
 * A frozen copy of `components/ProjectCarousel.tsx`, differing only in that it
 * renders `LegacyProjectCard` instead of the shared (redesigned) `ProjectCard`
 * — see the note in `./LegacySection.tsx` for why this duplicate exists.
 */
export default function LegacyProjectCarousel({ projects, dark = false }: LegacyProjectCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonClass = `flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
    dark
      ? "border-white/40 text-white hover:border-accent hover:text-accent"
      : "border-border text-ink hover:border-primary hover:text-primary"
  }`;

  if (projects.length === 0) return null;

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-project-card]");
    const amount = (card?.offsetWidth ?? 320) + 24; // card width + gap
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory -mx-6 pr-6 pl-[15px] scroll-pl-[15px] py-8 -my-8"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {projects.map((project, i) => (
          <div
            key={project.id}
            data-project-card
            className="flex-none w-[320px] sm:w-[370px] snap-start"
          >
            {/* Index drives the card's tint, so the tints cycle along the row. */}
            <LegacyProjectCard project={project} index={i} />
          </div>
        ))}
        {/* Extra right padding so the last card doesn't sit flush against the edge */}
        <div className="flex-none w-6" aria-hidden="true" />
      </div>

      {projects.length > 1 && (
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous project"
            className={buttonClass}
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M8 2L4 6l4 4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next project"
            className={buttonClass}
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 2l4 4-4 4" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
