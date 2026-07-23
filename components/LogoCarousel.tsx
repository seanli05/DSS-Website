import Image from "next/image";
import type { Partner } from "@/lib/content";

interface LogoCarouselProps {
  partners: Partner[];
  /** Seconds for one full loop. Defaults to a constant pace regardless of partner count. */
  duration?: number;
  /**
   * "standalone" (default) renders its own full section with a heading, on
   * `bg-surface`. "embedded" drops the section/background/heading in favor of
   * a small light-on-dark label, for dropping into a dark host like Hero.
   */
  variant?: "standalone" | "embedded";
}

// Every logo sits in a fixed 160×48 slot with an 80px gap → 240px per slot.
// Fixed slots keep the track width identical before and after images load,
// whatever shape of logo an officer uploads to Airtable.
const SECONDS_PER_SLOT = 3; // 240px slot ÷ 3s ≈ 80px/s

export default function LogoCarousel({ partners, duration, variant = "standalone" }: LogoCarouselProps) {
  if (partners.length === 0) return null;

  // The track holds two identical halves and animates translateX(0 → -50%),
  // so the second half lands exactly where the first began — an invisible
  // loop point. Each half must be wider than any viewport or a gap scrolls
  // into view: ≥20 slots/half ≥ 4800px, safe past 4K, for any partner count.
  const reps = Math.ceil(20 / partners.length);
  const half = Array.from({ length: reps }, () => partners).flat();
  const seconds = duration ?? half.length * SECONDS_PER_SLOT;

  const embedded = variant === "embedded";

  const logoRow = (
    <ul className="flex items-center gap-20 pr-20">
      {half.map((partner, i) => (
        <li
          key={`${partner.id}-${i}`}
          className="flex h-12 w-40 flex-none items-center justify-center"
        >
          {partner.logoUrl ? (
            <Image
              src={partner.logoUrl}
              alt="" // decorative: partner names live in the sr-only list
              width={160}
              height={48}
              className={
                embedded
                  ? "h-12 w-40 object-contain brightness-0 invert opacity-70"
                  : "h-12 w-40 object-contain grayscale opacity-60"
              }
            />
          ) : (
            <span
              className={`max-w-full truncate text-sm font-semibold ${embedded ? "text-white/70" : "text-muted"}`}
            >
              {partner.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );

  // Screen readers get each partner once; the moving strip is decorative.
  const srOnlyList = (
    <ul className="sr-only">
      {partners.map((partner) => (
        <li key={partner.id}>{partner.name}</li>
      ))}
    </ul>
  );

  const track = (
    <div
      aria-hidden="true"
      className="relative overflow-clip marquee-mask pointer-events-none select-none"
    >
      <div
        className="flex w-max will-change-transform animate-marquee motion-reduce:animate-none"
        style={{ animationDuration: `${seconds}s` }}
      >
        {logoRow}
        {logoRow}
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="mt-12 w-full">
        <p className="mb-4 text-center font-mono text-xs uppercase tracking-widest text-white/50">
          Our partners
        </p>
        {srOnlyList}
        {track}
      </div>
    );
  }

  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 flex flex-col items-center text-center mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
          Our partners
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-ink leading-snug">
          Trusted by industry leaders
        </h2>
      </div>

      {srOnlyList}
      {track}
    </section>
  );
}
