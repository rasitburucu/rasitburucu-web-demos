// Pure geometry for the Stone Plan: footprints, pre-drawn shadow layers,
// sun path. Everything here is deterministic and computed at build time
// (server) or once on the client; nothing runs per frame.
import { typologies, villas, type Villa } from "@/content/onikitas/villas";

export type Pt = [number, number];

export const PLAN_W = 1000;
export const PLAN_H = 700;

const rad = (d: number) => (d * Math.PI) / 180;

function rotate([x, y]: Pt, deg: number): Pt {
  const a = rad(deg);
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
}

function rect(cx: number, cy: number, w: number, d: number, rot: number, ox = 0, oy = 0): Pt[] {
  const hw = w / 2;
  const hd = d / 2;
  const local: Pt[] = [
    [ox - hw, oy - hd],
    [ox + hw, oy - hd],
    [ox + hw, oy + hd],
    [ox - hw, oy + hd],
  ];
  return local.map((p) => {
    const [x, y] = rotate(p, rot);
    return [cx + x, cy + y];
  });
}

export type VillaShape = {
  id: string;
  /** main block + optional tower; each with a relative height for shadows */
  blocks: { pts: Pt[]; height: number }[];
  pool: Pt[];
  plot: Pt[];
  label: Pt;
  center: Pt;
};

/**
 * Building footprints. Local x runs across the slope (east-west), local y runs
 * along the contour (north-south), so the long side follows the contour.
 */
export function villaShape(v: Villa): VillaShape {
  const t = typologies[v.type];
  const { cx, cy, rot } = v.plan;
  const { w, d } = t.footprint;
  const blocks = [{ pts: rect(cx, cy, d, w, rot), height: 1 }];
  if (t.tower) {
    const s = t.tower.s;
    blocks.push({ pts: rect(cx, cy, s, s, rot, d / 2 - s / 2 + 5, -w / 2 + s / 2 - 5), height: 1.8 });
  }
  // Pool sits downhill (west) of the house, parallel to the terrace.
  const pool = rect(cx, cy, 9, t.poolLength * 2.6, rot, -d / 2 - 13, 2);
  const plot = rect(cx, cy, d + 60, w + 40, rot, -12, 0);
  const label = rotate([d / 2 + 9, -w / 2 - 4], rot);
  return {
    id: v.id,
    blocks,
    pool,
    plot,
    label: [cx + label[0], cy + label[1]],
    center: [cx, cy],
  };
}

export const shapes: VillaShape[] = villas.map(villaShape);

export const toPath = (pts: Pt[]) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") + " Z";

// ---------- Sun & shadows ----------

export type SunLayer = { hour: number; azimuth: number; altitude: number };

/** Approximate midsummer sun for 37°N (Bodrum), local time. Five pre-drawn layers. */
export const sunLayers: SunLayer[] = [
  { hour: 7, azimuth: 72, altitude: 12 },
  { hour: 10, azimuth: 104, altitude: 48 },
  { hour: 13, azimuth: 186, altitude: 74 },
  { hour: 16.5, azimuth: 258, altitude: 44 },
  { hour: 20, azimuth: 294, altitude: 7 },
];

function cross(o: Pt, a: Pt, b: Pt) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

