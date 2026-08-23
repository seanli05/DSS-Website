import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Poppins } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// 700 is loaded for the stat numerals — without it the browser synthesises a
// fake bold, which smears the tabular figures while they count up.
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Homepage typeface — the home page sets `font-poppins` on each section, so
// everything there inherits it. Inter and IBM Plex Mono remain the defaults for
// the rest of the site (and for Nav/Footer, which are shared across every page).
// Poppins has no variable font on Google Fonts, so each weight is a separate
// file — only the four the page actually uses are loaded.
const poppins = Poppins({
  // -src suffix so it doesn't collide with the `--font-poppins` Tailwind theme
  // token in globals.css, which points at this one.
  variable: "--font-poppins-src",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  // Without this, the relative image paths in `openGraph` below resolve
  // relative to nothing and social previews come out blank — so a link posted
  // in Slack, Discord, iMessage, or LinkedIn renders as a bare URL with no
  // card. Next needs an absolute base to build those URLs from.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Data Science Society at UC Berkeley",
    template: "%s | DSS Berkeley",
  },
  description:
    "Data Science Society (DSS) is UC Berkeley's premier student organization for data science. Join us to work on real projects, connect with industry partners, and grow as a data scientist.",
  openGraph: {
    siteName: "DSS Berkeley",
    locale: "en_US",
    type: "website",
    // Without an image the preview card is text-only. 2000x900 is close enough
    // to the 1.91:1 that Slack/Discord/iMessage/LinkedIn crop to, and at 0.7 MB
    // it's well under their fetch limits. `metadataBase` above is what turns
    // this relative path into the absolute URL those scrapers require.
    images: [
      {
        url: "/group-photo.jpg",
        width: 2000,
        height: 900,
        alt: "Members of the Data Science Society at UC Berkeley",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable} ${poppins.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink antialiased">
        <Nav />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
