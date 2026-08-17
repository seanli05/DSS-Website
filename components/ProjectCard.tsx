"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import ProjectModal from "@/components/ProjectModal";
import type { Project } from "@/lib/content";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const monogramSource = project.partner || project.title;
  const monogram = monogramSource
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <article
      id={project.id}
      className="scroll-mt-28 flex h-full min-h-[420px] flex-col gap-3 bg-bg p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200 motion-reduce:transition-none"
    >
      {/* DeCal projects lead with a visual; client projects retain logo + semester. */}
      {project.coverImage ? (
        <div className="relative -mx-6 -mt-6 mb-3 aspect-[16/9] overflow-hidden border-b border-border bg-surface">
          <Image
            src={project.coverImage}
            alt={project.coverImageAlt ?? ""}
            fill
            sizes="(min-width: 640px) 340px, 300px"
            className="object-contain"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          {project.logo ? (
            <Image
              src={project.logo}
              alt={`${project.partner} logo`}
              width={160}
              height={64}
              className="h-14 w-auto max-w-[40%] object-contain object-left"
            />
          ) : (
            <div
              className="flex h-14 w-14 items-center justify-center bg-primary/10 font-mono text-sm text-primary"
              aria-hidden="true"
            >
              {monogram}
            </div>
          )}
          <span className="font-mono text-xs text-muted">{project.semester}</span>
        </div>
      )}

      {/* Partner (client) leads; project title is the secondary line.
          Falls back to the title when a project has no partner. */}
      <div>
        <h3 className="font-semibold text-ink leading-snug">
          {project.partner || project.title}
        </h3>
        {project.partner && (
          <p className="mt-0.5 text-xs text-muted">{project.title}</p>
        )}
      </div>

      {/* Description — always clamped to 3 lines; full text lives in the popup */}
      <p className="text-sm text-muted leading-relaxed line-clamp-3">
        {project.description}
      </p>

      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        onClick={() => setIsOpen(true)}
      >
        See more →
      </Button>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="bg-primary/10 px-2.5 py-0.5 font-mono text-xs text-primary"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Optional link */}
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-sm font-medium text-primary hover:underline underline-offset-2"
        >
          View project →
        </a>
      )}

      {isOpen && <ProjectModal project={project} onClose={() => setIsOpen(false)} />}
    </article>
  );
}
