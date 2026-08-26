import RevealOnScroll from "./RevealOnScroll";
import { stripTodo, type InterviewResource } from "@/lib/content";

interface InterviewResourcesProps {
  resources: InterviewResource[];
}

// Kept as plain strings rather than a shared theme module, per CLAUDE.md rule 8.
//
// Same card language as CommitteeCard — hairline border, white field, a lift on
// hover — since these are also whole-card links, just to somewhere off-site.
const CARD =
  "group flex h-full flex-col border border-border bg-bg p-6 shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/**
 * "Interview resources" on the Join page — a short list of things to read before
 * a technical interview, each an external link.
 *
 * One column on phones, two from `sm` up. A resource can carry a `topics` list
 * (the Data 100 notes name the specific chapters); one that doesn't just skips
 * the list, so adding a plain link is two JSON fields and nothing else.
 *
 * The whole card is the anchor rather than a "read more" link at the bottom:
 * there is only one destination per card, so anything else would be a second
 * target for the same place.
 */
export default function InterviewResources({ resources }: InterviewResourcesProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {resources.map((resource, i) => (
        <RevealOnScroll key={resource.id} delayMs={i * 80}>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className={CARD}
          >
            <h3 className="text-xl font-bold tracking-tight text-ink">
              {resource.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {stripTodo(resource.blurb)}
            </p>

            {resource.topics.length > 0 && (
              <ul className="mt-4 flex flex-col gap-1.5">
                {resource.topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex gap-2.5 text-sm leading-relaxed text-ink"
                  >
                    <span className="text-primary" aria-hidden="true">
                      —
                    </span>
                    {topic}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-primary">
              {resource.linkLabel}
              <span className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
                →
              </span>
            </div>
          </a>
        </RevealOnScroll>
      ))}
    </div>
  );
}
