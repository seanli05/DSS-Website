# Data Science Society at UC Berkeley — Website

The website for [Data Science Society (DSS)](https://www.dssberkeley.org), UC
Berkeley's first undergraduate data science organization. It introduces the club
to prospective members, showcases our committees and client projects, and gives
industry partners a way to reach us.

Built with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS,
with some content managed in Airtable. Hosted on Vercel.

**Pages:** Home · About · Committees (Acadev, Consulting, Social Good) · DeCal ·
Partners · Join · Contact

---

## I just want to change some text or a photo

You don't need to touch any code. **Every word on the site lives in
[`content/`](content/)**, organized by page:

```
content/
  site.json        ← links, emails, socials, nav — update sign-up links here each semester
  home/  about/  committees/  join/  partners/  decal/  contact/
```

Open [`content/README.md`](content/README.md) — it has a table of exactly which
file controls which part of the site, a checklist for the start of each semester,
and how to add photos.

You can edit these files directly on GitHub (open the file → pencil icon →
commit). The site redeploys automatically a minute or two later. If you break the
JSON formatting, the deploy fails and the live site stays as it was — check the
error in Vercel, fix it, and commit again.

Some sections (projects, exec board, partner logos, events, recruitment timeline)
are edited in **Airtable** instead, and need a [rebuild](docs/deployment.md#rebuilding-after-content-changes)
to show up.

---

## Running the site on your computer

You'll need [Node.js 20](https://nodejs.org) (if you use `nvm`, run `nvm use`).

```bash
git clone <this repo>
cd DSS-Website
npm install
cp .env.example .env.local   # optional: add Airtable keys (ask the current webmaster)
npm run dev                  # → http://localhost:3000
```

Without Airtable keys the site still runs, using sample/fallback data for the
Airtable-backed sections.

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with live reload |
| `npm run build` | Production build (downloads Airtable images first) |
| `npm run start` | Serve the production build |
| `npm run lint` / `npm run typecheck` | Code checks — run before pushing |
| `npm run photo -- <in> <out.jpg>` | Resize/crop a photo for the site ([details](content/README.md#photos)) |
| `npm run mirror` | Re-download Airtable attachments only |

---

## How the project is organized

```
app/          Pages — one folder per URL. app/[id] is the shared committee page.
components/   Reusable UI pieces (hero, sections, cards, carousels, nav, footer)
content/      All text and lists, as JSON — start here for edits
lib/          content.ts is the one place pages get data from; airtable.ts fetches Airtable
public/       Files served as-is: brand/, icons/, images/<page>/
assets/       Full-size original photos and logo masters (not served)
scripts/      Build-time Airtable image mirroring; the photo resizing tool
docs/         Guides for developers (below)
```

## Documentation

| Read this | If you want to |
|---|---|
| [`content/README.md`](content/README.md) | Change text, links, lists, or photos |
| [`docs/development.md`](docs/development.md) | Change code: architecture, components, conventions, design system |
| [`docs/airtable.md`](docs/airtable.md) | Understand or change the Airtable tables |
| [`docs/deployment.md`](docs/deployment.md) | Deploy, rebuild, set up the domain, hand over accounts |
| [`CLAUDE.md`](CLAUDE.md) | Instructions for AI coding assistants working in this repo |

## Handing the site over

At the end of your term, walk your successor through:

1. **Access** — GitHub repo, Vercel project, Airtable base, and the domain
   registrar. These should belong to club accounts, not personal ones
   ([checklist](docs/deployment.md#keeping-the-site-in-the-clubs-hands)).
2. **The semester checklist** in [`content/README.md`](content/README.md#every-semester).
3. **Open TODOs** — search the repo for `TODO` to find copy still waiting on
   confirmation from leadership.

---

DSS is a student group acting independently of the University of California.
