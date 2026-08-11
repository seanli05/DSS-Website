/**
 * Fills a photo frame that has no image yet: corner-to-corner hairlines behind a
 * centered label, so an empty slot reads as deliberate rather than as a failed
 * image load.
 *
 * Absolutely positioned — the caller owns the frame, its border, and its shape.
 * The cross is an SVG rather than rotated divs so it hits the corners exactly at
 * any size, and `preserveAspectRatio="none"` lets the same viewBox stretch to fit
 * whatever aspect the caller uses (2:3 beside the copy, 4:3 in an activity tile).
 */
export default function PhotoPlaceholder({ label = "Photo to come" }: { label?: string }) {
  return (
    <>
      <svg
        className="absolute inset-0 h-full w-full text-border"
        viewBox="0 0 2 3"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 0 L2 3 M2 0 L0 3"
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <p className="absolute inset-0 flex items-center justify-center">
        <span className="bg-surface px-3 py-1 text-center text-[11px] uppercase tracking-[0.18em] text-muted">
          {label}
        </span>
      </p>
    </>
  );
}
