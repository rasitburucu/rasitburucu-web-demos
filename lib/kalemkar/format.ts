// Turkish formatting helpers. No Intl date formatting: the output must be
// identical on every device (and in tests), so names come from fixed lists.

export const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
/** Locative: "1 Kasım’da". */
export const MONTHS_LOC = ["Ocak’ta", "Şubat’ta", "Mart’ta", "Nisan’da", "Mayıs’ta", "Haziran’da", "Temmuz’da", "Ağustos’ta", "Eylül’de", "Ekim’de", "Kasım’da", "Aralık’ta"];
export const WEEKDAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
export const WEEKDAYS_SHORT = ["Paz", "Pzt", "Sal", "Çar", "Prş", "Cum", "Cmt"];
/** Monday-first header for the calendar grid. */
export const GRID_HEAD = ["Pzt", "Sal", "Çar", "Prş", "Cum", "Cmt", "Paz"];

const parts = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d, wd: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
};

/** "Cuma, 9 Ekim" */
export const dayLong = (iso: string) => {
  const p = parts(iso);
  return `${WEEKDAYS[p.wd]}, ${p.d} ${MONTHS[p.m]}`;
};
/** "Cum 9 Ekim" */
export const dayShort = (iso: string) => {
  const p = parts(iso);
  return `${WEEKDAYS_SHORT[p.wd]} ${p.d} ${MONTHS[p.m]}`;
};
/** "Prş 8" */
export const dayChip = (iso: string) => {
  const p = parts(iso);
  return `${WEEKDAYS_SHORT[p.wd]} ${p.d}`;
};

/** 6500 -> "6.500 TL" (Turkish thousands separator, no decimals). */
export const tl = (n: number) => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} TL`;

/** Digits only, grouped as 5xx xxx xx xx while typing. */
export function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("90")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  d = d.slice(0, 10);
  const g = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean);
  return g.join(" ");
}
export const phoneOk = (v: string) => /^5\d{9}$/.test(v.replace(/\D/g, ""));
export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Turkish "kişi" counts read naturally: "1 kişi", "4 kişi". */
export const kisi = (n: number) => `${n} kişi`;
