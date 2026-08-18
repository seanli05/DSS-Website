"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CommitteeWorkImage } from "@/lib/content";
import PhotoPlaceholder from "./PhotoPlaceholder";

interface CommitteePhotoProps {
  /** Path under /public. When null, renders the "photo to come" placeholder frame. */
  src: string | null;
  alt: string | null;
  /** Small caption under the frame, e.g. "Social Good, Spring 2026". */
  caption: string | null;
  /** Optional carousel slides. When present, these replace the legacy single image. */
  images?: CommitteeWorkImage[] | null;
  /** Figure number shown before the caption — "02" renders as "Fig. 02 — …". */
  figure: string;
  /** The club mostly shoots vertical 2:3 photos for this slot (the default:
   *  the frame stretches to match the copy column's height, cropping to
   *  suit). Set this for a committee whose (single, non-carousel) photo is
   *  actually landscape — the frame becomes a fixed 3:2 box sized from its
   *  own width instead of the row, so a landscape shot needs no cropping and
   *  isn't stretched tall. Pair with `lg:items-center` on the parent grid so
   *  the (now shorter) photo centers against the copy instead of hugging its
   *  top. Ignored when `images` makes this a carousel, which always uses its
   *  own fixed 4:3 box. */
  landscape?: boolean;
  className?: string;
}

/**
 * The photo frame that sits beside a committee's "What we do" copy.
 *
 * Same treatment as the About page's Fig. 01: a hairline-bordered frame, a slow
 * zoom on hover, and a small tracked caption underneath — which is what makes it
 * read as editorial rather than a stock photo dropped into a column. A legacy
 * single photo keeps the portrait treatment (or `landscape`'s 3:2 box); multi-photo
 * sets use a 4:3 carousel.
 *
 * Committees without a photo yet get a bordered placeholder of the same shape, so
 * the layout is already correct and going live is one file plus one JSON field.
 */
export default function CommitteePhoto({
  src,
  alt,
  caption,
  images,
  figure,
  landscape = false,
  className = "",
}: CommitteePhotoProps) {
  const photos: CommitteeWorkImage[] =
    images && images.length > 0
      ? images
      : src
        ? [{ src, alt: alt ?? "", caption }]
        : [];
  const isCarousel = photos.length > 1;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isCarousel || paused) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    const syncAutoplay = () => {
      if (timer) window.clearInterval(timer);
      timer = media.matches
        ? undefined
        : window.setInterval(
            () => setCurrent((index) => (index + 1) % photos.length),
            4000,
          );
    };
    syncAutoplay();
    media.addEventListener("change", syncAutoplay);
    return () => {
      if (timer) window.clearInterval(timer);
      media.removeEventListener("change", syncAutoplay);
    };
  }, [isCarousel, paused, photos.length]);

  const move = (direction: 1 | -1) => {
    setCurrent((index) => (index + direction + photos.length) % photos.length);
  };

  const activeCaption = photos[current]?.caption ?? caption;
  const startingFigure = Number.parseInt(figure, 10);
  const activeFigure =
    isCarousel && Number.isFinite(startingFigure)
      ? String(startingFigure + current).padStart(2, "0")
      : figure;

  return (
    /* No `h-full` anywhere: a percentage height on a grid item whose row is sized
       from its own content is circular, and engines resolve it differently — it can
       overflow into the next section in one browser and look fine in another. The
       grid item is already stretched to the row by `items-stretch`, which gives it a
       definite height, so plain `flex-1` fills it and can never exceed it. Skipped
       for `isCarousel` (self-centers instead) and `landscape` (sizes itself). */
    <figure
      className={`flex flex-col ${
        isCarousel ? "lg:justify-center" : landscape ? "" : "lg:flex-1"
      } ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      {/* While stacked the frame keeps its own 2:3 shape. From lg up — where it sits
          beside the copy — it grows to fill the row instead, so its bottom edge lands
          level with the copy; the image crops to suit. min-h keeps the frame sensible
          for committees whose copy is short (focus-area chips only, which would
          otherwise collapse it to the height of a single chip row).

          The aspect ratio is scoped with `max-lg:` rather than set unconditionally and
          overridden by `lg:aspect-auto`. At lg there is then no aspect-ratio property
          at all, so nothing can leave the frame sized from its width and overflowing
          the row if the override doesn't win.

          `isCarousel` and `landscape` each replace all of that with one fixed box at
          every size — 4:3 for a carousel (room for varied source photos without
          cropping any one of them too hard), 3:2 for `landscape` (matches a single
          wide group shot exactly, so `object-cover` never has anything to crop). */}
      <div
        className={`relative w-full overflow-hidden border border-border bg-surface ${
          isCarousel
            ? "aspect-[4/3]"
            : landscape
              ? "aspect-[3/2]"
              : "max-lg:aspect-[2/3] lg:min-h-[30rem] lg:flex-1"
        }`}
        role={isCarousel ? "region" : undefined}
        aria-roledescription={isCarousel ? "carousel" : undefined}
        aria-label={isCarousel ? "Committee photos" : undefined}
        tabIndex={isCarousel ? 0 : undefined}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const distance = event.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(distance) > 50) move(distance < 0 ? 1 : -1);
          touchStartX.current = null;
        }}
      >
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <div
              key={photo.src}
              className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
                index === current ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={index !== current}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 384px, 100vw"
                className={isCarousel ? "object-contain" : "object-cover"}
              />
            </div>
          ))
        ) : (
          <PhotoPlaceholder />
        )}

        {isCarousel && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous committee photo"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-ink/55 text-white backdrop-blur-sm transition-colors hover:bg-ink/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next committee photo"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-ink/55 text-white backdrop-blur-sm transition-colors hover:bg-ink/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span aria-hidden="true">→</span>
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-ink/55 px-3 py-2 backdrop-blur-sm">
              {photos.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Show committee photo ${index + 1}`}
                  aria-current={index === current ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all ${
                    index === current ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {activeCaption && (
        <figcaption className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted">
          Fig. {activeFigure} — {activeCaption}
        </figcaption>
      )}
    </figure>
  );
}
