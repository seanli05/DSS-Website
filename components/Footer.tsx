import Image from "next/image";

// TODO: verify these are the real handles before launch — placeholders for now.
//
// Instagram/LinkedIn/Facebook/Medium's real marks are a colored badge with a white
// glyph drawn on top — brightness-0+invert on the whole badge crushes both layers to
// white indistinguishably (a blank rounded square), so those four are pre-extracted
// down to just the white glyph (badge discarded) rather than filtered at render time.
// Gmail's "M" has no separate badge layer, so the filter alone works fine on it as-is.
const socials = [
  { label: "Instagram", href: "https://instagram.com/berkeleydss", src: "/instagram-icon-white.svg", filter: false },
  { label: "LinkedIn", href: "https://linkedin.com/company/berkeleydss", src: "/linkedin-icon-white.png", filter: false },
  { label: "Facebook", href: "https://facebook.com/berkeleydss", src: "/facebook-icon-white.png", filter: false },
  { label: "Medium", href: "https://medium.com/@berkeleydss", src: "/medium-badge-knockout-v2.png", filter: false },
  { label: "Email us", href: "mailto:dss@berkeley.edu", src: "/gmail-icon.png", filter: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 surface-green-gradient">
      <div className="mx-auto max-w-[1200px] px-6 py-[29px]">
        {/* Brand (left) + social icons (true-centered in the bar via the 3-col grid,
            not flex justify-between — that would center relative to leftover space,
            not the bar's actual center). */}
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center gap-3">
            <Image src="/dss-logo-white.png" alt="" width={48} height={48} className="h-12 w-12" aria-hidden="true" />
            <span className="text-3xl font-bold tracking-tight text-white">
              Data Science Society
            </span>
          </div>

          <div className="flex items-center justify-center gap-5">
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

          {/* Empty third column balances the grid so the middle column is the true center. */}
          <div />
        </div>

        {/* Required independent-org disclaimer — kept small/unobtrusive but present (see CLAUDE.md). */}
        <p className="mt-3 text-[11px] text-white/50 leading-relaxed">
          We are a student group acting independently of the University of California. We take full
          responsibility for our organization and this website.
          <br />© {new Date().getFullYear()} Data Science Society at UC Berkeley. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
