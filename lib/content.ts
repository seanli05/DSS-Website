import Airtable from "airtable";
import statsData from "@/data/stats.json";
import partnersData from "@/data/partners.json";
import committeesData from "@/content/committees.json";
import projectsData from "@/content/projects.json";
import teamData from "@/content/team.json";
import testimonialsData from "@/content/testimonials.json";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Stat {
  value: number;
  label: string;
  suffix: string;
}

export interface Partner {
  id: string;
  name: string;
  website: string | null;
  logoUrl?: string | null; // populated by Airtable attachment in Phase 5
  featured: boolean;
  order: number;
}

export interface Committee {
  id: string;
  name: string;
  icon: string;
  blurb: string;
  focusAreas: string[];
  lead: string;
  featured: boolean;
}

export interface Project {
  id: string;
  title: string;
  semester: string;
  partner: string;
  tags: string[];
  description: string;
  featured: boolean;
  image: string | null;
  link: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  links: {
    linkedin?: string | null;
    github?: string | null;
    email?: string | null;
  };
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  org: string;
  role: string;
}

// ─── Getters ─────────────────────────────────────────────────────────────────
// Components never import JSON directly — they call these functions only.

export function getStats(): Stat[] {
  return statsData as Stat[];
}

export function getCommittees(): Committee[] {
  return committeesData as Committee[];
}

export function getFeaturedCommittees(): Committee[] {
  return getCommittees().filter((c) => c.featured);
}

export function getProjects(): Project[] {
  return projectsData as Project[];
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getTeam(): TeamMember[] {
  return teamData as TeamMember[];
}

export function getTestimonials(): Testimonial[] {
  return testimonialsData as Testimonial[];
}

// Runs server-side only — never import into client components.
// Falls back to partners.json if env vars are missing or the request fails.
export async function getPartners(): Promise<Partner[]> {
  try {
    const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, LOGOWALL_TABLE } = process.env;
    if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !LOGOWALL_TABLE) {
      throw new Error("Airtable env vars not configured");
    }

    const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);

    const records = await base(LOGOWALL_TABLE).select().all();

    return records.map((r, i) => ({
      id: r.id,
      name: r.fields["Client Name"] as string,
      website: null,
      logoUrl: (r.fields["Logo"] as unknown as Array<{ url: string }>)?.[0]?.url ?? null,
      featured: false,
      order: i,
    }));
  } catch {
    // Fall through to local data below
  }

  return partnersData as Partner[];
}
