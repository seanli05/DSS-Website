"use client";

import { useState } from "react";

/**
 * Interactive engagement stepper, styled after the "roadmap" pattern (thick
 * connecting rail, circular icon nodes, date above / title below) rather than
 * the plain dot-and-line version this replaces.
 *
 * Only the *selected* node is highlighted — not "nodes before it" — since this
 * is a static explainer of the five stages, not a tracker of a real project's
 * progress. Implying partial completion here would be fabricating status.
 * Clicking a node is what does the work the reference's colour-fill did:
 * it swaps the panel below to that stage's longer description.
 */
// TODO: confirm milestone timing and detail copy with DSS leadership.
const MILESTONES = [
  {
    title: "Contracts & Scoping",
    spring: "Jan",
    fall: "Aug",
    icon: "scope",
    detail:
      "We finalize the engagement contract and lock the project scope together — the problem statement, success criteria, and any data or access we'll need from you before work begins.",
  },
  {
    title: "Work Begins",
    spring: "Feb",
    fall: "Sep",
    icon: "start",
    detail:
      "Your team kicks off with an onboarding call, gets access to the resources you've shared, and starts on the first milestone. You'll meet your student lead and advisor here.",
  },
  {
    title: "Midpoint Deliverables",
    spring: "Mar",
    fall: "Oct",
    icon: "flag",
    detail:
      "Around the halfway mark, the team shares progress and a first cut of the deliverable — a chance to redirect scope before the semester's remaining weeks are spent.",
  },
  {
    title: "Final Deliverables",
    spring: "May",
    fall: "Dec",
    icon: "check",
    detail:
      "The team presents finished work — code, models, or a dashboard — along with documentation, so it stays usable by your team well after the semester ends.",
  },
  {
    title: "Materials Transfer",
    spring: "Jun",
    fall: "Jan",
    icon: "handoff",
    detail:
      "We hand off all code, data, and documentation, and close out access to any shared resources. A short retro call wraps up the engagement.",
  },
] as const;

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
  "aria-hidden": true,
};

const ICONS: Record<(typeof MILESTONES)[number]["icon"], React.ReactNode> = {
  scope: (
    <svg {...iconProps}>
      <rect x="6" y="4" width="12" height="16" rx="1.5" />
      <path d="M9 4V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5V4M9 10h6M9 14h6" />
    </svg>
  ),
  start: (
    <svg {...iconProps}>
      <path d="M12 3c3 2 4.5 5 4.5 8.5S13.5 18 12 21c-1.5-3-4.5-6-4.5-9.5S9 5 12 3Z" />
      <circle cx="12" cy="11" r="1.75" />
      <path d="M7.5 15.5 5 20M16.5 15.5 19 20" />
    </svg>
  ),
  flag: (
    <svg {...iconProps}>
      <path d="M6 3v18" />
      <path d="M6 4.5c2-1 4-1 6 0s4 1 6 0v8c-2 1-4 1-6 0s-4-1-6 0Z" />
    </svg>
  ),
  check: (
    <svg {...iconProps}>
      <rect x="4" y="7" width="16" height="13" rx="1.5" />
      <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7M8.5 13.5l2.3 2.3L15.5 11" />
    </svg>
  ),
  handoff: (
    <svg {...iconProps}>
      <path d="M3 12h13M12 6.5 17.5 12 12 17.5" />
    </svg>
  ),
};

export default function ProjectTimeline() {
  const [selected, setSelected] = useState(0);
  const [term, setTerm] = useState<"spring" | "fall">("spring");
  const active = MILESTONES[selected];

  // Shared by both layouts below — a plain button pair rather than the site's
  // pill-shaped Button/EditorialButton, so it reads as a data control (like the
  // stage buttons beside it) rather than a call to action.
  const termToggle = (
    <div role="group" aria-label="Term" className="inline-flex border border-border">
      {(["spring", "fall"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTerm(t)}
          aria-pressed={term === t}
          className={`px-4 py-1.5 text-sm font-medium capitalize transition-colors duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-1 focus-visible:outline-primary ${
            term === t ? "bg-primary text-white" : "text-muted hover:text-primary"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="mb-10 flex justify-center">{termToggle}</div>

      {/* ── md+ : horizontal rail ───────────────────────────────────────── */}
      <ol className="hidden md:grid md:grid-cols-5">
        {MILESTONES.map((m, i) => {
          const isActive = i === selected;
          return (
            <li key={m.title} className="flex flex-col items-center">
              <p
                className={`text-[11px] uppercase tracking-[0.18em] transition-colors duration-150 ${
                  isActive ? "text-primary" : "text-muted"
                }`}
              >
                {term === "spring" ? m.spring : m.fall}
              </p>

              <div className="relative mt-3 flex w-full items-center">
                {i !== 0 && <span aria-hidden="true" className="h-px flex-1 bg-border" />}
                {i === 0 && <span className="flex-1" />}

                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={m.title}
                  className={`relative z-10 flex h-12 w-12 flex-none items-center justify-center rounded-full border-2 transition-all duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-primary ${
                    isActive
                      ? "scale-110 border-primary bg-primary text-white shadow-card"
                      : "border-primary/30 bg-bg text-primary hover:scale-105 hover:border-primary"
                  }`}
                >
                  {ICONS[m.icon]}
                </button>

                {i !== MILESTONES.length - 1 && (
                  <span aria-hidden="true" className="h-px flex-1 bg-border" />
                )}
                {i === MILESTONES.length - 1 && <span className="flex-1" />}
              </div>

              <button
                type="button"
                onClick={() => setSelected(i)}
                className={`mt-3 px-2 text-center text-sm font-medium leading-snug transition-colors duration-150 focus-visible:outline-none ${
                  isActive ? "text-primary" : "text-ink hover:text-primary"
                }`}
              >
                {m.title}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Detail panel — swaps to the selected stage's longer description.
          key={selected} restarts the fade on every click, which is what makes
          the swap read as a change rather than a silent text update. */}
      <div key={selected} className="timeline-detail-in mt-10 hidden border-l-2 border-primary bg-surface p-6 md:block md:p-7">
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
          {String(selected + 1).padStart(2, "0")} — {active.title}
        </p>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink">{active.detail}</p>
      </div>

      {/* ── mobile : vertical accordion ─────────────────────────────────── */}
      <ol className="flex flex-col md:hidden">
        {MILESTONES.map((m, i) => {
          const isActive = i === selected;
          return (
            <li key={m.title} className="relative flex gap-5 pb-8 last:pb-0">
              {i !== MILESTONES.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-6 top-12 w-px bg-border"
                />
              )}

              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-current={isActive ? "step" : undefined}
                aria-label={m.title}
                className={`relative z-10 flex h-12 w-12 flex-none items-center justify-center rounded-full border-2 transition-colors duration-200 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-primary ${
                  isActive ? "border-primary bg-primary text-white" : "border-primary/30 bg-bg text-primary"
                }`}
              >
                {ICONS[m.icon]}
              </button>

              <div className="flex-1 pt-1">
                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  className="flex w-full items-baseline justify-between gap-3 text-left"
                >
                  <span className={`font-medium leading-snug ${isActive ? "text-primary" : "text-ink"}`}>
                    {m.title}
                  </span>
                  <span className="flex-none text-[11px] uppercase tracking-[0.18em] text-muted">
                    {term === "spring" ? m.spring : m.fall}
                  </span>
                </button>

                {isActive && (
                  <p key={selected} className="timeline-detail-in mt-3 text-sm leading-relaxed text-muted">
                    {m.detail}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
