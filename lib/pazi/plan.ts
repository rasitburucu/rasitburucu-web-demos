// Pazı Robotik: the calculation core. Pure functions, no React, no DOM.
// One input (Config) feeds everything: the SVG layer plan, the 3D cell, the
// model recommendation, the payback range and the printable sheet. If the 3D
// scene never loads, every number on the site still comes from here.
//
// Units: millimetres and kilograms in Config; the 3D scene converts to metres.
// Pallet frame: X = pallet width (800 on EUR), Z = pallet length (1200 on EUR),
// origin at the pallet centre. Product: u = length, g = width, y = height.
// Orientation "a" puts u along Z; "b" turns the product 90° (u along X).

import { sizeGripper, type GripperId, type GripperSpec, type GripWarning } from "./gripper";

export type { GripperId, GripperSpec } from "./gripper";
export type ProductKind = "koli" | "torba" | "shrink";
export type PalletKind = "eur" | "end" | "ozel";
export type PatternId = "sutun" | "orgu" | "firildak";
export type PatternChoice = "oto" | PatternId;
export type ModelId = "p12" | "p20" | "p30";
export type BuyMode = "satin" | "kira";

export type Config = {
  kind: ProductKind;
  u: number;
  g: number;
  y: number;
  kg: number;
  /** Products per minute, per line. */
  rate: number;
  lines: 1 | 2;
  shifts: 1 | 2 | 3;
  pallet: PalletKind;
  /** Custom pallet length (Z) and width (X), used when pallet === "ozel". */
  pl: number;
  pw: number;
  /** Maximum load height above the pallet deck. */
  maxH: number;
  sheet: boolean;
  pattern: PatternChoice;
  /** Payback inputs. People per shift doing this job by hand, monthly gross cost per person (TL). */
  people: number;
  wage: number;
  /** Investment (TL), entered by the visitor; 0 = not entered. */
  invest: number;
  mode: BuyMode;
  /** Monthly rent (TL) for the rental option; 0 = not entered. */
  rent: number;
};

export const DEFAULT_CONFIG: Config = {
  kind: "koli",
  u: 400,
  g: 300,
  y: 250,
  kg: 12,
  rate: 8,
  lines: 1,
  shifts: 2,
  pallet: "eur",
  pl: 1200,
  pw: 800,
  maxH: 1400,
  sheet: false,
  pattern: "oto",
  people: 1,
  wage: 0,
  invest: 0,
  mode: "satin",
  rent: 0,
};

/** Wooden pallet deck height (EUR and 1000×1200 block pallets). */
export const PALLET_DECK = 144;
/** Dynamic load limit we plan against (EUR pallet, conservative). */
export const PALLET_MAX_KG = 1000;
/** Slip sheet thickness when "ara karton" is on. */
export const SHEET_MM = 4;
/** Clearance between the robot axis and the inner edge of each pallet station (m). */
export const STATION_GAP_M = 0.34;
/** Above this payload the job leaves the cobot class. */
export const COBOT_LIMIT_KG = 30;

export const LIMITS = {
  u: [100, 1300],
  g: [100, 1300],
  y: [50, 800],
  kg: [0.5, 60],
  rate: [1, 40],
  maxH: [300, 2400],
  pl: [600, 1400],
  pw: [600, 1400],
  people: [0, 6],
  wage: [0, 2_000_000],
  invest: [0, 1_000_000_000],
  rent: [0, 50_000_000],
} as const;

export type ModelSpec = {
  id: ModelId;
  name: string;
  /** Rated payload incl. gripper (kg). */
  payload: number;
  /** Reach to the wrist centre (mm). */
  reach: number;
  /** Nominal pick-and-place cycles per minute at light load, mid height. */
  cycles: number;
  /** Highest total pallet height (deck + load) reachable from the fixed riser, and with the lift column (mm). */
  stackFixed: number;
  stackLift: number;
  repeatability: number;
  mass: number;
  ip: string;
  /** Kinematics for the 3D scene and the elevation drawing (metres). */
  link: { d1: number; a2: number; a3: number; wrist: number; r: number };
};

