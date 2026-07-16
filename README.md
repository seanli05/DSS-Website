# DSS Berkeley — Website

The marketing website for **Data Science Society at UC Berkeley**. Built with Next.js (App Router), TypeScript, and Tailwind CSS v4. Deployed on Vercel via GitHub auto-deploy.

Two audiences: **prospective student members** and **industry partners**.

---

## Quick start

```bash
nvm use                    # match the Node version in .nvmrc (Node 20 LTS)
npm install
cp .env.example .env.local # then fill in Airtable credentials (optional — falls back to local JSON)
npm run dev                # http://localhost:3000
```

```bash
npm run build   # production build (Airtable data is fetched at build time)
npm run start   # serve the production build locally
```

---

## Project structure

```
app/                       Next.js App Router — one folder per route
  layout.tsx               Root layout: fonts, global metadata, Nav, Footer
  globals.css              ALL design tokens (CSS variables) + Tailwind theme
  page.tsx                 Home (/)
  about/page.tsx           About (/about)
  committees/page.tsx      Committees (/committees)
  committees/[id]/page.tsx Committee detail (/committees/[id]) — includes a projects carousel
  partners/page.tsx        Partners (/partners)
  join/page.tsx            Join (/join)
  contact/page.tsx         Contact (/contact)
  styleguide/page.tsx      Internal style reference (/styleguide)

components/                Reusable UI components (see Components section below)

lib/
  content.ts               The ONLY file that reads data. All components call
                           these functions — never import JSON directly.

content/                   JSON files editors update to change site content
  committees.json          The four committees (name, blurb, focus areas, lead)
  projects.json            Airtable fallback — shown when project env vars are missing
  testimonials.json        Partner/member quotes

data/                      Stats and partner fallback (lower-churn data)
  stats.json               Four headline numbers shown in the stats strip
  partners.json            Airtable fallback — shown when env vars are missing

public/                    Static assets (images, logos, favicon)
.env.example               Committed template listing required env var names
.env.local                 Real secrets — gitignored, never commit this file
.nvmrc                     Pinned Node version
```

---

## Pages

### Home — `app/page.tsx`

The main landing page. Sections in order:

| Section | Component(s) | Data source |
|---|---|---|
| Hero (gradient + typing animation) | `Hero` | hardcoded in `Hero.tsx` |
| Mission one-liner | inline `<Section>` | hardcoded (TODO: finalize copy) |
| Stats strip | `StatCounter` | `data/stats.json` |
| Partner logo wall (marquee) | `LogoWall` | Airtable → `data/partners.json` fallback |
| Committee preview (4 cards) | `CommitteeCard` | `content/committees.json` (featured only) |
| Projects carousel (all projects) | `ProjectCarousel` | Airtable (Consulting + Social Good tables) → `content/projects.json` fallback |
| Dual CTA (join + partner) | `DualCTA` | hardcoded in `DualCTA.tsx` |

### About — `app/about/page.tsx`

Tells the club's story. Sections:

- Gradient page header with `NodeGraph` decoration
- Mission / founding story (copy currently placeholder — marked TODO)
- Values grid (4 cards: hardcoded in the page file under `VALUES`)
- Stats strip (same data as Home)
- Community photo gallery (`Gallery` component)
- Executive board grid (`ExecCard`) — fetched from Airtable (Exec Profiles table); shows a friendly empty-state message if the fetch fails

### Committees — `app/committees/page.tsx`

Lists all four committees. Sections:

- Page header
- All `CommitteeCard`s in a 2-col grid — data from `content/committees.json`
- Apply CTA linking to `/join`

### Committee detail — `app/committees/[id]/page.tsx`

One page per committee (e.g. `/committees/consulting`, `/committees/social-good`). Sections:

- Page header (icon, name, blurb) from `content/committees.json` — if the committee's `heroImage` is set, the header becomes a full-bleed photo background (dark overlay, white text, Hero-like) instead of the plain surface header. Currently only Social Good has one (`public/committees/social-good-hero.jpg`).
- Focus areas
- **Projects carousel** (`ProjectCarousel`) — shown only when `getProjectsByCommittee(committee.id)` returns results. `committee` (`"consulting"` or `"social-good"`) comes from which Airtable table the project was fetched from (see Airtable section below); no `/projects` archive page exists anymore, this carousel plus the homepage carousel are the only places projects are browsable.
- Apply CTA linking to `/join`

### Partners — `app/partners/page.tsx`

Industry partnership pitch page. Sections:

- Page header with dual CTAs (contact + how-it-works anchor)
- Value props grid (3 cards: hardcoded in the page under `VALUE_PROPS`)
- Logo wall (same component as Home)
- How-it-works 5-step timeline (hardcoded in page under `STEPS`)
- Email CTA (`dss@berkeley.edu` — verify this address)

