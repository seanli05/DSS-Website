import Image from "next/image";
import Link from "next/link";
import NodeGraph from "./NodeGraph";

export default function Hero() {
  // -mt-16/pt-16 pulls the hero up behind the fixed translucent nav (main has pt-16)
  return (
    <section className="relative -mt-16 pt-16 min-h-[62vh] flex items-center justify-center brand-gradient overflow-hidden">
      <NodeGraph id="particles-home" className="absolute inset-0 w-full h-full pointer-events-none" opacity={0.25} />

      <div className="relative z-10 mx-auto flex max-w-[1200px] w-full flex-col items-center px-6 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-6">
          Data Science Society at UC Berkeley
        </p>

        {/* Logo as the vibrant centerpiece */}
        <div className="relative mb-6 flex items-center justify-center">
          <div
            className="hero-halo absolute h-[190px] w-[190px] md:h-[240px] md:w-[240px] rounded-full opacity-50"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.9) 15%, transparent 30%, transparent 60%, rgba(255,255,255,0.6) 75%, transparent 90%)",
              maskImage: "radial-gradient(circle, transparent 62%, black 64%, black 68%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 62%, black 64%, black 68%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div className="hero-logo-intro hero-logo-breathe relative h-[140px] w-[140px] md:h-[190px] md:w-[190px] drop-shadow-[0_0_45px_rgba(255,255,255,0.5)]">
            <Image
              src="/dss-logo-white.png"
              alt="Data Science Society logo"
              fill
              priority
              sizes="(min-width: 768px) 190px, 140px"
              className="object-contain"
            />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] max-w-2xl">
          We turn Berkeley students into data scientists.
        </h1>

        <p className="mt-4 text-base md:text-lg text-white/70 max-w-lg leading-relaxed">
          We are a student-run organization that focuses on completing impactful projects in data and software, transforming our members into leaders, and inspiring students at UC Berkeley to pursue tech.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
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
