// Damar: turns the four marble photographs (.tasarim/damar/doku/, sources and
// licences in .tasarim/damar/THIRD_PARTY-ek.md) into the slab images the site
// shows, plus the sample tiles, the antiqued-finish texture and the Open Graph
// card. Nothing is drawn in the browser: the bookmatch mirror, the four-way
// match and the finishes are CSS on top of these files.
//
// One photograph stands for one block. Every slab still in stock gets its own
// crop: the crop window slides a little from slab to slab (the block's depth)
// and a soft displacement field bends the veins slightly, so the two pages of
// a pair are near twins, as consecutive slabs are, not mirror copies.
//
// Run from the repo root (main repo or a worktree):
//   node scripts/process-damar-images.mjs [photo folder]
//   node scripts/process-damar-images.mjs --texture   (only the finish texture)
import sharp from "sharp";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ONLY_TEXTURE = process.argv.includes("--texture");
const candidates = [
  process.argv.slice(2).find((a) => !a.startsWith("--")),
  join(".tasarim", "damar", "doku"),
  join("..", "rasitburucu-web-demos", ".tasarim", "damar", "doku"),
  join("..", "..", "rasitburucu-web-demos", ".tasarim", "damar", "doku"),
].filter(Boolean);
const SRC = candidates.find((p) => existsSync(p));
if (!SRC) throw new Error(`Photo folder not found; tried: ${candidates.join(", ")}`);

const OUT = join("public", "damar");
mkdirSync(join(OUT, "slabs"), { recursive: true });

const stock = JSON.parse(readFileSync(join("content", "damar", "stock.json"), "utf8"));

// Slab aspect: 1.90 m wide by 3.20 m tall, standing like a page.
const ASPECT = 1.9 / 3.2;
const MASTER = 1320; // warp at this width, then step down
const WIDTHS = [880, 480];

// Crop of the first slab in stock (full-resolution pixels), drift per slab,
// warp amplitude (master pixels) and a seed for the warp phases.
const STONES = {
  karakalem: { file: "karakalem/akbar-nemati-2yp6ICVr2VM-unsplash.jpg", top: 100, h: 3800, x0: 1500, dx: 24, amp: 6, seed: 1.3, sample: { left: 2350, top: 1650, size: 520 } },
  duman: { file: "duman/karolina-grabowska-pexels-6634152.jpg", top: 300, h: 6200, x0: 60, dx: 30, amp: 6, seed: 2.1, sample: { left: 1150, top: 2350, size: 760 } },
  sirma: { file: "sirma/akbar-nemati-nXVXHtJiDnI-unsplash.jpg", top: 500, h: 3100, x0: 900, dx: 30, amp: 6, seed: 3.7, sample: { left: 1500, top: 1500, size: 520 } },
  kiragi: { file: "kiragi/akbar-nemati-7aKvziqeTfg-unsplash.jpg", top: 250, h: 3250, x0: 3300, dx: 40, amp: 6, seed: 4.4, sample: { left: 3550, top: 1350, size: 520 } },
};

const inRanges = (n, ranges) => ranges.some(([a, b]) => n >= a && n <= b);
function available(s) {
  const out = [];
  for (let n = 1; n <= s.slabs; n++) if (!inRanges(n, s.sold) && !inRanges(n, s.reserved)) out.push(n);
  return out;
}

