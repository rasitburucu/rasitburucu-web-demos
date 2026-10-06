// Gelidonya: the seedling arithmetic, shown openly on the site.
//   fide   = dönüm × dekara tepe ÷ gövde sayısı   (rounded up)
//   viyol  = ⌈fide ÷ göz⌉, the last tray partly filled
//   ekim   = dikim haftası − tohumdan teslime süre (hafta)
import { urunById, type Asi, type Urun } from "@/content/gelidonya/urunler";

export const DAY = 864e5;
const AY = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
export const AY_UZUN = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

/** Fixed "today" for the server render; the client swaps in the real date. */
export const DEMO_TODAY = Date.UTC(2026, 9, 6);

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

/** "6 Ekim" */
export const gunAy = (t: number) => {
  const d = new Date(t);
  return `${d.getUTCDate()} ${AY_UZUN[d.getUTCMonth()]}`;
};

/** "6 Ekim 2026" */
export const tarih = (t: number) => `${gunAy(t)} ${new Date(t).getUTCFullYear()}`;

export const weeksFor = (u: Urun, a: Asi) => u.weeks[a] ?? u.weeks.asili ?? 6;

/** Planting weeks on offer: from (this week + growing time + 1) on, 26 weeks. */
export function plantingWeeks(today: number, u: Urun, a: Asi, count = 26) {
  const first = monday(today) + (weeksFor(u, a) + 1) * 7 * DAY;
  return Array.from({ length: count }, (_, i) => first + i * 7 * DAY);
}

/** Default planting: week 7 of next year when on offer (a usual spring planting), else the first. */
export function defaultWeek(weeks: number[], today: number) {
  const y = new Date(today).getUTCFullYear() + 1;
  return (
    weeks.find((m) => {
      const h = isoWeek(m);
      return h.y === y && h.w === 7;
    }) ?? weeks[0]
  );
}

export type Hesap = {
  urun: string;
  graft: Asi;
  stems: 1 | 2;
  tray: number;
  donum: number;
  week: number;
};

export function calc(h: Hesap) {
  const u = urunById(h.urun);
  const stems = u.stems.includes(h.stems) ? h.stems : 1;
  const heads = h.donum * u.heads;
  const fide = Math.ceil(heads / stems);
  const viyol = Math.max(1, Math.ceil(fide / h.tray));
  const last = fide === 0 ? 0 : fide - (viyol - 1) * h.tray;
  const weeks = weeksFor(u, h.graft);
  const sowing = h.week - weeks * 7 * DAY;
  return { u, stems, heads, fide, viyol, last, weeks, sowing };
}

export const DONUM = { min: 1, max: 300 };

/** "05320000000" -> "0532 000 00 00" (10 digits without the leading 0 too). */
export function telYaz(v: string) {
  const d = v.replace(/\D/g, "");
  const m = d.match(/^(0?)(\d{3})(\d{3})(\d{2})(\d{2})$/);
  return m ? `${m[1]}${m[2]} ${m[3]} ${m[4]} ${m[5]}` : v;
}
