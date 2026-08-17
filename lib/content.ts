import Airtable from "airtable";
import { parseHexPalette } from "@/lib/logoTint";
import statsData from "@/data/stats.json";
import partnersData from "@/data/partners.json";
import committeesData from "@/content/committees.json";
import communityData from "@/content/community.json";
import communityPhotosData from "@/content/community-photos.json";
import newbieExperienceData from "@/content/newbie-experience.json";
import offeringsData from "@/content/offerings.json";
import consultingProcessData from "@/content/consulting-process.json";
import externalEventsData from "@/content/external-events.json";
import projectsData from "@/content/projects.json";
import acadevProjectsData from "@/content/acadev-projects.json";
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

export interface CommitteeActivity {
  id: string; // slug — keep stable
  title: string;
  body: string; // one short paragraph; a leading "TODO: …" note is stripped before rendering
  image: string | null; // path under /public — null renders the "photo to come" placeholder
  imageAlt: string | null; // required whenever image is set
}

/**
 * One pillar of the Join page's "The Newbie Experience" section. Deliberately
 * the same shape as CommitteeActivity (a photo tile over a numbered title and a
 * short paragraph) rather than sharing the type — the two sections are edited by
 * different people and are free to drift, per CLAUDE.md rule 8.
 */
export interface NewbieExperiencePillar {
  id: string; // slug — keep stable
  title: string;
  body: string; // one short paragraph; a leading "TODO: …" note is stripped before rendering
  image: string | null; // path under /public — null renders the "photo to come" placeholder
  imageAlt: string | null; // required whenever image is set
}

/** A photo in a committee page's work/gallery carousel. */
export interface CommitteeWorkImage {
  src: string;
  alt: string;
  caption: string | null;
}

export interface Committee {
  id: string;
  name: string;
  fullName: string | null; // spelled-out name shown alongside the abbreviation on CommitteeCard (e.g. "Academic Development" next to "Acadev"); null when name is already the full name
  kicker: string; // one-word category shown above the name on CommitteeCard (e.g. "Learn", "Build", "Serve")
  icon: string;
  blurb: string;
  focusAreas: string[];
  lead: string;
  featured: boolean;
  heroImage: string | null; // path under /public — when set, the committee page header uses this as a full-bleed photo background instead of the plain surface header
  description: string | null; // longer write-up shown in the "What we do" section; when set, replaces the focus-area chips. Blank lines split it into paragraphs — the first is the lead, set larger and darker.
  workImage: string | null; // path under /public — the vertical (2:3) photo beside the "What we do" copy. null renders the "photo to come" placeholder frame.
  workImageAlt: string | null; // alt text for workImage; required whenever workImage is set
  workCaption: string | null; // caption under the frame, e.g. "Social Good, Spring 2026" (rendered as "Fig. 02 — …")
  workImages?: CommitteeWorkImage[] | null; // optional 4:3 carousel; when populated it takes precedence over the legacy single-image fields above
  activities: CommitteeActivity[] | null; // the "How we spend our time" tiles. null or empty → that section doesn't render
}

export interface CommunityTradition {
  id: string;
  icon: string;
  title: string;
  body: string;
  tags: string[] | null; // e.g. Socials' sub-events, shown as chips; null for traditions without them
  image: string | null; // path under /public — hero photo shown in the tradition's bento card; null falls back to the icon-on-gradient placeholder
}

export interface CommunityPhoto {
  id: string;
  src: string; // path under /public
  alt: string;
  category: string; // display label shown as the filmstrip caption, e.g. "Big Little", "Retreat"
}

