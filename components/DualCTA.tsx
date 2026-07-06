import Link from "next/link";
import Button from "./Button";
import NodeGraph from "./NodeGraph";

export default function DualCTA() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="grid md:grid-cols-2 gap-6">
          {/* For students — gradient card */}
          <div className="relative overflow-hidden rounded-2xl brand-gradient p-10 flex flex-col gap-5">
            <NodeGraph className="absolute right-0 top-0 h-full w-3/4" opacity={0.12} />
            <div className="relative z-10 flex flex-col gap-5">
              <p className="font-mono text-xs uppercase tracking-widest text-white/50">
                For students
              </p>
              <h2 className="text-2xl font-bold text-white leading-snug max-w-xs">
                Ready to build with real data?
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                {/* TODO: verify copy */}
                Join DSS and work on real projects, get mentored by alumni, and connect
                with top companies from day one.
              </p>
              <Link
                href="/join"
                className="self-start inline-flex items-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary hover:bg-white/90 transition-opacity"
              >
                Apply now →
              </Link>
            </div>
          </div>

          {/* For companies — light card */}
          <div className="rounded-2xl border border-border bg-bg p-10 flex flex-col gap-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              For companies
            </p>
            <h2 className="text-2xl font-bold text-ink leading-snug max-w-xs">
              Access Berkeley&apos;s top data science talent.
            </h2>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              {/* TODO: verify copy and founding year */}
              Partner with DSS for consulting projects, recruiting pipelines, and sponsored
              research. Trusted by leading companies across tech, finance, and healthcare.
            </p>
            <Button href="/partners" className="self-start">
              Work with us →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
