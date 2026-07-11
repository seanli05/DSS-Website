import type { Metadata } from "next";
import Section from "@/components/Section";
import LogoWall from "@/components/LogoWall";
import Button from "@/components/Button";
import { getPartners, getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Partner with DSS — access Berkeley's top data science talent for consulting, research, and recruiting.",
};

const VALUE_PROPS = [
  {
    icon: "🎓",
    title: "Top-tier talent",
    body: "DSS members are among Berkeley's most rigorous students — many go on to data science and ML roles at the best companies in the world. Engage them early.",
  },
  {
    icon: "📊",
    title: "Consulting projects",
    body: "Bring us a real data problem and we'll build a dedicated student team to solve it. Our teams deliver production-quality work within a semester.",
  },
  {
    icon: "🔬",
    title: "Sponsored research",
    body: "Interested in longer-horizon collaboration? Partner with us on research initiatives, share proprietary datasets, and co-publish results.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Reach out",
    body: "Email us or fill out the form below. We'll schedule a call within a week.",
  },
  {
    step: "02",
    title: "Define the scope",
    body: "We work with you to size the problem and scope a deliverable that fits within one semester.",
  },
  {
    step: "03",
    title: "Meet your team",
    body: "We match your project with a hand-picked team of students and a faculty or alumni advisor.",
  },
  {
    step: "04",
    title: "Build together",
    body: "Weekly check-ins keep everyone aligned. You get visibility without managing the day-to-day.",
  },
  {
    step: "05",
    title: "Receive the results",
    body: "Teams present findings and ship code, models, or dashboards at the end of the semester.",
  },
];

export default async function PartnersPage() {
  const [partners, projects] = await Promise.all([getPartners(), getProjects()]);

  return (
    <>
      {/* Page header */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
            Industry partners
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-ink max-w-xl leading-tight">
            Access Berkeley&apos;s
            <br />
            data science talent.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-lg leading-relaxed">
            {/* TODO: verify copy with DSS leadership */}
            Partner with DSS for semester-long consulting engagements,
            recruiting pipelines, and sponsored research. Trusted by companies
            across tech, finance, and healthcare.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/contact" size="lg">
              Get in touch →
            </Button>
            <Button href="#how-it-works" variant="outline" size="lg">
              How it works
            </Button>
          </div>
        </div>
      </section>

      {/* Value props */}
      <Section eyebrow="Why partner with us" heading="What we offer.">
        <div className="grid sm:grid-cols-3 gap-6">
          {VALUE_PROPS.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border bg-bg p-8 flex flex-col gap-4"
            >
              <span className="text-3xl">{v.icon}</span>
              <h3 className="font-semibold text-ink text-lg">{v.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Logo wall */}
      <LogoWall partners={partners} projects={projects} />

      {/* How it works */}
      <Section
        id="how-it-works"
        eyebrow="Process"
        heading="How it works."
        subtext="We've run this process dozens of times. Here's what to expect."
        surface
      >
        <ol className="flex flex-col gap-0 max-w-2xl">
          {STEPS.map((s, i) => (
            <li key={s.step} className="flex gap-6">
              {/* Connector line */}
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-none">
                  <span className="font-mono text-xs font-bold text-primary">{s.step}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-border my-2" />
                )}
              </div>
              {/* Content */}
              <div className={`pb-${i < STEPS.length - 1 ? "8" : "0"} pt-1.5`}>
                <h3 className="font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Contact CTA */}
      <section className="bg-bg">
        <div className="mx-auto max-w-[1200px] px-6 py-20 flex flex-col items-center text-center gap-6">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Start a conversation
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink max-w-md leading-snug">
            Ready to work with Berkeley&apos;s best?
          </h2>
          <p className="text-muted max-w-sm leading-relaxed">
            {/* TODO: verify email address */}
            Drop us a line and we&apos;ll be in touch within 48 hours.
          </p>
          <Button href="mailto:dss@berkeley.edu" external size="lg">
            Email us →
          </Button>
        </div>
      </section>
    </>
  );
}
