import Image from "next/image";
import PhotoPlaceholder from "./PhotoPlaceholder";
import RevealOnScroll from "./RevealOnScroll";
import { stripTodo, type NewbieExperiencePillar } from "@/lib/content";

// Kept as plain strings rather than a shared theme module, per CLAUDE.md rule 8.
//
// No hover state: these tiles are read-only, so a lift and a brand border
// advertised a click target that doesn't exist.
//
// A shadow rather than a hairline border holds the tile against the page.
// --shadow-card is offset-free (0 0 20px), so it reads as an even halo on all
// four edges rather than a drop shadow with a light source — which is what lets
// it replace a border cleanly instead of looking like a card that's floating.
const TILE = "flex h-full flex-col overflow-hidden bg-bg shadow-card";
const TILE_IMAGE_ZOOM = "object-cover";

interface NewbieExperienceProps {
  pillars: NewbieExperiencePillar[];
}

/**
 * "The Newbie Experience" — the four things a first-semester member gets, each a
 * landscape photo over a numbered title and a short paragraph.
 *
 * The photo frame is 5:3 rather than the 4:3 CommitteeActivities uses: these
 * tiles are half the container wide (two columns, not three), so 4:3 came out
 * ~390px tall and the photo swamped the copy under it.
 *
 * 2×2 from `sm` up, stacked on phones — the same grid the section used before it
 * gained photos.
 *
 * Deliberately no `auto-rows-fr`. Grid already stretches items to their row's
 * height, so the two photos in a row stay level whatever their paragraphs do;
 * `auto-rows-fr` additionally forces every row to match the tallest one, which
 * only padded the shorter row with dead space under its copy.
 *
 * Pillars without a photo yet render the shared placeholder frame, so the layout
 * is already correct and going live is one image plus two JSON fields.
 *
 * The caption block is tighter than the `p-6` CommitteeActivities uses. Those
 * tiles are a third of the container wide; at half the width the same padding
 * reads as a lot of dead space around three short lines.
 */
export default function NewbieExperience({ pillars }: NewbieExperienceProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {pillars.map((pillar, i) => (
        <RevealOnScroll key={pillar.id} delayMs={i * 80}>
          <article className={TILE}>
            <div className="relative aspect-[5/3] w-full overflow-hidden bg-surface">
              {pillar.image ? (
                <Image
                  src={pillar.image}
                  alt={pillar.imageAlt ?? ""}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className={TILE_IMAGE_ZOOM}
                />
              ) : (
                <PhotoPlaceholder />
              )}
            </div>
            <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
              <span className="text-[11px] uppercase tracking-[0.18em] text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-ink">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {stripTodo(pillar.body)}
              </p>
            </div>
          </article>
        </RevealOnScroll>
      ))}
    </div>
  );
}
