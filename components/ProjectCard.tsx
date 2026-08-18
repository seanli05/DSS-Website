"use client";

import { useState } from "react";
import Image from "next/image";
import ProjectModal from "@/components/ProjectModal";
import type { Project } from "@/lib/content";
import { getLogoTint } from "@/lib/logoTint";

interface ProjectCardProps {
  project: Project;
  /** Position in the row — picks the fallback tint (see PALETTE). */
  index?: number;
  /** Render every card in the single brand tint instead of cycling PALETTE.
   *  Used by the DeCal portfolio, where the cards are student work with no
   *  client brand to echo, so a rotating palette added colour without meaning. */
  uniformTint?: boolean;
}

/**
 * Two-band card: a large logo panel on top, a colour-tinted body underneath.
 *
 * The colour is derived from the partner's own logo when Airtable's "Logo
 * Color Palette" column is filled in — see `lib/logoTint.ts`, which mutes it
 * to a fixed tone so every card lands in the same tonal family no matter how
 * loud the source brand is. This FALLBACK palette covers the rest: partners
 * with no palette recorded, and logos that are pure greyscale and so have no
 * hue to borrow. It cycles down the row so those cards still read as colour
 * blocks rather than a grid of identical white boxes — the same trick the
 * Partners page uses for its offering cards — and, being tokens from
 * `globals.css`, it's always on-brand.
 *
 * Mirrors the Social Good committee page's card exactly (see
 * `app/committees/social-good/LegacyProjectCard.tsx`) so every committee's
 * project showcase reads as one consistent system.
 */
const PALETTE = [
  { panel: "bg-primary/[0.045]", body: "bg-primary/[0.11]", mark: "text-primary" },
  { panel: "bg-accent/[0.08]", body: "bg-accent/[0.20]", mark: "text-accent-ink" },
  { panel: "bg-cream", body: "bg-cream-deep", mark: "text-primary" },
] as const;

/** The single tint used when `uniformTint` is set — a neutral light grey, drawn
 *  from --color-ink at low alpha the same way the teal entry above is drawn from
 *  --color-primary. Deliberately NOT a member of PALETTE: it's a separate
 *  decision from the cycling row, so reordering that list can't silently
 *  repaint the DeCal cards. */
const UNIFORM_TINT = {
  panel: "bg-ink/[0.03]",
  body: "bg-ink/[0.06]",
  mark: "text-primary",
} as const;

export default function ProjectCard({
  project,
  index = 0,
  uniformTint = false,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const name = project.partner || project.title;

  // Derived colour wins when we have one; otherwise the token palette. The two
  // are applied through different channels (inline style vs. Tailwind class),
  // so each band takes exactly one of them.
  //
  // `uniformTint` opts out of both: it pins every card to one neutral grey, so a
  // row reads as one set. It suppresses the derived tint too, not just the cycling
  // fallback — otherwise a single project that happened to have a logo palette
  // would break the run of colour it exists to create.
  const logoTint = uniformTint ? null : getLogoTint(project.logoPalette);
  const fallback = uniformTint ? UNIFORM_TINT : PALETTE[index % PALETTE.length];

  // The short hook, not the full write-up — that's what "See more" is for.
  // Falls back to the summary for projects with no One-liner recorded yet.
  const hook = project.oneLiner ?? project.description;

  return (
    <article
      id={project.id}
      /* A small lift on hover. Deliberately no `group` here: the "See more"
         button owns that, so its arrow responds to the button rather than to
         anywhere on the card. */
      className="scroll-mt-28 flex h-full min-h-[520px] flex-col overflow-hidden rounded-2xl shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Logo panel — flex-[1.15] against the body's flex-1 puts the split just
          past halfway, so the mark is the card's headline rather than a badge.
          min-h keeps that true if a description ever runs long enough to push
          the body past its share. */}
      <div
        style={logoTint ? { backgroundColor: logoTint.panel } : undefined}
        className={`relative flex flex-[1.15] min-h-[180px] items-center justify-center p-8 ${
          logoTint ? "" : fallback.panel
        }`}
      >
        {project.coverImage ? (
          /* DeCal projects lead with a screenshot instead of a client logo — they
             have no partner, so the logo slot would otherwise sit empty.
             `inset-0`, not `-inset-8`: an absolutely positioned child is laid out
             against the panel's padding box, so inset-0 already fills it edge to
             edge despite the `p-8`. Negative insets overshoot the panel and let a
             tall image paint down over the title below.
             `object-contain`, not `object-cover`: these are charts and model
             outputs, and cropping one to fill the frame cuts off the part that
             carries the meaning. */
          <div className="absolute inset-0">
            <Image
              src={project.coverImage}
              alt={project.coverImageAlt ?? ""}
              fill
              sizes="(min-width: 640px) 340px, 300px"
              className="object-contain"
            />
          </div>
        ) : project.logo ? (
          <Image
            src={project.logo}
            alt={`${name} logo`}
            fill
            sizes="340px"
            className="object-contain p-8"
          />
        ) : (
          /* No logo yet — a large monogram keeps the panel deliberate rather
             than looking broken. */
          <span
            aria-hidden="true"
            style={logoTint ? { color: logoTint.monogram } : undefined}
            className={`font-mono text-5xl tracking-tight ${
              logoTint ? "opacity-70" : `opacity-30 ${fallback.mark}`
            }`}
          >
            {name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Always light, even when the panel above went dark for a white logo —
          so ink/muted text is correct on every card and never needs inverting. */}
      <div
        style={logoTint ? { backgroundColor: logoTint.body } : undefined}
        className={`flex flex-1 flex-col gap-2.5 p-7 ${logoTint ? "" : fallback.body}`}
      >
        {/* Both of these are optional in the data — a project still awaiting its
            write-up should collapse cleanly, not leave a blank band. */}
        {/* Still the site's monospace eyebrow, but a size up and with the
            tracking eased off — at 11px/0.18em it read like a spec label. */}
        {project.semester && (
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted">
            {project.semester}
          </span>
        )}

        {/* The partner's name still leads. The logo above says it visually, but
            it's missing on some projects — and it's never text a screen
            reader reaches, since the panel's mark is decorative. */}
        <h3 className="text-xl font-semibold leading-snug tracking-tight text-ink">
          {name}
        </h3>

        {/* Clamped to 3 lines; the full write-up, tags, and any external link
            all live in the popup. */}
        {/* ink/85 rather than the usual `text-muted`: on these pale tints muted
            grey-green sits at ~5:1 and reads washed out at this size. Held just
            off full ink so the heading above still leads. */}
        {hook && (
          <p className="line-clamp-3 text-[15px] leading-[1.6] text-ink/85">{hook}</p>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={`See more about the ${name} project`}
          /* Sentence case, not an uppercase tracked-out label — that styling
             is right for section eyebrows and cold on a call to action. */
          className="group mt-auto flex items-center gap-2 self-start pt-5 text-[15px] font-semibold text-primary transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
        >
          See more
          <span
            aria-hidden="true"
            className="transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </button>
      </div>

      {isOpen && <ProjectModal project={project} onClose={() => setIsOpen(false)} />}
    </article>
  );
}
