/**
 * Derives a card background from a logo's own colors.
 *
 * ─── Why this file is allowed to compute colors ────────────────────────────
 * CLAUDE.md rule 2 says colors live in `globals.css`. That rule is about the
 * *site's* palette, which is fixed and belongs in tokens. These tints are
 * different: they're derived per-row from partner-supplied hex codes that
 * arrive at build time from Airtable, so there is no token to point at. What
 * IS pinned here — and what keeps the result on-brand — is the *tone*: every
 * tint is re-rendered at a fixed lightness and chroma (the constants below),
 * so only the hue survives from the logo. A neon-red logo and a navy one come
 * out equally soft. When a logo gives us nothing usable, this module returns
 * null and the caller falls back to the token palette in `globals.css`.
 *
 * ─── The method ────────────────────────────────────────────────────────────
 * Work in OKLCh, not HSL. HSL's "lightness" is not perceptual — muting a
 * yellow and a blue to the same HSL lightness gives you a pale yellow and a
 * mid-blue, which is exactly how a row of these cards ends up looking
 * mismatched. OKLCh's L is perceptual, so pinning it actually pins how light
 * the card looks.
 *
 * 1. Parse the palette, drop anything that isn't a hex.
 * 2. Ignore near-neutrals (black / white / grey). A wordmark that's pure black
 *    carries no hue, and inventing one would be a lie about the brand.
 * 3. Of what's left, pick the color most likely to be the brand's primary:
 *    highest chroma, penalized for being very dark or very pale (those are
 *    usually shadows and washes, not the identity color).
 * 4. Re-render that hue at the pinned tone. Reduce chroma until it's in sRGB
 *    gamut, so no hue can blow out.
 * 5. If every color in the palette is very light, the logo was drawn for a
 *    dark background — a near-white panel would erase it — so the panel goes
 *    deep instead of pale. The body band stays light either way, so the card's
 *    text colors never have to change.
 */

// The pinned tone. Hue comes from the logo; these do not move, and that's the
// whole reason a row of cards reads as one system.
//
// The values aren't arbitrary — they're measured off the token tints this card
// already falls back to (`bg-primary/[0.045]`, `bg-accent/[0.20]`, `cream`,
// ..., which composite over white to L 0.944-0.983 / C 0.006-0.019). Matching
// that band is what lets a derived card and a fallback card sit side by side
// in the same row without one looking like it belongs to a different site.
// Raising BODY_C much past 0.02 is the single easiest way to wreck this.
const PANEL_L = 0.978; // logo panel — barely tinted, so any logo reads on it
const PANEL_C = 0.008;
const BODY_L = 0.945; // text band — the visible color of the card
const BODY_C = 0.019;
const DARK_PANEL_L = 0.32; // the light-logo variant
const DARK_PANEL_C = 0.055;

// Below this chroma a color carries no usable hue — it's black, white, or grey.
const NEUTRAL_C = 0.035;
// Above this OKLCh lightness a color has too little contrast against a
// near-white panel to be seen on one. Deliberately close to PANEL_L: this is a
// contrast judgement, not a "is it a pale colour" one. A saturated but bright
// mark (neon lime, mid yellow) genuinely does disappear on white, and should
// get the dark panel just as a white wordmark does.
const LIGHT_L = 0.84;

export interface LogoTint {
  /** CSS color for the upper logo panel. */
  panel: string;
  /** CSS color for the lower text band. Always light; text stays ink/muted. */
  body: string;
  /** Readable color for the no-logo monogram, which sits on `panel`. */
  monogram: string;
  /** True when the panel went dark because the logo is light-on-dark. */
  darkPanel: boolean;
}

/**
 * Pulls hex codes out of whatever Airtable hands us for "Logo color palette".
 *
 * That column is currently an AI-generated field, so the cell arrives as
 * `{ state, value, isStale }` rather than a string — and `value` is null
 * whenever generation failed (`state: "error"`, e.g. a row with no logo
 * attached yet). But officers may well swap it for a plain text or
 * multi-select column later, so rather than hard-coding that wrapper this
 * walks whatever shape it's given, collects every string it finds, and pulls
 * hexes out with a regex. Hexes with or without `#`, in either case, comma- or
 * newline-separated, all work; anything unrecognizable is simply dropped and
 * the card falls back to its token palette.
 */
export function parseHexPalette(value: unknown): string[] {
  const matches = collectStrings(value).join(",").match(/#?\b[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) ?? [];
  return matches
    .map((m) => normalizeHex(m))
    .filter((h): h is string => h !== null);
}

/** Every string reachable in `value`, depth-limited so a cyclic or deeply
 *  nested cell can't hang the build. */
function collectStrings(value: unknown, depth = 0): string[] {
  if (depth > 4) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap((v) => collectStrings(v, depth + 1));
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap((v) =>
      collectStrings(v, depth + 1),
    );
  }
  return [];
}

