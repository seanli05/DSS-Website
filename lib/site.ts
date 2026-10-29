/**
 * Site-wide settings — name, URL, emails, sign-up links, nav, and socials.
 * The values live in content/site.json; this file only gives them names and
 * types so the rest of the code can import them.
 *
 * Relative import (not "@/content/...") because next.config.ts imports this
 * file too, and path aliases aren't available there.
 */
import siteData from "../content/site.json";

export const site = siteData;

/** Canonical production URL, no trailing slash (used for sitemap, robots, social previews). */
export const SITE_URL = site.url;

/**
 * The per-semester sign-up links. `application` and `coffeeChat` are also the
 * destinations of the /apply and /coffeechat short links in next.config.ts, so
 * updating them in content/site.json updates the button and the flyer link together.
 */
export const LINKS = site.links;

export type NavItem = (typeof site.nav.links)[number];

/** True for links that leave the site (rendered as <a target="_blank">). */
export function isExternal(href: string): boolean {
  return /^(https?:|mailto:)/.test(href);
}
