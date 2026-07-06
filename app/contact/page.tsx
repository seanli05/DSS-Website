import type { Metadata } from "next";
import Section from "@/components/Section";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Data Science Society at UC Berkeley.",
};

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
      {/* Page header */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
            Contact
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-ink max-w-xl leading-tight">
            Get in touch.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-lg leading-relaxed">
            Questions about joining, partnering, or anything else? We&apos;d love
            to hear from you. We typically respond within 48 hours.
          </p>
        </div>
      </section>

      {/* Contact methods */}
      <Section eyebrow="Reach us" heading="Ways to connect.">
        <div className="grid sm:grid-cols-3 gap-6">
          {/* Email */}
          <div className="rounded-2xl border border-border bg-bg p-8 flex flex-col gap-4">
            <span className="text-3xl">✉️</span>
            <div>
              <h3 className="font-semibold text-ink">Email</h3>
              <p className="mt-1 text-sm text-muted">
                The fastest way to reach the officer team.
              </p>
            </div>
            <a
              href="mailto:dss@berkeley.edu" // TODO: verify email
              className="mt-auto font-mono text-sm text-primary hover:underline underline-offset-2"
            >
              dss@berkeley.edu
            </a>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-border bg-bg p-8 flex flex-col gap-4">
            <span className="text-3xl">📍</span>
            <div>
              <h3 className="font-semibold text-ink">Location</h3>
              <p className="mt-1 text-sm text-muted">
                We meet weekly on the UC Berkeley campus.
              </p>
            </div>
            <p className="mt-auto font-mono text-sm text-muted">
              {/* TODO: add actual meeting room/location */}
              UC Berkeley Campus<br />
              TODO: Meeting room TBD
            </p>
          </div>

          {/* Mailing list */}
          <div className="rounded-2xl border border-border bg-bg p-8 flex flex-col gap-4">
            <span className="text-3xl">📬</span>
            <div>
              <h3 className="font-semibold text-ink">Mailing list</h3>
              <p className="mt-1 text-sm text-muted">
                Stay updated on events, workshops, and recruitment.
              </p>
            </div>
            <a
              href="#" // TODO: add mailing list sign-up link
              className="mt-auto font-mono text-sm text-primary hover:underline underline-offset-2"
            >
              Subscribe →
            </a>
          </div>
        </div>
      </Section>

      {/* Social links */}
      <Section eyebrow="Socials" heading="Follow along." surface>
        <div className="flex flex-col gap-4 max-w-lg">
          {SOCIALS.map((s) => (
            <a
              key={s.platform}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 rounded-2xl border border-border bg-bg px-6 py-4 hover:shadow-md hover:border-primary/40 transition-all duration-200"
            >
              <span className="text-2xl flex-none">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink text-sm">{s.platform}</p>
                <p className="font-mono text-xs text-muted truncate">{s.handle}</p>
              </div>
              <span className="text-muted text-sm flex-none">→</span>
            </a>
          ))}
        </div>
      </Section>

      {/* Simple email CTA */}
      <section className="bg-bg">
        <div className="mx-auto max-w-[1200px] px-6 py-20 flex flex-col items-center text-center gap-6">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Ready to chat?
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink max-w-md leading-snug">
            We&apos;re always happy to talk.
          </h2>
          <p className="text-muted max-w-sm leading-relaxed">
            Whether you&apos;re a student, a potential partner, or just curious —
            send us an email and we&apos;ll get back to you.
          </p>
          <Button href="mailto:dss@berkeley.edu" external size="lg">
            Send us an email →
          </Button>
        </div>
      </section>
    </>
  );
}
