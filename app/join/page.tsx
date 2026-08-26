import type { Metadata } from "next";
import Section from "@/components/Section";
import EditorialButton from "@/components/EditorialButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import RecruitmentTimeline from "@/components/RecruitmentTimeline";
import NewbieExperience from "@/components/NewbieExperience";
import InterviewResources from "@/components/InterviewResources";
import {
  getFaq,
  getInterviewResources,
  getNewbieExperience,
  getRecruitmentTimeline,
} from "@/lib/content";
import { APPLICATION_URL, COFFEE_CHAT_URL } from "@/lib/site";

// The current DeCal's lecture slides, linked from the interview resources intro.
// Page-local rather than in lib/site.ts for the same reason as the decal page's
// article link: it's one page's link, not a URL other routes share. The path is
// per-semester, so it needs updating alongside the recruitment copy each cycle.
const DECAL_SLIDES_URL = "https://dssdecal.org/sp26/";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Join Data Science Society at UC Berkeley — apply now and become part of our community.",
};

export default async function JoinPage() {
  const timeline = await getRecruitmentTimeline();
  const interviewResources = getInterviewResources();
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
          {/* One CTA — the application — with coffee chats beside it as a plain
              underlined link rather than a second button, so the hero reads as
              a single primary action with a quieter alternative next to it.
              flex-wrap rather than a stack breakpoint: the pair sits on one line
              wherever it fits and the link drops to its own where it doesn't,
              with no width to guess at. items-center rather than items-stretch —
              there are no longer two boxes whose heights need matching. */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
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
                A plain <a>, not EditorialButton: this is a text link, and it
                leaves the site like Apply now does. */}
            <a
              href={COFFEE_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium text-white/80 underline underline-offset-4 transition-colors duration-150 hover:text-white"
            >
              Sign up for coffee chats
            </a>
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

        {/* Interview resources — what to read before a technical interview */}
        <Section
          index={2}
          eyebrow="Prepare"
          heading="Interview resources"
          subtext={
            <>
              These resources cover the Social Good and Consulting technical case
              interviews. To prepare for the Acadev interview, we recommend
              looking through the Data 100 textbook and the{" "}
              <a
                href={DECAL_SLIDES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2 transition-colors duration-150 hover:text-primary-bright"
              >
                Spring 2026 DeCal lecture slides
              </a>
              .
            </>
          }
        >
          <InterviewResources resources={interviewResources} />
        </Section>

        {/* The Newbie Experience — four pillars, content from
            content/newbie-experience.json */}
        <Section
          index={3}
          eyebrow="Your first semester"
          heading="The Newbie Experience"
        >
          <NewbieExperience pillars={newbieExperience} />
        </Section>


        {/* FAQ */}
        <Section index={4} eyebrow="FAQ" heading="Common questions">
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
