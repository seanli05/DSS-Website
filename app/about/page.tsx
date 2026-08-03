import type { Metadata } from "next";
import Section from "@/components/Section";
import StatCounter from "@/components/StatCounter";
import ExecCard from "@/components/ExecCard";
import CommitteeCard from "@/components/CommitteeCard";
import Button from "@/components/Button";
import NodeGraph from "@/components/NodeGraph";
import { getStats, getExecProfiles, getFeaturedCommittees } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Data Science Society — our mission, values, and the community we're building at UC Berkeley.",
};

const VALUES = [
  {
    icon: "🛠️",
    title: "Learning by doing",
    body: "We believe the fastest path to mastery is building real things for real clients. Every member ships production-quality work.",
  },
  {
    icon: "🤝",
    title: "Community first",
    body: "DSS is more than a club — it's a support network. We grow together through mentorship, study sessions, and shared wins.",
  },
  {
    icon: "📈",
    title: "Real impact",
    body: "Our projects move needles: millions saved, anomalies caught, pipelines shipped. We measure success by outcomes, not deliverables.",
  },
  {
    icon: "🔓",
    title: "Open to all",
    body: "Data science belongs to everyone. We welcome students from every major, background, and skill level — curiosity is the only prerequisite.",
  },
];

export default async function AboutPage() {
  const stats = getStats();
  const execProfiles = await getExecProfiles();
  const committees = getFeaturedCommittees();

  return (
    <>
      {/* 1. Hero — bold headline, two-line subtext, placeholder photo */}
      <section className="relative -mt-16 pt-16 overflow-hidden brand-gradient">
        <NodeGraph id="particles-about" className="absolute inset-0 w-full h-full pointer-events-none" opacity={0.25} />
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-24 flex flex-col items-center text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4">
            About DSS
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Data, Together.
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-lg leading-relaxed">
            DSS is UC Berkeley&apos;s home for data science — where curious
            students become skilled practitioners, and lifelong connections are made.
          </p>

          {/* TODO: swap in a real photo once one is picked */}
          <div className="relative mt-12 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center">
            <p className="font-mono text-xs uppercase tracking-widest text-white/50">
              Photo placeholder
            </p>
          </div>
        </div>
      </section>

      {/* 2. Mission — story, values, and stats combined into one window */}
      <Section eyebrow="Our story" heading="Where we came from." surface>
        <div className="grid gap-12 md:grid-cols-[minmax(0,26rem)_1fr] md:items-start">
          {/* Story text */}
          <div className="flex flex-col gap-5 text-muted leading-relaxed">
            <p>
              {/* TODO: verify founding year and founding story with DSS leadership */}
              Data Science Society was founded by a small group of Berkeley
              students who wanted a place to apply what they were learning in
              class to real problems. What started as an informal study group
              has grown into one of Berkeley&apos;s most active technical
              organizations, with over 200 members across three committees.
            </p>
            <p>
              Every semester we take on consulting engagements with industry
              partners, run workshops and bootcamps for the broader campus
              community, and build internal tools that make the club run better.
              The work is hard and the stakes are real — and that&apos;s exactly
              why people keep coming back.
            </p>
          </div>

          {/* Values grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-bg p-7 flex gap-5"
              >
                <span className="text-2xl mt-0.5 flex-none">{v.icon}</span>
                <div>
                  <h3 className="font-semibold text-ink">{v.title}</h3>
                  <p className="mt-1 text-sm text-muted leading-relaxed">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-border pt-12">
          {stats.map((s) => (
            <StatCounter key={s.label} {...s} />
          ))}
        </div>
      </Section>

      {/* 3. Committees — modeled on the "Our Programs" treatment */}
      <Section id="committees" eyebrow="Get involved" heading="Find your committee.">
        <div className="grid sm:grid-cols-3 gap-6">
          {committees.map((c) => (
            <div key={c.id} className="flex flex-col gap-4">
              <CommitteeCard committee={c} />
              <Button href={`/committees/${c.id}`} variant="outline" className="w-full">
                View {c.name} →
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. Executive board — cards at 3/4 their normal size */}
      <Section eyebrow="Leadership" heading="Our Executive Board." surface>
        {execProfiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {execProfiles.map((profile) => (
              <div key={profile.id} className="mx-auto w-3/4">
                <ExecCard profile={profile} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">
            Exec board profiles are on their way — check back soon.
          </p>
        )}
      </Section>
    </>
  );
}
