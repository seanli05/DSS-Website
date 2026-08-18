# DSS Website — Deployment Handoff

**Last updated:** 2026-08-18
**Purpose:** Self-contained context for continuing the deployment of this site to `dssberkeley.org`. Written to be handed to a fresh conversation with no prior context.

---

## TL;DR — where things stand

| | Status |
|---|---|
| Vercel deployment | ✅ **Live and verified** at https://dss-website-fawn.vercel.app |
| Airtable connection | ✅ Working — real data, not fallbacks |
| **Airtable image expiry** | ✅ **FIXED** — attachments mirrored locally at build time (§3) |
| `merge-acadev` branch | ⚠️ Conflicts resolved, **uncommitted**, mid-merge |
| Redirects (old Squarespace + moved routes) | ✅ Done — `next.config.ts` |
| `metadataBase`, `sitemap.ts`, `robots.ts` | ⬜ Not started |
| Rebuild cadence | ✅ **Manual by design** — no cron (§5e) |
| Domain cutover to `dssberkeley.org` | ⬜ Not started — old Squarespace site still live |

**Next action:** push the current work, then `metadataBase` + `sitemap.ts` + `robots.ts` (§5), then the domain cutover (§7).

---

## 1. Project basics

- **Stack:** Next.js 16 (App Router) + TypeScript + Tailwind v4, deployed on Vercel
- **Repo:** `git@github.com:seanli05/DSS-Website.git` (personal GitHub account — see §7)
- **Local path:** `/Users/seanli/Desktop/personal/DSS/DSS-Website`
- **Content layer:** `lib/content.ts` is the only file that knows where data comes from (JSON under `content/` + `data/`, plus Airtable)
- See `CLAUDE.md` for the always-on ruleset and `PLAN.md` for the original brief

### Routes currently built (13 pages)

```
/                    /about        /partners     /join
/contact             /styleguide   /_not-found   /api/partner-inquiry (dynamic)
/acadev              /consulting   /social-good
```

**Committee pages live at the site root** (`/acadev`), not under `/committees` — moved 2026-08-18 so the new URLs match the old Squarespace ones exactly. `/committees/*` 308-redirects to the new paths.

`app/[id]/page.tsx` is therefore a **root-level dynamic segment**. It sets `dynamicParams = false`, so only the committee ids from `committees.json` resolve and everything else 404s. When adding a committee, its `id` must not collide with an existing top-level route (`about`, `join`, `partners`, `contact`, `styleguide`, `api`) — Next resolves static routes first, so a committee called "about" would silently never render.

There is **no `/decal` route**; that content moved onto the Acadev page.

---

## 2. Phase A — Vercel deployment ✅ DONE

Deployed and verified on 2026-08-17.

**Verification performed:**
- All 9 public routes return HTTP 200
- `/join` renders the real Airtable recruitment timeline (no `fallback-` id markers)
- `/about` renders exec profiles (these return `[]` on Airtable failure, so their presence proves the connection)
- Partner logos served from `v5.airtableusercontent.com`, not local fallback paths
- `origin/main` builds clean from a fresh `npm ci` (verified in an isolated worktree)

**Env vars are set correctly in Vercel.** They should be **Production-only** — leave Preview and Development unchecked. Every fetcher in `lib/content.ts` falls back to committed JSON when env vars are missing, so preview/PR builds then cost **zero Airtable API calls** while still rendering every page. This is verified behavior, not a guess.

---

## 3. ✅ RESOLVED: Airtable attachment URLs expire

### What the problem was

Airtable's REST API returns attachment URLs that are **signed and expire a few hours after issue** (they then 410). This site fetches content at build time and bakes the results into static HTML, so the URLs died while the deployment lived on — every logo, headshot, project image, and event image broke a few hours after each deploy.

It was confirmed in production on 2026-08-18: the Airtable CDN returned **410 Gone**, and the same image through Next's optimizer returned **502** at every width. 54 Airtable images were broken; all 66 local `/public` images were fine.

Why it looked intermittent: browsers cache optimized copies, and `next/image` requests a different variant per viewport width, each a separate optimizer cache entry. So different people saw different subsets break, depending on what their device had already fetched.

### The fix, as implemented

**`scripts/mirror-airtable.mjs`** runs via the `prebuild` npm script (so, automatically before `next build`). It:

1. Exits quietly if there are no Airtable credentials — preview/dev builds then use the committed JSON fallbacks and cost 0 API calls
2. Scans all 6 tables for the 5 attachment fields
3. Downloads each attachment into `public/airtable/<attachmentId>.<ext>`
4. Converts animated GIFs to H.264 MP4 (see below)
5. Writes `content/airtable-manifest.json`, mapping attachment id → local path

