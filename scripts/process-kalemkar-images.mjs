// Kalemkâr images -> public/kalemkar/img (avif + webp at a few widths).
//
// Sources (not committed, see content/kalemkar/credits.ts):
//   scripts/.raw/kalemkar/<pexels-id>.jpg   Pexels originals (w=2200)
//   scripts/.raw/kalemkar/blender/*.png     Blender renders of the sini and the counter tray
//                                           (scene notes: scripts/kalemkar-blender/README.md)
//
// Dishes keep only the food (a circle inside each photo's own plate), graded to
// one mid-tone and seated in one drawn house plate, so that nine photographers
// read as one kitchen on one evening (see the dishes block below). Room and
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

// crop: [left, top, width, height] as fractions of the source
const photos = [
  { key: "bakirci", id: "34480631", widths: [480, 800, 1200], crop: [0, 0.1, 1, 0.8] },
  { key: "cekic", id: "39184450", widths: [480, 800, 1200], crop: [0, 0.12, 1, 0.8] },
  { key: "ev", id: "38698119", widths: [480, 800, 1200], crop: [0, 0.16, 1, 0.7] },
  { key: "kubbe", id: "33743439", widths: [480, 800, 1200], crop: [0, 0.2, 1, 0.62] },
  { key: "kiler", id: "14350482", widths: [640, 1024, 1408], crop: [0, 0, 0.64, 1], bright: 1.45, lift: 30 }, // arch and window only: the open door shows snow, wrong season; lifted, it read as a cave
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

// ---------- dishes: one house plate, one shooting day ----------
//
// Nine photographers, nine sets of crockery. Only the food is kept: each photo
// is cut to a circle inside its own plate's well (`food`), its colour is
// normalised (partial grey-world white balance, 0.5/99.5 % levels, a gamma that
// brings every dish to the same mid-tone, the same saturation and warmth), and
// it is seated in one procedurally drawn plate: matte cream stoneware with an
// iron-oxide lip, lit from the upper left like the copper sini. Same plate,
// same light, same grain: one kitchen, one evening.
//
// food: [cx, cy, r]; cx, cy as fractions of width/height, r as a fraction of width.
const dishes = [
  { key: "domates", id: "33793968", food: [0.476, 0.492, 0.33] },
  { key: "patlican", id: "38431254", food: [0.515, 0.5, 0.175], sat: 0.8, floor: [165, 220] }, // teal bowl -> house glaze
  { key: "corba", id: "7160694", food: [0.49, 0.52, 0.112], wb: 0 }, // lentil orange is the dish, not a cast
  { key: "firik", id: "38431255", food: [0.49, 0.5, 0.29] },
  { key: "salata", id: "27612521", food: [0.505, 0.48, 0.165] },
  { key: "humus", id: "19328883", food: [0.5, 0.5, 0.39] },
  { key: "incik", id: "12312118", food: [0.405, 0.575, 0.27] },
  { key: "ayva", id: "36865387", food: [0.439, 0.514, 0.31], sat: 0.84 },
  { key: "sarma", id: "18543482", food: [0.503, 0.584, 0.155] },
];

const PLATE = 1000; // px, whole plate
const WELL = 0.79; // food circle radius / plate radius (the food leads, the rim frames)
const MID = 0.43; // every dish lands on this mean luminance

/** Seeded PRNG so the plate (speckle, grain) is the same on every run. */
function prng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hueOf = (r, g, b) => {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d < 1e-6) return [0, 0];
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return [h, d / mx];
};
const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const GLAZE = [0.89, 0.84, 0.76];

/** Normalise one food crop (raw RGB, square) in place.
 *  wb: strength of the grey-world correction; floor: [h0, h1] hue range of a
 *  foreign plate showing between the food, repainted as the house glaze with
 *  its shading kept. */
