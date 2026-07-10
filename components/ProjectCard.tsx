import type { Project } from "@/lib/content";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      id={project.id}
      className="scroll-mt-28 flex flex-col gap-3 rounded-2xl border border-border bg-bg p-6 hover:shadow-md transition-shadow duration-200"
    >
      {/* Meta row */}
      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <span className="font-mono">{project.semester}</span>
        {project.partner && (
          <span className="truncate">{project.partner}</span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-ink leading-snug">{project.title}</h3>

      {/* Description */}
      <p className="text-sm text-muted leading-relaxed line-clamp-3 flex-1">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-xs text-primary"
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
    </article>
  );
}
