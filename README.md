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
  api/partner-inquiry/route.ts
                           POST endpoint — writes Partners-page inquiries to
                           Airtable at request time (the only non-static route)

components/                Reusable UI components (see Components section below)

lib/
  content.ts               The ONLY file that reads data. All components call
                           these functions — never import JSON directly.

content/                   JSON files editors update to change site content
  committees.json          The four committees (name, blurb, focus areas, lead)
  community.json           About page traditions (Big Little, House, Retreats…)
  community-photos.json    About page Gallery photos. `category` is retained for
                           grouping/ordering but is no longer shown on the tiles
  external-events.json     Airtable fallback for the About page events carousel
  offerings.json           What DSS offers partners — also fills the inquiry
                           form's "I'm interested in" dropdown
  consulting-process.json  Read by getConsultingProcess(); not yet rendered
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
| Partner logo carousel (marquee) | `LogoCarousel` | Airtable → `data/partners.json` fallback |
| Committee preview (4 cards) | `CommitteeCard` | `content/committees.json` (featured only) |
| Projects carousel (all projects) | `ProjectCarousel` | Airtable (Consulting + Social Good tables) → `content/projects.json` fallback |
| Dual CTA (join + partner) | `DualCTA` | hardcoded in `DualCTA.tsx` |

### About — `app/about/page.tsx`

Tells the club's story.

**Theming.** This page uses the same editorial system as the homepage and Partners page rather than the shared `<Section>` component: `font-poppins`, numbered uppercase eyebrows (`(01) — Our story`) in `text-primary`, light-weight `clamp()` headings, square corners with hairline borders, `Fig. NN —` photo captions, and `RevealOnScroll` staggering. Everything below the hero sits inside one `fade-between-gradients` wrapper so the page eases out of the hero's green and back into the footer's; child sections stay transparent. The eyebrow/heading/caption class strings are constants at the top of the page file. `Gallery`, `EventCarousel`, and `ExecCard` are About-only and were squared to match; `CommitteeCard` is shared with `/committees` and deliberately kept as-is, so its focus-area chips are still pills.

Sections:

- Static gradient page header (left-aligned eyebrow/heading/subtext, matching the Partners/Committees/Join header pattern)
- Mission / founding story
- Values list (4 rows, numbered, hardcoded in the page file under `VALUES`) — icons come from `lucide-react`
- Committee preview (`CommitteeCard` grid, each card links to `/committees/[id]`) — `content/committees.json`, featured only. **This `<Section>` carries `id="committees"`**; the homepage "Find your committee" card links to `/about#committees`, so don't drop the id.
- **Community** — traditions from `content/community.json` via `getCommunityTraditions()`:
  - Bento tradition grid (Big Little, House System, Chummings, Retreats, Socials) — three card layouts for visual variety. **Each card shows exactly one cover image** (`CommunityTradition.image`), and falls back to an icon-on-gradient placeholder when that field is `null`. Retreats is the only card on the placeholder today. The grid widens to **75% of the viewport from `2xl` up** (gated there because 75% only exceeds `max-w-6xl` past 1536px, so narrower screens keep the shared column rather than shrinking); the section heading sits in the same wrapper so it stays aligned with the cards. Tiles reveal in a staggered cascade (`RevealOnScroll` with increasing `delayMs`) and lift + slow-zoom on hover via the shared `TILE_HOVER`/`TILE_IMAGE_ZOOM` class strings; both back off under `prefers-reduced-motion`. Socials lists its sub-events as plain text labels, not photos
  - **Adding a cover:** drop one image into `Culture pics/<Category>/Cover/`, re-derive `public/community/` (see below), then point that tradition's `image` at `/community/<slug>/cover.jpg`. Retreats is the only tradition still on the placeholder
  - "Moments from the year" gallery (`Gallery`, photos from `content/community-photos.json` via `getCommunityPhotos()`) — two rows drifting continuously in opposite directions, purely decorative (no filter, no arrows, no lightbox, no captions, nothing clickable). Photos alternate between the rows, since the JSON is category-ordered and a straight split would leave one row single-category. The strip is inset to 90% and sits outside the section's `max-w-6xl` column so it reads wider than the text without running to the window edge. To change the pace, edit `SECONDS_PER_TILE` in `components/Gallery.tsx`
