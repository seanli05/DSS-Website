import type { Committee } from "@/lib/content";

interface CommitteeCardProps {
  committee: Committee;
}

export default function CommitteeCard({ committee }: CommitteeCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-bg p-6 hover:shadow-md transition-shadow duration-200">
      {/* Icon */}
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-2xl">
        {committee.icon}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <h3 className="font-semibold text-ink">{committee.name}</h3>
        <p className="text-sm text-muted leading-relaxed line-clamp-3">{committee.blurb}</p>
      </div>

      {/* Focus area tags */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
        {committee.focusAreas.map((area) => (
          <span
            key={area}
            className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-xs text-muted"
          >
            {area}
          </span>
        ))}
      </div>
    </article>
  );
}
