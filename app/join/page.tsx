import type { Metadata } from "next";
import Section from "@/components/Section";
import Button from "@/components/Button";

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

const TIMELINE = [
  {
    period: "Week 1",
    title: "Applications open",
    body: "Fill out the short application form — takes about 10 minutes. We review on a rolling basis.",
  },
  {
    period: "Week 1–2",
    title: "Coffee chats",
    body: "We invite applicants for a casual 20-minute conversation so we can learn more about you.",
  },
  {
    period: "Week 2",
    title: "Decisions sent",
    body: "We send decisions by email. Successful applicants receive committee placement and onboarding details.",
  },
  {
    period: "Week 3+",
    title: "Onboarding",
    body: "Kickoff event, committee introductions, and your first project assignment. Welcome to DSS.",
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

export default function JoinPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
            Join DSS
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-ink max-w-xl leading-tight">
            Become a member.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-lg leading-relaxed">
            {/* TODO: update with current semester and application link */}
            Applications for Fall 2025 open in the first week of classes. Here&apos;s
            everything you need to know.
          </p>
          <div className="mt-8">
            <Button href="#apply" size="lg">
              Apply now →
            </Button>
          </div>
        </div>
      </section>

      {/* Why join */}
      <Section eyebrow="Why DSS" heading="What you'll get.">
        <div className="grid sm:grid-cols-2 gap-6">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border bg-bg p-7 flex gap-5"
            >
              <span className="text-2xl mt-0.5 flex-none">{b.icon}</span>
              <div>
                <h3 className="font-semibold text-ink">{b.title}</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Recruitment timeline */}
      <Section
        eyebrow="Recruitment"
        heading="How the process works."
        subtext="We keep it simple. The whole process takes two weeks."
        surface
      >
        <ol className="flex flex-col gap-0 max-w-2xl">
          {TIMELINE.map((t, i) => (
            <li key={t.period} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-none">
                  <span className="font-mono text-[10px] font-bold text-primary leading-none text-center">
                    {t.period}
                  </span>
                </div>
                {i < TIMELINE.length - 1 && (
                  <div className="w-px flex-1 bg-border my-2" />
                )}
              </div>
              <div className={`${i < TIMELINE.length - 1 ? "pb-8" : ""} pt-1.5`}>
                <h3 className="font-semibold text-ink">{t.title}</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Apply CTA */}
      <section id="apply" className="brand-gradient">
        <div className="mx-auto max-w-[1200px] px-6 py-24 flex flex-col items-center text-center gap-6">
          <p className="font-mono text-xs uppercase tracking-widest text-white/50">
            Applications
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight max-w-md leading-snug">
            Ready to build something real?
          </h2>
          <p className="text-white/70 max-w-sm leading-relaxed">
            {/* TODO: replace with actual application link when live */}
            The Fall 2025 application will be linked here when it opens.
            Check back in August or follow us on Instagram for the announcement.
          </p>
          <a
            href="#" // TODO: replace with real application URL
            className="inline-flex items-center rounded-full bg-white px-8 py-3 text-base font-semibold text-primary shadow-lg hover:bg-white/90 transition-opacity"
          >
            Open application →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <Section eyebrow="FAQ" heading="Common questions.">
        <dl className="flex flex-col gap-8 max-w-2xl">
          {FAQ.map((item) => (
            <div key={item.q} className="flex flex-col gap-2">
              <dt className="font-semibold text-ink">{item.q}</dt>
              <dd className="text-sm text-muted leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