// Concept products. Values sit inside the range of real collaborative arms of
// the same class and are marked "örnek değer" wherever they are shown.
export const MODELS: ModelSpec[] = [
  {
    id: "p12",
    name: "P12",
    payload: 12,
    reach: 1300,
    cycles: 12,
    stackFixed: 1150,
    stackLift: 1900,
    repeatability: 0.05,
    mass: 34,
    ip: "IP54",
    link: { d1: 0.181, a2: 0.613, a3: 0.572, wrist: 0.2, r: 0.062 },
  },
  {
    id: "p20",
    name: "P20",
    payload: 20,
    reach: 1750,
    cycles: 11,
    stackFixed: 1500,
    stackLift: 2200,
    repeatability: 0.05,
    mass: 64,
    ip: "IP54",
    link: { d1: 0.236, a2: 0.862, a3: 0.728, wrist: 0.225, r: 0.078 },
  },
  {
    id: "p30",
    name: "P30",
    payload: 30,
    reach: 1300,
    cycles: 9.5,
    stackFixed: 1050,
    stackLift: 1850,
    repeatability: 0.1,
    mass: 63,
    ip: "IP54",
    link: { d1: 0.236, a2: 0.637, a3: 0.504, wrist: 0.215, r: 0.088 },
  },
];

export const modelById = (id: string | null | undefined) => MODELS.find((m) => m.id === id) ?? null;

/* ------------------------------------------------------------------ pallet */

export function palletSize(c: Pick<Config, "pallet" | "pl" | "pw">): { L: number; W: number } {
  if (c.pallet === "eur") return { L: 1200, W: 800 };
  if (c.pallet === "end") return { L: 1200, W: 1000 };
  return { L: c.pl, W: c.pw };
}

/* --------------------------------------------------------------- layer plan */

export type Slot = {
  /** Centre in pallet frame (mm). */
  x: number;
  z: number;
  /** Footprint along X and Z (mm). */
  dx: number;
  dz: number;
  /** true when the product is turned 90° (u along X). */
  turned: boolean;
};

export type LayerPlan = {
  pattern: PatternId;
  /** Odd layers (0, 2, …) and even layers (1, 3, …); same array when the pattern does not interlock. */
  layers: [Slot[], Slot[]];
  perLayer: number;
  /** Area use of the pallet deck, 0..1. */
  fill: number;
  /** Largest overhang past a pallet edge (mm), 0 when everything sits on the deck. */
  overhang: number;
};

type Rect = { x0: number; z0: number; nx: number; nz: number; dx: number; dz: number; turned: boolean };

function rectsToSlots(rects: Rect[], W: number, L: number): Slot[] {
  // centre the arrangement's bounding box on the pallet
  let maxX = 0;
  let maxZ = 0;
  for (const r of rects) {
    if (r.nx <= 0 || r.nz <= 0) continue;
    maxX = Math.max(maxX, r.x0 + r.nx * r.dx);
    maxZ = Math.max(maxZ, r.z0 + r.nz * r.dz);
  }
  const ox = -maxX / 2;
  const oz = -maxZ / 2;
  void W;
  void L;
  const out: Slot[] = [];
  for (const r of rects) {
    for (let i = 0; i < r.nx; i++)
      for (let j = 0; j < r.nz; j++)
        out.push({
          x: ox + r.x0 + (i + 0.5) * r.dx,
          z: oz + r.z0 + (j + 0.5) * r.dz,
          dx: r.dx,
          dz: r.dz,
          turned: r.turned,
        });
  }
  return out;
}

const mirrorX = (s: Slot[]): Slot[] => s.map((p) => ({ ...p, x: -p.x }));
const mirrorZ = (s: Slot[]): Slot[] => s.map((p) => ({ ...p, z: -p.z }));