- **Campus involvement** — `EventCarousel` of large photo tiles from the Airtable `External Events` table via `getExternalEvents()`, falling back to `content/external-events.json`. Hover/focus darkens the photo and shows the event name
- Executive board grid (`ExecCard`) — fetched from Airtable (Exec Profiles table); shows a friendly empty-state message if the fetch fails

### Committees — `app/committees/page.tsx`

Lists all four committees. Sections:

- Page header
- All `CommitteeCard`s in a 2-col grid — data from `content/committees.json`
- Apply CTA linking to `/join`

### Committee detail — `app/committees/[id]/page.tsx`

One page per committee (e.g. `/committees/consulting`, `/committees/social-good`). Sections:

- Page header (icon, name, blurb) from `content/committees.json` — if the committee's `heroImage` is set, the header becomes a full-bleed photo background (dark overlay, white text, Hero-like) instead of the plain surface header. Currently only Social Good has one (`public/committees/social-good-hero.jpg`).
- **What we do** — a two-column spread: the committee's `description` on the left (blank lines in the JSON split it into paragraphs; the first is set larger and darker as a lead), and a vertical committee photo (`CommitteePhoto`) on the right. Committees with no `description` show their focus-area chips in the left column instead.
  - Columns are proportional (`1.4fr / 1fr`), so the pair always fills the container — fixed widths left dead space to the right of the photo.
  - The grid row **stretches** (no `items-start`): the photo takes its height from the copy beside it and crops via `object-cover`, so both columns end on exactly the same line. The committee-lead byline uses `lg:mt-auto` to pin itself to the bottom of the copy column, so it meets the photo's caption even when the copy above is short.
  - Two columns only from `lg`. In the `md` band the column is narrow enough that copy runs tall, and a photo stretched to match came out a 292×753 sliver — so tablets and phones stack instead, photo last, at its natural 2:3.
  - Where copy is *shorter* than the frame's `lg:min-h-[30rem]` floor, the floor wins and the photo hangs below the copy. That's a copy-length problem, not a layout one — it currently affects Consulting (105 px) and Acadev (446 px), both pending real write-ups.
- **How we spend our time** (`CommitteeActivities`) — three tiles across, each a landscape 4:3 photo over a numbered title and short description, describing what a semester in the committee is actually like (as opposed to what it produces). Rendered only for committees with a non-empty `activities` array; currently Social Good only.
- **Projects carousel** (`ProjectCarousel`) — its own section, shown only when `getProjectsByCommittee(committee.id)` returns results. `committee` (`"consulting"` or `"social-good"`) comes from which Airtable table the project was fetched from (see Airtable section below); no `/projects` archive page exists anymore, this carousel plus the homepage carousel are the only places projects are browsable.
- Apply CTA linking to `/join` — closes every committee page, unnumbered.

**Section numbering is derived, not hardcoded.** Only some committees have activities, so the index passed to `<Section>` for Projects is computed (`activities.length > 0 ? 3 : 2`). Social Good reads (01) (02) (03); Consulting reads (01) (02); Acadev has neither activities nor projects, so it is (01) plus the CTA. `divider` stays on section (01) only, per the site-wide convention.

**Theming.** Every committee sits on the standard light editorial field — there is no dark band. All three pages now share the same structure, with no per-committee layout special-casing left.

**Adding a committee photo.** Drop a portrait (2:3, ~1400×2100 is plenty — `next/image` resizes down) into `public/committees/`, then set `workImage`, `workImageAlt`, and `workCaption` in `content/committees.json`. Until then the slot renders `CommitteePhoto`'s "Photo to come" placeholder frame, so the layout is already correct.

