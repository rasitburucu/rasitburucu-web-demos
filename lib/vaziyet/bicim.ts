// Turkish number formats for Vaziyet. "TL" is written out (no ₺ glyph needed).
const tam = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });
const bir = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const iki = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const esnek = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 });

export const f0 = (n: number) => tam.format(Math.round(n));
export const f1 = (n: number) => bir.format(n);
export const f2 = (n: number) => iki.format(n);
/** 0,3 → "0,30" for ratios */
export const oran = (n: number) => iki.format(n);
/** as typed: 6.5 → "6,5", 30 → "30" */
export const sayi = (n: number) => esnek.format(n);
/** 749000 → "749.000 TL" */
export const tl = (n: number) => `${tam.format(Math.round(n / 1000) * 1000)} TL`;
/** 1048000 → "1,05" (milyon) */
export const milyon = (n: number) => iki.format(Math.round(n / 10000) / 100);
/** a price range in the shortest honest form */
export function aralik(a: number, b: number) {
  if (b >= 1e6) return `${milyon(a)}–${milyon(b)} milyon TL`;
  return `${tam.format(Math.round(a / 1000))}–${tam.format(Math.round(b / 1000))} bin TL`;
}
/** "3–4" */
export const araSayi = (r: readonly [number, number]) => (r[0] === r[1] ? `${r[0]}` : `${r[0]}–${r[1]}`);
/** parse "6,5" or "6.5" */
export function oku(s: string): number | null {
  const t = s.replace(/\s/g, "").replace(",", ".");
  if (!t || !/^\d*\.?\d*$/.test(t)) return null;
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : null;
}
