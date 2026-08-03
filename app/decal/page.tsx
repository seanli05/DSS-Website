import type { Metadata } from "next";
import Section from "@/components/Section";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "DeCal",
  description:
    "Introduction to Real-World Data Science — DSS's student-taught DeCal at UC Berkeley.",
};

const LIFECYCLE = [
  {
    icon: "📝",
    title: "Project proposal",
    body: "Pitch a data science project you actually want to work on — you have full creative control over the direction.",
  },
  {
    icon: "🔍",
    title: "Exploratory data analysis",
    body: "Dig into your dataset, find patterns, and shape the questions your project will actually answer.",
  },
  {
    icon: "⚙️",
    title: "Model engineering",
    body: "Build and iterate on the machine learning models your project needs, with mentorship along the way.",
  },
  {
    icon: "📊",
    title: "Evaluation",
    body: "Assess how well your models actually perform, and learn what \"good\" looks like in a real project.",
  },
];

export default function DecalPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
            DSS DeCal
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-ink max-w-2xl leading-tight">
            Introduction to Real-World Data Science.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-lg leading-relaxed">
            New to Berkeley and still deciding if data science is right for you? This
            semester-long DeCal is a hands-on, project-based way to find out — no prior
            experience required.
          </p>
          {/* TODO: replace with real enrollment/application link and info */}
          <div className="mt-8">
            <Button href="/join" size="lg">
              Get in touch →
            </Button>
          </div>
        </div>
      </section>

      {/* About the course */}
      <Section eyebrow="About the course" heading="Full creative control, real mentorship.">
        <p className="max-w-2xl text-muted leading-relaxed">
          The Introduction to Real-World Data Science DeCal, offered by the Data Science
          Society at Berkeley, is a semester-long course focused on hands-on, project-based
          learning. Unlike traditional classes, this course gives students full creative
          control over a data science project of their choosing, allowing them to
          collaborate and apply key concepts in real-world scenarios. Guided by mentorship
          from committee members, students will navigate the entire data science
          lifecycle — from crafting a project proposal and performing exploratory data
          analysis, to engineering and evaluating machine learning models.
        </p>
      </Section>

      {/* Lifecycle breakdown */}
      <Section eyebrow="What you'll do" heading="The data science lifecycle." surface>
        <div className="grid sm:grid-cols-2 gap-6">
          {LIFECYCLE.map((l) => (
            <div
              key={l.title}
              className="rounded-2xl border border-border bg-bg p-7 flex gap-5"
            >
              <span className="text-2xl mt-0.5 flex-none">{l.icon}</span>
              <div>
                <h3 className="font-semibold text-ink">{l.title}</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">{l.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="brand-gradient">
        <div className="mx-auto max-w-[1200px] px-6 py-24 flex flex-col items-center text-center gap-6">
          <p className="font-mono text-xs uppercase tracking-widest text-white/50">
            Interested?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight max-w-md leading-snug">
            Come see if data science is right for you.
          </h2>
          <p className="text-white/70 max-w-sm leading-relaxed">
            {/* TODO: replace with real units, semester offered, and enrollment details */}
            Units, prerequisites, and enrollment details are on their way — check back
            soon or reach out to DSS directly.
          </p>
          <Button href="/join" size="lg" className="!bg-white !text-primary hover:!bg-white/90">
            Apply to DSS →
          </Button>
        </div>
      </section>
    </>
  );
}
