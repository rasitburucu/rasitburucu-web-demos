// Vaziyet: the plot check behind "Evi almadan önce arsanıza koyun".
// Pure geometry and arithmetic: no text (the words live in content/vaziyet/tr.ts).
//
// Plot frame: metres, x along the road frontage (0..W), y from the road edge
// into the plot (0..D). The buildable area is the plot minus the front, side
// and back setbacks (PAİY md. 23 minimums are the defaults). Height is checked
// at the eave (PAİY md. 4, "bina yüksekliği"). TAKS on the footprint, KAKS on
// the total closed area. All of it is an estimate: the tool looks at the
// numbers it is given and nothing else.
import { MODELLER, modelBul, type Model, type ModelId } from "@/content/vaziyet/modeller";
import mesafe from "@/content/vaziyet/mesafe.json";

export type Yon = "K" | "KD" | "D" | "GD" | "G" | "GB" | "B" | "KB";
export const YONLER: Yon[] = ["K", "KD", "D", "GD", "G", "GB", "B", "KB"];
export const YON_ACI: Record<Yon, number> = { K: 0, KD: 45, D: 90, GD: 135, G: 180, GB: 225, B: 270, KB: 315 };
export type Nitelik = "arsa" | "tarla" | "bilmiyorum";
export type Donus = 0 | 90 | 180 | 270;

export type Durum = {
  W: number;
  D: number;
  nitelik: Nitelik;
  taks: number;
  kaks: number;
  on: number;
  yan: number;
  arka: number;
  hmax: number;
  /** the side of the plot the road is on */
  yol: Yon;
  model: ModelId;
  rot: Donus;
  /** the house's corner nearest the road and the left boundary; null = default placement */
  x: number | null;
  y: number | null;
  /** province plate number, for the transport line */
  il: number;
};

export const VARSAYILAN: Durum = {
  W: 30,
  D: 22,
  nitelik: "arsa",
  taks: 0.3,
  kaks: 0.6,
  on: 5,
  yan: 3,
  arka: 3,
  hmax: 6.5,
  yol: "K",
  model: "sofa",
  rot: 0,
  x: null,
  y: null,
  il: 16,
};

/** PAİY md. 23: front, side and back garden minimums when the plan says nothing else */
export const YONETMELIK = { on: 5, yan: 3, arka: 3 } as const;

/** accepted input ranges; outside them the field is flagged and the last good value stays */
export const SINIR = {
  W: [6, 200],
  D: [6, 200],
  taks: [0.05, 1],
  kaks: [0.05, 5],
  on: [0, 30],
  yan: [0, 30],
  arka: [0, 30],
  hmax: [2.5, 40],
} as const;
export type SayiAlan = keyof typeof SINIR;

export type Dik = { x0: number; y0: number; x1: number; y1: number };
export type Taraf = "sol" | "sag" | "on" | "arka";
export type Tasma = { taraf: Taraf; m: number; r: Dik };

export type Ihlal =
  | { kural: "alan" }
  | { kural: "yan"; sol: number; sag: number }
  | { kural: "on"; m: number }
  | { kural: "arka"; m: number }
  | { kural: "taks"; taban: number; hak: number }
  | { kural: "kaks"; toplam: number; hak: number }
  | { kural: "hmax"; sacak: number; sinir: number };

export type Oneri =
  | { tur: "cevir"; rot: Donus }
  | { tur: "yerlestir" }
  | { tur: "salon"; rot: Donus; yon: Yon }
  | { tur: "model"; model: ModelId }
  | { tur: "yok" };

export type Maliyet = {
  ev: number;
  il: string;
  km: number;
  tir: number;
  nakliye: [number, number];
  temel: [number, number];
  montaj: [number, number];
  vinc: [number, number];
  toplam: [number, number];
};

export type Sonuc = {
  m: Model;
  w: number;
  d: number;
  ev: Dik;
  b: Dik;
  alanVar: boolean;
  alan: number;
  taksHak: number;
  kaksHak: number;
  tasmalar: Tasma[];
  ihlaller: Ihlal[];
  /** the four rule rows of the card */
  kurallar: { cekme: boolean; taks: boolean; kaks: boolean; hmax: boolean };
  sigar: boolean;
  bahce: number;
  salonAci: number;
  salonYon: Yon;
  /** plan vectors (x right, y away from the road) */
  salonN: [number, number];
  kuzey: [number, number];
  oneri: Oneri | null;
  maliyet: Maliyet;
};

