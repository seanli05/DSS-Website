# Data Science Society — Website Revamp Plan

This is the project brief for rebuilding the Data Science Society (DSS) website at UC Berkeley.
Hand this file (and `CLAUDE.md`) to Claude Code and build phase by phase.

---

## 1. Goals & audience

**Why we're rebuilding:** the current site feels dated and doesn't reflect DSS as one of Berkeley's leading data science clubs.

**Primary audiences (design for both):**

1. **Talented Berkeley students** — convince them DSS is the place to be, and make it obvious how to join.
2. **Industry partners** — show credibility (past work, partner logos, project quality) and make it easy to start a conversation.

**Success looks like:** a clean, modern, fast site that a new student "gets" in 10 seconds, and that a recruiter or partner takes seriously. Mostly static content now; "cooler" features (filtering, blog, member portal) are explicitly deferred.

**Non-goals (for v1):** no CMS dashboard, no auth, no member login, no databases beyond a lightweight Airtable read for logos. Keep it simple and maintainable by future officers.

---

## 2. Vibe & references

Both references are clean, minimal, whitespace-heavy, sans-serif, with eyebrow labels and partner-logo walls.

- **ML@B** (`coral-partners-321934.framer.app`): bold one-line hero + dual CTAs, "Past Industry Partners" logo wall, three themed sections each with eyebrow + heading + blurb + link, apply CTA, footer with the standard Berkeley independent-org disclaimer.
- **Codebase** (`codebase.studentorg.berkeley.edu`): typing-animation hero, animated stat counters, horizontal "glimpse into our community" gallery, projects grouped with partner logos + tags, two-column "For Companies / For Students" split, testimonial carousel, OCF hosting badge + disclaimer.

**What we're borrowing:** the dual-audience split, the partner-logo wall, eyebrow labels, stat counters, project cards with tags, lots of whitespace. **What we're keeping our own:** a "data science" personality driven by the logo's node-graph motif and teal→green gradient, plus a monospace accent font for labels and stats.

---

## 3. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | React (your request), with static generation for SEO + fast loads. Server Components fetch data at build time. File-based routing. |
| Styling | **Tailwind CSS** | Fast, consistent, design tokens centralized. |
| Interactivity | React **client components** (`"use client"`) | Typing hero, stat counters, mobile nav, gallery — small and isolated. |
| Content | Local **JSON** (+ optional **MDX** for long-form) read through one content layer | Edit a project/committee by editing one file. Git history = change log. |
| Partner logos | **Airtable** (read at build time) via a swappable content function | Non-technical officers can update the logo wall without touching code. |
| Images | `next/image` | Automatic optimization + responsive sizing. |
| Hosting | **Vercel** (GitHub auto-deploy) | First-class Next.js support, ISR, deploy hooks. Free tier is plenty. |
| Alt hosting | OCF / GitHub Pages via `output: 'export'` | Free Berkeley static option; loses ISR + image optimization (use `unoptimized`). Codebase uses OCF. |

**Why Next.js specifically (vs. plain Vite + React):** the site needs to be found by students and recruiters, so server-rendered/static HTML for SEO matters, and building the partner-logo wall from Airtable is cleanest as a build-time fetch in a Server Component. A client-only Vite SPA would render content in JS and weaken both. If you ever want the simplest possible thing and don't care about SEO, Vite + React works — but Next is the right call here.

> If the team later prefers a content-first, near-zero-JS approach, **Astro** is the natural alternative. The architecture below (centralized tokens, the `lib/content.ts` data layer, the same sitemap and components) carries over directly — only data-fetching and file extensions change.

---

## 4. Sitemap

Keep the top nav lean. `Join` is the primary CTA (visually distinct).

```
/                 Home
/about            Who we are, mission, stats, community gallery, leadership
/committees       What the committees do (cards; detail pages can come later)
/projects         Past projects, grouped, with partner + tags
/partners         Value prop for industry + logo wall + how to partner
/join             For students: why join, timeline, application links
/contact          Email + socials + simple contact info
```

Nav: **About · Committees · Projects · Partners · [Join]**
(Team/members live inside `/about` for v1; promote to `/team` later if needed.)

---

## 5. Page-by-page content spec

Use placeholder copy and images everywhere (`TODO` markers). Each section below is a component.

