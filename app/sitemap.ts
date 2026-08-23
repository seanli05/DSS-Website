import type { MetadataRoute } from "next";
import { getCommittees } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/**
 * Generates /sitemap.xml, which tells search engines which pages exist.
 *
 * This matters more than usual right now: every committee page moved from
 * /committees/acadev to /acadev, so the URLs Google already has on file are all
 * redirects. A sitemap is how it learns the new ones quickly rather than
 * rediscovering them by crawling.
 *
 * Committee routes come from `getCommittees()` — the same helper
 * app/[id]/page.tsx uses in generateStaticParams — so adding a committee to
 * content/committees.json puts it in the sitemap automatically and the two can
 * never disagree about which pages exist.
 *
 * Deliberately excluded: /styleguide (an internal design reference, also
 * disallowed in app/robots.ts) and /api/* (not pages).
 *
 * `priority` is relative within this site only; search engines treat it as a
 * weak hint, so these are rough rather than tuned.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "monthly" as const },
    { path: "/join", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/partners", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
  ];

  const committeeRoutes = getCommittees().map((committee) => ({
    path: `/${committee.id}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...committeeRoutes].map(
    ({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })
  );
}
