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
  projects/page.tsx        Projects (/projects)
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
  projects.json            Past projects by semester
  team.json                Officer / leadership cards
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
| Featured projects (3 cards) | `ProjectCard` | `content/projects.json` (featured only) |
| Dual CTA (join + partner) | `DualCTA` | hardcoded in `DualCTA.tsx` |

### About — `app/about/page.tsx`

Tells the club's story. Sections:

- Gradient page header with `NodeGraph` decoration
- Mission / founding story (copy currently placeholder — marked TODO)
- Values grid (4 cards: hardcoded in the page file under `VALUES`)
- Stats strip (same data as Home)
- Community photo gallery (`Gallery` component)
- Leadership / officer grid (`OfficerCard`) — populated from `content/team.json`

### Committees — `app/committees/page.tsx`

Lists all four committees. Sections:

- Page header
- All `CommitteeCard`s in a 2-col grid — data from `content/committees.json`
- Apply CTA linking to `/join`

### Projects — `app/projects/page.tsx`

Full project archive, grouped by semester. Sections:

- Page header
- Projects auto-grouped by the `semester` field in `content/projects.json`, newest first
- Partner CTA linking to `/partners`

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
| `ProjectCard.tsx` | — | Card showing project title, semester, partner, tags, and description |
| `OfficerCard.tsx` | — | Officer photo + name + role + optional LinkedIn/GitHub/email links |
| `DualCTA.tsx` | — | Two-column CTA strip: "Join DSS" (students) + "Partner with us" (industry) |
| `Gallery.tsx` | ✓ | Horizontally scrollable photo gallery; hides scrollbar |
| `NodeGraph.tsx` | — | Decorative SVG node-graph used in the Hero and About page header |

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
  "blurb": "...",
  "focusAreas": ["Business Analytics", "..."],
  "lead": "First Last",       // shown below the card on /committees; leave TODO if unknown
  "featured": true            // true → shown on the Home page preview (keep all 4 featured)
}
```

### `content/projects.json`

Past project entries. Fields:

```jsonc
{
  "id": "unique-slug",
  "title": "Project Title",
  "semester": "Fall 2024",    // used as a grouping key on /projects — must be consistent
  "partner": "Company Name",
  "tags": ["NLP", "Python"],
  "description": "...",
  "featured": true,           // true → shown in the Home page preview (pick 3)
  "image": null,              // path under /public, or null
  "link": null                // external URL or null
}
```

Add new projects at the top of the array so they sort newest-first.

### `content/team.json`

Officer list shown on `/about`. Fields:

```jsonc
{
  "id": "first-last",
  "name": "First Last",
  "role": "President",
  "photo": "/team/first-last.jpg",  // place image in public/team/; use null for placeholder
  "links": {
    "linkedin": "https://linkedin.com/in/...",
    "github": "https://github.com/...",
    "email": "first@berkeley.edu"   // all optional; set to null to hide
  }
}
```

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
| `getProjects()` | `Project[]` | `content/projects.json` |
| `getFeaturedProjects()` | `Project[]` | filtered by `featured: true` |
| `getTeam()` | `TeamMember[]` | `content/team.json` |
| `getTestimonials()` | `Testimonial[]` | `content/testimonials.json` |
| `getPartners()` | `Promise<Partner[]>` | Airtable REST API → `data/partners.json` fallback |

`getPartners()` is `async` and **server-side only** — never call it from a `"use client"` component. All others are synchronous.

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

## Airtable (partner logos)

Partner logos are fetched from Airtable at build time. Required env vars (set in `.env.local` and in Vercel project settings):

```
AIRTABLE_TOKEN=...
AIRTABLE_BASE_ID=...
LOGOWALL_TABLE=...
```

If any of these are missing, `getPartners()` silently falls back to `data/partners.json`. A failed Airtable fetch never breaks the build.

**To trigger a rebuild when logos change:** set up an Airtable automation → Vercel deploy hook.

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
- **`content/team.json`**: empty — add officer entries to populate `/about` leadership section
- **`content/projects.json`**: placeholder projects — replace with real ones
- **`app/join/page.tsx`**: application link is `href="#"` — update each semester with the real Typeform/Google Form URL
- **`app/contact/page.tsx`**: meeting room location is TBD; mailing list sign-up link is `#`
- **`components/Nav.tsx`**: logo text placeholder — replace with SVG logo
- **`components/Footer.tsx`**: social handles need verification
- **`data/partners.json`**: placeholder company names — replace with real past partners or wire up Airtable

---

## Hard rules

1. **No hardcoded content in components** — all text and data flows through `lib/content.ts` or is clearly marked as UI copy.
2. **Colors only in `app/globals.css`** — never write hex values in component files.
3. **`getPartners()` is server-side only** — never import it into a `"use client"` component.
4. **Secrets stay server-side** — Airtable credentials live in `.env.local` (gitignored) and Vercel settings.
5. **Default to Server Components** — add `"use client"` only when you need browser APIs or React state.
6. **Footer disclaimer must stay** — required Berkeley independent-org language, do not remove.
