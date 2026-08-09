import type { Metadata } from "next";
import LogoCarousel from "@/components/LogoCarousel";
import PartnerInquiryCard from "@/components/PartnerInquiryCard";
import ProjectTimeline from "@/components/ProjectTimeline";
import RevealOnScroll from "@/components/RevealOnScroll";
import NodeGraph from "@/components/NodeGraph";
import { getPartners } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Partner with DSS — access Berkeley's top data science talent for consulting, research, and recruiting.",
};

// Inline SVGs rather than an icon dependency: three icons don't justify a package,
// and these match the thin-stroke, node-graph language of the DSS mark.
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-6 w-6",
  "aria-hidden": true,
};

const TeamIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="5" cy="18" r="2.5" />
    <circle cx="19" cy="18" r="2.5" />
    <path d="M10.6 7.2 6.5 15.7M13.4 7.2l4.1 8.5M7.5 18h9" />
  </svg>
);

const ScopeIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
    <path d="m3 12.5 9 4.5 9-4.5" />
    <path d="m3 17.5 9 4.5 9-4.5" />
  </svg>
);

const StudentIcon = () => (
  <svg {...iconProps}>
    <path d="M12 4 2 9l10 5 10-5-10-5Z" />
    <path d="M6 11.5V17c0 1.4 2.7 3 6 3s6-1.6 6-3v-5.5" />
  </svg>
);

// TODO: confirm scopes and placements with DSS leadership. Company names are the
// ones already cited elsewhere on the site plus those given by leadership — do not
// extend this list without confirming it.
const SCOPES = [
  "Data analysis & visualisation",
  "Predictive modelling & ML",
  "Dashboards & internal tools",
  "Research & experimentation",
];

