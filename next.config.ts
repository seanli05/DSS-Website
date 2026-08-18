import type { NextConfig } from "next";

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
      // The old committees index has no equivalent; the home page is where the
      // committees are introduced.
      { source: "/committees", destination: "/#committees", permanent: true },

      // ── Old Squarespace URLs (dssberkeley.org), from that site's sitemap.
      // 308s so search engines transfer ranking rather than treating these as
      // dead pages. /acadev and /consulting need no entry — the new routes now
      // match the old paths exactly, which is why the move above was worth doing.
      { source: "/home", destination: "/", permanent: true },
      { source: "/joinus", destination: "/join", permanent: true },
      { source: "/socialgood", destination: "/social-good", permanent: true },
      // The DeCal had its own page on Squarespace; that content now lives on the
      // Acadev committee page, which owns the DeCal portfolio.
      { source: "/decalinfo", destination: "/acadev", permanent: true },
      { source: "/decal", destination: "/acadev", permanent: true },
    ];
  },
};

export default nextConfig;
