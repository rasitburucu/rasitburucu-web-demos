// Revak Okulları: our own Blender renders -> web images.
// Sources are rendered by scripts/revak-blender/revak_scene.py into
// scripts/.raw/revak/render-<mode>.png (not committed; re-render to rebuild):
//
//   blender -b --factory-startup --python scripts/revak-blender/revak_scene.py -- hero  scripts/.raw/revak/render-hero.png 160
//   blender -b --factory-startup --python scripts/revak-blender/revak_scene.py -- wide  scripts/.raw/revak/render-wide.png 160
//   blender -b --factory-startup --python scripts/revak-blender/revak_scene.py -- face-am scripts/.raw/revak/render-face-am.png 160
//   blender -b --factory-startup --python scripts/revak-blender/revak_scene.py -- face-pm scripts/.raw/revak/render-face-pm.png 160
//
//   node scripts/process-revak-renders.mjs
import sharp from "sharp";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";

const RAW = "scripts/.raw/revak";
const IMG = "public/revak/img";
const WALK = "public/revak/walk";
const DIMS = "content/revak/image-dims.json";
mkdirSync(IMG, { recursive: true });
mkdirSync(WALK, { recursive: true });
const dims = existsSync(DIMS) ? JSON.parse(readFileSync(DIMS, "utf8")) : {};

// Photographs in the gallery (registered in content/revak/images.ts like the photos)
const photos = [
  { key: "revak", src: "render-hero.png", widths: [480, 800, 1200] },
  { key: "revakWide", src: "render-wide.png", widths: [640, 1024, 1600] },
  { key: "avlu", src: "render-court-am.png", widths: [640, 1024, 1600] },
  { key: "aksamBahce", src: "render-court-pm.png", widths: [480, 900] },
];
for (const p of photos) {
  const src = sharp(`${RAW}/${p.src}`);
  const { width, height } = await src.metadata();
  let bytes = 0;
  for (const w of p.widths) {
    const r = sharp(`${RAW}/${p.src}`).resize({ width: Math.min(w, width) });
    bytes += (await r.clone().avif({ quality: 52, effort: 6 }).toFile(`${IMG}/${p.key}-${w}.avif`)).size;
    bytes += (await r.clone().webp({ quality: 76 }).toFile(`${IMG}/${p.key}-${w}.webp`)).size;
  }
  dims[p.key] = { file: p.key, w: width, h: height, widths: p.widths, source: "blender" };
  console.log(p.key.padEnd(10), `${width}x${height}`, `${Math.round(bytes / 1024)} KB`);
}
writeFileSync(DIMS, JSON.stringify(dims, null, 2) + "\n");

// Arch faces for the walk: transparent hole, two lights (morning, evening)
for (const [name, src] of [
  ["kemer-sabah", "render-face-am.png"],
  ["kemer-aksam", "render-face-pm.png"],
]) {
  let bytes = 0;
  for (const w of [720, 1440]) {
    const r = sharp(`${RAW}/${src}`).resize({ width: w });
    bytes += (await r.clone().avif({ quality: 48, effort: 6 }).toFile(`${WALK}/${name}-${w}.avif`)).size;
    bytes += (await r.clone().webp({ quality: 74, alphaQuality: 90 }).toFile(`${WALK}/${name}-${w}.webp`)).size;
  }
  console.log(name.padEnd(10), `${Math.round(bytes / 1024)} KB`);
}

// Open Graph card, 1200 x 630, from the wide render
await sharp(`${RAW}/render-wide.png`)
  .resize({ width: 1200, height: 630, fit: "cover", position: "centre" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("app/revak/opengraph-image.jpg");
console.log("og        1200x630");
