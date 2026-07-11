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
  committee: string; // matches a Committee.id — which committee page shows this project
  tags: string[];
  description: string; // the card clamps this to 3 lines; "See more" opens the full project in a popup
  logo: string | null; // path under /public, or a hosted URL from Airtable's Logo attachment
  images: string[]; // additional images/gifs shown in the "See more" popup
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

// Airtable multi-select fields come back as string[]; plain text fields (or a
// comma-separated single line) come back as a string. Handle both.
function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string") {
    return value.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

// Runs server-side only — never import into client components.
// Falls back to projects.json if env vars are missing or the request fails.
export async function getProjects(): Promise<Project[]> {
  try {
    const {
      AIRTABLE_TOKEN,
      AIRTABLE_BASE_ID,
      CONSULTING_PROJECTS_TABLE,
      SOCIAL_GOOD_PROJECTS_TABLE,
    } = process.env;
    if (
      !AIRTABLE_TOKEN ||
      !AIRTABLE_BASE_ID ||
      !CONSULTING_PROJECTS_TABLE ||
      !SOCIAL_GOOD_PROJECTS_TABLE
    ) {
      throw new Error("Airtable env vars not configured");
    }

    const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);

    const fetchTable = async (table: string, committee: string): Promise<Project[]> => {
      const records = await base(table).select().all();
      return records.map((r) => ({
        id: r.id,
        title: r.fields["Project Title"] as string,
        semester: (r.fields["Semester"] as string) ?? "",
        partner: (r.fields["Client"] as string) ?? "",
        committee,
        tags: parseTags(r.fields["Tech Stack"]),
        description: (r.fields["Project Summary"] as string) ?? "",
        logo: (r.fields["Logo"] as unknown as Array<{ url: string }>)?.[0]?.url ?? null,
        images: (
          (r.fields["Additional Images/GIFS"] as unknown as Array<{ url: string }>) ?? []
        ).map((a) => a.url),
        link: null,
      }));
    };

    const [consulting, socialGood] = await Promise.all([
      fetchTable(CONSULTING_PROJECTS_TABLE, "consulting"),
      fetchTable(SOCIAL_GOOD_PROJECTS_TABLE, "social-good"),
    ]);

    return [...consulting, ...socialGood];
  } catch {
    // Fall through to local data below
  }

  return projectsData as Project[];
}

export async function getProjectsByCommittee(committeeId: string): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.committee === committeeId);
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
