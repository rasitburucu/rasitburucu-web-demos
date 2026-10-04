// Terrain of the fictional Onikitaş hillside: shoreline and height field.
// Pure functions, deterministic, no three.js.
// World axes: the slope faces west over Yalıkavak bay. +z west (the sea),
// -z east (uphill), +x south, -x north, +y up. 1 unit ~ 2 m.

import { makeNoise2D } from "./noise";

export const WORLD = 210; // terrain square side
export const HALF = WORLD / 2;
export const STEP = 1.25; // contour step of the maquette (clay state)
/**
 * Contour layers sit at STEP_OFF + k * STEP, so the lowest land layer stands a
 * little above the sea plane (y = 0) instead of lying in it.
 */
export const STEP_OFF = 0.3;
/** Height of the maquette's contour layer under a point of height h. */
export const quant = (h: number) => Math.floor((h - STEP_OFF) / STEP) * STEP + STEP_OFF;
/** Terrace slab thickness; the top of the slab is the ground-floor level. */
export const SLAB = 0.3;
/** Sea floor right at the shore: deep enough to never fight the sea plane. */
export const SHORE_DEPTH = 0.6;

/** Shared simplex field: terrain, groves and hamlet density all read it. */
export const n = makeNoise2D(1207);
export const sat = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smooth = (a: number, b: number, v: number) => {
  const t = sat((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const DEG = Math.PI / 180;

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

export function baseHeight(x: number, z: number) {
  const d = coastZ(x) - z; // metres inland (>0 land)
  if (d < 0) {
    // the sea floor drops away at once: a small rock step, never a sheet of
    // terrain lying a hair under the water plane
    return Math.min(-SHORE_DEPTH, Math.max(-11, -SHORE_DEPTH + d * 0.5 + fbm(x * 0.06, z * 0.06, 2) * 1.4 * sat(-d / 4)));
  }
  const rise = 36 * (1 - Math.exp(-d / 58));
  const east = 8 * Math.exp(-(((x - 46) / 24) ** 2)) * sat(d / 16);
  const west = 6 * Math.exp(-(((x + 50) / 22) ** 2)) * sat(d / 14);
  const bluff = 1.3 * smooth(0, 2.2, d);
  const broad = fbm(x * 0.027, z * 0.027, 4) * 4 * sat(d / 12);
  const fine = fbm(x * 0.12, z * 0.12, 2) * 0.8 * sat(d / 5);
  return 0.25 + rise + east + west + bluff + broad + fine;
}

