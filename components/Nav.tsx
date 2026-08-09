"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const links = [
  { label: "About", href: "/about" },
  { label: "Partners", href: "/partners" },
];

const committeeLinks = [
  { label: "Acadev", href: "/committees/acadev" },
  { label: "Consulting", href: "/committees/consulting" },
  { label: "Social Good", href: "/committees/social-good" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [committeeOpen, setCommitteeOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-hero-canvas/60 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <Image src="/dss-logo-white.png" alt="" width={28} height={28} className="h-7 w-7" aria-hidden="true" />
          <span className="text-xl font-bold tracking-tight">DSS</span>
        </Link>

        {/* Desktop links + Join, grouped together on the right so the logo stands alone on the left */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8 text-sm font-medium text-white/70">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-white transition-colors duration-150"
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Committees dropdown */}
            <li className="relative group">
              <button
                className="flex items-center gap-1 hover:text-white transition-colors duration-150 cursor-pointer"
                aria-haspopup="true"
              >
                Committees
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="transition-transform duration-150 group-hover:rotate-180"
                  aria-hidden="true"
                >
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </button>
              {/* Dropdown panel — visible on group hover */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 hidden group-hover:block">
                <ul className="rounded-xl border border-white/10 bg-hero-canvas-deep/85 backdrop-blur-xl shadow-lg py-1.5 min-w-[160px]">
                  {committeeLinks.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-150"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li>
              <Link
                href="/decal"
                className="hover:text-white transition-colors duration-150"
              >
                Decal
              </Link>
            </li>
          </ul>

          {/* Join CTA */}
          <Link
            href="/join"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Join
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l12 12M16 4L4 16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h14M3 10h14M3 14h14" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-hero-canvas-deep/85 backdrop-blur-xl px-6 pb-6 pt-2">
          <ul className="flex flex-col gap-4 text-sm font-medium text-white/70">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Committees expandable in mobile */}
            <li>
              <button
                className="flex w-full items-center justify-between hover:text-white transition-colors"
                onClick={() => setCommitteeOpen((o) => !o)}
              >
                Committees
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className={`transition-transform duration-150 ${committeeOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </button>
              {committeeOpen && (
                <ul className="mt-2 ml-4 flex flex-col gap-3">
                  {committeeLinks.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="block hover:text-white transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <Link
                href="/decal"
                className="block hover:text-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Decal
              </Link>
            </li>

            <li>
              <Link
                href="/join"
                className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
                onClick={() => setMenuOpen(false)}
              >
                Join
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
