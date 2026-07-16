import Airtable from "airtable";
import statsData from "@/data/stats.json";
import partnersData from "@/data/partners.json";
import committeesData from "@/content/committees.json";
import projectsData from "@/content/projects.json";
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
  heroImage: string | null; // path under /public — when set, the committee page header uses this as a full-bleed photo background instead of the plain surface header
  description: string | null; // longer write-up shown in the "What we do" section; when set, replaces the focus-area chips
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

export interface ExecProfile {
  id: string;
  name: string;
  position: string;
  headshot: string | null; // Airtable attachment URL — signed, expires ~2h after fetch; refreshed each build
  linkedin: string | null; // full https URL, or null when the member has no LinkedIn
  gradYear: string | null; // normalized to string — the Airtable column may be number or text
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
// comma-separated single line) come back as a string. Handle both, and don't
// trust that every array entry is actually a string (e.g. if the column ever
// gets reconfigured to a linked-record field) — non-strings would otherwise
// crash the tag chips ("Objects are not valid as a React child").
function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((t): t is string => typeof t === "string");
  if (typeof value === "string") {
    return value.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

// Airtable attachment fields (Logo, Additional Images/GIFS) are normally an
// array of { url, ... }. Guard against the field being missing, cleared, or
// an unexpected shape — `.map()` on a non-array throws, and one malformed
// row shouldn't be able to take down the whole fetch.
function attachmentUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((a) => (a as { url?: unknown })?.url)
    .filter((url): url is string => typeof url === "string");
}

// "Grad Year" may be a number column or single-line text — normalize to string.
function normalizeGradYear(value: unknown): string | null {
  if (typeof value === "number") return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

// Officers paste LinkedIn URLs by hand — tolerate a missing protocol (a bare
// "linkedin.com/in/..." would otherwise render as a relative link), and treat
// empty/whitespace cells as "no LinkedIn" so the card renders non-clickable.
function normalizeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const url = value.trim();
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// ─── Airtable call budget ────────────────────────────────────────────────────
// Airtable's free plan caps API calls per workspace per month. Production
// visitors never trigger calls (pages are fully static), so only builds and
// local dev consume quota. Each fetcher below is memoized for the lifetime of
// the Node process: Airtable is hit at most once per `npm run dev` session
// (and once per build worker), no matter how many pages are loaded. To pull
// fresh Airtable data in dev, restart the dev server. One caveat: a dev
// recompile that invalidates this module (e.g. editing this file) resets the
// cache, so "once per run" is the floor, not a hard guarantee.
function memoizeOnce<T>(fn: () => Promise<T>): () => Promise<T> {
  let cached: Promise<T> | null = null;
  return () => (cached ??= fn());
}

// Every fetcher requests records through the table's default "Grid view", so
// the site shows rows in exactly the order they appear in Airtable — drag rows
// in the grid to reorder them on the site. Two things follow: renaming that
// view in Airtable breaks the fetch (logged loudly, JSON/empty fallback kicks
// in), and rows hidden by view filters are excluded from the site.
const AIRTABLE_VIEW = "Grid view";

// Runs server-side only — never import into client components.
// Falls back to projects.json if env vars are missing or the request fails.
export const getProjects = memoizeOnce(async (): Promise<Project[]> => {
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
      const records = await base(table).select({ view: AIRTABLE_VIEW }).all();
      return records.map((r) => ({
        id: r.id,
        title: (r.fields["Project Title"] as string) ?? "",
        semester: (r.fields["Semester"] as string) ?? "",
        partner: (r.fields["Client"] as string) ?? "",
        committee,
        tags: parseTags(r.fields["Tech Stack"]),
        description: (r.fields["Project Summary"] as string) ?? "",
        logo: attachmentUrls(r.fields["Logo"])[0] ?? null,
        images: attachmentUrls(r.fields["Additional Images/GIFS"]),
        link: null,
      }));
    };

    const [consulting, socialGood] = await Promise.all([
      fetchTable(CONSULTING_PROJECTS_TABLE, "consulting"),
      fetchTable(SOCIAL_GOOD_PROJECTS_TABLE, "social-good"),
    ]);

    return [...consulting, ...socialGood];
  } catch (err) {
    // Fall through to local data below, but don't fail silently — a bad
    // Airtable row should be loud in the logs, not a mystery regression.
    console.error("getProjects(): Airtable fetch failed, falling back to content/projects.json", err);
  }

  return projectsData as Project[];
});

export async function getProjectsByCommittee(committeeId: string): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.committee === committeeId);
}

export function getTestimonials(): Testimonial[] {
  return testimonialsData as Testimonial[];
}

// Runs server-side only — never import into client components.
// Falls back to partners.json if env vars are missing or the request fails.
export const getPartners = memoizeOnce(async (): Promise<Partner[]> => {
  try {
    const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, LOGOWALL_TABLE } = process.env;
    if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !LOGOWALL_TABLE) {
      throw new Error("Airtable env vars not configured");
    }

    const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);

    const records = await base(LOGOWALL_TABLE).select({ view: AIRTABLE_VIEW }).all();

    return records.map((r, i) => ({
      id: r.id,
      name: (r.fields["Client Name"] as string) ?? "",
      website: null,
      logoUrl: attachmentUrls(r.fields["Logo"])[0] ?? null,
      featured: false,
      order: i,
    }));
  } catch (err) {
    // Fall through to local data below, but don't fail silently.
    console.error("getPartners(): Airtable fetch failed, falling back to data/partners.json", err);
  }

  return partnersData as Partner[];
});

// Runs server-side only — never import into client components.
// Exec profiles live only in Airtable, so there is no local JSON fallback:
// on a failed fetch this returns [] and the About page shows a friendly
// empty-state message instead of breaking the build.
export const getExecProfiles = memoizeOnce(async (): Promise<ExecProfile[]> => {
  try {
    const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, EXEC_PROFILES_TABLE } = process.env;
    if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !EXEC_PROFILES_TABLE) {
      throw new Error("Airtable env vars not configured");
    }

    const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);

    const records = await base(EXEC_PROFILES_TABLE).select({ view: AIRTABLE_VIEW }).all();

    return records
      .map((r) => ({
        id: r.id,
        name: (r.fields["Name"] as string) ?? "",
        position: (r.fields["Position"] as string) ?? "",
        headshot: attachmentUrls(r.fields["Headshot"])[0] ?? null,
        linkedin: normalizeUrl(r.fields["LinkedIn Link"]),
        gradYear: normalizeGradYear(r.fields["Grad Year"]),
      }))
      .filter((p) => p.name); // skip blank/half-created Airtable rows
  } catch (err) {
    console.error("getExecProfiles(): Airtable fetch failed, exec board section will be empty", err);
  }

  return [];
});
