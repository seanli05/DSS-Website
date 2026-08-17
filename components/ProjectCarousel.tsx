"use client";

import { useRef } from "react";
import type { Project } from "@/lib/content";
import ProjectCard from "./ProjectCard";

interface ProjectCarouselProps {
  projects: Project[];
  dark?: boolean; // white prev/next buttons, for dark section backgrounds
  circular?: boolean; // wrap arrow navigation at either end
}

export default function ProjectCarousel({
  projects,
  dark = false,
  circular = false,
}: ProjectCarouselProps) {
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
    if (circular) {
      const current = Math.round(track.scrollLeft / amount);
      const target = (current + direction + projects.length) % projects.length;
      track.scrollTo({ left: target * amount, behavior: "smooth" });
      return;
    }
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory -mx-6 pr-6 pl-[15px] scroll-pl-[15px] py-8 -my-8"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            data-project-card
            className="flex-none w-[300px] sm:w-[340px] snap-start"
          >
            <ProjectCard project={project} />
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
