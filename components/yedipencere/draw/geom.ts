// Shared scale of the survey drawings: 28 drawing units per metre, ground line
// at y = 330. Each elevation passes its own left offset (ox).

export const M = 28;
export const G = 330;

export const X = (ox: number, m: number) => ox + m * M;
export const Y = (m: number) => G - m * M;

/** Ink colours used inside SVG (CSS variables do not reach every SVG paint server). */
export const INK = "#2A201B";
export const INK2 = "#5E544E";
export const FINE = "#9C938C";
export const PAPER = "#FAFAF8";
export const WALL = "#FBFBFA";
export const BEGONVIL = "#B0245E";
export const BEGONVIL_D = "#8C1A4A";
export const ORANGE = "#D9822B";

/** Golden-angle scatter: n points inside an ellipse, used for leaves and blossom. */
export function scatter(n: number, cx: number, cy: number, rx: number, ry: number) {
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = i * 2.399;
    const r = Math.sqrt(i / n);
    out.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
  }
  return out;
}

export const f = (n: number) => Number(n.toFixed(2));
