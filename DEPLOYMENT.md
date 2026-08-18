# DSS Website — Deployment Handoff

**Last updated:** 2026-08-17
**Purpose:** Self-contained context for continuing the deployment of this site to `dssberkeley.org`. Written to be handed to a fresh conversation with no prior context.

---

## TL;DR — where things stand

| | Status |
|---|---|
| Vercel deployment | ✅ **Live and verified** at https://dss-website-fawn.vercel.app |
| Airtable connection | ✅ Working — real data, not fallbacks |
| **Airtable image expiry** | 🔴 **BLOCKER — must fix before domain cutover** |
| `merge-acadev` branch | ⚠️ Conflicts resolved, **uncommitted**, mid-merge |
| Pre-launch code (redirects, sitemap, etc.) | ⬜ Not started |
| Domain cutover to `dssberkeley.org` | ⬜ Not started — old Squarespace site still live |

**Next action:** fix the Airtable image expiry (see §3). Everything else can follow.

---

## 1. Project basics

- **Stack:** Next.js 16 (App Router) + TypeScript + Tailwind v4, deployed on Vercel
- **Repo:** `git@github.com:seanli05/DSS-Website.git` (personal GitHub account — see §7)
- **Local path:** `/Users/seanli/Desktop/personal/DSS/DSS-Website`
- **Content layer:** `lib/content.ts` is the only file that knows where data comes from (JSON under `content/` + `data/`, plus Airtable)
- See `CLAUDE.md` for the always-on ruleset and `PLAN.md` for the original brief

### Routes currently built (14 pages)

```
/                          /contact                /committees/acadev
/about                     /decal                  /committees/consulting
/partners                  /join                   /committees/social-good
/styleguide                /_not-found             /api/partner-inquiry (dynamic)
```

**Note:** there is **no `/committees` index route** — it was deleted on `main`. This matters for redirects (§5).

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

## 3. 🔴 BLOCKER: Airtable attachment URLs expire

### The problem

Airtable's REST API returns attachment URLs that are **signed and short-lived** (a few hours). This site fetches them at build time and bakes them into statically prerendered HTML. Once the URL expires, Next's image optimizer fails to fetch the source on any cache miss, and images break site-wide.

### Evidence gathered

A live URL from the deployed `/partners` page:

```
https://v5.airtableusercontent.com/v3/u/56/56/1787018400000/HRdo9DmVQ1th9vFPQ_KO1g/xzfviW0
                                            └── 1787018400000 ms = 2026-08-18 02:00 UTC
```

At time of writing (2026-08-17 22:31 UTC) that URL returned **HTTP 200**, and through the optimizer:
`/_next/image?url=...` → `200, image/png, 6609 bytes`. So it works *now* and expires ~3.5 hours later.

**To confirm definitively:** reload https://dss-website-fawn.vercel.app/partners after 02:00 UTC (7 PM Pacific) on 2026-08-17. Broken logos = confirmed.

### Scope — 5 attachment fields, 5 pages

| `lib/content.ts` | Field | Appears on |
|---|---|---|
| `getProjects()` L374 | `Logo` | `/`, consulting, social-good |
| `getProjects()` L375 | `Additional Images/GIFS` | project modals |
| `getExternalEvents()` L438 | `Image` | `/about` |
| `getPartners()` L562 | `Logo` | `/`, `/partners` |
| `getExecProfiles()` L594 | `Headshot` | `/about` |

All five flow through the `attachmentUrls()` helper at `lib/content.ts:275`.

### Why this blocks the daily-rebuild plan

The plan (§6) was a once-daily rebuild to refresh Airtable content within API limits. With expiring URLs, that yields working images for roughly **3 hours out of every 24**. The rebuild schedule cannot fix this on its own.

### Proposed fix — mirror attachments into `public/` at build time

A prebuild step downloads each Airtable attachment, writes it to `public/airtable/<id>.<ext>`, and the fetchers return that local path instead of the signed URL. Each deployment then serves its own permanent copies.

