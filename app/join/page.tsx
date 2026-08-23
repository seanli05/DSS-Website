import type { Metadata } from "next";
import Section from "@/components/Section";
import EditorialButton from "@/components/EditorialButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import RecruitmentTimeline from "@/components/RecruitmentTimeline";
import NewbieExperience from "@/components/NewbieExperience";
import { getFaq, getNewbieExperience, getRecruitmentTimeline } from "@/lib/content";
import { APPLICATION_URL, COFFEE_CHAT_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Join Data Science Society at UC Berkeley — apply now and become part of our community.",
};

export default async function JoinPage() {
  const timeline = await getRecruitmentTimeline();
  const newbieExperience = getNewbieExperience();
  const faq = getFaq();

  return (
    <>
      {/* Page header — -mt-16/pt-16 pulls it up behind the fixed translucent nav (main has pt-16) */}
      <section className="font-poppins relative -mt-16 overflow-hidden pt-16 surface-green-gradient">
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24 lg:px-12">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white">
            Become a member.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
            {/* TODO: update with current semester and application link */}
            Applications for Fall 2026 open in the first week of classes. Here&apos;s
            everything you need to know.
          </p>
          {/* Two CTAs: the application itself, and the coffee chats that run
              alongside it. flex-wrap rather than a stack breakpoint — the pair
              sits on one line wherever it fits and drops the second button to
              its own line where it doesn't, with no width to guess at. */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {/* The form URL lives in lib/site.ts, shared with the `/apply`
                redirect in next.config.ts — update it there once per cycle.
                rounded-full is a scoped exception here, matching the homepage's
                pill CTAs — not a change to EditorialButton's square default. */}
            <EditorialButton
              href={APPLICATION_URL}
              external
              variant="inverse"
              size="large"
              className="rounded-full"
            >
              Apply now
            </EditorialButton>
            {/* Also from lib/site.ts, shared with the `/coffeechat` redirect.
                `default` size and the outline variant keep this clearly
                secondary to Apply now. */}
            <EditorialButton
              href={COFFEE_CHAT_URL}
              external
              variant="inverse-outline"
              size="default"
              className="rounded-full"
            >
              Sign up for coffee chats
            </EditorialButton>
          </div>
        </div>
      </section>

      {/* One continuous gradient from the hero's green down into the footer's,
          so both seams read as fades. Sections inside must stay transparent.
          overflow-x-clip contains the recruitment timeline's full-bleed track
          (.timeline-track is 100vw wide, which overshoots by the scrollbar's
          width on platforms that reserve space for one). */}
      <div className="fade-between-gradients overflow-x-clip">
        {/* Recruitment timeline — horizontal, Airtable-driven */}
        <Section
          index={1}
          eyebrow="Recruitment"
          heading="Recruitment timeline"
          subtext="Here are all of our Fall 2026 events that we will be hosting or sharing at. Come to as many as you can to learn about the club and network with our members!"
          firstOnPage
          centered
        >
          <RecruitmentTimeline events={timeline} />
        </Section>

        {/* The Newbie Experience — four pillars, content from
            content/newbie-experience.json */}
        <Section
          index={2}
          eyebrow="Your first semester"
          heading="The Newbie Experience"
        >
          <NewbieExperience pillars={newbieExperience} />
        </Section>


        {/* FAQ */}
        <Section index={3} eyebrow="FAQ" heading="Common questions">
          <dl className="flex max-w-2xl flex-col gap-8">
            {faq.map((item, i) => (
              <RevealOnScroll
                key={item.id}
                delayMs={100 + i * 75}
                className="flex flex-col gap-2"
              >
                <dt className="font-semibold text-ink">{item.question}</dt>
                {/* One <dd> per paragraph — a <dl> allows several per <dt>, so
                    multi-paragraph answers need no wrapper element. */}
                {item.answer.map((paragraph) => (
                  <dd key={paragraph} className="text-sm leading-relaxed text-muted">
                    {paragraph}
                  </dd>
                ))}
              </RevealOnScroll>
            ))}
          </dl>
        </Section>
      </div>
    </>
  );
}
