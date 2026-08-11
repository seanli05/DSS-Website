"use client";

import { useEffect, useRef, useState } from "react";

/** Progress of `p` through the [a, b] sub-range, clamped to 0..1. */
function seg(p: number, a: number, b: number) {
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}

const PULSE_AT = 0.95; // once fully connected, every node pulses (and stays lit)

interface Node {
  id: string;
  x: number;
  y: number;
  r: number;
  at: number; // scroll-progress moment this node pops in
}

interface Edge {
  from: string;
  to: string;
  start: number; // scroll-progress sub-range this connection draws over
  end: number;
}

/* Root node at the bottom, branching upward — same bottom-to-top growth
   direction as GrowingSapling so the two read as siblings when swapped in
   the same page slot. Each node's `at` lines up with its incoming edge's
   `end` so the node pops in exactly as its connection finishes drawing. */
const NODES: readonly Node[] = [
  { id: "root", x: 140, y: 300, r: 5, at: 0 },
  { id: "n1", x: 140, y: 250, r: 4, at: 0.22 },
  { id: "n2", x: 195, y: 225, r: 3.5, at: 0.36 },
  { id: "n3", x: 85, y: 220, r: 3.5, at: 0.4 },
  { id: "n4", x: 140, y: 195, r: 4, at: 0.46 },
  { id: "n5", x: 235, y: 180, r: 3, at: 0.54 },
  { id: "n6", x: 50, y: 175, r: 3, at: 0.58 },
  { id: "n7", x: 185, y: 145, r: 3.5, at: 0.62 },
  { id: "n8", x: 105, y: 140, r: 3.5, at: 0.66 },
  { id: "n9", x: 140, y: 95, r: 4, at: 0.74 },
  { id: "n10", x: 215, y: 95, r: 3, at: 0.8 },
  { id: "n11", x: 85, y: 85, r: 3, at: 0.84 },
  { id: "n12", x: 150, y: 45, r: 3, at: 0.92 },
];

const EDGES: readonly Edge[] = [
  { from: "root", to: "n1", start: 0.05, end: 0.22 },
  { from: "n1", to: "n2", start: 0.24, end: 0.36 },
  { from: "n1", to: "n3", start: 0.26, end: 0.4 },
  { from: "n1", to: "n4", start: 0.3, end: 0.46 },
  { from: "n2", to: "n5", start: 0.4, end: 0.54 },
  { from: "n3", to: "n6", start: 0.44, end: 0.58 },
  { from: "n4", to: "n7", start: 0.5, end: 0.62 },
  { from: "n4", to: "n8", start: 0.52, end: 0.66 },
  { from: "n4", to: "n9", start: 0.58, end: 0.74 },
  { from: "n7", to: "n10", start: 0.66, end: 0.8 },
  { from: "n8", to: "n11", start: 0.7, end: 0.84 },
  { from: "n9", to: "n12", start: 0.8, end: 0.92 },
];

const nodeById = new Map(NODES.map((n) => [n.id, n]));

function EdgeLine({ edge, p }: { edge: Edge; p: number }) {
  const from = nodeById.get(edge.from)!;
  const to = nodeById.get(edge.to)!;
  const drawn = seg(p, edge.start, edge.end);
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      strokeWidth={1.5}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - drawn}
      opacity={drawn === 0 ? 0 : 1}
      className="stroke-primary/45"
    />
  );
}

function NodeDot({ node, p, pulsing, pulseEnabled, index }: { node: Node; p: number; pulsing: boolean; pulseEnabled: boolean; index: number }) {
  // Grow-in is a raw scroll-scrubbed transform (like GrowingSapling's leaves) — no
  // transition here. The pulse never touches transform, only opacity + a glow filter,
  // so the two effects can't clobber each other the way a second transitioned transform
  // on this same element would (see GrowingSapling's Blossom comment for the same pitfall).
  const shown = node.id === "root" ? 1 : seg(p, node.at, node.at + 0.08);
  return (
    <circle
      cx={node.x}
      cy={node.y}
      r={node.r}
      className={`fill-primary ${pulseEnabled ? "network-pulse" : ""}`}
      style={{
        transform: `scale(${shown})`,
        transformBox: "fill-box",
        transformOrigin: "center",
        opacity: pulsing ? 1 : 0.85,
        // Teal glow, not white — this graphic sits on the white editorial field,
        // where a white halo is invisible.
        filter: pulsing ? "drop-shadow(0 0 3px rgba(12,112,110,0.55))" : "none",
        transitionDelay: pulseEnabled ? `${index * 40}ms` : "0ms",
      }}
    />
  );
}

interface GrowingNetworkProps {
  className?: string;
}

/**
 * Node-graph that "grows" as it scrolls into view: starting from a single
 * root, connections draw themselves and new nodes pop in as each connection
 * completes (reversible, scroll-scrubbed) — extends the site's own logo
 * motif (circles + connecting lines) into a scroll-driven graphic, the
 * Consulting-page sibling of GrowingSapling. Once fully connected, every
 * node pulses briefly and stays lit. Renders fully connected for SSR, no-JS,
 * and reduced-motion users. Decorative only (aria-hidden).
 */
export default function GrowingNetwork({ className = "" }: GrowingNetworkProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pulsed, setPulsed] = useState(false);
  const pulsedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion: stay on the static, fully-connected pre-mount render.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 while the graphic is below the viewport → 1 once its top has
      // risen to 35% of the viewport height.
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh - vh * 0.35)));
      setProgress(p);
      if (p >= PULSE_AT && !pulsedRef.current) {
        pulsedRef.current = true; // one-way latch: stays lit once triggered
        setPulsed(true);
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // Only listen to scroll while the graphic is near the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          update();
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll, { passive: true });
        } else {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
        }
      },
      { rootMargin: "25% 0px 25% 0px" }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Pre-mount (SSR / no-JS / reduced motion) renders the finished network.
  const p = mounted ? progress : 1;
  const pulsing = mounted ? pulsed : true;

  return (
    <svg
      ref={ref}
      viewBox="0 0 280 320"
      aria-hidden="true"
      focusable="false"
      className={`w-72 lg:w-96 h-auto ${className}`}
    >
      {EDGES.map((edge) => (
        <EdgeLine key={`${edge.from}-${edge.to}`} edge={edge} p={p} />
      ))}
      {NODES.map((node, index) => (
        <NodeDot key={node.id} node={node} p={p} pulsing={pulsing} pulseEnabled={mounted} index={index} />
      ))}
    </svg>
  );
}