// ------------------------------------------------------------------ cost [örnek]
export const BIRIM = {
  nakliyeSabit: 12000, // per truck: loading, permits, the first kilometres
  nakliyeKm: 45, // per truck per road km
  nakliyeAralik: [0.9, 1.15] as const, // road, season, return load
  temelM2: [2800, 3500] as const, // raft foundation, per m² of footprint; the soil report decides
  montajM2: [450, 650] as const, // assembly crew, per m² of closed area
  vincGun: [12000, 18000] as const, // mobile crane, per day
};

const EPS = 1e-6;
const yuvarla = (n: number, k = 1000) => Math.round(n / k) * k;
export const snap = (v: number) => Math.round(v * 2) / 2;
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

export function ilBul(plaka: number) {
  return mesafe.iller.find((i) => i.plaka === plaka) ?? mesafe.iller.find((i) => i.plaka === 16)!;
}

export function maliyet(m: Model, plaka: number): Maliyet {
  const il = ilBul(plaka);
  const tirBedel = BIRIM.nakliyeSabit + BIRIM.nakliyeKm * il.km;
  const nakliye: [number, number] = [yuvarla(m.tir * tirBedel * BIRIM.nakliyeAralik[0]), yuvarla(m.tir * tirBedel * BIRIM.nakliyeAralik[1])];
  const temel: [number, number] = [yuvarla(m.taban * BIRIM.temelM2[0]), yuvarla(m.taban * BIRIM.temelM2[1])];
  const montaj: [number, number] = [yuvarla(m.m2 * BIRIM.montajM2[0]), yuvarla(m.m2 * BIRIM.montajM2[1])];
  const vinc: [number, number] = [m.vincGun * BIRIM.vincGun[0], m.vincGun * BIRIM.vincGun[1]];
  const toplam: [number, number] = [
    m.fiyat + nakliye[0] + temel[0] + montaj[0] + vinc[0],
    m.fiyat + nakliye[1] + temel[1] + montaj[1] + vinc[1],
  ];
  return { ev: m.fiyat, il: il.ad, km: il.km, tir: m.tir, nakliye, temel, montaj, vinc, toplam };
}

// ------------------------------------------------------------------ geometry
export function olcu(m: Model, rot: Donus) {
  const yatay = rot % 180 !== 0;
  return { w: yatay ? m.d : m.w, d: yatay ? m.w : m.d };
}

export function yapilasma(d: Pick<Durum, "W" | "D" | "on" | "yan" | "arka">): Dik {
  return { x0: d.yan, x1: d.W - d.yan, y0: d.on, y1: d.D - d.arka };
}

/** where the house goes when nobody has moved it: centred across, a metre behind the front line */
export function varsayilanKonum(w: number, dd: number, b: Dik, W: number): [number, number] {
  const bw = b.x1 - b.x0;
  const bd = b.y1 - b.y0;
  const x = w <= bw + EPS ? b.x0 + (bw - w) / 2 : (W - w) / 2;
  const y = dd <= bd + EPS ? b.y0 + Math.min(1, bd - dd) : b.y0;
  return [x, y];
}

/** keep the house on the plot (it may still cross the setback lines) */
export function plotaSigdir(x: number, y: number, w: number, dd: number, W: number, D: number): [number, number] {
  const nx = w > W ? (W - w) / 2 : clamp(x, 0, W - w);
  const ny = dd > D ? (D - dd) / 2 : clamp(y, 0, D - dd);
  return [nx, ny];
}

/** move the house the least distance that puts it inside the buildable area, if its size allows */
function alanaSigdir(x: number, y: number, w: number, dd: number, b: Dik): [number, number] | null {
  if (w > b.x1 - b.x0 + EPS || dd > b.y1 - b.y0 + EPS) return null;
  return [clamp(x, b.x0, b.x1 - w), clamp(y, b.y0, b.y1 - dd)];
}

