import Image from "next/image";
import PhotoPlaceholder from "./PhotoPlaceholder";

interface CommitteePhotoProps {
  /** Path under /public. When null, renders the "photo to come" placeholder frame. */
  src: string | null;
  alt: string | null;
  /** Small caption under the frame, e.g. "Social Good, Spring 2026". */
  caption: string | null;
  /** Figure number shown before the caption — "02" renders as "Fig. 02 — …". */
  figure: string;
  className?: string;
}

/**
 * The vertical photo that sits beside a committee's "What we do" copy.
 *
 * Same treatment as the About page's Fig. 01: a hairline-bordered frame, a slow
 * zoom on hover, and a small tracked caption underneath — which is what makes it
 * read as editorial rather than a stock photo dropped into a column. Portrait 2:3
 * to match what the club actually shoots, so nothing gets cropped.
 *
 * Committees without a photo yet get a bordered placeholder of the same shape, so
 * the layout is already correct and going live is one file plus one JSON field.
 */
export default function CommitteePhoto({
  src,
  alt,
  caption,
  figure,
  className = "",
}: CommitteePhotoProps) {
  return (
    /* No `h-full` anywhere: a percentage height on a grid item whose row is sized
       from its own content is circular, and engines resolve it differently — it can
       overflow into the next section in one browser and look fine in another. The
       grid item is already stretched to the row by `items-stretch`, which gives it a
       definite height, so plain `flex-1` fills it and can never exceed it. */
    <figure className={`flex flex-col lg:flex-1 ${className}`}>
      {/* While stacked the frame keeps its own 2:3 shape. From lg up — where it sits
          beside the copy — it grows to fill the row instead, so its bottom edge lands
          level with the copy; the image crops to suit. min-h keeps the frame sensible
          for committees whose copy is short (focus-area chips only, which would
          otherwise collapse it to the height of a single chip row).

          The aspect ratio is scoped with `max-lg:` rather than set unconditionally and
          overridden by `lg:aspect-auto`. At lg there is then no aspect-ratio property
          at all, so nothing can leave the frame sized from its width and overflowing
          the row if the override doesn't win. */}
      <div className="group relative w-full overflow-hidden border border-border bg-surface max-lg:aspect-[2/3] lg:min-h-[30rem] lg:flex-1">
        {src ? (
          <Image
            src={src}
            alt={alt ?? ""}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <PhotoPlaceholder />
        )}
      </div>
      {caption && (
        <figcaption className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted">
          Fig. {figure} — {caption}
        </figcaption>
      )}
    </figure>
  );
}
