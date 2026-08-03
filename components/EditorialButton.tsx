import Link from "next/link";
import { type ReactNode } from "react";

type Variant = "solid" | "outline";

interface EditorialButtonProps {
  href: string;
  variant?: Variant;
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
};

export default function EditorialButton({
  href,
  variant = "solid",
  children,
  className = "",
}: EditorialButtonProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] ${variantClasses[variant]} ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-150 motion-reduce:transition-none group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
