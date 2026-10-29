# CLAUDE.md

Context for AI coding assistants working on the **Data Science Society (UC Berkeley)** website.
Read `README.md` first, then `docs/development.md` for architecture and conventions.

## What this is
A mostly-static Next.js (App Router) + TypeScript + Tailwind v4 marketing site, deployed on
Vercel. Two audiences: prospective student members and industry partners. It is maintained
by student officers who change every year — **optimize for maintainability by beginners,
not cleverness.**

## Where things live
- `content/` — ALL user-visible text, links, and lists, as JSON, one folder per page.
  `content/site.json` holds site-wide settings (sign-up links, emails, socials, nav).
  `content/README.md` is the editor's map — keep it accurate.
- `lib/content.ts` — the only import surface for content (page copy, lists, and
  re-exported Airtable fetchers). `lib/airtable.ts` — Airtable fetchers with fallbacks.
  `lib/types.ts` — content shapes. `lib/site.ts` — typed access to `content/site.json`.
- `public/images/<page>/` — web-sized photos. `assets/photo-originals/<page>/` — originals.
- `docs/` — development, Airtable, and deployment guides.

## Hard rules
1. **No user-visible copy in components or pages.** Add it to the page's
   `content/<page>/page.json` (or a list file) and read it via `@/lib/content`.
   Inline formatting in copy uses `**bold**` and `[label](url)`, rendered by `RichText`.
2. **Components never import JSON directly** — only through `lib/content.ts` / `lib/site.ts`.
3. **Colors only in `app/globals.css`** (CSS variables → Tailwind classes). No hex in components.
4. **Airtable is server-side only** and every fetcher must fall back (JSON or `[]`) inside a
   try/catch — a failed fetch must never break the build. Never import `lib/airtable.ts`
   into a `"use client"` component.
5. **Secrets stay in `.env.local` / Vercel.** Commit `.env.example` (names only).
6. **Server Components by default**; `"use client"` only for genuinely interactive leaves.
7. **Footer disclaimer is required** (independent student org). Don't remove it.
8. Don't invent facts about the club. If copy is unknown, leave a `TODO:` note (one sentence,
   no internal periods — see `stripTodo` in `lib/content.ts`) rather than making something up.
9. **Never kill the user's dev server** (`npm run dev` on port 3000). Next hot-reloads; if a
   change needs a restart (`next.config.ts`, `.env.local`, new package), tell the user. If
   3000 is busy, use another port.
10. **Mind the Airtable API quota.** Builds cost ~13 calls. To verify a build without spending
    quota: `AIRTABLE_TOKEN= AIRTABLE_BASE_ID= npx next build`.

## After structural changes
Update the relevant doc: `content/README.md` (new content files/fields), `docs/development.md`
(components, architecture), `docs/airtable.md` (tables, env vars), `README.md` (setup, commands).

## Checks
`npm run lint`, `npm run typecheck`, and a build must pass before handing work back.