function normalizeHex(raw: string): string | null {
  const h = raw.replace("#", "").trim();
  if (h.length === 3) {
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`.toLowerCase();
  }
  if (h.length === 6) return `#${h}`.toLowerCase();
  return null;
}

/**
 * The tint for a card, or null when the palette gives us nothing to work with
 * (empty, unparseable, or entirely greyscale) — the caller should fall back to
 * the token palette in that case.
 */
export function getLogoTint(palette: string[]): LogoTint | null {
  const colors = palette
    .map(normalizeHex)
    .filter((h): h is string => h !== null)
    .map(hexToOklch);

  if (colors.length === 0) return null;

  // A logo drawn in white/near-white needs a dark panel or it disappears. This
  // is judged on the *whole* palette, not the anchor: one mid-tone accent in an
  // otherwise white mark still means the mark needs a dark ground.
  const darkPanel = colors.every((c) => c.l > LIGHT_L);

  const chromatic = colors.filter((c) => c.c >= NEUTRAL_C);
  if (chromatic.length === 0) {
    // Greyscale logo — no hue to borrow. A dark panel still has to be built
    // (white-on-white is unreadable), so use a neutral one; otherwise hand the
    // decision back to the caller's token palette.
    if (!darkPanel) return null;
    return {
      panel: oklchToHex(DARK_PANEL_L, 0, 0),
      body: oklchToHex(BODY_L, 0, 0),
      monogram: oklchToHex(0.97, 0, 0),
      darkPanel: true,
    };
  }

  const anchor = chromatic.reduce((best, c) =>
    anchorScore(c) > anchorScore(best) ? c : best,
  );

  return {
    panel: darkPanel
      ? oklchToHex(DARK_PANEL_L, DARK_PANEL_C, anchor.h)
      : oklchToHex(PANEL_L, PANEL_C, anchor.h),
    body: oklchToHex(BODY_L, BODY_C, anchor.h),
    // On a dark panel the monogram must be light; on a pale one it should be a
    // deep, legible version of the same hue rather than flat black.
    monogram: darkPanel
      ? oklchToHex(0.93, 0.03, anchor.h)
      : oklchToHex(0.45, 0.09, anchor.h),
    darkPanel,
  };
}

/**
 * How likely a palette entry is to be the brand's identity color. Chroma leads
 * — the most saturated color in a mark is nearly always the one people picture
 * — but very dark and very pale entries are discounted, since those are
 * typically shadows, outlines, and background washes rather than the color the
 * brand is "about".
 */
function anchorScore({ l, c }: Oklch): number {
  const distanceFromIdeal = Math.abs(l - 0.55) / 0.55;
  return c * Math.max(0.3, 1 - 0.5 * distanceFromIdeal);
}

// ─── OKLab / OKLCh ──────────────────────────────────────────────────────────
// Björn Ottosson's OKLab, via linear sRGB. Written out rather than pulled from
// a package: it's ~40 lines, it never changes, and a color dependency in a
// student-maintained repo is a liability at upgrade time.

interface Oklch {
  l: number;
  c: number;
  h: number; // degrees
}

function hexToOklch(hex: string): Oklch {
  const r = toLinear(parseInt(hex.slice(1, 3), 16) / 255);
  const g = toLinear(parseInt(hex.slice(3, 5), 16) / 255);
  const b = toLinear(parseInt(hex.slice(5, 7), 16) / 255);

  const lc = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const mc = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const sc = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const l = 0.2104542553 * lc + 0.793617785 * mc - 0.0040720468 * sc;
  const a = 1.9779984951 * lc - 2.428592205 * mc + 0.4505937099 * sc;
  const bb = 0.0259040371 * lc + 0.7827717662 * mc - 0.808675766 * sc;

  return {
    l,
    c: Math.hypot(a, bb),
    h: (Math.atan2(bb, a) * 180) / Math.PI,
  };
}

/**
 * Renders an OKLCh triple as hex, walking chroma down until the result is
 * actually inside sRGB. Without that step a hue near the gamut edge clips per
 * channel and comes back as a different hue than the one asked for.
 */
function oklchToHex(l: number, c: number, hDeg: number): string {
  let chroma = c;
  for (let i = 0; i < 24; i++) {
    const rgb = oklchToLinearRgb(l, chroma, hDeg);
    if (rgb.every((v) => v >= -0.0001 && v <= 1.0001)) {
      return rgb.map(encodeChannel).join("").replace(/^/, "#");
    }
    chroma *= 0.9;
  }
  return oklchToLinearRgb(l, 0, hDeg).map(encodeChannel).join("").replace(/^/, "#");
}

function oklchToLinearRgb(l: number, c: number, hDeg: number): number[] {
  const h = (hDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);

  const lc = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mc = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sc = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc,
    -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc,
    -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc,
  ];
}

function toLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function encodeChannel(v: number): string {
  const clamped = Math.min(1, Math.max(0, v));
  const srgb = clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * clamped ** (1 / 2.4) - 0.055;
  return Math.round(srgb * 255)
    .toString(16)
    .padStart(2, "0");
}
