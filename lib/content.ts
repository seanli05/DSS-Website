/**
 * The one place pages and components get their content from.
 *
 * - Page copy (headings, paragraphs, button labels) lives in content/<page>/page.json
 *   and is exported below as `homePage`, `aboutPage`, etc.
 * - Lists (committees, FAQ, photos, …) live in their own JSON files next to it
 *   and are read with the getX() functions below.
 * - Airtable-backed data (projects, exec board, partner logos, events, timeline)
 *   comes from lib/airtable.ts and is re-exported here.
 *
 * Components never import JSON directly — they import from "@/lib/content".
 * See content/README.md for which file controls which part of the site.
 */
import type {
  Committee,
  CommunityPhoto,
  CommunityTradition,
  FaqItem,
  InterviewResource,
  NewbieExperiencePillar,
  Offering,
  Project,
  Stat,
} from "@/lib/types";

import homePageData from "@/content/home/page.json";
import statsData from "@/content/home/stats.json";
import aboutPageData from "@/content/about/page.json";
import communityTraditionsData from "@/content/about/community-traditions.json";
import communityPhotosData from "@/content/about/community-photos.json";
import committeePageData from "@/content/committees/page.json";
import committeesData from "@/content/committees/committees.json";
import joinPageData from "@/content/join/page.json";
import faqData from "@/content/join/faq.json";
import interviewResourcesData from "@/content/join/interview-resources.json";
import newbieExperienceData from "@/content/join/newbie-experience.json";
import partnersPageData from "@/content/partners/page.json";
import offeringsData from "@/content/partners/offerings.json";
import decalPageData from "@/content/decal/page.json";
import decalStudentProjectsData from "@/content/decal/student-projects.json";
import contactPageData from "@/content/contact/page.json";

export type * from "@/lib/types";
export {
  getProjects,
  getProjectsByCommittee,
  getAcadevClientProjects,
  getExternalEvents,
  getExecProfiles,
  getRecruitmentTimeline,
  getPartners,
} from "@/lib/airtable";

// ─── Page copy ───────────────────────────────────────────────────────────────
// Typed straight from the JSON, so a typo'd or deleted key fails the build with
// a message pointing at the page that uses it.

export const homePage = homePageData;
export const aboutPage = aboutPageData;
export const committeePage = committeePageData;
export const joinPage = joinPageData;
export const partnersPage = partnersPageData;
export const decalPage = decalPageData;
export const contactPage = contactPageData;

// ─── Lists ───────────────────────────────────────────────────────────────────

export function getStats(): Stat[] {
  return statsData as Stat[];
}

export function getCommittees(): Committee[] {
  return committeesData as Committee[];
}

export function getCommittee(id: string): Committee | undefined {
  return getCommittees().find((c) => c.id === id);
}

export function getFeaturedCommittees(): Committee[] {
  return getCommittees().filter((c) => c.featured);
}

export function getCommunityTraditions(): CommunityTradition[] {
  return communityTraditionsData as CommunityTradition[];
}

export function getCommunityPhotos(): CommunityPhoto[] {
  return communityPhotosData as CommunityPhoto[];
}

export function getNewbieExperience(): NewbieExperiencePillar[] {
  return newbieExperienceData as NewbieExperiencePillar[];
}

export function getInterviewResources(): InterviewResource[] {
  return interviewResourcesData as InterviewResource[];
}

export function getFaq(): FaqItem[] {
  return faqData as FaqItem[];
}

export function getOfferings(): Offering[] {
  return offeringsData as Offering[];
}

/** Student projects from the DeCal, shown on /decal. Local JSON — no client, logo, or brand color. */
export function getDecalStudentProjects(): Project[] {
  return decalStudentProjectsData.map((p) => ({
    ...p,
    oneLiner: null,
    brandColor: null,
    logoPalette: [],
  })) as Project[];
}

// ─── Text helpers ────────────────────────────────────────────────────────────

/**
 * Drops a leading "TODO: …" sentence from a piece of copy, so officers can
 * leave themselves notes in the JSON that never reach a visitor.
 *
 * The note ends at the FIRST period, so keep it to one sentence with no
 * internal periods (no "e.g.") — otherwise it eats the real copy after it.
 */
export function stripTodo(text: string): string {
  return text.replace(/^TODO:[^.]*\.\s*/i, "");
}

/** Splits a committee description into paragraphs (blank line = new paragraph). */
export function getDescriptionParagraphs(description: string | null): string[] {
  if (!description) return [];
  return stripTodo(description)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Fills "{name}"-style placeholders: fillTemplate("Join {committee}", { committee: "Acadev" }). */
export function fillTemplate(text: string, values: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
