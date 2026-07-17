# CLAUDE.md

Context for Claude Code working on the **Data Science Society (UC Berkeley)** website.
Read `PLAN.md` for the full brief, audiences, page specs, and phased task list. This file is the always-on ruleset.

## What we're building
A clean, modern, mostly-static marketing site for a top Berkeley data science club. Two audiences: prospective student members and industry partners. Static now; advanced features deferred. Optimize for **maintainability by future student officers**, not cleverness.

## Stack
- **Next.js (App Router) + TypeScript** + **Tailwind CSS**.
- Server Components by default; mark interactive leaves with `"use client"` (StatCounter, Gallery, mobile nav, typing hero).
- Content in local **JSON** under `content/` (optional MDX for long-form), plus `data/` for stats and the Airtable fallback.
- Partner logos read from **Airtable** via the REST API at build time, with a local JSON fallback.
- Images via `next/image`. Deploy: Vercel via GitHub auto-deploy.

> If migrating to Astro later: keep the same tokens, content layer (`lib/content.ts`), components, and sitemap. Only data-fetching and file extensions change.

## Project structure
```
app/
  layout.tsx            root layout: fonts, metadata, Nav, Footer
  globals.css           Tailwind + design tokens (CSS variables)
  page.tsx              home
  about/page.tsx  committees/page.tsx  projects/page.tsx
  partners/page.tsx  join/page.tsx  contact/page.tsx
  sitemap.ts
components/             Nav, Footer, Hero, Section, Button, StatCounter*, LogoCarousel,
                        CommitteeCard, ProjectCard, ExecCard, Testimonial, DualCTA, Gallery*
                        (* = "use client")
lib/content.ts          the ONLY place that knows where data comes from
content/                committees.json, projects.json, testimonials.json
data/                   stats.json, partners.json (Airtable fallback)
public/                 images, logos, favicon
.nvmrc                  pinned Node version (e.g. 20)
.env.example            committed template listing required env vars (no real values)
.env.local              real secrets — gitignored, never committed
```

## Hard rules
1. **No hardcoded content in components.** Everything flows through `lib/content.ts`.
2. **Colors only in `app/globals.css`** (CSS variables) and the Tailwind theme that references them. Never inline hex values in components.
3. **`getPartners()` runs server-side only**, must try the Airtable REST API, then fall back to `data/partners.json` in a try/catch. A failed fetch must never break the build.
4. **Secrets stay server-side.** `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE` are env vars, never imported into client components. Commit `.env.example` (names only); never commit `.env.local`. `.gitignore` covers `node_modules/`, `.next/`, `.env.local`.
5. **Default to Server Components.** Add `"use client"` only to genuinely interactive leaves.
6. **Placeholder content** is expected — mark it `TODO`. Use realistic but clearly fake copy and images.
7. **Footer must include** the Berkeley independent-org disclaimer (see PLAN §8). Don't remove it.
8. Keep components small, named clearly, readable by a beginner. Prefer duplication over a confusing abstraction.

## Brand (sampled from the logo)
Teal → sage-green gradient. Tokens:
- `--color-primary: #0C706E` (deep teal) — OK for body text/links (5.9:1 on white).
- `--color-primary-bright: #1D8C89` (teal) — large headings/decoration only (4.1:1).
- `--color-accent: #8FB573` (sage) — decorative only, never small text on white.
- `--gradient-brand: linear-gradient(135deg, #0C706E 0%, #1D8C89 45%, #AAC48E 100%)` — hero, dividers, highlights.
- Ink `#0B1D1C`, muted `#5A6B68`, surface `#F5F8F7`, border `#E2E8E6`.

The node-graph icon and the gradient are the signature — reuse the node-graph as a subtle accent, apply the gradient to the hero/dividers rather than everywhere. Generate the favicon from the logo.

## Design intent
Whitespace-heavy; eyebrow → heading → body → action pattern. Modern grotesk headings, Inter body, a **monospace** for small eyebrow labels and stat numbers (the "data science" accent). Subtle, tasteful motion only; respect `prefers-reduced-motion`. WCAG AA contrast; alt text on every image.

## Environment & getting started
This is a Node/React project — there is **no Python virtualenv**. The "environment" is local Node + `node_modules` (created by `npm install`) + env vars in `.env.local`.

First-time setup:
```bash
nvm use                          # match the Node version in .nvmrc (install Node 20 LTS if needed)
npm install                      # creates node_modules/ (the project's dependency sandbox)
cp .env.example .env.local       # then fill in real values (Airtable etc.); .env.local is gitignored
npm run dev                      # http://localhost:3000
```

Pin the environment so every officer is reproducible:
- `.nvmrc` with the Node version (e.g. `20`) and an `engines` field in `package.json`.
- Commit `.env.example` (variable names only, no secrets). Never commit `.env.local`.
- `.gitignore` must include `node_modules/`, `.next/`, `.env.local`.

Commands:
```bash
npm run dev      # local dev server
npm run build    # production build (Airtable fetched here)
npm run start    # serve the production build
# For static hosting (OCF/GitHub Pages): set output: 'export' in next.config + images unoptimized
```

## Airtable setup (Phase 5)
- Base table `Partners`: `Name`, `Logo` (attachment), `Website`, `Featured` (checkbox), `Order` (number).
- Fetch with `fetch(url, { headers: { Authorization: \`Bearer \${TOKEN}\` }, next: { revalidate: 3600 } })`.
- Set env vars in `.env.local` (gitignored) and in Vercel project settings.
- Add an Airtable automation → Vercel **deploy hook URL** so logo edits can trigger a rebuild.

## Working approach
- Build in the phase order from `PLAN.md` (0 → 6). Confirm each phase renders before moving on.
- When unsure about copy, content shape, or a club-specific detail, leave a `TODO` rather than inventing facts about the club.
- **Always update `README.md`** after any structural change: new pages, new components, new content fields, new env vars, or changes to data sources. The README is the primary reference for future editors.
