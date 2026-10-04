// Pazı Robotik: gripper sizing. One pure function decides the tool for a
// product: its type, plate or claw size, how many suction pads or fingers it
// carries, what it weighs and whether the product is outside the standard tool
// class. The fit (plan.ts), the 3D cell, the drawings, the feasibility result
// and the printable sheet all read this, so they can never disagree.
//
// Units: millimetres and kilograms. Axes follow plan.ts: X = across the product
// (width g), Z = along it (length u). Every value is a concept value ("örnek").

import type { ProductKind } from "./plan";

export type GripperId = "vakum" | "vakum-iki" | "vakum-uzun" | "cift-vakum" | "pence";
export type GripFamily = "vakum" | "pence";
export type GripWarning = "grip-small" | "grip-large" | "grip-heavy";

export type GripperSpec = {
  id: GripperId;
  family: GripFamily;
  /** The face the tool works on (mm): across X, along Z. Two products side by side for the double pick. */
  face: { w: number; l: number };
  /** Vacuum plate, or the claw's top frame (mm). */
  plate: { w: number; l: number };
  /** Suction pad grid (vacuum): across X, along Z, pad diameter (mm). Zero for the claw. */
  pads: { nx: number; nz: number; d: number };
  /** Separately fed vacuum zones (one generator each). */
  zones: 1 | 2;
  /** Bag claw: fingers on each side, inner gap when closed, opening, finger length below the pivot (mm). */
  claw: { fingers: number; span: number; open: number; depth: number } | null;
  /** Rated holding load with the safety factor (kg). */
  holdKg: number;
  /** Tool mass including adapter and quick changer (kg). */
  mass: number;
  /** Share of the top face under the plate (vacuum). */
  cover: number;
  warning: GripWarning | null;
};

export type GripInput = { kind: ProductKind; u: number; g: number; y: number; kg: number; double?: boolean };

/* ------------------------------------------------------------ tool class */

/** Plate edge as a share of the face edge: 0.84² ≈ 70 % of the top face, never past the edge. */
const PLATE_SHARE = 0.84;
const PLATE_MIN = 90;
const PLATE_MAX = { w: 760, l: 1100 };
/** Below this share of the top face the product sags off the plate. */
const COVER_MIN = 0.6;
/** Narrowest face a standard plate holds without the product tipping on a fast move. */
const FACE_MIN = 120;
/** Standard pad sizes (mm). */
const PADS = [40, 50, 60, 80, 100] as const;
/** Pad pitch as multiples of the pad diameter: relaxed first, densest last. */
const PITCH = [2.4, 1.9, 1.5] as const;
/** Effective vacuum on the product face (Pa): corrugated board leaks, shrink film seals. */
const VACUUM_PA: Record<ProductKind, number> = { koli: 30_000, shrink: 50_000, torba: 0 };
/** Safety factor for a horizontal face lifted vertically with the arm's accelerations. */
const SAFETY = 2;
const G = 9.81;
/** Above this load or face area the plate is split into two separately fed zones. */
const ZONE_KG = 15;
const ZONE_AREA = 0.2; // m²
/** A face this long against its width gets the extended plate. */
const LONG_RATIO = 2.4;
const LONG_MIN = 600;
/** Bag claw class: bag width, bag length, bag height (mm). */
const CLAW = { g: [250, 650], u: [350, 1000], y: [40, 260] } as const;

const r5 = (v: number) => Math.round(v / 5) * 5;
const r1 = (v: number) => Math.round(v * 10) / 10;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** How many pads of diameter d fit along `dim` at a pitch of k·d (at least one). */
function padsAlong(dim: number, d: number, k: number) {
  const fit = Math.floor((dim - d) / (1.2 * d)) + 1; // never closer than 0.2·d between pads
  return clamp(Math.round(dim / (k * d)), 1, Math.max(1, fit));
}

function holdOf(n: number, d: number, pa: number) {
  const area = n * Math.PI * (d / 2000) ** 2; // m²
  return (area * pa) / (G * SAFETY);
}

/* ------------------------------------------------------------ vacuum */

