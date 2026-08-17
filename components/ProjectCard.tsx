"use client";

import { useState } from "react";
import Image from "next/image";
import ProjectModal from "@/components/ProjectModal";
<<<<<<< Updated upstream
import { firstSentence, getProjectAccentColor, type Project } from "@/lib/content";
=======
import type { Project } from "@/lib/content";
import { getLogoTint } from "@/lib/logoTint";
>>>>>>> Stashed changes

interface ProjectCardProps {
  project: Project;
  /** Position in the row — picks the fallback tint (see PALETTE). */
  index?: number;
}

/**
<<<<<<< Updated upstream
 * A soft color-tinted tile rather than a white card on a white page — that
 * flat fill (not a border, not a shadow) is what was making these read as
 * bland. The tint is the partner's own brand color when we know it (see
 * `getProjectAccentColor`), so each card carries a bit of that company's
 * identity rather than every card looking identical; unknown partners fall
 * back to the site's own teal. It's a radial wash anchored above the card
 * (`at 50% -15%`) rather than a flat fill, kept nearly transparent right
 * where the logo sits and only building up color toward the edges — so a
 * partner whose own logo is close in hue to their brand color (e.g. a yellow
 * mark on a yellow tint) never loses contrast against its own card.
 *
 * Deliberately rounded (`rounded-3xl`) — a scoped, intentional break from the
 * site's square-corner editorial system, reserved for this component because
 * it's meant to read like a company showcase, not another editorial block.
 * The whole face is one button (not a small link at the bottom) so the card
 * itself invites the click.
 */
export default function ProjectCard({ project }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hook = firstSentence(project.description);
  const name = project.partner || project.title;
  const accent = getProjectAccentColor(project) ?? "var(--color-primary)";

  return (
    <>
      <button
        type="button"
        id={project.id}
        onClick={() => setIsOpen(true)}
        aria-label={`Read more about the ${name} project`}
        style={{
          background: `radial-gradient(130% 140% at 50% -15%, transparent 0%, color-mix(in srgb, ${accent} 16%, transparent) 55%, color-mix(in srgb, ${accent} 30%, transparent) 100%)`,
        }}
        className="group flex h-full w-full scroll-mt-28 flex-col items-center gap-5 rounded-3xl p-8 text-center transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        {/* DeCal projects lead with a screenshot instead of a client logo — they
            have no partner, so the logo slot would otherwise sit empty. Bleeds
            to the card's top edge (the `-m*-8` cancel the `p-8` above) and keeps
            the card's own top rounding. `object-contain` on a plain surface,
            not `object-cover`: these are charts and model outputs, and cropping
            one to fill the frame cuts off the part that carries the meaning. */}
        {project.coverImage ? (
          <div className="relative -mx-8 -mt-8 aspect-[16/9] self-stretch overflow-hidden rounded-t-3xl bg-surface">
            <Image
              src={project.coverImage}
              alt={project.coverImageAlt ?? ""}
              fill
              sizes="(min-width: 640px) 340px, 300px"
              className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        ) : (
          <div className="relative mt-2 h-16 w-full max-w-[170px]">
            {project.logo ? (
              <Image
                src={project.logo}
                alt=""
                fill
                sizes="170px"
                className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
                <span className="text-2xl font-semibold tracking-tight text-primary/40">
                  {name.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-1 flex-col items-center justify-center">
          {/* The one-sentence hook — the rest of the write-up lives behind "Read more".
              No name/semester line here: the logo above already says who this is. */}
          <p className="max-w-[28ch] text-sm leading-relaxed text-muted line-clamp-2">
            {hook}
          </p>
        </div>

        <span className="mt-auto flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
          Read more
          <span
            aria-hidden="true"
            className="transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </span>
      </button>
=======
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

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const name = project.partner || project.title;

  // Derived colour wins when we have one; otherwise the token palette. The two
  // are applied through different channels (inline style vs. Tailwind class),
  // so each band takes exactly one of them.
  const logoTint = getLogoTint(project.logoPalette);
  const fallback = PALETTE[index % PALETTE.length];

  // The short hook, not the full write-up — that's what "See more" is for.
  // Falls back to the summary for projects with no One-liner recorded yet.
  const hook = project.oneLiner ?? project.description;

  return (
    <article
      id={project.id}
      className="group scroll-mt-28 flex h-full min-h-[520px] flex-col overflow-hidden rounded-2xl shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
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
        {project.logo ? (
          <Image
            src={project.logo}
            alt={`${name} logo`}
            fill
            sizes="340px"
            className="object-contain p-8 transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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
          className="mt-auto flex items-center gap-2 self-start pt-5 text-[15px] font-semibold text-primary transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
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
>>>>>>> Stashed changes

      {isOpen && <ProjectModal project={project} onClose={() => setIsOpen(false)} />}
    </>
  );
}
