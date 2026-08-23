import Image from "next/image";

// Instagram/LinkedIn's real marks are a colored badge with a white glyph drawn on
// top — brightness-0+invert on the whole badge crushes both layers to white
// indistinguishably (a blank rounded square), so those two are pre-extracted down to
// just the white glyph (badge discarded) rather than filtered at render time.
// Gmail's "M" has no separate badge layer, so the filter alone works fine on it as-is.
// Medium is Medium's own three-ellipse "M", drawn as a white SVG glyph: every PNG in
// public/ (medium-badge-knockout-v2, medium-icon, mediumlogo) is the same bad crop of
// a wordmark lockup, which rendered as a white box with a half-cut "Me" in it.
//
// DSS has no Facebook presence, so there's no Facebook entry here.
const socials = [
  { label: "Instagram", href: "https://www.instagram.com/dssberkeley/", src: "/instagram-icon-white.svg", filter: false },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/dssberkeley/", src: "/linkedin-icon-white.png", filter: false },
  { label: "Medium", href: "https://medium.com/@dssberkeley", src: "/medium-icon-white.svg", filter: false },
  { label: "Email us", href: "mailto:dss.berkeley@gmail.com", src: "/gmail-icon.png", filter: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 surface-green-gradient">
      <div className="mx-auto max-w-[1200px] px-6 py-[29px]">
        {/* Brand (left) + social icons (true-centered in the bar via the 3-col grid,
            not flex justify-between — that would center relative to leftover space,
            not the bar's actual center).

            The grid only starts at `lg`, and the wordmark only reaches its full
            size at `xl`. The brand has to fit inside one third of the bar, which
            at `text-3xl` is about 375px of logo + wordmark — so the three columns
            don't fit until roughly 1170px wide. Narrower than that, the wordmark
            wrapped to three lines and the icon column, sized by the grid rather
            than by the overflowing text, printed straight through it (worst on
            phones, but the same bug all the way up). Below `lg` the columns stack
            instead, left-aligned with the disclaimer underneath. */}
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:items-center lg:gap-0">
          <div className="flex items-center gap-3">
            <Image src="/dss-logo-white.png" alt="" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12" aria-hidden="true" />
            <span className="text-2xl font-bold tracking-tight text-white xl:text-3xl">
              Data Science Society
            </span>
          </div>

          <div className="flex items-center gap-5 lg:justify-center">
            {socials.map(({ label, href, src, filter }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="relative h-7 w-7 transition-transform hover:scale-110"
              >
                {/* brightness-0 + invert forces a colored glyph to solid white — only needed
                    for gmail-icon.png, which still has its real (non-white) colors; the rest
                    are already pre-extracted to white (see comment on `socials` above). */}
                {src.endsWith(".svg") ? (
                  // next/image blocks SVGs by default (dangerouslyAllowSVG isn't set project-wide,
                  // and shouldn't be for just one decorative icon) — plain <img> for this one.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="h-full w-full object-contain" />
                ) : (
                  <Image src={src} alt="" fill className={`object-contain ${filter ? "brightness-0 invert" : ""}`} />
                )}
              </a>
            ))}
          </div>

          {/* Empty third column balances the grid so the middle column is the true
              center. Hidden while the columns are stacked, where it would only add
              a gap under the icons. */}
          <div className="hidden lg:block" />
        </div>

        {/* Required independent-org disclaimer — kept small/unobtrusive but present (see CLAUDE.md). */}
        <p className="mt-5 text-[11px] text-white/50 leading-relaxed lg:mt-3">
          We are a student group acting independently of the University of California. We take full
          responsibility for our organization and this website.
          <br />© {new Date().getFullYear()} Data Science Society at UC Berkeley. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