**`lib/content.ts`** — `attachmentUrls()` prefers the mirrored local path, falling back to Airtable's signed URL for anything not in the manifest.

Keyed by **attachment id, not URL**: the signed URL changes on every fetch, so a URL-keyed manifest would miss on the very next build.

It runs **before** `next build`, not during, so the files are on disk when Next collects `public/`.

### Animated GIFs

`next/image` does not compress animated GIFs — it passes them through byte for byte. One project clip was a 10 MB download for anyone opening that modal. The mirror script now detects animated GIFs and transcodes them to H.264 (crf 31): **9.97 MB → 0.58 MB, 17.3× smaller**.

- `ffmpeg-static` is an **`optionalDependency`** on purpose. If its binary fails to install, `npm ci` still succeeds; the script logs a warning and serves the GIF as before. A video encoder must never be able to break the site's build.
- A failed conversion keeps the GIF rather than failing the build.
- `components/ProjectModal.tsx` renders `<video autoplay loop muted playsinline>` for `.mp4`/`.webm`, `<Image>` otherwise. Under `prefers-reduced-motion` it gets `controls` and stays paused.
- Officers change nothing — they still upload GIFs to Airtable.

### Verified

- 0 `v5.airtableusercontent.com` URLs in built output; 46 local paths baked in
- MP4 served as `video/mp4`, 604,868 bytes, with `206` range support and `moov` in the first 4 KB (starts before fully downloading)
- `public/airtable/` totals 49 MB across 46 files — **deployment payload, not page weight**: `next/image` serves resized WebP (one 11.75 MB PNG → 95 KB), 151 homepage images are `loading="lazy"`, and modal contents aren't in the HTML at all (`{isOpen && <ProjectModal/>}`)

### Maintenance notes

- `public/airtable/` is gitignored and regenerated every build; `content/airtable-manifest.json` is committed
- Adding a new Airtable attachment field means adding it to `SOURCES` in the mirror script — a field missing there still renders, but via an expiring URL
- The `remotePatterns` in `next.config.ts` are now only a fallback, not the normal path

---

## 4. Branch state

`origin/acadev` was merged and has landed in `origin/main` — the local `merge-acadev` branch has 0 unmerged commits and can be deleted.

Current branch is `final`, 1 commit ahead of `origin/main`.

### Still unmerged

| Branch | Ahead of origin/main | Note |
|---|---|---|
| `origin/final` | 1 | current working branch |
| `origin/manav` | 1 | small — Social Good images |
| `origin/sean` | 2 | was 20 behind with 17 conflicts including a modify/delete; almost certainly superseded — **confirm before spending effort** |

### Merge decisions worth preserving

From the acadev merge, in case anything looks odd later:

- **`Section.tsx`** — `indexSeparator` defaults to `" —"` **with a leading space**. It's appended directly after `(01)`, so without it every numbered eyebrow renders `(01)— Label`.
- **`ProjectCard.tsx`** — kept main's card design and grafted in acadev's cover-image support, rather than taking either side wholesale. DeCal projects have `partner: ""`, so main's monogram fallback alone would render an empty box.
- **`app/[id]/page.tsx`** — section ordering is Projects before Activities, with derived section numbering.
- **`getProjectsByCommittee()`** normalizes `oneLiner`/`brandColor`/`logoPalette` for the acadev JSON, which predates those required `Project` fields.

### Housekeeping still outstanding

- `.DS_Store` is **tracked in git** and should be removed + gitignored
- ~20 MB of stray untracked files in the repo root, referenced nowhere: `DSCF0233.JPG`, `IMG_5642.HEIC`, `IMG_5724 3.HEIC`, `ZSZ_7559.jpg`, `ZSZ_7638.jpg`, `Culture pics/`, `Newbie Experience/`
- 1 pre-existing eslint error in `components/RevealOnScroll.tsx` (`react-hooks/set-state-in-effect`). Next 16 does not run eslint during `next build`, so it does not block deploys.

---

## 5. Remaining pre-launch code

None of this is written yet. Suggested order:

### 5a. ✅ Airtable image mirroring — done (§3)

### 5b. ✅ Redirects — done, in `next.config.ts`

All 308s, verified returning the right target at runtime:

| Source | → | Why |
|---|---|---|
| `/committees/:id` | `/:id` | committee pages moved to the root |
| `/committees` | `/#committees` | old index has no equivalent |
| `/home` | `/` | Squarespace |
| `/joinus` | `/join` | Squarespace |
| `/socialgood` | `/social-good` | Squarespace |
| `/decalinfo` | `/acadev` | DeCal content now lives on the Acadev page |
| `/decal` | `/acadev` | route was removed |

`/acadev` and `/consulting` need **no redirect** — moving the committee pages to the root made the new URLs identical to the old Squarespace ones, which is the main reason that move was worth doing.

