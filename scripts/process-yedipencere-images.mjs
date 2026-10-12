// Yedi Pencere photos: crops, a shared colour grade and WebP sizes.
//
// Source files (Unsplash and Pexels licences, credits in content/yedipencere/photos.ts
// and .tasarim/yedipencere/THIRD_PARTY-ek.md) live in .tasarim/yedipencere/foto/.
// Each photo is shown only inside a drawn opening (window glass or door), so the
// crop follows the opening's proportion: single window 150:218, the three-pane
// bay and the belvedere band 276:178, a door opening 3:5.
// Grade: every frame gets the same mild treatment (a little less saturation,
// lifted blacks, a touch of warmth) so seven photographers read as one house.
// Small shop signs in the lane photo are softened (no business is legible).
//
//   node scripts/process-yedipencere-images.mjs [source folder]
//   (default .tasarim/yedipencere/foto; writes public/yedipencere/foto/ and
//    content/yedipencere/photo-dims.json)
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import sharp from "sharp";

const SRC = process.argv[2] ?? ".tasarim/yedipencere/foto";
const OUT = "public/yedipencere/foto";
const DIMS = "content/yedipencere/photo-dims.json";

const SINGLE = 150 / 218;
const BAND = 276 / 178;
const DOOR = 3 / 5;

// crop: [left, top, width] in source pixels; height follows the ratio
const PHOTOS = {
  korfez: { file: "korfez_igor-sporynin_jxAhpeXqylQ.jpg", ratio: SINGLE, crop: [470, 0, 1101], widths: [300, 640, 960] },
  hidirlik: { file: "hidirlik_sergey-konstantinov_QWxc5zGHMxc.jpg", ratio: SINGLE, crop: [120, 0, 744], widths: [300, 640] },
  kosk: { file: "kosk_igor-sporynin_YUu9QqvNy64.jpg", ratio: BAND, crop: [0, 26, 2400], widths: [480, 960, 1440] },
  taslik: { file: "taslik_kseniia-ilinykh_xG2uKMgxGzw.jpg", ratio: SINGLE, crop: [0, 640, 2400], widths: [300, 640, 960] },
  cumba: {
    file: "cumba_daniel-silva_0WMdxGvqhfE.jpg",
    ratio: BAND,
    crop: [0, 22, 2400],
    widths: [480, 960, 1440],
    // shop sign, its round head and a door plaque (source pixels)
    soften: [
      [1050, 1030, 80, 120],
      [1095, 965, 75, 50],
      [715, 1120, 105, 60],
    ],
  },
  avlu: { file: "avlu_yana-ralko_5fixJa9vMoU.jpg", ratio: SINGLE, crop: [440, 0, 1514], widths: [300, 640, 960] },
  sofa: { file: "sofa_bob-jenkin_k6Fia0wSpvc.jpg", ratio: SINGLE, crop: [98, 0, 2204], widths: [300, 640, 960] },
  "ic-zemin": { file: "ic-zemin_merve-eglence_27772361.jpg", ratio: DOOR, crop: [555, 0, 1290], widths: [640, 1080] },
  "ic-birinci": { file: "ic-birinci_mesut-musluer_11987617.jpg", ratio: DOOR, crop: [240, 0, 1920], widths: [640, 1080] },
  "ic-kosk": { file: "ic-kosk_helloaesthe_15699340.jpg", ratio: DOOR, crop: [120, 0, 2160], widths: [640, 1080] },
};

async function soften(input, boxes) {
  if (!boxes?.length) return input;
  const layers = [];
  for (const [left, top, width, height] of boxes) {
    const patch = await sharp(input).extract({ left, top, width, height }).blur(9).toBuffer();
    layers.push({ input: patch, left, top });
  }
  return sharp(input).composite(layers).toBuffer();
}

const grade = (img) =>
  img
    .modulate({ saturation: 0.9 })
    // lift blacks a little, keep whites: out = in * 0.94 + 9
    .linear(0.94, 9)
    // warmth: a hair more red, a hair less blue
    .recomb([
      [1.02, 0, 0],
      [0, 1, 0],
      [0, 0, 0.97],
    ]);

if (!existsSync(SRC)) {
  console.error(`source folder not found: ${SRC}`);
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });
const dims = {};
for (const [key, p] of Object.entries(PHOTOS)) {
  const src = `${SRC}/${p.file}`;
  const meta = await sharp(src).metadata();
  const [left, top, width] = p.crop;
  const height = Math.round(width / p.ratio);
  if (left + width > meta.width || top + height > meta.height) throw new Error(`${key}: crop outside ${meta.width}×${meta.height}`);
  const base = await soften(await sharp(src).rotate().toBuffer(), p.soften);
  const cropped = await sharp(base).extract({ left, top, width, height }).toBuffer();
  dims[key] = { ratio: Number(p.ratio.toFixed(4)), widths: p.widths, src: p.file };
  for (const w of p.widths) {
    const h = Math.round(w / p.ratio);
    const out = `${OUT}/${key}-${w}.webp`;
    await grade(sharp(cropped).resize(w, h, { fit: "cover" }))
      .webp({ quality: w <= 320 ? 72 : 76, effort: 6 })
      .toFile(out);
  }
  console.log(`${key}: ${width}×${height} crop → ${p.widths.join(", ")}`);
}
writeFileSync(DIMS, JSON.stringify(dims, null, 1) + "\n");
console.log(`wrote ${DIMS}`);