function gradeFood(buf, size, sat, wb = 0.35, floor = null) {
  const n = size * size;
  const c = size / 2;
  const r2 = (size / 2) * (size / 2) * 0.92;
  let sr = 0, sg = 0, sb = 0, cnt = 0;
  const lum = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = i % size, y = (i / size) | 0;
    const r = buf[i * 3] / 255, g = buf[i * 3 + 1] / 255, b = buf[i * 3 + 2] / 255;
    lum[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if ((x - c) ** 2 + (y - c) ** 2 < r2) {
      sr += r; sg += g; sb += b; cnt++;
    }
  }
  const mr = sr / cnt, mg = sg / cnt, mb = sb / cnt, m = (mr + mg + mb) / 3;
  // Partial grey-world: removes a cast (blue table, purple slate) without
  // turning a tomato grey.
  const k = wb;
  const repaint = new Float32Array(n);
  if (floor) {
    for (let i = 0; i < n; i++) {
      const [h, sv] = hueOf(buf[i * 3], buf[i * 3 + 1], buf[i * 3 + 2]);
      const inHue = Math.min(smooth(floor[0] - 12, floor[0], h), 1 - smooth(floor[1], floor[1] + 12, h));
      repaint[i] = inHue * smooth(0.14, 0.3, sv);
    }
  }
  const gr = (m / mr) ** k, gg = (m / mg) ** k, gb = (m / mb) ** k;
  const sorted = Float32Array.from(lum).sort();
  const lo = sorted[Math.floor(n * 0.005)], hi = sorted[Math.floor(n * 0.995)];
  let mean = 0;
  for (let i = 0; i < n; i++) mean += Math.min(1, Math.max(0, (lum[i] - lo) / (hi - lo)));
  mean /= n;
  const gamma = Math.log(MID) / Math.log(Math.max(0.05, Math.min(0.95, mean)));
  for (let i = 0; i < n; i++) {
    let r = (buf[i * 3] / 255) * gr, g = (buf[i * 3 + 1] / 255) * gg, b = (buf[i * 3 + 2] / 255) * gb;
    // levels on luminance, colour carried along
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const Ln = Math.min(1, Math.max(0, (L - lo) / (hi - lo)));
    const Lg = Ln ** gamma;
    const s = L > 1e-4 ? Lg / L : 0;
    r *= s; g *= s; b *= s;
    const L2 = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = L2 + (r - L2) * sat; g = L2 + (g - L2) * sat; b = L2 + (b - L2) * sat;
    // one warmth, matte ends (blacks lifted toward soot, whites held off clip)
    r = r * 1.035; b = b * 0.92;
    const lift = (v) => 0.045 + Math.min(1, Math.max(0, v)) * 0.905;
    if (repaint[i] > 0) {
      const L3 = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const t = Math.min(1.04, Math.max(0.5, 0.62 + 0.55 * (L3 - 0.35)));
      const w = repaint[i];
      r = r * (1 - w) + GLAZE[0] * t * w;
      g = g * (1 - w) + GLAZE[1] * t * w;
      b = b * (1 - w) + GLAZE[2] * t * w;
    }
    buf[i * 3] = Math.round(lift(r) * 255);
    buf[i * 3 + 1] = Math.round(lift(g) * 255);
    buf[i * 3 + 2] = Math.round(lift(b) * 255);
  }
  return buf;
}