// Smooth displacement, low frequency; phases move slowly with the slab number.
function warp(src, w, h, k, amp, seed) {
  const out = Buffer.alloc(src.length);
  const s1 = 0.18 * k, s2 = 0.13 * k;
  const lx = w * 1.35, ly = h * 0.9, lx2 = w * 0.8, ly2 = h * 1.4;
  const TAU = Math.PI * 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = amp * Math.sin(TAU * (y / ly) + seed + s1) * Math.cos(TAU * (x / lx) + seed * 0.7);
      const dy = amp * 0.6 * Math.sin(TAU * (x / lx2) + seed * 1.9 + s2) * Math.cos(TAU * (y / ly2) + seed * 0.3);
      let sx = x + dx, sy = y + dy;
      sx = Math.min(w - 1.001, Math.max(0, sx));
      sy = Math.min(h - 1.001, Math.max(0, sy));
      const x0 = sx | 0, y0 = sy | 0, fx = sx - x0, fy = sy - y0;
      const i00 = (y0 * w + x0) * 3, i10 = i00 + 3, i01 = i00 + w * 3, i11 = i01 + 3;
      const o = (y * w + x) * 3;
      for (let c = 0; c < 3; c++) {
        const a = src[i00 + c] * (1 - fx) + src[i10 + c] * fx;
        const b = src[i01 + c] * (1 - fx) + src[i11 + c] * fx;
        out[o + c] = a * (1 - fy) + b * fy;
      }
    }
  }
  return out;
}

const manifest = { aspect: "1.9 / 3.2", widths: WIDTHS, heights: {}, stones: {} };
for (const w of WIDTHS) manifest.heights[w] = Math.round(w / ASPECT);

for (const [id, cfg] of Object.entries(ONLY_TEXTURE ? {} : STONES)) {
  const s = stock[id];
  const slabs = available(s);
  const file = join(SRC, cfg.file);
  const cropW = Math.round(cfg.h * ASPECT);
  const meta = await sharp(file).metadata();
  const first = slabs[0];
  const mh = Math.round(MASTER / ASPECT);
  for (const n of slabs) {
    const left = Math.round(cfg.x0 + (n - first) * cfg.dx);
    if (left + cropW > meta.width) throw new Error(`${id} slab ${n}: crop runs off the photo`);
    const { data } = await sharp(file)
      .extract({ left, top: cfg.top, width: cropW, height: cfg.h })
      .resize({ width: MASTER, height: mh, fit: "fill" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const bent = warp(data, MASTER, mh, n, cfg.amp, cfg.seed);
    // a breath of tone drift between slabs, as in one block
    const gain = 1 + 0.01 * Math.sin(n * 0.9 + cfg.seed);
    const base = sharp(bent, { raw: { width: MASTER, height: mh, channels: 3 } }).linear(gain, 0);
    const buf = await base.png().toBuffer();
    for (const w of WIDTHS) {
      const img = sharp(buf).resize({ width: w });
      await img.clone().avif({ quality: 50, effort: 6 }).toFile(join(OUT, "slabs", `${id}-${n}-${w}.avif`));
      await img.clone().webp({ quality: 72 }).toFile(join(OUT, "slabs", `${id}-${n}-${w}.webp`));
    }
    process.stdout.write(`${id} ${n}  `);
  }
  manifest.stones[id] = slabs;
  console.log();

  // a square close-up for the sample box and the finish swatches
  const sm = cfg.sample;
  const tile = sharp(file).extract({ left: sm.left, top: sm.top, width: sm.size, height: sm.size }).resize(360, 360);
  await tile.clone().avif({ quality: 52, effort: 6 }).toFile(join(OUT, `sample-${id}.avif`));
  await tile.clone().webp({ quality: 76 }).toFile(join(OUT, `sample-${id}.webp`));
}

// Antiqued (brushed) finish: a tileable relief texture, soft-light over the slab.
// White noise blurred with wrap-around box passes (≈ Gaussian), two scales,
// then lit from the top left. No grid, no seams.
{
  const N = 512;
  let seed = 20261009;
  const rand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const noise = new Float32Array(N * N);
  for (let i = 0; i < noise.length; i++) noise[i] = rand();
  const boxPass = (src, r, horizontal) => {
    const out = new Float32Array(N * N);
    const k = 2 * r + 1;
    for (let a = 0; a < N; a++) {
      let acc = 0;
      for (let t = -r; t <= r; t++) {
        const b = (t + N) % N;
        acc += horizontal ? src[a * N + b] : src[b * N + a];
      }
      for (let b = 0; b < N; b++) {
        const idx = horizontal ? a * N + b : b * N + a;
        out[idx] = acc / k;
        const add = (b + r + 1) % N, sub = (b - r + N) % N;
        acc += horizontal ? src[a * N + add] - src[a * N + sub] : src[add * N + a] - src[sub * N + a];
      }
    }
    return out;
  };
  const blur = (src, r) => {
    let f = src;
    for (let i = 0; i < 3; i++) f = boxPass(boxPass(f, r, true), r, false);
    return f;
  };
  const big = blur(noise, 7);
  const fine = blur(noise, 2);
  const norm = (f) => {
    let lo = Infinity, hi = -Infinity;
    for (const v of f) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
    return f.map((v) => (v - lo) / (hi - lo));
  };
  const nb = norm(big), nf = norm(fine);
  const f = nb.map((v, i) => v * 0.78 + nf[i] * 0.22);
  const px = Buffer.alloc(N * N);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const v = f[y * N + x] - f[((y + N - 3) % N) * N + ((x + N - 3) % N)];
      px[y * N + x] = Math.max(0, Math.min(255, 128 + v * 900));
    }
  }
  await sharp(px, { raw: { width: N, height: N, channels: 1 } }).webp({ quality: 72 }).toFile(join(OUT, "finish-antiqued.webp"));
}

