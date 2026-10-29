/**
 * Everything the site reads from Airtable. Server-side only — never import this
 * into a "use client" component (it would ship the Airtable library to the
 * browser, and the token is only available on the server anyway).
 *
 * Every fetcher follows the same rule: if Airtable isn't configured or the
 * request fails, log it and fall back to a local JSON file (or an empty list),
 * so a broken Airtable can never break the build. See docs/airtable.md for
 * which table and columns each fetcher reads.
 *
 * Pages import these through lib/content.ts, not from here directly.
 */
import Airtable from "airtable";
import { parseHexPalette } from "@/lib/logoTint";
import type {
  ExecProfile,
  ExternalEvent,
  Partner,
  Project,
  RecruitmentEvent,
} from "@/lib/types";
import projectsFallback from "@/content/committees/projects-fallback.json";
import eventsFallback from "@/content/about/events-fallback.json";
import partnerLogosFallback from "@/content/partners/partner-logos-fallback.json";
import recruitmentTimelineFallback from "@/content/join/recruitment-timeline-fallback.json";
import airtableManifest from "@/lib/generated/airtable-manifest.json";

// ─── Setup ───────────────────────────────────────────────────────────────────

// Every fetcher reads through the table's default "Grid view", so the site
// shows rows in exactly the order they appear in Airtable — drag rows in the
// grid to reorder them on the site. Renaming that view breaks the fetch (the
// fallback kicks in), and rows hidden by view filters don't appear.
const AIRTABLE_VIEW = "Grid view";

/**
 * Reads every row of the table named by the env var `tableEnvVar` (e.g.
 * "EXEC_PROFILES_TABLE"). Throws when Airtable isn't configured, which each
 * caller catches and turns into its fallback.
 */
async function fetchRows(tableEnvVar: string) {
  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = process.env;
  const table = process.env[tableEnvVar];
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !table) {
    throw new Error(`Airtable not configured (needs AIRTABLE_TOKEN, AIRTABLE_BASE_ID, ${tableEnvVar})`);
  }
  const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);
  return base(table).select({ view: AIRTABLE_VIEW }).all();
}

// Airtable's free plan caps API calls per month. Pages are prerendered, so only
// builds and local dev use quota — and each fetcher is memoized so it hits
// Airtable at most once per `npm run dev` session or build worker. Restart the
// dev server to pull fresh data.
function memoizeOnce<T>(fn: () => Promise<T>): () => Promise<T> {
  let cached: Promise<T> | null = null;
  return () => (cached ??= fn());
}

// ─── Cell parsers ────────────────────────────────────────────────────────────
// Officers edit Airtable by hand, so every cell is read defensively: a
// malformed row should render as blank, never crash the page.

/** Multi-select (string[]) or comma-separated text → string[]. */
function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((t): t is string => typeof t === "string");
  if (typeof value === "string") {
    return value.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

// scripts/mirror-airtable.mjs downloads every attachment into public/airtable/
// at build time, because Airtable's own attachment URLs expire a few hours after
// they're issued. The manifest maps each attachment's stable id to its local copy.
const MIRRORED: Record<string, string> = airtableManifest;

/** Attachment cell → list of URLs, preferring the mirrored local copy. */
function attachmentUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((a) => {
      const att = a as { id?: unknown; url?: unknown };
      if (typeof att?.id === "string" && MIRRORED[att.id]) return MIRRORED[att.id];
      return att?.url;
    })
    .filter((url): url is string => typeof url === "string");
}

/**
 * Text cell → string. Also handles Airtable *AI fields*, which come back as
 * `{ state, value, isStale }` rather than a plain string.
 */
function plainText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const inner = (value as { value?: unknown }).value;
    if (typeof inner === "string") return inner.trim();
  }
  return "";
}

/** Text or number cell → string, with blank cells as null. */
function optionalText(value: unknown): string | null {
  if (typeof value === "number") return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

/** LinkedIn URLs are pasted by hand — add a missing https://, treat blank as none. */
function normalizeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const url = value.trim();
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// ─── Projects ────────────────────────────────────────────────────────────────

/**
 * Consulting, Social Good, and Acadev's client work live in three identically
 * shaped tables, so one reader serves all three. `committee` records which
 * table a project came from — there's no committee column in Airtable itself.
 */
async function fetchProjectTable(tableEnvVar: string, committee: string): Promise<Project[]> {
  const records = await fetchRows(tableEnvVar);
  return records.map((r) => ({
    id: r.id,
    // The tables disagree on this column's name: Consulting says "Project Name",
    // Social Good "Project Title". Read both.
    title: plainText(r.fields["Project Name"]) || plainText(r.fields["Project Title"]),
    semester: plainText(r.fields["Semester"]),
    partner: plainText(r.fields["Client"]),
    committee,
    tags: parseTags(r.fields["Tech Stack"]),
    description: plainText(r.fields["Project Summary"]),
    oneLiner: plainText(r.fields["One-liner"]) || null,
    logo: attachmentUrls(r.fields["Logo"])[0] ?? null,
    // Same disagreement for the attachment column: Consulting says
    // "Additional Files", the others "Additional Images/GIFS". Read both.
    images: [
      ...attachmentUrls(r.fields["Additional Images/GIFS"]),
      ...attachmentUrls(r.fields["Additional Files"]),
    ],
    link: null,
    brandColor: optionalText(r.fields["Brand Color"]),
    // Lowercase "color palette" is the column's actual name in the base.
    logoPalette: parseHexPalette(r.fields["Logo color palette"]),
  }));
}

/** Consulting + Social Good projects. Falls back to content/committees/projects-fallback.json. */
export const getProjects = memoizeOnce(async (): Promise<Project[]> => {
  try {
    const [consulting, socialGood] = await Promise.all([
      fetchProjectTable("CONSULTING_PROJECTS_TABLE", "consulting"),
      fetchProjectTable("SOCIAL_GOOD_PROJECTS_TABLE", "social-good"),
    ]);
    return [...consulting, ...socialGood];
  } catch (err) {
    console.error("getProjects(): Airtable fetch failed, using projects-fallback.json", err);
  }
  // Empty by default, so the project carousels hide rather than show made-up
  // work. Entries added there may omit `logoPalette` and `oneLiner`.
  return (projectsFallback as Partial<Project>[]).map((p) => ({ logoPalette: [], oneLiner: null, ...p }) as Project);
});

/** One committee's projects (empty for committees with no Airtable table). */
export async function getProjectsByCommittee(committeeId: string): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.committee === committeeId);
}

