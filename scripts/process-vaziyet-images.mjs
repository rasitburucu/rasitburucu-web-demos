// Vaziyet: turns the Blender maquette renders (scripts/vaziyet-blender/maket.py,
// PNG masters kept in .tasarim/vaziyet/blender/render/) into AVIF + WebP sets in
// public/vaziyet/, writes their sizes to content/vaziyet/image-dims.json and
// makes the Open Graph card. Run from the repo root:
//   node scripts/process-vaziyet-images.mjs [render folder]
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = process.argv[2] ?? join("..", "..", "rasitburucu-web-demos", ".tasarim", "vaziyet", "blender", "render");
const OUT = join("public", "vaziyet");
mkdirSync(OUT, { recursive: true });

// name, source, optional crop { left, top, width, height }, widths
const JOBS = [
  // the five models in a row: the row band only (the render is wider than the row is tall)
  { name: "raf", file: "raf.png", crop: { left: 0, top: 230, width: 2400, height: 600 }, widths: [2400, 1600, 1000] },
  ...["sundurma", "sofa", "hayat", "cumba", "avlu"].map((m) => ({ name: `model-${m}`, file: `model-${m}.png`, widths: [1800, 1200, 800] })),
  { name: "panel", file: "panel.png", widths: [1600, 1000, 700] },
  { name: "tir", file: "tir.png", widths: [1600, 1000, 700] },
  { name: "kurulum", file: "kurulum.png", widths: [1600, 1000, 700] },
  { name: "kurulum-yakin", file: "kurulum-yakin.png", widths: [1600, 1000, 700] },
];

const dims = {};
for (const job of JOBS) {
  let base = sharp(join(SRC, job.file));
  if (job.crop) base = base.extract(job.crop);
  const buf = await base.toBuffer();
  const meta = await sharp(buf).metadata();
  dims[job.name] = { w: meta.width, h: meta.height, widths: job.widths };
  for (const w of job.widths) {
    const img = sharp(buf).resize({ width: w });
    await img.clone().avif({ quality: 55, effort: 6 }).toFile(join(OUT, `${job.name}-${w}.avif`));
    await img.clone().webp({ quality: 76 }).toFile(join(OUT, `${job.name}-${w}.webp`));
  }
  console.log(job.name, meta.width, meta.height);
}

// Open Graph card: Sofa 78 on its plot, 1200 x 630
await sharp(join(SRC, "model-sofa.png"))
  .extract({ left: 0, top: 110, width: 1800, height: 945 })
  .resize(1200, 630)
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join("app", "vaziyet", "opengraph-image.jpg"));

writeFileSync(join("content", "vaziyet", "image-dims.json"), JSON.stringify(dims, null, 2) + "\n");
console.log("done");
