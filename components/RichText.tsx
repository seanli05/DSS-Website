import { Fragment } from "react";
import { isExternal } from "@/lib/site";

interface RichTextProps {
  /** Copy from a content JSON file. Supports **bold** and [link text](https://…). */
  text: string;
  /** Classes for **bold** phrases. The default is a dark grey that stands out from muted body copy. */
  strongClassName?: string;
  linkClassName?: string;
}

const DEFAULT_STRONG = "font-semibold text-ink/80";
const DEFAULT_LINK =
  "font-medium text-primary underline underline-offset-2 transition-colors duration-150 hover:text-primary-bright";

// Matches **bold** or [label](href), in that order of preference.
const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * Renders a string of copy with two bits of formatting, so text in content/
 * can bold a phrase or link a word without anyone touching JSX:
 *
 *   "We table at **Dwinelle** — see the [DeCal slides](https://dssdecal.org/)."
 *
 * Returns inline content only; wrap it in the <p>/<h2> it belongs in.
 */
export default function RichText({
  text,
  strongClassName = DEFAULT_STRONG,
  linkClassName = DEFAULT_LINK,
}: RichTextProps) {
  const parts: React.ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));

    const [, bold, label, href] = match;
    if (bold !== undefined) {
      parts.push(
        <strong key={index} className={strongClassName}>
          {bold}
        </strong>
      );
    } else {
      parts.push(
        <a
          key={index}
          href={href}
          className={linkClassName}
          {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {label}
        </a>
      );
    }
    last = index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return <Fragment>{parts}</Fragment>;
}
