import { type ReactNode } from "react";
import RevealOnScroll from "./RevealOnScroll";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  /** Section number for the `(01) — Label` eyebrow. Omit on closing CTAs, which
   *  stay unnumbered (same convention the Partners page uses). */
  index?: number;
  /** Separator between the optional section number and eyebrow label. */
  indexSeparator?: string;
  heading?: string;
  subtext?: string;
  /** The rule under the header. Only the FIRST section of a page gets one. */
  divider?: boolean;
  dark?: boolean;      // white header text, for dark backgrounds passed via className
  centered?: boolean;  // center-align the header text
  className?: string;
  children?: ReactNode;
}

/**
 * Standard page section: optional eyebrow label → heading → subtext → children.
 * Handles vertical rhythm and container width automatically.
 *
 * Matches the editorial system the home, About, and Partners pages hand-roll
 * (see the token strings at the top of app/about/page.tsx): Poppins, max-w-6xl,
 * an 11px tracked eyebrow over a large `font-normal` clamp heading.
 *
 * Deliberately has NO background. Pages wrap their body in
 * `.fade-between-gradients`, which runs one continuous gradient from the hero's
 * green down into the footer's — an opaque section would punch a hole in it.
 */
export default function Section({
  id,
  eyebrow,
  index,
  indexSeparator = "—",
  heading,
  subtext,
  divider = false,
  dark = false,
  centered = false,
  className = "",
  children,
}: SectionProps) {
  const align = centered ? "text-center items-center" : "";
  const label =
    index === undefined
      ? eyebrow
      : `(${String(index).padStart(2, "0")})${indexSeparator} ${eyebrow}`;

  return (
    <section id={id} className={`font-poppins ${className}`}>
      <div
        className={`mx-auto flex max-w-6xl flex-col px-6 py-16 md:px-8 md:py-20 lg:px-12 ${align}`}
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
            {/* Thick rule punctuated by a small bordered square — structure without mass.
                The reference pages only ever use this left-aligned, where it runs off
                to the right. Centered sections get a symmetric version instead, since
                the asymmetric one reads as a misalignment under centered text. */}
            {divider && (
              <div
                className={`mt-8 flex items-center gap-4 ${centered ? "justify-center" : ""}`}
                aria-hidden="true"
              >
                <div className={`h-[3px] w-20 ${dark ? "bg-white" : "bg-primary"}`} />
                <div
                  className={`h-2.5 w-2.5 border-2 ${dark ? "border-white" : "border-primary"}`}
                />
                {centered ? (
                  <div className={`h-[3px] w-20 ${dark ? "bg-white" : "bg-primary"}`} />
                ) : (
                  <div className={`h-px flex-1 ${dark ? "bg-white/25" : "bg-border"}`} />
                )}
              </div>
            )}
          </RevealOnScroll>
        )}

        {/* Section body */}
        {children}
      </div>
    </section>
  );
}
