import StatCounter from "./StatCounter";
import RevealOnScroll from "./RevealOnScroll";
import type { Stat } from "@/lib/content";

interface HomeStatsProps {
  stats: Stat[];
}

/**
 * The proof band — a block inside the Mission section rather than a section of
 * its own, so the numbers read as evidence for the paragraph above them instead
 * of a separate chapter.
 *
 * The rules run the full width of the viewport while the figures stay on the
 * page's normal container, so the band reads as a ruled line across the page
 * with the numbers sitting on the same left edge as everything above it.
 */
export default function HomeStats({ stats }: HomeStatsProps) {
  return (
    <RevealOnScroll delayMs={0} className="mt-14 border-y border-border">
      <div className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12">
        {/* Single row at md+, so `divide-x` lands exactly on the three internal
            gaps. (It would misfire on a 2×2 grid, where it also draws down the
            left of the wrapped item.) */}
        <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="py-8 md:px-6 md:first:pl-0 md:last:pr-0 lg:py-9">
              <StatCounter {...stat} variant="editorial" />
            </div>
          ))}
        </div>
      </div>
    </RevealOnScroll>
  );
}