### Join — `app/join/page.tsx`

Member recruitment page. Sections:

- Page header with "Apply now" anchor link
- Why-join grid (4 benefit cards — hardcoded under `BENEFITS`)
- Recruitment timeline (4-step — hardcoded under `TIMELINE`)
- Gradient apply CTA section (application link currently `#` — **must be updated each semester**)
- FAQ accordion-style list (hardcoded under `FAQ`)

### Contact — `app/contact/page.tsx`

Contact methods and socials. Sections:

- Page header
- Three contact method cards: Email, Location (TBD), Mailing list (link TBD)
- Social links (Instagram, LinkedIn, GitHub — verify all handles under `SOCIALS`)
- Email CTA

---

## Components

All components live in `components/`. Server Components by default; only interactive leaves are marked `"use client"`.

| Component | Client? | What it does |
|---|---|---|
| `Nav.tsx` | ✓ | Fixed top nav with scroll shadow + mobile hamburger drawer |
| `Footer.tsx` | — | Site footer with nav links, socials, Berkeley disclaimer |
| `Hero.tsx` | ✓ | Gradient hero with typewriter animation cycling role names |
| `Section.tsx` | — | Standard page section wrapper: eyebrow → heading → subtext → children. Handles container width and vertical rhythm. Use this for all page sections. |
| `Button.tsx` | — | Polymorphic button/link. Props: `variant` (primary/outline/ghost), `size` (sm/md/lg), `href`, `external` |
| `StatCounter.tsx` | ✓ | Count-up animation triggered by IntersectionObserver; respects `prefers-reduced-motion` |
| `LogoWall.tsx` | — | CSS marquee of partner name pills (no logos yet — Airtable attachment support is Phase 5) |
| `CommitteeCard.tsx` | — | Card showing committee name, icon, blurb, and focus area tags |
| `ProjectCard.tsx` | ✓ | Card showing project logo, title, partner, tags, and description clamped to 3 lines. A "See more" button opens `ProjectModal` with the full project |
| `ProjectModal.tsx` | ✓ | Centered popup (rendered via `createPortal` to `document.body`) showing the full project: logo, title, full description, an image/gif mini carousel (when `images` is non-empty), tags, and link. Closes on Escape, backdrop click, or the close button |
| `ProjectCarousel.tsx` | ✓ | Horizontally scrollable, snap-scrolling row of `ProjectCard`s with prev/next buttons. Used on the homepage and committee detail pages |
| `ExecCard.tsx` | — | Exec board card: square headshot (centered crop), name, position, grad year. When the member has a LinkedIn URL the whole card is a link and a "View LinkedIn" overlay appears on hover/focus; initials tile when no headshot |
| `DualCTA.tsx` | — | Two-column CTA strip: "Join DSS" (students) + "Partner with us" (industry) |
| `Gallery.tsx` | ✓ | Horizontally scrollable photo gallery; hides scrollbar |
| `NodeGraph.tsx` | — | Decorative SVG node-graph used in the Hero and About page header |
| `GrowingSapling.tsx` | ✓ | Decorative line-art root system on the Social Good committee page. Roots grow downward from a soil line in sync with scroll (reversible); blossoms pop open at the root tips at full growth and stay open. Renders fully bloomed for reduced-motion/no-JS; hidden below `md` |

---

## Content & data files

These are the files most editors will touch. **All content flows through `lib/content.ts`** — components never import JSON directly.

### `content/committees.json`

Four committees. Fields:

```jsonc
{
  "id": "consulting",          // slug — keep stable
  "name": "Data Consulting",
  "icon": "📊",               // emoji shown on the card
  "blurb": "...",             // short blurb shown in the page header
  "focusAreas": ["Business Analytics", "..."],  // shown as chips in "What we do" — only used when description is null
  "lead": "First Last",       // shown below the card on /committees; leave TODO if unknown
  "featured": true,           // true → shown on the Home page preview (keep all 4 featured)
  "heroImage": null,           // path under /public, or null. When set, /committees/[id]'s header becomes a full-bleed photo background instead of the plain surface header
  "description": null          // longer write-up for the "What we do" section, or null. When set, replaces the focusAreas chips
}
```

### `content/projects.json`

**Fallback only.** `getProjects()` fetches live from two Airtable tables (Consulting Projects, Social Good Projects — see Airtable section below) and only falls back to this file if the env vars are missing or the request fails. Shown on the homepage and each committee's detail page (`/committees/[id]`) in a `ProjectCarousel`. Fields:

```jsonc
{
  "id": "unique-slug",        // Airtable-sourced projects use the Airtable record id instead
  "title": "Project Title",
  "semester": "Fall 2024",    // shown on the card; not used for grouping
  "partner": "Company Name",
  "committee": "consulting",  // must match a Committee.id — which committee page shows this project
  "tags": ["NLP", "Python"],
  "description": "...",       // the card always clamps this to 3 lines; "See more" opens the full text in a popup
  "logo": null,                // path under /public, or a hosted URL, or null for a placeholder
  "images": [],                 // extra image/gif URLs shown as a mini carousel in the "See more" popup
  "link": null                 // external URL or null
}
```

Add new projects anywhere in the array — order doesn't matter.

### Exec board profiles (Airtable only)

The `/about` executive board grid has **no local JSON file** — it comes entirely from the Airtable `Exec Profiles` table (see the Airtable section below). If the fetch fails, the section renders an empty-state message instead of cards.

### `content/testimonials.json`

Partner or member quotes (not yet wired to a page — available via `getTestimonials()`).

```jsonc
{
  "id": "unique",
  "quote": "...",
  "name": "First Last",
  "org": "Company",
  "role": "Head of Data"
}
```

### `data/stats.json`

The four numbers in the stats strip on Home and About.

```jsonc
[
  { "value": 200, "label": "Active members", "suffix": "+" },
  ...
]
```

### `data/partners.json`

Fallback partner list used when Airtable env vars are absent or the request fails. Fields match the `Partner` type in `lib/content.ts`. Add `logoUrl` once logos are hosted.

---

## Data layer — `lib/content.ts`

Single source of truth for all data access. Key functions:

| Function | Returns | Source |
|---|---|---|
| `getStats()` | `Stat[]` | `data/stats.json` |
| `getCommittees()` | `Committee[]` | `content/committees.json` |
| `getFeaturedCommittees()` | `Committee[]` | filtered by `featured: true` |
| `getProjects()` | `Promise<Project[]>` | Airtable REST API (Consulting + Social Good tables) → `content/projects.json` fallback |
| `getProjectsByCommittee(id)` | `Promise<Project[]>` | `getProjects()` filtered by `committee === id`; powers the carousel on `/committees/[id]` |
| `getTestimonials()` | `Testimonial[]` | `content/testimonials.json` |
| `getPartners()` | `Promise<Partner[]>` | Airtable REST API → `data/partners.json` fallback |
| `getExecProfiles()` | `Promise<ExecProfile[]>` | Airtable REST API (Exec Profiles table) → empty array fallback |

`getPartners()`, `getProjects()`, `getProjectsByCommittee()`, and `getExecProfiles()` are `async` and **server-side only** — never call them from a `"use client"` component. All others are synchronous.

---

## Design system

### Colors

All colors are CSS variables defined in `app/globals.css` inside `@theme {}`. Tailwind auto-generates utility classes from these (e.g., `bg-primary`, `text-muted`, `border-border`).

| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Default page background |
| `--color-surface` | `#F5F8F7` | Alternate section background (pass `surface` prop to `Section`) |
| `--color-ink` | `#0B1D1C` | Primary text |
| `--color-muted` | `#5A6B68` | Secondary / caption text |
| `--color-border` | `#E2E8E6` | Dividers and card borders |
| `--color-primary` | `#0C706E` | Deep teal — buttons, links, active states (5.9:1 contrast) |
| `--color-primary-bright` | `#1D8C89` | Lighter teal — large headings only (4.1:1) |
| `--color-accent` | `#8FB573` | Sage green — decorative only, never on small text |

The brand gradient (`--gradient-brand`) runs teal → bright teal → sage. Applied via `.brand-gradient` (backgrounds) and `.brand-gradient-text` (gradient text). Used on Hero, About header, and the Join apply CTA.

**Never hardcode hex values in components** — always use Tailwind classes that reference these tokens.

### Typography

- **Sans-serif body**: Inter (via `next/font`) — `font-sans`
- **Monospace accent**: IBM Plex Mono (via `next/font`) — `font-mono`

The monospace font is used for eyebrow labels, stat numbers, and small data-science-flavored accents.

### Layout patterns

- Max content width: `max-w-[1200px] mx-auto px-6`
- Page sections use the `Section` component (handles padding + container automatically)
- Section header pattern: small caps eyebrow → bold heading → muted subtext

---

## Airtable (partner logos + projects + exec profiles)

Partner logos, project data, and exec board profiles are fetched from Airtable at build time, all from the same base. Required env vars (set in `.env.local` and in Vercel project settings):

```
AIRTABLE_TOKEN=...
AIRTABLE_BASE_ID=...
LOGOWALL_TABLE=...
CONSULTING_PROJECTS_TABLE=...
SOCIAL_GOOD_PROJECTS_TABLE=...
EXEC_PROFILES_TABLE=...
```

