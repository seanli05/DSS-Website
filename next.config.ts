import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Airtable attachment CDN — needed for partner logos fetched from the API
      { protocol: "https", hostname: "v5.airtableusercontent.com" },
      { protocol: "https", hostname: "dl.airtable.com" },
    ],
  },
};

export default nextConfig;