**Adding an activity photo.** Same idea, landscape 4:3 (~1200×900). Drop it in `public/committees/`, then set `image` and `imageAlt` on that entry in the committee's `activities` array. Until then the tile shows the shared `PhotoPlaceholder` frame at the same 4:3 shape, so nothing shifts when the real photo lands.

### Partners — `app/partners/page.tsx`

Industry partnership pitch page. Sections:

- Gradient hero ("Let's work together.") with the inquiry form card beside the headline
- Logo carousel (same component as Home)
- How-it-works section (3 cards)
- Project timeline (`ProjectTimeline`)
- Closing panel repeating the inquiry form card

**Inquiry form.** `PartnerInquiryCard` is the shared "Get in touch" panel, rendered twice (hero and closing panel) so the two can't drift apart; pass `headingLevel="h3"` for the second one to keep heading order nested. It reads `getOfferings()` and passes the offering titles to `PartnerInquiryForm` as the "I'm interested in" options, plus the contact address as `contactEmail`.

`PartnerInquiryForm` is a `"use client"` leaf that POSTs JSON to `/api/partner-inquiry`, which writes one row per submission to Airtable (see the Airtable section). Notes for future editors:

- The card supplies the panel chrome — the form itself renders no card wrapper. Don't add one back or you'll get nested panels.
- A hidden `website` honeypot field catches bots: if it's filled, the route returns success and writes nothing.
- On failure the form shows an inline error plus a `mailto:` fallback, so a misconfigured Airtable still leaves visitors a way to reach us. It never fakes success.
- The contact address lives in `CONTACT_EMAIL` in `PartnerInquiryCard.tsx` (`dss@berkeley.edu` — verify this address).

### Join — `app/join/page.tsx`

Member recruitment page. Sections:

