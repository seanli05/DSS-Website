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
  getAcadevClientProjects,
  getCommittees,
  getDescriptionParagraphs,
  getProjectsByCommittee,
} from "@/lib/content";

const HERO_H1 =
  "text-center text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white";
const HERO_BLURB = "mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg";
const HERO_CONTAINER =
  "relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24 lg:px-12";

/**
 * Committee pages sit at the site root (`/acadev`), not under `/committees`.
 * That makes this a root-level dynamic segment, which would otherwise match
 * EVERY unmatched top-level path and render a committee page shell for it —
 * so params are locked to the list below and anything else 404s.
 *
 * The one thing to watch when adding a committee: its `id` must not collide
 * with an existing top-level route (`about`, `join`, `partners`, `contact`,
 * `styleguide`, `api`). Next resolves static routes before dynamic ones, so a
 * committee called "about" would silently never render.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  // "social-good" has its own static route (app/social-good/page.tsx), frozen on
  // its pre-redesign look — see the note in that route's LegacySection.tsx.
  // Excluding it here avoids a route conflict at build time.
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
  const isAcadev = committee.id === "acadev";
  // Student DeCal work lives on the dedicated /decal landing page. Committee
  // pages here show the standard portfolio only for the other committees.
  const projects = isAcadev ? [] : await getProjectsByCommittee(committee.id);
  // Acadev's client work is distinct from the student projects it mentors.
  // It remains optional because the Airtable table may not be configured.
  const clientProjects = isAcadev ? await getAcadevClientProjects() : [];
  const paragraphs = getDescriptionParagraphs(committee.description);
  const activities = committee.activities ?? [];
  // "What we do" is always 1. The portfolio, Acadev client work, and activities
  // are optional and rendered in that order, so their numbers are derived.
  // A committee with only some of them
  // shouldn't skip straight to "(03)".
  let sectionIndex = 1;
  const projectsIndex = projects.length > 0 ? ++sectionIndex : undefined;
  const clientProjectsIndex = clientProjects.length > 0 ? ++sectionIndex : undefined;
  const activitiesIndex = activities.length > 0 ? ++sectionIndex : undefined;
  // Consulting's and Acadev's workImages are wide group photos; every other
  // committee's is a vertical 2:3 shot — see the `landscape` prop on
  // CommitteePhoto. Both of these are 3:2, so the landscape frame fits them
  // exactly and object-cover has nothing to crop.
  const isLandscapePhoto = committee.id === "consulting" || isAcadev;


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
            {/* justify-center, not just text-center on the h1: the icon and the
                title are flex siblings, so the pair has to be centred as a unit. */}
            <div className="flex items-center justify-center gap-4">
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
        <Section index={1} eyebrow="Our work" heading="What we do" firstOnPage>
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
            eyebrow="Portfolio"
            heading="Recent Projects"
            subtext="A rotating look at what this committee has shipped. Click “See more” for the full story."
          >
            <RevealOnScroll delayMs={100}>
              <ProjectCarousel projects={projects} />
            </RevealOnScroll>
          </Section>
        )}

        {/* Acadev's client work — a second portfolio, kept visually identical to
            the Consulting and Social Good sections (same eyebrow, subtext, and
            non-circular carousel) so client projects read the same wherever they
            appear on the site. Only renders when the Airtable table is
            configured and returns rows. */}
        {clientProjects.length > 0 && (
          <Section
            index={clientProjectsIndex}
            eyebrow="Portfolio"
            heading="Client Projects"
            subtext="Alongside our teaching responsibilities, our committee also works on a client project during the semester. Here are some of the projects that have helped our members gain more project experience."
          >
            <RevealOnScroll delayMs={100}>
              <ProjectCarousel projects={clientProjects} />
            </RevealOnScroll>
          </Section>
        )}

        {/* What the committee's weeks look like beyond the client work itself.
            Only committees with activities in committees.json render this at
            all. Acadev uses Social Good's wording for it verbatim (see
            app/social-good/page.tsx) — its section is mostly teaching rather
            than client work, so "Outside of projects" didn't describe it.
            Consulting keeps the original heading. */}
        {activities.length > 0 && (
          <Section
            index={activitiesIndex}
            eyebrow="Committee life"
            heading={isAcadev ? "How we spend our time" : "Outside of projects"}
            subtext={
              isAcadev
                ? "Beyond the client work, this is what a semester in the committee looks like."
                : "Beyond client work, we make time to grow, learn, and have fun."
            }
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
