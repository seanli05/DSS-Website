"use client";

// TODO: Replace placeholder tiles with real next/image photos when available
const TILES = [
  { id: 1, label: "DSS Kickoff",      style: "bg-primary/20" },
  { id: 2, label: "Data Challenge",   style: "bg-primary/10" },
  { id: 3, label: "Industry Mixer",   style: "bg-primary/25" },
  { id: 4, label: "Workshop Day",     style: "bg-primary/15" },
  { id: 5, label: "Team Dinner",      style: "bg-primary/20" },
  { id: 6, label: "Demo Night",       style: "bg-primary/30" },
];

export default function Gallery() {
  return (
    <div
      className="flex gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory -mx-6 px-6"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {TILES.map((tile) => (
        <div
          key={tile.id}
          className={`flex-none w-72 h-52 rounded-2xl border border-border ${tile.style} flex items-end p-5 snap-start`}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            {tile.label}
          </p>
        </div>
      ))}
      {/* Extra right padding so the last tile doesn't sit flush against the edge */}
      <div className="flex-none w-6" aria-hidden="true" />
    </div>
  );
}
