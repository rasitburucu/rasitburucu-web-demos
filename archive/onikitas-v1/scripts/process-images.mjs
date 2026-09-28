// Downloads the selected Unsplash photos (CDN, Unsplash License) and writes
// resized WebP variants to public/onikitas/img/. Re-run safe: skips raw files
// that already exist. Credits live in content/onikitas/credits.ts.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const RAW = "scripts/.raw/full";
const OUT = "public/onikitas/img";
fs.mkdirSync(RAW, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

// key: [unsplash cdn id, widths]
const PHOTOS = {
  "hero-house": ["photo-1523217582562-09d0def993a6", [2000, 1200, 800]],
  "bay-villa": ["photo-1603995394003-43f7cc80525f", [2000, 1200, 800]],
  "bay-pool": ["photo-1603995393909-9af9bb3e7617", [2000, 1200, 800]],
  "pool-edge": ["photo-1766214573285-1b3df1b0a980", [2000, 1200, 800]],
  "view-sunset": ["photo-1596746698204-d69844da956d", [1600, 1200, 800]],
  "view-night": ["photo-1678889284805-5c86fb1dba5a", [2000, 1200, 800]],
  "view-morning": ["photo-1571666402424-c17d7e0cf0dd", [2000, 1200, 800]],
  "stone-wall": ["photo-1673157014075-d97abcfe2308", [1200, 800]],
  "tree-shadow": ["photo-1714216363143-960163ac6afa", [2000, 1200, 800]],
  "lime-plaster": ["photo-1639430257115-f63af9eab97d", [1200, 800]],
  "stair": ["photo-1601993957728-1e56ab70c5a8", [1600, 1200, 800]],
  "arch-hall": ["photo-1560681610-b97792bd7cd9", [1600, 1200, 800]],
  "niche": ["photo-1680363046184-a8546fc77d49", [1600, 1200, 800]],
  "olive": ["photo-1698036867785-a8aeb0f59c48", [2000, 1200, 800]],
  "hill-sea": ["photo-1727720961469-d9b9bd0fe50a", [2000, 1200, 800]],
  "oak": ["photo-1611072337226-1140ab367200", [1200, 800]],
  "travertine": ["photo-1722340319326-e05e0dd58664", [1600, 1200, 800]],
  "columns": ["photo-1759507058804-cc729b38d1ed", [2000, 1200, 800]],
};

const manifest = {};
for (const [key, [id, widths]] of Object.entries(PHOTOS)) {
  const raw = path.join(RAW, `${key}.jpg`);
  if (!fs.existsSync(raw)) {
    const r = await fetch(`https://images.unsplash.com/${id}?w=2400&q=85&fm=jpg`);
    if (!r.ok) throw new Error(`${key}: HTTP ${r.status}`);
    fs.writeFileSync(raw, Buffer.from(await r.arrayBuffer()));
  }
  const meta = await sharp(raw).metadata();
  for (const w of widths) {
    const target = Math.min(w, meta.width);
    await sharp(raw)
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: w >= 1600 ? 72 : 76, effort: 5 })
      .toFile(path.join(OUT, `${key}-${w}.webp`));
  }
  manifest[key] = { w: meta.width, h: meta.height, widths };
  console.log(key, meta.width, "x", meta.height);
}
fs.writeFileSync("scripts/.raw/manifest.json", JSON.stringify(manifest, null, 2));
