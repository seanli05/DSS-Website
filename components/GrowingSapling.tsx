"use client";

import { useEffect, useRef, useState } from "react";

/** Progress of `p` through the [a, b] sub-range, clamped to 0..1. */
function seg(p: number, a: number, b: number) {
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}

const TRUNK_PATH =
  "M140 300 C136 262 144 228 140 190 C137 165 134 140 130 112 C128 98 127 84 124 68";
const TRUNK_END = 0.4; // trunk finishes drawing at this scroll progress
const BLOOM_AT = 0.95; // blossoms pop (and latch open) at this progress

interface Branch {
  d: string;
  start: number; // scroll-progress sub-range this limb draws over
  end: number;
  tip: readonly [number, number]; // where its blossom sits
  strokeWidth: number;
  behind?: boolean; // painted under the taproot — reads as a different plane
}

/* Primary limbs start on the trunk curve; forks start on their parent's
   curve, only after the parent has drawn past the attachment point.
   To avoid the flat "fishbone" look, vary each limb's angle (~15°–70°),
   length, and curvature. Keep every tip ≥ ~25 units from its neighbors —
   a blossom is ~19 units wide, closer and the petals overlap. */
const BRANCHES: readonly Branch[] = [
  // primaries, bottom to top
  { d: "M140 258 C160 251 180 250 200 246", start: 0.16, end: 0.4, tip: [200, 246], strokeWidth: 2.5 }, // long, shallow right
  { d: "M141 232 C130 220 120 210 112 194", start: 0.22, end: 0.46, tip: [112, 194], strokeWidth: 2.5 }, // steep left
  { d: "M140 196 C158 192 164 180 186 168", start: 0.28, end: 0.52, tip: [186, 168], strokeWidth: 2.5 }, // S-curve right
  { d: "M137 163 C118 158 96 152 74 146", start: 0.34, end: 0.58, tip: [74, 146], strokeWidth: 2.5 }, // long, shallow left
  { d: "M135 134 C142 124 148 116 152 104", start: 0.4, end: 0.64, tip: [152, 104], strokeWidth: 2.5 }, // short, steep right
  { d: "M131 108 C118 100 106 94 92 84", start: 0.46, end: 0.7, tip: [92, 84], strokeWidth: 2.5 }, // moderate left
  { d: "M124 68 C123 56 127 46 134 34", start: 0.5, end: 0.74, tip: [134, 34], strokeWidth: 2.5 }, // near-vertical top
  // forks off a primary
  { d: "M176 250 C182 240 186 230 192 218", start: 0.42, end: 0.66, tip: [192, 218], strokeWidth: 2 }, // steep, off shallow P1
  { d: "M100 150 C88 144 72 134 56 120", start: 0.56, end: 0.8, tip: [56, 120], strokeWidth: 2 }, // deep, off shallow P4
  { d: "M112 94 C106 84 102 74 100 60", start: 0.62, end: 0.86, tip: [100, 60], strokeWidth: 2 }, // near-vertical, off P6
  // limbs that pass behind the taproot (start hidden under its stroke)
  { d: "M141 176 C160 172 180 164 206 150", start: 0.44, end: 0.68, tip: [206, 150], strokeWidth: 2, behind: true },
  { d: "M129 122 C112 118 96 114 80 108", start: 0.58, end: 0.82, tip: [80, 108], strokeWidth: 2, behind: true },
];

/* Leaves sit on the trunk or mid-branch and scale in once their limb has drawn. */
const LEAVES = [
  { x: 141, y: 272, rotate: -150, at: 0.1 },
  { x: 133, y: 150, rotate: -140, at: 0.28 },
  { x: 168, y: 251, rotate: -10, at: 0.35 },
  { x: 125, y: 213, rotate: -110, at: 0.41 },
  { x: 158, y: 188, rotate: -25, at: 0.47 },
  { x: 103, y: 153, rotate: -175, at: 0.53 },
  { x: 146, y: 117, rotate: -70, at: 0.59 },
] as const;

/* Five-petal blossom drawn around (0,0); petal centers sit on a ring of
   radius 5.8. With PETAL_R 4, neighboring petals (6.8 apart) overlap
   slightly (~1.2 units) like real petals while each stays readable —
   past ~4.5 they mush together, below ~3.4 they separate completely. */
const PETAL_R = 4;
const PETALS = [
  [0, -5.8],
  [5.5, -1.8],
  [3.4, 4.7],
  [-3.4, 4.7],
  [-5.5, -1.8],
] as const;

