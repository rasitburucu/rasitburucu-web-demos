// Vaziyet: the five (fictional) house models. Every figure is an example
// ([örnek] on the site); the plans are ours, drawn for this concept, and copy
// no real manufacturer's plan.
//
// Frame: metres, x along the long facade (0..w), y across (0..d). y = 0 is
// the entrance facade, which faces the road when the house sits unturned on
// a plot; the living room ("salon") opens to y = d, the garden side.
// Exterior walls 15 cm, partitions 10 cm: rooms are the clear rectangles
// between them, so the m² written in a room is the drawing's own area.

export type ModelId = "sundurma" | "sofa" | "hayat" | "cumba" | "avlu";

export type Oda = {
  ad: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** wet rooms and service spaces are tinted on the plan */
  tur?: "islak" | "servis" | "gun";
};

/**
 * A door or an opening in a wall. The wall runs along `eksen`; (x, y) is where
 * the opening starts on the wall's centre line (on the outer face for an
 * exterior door) and it is `w` long. `s` is the side the leaf swings to
 * (+1 = towards +y for an x-wall, towards +x for a y-wall). `acik` = an
 * opening without a leaf.
 */
export type Kapi = { x: number; y: number; w: number; eksen: "x" | "y"; s: 1 | -1; dis?: boolean; acik?: boolean };
/** a window on an exterior wall, from a to b along that wall */
export type Pencere = { duvar: "on" | "arka" | "sol" | "sag"; a: number; b: number };
export type Merdiven = { x0: number; y0: number; x1: number; y1: number };

export type Kat = { ad: string; odalar: Oda[]; kapilar: Kapi[]; pencereler: Pencere[]; merdiven?: Merdiven };

export type Model = {
  id: ModelId;
  ad: string;
  m2: number; // closed area, all floors
  oda: string; // "2+1"
  katSayisi: 1 | 2;
  w: number; // outside length, m
  d: number; // outside depth, m
  taban: number; // footprint, m²
  sacak: number; // eave height above ground, m (what Hmax is checked against)
  mahya: number; // ridge height, m
  fiyat: number; // list price, TL, factory delivery, VAT included [örnek]
  tir: number; // trucks for the panels
  vincGun: number; // crane days on site
  uretimHafta: [number, number];
  kurulumGun: [number, number];
  katlar: Kat[];
};

const r2 = (n: number) => Math.round(n * 100) / 100;
export const odaAlan = (o: Oda) => r2((o.x1 - o.x0) * (o.y1 - o.y0));