`/about` is unchanged on both sites.

### 5c. `metadataBase`

`app/layout.tsx` sets `openGraph.siteName` but **no `metadataBase`**. Without it, OG image URLs resolve relative and links shared in Slack/Discord render without previews. Set to `https://www.dssberkeley.org`.

### 5d. `app/sitemap.ts` and `app/robots.ts`

Neither exists. Exclude `/styleguide` from both — it's currently in the build output and would otherwise get indexed.

### 5e. Rebuilds are MANUAL — decided 2026-08-18

**No cron, no scheduled rebuild.** Deliberate: at 13 API calls per build a daily
schedule would spend ~390 calls/month purely on refreshing content that changes a
few times a semester. Nothing needs to be undone — the schedule was never built.

**The tradeoff, stated plainly:** editing Airtable does **not** update the live
site. Content only changes when someone triggers a build. Officers need to know
this or they'll edit a row and assume the site is broken.

**How to trigger a rebuild** (either works, no code required):

1. **Vercel dashboard** → Deployments → ⋯ on the latest → **Redeploy**.
2. **Deploy Hook** — Project Settings → Git → Deploy Hooks, create one targeting
   `main`. It gives a URL that triggers a build when POSTed to. Useful if you ever
   want a "refresh the site" button, or an Airtable automation that fires on edit.
   Note a browser visit won't do it: it must be a POST.

If someone later wants automation without the daily cost, an Airtable automation
pointed at the deploy hook rebuilds only when a record actually changes — far
cheaper than a fixed schedule, since the club edits content in bursts.

### 5f. Housekeeping

See §4 — tracked `.DS_Store`, stray root files, pre-existing lint error.

`CLAUDE.md` requires updating `README.md` after structural changes. Outstanding: the committee route move, the mirror script, and `content/airtable-manifest.json`.

---

## 6. Airtable API budget

The club is on a plan with a **monthly API call cap** — confirm the exact number in the Airtable workspace billing panel.

### Calls per full build: **13**

The image mirroring added a second pass over the tables. Both halves are needed: the prebuild pass gets the attachment URLs to download, the build pass gets the content.

| Pass | Tables | Calls |
|---|---|---|
| `prebuild` (mirror script) | consulting, social-good, acadev, external-events, logowall, exec-profiles | 6 |
| `next build` | `getProjects` (2), `getAcadevClientProjects`, `getExternalEvents`, `getPartners`, `getExecProfiles`, `getRecruitmentTimeline` | 7 |
| | **total** | **13** |

`memoizeOnce` (`lib/content.ts`) is module-level, so during the build pass each fetcher fires exactly once regardless of how many pages call it.

At 13/build, with **manual rebuilds only** (§5e), spend tracks how often you
deploy rather than a schedule:

| Activity | Builds/month | Calls |
|---|---|---|
| Pushes to `main` during active development | ~15 | ~195 |
| Manual content refreshes | ~4 | ~52 |
| **Typical total** | | **~250** |

A daily cron would have added ~390 on top of that, which is why it was dropped.
Preview and PR builds cost **0** (§2). Confirm the workspace's actual monthly cap
in Airtable billing.

**If that's too high**, the fix is to have the prebuild script cache the records it already fetched to disk and let `lib/content.ts` read that cache during the build — back to 6 calls. Deliberately not done yet: it would touch all six fetchers and their fallback paths, which is a bigger change than the expiry fix warranted.

### Do NOT use per-page ISR (`export const revalidate`)

ISR regenerates each page in its own isolated invocation, which **defeats the memoization** — each page re-fetches independently. It would also bypass the prebuild mirror entirely, so ISR-regenerated pages would go back to embedding expiring Airtable URLs — reintroducing the §3 bug. Keep build-time fetching and schedule rebuilds instead.

### The real budget risk is development, not the daily refresh

Every push to `main` and every PR preview triggers a build. An active week of 20 pushes costs 120 calls — more than three weeks of daily refreshes. This is why env vars are **Production-only** (§2): preview builds then use committed JSON fallbacks and cost nothing.

### Pagination caveat
Airtable pages at 100 records per request. Once the projects table crosses 100 rows it becomes 2 calls instead of 1. Not a concern yet.

### Acadev projects bypass Airtable entirely
`getProjectsByCommittee("acadev")` returns `content/acadev-projects.json` directly — 0 API calls. **Consequence:** consulting and social-good projects are edited in Airtable (no code, picked up by the daily rebuild), but acadev projects require a repo commit. This split is worth being deliberate about. Arguably correct — DeCal projects are a fixed historical archive — but it's an inconsistency in the officer-handoff story. Unifying would mean adding an `ACADEV_PROJECTS_TABLE` at the cost of one more call per build (6 → 7).

