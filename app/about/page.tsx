import type { Metadata } from "next";
import Image from "next/image";
import { Wrench, Handshake, Unlock, Compass, type LucideIcon } from "lucide-react";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import RichText from "@/components/RichText";
import ExecCard from "@/components/ExecCard";
import CommitteeCard from "@/components/CommitteeCard";
import Gallery from "@/components/Gallery";
import EventCarousel from "@/components/EventCarousel";
import RevealOnScroll from "@/components/RevealOnScroll";
import {
  aboutPage as copy,
  getExecProfiles,
  getFeaturedCommittees,
  getCommunityTraditions,
  getCommunityPhotos,
  getExternalEvents,
  type CommunityTradition,
} from "@/lib/content";

// Copy: content/about/page.json. Community tiles: content/about/community-traditions.json.
// Gallery photos: content/about/community-photos.json. Events and exec board: Airtable.

export const metadata: Metadata = copy.meta;

const CAPTION = "text-[11px] uppercase tracking-[0.18em] text-muted";
const STRONG = "font-semibold text-ink";

// Icons for the four values, keyed by each value's `icon` in page.json.
const VALUE_ICONS: Record<string, LucideIcon> = {
  unlock: Unlock,
  handshake: Handshake,
  wrench: Wrench,
  compass: Compass,
};

/**
 * The community grid is designed for five tiles, laid out in order:
 * a wide side-by-side tile, a wide stacked tile, two compact tiles, and a wide
 * stacked tile that also lists `tags`. Each slot has its own photo shape so the
 * row heights line up. Reordering community-traditions.json reorders the tiles.
 */