function Blossom({
  tip,
  open,
  delayMs,
  popEnabled,
}: {
  tip: readonly [number, number];
  open: boolean;
  delayMs: number;
  popEnabled: boolean;
}) {
  return (
    <g transform={`translate(${tip[0]} ${tip[1]})`}>
      <g
        className={popEnabled ? "sapling-blossom" : undefined}
        style={{
          transform: open ? "scale(1)" : "scale(0)",
          transformBox: "fill-box",
          transformOrigin: "center",
          transitionDelay: `${delayMs}ms`,
        }}
      >
        {PETALS.map(([px, py]) => (
          <circle
            key={`${px},${py}`}
            cx={px}
            cy={py}
            r={PETAL_R}
            strokeWidth={1}
            className="fill-blossom stroke-primary"
          />
        ))}
        <circle r={2.4} className="fill-primary-bright" />
      </g>
    </g>
  );
}

/* One growing limb; extracted so behind-limbs can render under the trunk.
   The opacity gate hides the round-linecap dot before drawing starts. */
function BranchPath({ branch, p }: { branch: Branch; p: number }) {
  const drawn = seg(p, branch.start, branch.end);
  return (
    <path
      d={branch.d}
      strokeWidth={branch.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - drawn}
      opacity={drawn === 0 ? 0 : 1}
      className="stroke-blossom"
    />
  );
}

interface GrowingSaplingProps {
  className?: string;
}

/**
 * Line-art root system that "grows" as it scrolls into view: starting from a
 * soil line at the top, the taproot and side roots draw themselves downward
 * in sync with scroll (reversible), then blossoms pop at the root tips and
 * stay open. (The art is authored as an upward tree and mirrored by a wrapper
 * <g>, so scrolling down extends growth downward.) Renders fully bloomed for
 * SSR, no-JS, and reduced-motion users. Decorative only (aria-hidden).
 */
export default function GrowingSapling({ className = "" }: GrowingSaplingProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bloomed, setBloomed] = useState(false);
  const bloomedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion: stay on the static, fully-bloomed pre-mount render.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 while the sapling is below the viewport → 1 once its top has
      // risen to 35% of the viewport height.
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh - vh * 0.35)));
      setProgress(p);
      if (p >= BLOOM_AT && !bloomedRef.current) {
        bloomedRef.current = true; // one-way latch: blossoms never close
        setBloomed(true);
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // Only listen to scroll while the sapling is near the viewport.
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

  // Pre-mount (SSR / no-JS / reduced motion) renders the finished sapling.
  const p = mounted ? progress : 1;
  const open = mounted ? bloomed : true;
  const trunkDrawn = seg(p, 0, TRUNK_END);

  return (
    <svg
      ref={ref}
      viewBox="0 0 280 320"
      aria-hidden="true"
      focusable="false"
      className={`w-72 lg:w-96 h-auto ${className}`}
    >
      {/* Mirror vertically: the art below is authored as an upward tree, this
          wrapper flips it so growth heads downward, roots-style */}
      <g transform="scale(1 -1) translate(0 -320)">
      {/* soil line (sits at the top after the flip) */}
      <path
        d="M70 300 Q140 308 210 300"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        opacity={0.4}
        className="stroke-blossom"
      />

      {/* limbs passing behind the taproot — painted first so it covers them */}
      {BRANCHES.filter((branch) => branch.behind).map((branch) => (
        <BranchPath key={branch.d} branch={branch} p={p} />
      ))}

      {/* trunk — pathLength=1 normalizes dash math so offset 1→0 draws it */}
      <path
        d={TRUNK_PATH}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - trunkDrawn}
        opacity={trunkDrawn === 0 ? 0 : 1}
        className="stroke-blossom"
      />

      {/* remaining limbs — painted over the trunk like the near side of a tree */}
      {BRANCHES.filter((branch) => !branch.behind).map((branch) => (
        <BranchPath key={branch.d} branch={branch} p={p} />
      ))}

      {/* leaves — grow from their attachment point (scrubbed, reversible) */}
      {LEAVES.map((leaf) => (
        <g
          key={`${leaf.x},${leaf.y}`}
          transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotate})`}
        >
          <g
            style={{
              transform: `scale(${seg(p, leaf.at, leaf.at + 0.13)})`,
              transformBox: "fill-box",
              transformOrigin: "0% 50%",
            }}
          >
            <path
              d="M0 0 Q5.5 -4.5 11 0 Q5.5 4.5 0 0 Z"
              strokeWidth={2}
              strokeLinejoin="round"
              className="stroke-accent fill-accent/20"
            />
          </g>
        </g>
      ))}

      {/* blossoms — pop with a small stagger once growth completes */}
      {BRANCHES.map((branch, i) => (
        <Blossom
          key={branch.d}
          tip={branch.tip}
          open={open}
          delayMs={i * 60}
          popEnabled={mounted}
        />
      ))}
      </g>
    </svg>
  );
}
