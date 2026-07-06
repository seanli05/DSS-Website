import Link from "next/link";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Committees", href: "/committees" },
  { label: "Projects", href: "/projects" },
  { label: "Partners", href: "/partners" },
  { label: "Join", href: "/join" },
  { label: "Contact", href: "/contact" },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com/berkeleydss" }, // TODO: verify handle
  { label: "LinkedIn", href: "https://linkedin.com/company/berkeleydss" }, // TODO: verify handle
  { label: "GitHub", href: "https://github.com/BerkeleyDSS" }, // TODO: verify handle
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-24">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <span className="brand-gradient-text text-lg font-bold tracking-tight">
              Data Science Society
            </span>
            <p className="text-sm text-muted leading-relaxed">
              {/* TODO: update with actual email */}
              UC Berkeley&apos;s premier data science club.
              <br />
              <a href="mailto:dss@berkeley.edu" className="text-primary underline-offset-2 hover:underline">
                dss@berkeley.edu
              </a>
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Pages</p>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials */}
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Follow us</p>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              {socials.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer + copyright */}
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted leading-relaxed">
          <p>
            We are a student group acting independently of the University of California. We take full
            responsibility for our organization and this website.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Data Science Society at UC Berkeley. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