export function konum(d: Durum): { x: number; y: number; w: number; d: number } {
  const m = modelBul(d.model) ?? MODELLER[1];
  const { w, d: dd } = olcu(m, d.rot);
  const b = yapilasma(d);
  let x: number;
  let y: number;
  if (d.x === null || d.y === null) [x, y] = varsayilanKonum(w, dd, b, d.W);
  else [x, y] = [d.x, d.y];
  [x, y] = plotaSigdir(x, y, w, dd, d.W, d.D);
  return { x, y, w, d: dd };
}

/** turn the house a quarter (or to `hedef`) about its centre, then pull it inside the lines if it fits */
export function cevir(d: Durum, hedef?: Donus): Durum {
  const rot = (hedef ?? (((d.rot + 90) % 360) as Donus)) as Donus;
  const m = modelBul(d.model) ?? MODELLER[1];
  const k = konum(d);
  const cx = k.x + k.w / 2;
  const cy = k.y + k.d / 2;
  const { w, d: dd } = olcu(m, rot);
  let x = cx - w / 2;
  let y = cy - dd / 2;
  const b = yapilasma(d);
  const ic = alanaSigdir(x, y, w, dd, b);
  if (ic) [x, y] = ic;
  [x, y] = plotaSigdir(x, y, w, dd, d.W, d.D);
  return { ...d, rot, x, y };
}

/** put the house inside the buildable area with the smallest move */
export function yerlestir(d: Durum): Durum {
  const k = konum(d);
  const ic = alanaSigdir(k.x, k.y, k.w, k.d, yapilasma(d));
  return ic ? { ...d, x: ic[0], y: ic[1] } : { ...d, x: null, y: null };
}

const yon8 = (aci: number): Yon => YONLER[Math.round((((aci % 360) + 360) % 360) / 45) % 8];

function salonAcisi(yol: Yon, rot: Donus) {
  const yukari = (YON_ACI[yol] + 180) % 360; // bearing of "away from the road"
  return (yukari + rot) % 360;
}

const guneyeUzaklik = (aci: number) => Math.abs(((aci - 180 + 540) % 360) - 180);

/** does model m fit plot d in some quarter turn, by size and by the plan ratios? */
function sigarMi(m: Model, d: Durum) {
  const b = yapilasma(d);
  const bw = b.x1 - b.x0;
  const bd = b.y1 - b.y0;
  if (bw <= 0 || bd <= 0) return false;
  const alan = d.W * d.D;
  const boy = (m.w <= bw + EPS && m.d <= bd + EPS) || (m.d <= bw + EPS && m.w <= bd + EPS);
  return boy && m.taban <= d.taks * alan + EPS && m.m2 <= d.kaks * alan + EPS && m.sacak <= d.hmax + EPS;
}

