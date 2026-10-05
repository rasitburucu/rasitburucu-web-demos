// The site plan of Sazbahçe in plan units (10 units = 1 m; north up, the lake
// to the west) and the seating layouts drawn on it. Pure functions: the React
// plan reads geometry from here and renders what `layout()` returns.

import { VENUE, type AreaKey, type Ceremony, type Setup } from "./venue";

export type Rect = { x: number; y: number; w: number; h: number };
export type Tree = { x: number; y: number; r: number; kind: "willow" | "walnut" | "tree" };

/** Full drawing; the map paper extends well beyond it on every side. */
export const SITE = { x: 40, y: 0, w: 960, h: 640 };

/** x of the shoreline at a given y (the lake is west of it). */
export const shoreX = (y: number) => 360 + 28 * Math.sin(y / 95) + 16 * Math.sin(y / 37 + 1.3);

export const PIER = { x0: 120, y: 300, half: 9 };
export const PLATFORM: Rect = { x: 62, y: 264, w: 62, h: 72 };
export const BARN: Rect = { x: 790, y: 180, w: 150, h: 250 };
export const BARN_DOOR = { y0: 288, y1: 324 };
export const YARD: Rect = { x: 790, y: 462, w: 156, h: 156 };
export const YARD_GATE = { y0: 522, y1: 558 };
export const WALNUT: Tree = { x: 868, y: 540, r: 44, kind: "walnut" };

export const TREES: Tree[] = [
  { x: shoreX(110) + 42, y: 110, r: 50, kind: "willow" },
  { x: shoreX(440) + 40, y: 440, r: 46, kind: "willow" },
  { x: shoreX(600) + 44, y: 600, r: 40, kind: "willow" },
  { x: 560, y: 150, r: 34, kind: "willow" },
  { x: shoreX(-40) + 30, y: -40, r: 44, kind: "willow" },
  { x: shoreX(760) + 40, y: 760, r: 46, kind: "willow" },
  WALNUT,
  { x: 700, y: 606, r: 24, kind: "tree" },
  { x: 985, y: 112, r: 40, kind: "tree" },
  { x: 1050, y: 300, r: 46, kind: "tree" },
  { x: 1070, y: 520, r: 38, kind: "tree" },
  { x: 650, y: 46, r: 30, kind: "tree" },
  { x: 750, y: 92, r: 22, kind: "tree" },
  { x: 880, y: 70, r: 34, kind: "tree" },
  { x: 600, y: 700, r: 36, kind: "tree" },
  { x: 900, y: 720, r: 40, kind: "tree" },
];

/** Gravel paths: entrance (south-east) -> barn and yard, and along the meadow's south edge. */
export const PATHS = [
  "M1060 650 C980 640 900 636 830 622 C796 614 778 600 777 570 L777 214 C777 196 772 186 760 176",
  "M820 618 C720 594 580 586 440 582 C410 581 392 576 380 568",
];
/** Lanterns along the paths (evening). */
export const LANTERNS: [number, number][] = [
  [1000, 641], [930, 634], [862, 627], [777, 540], [777, 470], [777, 400], [777, 330], [777, 260], [777, 200],
  [740, 593], [660, 588], [580, 585], [500, 583], [420, 580],
];

/** Hit and highlight shapes of the four areas. */
export function meadowPath(): string {
  const pts: string[] = [];
  for (let y = 160; y <= 566; y += 12) pts.push(`${(shoreX(y) + 10).toFixed(1)} ${y}`);
  return `M${pts.join(" L")} L766 566 L766 160 Z`;
}

/** Framing of each area: centre and span (plan units) for wide and narrow viewports. */
export const FRAMES: Record<AreaKey | "site" | "nikah", { wide: [number, number, number, number]; narrow: [number, number, number, number] }> = {
  nikah: { wide: [470, 300, 560, 330], narrow: [470, 300, 380, 380] },
  site: { wide: [520, 320, 1000, 680], narrow: [560, 340, 560, 560] },
  cayir: { wide: [520, 320, 1000, 680], narrow: [528, 345, 480, 480] },
  iskele: { wide: [470, 320, 880, 600], narrow: [270, 300, 400, 400] },
  ambar: { wide: [835, 315, 440, 340], narrow: [860, 305, 320, 320] },
  avlu: { wide: [850, 525, 420, 330], narrow: [866, 540, 280, 280] },
};

