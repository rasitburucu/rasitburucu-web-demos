// Calendar logic for the Revak flows. Everything is computed in the browser from
// the visitor's clock; components call these only after mount, so the static
// HTML never contains a date that could disagree with the client (no hydration
// mismatch). Istanbul is UTC+3 all year, which keeps the maths simple.

export type TourType = "yerinde" | "cevrimici";
export type DayPart = "sabah" | "ogleden" | "aksam";

export type TourDay = {
  iso: string;
  weekday: number; // 0 = Sunday
  schoolDay: boolean;
  holiday: boolean;
  full: boolean;
};

export type TourSlot = { time: string; part: DayPart; left: number };

// Public holidays and the mid-year break that fall inside the 2026-2027 year.
const HOLIDAYS = new Set([
  "2026-10-28",
  "2026-10-29",
  "2027-01-01",
  "2027-04-23",
  "2027-05-01",
  "2027-05-19",
  "2027-07-15",
]);
const BREAK: [string, string][] = [["2027-01-25", "2027-02-05"]];

export const TOUR_TIMES: Record<TourType, { time: string; part: DayPart }[]> = {
  yerinde: [
    { time: "09.30", part: "sabah" },
    { time: "11.00", part: "sabah" },
    { time: "14.00", part: "ogleden" },
    { time: "15.30", part: "ogleden" },
  ],
  cevrimici: [
    { time: "10.00", part: "sabah" },
    { time: "16.00", part: "ogleden" },
    { time: "18.30", part: "aksam" },
  ],
};

export const TOUR_MINUTES: Record<TourType, number> = { yerinde: 60, cevrimici: 30 };

const pad = (n: number) => String(n).padStart(2, "0");

/** Local calendar date as yyyy-mm-dd. */
export function isoDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}

/** A wall-clock time in Istanbul as a real instant. */
export function istanbul(iso: string, time: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const [hh, mm] = time.split(".").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh - 3, mm));
}

// Small deterministic hash so availability looks lived-in but stays stable.
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function isHoliday(iso: string) {
  if (HOLIDAYS.has(iso)) return true;
  return BREAK.some(([a, b]) => iso >= a && iso <= b);
}

/** Calendar days from tomorrow until `schoolDays` bookable days are covered. */
export function tourDays(now: Date, type: TourType, schoolDays = 10): TourDay[] {
  const out: TourDay[] = [];
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12);
  let count = 0;
  while (count < schoolDays) {
    const iso = isoDate(d);
    const weekday = d.getDay();
    const holiday = isHoliday(iso);
    const schoolDay = weekday !== 0 && weekday !== 6 && !holiday;
    const full = schoolDay && slotsFor(iso, type).every((s) => s.left === 0);
    out.push({ iso, weekday, schoolDay, holiday, full });
    if (schoolDay) count++;
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function slotsFor(iso: string, type: TourType): TourSlot[] {
  const dayFull = hash(`${iso}:${type}`) % 9 === 0;
  return TOUR_TIMES[type].map(({ time, part }) => {
    const h = hash(`${iso}:${type}:${time}`);
    const left = dayFull || h % 10 < 3 ? 0 : (h % 5) + 1;
    return { time, part, left };
  });
}

/** The first `n` open slots, used by the "nearest free tour" buttons. */
export function nearestSlots(now: Date, type: TourType = "yerinde", n = 3) {
  const res: { iso: string; time: string; left: number }[] = [];
  for (const day of tourDays(now, type, 10)) {
    if (!day.schoolDay) continue;
    for (const s of slotsFor(day.iso, type)) {
      if (s.left > 0) res.push({ iso: day.iso, time: s.time, left: s.left });
      if (res.length === n) return res;
    }
  }
  return res;
}

/* ---------- scholarship exam ---------- */

export type ExamSession = {
  id: string;
  iso: string;
  time: string;
  entry: string;
  deadline: string;
  grades: number[];
  seats: number;
  left: number;
  room: string;
};

export const EXAM_SESSIONS: ExamSession[] = [
  { id: "2026-10", iso: "2026-10-25", time: "10.00", entry: "09.30", deadline: "2026-10-21", grades: [4, 5, 6, 7, 8], seats: 180, left: 0, room: "A Blok, 112" },
  { id: "2026-11", iso: "2026-11-15", time: "10.00", entry: "09.30", deadline: "2026-11-11", grades: [4, 5, 6, 7, 8, 9, 10, 11], seats: 240, left: 38, room: "B Blok, 204" },
  { id: "2027-01", iso: "2027-01-10", time: "10.00", entry: "09.30", deadline: "2027-01-06", grades: [4, 5, 6, 7, 8], seats: 180, left: 131, room: "B Blok, 118" },
  { id: "2027-03", iso: "2027-03-07", time: "10.00", entry: "09.30", deadline: "2027-03-03", grades: [8, 9, 10, 11], seats: 160, left: 142, room: "Lise binası, 301" },
];

export function openSessions(now: Date) {
  const today = isoDate(now);
  return EXAM_SESSIONS.filter((s) => s.deadline >= today);
}

/** Next session that still takes applications and has seats. */
export function nextExam(now: Date) {
  return openSessions(now).find((s) => s.left > 0) ?? null;
}

export function countdown(target: Date, now: Date) {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: ms === 0,
  };
}

export function daysUntil(iso: string, now: Date) {
  const a = parseIso(isoDate(now)).getTime();
  const b = parseIso(iso).getTime();
  return Math.round((b - a) / 86400000);
}
