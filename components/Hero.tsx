import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-hero-canvas">
      {/* Aurora glow blobs — abstract atmosphere in place of Air's cloud photography */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-aurora-a absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-bright/25 blur-[110px]" />
        <div className="hero-aurora-b absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1200px] w-full flex-col items-center px-6 py-28 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-10">
          Data Science Society at UC Berkeley
        </p>

        {/* Logo as the vibrant centerpiece */}
        <div className="relative mb-10 flex items-center justify-center">
          <div
            className="hero-halo absolute h-[300px] w-[300px] md:h-[380px] md:w-[380px] rounded-full opacity-40"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, #1D8C89 15%, transparent 30%, transparent 60%, #8FB573 75%, transparent 90%)",
              maskImage: "radial-gradient(circle, transparent 62%, black 64%, black 68%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 62%, black 64%, black 68%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div className="hero-logo-intro hero-logo-breathe relative h-[220px] w-[220px] md:h-[300px] md:w-[300px] drop-shadow-[0_0_60px_rgba(29,140,137,0.55)]">
            <Image
              src="/dss-logo-gradient.png"
              alt="Data Science Society logo"
              fill
              priority
              sizes="(min-width: 768px) 300px, 220px"
              className="object-contain"
            />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-3xl">
          We turn Berkeley students into data scientists.
        </h1>

        <p className="mt-6 text-lg md:text-xl text-white/70 max-w-lg leading-relaxed">
          We are a student-run organization that focuses on completing impactful projects in data and software, transforming our members into leaders, and inspiring students at UC Berkeley to pursue tech.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/join"
            className="inline-flex items-center rounded-full px-7 py-3 text-base font-semibold text-white shadow-lg transition-opacity hover:opacity-90 brand-gradient"
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