### Home (`/`)
1. **Nav** — logo left, links right, `Join` as a filled button. Sticky, subtle shadow on scroll.
2. **Hero** — one strong line (e.g. "We turn Berkeley students into data scientists.") + 1-sentence subhead + two CTAs (`Join DSS` / `Partner with us`). Optional typing animation; lean on the teal→green gradient and/or the node-graph motif as the visual.
3. **Mission strip** — 2–3 sentences on what DSS is.
4. **Stats** — animated counters (e.g. *N* members · *N* projects · *N* partners · *N* years). Pull from `stats` data.
5. **Partner logo wall** — grayscale logos, color on hover. **Sourced from Airtable.**
6. **Committees preview** — 3–6 cards, link to `/committees`.
7. **Featured projects** — 2–3 project cards, link to `/projects`.
8. **Dual CTA** — split section: "For Students → Join" and "For Partners → Work with us".
9. **Footer** — socials, nav columns, **Berkeley independent-org disclaimer** (required, see §8).

### About (`/about`)
Story/mission, values (3–4 cards), stats, "glimpse into our community" photo gallery (horizontal scroll), leadership grid (officer cards: photo, name, role, links).

### Committees (`/committees`)
Intro + one card per committee: name, icon, 1–2 sentence blurb, focus areas, optional lead. (Detail pages = later phase.)

### Projects (`/projects`)
Grid of project cards: title, semester/year, partner (logo or name), tags (e.g. `Computer Vision`, `NLP`, `Consulting`), short description, optional thumbnail/link. Group by type or semester. (Filtering = later phase.)

### Partners (`/partners`)
Value prop for industry (talent access, consulting, research), the logo wall again, "how to partner" steps, and a clear contact CTA / email.

### Join (`/join`)
Why join, what you'll do, recruitment timeline (Fall/Spring), application links/forms, FAQ.

### Contact (`/contact`)
Email, socials, location/meeting info. A real form is optional for v1 — a `mailto:` or embedded Google Form is fine to start.

---

## 6. Design system

All tokens live in **one** place (`app/globals.css` as CSS variables + the Tailwind theme that references them). Change colors there only.

**Color — sampled from the DSS logo (teal → sage-green gradient):**

```css
/* app/globals.css */
:root {
  --color-bg:             #FFFFFF;
  --color-surface:        #F5F8F7;  /* faint cool off-white for alt sections */
  --color-ink:            #0B1D1C;  /* primary text, near-black teal-tinted */
  --color-muted:          #5A6B68;  /* secondary text */
  --color-border:         #E2E8E6;

  --color-primary:        #0C706E;  /* deep teal (logo top) — OK for body text/links (5.9:1) */
  --color-primary-bright: #1D8C89;  /* teal (logo mid) — large headings/decoration only (4.1:1) */
  --color-accent:         #8FB573;  /* sage green (logo bottom) — decorative only, NOT text */

  /* signature brand gradient — hero, dividers, logo, stat highlights */
  --gradient-brand: linear-gradient(135deg, #0C706E 0%, #1D8C89 45%, #AAC48E 100%);
}
```

