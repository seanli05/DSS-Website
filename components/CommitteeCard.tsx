import Image from "next/image";
import Link from "next/link";
import type { Committee } from "@/lib/content";

interface CommitteeCardProps {
  committee: Committee;
}

// Presentation-only mapping (not content) — one accent per committee, all
// referencing the site's existing color tokens. Social Good uses --color-accent-ink
// instead of --color-accent for text/icons since sage itself isn't AA-legible at
// small sizes (see app/globals.css).
const ACCENT: Record<string, { text: string; bar: string; tint: string; fill: string }> = {
  acadev: { text: "text-primary", bar: "bg-primary", tint: "bg-primary/10", fill: "fill-primary/50" },
  consulting: {
    text: "text-primary-bright",
    bar: "bg-primary-bright",
    tint: "bg-primary-bright/10",
    fill: "fill-primary-bright/50",
  },
  "social-good": { text: "text-accent-ink", bar: "bg-accent-ink", tint: "bg-accent/20", fill: "fill-accent/60" },
};

// One shared organic blob shape (purely decorative background) — only the fill
// color differs per committee, so there's no need for three near-identical paths.
function Blob({ className }: { className: string }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true">
      <path
        className={className}
        d="M42,-58C54,-49,62,-35,66,-20C70,-5,70,12,63,25C56,38,42,47,27,54C12,61,-5,66,-22,63C-39,60,-56,49,-64,34C-72,19,-71,0,-65,-16C-59,-32,-48,-45,-35,-54C-22,-63,-11,-68,3,-72C17,-76,34,-67,42,-58Z"
      />
    </svg>
  );
}

function Glyph({ id, className }: { id: string; className: string }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 5.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (id === "acadev") {
    return (
      <svg viewBox="0 0 100 100" className={className} {...stroke}>
        <rect x="14" y="18" width="72" height="52" rx="4" />
        <polyline points="26,58 42,44 54,52 74,30" />
        <circle cx="74" cy="30" r="5" fill="currentColor" stroke="none" />
        <line x1="40" y1="70" x2="40" y2="82" />
        <line x1="60" y1="70" x2="60" y2="82" />
        <line x1="30" y1="82" x2="70" y2="82" />
      </svg>
    );
  }
  if (id === "consulting") {
    return (
      <svg viewBox="0 0 100 100" className={className} {...stroke}>
        <rect x="16" y="24" width="68" height="44" rx="4" />
        <line x1="34" y1="80" x2="66" y2="80" />
        <line x1="50" y1="68" x2="50" y2="80" />
        <line x1="30" y1="56" x2="30" y2="46" />
        <line x1="43" y1="56" x2="43" y2="38" />
        <line x1="56" y1="56" x2="56" y2="44" />
        <line x1="69" y1="56" x2="69" y2="34" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" className={className} {...stroke}>
      <path d="M50,78 C22,58 20,38 32,30 C42,24 50,32 50,38 C50,32 58,24 68,30 C80,38 78,58 50,78 Z" />
      <polyline points="24,52 40,52 46,42 54,60 60,52 76,52" />
    </svg>
  );
}

// h-full on the root is load-bearing: callers wrap this in a RevealOnScroll div
// that the grid stretches to the row height. Without it the card stays
// content-height inside that stretched box, so cards in one row end up ragged.
export default function CommitteeCard({ committee }: CommitteeCardProps) {
  const accent = ACCENT[committee.id] ?? ACCENT.acadev;

  return (
    <Link
      href={`/${committee.id}`}
      className="group relative flex h-full flex-col overflow-hidden border border-border bg-bg shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Accent bar — grows in from the left on hover */}
      <div
        className={`absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none ${accent.bar}`}
        aria-hidden="true"
      />

      {/* Art band — the committee's own photo. Falls back to the abstract blob +
          line-art glyph when a committee has no heroImage yet, so the card still
          renders if someone adds a committee before its photo exists. */}
      <div className={`relative flex aspect-[16/10] items-center justify-center overflow-hidden ${accent.tint}`}>
        {committee.heroImage ? (
          <Image
            src={committee.heroImage}
            alt="" // decorative: the card's own name and blurb carry the meaning
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <>
            <Blob className={`absolute h-[82%] w-[78%] opacity-55 ${accent.fill}`} />
            <Glyph
              id={committee.id}
              className={`relative z-10 h-[78px] w-[78px] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105 motion-reduce:transition-none ${accent.text}`}
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <p className={`mb-2 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.18em] ${accent.text}`}>
          {committee.kicker}
        </p>
        <p className="mb-2 text-xl font-bold tracking-tight text-ink">
          {committee.fullName ?? committee.name}
          {committee.fullName && (
            <span className="ml-1.5 text-sm font-medium text-muted">{committee.name}</span>
          )}
        </p>
        <p className="text-sm leading-relaxed text-muted">{committee.blurb}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {committee.focusAreas.map((area) => (
            <span key={area} className={`rounded-full px-2.5 py-1 text-xs font-medium ${accent.tint} ${accent.text}`}>
              {area}
            </span>
          ))}
        </div>

        <div className={`mt-auto flex items-center gap-2 pt-5 text-sm font-semibold ${accent.text}`}>
          View {committee.name}
          <span className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">→</span>
        </div>
      </div>
    </Link>
  );
}
