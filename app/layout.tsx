import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Poppins } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
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
