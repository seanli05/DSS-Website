import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";
import { homePage } from "@/lib/content";

/**
 * The two ways into DSS, as the page's primary conversion step.
 *
 * Each panel is a single link wrapping its whole surface rather than a card with
 * a button inside it: the entire block is the target (much easier to hit,
 * especially on touch), and screen readers get one unambiguous link per path
 * instead of a card and a redundant nested control.
 *
 * Inner elements are drawn with `border-current` and opacity rather than fixed
 * colours, so the whole panel inverts in one move on hover with nothing left
 * behind in the old palette.
 *
 * Copy and photos: `paths` in content/home/page.json.
 */
const copy = homePage.paths;

export default function HomePaths() {
  // Last section on the page, so it owns the handoff into the footer:
  // home-footer-fade ramps this white field back toward the footer's green.
  return (
    <section className="font-poppins home-footer-fade">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-4 md:px-8 md:pb-24 lg:px-12 lg:pb-28">
        <RevealOnScroll delayMs={0}>
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
            (02) — {copy.eyebrow}
          </p>
          <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4vw,3.125rem)] font-normal leading-[1] tracking-tight text-ink">
            {copy.heading}
          </h2>
        </RevealOnScroll>

        <div className="mt-14 grid gap-8 md:grid-cols-2 md:gap-10">
          {copy.items.map((path, i) => (
            <RevealOnScroll key={path.href} delayMs={100 + i * 100}>
              <Link
                href={path.href}
                className="group flex h-full flex-col border border-border bg-bg p-6 text-ink transition-colors duration-150 hover:border-primary hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-primary md:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] tracking-[0.18em] text-primary transition-colors duration-150 group-hover:text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-2 w-2 border border-current opacity-40" aria-hidden="true" />
                </div>

                {/* border-current so the frame inverts with the panel on hover. */}
                <div className="relative mt-6 flex aspect-[4/3] items-center justify-center overflow-hidden border border-current opacity-100">
                  <Image
                    src={path.image.src}
                    alt={path.image.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <h3 className="mt-8 text-2xl leading-[1.15] tracking-tight md:text-3xl">
                  {path.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed opacity-75 md:text-lg">
                  {path.body}
                </p>

                {/* mt-auto pins the affordance to the bottom so both panels line
                    up regardless of how long the copy runs. */}
                <span className="mt-auto flex items-center gap-3 pt-8 text-[11px] font-medium uppercase tracking-[0.18em]">
                  {path.cta}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-150 motion-reduce:transition-none group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
