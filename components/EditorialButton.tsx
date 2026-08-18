import Link from "next/link";
import { type ReactNode } from "react";

type Variant = "solid" | "outline" | "inverse";
type Size = "default" | "large";

interface EditorialButtonProps {
  href: string;
  variant?: Variant;
  /** "large" for a page's single primary CTA (e.g. the Join hero). */
  size?: Size;
  /** Render a plain <a target="_blank"> instead of a <Link>. Also the right
   *  choice for mailto: hrefs, which aren't client-side routes. */
  external?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Button for the editorial homepage sections.
 *
 * Kept separate from the site-wide <Button> (a rounded-full pill) because these
 * sections use square corners and a small mono uppercase label — expressing that
 * as a variant on the pill would mean contradicting most of its base styles.
 *
 * Every variant swaps foreground and background on hover, so the footprint never
 * changes and nothing shifts under the cursor.
 */
const variantClasses: Record<Variant, string> = {
  solid:
    "border-2 border-primary bg-primary text-white hover:bg-transparent hover:text-primary focus-visible:outline-primary",
  outline:
    "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white focus-visible:outline-primary",
  // For CTAs sitting on a green gradient band. Replaces the `!bg-white
  // !text-primary` important-overrides the pill button needed to work on dark.
  inverse:
    "border-2 border-white bg-white text-primary hover:bg-transparent hover:text-white focus-visible:outline-white",
};

// Size lives here rather than being passed through `className` because the
// caller's className is appended to the same class string — a `px-9` there would
// collide with the base `px-7` and the winner would come down to Tailwind's
// internal utility ordering, not the order written. Swapping the whole set keeps
// it unambiguous.
const sizeClasses: Record<Size, string> = {
  default: "gap-3 px-7 py-3.5 text-[11px]",
  // Only the Join hero uses this, so it's tuned as that page's single primary
  // CTA rather than as a general "one step up" from default.
  large: "gap-5 px-12 py-5 text-[15px]",
};

export default function EditorialButton({
  href,
  variant = "solid",
  size = "default",
  external = false,
  children,
  className = "",
}: EditorialButtonProps) {
  const classes = `group inline-flex items-center font-medium uppercase tracking-[0.18em] transition-colors duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  const inner = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-150 motion-reduce:transition-none group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
