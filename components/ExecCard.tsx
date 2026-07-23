import Image from "next/image";
import type { ExecProfile } from "@/lib/content";

interface ExecCardProps {
  profile: ExecProfile;
}

export default function ExecCard({ profile }: ExecCardProps) {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const card = (
    <article className="flex h-full flex-col overflow-hidden bg-bg shadow-md transition-shadow duration-200 motion-reduce:transition-none group-hover:shadow-xl group-focus-visible:shadow-xl">
      <div className="relative aspect-square w-full bg-primary/10">
        {profile.headshot ? (
          <Image
            src={profile.headshot}
            alt={`Headshot of ${profile.name}`}
            fill
            sizes="(min-width: 1200px) 276px, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-3xl font-semibold text-primary"
            aria-hidden="true"
          >
            {initials}
          </div>
        )}
        {profile.linkedin && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-ink/60 opacity-0 transition-opacity duration-200 motion-reduce:transition-none group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-white">
              View LinkedIn ↗
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5 p-4">
        <p className="font-semibold text-ink leading-snug">{profile.name}</p>
        <p className="text-sm text-muted">{profile.position}</p>
        {profile.gradYear && (
          <p className="mt-1 font-mono text-xs text-muted">Class of {profile.gradYear}</p>
        )}
      </div>
    </article>
  );

  if (!profile.linkedin) return card;

  return (
    <a
      href={profile.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${profile.name}, ${profile.position} — view LinkedIn profile`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {card}
    </a>
  );
}