/** The house plate: everything except the food, as two SVG layers. */
function plateSvg() {
  const S = PLATE, C = S / 2, R = C - 2, W = R * WELL;
  const rnd = prng(7);
  let dots = "";
  for (let i = 0; i < 900; i++) {
    const a = rnd() * Math.PI * 2;
    const rr = W + 6 + rnd() * (R - W - 14);
    const x = C + Math.cos(a) * rr, y = C + Math.sin(a) * rr;
    const s = 0.5 + rnd() * 1.4;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${s.toFixed(2)}" fill="#5b4330" fill-opacity="${(0.18 + rnd() * 0.4).toFixed(2)}"/>`;
  }
  const under = `<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glaze" cx="0.42" cy="0.4" r="0.62">
      <stop offset="0" stop-color="#efe6d6"/><stop offset="0.7" stop-color="#e3d7c3"/><stop offset="1" stop-color="#cdbfa8"/>
    </radialGradient>
    <linearGradient id="key" x1="0.15" y1="0.1" x2="0.85" y2="0.92">
      <stop offset="0" stop-color="#fff" stop-opacity="0.34"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#2a1a0e" stop-opacity="0.34"/>
    </linearGradient>
    <linearGradient id="wall" x1="0.15" y1="0.1" x2="0.85" y2="0.92">
      <stop offset="0" stop-color="#3a2717" stop-opacity="0.42"/><stop offset="0.55" stop-color="#3a2717" stop-opacity="0.08"/><stop offset="1" stop-color="#fff" stop-opacity="0.32"/>
    </linearGradient>
  </defs>
  <circle cx="${C}" cy="${C}" r="${R}" fill="url(#glaze)"/>
  ${dots}
  <circle cx="${C}" cy="${C}" r="${R}" fill="url(#key)"/>
  <circle cx="${C}" cy="${C}" r="${W + 28}" fill="none" stroke="#7a5c43" stroke-opacity="0.16" stroke-width="2"/>
  <circle cx="${C}" cy="${C}" r="${W + 13}" fill="none" stroke="url(#wall)" stroke-width="26"/>
  <circle cx="${C}" cy="${C}" r="${R - 3.5}" fill="none" stroke="#5e4029" stroke-opacity="0.62" stroke-width="6"/>
  <circle cx="${C}" cy="${C}" r="${R - 9}" fill="none" stroke="#fff6e8" stroke-opacity="0.22" stroke-width="2"/>
</svg>`;
  // Over the food: the wall's shadow falls on the upper-left of the well, and
  // the same key light grades every dish from upper left to lower right.
  const over = `<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="rim" cx="${C + 14}" cy="${C + 18}" r="${W + 4}" gradientUnits="userSpaceOnUse">
      <stop offset="0.82" stop-color="#1a0f06" stop-opacity="0"/><stop offset="0.97" stop-color="#1a0f06" stop-opacity="0.5"/><stop offset="1" stop-color="#1a0f06" stop-opacity="0.62"/>
    </radialGradient>
    <linearGradient id="light" x1="0.2" y1="0.15" x2="0.8" y2="0.9">
      <stop offset="0" stop-color="#fff2df" stop-opacity="0.12"/><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#140a04" stop-opacity="0.22"/>
    </linearGradient>
    <clipPath id="w"><circle cx="${C}" cy="${C}" r="${W}"/></clipPath>
  </defs>
  <g clip-path="url(#w)">
    <rect width="${S}" height="${S}" fill="url(#light)"/>
    <rect width="${S}" height="${S}" fill="url(#rim)"/>
  </g>
</svg>`;
  return { under: Buffer.from(under), over: Buffer.from(over) };
}

const { under: PLATE_UNDER, over: PLATE_OVER } = plateSvg();

async function grain(size, seed) {
  // Same fine grain on every plate: same camera.
  const rnd = prng(seed);
  const px = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const v = 128 + Math.round((rnd() + rnd() + rnd() - 1.5) * 34);
    px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = v;
    px[i * 4 + 3] = 40;
  }
  return sharp(px, { raw: { width: size, height: size, channels: 4 } }).png().toBuffer();
}
const GRAIN = await grain(PLATE, 11);

