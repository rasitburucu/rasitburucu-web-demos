// Gelidonya: seedling products and harvest seasons.
// Values are EXAMPLES unless `source` says otherwise; the site labels them so
// and says the agricultural engineer confirms them on the order.
//
// Sources (read 2026-10-05):
// - BUGEM: T.C. Tarım ve Orman Bakanlığı, Bitkisel Üretim Genel Müdürlüğü,
//   "Topraksız Ortamda Domates Üretimi İçin Jeotermal Sera Yatırımı
//   Fizibilite Raporu (5.000 m² üretim alanı)", s. 9: "Serada domates
//   üretiminde dekara 2.800 adet aşısız, tek tepe fide kullanılmaktadır."
// - Grafted tomato on two stems keeps the same number of heads per decare:
//   2.800 heads ÷ 2 stems = 1.400 seedlings (our derivation, shown on the site).
// - Durations: sector article (agrowy.com, "Fidelikler nasıl ve ne zaman
//   sipariş alır"): grafted 45–60 days, ungrafted 40–45 days; grafted
//   tomato (two stems) 55–65 days; grafted watermelon 35–55 days.
// - Tray cells: 45 for tomato/pepper/aubergine, 24–32 for melon/watermelon
//   (same article). Other densities have no source: content gap.

export type Leaf = "domates" | "biber" | "patlican" | "hiyar" | "karpuz" | "kavun";

export type Fide = {
  id: string;
  name: string;
  kind: "aşılı" | "aşısız";
  /** seedlings per decare (dönüm) */
  rate: number;
  /** cells per tray */
  cells: 45 | 28;
  /** weeks from sowing to delivery */
  weeks: number;
  leaf: Leaf;
  /** short note on where the rate comes from (Fidelik table) */
  source: string;
};

export const FIDELER: Fide[] = [
  { id: "domates-a", name: "Domates", kind: "aşılı", rate: 1400, cells: 45, weeks: 8, leaf: "domates", source: "2.800 tepe ÷ 2 gövde (BÜGEM raporundan türetildi)" },
  { id: "domates", name: "Domates", kind: "aşısız", rate: 2800, cells: 45, weeks: 6, leaf: "domates", source: "Tarım ve Orman Bakanlığı BÜGEM raporu" },
  { id: "biber", name: "Biber", kind: "aşısız", rate: 2500, cells: 45, weeks: 7, leaf: "biber", source: "Örnek değer, kaynak yok" },
  { id: "patlican-a", name: "Patlıcan", kind: "aşılı", rate: 1800, cells: 45, weeks: 8, leaf: "patlican", source: "Örnek değer, kaynak yok" },
  { id: "hiyar-a", name: "Hıyar", kind: "aşılı", rate: 1800, cells: 45, weeks: 6, leaf: "hiyar", source: "Örnek değer, kaynak yok" },
  { id: "karpuz-a", name: "Karpuz", kind: "aşılı", rate: 500, cells: 28, weeks: 7, leaf: "karpuz", source: "Örnek değer, kaynak yok" },
  { id: "kavun-a", name: "Kavun", kind: "aşılı", rate: 900, cells: 28, weeks: 7, leaf: "kavun", source: "Örnek değer, kaynak yok" },
];

export const SOURCE_URL =
  "https://www.tarimorman.gov.tr/BUGEM/Belgeler/YATIRIMCI%20REHBER%C4%B0/Topraksiz%20Ortamda%20Domates%20Uretimi%20I%C3%A7in%20Jeotermal%20Sera%20Yatirimi%20Fizibilite%20Raporu%20(5.000%20m2%20Uretim%20Alani).pdf";

/** Our own produce. Months are 0-based; seasons are EXAMPLES (Kumluca, under cover). */
export type Mahsul = { id: string; name: string; type: string; months: number[] };

export const MAHSUL: Mahsul[] = [
  { id: "domates", name: "Domates", type: "salkım ve sofralık", months: [10, 11, 0, 1, 2, 3, 4] },
  { id: "biber", name: "Biber", type: "sivri ve çarliston", months: [10, 11, 0, 1, 2, 3] },
  { id: "hiyar", name: "Hıyar", type: "sofralık", months: [10, 11, 2, 3, 4] },
  { id: "patlican", name: "Patlıcan", type: "kemer", months: [11, 0, 1, 2, 3, 4] },
];