/**
 * Acadev's CLIENT projects (the student DeCal projects are local JSON — see
 * getDecalStudentProjects). No fallback: when the table isn't configured the
 * committee page simply omits the section rather than showing made-up work.
 */
export const getAcadevClientProjects = memoizeOnce(async (): Promise<Project[]> => {
  try {
    return await fetchProjectTable("ACADEV_PROJECTS_TABLE", "acadev");
  } catch (err) {
    console.error("getAcadevClientProjects(): Airtable fetch failed, hiding the section", err);
    return [];
  }
});

// ─── About page ──────────────────────────────────────────────────────────────

/** "Events We Host" carousel. Falls back to content/about/events-fallback.json. */
export const getExternalEvents = memoizeOnce(async (): Promise<ExternalEvent[]> => {
  try {
    const records = await fetchRows("EXTERNAL_EVENTS_TABLE");
    return records.map((r) => ({
      id: r.id,
      name: plainText(r.fields["Event Name"]),
      image: attachmentUrls(r.fields["Image"])[0] ?? null,
    }));
  } catch (err) {
    console.error("getExternalEvents(): Airtable fetch failed, using events-fallback.json", err);
  }
  return eventsFallback as ExternalEvent[];
});

/** Executive board. No local fallback — the About page shows an empty-state message. */
export const getExecProfiles = memoizeOnce(async (): Promise<ExecProfile[]> => {
  try {
    const records = await fetchRows("EXEC_PROFILES_TABLE");
    return records
      .map((r) => ({
        id: r.id,
        name: plainText(r.fields["Name"]),
        position: plainText(r.fields["Position"]),
        headshot: attachmentUrls(r.fields["Headshot"])[0] ?? null,
        linkedin: normalizeUrl(r.fields["LinkedIn Link"]),
        gradYear: optionalText(r.fields["Grad Year"]),
      }))
      .filter((p) => p.name); // skip blank rows
  } catch (err) {
    console.error("getExecProfiles(): Airtable fetch failed, exec board will be empty", err);
  }
  return [];
});

// ─── Join page ───────────────────────────────────────────────────────────────

/**
 * Recruitment timeline. Falls back to content/join/recruitment-timeline-fallback.json
 * when Airtable fails OR the table is empty, so the Join page never shows a void.
 */
export const getRecruitmentTimeline = memoizeOnce(async (): Promise<RecruitmentEvent[]> => {
  try {
    const records = await fetchRows("RECRUITMENT_TIMELINE_TABLE");
    const events = records
      .map((r) => ({
        id: r.id,
        event: plainText(r.fields["Event"]),
        date: plainText(r.fields["Date"]),
        description: plainText(r.fields["Description"]),
        time: optionalText(r.fields["Time"]),
        room: optionalText(r.fields["Room"]),
      }))
      .filter((e) => e.event); // skip blank rows
    if (events.length > 0) return events;
  } catch (err) {
    console.error("getRecruitmentTimeline(): Airtable fetch failed, using recruitment-timeline-fallback.json", err);
  }
  return recruitmentTimelineFallback as RecruitmentEvent[];
});

// ─── Partner logos ───────────────────────────────────────────────────────────

/** Partner logo marquee (home + Partners). Falls back to content/partners/partner-logos-fallback.json. */
export const getPartners = memoizeOnce(async (): Promise<Partner[]> => {
  try {
    const records = await fetchRows("LOGOWALL_TABLE");
    return records.map((r, i) => ({
      id: r.id,
      name: plainText(r.fields["Client Name"]),
      website: null,
      logoUrl: attachmentUrls(r.fields["Logo"])[0] ?? null,
      featured: false,
      order: i,
    }));
  } catch (err) {
    console.error("getPartners(): Airtable fetch failed, using partner-logos-fallback.json", err);
  }
  return partnerLogosFallback as Partner[];
});
