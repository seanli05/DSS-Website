import { type ReactNode } from "react";
import RichText from "./RichText";

interface PageHeroProps {
  heading: string;
  /** Supports **bold** and [links](…) — see RichText. */
  subtext?: string;
  /** "surface" (default) is the deep green used by most pages; "brand" is the brighter teal→sage gradient (About). */
  background?: "surface" | "brand";
  /** Shown in a second column beside the heading from `lg` up (the Partners inquiry form). */
  aside?: ReactNode;
  /** Buttons/links under the subtext. */
  children?: ReactNode;
}

const HEADING =
  "max-w-3xl text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-white";

/**
 * The green banner every page (except Home and the committee pages) opens with.
 *
 * `-mt-16 pt-16` pulls it up behind the fixed, translucent nav (main has pt-16),
 * so the gradient runs to the top of the window.
 */
export default function PageHero({
  heading,
  subtext,
  background = "surface",
  aside,
  children,
}: PageHeroProps) {
  const gradient = background === "brand" ? "brand-gradient" : "surface-green-gradient";
  const subtextWidth = aside ? "max-w-md" : "max-w-lg";

  const copy = (
    <>
      <h1 className={HEADING}>{heading}</h1>
      {subtext && (
        <p className={`mt-6 ${subtextWidth} text-base leading-relaxed text-white/75 md:text-lg`}>
          <RichText text={subtext} strongClassName="font-semibold text-white" linkClassName="underline underline-offset-2 text-white" />
        </p>
      )}
      {children}
    </>
  );

  return (
    <section className={`font-poppins relative -mt-16 overflow-hidden pt-16 ${gradient}`}>
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24 lg:px-12">
        {aside ? (
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>{copy}</div>
            {aside}
          </div>
        ) : (
          copy
        )}
      </div>
    </section>
  );
}