/** All products in one direction, the straight grid ("sütun"). Layers do not interlock. */
function columnPattern(u: number, g: number, W: number, L: number): Rect[] | null {
  const a = { nx: Math.floor(W / g), nz: Math.floor(L / u) };
  const b = { nx: Math.floor(W / u), nz: Math.floor(L / g) };
  const na = a.nx * a.nz;
  const nb = b.nx * b.nz;
  if (na <= 0 && nb <= 0) return null;
  if (na >= nb) return [{ x0: 0, z0: 0, nx: a.nx, nz: a.nz, dx: g, dz: u, turned: false }];
  return [{ x0: 0, z0: 0, nx: b.nx, nz: b.nz, dx: u, dz: g, turned: true }];
}

/** Block + turned strip ("örgü"). Alternate layers are mirrored so the seams cross. */
function brickPattern(u: number, g: number, W: number, L: number): { rects: Rect[]; axis: "x" | "z" } | null {
  let best: { rects: Rect[]; axis: "x" | "z"; n: number; waste: number } | null = null;
  const consider = (rects: Rect[], axis: "x" | "z") => {
    const parts = rects.filter((r) => r.nx > 0 && r.nz > 0);
    if (parts.length < 2) return;
    const n = parts.reduce((s, r) => s + r.nx * r.nz, 0);
    const usedX = Math.max(...parts.map((r) => r.x0 + r.nx * r.dx));
    const usedZ = Math.max(...parts.map((r) => r.z0 + r.nz * r.dz));
    if (usedX > W + 0.5 || usedZ > L + 0.5) return;
    const waste = W * L - n * u * g;
    if (!best || n > best.n || (n === best.n && waste < best.waste)) best = { rects: parts, axis, n, waste };
  };
  // split along Z: [0, z1] orientation a, rest orientation b (and the reverse)
  for (let k = 1; k * u <= L; k++) {
    const z1 = k * u;
    consider(
      [
        { x0: 0, z0: 0, nx: Math.floor(W / g), nz: k, dx: g, dz: u, turned: false },
        { x0: 0, z0: z1, nx: Math.floor(W / u), nz: Math.floor((L - z1) / g), dx: u, dz: g, turned: true },
      ],
      "z",
    );
  }
  for (let k = 1; k * g <= L; k++) {
    const z1 = k * g;
    consider(
      [
        { x0: 0, z0: 0, nx: Math.floor(W / u), nz: k, dx: u, dz: g, turned: true },
        { x0: 0, z0: z1, nx: Math.floor(W / g), nz: Math.floor((L - z1) / u), dx: g, dz: u, turned: false },
      ],
      "z",
    );
  }
  // split along X
  for (let k = 1; k * g <= W; k++) {
    const x1 = k * g;
    consider(
      [
        { x0: 0, z0: 0, nx: k, nz: Math.floor(L / u), dx: g, dz: u, turned: false },
        { x0: x1, z0: 0, nx: Math.floor((W - x1) / u), nz: Math.floor(L / g), dx: u, dz: g, turned: true },
      ],
      "x",
    );
  }
  for (let k = 1; k * u <= W; k++) {
    const x1 = k * u;
    consider(
      [
        { x0: 0, z0: 0, nx: k, nz: Math.floor(L / g), dx: u, dz: g, turned: true },
        { x0: x1, z0: 0, nx: Math.floor((W - x1) / g), nz: Math.floor(L / u), dx: g, dz: u, turned: false },
      ],
      "x",
    );
  }
  if (!best) return null;
  const b = best as { rects: Rect[]; axis: "x" | "z" };
  return { rects: b.rects, axis: b.axis };
}

