import type { SVGProps } from "react";

/**
 * A small, consistent line-icon set for the Partners offerings menu — one
 * lucide-style 24×24 stroke glyph per offering `icon` key from
 * content/offerings.json. Replaces the earlier emoji so the page reads polished
 * to an industry audience. Icons inherit `currentColor`, so set color/opacity on
 * a parent. Unknown keys fall back to the consulting glyph rather than crashing.
 */

type IconKey =
  | "consulting"
  | "recruiting"
  | "speaker"
  | "hackathon"
  | "research";

// Each entry is the inner paths of a 24×24, stroke, no-fill icon.
const PATHS: Record<IconKey, React.ReactNode> = {
  // Nodes wired into a solution — mirrors the DSS node-graph motif
  consulting: (
    <>
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="17" r="2.5" />
      <path d="M8 8.4 10.6 15M15.7 7.4 13 15M8.4 7 15.6 6.2" />
    </>
  ),
  // People / talent pipeline
  recruiting: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M4 20a5 5 0 0 1 10 0" />
      <path d="M16 4.5a3 3 0 0 1 0 6M17 15a5 5 0 0 1 3 5" />
    </>
  ),
  // Podium / speaker at a mic
  speaker: (
    <>
      <rect x="8.5" y="3" width="7" height="10" rx="3.5" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
    </>
  ),
  // Terminal / code — hackathon
  hackathon: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M13 15h4" />
    </>
  ),
  // Magnifier over data — research
  research: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
      <path d="M8.5 11.5v-2M10.5 11.5v-3.5M12.5 11.5v-1.5" />
    </>
  ),
};

interface OfferingIconProps extends SVGProps<SVGSVGElement> {
  name: string;
}

export default function OfferingIcon({ name, ...props }: OfferingIconProps) {
  const paths = PATHS[name as IconKey] ?? PATHS.consulting;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths}
    </svg>
  );
}
