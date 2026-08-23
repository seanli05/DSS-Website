import type { Metadata } from "next";
import Section from "@/components/Section";
import EditorialButton from "@/components/EditorialButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import ProjectCarousel from "@/components/ProjectCarousel";
import { getProjectsByCommittee } from "@/lib/content";

const DECAL_URL = "https://dssdecal.org/";

export const metadata: Metadata = {
  title: "DeCal",
  description:
    "Learn about Introduction to Real-World Data Science, DSS's student-taught DeCal at UC Berkeley.",
};

export default async function DecalPage() {
  const projects = await getProjectsByCommittee("acadev");

  return (
    <>
      <section className="font-poppins relative -mt-16 overflow-hidden pt-16 surface-green-gradient">
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24 lg:px-12">
          <p className="inline-flex border border-white/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/80">
            DSS DeCal
          </p>
          <h1 className="mt-8 max-w-3xl text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white">
            Introduction to Real-World Data Science.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            A student-taught, project-based course for anyone who wants practical data
            science experience. No prior experience is required.
          </p>
          <div className="mt-10">
            <EditorialButton href="#course" variant="inverse">
              Explore the course
            </EditorialButton>
          </div>
        </div>
      </section>

      <div className="fade-between-gradients">
        <Section
          id="course"
          index={1}
          indexSeparator=":"
          eyebrow="Course overview"
          heading="Learn by building."
          firstOnPage
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
            <RevealOnScroll delayMs={100} className="lg:pr-12 xl:pr-16">
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                What you will learn
              </p>
              <h2 className="mt-5 text-[clamp(1.05rem,1.7vw,1.25rem)] font-semibold leading-tight text-ink sm:whitespace-nowrap">
                Work through the full data science life cycle.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
                Learn how to transform a question about anything into a thoughtful result.
                The course covers project scoping, data cleaning, exploratory analysis,
                data visualization, machine learning, model evaluation, and deep learning,
                with an emphasis on understanding why each decision matters. Throughout
                the course, we connect these principles to real-world problems and show
                how data science teams apply them in industry.
              </p>
            </RevealOnScroll>

            <RevealOnScroll
              delayMs={200}
              className="border-t border-border pt-12 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0 xl:pl-16"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                What to expect from your project
              </p>
              <h2 className="mt-5 text-[clamp(1.05rem,1.7vw,1.25rem)] font-semibold leading-tight text-ink sm:whitespace-nowrap">
                Turn an idea into a finished project.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
                Choose a real-world question you care about and develop an end-to-end
                team project around it. You will define the scope, work with a dataset,
                build and evaluate an approach, and turn your findings into a clear final
                presentation. Throughout the process, Acadev instructors provide feedback
                and mentorship to help your team work through technical challenges, make
                thoughtful decisions, and communicate what you learned.
              </p>
            </RevealOnScroll>
          </div>
        </Section>

        <Section
          index={2}
          indexSeparator=":"
          eyebrow="Student work"
          heading="See what students have built."
          subtext="These featured projects show the range of questions students explore across domains with guidance from Acadev instructors."
        >
          <RevealOnScroll delayMs={100}>
            <ProjectCarousel projects={projects} circular uniformTint />
          </RevealOnScroll>
        </Section>

        <Section
          eyebrow="Interested?"
          heading="Learn more about the DeCal."
          subtext="Visit the course site for current enrollment information, course materials, and updates."
          centered
          size="sm"
        >
          <RevealOnScroll delayMs={100}>
            <EditorialButton href={DECAL_URL} external>
              Visit the DeCal site
            </EditorialButton>
          </RevealOnScroll>
        </Section>
      </div>
    </>
  );
}
