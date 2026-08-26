import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import EditorialButton from "@/components/EditorialButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import ProjectCarousel from "@/components/ProjectCarousel";
import { getProjectsByCommittee } from "@/lib/content";
import { DECAL_APPLICATION_URL } from "@/lib/site";

const DECAL_URL = "https://dssdecal.org/";

// A member-written Q&A about the course, on the DSS Medium publication. Kept
// next to DECAL_URL rather than in lib/site.ts: it's one article this page
// links, not a per-cycle URL other routes and redirects share.
const DECAL_QA_ARTICLE_URL =
  "https://medium.com/data-science-society/what-is-the-introduction-to-real-world-data-science-decal-a-q-a-guide-9a6e6adef2cb";

// ink/80 rather than full ink: against the muted body copy these paragraphs
// use, --color-ink reads as a hard black and the bolded phrases jump out of the
// column. Softening it to a dark grey keeps the emphasis without the spike, and
// still clears AA (8.6:1 on white) — a step darker than the surrounding text.
const B = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-semibold text-ink/80">{children}</strong>
);

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
          <h1 className="max-w-3xl text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white">
            Introduction to Real-World Data Science.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
            A student-taught, project-based course for anyone who wants practical data
            science experience. No prior experience is required.
          </p>
          <div className="mt-10">
            {/* The form URL lives in lib/site.ts — update it there once per
                semester. rounded-full is a scoped exception here, matching the
                Join hero's pill CTAs — not a change to EditorialButton's square
                default. */}
            <EditorialButton
              href={DECAL_APPLICATION_URL}
              external
              variant="inverse"
              className="rounded-full"
            >
              Apply to the DeCal
            </EditorialButton>
          </div>
        </div>
      </section>

      <div className="fade-between-gradients">
        <Section
          id="course"
          index={1}
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
                Learn how to{" "}
                <B>transform a question about anything into a thoughtful result</B>. The
                course covers project scoping, data cleaning, exploratory analysis, data
                visualization, machine learning, model evaluation, and deep learning, with
                an emphasis on understanding <B>why each decision matters</B>. Throughout
                the course, we connect these principles to <B>real-world problems</B> and
                show how data science teams apply them in industry.
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
                Choose a real-world question you care about and develop an{" "}
                <B>end-to-end team project</B> around it. You will define the scope, work
                with a dataset, build and evaluate an approach, and turn your findings into
                a <B>clear final presentation</B>. Throughout the process, Acadev
                instructors provide <B>feedback and mentorship</B> to help your team work
                through technical challenges, make thoughtful decisions, and communicate
                what you learned.
              </p>
            </RevealOnScroll>
          </div>

          {/* Sits under both columns rather than inside either one — the Q&A
              covers the whole course, not just one half of the section. */}
          <RevealOnScroll delayMs={300} className="mt-12">
            <p className="text-base leading-relaxed text-muted">
              Any questions or want to learn more? Read the{" "}
              <a
                href={DECAL_QA_ARTICLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2 transition-colors duration-150 hover:text-primary-bright"
              >
                Q&amp;A guide on Medium
              </a>{" "}
              that one of our members wrote.
            </p>
          </RevealOnScroll>
        </Section>

        {/* Two photos of the course itself, side by side. Both sit in the same
            4/3 frame so the pair reads as one row — the group shot is a portrait
            original, hence the low object-position: it crops to the students
            rather than to the empty wall above them. */}
        <Section
          index={2}
          eyebrow="Inside the course"
          heading="What students get"
        >
          {/* max-w-4xl rather than the section's full width: the two source
              photos are phone shots, and at ~550px a column they start showing
              their grain. Narrower reads sharper. */}
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 md:gap-10">
            <RevealOnScroll delayMs={100}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden border border-border">
                  <Image
                    src="/decal/guest-lecture.jpg"
                    alt="A guest lecturer speaking to DeCal students in a Berkeley lecture hall, slides projected on two screens behind him."
                    fill
                    sizes="(min-width: 896px) 420px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                  Hear guest lectures directly from faculty at UC Berkeley, including professors like Josh Grossman
                  and Eric Van Dusen, as well as accomplished students working in the
                  field.
                </figcaption>
              </figure>
            </RevealOnScroll>

            <RevealOnScroll delayMs={200}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden border border-border">
                  <Image
                    src="/decal/project-group.jpg"
                    alt="A DeCal project group standing together at the front of their classroom after class."
                    fill
                    sizes="(min-width: 896px) 420px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-[50%_85%]"
                  />
                </div>
                <figcaption className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                  Form a close bond with your project group and work closely with DSS
                  mentors at every stage of the project.
                </figcaption>
              </figure>
            </RevealOnScroll>
          </div>
        </Section>

        <Section
          index={3}
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
          subtext="Visit the course site to see the syllabus and course materials from previous years."
          centered
          size="sm"
        >
          {/* -mt-6 pulls the button up closer to the subtext above it; rounded-full
              is a scoped exception here, not a change to EditorialButton itself. */}
          <RevealOnScroll delayMs={100} className="-mt-6">
            <EditorialButton href={DECAL_URL} external className="rounded-full">
              Visit the DeCal site
            </EditorialButton>
          </RevealOnScroll>
        </Section>
      </div>
    </>
  );
}
