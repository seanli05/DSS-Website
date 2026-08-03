import Hero from "@/components/Hero";
import HomeMission from "@/components/HomeMission";
import HomePaths from "@/components/HomePaths";
import { getStats, getPartners, getProjects } from "@/lib/content";

// Which stats.json entries appear in the proof band, in this order.
const HOME_STAT_LABELS = [
  "Active members",
  "Projects completed",
  "Industry partners",
  "Years running",
];

export default async function HomePage() {
  const [partners, projects] = await Promise.all([getPartners(), getProjects()]);
  const stats = HOME_STAT_LABELS.map(
    (label) => getStats().find((s) => s.label === label)
  ).filter((s) => s !== undefined);

  return (
    <>
      {/* 1. Hero — brand gradient, unchanged. */}
      <Hero partners={partners} projects={projects} />

      {/* 2–3. Editorial sections. They share one continuous white field, fading
          out of the hero's gradient at the top and back into the footer's at the
          bottom, so both colour transitions read as fades rather than cuts. */}
      <HomeMission stats={stats} />
      <HomePaths />
    </>
  );
}
