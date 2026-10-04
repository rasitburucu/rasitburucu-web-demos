// Kalemkâr images -> public/kalemkar/img (avif + webp at a few widths).
//
// Sources (not committed, see content/kalemkar/credits.ts):
//   scripts/.raw/kalemkar/<pexels-id>.jpg   Pexels originals (w=2200)
//   scripts/.raw/kalemkar/blender/*.png     Blender renders of the sini and the counter tray
//                                           (scene notes: scripts/kalemkar-blender/README.md)
//
// Dishes are cut to a circle at the rim of their own plate and graded to one
// warm, low-key look so that nine photographers read as one kitchen. Room and
// craft photos get the same grade with the shadows lifted toward the brand
// soot (#17130F). Renders keep their alpha and are only resized.
//
//   node scripts/process-kalemkar-images.mjs            (all)
//   node scripts/process-kalemkar-images.mjs sini firik  (some)
import sharp from "sharp";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";

const RAW = "scripts/.raw/kalemkar";
const OUT = "public/kalemkar/img";
const DIMS = "content/kalemkar/image-dims.json";
const SOOT = { r: 23, g: 19, b: 15 };

// circle: [cx, cy] as fractions of width/height, r as a fraction of width
const dishes = [
  { key: "domates", id: "33793968", c: [0.476, 0.492, 0.438] },
  { key: "patlican", id: "38431254", c: [0.51, 0.513, 0.272], sat: 0.62 },
  { key: "corba", id: "7160694", c: [0.49, 0.52, 0.19] },
  { key: "firik", id: "38431255", c: [0.49, 0.5, 0.32] },
  { key: "salata", id: "27612521", c: [0.516, 0.478, 0.291] },
  { key: "humus", id: "19328883", c: [0.5, 0.5, 0.48] },
  { key: "incik", id: "12312118", c: [0.415, 0.565, 0.415] },
  { key: "ayva", id: "36865387", c: [0.439, 0.514, 0.387] },
  { key: "sarma", id: "18543482", c: [0.503, 0.584, 0.209] },
];

// crop: [left, top, width, height] as fractions of the source
const photos = [
  { key: "sef", id: "36430079", widths: [480, 800, 1200], crop: [0, 0.06, 1, 0.83] },
  { key: "bakirci", id: "34480631", widths: [480, 800, 1200], crop: [0, 0.1, 1, 0.8] },
  { key: "cekic", id: "39184450", widths: [480, 800, 1200], crop: [0, 0.12, 1, 0.8] },
  { key: "ev", id: "38698119", widths: [480, 800, 1200], crop: [0, 0.16, 1, 0.7] },
  { key: "kubbe", id: "33743439", widths: [480, 800, 1200], crop: [0, 0.2, 1, 0.62] },
  { key: "kiler", id: "14350482", widths: [640, 1024, 1600] },
  { key: "ocak", id: "29132437", widths: [640, 1024, 1600] },
  { key: "fistik", id: "27532710", widths: [480, 800, 1200], crop: [0, 0.22, 1, 0.56] },
  { key: "mum", id: "7956569", widths: [480, 800, 1200], crop: [0, 0.1, 1, 0.75] },
  { key: "servis", id: "17346296", widths: [480, 800, 1200], crop: [0, 0.14, 1, 0.72] },
];

const renders = [
  { key: "sini", file: "blender/sini.png", widths: [720, 1100, 1600, 2200] },
  { key: "tepsi", file: "blender/tepsi.png", widths: [720, 1200, 1800] },
];

const only = process.argv.slice(2);
const want = (k) => !only.length || only.includes(k);
mkdirSync(OUT, { recursive: true });
const dims = existsSync(DIMS) ? JSON.parse(readFileSync(DIMS, "utf8")) : {};

async function write(key, img, widths, srcW, alpha) {
  let bytes = 0;
  for (const w of widths) {
    const r = img.clone().resize({ width: Math.min(w, srcW) });
    const avif = await r.clone().avif({ quality: alpha ? 58 : 52, effort: 6 }).toBuffer();
    const webp = await r.clone().webp({ quality: alpha ? 80 : 76, alphaQuality: 90, effort: 6 }).toBuffer();
    writeFileSync(`${OUT}/${key}-${w}.avif`, avif);
    writeFileSync(`${OUT}/${key}-${w}.webp`, webp);
    bytes += avif.length;
  }
  return bytes;
}

