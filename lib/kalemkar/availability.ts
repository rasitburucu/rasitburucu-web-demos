// Booking calendar for the Kalemkâr concept. Everything is computed in the
// browser from the visitor's clock (components call these after mount, so the
// static HTML never carries a date that could disagree with the client).
// Gaziantep is UTC+3 all year.
//
// Rules (fictional but realistic):
// - Open Wednesday to Sunday, 18.00–24.00. Monday and Tuesday closed.
// - On the 1st of each month at 10.00 the following month opens. So the
//   current month and the next are bookable; the month after is locked.
// - Same-day online booking closes at 14.00.
// - 31 December is a separate New Year's supper, booked as a private request.
// Availability is a deterministic simulation (same answer for the same day),
// labelled as an example on the site. It is not a success claim.

export type Deneyim = "salon" | "tezgah" | "ozel";
export type MenuKey = "sofra" | "kisa" | "tezgah";

export type DayStatus = "gecmis" | "kapali" | "kilitli" | "ozel" | "bugun-kapali" | "dolu" | "az" | "bos";

export type Day = { iso: string; date: number; weekday: number; status: DayStatus };
export type Month = { year: number; month: number; days: Day[]; lead: number; locked: boolean };

export type Slot = {
  time: string;
  left: number;
  /** Bookable for the current party and menu. */
  ok: boolean;
  /** Why not, when not ok: "dolu" | "kisa" (short menu only early) | "kisi" (not enough seats). */
  reason?: "dolu" | "kisa" | "kisi" | "sadeceKisa";
};

export const SALON_TIMES = ["18.30", "19.00", "21.00", "21.30"] as const;
export const COUNTER_TIME = "19.30";
/** Kısa sofra (6 plates) is only served at the early seatings. */
export const SHORT_TIMES = ["18.30", "19.00"];
/** 19.00 is a short-menu-only seating. */
export const SHORT_ONLY = ["19.00"];
export const COUNTER_SEATS = 8;
export const SAME_DAY_CUTOFF = 14; // 14.00 Gaziantep

const pad = (n: number) => String(n).padStart(2, "0");
export const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

/** Wall clock in Gaziantep (UTC+3) as plain fields. */
export function antep(now: Date) {
  const t = new Date(now.getTime() + 3 * 3600_000);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth(), d: t.getUTCDate(), h: t.getUTCHours(), min: t.getUTCMinutes(), wd: t.getUTCDay() };
}

/** A wall-clock time in Gaziantep as a real instant. */
export function antepInstant(isoDate: string, time: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const [hh, mm] = time.split(".").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh - 3, mm));
}

export function parseIso(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return { y, m: m - 1, d };
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const weekdayOf = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d)).getUTCDay();
const isOpenWeekday = (wd: number) => wd !== 1 && wd !== 2;
const daysBetween = (a: { y: number; m: number; d: number }, b: { y: number; m: number; d: number }) =>
  Math.round((Date.UTC(b.y, b.m, b.d) - Date.UTC(a.y, a.m, a.d)) / 86400000);

/** The first bookable instant of the month after next (the locked month). */
export function nextOpening(now: Date) {
  const a = antep(now);
  // The 1st of next month at 10.00 opens the month after it.
  const ny = a.m === 11 ? a.y + 1 : a.y;
  const nm = (a.m + 1) % 12;
  const at = antepInstant(iso(ny, nm, 1), "10.00");
  const lockedM = (a.m + 2) % 12;
  const lockedY = a.m + 2 > 11 ? a.y + 1 : a.y;
  return { at, lockedYear: lockedY, lockedMonth: lockedM, openOn: { y: ny, m: nm } };
}

/** Raw seats/tables left for one seating (before party-size checks). */
export function rawLeft(isoDate: string, deneyim: Deneyim, time: string, now: Date) {
  const a = antep(now);
  const p = parseIso(isoDate);
  const ahead = daysBetween({ y: a.y, m: a.m, d: a.d }, p);
  const h = hash(`${isoDate}:${deneyim}:${time}`);
  const wd = weekdayOf(p.y, p.m, p.d);
  // Closer evenings and weekends fill first.
  let pressure = ahead <= 3 ? 0.62 : ahead <= 10 ? 0.4 : ahead <= 24 ? 0.24 : 0.1;
  if (wd === 5 || wd === 6) pressure += 0.18;
  const dayFull = hash(`${isoDate}:${deneyim}`) % 100 < pressure * 38;
  if (dayFull) return 0;
  const r = (h % 1000) / 1000;
  if (r < pressure * 0.7) return 0;
  if (deneyim === "tezgah") return 1 + (h % COUNTER_SEATS); // seats
  return 1 + (h % 4); // tables
}

