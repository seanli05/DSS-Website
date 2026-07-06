import type { Metadata } from "next";
import Section from "@/components/Section";
import Button from "@/components/Button";
import NodeGraph from "@/components/NodeGraph";

export const metadata: Metadata = { title: "Styleguide" };

// ─── Color swatches ───────────────────────────────────────────────────────────
const colors = [
  { name: "bg",             hex: "#FFFFFF",  label: "--color-bg" },
  { name: "surface",        hex: "#F5F8F7",  label: "--color-surface" },
  { name: "ink",            hex: "#0B1D1C",  label: "--color-ink" },
  { name: "muted",          hex: "#5A6B68",  label: "--color-muted" },
  { name: "border",         hex: "#E2E8E6",  label: "--color-border" },
  { name: "primary",        hex: "#0C706E",  label: "--color-primary" },
  { name: "primary-bright", hex: "#1D8C89",  label: "--color-primary-bright" },
  { name: "accent",         hex: "#8FB573",  label: "--color-accent" },
];

export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-bg pb-32">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-6 pt-16 pb-8 border-b border-border">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">DSS Berkeley</p>
        <h1 className="text-4xl font-bold tracking-tight text-ink">Design System</h1>
        <p className="mt-2 text-muted">Primitives for Phase 1+. Not linked in the public nav.</p>
      </div>

      {/* ── Colors ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-6 pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">Color tokens</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {colors.map(({ name, hex, label }) => (
            <div key={name} className="flex flex-col gap-2">
              <div
                className="h-16 w-full rounded-lg border border-border"
                style={{ backgroundColor: hex }}
              />
              <p className="text-xs font-mono text-ink">{label}</p>
              <p className="text-xs text-muted">{hex}</p>
            </div>
          ))}
          {/* Gradient swatch */}
          <div className="flex flex-col gap-2">
            <div className="h-16 w-full rounded-lg brand-gradient" />
            <p className="text-xs font-mono text-ink">--gradient-brand</p>
            <p className="text-xs text-muted">135deg teal → sage</p>
          </div>
        </div>
      </div>

      {/* ── Typography ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-6 pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">Typography</p>
        <div className="flex flex-col gap-6 border border-border rounded-xl p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Eyebrow label — mono, xs, widest</p>
          <h1 className="text-5xl font-bold tracking-tight text-ink">Heading 1 — 5xl bold</h1>
          <h2 className="text-3xl font-bold tracking-tight text-ink">Heading 2 — 3xl bold</h2>
          <h3 className="text-xl font-semibold text-ink">Heading 3 — xl semibold</h3>
          <p className="text-base text-ink leading-relaxed max-w-prose">
            Body text — Inter 16px. DSS turns Berkeley students into data scientists through
            real consulting projects, industry partnerships, and a tight-knit community.
          </p>
          <p className="text-sm text-muted leading-relaxed max-w-prose">
            Small muted text — used for captions, helper copy, and secondary information.
          </p>
          <p className="font-mono text-sm text-primary">
            Mono accent — stat counters, code labels, timestamps. IBM Plex Mono.
          </p>
          <p className="brand-gradient-text text-2xl font-bold tracking-tight">
            Gradient text — hero headlines, brand moments.
          </p>
        </div>
      </div>

      {/* ── Buttons ────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-6 pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">Buttons</p>
        <div className="flex flex-col gap-6 border border-border rounded-xl p-8">
          {/* Variants */}
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          {/* Sizes */}
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          {/* As links */}
          <div className="flex flex-wrap items-center gap-4">
            <Button href="/join">Internal link</Button>
            <Button href="https://berkeley.edu" external variant="outline">External link ↗</Button>
          </div>
        </div>
      </div>

      {/* ── Section component ──────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-6 pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">Section component</p>
      </div>

      <Section
        eyebrow="Our mission"
        heading="We turn Berkeley students into data scientists."
        subtext="Through real-world projects, committee work, and industry partnerships, DSS gives you the skills and network to launch a career in data."
      >
        <div className="grid sm:grid-cols-3 gap-6 mt-4">
          {["Projects", "Committees", "Partnerships"].map((label) => (
            <div key={label} className="rounded-xl border border-border p-6">
              <p className="font-semibold text-ink">{label}</p>
              <p className="mt-2 text-sm text-muted">Placeholder card — Phase 2.</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Surface variant"
        heading="This section uses bg-surface."
        subtext="Alternate sections use --color-surface to create visual rhythm without borders."
        surface
        centered
      >
        <Button href="/join" size="lg" className="mt-2">Join DSS</Button>
      </Section>

      {/* ── Node-graph motif ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-6 pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">Node-graph motif</p>
        <div className="relative flex items-center justify-center rounded-xl border border-border bg-surface overflow-hidden h-64">
          <NodeGraph className="absolute inset-0 w-full h-full" opacity={0.25} />
          <p className="relative z-10 font-mono text-sm text-muted">NodeGraph at opacity 0.25</p>
        </div>
        <div className="mt-4 relative flex items-center justify-center rounded-xl border border-border bg-ink overflow-hidden h-64">
          <NodeGraph className="absolute inset-0 w-full h-full" opacity={0.3} />
          <p className="relative z-10 font-mono text-sm text-white/60">NodeGraph on dark bg at 0.3</p>
        </div>
      </div>

      {/* ── Gradient hero strip ────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-6 pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">Gradient hero strip</p>
        <div className="relative rounded-2xl overflow-hidden brand-gradient px-10 py-16 flex flex-col items-start gap-6">
          <NodeGraph className="absolute right-0 top-0 h-full w-1/2" opacity={0.15} />
          <p className="font-mono text-xs uppercase tracking-widest text-white/60">Data Science Society</p>
          <h2 className="text-4xl font-bold text-white tracking-tight max-w-xl">
            We turn Berkeley students into data scientists.
          </h2>
          <div className="flex gap-4">
            <Button variant="outline" href="/join" className="border-white text-white hover:bg-white hover:text-primary">
              Join DSS
            </Button>
            <Button variant="ghost" href="/partners" className="text-white hover:bg-white/10">
              Partner with us →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
