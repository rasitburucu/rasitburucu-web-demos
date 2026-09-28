// Typical floor plans per typology, in metres. Areas are derived (w × h).
// Room labels are keys into tr.ts → rooms so they can be translated later.
import type { TypologyId } from "./villas";

export type RoomKind =
  | "living"
  | "kitchen"
  | "dining"
  | "bed"
  | "bath"
  | "stair"
  | "terrace"
  | "pool"
  | "green"
  | "house"
  | "study"
  | "utility";

export type Room = {
  label: string; // key into copy.rooms
  x: number;
  y: number;
  w: number;
  h: number;
  kind: RoomKind;
  /** outdoor spaces are drawn with a dashed edge and excluded from interior m² */
  outdoor?: boolean;
};

export type Level = { w: number; h: number; rooms: Room[] };
export type LevelId = "zemin" | "ust" | "cati" | "bahce";

const r = (label: string, x: number, y: number, w: number, h: number, kind: RoomKind, outdoor = false): Room => ({
  label,
  x,
  y,
  w,
  h,
  kind,
  outdoor,
});

export const plans: Record<TypologyId, Partial<Record<LevelId, Level>>> = {
  tas: {
    zemin: {
      w: 14,
      h: 13,
      rooms: [
        r("salon", 0, 0, 8, 6, "living"),
        r("mutfak", 8, 0, 6, 4, "kitchen"),
        r("yemek", 8, 4, 6, 4, "dining"),
        r("giris", 0, 6, 3, 4, "stair"),
        r("misafir", 3, 6, 5, 4, "bed"),
        r("banyo", 8, 8, 3, 2, "bath"),
        r("kiler", 11, 8, 3, 2, "utility"),
        r("teras", 0, 10, 14, 3, "terrace", true),
      ],
    },
    ust: {
      w: 13,
      h: 8,
      rooms: [
        r("ebeveyn", 0, 0, 6, 5, "bed"),
        r("ebeveynBanyo", 6, 0, 3, 3, "bath"),
        r("giyinme", 6, 3, 3, 2, "utility"),
        r("yatak", 9, 0, 4, 5, "bed"),
        r("hol", 0, 5, 5, 3, "stair"),
        r("banyo", 5, 5, 3, 3, "bath"),
        r("balkon", 8, 5, 5, 3, "terrace", true),
      ],
    },
    bahce: {
      w: 30,
      h: 30,
      rooms: [
        r("zeytinlik", 0, 0, 30, 9, "green", true),
        r("ev", 8, 9, 14, 10, "house"),
        r("teras", 8, 19, 14, 3, "terrace", true),
        r("havuz", 10, 23, 10, 4, "pool", true),
        r("bahce", 0, 9, 8, 21, "green", true),
      ],
    },
  },
  zeytin: {
    zemin: {
      w: 16,
      h: 14,
      rooms: [
        r("salon", 0, 0, 9, 6, "living"),
        r("mutfak", 9, 0, 7, 4, "kitchen"),
        r("yemek", 9, 4, 7, 4, "dining"),
        r("misafir", 0, 6, 5, 5, "bed"),
        r("banyo", 5, 6, 4, 3, "bath"),
        r("giris", 5, 9, 4, 2, "stair"),
        r("kiler", 9, 8, 3, 3, "utility"),
        r("konukWc", 12, 8, 2, 3, "bath"),
        r("camasir", 14, 8, 2, 3, "utility"),
        r("teras", 0, 11, 16, 3, "terrace", true),
      ],
    },
    ust: {
      w: 15,
      h: 9,
      rooms: [
        r("ebeveyn", 0, 0, 7, 5, "bed"),
        r("ebeveynBanyo", 7, 0, 4, 3, "bath"),
        r("giyinme", 7, 3, 4, 2, "utility"),
        r("yatak", 11, 0, 4, 5, "bed"),
        r("yatak", 0, 5, 5, 4, "bed"),
        r("banyo", 5, 5, 3, 4, "bath"),
        r("hol", 8, 5, 3, 4, "stair"),
        r("balkon", 11, 5, 4, 4, "terrace", true),
      ],
    },
    cati: {
      w: 15,
      h: 9,
      rooms: [
        r("catiTerasi", 0, 0, 11, 9, "terrace", true),
        r("merdiven", 11, 0, 4, 4, "stair"),
        r("pergola", 11, 4, 4, 5, "terrace", true),
      ],
    },
    bahce: {
      w: 34,
      h: 32,
      rooms: [
        r("zeytinlik", 0, 0, 34, 8, "green", true),
        r("ev", 9, 8, 16, 11, "house"),
        r("teras", 9, 19, 16, 3, "terrace", true),
        r("havuz", 11, 23, 12, 4, "pool", true),
        r("bahce", 0, 8, 9, 24, "green", true),
      ],
    },
  },
  kule: {
    zemin: {
      w: 18,
      h: 15,
      rooms: [
        r("salon", 0, 0, 10, 7, "living"),
        r("mutfak", 10, 0, 8, 5, "kitchen"),
        r("yemek", 10, 5, 8, 4, "dining"),
        r("misafir", 0, 7, 5, 5, "bed"),
        r("banyo", 5, 7, 5, 3, "bath"),
        r("giris", 5, 10, 5, 2, "stair"),
        r("kiler", 10, 9, 4, 3, "utility"),
        r("konukWc", 14, 9, 2, 3, "bath"),
        r("camasir", 16, 9, 2, 3, "utility"),
        r("teras", 0, 12, 18, 3, "terrace", true),
      ],
    },
    ust: {
      w: 17,
      h: 10,
      rooms: [
        r("ebeveyn", 0, 0, 8, 5, "bed"),
        r("ebeveynBanyo", 8, 0, 4, 3, "bath"),
        r("giyinme", 8, 3, 4, 2, "utility"),
        r("yatak", 12, 0, 5, 5, "bed"),
        r("yatak", 0, 5, 5, 5, "bed"),
        r("banyo", 5, 5, 3, 5, "bath"),
        r("hol", 8, 5, 4, 5, "stair"),
        r("yatak", 12, 5, 5, 5, "bed"),
      ],
    },
    cati: {
      w: 17,
      h: 10,
      rooms: [
        r("kuleOdasi", 11, 0, 6, 6, "study"),
        r("catiTerasi", 0, 0, 11, 10, "terrace", true),
        r("merdiven", 11, 6, 3, 4, "stair"),
        r("seyirTerasi", 14, 6, 3, 4, "terrace", true),
      ],
    },
    bahce: {
      w: 38,
      h: 36,
      rooms: [
        r("zeytinlik", 0, 0, 38, 9, "green", true),
        r("ev", 10, 9, 18, 12, "house"),
        r("teras", 10, 21, 18, 3, "terrace", true),
        r("havuz", 12, 25, 14, 4, "pool", true),
        r("bahce", 0, 9, 10, 27, "green", true),
      ],
    },
  },
};

export const roomArea = (room: Room) => room.w * room.h;
