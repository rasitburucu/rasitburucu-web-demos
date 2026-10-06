// Gelidonya: seedling products, the ready-seedling list and our own produce.
// Values are EXAMPLES unless a source is named; the site labels them so and
// says the agricultural engineer confirms them on the order.
//
// Sources (read 2026-10-05 / 2026-10-06):
// - BÜGEM: T.C. Tarım ve Orman Bakanlığı, Bitkisel Üretim Genel Müdürlüğü,
//   "Topraksız Ortamda Domates Üretimi İçin Jeotermal Sera Yatırımı
//   Fizibilite Raporu (5.000 m² üretim alanı)", s. 9: "Serada domates
//   üretiminde dekara 2.800 adet aşısız, tek tepe fide kullanılmaktadır."
//   A grafted plant taken to two stems carries two heads: 2.800 ÷ 2 = 1.400
//   seedlings (our derivation, the formula is shown on the site).
// - Durations: sector article (agrowy.com, "Fidelikler nasıl ve ne zaman
//   sipariş alır"): grafted 45–60 days, ungrafted 40–45 days; grafted tomato
//   (two stems) 55–65 days; grafted watermelon 35–55 days.
// - Tray cells: the ready-seedling lists of two Kumluca nurseries (2026-10-06,
//   30+ rows) carry grafted truss tomato in 98-cell trays and ungrafted pepper
//   in 98- and 136-cell trays; 24–32 cells for melon/watermelon (agrowy).
//   Densities other than tomato have no source: content gap, shown as such.

export type UrunId = "domates" | "biber" | "patlican" | "hiyar" | "karpuz" | "kavun";
export type Asi = "asili" | "asisiz";

export type Urun = {
  id: UrunId;
  name: string;
  /** plant heads (stems) per decare */
  heads: number;
  headsSourced: boolean;
  /** stem choices; a grafted plant can be taken to two stems where it is done */
  stems: (1 | 2)[];
  graft: Asi[];
  /** weeks from sowing to delivery, per kind */
  weeks: Partial<Record<Asi, number>>;
  trays: number[];
  /** defaults for the calculator */
  def: { graft: Asi; stems: 1 | 2; tray: number };
};

export const URUNLER: Urun[] = [
  { id: "domates", name: "Domates", heads: 2800, headsSourced: true, stems: [1, 2], graft: ["asili", "asisiz"], weeks: { asili: 9, asisiz: 6 }, trays: [98, 136], def: { graft: "asili", stems: 2, tray: 98 } },
  { id: "biber", name: "Biber", heads: 2500, headsSourced: false, stems: [1, 2], graft: ["asili", "asisiz"], weeks: { asili: 9, asisiz: 7 }, trays: [98, 136], def: { graft: "asisiz", stems: 1, tray: 136 } },
  { id: "patlican", name: "Patlıcan", heads: 1800, headsSourced: false, stems: [1, 2], graft: ["asili", "asisiz"], weeks: { asili: 9, asisiz: 7 }, trays: [98], def: { graft: "asili", stems: 2, tray: 98 } },
  { id: "hiyar", name: "Hıyar", heads: 1800, headsSourced: false, stems: [1], graft: ["asili", "asisiz"], weeks: { asili: 5, asisiz: 4 }, trays: [98], def: { graft: "asili", stems: 1, tray: 98 } },
  { id: "karpuz", name: "Karpuz", heads: 500, headsSourced: false, stems: [1], graft: ["asili", "asisiz"], weeks: { asili: 7, asisiz: 5 }, trays: [28], def: { graft: "asili", stems: 1, tray: 28 } },
  { id: "kavun", name: "Kavun", heads: 900, headsSourced: false, stems: [1], graft: ["asili", "asisiz"], weeks: { asili: 7, asisiz: 5 }, trays: [28], def: { graft: "asili", stems: 1, tray: 28 } },
];

export const urunById = (id: string) => URUNLER.find((u) => u.id === id) ?? URUNLER[0];

export const SOURCE_URL =
  "https://www.tarimorman.gov.tr/BUGEM/Belgeler/YATIRIMCI%20REHBER%C4%B0/Topraksiz%20Ortamda%20Domates%20Uretimi%20I%C3%A7in%20Jeotermal%20Sera%20Yatirimi%20Fizibilite%20Raporu%20(5.000%20m2%20Uretim%20Alani).pdf";

/** Tray types the site talks about: where each one is seen. */
export const VIYOLLER: { cells: number; use: string; basis: string }[] = [
  { cells: 98, use: "Aşılı domates, biber, patlıcan, hıyar", basis: "Kumluca fideliklerinin hazır fide listelerinde en sık görülen tip" },
  { cells: 136, use: "Aşısız biber ve domates", basis: "Hazır fide listelerinde görülen tip" },
  { cells: 28, use: "Karpuz ve kavun (iri tohum, geniş göz)", basis: "Sektör yazısı: iri tohumlarda 24–32 göz" },
];

