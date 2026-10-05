// Gelidonya: the order arithmetic, shown openly on the site.
//   fide   = dönüm × dekara fide (or the count typed in), + 5 % spare if chosen
//   viyol  = ⌈fide ÷ göz⌉, the last tray partly filled
//   ekim   = teslim haftası − üretim süresi (hafta)
import { FIDELER, type Fide } from "@/content/gelidonya/urunler";

export const DAY = 864e5;
const AY = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

/** Fixed "today" for the server render; the client swaps in the real date. */
export const DEMO_TODAY = Date.UTC(2026, 9, 5);

export const nf = (n: number) => n.toLocaleString("tr-TR");

export function monday(t: number) {
  const d = new Date(t);
  const g = d.getUTCDay() || 7;
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - g + 1);
}

export function isoWeek(t: number) {
  const d = new Date(t);
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const g = x.getUTCDay() || 7;
  x.setUTCDate(x.getUTCDate() + 4 - g);
  const y0 = Date.UTC(x.getUTCFullYear(), 0, 1);
  return { w: Math.ceil(((x.getTime() - y0) / DAY + 1) / 7), y: x.getUTCFullYear() };
}

/** "15–21 Şub" or "29 Ara–4 Oca" */
export function weekRange(mon: number) {
  const a = new Date(mon);
  const b = new Date(mon + 6 * DAY);
  return a.getUTCMonth() === b.getUTCMonth()
    ? `${a.getUTCDate()}–${b.getUTCDate()} ${AY[b.getUTCMonth()]}`
    : `${a.getUTCDate()} ${AY[a.getUTCMonth()]}–${b.getUTCDate()} ${AY[b.getUTCMonth()]}`;
}

export const fideById = (id: string) => FIDELER.find((f) => f.id === id) ?? FIDELER[0];

/** Delivery weeks on offer: from (this week + growing time + 1 week) on, 20 weeks. */
export function deliveryWeeks(today: number, f: Fide, count = 20) {
  const first = monday(today) + (f.weeks + 1) * 7 * DAY;
  return Array.from({ length: count }, (_, i) => first + i * 7 * DAY);
}

/** Default delivery: week 7 of next year when on offer (a usual Kumluca planting), else the first. */
export function defaultWeek(weeks: number[], today: number) {
  const y = new Date(today).getUTCFullYear() + 1;
  return weeks.find((m) => {
    const h = isoWeek(m);
    return h.y === y && h.w === 7;
  }) ?? weeks[0];
}

export type Order = {
  fideId: string;
  unit: "donum" | "adet";
  amount: number;
  delivery: number;
  spare: boolean;
};

export function calc(o: Order) {
  const f = fideById(o.fideId);
  const base = o.unit === "donum" ? o.amount * f.rate : o.amount;
  const spareN = o.spare ? Math.ceil(base * 0.05) : 0;
  const fide = Math.max(0, base + spareN);
  const viyol = Math.max(1, Math.ceil(fide / f.cells));
  const last = fide === 0 ? 0 : fide - (viyol - 1) * f.cells;
  const sowing = o.delivery - f.weeks * 7 * DAY;
  return { f, base, spareN, fide, viyol, last, sowing };
}

export const LIMITS = {
  donum: { min: 1, max: 500, step: 1 },
  adet: { min: 100, max: 900000, step: 500 },
};

/** "05320000000" -> "0532 000 00 00" (10 digits without the leading 0 too). */
export function telYaz(v: string) {
  const d = v.replace(/\D/g, "");
  const m = d.match(/^(0?)(\d{3})(\d{3})(\d{2})(\d{2})$/);
  return m ? `${m[1]}${m[2]} ${m[3]} ${m[4]} ${m[5]}` : v;
}
