import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
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

const HERO_H1 =
  "text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white";
const HERO_BLURB = "mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg";
const HERO_CONTAINER =
  "relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24 lg:px-12";

export function generateStaticParams() {
  // "social-good" has its own static route (app/committees/social-good/page.tsx),
  // frozen on its pre-redesign look — see the note in that route's
  // LegacySection.tsx. Excluding it here avoids a route conflict at build time.
  return getCommittees()
    .filter((c) => c.id !== "social-good")
    .map((c) => ({ id: c.id }));
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
  const activities = committee.activities ?? [];
  // "What we do" is always 1. Projects and the activities tiles are each
  // optional and rendered in that order, so their numbers have to be derived
  // rather than hardcoded — a committee with only one of the two shouldn't
  // skip straight to "(03)".
  let sectionIndex = 1;
  const projectsIndex = projects.length > 0 ? ++sectionIndex : undefined;
  const activitiesIndex = activities.length > 0 ? ++sectionIndex : undefined;
<<<<<<< Updated upstream
  // Acadev's portfolio showcases student DeCal projects, not client work, and is
  // sourced separately from the Consulting/Social Good Airtable project feed.
  const isAcadevProjects = committee.id === "acadev";
=======
  // Every committee's workImage is a vertical 2:3 shot except Consulting's,
  // which is a wide group photo — see the `landscape` prop on CommitteePhoto.
  const isLandscapePhoto = committee.id === "consulting";
>>>>>>> Stashed changes


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
            <h1 className={HERO_H1}>{committee.name}</h1>
            <p className={HERO_BLURB}>{committee.blurb}</p>
          </div>
        </section>
      ) : (
        <section className="font-poppins relative -mt-16 overflow-hidden pt-16 surface-green-gradient">
          <div className={HERO_CONTAINER}>
            <div className="flex items-center gap-4">
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
              to the right of the photo. Kept the same for `landscape` too — widening
              the photo's own *column* would come straight out of the copy's width,
              which read as cramped. Its extra size instead comes from bleeding past
              its column via negative margins (see below), so the copy never moves.

              Deliberately NOT items-start for the default case: the row stretches, so
              the photo takes its height from the copy beside it and both columns end
              on exactly the same line, cropping (object-cover) rather than
              letterboxing to get there. `landscape` opts back into that with
              `lg:items-center` instead, since its photo already sizes itself.

              Two columns only from lg up. In the md band the column is narrow enough
              that the copy runs tall, and a photo stretched to match would come out a
              292x753 sliver — so tablets stack instead. */}
          <div
            className={`grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16 ${isLandscapePhoto ? "lg:items-center" : ""}`}
          >
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
                <RevealOnScroll delayMs={150} className="mt-10">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                    Committee Lead: {committee.lead}
                  </p>
                </RevealOnScroll>
              )}
            </div>

            {/* Capped while stacked so a 2:3 portrait doesn't eat the whole screen;
                fills its column — and its full row height — from lg up.

                `landscape` additionally bleeds right past its own column, into the
                section's own padding (lg:px-12 is 3rem; the extra 2.5rem of width
                below eats most of that, leaving half a rem before the true edge) —
                so the photo reads larger without the copy column narrowing to make
                room. A wider *width*, not a negative margin: this box's width is
                `w-full` (100% of its track), and margins don't add to an explicit
                width, so a negative margin here would only sit unused. Left edge
                stays put: bleeding into the gap there pulled the photo toward the
                copy and read as the two crowding each other, even though the copy's
                own width never changed. */}
            <RevealOnScroll
              delayMs={200}
              className={`mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:flex lg:max-w-none lg:flex-col ${
                isLandscapePhoto ? "lg:w-[calc(100%+2.5rem)]" : ""
              }`}
            >
              <CommitteePhoto
                src={committee.workImage}
                alt={committee.workImageAlt}
                caption={committee.workCaption}
                images={committee.workImages}
                figure="01"
                landscape={isLandscapePhoto}
              />
            </RevealOnScroll>
          </div>

        </Section>

        {/* Projects — the portfolio comes right after "What we do", so the
            evidence for that claim is the next thing a visitor sees. Same
            continuous white field as everything else on the page — the
            rounded, shadowed cards themselves are what set this section apart,
            not a background-color switch. */}
        {projects.length > 0 && (
          <Section
            index={projectsIndex}
<<<<<<< Updated upstream
            eyebrow={isAcadevProjects ? "DeCal portfolio" : "Portfolio"}
            heading="Projects"
            subtext={
              isAcadevProjects
                ? "A selection of student projects developed with mentorship from Acadev instructors throughout the DeCal."
                : "A rotating look at what this committee has shipped. Click “Read more” for the full story."
            }
          >
            {projects.length > 0 && (
              <RevealOnScroll delayMs={100}>
                <ProjectCarousel projects={projects} circular={isAcadevProjects} />
              </RevealOnScroll>
            )}
=======
            eyebrow="Portfolio"
            heading="Projects"
            subtext="A rotating look at what this committee has shipped. Click “See more” for the full story."
          >
            <RevealOnScroll delayMs={100}>
              <ProjectCarousel projects={projects} />
            </RevealOnScroll>
>>>>>>> Stashed changes
          </Section>
        )}

        {/* Outside of projects — what the committee's weeks look like beyond the
            client work itself. Only committees with activities in
            committees.json render this at all. */}
        {activities.length > 0 && (
          <Section
            index={activitiesIndex}
            eyebrow="Committee life"
            heading="Outside of projects"
<<<<<<< Updated upstream
            subtext="Client work is the core of what we do — this is everything else that makes up a semester."
=======
            subtext="Beyond client work, we make time to grow, learn, and have fun."
>>>>>>> Stashed changes
          >
            <CommitteeActivities activities={activities} />
          </Section>
        )}

        {/* Apply CTA — closes every committee page. Unnumbered, matching how
            Partners closes. size="sm" keeps this from competing with the real
            section headings above it. */}
        <Section
          eyebrow="Interested?"
          heading={`Join ${committee.name} this semester.`}
          subtext="We recruit in the first two weeks of Fall and Spring semester. Check the Join page for dates, timelines, and how to apply."
          centered
          size="sm"
        >
          {/* TODO: update with current recruitment dates */}
          {/* -mt-6 pulls the button up closer to the subtext above it; rounded-full
              is a scoped exception here, not a change to EditorialButton itself. */}
          <RevealOnScroll delayMs={100} className="-mt-6">
            <EditorialButton href="/join" className="rounded-full">
              Apply to {committee.name}
            </EditorialButton>
          </RevealOnScroll>
        </Section>
      </div>
    </>
  );
}
