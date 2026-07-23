import Image from "next/image";
import Hero from "@/components/Hero";
import Button from "@/components/Button";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getStats, getPartners, getProjects } from "@/lib/content";

// Which stats.json entries appear in the mission window, in this order.
const HOME_STAT_LABELS = ["Active members", "Industry partners", "Years running"];

export default async function HomePage() {
  const [partners, projects] = await Promise.all([getPartners(), getProjects()]);
  const stats = HOME_STAT_LABELS.map(
    (label) => getStats().find((s) => s.label === label)
  ).filter((s) => s !== undefined);

  return (
    <>
      {/* 1. Hero (headline + logo + partner marquee) */}
      <Hero partners={partners} projects={projects} />

      {/* 2. Mission + stats window */}
      <section className="relative mission-fade-gradient">
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 pt-20 pb-20">
          {/* Staggered in three waves (0/150/300ms) rather than one block, matching the
              cascading reveal on product.studentorg.berkeley.edu. */}
          <RevealOnScroll delayMs={0} className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Purpose</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink leading-snug">Our Mission</h2>
          </RevealOnScroll>

          <RevealOnScroll
            delayMs={150}
            className="relative mt-8 aspect-[21/9] w-full overflow-hidden rounded-2xl"
          >
            <Image
              src="/group-photo.jpg"
              alt="DSS members group photo on the UC Berkeley campus"
              fill
              sizes="(min-width: 1200px) 1200px, 100vw"
              className="object-cover"
            />
          </RevealOnScroll>

          <RevealOnScroll delayMs={300}>
            <div className="mt-10 mx-auto max-w-2xl text-center">
              <p className="text-lg text-muted leading-relaxed">
                {/* TODO: finalize copy with DSS leadership */}
                DSS is UC Berkeley&apos;s premier student organization for data science — a community
                where students learn by doing, grow through mentorship, and build careers in
                tech, research, and consulting.
              </p>
            </div>

            <div className="mt-10 mx-auto grid max-w-2xl grid-cols-3 gap-6 text-center">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <span className="font-mono text-4xl md:text-5xl font-bold text-primary tabular-nums">
                    {stat.value.toLocaleString()}
                    {stat.suffix}
                  </span>
                  <span className="text-sm text-muted">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Button href="/partners" variant="primary" size="lg" className="!rounded-lg">
                Partner with us →
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
