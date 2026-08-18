import Image from "next/image";
import PhotoPlaceholder from "./PhotoPlaceholder";
import RevealOnScroll from "./RevealOnScroll";
import { stripTodo, type CommitteeActivity } from "@/lib/content";

// Tile treatment lifted from the About page's tradition grid: the tile lifts and
// picks up the brand border, and `group` lets the photo inside slow-zoom. Kept as
// plain strings rather than a shared theme module, per CLAUDE.md rule 8.
// No hover state: these tiles are read-only, so a lift and a brand border
// advertised a click target that doesn't exist.
const TILE =
  "flex h-full flex-col overflow-hidden border border-border bg-bg";
const TILE_IMAGE_ZOOM = "object-cover";

interface CommitteeActivitiesProps {
  activities: CommitteeActivity[];
}

/**
 * The "How we spend our time" tiles — three across, each a landscape photo over a
 * numbered title and a short description.
 *
 * `sm:auto-rows-fr` is load-bearing: it holds all three tiles to the same height
 * when their descriptions differ in length, which is what keeps the row of photos
 * on one line rather than stepping.
 *
 * Activities without a photo yet render the shared placeholder frame, so the
 * layout is already right and going live is one image plus two JSON fields.
 */
export default function CommitteeActivities({ activities }: CommitteeActivitiesProps) {
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
              <span className="surface-green-gradient ring-primary/10 flex h-9 w-9 items-center justify-center rounded-full font-mono text-[11px] font-semibold text-white ring-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">
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