/** Four blocks turned around the centre ("fırıldak"). Alternate layers are mirrored. */
function pinwheelPattern(u: number, g: number, W: number, L: number): Rect[] | null {
  let best: { rects: Rect[]; n: number; hole: number } | null = null;
  const maxI = Math.floor(W / g);
  const maxJ = Math.floor(L / u);
  const maxK = Math.floor(W / u);
  const maxL = Math.floor(L / g);
  for (let i = 1; i <= maxI; i++)
    for (let j = 1; j <= maxJ; j++)
      for (let k = 1; k <= maxK; k++)
        for (let l = 1; l <= maxL; l++) {
          const w1 = i * g;
          const h1 = j * u;
          const w2 = k * u;
          const h2 = l * g;
          if (w1 + w2 > W || h1 + h2 > L) continue;
          // the diagonal blocks must not overlap
          if ((w1 - w2) * (h1 - h2) > 0) continue;
          const n = 2 * (i * j + k * l);
          const Wb = w1 + w2;
          const Lb = h1 + h2;
          const hole = Wb * Lb - n * u * g;
          if (!best || n > best.n || (n === best.n && hole < best.hole)) {
            best = {
              n,
              hole,
              rects: [
                { x0: 0, z0: 0, nx: i, nz: j, dx: g, dz: u, turned: false }, // bottom-left
                { x0: Wb - w2, z0: 0, nx: k, nz: l, dx: u, dz: g, turned: true }, // bottom-right
                { x0: Wb - w1, z0: Lb - h1, nx: i, nz: j, dx: g, dz: u, turned: false }, // top-right
                { x0: 0, z0: Lb - h2, nx: k, nz: l, dx: u, dz: g, turned: true }, // top-left
              ],
            };
          }
        }
  return best ? (best as { rects: Rect[] }).rects : null;
}

export type PatternOption = { id: PatternId; perLayer: number; available: boolean };

/** Every pattern for this product and pallet, with per-layer counts (0 / unavailable when it does not fit). */
export function patternOptions(c: Config): PatternOption[] {
  const { L, W } = palletSize(c);
  const col = columnPattern(c.u, c.g, W, L);
  const brick = brickPattern(c.u, c.g, W, L);
  const pin = pinwheelPattern(c.u, c.g, W, L);
  const count = (r: Rect[] | null) => (r ? r.reduce((s, x) => s + Math.max(0, x.nx) * Math.max(0, x.nz), 0) : 0);
  return [
    { id: "sutun", perLayer: count(col), available: !!col && count(col) > 0 },
    { id: "orgu", perLayer: count(brick?.rects ?? null), available: !!brick },
    { id: "firildak", perLayer: count(pin), available: !!pin },
  ];
}

/** Automatic choice: most products per layer; on a tie prefer the interlocking patterns. */
export function autoPattern(c: Config): PatternId {
  const opts = patternOptions(c).filter((o) => o.available);
  if (!opts.length) return "sutun";
  const rank: Record<PatternId, number> = { orgu: 3, firildak: 2, sutun: 1 };
  opts.sort((a, b) => b.perLayer - a.perLayer || rank[b.id] - rank[a.id]);
  return opts[0].id;
}

export function planLayer(c: Config): LayerPlan {
  const { L, W } = palletSize(c);
  const { u, g } = c;
  let pattern: PatternId = c.pattern === "oto" ? autoPattern(c) : c.pattern;
  const opts = patternOptions(c);
  if (!opts.find((o) => o.id === pattern)?.available) pattern = autoPattern(c);

  let layers: [Slot[], Slot[]] | null = null;
  if (pattern === "orgu") {
    const b = brickPattern(u, g, W, L);
    if (b) {
      const s = rectsToSlots(b.rects, W, L);
      layers = [s, b.axis === "z" ? mirrorZ(s) : mirrorX(s)];
    }
  } else if (pattern === "firildak") {
    const r = pinwheelPattern(u, g, W, L);
    if (r) {
      const s = rectsToSlots(r, W, L);
      layers = [s, mirrorX(s)];
    }
  }
  if (!layers) {
    const r = columnPattern(u, g, W, L);
    if (r) {
      pattern = "sutun";
      const s = rectsToSlots(r, W, L);
      layers = [s, s];
    }
  }

  let overhang = 0;
  if (!layers || layers[0].length === 0) {
    // Nothing fits on the deck: allow up to 60 mm past each edge, report it.
    const r = columnPattern(u, g, W + 120, L + 120);
    pattern = "sutun";
    const s = r ? rectsToSlots(r, W, L) : [];
    layers = [s, s];
    for (const p of s) {
      overhang = Math.max(overhang, Math.abs(p.x) + p.dx / 2 - W / 2, Math.abs(p.z) + p.dz / 2 - L / 2);
    }
    overhang = Math.max(0, Math.round(overhang));
  }
  const perLayer = layers[0].length;
  return { pattern, layers, perLayer, fill: Math.min(1, (perLayer * u * g) / (W * L)), overhang };
}

