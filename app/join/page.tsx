import type { Metadata } from "next";
import Section from "@/components/Section";
import EditorialButton from "@/components/EditorialButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import RecruitmentTimeline from "@/components/RecruitmentTimeline";
import NewbieExperience from "@/components/NewbieExperience";
import { getNewbieExperience, getRecruitmentTimeline } from "@/lib/content";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Join Data Science Society at UC Berkeley — apply now and become part of our community.",
};

const FAQ = [
  {
    q: "Do I need prior data science experience?",
    a: "Not necessarily. We look for curiosity, drive, and a baseline technical foundation (e.g., some Python or statistics). Our Education committee is a great fit for students still building those skills.",
  },
  {
    q: "How much time does it take each week?",
    a: "Expect 5–8 hours per week — project meetings, weekly committee meetings, and independent work. It's a meaningful commitment, but most members say it's the most valuable thing they do at Berkeley.",
  },
  {
    q: "Can I join multiple committees?",
    a: "We ask that first-semester members focus on one committee. After that, cross-committee involvement is common and encouraged.",
  },
  {
    q: "When is recruitment?",
    a: "We recruit in the first two weeks of Fall and Spring semester. Follow us on Instagram and subscribe to our mailing list so you don't miss the announcement.", // TODO: add actual social links
  },
  {
    q: "What if I'm rejected?",
    a: "Re-applications are welcome and common. We also encourage you to attend our public workshops in the meantime — many members joined DSS after attending events first.",
  },
];

export default async function JoinPage() {
  const timeline = await getRecruitmentTimeline();
  const newbieExperience = getNewbieExperience();

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
            Applications for Fall 2025 open in the first week of classes. Here&apos;s
            everything you need to know.
          </p>
          <div className="mt-10">
            {/* TODO: replace with the actual application link when it opens */}
            <EditorialButton href="#" variant="inverse" size="large">
              Apply now
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
          subtext="Every event in our recruitment cycle, start to finish. Come to as many as you can — most are open to everyone, no application needed."
          divider
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
            {FAQ.map((item, i) => (
              <RevealOnScroll
                key={item.q}
                delayMs={100 + i * 75}
                className="flex flex-col gap-2"
              >
                <dt className="font-semibold text-ink">{item.q}</dt>
                <dd className="text-sm leading-relaxed text-muted">{item.a}</dd>
              </RevealOnScroll>
            ))}
          </dl>
        </Section>
      </div>
    </>
  );
}
