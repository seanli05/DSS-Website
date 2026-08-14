"use client";

import { useEffect, useRef, useState } from "react";
import type { RecruitmentEvent } from "@/lib/content";

interface RecruitmentTimelineProps {
  events: RecruitmentEvent[];
}

// Column and card widths, the slot height, and the track's edge padding all live
// together on `.timeline-track` in globals.css (as --tl-col / --tl-card /
// --tl-slot) so they can shrink together on narrow screens. Nothing here hard-
// codes them: the scroll-by amount is measured off a real column instead, which
// keeps the arrows honest at every breakpoint.
const FALLBACK_COL_WIDTH = 400;

// Number of steps in the color ramp — must match the .tl-item[data-step="0".."4"]
// rules in globals.css, which map each step onto a pair of --tl-ramp-* stops.
const RAMP_STEPS = 5;

// Spread the events evenly across the ramp so the first is always the coolest
// stop and the last the warmest, whatever the event count. Color then tracks
// position in the recruitment cycle rather than an arbitrary rotation.
function rampStep(index: number, total: number) {
  if (total < 2) return 0;
  return Math.round((index / (total - 1)) * (RAMP_STEPS - 1));
}

// Airtable sends real dates as ISO strings ("2026-08-31"), but approximate ones
// are typed free-hand ("Week 1"). Split the former into the three pieces the
// card's date rail stacks; return null for anything else so the rail can fall
// back to printing the label as-is. Built from the Y/M/D parts rather than
// `new Date(raw)` so the date can't shift a day across timezones.
function parseDate(raw: string) {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!parts) return null;
  const date = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
    day: String(date.getDate()),
    month: date.toLocaleDateString("en-US", { month: "short" }),
  };
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 4.8V8l2.2 1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 9.8 8 14 8 14Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.4" r="1.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

// One line of card metadata (time, room). Deliberately NOT the mono/uppercase
// treatment the eyebrows elsewhere use — that reads as a spec sheet. This
// inherits the section's Poppins at a friendly size and prints the Airtable
// value in its own casing. The icon takes the column's ramp colour (.tl-meta-icon).
function CardMeta({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-[14px] font-medium leading-snug text-ink/75 sm:text-[15px]">
      <span className="tl-meta-icon flex-none">{icon}</span>
      {children}
    </p>
  );
}

// The gradient rail down the card's left edge: weekday over a big day numeral
// over the month. It's the card's anchor — the thing you read first when
// scanning the timeline — and the only place the date appears. Its color comes
// from the column's ramp slice (.tl-ramp), so it warms as the cycle advances.
function DateRail({ date }: { date: string }) {
  const parsed = parseDate(date);

  return (
    <div className="tl-ramp flex w-[var(--tl-rail)] flex-none flex-col items-center justify-center px-2 py-5 text-white">
      {parsed ? (
        <>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/75">
            {parsed.weekday}
          </span>
          <span className="mt-1.5 text-[34px] font-bold leading-none tracking-tight sm:text-[38px]">
            {parsed.day}
          </span>
          <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/75">
            {parsed.month}
          </span>
        </>
      ) : (
        // Free-text labels like "Week 1" — print them as-is, centered.
        <span className="text-center font-mono text-[12px] uppercase leading-snug tracking-[0.14em]">
          {date}
        </span>
      )}
    </div>
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
      {!above && <div className="tl-connector tl-connector-bottom h-9 w-[3px] rounded-full" />}
      {/* text-left is explicit: the Join page's Section is `centered`, which puts
          text-center on the container this inherits from. The max-height is a
          backstop, not the usual case: line-clamp already keeps cards well under
          it, but Airtable copy is officer-edited, and a card taller than its slot
          would push the spine off-centre for the whole timeline. 2rem is the
          connector stub the card shares the slot with. */}
      <article className="tl-card flex max-h-[calc(var(--tl-slot)-2.25rem)] w-[var(--tl-card)] overflow-hidden rounded-2xl border border-cream-border bg-cream text-left shadow-card">
        <DateRail date={event.date} />

        <div className="flex min-w-0 flex-1 flex-col px-5 pt-5 pb-6 sm:px-7 sm:pt-6 sm:pb-7">
          <h3 className="text-[19px] font-semibold leading-snug text-ink sm:text-[21px]">
            {event.event}
          </h3>
          {event.description && (
            <p className="mt-3 line-clamp-5 text-[14px] leading-[1.65] text-muted sm:line-clamp-4 sm:text-[15px]">
              {event.description}
            </p>
          )}
          {(event.time || event.room) && (
            /* Tinted footer, bled to the card's edges — separates the "when and
               where" facts from the pitch above them. mt-auto pins it to the
               bottom so short and tall cards both close on the same block. */
            <div className="-mx-5 -mb-6 mt-7 flex flex-col gap-2.5 border-t border-cream-border bg-cream-deep px-5 pt-4 pb-4.5 sm:-mx-7 sm:-mb-7 sm:px-7 sm:pt-5 sm:pb-5">
              {event.time && <CardMeta icon={<ClockIcon />}>{event.time}</CardMeta>}
              {event.room && <CardMeta icon={<PinIcon />}>{event.room}</CardMeta>}
            </div>
          )}
        </div>
      </article>
      {/* When the card is above the spine, the connector renders last (below it). */}
      {above && <div className="tl-connector tl-connector-top h-9 w-[3px] rounded-full" />}
    </div>
  );
}

