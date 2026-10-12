// Turns the OpenStreetMap walks (content/yedipencere/route-geo.json) into what
// the strip draws: pieces (one surface each) and legs (one street each, with
// the turn into it). Values OSM does not hold (step counts on two flights,
// unknown surfaces) come from the sample-measurement table in
// content/yedipencere/arrival.ts and are flagged so the page can say "örnek ölçüm".

import geo from "@/content/yedipencere/route-geo.json";
import { SAMPLE, STREET_FIX } from "@/content/yedipencere/arrival";
import type { StartId } from "./arrival";
import { PACE, PACE_LUGGAGE } from "./arrival";

export type Surface = "paving_stones" | "sett" | "asphalt" | "stone" | "rock";
export type Turn = "straight" | "slight-right" | "right" | "sharp-right" | "slight-left" | "left" | "sharp-left";

type RawSeg = {
  name: string | null;
  nameEn: string | null;
  kind: string;
  surface: string | null;
  steps: number | null;
  incline: string | null;
  handrail: string | null;
  turn: string | null;
  at: number;
  m: number;
};
type RawWalk = { m: number; flights: number; stepsOsm: number; stepsUnknown: number; ele: [number, number | null][]; segments: RawSeg[]; landmarks: { name: string; nameEn: string | null; at: number; side: "left" | "right" }[] };

export type Piece = {
  at: number;
  m: number;
  kind: string;
  name: string | null;
  surface: Surface;
  surfaceSample: boolean;
  steps: number | null;
  stepsSample: boolean;
  dir: "up" | "down" | null;
  slope: boolean;
  handrail: boolean;
};

export type Leg = {
  at: number;
  m: number;
  name: string | null;
  kind: string;
  turn: Turn | null;
  pieces: Piece[];
  steps: number;
  stepsSample: boolean;
  dir: "up" | "down" | null;
  slope: boolean;
  surface: Surface;
  surfaceSample: boolean;
};

export type Walk = {
  start: StartId;
  luggage: boolean;
  hasLuggageWay: boolean;
  m: number;
  ele0: number;
  ele1: number;
  steps: number;
  stepsSample: boolean;
  flights: number;
  minutes: number;
  minutesLuggage: number;
  pieces: Piece[];
  legs: Leg[];
  landmarks: { name: string; nameEn: string | null; at: number; side: "left" | "right" }[];
};

const ROUTES = geo.routes as unknown as Record<StartId, { short: RawWalk; luggage: RawWalk | null }>;

const SURFACES: Record<string, Surface> = { paving_stones: "paving_stones", sett: "sett", cobblestone: "sett", asphalt: "asphalt", stone: "stone", rock: "rock", concrete: "asphalt" };

const fixName = (n: string | null) => (n ? (STREET_FIX[n] ?? n) : null);

function pieceOf(start: StartId, luggage: boolean, s: RawSeg): Piece {
  const name = fixName(s.name);
  const sample = SAMPLE.find((x) => (x.start === start || x.start === "*") && (x.luggage === undefined || x.luggage === luggage) && (x.at === undefined || x.at === s.at) && (x.name === undefined || x.name === name) && (x.kind === undefined || x.kind === s.kind));
  let surface = s.surface ? SURFACES[s.surface] : undefined;
  let surfaceSample = false;
  if (!surface) {
    surface = sample?.surface ?? (s.kind === "secondary" || s.kind === "service" ? "asphalt" : "paving_stones");
    surfaceSample = true;
  }
  let steps = s.kind === "steps" ? s.steps : null;
  let stepsSample = false;
  if (s.kind === "steps" && !steps) {
    steps = sample?.steps ?? Math.round(s.m / 0.6);
    stepsSample = true;
  }
  const dir = s.kind === "steps" ? ((s.incline as "up" | "down" | null) ?? sample?.dir ?? null) : null;
  return {
    at: s.at,
    m: s.m,
    kind: s.kind,
    name,
    surface,
    surfaceSample,
    steps,
    stepsSample,
    dir,
    slope: sample?.slope === true,
    handrail: s.handrail === "yes",
  };
}