Why this shape:
- **Zero extra API calls** — attachment bytes are downloaded from the CDN, and the records themselves already come back in the fetches you're already making
- **Preserves the officer workflow** — people keep editing Airtable, nothing changes for them
- **Images become immune to expiry** — they're static assets of that deployment
- **Makes the daily rebuild work as designed**
- Lets you **delete the `remotePatterns` block** in `next.config.ts`

Alternatives considered and rejected: a permanent-URL text column in Airtable (relies on officers hosting images somewhere); committing logos to `public/` by hand (breaks the no-git workflow for officers).

---

## 4. ⚠️ Outstanding: the `merge-acadev` branch

**State:** branch `merge-acadev` exists locally, created from `origin/main`, with `origin/acadev` merged in. All four conflicts are **resolved on disk and verified**, but the files are **unstaged and `.git/MERGE_HEAD` still exists** — the merge is not committed and nothing is pushed.

### To finish

```bash
git add app/committees/\[id\]/page.tsx components/ProjectCard.tsx \
        components/Section.tsx lib/content.ts
git commit          # pre-filled merge message
git push -u origin merge-acadev
```

Or `git merge --abort` to discard the resolutions entirely.

### Resolution decisions made (do not silently revert these)

**`components/Section.tsx`** — kept acadev's parameterized `indexSeparator` plus main's `showSeam` line (the JSX depends on `showSeam`). **Changed the default from `"—"` to `" —"`**: the separator is appended directly after `(01)`, so without the leading space every numbered eyebrow site-wide would render `(01)— Label` instead of `(01) — Label`. Verified in build output: acadev page renders `(01) — Our work`, decal page renders `(01): About the course`.

**`lib/content.ts`** — both branches added a different new interface sharing one closing brace. Kept both (`NewbieExperiencePillar` + `CommitteeWorkImage`).

**`components/ProjectCard.tsx`** — the two branches redesigned this component incompatibly. Kept **main's** design (button-as-card, radial brand tint, rounded, hook + "Read more") and grafted in **acadev's** cover-image support. Rationale: most of acadev's version was the *older* design main had already replaced; its genuine contribution was `coverImage`. Taking main wholesale would have broken decal cards, which have `partner: ""` and would render an empty monogram box with no photo. Also switched the monogram fallback from `project.partner` to `name` (= `partner || title`) so it degrades correctly.

**`app/committees/[id]/page.tsx`** — three hunks; the branches chose **opposite section orders**. Took main's ordering (Projects before Activities) and its derived section-numbering. Decisive reason: main's activities section already exists later in the file and auto-merged cleanly, so taking acadev's side would have rendered **two** activities sections. Kept acadev's `isAcadevProjects` flag and DeCal-specific subtext, but with main's "Read more" wording (main renamed that button; acadev's copy still said "See more").

**Bonus fix — a bug neither branch had:** `tsc` caught `content/acadev-projects.json` missing `oneLiner`, `brandColor`, and `logoPalette`, which `main` added as required `Project` fields after acadev branched. Fixed by normalizing in `getProjectsByCommittee()`, matching the existing fallback-normalization pattern a few lines above rather than adding three null columns to all 7 records.

### Verification after resolution
- `npx tsc --noEmit` — clean
- `npx next build` — clean, 14 pages
- All 7 acadev cover images present in prerendered output
- 1 eslint error is **pre-existing** in `components/RevealOnScroll.tsx` (`react-hooks/set-state-in-effect`), present on `origin/main`, untouched by this merge. Next 16 does not run eslint during `next build`, so it does not block deploys.

### Other unmerged branches

| Branch | Ahead | Behind | Conflicts | Note |
|---|---|---|---|---|
| `origin/acadev` | 6 | 6 | 4 | Being merged now |
| `origin/manav` | 1 | 11 | 1 | Small — Social Good images |
| `origin/sean` | 2 | 20 | **17** | Badly stale; includes a modify/delete where `main` deleted `app/committees/page.tsx`. Likely superseded — **confirm before spending effort** |

---

## 5. Remaining pre-launch code

