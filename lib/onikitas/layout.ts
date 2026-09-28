// House programmes, placement and numbering for the twelve Onikitaş houses.
// Pure and deterministic; lib/onikitas/site.ts runs it once for the chosen seed.

import { mulberry32 } from "./noise";
import { baseHeight, coastZ, DEG, HALF, n, SLAB } from "./terrain";

// ---------------------------------------------------------------------------
// House programmes. Every house shares one material language (limewash block,
// travertine terrace, oak pergola) but its massing comes from its own seed.
// Local frame: +z faces the house's view (downhill), x runs along the contour.

export type Box = { w: number; h: number; d: number; x: number; z: number };

export type VillaPlan = {
  floors: 1 | 2;
  /** Ground-floor block; `h` is its wall height above the slab. */
  main: Box;
  upper: Box | null;
  wing: Box | null;
  roofTerrace: boolean;
  chimneys: number;
  /** Front windows of the main block: count and size. */
  windows: { n: number; w: number; h: number };
  pool: { w: number; d: number; x: number; z: number; lap: boolean };
  pergola: { x0: number; x1: number; z0: number; z1: number } | null;
  wallStone: boolean;
  wallH: number;
  slab: { x0: number; x1: number; z0: number; z1: number };
  /** Half extents of the levelled terrain pad (slab + a margin). */
  pad: { hx: number; hz: number };
  /** Highest point of the house above its pad (roof, parapet, chimney). */
  top: number;
};

