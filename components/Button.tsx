import Link from "next/link";
import { type ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:opacity-90 focus-visible:ring-primary",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-white focus-visible:ring-primary",
  ghost:
    "text-primary hover:bg-primary/10 focus-visible:ring-primary",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-5 py-2 text-sm",
  lg: "px-7 py-3 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

export default function Button({
  variant = "primary",
  size = "md",
  href,
  external = false,
  disabled,
  className = "",
  children,
  onClick,
}: ButtonProps) {
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