None of this is written yet. Suggested order:

### 5a. Airtable image mirroring (§3) — do first, it's the blocker

### 5b. Redirects from the old Squarespace URLs

The old site's canonical host is **`www`** (apex 301s to www). Keep that direction to preserve SEO.

Add to `next.config.ts` as `permanent: true` (308):

| Old (Squarespace) | New |
|---|---|
| `/home` | `/` |
| `/joinus` | `/join` |
| `/decalinfo` | `/decal` |
| `/acadev` | `/committees/acadev` |
| `/consulting` | `/committees/consulting` |
| `/socialgood` | `/committees/social-good` |
| `/about` | `/about` (unchanged) |
| `/cart` | drop — Squarespace commerce |
| **`/committees`** | ⚠️ **no target exists** — decide: restore an index page, or redirect somewhere |

The first seven come from the old site's `sitemap.xml`. `/committees` and `/decal` additionally appear in the old site's nav but not its sitemap, so people may have them bookmarked.

### 5c. `metadataBase`

`app/layout.tsx` sets `openGraph.siteName` but **no `metadataBase`**. Without it, OG image URLs resolve relative and links shared in Slack/Discord render without previews. Set to `https://www.dssberkeley.org`.

### 5d. `app/sitemap.ts` and `app/robots.ts`

Neither exists. Exclude `/styleguide` from both — it's currently in the build output and would otherwise get indexed.

### 5e. Daily rebuild for Airtable content (only meaningful after §3 is fixed)

Create a Vercel **Deploy Hook** (Project Settings → Git → Deploy Hooks, target `main`), then schedule a daily POST to it.

Recommended: **Vercel Cron** (`vercel.json` + a small `/api/refresh` route guarded by `CRON_SECRET`). Hobby allows exactly one job at once-per-day, which fits. Preferred over GitHub Actions because GitHub auto-disables scheduled workflows after 60 days of repo inactivity — a real risk over summer break, right when the August recruitment timeline matters most.

### 5f. Housekeeping
- `.DS_Store` is **tracked in git** and should be removed + gitignored
- ~20 MB of stray untracked files in the repo root, referenced nowhere in code: `DSCF0233.JPG`, `IMG_5642.HEIC`, `IMG_5724 3.HEIC`, `ZSZ_7559.jpg`, `ZSZ_7638.jpg`, `Culture pics/`, `Newbie Experience/` — gitignore them
- `public/` is ~36 MB and gains ~6 MB from the acadev merge. Worth compressing hero images
- `CLAUDE.md` requires updating `README.md` after structural changes; the acadev merge adds `content/acadev-projects.json` and cover-image fields

---

## 6. Airtable API budget

The club is on a plan with a **monthly API call cap** — confirm the exact number in the Airtable workspace billing panel.

### Calls per full build: **6**

`memoizeOnce` (`lib/content.ts:314`) is module-level, so during a single build all pages render in one process and each fetcher fires exactly once regardless of how many pages call it:

| Fetcher | Tables hit |
|---|---|
| `getProjects()` | 2 (consulting + social-good) |
| `getPartners()` | 1 |
| `getExecProfiles()` | 1 |
| `getExternalEvents()` | 1 |
| `getRecruitmentTimeline()` | 1 |

At 6 calls/build: daily rebuild ≈ **180/month**, weekly ≈ **26/month**.

### Do NOT use per-page ISR (`export const revalidate`)

ISR regenerates each page in its own isolated invocation, which **defeats the memoization** — each page re-fetches independently. Measured cost would be ~13 calls per refresh cycle vs 6 for a full rebuild, i.e. roughly 2× worse. Keep the current build-time fetching and schedule rebuilds instead.

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
SOCIAL_GOOD_PROJECTS_TABLE  EXEC_PROFILES_TABLE
EXTERNAL_EVENTS_TABLE       RECRUITMENT_TIMELINE_TABLE
PARTNER_INQUIRIES_TABLE     ← needs a WRITE-scoped token; the /api/partner-inquiry
                              route returns 503 with an email fallback without it
```
