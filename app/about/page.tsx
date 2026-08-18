import type { Metadata } from "next";
import Image from "next/image";
import { Wrench, Handshake, Unlock, Compass } from "lucide-react";
import ExecCard from "@/components/ExecCard";
import CommitteeCard from "@/components/CommitteeCard";
import Gallery from "@/components/Gallery";
import EventCarousel from "@/components/EventCarousel";
import RevealOnScroll from "@/components/RevealOnScroll";
import {
  getExecProfiles,
  getFeaturedCommittees,
  getCommunityTraditions,
  getCommunityPhotos,
  getExternalEvents,
} from "@/lib/content";

// Editorial theme shared with the homepage and Partners page: square corners,
// hairline borders, small uppercase tracked labels. Kept as plain strings rather
// than components, per CLAUDE.md rule 8 (prefer duplication over a confusing
// abstraction).
const EYEBROW = "text-[11px] uppercase tracking-[0.18em] text-primary";
const HEADING =
  "mt-6 text-[clamp(2rem,4vw,3.125rem)] font-normal leading-[1.05] tracking-tight text-ink";
const SUBTEXT = "mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg";
const CAPTION = "text-[11px] uppercase tracking-[0.18em] text-muted";
// Section shell: transparent so the page-long gradient below the hero shows
// through, exactly as the Partners page does it.
const SECTION = "font-poppins";
const CONTAINER = "mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20 lg:px-12";

// Caption tints for the community bento, borrowed from the Partners page's
// offering cards so both pages speak one colour language. The tints are
// translucent and sit directly on the page gradient (no white base), which is
// what gives them the soft, slightly varied look there. The tiles are static,
// so colour carries the visual interest a hover lift used to.
const TINT_TEAL = "bg-primary/[0.09]";
const TINT_SAGE = "bg-accent/[0.16]";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Data Science Society — our mission, values, and the community we're building at UC Berkeley.",
};

// `body` is JSX rather than a string so each value can bold its key phrase, the
// same emphasis treatment the story paragraphs use in the column beside it.
const B = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-semibold text-ink">{children}</strong>
);

const VALUES = [
  {
    icon: Unlock,
    title: "Open to all",
    body: (
      <>
        We welcome students from <B>every major, background, and skill level</B>.
        We want to help anyone who&apos;s <B>curious about technology</B> achieve
        their goals.
      </>
    ),
  },
  {
    icon: Handshake,
    title: "Community first",
    body: (
      <>
        DSS is a tight-knit support network. We grow together through{" "}
        <B>mentorship</B>, <B>hard work</B>, and{" "}
        <B>celebrating our shared successes</B>.
      </>
    ),
  },
  {
    icon: Wrench,
    title: "Skill development",
    body: (
      <>
        Through our client projects, teaching, and new member development, we aim
        to <B>transform beginners</B> into <B>leaders</B> and innovators in
        industry.
      </>
    ),
  },
  {
    icon: Compass,
    title: "Forward looking",
    body: (
      <>
        Technology is rapidly changing. Our curriculum, projects, and mindset are
        constantly evolving to ensure we <B>stay ahead</B> of where the field is
        heading.
      </>
    ),
  },
];