// ---------------------------------------------------------------- layouts

export type Item =
  | { k: "round"; x: number; y: number; r: number; seats: number }
  | { k: "long"; x: number; y: number; w: number; h: number; seats: number }
  | { k: "chair"; x: number; y: number }
  | { k: "desk"; x: number; y: number; w: number; h: number; seats: number; side: "s" | "e" | "w" }
  | { k: "high"; x: number; y: number };

export type Layout = {
  items: Item[];
  /** Seats placed (or standing places for a cocktail). */
  seats: number;
  /** Seats the area could take in this layout (for "room left"). */
  fit: number;
  pist?: Rect & { label: "pist" | "sahne" };
  altar?: Rect;
  aisle?: Rect;
  screen?: { x1: number; y1: number; x2: number; y2: number };
};

const dist = (ax: number, ay: number, bx: number, by: number) => Math.hypot(ax - bx, ay - by);
const nearTree = (x: number, y: number, pad: number) => TREES.some((t) => dist(x, y, t.x, t.y) < t.r * 0.82 + pad);
const inRect = (x: number, y: number, r: Rect, pad = 0) => x > r.x - pad && x < r.x + r.w + pad && y > r.y - pad && y < r.y + r.h + pad;

const inMeadow = (x: number, y: number, pad: number) => x > shoreX(y) + 18 + pad && x < 762 - pad && y > 172 + pad && y < 562 - pad;

const BARN_IN: Rect = { x: BARN.x + 8, y: BARN.y + 12, w: BARN.w - 16, h: BARN.h - 20 };
const YARD_IN: Rect = { x: YARD.x + 8, y: YARD.y + 8, w: YARD.w - 16, h: YARD.h - 16 };

/** Space for a ceremony layout: weddings, henna nights, engagements and the corporate planner. */
export type LayoutInput = { area: AreaKey; ceremony: Ceremony; guests: number; setup?: Setup };

export function setupFor(ceremony: Ceremony, setup?: Setup): Setup {
  if (setup) return setup;
  if (ceremony === "nikah") return "tiyatro";
  if (ceremony === "kurumsal") return "uzun";
  return "yuvarlak";
}

export function layout({ area, ceremony, guests, setup }: LayoutInput): Layout {
  const s = setupFor(ceremony, setup);
  const where: AreaKey = area === "iskele" && ceremony !== "nikah" ? "cayir" : area;
  switch (s) {
    case "tiyatro":
      return ceremony === "nikah" ? ceremonyRows(where, guests) : theatre(where, guests);
    case "uzun":
      return longTables(where, guests);
    case "sinif":
      return classroom(where, guests);
    case "u":
      return uShape(where, guests);
    case "kokteyl":
      return cocktail(where, guests);
    default:
      return roundTables(where, guests, ceremony);
  }
}

