import type { Metadata } from "next";
import Section from "@/components/Section";
import EditorialButton from "@/components/EditorialButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import RecruitmentTimeline from "@/components/RecruitmentTimeline";
import { getRecruitmentTimeline } from "@/lib/content";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Join Data Science Society at UC Berkeley — apply now and become part of our community.",
};

const BENEFITS = [
  {
    icon: "🚀",
    title: "Work on real projects",
    body: "Every DSS member ships real work for real clients. No toy datasets — production code, real stakeholders, genuine impact.",
  },
  {
    icon: "🧠",
    title: "Learn from the best",
    body: "Get mentored by alumni at top tech companies and research labs. We run workshops, reading groups, and skill-building sessions every week.",
  },
  {
    icon: "🤝",
    title: "Build your network",
    body: "Our alumni network spans Google, Meta, McKinsey, and dozens more. DSS is where long-term professional relationships start.",
  },
  {
    icon: "🎯",
    title: "Fast-track your career",
    body: "Partners recruit directly through DSS. Many members land internships and full-time offers before they've even finished their first project.",
  },
];

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

  return (
    <>
      {/* Page header — -mt-16/pt-16 pulls it up behind the fixed translucent nav (main has pt-16) */}
      <section className="font-poppins relative -mt-16 overflow-hidden pt-16 surface-green-gradient">
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24 lg:px-12">
          <p className="inline-flex border border-white/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/80">
            Join DSS
          </p>
          <h1 className="mt-8 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white">
            Become a member.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
            {/* TODO: update with current semester and application link */}
            Applications for Fall 2025 open in the first week of classes. Here&apos;s
            everything you need to know.
          </p>
          <div className="mt-10">
            <EditorialButton href="#apply" variant="inverse">
              Apply now
            </EditorialButton>
          </div>
        </div>
      </section>

      {/* One continuous gradient from the hero's green down into the footer's,
          so both seams read as fades. Sections inside must stay transparent. */}
      <div className="fade-between-gradients">
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

        {/* Why join */}
        <Section index={2} eyebrow="Why DSS" heading="What you'll get">
          <div className="grid gap-8 sm:grid-cols-2">
            {BENEFITS.map((b, i) => (
              <RevealOnScroll
                key={b.title}
                delayMs={100 + i * 100}
                className="flex h-full gap-5 border border-border bg-bg p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-card motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-8"
              >
                <span className="mt-0.5 flex-none text-2xl">{b.icon}</span>
                <div>
                  <h3 className="font-semibold text-ink">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{b.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </Section>

        {/* Apply CTA — unnumbered, matching how Partners closes. */}
        <Section
          id="apply"
          eyebrow="Applications"
          heading="Ready to build something real?"
          subtext="The Fall 2025 application will be linked here when it opens. Check back in August or follow us on Instagram for the announcement."
          centered
        >
          {/* TODO: replace with actual application link when live */}
          <RevealOnScroll delayMs={100}>
            <EditorialButton href="#">Open application</EditorialButton>
          </RevealOnScroll>
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