export function hesapla(d: Durum): Sonuc {
  const m = modelBul(d.model) ?? MODELLER[1];
  const k = konum(d);
  const ev: Dik = { x0: k.x, y0: k.y, x1: k.x + k.w, y1: k.y + k.d };
  const b = yapilasma(d);
  const alanVar = b.x1 - b.x0 > 0.5 && b.y1 - b.y0 > 0.5;
  const alan = d.W * d.D;
  const taksHak = d.taks * alan;
  const kaksHak = d.kaks * alan;

  const tasmalar: Tasma[] = [];
  if (alanVar) {
    if (ev.x0 < b.x0 - EPS) tasmalar.push({ taraf: "sol", m: b.x0 - ev.x0, r: { ...ev, x1: Math.min(ev.x1, b.x0) } });
    if (ev.x1 > b.x1 + EPS) tasmalar.push({ taraf: "sag", m: ev.x1 - b.x1, r: { ...ev, x0: Math.max(ev.x0, b.x1) } });
    if (ev.y0 < b.y0 - EPS) tasmalar.push({ taraf: "on", m: b.y0 - ev.y0, r: { ...ev, y1: Math.min(ev.y1, b.y0) } });
    if (ev.y1 > b.y1 + EPS) tasmalar.push({ taraf: "arka", m: ev.y1 - b.y1, r: { ...ev, y0: Math.max(ev.y0, b.y1) } });
  }

  const ihlaller: Ihlal[] = [];
  if (!alanVar) ihlaller.push({ kural: "alan" });
  const sol = tasmalar.find((t) => t.taraf === "sol")?.m ?? 0;
  const sag = tasmalar.find((t) => t.taraf === "sag")?.m ?? 0;
  if (sol || sag) ihlaller.push({ kural: "yan", sol, sag });
  for (const t of tasmalar) if (t.taraf === "on" || t.taraf === "arka") ihlaller.push({ kural: t.taraf, m: t.m });
  const taksOk = m.taban <= taksHak + EPS;
  const kaksOk = m.m2 <= kaksHak + EPS;
  const hmaxOk = m.sacak <= d.hmax + EPS;
  if (!taksOk) ihlaller.push({ kural: "taks", taban: m.taban, hak: taksHak });
  if (!kaksOk) ihlaller.push({ kural: "kaks", toplam: m.m2, hak: kaksHak });
  if (!hmaxOk) ihlaller.push({ kural: "hmax", sacak: m.sacak, sinir: d.hmax });
  const cekmeOk = alanVar && tasmalar.length === 0;

  const salonAci = salonAcisi(d.yol, d.rot);
  const rad = (a: number) => (a * Math.PI) / 180;
  const yukari = (YON_ACI[d.yol] + 180) % 360;
  const salonN: [number, number] = [Math.round(Math.sin(rad(d.rot))), Math.round(Math.cos(rad(d.rot)))];
  const kuzey: [number, number] = [-Math.sin(rad(yukari)), Math.cos(rad(yukari))];

  // ---------------------------------------------------------------- suggestion
  let oneri: Oneri | null = null;
  if (ihlaller.length) {
    const sadeceCekme = alanVar && taksOk && kaksOk && hmaxOk;
    if (sadeceCekme) {
      const bw = b.x1 - b.x0;
      const bd = b.y1 - b.y0;
      if (k.w <= bw + EPS && k.d <= bd + EPS) oneri = { tur: "yerlestir" };
      else if (k.d <= bw + EPS && k.w <= bd + EPS) oneri = { tur: "cevir", rot: ((d.rot + 90) % 360) as Donus };
    }
    if (!oneri) {
      const aday = [...MODELLER].sort((a, z) => z.m2 - a.m2).find((x) => x.id !== m.id && sigarMi(x, d));
      oneri = aday ? { tur: "model", model: aday.id } : { tur: "yok" };
    }
  } else {
    const sy = yon8(salonAci);
    if (sy === "K" || sy === "KD" || sy === "KB") {
      const b2 = yapilasma(d);
      let en: { rot: Donus; aci: number } | null = null;
      for (const r of [180, 90, 270] as Donus[]) {
        const { w, d: dd } = olcu(m, r);
        if (w > b2.x1 - b2.x0 + EPS || dd > b2.y1 - b2.y0 + EPS) continue;
        const aci = salonAcisi(d.yol, r);
        if (!en || guneyeUzaklik(aci) < guneyeUzaklik(en.aci)) en = { rot: r, aci };
      }
      if (en && guneyeUzaklik(en.aci) <= 45) oneri = { tur: "salon", rot: en.rot, yon: yon8(en.aci) };
    }
  }

  return {
    m,
    w: k.w,
    d: k.d,
    ev,
    b,
    alanVar,
    alan,
    taksHak,
    kaksHak,
    tasmalar,
    ihlaller,
    kurallar: { cekme: cekmeOk, taks: taksOk, kaks: kaksOk, hmax: hmaxOk },
    sigar: ihlaller.length === 0,
    bahce: Math.max(0, alan - m.taban),
    salonAci,
    salonYon: yon8(salonAci),
    salonN,
    kuzey,
    oneri,
    maliyet: maliyet(m, d.il),
  };
}

/** the smallest plot a model needs with the regulation setbacks and the sample ratios */
export function enKucukArsa(m: Model, taks = VARSAYILAN.taks, kaks = VARSAYILAN.kaks) {
  const y = YONETMELIK;
  return {
    cephe: m.w + 2 * y.yan,
    derinlik: m.d + y.on + y.arka,
    cevrilince: { cephe: m.d + 2 * y.yan, derinlik: m.w + y.on + y.arka },
    alan: Math.ceil(Math.max(m.taban / taks, m.m2 / kaks)),
  };
}

export const ILLER = mesafe.iller;
export const MESAFE_KAYNAK = mesafe.kaynak;
