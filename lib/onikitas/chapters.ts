import type { ChapterId } from "@/content/onikitas/tr";

/**
 * One scroll chapter = one stretch of the Bodrum day. Hours are decimal. The
 * single source for the day's times: the hour ruler, the clock and the screen
 * reader labels all print `from` (see formatHour).
 */
export type Chapter = {
  id: ChapterId;
  /** Hour at the top of the chapter and at its end. */
  from: number;
  to: number;
  /**
   * Scroll length of the chapter in svh (t runs 0..1 over it). Longer = slower
   * day. The section itself is 100svh taller (its sticky screen) and overlaps
   * the next section by that 100svh, so no stretch of scroll holds a frozen
   * frame: the whole page is sum(vh) + 100svh.
   */
  vh: number;
  /** Part of the chapter (0..1) over which the hour advances; the rest holds. */
  span: [number, number];
};

export const chapters: Chapter[] = [
  { id: "safak", from: 5.683, to: 6.5, vh: 130, span: [0.25, 1] },
  { id: "sabah", from: 6.5, to: 7.8, vh: 80, span: [0, 1] },
  { id: "kusluk", from: 7.75, to: 11.75, vh: 150, span: [0, 1] },
  { id: "ogle", from: 11.75, to: 14.5, vh: 90, span: [0, 1] },
  { id: "ikindi", from: 14.5, to: 17.75, vh: 100, span: [0, 1] },
  { id: "aksam", from: 17.75, to: 19.667, vh: 180, span: [0, 0.4] },
  // night: the lamps come on over the first 55%, then the slope holds, calm
  { id: "yatsi", from: 19.667, to: 21.5, vh: 90, span: [0, 0.55] },
];

/** Height of a chapter section in svh: its scroll length plus the sticky screen. */
export const sectionVh = (c: Chapter) => c.vh + 100;

/** Fixed framings for still capture (?still=n): [chapter, t]. */
export const STILLS: [number, number][] = [
  [0, 0.05],
  [1, 0.55],
  [2, 0.55],
  [3, 0.6],
  [4, 0.5],
  [5, 0.6],
  [6, 0.7],
];

export const DIAL_MIN = 5;
export const DIAL_MAX = 22;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function hourFor(index: number, t: number) {
  const c = chapters[index];
  const k = clamp01((t - c.span[0]) / (c.span[1] - c.span[0]));
  return c.from + (c.to - c.from) * k;
}

/** Maquette -> real sweep, 0..1, driven by scroll (not by the dial). */
export function revealFor(index: number, t: number) {
  const k = chapters.findIndex((c) => c.id === "kusluk");
  if (index < k) return 0;
  if (index > k) return 1;
  return smooth(0.1, 0.78, t);
}

export function formatHour(h: number) {
  const total = Math.round(h * 60);
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
