import Image from "next/image";
import Link from "next/link";
import NodeGraph from "./NodeGraph";
import type { Partner } from "@/lib/content";

interface HeroProps {
  partners: Partner[];
}

// These two read fine at the marquee's original size; every other logo is scaled down to match.
const FULL_SIZE_LOGOS = new Set(["Arc'teryx", "WWF"]);

// Each logo's real width/height (scaled down, same aspect ratio as the source file). Passing the
// true ratio here — instead of one generic box for every logo — avoids Next.js's "width or height
// modified but not the other" dev warning, since object-contain then never has to reconcile a
// mismatched intrinsic ratio against the rendered box.
const LOGO_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "Analog Devices": { width: 169, height: 48 },
  "Arc'teryx": { width: 80, height: 48 },
  Boeing: { width: 180, height: 48 },
  "National Geographic": { width: 163, height: 48 },
  Databricks: { width: 269, height: 48 },
  Oracle: { width: 322, height: 48 },
  "Stanford Medicine": { width: 302, height: 48 },
  WWF: { width: 81, height: 48 },
};

export default function Hero({ partners }: HeroProps) {
  const marqueeItems = [...partners, ...partners, ...partners];
  const marqueeDuration = `${partners.length * 3}s`;

  return (
    <section className="relative brand-gradient overflow-hidden flex flex-col md:min-h-[calc(100vh-4rem)]">
      {/* Wrapper confines the particle canvas to the headline area only, so it never repaints
          behind the partner marquee below — two animated layers sharing the same pixels was
          what made the marquee (the only continuously-moving element down there) read as laggy. */}
      <div className="relative flex flex-1 items-center">
        <NodeGraph id="particles-home" className="absolute inset-0 w-full h-full pointer-events-none" opacity={0.25} />

        <div className="relative z-10 mx-auto flex w-full max-w-[1200px] px-6">
          <div className="grid items-center gap-12 py-20 mt-6 w-full md:grid-cols-2">
          {/* Left: headline + tagline + CTAs */}
          <div className="flex flex-col items-start text-left">
            <h1 className="font-sans text-[32px] md:text-[40px] lg:text-[48px] font-bold text-white tracking-tight leading-[0.95] lg:whitespace-nowrap">
              DATA SCIENCE SOCIETY
            </h1>
            <p className="mt-4 text-lg md:text-xl font-extrabold uppercase tracking-wide text-white/80">
              @ UC Berkeley
            </p>
            {/* TODO: finalize this copy with DSS leadership — placeholder so the section reads at full length */}
            <p className="mt-6 text-base md:text-lg font-bold text-white/80 max-w-lg leading-relaxed">
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
              {/* Static glow ring — built as a plain radial-gradient (no mask-image, no rotation).
                  A masked + continuously-rotating element here previously forced the GPU to
                  re-composite the mask every frame, which is expensive; a symmetric ring gains
                  nothing visually from spinning anyway. */}
              <div
                className="absolute inset-0 rounded-full opacity-50"
                style={{
                  background:
                    "radial-gradient(circle, transparent 60%, rgba(255,255,255,0.55) 64%, rgba(255,255,255,0.55) 68%, transparent 72%)",
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

      {/* Bottom of hero: decorative partner logo marquee (no links) */}
      {partners.length > 0 && (
        <div className="relative z-10 pb-16">
          <p className="mb-[30px] text-center text-xl font-bold uppercase tracking-wide text-white/80">
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
              {marqueeItems.map((partner, i) => (
                <div key={`${partner.id}-${i}`} className="flex-shrink-0 px-10 flex items-center h-16">
                  {partner.logoUrl ? (
                    <Image
                      src={partner.logoUrl}
                      alt={partner.name}
                      width={LOGO_DIMENSIONS[partner.name]?.width ?? 160}
                      height={LOGO_DIMENSIONS[partner.name]?.height ?? 48}
                      className={`w-auto object-contain ${FULL_SIZE_LOGOS.has(partner.name) ? "h-full" : "h-1/2"}`}
                    />
                  ) : (
                    <span className="text-lg font-semibold text-white/75 whitespace-nowrap">
                      {partner.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