// ------------------------------------------------------------ ready list
// EXAMPLE list, dated 6 Ekim 2026 on the site. Type names instead of trade
// names (PROJE.md). Counts are whole trays.

export type Durum = "hazir" | "boylu" | "olacak";
export type HazirSatir = {
  id: string;
  urun: UrunId;
  tip: string;
  asi: Asi;
  anac: string;
  govde: 1 | 2;
  viyol: number;
  /** trays on the bench */
  adetViyol: number;
  /** ready from (UTC ms) */
  hazir: number;
  durum: Durum;
};

const D = (m: number, d: number) => Date.UTC(2026, m - 1, d);
export const LISTE_TARIHI = D(10, 6);

export const HAZIR: HazirSatir[] = [
  { id: "h1", urun: "domates", tip: "Salkım", asi: "asili", anac: "Güçlü anaç", govde: 2, viyol: 98, adetViyol: 14, hazir: D(10, 6), durum: "hazir" },
  { id: "h2", urun: "biber", tip: "Çarliston", asi: "asisiz", anac: "—", govde: 1, viyol: 136, adetViyol: 30, hazir: D(10, 6), durum: "hazir" },
  { id: "h3", urun: "domates", tip: "Sofralık iri", asi: "asili", anac: "Toprak hastalığına dayanıklı anaç", govde: 1, viyol: 98, adetViyol: 10, hazir: D(10, 6), durum: "boylu" },
  { id: "h4", urun: "patlican", tip: "Kemer", asi: "asili", anac: "Güçlü anaç", govde: 2, viyol: 98, adetViyol: 16, hazir: D(10, 5), durum: "hazir" },
  { id: "h5", urun: "hiyar", tip: "Sofralık", asi: "asili", anac: "Kabak anacı", govde: 1, viyol: 98, adetViyol: 21, hazir: D(10, 6), durum: "hazir" },
  { id: "h6", urun: "biber", tip: "Kapya", asi: "asili", anac: "Güçlü anaç", govde: 2, viyol: 98, adetViyol: 12, hazir: D(10, 6), durum: "boylu" },
  { id: "h7", urun: "domates", tip: "Salkım", asi: "asili", anac: "Güçlü anaç", govde: 2, viyol: 98, adetViyol: 30, hazir: D(10, 9), durum: "olacak" },
  { id: "h8", urun: "domates", tip: "Pembe", asi: "asisiz", anac: "—", govde: 1, viyol: 98, adetViyol: 50, hazir: D(10, 13), durum: "olacak" },
  { id: "h9", urun: "biber", tip: "Sivri", asi: "asisiz", anac: "—", govde: 1, viyol: 98, adetViyol: 25, hazir: D(10, 15), durum: "olacak" },
  { id: "h10", urun: "hiyar", tip: "Badem", asi: "asisiz", anac: "—", govde: 1, viyol: 98, adetViyol: 15, hazir: D(10, 16), durum: "olacak" },
  { id: "h11", urun: "domates", tip: "Kokteyl", asi: "asili", anac: "Güçlü anaç", govde: 2, viyol: 98, adetViyol: 20, hazir: D(10, 20), durum: "olacak" },
  { id: "h12", urun: "patlican", tip: "Bostan", asi: "asisiz", anac: "—", govde: 1, viyol: 98, adetViyol: 8, hazir: D(10, 22), durum: "olacak" },
];

// ------------------------------------------------------------ our produce
/** Months are 0-based; seasons are EXAMPLES (Kumluca, under cover). */
export type Mahsul = { id: string; name: string; type: string; months: number[]; pack: string[] };

export const MAHSUL: Mahsul[] = [
  { id: "domates", name: "Domates", type: "salkım", months: [10, 11, 0, 1, 2, 3, 4], pack: ["5 kg karton koli", "Salkım dizme, tek kat"] },
  { id: "domates-s", name: "Domates", type: "sofralık iri", months: [10, 11, 0, 1, 2, 3, 4], pack: ["6 kg karton koli", "10 kg plastik kasa"] },
  { id: "kokteyl", name: "Domates", type: "kokteyl", months: [11, 0, 1, 2, 3], pack: ["250 g ve 500 g şale", "10 şaleli koli"] },
  { id: "biber", name: "Biber", type: "çarliston ve sivri", months: [10, 11, 0, 1, 2, 3], pack: ["5 kg karton koli", "Plastik kasa"] },
  { id: "hiyar", name: "Hıyar", type: "sofralık", months: [10, 11, 2, 3, 4], pack: ["Tek tek streçli, 12'li koli", "5 kg koli"] },
  { id: "patlican", name: "Patlıcan", type: "kemer", months: [11, 0, 1, 2, 3, 4], pack: ["5 kg karton koli"] },
];
