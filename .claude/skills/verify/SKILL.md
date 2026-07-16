---
name: verify
description: Drive the DSS website locally to verify UI changes end-to-end
---

# Verifying DSS-Website changes

## Launch
- A dev server is often already running at http://localhost:3000 — check first (`curl -s localhost:3000 >/dev/null`) and reuse it (hot reload picks up edits). Next.js refuses to start a duplicate dev server for the same dir, and `npm run dev` falls back to port 3001 if 3000 is busy.
- SSR surface: `curl` the page and grep the HTML — server markup is real evidence for no-JS / pre-hydration states.

## Browser drive (repo has no Playwright)
- Install `playwright-core` in the session scratchpad (NOT the repo) and launch the system browser: `chromium.launch({ channel: "chrome", headless: true })`.
- Reduced motion: `browser.newContext({ reducedMotion: "reduce" })`. Mobile: viewport width < 768 (Tailwind `md`).
- For scroll-driven UI: compute scroll targets from `getBoundingClientRect()`, probe DOM state (e.g. `stroke-dashoffset` attributes, inline `style.transform`) after each `scrollTo`, and take element screenshots as visual evidence.

## Flows worth driving
- `/committees/social-good` — GrowingSapling scroll animation: roots grow downward scrubbed with scroll, blossoms latch open at full growth (never close), static full bloom under reduced motion, hidden below `md`.
- Other committee pages (`/committees/consulting`, `/committees/acadev`) must stay unaffected by social-good special-casing.
