// Turkish number formatting. Martian Mono has no ₺ glyph, so money is written "TL".

const int = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });
const one = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 1 });

export const fmt = (v: number) => int.format(Math.round(v));
export const fmt1 = (v: number) => one.format(v);
/** Millimetres with a thin no-break space: 1.200 mm */
export const mm = (v: number) => `${fmt(v)} mm`;
export const kg = (v: number) => `${fmt1(v)} kg`;

/** Money rounded to a sensible step for an estimate (1.000 TL under a million, 10.000 TL above). */
export function tl(v: number) {
  const step = Math.abs(v) >= 1_000_000 ? 10_000 : 1_000;
  return `${fmt(Math.round(v / step) * step)} TL`;
}

export function tlRange(a: number, b: number) {
  const step = Math.max(Math.abs(a), Math.abs(b)) >= 1_000_000 ? 10_000 : 1_000;
  const r = (v: number) => fmt(Math.round(v / step) * step);
  return `${r(a)}–${r(b)} TL`;
}

export const range = (a: number, b: number, unit = "") => (a === b ? `${fmt(a)}${unit}` : `${fmt(a)}–${fmt(b)}${unit}`);