// Round tables of ten around a dance floor (weddings, henna, engagement, gala).
function roundTables(area: AreaKey, guests: number, ceremony: Ceremony): Layout {
  const need = Math.ceil(guests / 10);
  if (area === "cayir" || area === "iskele") {
    const r = 11;
    const small = ceremony === "nisan";
    const pist = { x: shoreX(330) + 26, y: 262, w: small ? 80 : ceremony === "kina" ? 96 : 112, h: small ? 56 : ceremony === "kina" ? 66 : 76, label: (ceremony === "kurumsal" ? "sahne" : "pist") as "pist" | "sahne" };
    const c = [pist.x + pist.w / 2, pist.y + pist.h / 2];
    const pts: [number, number, number, number][] = [];
    for (let R = pist.w / 2 + 46; R < 460; R += 40) {
      const step = 42 / R;
      for (let a = 0; a <= Math.PI / 2 + 0.35; a += step) {
        for (const sg of a ? [1, -1] : [1]) {
          const x = c[0] + Math.cos(a * sg) * R;
          const y = c[1] + Math.sin(a * sg) * R * 0.94;
          if (!inMeadow(x, y, r + 2) || nearTree(x, y, r + 4) || inRect(x, y, pist, r + 8)) continue;
          if (pts.some(([px, py]) => dist(px, py, x, y) < 2 * r + 12)) continue;
          pts.push([x, y, R, a]);
        }
      }
    }
    pts.sort((p, q) => p[2] - q[2] || p[3] - q[3]);
    const used = pts.slice(0, need);
    return { items: used.map(([x, y]) => ({ k: "round", x, y, r, seats: 10 })), seats: used.length * 10, fit: pts.length * 10, pist };
  }
  if (area === "ambar") {
    const r = 10;
    const pist = { x: 832, y: 222, w: 66, h: 50, label: (ceremony === "kurumsal" ? "sahne" : "pist") as "pist" | "sahne" };
    const pts: [number, number][] = [];
    for (let y = 214; y <= 414; y += 32) for (const x of [814, 848, 882, 916]) if (!inRect(x, y, pist, r + 5)) pts.push([x, y]);
    const c = [pist.x + pist.w / 2, pist.y + pist.h / 2];
    pts.sort((p, q) => dist(p[0], p[1] * 1.4, c[0], c[1] * 1.4) - dist(q[0], q[1] * 1.4, c[0], c[1] * 1.4));
    const used = pts.slice(0, need);
    return { items: used.map(([x, y]) => ({ k: "round", x, y, r, seats: 10 })), seats: used.length * 10, fit: pts.length * 10, pist };
  }
  // Yard: tables round the walnut; the tree is the centre of the evening.
  const r = 8.5;
  const pts: [number, number][] = [];
  for (let y = 484; y <= 600; y += 29) for (let x = 812; x <= 930; x += 29.5) if (dist(x, y, WALNUT.x, WALNUT.y) > WALNUT.r + 6) pts.push([x, y]);
  pts.sort((p, q) => dist(p[0], p[1], WALNUT.x, WALNUT.y) - dist(q[0], q[1], WALNUT.x, WALNUT.y));
  const used = pts.slice(0, need);
  return { items: used.map(([x, y]) => ({ k: "round", x, y, r, seats: 10 })), seats: used.length * 10, fit: pts.length * 10 };
}

// Wedding ceremony (nikâh): rows of chairs facing the altar.
function ceremonyRows(area: AreaKey, guests: number): Layout {
  const chairs: [number, number][] = [];
  if (area === "cayir" || area === "iskele") {
    const onPier = area === "iskele";
    const altar = onPier ? { x: 70, y: 286, w: 30, h: 28 } : { x: shoreX(300) + 6, y: 284, w: 22, h: 32 };
    const x0 = onPier ? shoreX(300) + 22 : shoreX(300) + 54;
    for (let x = x0; x < 760; x += 12) {
      for (const [a, b] of [[226, 290], [310, 374]]) {
        for (let y = a; y <= b; y += 8) {
          if (x < shoreX(y) + 20 || nearTree(x, y, 3)) continue;
          chairs.push([x, y]);
        }
      }
    }
    const cap = onPier ? VENUE.iskele.cap : VENUE.cayir.setups.tiyatro ?? 400;
    const fit = Math.min(chairs.length, cap);
    const used = chairs.slice(0, Math.min(guests, fit));
    const back = used.reduce((m, [x]) => Math.max(m, x), x0) + 8;
    const aisle = { x: onPier ? PIER.x0 : altar.x + altar.w, y: 293, w: back - (onPier ? PIER.x0 : altar.x + altar.w), h: 14 };
    return { items: used.map(([x, y]) => ({ k: "chair", x, y })), seats: used.length, fit, altar, aisle };
  }
  if (area === "ambar") {
    const altar = { x: 850, y: 198, w: 30, h: 14 };
    for (let y = 228; y <= 418; y += 9) for (const [a, b] of [[804, 856], [874, 926]]) for (let x = a; x <= b; x += 6.5) chairs.push([x, y]);
    chairs.sort((p, q) => p[1] - q[1] || Math.abs(p[0] - 865) - Math.abs(q[0] - 865));
    const used = chairs.slice(0, guests);
    return { items: used.map(([x, y]) => ({ k: "chair", x, y })), seats: used.length, fit: chairs.length, altar };
  }
  // Yard: arcs facing the walnut, altar under its north side.
  const altar = { x: WALNUT.x - 15, y: 478, w: 30, h: 14 };
  const c = [WALNUT.x, 485];
  for (let R = 70; R < 140; R += 9) {
    const step = 7 / R;
    for (let a = 0.18 * Math.PI; a <= 0.82 * Math.PI; a += step) {
      const x = c[0] + Math.cos(a) * R;
      const y = c[1] + Math.sin(a) * R;
      if (inRect(x, y, YARD_IN, -2)) chairs.push([x, y]);
    }
  }
  const used = chairs.slice(0, guests);
  return { items: used.map(([x, y]) => ({ k: "chair", x, y })), seats: used.length, fit: chairs.length, altar };
}

