"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: number;
  label: string;
  suffix: string;
  /**
   * "default" — centered dark-on-light, for the stat grids on About/inner pages.
   * "editorial" — oversized left-aligned teal numeral with a mono label, for the
   * homepage's ruled stats band.
   */
  variant?: "default" | "editorial";
}

export default function StatCounter({ value, label, suffix, variant = "default" }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (reduced) {
          setCount(value);
          return;
        }

        const duration = 1500;
        const start = performance.now();

        const frame = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - (1 - progress) ** 3; // cubic ease-out
          setCount(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(frame);
        };

        requestAnimationFrame(frame);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  if (variant === "editorial") {
    // Inherits the section's typeface. tabular-nums matters here: without it the
    // numeral's width changes on every frame of the count-up and the label jitters.
    return (
      <div ref={ref} className="flex flex-col items-start gap-3 text-left">
        <span className="text-4xl font-bold leading-none tabular-nums text-primary md:text-5xl">
          {count.toLocaleString()}
          {suffix}
        </span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 text-center">
      <span className="font-mono text-4xl font-bold text-primary tabular-nums">
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
