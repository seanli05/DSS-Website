import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Section from "@/components/Section";
import Button from "@/components/Button";
import ProjectCarousel from "@/components/ProjectCarousel";
import { getCommittees, getProjectsByCommittee } from "@/lib/content";

export function generateStaticParams() {
  return getCommittees().map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const committee = getCommittees().find((c) => c.id === id);
  if (!committee) return {};
  return { title: committee.name, description: committee.blurb };
}

export default async function CommitteePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const committee = getCommittees().find((c) => c.id === id);
  if (!committee) notFound();
  const projects = await getProjectsByCommittee(committee.id);

  return (
    <>
      {/* Page header */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
            <Link href="/committees" className="hover:text-primary transition-colors">
              Committees
            </Link>
            {" / "}
            {committee.name}
          </p>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl" aria-hidden="true">
              {committee.icon}
            </span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-ink leading-tight">
              {committee.name}
            </h1>
          </div>
          <p className="mt-6 text-lg text-muted max-w-lg leading-relaxed">
            {committee.blurb}
          </p>
        </div>
      </section>

      {/* Focus areas */}
      <Section eyebrow="What we do" heading={`${committee.name} focus areas.`}>
        <ul className="flex flex-wrap gap-3">
          {committee.focusAreas.map((area) => (
            <li
              key={area}
              className="rounded-full bg-surface border border-border px-4 py-2 font-mono text-xs text-muted"
            >
              {area}
            </li>
          ))}
        </ul>
        {committee.lead && !committee.lead.startsWith("TODO") && (
          <p className="mt-8 font-mono text-xs text-muted">
            Committee Lead: {committee.lead}
          </p>
        )}
      </Section>

      {/* Projects carousel */}
      {projects.length > 0 && (
        <Section
          eyebrow="Our work"
          heading={`${committee.name} projects`}
          subtext="A rotating look at what this committee has shipped. Click “See more” for the full story."
          surface
        >
          <ProjectCarousel projects={projects} />
        </Section>
      )}

      {/* Apply CTA */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-20 flex flex-col items-center text-center gap-6">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Interested?
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink max-w-md leading-snug">
            Join {committee.name} this semester.
          </h2>
          <p className="text-muted max-w-md leading-relaxed">
            {/* TODO: update with current recruitment dates */}
            We recruit in the first two weeks of Fall and Spring semester.
            Check the Join page for dates, timelines, and how to apply.
          </p>
          <Button href="/join" size="lg">
            Apply to DSS →
          </Button>
        </div>
      </section>
    </>
  );
}