export interface Project {
  id: string;
  title: string;
  semester: string;
  partner: string;
  committee: string; // matches a Committee.id — which committee page shows this project
  tags: string[];
  description: string; // the full write-up, shown in the "See more" popup
  oneLiner: string | null; // the short hook the card shows instead of the full description. null (or an empty cell) falls back to `description`, so a project without one still reads sensibly.
  logo: string | null; // path under /public, or a hosted URL from Airtable's Logo attachment
  coverImage?: string | null; // optional featured image shown across the top of a project card
  coverImageAlt?: string | null; // alt text for coverImage; required whenever coverImage is set
  images: string[]; // additional images/gifs shown in the "See more" popup
  link: string | null;
  brandColor: string | null; // hex from Airtable's "Brand Color" column — tints the ProjectCard background. null falls back to a best-effort lookup (see getProjectAccentColor), then to the site's own teal.
  logoPalette: string[]; // hexes from Airtable's "Logo Color Palette" column — the colors the logo is drawn in. Fed to getLogoTint() in lib/logoTint.ts to derive the Social Good card's background. Empty is fine: the card falls back to its token palette.
}

export interface ExecProfile {
  id: string;
  name: string;
  position: string;
  headshot: string | null; // Airtable attachment URL — signed, expires ~2h after fetch; refreshed each build
  linkedin: string | null; // full https URL, or null when the member has no LinkedIn
  gradYear: string | null; // normalized to string — the Airtable column may be number or text
}

export interface ExternalEvent {
  id: string;
  name: string;
  image: string | null; // attachment URL (Airtable) or null — falls back to a gradient placeholder tile
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  org: string;
  role: string;
}

export interface Offering {
  id: string;
  icon: string; // icon key resolved by <OfferingIcon> — NOT an emoji
  title: string;
  summary: string;
  bullets: string[];
  featured: boolean; // the flagship offering, rendered larger on the Partners page
}

export interface ConsultingStep {
  step: string; // zero-padded ordinal shown in the node, e.g. "01"
  title: string;
  body: string;
}

export interface RecruitmentEvent {
  id: string;
  event: string; // event name — the card title
  date: string; // human-readable date label, e.g. "Sep 3" or "Week 1" (shown as the card eyebrow)
  description: string;
  time: string | null; // start/end time, e.g. "6:00–7:30 PM" — null when not yet scheduled
  room: string | null; // location, e.g. "Soda 306" — null when TBD or virtual
}

// ─── Getters ─────────────────────────────────────────────────────────────────
// Components never import JSON directly — they call these functions only.

export function getStats(): Stat[] {
  return statsData as Stat[];
}

export function getCommittees(): Committee[] {
  return committeesData as Committee[];
}

/**
 * Drops a leading `TODO: …` sentence from a string of copy.
 *
 * Draft copy in committees.json is marked with a leading TODO sentence per the
 * placeholder rule, but that marker is a note to officers editing the JSON — it
 * should never reach a visitor.
 */
export function stripTodo(text: string): string {
  return text.replace(/^TODO:[^.]*\.\s*/i, "");
}

/**
 * Splits a committee description into paragraphs (blank line = new paragraph),
 * dropping any leading TODO note. Returns [] for null so callers can fall back
 * to the focus-area chips.
 */
export function getDescriptionParagraphs(description: string | null): string[] {
  if (!description) return [];
  return stripTodo(description)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function getFeaturedCommittees(): Committee[] {
  return getCommittees().filter((c) => c.featured);
}

/**
 * Returns the first sentence of a block of text — the one-line hook ProjectCard
 * shows before "Read more" opens the full write-up in ProjectModal. Falls back
 * to the whole string when there's no sentence break to find, so a project
 * never renders a blank card while its summary is still being drafted.
 */
export function firstSentence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?](?=\s|$)/);
  return match ? match[0] : trimmed;
}

// Best-effort decorative accent for partners without a "Brand Color" set in
// Airtable yet — a small set of well-known public brand colors for common
// industry partners, purely for the ProjectCard background tint. Extend as
// new recurring partners show up; anyone not listed here just falls back to
// the site's own teal (handled by the caller), which is always correct.
const KNOWN_PARTNER_COLORS: Record<string, string> = {
  databricks: "#FF3621",
  "analog devices": "#0057B8",
  boeing: "#0039A6",
  "national geographic": "#FFCC00",
  unicef: "#1CABE2",
  wwf: "#5A8F29",
  "world wildlife fund": "#5A8F29",
};

