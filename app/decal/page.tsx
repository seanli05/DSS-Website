import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import EditorialButton from "@/components/EditorialButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import RichText from "@/components/RichText";
import ProjectCarousel from "@/components/ProjectCarousel";
import { decalPage as copy, getDecalStudentProjects } from "@/lib/content";
import { LINKS } from "@/lib/site";

// Copy and photos: content/decal/page.json. Student projects:
// content/decal/student-projects.json. Application form: `links.decalApplication`
// in content/site.json (changes every semester).

export const metadata: Metadata = copy.meta;

const COLUMN_LABEL = "text-[11px] uppercase tracking-[0.18em] text-primary";
const COLUMN_HEADING =
  "mt-5 text-[clamp(1.05rem,1.7vw,1.25rem)] font-semibold leading-tight text-ink sm:whitespace-nowrap";
const COLUMN_BODY = "mt-5 text-base leading-relaxed text-muted md:text-lg";
// The two overview columns: a divider between them (left border from lg, top border when stacked).
const COLUMN_LAYOUT = [
  "lg:pr-12 xl:pr-16",
  "border-t border-border pt-12 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0 xl:pl-16",
];

export default function DecalPage() {
  const { overview, photos, studentWork, closingCta } = copy;

  return (
    <>
      <PageHero heading={copy.hero.heading} subtext={copy.hero.subtext}>
        <div className="mt-10">
          <EditorialButton href={LINKS.decalApplication} external variant="inverse" className="rounded-full">
            {copy.hero.applyButton}
          </EditorialButton>
        </div>
      </PageHero>

      <div className="fade-between-gradients">
        <Section id="course" index={1} eyebrow={overview.eyebrow} heading={overview.heading} firstOnPage>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
            {overview.columns.map((column, i) => (
              <RevealOnScroll key={column.label} delayMs={100 + i * 100} className={COLUMN_LAYOUT[i]}>
                <p className={COLUMN_LABEL}>{column.label}</p>
                <h2 className={COLUMN_HEADING}>{column.heading}</h2>
                <p className={COLUMN_BODY}>
                  <RichText text={column.body} />
                </p>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delayMs={300} className="mt-12">
            <p className="text-base leading-relaxed text-muted">
              <RichText text={overview.footnote} />
            </p>
          </RevealOnScroll>
        </Section>

        {/* Two course photos side by side in matching 4:3 frames. max-w-4xl keeps
            the phone-shot photos from being blown up past where they look sharp. */}
        <Section index={2} eyebrow={photos.eyebrow} heading={photos.heading}>
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 md:gap-10">
            {photos.items.map((photo, i) => (
              <RevealOnScroll key={photo.src} delayMs={100 + i * 100}>
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden border border-border">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 896px) 420px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                      // objectPosition picks which part of a photo survives the crop,
                      // e.g. "50% 85%" keeps the lower part of a tall photo.
                      style={photo.objectPosition ? { objectPosition: photo.objectPosition } : undefined}
                    />
                  </div>
                  <figcaption className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                    {photo.caption}
                  </figcaption>
                </figure>
              </RevealOnScroll>
            ))}
          </div>
        </Section>

        <Section index={3} {...studentWork}>
          <RevealOnScroll delayMs={100}>
            <ProjectCarousel projects={getDecalStudentProjects()} circular uniformTint />
          </RevealOnScroll>
        </Section>

        <Section
          eyebrow={closingCta.eyebrow}
          heading={closingCta.heading}
          subtext={closingCta.subtext}
          centered
          size="sm"
        >
          <RevealOnScroll delayMs={100} className="-mt-6">
            <EditorialButton href={closingCta.button.href} external className="rounded-full">
              {closingCta.button.label}
            </EditorialButton>
          </RevealOnScroll>
        </Section>
      </div>
    </>
  );
}
