"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { isExternal, site, type NavItem } from "@/lib/site";

interface NavLink {
  label: string;
  href: string;
}

interface NavProps {
  /** The Committees dropdown entries — passed from the root layout, built from committees.json. */
  committees: NavLink[];
}

// The link list and the Join button come from `nav` in content/site.json.
// An item with `"dropdown": "committees"` renders the committee list instead of a link.

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`transition-transform duration-150 ${className}`}
      aria-hidden="true"
    >
      <path d="M2 4l4 4 4-4" />
    </svg>
  );
}

/** A plain nav link: client-side <Link> inside the site, new tab for anything external. */
function NavAnchor({
  href,
  className,
  onClick,
  children,
}: NavLink & { className: string; onClick?: () => void; children?: React.ReactNode }) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

const hasHref = (item: NavItem): item is NavItem & { href: string } => "href" in item;

export default function Nav({ committees }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [committeeOpen, setCommitteeOpen] = useState(false);
  const { links, cta } = site.nav;
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-hero-canvas/60 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <Image src="/brand/dss-logo-white.png" alt="" width={28} height={28} className="h-7 w-7" aria-hidden="true" />
          <span className="whitespace-nowrap text-base font-bold tracking-tight sm:text-lg">{site.name}</span>
        </Link>

        {/* Desktop links + Join, grouped on the right so the logo stands alone on the left */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8 text-sm font-medium text-white/70">
            {links.map((item) =>
              hasHref(item) ? (
                <li key={item.label}>
                  <NavAnchor href={item.href} label={item.label} className="hover:text-white transition-colors duration-150">
                    {item.label}
                  </NavAnchor>
                </li>
              ) : (
                <li key={item.label} className="relative group">
                  <button
                    className="flex items-center gap-1 hover:text-white transition-colors duration-150 cursor-pointer"
                    aria-haspopup="true"
                  >
                    {item.label}
                    <Chevron className="group-hover:rotate-180" />
                  </button>
                  {/* Dropdown panel — visible on hover */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 hidden group-hover:block">
                    <ul className="rounded-xl border border-white/10 bg-hero-canvas-deep/85 backdrop-blur-xl shadow-lg py-1.5 min-w-[160px]">
                      {committees.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-150"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              )
            )}
          </ul>

          <Link
            href={cta.href}
            className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {cta.label}
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
            {links.map((item) =>
              hasHref(item) ? (
                <li key={item.label}>
                  <NavAnchor
                    href={item.href}
                    label={item.label}
                    className="block hover:text-white transition-colors"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavAnchor>
                </li>
              ) : (
                <li key={item.label}>
                  <button
                    className="flex w-full items-center justify-between hover:text-white transition-colors"
                    onClick={() => setCommitteeOpen((o) => !o)}
                  >
                    {item.label}
                    <Chevron className={committeeOpen ? "rotate-180" : ""} />
                  </button>
                  {committeeOpen && (
                    <ul className="mt-2 ml-4 flex flex-col gap-3">
                      {committees.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block hover:text-white transition-colors" onClick={closeMenu}>
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            )}

            <li>
              <Link
                href={cta.href}
                className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
                onClick={closeMenu}
              >
                {cta.label}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