> **Contrast rules (WCAG AA):** `--color-primary` (#0C706E) passes for normal body text and links on white. `--color-primary-bright` (#1D8C89) is for large headings/decoration only. `--color-accent` (sage) and the gradient are decorative — never use them for small text on white. Always check any text-on-color pair with a contrast checker.

**Typography:**
- Headings: a modern grotesk — **Inter** (safe) or something with more character like **General Sans** / **Satoshi**.
- Body: **Inter**.
- Eyebrow labels & stats: a **monospace** (**IBM Plex Mono** or **JetBrains Mono**) for the "data science" personality. Use sparingly: small, uppercase, letter-spaced labels above headings.

**Layout & spacing:**
- Container max-width ~1200px, comfortable side padding.
- Generous vertical rhythm between sections (96–128px on desktop).
- Eyebrow → heading → body → action is the repeating section pattern.

**Logo & motif:** the node-graph icon and the gradient are the brand's signature — reuse the node-graph as a subtle background/section accent, and apply the gradient to the hero and key dividers rather than flooding the page with it. Generate the favicon from the logo.

**Components to build (in `components/`):**
`Nav`, `Footer`, `Hero`, `Section` (wrapper with eyebrow/heading/optional bg), `Button`, `StatCounter` (client), `LogoWall`, `CommitteeCard`, `ProjectCard`, `OfficerCard`, `Testimonial`, `DualCTA`, `Gallery` (client).

---

## 7. Content model & the Airtable backend

**Principle:** components never fetch data directly. They call functions from a single content layer (`lib/content.ts`). Start with local files; swap the source later without touching any component. This is what makes Airtable (or any future backend) a one-file change.

```
content/
  committees.json   (name, blurb, icon, lead, focusAreas[])
  projects.json     (title, semester, partner, tags[], description, image?, link?)
  team.json         (name, role, photo, links{})
  testimonials.json (quote, name, org, role)
  *.mdx             (optional, for long-form pages later)
data/
  stats.json        (label, value, suffix?)
  partners.json     ← local fallback; live data comes from Airtable
```

```ts
// lib/content.ts — the only place that knows WHERE data lives
import committees from "@/content/committees.json";
import projects from "@/content/projects.json";
// ...

export function getCommittees()  { return committees; }
export function getProjects()    { return projects; }
export function getTeam()        { /* return team.json */ }
export function getStats()       { /* return stats.json */ }

export async function getPartners() {
  // TODAY: return require("@/data/partners.json")
  // LATER: fetch Airtable REST API, fall back to partners.json on any error
}
```

Pages are Server Components, so they can call these directly (e.g. `const partners = await getPartners()` in `app/partners/page.tsx`). Mark only the interactive leaves (`StatCounter`, `Gallery`, mobile nav, typing hero) as `"use client"`.

**Airtable plan (for the partner logo wall):**
- One Airtable base, table `Partners` with fields: `Name`, `Logo` (attachment), `Website` (url), `Featured` (checkbox), `Order` (number).
- **Fetch via the Airtable REST API using `fetch`** (not the SDK) so Next can statically render at build and, on Vercel, optionally refresh with ISR: `fetch(url, { headers, next: { revalidate: 3600 } })`.
- Keep `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE` in env vars / Vercel project settings — **never** in client code. `getPartners()` runs server-side only.
- **Always wrap the fetch in try/catch and fall back to `data/partners.json`** so a bad token or Airtable outage can never break the build.
- **Auto-refresh without code:** ISR (above) refreshes logos hourly on Vercel; or add an Airtable automation that hits a **Vercel deploy hook URL** to rebuild on demand. (For static export hosting like OCF, use the deploy hook — ISR isn't available.)

> Honest tradeoff: Airtable adds one external dependency. If you'd rather not, committing logo files + editing `partners.json` works fine and is even simpler. The content-layer design means you can start local and adopt Airtable later for free.

---

## 8. Compliance, SEO, accessibility

- **Required disclaimer** in the footer (standard for Berkeley student orgs):
  *"We are a student group acting independently of the University of California. We take full responsibility for our organization and this website."*
- **SEO:** per-page metadata via Next's `metadata` export (title + description), Open Graph image, `sitemap.ts`, favicon from the logo.
- **Accessibility:** semantic HTML, alt text on every logo/photo, AA color contrast (see §6 rules), visible focus states, keyboard-navigable nav and gallery, respect `prefers-reduced-motion` (typing/counter animations degrade gracefully).
- **Performance:** `next/image` for all images, lazy-load below-the-fold, keep client JS minimal (Server Components by default).

---

## 9. Build phases (hand to Claude Code in order)

**Phase 0 — Scaffold & environment**
`create-next-app` (App Router + TypeScript + Tailwind). Pin the environment for reproducibility: add `.nvmrc` (Node 20 LTS) + an `engines` field in `package.json`, a committed `.env.example` (variable names only), and a `.gitignore` covering `node_modules/`, `.next/`, `.env.local`. Then add `CLAUDE.md`, set up tokens in `app/globals.css` + Tailwind theme, build `Nav` + `Footer`, root layout, and all page routes as stubs. (No Python virtualenv — this is a Node project; `npm install` creates the local `node_modules/` sandbox.)

**Phase 1 — Design system**
Fonts, color tokens, `Section`, `Button`, container, the eyebrow→heading→body pattern, gradient + node-graph motif usage. One `/styleguide` page to eyeball primitives.

**Phase 2 — Home page**
All home sections with placeholder content: Hero, Mission, Stats, LogoWall (local data for now), Committees preview, Featured projects, DualCTA. Responsive.

**Phase 3 — Remaining pages**
About, Committees, Projects, Partners, Join, Contact — placeholder content + images.

**Phase 4 — Content layer**
Add `content/*.json` + `data/*.json`, implement `lib/content.ts`, wire every page to read through it. No hardcoded content left in components.

**Phase 5 — Airtable**
Implement `getPartners()` with the Airtable REST fetch + JSON fallback + ISR, env vars, and the deploy-hook automation. Document setup in `CLAUDE.md`.

**Phase 6 — Polish & ship**
Responsive pass, accessibility pass, metadata/OG/sitemap, favicon, the disclaimer, deploy to Vercel with GitHub auto-deploy.

**Phase 7 — Later ("cooler features")**
Project tag filtering, blog (MDX or Medium/Substack embed), committee detail pages, member directory, richer animations.

---

## 10. Maintainability notes for future officers

- To **add a project/committee/officer:** edit one JSON file in `content/` — no component changes.
- To **update partner logos:** edit Airtable (or `data/partners.json`); site rebuilds/refreshes automatically.
- To **rebrand colors:** edit the tokens in `app/globals.css` only.
- To **change copy:** text lives in the page files / content JSON, clearly marked.
- Keep it boring and readable on purpose. Resist clever abstractions; the next officer may be a sophomore touching a website for the first time.
