import Link from "next/link";
import NodeGraph from "./NodeGraph";

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center brand-gradient overflow-hidden">
      <NodeGraph id="particles-home" className="absolute inset-0 w-full h-full pointer-events-none" opacity={0.25} />

      <div className="relative z-10 mx-auto max-w-[1200px] w-full px-6 py-28">
        <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-6">
          Data Science Society at UC Berkeley
        </p>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] max-w-3xl">
          We turn Berkeley students into data scientists.
        </h1>

        <p className="mt-8 text-lg md:text-xl text-white/70 max-w-lg leading-relaxed">
          We are a student-run organization that focuses on completing impactful projects in data and software, transforming our members into leaders, and inspiring students at UC Berkeley to pursue tech.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/join"
            className="inline-flex items-center rounded-full bg-white px-7 py-3 text-base font-semibold text-primary shadow-lg hover:bg-white/90 transition-opacity"
          >
            Join DSS
          </Link>
          <Link
            href="/partners"
            className="inline-flex items-center rounded-full border border-white/60 px-7 py-3 text-base font-semibold text-white hover:border-white hover:bg-white/10 transition-all"
          >
            Partner with us →
          </Link>
        </div>
      </div>
    </section>
  );
}
