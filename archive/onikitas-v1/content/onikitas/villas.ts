// Single source of truth for the 12 villas (fictional project).
// Plan coordinates live in the Stone Plan's SVG space (viewBox 0 0 1000 700,
// north up, sea to the west). Footprints are derived from center + rotation +
// the typology's footprint size (see lib/onikitas/geometry.ts).
import type { ImageKey } from "./images";

export type Status = "available" | "reserved" | "sold";
export type TypologyId = "tas" | "zeytin" | "kule";
export type ViewKind = "sea" | "grove";

export type Typology = {
  id: TypologyId;
  name: string; // brand word, not translated
  layout: string; // "3+1"
  bedrooms: number;
  bathrooms: number;
  poolLength: number; // m
  /** footprint in plan units (w along contour, d across) */
  footprint: { w: number; d: number };
  /** optional tower block (Kule), size in plan units; placed at the uphill north corner */
  tower?: { s: number };
  gallery: ImageKey[];
  levels: ("zemin" | "ust" | "cati" | "bahce")[];
};

export const typologies: Record<TypologyId, Typology> = {
  tas: {
    id: "tas",
    name: "Taş",
    layout: "3+1",
    bedrooms: 3,
    bathrooms: 3,
    poolLength: 10,
    footprint: { w: 50, d: 32 },
    gallery: ["bay-villa", "stair", "niche", "pool-edge", "olive"],
    levels: ["zemin", "ust", "bahce"],
  },
  zeytin: {
    id: "zeytin",
    name: "Zeytin",
    layout: "4+1",
    bedrooms: 4,
    bathrooms: 4,
    poolLength: 12,
    footprint: { w: 60, d: 38 },
    gallery: ["bay-pool", "arch-hall", "stair", "niche", "tree-shadow"],
    levels: ["zemin", "ust", "cati", "bahce"],
  },
  kule: {
    id: "kule",
    name: "Kule",
    layout: "5+1",
    bedrooms: 5,
    bathrooms: 5,
    poolLength: 14,
    footprint: { w: 70, d: 42 },
    tower: { s: 20 },
    gallery: ["hero-house", "arch-hall", "niche", "columns", "pool-edge"],
    levels: ["zemin", "ust", "cati", "bahce"],
  },
};

export type Villa = {
  id: string; // "07"
  no: number;
  name: string;
  type: TypologyId;
  interior: number; // m²
  plot: number; // m²
  bearing: number; // degrees, main terrace orientation
  view: ViewKind;
  status: Status;
  handover: string;
  plan: { cx: number; cy: number; rot: number };
  images: ImageKey[];
};

const HANDOVER = "Eylül 2027";

function gallery(type: TypologyId, shift: number): ImageKey[] {
  const g = typologies[type].gallery;
  return g.map((_, i) => g[(i + shift) % g.length]);
}

const raw: Omit<Villa, "images" | "handover" | "no">[] = [
  { id: "01", name: "Sakız", type: "kule", interior: 402, plot: 1440, bearing: 250, view: "sea", status: "sold", plan: { cx: 300, cy: 160, rot: -12 } },
  { id: "02", name: "Defne", type: "kule", interior: 388, plot: 1320, bearing: 245, view: "sea", status: "available", plan: { cx: 282, cy: 300, rot: -4 } },
  { id: "03", name: "Mersin", type: "kule", interior: 412, plot: 1460, bearing: 238, view: "sea", status: "reserved", plan: { cx: 288, cy: 440, rot: 6 } },
  { id: "04", name: "Kapari", type: "zeytin", interior: 304, plot: 1120, bearing: 232, view: "sea", status: "sold", plan: { cx: 318, cy: 574, rot: 14 } },
  { id: "05", name: "Kekik", type: "zeytin", interior: 298, plot: 1020, bearing: 262, view: "sea", status: "reserved", plan: { cx: 508, cy: 128, rot: -14 } },
  { id: "06", name: "Adaçayı", type: "zeytin", interior: 318, plot: 1090, bearing: 255, view: "sea", status: "available", plan: { cx: 480, cy: 256, rot: -6 } },
  { id: "07", name: "Harnup", type: "zeytin", interior: 312, plot: 1050, bearing: 240, view: "sea", status: "available", plan: { cx: 462, cy: 384, rot: 2 } },
  { id: "08", name: "Nar", type: "tas", interior: 228, plot: 920, bearing: 236, view: "sea", status: "sold", plan: { cx: 446, cy: 508, rot: 10 } },
  { id: "09", name: "Badem", type: "tas", interior: 212, plot: 860, bearing: 270, view: "sea", status: "reserved", plan: { cx: 846, cy: 206, rot: -18 } },
  { id: "10", name: "İncir", type: "tas", interior: 220, plot: 880, bearing: 258, view: "sea", status: "available", plan: { cx: 796, cy: 326, rot: -8 } },
  { id: "11", name: "Lavanta", type: "tas", interior: 236, plot: 940, bearing: 96, view: "grove", status: "available", plan: { cx: 770, cy: 448, rot: 0 } },
  { id: "12", name: "Keçiboynuzu", type: "tas", interior: 216, plot: 900, bearing: 118, view: "grove", status: "reserved", plan: { cx: 728, cy: 568, rot: 8 } },
];

export const villas: Villa[] = raw.map((v, i) => ({
  ...v,
  no: i + 1,
  handover: HANDOVER,
  images: gallery(v.type, i % 3),
}));

export const getVilla = (id: string) => villas.find((v) => v.id === id);

export const availableCount = villas.filter((v) => v.status === "available").length;

export const averagePlot = Math.round(villas.reduce((s, v) => s + v.plot, 0) / villas.length / 10) * 10;

export function typologyStats(type: TypologyId) {
  const list = villas.filter((v) => v.type === type);
  const range = (k: "interior" | "plot") => {
    const vals = list.map((v) => v[k]);
    return [Math.min(...vals), Math.max(...vals)] as const;
  };
  return {
    count: list.length,
    available: list.filter((v) => v.status === "available").length,
    interior: range("interior"),
    plot: range("plot"),
  };
}

/** Compass label for a bearing, Turkish abbreviations (K, KD, D, GD, G, GB, B, KB). */
export function compass(bearing: number) {
  const labels = ["K", "KD", "D", "GD", "G", "GB", "B", "KB"];
  return labels[Math.round((((bearing % 360) + 360) % 360) / 45) % 8];
}

export function similarVillas(v: Villa, n = 3) {
  const order: Record<Status, number> = { available: 0, reserved: 1, sold: 2 };
  return villas
    .filter((o) => o.id !== v.id && o.status !== "sold")
    .sort((a, b) => {
      const ta = a.type === v.type ? 0 : 1;
      const tb = b.type === v.type ? 0 : 1;
      if (ta !== tb) return ta - tb;
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
      return Math.abs(a.no - v.no) - Math.abs(b.no - v.no);
    })
    .slice(0, n);
}
