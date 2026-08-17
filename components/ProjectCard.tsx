"use client";

import { useState } from "react";
import Image from "next/image";
import ProjectModal from "@/components/ProjectModal";
import { firstSentence, getProjectAccentColor, type Project } from "@/lib/content";

interface ProjectCardProps {
  project: Project;
}

/**
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

      {isOpen && <ProjectModal project={project} onClose={() => setIsOpen(false)} />}
    </>
  );
}
