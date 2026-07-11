import Image from "next/image";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import StatCounter from "@/components/StatCounter";
import LogoWall from "@/components/LogoWall";
import CommitteeCard from "@/components/CommitteeCard";
import ProjectCarousel from "@/components/ProjectCarousel";
import DualCTA from "@/components/DualCTA";
import Button from "@/components/Button";
import {
  getStats,
  getPartners,
  getFeaturedCommittees,
  getProjects,
} from "@/lib/content";

export default async function HomePage() {
  const stats = getStats();
  const committees = getFeaturedCommittees();
  const [projects, partners] = await Promise.all([getProjects(), getPartners()]);

  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Mission */}
      <Section centered>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Purpose</p>
        <h2 className="text-3xl font-bold tracking-tight text-ink leading-snug">Our Mission</h2>
        <Image
          src="/group-photo.jpg"
          alt="DSS members group photo on the UC Berkeley campus"
          width={2000}
          height={900}
          className="rounded-2xl w-full max-w-4xl mx-auto shadow-sm my-10"
          priority
        />
        <p className="text-xl text-center text-muted max-w-2xl mx-auto leading-relaxed">
          {/* TODO: finalize copy with DSS leadership */}
          DSS is UC Berkeley&apos;s premier student organization for data science — a community
          where students learn by doing, grow through mentorship, and build careers in
          tech, research, and consulting.
        </p>
      </Section>

      {/* 3. Stats */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Partner logo wall */}
      <LogoWall partners={partners} projects={projects} />

      {/* 5. Committees preview */}
      <Section
        eyebrow="Get involved"
        heading="Find your niche."
        subtext="Four committees, one community. Pick your passion and start building."
        surface
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {committees.map((c) => (
            <CommitteeCard key={c.id} committee={c} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/committees" variant="outline">
            See all committees →
          </Button>
        </div>
      </Section>

      {/* 6. Projects */}
      <Section
        eyebrow="Our work"
        heading="Real projects, real impact."
        subtext="We don't just study data science — we apply it. Every semester, DSS teams deliver production-quality work for industry partners."
      >
        <ProjectCarousel projects={projects} />
        <div className="mt-10 text-center">
          <Button href="/committees" variant="outline">
            See committee projects →
          </Button>
        </div>
      </Section>

      {/* 7. Dual CTA */}
      <DualCTA />
    </>
  );
}
