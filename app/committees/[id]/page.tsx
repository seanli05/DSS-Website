import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import Button from "@/components/Button";
import ProjectCarousel from "@/components/ProjectCarousel";
import GrowingSapling from "@/components/GrowingSapling";
import GrowingNetwork from "@/components/GrowingNetwork";
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
  // Social Good and Consulting get a dark brand-gradient "What we do" section
  // with white text and the scroll-driven graphic; other committees keep the
  // light look until they have their own hero image + long-form description.
  const useGreenSection = committee.id === "social-good" || committee.id === "consulting";

  return (
    <>
      {/* Page header — -mt-16/pt-16 pulls it up behind the fixed translucent nav (main has pt-16) */}
      {committee.heroImage ? (
        <section className="relative -mt-16 pt-16 flex min-h-[85vh] items-center overflow-hidden">
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
        <section className="relative -mt-16 pt-16 overflow-hidden brand-gradient">
          <div className="mx-auto max-w-[1200px] px-6 py-24">
            <p className="font-mono text-xs uppercase tracking-widest text-white/60 mb-4">
              <Link href="/committees" className="hover:text-white transition-colors">
                Committees
              </Link>
              {" / "}
              {committee.name}
            </p>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-5xl" aria-hidden="true">
                {committee.icon}
              </span>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                {committee.name}
              </h1>
            </div>
            <p className="mt-6 text-lg text-white/70 max-w-lg leading-relaxed">
              {committee.blurb}
            </p>
          </div>
        </section>
      )}

      {/* What we do: description (or focus areas) + projects.
          Green-section committees render their own header inside a two-column grid so the
          scroll-driven graphic on the right starts at the very top of the section. Each
          committee gets its own graphic: Social Good's GrowingSapling (growth/bloom),
          Consulting's GrowingNetwork (an expanding node-graph, echoing the site's own
          logo motif) — both share the same scroll-scrubbed mechanic. */}
      <Section
        eyebrow={useGreenSection ? undefined : "Our work"}
        heading={useGreenSection ? undefined : "What we do"}
        surface={!useGreenSection}
        dark={useGreenSection}
        className={useGreenSection ? "surface-green-gradient" : ""}
      >
        {committee.description ? (
          useGreenSection ? (
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
                <p className="max-w-2xl text-white/85 leading-relaxed">{committee.description}</p>
              </div>
              {committee.id === "social-good" ? (
                <GrowingSapling className="hidden md:block justify-self-center" />
              ) : (
                <GrowingNetwork className="hidden md:block justify-self-center" />
              )}
            </div>
          ) : (
            <p className="max-w-2xl text-muted leading-relaxed">{committee.description}</p>
          )
        ) : (
          <ul className="flex flex-wrap gap-3">
            {committee.focusAreas.map((area) => (
              <li
                key={area}
                className={`rounded-full border px-4 py-2 font-mono text-xs ${
                  useGreenSection
                    ? "bg-white/10 border-white/20 text-white/85"
                    : "bg-bg border-border text-muted"
                }`}
              >
                {area}
              </li>
            ))}
          </ul>
        )}
        {committee.lead && !committee.lead.startsWith("TODO") && (
          <p className={`mt-8 font-mono text-xs ${useGreenSection ? "text-white/70" : "text-muted"}`}>
            Committee Lead: {committee.lead}
          </p>
        )}

        {projects.length > 0 && (
          <div className="mt-16">
            <h3 className={`text-xl font-semibold ${useGreenSection ? "text-white" : "text-ink"}`}>
              Projects
            </h3>
            <p className={`mt-2 mb-8 text-sm leading-relaxed ${useGreenSection ? "text-white/70" : "text-muted"}`}>
              A rotating look at what this committee has shipped. Click “See more” for the full story.
            </p>
            <ProjectCarousel projects={projects} />
          </div>
        )}

        {/* These committees fold the apply CTA into the bottom of this same green
            section instead of a separate section below — kept minimal (no
            heading/paragraph) since it's now sharing a section with everything above. */}
        {useGreenSection && (
          <div className="mt-16 flex flex-col items-center text-center gap-4"> 
       <div className="flex gap-4 my-6">
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/social-good/dss_image_1.jpeg"
              alt="Social Good team"
              width={400}
              height={300}
              className="rounded-lg object-cover"
            />
            <p className="text-sm text-white/80">Last Social Good meeting of Spring 2026 :(</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/social-good/dss_image_2.png"
              alt="Social Good project"
              width={400}
              height={300}
              className="rounded-lg object-cover"
            />
            <p className="text-sm text-white/80">Social Good Social at Laser Tag!</p>
          </div>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-white/70">
          Interested?
        </p>     
            <Button href="/join" size="lg" className="!bg-white !text-primary hover:!bg-white/90">
              Apply to {committee.name} →
            </Button>
          </div>
        )}
      </Section>

      {/* Apply CTA — Social Good has its own version folded into the green section above */}
      {!useGreenSection && (
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
      )}
    </>
  );
}