/* -------------------------------------------------------------------- stack */

export type Stack = {
  layerH: number;
  layers: number;
  total: number;
  /** Deck + load (mm). */
  height: number;
  loadKg: number;
  /** The layer count was cut to stay under PALLET_MAX_KG. */
  weightLimited: boolean;
};

export function stackOf(c: Config, plan: LayerPlan): Stack {
  const layerH = c.y + (c.sheet ? SHEET_MM : 0);
  const byHeight = Math.max(0, Math.floor(c.maxH / layerH));
  const perLayerKg = plan.perLayer * c.kg;
  const byWeight = perLayerKg > 0 ? Math.floor(PALLET_MAX_KG / perLayerKg) : byHeight;
  const layers = Math.max(plan.perLayer > 0 ? 1 : 0, Math.min(byHeight, byWeight));
  const total = layers * plan.perLayer;
  return {
    layerH,
    layers,
    total,
    height: PALLET_DECK + layers * layerH,
    loadKg: total * c.kg,
    weightLimited: byWeight < byHeight,
  };
}

/* ---------------------------------------------------------------- model fit */

export type Warning =
  | "over-cobot"
  | "overhang"
  | "weight-limited"
  | "needs-lift"
  | "needs-double"
  | "too-slow"
  | "two-cells"
  | "no-reach"
  | "bag-claw"
  | "column-unstable"
  | GripWarning;

export type Fit = {
  status: "ok" | "custom";
  model: ModelSpec | null;
  gripper: GripperId;
  /** The sized tool (lib/pazi/gripper.ts): plate or claw, pads or fingers, mass, class warning. */
  grip: GripperSpec;
  double: boolean;
  lift: boolean;
  /** Products per minute the cell can do with this setup. */
  capacity: number;
  /** Products per minute the line asks for. */
  required: number;
  /** Seconds per pick-and-place cycle at the robot's own pace. */
  cycleSec: number;
  /** Reach needed to the farthest slot centre (mm). */
  reachNeeded: number;
  /** Cell footprint (m) and area (m²), two stations + robot + conveyor end. */
  cell: { w: number; d: number; area: number };
  warnings: Warning[];
  plan: LayerPlan;
  stack: Stack;
};

/** Cycles per minute for a model at a given lifted mass (kg incl. gripper). Heavier and taller is slower. */
export function cyclesFor(m: ModelSpec, liftedKg: number, lift: boolean, kind: ProductKind) {
  const load = Math.min(1, liftedKg / m.payload);
  let c = m.cycles * (1 - 0.25 * load * load);
  if (lift) c *= 0.95;
  if (kind === "torba") c *= 0.85;
  return c;
}

export function reachNeeded(c: Config, plan: LayerPlan) {
  const { W } = palletSize(c);
  let r = 0;
  for (const s of plan.layers[0]) {
    const x = STATION_GAP_M * 1000 + W / 2 + s.x;
    r = Math.max(r, Math.hypot(x, s.z), Math.hypot(STATION_GAP_M * 1000 + W / 2 - s.x, s.z));
  }
  return Math.round(r);
}

