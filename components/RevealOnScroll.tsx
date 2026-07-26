"use client";

import { useEffect, useRef, useState } from "react";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger this element's reveal behind others triggering at the same time. */
  delayMs?: number;
}

// Fades + slides content up once it scrolls into view. Same IntersectionObserver
// pattern as StatCounter: disconnect after the first trigger, skip the motion
// entirely for prefers-reduced-motion instead of just shortening it.
//
// Timing (0.8s, rootMargin -10% on the bottom) matches the reveal used on
// product.studentorg.berkeley.edu — inspected via its computed styles/bundle.
export default function RevealOnScroll({ children, className = "", delayMs = 0 }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      // transitionTimingFunction set inline as the plain "ease" curve (gentle ramp up, not an
      // instant-start ease-out) — Tailwind has no bare `ease` utility, only named variants like
      // ease-out, so this is set directly to match product.studentorg.berkeley.edu exactly
      // (verified via getComputedStyle there: "ease, ease", not "ease-out").
      style={{ transitionDelay: `${delayMs}ms`, transitionTimingFunction: "ease", willChange: "opacity, transform" }}
      className={`transition-[opacity,transform] duration-[800ms] motion-reduce:transition-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}
