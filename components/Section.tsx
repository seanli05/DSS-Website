import { type ReactNode } from "react";
import SectionHeader, { type SectionHeaderProps } from "./SectionHeader";

interface SectionProps extends Omit<SectionHeaderProps, "className"> {
  id?: string;
  /** The page's first section: skips the hairline rule drawn above every other section. */
  firstOnPage?: boolean;
  /** Set false to drop the hairline rule above the section (the About page has none). */
  seam?: boolean;
  /** Tighter vertical spacing and no rules — the Social Good committee page's look. */
  compact?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * Standard page section: header (eyebrow → heading → subtext) then children,
 * in the site's max-w-6xl column with consistent vertical rhythm.
 *
 * Has no background of its own: pages wrap their body in `fade-between-gradients`
 * (globals.css) and an opaque section would punch a hole in it. Sections are
 * separated by a full-width hairline instead (`seam`).
 */
export default function Section({
  id,
  firstOnPage = false,
  seam = true,
  compact = false,
  centered = false,
  size = "lg",
  className = "",
  children,
  ...header
}: SectionProps) {
  const showSeam = seam && !firstOnPage && !compact;
  // A compact page's closing CTA keeps the normal padding, matching other pages.
  const padding = compact && size !== "sm" ? "py-10 md:py-14" : "py-16 md:py-20";

  return (
    <section
      id={id}
      className={`font-poppins relative ${showSeam ? "border-t border-border" : ""} ${className}`}
    >
      <div
        className={`mx-auto flex max-w-6xl flex-col px-6 ${padding} md:px-8 lg:px-12 ${
          centered ? "items-center text-center" : ""
        }`}
      >
        <SectionHeader {...header} centered={centered} size={size} className="mb-14" />
        {children}
      </div>
    </section>
  );
}
