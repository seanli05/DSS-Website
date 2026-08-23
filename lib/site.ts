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
export const COFFEE_CHAT_URL = "https://dssatberkeley.notion.site/dss-fall26-cc";
