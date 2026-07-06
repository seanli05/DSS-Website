"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: number;
  label: string;
  suffix: string;
}

export default function StatCounter({ value, label, suffix }: StatCounterProps) {
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
