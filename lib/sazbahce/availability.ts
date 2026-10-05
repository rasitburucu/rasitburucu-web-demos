// Sample occupancy: seeded from the date and the area, so every visitor sees the
// same calendar. Saturdays fill first, then Sundays and Fridays; summer is busier.
// Shown on the site as "örnek doluluk".

import { AREAS, OPEN_SEASON, VENUE, type AreaKey } from "./venue";

export type AreaState = "bos" | "opsiyon" | "dolu" | "kapali";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function parseIso(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function areaState(d: Date, a: AreaKey): AreaState {
  const month = d.getMonth();
  if (VENUE[a].outdoor && (month < OPEN_SEASON.from || month > OPEN_SEASON.to)) return "kapali";
  const wd = d.getDay();
  let p = wd === 6 ? 0.66 : wd === 0 ? 0.4 : wd === 5 ? 0.36 : 0.08;
  if (month >= 5 && month <= 8) p += 0.12;
  const r = hash(isoDay(d) + a);
  return r < p ? "dolu" : r < p + 0.1 ? "opsiyon" : "bos";
}

export function dayStates(d: Date): [AreaKey, AreaState][] {
  return AREAS.map((a) => [a, areaState(d, a)]);
}

/** One answer for "is that day free?", used by every view (text, calendar, bar, warnings).
 *  "Opsiyonlu" = held for someone else but not yet confirmed: still bookable, shown separately. */
export type DaySummary = { bos: AreaKey[]; opsiyon: AreaKey[]; dolu: AreaKey[]; kapali: AreaKey[]; open: number };

export function daySummary(d: Date): DaySummary {
  const r: DaySummary = { bos: [], opsiyon: [], dolu: [], kapali: [], open: 0 };
  for (const [a, s] of dayStates(d)) r[s].push(a);
  r.open = r.bos.length + r.opsiyon.length;
  return r;
}

/** First Saturday (then Friday, then Sunday) of June 2027 with the meadow free. */
export function defaultDate(): Date {
  for (const wd of [6, 5, 0]) {
    for (let day = 1; day <= 30; day++) {
      const t = new Date(2027, 5, day);
      if (t.getDay() === wd && areaState(t, "cayir") === "bos") return t;
    }
  }
  return new Date(2027, 5, 12);
}
