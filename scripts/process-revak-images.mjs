// Revak Okulları photos: Pexels originals (scripts/.raw/revak/<id>.jpg, not
// committed) -> one consistent grade -> avif + webp at a few widths in
// public/revak/img. Sources and licences: content/revak/credits.ts.
//
// Grade: a little less saturation, a cool shift in the highlights and shadows
// lifted toward the brand ink (#16202E), so photographs from different
// people read as one series.
//
//   node scripts/process-revak-images.mjs            (all)
//   node scripts/process-revak-images.mjs hero lab   (some)
import sharp from "sharp";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";

const RAW = "scripts/.raw/revak";
const OUT = "public/revak/img";
const DIMS = "content/revak/image-dims.json";
const INK = { r: 20, g: 29, b: 42 };

const L = [640, 1024, 1600]; // large placements
const M = [480, 800, 1200]; // arches, cards
const S = [400, 720]; // small or hidden-until-hover

// crop: [left, top, width, height] as fractions of the source
const jobs = [
  { key: "hero", id: "11932099", widths: L },
  { key: "anaokulu", id: "7269710", widths: M },
  { key: "ilkokul", id: "207756", widths: M },
  { key: "ortaokul", id: "8770717", widths: M },
  { key: "lise", id: "7973028", widths: M },
  { key: "writing", id: "6249385", widths: M },
  { key: "music", id: "7095838", widths: M },
  { key: "robotics", id: "15470540", widths: S },
  { key: "debate", id: "164829", widths: S },
  { key: "ceramics", id: "18486386", widths: M },
  { key: "stage", id: "7991381", widths: S },
  { key: "library", id: "13278839", widths: M },
  { key: "pool", id: "8688149", widths: M, sat: 0.5 },
  { key: "court", id: "5331954", widths: M },
  { key: "chess", id: "6202994", widths: M },
  { key: "campus", id: "32715517", widths: L, crop: [0, 0.18, 1, 0.62] },
  { key: "kampusHero", id: "13787808", widths: L },
  { key: "kabul", id: "17113072", widths: S },
  { key: "lab", id: "15509862", widths: M },
  { key: "dining", id: "34316837", widths: M },
  { key: "garden", id: "32416206", widths: M, sat: 0.58 },
  { key: "classroom", id: "27916160", widths: M },
  { key: "corridor", id: "29636314", widths: M },
];

const only = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });
const dims = existsSync(DIMS) ? JSON.parse(readFileSync(DIMS, "utf8")) : {};

async function graded(job) {
  let img = sharp(`${RAW}/${job.id}.jpg`).rotate();
  const meta = await img.metadata();
  let { width, height } = meta;
  if (job.crop) {
    const [l, t, w, h] = job.crop;
    const region = { left: Math.round(l * width), top: Math.round(t * height), width: Math.round(w * width), height: Math.round(h * height) };
    img = img.extract(region);
    width = region.width;
    height = region.height;
  }
  const base = await img
    .modulate({ saturation: job.sat ?? 0.74, brightness: 1.0 })
    .linear([0.96, 0.985, 1.03], [1, 3, 7])
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
    const a = await r.clone().avif({ quality: 50, effort: 5 }).toFile(`${OUT}/${job.key}-${w}.avif`);
    const b = await r.clone().webp({ quality: 72 }).toFile(`${OUT}/${job.key}-${w}.webp`);
    bytes += a.size + b.size;
  }
  dims[job.key] = { file: job.key, w: width, h: height, widths: job.widths, source: job.id };
  console.log(job.key.padEnd(11), `${width}x${height}`, `${Math.round(bytes / 1024)} KB total`);
}
writeFileSync(DIMS, JSON.stringify(dims, null, 2) + "\n");
