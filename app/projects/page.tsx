import type { Metadata } from "next";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import Button from "@/components/Button";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse past DSS projects — real-world data science work with industry partners across many domains.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  // Group by semester, preserving insertion order (newest first in JSON)
  const bySemester = projects.reduce<Record<string, typeof projects>>(
    (acc, p) => {
      if (!acc[p.semester]) acc[p.semester] = [];
      acc[p.semester].push(p);
      return acc;
    },
    {}
  );
  const semesters = Object.keys(bySemester);

  return (
    <>
      {/* Page header */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
            Projects
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-ink max-w-xl leading-tight">
            Real projects,<br />real impact.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-lg leading-relaxed">
            {/* TODO: finalize copy */}
            Every semester, DSS teams deliver production-quality data science
            work for industry partners across tech, finance, healthcare, and
            beyond. These are some of our favorites.
          </p>
        </div>
      </section>

      {/* Projects grouped by semester */}
      {semesters.map((semester, idx) => (
        <Section
          key={semester}
          eyebrow={semester}
          heading={`${semester} projects`}
          surface={idx % 2 === 1}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bySemester[semester].map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </Section>
      ))}

      {/* Partner CTA */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-20 flex flex-col items-center text-center gap-6">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Work with us
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink max-w-md leading-snug">
            Want DSS to work on your next project?
          </h2>
          <p className="text-muted max-w-md leading-relaxed">
            We partner with companies to tackle real data challenges every
            semester. Reach out and let&apos;s build something together.
          </p>
          <Button href="/partners" size="lg">
            Become a partner →
          </Button>
        </div>
      </section>
    </>
  );
}
