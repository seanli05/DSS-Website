import type { Metadata } from "next";
import Section from "@/components/Section";
import CommitteeCard from "@/components/CommitteeCard";
import Button from "@/components/Button";
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
      {/* Page header */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
            Committees
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-ink max-w-xl leading-tight">
            Find your niche.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-lg leading-relaxed">
            {/* TODO: finalize copy */}
            {/* TODO: finalize copy */}
            DSS is organized into three committees — Acadev, Consulting, and
            Social Good. Every member picks a home and grows fast.
          </p>
        </div>
      </section>

      {/* Committee cards */}
      <Section eyebrow="What we do" heading="Three committees, one community.">
        <div className="grid sm:grid-cols-2 gap-6">
          {committees.map((c) => (
            <div key={c.id} className="flex flex-col gap-0">
              <CommitteeCard committee={c} />
              {c.lead && !c.lead.startsWith("TODO") && (
                <p className="mt-2 pl-2 font-mono text-xs text-muted">
                  Lead: {c.lead}
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Apply CTA */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-20 flex flex-col items-center text-center gap-6">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Ready to join?
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink max-w-md leading-snug">
            Applications open every semester.
          </h2>
          <p className="text-muted max-w-md leading-relaxed">
            {/* TODO: update with current recruitment dates */}
            We recruit in the first two weeks of Fall and Spring semester.
            Check the Join page for dates, timelines, and how to apply.
          </p>
          <Button href="/join" size="lg">
            Apply to DSS →
          </Button>
        </div>
      </section>
    </>
  );
}
