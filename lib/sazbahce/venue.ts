// Sazbahçe venue data. Fictional: capacities, seasons and the occupancy below are
// sample data for the concept and are labelled "örnek" wherever they are shown.

export type AreaKey = "cayir" | "ambar" | "avlu" | "iskele";
export type Ceremony = "nikah" | "kina" | "nisan" | "dugun" | "kurumsal";
export type Slot = "ogle" | "gunbatimi" | "aksam";
/** Seating layouts. Weddings use "yuvarlak"; the corporate planner offers all. */
export type Setup = "yuvarlak" | "uzun" | "tiyatro" | "sinif" | "u" | "kokteyl";

export const AREAS: AreaKey[] = ["cayir", "ambar", "avlu", "iskele"];
export const CEREMONIES: Ceremony[] = ["nikah", "kina", "nisan", "dugun", "kurumsal"];
export const SLOTS: Slot[] = ["ogle", "gunbatimi", "aksam"];
export const SETUPS: Setup[] = ["yuvarlak", "uzun", "tiyatro", "sinif", "u", "kokteyl"];

export type AreaData = {
  /** Seated wedding capacity (round tables, 10 per table). */
  cap: number;
  min: number;
  outdoor: boolean;
  /** Ceremony only: no dinner on the pier. */
  ceremonyOnly?: boolean;
  /** People per setup; missing = not offered there. */
  setups: Partial<Record<Setup, number>>;
  /** Approximate usable area in square metres. */
  m2: number;
};

export const VENUE: Record<AreaKey, AreaData> = {
  cayir: { cap: 360, min: 80, outdoor: true, m2: 1450, setups: { yuvarlak: 360, uzun: 240, tiyatro: 400, kokteyl: 450 } },
  ambar: { cap: 200, min: 40, outdoor: false, m2: 375, setups: { yuvarlak: 200, uzun: 160, tiyatro: 220, sinif: 110, u: 48, kokteyl: 260 } },
  avlu: { cap: 140, min: 30, outdoor: true, m2: 230, setups: { yuvarlak: 140, uzun: 96, tiyatro: 120, u: 36, kokteyl: 180 } },
  iskele: { cap: 90, min: 10, outdoor: true, ceremonyOnly: true, m2: 120, setups: { tiyatro: 90 } },
};

export const GUESTS = { min: 20, max: 400, step: 10 };

/** Months (0-11) the open-air areas take events: April to October. */
export const OPEN_SEASON = { from: 3, to: 9 };

/** Earliest and latest months the calendar shows. */
export const CAL_RANGE = { from: new Date(2026, 9, 1), to: new Date(2027, 11, 1) };
