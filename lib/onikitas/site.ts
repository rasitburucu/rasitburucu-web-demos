// The fictional Onikitaş site: a south-facing hillside above a cove, twelve
// terraced houses and an olive grove. Pure functions, deterministic, no three.js.
// World axes: +x east, -z north (uphill), +z south (the sea), +y up. 1 unit ~ 2 m.

import { mulberry32 } from "./noise";
import { baseHeight, coastZ, HALF, n, SHORE_DEPTH, smooth, STEP, sat, WORLD } from "./terrain";
import { bearingOf, cutsView, number, place, type Placed, type VillaSite } from "./layout";

export * from "./terrain";
export * from "./layout";

const LAYOUT_SEED = 246;
const PAD_FALL = 4.2;

export const villaSites: VillaSite[] = (() => {
  // the chosen seed fits first time; the loop only guards against edits to the rules
  let placed: Placed[] | null = null;
  for (let s = LAYOUT_SEED; !placed; s++) placed = place(s, 12);
  return number(placed).map((p, index) => {
    const plan = p.plan;
    // copy promises that live in the massing
    if (index === 5 && !plan.pergola) {
      const z0 = plan.main.z + plan.main.d / 2 + 0.12;
      const x0 = plan.main.x - plan.main.w / 2;
      plan.pergola = { x0, x1: x0 + Math.min(3.4, plan.main.w), z0, z1: z0 + Math.min(2.4, plan.pool.z - plan.pool.d / 2 - z0 - 0.3) };
    }
    if (index === 10) plan.roofTerrace = true;
    return { index, x: p.x, z: p.z, y: p.y, rot: p.rot, seed: p.seed, plan, bearing: bearingOf(p.rot) };
  });
})();

// Night: lamps come on one by one between these hours, each far from the last
// two, so the light wanders over the slope instead of sweeping along it.
export const LAMP_FIRST = 19.85;
export const LAMP_LAST = 21.3;
const lampOrder = (() => {
  const left = villaSites.slice().sort((a, b) => a.y - b.y);
  const order = [left.shift()!];
  while (left.length) {
    const recent = order.slice(-2);
    let bi = 0;
    let bd = -1;
    left.forEach((v, i) => {
      const d = Math.min(...recent.map((o) => Math.hypot(o.x - v.x, o.z - v.z)));
      if (d > bd) {
        bd = d;
        bi = i;
      }
    });
    order.push(left.splice(bi, 1)[0]);
  }
  return order.map((v) => v.index);
})();

/** Hour (decimal) a house's lamps come on at night, and go off before dawn (0 = dark by then). */
export function lampHours(v: VillaSite) {
  const k = lampOrder.indexOf(v.index);
  return { on: LAMP_FIRST + ((LAMP_LAST - LAMP_FIRST) * k) / 11, off: v.index % 3 === 1 ? 5.78 + v.index * 0.02 : 0 };
}

// The brand promise, re-checked in development: no house in another's sea view.
if (process.env.NODE_ENV !== "production") {
  for (const a of villaSites)
    for (const b of villaSites)
      if (a !== b && cutsView(a, b)) console.warn(`onikitas: villa ${b.index + 1} cuts the sea view of villa ${a.index + 1}`);
}

/** A point in a house's local frame (x along the contour, z towards its view). */
export function villaLocal(v: VillaSite, lx: number, ly: number, lz: number): [number, number, number] {
  const c = Math.cos(v.rot);
  const s = Math.sin(v.rot);
  return [v.x + c * lx + s * lz, v.y + ly, v.z - s * lx + c * lz];
}

// Pads are looked up through a coarse grid so terrain and trees only test the
// two or three houses nearby, not all twelve.
const CELL = 10;
const GN = Math.ceil(WORLD / CELL);
const grid: number[][] = Array.from({ length: GN * GN }, () => []);
for (const v of villaSites) {
  const reach = Math.hypot(v.plan.pad.hx, v.plan.pad.hz) + PAD_FALL + 0.5;
  const i0 = Math.max(0, Math.floor((v.x - reach + HALF) / CELL));
  const i1 = Math.min(GN - 1, Math.floor((v.x + reach + HALF) / CELL));
  const j0 = Math.max(0, Math.floor((v.z - reach + HALF) / CELL));
  const j1 = Math.min(GN - 1, Math.floor((v.z + reach + HALF) / CELL));
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) grid[j * GN + i].push(v.index);
}
const cellOf = (x: number, z: number) => {
  const i = Math.floor((x + HALF) / CELL);
  const j = Math.floor((z + HALF) / CELL);
  return i < 0 || j < 0 || i >= GN || j >= GN ? [] : grid[j * GN + i];
};