// Region of an area as a list of candidate rows for the corporate layouts.
function region(area: AreaKey): { r: Rect; ok: (x: number, y: number, pad: number) => boolean; screen: Layout["screen"] } {
  if (area === "ambar") return { r: { ...BARN_IN, y: BARN_IN.y + 20, h: BARN_IN.h - 20 }, ok: (x, y, p) => inRect(x, y, BARN_IN, -p), screen: { x1: 830, y1: 194, x2: 900, y2: 194 } };
  // In the yard the walnut's crown is overhead: only its trunk takes floor space.
  if (area === "avlu") return { r: YARD_IN, ok: (x, y, p) => inRect(x, y, YARD_IN, -p) && dist(x, y, WALNUT.x, WALNUT.y) > 10 + p, screen: undefined };
  return { r: { x: 420, y: 196, w: 340, h: 360 }, ok: (x, y, p) => inMeadow(x, y, p) && !nearTree(x, y, p), screen: { x1: 520, y1: 182, x2: 640, y2: 182 } };
}

function theatre(area: AreaKey, guests: number): Layout {
  const { r, ok, screen } = region(area);
  const mid = r.x + r.w / 2;
  const chairs: [number, number][] = [];
  for (let y = r.y + 10; y <= r.y + r.h; y += 9) for (let x = r.x + 4; x <= r.x + r.w - 4; x += 6.5) if (Math.abs(x - mid) > 7 && ok(x, y, 3)) chairs.push([x, y]);
  chairs.sort((p, q) => p[1] - q[1] || Math.abs(p[0] - mid) - Math.abs(q[0] - mid));
  const cap = VENUE[area].setups.tiyatro ?? chairs.length;
  const fit = Math.min(cap, chairs.length);
  const used = chairs.slice(0, Math.min(guests, fit));
  return { items: used.map(([x, y]) => ({ k: "chair", x, y })), seats: used.length, fit, screen };
}

function longTables(area: AreaKey, guests: number): Layout {
  const { r, ok, screen } = region(area);
  const items: Item[] = [];
  if (area === "ambar") {
    // Barn: tables along its length, fourteen to a table.
    for (const x of [814, 846, 878, 910]) for (let y = r.y - 6; y + 60 <= r.y + r.h + 4; y += 70) items.push({ k: "long", x: x - 5, y, w: 10, h: 60, seats: 14 });
  } else {
    for (let y = r.y + 10; y <= r.y + r.h - 8; y += 30) {
      for (let x = r.x + 10; x + 52 <= r.x + r.w; x += 64) {
        if (ok(x, y, 8) && ok(x + 52, y, 8) && ok(x + 26, y, 8)) items.push({ k: "long", x, y: y - 5, w: 52, h: 10, seats: 12 });
      }
    }
  }
  const cap = VENUE[area].setups.uzun ?? 0;
  let seats = 0;
  const used: Item[] = [];
  for (const it of items) {
    if (seats >= guests || seats >= cap) break;
    used.push(it);
    seats += (it as { seats: number }).seats;
  }
  const fit = Math.min(cap, items.reduce((s, it) => s + (it as { seats: number }).seats, 0));
  return { items: used, seats: Math.min(seats, Math.max(guests, 0)), fit, screen };
}

