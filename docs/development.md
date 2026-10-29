# Development guide

For people changing the site's code. If you only need to change text or photos,
see [`content/README.md`](../content/README.md) instead.

## How the code is organized

```
app/                      One folder per URL (Next.js App Router)
  layout.tsx              Fonts, site-wide metadata, Nav, Footer
  page.tsx                /            (Home)
  about/ join/ partners/
  decal/ contact/         /about, /join, …
  [id]/page.tsx           /acadev, /consulting, /social-good — one template for every committee
  styleguide/             /styleguide  — colors, type, buttons (hidden from search engines)
  api/partner-inquiry/    The Partners form endpoint (writes to Airtable)
  globals.css             Design tokens (colors, gradients) and the few custom CSS rules
  sitemap.ts, robots.ts   SEO
  icon.png, apple-icon.png, favicon.ico   Browser tab icons (Next picks these up automatically)

components/               Reusable UI pieces (see the table below)

lib/
  content.ts              THE import for content: page copy, lists, and Airtable data
  airtable.ts             Airtable fetchers + their fallbacks (server only)
  types.ts                Shapes of all content
  site.ts                 Site-wide settings from content/site.json
  logoTint.ts             Picks a soft card color from a partner's logo palette
  generated/              Written by scripts — don't edit by hand

content/                  All site text and lists (JSON) — see content/README.md
public/                   Files served as-is: brand/, icons/, images/<page>/, airtable/ (generated)
assets/                   NOT served: original full-size photos and brand masters
scripts/                  mirror-airtable.mjs (build step), prepare-photo.mjs (npm run photo)
docs/                     This guide, Airtable, deployment
```

### Data flow

```
content/*.json ─┐
                ├─> lib/content.ts ──> app/**/page.tsx ──> components/
Airtable ──> lib/airtable.ts ─┘
```

Components receive content as props or import it from `@/lib/content`. They never
import JSON files directly, and no page text is written inside a component — so
every word on the site can be found in `content/` (or Airtable).

## Conventions

1. **No visible text in components or pages.** Put it in the page's
   `content/<page>/page.json`. Small interface labels (`aria-label="Next project"`)
   are fine to leave in code.
2. **Colors only in `app/globals.css`** as CSS variables, used through Tailwind
   classes (`text-primary`, `bg-surface`). Don't hardcode hex values in components.
   (Exception: `lib/logoTint.ts` computes colors from partner logos.)
3. **Server Components by default.** Add `"use client"` only for components that
   need state or browser APIs (carousels, the nav menu, the form). Never import
   `lib/airtable.ts` (or anything async from `lib/content.ts`) into a client component.
4. **Secrets stay server-side** in `.env.local` / Vercel — never commit them.
5. **The footer's independent-organization disclaimer is required** by the
   university. Don't remove it.
6. **Accessibility:** every image needs alt text (or `alt=""` if purely decorative);
   animations must respect `prefers-reduced-motion`; keep text contrast at WCAG AA.
7. Keep components small and readable. A little duplication beats a confusing abstraction.

## Components

| Component | What it is |
|---|---|
| `PageHero` | Green banner at the top of About, Join, Partners, DeCal, Contact |
| `Section` | Standard section: header + content in the page column. `firstOnPage`, `seam`, `compact`, `centered`, `size="sm"` |
| `SectionHeader` | The "(01) — Eyebrow / Heading / subtext" block, for sections with custom layouts |
| `RichText` | Renders `**bold**` and `[links](…)` in strings from content files |
| `EditorialButton` | The site's button. Variants: `solid`, `outline`, `inverse`, `inverse-outline`; `size="large"`; `external` for new-tab links |
| `RevealOnScroll` | Fades content up as it scrolls into view |
| `Nav`, `Footer` | Site chrome, driven by `content/site.json` |
| `Hero`, `HomeMission`, `HomeStats`, `HomePaths` | Home page sections |
| `StatCounter` | Count-up number |
| `LogoCarousel` | Scrolling partner logo strip (Partners page) |
| `CommitteeCard` | Committee card on the About page |
| `CommitteePhoto` | Framed photo beside a committee's "What we do" (optional carousel via `workImages`) |
| `CommitteeActivities` | "How we spend our time" tiles |
| `ProjectCarousel`, `ProjectCard`, `ProjectModal` | Project cards and their "See more" popup |
| `Gallery` | About page's two-row drifting photo strip |
| `EventCarousel` | About page's event tiles |
| `ExecCard` | Exec board card |
| `RecruitmentTimeline` | Join page's horizontal timeline (sizing lives in `.timeline-*` CSS in `globals.css`) |
| `InterviewResources`, `NewbieExperience` | Join page sections |
| `ProjectTimeline` | Partners page's clickable five-stage timeline |
| `PartnerInquiryCard`, `PartnerInquiryForm` | Partners page inquiry form |
| `OfferingIcon` | Icons for the Partners "Ways to partner" cards |
| `PhotoPlaceholder` | "Photo to come" fill for missing photos |
| `NodeGraph` | Decorative particle network behind the home hero |

