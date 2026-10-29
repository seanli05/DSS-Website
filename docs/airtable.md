# Airtable

Several sections of the site are edited in the DSS Airtable base rather than in
`content/`. The site reads Airtable **at build time** (plus one write, for the
Partners inquiry form). All of the reading code is in [`lib/airtable.ts`](../lib/airtable.ts).

## How it fits together

1. **`npm run build`** first runs `scripts/mirror-airtable.mjs` (the `prebuild`
   step). It downloads every Airtable attachment (logos, headshots, photos) into
   `public/airtable/` and writes `lib/generated/airtable-manifest.json`.
   This exists because Airtable's attachment URLs **expire a few hours after
   they're issued** — serving them directly broke every image partway through a
   deployment's life. Animated GIFs are converted to small MP4s on the way.
2. **`next build`** then fetches each table once (`memoizeOnce`) and bakes the
   rows into static pages, swapping attachment URLs for the local copies.
3. If Airtable isn't configured or a request fails, each fetcher **logs the error
   and falls back** — to a `*-fallback.json` file in `content/`, or to an empty
   list. A broken Airtable never breaks the build.

**Editing Airtable does not change the live site until it's rebuilt** (see
[deployment.md](deployment.md#rebuilding-after-content-changes)).

Rows appear in the order of each table's **"Grid view"** — drag rows to reorder.
Don't rename that view (the fetch fails and falls back), and rows hidden by view
filters won't appear.

## Environment variables

Set in `.env.local` for local development and in Vercel → Settings → Environment
Variables (**Production only** — preview builds then use the fallbacks and cost
no API calls). Template: [`.env.example`](../.env.example).

| Variable | Used for |
|---|---|
| `AIRTABLE_TOKEN` | Personal access token. Needs **write** scope on the inquiries table. |
| `AIRTABLE_BASE_ID` | The DSS base (`app…`). |
| `LOGOWALL_TABLE` | Partner logo strip |
| `CONSULTING_PROJECTS_TABLE`, `SOCIAL_GOOD_PROJECTS_TABLE` | Committee project carousels |
| `ACADEV_PROJECTS_TABLE` | Acadev "Client Projects" (optional — the section hides without it) |
| `EXEC_PROFILES_TABLE` | About → Executive Board |
| `EXTERNAL_EVENTS_TABLE` | About → Events We Host |
| `RECRUITMENT_TIMELINE_TABLE` | Join → Recruitment timeline |
| `PARTNER_INQUIRIES_TABLE` | Partners inquiry form (written to) |

## Tables and columns

Column names must match exactly (including capitalization).

### Projects — Consulting, Social Good, Acadev

All three tables share a shape. Which table a row comes from decides which
committee page shows it.

| Column | Type | Shown as |
|---|---|---|
| `Project Name` *or* `Project Title` | text | Card title (the tables disagree on the name; both are read) |
| `Client` | text | Partner name. Also links that partner's logo in the home page strip to this project |
| `Semester` | text | Card subtitle |
| `Project Summary` | text or AI field | Full write-up in the "See more" popup |
| `One-liner` | text or AI field | Short hook on the card (falls back to the summary) |
| `Logo` | attachment | Card logo |
| `Additional Images/GIFS` *or* `Additional Files` | attachment | Image carousel in the popup (both names are read) |
| `Tech Stack` | multi-select or comma-separated text | Tags |
| `Brand Color` | text (hex) | Optional |
| `Logo color palette` | text, AI field, or multi-select of hexes | Tints the card background to match the logo ([`lib/logoTint.ts`](../lib/logoTint.ts)) |

### Exec Profiles

| Column | Type | Shown as |
|---|---|---|
| `Name` | text | Rows with a blank name are skipped |
| `Position` | text | |
| `Headshot` | attachment | Initials tile when empty |
| `LinkedIn Link` | text/URL | Makes the card clickable; `https://` is added if missing |
| `Grad Year` | number or text | "Class of …" |

### External Events

| Column | Type |
|---|---|
| `Event Name` | text |
| `Image` | attachment (gradient placeholder when empty) |

### Logowall

| Column | Type |
|---|---|
| `Client Name` | text |
| `Logo` | attachment |

### Recruitment Timeline

| Column | Type | Notes |
|---|---|---|
| `Event` | text | Card title; blank rows skipped |
| `Date` | text | An ISO date (`2026-08-31`) is shown as weekday/day/month; anything else (`Week 1`) is printed as typed |
| `Description` | long text | Shown in full — cards grow to fit |
| `Time` | text | Optional |
| `Room` | text | Optional |

If the table is empty or unavailable, `content/join/recruitment-timeline-fallback.json` is shown.

### Partner Inquiries (written by the site)

`app/api/partner-inquiry/route.ts` creates one row per form submission.

| Column | Type |
|---|---|
| `Name`, `Company`, `Email` | text |
| `Interest` | single select — options are created automatically from `content/partners/offerings.json` |
| `Message` | long text |
| `Submitted` | created time |

Without `PARTNER_INQUIRIES_TABLE` (or a write-scoped token) the form shows an
error with the `partnersEmail` from `content/site.json` as a fallback — it never
pretends to succeed. A hidden honeypot field and server-side length limits keep
out junk; keep the limits in `route.ts` in sync with the form's `maxLength`s.

This route is the one part of the site that runs on a server, which is why the
site can't be exported as plain static files (fine on Vercel).

## API call budget

Airtable's plan caps API calls per month. Visitors cost nothing (pages are
prerendered). Each **production build costs ~13 calls** (6 for the mirror step,
7 for the build). Local `npm run dev` costs a few calls per session — restart it
to pull fresh data. If the cap is hit, local dev stalls on every page: remove
`AIRTABLE_TOKEN` from `.env.local` to work from the fallbacks.

Avoid per-page `export const revalidate` (ISR): it re-fetches per page and skips
the attachment mirror, bringing back expiring image URLs.

## Adding a new Airtable-backed section

1. Add a fetcher in `lib/airtable.ts` using `fetchRows("MY_TABLE")`, wrapped in
   `memoizeOnce` with a try/catch fallback like the others.
2. Re-export it from `lib/content.ts`.
3. If it has attachments, add the table and field to `SOURCES` in
   `scripts/mirror-airtable.mjs` and read them with `attachmentUrls()`.
4. Add the env var to `.env.example`, this file, and Vercel.