export function villaPlan(seed: number): VillaPlan {
  const r = mulberry32(Math.floor(seed * 1e9) ^ 0x5eed);
  const lerp = (a: number, b: number) => a + (b - a) * r();
  const floors: 1 | 2 = r() < 0.64 ? 2 : 1;
  const side = r() < 0.18 ? 0 : r() < 0.5 ? -1 : 1; // wing side, 0 = none
  const main: Box = { w: lerp(4.5, 6.1), d: lerp(3.3, 4.2), h: floors === 2 ? lerp(1.8, 2.0) : lerp(1.95, 2.3), x: 0, z: 0 };
  main.x = -side * lerp(0.4, 1.1);
  main.z = -main.d / 2; // back wall at z = -main.d, front at 0
  let wing: Box | null = null;
  if (side !== 0) {
    const w = lerp(2.3, 3.2);
    const d = lerp(2.5, Math.min(3.3, main.d));
    wing = { w, d, h: lerp(1.45, 1.7), x: main.x + side * (main.w / 2 + w / 2 - 0.03), z: -main.d + d / 2 + lerp(-0.35, 0.45) };
  }
  let upper: Box | null = null;
  if (floors === 2) {
    const w = lerp(2.6, Math.min(3.7, main.w - 0.9));
    const d = lerp(2.5, Math.min(3.2, main.d - 0.35));
    upper = { w, d, h: lerp(1.55, 1.75), x: main.x + (r() - 0.5) * (main.w - w - 0.3), z: -main.d + d / 2 + lerp(0, 0.35) };
  }
  const roofTerrace = floors === 2 ? r() < 0.85 : r() < 0.5;
  const chimneys = r() < 0.2 ? 0 : r() < 0.72 ? 1 : 2;
  const wide = r() < 0.4;
  const windows = wide ? { n: r() < 0.5 ? 2 : 3, w: lerp(0.8, 1.05), h: lerp(0.85, 1.0) } : { n: r() < 0.45 ? 3 : 4, w: lerp(0.42, 0.55), h: lerp(1.05, 1.25) };

  // outdoor terrace in front of the house, pool set into it
  const td = lerp(3.4, 4.9);
  const hx0 = Math.min(main.x - main.w / 2, wing ? wing.x - wing.w / 2 : Infinity);
  const hx1 = Math.max(main.x + main.w / 2, wing ? wing.x + wing.w / 2 : -Infinity);
  const slab = { x0: hx0 - lerp(0.5, 1.3), x1: hx1 + lerp(0.5, 1.3), z0: -main.d - 0.45, z1: td };
  const lap = r() < 0.55;
  const sw = slab.x1 - slab.x0;
  const poolW = lap ? Math.min(sw - 1.6, lerp(4.4, 6.2)) : lerp(2.4, 3.1);
  const poolD = lap ? lerp(1.2, 1.6) : lerp(2.2, Math.min(2.9, td - 0.9));
  const poolSide = side !== 0 ? -side : r() < 0.5 ? -1 : 1;
  const edge = lerp(0.45, 0.8);
  const poolX = lap
    ? (slab.x0 + slab.x1) / 2 + poolSide * lerp(0, Math.max(0, (sw - poolW) / 2 - 0.7))
    : poolSide < 0
      ? slab.x0 + edge + poolW / 2
      : slab.x1 - edge - poolW / 2;
  const pool = { w: poolW, d: poolD, x: poolX, z: td - edge - poolD / 2, lap };

  // oak pergola against the front wall, on the side away from the pool
  let pergola: VillaPlan["pergola"] = null;
  if (r() < 0.72) {
    const len = lerp(2.6, 4.2);
    const onLeft = pool.x > (slab.x0 + slab.x1) / 2;
    const x0 = onLeft ? Math.max(slab.x0 + 0.3, main.x - main.w / 2) : Math.min(slab.x1 - 0.3, main.x + main.w / 2) - len;
    // clear of the pool: shallow over a lap pool, deeper beside a plunge pool
    const overPool = x0 < pool.x + pool.w / 2 && x0 + len > pool.x - pool.w / 2;
    const room = overPool ? pool.z - pool.d / 2 - 0.3 : td - 0.35;
    const dep = Math.min(lerp(2.0, 2.9), room - 0.12);
    if (dep > 1.2) pergola = { x0, x1: x0 + len, z0: 0.12, z1: 0.12 + dep };
  }
  const wallStone = r() < 0.5;
  const wallH = lerp(0.42, 0.68);

  // recentre on the slab so the pad is symmetric about the house origin
  const cx = (slab.x0 + slab.x1) / 2;
  const cz = (slab.z0 + slab.z1) / 2;
  const mv = (b: Box | null) => (b ? { ...b, x: b.x - cx, z: b.z - cz } : null);
  const plan: VillaPlan = {
    floors,
    main: mv(main)!,
    upper: mv(upper),
    wing: mv(wing),
    roofTerrace,
    chimneys,
    windows,
    pool: { ...pool, x: pool.x - cx, z: pool.z - cz },
    pergola: pergola ? { x0: pergola.x0 - cx, x1: pergola.x1 - cx, z0: pergola.z0 - cz, z1: pergola.z1 - cz } : null,
    wallStone,
    wallH,
    slab: { x0: slab.x0 - cx, x1: slab.x1 - cx, z0: slab.z0 - cz, z1: slab.z1 - cz },
    pad: { hx: (slab.x1 - slab.x0) / 2 + 0.45, hz: (slab.z1 - slab.z0) / 2 + 0.45 },
    top: SLAB + main.h + (upper ? upper.h : 0) + (chimneys ? 0.85 : roofTerrace ? 0.3 : 0.05),
  };
  return plan;
}

// ---------------------------------------------------------------------------
// Placement: seeded dart throwing (Poisson-disc with a density field) on the
// slope band, each house turned to its own contour. Hard rule, checked for
// every pair: no house may stand in the sea-view cone of a house uphill of it
// (see `cutsView`).

export type VillaSite = {
  index: number;
  x: number;
  z: number;
  y: number;
  rot: number;
  /** 0..1 seeded variant used to vary the massing. */
  seed: number;
  plan: VillaPlan;
  /** Compass bearing the house faces, degrees (90 = east, 180 = south). */
  bearing: number;
};

/** Sea-view wedge: half-angle around the facing axis, and the eye height. */
export const VIEW_HALF = 22 * DEG;
const EYE = SLAB + 0.9;
const SEA_OUT = 60;

export type Placed = {
  /** hamlet the house belongs to (houses gather in small clusters) */
  hamlet?: number; x: number; z: number; y: number; rot: number; seed: number; plan: VillaPlan; /** distance to the water along the facing axis (cached) */ L?: number };