/** Monotone chain convex hull. */
function hull(points: Pt[]): Pt[] {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const lower: Pt[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Pt[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

const BASE_HEIGHT = 11; // plan units for a two-storey block

export function shadowVector(layer: SunLayer, height = 1): Pt {
  const len = Math.min(78, (BASE_HEIGHT * height) / Math.tan(rad(Math.max(layer.altitude, 6))));
  const az = rad(layer.azimuth);
  return [-Math.sin(az) * len, Math.cos(az) * len];
}

/** Shadow polygons for one layer (one path per block, merged into a single d string). */
export function shadowPath(layer: SunLayer, shape: VillaShape) {
  return shape.blocks
    .map((b) => {
      const [dx, dy] = shadowVector(layer, b.height);
      const moved = b.pts.map(([x, y]) => [x + dx, y + dy] as Pt);
      return toPath(hull([...b.pts, ...moved]));
    })
    .join(" ");
}

/** Sun marker on the dashed path ellipse drawn around the site. */
export const SUN_ELLIPSE = { cx: 560, cy: 300, rx: 455, ry: 360 };

export function sunPoint(azimuth: number): Pt {
  const a = rad(azimuth);
  return [SUN_ELLIPSE.cx + SUN_ELLIPSE.rx * Math.sin(a), SUN_ELLIPSE.cy - SUN_ELLIPSE.ry * Math.cos(a)];
}

/** Interpolated azimuth for a continuous hour value (for the moving sun marker). */
export function azimuthAt(hour: number) {
  const L = sunLayers;
  if (hour <= L[0].hour) return L[0].azimuth;
  for (let i = 0; i < L.length - 1; i++) {
    if (hour <= L[i + 1].hour) {
      const t = (hour - L[i].hour) / (L[i + 1].hour - L[i].hour);
      return L[i].azimuth + t * (L[i + 1].azimuth - L[i].azimuth);
    }
  }
  return L[L.length - 1].azimuth + (hour - L[L.length - 1].hour) * 4;
}

/** Opacity weight for each layer at a given hour (crossfade between the two nearest). */
export function layerWeights(hour: number): number[] {
  const L = sunLayers;
  const w = L.map(() => 0);
  if (hour <= L[0].hour) {
    w[0] = 1;
    return w;
  }
  if (hour >= L[L.length - 1].hour) {
    w[L.length - 1] = 1;
    return w;
  }
  for (let i = 0; i < L.length - 1; i++) {
    if (hour >= L[i].hour && hour <= L[i + 1].hour) {
      const t = (hour - L[i].hour) / (L[i + 1].hour - L[i].hour);
      w[i] = 1 - t;
      w[i + 1] = t;
    }
  }
  return w;
}

/** Sun path arc (east → south → west) as an SVG path. */
export function sunArcPath() {
  const pts: Pt[] = [];
  for (let az = 60; az <= 300; az += 6) pts.push(sunPoint(az));
  return pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
}

// ---------- Keyboard neighbours ----------

export function neighbour(fromId: string, dir: "up" | "down" | "left" | "right"): string {
  const from = shapes.find((s) => s.id === fromId);
  if (!from) return shapes[0].id;
  const v: Pt = dir === "up" ? [0, -1] : dir === "down" ? [0, 1] : dir === "left" ? [-1, 0] : [1, 0];
  let best: { id: string; score: number } | null = null;
  for (const s of shapes) {
    if (s.id === fromId) continue;
    const dx = s.center[0] - from.center[0];
    const dy = s.center[1] - from.center[1];
    const along = dx * v[0] + dy * v[1];
    if (along <= 4) continue;
    const across = Math.abs(dx * v[1] - dy * v[0]);
    const score = along + across * 2.2;
    if (!best || score < best.score) best = { id: s.id, score };
  }
  return best ? best.id : fromId;
}

// ---------- Terrain (static art) ----------

/** Contour lines: roughly north-south, the hill rises to the east. */
export function contourPaths(): string[] {
  const out: string[] = [];
  for (let i = 0; i < 12; i++) {
    const base = 170 + i * 72;
    const amp = 18 + (i % 3) * 7;
    const phase = i * 0.7;
    const pts: Pt[] = [];
    for (let y = -20; y <= PLAN_H + 20; y += 35) {
      const x = base + Math.sin(y / 110 + phase) * amp + Math.sin(y / 47 + i) * 5 - y * 0.05;
      pts.push([x, y]);
    }
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1]}`;
    for (let k = 1; k < pts.length; k++) {
      const [x0, y0] = pts[k - 1];
      const [x1, y1] = pts[k];
      d += ` Q${x0.toFixed(1)} ${y0} ${((x0 + x1) / 2).toFixed(1)} ${(y0 + y1) / 2}`;
    }
    out.push(d);
  }
  return out;
}

export const ROAD_PATH =
  "M1010 92 C930 96 846 112 790 150 C730 190 700 236 660 280 C620 326 612 360 592 410 C572 462 548 500 520 540 C488 588 440 640 404 710";

export const COAST_PATH =
  "M-10 40 C40 70 70 120 92 170 C112 220 104 270 120 320 C136 372 128 420 146 470 C162 520 150 580 170 640 C178 668 176 690 184 710 L-10 710 Z";

/** Deterministic olive-tree dots, kept away from footprints and the road. */
export function trees(): Pt[] {
  const out: Pt[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const clear = (x: number, y: number) =>
    shapes.every((s) => Math.hypot(s.center[0] - x, s.center[1] - y) > 62) && x > 200;
  for (let i = 0; i < 400 && out.length < 70; i++) {
    const x = 200 + rnd() * 780;
    const y = 20 + rnd() * 660;
    if (clear(x, y)) out.push([x, y]);
  }
  return out;
}