/**
 * The color ProjectCard tints its background with: the project's own
 * `brandColor` from Airtable if set, else a lookup by partner name, else
 * null (the caller falls back to the site's teal via `var(--color-primary)`).
 */
export function getProjectAccentColor(project: Project): string | null {
  if (project.brandColor) return project.brandColor;
  return KNOWN_PARTNER_COLORS[project.partner.trim().toLowerCase()] ?? null;
}

export function getCommunityTraditions(): CommunityTradition[] {
  return communityData as CommunityTradition[];
}

export function getNewbieExperience(): NewbieExperiencePillar[] {
  return newbieExperienceData as NewbieExperiencePillar[];
}

export function getCommunityPhotos(): CommunityPhoto[] {
  return communityPhotosData as CommunityPhoto[];
}

export function getOfferings(): Offering[] {
  return offeringsData as Offering[];
}

export function getConsultingProcess(): ConsultingStep[] {
  return consultingProcessData as ConsultingStep[];
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

/**
 * Reads a text cell that may be either a plain string or an *AI-generated*
 * field. Airtable returns AI fields as `{ state, value, isStale }`, with
 * `value: null` while generation is pending or failed — a raw
 * `as string` cast on one of those renders "[object Object]" into the page.
 * Several project columns ("Project Summary", "One-liner") are AI fields
 * today and may be converted to plain text later, so read them all this way.
 */
function plainText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const inner = (value as { value?: unknown }).value;
    if (typeof inner === "string") return inner.trim();
  }
  return "";
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
        // The two tables genuinely disagree on this column's name — Consulting
        // calls it "Project Name", Social Good "Project Title" — so read both
        // rather than renaming a column officers are already using. Without
        // this, one table's projects all get a blank title and the "See more"
        // popup opens with an empty heading.
        title: plainText(r.fields["Project Name"]) || plainText(r.fields["Project Title"]),
        semester: (r.fields["Semester"] as string) ?? "",
        partner: (r.fields["Client"] as string) ?? "",
        committee,
        tags: parseTags(r.fields["Tech Stack"]),
        description: plainText(r.fields["Project Summary"]),
        oneLiner: plainText(r.fields["One-liner"]) || null,
        logo: attachmentUrls(r.fields["Logo"])[0] ?? null,
        images: attachmentUrls(r.fields["Additional Images/GIFS"]),
        link: null,
        brandColor: (r.fields["Brand Color"] as string) ?? null,
        // Lowercase "color palette" — that's the column's actual name in the base.
        logoPalette: parseHexPalette(r.fields["Logo color palette"]),
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

  // The local fallback predates the Airtable-only fields, so fill them in here
  // rather than repeating them across every row in projects.json.
  return projectsData.map((p) => ({
    ...p,
    logoPalette: parseHexPalette((p as { logoPalette?: unknown }).logoPalette),
    oneLiner: plainText((p as { oneLiner?: unknown }).oneLiner) || null,
  })) as Project[];
});

export async function getProjectsByCommittee(committeeId: string): Promise<Project[]> {
  // Acadev's DeCal projects are student work read straight from JSON — no
  // Airtable call, and no client to carry a logo or brand color. Fill in the
  // partner-only fields here rather than repeating three null columns across
  // every row, the same way the projects.json fallback above does. A null
  // brandColor tints the card with the site's own teal; a null oneLiner makes
  // ProjectCard fall back to the first sentence of the description.
  if (committeeId === "acadev") {
    return acadevProjectsData.map((p) => ({
      ...p,
      oneLiner: null,
      brandColor: null,
      logoPalette: [],
    })) as Project[];
  }
  return (await getProjects()).filter((p) => p.committee === committeeId);
}

