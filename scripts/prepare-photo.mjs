/**
 * Turns an original photo into a web-ready JPEG for public/images/.
 *
 *   npm run photo -- <input> <output.jpg> [--width 1600] [--height 1200] [--position center]
 *
 * Examples:
 *   # Resize so the long edge is 2000px (default), keep the original shape
 *   npm run photo -- assets/photo-originals/home/group.jpg public/images/home/group-photo.jpg
 *
 *   # Crop to an exact size (here 4:3), keeping the bottom of the frame
 *   npm run photo -- in.jpg public/images/committees/acadev/socials.jpg --width 1200 --height 900 --position bottom
 *
 * What it does:
 *   - Applies the phone's EXIF rotation and strips the tag, so a photo never
 *     shows up sideways in some browsers.
 *   - With only --width (or nothing): scales the long edge down to that size.
 *   - With --width AND --height: crops to fill exactly that box. --position
 *     (center | top | bottom | left | right) picks which part of the frame to keep.
 *   - Saves a JPEG at quality 82, which keeps most photos well under 1 MB.
 *
 * HEIC files (iPhone photos) aren't supported by the bundled image library.
 * Convert them first on a Mac with:  sips -s format jpeg in.heic --out in.jpg
 *
 * Keep the untouched original under assets/photo-originals/ so the photo can be
 * re-cropped later without hunting for it again.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error(
    "Usage: npm run photo -- <input> <output.jpg> [--width N] [--height N] [--position center|top|bottom|left|right]"
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const positional = [];
const options = {};
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) {
    options[args[i].slice(2)] = args[i + 1];
    i++;
  } else {
    positional.push(args[i]);
  }
}

const [input, output] = positional;
if (!input || !output) usage();
if (!fs.existsSync(input)) usage(`input file not found: ${input}`);
if (!/\.jpe?g$/i.test(output)) usage("output must end in .jpg");

const width = options.width ? Number(options.width) : 2000;
const height = options.height ? Number(options.height) : undefined;
const position = options.position ?? "center";

const resize = height
  ? { width, height, fit: "cover", position }
  : { width, height: width, fit: "inside", withoutEnlargement: true };

fs.mkdirSync(path.dirname(output), { recursive: true });
const info = await sharp(input)
  .rotate()
  .resize(resize)
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(output);

console.log(`Saved ${output} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
