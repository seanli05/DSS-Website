import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import EditorialButton from "@/components/EditorialButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import ProjectCarousel from "@/components/ProjectCarousel";
import CommitteePhoto from "@/components/CommitteePhoto";
import CommitteeActivities from "@/components/CommitteeActivities";
import {
  getCommittees,
  getDescriptionParagraphs,
  getProjectsByCommittee,
} from "@/lib/content";

// Shared hero bits, so the photo and gradient variants below can't drift apart.
const HERO_EYEBROW =
  "inline-flex border border-white/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/80";
const HERO_H1 =
  "text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white";
const HERO_BLURB = "mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg";
const HERO_CONTAINER =
  "relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24 lg:px-12";

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
  const paragraphs = getDescriptionParagraphs(committee.description);
  // Only some committees have activity tiles, so the section numbers after them
  // have to be derived rather than hardcoded.
  const activities = committee.activities ?? [];
  const projectsIndex = activities.length > 0 ? 3 : 2;
  // Acadev's portfolio showcases student DeCal projects, not client work, and is
  // sourced separately from the Consulting/Social Good Airtable project feed.
  const isAcadevProjects = committee.id === "acadev";

  const breadcrumb = (
    <p className={HERO_EYEBROW}>
      <Link href="/committees" className="transition-colors hover:text-white">
        Committees
      </Link>
      {" / "}
      {committee.name}
    </p>
  );

  return (
    <>
      {/* Page header — -mt-16/pt-16 pulls it up behind the fixed translucent nav (main has pt-16) */}
      {committee.heroImage ? (
        <section className="font-poppins relative -mt-16 flex min-h-[85vh] items-center overflow-hidden pt-16">
          <Image
            src={committee.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/70" aria-hidden="true" />
          <div className={HERO_CONTAINER}>
            {breadcrumb}
            <h1 className={`mt-8 ${HERO_H1}`}>{committee.name}</h1>
            <p className={HERO_BLURB}>{committee.blurb}</p>
          </div>
        </section>
      ) : (
        <section className="font-poppins relative -mt-16 overflow-hidden pt-16 surface-green-gradient">
          <div className={HERO_CONTAINER}>
            {breadcrumb}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-5xl" aria-hidden="true">
                {committee.icon}
              </span>
              <h1 className={HERO_H1}>{committee.name}</h1>
            </div>
            <p className={HERO_BLURB}>{committee.blurb}</p>
          </div>
        </section>
      )}

      {/* One continuous gradient from the hero's green down into the footer's,
          so both seams read as fades. Sections inside must stay transparent. */}
      <div className="fade-between-gradients">
        {/* What we do: copy (or focus areas) on the left, a vertical committee
            photo on the right, then projects. The text column is deliberately
            narrower than the old full-width paragraph — 42rem at this size runs
            ~90 characters per line, well past a comfortable measure. Committees
            without a photo yet render CommitteePhoto's placeholder frame, so the
            layout is already right and going live is one file plus one JSON field. */}
        <Section index={1} eyebrow="Our work" heading="What we do" divider>
          {/* Proportional columns, not fixed widths: 1.4fr/1fr always sums to the
              container, so the pair fills the section rather than leaving dead space
              to the right of the photo.

              Deliberately NOT items-start: the row stretches, so the photo takes its
              height from the copy beside it and both columns end on exactly the same
              line, cropping (object-cover) rather than letterboxing to get there.

              Two columns only from lg up. In the md band the column is narrow enough
              that the copy runs tall, and a photo stretched to match would come out a
              292x753 sliver — so tablets stack instead. */}
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            <div className="flex max-w-2xl flex-col lg:max-w-none">
              {paragraphs.length > 0 ? (
                /* First paragraph is the lead — darker and a step larger, so the
                   copy has an entry point instead of one even block of grey. */
                <RevealOnScroll delayMs={100} className="flex flex-col gap-5">
                  {paragraphs.map((paragraph, i) => (
                    <p
                      key={paragraph}
                      className={
                        i === 0
                          ? "text-lg leading-relaxed text-ink md:text-xl"
                          : "text-base leading-relaxed text-muted md:text-lg"
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </RevealOnScroll>
              ) : (
                <RevealOnScroll delayMs={100}>
                  <ul className="flex flex-wrap gap-3">
                    {committee.focusAreas.map((area) => (
                      <li
                        key={area}
                        className="border border-border bg-bg px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-muted"
                      >
                        {area}
                      </li>
                    ))}
                  </ul>
                </RevealOnScroll>
              )}
              {committee.lead && !committee.lead.startsWith("TODO") && (
                /* mt-auto pins the byline to the bottom of the column, so it meets the
                   photo's caption on the same line even when the copy above is short. */
                <RevealOnScroll delayMs={150} className="mt-10 lg:mt-auto lg:pt-10">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                    Committee Lead: {committee.lead}
                  </p>
                </RevealOnScroll>
              )}
            </div>

            {/* Capped while stacked so a 2:3 portrait doesn't eat the whole screen;
                fills its column — and its full row height — from lg up. */}
            <RevealOnScroll delayMs={200} className="mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:flex lg:max-w-none lg:flex-col">
              <CommitteePhoto
                src={committee.workImage}
                alt={committee.workImageAlt}
                caption={committee.workCaption}
                images={committee.workImages}
                figure="01"
              />
            </RevealOnScroll>
          </div>

        </Section>

        {/* How we spend our time — what the committee's weeks actually look like,
            as opposed to what it produces. Only committees with activities in
            committees.json render this at all. */}
        {activities.length > 0 && (
          <Section
            index={2}
            eyebrow="Committee life"
            heading="How we spend our time"
            subtext="Beyond the client work, this is what a semester in the committee looks like."
          >
            <CommitteeActivities activities={activities} />
          </Section>
        )}

        {/* Projects — its own section rather than a subheading inside "What we do",
            so the activities section above can sit between the two. */}
        {(projects.length > 0 || isAcadevProjects) && (
          <Section
            index={projectsIndex}
            eyebrow={isAcadevProjects ? "DeCal portfolio" : "Portfolio"}
            heading="Projects"
            subtext={
              isAcadevProjects
                ? undefined
                : "A rotating look at what this committee has shipped. Click “See more” for the full story."
            }
          >
            {projects.length > 0 && (
              <RevealOnScroll delayMs={100}>
                <ProjectCarousel projects={projects} />
              </RevealOnScroll>
            )}
          </Section>
        )}

        {/* Apply CTA — closes every committee page. Unnumbered, matching how
            Partners closes. */}
        <Section
          eyebrow="Interested?"
          heading={`Join ${committee.name} this semester.`}
          subtext="We recruit in the first two weeks of Fall and Spring semester. Check the Join page for dates, timelines, and how to apply."
          centered
        >
          {/* TODO: update with current recruitment dates */}
          <RevealOnScroll delayMs={100}>
            <EditorialButton href="/join">Apply to {committee.name}</EditorialButton>
          </RevealOnScroll>
        </Section>
      </div>
    </>
  );
}
