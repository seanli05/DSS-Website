/**
 * Downloads every Airtable attachment the site renders into `public/airtable/`
 * and writes a manifest mapping each attachment's stable id to its local path.
 *
 * WHY THIS EXISTS
 * ---------------
 * Airtable's API returns attachment URLs that are signed and expire a few hours
 * after they're issued (they 410 afterwards). This site fetches content at BUILD
 * time and bakes the results into static HTML, so those URLs die while the
 * deployment lives on — every logo, headshot, and project image 404s a few hours
 * after each deploy. Mirroring the bytes into `public/` at build time makes them
 * ordinary static assets of the deployment, which cannot expire.
 *
 * Runs automatically via the `prebuild` npm script, BEFORE `next build`. It has
 * to run before rather than during the build so the files are on disk by the time
 * Next collects `public/`.
 *
 * Keyed by attachment id, never by URL: the signed URL changes on every fetch, so
 * a URL-keyed manifest would miss on the very next build.
 *
 * No token (preview/dev builds) => exits quietly. lib/content.ts then falls back
 * to the committed JSON, which references local images already.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import Airtable from "airtable";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "airtable");
const MANIFEST = path.join(ROOT, "content", "airtable-manifest.json");

/** Vercel injects env vars directly; local runs read .env.local. Hand-parsed to
 *  avoid a dependency and to work on any Node 20.x (--env-file landed in 20.6). */
function loadLocalEnv() {
  if (process.env.AIRTABLE_TOKEN) return;
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

/** Every table/field pair that holds an attachment the site renders. Keep in
 *  sync with the `attachmentUrls(...)` calls in lib/content.ts — a field missing
 *  here still renders, but via an expiring URL. */
const SOURCES = [
  { env: "CONSULTING_PROJECTS_TABLE", fields: ["Logo", "Additional Images/GIFS"] },
  { env: "SOCIAL_GOOD_PROJECTS_TABLE", fields: ["Logo", "Additional Images/GIFS"] },
  { env: "ACADEV_PROJECTS_TABLE", fields: ["Logo", "Additional Images/GIFS"] },
  { env: "EXTERNAL_EVENTS_TABLE", fields: ["Image"] },
  { env: "LOGOWALL_TABLE", fields: ["Logo"] },
  { env: "EXEC_PROFILES_TABLE", fields: ["Headshot"] },
];

const EXT_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
};

function extensionFor(att) {
  const fromName = path.extname(att.filename ?? "").toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;
  return EXT_BY_MIME[att.type] ?? ".bin";
}

/** Animated GIFs are the one format next/image refuses to touch — it passes them
 *  through byte-for-byte, so a 10 MB GIF is a 10 MB download for whoever opens
 *  the modal. Re-encoded to H.264 they land ~17x smaller with better quality.
 *  Detected by counting Graphic Control Extension blocks: more than one means
 *  more than one frame. */
function isAnimatedGif(buf) {
  if (buf.subarray(0, 6).toString("ascii") !== "GIF89a") return false;
  let count = 0, i = 0;
  while ((i = buf.indexOf(Buffer.from([0x21, 0xf9, 0x04]), i)) !== -1) {
    if (++count > 1) return true;
    i += 3;
  }
  return false;
}

/** ffmpeg-static is an OPTIONAL dependency: if its binary failed to install we
 *  simply keep the GIF rather than failing the build. Resolved lazily so the
 *  import cost is only paid when there's actually a GIF to convert. */
async function ffmpegPath() {
  try {
    const mod = await import("ffmpeg-static");
    return mod.default ?? mod;
  } catch {
    return null;
  }
}

/** crf 31 measured at ~0.58 MB for an 80-frame 800x450 clip (vs 9.97 MB as GIF).
 *  yuv420p + even dimensions are required for Safari/iOS playback; faststart puts
 *  the moov atom first so the video starts before it has fully downloaded. */
function transcodeToMp4(bin, src, dest) {
  execFileSync(bin, [
    "-y", "-loglevel", "error",
    "-i", src,
    "-movflags", "+faststart",
    "-pix_fmt", "yuv420p",
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-c:v", "libx264", "-preset", "slow", "-crf", "31",
    "-an",
    dest,
  ], { stdio: ["ignore", "ignore", "pipe"] });
}

