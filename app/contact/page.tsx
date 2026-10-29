import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import EditorialButton from "@/components/EditorialButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import { contactPage as copy } from "@/lib/content";
import { LINKS, site } from "@/lib/site";

// Copy: content/contact/page.json. Email and socials: content/site.json.

export const metadata: Metadata = copy.meta;

const CARD = "flex h-full flex-col gap-4 border border-border bg-bg p-7 md:p-8";
const CARD_LINK = "mt-auto text-sm text-primary underline-offset-2 hover:underline";

function MethodCard({
  method,
  delayMs,
  children,
}: {
  method: { emoji: string; title: string; body: string };
  delayMs: number;
  children: React.ReactNode;
}) {
  return (
    <RevealOnScroll delayMs={delayMs} className={CARD}>
      <span className="text-3xl">{method.emoji}</span>
      <div>
        <h3 className="font-semibold text-ink">{method.title}</h3>
        <p className="mt-1 text-sm text-muted">{method.body}</p>
      </div>
      {children}
    </RevealOnScroll>
  );
}

export default function ContactPage() {
  const { email, location, mailingList } = copy.methods;

  return (
    <>
      <PageHero heading={copy.hero.heading} subtext={copy.hero.subtext} />

      <div className="fade-between-gradients">
        <Section index={1} eyebrow={copy.methods.eyebrow} heading={copy.methods.heading} firstOnPage>
          <div className="grid gap-8 sm:grid-cols-3">
            <MethodCard method={email} delayMs={100}>
              <a href={`mailto:${site.email}`} className={CARD_LINK}>
                {site.email}
              </a>
            </MethodCard>
            <MethodCard method={location} delayMs={200}>
              <p className="mt-auto text-sm text-muted">{location.detail}</p>
            </MethodCard>
            <MethodCard method={mailingList} delayMs={300}>
              <a href={LINKS.mailingList} target="_blank" rel="noopener noreferrer" className={CARD_LINK}>
                {mailingList.linkLabel}
              </a>
            </MethodCard>
          </div>
        </Section>

        <Section index={2} {...copy.socials}>
          <div className="flex max-w-lg flex-col gap-4">
            {site.socials.map((s, i) => (
              <RevealOnScroll key={s.platform} delayMs={100 + i * 100}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 border border-border bg-bg px-6 py-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-card motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span className="flex-none text-2xl">{s.emoji}</span>
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

        <Section
          eyebrow={copy.closingCta.eyebrow}
          heading={copy.closingCta.heading}
          subtext={copy.closingCta.subtext}
          centered
        >
          <RevealOnScroll delayMs={100}>
            <EditorialButton href={`mailto:${site.email}`} external>
              {copy.closingCta.button}
            </EditorialButton>
          </RevealOnScroll>
        </Section>
      </div>
    </>
  );
}
