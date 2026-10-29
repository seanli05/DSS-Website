import { type ReactNode } from "react";
import RevealOnScroll from "./RevealOnScroll";
import RichText from "./RichText";

export interface SectionHeaderProps {
  eyebrow?: string;
  /** Section number, rendered as "(01) — Eyebrow". Omit for unnumbered sections (closing CTAs). */
  index?: number;
  heading?: string;
  /** A string supports **bold** and [links](…) — see RichText. */
  subtext?: ReactNode;
  centered?: boolean;
  dark?: boolean; // white text, for dark backgrounds
  /** "lg" is the standard heading; "sm" is for closing CTAs that shouldn't compete with it. */
  size?: "lg" | "sm";
  className?: string;
}

const HEADING_SIZE = {
  lg: "text-[clamp(2rem,4vw,3.125rem)]",
  sm: "text-[clamp(1.5rem,2.5vw,2rem)]",
};

/** "(01) — Label", or just "Label" without an index. */
export function eyebrowLabel(eyebrow: string, index?: number): string {
  return index === undefined ? eyebrow : `(${String(index).padStart(2, "0")}) — ${eyebrow}`;
}

/**
 * The site's standard section intro: small numbered eyebrow → large light
 * heading → muted subtext. Used by <Section>, and directly by the few sections
 * that need a custom layout around it (About's community grid, Partners).
 */
export default function SectionHeader({
  eyebrow,
  index,
  heading,
  subtext,
  centered = false,
  dark = false,
  size = "lg",
  className = "",
}: SectionHeaderProps) {
  if (!eyebrow && !heading && !subtext) return null;
  const align = centered ? "mx-auto max-w-2xl text-center items-center" : "max-w-2xl";

  return (
    <RevealOnScroll delayMs={0} className={`${align} ${className}`}>
      {eyebrow && (
        <p className={`text-[11px] uppercase tracking-[0.18em] ${dark ? "text-white/80" : "text-primary"}`}>
          {eyebrowLabel(eyebrow, index)}
        </p>
      )}
      {heading && (
        <h2
          className={`mt-6 ${HEADING_SIZE[size]} font-normal leading-[1.05] tracking-tight ${dark ? "text-white" : "text-ink"}`}
        >
          {heading}
        </h2>
      )}
      {subtext && (
        <p className={`mt-5 max-w-2xl text-base leading-relaxed md:text-lg ${dark ? "text-white/75" : "text-muted"}`}>
          {typeof subtext === "string" ? <RichText text={subtext} /> : subtext}
        </p>
      )}
    </RevealOnScroll>
  );
}
