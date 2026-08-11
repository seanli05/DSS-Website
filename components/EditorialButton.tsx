import Link from "next/link";
import { type ReactNode } from "react";

type Variant = "solid" | "outline" | "inverse";

interface EditorialButtonProps {
  href: string;
  variant?: Variant;
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

export default function EditorialButton({
  href,
  variant = "solid",
  external = false,
  children,
  className = "",
}: EditorialButtonProps) {
  const classes = `group inline-flex items-center gap-3 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] ${variantClasses[variant]} ${className}`;

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
