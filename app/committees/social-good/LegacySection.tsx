import { type ReactNode } from "react";
import RevealOnScroll from "@/components/RevealOnScroll";

interface LegacySectionProps {
  id?: string;
  eyebrow?: string;
  /** Section number for the `(01) — Label` eyebrow. Omit on closing CTAs, which
   *  stay unnumbered (same convention the Partners page uses). */
  index?: number;
  heading?: string;
  subtext?: string;
  /** The rule under the header. Only the FIRST section of a page gets one. */
  /** Marks the page's FIRST section, which skips the top hairline seam. */
  firstOnPage?: boolean;
  dark?: boolean;      // white header text, for dark backgrounds passed via className
  centered?: boolean;  // center-align the header text
  className?: string;
  children?: ReactNode;
}

/**
 * A frozen copy of `components/Section.tsx` as it stood before the committee
 * page redesign — kept only so `/committees/social-good` can stay on its
 * pre-redesign look while every other committee page moves on with the
 * shared `Section`. Do not "fix" divergences from the real `Section` here;
 * staying frozen is the point. Delete this file (and this route's other
 * Legacy* components) if Social Good is ever moved back onto the shared
 * template.
 */
export default function LegacySection({
  id,
  eyebrow,
  index,
  heading,
  subtext,
  firstOnPage = false,
  dark = false,
  centered = false,
  className = "",
  children,
}: LegacySectionProps) {
  const align = centered ? "text-center items-center" : "";
  const label =
    index === undefined ? eyebrow : `(${String(index).padStart(2, "0")}) — ${eyebrow}`;

  return (
    <section id={id} className={`font-poppins ${className}`}>
      <div
        /* Sections butt up flush against each other, so the visible gap between
           two of them is this padding doubled — at py-16/md:py-20 that was
           128px on phones and 160px on desktop. */
        className={`mx-auto flex max-w-6xl flex-col px-6 py-10 md:px-8 md:py-14 lg:px-12 ${align}`}
      >
        {/* Section header */}
        {(eyebrow || heading || subtext) && (
          <RevealOnScroll
            delayMs={0}
            className={`mb-14 ${align} ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
          >
            {eyebrow && (
              <p
                className={`text-[11px] uppercase tracking-[0.18em] ${dark ? "text-white/80" : "text-primary"}`}
              >
                {label}
              </p>
            )}
            {heading && (
              <h2
                className={`mt-6 text-[clamp(2rem,4vw,3.125rem)] font-normal leading-[1.05] tracking-tight ${dark ? "text-white" : "text-ink"}`}
              >
                {heading}
              </h2>
            )}
            {subtext && (
              <p
                className={`mt-5 max-w-2xl text-base leading-relaxed md:text-lg ${dark ? "text-white/75" : "text-muted"}`}
              >
                {subtext}
              </p>
            )}
          </RevealOnScroll>
        )}

        {/* Section body */}
        {children}
      </div>
    </section>
  );
}