If any of a function's required env vars are missing, it silently falls back to the matching local JSON file (`data/partners.json` or `content/projects.json`); exec profiles have no JSON fallback and render an empty-state message instead. A failed Airtable fetch never breaks the build.

**Row ordering:** every fetcher reads records through the table's default **Grid view**, so the site shows rows in exactly the order they appear in Airtable — drag rows in the grid to reorder them on the site. Don't rename the "Grid view" view (the fetch would fail and fall back), and note that rows hidden by view filters won't appear on the site.

**API call budget:** the free plan caps API calls per workspace per month. Deployed pages are fully static, so visitor traffic costs zero calls — only builds (~13 calls each) and local dev consume quota. All three Airtable fetchers are memoized for the lifetime of the process (`memoizeOnce` in `lib/content.ts`), so a whole `npm run dev` session costs ~4 calls total no matter how many pages you reload. To pull fresh Airtable data in dev, restart the dev server.

**Projects tables** (`CONSULTING_PROJECTS_TABLE`, `SOCIAL_GOOD_PROJECTS_TABLE`) — same schema in both, fetched in parallel by `getProjects()` in `lib/content.ts`. Which table a project came from becomes its `committee` (`"consulting"` or `"social-good"`) — there's no committee column in Airtable itself.

| Airtable column | Type | Maps to |
|---|---|---|
| `Project Title` | text | `title` |
| `Client` | text | `partner` |
| `Semester` | text | `semester` |
| `Project Summary` | text | `description` |
| `Logo` | attachment | `logo` (first attachment's URL) |
| `Tech Stack` | multi-select or comma text | `tags` (both formats are parsed) |
| `Additional Images/GIFS` | attachment | `images` (all attachment URLs — shown as a mini carousel in the "See more" popup) |

**Exec Profiles table** (`EXEC_PROFILES_TABLE`) — fetched by `getExecProfiles()` in `lib/content.ts`, shown as the executive board grid on `/about`. Rows with a blank `Name` are skipped. Records render in the table's Grid-view row order (see **Row ordering** above).

| Airtable column | Type | Maps to |
|---|---|---|
| `Name` | text | `name` |
| `Position` | text | `position` |
| `Headshot` | attachment | `headshot` (first attachment's URL; initials tile shown when empty) |
| `LinkedIn Link` | text/URL | `linkedin` (a missing `https://` prefix is added automatically; empty → card is not clickable) |
| `Grad Year` | number or text | `gradYear` (shown as "Class of ...") |

**Attachment URL expiry:** Airtable attachment URLs are signed and expire roughly two hours after they're fetched. URLs are baked into the static build, so an image first requested long after a build can 404 until the next rebuild. This applies to logos and headshots alike — the rebuild hook below keeps URLs fresh.

**To trigger a rebuild when Airtable data changes:** set up an Airtable automation → Vercel deploy hook.

---

## Adding a nav link

1. Add the route to `components/Nav.tsx` in the `links` array.
2. Add the same route to `components/Footer.tsx` in the `navLinks` array.

---

## Deployment

Deployed to Vercel on every push to `main`. No manual steps required. Environment variables must be set in the Vercel project dashboard.

---

## Outstanding TODOs

Search the codebase for `TODO` to find all placeholders. High-priority ones:

- **All page headers**: copy marked `TODO: finalize with DSS leadership`
- **`content/committees.json`**: all `"lead"` fields are `"TODO: Committee Lead"`
- **`content/projects.json`**: only used as a fallback now — real project data lives in Airtable (`CONSULTING_PROJECTS_TABLE`, `SOCIAL_GOOD_PROJECTS_TABLE`). Some Consulting Projects rows currently have blank `Project Title`/`Client` cells, and `Tech Stack` appears empty on every row checked so far — worth a pass in Airtable
- **`app/join/page.tsx`**: application link is `href="#"` — update each semester with the real Typeform/Google Form URL
- **`app/contact/page.tsx`**: meeting room location is TBD; mailing list sign-up link is `#`
- **`components/Nav.tsx`**: logo text placeholder — replace with SVG logo
- **`components/Footer.tsx`**: social handles need verification
- **`data/partners.json`**: placeholder company names — replace with real past partners or wire up Airtable

---

## Hard rules

1. **No hardcoded content in components** — all text and data flows through `lib/content.ts` or is clearly marked as UI copy.
2. **Colors only in `app/globals.css`** — never write hex values in component files.
3. **`getPartners()` and `getProjects()` are server-side only** — never import them into a `"use client"` component.
4. **Secrets stay server-side** — Airtable credentials live in `.env.local` (gitignored) and Vercel settings.
5. **Default to Server Components** — add `"use client"` only when you need browser APIs or React state.
6. **Footer disclaimer must stay** — required Berkeley independent-org language, do not remove.
