// Where each room's window sits on its elevation (metres from the elevation's
// left wall line and from the ground line), and where its name is written.

import type { RoomId, Side } from "@/lib/yedipencere/house";

export type WinSpec = {
  side: Side;
  x: number;
  y: number;
  w: number;
  h: number;
  panes: 1 | 3;
  bars?: boolean;
  label: { x: number; y: number; anchor: "middle" | "start" | "end" };
  leader?: [number, number, number, number];
};

export const WIN: Record<RoomId, WinSpec> = {
  taslik: { side: "sokak", x: 6.55, y: 0.95, w: 0.95, h: 1.45, panes: 1, bars: true, label: { x: 7.02, y: 0.4, anchor: "middle" } },
  cumba: { side: "sokak", x: 3.12, y: 4.45, w: 2.96, h: 1.55, panes: 3, label: { x: 4.6, y: 3.86, anchor: "middle" } },
  avlu: { side: "avlu", x: 5.7, y: 0.95, w: 1.0, h: 1.45, panes: 1, label: { x: 6.2, y: 0.4, anchor: "middle" } },
  sofa: { side: "avlu", x: 6.55, y: 4.25, w: 1.0, h: 1.55, panes: 1, label: { x: 7.05, y: 3.7, anchor: "middle" } },
  korfez: { side: "deniz", x: 2.1, y: 4.2, w: 1.0, h: 1.6, panes: 1, label: { x: 2.6, y: 3.66, anchor: "middle" } },
  hidirlik: { side: "deniz", x: 4.9, y: 7.3, w: 0.85, h: 1.35, panes: 1, label: { x: 3.55, y: 8.75, anchor: "end" }, leader: [3.62, 8.86, 4.66, 8.36] },
  kosk: { side: "deniz", x: 6.45, y: 7.3, w: 2.75, h: 1.35, panes: 3, label: { x: 10.1, y: 8.75, anchor: "start" }, leader: [10.04, 8.86, 9.3, 8.36] },
};

/** Left offset and viewBox of each elevation (shared scale, aligned ground lines). */
export const ELEV: Record<Side, { ox: number; vb: [number, number, number, number]; mobileCrop: number }> = {
  sokak: { ox: 72, vb: [0, 18, 368, 492], mobileCrop: 372 },
  avlu: { ox: 52, vb: [0, 18, 348, 492], mobileCrop: 372 },
  deniz: { ox: 50, vb: [0, 18, 422, 492], mobileCrop: 492 },
};
