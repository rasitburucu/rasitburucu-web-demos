// Sazbahçe images -> avif + webp at a few widths in public/sazbahce/img.
// Sources (scripts/.raw/sazbahce/, not committed): three Pexels photographs of
// the real lake (<id>.jpg) and eight renders of the four areas (r-<area>.png,
// copied from .tasarim/sazbahce/blender/render/). Licences: content/sazbahce/credits.ts.
//
// Grade ("akşam"): a little less saturation, warm highlights (ayva), shadows
// lifted toward the brand ink (#1D3830), so photographs from different
// countries and hours read as one evening at the same lake.
//
//   node scripts/process-sazbahce-images.mjs            (all)
//   node scripts/process-sazbahce-images.mjs golyazi    (some)
import sharp from "sharp";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";

const RAW = "scripts/.raw/sazbahce";
const OUT = "public/sazbahce/img";
const DIMS = "content/sazbahce/image-dims.json";
const INK = { r: 22, g: 44, b: 37 };

const XL = [640, 1024, 1600, 2200]; // full-bleed band
const L = [640, 1024, 1600];
const M = [480, 800, 1200];

// crop: [left, top, width, height] as fractions of the source
// warm: 0..1 extra evening warmth (daylight photos get more)
const jobs = [
  // photographs (real places: the lake, the reeds, Gölyazı)
  { key: "golyazi", id: "36520717", widths: XL, warm: 0, sat: 0.92 },
  // phones: the sunset corner of the same photograph (sun, water, the shore houses)
  { key: "golyaziM", id: "36520717", widths: [480, 800, 1200], warm: 0, sat: 0.92, crop: [0.06, 0.45, 0.5, 0.5] },
  { key: "sazlik", id: "33066315", widths: L, warm: 0, sat: 0.88 },
  { key: "liman", id: "19962368", widths: M, warm: 0.5, crop: [0, 0.25, 1, 0.6] },
  // the four areas: our own Blender renders (.tasarim/sazbahce/blender), already graded in the render
  { key: "cayir", file: "r-cayir.png", widths: L, warm: 0, sat: 1.0 },
  { key: "cayir2", file: "r-cayir2.png", widths: L, warm: 0, sat: 1.0 },
  { key: "ambar", file: "r-ambar.png", widths: L, warm: 0, sat: 1.0 },
  { key: "ambar2", file: "r-ambar2.png", widths: L, warm: 0, sat: 1.0 },
  { key: "ambarUzun", file: "r-ambar-uzun.png", widths: L, warm: 0, sat: 1.0 },
  { key: "avlu", file: "r-avlu.png", widths: L, warm: 0, sat: 1.0 },
  { key: "avlu2", file: "r-avlu2.png", widths: L, warm: 0, sat: 1.0 },
  { key: "iskele", file: "r-iskele.png", widths: L, warm: 0, sat: 1.0 },
  { key: "iskele2", file: "r-iskele2.png", widths: L, warm: 0, sat: 1.0 },
];

const only = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });
const dims = existsSync(DIMS) ? JSON.parse(readFileSync(DIMS, "utf8")) : {};

async function graded(job) {
  let img = sharp(`${RAW}/${job.file ?? `${job.id}.jpg`}`).rotate();
  const meta = await img.metadata();
  let { width, height } = meta;
  if (job.crop) {
    const [l, t, w, h] = job.crop;
    const region = { left: Math.round(l * width), top: Math.round(t * height), width: Math.round(w * width), height: Math.round(h * height) };
    img = img.extract(region);
    width = region.width;
    height = region.height;
  }
  const w = job.warm ?? 0.3;
  // warm: lift red, keep green, pull blue down a touch; offsets warm the shadows slightly
  const base = await img
    .modulate({ saturation: job.sat ?? 0.82, brightness: 1.0 })
    .linear([1 + 0.06 * w, 1 + 0.01 * w, 1 - 0.1 * w], [4 * w, 2 * w, -2 * w])
    .toBuffer();
  const lifted = await sharp(base)
    .composite([{ input: { create: { width, height, channels: 3, background: INK } }, blend: "lighten" }])
    .toBuffer();
  return { buf: lifted, width, height };
}

for (const job of jobs) {
  if (only.length && !only.includes(job.key)) continue;
  const { buf, width, height } = await graded(job);
  let bytes = 0;
  for (const w of job.widths) {
    const r = sharp(buf).resize({ width: Math.min(w, width) });
    const a = await r.clone().avif({ quality: 52, effort: 5 }).toFile(`${OUT}/${job.key}-${w}.avif`);
    const b = await r.clone().webp({ quality: 74 }).toFile(`${OUT}/${job.key}-${w}.webp`);
    bytes += a.size + b.size;
  }
  dims[job.key] = { w: width, h: height, widths: job.widths, source: job.id ?? job.file };
  console.log(job.key.padEnd(10), `${width}x${height}`, `${Math.round(bytes / 1024)} KB total`);
}
writeFileSync(DIMS, JSON.stringify(dims, null, 2) + "\n");
