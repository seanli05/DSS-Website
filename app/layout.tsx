import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-bg text-ink antialiased">
        <Nav />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
