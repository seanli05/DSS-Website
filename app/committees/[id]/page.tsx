import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import Button from "@/components/Button";
import ProjectCarousel from "@/components/ProjectCarousel";
import GrowingSapling from "@/components/GrowingSapling";
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
  // Social Good gets a dark brand-gradient "What we do" section with white
  // text and the scroll-grown sapling; other committees keep the light look.
  const isSocialGood = committee.id === "social-good";

  return (
    <>
      {/* Page header */}
      {committee.heroImage ? (
        <section className="relative flex min-h-[85vh] items-center overflow-hidden">
          <Image
            src={committee.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/70" aria-hidden="true" />
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-24">
            <p className="font-mono text-xs uppercase tracking-widest text-white/60 mb-4">
              <Link href="/committees" className="hover:text-white transition-colors">
                Committees
              </Link>
              {" / "}
              {committee.name}
            </p>
            <h1 className="mb-2 text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              {committee.name}
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-lg leading-relaxed">
              {committee.blurb}
            </p>
          </div>
        </section>
      ) : (
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
      )}

      {/* What we do: description (or focus areas) + projects.
          Social Good renders its own header inside a two-column grid so the
          scroll-grown roots start at the very top of the section. */}
      <Section
        eyebrow={isSocialGood ? undefined : "Our work"}
        heading={isSocialGood ? undefined : "What we do"}
        surface={!isSocialGood}
        dark={isSocialGood}
        className={isSocialGood ? "surface-green-gradient" : ""}
      >
        {committee.description ? (
          isSocialGood ? (
            /* header + paragraph left, roots growing downward on the right (md+) */
            <div className="md:grid md:grid-cols-[minmax(0,42rem)_1fr] md:items-start md:gap-12">
              <div>
                <div className="flex flex-col gap-4 mb-12">
                  <p className="font-mono text-xs uppercase tracking-widest text-white/70">
                    Our work
                  </p>
                  <h2 className="text-3xl font-bold tracking-tight leading-snug text-white">
                    What we do
                  </h2>
                </div>
                <p className="max-w-2xl text-white/90 leading-relaxed">{committee.description}</p>
                {/* Projects heading lives in this column so it fills the space
                    beside the roots instead of leaving a blank band below */}
                {projects.length > 0 && (
                  <div className="mt-14">
                    <h3 className="text-xl font-semibold text-white">Projects</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">
                      A rotating look at what this committee has shipped. Click “See more” for the full story.
                    </p>
                  </div>
                )}
              </div>
              <GrowingSapling className="hidden md:block justify-self-center" />
            </div>
          ) : (
            <p className="max-w-2xl text-muted leading-relaxed">{committee.description}</p>
          )
        ) : (
          <ul className="flex flex-wrap gap-3">
            {committee.focusAreas.map((area) => (
              <li
                key={area}
                className="rounded-full bg-bg border border-border px-4 py-2 font-mono text-xs text-muted"
              >
                {area}
              </li>
            ))}
          </ul>
        )}
        {committee.lead && !committee.lead.startsWith("TODO") && (
          <p className={`mt-8 font-mono text-xs ${isSocialGood ? "text-white/85" : "text-muted"}`}>
            Committee Lead: {committee.lead}
          </p>
        )}

        {/* Social Good: heading is up in the grid, so only the carousel goes here */}
        {isSocialGood && projects.length > 0 && (
          <div className="mt-8">
            <ProjectCarousel projects={projects} dark />
          </div>
        )}

        {!isSocialGood && projects.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-ink">Projects</h3>
            <p className="mt-2 mb-8 text-sm leading-relaxed text-muted">
              A rotating look at what this committee has shipped. Click “See more” for the full story.
            </p>
            <ProjectCarousel projects={projects} />
          </div>
        )}
      </Section>

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