export default function RecruitmentTimeline({ events }: RecruitmentTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  // Measured, not hard-coded — the column narrows at small viewports (see the
  // --tl-col media query in globals.css) and the arrows have to follow.
  const columnWidth = () =>
    trackRef.current?.querySelector<HTMLElement>("[data-tl-item]")?.offsetWidth ??
    FALLBACK_COL_WIDTH;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => setIndex(Math.round(track.scrollLeft / columnWidth()));
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
    trackRef.current?.scrollBy({ left: direction * columnWidth(), behavior: "smooth" });
  };

  return (
    <div className="w-full">
      {/* .timeline-track breaks out of the section's max-w-6xl container so the
          timeline runs the full width of the viewport (see globals.css). */}
      <div
        ref={trackRef}
        className="timeline-track scrollbar-none overflow-x-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* w-max so the row is as wide as its columns — the spine below stretches
            across all of them, not just the visible window. */}
        <div className="relative flex w-max">
          {/* Continuous spine, centered vertically between the two card slots */}
          <div className="timeline-spine pointer-events-none absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full" />

          {events.map((event, i) => {
            const above = i % 2 === 0;
            return (
              <div
                key={event.id}
                ref={(el) => { itemRefs.current[i] = el; }}
                data-tl-item
                data-index={i}
                data-step={rampStep(i, events.length)}
                data-revealed={revealed.has(i)}
                className="tl-item relative flex w-[var(--tl-col)] flex-none flex-col items-center"
              >
                {/* Card slot above the spine — empty on odd columns, which is what
                    gives the timeline its alternating rhythm. */}
                <div className="flex h-[var(--tl-slot)] w-full items-end justify-center">
                  {above && <TimelineCard event={event} above />}
                </div>

                {/* Node, sitting on the spine. Deliberately a bare dot: it marks
                    position on the line, and the card beside it carries the
                    content. An icon here would have to mean something — the
                    event data has no type to encode, so one would be either
                    identical on every node or arbitrary. The container stays
                    h-12 so the slot math above and below is unaffected. */}
                <div className="relative z-10 flex h-12 items-center justify-center">
                  <div className="tl-node tl-ramp timeline-node h-10 w-10 rounded-full" />
                </div>

                {/* Card slot below the spine — mirror of the one above. */}
                <div className="flex h-[var(--tl-slot)] w-full items-start justify-center">
                  {!above && <TimelineCard event={event} above={false} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll controls + progress (matches EventCarousel) */}
      {events.length > 1 && (
        <div className="mt-6 flex w-full items-center justify-between gap-2">
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
