import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import EditorialButton from "@/components/EditorialButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import RecruitmentTimeline from "@/components/RecruitmentTimeline";
import NewbieExperience from "@/components/NewbieExperience";
import InterviewResources from "@/components/InterviewResources";
import {
  getFaq,
  getInterviewResources,
  getNewbieExperience,
  getRecruitmentTimeline,
  joinPage as copy,
} from "@/lib/content";
import { LINKS } from "@/lib/site";

// Copy: content/join/page.json. Sign-up links: `links` in content/site.json.

export const metadata: Metadata = copy.meta;

// The hero's two secondary sign-ups, styled alike so neither reads as more important.
const SECONDARY_LINK =
  "text-lg font-medium text-white/80 underline underline-offset-4 transition-colors duration-150 hover:text-white";

export default async function JoinPage() {
  const timeline = await getRecruitmentTimeline();

  return (
    <>
      <PageHero heading={copy.hero.heading} subtext={copy.hero.subtext}>
        {/* One primary CTA, with the two lower-commitment sign-ups as plain links
            beside it. flex-wrap lets the links drop to their own line on phones. */}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <EditorialButton
            href={LINKS.application}
            external
            variant="inverse"
            size="large"
            className="rounded-full"
          >
            {copy.hero.applyButton}
          </EditorialButton>
          <a href={LINKS.coffeeChat} target="_blank" rel="noopener noreferrer" className={SECONDARY_LINK}>
            {copy.hero.coffeeChatLink}
          </a>
          <a href={LINKS.mailingList} target="_blank" rel="noopener noreferrer" className={SECONDARY_LINK}>
            {copy.hero.mailingListLink}
          </a>
        </div>
      </PageHero>

      {/* One continuous gradient from the hero's green down into the footer's.
          overflow-x-clip contains the recruitment timeline's full-bleed track. */}
      <div className="fade-between-gradients overflow-x-clip">
        <Section index={1} {...copy.timeline} firstOnPage centered>
          <RecruitmentTimeline events={timeline} />
        </Section>

        <Section index={2} {...copy.interviewResources}>
          <InterviewResources resources={getInterviewResources()} />
        </Section>

        <Section index={3} {...copy.newbieExperience}>
          <NewbieExperience pillars={getNewbieExperience()} />
        </Section>

        <Section index={4} {...copy.faq}>
          <dl className="flex max-w-2xl flex-col gap-8">
            {getFaq().map((item, i) => (
              <RevealOnScroll key={item.id} delayMs={100 + i * 75} className="flex flex-col gap-2">
                <dt className="font-semibold text-ink">{item.question}</dt>
                {/* One <dd> per paragraph — a <dl> allows several per <dt>. */}
                {item.answer.map((paragraph) => (
                  <dd key={paragraph} className="text-sm leading-relaxed text-muted">
                    {paragraph}
                  </dd>
                ))}
              </RevealOnScroll>
            ))}
          </dl>
        </Section>
      </div>
    </>
  );
}