async function download(att, dest) {
  const res = await fetch(att.url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${att.filename ?? att.id}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length === 0) throw new Error(`empty body for ${att.filename ?? att.id}`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

/** Bounded parallelism — enough to keep the build quick, not so much that we
 *  hammer Airtable's CDN. */
async function pool(items, limit, worker) {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) await worker(queue.shift());
  });
  await Promise.all(runners);
}

async function main() {
  loadLocalEnv();
  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = process.env;

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.log("[mirror-airtable] No Airtable credentials — skipping (JSON fallbacks will be used).");
    return;
  }

  const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);

  // Deduped by attachment id: the same file can appear in several rows, and a
  // rebuild shouldn't download it twice.
  const attachments = new Map();

  for (const src of SOURCES) {
    const table = process.env[src.env];
    if (!table) {
      console.log(`[mirror-airtable] ${src.env} not set — skipping that table.`);
      continue;
    }
    try {
      const records = await base(table).select({ view: "Grid view" }).all();
      for (const r of records) {
        for (const field of src.fields) {
          const cell = r.fields[field];
          if (!Array.isArray(cell)) continue;
          for (const att of cell) {
            if (att?.id && typeof att.url === "string") attachments.set(att.id, att);
          }
        }
      }
      console.log(`[mirror-airtable] ${src.env}: ${records.length} rows scanned.`);
    } catch (err) {
      // One misconfigured table shouldn't stop the others from being mirrored.
      console.error(`[mirror-airtable] ${src.env}: fetch failed —`, err.message);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifest = {};
  let downloaded = 0, reused = 0, failed = 0, converted = 0, bytes = 0;

  const ffmpeg = await ffmpegPath();
  if (!ffmpeg) {
    console.warn("[mirror-airtable] ffmpeg-static unavailable — animated GIFs will be served as-is.");
  }

  await pool([...attachments.values()], 6, async (att) => {
    let file = `${att.id}${extensionFor(att)}`;
    let dest = path.join(OUT_DIR, file);
    const mp4Dest = path.join(OUT_DIR, `${att.id}.mp4`);
    try {
      // An already-converted clip is cached as the .mp4, so the GIF is gone —
      // check for both before deciding to re-download.
      if (fs.existsSync(mp4Dest) && fs.statSync(mp4Dest).size > 0) {
        manifest[att.id] = `/airtable/${att.id}.mp4`;
        reused++;
        return;
      }
      if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
        reused++;
      } else {
        // Read-modify-write must not straddle the await: `bytes += await ...`
        // samples `bytes` before suspending, so concurrent workers clobber each
        // other's totals and the summary under-reports badly.
        const written = await download(att, dest);
        bytes += written;
        downloaded++;
      }

      if (ffmpeg && file.endsWith(".gif") && isAnimatedGif(fs.readFileSync(dest))) {
        const before = fs.statSync(dest).size;
        try {
          transcodeToMp4(ffmpeg, dest, mp4Dest);
          const after = fs.statSync(mp4Dest).size;
          fs.unlinkSync(dest); // the GIF is dead weight once the MP4 exists
          file = `${att.id}.mp4`;
          dest = mp4Dest;
          converted++;
          console.log(
            `[mirror-airtable] converted ${att.filename ?? att.id} to MP4: ` +
            `${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB ` +
            `(${(before / after).toFixed(1)}x smaller)`
          );
        } catch (err) {
          // Keep the GIF — a failed conversion should degrade, not break.
          console.error(`[mirror-airtable] MP4 conversion failed for ${att.filename ?? att.id}:`, err.message);
          if (fs.existsSync(mp4Dest)) fs.unlinkSync(mp4Dest);
        }
      }

      manifest[att.id] = `/airtable/${file}`;
    } catch (err) {
      // Left out of the manifest on purpose: lib/content.ts then falls back to
      // the signed URL, so the image still renders today even though it will
      // expire. Loud, because that's a silent time bomb otherwise.
      failed++;
      console.error(`[mirror-airtable] FAILED ${att.filename ?? att.id}:`, err.message);
    }
  });

  // Sorted keys so the manifest only changes when the attachments do — otherwise
  // every build would show a spurious diff.
  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");

  console.log(
    `[mirror-airtable] ${Object.keys(sorted).length} attachments mirrored ` +
    `(${downloaded} downloaded, ${reused} already present, ${converted} converted to MP4, ${failed} failed, ` +
    `${(bytes / 1024 / 1024).toFixed(1)} MB fetched).`
  );
}

main().catch((err) => {
  // Never break the build: an unmirrored site still renders via signed URLs.
  console.error("[mirror-airtable] Unexpected failure:", err);
});