function classroom(area: AreaKey, guests: number): Layout {
  const { r, ok, screen } = region(area);
  const items: Item[] = [];
  for (let y = r.y + 10; y <= r.y + r.h - 6; y += 17) {
    for (let x = r.x + 2; x + 18 <= r.x + r.w; x += 22) {
      const mid = r.x + r.w / 2;
      if (Math.abs(x + 9 - mid) < 11) continue;
      if (ok(x, y, 2) && ok(x + 18, y + 9, 2)) items.push({ k: "desk", x, y, w: 18, h: 5, seats: 3, side: "s" });
    }
  }
  const cap = VENUE[area].setups.sinif ?? 0;
  const used: Item[] = [];
  let seats = 0;
  for (const it of items) {
    if (seats >= guests || seats >= cap) break;
    used.push(it);
    seats += 3;
  }
  return { items: used, seats: Math.min(seats, cap), fit: Math.min(cap, items.length * 3), screen };
}

function uShape(area: AreaKey, guests: number): Layout {
  const { r, screen } = region(area);
  const items: Item[] = [];
  const left = r.x + 14;
  const right = r.x + r.w - 24;
  const top = r.y + 30;
  const bottom = Math.min(r.y + r.h - 10, top + (area === "avlu" ? 90 : 160));
  // Two legs (seats on the outer side) and the base; the open end faces the screen.
  for (let y = top; y + 28 <= bottom; y += 30) {
    items.push({ k: "desk", x: left, y, w: 8, h: 28, seats: 4, side: "w" });
    items.push({ k: "desk", x: right, y, w: 8, h: 28, seats: 4, side: "e" });
  }
  for (let x = left; x + 28 <= right + 8; x += 30) items.push({ k: "desk", x, y: bottom, w: 28, h: 8, seats: 4, side: "s" });
  const cap = VENUE[area].setups.u ?? 0;
  const used: Item[] = [];
  let seats = 0;
  for (const it of items) {
    if (seats >= guests || seats >= cap) break;
    used.push(it);
    seats += 4;
  }
  return { items: used, seats, fit: Math.min(cap, items.length * 4), screen };
}

function cocktail(area: AreaKey, guests: number): Layout {
  const { r, ok } = region(area);
  const pts: [number, number][] = [];
  let row = 0;
  for (let y = r.y + 8; y <= r.y + r.h - 6; y += 24, row++) for (let x = r.x + 8 + (row % 2) * 13; x <= r.x + r.w - 6; x += 26) if (ok(x, y, 4)) pts.push([x, y]);
  const need = Math.ceil(guests / 10);
  const cap = VENUE[area].setups.kokteyl ?? 0;
  const used = pts.slice(0, Math.min(need, Math.ceil(cap / 10)));
  return { items: used.map(([x, y]) => ({ k: "high", x, y })), seats: Math.min(guests, used.length * 10), fit: Math.min(cap, pts.length * 10) };
}

/** Seated capacity of an area for a ceremony and setup (the number the planner checks). */
export function capacity(area: AreaKey, ceremony: Ceremony, setup?: Setup): number {
  const s = setupFor(ceremony, setup);
  if (area === "iskele") return ceremony === "nikah" ? VENUE.iskele.cap : 0;
  if (ceremony === "nikah") return VENUE[area].setups.tiyatro ?? VENUE[area].cap;
  return VENUE[area].setups[s] ?? 0;
}
