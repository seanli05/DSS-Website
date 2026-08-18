"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Project } from "@/lib/content";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const TRANSITION_MS = 200;

/** Animated GIFs are converted to H.264 by scripts/mirror-airtable.mjs — the one
 *  format next/image won't compress, and a 10 MB download for anyone who opens
 *  the modal. Officers still upload GIFs to Airtable; only the served file
 *  differs, so this checks the extension rather than anything in the data. */
const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src);

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [imageIndex, setImageIndex] = useState(0);
  // A looping clip is motion the visitor didn't ask for. Under
  // prefers-reduced-motion it gets controls and stays paused instead, which is
  // strictly better than the GIF it replaces — that could never be stopped.
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  // Starts false so the first paint is the "hidden" state, then flips to true
  // a frame later — that's what makes the enter transition actually animate
  // instead of snapping straight to its final state.
  const [visible, setVisible] = useState(false);
  const monogramSource = project.partner || project.title;
  const monogram = monogramSource
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const requestClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, TRANSITION_MS);
  }, [onClose]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [requestClose]);

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 transition-opacity motion-reduce:transition-none duration-200 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative max-h-[85vh] w-full max-w-2xl overflow-y-auto bg-bg p-8 shadow-card transition-[opacity,transform] motion-reduce:transition-none duration-200 ease-out ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-3"
        }`}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={requestClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-primary hover:text-primary"
        >
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </button>

        {/* DeCal projects lead with a visual; client projects retain logo + semester. */}
        {project.coverImage ? (
          <div className="relative mr-12 aspect-[16/9] overflow-hidden border border-border bg-surface">
            <Image
              src={project.coverImage}
              alt={project.coverImageAlt ?? ""}
              fill
              sizes="(min-width: 768px) 576px, calc(100vw - 7rem)"
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 pr-12">
            {project.logo ? (
              <Image
                src={project.logo}
                alt={`${project.partner} logo`}
                width={220}
                height={88}
                className="h-16 w-auto max-w-[50%] object-contain object-left"
              />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center border border-border bg-surface font-mono text-base text-muted"
                aria-hidden="true"
              >
                {monogram}
              </div>
            )}
            <span className="font-mono text-xs text-muted">{project.semester}</span>
          </div>
        )}

        {/* Title + partner */}
        <div className="mt-5">
          <h2 id={titleId} className="text-2xl font-bold text-ink leading-snug">
            {project.title}
          </h2>
          {project.partner && <p className="mt-1 text-sm text-muted">{project.partner}</p>}
        </div>

        {/* Full description */}
        <p className="mt-4 text-sm text-muted leading-relaxed">{project.description}</p>

        {/* Image / gif mini carousel */}
        {project.images.length > 0 && (
          <div className="mt-6 flex flex-col gap-2">
            <div className="relative overflow-hidden border border-border bg-surface">
              {isVideo(project.images[imageIndex]) ? (
                /* No `alt` on <video> — the accessible name comes from
                   aria-label. Muted + playsInline are what let it autoplay at
                   all on iOS; without them Safari blocks it silently. */
                <video
                  key={project.images[imageIndex]}
                  src={project.images[imageIndex]}
                  aria-label={`${project.title} — clip ${imageIndex + 1} of ${project.images.length}`}
                  autoPlay={!reducedMotion}
                  loop
                  muted
                  playsInline
                  controls={reducedMotion}
                  className="h-64 w-full object-contain"
                />
              ) : (
                <Image
                  src={project.images[imageIndex]}
                  alt={`${project.title} — image ${imageIndex + 1} of ${project.images.length}`}
                  width={640}
                  height={400}
                  unoptimized
                  className="h-64 w-full object-contain"
                />
              )}
              {project.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setImageIndex((i) => (i - 1 + project.images.length) % project.images.length)
                    }
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/90 text-ink transition-colors hover:border-primary hover:text-primary"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M8 2L4 6l4 4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageIndex((i) => (i + 1) % project.images.length)}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/90 text-ink transition-colors hover:border-primary hover:text-primary"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M4 2l4 4-4 4" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            {project.images.length > 1 && (
              <div className="flex justify-center gap-1.5">
                {project.images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${i === imageIndex ? "bg-primary" : "bg-border"}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Optional link */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline underline-offset-2"
          >
            View project →
          </a>
        )}
      </div>
    </div>,
    document.body
  );
}