export default async function AboutPage() {
  const execProfiles = await getExecProfiles();
  const committees = getFeaturedCommittees();
  const traditions = getCommunityTraditions();
  const communityPhotos = getCommunityPhotos();
  const externalEvents = await getExternalEvents();
  const findTradition = (id: string) => traditions.find((t) => t.id === id)!;
  const bigLittle = findTradition("big-little");
  const houseSystem = findTradition("house-system");
  const chummings = findTradition("chummings");
  const retreats = findTradition("retreats");
  const socials = findTradition("socials");

  return (
    <>
      {/* 1. Hero — static gradient, left-aligned eyebrow/heading/subtext (no particles, no photo) */}
      <section className="relative -mt-16 overflow-hidden brand-gradient pt-16 font-poppins">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24 lg:px-12">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white">
            About DSS
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
            Learn more about our origins, the values we stand by, our 3 different committees for you to join, the tight-knit community that we've fostered
            , our campus involvement, and our current executive board. 
          </p>
        </div>
      </section>

      {/* Everything between the hero and the footer shares one gradient, so the
          page eases out of the hero's green and back into the footer's rather
          than cutting to white at both seams. Children stay transparent. */}
      <div className="fade-between-gradients">
        {/* 2. Mission — story and values combined into one window */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <RevealOnScroll delayMs={0}>
              <p className={EYEBROW}>(01) — Our story</p>
              <h2 className={HEADING}>Our background and values</h2>
            </RevealOnScroll>

            <RevealOnScroll delayMs={100} className="mt-14 block">
              <div className="relative aspect-[3941/1442] w-full overflow-hidden border border-border">
                <Image
                  src="/dss-campanile-group.jpg"
                  alt="DSS members gathered in front of Sather Tower on the UC Berkeley campus"
                  fill
                  sizes="(min-width: 1152px) 1152px, 100vw"
                  className="object-cover"
                />
              </div>
              <p className={`mt-4 ${CAPTION}`}>Fig. 01 — The society, on campus</p>
            </RevealOnScroll>

            <div className="mt-16 grid gap-12 md:grid-cols-[minmax(0,28rem)_1fr] md:items-start">
              {/* Story text */}
              <RevealOnScroll
                delayMs={150}
                className="flex flex-col gap-5 text-lg leading-relaxed text-ink"
              >
                <p>
                  Founded in 2016, Data Science Society at Berkeley is UC
                  Berkeley&apos;s{" "}
                  <strong className="font-semibold">
                    first undergraduate student organization
                  </strong>{" "}
                  focused on data science.
                </p>
                <p>
                  Throughout the past decade, we have taken on{" "}
                  <strong className="font-semibold">90+ client projects</strong>,
                  taught over thousands of students in our Decal, and hosted
                  dozens of inclusive events on campus, all while watching the
                  Data Science major grow into the{" "}
                  <strong className="font-semibold">largest major at Berkeley</strong>.
                </p>
                <p>
                  We&apos;ve continually evolved to stay at the forefront of a
                  rapidly changing field, ensuring that our members and the
                  broader Berkeley community develop the skills they need to
                  succeed as data scientists, machine learning researchers, and
                  software engineers.
                </p>
              </RevealOnScroll>

              {/* Values list */}
              <RevealOnScroll delayMs={200} className="flex flex-col divide-y divide-border">
                {VALUES.map((v, i) => (
                  <div key={v.title} className="flex gap-5 py-6 first:pt-0 last:pb-0">
                    <span className="w-6 flex-none pt-1 text-[11px] uppercase tracking-[0.18em] text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <v.icon className="mt-0.5 size-5 flex-none text-accent-ink" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold text-ink">{v.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{v.body}</p>
                    </div>
                  </div>
                ))}
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* 3. Committees — modeled on the "Our Programs" treatment */}
        {/* id: the homepage "Find your committee" path card links to /about#committees */}
        <section id="committees" className={SECTION}>
          <div className={CONTAINER}>
            <RevealOnScroll delayMs={0}>
              <p className={EYEBROW}>(02) — Get involved</p>
              <h2 className={HEADING}>Find your committee</h2>
              <p className={SUBTEXT}>
                We offer three different ways to get involved with data science and machine learning within our organization.
              </p>
            </RevealOnScroll>

            {/* sm:auto-rows-fr keeps every row the same height; gated at sm so the
                single-column phone layout isn't padded out to the tallest card. */}
            <div className="mt-14 grid gap-6 sm:auto-rows-fr sm:grid-cols-3">
              {committees.map((c, i) => (
                <RevealOnScroll key={c.id} delayMs={100 + i * 100}>
                  <CommitteeCard committee={c} />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Community — traditions that make DSS feel like home */}
        {/* TODO: verify exact tradition details/copy with DSS leadership */}
        <section id="community" className={SECTION}>
          {/* Padding is split rather than using CONTAINER: the filmstrip below owns
              the bottom half so it can break out of this max-width column.
              On wide screens the bento widens to 63.75% of the viewport. The
              1810px gate is derived, not arbitrary: 63.75% only overtakes the
              max-w-6xl column (1152px) at ~1807px, so gating any earlier would
              make the grid NARROWER as the window grows. Re-derive it if the
              percentage changes — 1152 / (pct/100). */}
          <div className="mx-auto max-w-6xl px-6 pt-16 md:px-8 md:pt-20 lg:px-12 min-[1810px]:w-[63.75%] min-[1810px]:max-w-none min-[1810px]:px-0!">
            <RevealOnScroll delayMs={0}>
              <p className={EYEBROW}>(03) — Life at DSS</p>
              <h2 className={HEADING}>More than a club</h2>
              <p className={SUBTEXT}>
                DSS has many traditions that help you feel included in a close and friendly community at Berkeley.
              </p>
            </RevealOnScroll>

            {/* Bento tradition grid — tiles reveal in a staggered cascade on scroll */}
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Big Little — horizontal split */}
              <RevealOnScroll delayMs={0} className="sm:col-span-2">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl sm:flex-row">
                  <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-primary/25 via-primary-bright/15 to-transparent sm:aspect-auto sm:w-1/2 sm:shrink-0">
                    {bigLittle.image ? (
                      <Image
                        src={bigLittle.image}
                        alt="A DSS Big and Little smiling together at a Big–Little reveal"
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-5xl" aria-hidden="true">{bigLittle.icon}</span>
                    )}
                  </div>
                  <div className={`flex flex-col justify-center gap-2 p-6 ${TINT_TEAL}`}>
                    <h3 className="text-lg font-semibold text-ink">{bigLittle.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{bigLittle.body}</p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* House System — vertical split */}
              <RevealOnScroll delayMs={80} className="sm:col-span-2">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl">
                  {/* This tile sets the height of the whole top row, so its aspect
                      drives Big Little alongside it. NOTE: 5/2 is much wider than the
                      collage's own 16:9, so object-cover crops ~29% of its height. */}
                  <div className="relative flex grow aspect-[12/5] items-center justify-center overflow-hidden bg-gradient-to-br from-accent/30 via-primary/10 to-transparent">
                    {houseSystem.image ? (
                      <Image
                        src={houseSystem.image}
                        alt="DSS members repping their House colors at a competition"
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-5xl" aria-hidden="true">{houseSystem.icon}</span>
                    )}
                  </div>
                  <div className={`flex flex-col gap-1.5 p-4 ${TINT_SAGE}`}>
                    <h3 className="text-lg font-semibold text-ink">{houseSystem.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{houseSystem.body}</p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Chummings — compact */}
              <RevealOnScroll delayMs={160}>
                <div className="flex h-full flex-col overflow-hidden rounded-2xl">
                  <div className="relative flex grow aspect-[12/7] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-transparent">
                    {chummings.image ? (
                      <Image
                        src={chummings.image}
                        alt="A small DSS chumming group hanging out over coffee"
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-4xl" aria-hidden="true">{chummings.icon}</span>
                    )}
                  </div>
                  <div className={`flex flex-col gap-1.5 p-4 ${TINT_TEAL}`}>
                    <h3 className="font-semibold text-ink">{chummings.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{chummings.body}</p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Retreats — compact */}
              <RevealOnScroll delayMs={240}>
                <div className="flex h-full flex-col overflow-hidden rounded-2xl">
                  <div className="relative flex grow aspect-[12/7] items-center justify-center overflow-hidden bg-gradient-to-br from-accent/25 to-transparent">
                    {retreats.image ? (
                      <Image
                        src={retreats.image}
                        alt="DSS members bonding outdoors on a weekend retreat"
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-4xl" aria-hidden="true">{retreats.icon}</span>
                    )}
                  </div>
                  <div className={`flex flex-col gap-1.5 p-4 ${TINT_SAGE}`}>
                    <h3 className="font-semibold text-ink">{retreats.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{retreats.body}</p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Socials — vertical split: cover photo above the caption, same as House System */}
              <RevealOnScroll delayMs={320} className="sm:col-span-2">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl">
                  <div className="relative flex grow aspect-[7/3] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                    {socials.image ? (
                      <Image
                        src={socials.image}
                        alt="DSS members celebrating together at a club social"
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-5xl" aria-hidden="true">{socials.icon}</span>
                    )}
                  </div>
                  <div className={`flex flex-col gap-2 p-4 ${TINT_TEAL}`}>
                    <div>
                      <h3 className="font-semibold text-ink">{socials.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{socials.body}</p>
                    </div>
                    {/* Sub-event names as plain labels — the card carries a single
                        cover image, and every social photo lives in the carousel. */}
                    <div className="flex flex-wrap gap-2">
                      {socials.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

          </div>

          {/* Photo filmstrip — wider than the text column so several photos read at
              once, but inset to 90% so it doesn't run flush to the window edge.
              Sits outside the max-width container rather than using 100vw, which
              overflows by the scrollbar width and scrolls the body sideways. */}
          <div className="pb-16 md:pb-20">
            <div className="mx-auto mb-6 mt-16 max-w-6xl px-6 md:px-8 lg:px-12">
              <h3 className={CAPTION}>Moments from the year</h3>
            </div>
            <div className="mx-auto w-[90%]">
              <Gallery photos={communityPhotos} />
            </div>
          </div>
        </section>

        {/* 5. Campus involvement — External Events (Airtable) in a large hover-caption carousel */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <RevealOnScroll delayMs={0}>
              <p className={EYEBROW}>(04) — Campus involvement</p>
              <h2 className={HEADING}>Events We Host</h2>
              <p className={SUBTEXT}>
                Our club hosts events for members and the wider Berkeley community
                alike. From career fairs to hackathons, we give students the chance to
                build real technical skills and find their way within the industry.
              </p>
            </RevealOnScroll>

            <div className="mt-14">
              {externalEvents.length > 0 ? (
                <EventCarousel events={externalEvents} />
              ) : (
                <p className="text-muted">
                  Event photos are on their way — check back soon.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 6. Executive board */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <RevealOnScroll delayMs={0}>
              <p className={EYEBROW}>(05) — Leadership</p>
              <h2 className={HEADING}>Our Executive Board</h2>
            </RevealOnScroll>

            <div className="mt-14">
              {execProfiles.length > 0 ? (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                  {execProfiles.map((profile) => (
                    <ExecCard key={profile.id} profile={profile} />
                  ))}
                </div>
              ) : (
                <p className="text-muted">
                  Exec board profiles are on their way — check back soon.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
