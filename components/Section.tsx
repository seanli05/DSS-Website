import { type ReactNode } from "react";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  surface?: boolean;   // use --color-surface bg instead of white
  dark?: boolean;      // white header text, for dark backgrounds passed via className
  centered?: boolean;  // center-align the header text
  className?: string;
  children?: ReactNode;
}

/**
 * Standard page section: optional eyebrow label → heading → subtext → children.
 * Handles vertical rhythm and container width automatically.
 */
export default function Section({
  id,
  eyebrow,
  heading,
  subtext,
  surface = false,
  dark = false,
  centered = false,
  className = "",
  children,
}: SectionProps) {
  const align = centered ? "text-center items-center" : "";

  return (
    <section id={id} className={`py-24 ${surface ? "bg-surface" : "bg-bg"} ${className}`}>
      <div className={`mx-auto max-w-[1200px] px-6 flex flex-col ${align}`}>
        {/* Section header */}
        {(eyebrow || heading || subtext) && (
          <div className={`flex flex-col gap-4 mb-12 ${align} ${centered ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>
            {eyebrow && (
              <p className={`font-mono text-xs uppercase tracking-widest ${dark ? "text-white/70" : "text-muted"}`}>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className={`text-3xl font-bold tracking-tight leading-snug ${dark ? "text-white" : "text-ink"}`}>
                {heading}
              </h2>
            )}
            {subtext && (
              <p className={`text-lg leading-relaxed ${dark ? "text-white/85" : "text-muted"}`}>{subtext}</p>
            )}
          </div>
        )}

        {/* Section body */}
        {children}
      </div>
    </section>
  );
}
