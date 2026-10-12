// Calendar days as ISO strings ("2026-10-16"). Arithmetic runs on UTC day
// numbers so daylight saving never shifts a day, and formatting uses fixed
// word lists (not Intl), so the server and every browser print the same text.

export type Lang = "tr" | "en";

/** The static HTML is built with this "today"; the browser swaps in the real one. */
export const BUILD_TODAY = "2026-10-09";

const MS = 86400000;

export const dayNum = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / MS);
};

export const fromNum = (n: number) => {
  const t = new Date(n * MS);
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}-${String(t.getUTCDate()).padStart(2, "0")}`;
};

export const addDays = (iso: string, n: number) => fromNum(dayNum(iso) + n);
export const diffDays = (a: string, b: string) => dayNum(b) - dayNum(a);
/** 0 = Sunday … 6 = Saturday (1 Jan 1970 was a Thursday). */
export const weekday = (iso: string) => (((dayNum(iso) + 4) % 7) + 7) % 7;
export const isIso = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && fromNum(dayNum(s)) === s;

export const localToday = () => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
};

const DAYS = {
  tr: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};
const DAYS_SHORT = {
  tr: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
const MONTHS = {
  tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

const parts = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
};

export const monthName = (m: number, lang: Lang) => MONTHS[lang][m];
export const monthShort = (m: number, lang: Lang) => (lang === "tr" ? MONTHS.tr[m] : MONTHS.en[m].slice(0, 3));
export const dayName = (iso: string, lang: Lang) => DAYS[lang][weekday(iso)];
export const dayShort = (iso: string, lang: Lang) => DAYS_SHORT[lang][weekday(iso)];
/** Monday-first short names for a calendar header. */
export const weekHeader = (lang: Lang) => [1, 2, 3, 4, 5, 6, 0].map((i) => DAYS_SHORT[lang][i]);

/** "Cuma 16 Ekim" · "Fri 16 Oct" */
export function fmtDay(iso: string, lang: Lang) {
  const { m, d } = parts(iso);
  return lang === "tr" ? `${DAYS.tr[weekday(iso)]} ${d} ${MONTHS.tr[m]}` : `${DAYS_SHORT.en[weekday(iso)]} ${d} ${MONTHS.en[m].slice(0, 3)}`;
}

/** "16 Ekim" · "16 Oct" */
export function fmtDate(iso: string, lang: Lang) {
  const { m, d } = parts(iso);
  return `${d} ${monthShort(m, lang)}`;
}

/** "16 Ekim 2026" · "16 October 2026" */
export function fmtDateYear(iso: string, lang: Lang) {
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS[lang][m]} ${y}`;
}

/** "16–18 Ekim" · "30 Ekim – 1 Kasım" · "16–18 Oct" */
export function fmtRange(a: string, b: string, lang: Lang) {
  const pa = parts(a);
  const pb = parts(b);
  if (pa.m === pb.m && pa.y === pb.y) return `${pa.d}–${pb.d} ${monthShort(pb.m, lang)}`;
  return `${pa.d} ${monthShort(pa.m, lang)} – ${pb.d} ${monthShort(pb.m, lang)}`;
}
