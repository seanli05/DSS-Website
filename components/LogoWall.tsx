import Image from "next/image";
import Link from "next/link";
import type { Partner, Project } from "@/lib/content";

interface LogoWallProps {
  partners: Partner[];
  projects?: Project[];
}

export default function LogoWall({ partners, projects = [] }: LogoWallProps) {
  if (partners.length === 0) return null;

  const items = [...partners, ...partners, ...partners];
  const duration = `${partners.length * 3}s`;

  const projectByPartner = new Map(
    projects.map((p) => [p.partner.toLowerCase(), { id: p.id, committee: p.committee }])
  );

  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 flex flex-col items-center text-center mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
          Our partners
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-ink leading-snug">
          Trusted by industry leaders
        </h2>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 z-10" style={{ background: "linear-gradient(to right, var(--color-surface), transparent)" }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 z-10" style={{ background: "linear-gradient(to left, var(--color-surface), transparent)" }} />

        <div
          className="marquee-track"
          style={{ animationDuration: duration }}
        >
          {items.map((partner, i) => {
            const project = projectByPartner.get(partner.name.toLowerCase());
            const logo = partner.logoUrl ? (
              <Image
                src={partner.logoUrl}
                alt={partner.name}
                width={180}
                height={48}
                className="h-full w-auto max-w-[160px] object-contain grayscale opacity-60 transition-all duration-200 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-125"
              />
            ) : (
              <span className="text-sm font-semibold text-muted whitespace-nowrap transition-all duration-200 group-hover:text-ink group-hover:scale-110">
                {partner.name}
              </span>
            );

            return (
              <div key={`${partner.id}-${i}`} className="flex-shrink-0 px-10 flex items-center h-12">
                {project ? (
                  <Link
                    href={`/committees/${project.committee}#${project.id}`}
                    className="group flex items-center h-full"
                    aria-label={`View the project we built with ${partner.name}`}
                  >
                    {logo}
                  </Link>
                ) : (
                  <div className="group flex items-center h-full">{logo}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