const TRADITION_SLOTS = [
  { span: "sm:col-span-2", split: true, aspect: "", tint: "bg-primary/[0.09]", glow: "from-primary/25 via-primary-bright/15 to-transparent", sizes: "(min-width: 640px) 50vw, 100vw" },
  { span: "sm:col-span-2", split: false, aspect: "aspect-[12/5]", tint: "bg-accent/[0.16]", glow: "from-accent/30 via-primary/10 to-transparent", sizes: "(min-width: 1024px) 50vw, 100vw" },
  { span: "", split: false, aspect: "aspect-[12/7]", tint: "bg-primary/[0.09]", glow: "from-primary/20 to-transparent", sizes: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" },
  { span: "", split: false, aspect: "aspect-[12/7]", tint: "bg-accent/[0.16]", glow: "from-accent/25 to-transparent", sizes: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" },
  { span: "sm:col-span-2", split: false, aspect: "aspect-[7/3]", tint: "bg-primary/[0.09]", glow: "from-primary/20 to-accent/20", sizes: "(min-width: 1024px) 50vw, 100vw", tagsRow: true },
];

function TraditionTile({ tradition, slot }: { tradition: CommunityTradition; slot: (typeof TRADITION_SLOTS)[number] }) {
  const wide = slot.span !== "";
  const photo = (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${slot.glow} ${
        slot.split ? "aspect-video sm:aspect-auto sm:w-1/2 sm:shrink-0" : `grow ${slot.aspect}`
      }`}
    >
      {tradition.image ? (
        <Image src={tradition.image} alt={tradition.imageAlt} fill sizes={slot.sizes} className="object-cover" />
      ) : (
        <span className={wide ? "text-5xl" : "text-4xl"} aria-hidden="true">
          {tradition.icon}
        </span>
      )}
    </div>
  );

  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-2xl ${slot.split ? "sm:flex-row" : ""}`}>
      {photo}
      {"tagsRow" in slot ? (
        // The last tile also lists `tags` (e.g. sub-event names) under its text.
        <div className={`flex flex-col gap-2 p-4 ${slot.tint}`}>
          <div>
            <h3 className="font-semibold text-ink">{tradition.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{tradition.body}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tradition.tags?.map((tag) => (
              <span key={tag} className="border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className={`flex flex-col ${slot.split ? "justify-center gap-2 p-6" : "gap-1.5 p-4"} ${slot.tint}`}>
          <h3 className={`font-semibold text-ink ${wide ? "text-lg" : ""}`}>{tradition.title}</h3>
          <p className="text-sm leading-relaxed text-muted">{tradition.body}</p>
        </div>
      )}
    </div>
  );
}

export default async function AboutPage() {
  const [execProfiles, externalEvents] = await Promise.all([getExecProfiles(), getExternalEvents()]);
  const { story, committees, community, events, execBoard } = copy;

  return (
    <>
      <PageHero heading={copy.hero.heading} subtext={copy.hero.subtext} background="brand" />

      {/* One gradient from the hero's green to the footer's runs behind every section. */}
      <div className="fade-between-gradients">
        {/* (01) Story and values */}
        <Section index={1} eyebrow={story.eyebrow} heading={story.heading} seam={false}>
          <RevealOnScroll delayMs={100} className="block">
            <div className="relative aspect-[3941/1442] w-full overflow-hidden border border-border">
              <Image
                src={story.photo.src}
                alt={story.photo.alt}
                fill
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="object-cover"
              />
            </div>
            <p className={`mt-4 ${CAPTION}`}>{story.photo.caption}</p>
          </RevealOnScroll>

          <div className="mt-16 grid gap-12 md:grid-cols-[minmax(0,28rem)_1fr] md:items-start">
            <RevealOnScroll delayMs={150} className="flex flex-col gap-5 text-lg leading-relaxed text-ink">
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph}>
                  <RichText text={paragraph} strongClassName="font-semibold" />
                </p>
              ))}
            </RevealOnScroll>

            <RevealOnScroll delayMs={200} className="flex flex-col divide-y divide-border">
              {story.values.map((value, i) => {
                const Icon = VALUE_ICONS[value.icon];
                return (
                  <div key={value.title} className="flex gap-5 py-6 first:pt-0 last:pb-0">
                    <span className="w-6 flex-none pt-1 text-[11px] uppercase tracking-[0.18em] text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {Icon && <Icon className="mt-0.5 size-5 flex-none text-accent-ink" aria-hidden="true" />}
                    <div>
                      <h3 className="font-semibold text-ink">{value.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        <RichText text={value.body} strongClassName={STRONG} />
                      </p>
                    </div>
                  </div>
                );
              })}
            </RevealOnScroll>
          </div>
        </Section>

        {/* (02) Committees — id is linked from the homepage ("/about#committees"), keep it. */}
        <Section id="committees" index={2} {...committees} seam={false}>
          {/* sm:auto-rows-fr keeps every card in a row the same height. */}
          <div className="grid gap-6 sm:auto-rows-fr sm:grid-cols-3">
            {getFeaturedCommittees().map((c, i) => (
              <RevealOnScroll key={c.id} delayMs={100 + i * 100}>
                <CommitteeCard committee={c} />
              </RevealOnScroll>
            ))}
          </div>
        </Section>

        {/* (03) Community — custom layout: the tile grid widens past the usual
            column on very wide screens, and the photo strip runs wider still. */}
        <section id="community" className="font-poppins">
          {/* From 1810px the grid is 63.75% of the window. The breakpoint is where
              63.75% overtakes the normal 1152px column (1152 / 0.6375 ≈ 1807px);
              change both together. */}
          <div className="mx-auto max-w-6xl px-6 pt-16 md:px-8 md:pt-20 lg:px-12 min-[1810px]:w-[63.75%] min-[1810px]:max-w-none min-[1810px]:px-0!">
            <SectionHeader index={3} eyebrow={community.eyebrow} heading={community.heading} subtext={community.subtext} />

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {getCommunityTraditions().map((tradition, i) => {
                const slot = TRADITION_SLOTS[i % TRADITION_SLOTS.length];
                return (
                  <RevealOnScroll key={tradition.id} delayMs={i * 80} className={slot.span}>
                    <TraditionTile tradition={tradition} slot={slot} />
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>

          {/* Photo strip — inset to 90% of the window rather than 100vw, which
              would overflow by the scrollbar's width. */}
          <div className="pb-16 md:pb-20">
            <div className="mx-auto mb-6 mt-16 max-w-6xl px-6 md:px-8 lg:px-12">
              <h3 className={CAPTION}>{community.galleryLabel}</h3>
            </div>
            <div className="mx-auto w-[90%]">
              <Gallery photos={getCommunityPhotos()} />
            </div>
          </div>
        </section>

        {/* (04) Events (Airtable) */}
        <Section index={4} eyebrow={events.eyebrow} heading={events.heading} subtext={events.subtext} seam={false}>
          {externalEvents.length > 0 ? (
            <EventCarousel events={externalEvents} />
          ) : (
            <p className="text-muted">{events.emptyMessage}</p>
          )}
        </Section>

        {/* (05) Executive board (Airtable) */}
        <Section index={5} eyebrow={execBoard.eyebrow} heading={execBoard.heading} seam={false}>
          {execProfiles.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
              {execProfiles.map((profile) => (
                <ExecCard key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <p className="text-muted">{execBoard.emptyMessage}</p>
          )}
        </Section>
      </div>
    </>
  );
}
