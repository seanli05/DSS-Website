import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Generates /robots.txt.
 *
 * The point of this file is the two disallows. /styleguide is an internal
 * design reference — colour swatches, type scale, button variants — that is
 * publicly reachable, so without this it can surface in Google results for
 * "DSS Berkeley" alongside the real pages. /api/ holds the partner-inquiry
 * endpoint, which isn't a page and has nothing to index.
 *
 * Everything else is allowed, and the sitemap is linked so crawlers find it
 * without waiting on a Search Console submission.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/styleguide", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
