"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const links = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Partners", href: "/partners" },
];

const committeeLinks = [
  { label: "Acadev", href: "/committees/acadev" },
  { label: "Consulting", href: "/committees/consulting" },
  { label: "Social Good", href: "/committees/social-good" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [committeeOpen, setCommitteeOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-shadow duration-200 bg-bg ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          {/* TODO: replace with SVG logo */}
          <span className="brand-gradient-text text-xl font-bold tracking-tight">DSS</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="hover:text-primary transition-colors duration-150"
              >
                {label}
              </Link>
            </li>
          ))}

          {/* Committees dropdown */}
          <li className="relative group">
            <button
              className="flex items-center gap-1 hover:text-primary transition-colors duration-150 cursor-pointer"
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
              <ul className="rounded-xl border border-border bg-bg shadow-lg py-1.5 min-w-[160px]">
                {committeeLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="block px-4 py-2 text-sm text-muted hover:text-primary hover:bg-surface transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>

        {/* Join CTA */}
        <Link
          href="/join"
          className="hidden md:inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Join
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-ink"
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
        <div className="md:hidden border-t border-border bg-bg px-6 pb-6 pt-2">
          <ul className="flex flex-col gap-4 text-sm font-medium text-muted">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block hover:text-primary transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Committees expandable in mobile */}
            <li>
              <button
                className="flex w-full items-center justify-between hover:text-primary transition-colors"
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
                        className="block hover:text-primary transition-colors"
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