export function fit(c: Config, lock?: ModelId | null): Fit {
  const plan = planLayer(c);
  const stack = stackOf(c, plan);
  const required = c.rate * c.lines;
  const { L, W } = palletSize(c);
  const warnings: Warning[] = [];
  const bag = c.kind === "torba";
  if (bag) warnings.push("bag-claw");
  if (plan.overhang > 0) warnings.push("overhang");
  if (stack.weightLimited) warnings.push("weight-limited");
  if (plan.pattern === "sutun" && stack.layers > 4 && !c.sheet) warnings.push("column-unstable");

  const reach = reachNeeded(c, plan);
  const cellW = 2 * (STATION_GAP_M + W / 1000) + 0.6;
  const cellD = L / 1000 + 1.0;
  const cell = { w: round1(cellW), d: round1(cellD), area: round1(cellW * cellD) };

  // the tool, sized for one product and (vacuum only) for two side by side
  const one = sizeGripper(c);
  const two = bag ? null : sizeGripper({ ...c, double: true });
  const base = { plan, stack, required, reachNeeded: reach, cell };
  const tool = (double: boolean) => {
    const g = double && two ? two : one;
    return { gripper: g.id, grip: g, double };
  };
  // a product outside the standard tool class is a special project, whatever the arm can do
  const finish = (r: Fit): Fit => {
    const gw = r.grip.warning;
    if (!gw) return r;
    const rest = r.warnings.filter((w) => w !== gw);
    // the cobot limit stays the headline when it applies; the tool comes next
    const at = rest[0] === "over-cobot" ? 1 : 0;
    return { ...r, status: "custom", warnings: [...rest.slice(0, at), gw, ...rest.slice(at)] };
  };

  if (c.kg > COBOT_LIMIT_KG) {
    return finish({ ...base, ...tool(false), status: "custom", model: null, lift: false, capacity: 0, cycleSec: 0, warnings: ["over-cobot", ...warnings] });
  }

  const candidates = lock ? MODELS.filter((m) => m.id === lock) : MODELS;
  let fallback: Fit | null = null;
  const single = c.kg + one.mass;
  const pair = two ? 2 * c.kg + two.mass : Infinity;

  for (const m of candidates) {
    const w: Warning[] = [...warnings];
    if (single > m.payload) continue;
    if (stack.height > m.stackLift) continue;
    if (reach > m.reach - 40) {
      if (!fallback) fallback = { ...base, ...tool(false), status: "custom", model: m, lift: false, capacity: 0, cycleSec: 0, warnings: ["no-reach", ...w] };
      continue;
    }
    const lift = stack.height > m.stackFixed;
    if (lift) w.push("needs-lift");
    const cs = cyclesFor(m, single, lift, c.kind);
    if (cs >= required) {
      return finish({ ...base, ...tool(false), status: "ok", model: m, lift, capacity: round1(cs), cycleSec: round1(60 / cs), warnings: w });
    }
    const canDouble = !!two && !two.warning && !one.warning && pair <= m.payload && 2 * Math.max(c.u, c.g) <= 820;
    if (canDouble) {
      const cd = cyclesFor(m, pair, lift, c.kind);
      if (cd * 2 * 0.95 >= required) {
        return finish({ ...base, ...tool(true), status: "ok", model: m, lift, capacity: round1(cd * 2 * 0.95), cycleSec: round1(60 / cd), warnings: [...w, "needs-double"] });
      }
    }
    // remember the fastest setup of this model for the "too slow" answer
    const best = canDouble ? Math.max(cs, cyclesFor(m, pair, lift, c.kind) * 2 * 0.95) : cs;
    const usesDouble = canDouble && best !== cs;
    const cand: Fit = {
      ...base,
      ...tool(usesDouble),
      status: "custom",
      model: m,
      lift,
      capacity: round1(best),
      cycleSec: round1(60 / (usesDouble ? cyclesFor(m, pair, lift, c.kind) : cs)),
      warnings: [...w, best * 2 >= required ? "two-cells" : "too-slow"],
    };
    if (!fallback || fallback.capacity < cand.capacity) fallback = cand;
  }
  if (fallback) return finish(fallback);
  return finish({ ...base, ...tool(false), status: "custom", model: null, lift: false, capacity: 0, cycleSec: 0, warnings: [...warnings, stack.height > 2200 ? "needs-lift" : "over-cobot"] });
}

/* ------------------------------------------------------------------ payback */

/** Share of the manual labour the cell actually removes (someone still feeds pallets and watches). */
export const LABOUR_SHARE = 0.85;
/** Yearly service, spare parts and energy as a share of the investment. */
export const UPKEEP_YEARLY = 0.04;
/** Spread shown around every estimate. */
export const SPREAD = 0.15;