const facingOf = (rot: number): [number, number] => [Math.sin(rot), Math.cos(rot)];
export const bearingOf = (rot: number) => (((Math.atan2(Math.sin(rot), -Math.cos(rot)) / DEG) % 360) + 360) % 360;

/** Downhill direction of the broad slope, as a rotation about +y. */
function contourRot(x: number, z: number) {
  const e = 3;
  const gx = baseHeight(x + e, z) - baseHeight(x - e, z);
  const gz = baseHeight(x, z + e) - baseHeight(x, z - e);
  const rot = Math.atan2(-gx, -gz);
  return Math.max(-72 * DEG, Math.min(72 * DEG, rot));
}

function corners(p: Placed, grow: number) {
  const c = Math.cos(p.rot);
  const s = Math.sin(p.rot);
  const hx = p.plan.pad.hx + grow;
  const hz = p.plan.pad.hz + grow;
  return [
    [-hx, -hz],
    [hx, -hz],
    [hx, hz],
    [-hx, hz],
  ].map(([lx, lz]) => [p.x + c * lx + s * lz, p.z - s * lx + c * lz]);
}

/** Separating-axis overlap of two pads, each grown by `grow`. */
function padsOverlap(a: Placed, b: Placed, grow: number) {
  const A = corners(a, grow);
  const B = corners(b, grow);
  for (const P of [a, b]) {
    const c = Math.cos(P.rot);
    const s = Math.sin(P.rot);
    for (const [ax, az] of [
      [c, -s],
      [s, c],
    ]) {
      let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
      for (const [x, z] of A) {
        const t = x * ax + z * az;
        a0 = Math.min(a0, t);
        a1 = Math.max(a1, t);
      }
      for (const [x, z] of B) {
        const t = x * ax + z * az;
        b0 = Math.min(b0, t);
        b1 = Math.max(b1, t);
      }
      if (a1 < b0 || b1 < a0) return false;
    }
  }
  return true;
}

/** Distance from a point along a direction until the terrain meets the sea. */
function shoreDistance(x: number, z: number, fx: number, fz: number) {
  for (let t = 2; t < 160; t += 1) if (baseHeight(x + fx * t, z + fz * t) < 0) return t;
  return 160;
}

/**
 * Does house `b` cut the sea view of house `a`? `a` looks down its facing axis
 * over a wedge of ±VIEW_HALF; its eye sits on the terrace, 1.8 m up. `b` cuts
 * the view when its footprint enters that wedge AND its highest point (roof,
 * parapet or chimney) rises above the sight line from `a`'s eye to the sea
 * SEA_OUT units off the shore (about 120 m out in the bay). A house low enough
 * down the slope stays under that line: `a` looks over its roof to open water.
 */
export function cutsView(a: Placed, b: Placed) {
  const [fx, fz] = facingOf(a.rot);
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const along = dx * fx + dz * fz;
  if (along <= 0) return false;
  const lateral = Math.abs(dx * fz - dz * fx);
  const rb = Math.hypot(b.plan.pad.hx, b.plan.pad.hz) * 0.8;
  if (lateral > along * Math.tan(VIEW_HALF) + rb / Math.cos(VIEW_HALF)) return false;
  const L = a.L ?? (a.L = shoreDistance(a.x, a.z, fx, fz));
  if (along - rb > L) return false;
  const eye = a.y + EYE;
  const near = Math.max(0.5, along - rb);
  const line = eye - (eye * near) / (L + SEA_OUT);
  return b.y + b.plan.top > line - 0.15;
}

/** How many houses the last attempt managed to place (layout search tool). */
export let placeReached = 0;

/** One placement attempt for a layout seed (exported for the layout search tool). */
export const placeStats = { density: 0, ground: 0, spacing: 0, view: 0, backtracks: 0 };

