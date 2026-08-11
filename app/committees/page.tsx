import type { Metadata } from "next";
import Section from "@/components/Section";
import CommitteeCard from "@/components/CommitteeCard";
import EditorialButton from "@/components/EditorialButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getCommittees } from "@/lib/content";

export const metadata: Metadata = {
  title: "Committees",
  description:
    "Explore DSS committees — from data consulting to machine learning research, find your niche.",
};

export default function CommitteesPage() {
  const committees = getCommittees();

  return (
    <>
      {/* Page header — -mt-16/pt-16 pulls it up behind the fixed translucent nav (main has pt-16) */}
      <section className="font-poppins relative -mt-16 overflow-hidden pt-16 surface-green-gradient">
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24 lg:px-12">
          <p className="inline-flex border border-white/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/80">
            Committees
          </p>
          <h1 className="mt-8 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white">
            Find your niche.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
            {/* TODO: finalize copy */}
            DSS is organized into three committees — Acadev, Consulting, and
            Social Good. Every member picks a home and grows fast.
          </p>
        </div>
      </section>

      {/* One continuous gradient from the hero's green down into the footer's,
          so both seams read as fades. Sections inside must stay transparent. */}
      <div className="fade-between-gradients">
        {/* Committee cards */}
        <Section
          index={1}
          eyebrow="What we do"
          heading="Three committees, one community."
          divider
        >
          {/* sm:auto-rows-fr — three cards in two columns means two rows, which
              would otherwise size independently and leave the lone card in row 2
              a different height. Gated at sm so single-column phones aren't
              padded out to the tallest card. */}
          <div className="grid gap-8 sm:auto-rows-fr sm:grid-cols-2">
            {committees.map((c, i) => (
              // The wrapper is the grid item, so it takes the row height; the
              // card grows into whatever the optional "Lead" line leaves over.
              <RevealOnScroll key={c.id} delayMs={100 + i * 100} className="flex h-full flex-col">
                <div className="flex-1">
                  <CommitteeCard committee={c} />
                </div>
                {/* Always rendered, even with no lead yet: the line sits outside
                    the card, so showing it on only some cards would shorten those
                    cards by its height and leave the row ragged. The placeholder
                    reserves the space and keeps every card box identical. */}
                {(() => {
                  const hasLead = Boolean(c.lead) && !c.lead.startsWith("TODO");
                  return (
                    <p
                      className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted"
                      aria-hidden={!hasLead}
                    >
                      {hasLead ? `Lead: ${c.lead}` : " "}
                    </p>
                  );
                })()}
              </RevealOnScroll>
            ))}
          </div>
        </Section>

        {/* Apply CTA — unnumbered, matching how Partners closes. */}
        <Section
          eyebrow="Ready to join?"
          heading="Applications open every semester."
          subtext="We recruit in the first two weeks of Fall and Spring semester. Check the Join page for dates, timelines, and how to apply."
          centered
        >
          {/* TODO: update with current recruitment dates */}
          <RevealOnScroll delayMs={100}>
            <EditorialButton href="/join">Apply to DSS</EditorialButton>
          </RevealOnScroll>
        </Section>
      </div>
    </>
  );
}
