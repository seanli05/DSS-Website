import Image from "next/image";
import { site } from "@/lib/site";

// Social icons come from `socials` in content/site.json (any entry with a
// `footerIcon`), followed by an email link to `email`.
//
// The social icons are pre-made white glyphs in public/icons/. The Gmail icon is
// still in its real colors, so it's forced to white with `brightness-0 invert`.
const footerLinks = [
  ...site.socials
    .filter((s) => s.footerIcon)
    .map((s) => ({ label: s.platform, href: s.href, src: s.footerIcon as string, whiten: false })),
  { label: "Email us", href: `mailto:${site.email}`, src: "/icons/gmail.png", whiten: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 surface-green-gradient">
      <div className="mx-auto max-w-[1200px] px-6 py-[29px]">
        {/* From `lg` up: brand left, icons truly centered (3-column grid, third
            column empty). Below `lg` the wordmark doesn't fit in a third of the
            bar, so the rows stack instead. */}
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:items-center lg:gap-0">
          <div className="flex items-center gap-3">
            <Image src="/brand/dss-logo-white.png" alt="" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12" aria-hidden="true" />
            <span className="text-2xl font-bold tracking-tight text-white xl:text-3xl">{site.name}</span>
          </div>

          <div className="flex items-center gap-5 lg:justify-center">
            {footerLinks.map(({ label, href, src, whiten }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="relative h-7 w-7 transition-transform hover:scale-110"
              >
                {src.endsWith(".svg") ? (
                  // next/image doesn't serve SVGs without a project-wide opt-in, so plain <img>.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="h-full w-full object-contain" />
                ) : (
                  <Image src={src} alt="" fill className={`object-contain ${whiten ? "brightness-0 invert" : ""}`} />
                )}
              </a>
            ))}
          </div>

          <div className="hidden lg:block" />
        </div>

        {/* Required independent-org disclaimer — do not remove. */}
        <p className="mt-5 text-[11px] text-white/50 leading-relaxed lg:mt-3">
          {site.footer.disclaimer}
          <br />© {new Date().getFullYear()} {site.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