export function place(seed: number, count: number, band = BAND): Placed[] | null {
  const rand = mulberry32(seed);
  const gauss = () => (rand() + rand() + rand() - 1.5) * 1.15;
  // hamlets: a few loose clusters on the slope, open ground between them
  const hamlets: { x: number; d: number }[] = [];
  for (let t = 0; t < 400 && hamlets.length < HAMLETS; t++) {
    const h = { x: band.x0 + 8 + rand() * (band.x1 - band.x0 - 16), d: band.d0 + 5 + rand() * (band.d1 - band.d0 - 10) };
    if (hamlets.every((o) => Math.hypot((o.x - h.x) / 1.4, o.d - h.d) > 17)) hamlets.push(h);
  }
  const out: Placed[] = [];
  let budget = 24000;
  let stuck = 0;
  let reached = 0;
  while (out.length < count && budget-- > 0) {
    const vs = rand();
    const plan = villaPlan(vs);
    let ok = false;
    for (let tries = 0; tries < 260 && !ok; tries++, budget--) {
      // mostly near a hamlet centre, now and then a house on its own
      const hi = rand() < 0.88 ? Math.floor(rand() * hamlets.length) : -1;
      const H = hamlets[hi];
      const x = H ? H.x + gauss() * 10 : band.x0 + rand() * (band.x1 - band.x0);
      const d = H ? H.d + gauss() * 7 : band.d0 + rand() * (band.d1 - band.d0);
      if (x < band.x0 || x > band.x1 || d < band.d0 || d > band.d1) {
        placeStats.density++;
        continue;
      }
      const z = coastZ(x) - d;
      const jitter = (rand() - 0.5) * 24 * DEG;
      const lift = (rand() - 0.5) * 0.7;
      // cheap reject first: centres closer than the two pads' short sides
      const inner = Math.min(plan.pad.hx, plan.pad.hz);
      if (out.some((q) => Math.hypot(q.x - x, q.z - z) < inner + Math.min(q.plan.pad.hx, q.plan.pad.hz) + 0.9)) {
        placeStats.spacing++;
        continue;
      }
      const p: Placed = { x, z, y: 0, rot: contourRot(x, z) + jitter, seed: vs, plan, hamlet: hi };
      let clash = false;
      for (const q of out) {
        // neighbours in a hamlet stand close; between hamlets the gap opens
        const same = hi >= 0 && q.hamlet === hi;
        const h = pairHash(vs, q.seed);
        const gap = same ? 0.9 + 1.3 * h : 3.5 + 3 * h;
        if (padsOverlap(p, q, gap / 2)) {
          clash = true;
          placeStats.spacing++;
          break;
        }
      }
      if (clash) continue;
      // cut and fill, leaning to fill: the pad sits a little above the mean of
      // its ground, so houses stand on raised terraces rather than in pits
      const cs = corners(p, 0);
      const hs = [baseHeight(x, z), ...cs.map(([cx, cz]) => baseHeight(cx, cz))];
      const mean = hs.reduce((s, h) => s + h, 0) / hs.length;
      if (Math.max(...hs) - Math.min(...hs) > 8.5 || Math.min(...hs) < 2.0) {
        placeStats.ground++;
        continue;
      }
      p.y = mean + (Math.max(...hs) - mean) * 0.3 + lift;
      if (!clash)
        for (const q of out)
          if (cutsView(p, q) || cutsView(q, p)) {
            clash = true;
            placeStats.view++;
            break;
          }
      if (clash) continue;
      out.push(p);
      ok = true;
    }
    reached = Math.max(reached, out.length);
    // dead end: lift a random earlier house and try again from there
    if (!ok && out.length) {
      placeStats.backtracks++;
      out.splice(Math.floor(rand() * out.length), 1);
      if (++stuck > 60) break;
    }
  }
  placeReached = reached;
  return out.length === count ? out : null;
}

const pairHash = (a: number, b: number) => {
  const v = Math.sin(a * 91.7 + b * 37.3) * 43758.5453;
  return v - Math.floor(v);
};

/** Where houses may stand: x range, and distance inland from the shore. */
export const BAND = { x0: -46, x1: 42, d0: 4, d1: 40 };
const HAMLETS = 5;