- Page header with "Apply now" anchor link
- **Recruitment timeline** (`RecruitmentTimeline`) — events come from the Airtable `Recruitment Timeline` table via `getRecruitmentTimeline()`, no longer hardcoded. A horizontal scroll track with a continuous spine; cards alternate above/below it and reveal as they scroll into view (an `IntersectionObserver` flips `data-revealed`, driving the `.tl-*` / `.timeline-*` transitions in `app/globals.css`). All motion is disabled under `prefers-reduced-motion`.
- Why-join grid (4 benefit cards — hardcoded under `BENEFITS`)
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
| `Section.tsx` | — | Standard page section wrapper: eyebrow → heading → subtext → optional divider → children. Renders the editorial system (Poppins, `max-w-6xl`, `(01) — Label` eyebrow, light-weight `clamp()` heading) that the home/About/Partners pages hand-roll. Props: `index` (adds the `(01) — ` number), `divider` (the rule under the header — first section of a page only), `dark`, `centered`, `id`, `className`. **Has no background** — pages wrap their body in `fade-between-gradients`, and an opaque section would punch a hole in it. Header is auto-wrapped in `RevealOnScroll`. |
| `Button.tsx` | — | Polymorphic rounded-full pill button/link. Props: `variant` (primary/outline/ghost), `size` (sm/md/lg), `href`, `external`. Still used by `/styleguide`; the editorial pages use `EditorialButton` instead — don't mix the two systems within a page |
| `EditorialButton.tsx` | — | Square-corner button for the editorial pages: 11px uppercase `tracking-[0.18em]` label, always renders a trailing `→`. Props: `variant` (solid/outline/**inverse** — inverse is white-on-green, for CTAs sitting on a gradient band, i.e. hero CTAs), `external` (plain `<a target="_blank">`, also the right choice for `mailto:`), `href`, `className` |
| `StatCounter.tsx` | ✓ | Count-up animation triggered by IntersectionObserver; respects `prefers-reduced-motion` |
| `LogoCarousel.tsx` | — | Auto-scrolling CSS-keyframe marquee of partner logos. Purely decorative — no links, no hover effects; respects `prefers-reduced-motion`. Handles any partner count/logo shape from Airtable (fixed logo slots, list repeated to cover wide viewports) |
| `CommitteeCard.tsx` | — | Committee card linking to `/committees/[id]`: `kicker` category, name (plus `fullName` when set), custom line-art glyph, blurb, and focus area tags. Per-committee accent colors are a presentation-only map in the file, all referencing existing tokens — Social Good uses `--color-accent-ink` because sage isn't AA-legible at small sizes |
| `ProjectCard.tsx` | ✓ | Card showing project logo, title, partner, tags, and description clamped to 3 lines. A "See more" button opens `ProjectModal` with the full project |
| `ProjectModal.tsx` | ✓ | Centered popup (rendered via `createPortal` to `document.body`) showing the full project: logo, title, full description, an image/gif mini carousel (when `images` is non-empty), tags, and link. Closes on Escape, backdrop click, or the close button |
| `ProjectCarousel.tsx` | ✓ | Horizontally scrollable, snap-scrolling row of `ProjectCard`s with prev/next buttons. Used on the homepage and committee detail pages |
| `ExecCard.tsx` | — | Exec board card: square headshot (centered crop), name, position, grad year. When the member has a LinkedIn URL the whole card is a link and a "View LinkedIn" overlay appears on hover/focus; initials tile when no headshot |
| `DualCTA.tsx` | — | Two-column CTA strip: "Join DSS" (students) + "Partner with us" (industry) |
| `Gallery.tsx` | — | About page photo strip: **two decorative rows** looping forever in opposite directions. Reuses the `animate-marquee` / `marquee-mask` pattern from `LogoCarousel` (track rendered twice, `translateX(0 → -50%)`), so it is pure CSS with no scroll handlers — hence no `"use client"`. Photos alternate between rows so both carry every category. `aria-hidden` and `pointer-events-none`: nothing to click or scroll. Static under `prefers-reduced-motion` |
| `EventCarousel.tsx` | ✓ | About page "Campus involvement" strip of large photo tiles from `getExternalEvents()`. Hover/focus darkens the photo and overlays the event name; prev/next arrows scroll the track |
| `RecruitmentTimeline.tsx` | ✓ | Join page horizontal timeline: a continuous spine with cards alternating above/below. An IntersectionObserver rooted to the scroll track flips `data-revealed`, driving the `.tl-*` transitions in `globals.css`; all items render revealed under `prefers-reduced-motion` |
| `OfferingIcon.tsx` | — | Line-icon set keyed by `Offering.icon`. **Not currently rendered** — kept for a future Partners offerings menu |
| `NodeGraph.tsx` | — | Decorative SVG node-graph used in the Hero and About page header |
| `CommitteeActivities.tsx` | — | The "How we spend our time" grid: three tiles across, each a 4:3 photo over a numbered title and description. `sm:auto-rows-fr` is load-bearing — it holds all three to the same height when descriptions differ in length, keeping the row of photos on one line |
| `PhotoPlaceholder.tsx` | — | Shared "Photo to come" fill for an image frame with no photo yet — corner-to-corner SVG hairlines behind a centered label. Absolutely positioned; the caller owns the frame, border, and aspect ratio. Used by `CommitteePhoto` (2:3) and `CommitteeActivities` (4:3) |
| `CommitteePhoto.tsx` | — | The vertical photo beside a committee's "What we do" copy — hairline frame, slow zoom on hover, `Fig. NN — …` caption, same treatment as the About page's Fig. 01. Keeps a 2:3 frame while stacked; from `lg` it fills its grid row so its bottom edge lands level with the copy, cropping via `object-cover`. When `src` is null it renders a "Photo to come" placeholder frame of the same shape |
| `GrowingSapling.tsx` | ✓ | Decorative line-art root system: roots grow downward from a soil line in sync with scroll (reversible); blossoms pop open at the root tips at full growth and stay open. Renders fully bloomed for reduced-motion/no-JS. **Not currently rendered** — was the Social Good "What we do" graphic before the committee photo replaced it; kept for reuse (e.g. as a background watermark) |
| `GrowingNetwork.tsx` | ✓ | Decorative line-art node graph echoing the site's logo motif. Nodes and edges draw in scrubbed to scroll, then pulse. Drawn in `stroke-primary`/`fill-primary` for the white editorial field — not white-on-green. **Not currently rendered** — was the Consulting "What we do" graphic before the committee photo replaced it |

---

## Content & data files

These are the files most editors will touch. **All content flows through `lib/content.ts`** — components never import JSON directly.

### `content/committees.json`

Four committees. Fields:

```jsonc
{
  "id": "consulting",          // slug — keep stable
  "name": "Data Consulting",
  "fullName": null,           // spelled-out name shown next to the abbreviation on CommitteeCard (e.g. "Academic Development" for "Acadev"); null when name is already full
  "kicker": "Build",          // one-word category above the name on CommitteeCard (Learn / Build / Serve)
  "icon": "📊",               // emoji shown on the card
  "blurb": "...",             // short blurb shown in the page header
  "focusAreas": ["Business Analytics", "..."],  // shown as chips in "What we do" — only used when description is null
  "lead": "First Last",       // shown below the card on /committees; leave TODO if unknown
  "featured": true,           // true → shown on the Home page preview (keep all 4 featured)
  "heroImage": null,           // path under /public, or null. When set, /committees/[id]'s header becomes a full-bleed photo background instead of the plain surface header
  "description": null,         // longer write-up for the "What we do" section, or null. When set, replaces the focusAreas chips.
                              // Separate paragraphs with a blank line (\n\n) — the first renders as a larger, darker lead.
                              // A leading "TODO: ..." sentence marks draft copy and is stripped before rendering, so it never reaches a visitor.
  "workImage": null,           // path under /public — the vertical 2:3 photo beside the "What we do" copy. null renders the "Photo to come" placeholder frame
  "workImageAlt": null,        // alt text — required whenever workImage is set
  "workCaption": null,         // caption under the frame, e.g. "The Social Good committee" (renders as "Fig. 01 — …"). Keep null while the photo is a placeholder
  "activities": [              // the "How we spend our time" tiles, or null. null/empty → that whole section doesn't render
    {
      "id": "skill-workshops", // slug — keep stable
      "title": "Skill workshops",
      "body": "...",           // one short paragraph; a leading "TODO: ..." note is stripped before rendering
      "image": null,           // landscape 4:3 path under /public, or null for the placeholder frame
      "imageAlt": null         // required whenever image is set
    }
  ]
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
| `stripTodo(text)` | `string` | drops a leading `TODO: …` sentence, so draft markers stay visible to officers editing the JSON but never reach a visitor |
| `getDescriptionParagraphs(description)` | `string[]` | splits a committee `description` on blank lines and runs each through `stripTodo()` |
| `getOfferings()` | `Offering[]` | `content/offerings.json` — titles fill the inquiry form's interest dropdown |
| `getCommunityTraditions()` | `CommunityTradition[]` | `content/community.json` — the About page's bento tradition grid |
| `getCommunityPhotos()` | `CommunityPhoto[]` | `content/community-photos.json` — the About page's `Gallery` |
| `getConsultingProcess()` | `ConsultingStep[]` | `content/consulting-process.json` — **not currently rendered by any page** |
| `getProjects()` | `Promise<Project[]>` | Airtable REST API (Consulting + Social Good tables) → `content/projects.json` fallback |
| `getExternalEvents()` | `Promise<ExternalEvent[]>` | Airtable (External Events table) → `content/external-events.json` fallback; About page carousel |
| `getRecruitmentTimeline()` | `Promise<RecruitmentEvent[]>` | Airtable (Recruitment Timeline table); Join page timeline |
| `getProjectsByCommittee(id)` | `Promise<Project[]>` | `getProjects()` filtered by `committee === id`; powers the carousel on `/committees/[id]` |
| `getTestimonials()` | `Testimonial[]` | `content/testimonials.json` |
| `getPartners()` | `Promise<Partner[]>` | Airtable REST API → `data/partners.json` fallback |
| `getExecProfiles()` | `Promise<ExecProfile[]>` | Airtable REST API (Exec Profiles table) → empty array fallback |

`getPartners()`, `getProjects()`, `getProjectsByCommittee()`, `getExecProfiles()`, `getExternalEvents()`, and `getRecruitmentTimeline()` are `async` and **server-side only** — never call them from a `"use client"` component. All others are synchronous.

---

## Design system

### Colors

All colors are CSS variables defined in `app/globals.css` inside `@theme {}`. Tailwind auto-generates utility classes from these (e.g., `bg-primary`, `text-muted`, `border-border`).

| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Default page background |
| `--color-surface` | `#F5F8F7` | Alternate surface fill (cards, inset panels). No longer used for alternating section backgrounds — sections are transparent under `fade-between-gradients` |
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

- Max content width: `mx-auto max-w-6xl px-6 md:px-8 lg:px-12` for page content. `max-w-[1200px]` is now only Nav, Footer, and the home Hero (whose logo column is deliberately aligned to the nav's Join button)
- Page sections use the `Section` component (handles font, padding, container, and header reveal automatically)
- Section header pattern: `(01) — Eyebrow` in `text-[11px] uppercase tracking-[0.18em] text-primary` → `font-normal` `clamp(2rem,4vw,3.125rem)` heading → muted subtext → optional divider rule
- Every page opens with a full-bleed `-mt-16 pt-16 surface-green-gradient` hero that slides under the fixed nav, then wraps everything below it in one `fade-between-gradients` div
- Cards are square-cornered `border border-border bg-bg` with `hover:-translate-y-1 hover:border-primary hover:shadow-card`

---

## Airtable (partner logos + projects + exec profiles + events + timeline + inquiries)

Partner logos, project data, and exec board profiles are fetched from Airtable at build time, all from the same base. Partner inquiries are **written** back to the same base at request time. Required env vars (set in `.env.local` and in Vercel project settings):

```
AIRTABLE_TOKEN=...
AIRTABLE_BASE_ID=...
LOGOWALL_TABLE=...
CONSULTING_PROJECTS_TABLE=...
SOCIAL_GOOD_PROJECTS_TABLE=...
EXEC_PROFILES_TABLE=...
EXTERNAL_EVENTS_TABLE=...
RECRUITMENT_TIMELINE_TABLE=...
PARTNER_INQUIRIES_TABLE=...
```

The token needs **write** access to `PARTNER_INQUIRIES_TABLE`; every other table is read-only.

If any of a function's required env vars are missing, it silently falls back to the matching local JSON file (`data/partners.json` or `content/projects.json`); exec profiles have no JSON fallback and render an empty-state message instead. A failed Airtable fetch never breaks the build.

**Row ordering:** every fetcher reads records through the table's default **Grid view**, so the site shows rows in exactly the order they appear in Airtable — drag rows in the grid to reorder them on the site. Don't rename the "Grid view" view (the fetch would fail and fall back), and note that rows hidden by view filters won't appear on the site.

**API call budget:** the free plan caps API calls per workspace per month. Deployed pages are prerendered, so browsing costs zero calls — only builds (~13 calls each), local dev, and inquiry-form submissions (1 write each) consume quota. All three Airtable fetchers are memoized for the lifetime of the process (`memoizeOnce` in `lib/content.ts`), so a whole `npm run dev` session costs ~4 calls total no matter how many pages you reload. To pull fresh Airtable data in dev, restart the dev server.

**Projects tables** (`CONSULTING_PROJECTS_TABLE`, `SOCIAL_GOOD_PROJECTS_TABLE`) — same schema in both, fetched in parallel by `getProjects()` in `lib/content.ts`. Which table a project came from becomes its `committee` (`"consulting"` or `"social-good"`) — there's no committee column in Airtable itself.

| Airtable column | Type | Maps to |
|---|---|---|
| `Project Name` | text | `title` |
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

**External Events table** (`EXTERNAL_EVENTS_TABLE`) — fetched by `getExternalEvents()`, shown as the "Campus involvement" carousel on `/about`. Falls back to `content/external-events.json` when the env var is missing or the fetch fails.

| Airtable column | Type | Maps to |
|---|---|---|
| `Name` | text | `name` |
| `Image` | attachment | `image` (first attachment's URL; gradient placeholder tile when empty) |

**Recruitment Timeline table** (`RECRUITMENT_TIMELINE_TABLE`) — fetched by `getRecruitmentTimeline()`, drives the timeline on `/join`. Records render in Grid-view row order, so drag rows to reorder the timeline.

| Airtable column | Type | Maps to |
|---|---|---|
| `Event` | text | `event` (card title) |
| `Date` | text | `date` (card eyebrow, e.g. "Sep 3" or "Week 1") |
| `Description` | long text | `description` |
| `Time` | text | `time` (e.g. "6:00–7:30 PM"; null when unscheduled) |
| `Room` | text | `room` (e.g. "Soda 306"; null when TBD/virtual) |

**Partner Inquiries table** (`PARTNER_INQUIRIES_TABLE`) — the only table the site **writes** to. `app/api/partner-inquiry/route.ts` creates one row per Partners-page form submission; officers read leads directly in the base.

| Airtable column | Type | Notes |
|---|---|---|
| `Name` | text | required |
| `Company` | text | required |
| `Email` | text | required; loosely validated |
| `Interest` | single select | from `content/offerings.json` titles, or "Something else"; blank → "Not specified" |
| `Message` | long text | required |

The route writes with `typecast: true`, so adding an offering to `content/offerings.json` creates the matching single-select option automatically — no need to edit the base's field options first.

**This route is why the site can no longer be statically exported.** It runs at request time (`ƒ /api/partner-inquiry` in the build output); everything else still prerenders. That's fine on Vercel, but moving to OCF/GitHub Pages (`output: 'export'`) would require swapping it for a third-party form endpoint such as Formspree.

If any of the three inquiry env vars are missing the route returns HTTP 503 and the form surfaces its `mailto:` fallback — it deliberately does **not** report a false success. Unlike the read paths there is no local JSON fallback, since a dropped lead can't be recovered later. Submissions are unauthenticated writes, so the honeypot and the server-side length caps in `LIMITS` are the only things standing between the base and junk rows; keep them in sync with the form's `maxLength` attributes.

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
- **`content/committees.json`**: Acadev's and Consulting's `"lead"` fields are `"TODO: Committee Lead"`; Consulting's `"description"` is still draft copy (marked with a leading `TODO:` sentence that is stripped before rendering); Acadev has no `"description"` at all, so its "What we do" column is just focus-area chips beside a tall photo placeholder and reads thin — it needs a real write-up
- **Committee photos**: Consulting and Acadev have `"workImage": null`, so their "What we do" section shows the "Photo to come" placeholder. Add a portrait 2:3 photo per committee (see "Adding a committee photo" above)
- **Social Good activities**: all three "How we spend our time" tiles are placeholders — every `image` is `null`, and each `body` is draft copy marked with a leading `TODO:`. Confirm the three activities and their descriptions with the committee lead (in particular what "decking" should say), then add one landscape 4:3 photo per tile
- **`content/projects.json`**: only used as a fallback now — real project data lives in Airtable (`CONSULTING_PROJECTS_TABLE`, `SOCIAL_GOOD_PROJECTS_TABLE`). Some Consulting Projects rows currently have blank `Project Name`/`Client` cells, and `Tech Stack` appears empty on every row checked so far — worth a pass in Airtable
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
