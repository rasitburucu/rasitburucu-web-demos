// What the plan says about a choice: fits, too many guests, area taken that day,
// pier chosen for a dinner, or a layout the area does not offer.

import { areaState, dayStates, parseIso } from "./availability";
import { capacity, layout, setupFor, type Layout } from "./plan";
import { AREAS, VENUE, type AreaKey, type Ceremony, type Setup } from "./venue";

export type Assessment =
  | { kind: "ok"; layout: Layout; cap: number }
  | { kind: "over"; layout: Layout; cap: number; suggest: AreaKey | null }
  | { kind: "busy"; closed: boolean; free: AreaKey[]; held: AreaKey[] }
  | { kind: "iskele" }
  | { kind: "nosetup"; setup: Setup };

export type AssessInput = { date?: string; area: AreaKey; ceremony: Ceremony; guests: number; setup?: Setup };

export function assess({ date, area, ceremony, guests, setup }: AssessInput): Assessment {
  if (date) {
    const d = parseIso(date);
    const st = areaState(d, area);
    if (st === "dolu" || st === "kapali") {
      const ok = (a: AreaKey) => a !== area && (a !== "iskele" || ceremony === "nikah") && capacity(a, ceremony, setup) >= guests;
      const ds = dayStates(d);
      const free = ds.filter(([a, s]) => s === "bos" && ok(a)).map(([a]) => a);
      const held = ds.filter(([a, s]) => s === "opsiyon" && ok(a)).map(([a]) => a);
      return { kind: "busy", closed: st === "kapali", free, held };
    }
  }
  if (area === "iskele" && ceremony !== "nikah") return { kind: "iskele" };
  const s = setupFor(ceremony, setup);
  const cap = capacity(area, ceremony, setup);
  if (!cap) return { kind: "nosetup", setup: s };
  const l = layout({ area, ceremony, guests: Math.min(guests, cap), setup });
  if (guests > cap) {
    const order = AREAS.filter((a) => a !== area && (a !== "iskele" || ceremony === "nikah")).sort((a, b) => capacity(a, ceremony, setup) - capacity(b, ceremony, setup));
    const free = (a: AreaKey) => !date || areaState(parseIso(date), a) === "bos" || areaState(parseIso(date), a) === "opsiyon";
    const suggest = order.find((a) => capacity(a, ceremony, setup) >= guests && free(a)) ?? null;
    return { kind: "over", layout: l, cap, suggest };
  }
  return { kind: "ok", layout: l, cap };
}

/** Seated capacity range shown on area cards. */
export const capRange = (a: AreaKey) => [VENUE[a].min, VENUE[a].cap] as const;
