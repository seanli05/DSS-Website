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
  committeePage as copy,
  fillTemplate,
  getAcadevClientProjects,
  getCommittee,
  getCommittees,
  getDescriptionParagraphs,
  getProjectsByCommittee,
} from "@/lib/content";

/**
 * One page per committee, at the site root: /acadev, /consulting, /social-good.
 *
 * Committee details (name, blurb, photos, activities): content/committees/committees.json.
 * Section headings shared by every committee page: content/committees/page.json.
 *
 * Adding a committee to committees.json creates its page automatically. Its `id`
 * must not collide with another top-level route (about, join, partners, contact,
 * decal, styleguide, api) — static routes win, so it would silently never render.
 */
export const dynamicParams = false; // any other top-level path 404s instead of rendering an empty committee page

export function generateStaticParams() {
  return getCommittees().map((c) => ({ id: c.id }));
}

// Social Good keeps the tighter spacing (and no hairlines between sections) it
// launched with. Remove it from this list to give it the standard layout.
const COMPACT_LAYOUT = new Set(["social-good"]);

const HERO_H1 =
  "text-center text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white";
const HERO_BLURB = "mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg";
const HERO_CONTAINER = "relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24 lg:px-12";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const committee = getCommittee((await params).id);
  return committee ? { title: committee.name, description: committee.blurb } : {};
}

export default async function CommitteePage({ params }: Params) {
  const committee = getCommittee((await params).id);
  if (!committee) notFound();

  const projects = await getProjectsByCommittee(committee.id);
  // Acadev's client work is separate from the student projects it mentors
  // (those live on /decal). Empty unless its Airtable table is configured.
  const clientProjects = committee.id === "acadev" ? await getAcadevClientProjects() : [];
  const paragraphs = getDescriptionParagraphs(committee.description);
  const activities = committee.activities ?? [];
  const compact = COMPACT_LAYOUT.has(committee.id);
  const landscape = committee.workImageOrientation === "landscape";
  const vars = { committee: committee.name };

  // "What we do" is always (01); the optional sections after it are numbered
  // in order, so a committee missing one never skips a number.
  let sectionIndex = 1;
  const projectsIndex = projects.length > 0 ? ++sectionIndex : undefined;
  const clientProjectsIndex = clientProjects.length > 0 ? ++sectionIndex : undefined;
  const activitiesIndex = activities.length > 0 ? ++sectionIndex : undefined;

  return (
    <>
      {/* Header: full-bleed photo when the committee has a heroImage, else the green gradient. */}
      {committee.heroImage ? (
        <section className="font-poppins relative -mt-16 flex min-h-[85vh] items-center overflow-hidden pt-16">
          <Image src={committee.heroImage} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-ink/70" aria-hidden="true" />
          <div className={HERO_CONTAINER}>
            <h1 className={HERO_H1}>{committee.name}</h1>
            <p className={HERO_BLURB}>{committee.blurb}</p>
          </div>
        </section>
      ) : (
        <section className="font-poppins relative -mt-16 overflow-hidden pt-16 surface-green-gradient">
          <div className={HERO_CONTAINER}>
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

      <div className="fade-between-gradients">
        {/* (01) What we do — copy on the left, committee photo on the right.
            Two columns only from lg; below that they stack, photo last.

            Portrait photos stretch to the height of the copy beside them (and
            crop to fit), so both columns end on the same line. Landscape photos
            keep their own 3:2 shape, centred against the copy, and bleed 2.5rem
            into the right-hand padding so they read larger. */}
        <Section index={1} eyebrow={copy.whatWeDo.eyebrow} heading={copy.whatWeDo.heading} firstOnPage compact={compact}>
          <div
            className={`grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16 ${landscape ? "lg:items-center" : ""}`}
          >
            <div className="flex max-w-2xl flex-col lg:max-w-none">
              {paragraphs.length > 0 ? (
                // The first paragraph is the lead — darker and a step larger.
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
                // Next to a stretching portrait photo, pin the byline to the bottom
                // of the column so it lines up with the photo's caption.
                <RevealOnScroll delayMs={150} className={landscape ? "mt-10" : "mt-10 lg:mt-auto lg:pt-10"}>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                    {copy.whatWeDo.leadLabel} {committee.lead}
                  </p>
                </RevealOnScroll>
              )}
            </div>

            <RevealOnScroll
              delayMs={200}
              className={`mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:flex lg:max-w-none lg:flex-col ${
                landscape ? "lg:w-[calc(100%+2.5rem)]" : ""
              }`}
            >
              <CommitteePhoto
                src={committee.workImage}
                alt={committee.workImageAlt}
                caption={committee.workCaption}
                images={committee.workImages}
                figure="01"
                landscape={landscape}
              />
            </RevealOnScroll>
          </div>
        </Section>

        {projects.length > 0 && (
          <Section index={projectsIndex} {...copy.projects} compact={compact}>
            <RevealOnScroll delayMs={100}>
              <ProjectCarousel projects={projects} />
            </RevealOnScroll>
          </Section>
        )}

        {clientProjects.length > 0 && (
          <Section index={clientProjectsIndex} {...copy.clientProjects} compact={compact}>
            <RevealOnScroll delayMs={100}>
              <ProjectCarousel projects={clientProjects} />
            </RevealOnScroll>
          </Section>
        )}

        {activities.length > 0 && (
          <Section
            index={activitiesIndex}
            eyebrow={copy.activities.eyebrow}
            heading={committee.activitiesHeading}
            subtext={committee.activitiesSubtext}
            compact={compact}
          >
            <CommitteeActivities activities={activities} />
          </Section>
        )}

        {/* Closing CTA, unnumbered. */}
        <Section
          eyebrow={copy.closingCta.eyebrow}
          heading={fillTemplate(copy.closingCta.heading, vars)}
          subtext={copy.closingCta.subtext}
          centered
          size="sm"
          compact={compact}
        >
          <RevealOnScroll delayMs={100} className="-mt-6">
            <EditorialButton href={copy.closingCta.href} className="rounded-full">
              {fillTemplate(copy.closingCta.button, vars)}
            </EditorialButton>
          </RevealOnScroll>
        </Section>
      </div>
    </>
  );
}
