/**
 * The site's canonical production URL, in one place.
 *
 * `www`, not the bare apex: the old Squarespace site canonicalised to www and
 * every existing inbound link and search result points there, so keeping it
 * preserves that history. Vercel redirects the apex to www.
 *
 * Used by three things that each need an absolute URL and can't read
 * `metadataBase` themselves:
 *   - app/layout.tsx  -> metadataBase, for Open Graph / social preview images
 *   - app/sitemap.ts  -> absolute page URLs
 *   - app/robots.ts   -> the sitemap link
 *
 * No trailing slash — callers append their own path.
 */
export const SITE_URL = "https://www.dssberkeley.org";

/**
 * The membership application form, in one place.
 *
 * Changes every recruitment cycle, and two things point at it: the Join page's
 * "Apply now" button, and the `/apply` redirect in `next.config.ts` (the short
 * link for flyers and slides). Update it here and both follow.
 *
 * The `?usp=publish-editor` query Google appends when you copy the link out of
 * the form editor is dropped deliberately — it's an editor artifact, not part
 * of the address, and it looks like a tracking parameter to anyone reading it.
 */
export const APPLICATION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe98Tv-YMlseOfZsSoF6Ad0vqZmup_gZLWi06fMSboyW3UZsA/viewform";

/**
 * The coffee chat sign-up, in one place — same deal as APPLICATION_URL above:
 * the Join page's second hero button and the `/coffeechat` redirect in
 * `next.config.ts` both read it, so the flyer link and the site button can't
 * drift apart. Also changes every recruitment cycle.
 */
export const COFFEE_CHAT_URL = "https://ripple-increase-bbd.notion.site/dss-fall26-cc";

/**
 * The mailing list sign-up, linked from the Join page's hero.
 *
 * Unlike APPLICATION_URL and COFFEE_CHAT_URL this one has no short-link
 * redirect in `next.config.ts` — nothing off-site points at it yet. Add one the
 * same way if it ever goes on a flyer. It also outlives a single cycle: it's a
 * standing list for recruitment reminders, not a per-semester form, so there
 * should be no need to touch it each fall.
 */
export const MAILING_LIST_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe7qmYZKwBZy0h6UlhsiYLwKSJ3elED_1iWePOflYbUc_jEEg/viewform";

/**
 * The DeCal enrolment form, linked from the DeCal page's hero.
 *
 * Same deal as APPLICATION_URL: it changes every semester, and the `?usp=dialog`
 * query Google appends when you copy the link out of the share dialog is dropped
 * deliberately — an editor artifact, not part of the address.
 */
export const DECAL_APPLICATION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSd6lE4Coe15kreXLwtJ2at7uBlp-AOB0MCijgbYz3k_KOkZmw/viewform";

/**
 * The DSS Medium publication, linked as "Blog" in the navbar.
 *
 * Note this is the *publication* (medium.com/data-science-society), which is
 * not the same address as the `@dssberkeley` profile the Footer and Contact
 * page link under "Medium". If the club has consolidated on one of the two,
 * point all three at it.
 */
export const BLOG_URL = "https://medium.com/data-science-society";