function vacuum(i: GripInput): GripperSpec {
  const double = !!i.double;
  const face = { w: i.g, l: double ? 2 * i.u + 4 : i.u };
  const kgOnTool = double ? 2 * i.kg : i.kg;
  const plateEdge = (v: number, cap: number) => r5(clamp(Math.min(v * PLATE_SHARE, cap), Math.min(PLATE_MIN, v - 10), cap));
  const long = !double && face.l >= LONG_MIN && face.l / face.w >= LONG_RATIO;
  const plate = { w: plateEdge(face.w, PLATE_MAX.w), l: plateEdge(face.l, long ? PLATE_MAX.l + 200 : PLATE_MAX.l) };
  const cover = (plate.w * plate.l) / (face.w * face.l);

  // pad size from the plate's short side, then the lightest layout that holds the load
  const short = Math.min(plate.w, plate.l);
  const base = short < 110 ? 0 : short < 170 ? 1 : short < 260 ? 2 : short < 420 ? 3 : 4;
  const pa = VACUUM_PA[i.kind] || VACUUM_PA.koli;
  type Layout = { nx: number; nz: number; d: number; hold: number };
  let pick: Layout | null = null;
  let strongest: Layout | null = null;
  for (const k of PITCH) {
    for (const di of [base, Math.min(PADS.length - 1, base + 1)]) {
      const d = PADS[di];
      if (d > short) continue;
      const nx = padsAlong(plate.w, d, k);
      const nz = padsAlong(plate.l, d, k);
      const hold = holdOf(nx * nz, d, pa);
      const lay = { nx, nz, d, hold };
      if (!strongest || hold > strongest.hold) strongest = lay;
      if (hold >= kgOnTool && !pick) pick = lay;
    }
    if (pick) break;
  }
  const lay = pick ?? strongest ?? { nx: 1, nz: 1, d: PADS[0], hold: holdOf(1, PADS[0], pa) };
  const n = lay.nx * lay.nz;

  const heavy = i.kg >= ZONE_KG || (face.w * face.l) / 1e6 >= ZONE_AREA;
  const zones: 1 | 2 = n >= 2 && (double || heavy || long) ? 2 : 1;
  const id: GripperId = double ? "cift-vakum" : long ? "vakum-uzun" : zones === 2 ? "vakum-iki" : "vakum";

  let warning: GripWarning | null = null;
  if (Math.min(i.u, i.g) < FACE_MIN) warning = "grip-small";
  else if (cover < COVER_MIN) warning = "grip-large";
  else if (lay.hold < kgOnTool) warning = "grip-heavy";

  const area = (plate.w * plate.l) / 1e6;
  const mass = 1.1 + 11 * area + 0.05 * n + (zones === 2 ? 0.45 : 0) + (long ? 0.3 : 0);
  return {
    id,
    family: "vakum",
    face,
    plate,
    pads: { nx: lay.nx, nz: lay.nz, d: lay.d },
    zones,
    claw: null,
    holdKg: r1(lay.hold),
    mass: r1(mass),
    cover: Math.round(cover * 100) / 100,
    warning,
  };
}

/* ------------------------------------------------------------ bag claw */

function claw(i: GripInput): GripperSpec {
  // the claw follows the bag but keeps a working size when the bag is outside its class
  const g = clamp(i.g, CLAW.g[0], CLAW.g[1]);
  const u = clamp(i.u, CLAW.u[0], CLAW.u[1]);
  const y = clamp(i.y, CLAW.y[0], CLAW.y[1]);
  const plate = { w: r5(g + 60), l: r5(u + 20) };
  const fingers = clamp(Math.round(plate.l / 85), 4, 10);
  // fingers hang from pivots 70 mm under the flange, reach past the bag's underside by 16 mm
  const depth = r5(y + 66);
  const span = r5(g + 36);
  const open = r5(span + 2 * depth * Math.sin(0.6));
  const holdKg = Math.min(40, fingers * 2 * 4);

  let warning: GripWarning | null = null;
  if (i.g < CLAW.g[0] || i.u < CLAW.u[0] || i.y < CLAW.y[0]) warning = "grip-small";
  else if (i.g > CLAW.g[1] || i.u > CLAW.u[1] || i.y > CLAW.y[1]) warning = "grip-large";
  else if (i.kg > holdKg) warning = "grip-heavy";

  const area = (plate.w * plate.l) / 1e6;
  const mass = 1.6 + 4 * area + 0.1 * 2 * fingers;
  return {
    id: "pence",
    family: "pence",
    face: { w: i.g, l: i.u },
    plate,
    pads: { nx: 0, nz: 0, d: 0 },
    zones: 1,
    claw: { fingers, span, open, depth },
    holdKg,
    mass: r1(mass),
    cover: 1,
    warning,
  };
}

/** The tool for this product. `double` sizes the plate for two products picked side by side along their length. */
export function sizeGripper(i: GripInput): GripperSpec {
  const ok = (v: number, d: number) => (Number.isFinite(v) && v > 0 ? v : d);
  const safe: GripInput = { kind: i.kind, u: ok(i.u, 400), g: ok(i.g, 300), y: ok(i.y, 250), kg: ok(i.kg, 1), double: i.double };
  return safe.kind === "torba" ? claw(safe) : vacuum(safe);
}

/** True when two specs would draw the same tool. */
export function sameGripper(a: GripperSpec | null | undefined, b: GripperSpec | null | undefined) {
  if (!a || !b) return false;
  return (
    a.id === b.id &&
    a.plate.w === b.plate.w &&
    a.plate.l === b.plate.l &&
    a.pads.nx === b.pads.nx &&
    a.pads.nz === b.pads.nz &&
    a.pads.d === b.pads.d &&
    a.zones === b.zones &&
    a.claw?.fingers === b.claw?.fingers &&
    a.claw?.depth === b.claw?.depth
  );
}