// Runs server-side only — never import into client components.
// Falls back to external-events.json if env vars are missing or the request fails.
export const getExternalEvents = memoizeOnce(async (): Promise<ExternalEvent[]> => {
  try {
    const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, EXTERNAL_EVENTS_TABLE } = process.env;
    if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !EXTERNAL_EVENTS_TABLE) {
      throw new Error("Airtable env vars not configured");
    }

    const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);

    const records = await base(EXTERNAL_EVENTS_TABLE).select({ view: AIRTABLE_VIEW }).all();

    return records.map((r) => ({
      id: r.id,
      name: (r.fields["Event Name"] as string) ?? "",
      image: attachmentUrls(r.fields["Image"])[0] ?? null,
    }));
  } catch (err) {
    console.error("getExternalEvents(): Airtable fetch failed, falling back to content/external-events.json", err);
  }

  return externalEventsData as ExternalEvent[];
});

export function getTestimonials(): Testimonial[] {
  return testimonialsData as Testimonial[];
}

// A blank/whitespace cell should read as "not set" (null), not an empty chip.
function normalizeText(value: unknown): string | null {
  if (typeof value === "number") return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

// The recruitment timeline has no local JSON file, but the Join page's horizontal
// timeline should still render something in dev without Airtable configured — so
// this generic fallback stands in when the fetch is unavailable, fails, or the
// table is empty. Content lives here (not in the component) per the "no hardcoded
// content in components" rule.
const RECRUITMENT_TIMELINE_FALLBACK: RecruitmentEvent[] = [
  {
    id: "fallback-info-session",
    event: "Info Session",
    date: "Week 1",
    description:
      "Meet the exec board, learn what DSS does, and hear about every committee. Open to everyone — no application needed.",
    time: "6:00–7:30 PM",
    room: "Soda 306",
  },
  {
    id: "fallback-workshop",
    event: "Skills Workshop",
    date: "Week 1",
    description:
      "A hands-on intro to the tools our members use — Python, pandas, and the data science lifecycle. Come build something.",
    time: "6:00–8:00 PM",
    room: "Cory 540",
  },
  {
    id: "fallback-coffee-chats",
    event: "Coffee Chats",
    date: "Week 2",
    description:
      "Casual 1:1 conversations with current members. Ask anything about projects, committees, and life in DSS.",
    time: "Various",
    room: "Free Speech Movement Café",
  },
  {
    id: "fallback-apps-due",
    event: "Applications Due",
    date: "Week 2",
    description:
      "Submit your written application by 11:59 PM. We review on a rolling basis, so earlier is better.",
    time: "11:59 PM",
    room: null,
  },
  {
    id: "fallback-decisions",
    event: "Decisions & Onboarding",
    date: "Week 3",
    description:
      "Offers go out by email, followed by our kickoff social and committee placement. Welcome to DSS.",
    time: "TBA",
    room: null,
  },
];

// Runs server-side only — never import into client components.
// Falls back to RECRUITMENT_TIMELINE_FALLBACK if env vars are missing or the request fails.
export const getRecruitmentTimeline = memoizeOnce(async (): Promise<RecruitmentEvent[]> => {
  try {
    const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, RECRUITMENT_TIMELINE_TABLE } = process.env;
    if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !RECRUITMENT_TIMELINE_TABLE) {
      throw new Error("Airtable env vars not configured");
    }

    const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);

    const records = await base(RECRUITMENT_TIMELINE_TABLE).select({ view: AIRTABLE_VIEW }).all();

    const events = records
      .map((r) => ({
        id: r.id,
        event: (r.fields["Event"] as string) ?? "",
        date: (r.fields["Date"] as string) ?? "",
        description: (r.fields["Description"] as string) ?? "",
        time: normalizeText(r.fields["Time"]),
        room: normalizeText(r.fields["Room"]),
      }))
      .filter((e) => e.event); // skip blank/half-created Airtable rows

    // An empty table shouldn't leave the Join page with a headerless void —
    // fall back to the sample timeline just as a failed fetch would.
    if (events.length > 0) return events;
  } catch (err) {
    console.error("getRecruitmentTimeline(): Airtable fetch failed, falling back to sample timeline", err);
  }

  return RECRUITMENT_TIMELINE_FALLBACK;
});

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
