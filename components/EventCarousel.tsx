"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ExternalEvent } from "@/lib/content";

interface EventCarouselProps {
  events: ExternalEvent[];
}

export default function EventCarousel({ events }: EventCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const tile = track.querySelector<HTMLElement>("[data-event-tile]");
      const tileWidth = (tile?.offsetWidth ?? 640) + 12; // tile width + gap
      setIndex(Math.round(track.scrollLeft / tileWidth));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  if (events.length === 0) return null;

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const tile = track.querySelector<HTMLElement>("[data-event-tile]");
    const amount = (tile?.offsetWidth ?? 640) + 12; // tile width + gap
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory -mx-6 px-6"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {events.map((event) => (
          <div
            key={event.id}
            data-event-tile
            className="relative flex-none w-[380px] sm:w-[520px] lg:w-[640px] aspect-[4/3] snap-start overflow-hidden border border-border"
          >
            {event.image ? (
              <Image
                src={event.image}
                alt={event.name}
                fill
                sizes="(min-width: 1024px) 640px, (min-width: 640px) 520px, 380px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <span className="text-5xl" aria-hidden="true">📅</span>
              </div>
            )}

            {/* Bottom gradient scrim + always-visible caption (matches Gallery.tsx) */}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 to-transparent p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-white md:text-base">
                {event.name}
              </p>
            </div>
          </div>
        ))}
        {/* Extra right padding so the last tile doesn't sit flush against the edge */}
        <div className="flex-none w-6" aria-hidden="true" />
      </div>

      {events.length > 1 && (
        <div className="mt-6 flex items-center justify-between gap-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            {String(index + 1).padStart(2, "0")} / {String(events.length).padStart(2, "0")}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous event"
              className="flex h-10 w-10 items-center justify-center border border-border text-ink transition-colors hover:border-primary hover:text-primary"
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M8 2L4 6l4 4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next event"
              className="flex h-10 w-10 items-center justify-center border border-border text-ink transition-colors hover:border-primary hover:text-primary"
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 2l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
