// Sunrise and sunset at the (fictional) venue on the east shore of Lake Uluabat,
// from the NOAA general solar position equations. 40.17 N, 28.60 E, UTC+3
// (Türkiye has no daylight saving since 2016). Accurate to a minute or two for
// a flat horizon; hills across the lake can hide the sun a few minutes earlier.

const LAT = 40.17;
const LON = 28.6;
const TZ = 3;
const RAD = Math.PI / 180;

export type SunTimes = { rise: number; set: number }; // minutes after local midnight

export function sunTimes(d: Date): SunTimes {
  const start = Date.UTC(d.getFullYear(), 0, 0);
  const n = Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - start) / 864e5);
  const g = ((2 * Math.PI) / 365) * (n - 1);
  const eq =
    229.18 *
    (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl =
    0.006918 -
    0.399912 * Math.cos(g) +
    0.070257 * Math.sin(g) -
    0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) -
    0.002697 * Math.cos(3 * g) +
    0.00148 * Math.sin(3 * g);
  const ha =
    Math.acos(Math.cos(90.833 * RAD) / (Math.cos(LAT * RAD) * Math.cos(decl)) - Math.tan(LAT * RAD) * Math.tan(decl)) / RAD;
  return { rise: 720 - 4 * (LON + ha) - eq + TZ * 60, set: 720 - 4 * (LON - ha) - eq + TZ * 60 };
}

/** "20.39" */
export function clock(minutes: number): string {
  const m = Math.round(minutes);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}.${String(m % 60).padStart(2, "0")}`;
}

/** The ceremony starts 45 minutes before sunset, rounded to five minutes. */
export function ceremonyStart(d: Date): number {
  return Math.round((sunTimes(d).set - 45) / 5) * 5;
}

// Turkish locative suffix after a clock time read aloud ("20.39'da", "19.40'ta").
const ONES: Record<number, string> = { 1: "de", 2: "de", 3: "te", 4: "te", 5: "te", 6: "da", 7: "de", 8: "de", 9: "da" };
const TENS: Record<number, string> = { 0: "da", 10: "da", 20: "de", 30: "da", 40: "ta", 50: "de" };
const HOURS: Record<number, string> = { 0: "da", 1: "de", 2: "de", 3: "te", 4: "te", 5: "te", 6: "da", 7: "de", 8: "de", 9: "da", 10: "da", 11: "de", 12: "de", 13: "te", 14: "te", 15: "te", 16: "da", 17: "de", 18: "de", 19: "da", 20: "de", 21: "de", 22: "de", 23: "te" };

export function clockAt(minutes: number): string {
  const m = Math.round(minutes);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  let suffix: string;
  if (mm === 0) suffix = HOURS[h] ?? "de";
  else if (mm % 10) suffix = ONES[mm % 10];
  else suffix = TENS[mm];
  return `${clock(m)}’${suffix}`;
}
