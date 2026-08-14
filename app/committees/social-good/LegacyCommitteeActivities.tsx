import Image from "next/image";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import RevealOnScroll from "@/components/RevealOnScroll";
import { stripTodo, type CommitteeActivity } from "@/lib/content";

// Tile treatment lifted from the About page's tradition grid: the tile lifts and
// picks up the brand border, and `group` lets the photo inside slow-zoom. Kept as
// plain strings rather than a shared theme module, per CLAUDE.md rule 8.
const TILE =
  "group flex h-full flex-col overflow-hidden border border-border bg-bg transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-card motion-reduce:transition-none motion-reduce:hover:translate-y-0";
const TILE_IMAGE_ZOOM =
  "object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100";

interface LegacyCommitteeActivitiesProps {
  activities: CommitteeActivity[];
}

/**
 * A frozen copy of `components/CommitteeActivities.tsx` as it stood before
 * the numbered badge was swapped for a gradient circle — see the note in
 * `./LegacySection.tsx` for why this duplicate exists.
 */
export default function LegacyCommitteeActivities({ activities }: LegacyCommitteeActivitiesProps) {
  return (
    <div className="grid gap-6 sm:auto-rows-fr sm:grid-cols-3">
      {activities.map((activity, i) => (
        <RevealOnScroll key={activity.id} delayMs={i * 80}>
          <article className={TILE}>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
              {activity.image ? (
                <Image
                  src={activity.image}
                  alt={activity.imageAlt ?? ""}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className={TILE_IMAGE_ZOOM}
                />
              ) : (
                <PhotoPlaceholder />
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span className="text-[11px] uppercase tracking-[0.18em] text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">
                {activity.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {stripTodo(activity.body)}
              </p>
            </div>
          </article>
        </RevealOnScroll>
      ))}
    </div>
  );
}