const PLACEMENTS = ["Meta", "Tesla", "Amazon", "Google", "McKinsey"];

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <>
      {/* Hero — headline left, enquiry form right. The form leads the page rather
          than closing it: this is the single action we want from this audience, so
          it should not be gated behind a scroll. */}
      <section className="font-poppins relative -mt-16 overflow-hidden pt-16 surface-green-gradient">
        <NodeGraph
          id="particles-partners"
          className="pointer-events-none absolute inset-0 h-full w-full"
          opacity={0.25}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="inline-flex border border-white/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/80">
                Industry partners
              </p>

              <h1 className="mt-8 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white">
                Let&apos;s work together.
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
                {/* TODO: verify copy with DSS leadership */}
                We partner with companies on semester-long data science engagements —
                pairing real deliverables with a pipeline to Berkeley&apos;s strongest
                technical students.
              </p>
            </div>

            {/* The form sits on white so the fields read as an interactive surface
                against the gradient rather than blending into it. */}
            <PartnerInquiryCard />
          </div>
        </div>
      </section>

      {/* Everything between the hero and the footer shares one gradient, so the
          page eases out of the hero's green and back into the footer's rather
          than cutting to white at both seams. Children stay transparent. */}
      <div className="fade-between-gradients">
        <LogoCarousel partners={partners} className="bg-transparent" />

        {/* How it works — three tall cards */}
        <section className="font-poppins">
          <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20 lg:px-12">
            <RevealOnScroll delayMs={0} className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                (01) — Process
              </p>
              <h2 className="mt-6 text-[clamp(2rem,4vw,3.125rem)] font-normal leading-[1.05] tracking-tight text-ink">
                How it works.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
                We partner with companies to ship focused data science work through student
                teams, pairing real execution with meaningful student experience.
              </p>
            </RevealOnScroll>

            <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-7">
              {/* 01 — Team structure */}
              <RevealOnScroll delayMs={100}>
                <article className="group flex h-full flex-col border border-border bg-bg p-7 transition-all duration-200 motion-reduce:transition-none hover:-translate-y-1 hover:border-primary hover:shadow-card md:p-8">
                  <span className="inline-flex h-12 w-12 items-center justify-center border border-border text-primary transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                    <TeamIcon />
                  </span>
                  <span className="mt-7 text-[11px] tracking-[0.18em] text-primary">01</span>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">
                    Team structure
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Each engagement gets a hand-picked team of students paired with a faculty
                    or alumni advisor — a clear owner for the work, and a senior voice
                    reviewing it before anything reaches you.
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-muted">
                    Weekly check-ins keep you visible on progress without managing the
                    day-to-day.
                  </p>
                </article>
              </RevealOnScroll>

              {/* 02 — Project scopes */}
              <RevealOnScroll delayMs={175}>
                <article className="group flex h-full flex-col border border-border bg-bg p-7 transition-all duration-200 motion-reduce:transition-none hover:-translate-y-1 hover:border-primary hover:shadow-card md:p-8">
                  <span className="inline-flex h-12 w-12 items-center justify-center border border-border text-primary transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                    <ScopeIcon />
                  </span>
                  <span className="mt-7 text-[11px] tracking-[0.18em] text-primary">02</span>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">
                    Project scopes
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    We size the problem with you up front. Common scopes include:
                  </p>
                  <ul className="mt-5 flex flex-col gap-3">
                    {SCOPES.map((scope) => (
                      <li key={scope} className="flex gap-3 text-sm leading-snug text-ink">
                        <span
                          aria-hidden="true"
                          className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-primary"
                        />
                        {scope}
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealOnScroll>

              {/* 03 — Why student teams */}
              <RevealOnScroll delayMs={250}>
                <article className="group flex h-full flex-col border border-border bg-bg p-7 transition-all duration-200 motion-reduce:transition-none hover:-translate-y-1 hover:border-primary hover:shadow-card md:p-8">
                  <span className="inline-flex h-12 w-12 items-center justify-center border border-border text-primary transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                    <StudentIcon />
                  </span>
                  <span className="mt-7 text-[11px] tracking-[0.18em] text-primary">03</span>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">
                    Why student teams
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    DSS members are among Berkeley&apos;s most rigorous students. Partnering
                    is also the earliest way to meet them — well before they reach the
                    recruiting market.
                  </p>

                  {/* mt-auto pins this to the card's bottom edge whatever the copy above does. */}
                  <div className="mt-auto pt-7">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                      Members go on to
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {PLACEMENTS.map((company) => (
                        <li
                          key={company}
                          className="border border-border px-3 py-1 text-xs text-ink transition-colors duration-200 group-hover:border-primary/40"
                        >
                          {company}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </RevealOnScroll>
            </div>

            {/* Timeline — a continuation of "How it works" rather than a chapter
                of its own: same section, no second numbered eyebrow. A hairline
                rule and a bold label are enough to separate it from the cards
                above without the full heading treatment other sections use. */}
            <RevealOnScroll delayMs={300} className="mt-16 border-t border-border pt-14 md:mt-20 md:pt-16">
              <p className="text-center text-xl font-semibold tracking-tight text-ink">
                Project Timeline
              </p>
              <p className="mt-3 text-center text-sm leading-relaxed text-muted">
                Engagements run on a semester cadence — click a stage to see what it
                involves.
              </p>
              <div className="mt-10">
                <ProjectTimeline />
              </div>
            </RevealOnScroll>

            {/* Closing panel — same continuation pattern as the timeline above:
                a bold label under a hairline rule, not a new section. Reuses the
                hero's form card, stacked vertically as its own standalone CTA. */}
            <RevealOnScroll delayMs={0} className="mt-16 border-t border-border pt-14 md:mt-20 md:pt-16">
              <p className="text-center text-xl font-semibold tracking-tight text-ink">
                Interested in an engagement?
              </p>
              <p className="mt-3 text-center text-sm leading-relaxed text-muted">
                Reach out and we&apos;ll get back to you within a few days.
              </p>
              {/* Wider than the card was originally: max-w-md left the new
                  Email/Company row too cramped for two comfortable fields. */}
              <div className="mx-auto mt-10 max-w-xl">
                <PartnerInquiryCard headingLevel="h3" />
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </div>
    </>
  );
}
