// Gelidonya: turns the Blender renders (scripts/gelidonya-blender/, PNG
// masters kept in .tasarim/gelidonya/blender/render/) into AVIF + WebP sets
// in public/gelidonya/, plus the Open Graph card. Run from the repo root:
//   node scripts/process-gelidonya-images.mjs [render folder]
import sharp from "sharp";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = process.argv[2] ?? join("..", "rasitburucu-web-demos", ".tasarim", "gelidonya", "blender", "render");
const OUT = join("public", "gelidonya");
mkdirSync(OUT, { recursive: true });

// name, source file, optional crop { left, top, width, height }, widths
const JOBS = [
  { name: "sera-ici", file: "sera-ici.png", widths: [2400, 1800, 1200, 800] },
  // the aisle around the vanishing point, for the phone band (2:1)
  { name: "sera-ici-dar", file: "sera-ici.png", crop: { left: 830, top: 300, width: 1500, height: 750 }, widths: [1200, 800] },
  // far half of the plain: mountains, sea and the plastic sea (8:3)
  // the plain is rendered through a lot of air: lift contrast and colour a little
  { name: "ova", file: "ova.png", crop: { left: 0, top: 90, width: 2400, height: 900 }, widths: [2400, 1600, 1000], grade: { a: 1.04, b: -6, sat: 1.0 } },
  { name: "fidelik", file: "fidelik.png", widths: [2400, 1600, 1000] },
  // Ürünlerimiz: the ripe trusses along the rows, cut from the aisle render
  // (the close truss render read as a game asset and is no longer used)
  { name: "urun", file: "sera-ici.png", crop: { left: 0, top: 420, width: 2400, height: 960 }, widths: [2400, 1600, 1000] },
  // the visitor's view down the nursery benches, cropped tall for the İletişim split
  { name: "ziyaret", file: "ziyaret.png", crop: { left: 420, top: 0, width: 1560, height: 1350 }, widths: [1560, 1000, 700] },
];

const dims = {};
for (const job of JOBS) {
  let base = sharp(join(SRC, job.file));
  if (job.crop) base = base.extract(job.crop);
  if (job.grade) base = base.linear(job.grade.a, job.grade.b).modulate({ saturation: job.grade.sat });
  const buf = await base.toBuffer();
  const meta = await sharp(buf).metadata();
  dims[job.name] = { w: meta.width, h: meta.height, widths: job.widths };
  for (const w of job.widths) {
    const img = sharp(buf).resize({ width: w });
    await img.clone().avif({ quality: 52, effort: 6 }).toFile(join(OUT, `${job.name}-${w}.avif`));
    await img.clone().webp({ quality: 74 }).toFile(join(OUT, `${job.name}-${w}.webp`));
  }
  console.log(job.name, meta.width, meta.height);
}

// Open Graph card: the greenhouse aisle, 1200 x 630
await sharp(join(SRC, "sera-ici.png"))
  .extract({ left: 300, top: 180, width: 2100, height: 1103 })
  .resize(1200, 630)
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(join("app", "gelidonya", "opengraph-image.jpg"));

writeFileSync(join("content", "gelidonya", "image-dims.json"), JSON.stringify(dims, null, 2) + "\n");

// The order tray (viyol_kare.py): top-down tray and seedling sprites with
// alpha, all at one scale, plus their pixel geometry for the canvas.
const VK = join(SRC, "viyol");
const meta = JSON.parse(readFileSync(join(VK, "viyol-kare.json"), "utf8"));
const S = 1200 / meta.trays["45"].w;
// the site fills every tray with peat; the empty-tray renders stay as masters only
const names = ["viyol-45-torf", "viyol-28-torf",
  ...Object.keys(meta.sheets).map((k) => `fide-${k}`)];
const sizes = {};
for (const n of names) {
  const m = await sharp(join(VK, `${n}.png`)).metadata();
  const w = Math.round(m.width * S);
  const img = sharp(join(VK, `${n}.png`)).resize({ width: w });
  await img.clone().avif({ quality: 58, effort: 6 }).toFile(join(OUT, `${n}.avif`));
  await img.clone().webp({ quality: 80, alphaQuality: 90 }).toFile(join(OUT, `${n}.webp`));
  sizes[n] = [w, Math.round(m.height * S)];
}
const sc = (v) => Math.round(v * S * 100) / 100;
const geo = { sizes, trays: {}, sheets: {} };
for (const [k, t] of Object.entries(meta.trays))
  geo.trays[k] = { cols: t.cols, rows: t.rows, cell: sc(t.cell), x0: sc(t.x0), y0: sc(t.y0), tray: t.tray.map(sc) };
for (const [k, t] of Object.entries(meta.sheets)) geo.sheets[k] = { cells: t.cells, step: sc(t.step), cols: t.cols, rows: t.rows };
writeFileSync(join("content", "gelidonya", "viyol-kare.json"), JSON.stringify(geo, null, 2) + "\n");
console.log("viyol", Object.keys(sizes).length);
console.log("done");
