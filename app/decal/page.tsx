import type { Metadata } from "next";
import Section from "@/components/Section";
import EditorialButton from "@/components/EditorialButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import ProjectCarousel from "@/components/ProjectCarousel";
import { getProjectsByCommittee } from "@/lib/content";

export const metadata: Metadata = {
  title: "DeCal",
  description:
    "Introduction to Real-World Data Science, DSS's student-taught DeCal at UC Berkeley.",
};

const LIFECYCLE = [
  {
    icon: "📝",
    title: "Project proposal",
    body: "Pitch a data science project you actually want to pursue and take full creative control over its direction.",
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

export default async function DecalPage() {
  const projects = await getProjectsByCommittee("acadev");

  return (
    <>
      {/* The negative margin pulls the header behind the fixed translucent nav. */}
      <section className="font-poppins relative -mt-16 overflow-hidden pt-16 surface-green-gradient">
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24 lg:px-12">
          <p className="inline-flex border border-white/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/80">
            DSS DeCal
          </p>
          <h1 className="mt-8 max-w-3xl text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white">
            Introduction to Real-World Data Science.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
            New to Berkeley and still deciding if data science is right for you? This
            semester-long DeCal offers a hands-on, project-based way to find out. No prior
            experience is required.
          </p>
          {/* TODO: replace with real enrollment/application link and info */}
          <div className="mt-10">
            <EditorialButton href="/join" variant="inverse">
              Get in touch
            </EditorialButton>
          </div>
        </div>
      </section>

      {/* One continuous gradient from the hero's green down into the footer's,
          so both seams read as fades. Sections inside must stay transparent. */}
      <div className="fade-between-gradients">
        {/* About the course */}
        <Section
          index={1}
          indexSeparator=":"
          eyebrow="About the course"
          heading="Full creative control, real mentorship."
          divider
        >
          <RevealOnScroll delayMs={100}>
            <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              The Introduction to Real-World Data Science DeCal, offered by the Data Science
              Society at Berkeley, is a semester-long course focused on hands-on, project-based
              learning. Unlike traditional classes, this course gives students full creative
              control over a data science project of their choosing, allowing them to
              collaborate and apply key concepts in real-world scenarios. Guided by mentorship
              from committee members, students will navigate the entire data science
              lifecycle, beginning with a project proposal and exploratory data analysis,
              then progressing to machine learning model engineering and evaluation.
            </p>
          </RevealOnScroll>
        </Section>

        {/* Lifecycle breakdown */}
        <Section
          index={2}
          indexSeparator=":"
          eyebrow="What you'll do"
          heading="The data science lifecycle."
        >
          <div className="grid gap-8 sm:grid-cols-2">
            {LIFECYCLE.map((l, i) => (
              <RevealOnScroll
                key={l.title}
                delayMs={100 + i * 100}
                className="flex h-full gap-5 border border-border bg-bg p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-card motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-8"
              >
                <span className="mt-0.5 flex-none text-2xl">{l.icon}</span>
                <div>
                  <h3 className="font-semibold text-ink">{l.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{l.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </Section>

        {/* Featured student projects completed with Acadev mentorship. */}
        <Section
          index={3}
          indexSeparator=":"
          eyebrow="Student work"
          heading="Featured DeCal projects."
          subtext="A selection of projects developed by students with mentorship from Acadev instructors throughout the course."
        >
          <RevealOnScroll delayMs={100}>
            <ProjectCarousel projects={projects} circular />
          </RevealOnScroll>
        </Section>

        {/* The unnumbered CTA matches how the Partners page closes. */}
        <Section
          eyebrow="Interested?"
          heading="Come see if data science is right for you."
          subtext="Units, prerequisites, and enrollment details are on their way. Check back soon or reach out to DSS directly."
          centered
        >
          {/* TODO: replace with real units, semester offered, and enrollment details */}
          <RevealOnScroll delayMs={100}>
            <EditorialButton href="/join">Apply to DSS</EditorialButton>
          </RevealOnScroll>
        </Section>
      </div>
    </>
  );
}
