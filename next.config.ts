import type { NextConfig } from "next";
import { LINKS } from "./lib/site";

const nextConfig: NextConfig = {
  images: {
    // Kept as a safety net, not a normal path. scripts/mirror-airtable.mjs
    // downloads every Airtable attachment into public/airtable/ at build time,
    // so images are normally served locally. These patterns only matter if an
    // attachment fails to mirror and lib/content.ts falls back to Airtable's own
    // signed URL — which works, but expires within hours.
    remotePatterns: [
      { protocol: "https", hostname: "v5.airtableusercontent.com" },
      { protocol: "https", hostname: "dl.airtable.com" },
    ],
  },

  async redirects() {
    return [
      // ── Committee pages moved to the site root: /committees/acadev → /acadev.
      // Keeps any existing link, bookmark, or search result working.
      { source: "/committees/:id", destination: "/:id", permanent: true },
      // The old committees index has no equivalent; the About page's committee
      // cards are the closest thing.
      { source: "/committees", destination: "/about#committees", permanent: true },

      // ── /apply → the application form. The short link for flyers, slides,
      // and anywhere a URL has to be typed by hand or read off a poster.
      // `permanent: false` (307) is load-bearing: the destination changes every
      // recruitment cycle, and a 308 would be cached by browsers that followed
      // it once, sending returning applicants to last semester's form. The form
      // URL itself is `links.application` in content/site.json.
      { source: "/apply", destination: LINKS.application, permanent: false },
      // Same arrangement for the coffee chat sign-up. No hyphen, matching the
      // /joinus and /socialgood links this site already hands out — one less
      // thing to get wrong when someone types it off a poster.
      { source: "/coffeechat", destination: LINKS.coffeeChat, permanent: false },

      // ── Old Squarespace URLs (dssberkeley.org), from that site's sitemap.
      // 308s so search engines transfer ranking rather than treating these as
      // dead pages. /acadev and /consulting need no entry — the new routes now
      // match the old paths exactly, which is why the move above was worth doing.
      { source: "/home", destination: "/", permanent: true },
      { source: "/joinus", destination: "/join", permanent: true },
      { source: "/socialgood", destination: "/social-good", permanent: true },
      // The old Squarespace DeCal URL now points at the streamlined course page.
      { source: "/decalinfo", destination: "/decal", permanent: true },
    ];
  },
};

export default nextConfig;
