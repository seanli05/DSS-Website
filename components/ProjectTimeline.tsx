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
 *
 * There is deliberately no Fall/Spring toggle. The two semesters run identical
 * stages with identical copy — the toggle only ever swapped the month labels,
 * so it was a control that hid information behind a click without adding any.
 * Each stage now prints both months as "Aug / Jan" (fall first), with a legend
 * above the rail saying so.
 */
// TODO: confirm milestone timing and detail copy with DSS leadership.
const MILESTONES = [
  {
    title: "Contracts & Scoping",
    fall: "Aug",
    spring: "Jan",
    icon: "scope",
    detail:
      "	We finalize the SOW + additional documents and lock the project scope together. Everything regarding projects, from legal forms to the problem statement are defined here before project work starts.",
  },
  {
    title: "Work Begins",
    fall: "Sep",
    spring: "Feb",
    icon: "start",
    detail:
      "We start off with an onboarding call between the client’s POCs and our full DSS team to align on project deliverables/goals. Project work begins starting from here.",
  },
  {
    title: "Midpoint Deliverables",
    fall: "Oct",
    spring: "Mar",
    icon: "flag",
    detail:
      "Around the halfway mark, the team shares project progress up to this point and a first preview of the deliverable. This is the point for the client to also reset expectations or change certain project aspects before the final deliverable.",
  },
  {
    title: "Final Deliverables",
    fall: "Dec",
    spring: "May",
    icon: "check",
    detail:
      "The team presents the final work and product through a live demo and slideshow presentation. All materials will be packaged to be used by the client.",
  },
  {
    title: "Materials Transfer",
    fall: "Jan",
    spring: "Jun",
    icon: "handoff",
    detail:
      "We hand off all code, data, and documentation, and close out access to any shared resources. We also do a final wrap-up call to make sure everything was received.",
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

/**
 * "Aug / Jan" — fall month first, then spring. Returns a fragment so each
 * layout keeps its own wrapper (a <p> on desktop, a <span> on mobile).
 *
 * The sr-only words are load-bearing: "Aug / Jan" read aloud on its own is
 * meaningless, and the visible legend sits too far from these labels in the
 * accessibility tree to supply the missing context.
 */
function Months({ fall, spring }: { fall: string; spring: string }) {
  return (
    <>
      <span className="sr-only">Fall </span>
      {fall}
      <span aria-hidden="true" className="mx-1 opacity-40">/</span>
      <span className="sr-only">, Spring </span>
      {spring}
    </>
  );
}

export default function ProjectTimeline() {
  const [selected, setSelected] = useState(0);
  const active = MILESTONES[selected];

  return (
    <div>
      {/* Legend, standing in for the toggle this replaces. It mirrors the
          "Fall / Spring" order the month pairs use, so the format explains
          itself rather than needing to be decoded. */}
      <p className="mb-10 text-center text-sm leading-relaxed text-muted">
        <span className="font-medium text-ink">Fall / Spring</span> — both semesters
        follow the same five stages.
      </p>

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
                <Months fall={m.fall} spring={m.spring} />
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
                    <Months fall={m.fall} spring={m.spring} />
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
