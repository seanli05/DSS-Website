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
      <NodeGraph id="particles-home" className="absolute inset-0 w-full h-full pointer-events-none" opacity={0.25} />

      <div className="relative z-10 mx-auto flex flex-1 items-center w-full max-w-[1200px] px-6">
        <div className="grid items-center gap-12 py-20 w-full md:grid-cols-2">
          {/* Left: headline + tagline + CTAs */}
          <div className="flex flex-col items-start text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[0.95]">
              DATA SCIENCE SOCIETY
            </h1>
            <p className="mt-4 font-mono text-lg md:text-xl uppercase tracking-widest text-white/70">
              @ UC Berkeley
            </p>
            <p className="mt-6 text-base md:text-lg text-white/70 max-w-md leading-relaxed">
              We turn Berkeley students into data scientists.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/join"
                className="inline-flex items-center rounded-none bg-white px-7 py-3 text-lg font-semibold text-primary shadow-lg hover:bg-white/90 transition-opacity"
              >
                Join DSS
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-none border border-white/60 px-7 py-3 text-lg font-semibold text-white hover:border-white hover:bg-white/10 transition-all"
              >
                Learn more →
              </Link>
            </div>
          </div>

          {/* Right: logo as the vibrant centerpiece */}
          <div className="relative flex items-center justify-center">
            {/* Static glow ring — built as a plain radial-gradient (no mask-image, no rotation).
                A masked + continuously-rotating element here previously forced the GPU to
                re-composite the mask every frame, which is expensive; a symmetric ring gains
                nothing visually from spinning anyway. */}
            <div
              className="absolute h-[260px] w-[260px] md:h-[380px] md:w-[380px] rounded-full opacity-50"
              style={{
                background:
                  "radial-gradient(circle, transparent 60%, rgba(255,255,255,0.55) 64%, rgba(255,255,255,0.55) 68%, transparent 72%)",
              }}
              aria-hidden="true"
            />
            <div className="hero-logo-intro hero-logo-breathe relative h-[190px] w-[190px] md:h-[300px] md:w-[300px] drop-shadow-[0_0_45px_rgba(255,255,255,0.5)]">
              <Image
                src="/dss-logo-white.png"
                alt="Data Science Society logo"
                fill
                priority
                sizes="(min-width: 768px) 300px, 190px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom of hero: decorative partner logo marquee (no links) */}
      {partners.length > 0 && (
        <div className="relative z-10 pb-16">
          <p className="mb-10 text-center font-mono text-xl uppercase tracking-widest text-white/60">
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
