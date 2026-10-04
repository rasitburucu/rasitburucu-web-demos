// Config <-> URL search params. Only product, line, pallet and payback numbers
// go into the address; nothing personal (name, company, e-mail) ever does.

import { DEFAULT_CONFIG, sanitize, type Config, type ModelId, type PatternChoice } from "./plan";

const KIND = { k: "koli", t: "torba", s: "shrink" } as const;
const PALLET = { e: "eur", i: "end", o: "ozel" } as const;
const PATTERN = { o: "oto", s: "sutun", r: "orgu", f: "firildak" } as const;
const MODE = { s: "satin", k: "kira" } as const;

const rev = <T extends Record<string, string>>(m: T) => Object.fromEntries(Object.entries(m).map(([a, b]) => [b, a])) as Record<T[keyof T], keyof T>;
const KIND_R = rev(KIND);
const PALLET_R = rev(PALLET);
const PATTERN_R = rev(PATTERN);
const MODE_R = rev(MODE);

export function encodeConfig(c: Config, extra?: { model?: ModelId | null; step?: number }): string {
  const p = new URLSearchParams();
  p.set("t", KIND_R[c.kind]);
  p.set("u", String(c.u));
  p.set("g", String(c.g));
  p.set("y", String(c.y));
  p.set("kg", String(c.kg));
  p.set("dk", String(c.rate));
  if (c.lines !== 1) p.set("h", String(c.lines));
  p.set("v", String(c.shifts));
  p.set("p", PALLET_R[c.pallet]);
  if (c.pallet === "ozel") {
    p.set("pl", String(c.pl));
    p.set("pw", String(c.pw));
  }
  p.set("my", String(c.maxH));
  if (c.sheet) p.set("ak", "1");
  if (c.pattern !== "oto") p.set("d", PATTERN_R[c.pattern]);
  if (c.people !== DEFAULT_CONFIG.people) p.set("ki", String(c.people));
  if (c.wage) p.set("ml", String(c.wage));
  if (c.invest) p.set("yt", String(c.invest));
  if (c.mode !== "satin") p.set("md", MODE_R[c.mode]);
  if (c.rent) p.set("kr", String(c.rent));
  if (extra?.model) p.set("m", extra.model);
  if (extra?.step) p.set("a", String(extra.step));
  return p.toString();
}

export function decodeConfig(search: string): { config: Config; model: ModelId | null; step: number | null; found: boolean } {
  const p = new URLSearchParams(search);
  const num = (k: string, d: number) => {
    const v = p.get(k);
    if (v === null || v.trim() === "") return d;
    const n = Number(v.replace(",", "."));
    return Number.isFinite(n) ? n : d;
  };
  const pick = <T extends Record<string, string>>(m: T, k: string, d: T[keyof T]): T[keyof T] => {
    const v = p.get(k);
    return v && v in m ? m[v as keyof T] : d;
  };
  const d = DEFAULT_CONFIG;
  const lines = num("h", 1);
  const shifts = num("v", d.shifts);
  const config = sanitize({
    kind: pick(KIND, "t", d.kind),
    u: num("u", d.u),
    g: num("g", d.g),
    y: num("y", d.y),
    kg: num("kg", d.kg),
    rate: num("dk", d.rate),
    lines: lines === 2 ? 2 : 1,
    shifts: shifts === 1 || shifts === 3 ? shifts : 2,
    pallet: pick(PALLET, "p", d.pallet),
    pl: num("pl", d.pl),
    pw: num("pw", d.pw),
    maxH: num("my", d.maxH),
    sheet: p.get("ak") === "1",
    pattern: pick(PATTERN, "d", d.pattern) as PatternChoice,
    people: num("ki", d.people),
    wage: num("ml", d.wage),
    invest: num("yt", d.invest),
    mode: pick(MODE, "md", d.mode),
    rent: num("kr", d.rent),
  });
  const m = p.get("m");
  const model = m === "p12" || m === "p20" || m === "p30" ? m : null;
  const a = Number(p.get("a"));
  const step = Number.isInteger(a) && a >= 1 && a <= 6 ? a : null;
  const found = ["u", "g", "kg", "dk", "t"].some((k) => p.has(k));
  return { config, model, step, found };
}
