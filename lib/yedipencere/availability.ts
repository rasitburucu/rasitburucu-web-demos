// Sample occupancy ("örnek doluluk"). On a real site these nights come from the
// hotel's channel manager or booking engine; here a seeded generator books
// stays of one to six nights, more often in summer, at weekends and in the sea
// rooms. Every visitor sees the same calendar.

import { addDays, dayNum, diffDays, fromNum, weekday } from "./dates";
import { ROOM_IDS, type RoomId } from "./house";

const FIRST = dayNum("2026-01-01");
const LAST = dayNum("2028-12-31");

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// chance that a stay starts on a free night, by month (Jan … Dec)
const MONTH = [0.12, 0.1, 0.14, 0.24, 0.3, 0.38, 0.46, 0.48, 0.38, 0.3, 0.16, 0.18];
const ROOM_PULL: Record<RoomId, number> = { taslik: 0.82, avlu: 0.92, cumba: 0.95, sofa: 1, korfez: 1.22, hidirlik: 1.2, kosk: 1.3 };
const SEED: Record<RoomId, number> = { taslik: 11, avlu: 23, cumba: 37, sofa: 41, korfez: 53, hidirlik: 67, kosk: 79 };
const LENGTHS = [1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 6];

function build(room: RoomId): Uint8Array {
  const out = new Uint8Array(LAST - FIRST + 1);
  const rnd = mulberry32(SEED[room] * 7919);
  let n = FIRST;
  while (n <= LAST) {
    const iso = fromNum(n);
    const m = Number(iso.slice(5, 7)) - 1;
    const wd = weekday(iso);
    let p = MONTH[m] * ROOM_PULL[room];
    if (wd === 5 || wd === 6) p *= 1.7; // Friday, Saturday arrivals
    const md = iso.slice(5);
    if (md >= "12-28" || md <= "01-01") p = 0.6;
    if (rnd() < p) {
      const len = LENGTHS[Math.floor(rnd() * LENGTHS.length)];
      for (let k = 0; k < len && n + k <= LAST; k++) out[n + k - FIRST] = 1;
      n += len;
      // a cleaning night between stays now and then
      if (rnd() < 0.25) n += 1;
    } else n += 1;
  }
  return out;
}

const TAKEN = Object.fromEntries(ROOM_IDS.map((id) => [id, build(id)])) as Record<RoomId, Uint8Array>;

/** Is the night starting on this date taken? */
export function taken(room: RoomId, night: string): boolean {
  const n = dayNum(night);
  if (n < FIRST || n > LAST) return false;
  return TAKEN[room][n - FIRST] === 1;
}

export function stayFree(room: RoomId, checkIn: string, nights: number): boolean {
  for (let k = 0; k < nights; k++) if (taken(room, addDays(checkIn, k))) return false;
  return true;
}

export function freeRooms(checkIn: string, nights: number): RoomId[] {
  return ROOM_IDS.filter((id) => stayFree(id, checkIn, nights));
}

/** Nearest free stay of the same length, later dates first, never before `today`. */
export function nearestFree(room: RoomId, checkIn: string, nights: number, today: string, span = 28): string | null {
  for (let d = 1; d <= span; d++) {
    const later = addDays(checkIn, d);
    if (stayFree(room, later, nights)) return later;
    const earlier = addDays(checkIn, -d);
    if (diffDays(today, earlier) >= 1 && stayFree(room, earlier, nights)) return earlier;
  }
  return null;
}

/**
 * The first screen opens on a weekend stay in the coming weeks where the sea
 * room Körfez is free and one or two other rooms are taken, so the drawing
 * shows a closed shutter or two (one of them on the sea side when possible).
 */
export function defaultCheckIn(today: string): string {
  let fallback: string | null = null;
  for (let k = 4; k <= 70; k++) {
    const d = addDays(today, k);
    if (weekday(d) !== 5) continue;
    if (!stayFree("korfez", d, 2)) continue;
    const full = ROOM_IDS.filter((id) => !stayFree(id, d, 2));
    if (full.length < 1 || full.length > 3) continue;
    if (full.includes("hidirlik") || full.includes("kosk")) return d;
    fallback ??= d;
  }
  return fallback ?? addDays(today, 7);
}
