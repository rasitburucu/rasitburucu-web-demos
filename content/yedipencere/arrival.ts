// "Kapıdan kapıya" words and the sample measurements that fill OSM's gaps.
// Durum: taslak, Raşit'in onayını bekliyor (.tasarim/yedipencere/METIN-ONAY.md).
// Real: routes, lengths, street names, the two counted flights (10 and 13 steps),
// surfaces where OSM has them, AntRay and tram stops, the panoramic lift.
// Sample ("örnek ölçüm"): the two uncounted flights and unknown surfaces below.
// Services (luggage pick-up, plate arrangement) are sample services.

import type { ModeId, StartId } from "@/lib/yedipencere/arrival";
import type { Lang } from "@/lib/yedipencere/dates";

/** OSM spellings shown as on the street signs. */
export const STREET_FIX: Record<string, string> = {
  "Uzuncarşı Sokak": "Uzunçarşı Sokak",
  "Uzuncarşı Geçidi": "Uzunçarşı Geçidi",
  "Hesapci Sokak": "Hesapçı Sokak",
};

/** Names OSM keeps in English, and generic names for unnamed ways. */
export const PLACE_NAMES: Record<string, Record<Lang, string>> = {
  "Old Bazaar": { tr: "Eski çarşı", en: "the old bazaar" },
};
export const KIND_NAMES: Record<string, Record<Lang, string>> = {
  residential: { tr: "ara sokak", en: "side lane" },
  footway: { tr: "yaya yolu", en: "footpath" },
  pedestrian: { tr: "yaya yolu", en: "pedestrian way" },
  living_street: { tr: "sokak", en: "lane" },
  steps: { tr: "merdiven", en: "steps" },
  service: { tr: "servis yolu", en: "service road" },
  secondary: { tr: "cadde", en: "road" },
};

export type SampleRule = {
  start: StartId | "*";
  luggage?: boolean;
  at?: number;
  name?: string;
  kind?: string;
  surface?: "paving_stones" | "sett" | "asphalt" | "stone" | "rock";
  steps?: number;
  dir?: "up" | "down";
  /** a climb noticeable with a suitcase (harbour side, from the elevation data) */
  slope?: boolean;
};

/** First match wins: specific rules before general ones. */
export const SAMPLE: SampleRule[] = [
  { start: "marina", luggage: false, at: 0, kind: "residential", surface: "paving_stones", slope: true },
  { start: "marina", luggage: false, kind: "steps", steps: 64, dir: "up" },
  { start: "cumhuriyet", luggage: false, kind: "steps", steps: 48, dir: "down" },
  { start: "*", name: "İskele Caddesi", slope: true },
  { start: "*", name: "Hıdırlık Sokak", surface: "sett" },
  { start: "*", name: "Aralık Geçidi", surface: "sett" },
  { start: "*", name: "Kandiller Geçiti Sokak", surface: "sett" },
  { start: "*", kind: "service", surface: "asphalt" },
];

type Copy = {
  modes: Record<ModeId, string>;
  starts: Record<StartId, string>;
  /** the sub-choice under a mode */
  how: Record<ModeId, Partial<Record<StartId, string>>>;
  before: Record<ModeId, Partial<Record<StartId, string>>>;
  luggage: Record<StartId, string>;
  car: string;
  lift: string;
  surfaces: Record<"paving_stones" | "sett" | "asphalt" | "stone" | "rock", string>;
  turns: Record<string, string>;
};