export const MODELLER: Model[] = [
  {
    id: "sundurma",
    ad: "Sundurma",
    m2: 48,
    oda: "1+1",
    katSayisi: 1,
    w: 8.0,
    d: 6.0,
    taban: 48,
    sacak: 3.4,
    mahya: 4.65,
    fiyat: 529000,
    tir: 1,
    vincGun: 1,
    uretimHafta: [3, 4],
    kurulumGun: [2, 3],
    katlar: [
      {
        ad: "Zemin kat",
        odalar: [
          { ad: "Salon ve mutfak", x0: 0.15, y0: 0.15, x1: 4.75, y1: 5.85, tur: "gun" },
          { ad: "Banyo", x0: 4.85, y0: 0.15, x1: 7.85, y1: 2.25, tur: "islak" },
          { ad: "Yatak odası", x0: 4.85, y0: 2.35, x1: 7.85, y1: 5.85 },
        ],
        kapilar: [
          { x: 1.6, y: 0, w: 1.0, eksen: "x", s: 1, dis: true },
          { x: 4.8, y: 0.5, w: 0.8, eksen: "y", s: 1 },
          { x: 4.8, y: 2.6, w: 0.9, eksen: "y", s: 1 },
        ],
        pencereler: [
          { duvar: "arka", a: 0.8, b: 4.0 },
          { duvar: "arka", a: 5.6, b: 7.1 },
          { duvar: "sol", a: 3.2, b: 4.8 },
          { duvar: "sag", a: 0.7, b: 1.5 },
          { duvar: "on", a: 3.0, b: 4.2 },
        ],
      },
    ],
  },
  {
    id: "sofa",
    ad: "Sofa",
    m2: 78,
    oda: "2+1",
    katSayisi: 1,
    w: 12.0,
    d: 6.5,
    taban: 78,
    sacak: 3.4,
    mahya: 4.75,
    fiyat: 749000,
    tir: 2,
    vincGun: 1,
    uretimHafta: [4, 5],
    kurulumGun: [3, 4],
    katlar: [
      {
        ad: "Zemin kat",
        odalar: [
          { ad: "Yatak odası", x0: 0.15, y0: 2.65, x1: 3.75, y1: 6.35 },
          { ad: "Banyo ve çamaşır", x0: 0.15, y0: 0.15, x1: 3.75, y1: 2.55, tur: "islak" },
          { ad: "Sofa: salon ve mutfak", x0: 3.85, y0: 0.15, x1: 8.15, y1: 6.35, tur: "gun" },
          { ad: "Ebeveyn yatak odası", x0: 8.25, y0: 2.15, x1: 11.85, y1: 6.35 },
          { ad: "Ebeveyn banyosu", x0: 8.25, y0: 0.15, x1: 10.05, y1: 2.05, tur: "islak" },
          { ad: "Gardırop", x0: 10.15, y0: 0.15, x1: 11.85, y1: 2.05, tur: "servis" },
        ],
        kapilar: [
          { x: 5.5, y: 0, w: 1.0, eksen: "x", s: 1, dis: true },
          { x: 3.8, y: 3.1, w: 0.9, eksen: "y", s: -1 },
          { x: 3.8, y: 0.9, w: 0.8, eksen: "y", s: -1 },
          { x: 8.2, y: 2.6, w: 0.9, eksen: "y", s: 1 },
          { x: 8.7, y: 2.1, w: 0.8, eksen: "x", s: -1 },
          { x: 10.6, y: 2.1, w: 0.8, eksen: "x", s: -1 },
        ],
        pencereler: [
          { duvar: "arka", a: 0.9, b: 2.9 },
          { duvar: "arka", a: 4.4, b: 7.6 },
          { duvar: "arka", a: 9.1, b: 11.1 },
          { duvar: "on", a: 6.8, b: 7.8 },
          { duvar: "on", a: 1.4, b: 2.4 },
          { duvar: "on", a: 8.8, b: 9.6 },
          { duvar: "sol", a: 3.6, b: 5.2 },
          { duvar: "sag", a: 3.6, b: 5.2 },
        ],
      },
    ],
  },
  {
    id: "hayat",
    ad: "Hayat",
    m2: 104,
    oda: "3+1",
    katSayisi: 1,
    w: 13.0,
    d: 8.0,
    taban: 104,
    sacak: 3.4,
    mahya: 5.1,
    fiyat: 968000,
    tir: 2,
    vincGun: 1,
    uretimHafta: [5, 6],
    kurulumGun: [4, 5],
    katlar: [
      {
        ad: "Zemin kat",
        odalar: [
          { ad: "Hayat: salon ve mutfak", x0: 0.15, y0: 4.05, x1: 8.05, y1: 7.85, tur: "gun" },
          { ad: "Ebeveyn yatak odası", x0: 8.15, y0: 4.05, x1: 12.85, y1: 7.85 },
          { ad: "Yatak odası", x0: 0.15, y0: 0.15, x1: 3.35, y1: 3.95 },
          { ad: "Yatak odası", x0: 3.45, y0: 0.15, x1: 6.45, y1: 3.95 },
          { ad: "Giriş", x0: 6.55, y0: 0.15, x1: 8.55, y1: 3.95, tur: "servis" },
          { ad: "Banyo", x0: 8.65, y0: 0.15, x1: 10.85, y1: 2.35, tur: "islak" },
          { ad: "Çamaşır", x0: 8.65, y0: 2.45, x1: 10.85, y1: 3.95, tur: "servis" },
          { ad: "Ebeveyn banyosu", x0: 10.95, y0: 0.15, x1: 12.85, y1: 3.95, tur: "islak" },
        ],
        kapilar: [
          { x: 7.05, y: 0, w: 1.0, eksen: "x", s: 1, dis: true },
          { x: 6.75, y: 4.0, w: 1.2, eksen: "x", s: 1, acik: true },
          { x: 1.5, y: 4.0, w: 0.9, eksen: "x", s: -1 },
          { x: 4.6, y: 4.0, w: 0.9, eksen: "x", s: -1 },
          { x: 8.6, y: 1.0, w: 0.8, eksen: "y", s: 1 },
          { x: 8.6, y: 2.75, w: 0.8, eksen: "y", s: 1 },
          { x: 8.1, y: 4.5, w: 0.9, eksen: "y", s: 1 },
          { x: 11.5, y: 4.0, w: 0.8, eksen: "x", s: -1 },
        ],
        pencereler: [
          { duvar: "arka", a: 0.8, b: 3.6 },
          { duvar: "arka", a: 4.4, b: 7.4 },
          { duvar: "arka", a: 9.4, b: 11.6 },
          { duvar: "on", a: 0.9, b: 2.6 },
          { duvar: "on", a: 4.0, b: 5.9 },
          { duvar: "on", a: 9.3, b: 10.2 },
          { duvar: "on", a: 11.5, b: 12.2 },
          { duvar: "sol", a: 5.0, b: 6.8 },
          { duvar: "sag", a: 5.0, b: 6.8 },
        ],
      },
    ],
  },
  {
    id: "cumba",
    ad: "Cumba",
    m2: 124,
    oda: "3+1",
    katSayisi: 2,
    w: 9.0,
    d: 6.9,
    taban: 62,
    sacak: 6.3,
    mahya: 7.75,
    fiyat: 1198000,
    tir: 3,
    vincGun: 2,
    uretimHafta: [6, 7],
    kurulumGun: [6, 8],
    katlar: [
      {
        ad: "Zemin kat",
        odalar: [
          { ad: "Salon", x0: 0.15, y0: 2.55, x1: 5.15, y1: 6.75, tur: "gun" },
          { ad: "Mutfak", x0: 5.25, y0: 2.55, x1: 8.85, y1: 6.75, tur: "gun" },
          { ad: "Giriş ve merdiven", x0: 0.15, y0: 0.15, x1: 4.15, y1: 2.45, tur: "servis" },
          { ad: "WC", x0: 4.25, y0: 0.15, x1: 5.75, y1: 2.45, tur: "islak" },
          { ad: "Kiler ve çamaşır", x0: 5.85, y0: 0.15, x1: 8.85, y1: 2.45, tur: "servis" },
        ],
        kapilar: [
          { x: 2.4, y: 0, w: 1.0, eksen: "x", s: 1, dis: true },
          { x: 2.3, y: 2.5, w: 1.2, eksen: "x", s: 1, acik: true },
          { x: 4.2, y: 0.6, w: 0.7, eksen: "y", s: 1 },
          { x: 6.4, y: 2.5, w: 0.8, eksen: "x", s: -1 },
          { x: 5.2, y: 3.4, w: 1.6, eksen: "y", s: 1, acik: true },
        ],
        merdiven: { x0: 0.25, y0: 0.25, x1: 1.85, y1: 2.35 },
        pencereler: [
          { duvar: "arka", a: 0.8, b: 4.4 },
          { duvar: "arka", a: 6.0, b: 8.0 },
          { duvar: "on", a: 6.6, b: 7.8 },
          { duvar: "sol", a: 3.6, b: 5.6 },
          { duvar: "sag", a: 3.6, b: 5.6 },
        ],
      },
      {
        ad: "Üst kat",
        odalar: [
          { ad: "Merdiven", x0: 0.15, y0: 0.15, x1: 1.95, y1: 2.75, tur: "servis" },
          { ad: "Banyo", x0: 2.05, y0: 0.15, x1: 4.15, y1: 2.75, tur: "islak" },
          { ad: "Cumbalı yatak odası", x0: 4.25, y0: 0.15, x1: 8.85, y1: 2.75 },
          { ad: "Hol", x0: 0.15, y0: 2.85, x1: 6.15, y1: 3.85, tur: "servis" },
          { ad: "Ebeveyn yatak odası", x0: 0.15, y0: 3.95, x1: 6.15, y1: 6.75 },
          { ad: "Yatak odası", x0: 6.25, y0: 2.85, x1: 8.85, y1: 6.75 },
        ],
        kapilar: [
          { x: 0.3, y: 2.8, w: 1.5, eksen: "x", s: 1, acik: true },
          { x: 2.7, y: 2.8, w: 0.8, eksen: "x", s: -1 },
          { x: 4.6, y: 2.8, w: 0.9, eksen: "x", s: -1 },
          { x: 2.0, y: 3.9, w: 0.9, eksen: "x", s: 1 },
          { x: 6.2, y: 2.95, w: 0.8, eksen: "y", s: 1 },
        ],
        merdiven: { x0: 0.25, y0: 0.25, x1: 1.85, y1: 2.35 },
        pencereler: [
          { duvar: "arka", a: 1.0, b: 4.0 },
          { duvar: "arka", a: 6.8, b: 8.3 },
          { duvar: "on", a: 5.2, b: 8.0 },
          { duvar: "on", a: 2.7, b: 3.5 },
          { duvar: "sol", a: 4.4, b: 6.0 },
          { duvar: "sag", a: 4.0, b: 5.6 },
        ],
      },
    ],
  },
  {
    id: "avlu",
    ad: "Avlu",
    m2: 138,
    oda: "4+1",
    katSayisi: 1,
    w: 15.0,
    d: 9.2,
    taban: 138,
    sacak: 3.4,
    mahya: 5.35,
    fiyat: 1259000,
    tir: 3,
    vincGun: 2,
    uretimHafta: [6, 7],
    kurulumGun: [5, 7],
    katlar: [
      {
        ad: "Zemin kat",
        odalar: [
          { ad: "Salon ve mutfak", x0: 0.15, y0: 0.15, x1: 6.45, y1: 9.05, tur: "gun" },
          { ad: "Hol", x0: 6.55, y0: 3.95, x1: 14.85, y1: 5.05, tur: "servis" },
          { ad: "Yatak odası", x0: 6.55, y0: 5.15, x1: 9.85, y1: 9.05 },
          { ad: "Ebeveyn yatak odası", x0: 9.95, y0: 5.15, x1: 14.85, y1: 9.05 },
          { ad: "Yatak odası", x0: 6.55, y0: 0.15, x1: 9.85, y1: 3.85 },
          { ad: "Banyo ve çamaşır", x0: 9.95, y0: 0.15, x1: 11.95, y1: 3.85, tur: "islak" },
          { ad: "Yatak odası", x0: 12.05, y0: 0.15, x1: 14.85, y1: 3.85 },
        ],
        kapilar: [
          { x: 2.4, y: 0, w: 1.0, eksen: "x", s: 1, dis: true },
          { x: 6.5, y: 4.1, w: 0.8, eksen: "y", s: 1, acik: true },
          { x: 7.0, y: 5.1, w: 0.9, eksen: "x", s: 1 },
          { x: 10.4, y: 5.1, w: 0.9, eksen: "x", s: 1 },
          { x: 8.4, y: 3.9, w: 0.9, eksen: "x", s: -1 },
          { x: 10.5, y: 3.9, w: 0.8, eksen: "x", s: -1 },
          { x: 12.6, y: 3.9, w: 0.9, eksen: "x", s: -1 },
        ],
        pencereler: [
          { duvar: "arka", a: 0.8, b: 5.6 },
          { duvar: "arka", a: 7.2, b: 9.2 },
          { duvar: "arka", a: 10.8, b: 14.0 },
          { duvar: "on", a: 3.8, b: 5.8 },
          { duvar: "on", a: 7.2, b: 9.2 },
          { duvar: "on", a: 10.5, b: 11.4 },
          { duvar: "on", a: 12.6, b: 14.2 },
          { duvar: "sol", a: 2.0, b: 7.0 },
          { duvar: "sag", a: 6.0, b: 8.0 },
          { duvar: "sag", a: 1.2, b: 2.8 },
        ],
      },
    ],
  },
];

export const modelBul = (id: string | null | undefined): Model | undefined => MODELLER.find((m) => m.id === id);
export const MODEL_IDLER = MODELLER.map((m) => m.id);

/** net (room) area of a model, all floors */
export const netAlan = (m: Model) => r2(m.katlar.reduce((s, k) => s + k.odalar.reduce((t, o) => t + odaAlan(o), 0), 0));