/**
 * Pad influence (0..1) at a point and the pad height there. Where two pads'
 * margins meet, heights blend with steep weights, so there is no seam, and
 * each flat top stays flat.
 */
export function padAt(x: number, z: number): [number, number] {
  let best = 0;
  let sw = 0;
  let sh = 0;
  for (const k of cellOf(x, z)) {
    const v = villaSites[k];
    const dx = x - v.x;
    const dz = z - v.z;
    const c = Math.cos(v.rot);
    const s = Math.sin(v.rot);
    const lx = Math.abs(c * dx - s * dz) - v.plan.pad.hx;
    const lz = Math.abs(s * dx + c * dz) - v.plan.pad.hz;
    const dist = Math.hypot(Math.max(lx, 0), Math.max(lz, 0));
    const w = 1 - smooth(0, PAD_FALL, dist);
    if (w <= 0) continue;
    const w4 = w * w * w * w;
    sw += w4;
    sh += w4 * v.y;
    if (w > best) best = w;
  }
  return [best, sw > 0 ? sh / sw : 0];
}

/** Is a point too close to a house for an olive tree? */
export function nearHouse(x: number, z: number) {
  for (const k of cellOf(x, z)) {
    const v = villaSites[k];
    if (Math.hypot(x - v.x, z - v.z) < Math.hypot(v.plan.pad.hx, v.plan.pad.hz) + 2.6) return true;
  }
  return false;
}

/**
 * Height of the terrace wall under each pad's edge on the downhill (fill) side.
 * The stone plinth under the slab holds the pad; the ground only banks up to
 * its foot, so a terrace reads as a clean dry-stone wall, not a smeared ramp.
 */
export const TERRACE_WALL = 0.9;
/** Depth of the plinth below the pad: always below the ground inside the pad. */
export const PLINTH_DEPTH = TERRACE_WALL + 1.6;

/** Ground around a pad: cut down to just under the pad top uphill, banked up to the wall foot downhill. */
export function ground(b: number, w: number, ph: number) {
  const cut = ph - 0.06;
  if (b >= cut) return b + (cut - b) * w;
  return b + Math.max(0, ph - TERRACE_WALL - b) * w;
}

export function height(x: number, z: number) {
  const [w, h] = padAt(x, z);
  return ground(baseHeight(x, z), w, h);
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
      const s = 0.75 + rand() * 0.6;
      const r = rand() * Math.PI * 2;
      const k = rand();
      const d = coastZ(x) - z;
      if (d < 2.5) continue;
      const dens = n(x * 0.035 + 11, z * 0.035 - 4) + 0.35 * n(x * 0.12, z * 0.12);
      if (dens < 0.05 + d * 0.004) continue;
      if (nearHouse(x, z) || padAt(x, z)[0] > 0.02) continue;
      const y = height(x, z);
      if (y < 0.6 || y > 38) continue;
      out.push({ x, y, z, s, r, k });
    }
  }
  // deterministic shuffle, then cap: sparse tiers keep an even spread
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.slice(0, max);
}

/** Depth below the shore step, 0 (shore) .. 1 (>= 10 units), on a size x size grid. */
export function depthMap(size: number) {
  const data = new Uint8Array(size * size);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const x = -HALF + (i / (size - 1)) * WORLD;
      const z = -HALF + (j / (size - 1)) * WORLD;
      const h = baseHeight(x, z);
      data[j * size + i] = Math.round(sat((-h - SHORE_DEPTH) / 10) * 255);
    }
  }
  return data;
}

/** Scene focus point: middle of the village across, mean height and depth. The camera keys hang off it. */
export const FOCUS = (() => {
  const xs = villaSites.map((v) => v.x);
  const mean = (f: (v: VillaSite) => number) => villaSites.reduce((s, v) => s + f(v), 0) / villaSites.length;
  return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: mean((v) => v.y), z: mean((v) => v.z) };
})();