// Open Graph card: the first Karakalem pair as an open book on the grey table.
if (!ONLY_TEXTURE) {
  const n = manifest.stones.karakalem[0];
  const pageH = 500, pageW = Math.round(pageH * ASPECT);
  const left = await sharp(join(OUT, "slabs", `karakalem-${n}-880.webp`)).resize(pageW, pageH).toBuffer();
  const right = await sharp(join(OUT, "slabs", `karakalem-${n + 1}-880.webp`)).resize(pageW, pageH).flop().toBuffer();
  const W = 1200, H = 630;
  const bx = Math.round(W / 2 - pageW), by = Math.round((H - pageH) / 2);
  const shade = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stop-color="#24191A" stop-opacity="0"/>
          <stop offset="0.44" stop-color="#24191A" stop-opacity="0"/>
          <stop offset="0.5" stop-color="#24191A" stop-opacity="0.32"/>
          <stop offset="0.56" stop-color="#24191A" stop-opacity="0"/>
          <stop offset="1" stop-color="#24191A" stop-opacity="0"/>
        </linearGradient>
        <filter id="s" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000" flood-opacity="0.4"/></filter>
      </defs>
      <rect x="150" y="40" width="900" height="550" fill="#C9C5BF"/>
      <rect x="${bx - 6}" y="${by + 2}" width="${pageW * 2 + 12}" height="${pageH - 4}" fill="#E5E0D9" filter="url(#s)"/>
    </svg>`,
  );
  const gutter = Buffer.from(
    `<svg width="${pageW * 2}" height="${pageH}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" x2="1">
        <stop offset="0.38" stop-color="#24191A" stop-opacity="0"/>
        <stop offset="0.5" stop-color="#24191A" stop-opacity="0.3"/>
        <stop offset="0.62" stop-color="#24191A" stop-opacity="0"/>
      </linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <rect x="${pageW - 0.5}" width="1" height="100%" fill="#24191A" fill-opacity="0.35"/>
    </svg>`,
  );
  await sharp({ create: { width: W, height: H, channels: 3, background: "#3C1A1E" } })
    .composite([
      { input: shade, left: 0, top: 0 },
      { input: left, left: bx, top: by },
      { input: right, left: bx + pageW, top: by },
      { input: gutter, left: bx, top: by },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join("app", "damar", "opengraph-image.jpg"));
}

if (!ONLY_TEXTURE) writeFileSync(join("content", "damar", "slab-images.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log("done");
