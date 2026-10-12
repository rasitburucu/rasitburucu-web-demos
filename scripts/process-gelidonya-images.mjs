// Gelidonya: turns the Blender renders (scripts/gelidonya-blender/, PNG
// masters kept in .tasarim/gelidonya/blender/render/) into AVIF + WebP sets
// in public/gelidonya/, plus the Open Graph card. Run from the repo root:
//   node scripts/process-gelidonya-images.mjs [render folder] [--suffix=-gunes] [--only=ova,fidelik]
// --suffix writes <name><suffix>-<w> files beside the existing set, merges the
// new keys into image-dims.json and leaves the Open Graph card alone
// (as does --only, which limits the run to the named jobs).
import sharp from "sharp";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const flags = Object.fromEntries(
  process.argv.slice(2).filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("=")),
);
const positional = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const SUFFIX = flags.suffix ?? "";
const ONLY = flags.only ? flags.only.split(",") : null;
const SRC = positional[0] ?? join("..", "rasitburucu-web-demos", ".tasarim", "gelidonya", "blender", "render");
const OUT = join("public", "gelidonya");
mkdirSync(OUT, { recursive: true });

// name, source file, optional crop { left, top, width, height }, widths
const JOBS = [
  // v2 (2026-10-06): the greenhouse aisle renders (sera-ici, sera-ici-dar, urun) left
  // the site after review (the leaves did not read as tomato); masters stay in .tasarim.
  // far half of the plain: mountains, sea and the plastic sea (8:3)
  // the plain is rendered through a lot of air: lift contrast and colour a little
  { name: "ova", file: "ova.png", crop: { left: 0, top: 90, width: 2400, height: 900 }, widths: [2400, 1600, 1000], grade: { a: 1.04, b: -6, sat: 1.0 } },
  { name: "fidelik", file: "fidelik.png", widths: [2400, 1600, 1000] },
  // the visitor's view down the nursery benches, cropped tall for the İletişim split
  { name: "ziyaret", file: "ziyaret.png", crop: { left: 420, top: 0, width: 1560, height: 1350 }, widths: [1560, 1000, 700] },
];

const DIMS = join("content", "gelidonya", "image-dims.json");
const dims = (SUFFIX || ONLY) && existsSync(DIMS) ? JSON.parse(readFileSync(DIMS, "utf8")) : {};
for (const job of JOBS.filter((j) => !ONLY || ONLY.includes(j.name))) {
  const name = job.name + SUFFIX;
  let base = sharp(join(SRC, job.file));
  if (job.crop) base = base.extract(job.crop);
  if (job.grade) base = base.linear(job.grade.a, job.grade.b).modulate({ saturation: job.grade.sat });
  const buf = await base.toBuffer();
  const meta = await sharp(buf).metadata();
  dims[name] = { w: meta.width, h: meta.height, widths: job.widths };
  for (const w of job.widths) {
    const img = sharp(buf).resize({ width: w });
    await img.clone().avif({ quality: 52, effort: 6 }).toFile(join(OUT, `${name}-${w}.avif`));
    await img.clone().webp({ quality: 74 }).toFile(join(OUT, `${name}-${w}.webp`));
  }
  console.log(name, meta.width, meta.height);
}

// Open Graph card: the nursery benches, 1200 x 630 (full runs only)
if (!SUFFIX && !ONLY) await sharp(join(SRC, "fidelik.png"))
  .extract({ left: 0, top: 160, width: 2400, height: 1260 })
  .resize(1200, 630)
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(join("app", "gelidonya", "opengraph-image.jpg"));

writeFileSync(join("content", "gelidonya", "image-dims.json"), JSON.stringify(dims, null, 2) + "\n");

console.log("done");
