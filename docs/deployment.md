# Deployment

The site is hosted on **Vercel** and deploys automatically from GitHub.

- Every push to `main` builds and deploys production.
- Pull requests get their own preview URL.
- Production URL: https://www.dssberkeley.org (also reachable at
  https://dss-website-fawn.vercel.app).

## Environment variables

Airtable credentials are set in Vercel → Project → Settings → Environment
Variables, checked for **Production only**. Preview builds then skip Airtable,
use the `*-fallback.json` files in `content/`, and cost no Airtable API calls.
The full list is in [airtable.md](airtable.md#environment-variables).

Changing an env var requires a redeploy to take effect.

## Rebuilding after content changes

- **Content in `content/`**: commit and push to `main`; Vercel rebuilds.
- **Content in Airtable**: the site does **not** update on its own (each build
  costs ~13 Airtable API calls, so there's deliberately no schedule). Trigger a
  rebuild by either:
  1. Vercel dashboard → Deployments → ⋯ on the latest → **Redeploy**, or
  2. a **Deploy Hook** (Settings → Git → Deploy Hooks) — a URL that rebuilds the
     site when POSTed to. An Airtable automation can call it when a record changes.

## Short links and redirects

All redirects are in [`next.config.ts`](../next.config.ts):

| Link | Goes to | Notes |
|---|---|---|
| `/apply` | `links.application` in `content/site.json` | 307 (temporary) on purpose — the form changes every semester and browsers cache permanent redirects |
| `/coffeechat` | `links.coffeeChat` | same |
| `/committees/:id` | `/:id` | committee pages used to live under `/committees` |
| `/committees` | `/about#committees` | |
| `/home`, `/joinus`, `/socialgood`, `/decalinfo` | `/`, `/join`, `/social-good`, `/decal` | old Squarespace URLs, so existing links and search results keep working |

## Checking a build locally

```bash
npm run build            # what Vercel runs (includes the Airtable mirror step)
npm run start            # serve the production build at localhost:3000

# Build without touching Airtable (uses fallbacks, costs 0 API calls):
AIRTABLE_TOKEN= AIRTABLE_BASE_ID= npx next build
```

## Domain (dssberkeley.org)

`dssberkeley.org` points at this Vercel project (Vercel → Settings → Domains),
with `www.dssberkeley.org` as primary — it's the URL in `content/site.json`.
HTTPS certificates renew automatically.

The domain is registered through **Squarespace Domains**, left over from the
old Squarespace site. There are no MX or TXT records, so no email depends on it.

**Billing warning:** the domain was likely bundled with the old Squarespace plan.
Don't cancel Squarespace until the billing panel shows the domain renewing on its
own — if it's bundled, transfer the domain out first. (Registry expiry: Jan 2027.)

Follow-ups:

- [ ] Move the domain to a club-owned registrar account (see below).
- [ ] Submit `https://www.dssberkeley.org/sitemap.xml` in Google Search Console.

## Keeping the site in the club's hands

Club websites usually go dark when the person who owns the accounts graduates.
Before handing off, make sure:

- [ ] The GitHub repo lives in a **club organization** (not a personal account),
      with at least two current officers as owners.
- [ ] The Vercel project lives in a Vercel **Team** owned by a club account.
- [ ] Airtable, Vercel, and the domain registrar use a **shared club email**,
      not a personal one.
- [ ] Vercel's free Hobby tier is for non-commercial use; a site with a
      sponsorship page is a gray area. Pro is $20/month — check the GitHub
      Student Developer Pack for credits.
- [ ] The next webmaster has read this file and the [README](../README.md).
