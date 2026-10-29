import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import LogoCarousel from "@/components/LogoCarousel";
import PartnerInquiryCard from "@/components/PartnerInquiryCard";
import ProjectTimeline from "@/components/ProjectTimeline";
import RevealOnScroll from "@/components/RevealOnScroll";
import OfferingIcon from "@/components/OfferingIcon";
import { getPartners, getOfferings, partnersPage as copy } from "@/lib/content";

// Copy, process cards, and timeline stages: content/partners/page.json.
// Partnership types (also the inquiry form's dropdown): content/partners/offerings.json.

export const metadata: Metadata = copy.meta;

// Thin-stroke icons for the three process cards, keyed by each card's `icon`.
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-6 w-6",
  "aria-hidden": true,
};

const PROCESS_ICONS: Record<string, React.ReactNode> = {
  team: (
    <svg {...iconProps}>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <path d="M10.6 7.2 6.5 15.7M13.4 7.2l4.1 8.5M7.5 18h9" />
    </svg>
  ),
  scope: (
    <svg {...iconProps}>
      <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
      <path d="m3 12.5 9 4.5 9-4.5" />
      <path d="m3 17.5 9 4.5 9-4.5" />
    </svg>
  ),
  student: (
    <svg {...iconProps}>
      <path d="M12 4 2 9l10 5 10-5-10-5Z" />
      <path d="M6 11.5V17c0 1.4 2.7 3 6 3s6-1.6 6-3v-5.5" />
    </svg>
  ),
};

const SECTION_CONTAINER = "mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20 lg:px-12";

export default async function PartnersPage() {
  const partners = await getPartners();
  // The `featured` offering is the flagship card; the rest sit in a grid below it.
  const offerings = getOfferings();
  const flagship = offerings.find((offering) => offering.featured);
  const otherOfferings = offerings.filter((offering) => !offering.featured);
  const { waysToPartner, process, projectTimeline } = copy;

  return (
    <>
      {/* The inquiry form sits in the hero: it's the one action we want from
          this audience, so it shouldn't be gated behind a scroll. */}
      <PageHero heading={copy.hero.heading} subtext={copy.hero.subtext} aside={<PartnerInquiryCard />} />

      <div className="fade-between-gradients">
        <LogoCarousel partners={partners} className="bg-transparent" />

        {/* Ways to partner */}
        <section className="font-poppins">
          <div className={SECTION_CONTAINER}>
            <SectionHeader index={1} {...waysToPartner} centered />

            {flagship && (
              <RevealOnScroll delayMs={100} className="mt-14">
                <article className="rounded-3xl bg-primary p-8 text-white md:p-10">
                  <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    <div className="md:max-w-2xl">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white/15 text-white">
                          <OfferingIcon name={flagship.icon} className="h-6 w-6" />
                        </span>
                      </div>
                      <h3 className="mt-6 text-2xl font-semibold tracking-tight">{flagship.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">{flagship.summary}</p>
                    </div>
                    <ul className="flex flex-col gap-3 md:max-w-xs md:pt-1">
                      {flagship.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 text-sm leading-snug text-white/90">
                          <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-white/70" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </RevealOnScroll>
            )}

            {/* The other offerings — soft tints alternating teal and sage. */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 md:mt-8 lg:grid-cols-3">
              {otherOfferings.map((offering, i) => {
                const sage = i % 2 === 1;
                return (
                  <RevealOnScroll key={offering.id} delayMs={175 + i * 75}>
                    <article
                      className={`flex h-full flex-col rounded-2xl p-6 ${sage ? "bg-accent/[0.16]" : "bg-primary/[0.09]"}`}
                    >
                      <span
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                          sage ? "bg-accent/25 text-accent-ink" : "bg-primary/15 text-primary"
                        }`}
                      >
                        <OfferingIcon name={offering.icon} className="h-6 w-6" />
                      </span>
                      <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{offering.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{offering.summary}</p>
                    </article>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process — three cards, then the project timeline */}
        <section className="font-poppins">
          <div className={SECTION_CONTAINER}>
            <SectionHeader index={2} eyebrow={process.eyebrow} heading={process.heading} subtext={process.subtext} centered />

            <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-7">
              {process.cards.map((card, i) => (
                <RevealOnScroll key={card.title} delayMs={100 + i * 75}>
                  <article className="flex h-full flex-col border border-border bg-bg p-7 shadow-card md:p-8">
                    <span className="inline-flex h-12 w-12 items-center justify-center bg-primary/10 text-primary">
                      {PROCESS_ICONS[card.icon]}
                    </span>
                    <span className="mt-7 text-[11px] tracking-[0.18em] text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{card.title}</h3>
                    {card.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="mt-3 text-sm leading-relaxed text-muted">
                        {paragraph}
                      </p>
                    ))}
                    {card.bullets.length > 0 && (
                      <ul className="mt-5 flex flex-col gap-3">
                        {card.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 text-sm leading-snug text-ink">
                            <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </RevealOnScroll>
              ))}
            </div>

            {/* The timeline continues "Process" rather than starting a new
                numbered section, so it gets a rule and a small label instead. */}
            <RevealOnScroll delayMs={300} className="mt-16 border-t border-border pt-14 md:mt-20 md:pt-16">
              <p className="text-center text-xl font-semibold tracking-tight text-ink">{projectTimeline.heading}</p>
              <p className="mt-3 text-center text-sm leading-relaxed text-muted">{projectTimeline.subtext}</p>
              <div className="mt-10">
                <ProjectTimeline
                  stages={projectTimeline.stages}
                  legendTerms={projectTimeline.legendTerms}
                  legendText={projectTimeline.legendText}
                />
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </div>
    </>
  );
}
