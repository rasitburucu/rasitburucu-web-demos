// Geometry of the house section and each room's way through it (metres:
// x along the section from the street wall, y above the taşlık floor).

import type { RoomId } from "@/lib/yedipencere/house";
import { f } from "./geom";

export const S = 34;
export const SX = (m: number) => f(100 + m * S);
export const SY = (m: number) => f(380 - m * S);

type Pt = [number, number];
type Leg = { to: Pt; n?: number };

const COMMON: Leg[] = [{ to: [-0.05, -0.16] }, { to: [0.3, 0], n: 1 }];
const ROUTES: Record<RoomId, Leg[]> = {
  taslik: [...COMMON, { to: [3.35, 0] }],
  avlu: [...COMMON, { to: [8.15, 0] }, { to: [8.5, 0.15], n: 1 }, { to: [8.7, 0.15] }],
  cumba: [...COMMON, { to: [4.9, 0] }, { to: [9.6, 3.4], n: 20 }, { to: [2.2, 3.4] }],
  sofa: [...COMMON, { to: [4.9, 0] }, { to: [9.6, 3.4], n: 20 }, { to: [7.6, 3.4] }],
  korfez: [...COMMON, { to: [4.9, 0] }, { to: [9.6, 3.4], n: 20 }, { to: [12.2, 3.4] }, { to: [12.6, 3.74], n: 2 }, { to: [14.4, 3.74] }],
  hidirlik: [...COMMON, { to: [4.9, 0] }, { to: [9.6, 3.4], n: 20 }, { to: [10.1, 3.4] }, { to: [12.5, 6.62], n: 14 }, { to: [13.3, 6.62] }],
  kosk: [...COMMON, { to: [4.9, 0] }, { to: [9.6, 3.4], n: 20 }, { to: [10.1, 3.4] }, { to: [12.5, 6.62], n: 14 }, { to: [14.2, 6.62] }, { to: [14.6, 6.96], n: 2 }, { to: [15.6, 6.96] }],
};
const START: Pt = [-1.9, -0.16];
const LIFT = 0.14; // the line walks a little above the floor

export type SectionRoute = { d: string; end: Pt; flights: { n: number; x: number; y: number }[] };

export function routeOf(room: RoomId): SectionRoute {
  let [cx, cy] = START;
  let d = `M${SX(cx)} ${SY(cy + LIFT)}`;
  const flights: SectionRoute["flights"] = [];
  for (const leg of ROUTES[room]) {
    const [tx, ty] = leg.to;
    if (leg.n) {
      const dx = (tx - cx) / leg.n;
      const dy = (ty - cy) / leg.n;
      for (let i = 0; i < leg.n; i++) d += `V${SY(cy + LIFT + dy * (i + 1))}H${SX(cx + dx * (i + 1))}`;
      flights.push({ n: leg.n, x: SX((cx + tx) / 2), y: SY((cy + ty) / 2) });
    } else d += `H${SX(tx)}V${SY(ty + LIFT)}`;
    [cx, cy] = [tx, ty];
  }
  return { d, end: [SX(cx), SY(cy + LIFT)], flights };
}

/** Where room names sit on the section. */
export const TAGS: Record<RoomId, Pt> = {
  taslik: [3.35, 2.65],
  avlu: [8.7, 2.65],
  cumba: [2.2, 5.35],
  sofa: [7.6, 5.95],
  korfez: [14.4, 5.4],
  hidirlik: [13.3, 8.3],
  kosk: [15.6, 8.62],
};

/** Numbered parts for the house page. */
export const PARTS: Pt[] = [
  [-0.55, 1.5], // 1 street door
  [2.0, 0.7], // 2 taşlık
  [6.1, 4.85], // 3 courtyard and orange tree
  [8.5, -1.75], // 4 cistern
  [6.9, 1.35], // 5 timber stair
  [9.2, 4.25], // 6 sofa
  [-0.45, 5.6], // 7 cumba
  [13.3, 1.7], // 8 sea wing and city wall
  [14.4, 10.05], // 9 belvedere
  [17.2, -1.7], // 10 cliff
];