for (const d of dishes) {
  if (!want(d.key)) continue;
  const src = sharp(`${RAW}/${d.id}.jpg`).rotate();
  const { width, height } = await src.metadata();
  const [cx, cy, rf] = d.food;
  const R = Math.round(rf * width);
  const left = Math.round(cx * width - R);
  const top = Math.round(cy * height - R);
  const W = Math.round((PLATE / 2 - 2) * WELL);
  const D = 2 * W;
  const { data } = await src
    .clone()
    .extract({ left, top, width: 2 * R, height: 2 * R })
    .resize(D, D)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  gradeFood(data, D, d.sat ?? 0.88, d.wb ?? 0.35, d.floor ?? null);
  const mask = Buffer.from(
    `<svg width="${D}" height="${D}"><defs><filter id="f"><feGaussianBlur stdDeviation="1.1"/></filter></defs><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2 - 1}" fill="#fff" filter="url(#f)"/></svg>`,
  );
  const alpha = await sharp(mask).extractChannel(0).toBuffer();
  const food = await sharp(data, { raw: { width: D, height: D, channels: 3 } }).joinChannel(alpha).png().toBuffer();
  const off = PLATE / 2 - W;
  const plateMask = Buffer.from(
    `<svg width="${PLATE}" height="${PLATE}"><circle cx="${PLATE / 2}" cy="${PLATE / 2}" r="${PLATE / 2 - 2}" fill="#fff"/></svg>`,
  );
  const plated = await sharp({ create: { width: PLATE, height: PLATE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: PLATE_UNDER },
      { input: food, left: off, top: off },
      { input: PLATE_OVER },
      { input: GRAIN, blend: "overlay" },
      { input: plateMask, blend: "dest-in" },
    ])
    .png()
    .toBuffer();
  const bytes = await write(d.key, sharp(plated), [360, 640, 960], PLATE, true);
  dims[d.key] = { w: PLATE, h: PLATE, widths: [360, 640, 960], alpha: true };
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
  let g = grade(img, p.sat ?? 0.78);
  if (p.bright) g = g.modulate({ brightness: p.bright });
  if (p.lift) g = sharp(await g.toBuffer()).linear(1 - p.lift / 255, p.lift); // open the shadows, hold the window
  const graded = await g.toBuffer();
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

// ---------- sinide: the chef's table, composed from our own pieces ----------
// The copper sini render, seen from above and cropped close, with two of this
// season's plates on it (firik, fıstık sarması) in the same house plate and
// the same upper-left light. Replaces a stock "chef garnishing soup" photo that
// belonged to no Antep kitchen. Needs the dish images above (run them first).
if (want("sinide")) {
  const W = 1200, H = 1500;
  const sini = await sharp(`${RAW}/blender/sini.png`).resize(2300, 2300).extract({ left: 560, top: 260, width: W, height: H }).png().toBuffer();
  const plate = async (key, size) => sharp(`${OUT}/${key}-960.webp`).resize(size, size).png().toBuffer();
  const shadow = (size, blur) =>
    Buffer.from(
      `<svg width="${size + blur * 4}" height="${size + blur * 4}"><defs><filter id="b"><feGaussianBlur stdDeviation="${blur}"/></filter></defs><circle cx="${size / 2 + blur * 2}" cy="${size / 2 + blur * 2}" r="${size / 2}" fill="#0c0400" fill-opacity="0.72" filter="url(#b)"/></svg>`,
    );
  const big = 700, small = 560;
  const img = await sharp({ create: { width: W, height: H, channels: 4, background: { ...SOOT, alpha: 1 } } })
    .composite([
      { input: sini, left: 0, top: 0 },
      { input: shadow(big, 26), left: 150 - 52 + 26, top: 300 - 52 + 40 },
      { input: await plate("firik", big), left: 150, top: 300 },
      { input: shadow(small, 22), left: 760 - 44 + 22, top: 1010 - 44 + 32 },
      { input: await plate("sarma", small), left: 760, top: 1010 },
    ])
    .flatten({ background: SOOT })
    .png()
    .toBuffer();
  const bytes = await write("sinide", sharp(img), [480, 800, 1200], W, false);
  dims.sinide = { w: W, h: H, widths: [480, 800, 1200] };
  console.log("sinide".padEnd(10), `${(bytes / 1024).toFixed(0)} KB avif total`);
}

writeFileSync(DIMS, JSON.stringify(dims, null, 2) + "\n");
