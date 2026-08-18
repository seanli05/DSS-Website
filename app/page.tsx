import Hero from "@/components/Hero";
import HomeMission from "@/components/HomeMission";
import HomePaths from "@/components/HomePaths";
import { getStats, getPartners, getProjects } from "@/lib/content";

export default async function HomePage() {
  const [partners, projects] = await Promise.all([getPartners(), getProjects()]);
  // The proof band shows stats.json as-is, in file order. Edit the labels and
  // numbers there. The band is laid out as four columns, so keep it to four.
  const stats = getStats();

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
