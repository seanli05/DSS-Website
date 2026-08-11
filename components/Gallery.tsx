import Image from "next/image";
import type { CommunityPhoto } from "@/lib/content";

interface GalleryProps {
  photos: CommunityPhoto[];
}

// Each tile is a 288px slot plus the 20px flex gap.
const SLOT_PX = 308;
// 6.5s per slot ≈ 47px/s — deliberately calmer than LogoCarousel's ~80px/s,
// which reads as restless at photo size.
const SECONDS_PER_TILE = 6.5;
// Each half of the track must out-measure any viewport, or the seam scrolls
// into frame. 16 slots ≈ 4930px, safely past 4K.
const MIN_SLOTS_PER_HALF = 16;

/**
 * One infinitely looping row.
 *
 * Same technique as LogoCarousel: the track holds two identical halves and
 * animates translateX(0 → -50%), so the second half lands exactly where the
 * first began and the loop point is invisible. Pure CSS — no scroll handlers,
 * no requestAnimationFrame.
 *
 * `reverse` flips the row's travel direction. Both the duration and direction
 * are set inline because `animate-marquee` is an `animation` shorthand: an
 * inline longhand overrides it, a utility class would not.
 */
function Row({ photos, reverse = false }: { photos: CommunityPhoto[]; reverse?: boolean }) {
  const reps = Math.max(1, Math.ceil(MIN_SLOTS_PER_HALF / photos.length));
  const half = Array.from({ length: reps }, () => photos).flat();
  const seconds = half.length * SECONDS_PER_TILE;

  const tiles = (
    <div className="flex gap-5 pr-5">
      {half.map((photo, i) => (
        <div
          key={`${photo.id}-${i}`}
          data-gallery-tile
          className="relative h-52 w-72 flex-none overflow-hidden border border-border"
        >
          <Image
            src={photo.src}
            alt="" // decorative: the whole strip is aria-hidden
            fill
            sizes="288px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className="marquee-mask pointer-events-none relative select-none overflow-clip"
    >
      <div
        data-marquee-track
        className="flex w-max will-change-transform animate-marquee motion-reduce:animate-none"
        style={{
          animationDuration: `${seconds}s`,
          ...(reverse ? { animationDirection: "reverse" as const } : {}),
        }}
      >
        {tiles}
        {tiles}
      </div>
    </div>
  );
}

/**
 * "Moments from the year" — two decorative rows drifting in opposite
 * directions. Purely ambient: nothing to click, nothing to scroll.
 */
export default function Gallery({ photos }: GalleryProps) {
  if (photos.length === 0) return null;

  // Photos arrive grouped by category, so alternate rather than splitting down
  // the middle — that way both rows carry a spread of all the categories
  // instead of one row being entirely Big Little and House.
  const topRow = photos.filter((_, i) => i % 2 === 0);
  const bottomRow = photos.filter((_, i) => i % 2 === 1);

  return (
    <div className="flex flex-col gap-5">
      <Row photos={topRow} />
      <Row photos={bottomRow.length > 0 ? bottomRow : topRow} reverse />
    </div>
  );
}
