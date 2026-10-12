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

/** Any span of days: "4–7 Oca" or "29 Ara–5 Oca". */
export function dayRange(a: number, b: number) {
  const x = new Date(a);
  const y = new Date(b);
  if (a === b) return `${x.getUTCDate()} ${AY[x.getUTCMonth()]}`;
  return x.getUTCMonth() === y.getUTCMonth()
    ? `${x.getUTCDate()}–${y.getUTCDate()} ${AY[y.getUTCMonth()]}`
    : `${x.getUTCDate()} ${AY[x.getUTCMonth()]}–${y.getUTCDate()} ${AY[y.getUTCMonth()]}`;
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

/** The countdown strip: the stops a seedling passes from sowing to delivery.
 *  Sowing (the sowing week) and delivery (the planting week) come straight from
 *  calc(); the stops between are an EXAMPLE calendar placed at fixed shares of
 *  the total time, and the site says so under the strip.
 *    germination  ≈ 7 % of the time in, 4 days
 *    grafting     ≈ 40 %, 4 days; healing the 8 days after (grafted)
 *    first leaf   ≈ 35 %, 4 days (ungrafted)
 *    hardening    the last 7 days before delivery */
export type Asama = "ekim" | "cimlenme" | "yaprak" | "asi" | "kaynasma" | "sertlestirme" | "teslim";
export type Durak = { id: Asama; a: number; b: number };

export function takvim(sowing: number, weeks: number, graft: Asi): Durak[] {
  const T = weeks * 7;
  const at = (f: number) => Math.round(f * T);
  const d = (id: Asama, a: number, b: number): Durak => ({ id, a: sowing + a * DAY, b: sowing + b * DAY });
  const cim = Math.max(2, at(0.07));
  const out = [d("ekim", 0, 6), d("cimlenme", cim, cim + 3)];
  if (graft === "asili") {
    const asi = at(0.4);
    out.push(d("asi", asi, asi + 3), d("kaynasma", asi + 4, asi + 11));
  } else {
    const y = at(0.35);
    out.push(d("yaprak", y, y + 3));
  }
  out.push(d("sertlestirme", T - 7, T - 1), d("teslim", T, T + 6));
  return out;
}

/** "05320000000" -> "0532 000 00 00" (10 digits without the leading 0 too). */
export function telYaz(v: string) {
  const d = v.replace(/\D/g, "");
  const m = d.match(/^(0?)(\d{3})(\d{3})(\d{2})(\d{2})$/);
  return m ? `${m[1]}${m[2]} ${m[3]} ${m[4]} ${m[5]}` : v;
}
