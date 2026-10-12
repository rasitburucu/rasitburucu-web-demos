// "Kapıdan kapıya": the five real start points and the four ways guests arrive.
// Route geometry and lengths come from content/yedipencere/route-geo.json
// (OpenStreetMap, built by scripts/fetch-yedipencere-route.mjs).

export type ModeId = "havalimani" | "otogar" | "arac" | "marina";
export type StartId = "kalekapisi" | "ismetpasa" | "hadrian" | "cumhuriyet" | "marina";

export const MODE_IDS: ModeId[] = ["havalimani", "otogar", "arac", "marina"];
export const START_IDS: StartId[] = ["kalekapisi", "ismetpasa", "hadrian", "cumhuriyet", "marina"];

/** Where each kind of arrival starts walking, most likely first. */
export const MODES: Record<ModeId, StartId[]> = {
  havalimani: ["kalekapisi", "ismetpasa"],
  otogar: ["ismetpasa", "kalekapisi"],
  arac: ["hadrian", "cumhuriyet"],
  marina: ["marina"],
};

export const isModeId = (s: unknown): s is ModeId => typeof s === "string" && (MODE_IDS as string[]).includes(s);
export const isStartId = (s: unknown): s is StartId => typeof s === "string" && (START_IDS as string[]).includes(s);

/** Walking pace, metres per minute: unhurried, and with a suitcase on stone. */
export const PACE = 75;
export const PACE_LUGGAGE = 58;