export const arrival: Record<Lang, Copy> = {
  tr: {
    modes: { havalimani: "Havalimanı", otogar: "Otogar", arac: "Kendi aracınız", marina: "Marina" },
    starts: { kalekapisi: "Kale Kapısı", ismetpasa: "İsmetpaşa durağı", hadrian: "Üç Kapılar", cumhuriyet: "Cumhuriyet Meydanı otoparkı", marina: "Yat Limanı" },
    how: {
      havalimani: { kalekapisi: "Taksi ya da transfer", ismetpasa: "Tramvay (AntRay)" },
      otogar: { ismetpasa: "Tramvay (AntRay)", kalekapisi: "Taksi" },
      arac: { hadrian: "Üç Kapılar otoparkları", cumhuriyet: "Cumhuriyet Meydanı otoparkı" },
      marina: { marina: "Yat Limanı" },
    },
    before: {
      havalimani: {
        kalekapisi: "Taksi ya da transfer sizi Kale Kapısı'nda, Saat Kulesi'nin yanında bırakır. Süre trafiğe göre değişir; yürüyüş oradan başlar.",
        ismetpasa: "AntRay tramvayı havalimanından İsmetpaşa durağına gelir; yolculuk yaklaşık 50 dakika. Sefer saatlerini yola çıkmadan kontrol edin.",
      },
      otogar: {
        ismetpasa: "Otogardan AntRay ile İsmetpaşa durağına sekiz durak, yaklaşık 20 dakika. Otogarda perondan tramvaya tünelden yürünür.",
        kalekapisi: "Taksi sizi Kale Kapısı'nda, Saat Kulesi'nin yanında bırakır. Süre trafiğe göre değişir.",
      },
      arac: {
        hadrian: "Aracınızı Üç Kapılar (Hadrian Kapısı) çevresindeki otoparklardan birine bırakın. Kapıya 10 basamakla inilir, kapıdan sonra 13 basamakla çıkılır; bavulla basamaksız yol 115 metre daha uzun.",
        cumhuriyet: "Cumhuriyet Meydanı'nın altındaki yeraltı otoparkı. Kısa yol uzun bir taş merdivenle liman tarafına iner; bavulla İskele Caddesi'nden basamaksız gelinir, 110 metre daha uzun.",
      },
      marina: {
        marina: "Yat Limanı deniz seviyesinde, kapımız 30 metre yukarıda. Kısa yol uzun bir taş merdivenle çıkar; bavulla Arnavut kaldırımlı İskele Caddesi'nden yokuş çıkılır, 85 metre daha uzun.",
      },
    },
    luggage: {
      kalekapisi: "Bavulunuzu Kale Kapısı'nda biz karşılarız; varmadan yarım saat önce haber verin.",
      ismetpasa: "İsmetpaşa durağında sizi karşılar, bavulunuzu biz taşırız; tramvaya bindiğinizde haber verin.",
      hadrian: "Otoparkta bavulunuzu biz alırız; park ederken bizi arayın.",
      cumhuriyet: "Otoparkın çıkışında bavulunuzu biz alırız; park ederken bizi arayın.",
      marina: "Bavulunuzu iskelede teslim alırız; yanaşmadan önce haber verin.",
    },
    car: "Kaleiçi'ne araç girişi zaman zaman değişiyor. Gelmeden plakanızı bize yazın, girişi biz ayarlayalım.",
    lift: "Limandaki panoramik asansör Cumhuriyet Meydanı'na çıkar, bize değil.",
    surfaces: { paving_stones: "taş kaplama", sett: "Arnavut kaldırımı", asphalt: "asfalt", stone: "taş", rock: "kaya taşı" },
    turns: {
      straight: "Düz devam",
      "slight-right": "Hafif sağa",
      right: "Sağa",
      "sharp-right": "Keskin sağa",
      "slight-left": "Hafif sola",
      left: "Sola",
      "sharp-left": "Keskin sola",
    },
  },
  en: {
    modes: { havalimani: "Airport", otogar: "Bus station", arac: "By car", marina: "Marina" },
    starts: { kalekapisi: "Kale Kapısı", ismetpasa: "İsmetpaşa stop", hadrian: "Üç Kapılar", cumhuriyet: "Cumhuriyet Square car park", marina: "the old harbour" },
    how: {
      havalimani: { kalekapisi: "Taxi or transfer", ismetpasa: "Tram (AntRay)" },
      otogar: { ismetpasa: "Tram (AntRay)", kalekapisi: "Taxi" },
      arac: { hadrian: "Üç Kapılar car parks", cumhuriyet: "Cumhuriyet Square car park" },
      marina: { marina: "Old harbour" },
    },
    before: {
      havalimani: {
        kalekapisi: "A taxi or transfer drops you at Kale Kapısı, beside the Clock Tower. The time depends on traffic; the walk starts there.",
        ismetpasa: "The AntRay tram runs from the airport to İsmetpaşa stop in about 50 minutes. Check the timetable before you set off.",
      },
      otogar: {
        ismetpasa: "From the bus station, AntRay to İsmetpaşa is eight stops, about 20 minutes. At the bus station you walk to the tram through a tunnel.",
        kalekapisi: "A taxi drops you at Kale Kapısı, beside the Clock Tower. The time depends on traffic.",
      },
      arac: {
        hadrian: "Leave the car at one of the car parks around Üç Kapılar (Hadrian's Gate). Ten steps lead down to the gate and thirteen lead up on the other side; with luggage, the step-free way is 115 metres longer.",
        cumhuriyet: "The underground car park beneath Cumhuriyet Square. The short way goes down a long stone stair towards the harbour; with luggage, İskele Caddesi is step-free and 110 metres longer.",
      },
      marina: {
        marina: "The old harbour is at sea level; our door is 30 metres above it. The short way climbs a long stone stair; with luggage you walk up cobbled İskele Caddesi instead, 85 metres longer.",
      },
    },
    luggage: {
      kalekapisi: "We meet your luggage at Kale Kapısı; let us know half an hour before you arrive.",
      ismetpasa: "We meet you at İsmetpaşa stop and carry your luggage; let us know when you board the tram.",
      hadrian: "We collect your luggage at the car park; call us as you park.",
      cumhuriyet: "We collect your luggage at the car park exit; call us as you park.",
      marina: "We take your luggage at the quay; let us know before you come alongside.",
    },
    car: "Vehicle access to Kaleiçi changes from time to time. Send us your number plate before you arrive and we will arrange the entry.",
    lift: "The panoramic lift at the harbour goes up to Cumhuriyet Square, not to our side of town.",
    surfaces: { paving_stones: "stone paving", sett: "cobbles", asphalt: "asphalt", stone: "stone", rock: "rough stone" },
    turns: {
      straight: "Straight on",
      "slight-right": "Bear right",
      right: "Turn right",
      "sharp-right": "Sharp right",
      "slight-left": "Bear left",
      left: "Turn left",
      "sharp-left": "Sharp left",
    },
  },
};