// Numbering. The copy promises things about particular houses, so the
// numbers are dealt out to make each promise true:
//   IX   stands highest on the slope
//   VII  faces furthest west of the rest (sunset from the living room)
//   X    has nothing but olives between it and the sea
//   V    sits at the edge of the olive grove
//   I    faces furthest east of the rest, high up (first sun)
// The rest follow the hour each house is known for (east-facing houses get
// the morning hours, west-facing ones the evening). The `facing` labels in
// content/onikitas/tr.ts are the compass names of these bearings.
const TARGET: Record<number, number> = { 1: 135, 2: 170, 3: 185, 5: 190, 7: 225, 10: 230, 11: 250 };

function treeCandidates(sites: Placed[]) {
  const rand = mulberry32(9);
  const out: { x: number; z: number; r: number }[] = [];
  const g = 2.3;
  for (let gx = -HALF + 6; gx < HALF - 6; gx += g) {
    for (let gz = -HALF + 6; gz < HALF - 6; gz += g) {
      const x = gx + (rand() - 0.5) * g * 0.9;
      const z = gz + (rand() - 0.5) * g * 0.9;
      const s = rand();
      const r = rand();
      const k = rand();
      const d = coastZ(x) - z;
      if (d < 2.5) continue;
      const dens = n(x * 0.035 + 11, z * 0.035 - 4) + 0.35 * n(x * 0.12, z * 0.12);
      // groves thin out uphill and near the houses
      if (dens < 0.05 + d * 0.004) continue;
      out.push({ x, z, r: s + r + k });
    }
  }
  return out.filter((t) => !sites.some((v) => Math.hypot(t.x - v.x, t.z - v.z) < Math.hypot(v.plan.pad.hx, v.plan.pad.hz) + 2.6));
}

export function number(sites: Placed[]): Placed[] {
  const trees = treeCandidates(sites);
  const left = new Set(sites.map((_, i) => i));
  const slot: number[] = new Array(12).fill(-1);
  const take = (label: number, score: (p: Placed, i: number) => number) => {
    let best = -1;
    let bs = -Infinity;
    for (const i of left) {
      const s = score(sites[i], i);
      if (s > bs) {
        bs = s;
        best = i;
      }
    }
    slot[label] = best;
    left.delete(best);
  };
  const bearing = (p: Placed) => bearingOf(p.rot);
  take(8, (p) => p.y);
  take(6, (p) => bearing(p));
  // X: no house anywhere in its wedge down to the sea, the most olives in it
  take(9, (p) => {
    const [fx, fz] = facingOf(p.rot);
    const inWedge = (x: number, z: number) => {
      const along = (x - p.x) * fx + (z - p.z) * fz;
      const lat = Math.abs((x - p.x) * fz - (z - p.z) * fx);
      return along > 0 && lat < along * Math.tan(VIEW_HALF) + 2;
    };
    if (sites.some((q) => q !== p && inWedge(q.x, q.z))) return -1e6;
    return trees.filter((t) => inWedge(t.x, t.z)).length - p.y * 0.5;
  });
  take(4, (p) => trees.filter((t) => Math.hypot(t.x - p.x, t.z - p.z) < 14).length);
  // first sun: the most east-facing house left, the higher the earlier it wakes
  take(0, (p) => -bearing(p) + p.y * 0.25);
  // the rest: best permutation against the hour targets
  const rest = [...left];
  const labels = Object.keys(TARGET).map(Number);
  let bestPerm: number[] = rest;
  let bestCost = Infinity;
  const perm = (arr: number[], k: number) => {
    if (k === arr.length) {
      let c = 0;
      for (let j = 0; j < arr.length; j++) c += (bearing(sites[arr[j]]) - TARGET[labels[j]]) ** 2;
      if (c < bestCost) {
        bestCost = c;
        bestPerm = arr.slice();
      }
      return;
    }
    for (let j = k; j < arr.length; j++) {
      [arr[k], arr[j]] = [arr[j], arr[k]];
      perm(arr, k + 1);
      [arr[k], arr[j]] = [arr[j], arr[k]];
    }
  };
  perm(rest, 0);
  labels.forEach((l, j) => (slot[l] = bestPerm[j]));
  return slot.map((i) => sites[i]);
}

