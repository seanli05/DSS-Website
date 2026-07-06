import type { TeamMember } from "@/lib/content";

interface OfficerCardProps {
  member: TeamMember;
}

export default function OfficerCard({ member }: OfficerCardProps) {
  const initials = member.name.startsWith("TODO")
    ? "?"
    : member.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

  return (
    <article className="flex flex-col items-center text-center gap-3 rounded-2xl border border-border bg-bg p-6 hover:shadow-md transition-shadow duration-200">
      {/* Photo placeholder — TODO Phase 4+: swap for next/image when real photos exist */}
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xl overflow-hidden flex-none">
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.photo} alt={member.name} className="h-full w-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      <div>
        <p className="font-semibold text-ink leading-snug">{member.name}</p>
        <p className="text-sm text-muted mt-0.5">{member.role}</p>
      </div>

      {(member.links.linkedin || member.links.github || member.links.email) ? (
        <div className="flex gap-3 mt-auto">
          {member.links.linkedin ? (
            <a
              href={member.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-primary hover:underline underline-offset-2"
            >
              LinkedIn
            </a>
          ) : null}
          {member.links.github ? (
            <a
              href={member.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-primary hover:underline underline-offset-2"
            >
              GitHub
            </a>
          ) : null}
          {member.links.email ? (
            <a
              href={`mailto:${member.links.email}`}
              className="font-mono text-xs text-primary hover:underline underline-offset-2"
            >
              Email
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
