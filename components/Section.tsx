import { type ReactNode } from "react";
import RevealOnScroll from "./RevealOnScroll";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  /** Section number for the `(01) — Label` eyebrow. Omit on closing CTAs, which
   *  stay unnumbered (same convention the Partners page uses). */
  index?: number;
  /** Separator between the optional section number and eyebrow label. Appended
   *  directly after the `(01)`, so it carries its own leading space if it needs
   *  one — the default `" —"` renders `(01) — Label`, while the decal page's
   *  `":"` renders `(01): Label`. */
  indexSeparator?: string;
  heading?: string;
  subtext?: string;
  /** Marks the page's FIRST section, which skips the top hairline seam because
   *  it meets the hero's own colour transition instead. */
  firstOnPage?: boolean;
  dark?: boolean;      // white header text, for dark backgrounds passed via className
  centered?: boolean;  // center-align the header text
  /** "lg" (default) is the standard heading size. "sm" is for closing CTAs that
   *  shouldn't compete with the page's real headings — e.g. a committee page's
   *  "Join X this semester." sign-off. */
  size?: "lg" | "sm";
  className?: string;
  children?: ReactNode;
}

const HEADING_SIZE: Record<"lg" | "sm", string> = {
  lg: "text-[clamp(2rem,4vw,3.125rem)]",
  sm: "text-[clamp(1.5rem,2.5vw,2rem)]",
};

/**
 * Standard page section: optional eyebrow label → heading → subtext → children.
 * Handles vertical rhythm and container width automatically.
 *
 * Matches the editorial system the home, About, and Partners pages hand-roll
 * (see the token strings at the top of app/about/page.tsx): Poppins, max-w-6xl,
 * an 11px tracked eyebrow over a large `font-normal` clamp heading.
 *
 * One continuous white field, same as the home page — no background-color
 * switch between sections. The break between them is a plain full-bleed
 * hairline, the same rule language the home page's stats band already uses
 * for its own top/bottom edges (`border-y border-border`) — structure, not
 * color, doing the work. Only the page's first section skips it (`firstOnPage`),
 * since it meets the Hero's own colour transition rather than another section.
 */
export default function Section({
  id,
  eyebrow,
  index,
  indexSeparator = " —",
  heading,
  subtext,
  firstOnPage = false,
  dark = false,
  centered = false,
  size = "lg",
  className = "",
  children,
}: SectionProps) {
  const align = centered ? "text-center items-center" : "";
  const label =
    index === undefined
      ? eyebrow
      : `(${String(index).padStart(2, "0")})${indexSeparator} ${eyebrow}`;
  const showSeam = !firstOnPage;

  return (
    <section
      id={id}
      className={`font-poppins relative ${showSeam ? "border-t border-border" : ""} ${className}`}
    >
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
              <p className={`text-[11px] uppercase tracking-[0.18em] ${dark ? "text-white/80" : "text-primary"}`}>
                {label}
              </p>
            )}
            {heading && (
              <h2 className={`mt-6 ${HEADING_SIZE[size]} font-normal leading-[1.05] tracking-tight ${dark ? "text-white" : "text-ink"}`}>
                {heading}
              </h2>
            )}
            {subtext && (
              <p className={`mt-5 max-w-2xl text-base leading-relaxed md:text-lg ${dark ? "text-white/75" : "text-muted"}`}>
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
