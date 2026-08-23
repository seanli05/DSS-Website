import type { NextConfig } from "next";
import { APPLICATION_URL, COFFEE_CHAT_URL } from "./lib/site";

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
      //
      // `[^.]+` excludes anything containing a dot, which matters more than it
      // looks: public/committees/ holds 14 image files (hero shots, cards,
      // activity photos) whose URLs also start with /committees/. A bare `:id`
      // matches those too and 308s them to a path that doesn't exist, silently
      // breaking every committee image on the site. Nested assets like
      // /committees/acadev/photo.jpg are already safe — `:id` spans one segment.
      { source: "/committees/:id([^.]+)", destination: "/:id", permanent: true },
      // The old committees index has no equivalent; the home page is where the
      // committees are introduced.
      { source: "/committees", destination: "/#committees", permanent: true },

      // ── /apply → the application form. The short link for flyers, slides,
      // and anywhere a URL has to be typed by hand or read off a poster.
      // `permanent: false` (307) is load-bearing: the destination changes every
      // recruitment cycle, and a 308 would be cached by browsers that followed
      // it once, sending returning applicants to last semester's form. The form
      // URL itself lives in lib/site.ts, shared with the Join page's button.
      { source: "/apply", destination: APPLICATION_URL, permanent: false },
      // Same arrangement for the coffee chat sign-up. No hyphen, matching the
      // /joinus and /socialgood links this site already hands out — one less
      // thing to get wrong when someone types it off a poster.
      { source: "/coffeechat", destination: COFFEE_CHAT_URL, permanent: false },

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