## Common tasks

**Add a page:** create `app/<name>/page.tsx` and `content/<name>/page.json`,
export the JSON from `lib/content.ts` (`export const namePage = …`), add a nav
entry in `content/site.json` if it should be linked, and add the path to
`app/sitemap.ts`.

**Add a committee:** add an entry to `content/committees/committees.json`. Its
page, nav dropdown entry, About card, and sitemap entry are created automatically.
The `id` becomes the URL and must not clash with another page (`about`, `join`, …).
If it has projects in Airtable, add a table fetch in `getProjects()` in
`lib/airtable.ts`. `CommitteeCard` has a per-committee accent color map — add one
there too (it falls back to Acadev's).

**Add a field to a content file:** add it to the JSON, add it to the matching
type in `lib/types.ts`, then use it. TypeScript will flag anything you missed.

## Design system

Brand colors (in `app/globals.css`):

| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#0C706E` | Deep teal — buttons, links, eyebrows (AA on white) |
| `--color-primary-bright` | `#1D8C89` | Large headings and decoration only |
| `--color-accent` | `#8FB573` | Sage — decorative only, never small text (use `--color-accent-ink` for text) |
| `--color-ink` / `--color-muted` | `#0B1D1C` / `#5A6B68` | Body text / secondary text |
| `--color-surface` / `--color-border` | `#F5F8F7` / `#E2E8E6` | Panels / hairlines |

Layout patterns:
- Page column: `mx-auto max-w-6xl px-6 md:px-8 lg:px-12` (Nav, Footer, and the home hero use `max-w-[1200px]`).
- Every page opens with a hero that slides under the fixed nav (`-mt-16 pt-16`),
  and wraps everything below it in one `fade-between-gradients` div, so sections
  must stay transparent.
- Section header: `(01) — Eyebrow` (11px, uppercase, tracked, `text-primary`) →
  light-weight `clamp()` heading → muted subtext.
- Fonts: Poppins for page content, Inter for Nav/Footer, IBM Plex Mono for small
  labels and stat numbers.

See `/styleguide` on a running site for swatches and buttons.

## Gotchas

- **`TODO:` notes in copy** are stripped by `stripTodo()` up to the first period —
  keep them to one sentence with no internal periods.
- **Recruitment timeline colors** step through `--tl-ramp-0…5` in `globals.css`.
  The dates are printed in white on them, so every stop must stay dark enough for
  4.5:1 contrast.
- **Favicon:** every frame of `app/favicon.ico` must be RGBA, or the build fails
  with "The PNG is not in RGBA format". Masters are in `assets/brand/`.
- **SVGs** go through a plain `<img>`, not `next/image` (which blocks SVG by default).
- **Animated GIFs** from Airtable are converted to MP4 by the mirror script
  (needs the optional `ffmpeg-static` package; it falls back to the GIF if missing).
- **Airtable quota:** if the monthly API cap is hit, local pages hang ~1 minute.
  Remove `AIRTABLE_TOKEN` from `.env.local` to use the fallbacks.

## Checks before you push

```bash
npm run lint
npm run typecheck
npm run build     # or, without spending Airtable calls: AIRTABLE_TOKEN= AIRTABLE_BASE_ID= npx next build
```
