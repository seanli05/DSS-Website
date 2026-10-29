/**
 * The shapes of the site's data. Each type matches either a JSON file under
 * content/ or the rows the Airtable fetchers in lib/airtable.ts return.
 *
 * If you add a field to a JSON file, add it here too — TypeScript will then
 * point you at every place that needs to use it.
 */

export interface Stat {
  value: number;
  label: string;
  suffix: string;
}

/** A logo in the partner marquee (Airtable "Logowall" table, or partner-logos-fallback.json). */
export interface Partner {
  id: string;
  name: string;
  website: string | null;
  logoUrl?: string | null;
  featured: boolean;
  order: number;
}

/** One "How we spend our time" tile on a committee page. */
export interface CommitteeActivity {
  id: string; // slug — keep stable
  title: string;
  body: string; // one short paragraph; a leading "TODO: …" note is stripped before rendering
  image: string | null; // path under /public — null renders the "photo to come" placeholder
  imageAlt: string | null; // required whenever image is set
}

/** A photo in a committee page's optional "What we do" carousel. */
export interface CommitteeWorkImage {
  src: string;
  alt: string;
  caption: string | null;
}

export interface Committee {
  id: string; // also the page URL: /acadev, /consulting, /social-good
  name: string;
  fullName: string | null; // spelled-out name for the About page card ("Academic Development"); null when `name` is already full
  kicker: string; // one-word category above the card title ("Teach", "Build", "Serve")
  icon: string; // emoji, shown when the committee has no hero photo
  blurb: string; // one or two sentences — page header + About page card
  focusAreas: string[]; // chips on the About page card
  lead: string; // byline on the committee page; hidden while it starts with "TODO"
  featured: boolean; // true → shown on the About page
  heroImage: string | null; // full-bleed header photo + About page card photo
  description: string | null; // "What we do" copy; blank lines separate paragraphs
  workImage: string | null; // photo beside the "What we do" copy
  workImageAlt: string | null;
  workCaption: string | null;
  workImageOrientation: "portrait" | "landscape"; // shape of workImage (2:3 portrait or 3:2 landscape)
  workImages?: CommitteeWorkImage[] | null; // optional: turns the photo slot into a carousel
  activitiesHeading: string;
  activitiesSubtext: string;
  activities: CommitteeActivity[] | null; // null or [] → the activities section is hidden
}

/** One tile in the About page's "Our Community" grid. */
export interface CommunityTradition {
  id: string;
  icon: string; // emoji fallback when there's no image
  title: string;
  body: string;
  tags: string[] | null;
  image: string | null;
  imageAlt: string;
}

/** One photo in the About page's scrolling gallery. */
export interface CommunityPhoto {
  id: string;
  src: string;
  alt: string;
  category: string; // used for grouping/ordering only
}

export interface Project {
  id: string;
  title: string;
  semester: string;
  partner: string;
  committee: string; // matches a Committee.id — which committee page shows this project
  tags: string[];
  description: string; // the full write-up, shown in the "See more" popup
  oneLiner: string | null; // short hook on the card; null falls back to `description`
  logo: string | null;
  coverImage?: string | null; // DeCal projects: screenshot shown instead of a logo
  coverImageAlt?: string | null;
  images: string[]; // extra images/gifs in the "See more" popup
  link: string | null;
  brandColor: string | null;
  logoPalette: string[]; // hexes from the logo; tints the card (see lib/logoTint.ts)
}

export interface ExecProfile {
  id: string;
  name: string;
  position: string;
  headshot: string | null;
  linkedin: string | null;
  gradYear: string | null;
}

/** A tile in the About page's "Events We Host" carousel. */
export interface ExternalEvent {
  id: string;
  name: string;
  image: string | null;
}

/** A partnership type on the Partners page (also the inquiry form's dropdown). */
export interface Offering {
  id: string;
  icon: string; // key for <OfferingIcon> — NOT an emoji
  title: string;
  summary: string;
  bullets: string[];
  featured: boolean; // the flagship offering, rendered larger
}

/** One card on the Join page's recruitment timeline. */
export interface RecruitmentEvent {
  id: string;
  event: string;
  date: string; // ISO date ("2026-08-31") or free text ("Week 1")
  description: string;
  time: string | null;
  room: string | null;
}

/** One pillar of the Join page's "The Newbie Experience" section. */
export interface NewbieExperiencePillar {
  id: string;
  title: string;
  body: string; // a leading "TODO: …" note is stripped before rendering
  image: string | null;
  imageAlt: string | null;
}

/** One link in the Join page's "Interview resources" list. */
export interface InterviewResource {
  id: string;
  title: string;
  url: string;
  blurb: string;
  topics: string[]; // [] renders no list
  linkLabel: string;
}

/** One question and its answer in the Join page's FAQ. */
export interface FaqItem {
  id: string;
  question: string;
  answer: string[]; // one entry per paragraph
}