---

## 7. Phase C — domain cutover to `dssberkeley.org`

**Not started. The old Squarespace site is still live and serving the domain.**

### Current DNS (verified 2026-08-17)

| | |
|---|---|
| Registrar | **Squarespace Domains LLC** (they acquired Google Domains) |
| Nameservers | `ns-cloud-d{1..4}.googledomains.com` (managed via Squarespace panel) |
| Apex `A` | `198.49.23.144` → Squarespace |
| `www` `CNAME` | `ext-sq.squarespace.com` |
| **MX records** | **none** |
| **TXT records** | **none** |
| Registry expiry | 2027-01-16 |
| Current TTL | 14400 (4 hours) |
| Canonical host | **`www`** (apex 301s to www) |

**No MX and no TXT is the key fact** — no club email runs on this domain and there are no SPF/verification records to preserve. The usual migration disaster (breaking everyone's email) cannot happen here. The cutover is just repointing two records.

### ⚠️ Billing risk — order of operations matters

The domain was created **2025-01-16**, almost certainly bundled with the Squarespace annual plan. Squarespace gives a free first-year domain with annual subscriptions, and canceling the plan can jeopardize a bundled domain.

**Do not cancel the Squarespace subscription until you've confirmed in the billing panel that the domain renews as its own line item.** If it's bundled, transfer the domain out first, *then* cancel. Expiry is Jan 2027, so there is no time pressure.

### Cutover sequence

1. Verify the new site fully on the `.vercel.app` URL (done — §2), **and confirm §3 is fixed**
2. Ship the redirects, `metadataBase`, sitemap, robots (§5)
3. Lower TTL in Squarespace DNS from 14400 → 300, then **wait 4+ hours** for the old TTL to age out
4. In Vercel → Settings → Domains, add both `dssberkeley.org` and `www.dssberkeley.org`, set **`www` as primary**. Vercel displays the exact records to create — use those, not values from any blog post
5. In Squarespace DNS: delete the four Squarespace `A` records and the `ext-sq` CNAME, add Vercel's. HTTPS provisions automatically via Let's Encrypt — no certificate to buy
6. Verify, then raise TTL back to 3600
7. **Keep the Squarespace subscription running ~2 weeks** as a rollback path
8. Then transfer the registrar to a club-owned account (Cloudflare at cost, ~$10/yr). Requires unlocking `clientTransferProhibited` and an auth code; takes 5–7 days
9. Submit the new sitemap to Google Search Console

---

## 8. Club-continuity issues (not technical, but important)

The site currently depends on personal accounts, which is how club sites go dark after their maintainer graduates:

- **Repo is at `seanli05/DSS-Website`** — a personal GitHub account. Create a `dss-berkeley` org, transfer the repo, add officers as owners
- **Vercel project** should live in a Vercel **Team** owned by a club account, not a personal Hobby account
- **Registrar and Vercel accounts** should use a club email (shared Gmail / Google group), not a personal one
- **Vercel Hobby tier** is free but its terms are non-commercial; a site with a sponsorship/partners page is a gray area. Pro is $20/month. Worth checking the GitHub Student Developer Pack for credits

---

## 9. Useful commands

```bash
# Build without touching Airtable (uses JSON fallbacks — costs 0 API calls)
AIRTABLE_TOKEN= AIRTABLE_BASE_ID= npx next build

# Re-mirror Airtable attachments only (costs 6 API calls)
node scripts/mirror-airtable.mjs

# Typecheck
npx tsc --noEmit

# Inspect a branch's build in isolation, without disturbing the working tree
git worktree add --detach /tmp/check origin/main
cd /tmp/check && npm ci && npx next build
git worktree remove --force /tmp/check

# Preview a merge's conflicts without starting one
git merge-tree --write-tree origin/main origin/<branch> | grep '^CONFLICT'

# Check the live site's Airtable image expiry
curl -s https://dss-website-fawn.vercel.app/partners \
  | grep -oE 'v5\.airtableusercontent\.com[^"]*' | head -1
```

---

## 10. Environment variables

Names only — real values live in `.env.local` (gitignored) and in Vercel project settings. Never commit them.

```
AIRTABLE_TOKEN              AIRTABLE_BASE_ID
LOGOWALL_TABLE              CONSULTING_PROJECTS_TABLE
SOCIAL_GOOD_PROJECTS_TABLE  ACADEV_PROJECTS_TABLE
EXEC_PROFILES_TABLE         RECRUITMENT_TIMELINE_TABLE
EXTERNAL_EVENTS_TABLE
PARTNER_INQUIRIES_TABLE     ← needs a WRITE-scoped token; the /api/partner-inquiry
                              route returns 503 with an email fallback without it
```