export function slotsFor(isoDate: string, deneyim: Deneyim, kisi: number, menu: MenuKey, now: Date): Slot[] {
  if (deneyim === "tezgah") {
    const left = rawLeft(isoDate, "tezgah", COUNTER_TIME, now);
    if (left === 0) return [{ time: COUNTER_TIME, left, ok: false, reason: "dolu" }];
    if (left < kisi) return [{ time: COUNTER_TIME, left, ok: false, reason: "kisi" }];
    return [{ time: COUNTER_TIME, left, ok: true }];
  }
  return SALON_TIMES.map((time) => {
    const left = rawLeft(isoDate, "salon", time, now);
    const tablesNeeded = kisi > 4 ? 2 : 1;
    if (left === 0) return { time, left, ok: false, reason: "dolu" as const };
    if (menu === "kisa" && !SHORT_TIMES.includes(time)) return { time, left, ok: false, reason: "kisa" as const };
    if (menu !== "kisa" && SHORT_ONLY.includes(time)) return { time, left, ok: false, reason: "sadeceKisa" as const };
    if (left < tablesNeeded) return { time, left, ok: false, reason: "kisi" as const };
    return { time, left, ok: true };
  });
}

export function dayStatus(y: number, m: number, d: number, deneyim: Deneyim, kisi: number, menu: MenuKey, now: Date): DayStatus {
  const a = antep(now);
  const diff = daysBetween({ y: a.y, m: a.m, d: a.d }, { y, m, d });
  if (diff < 0) return "gecmis";
  const lock = nextOpening(now);
  const isLockedMonth = (y > lock.lockedYear || (y === lock.lockedYear && m >= lock.lockedMonth)) && !(y < lock.lockedYear);
  if (isLockedMonth) return "kilitli";
  const wd = weekdayOf(y, m, d);
  if (m === 11 && d === 31) return "ozel";
  if (!isOpenWeekday(wd)) return "kapali";
  if (diff === 0 && a.h >= SAME_DAY_CUTOFF) return "bugun-kapali";
  const s = slotsFor(iso(y, m, d), deneyim, kisi, menu, now);
  const open = s.filter((x) => x.left > 0);
  if (!open.length) return "dolu";
  const total = open.reduce((n, x) => n + x.left, 0);
  return total <= (deneyim === "tezgah" ? 3 : 3) ? "az" : "bos";
}

/** Current month, next month (bookable) and the locked month after. */
export function calendar(now: Date, deneyim: Deneyim, kisi: number, menu: MenuKey): Month[] {
  const a = antep(now);
  const out: Month[] = [];
  for (let k = 0; k < 3; k++) {
    const y = a.m + k > 11 ? a.y + 1 : a.y;
    const m = (a.m + k) % 12;
    const len = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    const first = weekdayOf(y, m, 1);
    const lead = (first + 6) % 7; // Monday-first grid
    const days: Day[] = [];
    for (let d = 1; d <= len; d++) days.push({ iso: iso(y, m, d), date: d, weekday: weekdayOf(y, m, d), status: dayStatus(y, m, d, deneyim, kisi, menu, now) });
    out.push({ year: y, month: m, days, lead, locked: k === 2 });
  }
  return out;
}

/** The next `n` evenings with a bookable seating for this party. */
export function nearestOpen(now: Date, deneyim: Deneyim, kisi: number, menu: MenuKey, n = 3, from?: string) {
  const res: { iso: string; time: string }[] = [];
  for (const mo of calendar(now, deneyim, kisi, menu)) {
    if (mo.locked) continue;
    for (const day of mo.days) {
      if (from && day.iso <= from) continue;
      if (day.status !== "bos" && day.status !== "az") continue;
      const s = slotsFor(day.iso, deneyim, kisi, menu, now).find((x) => x.ok);
      if (s) res.push({ iso: day.iso, time: s.time });
      if (res.length === n) return res;
    }
  }
  return res;
}

/** Time left until an instant, for the monthly-opening countdown. */
export function countdown(target: Date, now: Date) {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const s = Math.floor(ms / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), done: ms === 0 };
}

/** Hours from now until a seating starts (for the 48-hour rules). */
export function hoursUntil(isoDate: string, time: string, now: Date) {
  return (antepInstant(isoDate, time).getTime() - now.getTime()) / 3600_000;
}
