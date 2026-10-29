---
name: verify
description: Drive the DSS website locally to verify UI changes end-to-end
---

# Verifying DSS-Website changes

## Launch
- A dev server is often already running at http://localhost:3000 — check first (`curl -s localhost:3000 >/dev/null`) and reuse it (hot reload picks up edits). Never stop it. If 3000 is busy, start another on a different port.
- To verify a production build without spending Airtable API quota: `AIRTABLE_TOKEN= AIRTABLE_BASE_ID= npx next build && npx next start -p 3457`.
- SSR surface: `curl` the page and grep the HTML — server markup is real evidence for no-JS / pre-hydration states.

## Browser drive (repo has no Playwright)
- Install `playwright-core` in the session scratchpad (NOT the repo) and launch the system browser: `chromium.launch({ channel: "chrome", headless: true })`.
- Reduced motion: `browser.newContext({ reducedMotion: "reduce" })`. Mobile: viewport width < 768 (Tailwind `md`).
- For before/after refactors: screenshot every route at 1280 and 390 wide on both builds and pixel-diff them.

## Routes worth checking
- `/`, `/about`, `/join`, `/partners`, `/decal`, `/contact`
- Committee pages `/acadev`, `/consulting`, `/social-good` — all render from `app/[id]/page.tsx`; Social Good uses the `compact` section layout.
- Redirects: `/apply`, `/coffeechat` (307 to the forms in `content/site.json`), `/committees/acadev` → `/acadev`.