export type Payback = {
  monthlyLabour: number;
  /** Monthly labour saving, low/high. */
  saving: [number, number];
  upkeep: number;
  /** Months to pay back, low/high; null when not computable or never. */
  months: [number, number] | null;
  never: boolean;
  /** Rental: monthly saving minus rent, low/high. */
  rentGap: [number, number] | null;
  /** Investment that would pay back within `horizon` months, low/high. */
  ceiling: [number, number];
};

export function payback(c: Config, horizon = 18): Payback {
  const monthlyLabour = c.people * c.shifts * c.wage;
  const mid = monthlyLabour * LABOUR_SHARE;
  const saving: [number, number] = [mid * (1 - SPREAD), mid * (1 + SPREAD)];
  const upkeep = (c.invest * UPKEEP_YEARLY) / 12;
  let months: [number, number] | null = null;
  let never = false;
  if (c.mode === "satin" && c.invest > 0 && mid > 0) {
    const netLo = saving[0] - upkeep;
    const netHi = saving[1] - upkeep;
    if (netHi <= 0) never = true;
    else {
      const a = c.invest / netHi;
      const b = netLo > 0 ? c.invest / netLo : Infinity;
      months = [Math.max(1, Math.round(a)), Number.isFinite(b) ? Math.round(b) : 999];
      // beyond ten years it is not a payback worth showing as a number
      if (months[0] > 120) {
        months = null;
        never = true;
      }
    }
  } else if (c.mode === "satin" && c.invest > 0 && mid <= 0) never = true;
  let rentGap: [number, number] | null = null;
  if (c.mode === "kira" && c.rent > 0) {
    rentGap = [saving[0] - c.rent, saving[1] - c.rent];
    if (rentGap[1] <= 0) never = true;
  }
  // inv / (s - inv*k) = H  →  inv = H*s / (1 + H*k)
  const k = UPKEEP_YEARLY / 12;
  const ceiling: [number, number] = [(horizon * saving[0]) / (1 + horizon * k), (horizon * saving[1]) / (1 + horizon * k)];
  return { monthlyLabour, saving, upkeep, months, never, rentGap, ceiling };
}

/* --------------------------------------------------------------- validation */

export type FieldError = "range" | "pallet" | "empty";

export function validate(c: Config): Partial<Record<keyof Config, FieldError>> {
  const e: Partial<Record<keyof Config, FieldError>> = {};
  const { L, W } = palletSize(c);
  const inRange = (k: keyof typeof LIMITS) => {
    const v = c[k] as number;
    const [lo, hi] = LIMITS[k];
    if (!Number.isFinite(v)) e[k] = "empty";
    else if (v < lo || v > hi) e[k] = "range";
  };
  (["u", "g", "y", "kg", "rate", "maxH"] as const).forEach(inRange);
  if (c.pallet === "ozel") (["pl", "pw"] as const).forEach(inRange);
  const longSide = Math.max(L, W) + 120;
  const shortSide = Math.min(L, W) + 120;
  const pmax = Math.max(c.u, c.g);
  const pmin = Math.min(c.u, c.g);
  if (!e.u && !e.g && (pmax > longSide || pmin > shortSide)) {
    if (c.u >= c.g) e.u = "pallet";
    else e.g = "pallet";
  }
  if (!e.y && !e.maxH && c.y > c.maxH) e.y = "range";
  return e;
}

/** Clamp a config into its limits (used for URL input and the 3D scene). */
export function sanitize(c: Config): Config {
  const out = { ...c };
  for (const k of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    const [lo, hi] = LIMITS[k];
    const v = Number(out[k]);
    (out[k] as number) = Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : (DEFAULT_CONFIG[k] as number);
  }
  return out;
}

const round1 = (v: number) => Math.round(v * 10) / 10;

/* --------------------------------------------------------- safety geometry */

/** Scanner field radii around the robot axis for drawings (m). Concept values, not an ISO 13855 calculation. */
export function zones(m: ModelSpec | null) {
  const reach = (m?.reach ?? 1300) / 1000;
  return { stop: round1(reach + 0.35), slow: round1(reach + 1.25) };
}
