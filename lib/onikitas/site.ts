// The fictional Onikitaş site: a south-facing hillside above a cove, twelve
// terraced pads and an olive grove. Pure functions, deterministic, no three.js.
// World axes: +x east, -z north (uphill), +z south (the sea), +y up. 1 unit ~ 2 m.

import { makeNoise2D, mulberry32 } from "./noise";

export const WORLD = 210; // terrain square side
export const HALF = WORLD / 2;
export const STEP = 1.25; // contour step of the maquette (clay state)

const n = makeNoise2D(1207);
const sat = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const t = sat((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function fbm(x: number, z: number, oct: number) {
  let a = 0.5;
  let f = 1;
  let s = 0;
  for (let i = 0; i < oct; i++) {
    s += a * n(x * f, z * f);
    f *= 2.03;
    a *= 0.5;
  }
  return s;
}

/** z of the shoreline for a given x. A cove centred slightly west. */
export function coastZ(x: number) {
  return 17 - 11 * Math.exp(-(((x + 3) / 21) ** 2)) + 3.2 * Math.sin(x * 0.052 + 0.8) + 1.4 * Math.sin(x * 0.13 + 2.1);
}

function coastSlope(x: number) {
  const e = 0.5;
  return (coastZ(x + e) - coastZ(x - e)) / (2 * e);
}

export function baseHeight(x: number, z: number) {
  const d = coastZ(x) - z; // metres inland (>0 land)
  if (d < 0) {
    return Math.max(-11, d * 0.5 + fbm(x * 0.06, z * 0.06, 2) * 1.4 * sat(-d / 4)) + 0.25 * sat(1 + d);
  }
  const rise = 36 * (1 - Math.exp(-d / 58));
  const east = 8 * Math.exp(-(((x - 46) / 24) ** 2)) * sat(d / 16);
  const west = 6 * Math.exp(-(((x + 50) / 22) ** 2)) * sat(d / 14);
  const bluff = 1.3 * smooth(0, 2.2, d);
  const broad = fbm(x * 0.027, z * 0.027, 4) * 4 * sat(d / 12);
  const fine = fbm(x * 0.12, z * 0.12, 2) * 0.8 * sat(d / 5);
  return 0.25 + rise + east + west + bluff + broad + fine;
}

export type VillaSite = {
  index: number;
  x: number;
  z: number;
  y: number;
  rot: number;
  /** 0..1 seeded variant used to vary the massing. */
  seed: number;
  flip: boolean;
};

// Rows follow the contours (d = distance inland). Numbered I..XII from the
// lowest row, east to west, so I is the easternmost (the first sunlight).
const ROWS: { d: number; xs: number[] }[] = [
  { d: 9, xs: [23, 9, -5, -19] },
  { d: 20, xs: [15.5, 1.5, -12.5, -26.5] },
  { d: 31, xs: [20, 6, -8, -22] },
];

export const PAD_HALF = { x: 5.6, z: 4.6 };
const PAD_FALL = 4.2;

export const villaSites: VillaSite[] = (() => {
  const rand = mulberry32(42);
  const out: VillaSite[] = [];
  let i = 0;
  for (const row of ROWS) {
    for (const x0 of row.xs) {
      const x = x0 + (rand() - 0.5) * 1.6;
      const z = coastZ(x) - row.d + (rand() - 0.5) * 1.4;
      let y = 0;
      for (const [ox, oz] of [[0, 0], [2.5, 0], [-2.5, 0], [0, 2], [0, -2]]) y += baseHeight(x + ox, z + oz);
      y /= 5;
      const rot = Math.atan2(-coastSlope(x), 1) * 0.85 + (rand() - 0.5) * 0.12;
      out.push({ index: i, x, z, y, rot, seed: rand(), flip: rand() > 0.5 });
      i++;
    }
  }
  return out;
})();

/** Pad influence (0..1) of the strongest villa at a point, and its height. */
export function padAt(x: number, z: number): [number, number] {
  let best = 0;
  let h = 0;
  for (const v of villaSites) {
    const dx = x - v.x;
    const dz = z - v.z;
    const c = Math.cos(v.rot);
    const s = Math.sin(v.rot);
    const lx = Math.abs(c * dx - s * dz) - PAD_HALF.x;
    const lz = Math.abs(s * dx + c * dz) - PAD_HALF.z;
    const dist = Math.hypot(Math.max(lx, 0), Math.max(lz, 0));
    const w = 1 - smooth(0, PAD_FALL, dist);
    if (w > best) {
      best = w;
      h = v.y;
    }
  }
  return [best, h];
}

export function height(x: number, z: number) {
  const b = baseHeight(x, z);
  const [w, h] = padAt(x, z);
  return b + (h - b) * w;
}

export function stepped(h: number, pad: number) {
  const s = Math.floor(h / STEP) * STEP;
  return s + (h - s) * pad;
}

export type Tree = { x: number; y: number; z: number; s: number; r: number; k: number };

export function makeTrees(max: number): Tree[] {
  const rand = mulberry32(9);
  const out: Tree[] = [];
  const g = 2.3;
  for (let gx = -HALF + 6; gx < HALF - 6; gx += g) {
    for (let gz = -HALF + 6; gz < HALF - 6; gz += g) {
      const x = gx + (rand() - 0.5) * g * 0.9;
      const z = gz + (rand() - 0.5) * g * 0.9;
      const d = coastZ(x) - z;
      if (d < 2.5) continue;
      const dens = n(x * 0.035 + 11, z * 0.035 - 4) + 0.35 * n(x * 0.12, z * 0.12);
      // groves thin out uphill and near the houses
      if (dens < 0.05 + d * 0.004) continue;
      const [w] = padAt(x, z);
      if (w > 0.02) continue;
      let near = false;
      for (const v of villaSites) if (Math.hypot(x - v.x, z - v.z) < 8.2) near = true;
      if (near) continue;
      const y = height(x, z);
      if (y < 0.6 || y > 38) continue;
      out.push({ x, y, z, s: 0.75 + rand() * 0.6, r: rand() * Math.PI * 2, k: rand() });
    }
  }
  // deterministic shuffle, then cap: sparse tiers keep an even spread
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.slice(0, max);
}

/** Depth below sea level, 0 (shore) .. 1 (>= 10 units), on a size x size grid. */
export function depthMap(size: number) {
  const data = new Uint8Array(size * size);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const x = -HALF + (i / (size - 1)) * WORLD;
      const z = -HALF + (j / (size - 1)) * WORLD;
      const h = baseHeight(x, z);
      data[j * size + i] = Math.round(sat(-h / 10) * 255);
    }
  }
  return data;
}

/** Scene focus point (centre of the twelve houses). */
export const FOCUS = (() => {
  let x = 0;
  let y = 0;
  let z = 0;
  for (const v of villaSites) {
    x += v.x;
    y += v.y;
    z += v.z;
  }
  return { x: x / 12, y: y / 12, z: z / 12 };
})();
