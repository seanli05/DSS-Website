import type { Metadata } from "next";
import Section from "@/components/Section";
import EditorialButton from "@/components/EditorialButton";
import RevealOnScroll from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Data Science Society at UC Berkeley.",
};

// Square-corner hairline card, matching the homepage and Partners treatment.
const CARD =
  "flex h-full flex-col gap-4 border border-border bg-bg p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-card motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-8";

const SOCIALS = [
  {
    platform: "Instagram",
    handle: "@berkeleydss", // TODO: verify handle
    href: "https://instagram.com/berkeleydss",
    icon: "📸",
  },
  {
    platform: "LinkedIn",
    handle: "UC Berkeley Data Science Society",
    href: "https://linkedin.com/company/uc-berkeley-data-science-society",
    icon: "💼",
  },
  {
    platform: "GitHub",
    handle: "dss-berkeley", // TODO: verify org name
    href: "https://github.com/dss-berkeley",
    icon: "💻",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Page header — -mt-16/pt-16 pulls it up behind the fixed translucent nav (main has pt-16) */}
      <section className="font-poppins relative -mt-16 overflow-hidden pt-16 surface-green-gradient">
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24 lg:px-12">
          <p className="inline-flex border border-white/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/80">
            Contact
          </p>
          <h1 className="mt-8 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white">
            Get in touch.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
            Questions about joining, partnering, or anything else? We&apos;d love
            to hear from you. We typically respond within 48 hours.
          </p>
        </div>
      </section>

      {/* One continuous gradient from the hero's green down into the footer's,
          so both seams read as fades. Sections inside must stay transparent. */}
      <div className="fade-between-gradients">
        {/* Contact methods */}
        <Section index={1} eyebrow="Reach us" heading="Ways to connect." divider>
          <div className="grid gap-8 sm:grid-cols-3">
            {/* Email */}
            <RevealOnScroll delayMs={100} className={CARD}>
              <span className="text-3xl">✉️</span>
              <div>
                <h3 className="font-semibold text-ink">Email</h3>
                <p className="mt-1 text-sm text-muted">
                  The fastest way to reach the officer team.
                </p>
              </div>
              <a
                href="mailto:dss@berkeley.edu" // TODO: verify email
                className="mt-auto text-sm text-primary underline-offset-2 hover:underline"
              >
                dss@berkeley.edu
              </a>
            </RevealOnScroll>

            {/* Location */}
            <RevealOnScroll delayMs={200} className={CARD}>
              <span className="text-3xl">📍</span>
              <div>
                <h3 className="font-semibold text-ink">Location</h3>
                <p className="mt-1 text-sm text-muted">
                  We meet weekly on the UC Berkeley campus.
                </p>
              </div>
              <p className="mt-auto text-sm text-muted">
                {/* TODO: add actual meeting room/location */}
                UC Berkeley Campus<br />
                TODO: Meeting room TBD
              </p>
            </RevealOnScroll>

            {/* Mailing list */}
            <RevealOnScroll delayMs={300} className={CARD}>
              <span className="text-3xl">📬</span>
              <div>
                <h3 className="font-semibold text-ink">Mailing list</h3>
                <p className="mt-1 text-sm text-muted">
                  Stay updated on events, workshops, and recruitment.
                </p>
              </div>
              <a
                href="#" // TODO: add mailing list sign-up link
                className="mt-auto text-sm text-primary underline-offset-2 hover:underline"
              >
                Subscribe →
              </a>
            </RevealOnScroll>
          </div>
        </Section>

        {/* Social links */}
        <Section index={2} eyebrow="Socials" heading="Follow along.">
          <div className="flex max-w-lg flex-col gap-4">
            {SOCIALS.map((s, i) => (
              <RevealOnScroll key={s.platform} delayMs={100 + i * 100}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 border border-border bg-bg px-6 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-card motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span className="flex-none text-2xl">{s.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{s.platform}</p>
                    <p className="truncate text-xs text-muted">{s.handle}</p>
                  </div>
                  <span className="flex-none text-sm text-muted">→</span>
                </a>
              </RevealOnScroll>
            ))}
          </div>
        </Section>

        {/* Simple email CTA — unnumbered, matching how Partners closes. */}
        <Section
          eyebrow="Ready to chat?"
          heading="We're always happy to talk."
          subtext="Whether you're a student, a potential partner, or just curious — send us an email and we'll get back to you."
          centered
        >
          <RevealOnScroll delayMs={100}>
            <EditorialButton href="mailto:dss@berkeley.edu" external>
              Send us an email
            </EditorialButton>
          </RevealOnScroll>
        </Section>
      </div>
    </>
  );
}