function grade(img, sat = 0.8) {
  return img.modulate({ saturation: sat, brightness: 0.97 }).linear([0.95, 0.94, 0.9], [2, 0, -2]);
}

for (const d of dishes) {
  if (!want(d.key)) continue;
  const src = sharp(`${RAW}/${d.id}.jpg`).rotate();
  const { width, height } = await src.metadata();
  const [cx, cy, rf] = d.c;
  const R = Math.round(rf * width);
  const left = Math.round(cx * width - R);
  const top = Math.round(cy * height - R);
  const size = 2 * R;
  // Pad when the circle runs past the frame (incik, humus).
  const padL = Math.max(0, -left), padT = Math.max(0, -top);
  const padR = Math.max(0, left + size - width), padB = Math.max(0, top + size - height);
  let base = await grade(src.clone(), d.sat ?? 0.8)
    .extend({ left: padL, top: padT, right: padR, bottom: padB, background: SOOT })
    .extract({ left: left + padL, top: top + padT, width: size, height: size })
    .toBuffer();
  // Seat the plate: a soft inner vignette, then a feathered circular alpha.
  const S = 1000;
  const vignette = Buffer.from(
    `<svg width="${S}" height="${S}"><defs><radialGradient id="v"><stop offset="0.72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.32"/></radialGradient></defs><circle cx="${S / 2}" cy="${S / 2}" r="${S / 2}" fill="url(#v)"/></svg>`,
  );
  const mask = Buffer.from(
    `<svg width="${S}" height="${S}"><defs><filter id="f"><feGaussianBlur stdDeviation="1.2"/></filter></defs><circle cx="${S / 2}" cy="${S / 2}" r="${S / 2 - 3}" fill="#fff" filter="url(#f)"/></svg>`,
  );
  base = await sharp(base).resize(S, S).composite([{ input: vignette }]).toBuffer();
  const alphaMask = await sharp(mask).extractChannel(0).toBuffer();
  const cut = sharp(base).joinChannel(alphaMask);
  const out = sharp(await cut.png().toBuffer());
  const bytes = await write(d.key, out, [360, 640, 960], S, true);
  dims[d.key] = { w: S, h: S, widths: [360, 640, 960], alpha: true };
  console.log(d.key.padEnd(10), `${(bytes / 1024).toFixed(0)} KB avif total`);
}

for (const p of photos) {
  if (!want(p.key)) continue;
  let img = sharp(`${RAW}/${p.id}.jpg`).rotate();
  const meta = await img.metadata();
  let { width, height } = meta;
  if (p.crop) {
    const [l, t, w, h] = p.crop;
    const region = { left: Math.round(l * width), top: Math.round(t * height), width: Math.round(w * width), height: Math.round(h * height) };
    img = img.extract(region);
    width = region.width;
    height = region.height;
  }
  const graded = await grade(img, p.sat ?? 0.78).toBuffer();
  const lifted = await sharp(graded)
    .composite([{ input: { create: { width, height, channels: 3, background: SOOT } }, blend: "lighten" }])
    .toBuffer();
  const bytes = await write(p.key, sharp(lifted), p.widths, width, false);
  dims[p.key] = { w: width, h: height, widths: p.widths };
  console.log(p.key.padEnd(10), `${(bytes / 1024).toFixed(0)} KB avif total`);
}

for (const r of renders) {
  if (!want(r.key)) continue;
  const img = sharp(`${RAW}/${r.file}`);
  const { width, height } = await img.metadata();
  const bytes = await write(r.key, img, r.widths, width, true);
  dims[r.key] = { w: width, h: height, widths: r.widths, alpha: true };
  console.log(r.key.padEnd(10), `${(bytes / 1024).toFixed(0)} KB avif total`);
}

writeFileSync(DIMS, JSON.stringify(dims, null, 2) + "\n");
