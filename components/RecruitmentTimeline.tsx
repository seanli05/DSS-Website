"use client";

import { useEffect, useRef, useState } from "react";
import type { RecruitmentEvent } from "@/lib/content";

interface RecruitmentTimelineProps {
  events: RecruitmentEvent[];
}

// Fixed column width per event (px). The node sits centered in each column and
// the connecting spine runs across all of them. Kept in one constant so the
// scroll-by amount and the min-width math can't drift apart.
const COL_WIDTH = 300;

// The brand node-graph mark, reused as the icon inside every timeline node.
function NodeGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" aria-hidden="true">
      <circle cx="12" cy="5" r="2" fill="currentColor" />
      <circle cx="5" cy="17" r="2" fill="currentColor" />
      <circle cx="19" cy="17" r="2" fill="currentColor" />
      <path
        d="M12 5L5 17M12 5l7 12M5 17h14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

// One event card. `above` flips whether the connector stub sits below the card
// (card is above the spine) or above it (card is below the spine). The stub's
// transform-origin (set via .tl-connector-top/-bottom) points at the spine so it
// "extends" outward toward the card during the reveal animation.
function TimelineCard({ event, above }: { event: RecruitmentEvent; above: boolean }) {
  return (
    <div className="flex w-full flex-col items-center">
      {/* When the card is below the spine, the connector renders first (on top). */}
      {!above && <div className="tl-connector tl-connector-bottom h-6 w-px bg-accent/50" />}
      <div className="tl-card w-[272px] border border-white/15 bg-primary p-6 text-center shadow-card">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/80">
          {event.date}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-snug text-white">{event.event}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{event.description}</p>
        {(event.time || event.room) && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {event.time && (
              <span className="inline-flex items-center gap-1 border border-white/20 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
                <span aria-hidden="true">🕒</span>
                {event.time}
              </span>
            )}
            {event.room && (
              <span className="inline-flex items-center gap-1 border border-white/20 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
                <span aria-hidden="true">📍</span>
                {event.room}
              </span>
            )}
          </div>
        )}
      </div>
      {/* When the card is above the spine, the connector renders last (below it). */}
      {above && <div className="tl-connector tl-connector-top h-6 w-px bg-accent/50" />}
    </div>
  );
}

export default function RecruitmentTimeline({ events }: RecruitmentTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => setIndex(Math.round(track.scrollLeft / COL_WIDTH));
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal each item as it scrolls into the horizontal track's visible window —
  // connector extends from the spine, then the card pops up (CSS in globals.css).
  // Root is the scroll track (not the viewport) so horizontal scroll is the trigger.
  // One-shot per item, matching RevealOnScroll. Under prefers-reduced-motion the CSS
  // forces every item to its resting/visible state regardless of data-revealed, so
  // no JS special-casing is needed here.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false;
        const next = new Set<number>();
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = Number((entry.target as HTMLElement).dataset.index);
          next.add(i);
          observer.unobserve(entry.target);
          changed = true;
        }
        if (changed) setRevealed((prev) => new Set([...prev, ...next]));
      },
      { root: track, threshold: 0.35 }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [events]);

  if (events.length === 0) return null;

  const scroll = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({ left: direction * COL_WIDTH, behavior: "smooth" });
  };

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        className="scrollbar-none -mx-6 overflow-x-auto px-6"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="relative flex" style={{ minWidth: `${events.length * COL_WIDTH}px` }}>
          {/* Continuous spine, centered vertically between the two card slots */}
          <div className="timeline-spine pointer-events-none absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2" />

          {events.map((event, i) => {
            const above = i % 2 === 0;
            return (
              <div
                key={event.id}
                ref={(el) => { itemRefs.current[i] = el; }}
                data-index={i}
                data-revealed={revealed.has(i)}
                className="tl-item relative flex w-[300px] flex-none flex-col items-center"
              >
                {/* Top slot */}
                <div className="flex h-[248px] w-full items-end justify-center">
                  {above && <TimelineCard event={event} above />}
                </div>

                {/* Node, sitting on the spine */}
                <div className="relative z-10 flex h-14 items-center justify-center">
                  <div className="tl-node timeline-node flex h-14 w-14 items-center justify-center rounded-full">
                    <NodeGlyph />
                  </div>
                </div>

                {/* Bottom slot */}
                <div className="flex h-[248px] w-full items-start justify-center">
                  {!above && <TimelineCard event={event} above={false} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll controls + progress (matches EventCarousel) */}
      {events.length > 1 && (
        <div className="mt-8 flex items-center justify-between gap-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            {String(index + 1).padStart(2, "0")} / {String(events.length).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-3">
            <span className="hidden text-[11px] uppercase tracking-[0.18em] text-muted sm:inline">
              ↔ Scroll to explore
            </span>
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous events"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-primary hover:text-primary"
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M8 2L4 6l4 4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next events"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-primary hover:text-primary"
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
