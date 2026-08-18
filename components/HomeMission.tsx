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
              DSS is UC Berkeley&apos;s premier student organization for data science and machine learning. We are
              a community where students learn by doing, grow through mentorship, and build
              careers by impactfully applying technology in the fields they most care about.
            </p>

            <div className="mt-10">
              {/* rounded-full is a scoped exception here, matching the site's
                  other CTAs — not a change to EditorialButton's square default. */}
              <EditorialButton href="/about" className="rounded-full">
                Learn more about DSS
              </EditorialButton>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delayMs={200} className="mt-16 block md:mt-20">
          <div className="relative aspect-[21/9] w-full overflow-hidden border border-border">
            <Image
              src="/group-photo.jpg"
              alt="DSS members on the UC Berkeley campus"
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted">
            DSS Spring 2025 Members
          </p>
          </RevealOnScroll>
        </div>

        <HomeStats stats={stats} />
      </div>
    </section>
  );
}
