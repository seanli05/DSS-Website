import Image from "next/image";
import EditorialButton from "./EditorialButton";
import HomeStats from "./HomeStats";
import RevealOnScroll from "./RevealOnScroll";
import type { Stat } from "@/lib/content";

interface HomeMissionProps {
  stats: Stat[];
}

/**
 * Mission — the editorial opening of the page below the hero.
 *
 * Carries the fade out of the hero's gradient at its top edge so the first seam
 * reads as a transition rather than a cut. The group photo keeps its colour
 * (the palette is the brand's, not a monochrome one) and lifts slightly on
 * hover.
 */
export default function HomeMission({ stats }: HomeMissionProps) {
  return (
    <section className="font-poppins home-hero-fade pb-20 md:pb-24">
      {/* The stats band breaks out of the container below so its rules can run
          edge-to-edge, so the max-width wrapper only covers the prose above it. */}
      <div>
        <div className="mx-auto max-w-6xl px-6 pt-24 md:px-8 md:pt-28 lg:px-12 lg:pt-32">
        <RevealOnScroll delayMs={0}>
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
            (01) — Purpose
          </p>

          <h2 className="mt-6 text-[clamp(2.25rem,5vw,4.125rem)] font-normal leading-[0.95] tracking-tight text-ink">
            Our Mission
          </h2>

          {/* Thick rule punctuated by a small bordered square — structure without mass. */}
          <div className="mt-8 flex items-center gap-4" aria-hidden="true">
            <div className="h-[3px] w-20 bg-primary" />
            <div className="h-2.5 w-2.5 border-2 border-primary" />
            <div className="h-px flex-1 bg-border" />
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid gap-10 md:grid-cols-12 md:gap-12">
          <RevealOnScroll delayMs={100} className="md:col-span-4">
            <p className="text-[11px] uppercase leading-relaxed tracking-[0.18em] text-muted">
              Data Science Society
              <br />
              Berkeley, California
            </p>
          </RevealOnScroll>

          <RevealOnScroll delayMs={150} className="md:col-span-8">
            {/* TODO: finalize copy with DSS leadership */}
            <p className="text-lg leading-relaxed text-ink md:text-xl">
              DSS is UC Berkeley&apos;s premier student organization for data science — a
              community where students learn by doing, grow through mentorship, and build
              careers in tech, research, and consulting.
            </p>

            <div className="mt-10">
              <EditorialButton href="/about">Learn more about DSS</EditorialButton>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delayMs={200} className="group mt-16 block md:mt-20">
          <div className="relative aspect-[21/9] w-full overflow-hidden border border-border">
            <Image
              src="/group-photo.jpg"
              alt="DSS members on the UC Berkeley campus"
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
            />
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted">
            Fig. 01 — The society, in full
          </p>
          </RevealOnScroll>
        </div>

        <HomeStats stats={stats} />
      </div>
    </section>
  );
}