/** Group pieces into legs a person would follow ("turn left into Mermerli Sokak, 206 m"). */
function legsOf(pieces: Piece[], turns: (string | null)[]): Leg[] {
  // an unnamed street piece between two pieces of the same street, met head on, is that street
  const named = pieces.map((p) => p.name);
  for (let i = 1; i < pieces.length - 1; i++) {
    if (!named[i] && pieces[i].kind === "residential" && named[i - 1] && named[i - 1] === named[i + 1] && /straight|slight/.test(turns[i] ?? "") && /straight|slight/.test(turns[i + 1] ?? "")) named[i] = named[i - 1];
  }
  const legs: Leg[] = [];
  pieces.forEach((p, i) => {
    const name = named[i];
    const prev = legs[legs.length - 1];
    const isSteps = p.kind === "steps";
    const tiny = !name && !isSteps && p.m <= 15 && i < pieces.length - 1;
    const same = prev && !isSteps && prev.kind !== "steps" && ((name && prev.name === name) || (!name && !prev.name && prev.kind === p.kind));
    if (same) {
      prev.m += p.m;
      prev.pieces.push(p);
      prev.slope ||= p.slope;
      return;
    }
    legs.push({
      at: p.at,
      m: p.m,
      name,
      kind: p.kind,
      turn: (turns[i] as Turn | null) ?? null,
      pieces: [p],
      steps: p.steps ?? 0,
      stepsSample: p.stepsSample,
      dir: p.dir,
      slope: p.slope,
      surface: p.surface,
      surfaceSample: p.surfaceSample,
    });
    // a short unnamed connector hands its turn on to the street that follows
    if (tiny) legs[legs.length - 1].kind = "connector";
  });
  // fold connectors into the next leg: the turn is what matters
  const out: Leg[] = [];
  for (let i = 0; i < legs.length; i++) {
    const l = legs[i];
    const next = legs[i + 1];
    if (l.kind === "connector" && next && next.kind !== "steps") {
      next.at = l.at;
      next.m += l.m;
      next.pieces = [...l.pieces, ...next.pieces];
      next.turn = l.turn === "straight" || !l.turn ? next.turn : l.turn;
      continue;
    }
    if (l.kind === "connector") l.kind = "footway";
    out.push(l);
  }
  // the dominant surface of each leg, by length
  for (const l of out) {
    const by = new Map<Surface, number>();
    let sample = false;
    for (const p of l.pieces) {
      by.set(p.surface, (by.get(p.surface) ?? 0) + p.m);
      sample ||= p.surfaceSample;
    }
    l.surface = [...by.entries()].sort((a, b) => b[1] - a[1])[0][0];
    l.surfaceSample = l.pieces.filter((p) => p.surface === l.surface).every((p) => p.surfaceSample) || (sample && l.pieces.length === 1);
  }
  return out;
}

export function walkOf(start: StartId, wantLuggage: boolean): Walk {
  const r = ROUTES[start];
  const luggage = wantLuggage && !!r.luggage;
  const raw = luggage && r.luggage ? r.luggage : r.short;
  const pieces = raw.segments.map((s) => pieceOf(start, luggage, s));
  const legs = legsOf(
    pieces,
    raw.segments.map((s) => s.turn),
  );
  const steps = pieces.reduce((s, p) => s + (p.steps ?? 0), 0);
  const m = raw.m;
  const ele = raw.ele.filter((e): e is [number, number] => e[1] !== null);
  return {
    start,
    luggage,
    hasLuggageWay: !!r.luggage,
    m,
    ele0: ele[0]?.[1] ?? 0,
    ele1: ele[ele.length - 1]?.[1] ?? 0,
    steps,
    stepsSample: pieces.some((p) => p.stepsSample),
    flights: pieces.filter((p) => p.kind === "steps").length,
    // a flight costs time too: about two seconds a step, three with a suitcase
    minutes: Math.max(1, Math.round(m / PACE + steps / 30)),
    minutesLuggage: Math.max(1, Math.round(m / PACE_LUGGAGE + steps / 20)),
    pieces,
    legs,
    landmarks: raw.landmarks,
  };
}

export const SOURCE_DATE = geo.fetched;
export const ELEVATOR = geo.elevator;
