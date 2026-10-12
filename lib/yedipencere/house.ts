// The fictional house: seven rooms, their numbers and the stairs between the
// street door and each room's door. Words live in content/yedipencere; this
// file holds only facts the drawings and the price sums need.
//
// Datum: the taşlık floor is ±0,00 (the lane outside is one step lower).
// Main stair 20 × 17 cm = 3,40 m; köşk stair 14 × 23 cm = 3,22 m.

export type RoomId = "taslik" | "avlu" | "cumba" | "sofa" | "korfez" | "hidirlik" | "kosk";
export type Side = "sokak" | "avlu" | "deniz";
export type Floor = "zemin" | "birinci" | "kosk";
export type WindowKind = "barred" | "single" | "cumba" | "band";
export type FlightId = "esik" | "avluKapi" | "ana" | "denizKanadi" | "koskMerdiveni" | "koskOda";

export type Flight = {
  n: number;
  /** riser height, cm */
  riser: number;
  rail: "both" | "one" | "rope" | "none";
  /** clear width, cm */
  width: number;
};

export const FLIGHTS: Record<FlightId, Flight> = {
  esik: { n: 1, riser: 16, rail: "none", width: 160 },
  avluKapi: { n: 1, riser: 15, rail: "none", width: 95 },
  ana: { n: 20, riser: 17, rail: "both", width: 110 },
  denizKanadi: { n: 2, riser: 17, rail: "none", width: 100 },
  koskMerdiveni: { n: 14, riser: 23, rail: "rope", width: 70 },
  koskOda: { n: 2, riser: 17, rail: "none", width: 90 },
};

export type Room = {
  id: RoomId;
  name: string;
  side: Side;
  floor: Floor;
  flights: FlightId[];
  steps: number;
  /** floor level of the room, m above the taşlık floor */
  level: number;
  /** clear ceiling height, m (to the ridge in the köşk rooms) */
  ceiling: number;
  m2: number;
  /** guests; the third sleeps on the divan or in the sitting corner */
  capacity: 2 | 3;
  /** sample price per night, TL, breakfast for two included */
  price: number;
  window: WindowKind;
};

const steps = (f: FlightId[]) => f.reduce((s, id) => s + FLIGHTS[id].n, 0);
const r = (o: Omit<Room, "steps">): Room => ({ ...o, steps: steps(o.flights) });

/** In the order of the drawing: lane, courtyard, sea; lower floor first. */
export const ROOMS: Room[] = [
  r({ id: "taslik", name: "Taşlık", side: "sokak", floor: "zemin", flights: ["esik"], level: 0, ceiling: 3.15, m2: 17, capacity: 2, price: 4600, window: "barred" }),
  r({ id: "cumba", name: "Cumba", side: "sokak", floor: "birinci", flights: ["esik", "ana"], level: 3.4, ceiling: 3.0, m2: 20, capacity: 3, price: 5900, window: "cumba" }),
  r({ id: "avlu", name: "Avlu", side: "avlu", floor: "zemin", flights: ["esik", "avluKapi"], level: 0.15, ceiling: 3.1, m2: 18, capacity: 2, price: 5200, window: "single" }),
  r({ id: "sofa", name: "Sofa", side: "avlu", floor: "birinci", flights: ["esik", "ana"], level: 3.4, ceiling: 3.2, m2: 26, capacity: 3, price: 7400, window: "single" }),
  r({ id: "korfez", name: "Körfez", side: "deniz", floor: "birinci", flights: ["esik", "ana", "denizKanadi"], level: 3.74, ceiling: 2.9, m2: 22, capacity: 2, price: 8600, window: "single" }),
  r({ id: "hidirlik", name: "Hıdırlık", side: "deniz", floor: "kosk", flights: ["esik", "ana", "koskMerdiveni"], level: 6.62, ceiling: 2.9, m2: 19, capacity: 2, price: 9200, window: "single" }),
  r({ id: "kosk", name: "Köşk", side: "deniz", floor: "kosk", flights: ["esik", "ana", "koskMerdiveni", "koskOda"], level: 6.96, ceiling: 3.1, m2: 28, capacity: 3, price: 12400, window: "band" }),
];

export const ROOM_IDS = ROOMS.map((x) => x.id);
export const ROOM = Object.fromEntries(ROOMS.map((x) => [x.id, x])) as Record<RoomId, Room>;
export const isRoomId = (s: unknown): s is RoomId => typeof s === "string" && (ROOM_IDS as string[]).includes(s);
/** Fewest steps first: the order of the step profile and the two-week table. */
export const BY_STEPS: RoomId[] = [...ROOMS].sort((a, b) => a.steps - b.steps || ROOM_IDS.indexOf(a.id) - ROOM_IDS.indexOf(b.id)).map((x) => x.id);

export const SIDES: { id: Side; rooms: RoomId[] }[] = [
  { id: "sokak", rooms: ["taslik", "cumba"] },
  { id: "avlu", rooms: ["avlu", "sofa"] },
  { id: "deniz", rooms: ["korfez", "hidirlik", "kosk"] },
];

/** Sample price for the third guest, per night. */
export const EXTRA_GUEST = 1400;
export const MAX_GUESTS = 3;
export const MAX_NIGHTS = 14;
export const CHECK_IN = "14.00";
export const CHECK_OUT = "11.00";
