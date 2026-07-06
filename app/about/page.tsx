import type { Metadata } from "next";
import Section from "@/components/Section";
import StatCounter from "@/components/StatCounter";
import OfficerCard from "@/components/OfficerCard";
import Gallery from "@/components/Gallery";
import NodeGraph from "@/components/NodeGraph";
import { getStats, getTeam } from "@/lib/content";

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

export default function AboutPage() {
  const stats = getStats();
  const team = getTeam();

  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden brand-gradient">
        <NodeGraph id="particles-about" className="absolute inset-0 w-full h-full pointer-events-none" opacity={0.25} />
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-4">
            About DSS
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight max-w-xl">
            Built by students,
            <br />
            for students.
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-lg leading-relaxed">
            DSS is UC Berkeley&apos;s home for data science — where curious
            students become skilled practitioners, and lifelong connections are
            made.
          </p>
        </div>
      </section>

      {/* Mission / story */}
      <Section eyebrow="Our story" heading="Where we came from.">
        <div className="max-w-2xl flex flex-col gap-5 text-muted leading-relaxed">
          <p>
            {/* TODO: verify founding year and founding story with DSS leadership */}
            Data Science Society was founded by a small group of Berkeley
            students who wanted a place to apply what they were learning in
            class to real problems. What started as an informal study group
            has grown into one of Berkeley&apos;s most active technical
            organizations, with over 200 members across four committees.
          </p>
          <p>
            Every semester we take on consulting engagements with industry
            partners, run workshops and bootcamps for the broader campus
            community, and build internal tools that make the club run better.
            The work is hard and the stakes are real — and that&apos;s exactly
            why people keep coming back.
          </p>
        </div>
      </Section>

      {/* Values */}
      <Section eyebrow="What we believe" heading="Our values." surface>
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
      </Section>

      {/* Stats */}
      <section className="bg-bg">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((s) => (
              <StatCounter key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Community gallery */}
      <Section eyebrow="Community" heading="A glimpse into our world." surface>
        <Gallery />
      </Section>

      {/* Leadership */}
      <Section eyebrow="Leadership" heading="The team behind DSS.">
        {team.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {team.map((member) => (
              <OfficerCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <p className="text-muted">TODO: Add team members to content/team.json.</p>
        )}
      </Section>
    </>
  );
}
