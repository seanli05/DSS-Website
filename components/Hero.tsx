import Image from "next/image";
import Link from "next/link";
import NodeGraph from "./NodeGraph";
import type { Partner, Project } from "@/lib/content";

interface HeroProps {
  partners: Partner[];
  projects: Project[];
}

export default function Hero({ partners, projects }: HeroProps) {
  const marqueeItems = [...partners, ...partners, ...partners];
  const marqueeDuration = `${partners.length * 3}s`;

  // Only Consulting and Social Good projects are tracked in Airtable (see
  // getProjects), so a match here is always one of those two committees —
  // matches the "social good or consulting" ask without extra filtering.
  const projectForPartner = (partnerName: string) =>
    projects.find((p) => p.partner.trim().toLowerCase() === partnerName.trim().toLowerCase());

  return (
    <section className="relative -mt-16 pt-16 surface-green-gradient overflow-hidden flex flex-col md:min-h-screen">
      {/* Wrapper confines the particle canvas to the headline area only, so it never repaints
          behind the partner marquee below — two animated layers sharing the same pixels was
          what made the marquee (the only continuously-moving element down there) read as laggy. */}
      <div className="relative flex flex-1 items-center">
        <NodeGraph id="particles-home" className="absolute inset-0 w-full h-full pointer-events-none" opacity={0.25} />

        <div className="relative z-10 mx-auto flex w-full max-w-[1200px] px-6">
          <div className="grid items-center gap-12 py-16 mt-2 w-full md:grid-cols-2">
          {/* Left: headline + tagline + CTAs */}
          <div className="flex flex-col items-start text-left md:self-center md:mt-6">
            <h1 className="font-sans text-[32px] md:text-[40px] lg:text-[48px] font-bold text-white tracking-tight leading-[0.95] lg:whitespace-nowrap">
              Data Science Society
            </h1>
            <p className="mt-4 text-lg md:text-xl font-semibold tracking-wide text-white/80">
              @ Berkeley
            </p>
            {/* TODO: finalize this copy with DSS leadership — placeholder so the section reads at full length */}
            <p className="mt-6 text-base md:text-lg text-white/70 max-w-lg leading-relaxed">
              We turn Berkeley students into data scientists. Through hands-on projects with
              real industry partners and mentorship from experienced members, we&apos;ll help
              you build the skills and portfolio to break into the field.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/join"
                className="inline-flex items-center rounded-full bg-white px-7 py-3 text-lg font-semibold text-primary shadow-lg hover:bg-white/90 transition-opacity"
              >
                Join DSS
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-full border border-white/60 px-7 py-3 text-lg font-semibold text-white hover:border-white hover:bg-white/10 transition-all"
              >
                Learn more →
              </Link>
            </div>
          </div>

          {/* Right: logo as the vibrant centerpiece.
              justify-end pins this column's content flush against the column's own right edge —
              which is the same container right edge the nav's "Join" button sits on — instead of
              floating centered with empty space on both sides. That's what makes it "align with
              the top bar" automatically: Nav and Hero already share the identical max-w-[1200px]
              container, so anything flush against one side of this box lines up with the nav's
              matching side without touching Nav.tsx at all. */}
          <div className="relative flex items-center justify-end">
            <div className="relative h-[260px] w-[260px] md:h-[410px] md:w-[410px]">
              {/* Spinning conic-gradient halo, masked down to a thin ring — matches the sean branch's homepage. */}
              <div
                className="hero-halo absolute inset-0 rounded-full opacity-50"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.9) 15%, transparent 30%, transparent 60%, rgba(255,255,255,0.6) 75%, transparent 90%)",
                  maskImage: "radial-gradient(circle, transparent 62%, black 64%, black 68%, transparent 70%)",
                  WebkitMaskImage: "radial-gradient(circle, transparent 62%, black 64%, black 68%, transparent 70%)",
                }}
                aria-hidden="true"
              />
              {/* Centering wrapper kept separate from the breathe/intro animation below — that
                  animation sets a raw `transform: scale(...)` in its keyframes, which would
                  clobber a translate-based centering transform if they were on the same element. */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="hero-logo-intro hero-logo-breathe relative h-[190px] w-[190px] md:h-[325px] md:w-[325px] drop-shadow-[0_0_45px_rgba(255,255,255,0.5)]">
                  <Image
                    src="/dss-logo-white.png"
                    alt="Data Science Society logo"
                    fill
                    priority
                    sizes="(min-width: 768px) 325px, 190px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Bottom of hero: partner logo marquee. Logos with a matching Consulting/Social
          Good project link to that project's card on the committee page; the rest
          (no project on file) stay decorative, unlinked divs. */}
      {partners.length > 0 && (
        <div className="relative z-10 pb-8 mt-4">
          <p className="mb-1.5 text-center font-mono text-sm uppercase tracking-widest text-white/50">
            Past partners
          </p>
          <div className="relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 md:w-40"
              style={{ background: "linear-gradient(to right, var(--color-primary-bright), transparent)" }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 md:w-40"
              style={{ background: "linear-gradient(to left, var(--color-accent), transparent)" }}
            />
            <div className="marquee-track" style={{ animationDuration: marqueeDuration }}>
              {marqueeItems.map((partner, i) => {
                const project = projectForPartner(partner.name);
                const itemClass = "group flex-shrink-0 mx-10 px-10 flex items-center justify-center h-36 w-56";

                const content = partner.logoUrl ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={partner.logoUrl}
                      alt={partner.name}
                      fill
                      // Same-size box for every partner regardless of their logo's native
                      // aspect ratio (object-contain fits without distorting or cropping).
                      // brightness-0 + invert forces any-colored logo to solid white; hover
                      // removes both to reveal the real logo colors, plus a small scale bump.
                      className="object-contain brightness-0 invert transition-all duration-300 group-hover:brightness-100 group-hover:invert-0 group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <span className="text-lg font-semibold text-white/75 whitespace-nowrap">
                    {partner.name}
                  </span>
                );

                return project ? (
                  <Link
                    key={`${partner.id}-${i}`}
                    href={`/committees/${project.committee}#${project.id}`}
                    className={itemClass}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={`${partner.id}-${i}`} className={itemClass}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
