// Güz sofrası: the nine plates, the allergen matrix and the menu variants.
// The menu was written to the photographs we could source (plan §9: "menü
// görsele göre yazılır"). Producer notes name districts only; no invented
// farms or families. Earthquake-affected district names are not used.

export type AllergenKey =
  | "gluten"
  | "kabuklular"
  | "yumurta"
  | "balik"
  | "yerfistigi"
  | "soya"
  | "sut"
  | "kuruyemis"
  | "kereviz"
  | "hardal"
  | "susam"
  | "sulfit"
  | "acibakla"
  | "yumusakcalar";

export const ALLERGENS: { key: AllergenKey; label: string; short: string }[] = [
  { key: "gluten", label: "Gluten", short: "Gluten" },
  { key: "kabuklular", label: "Kabuklu deniz ürünleri", short: "Kabuklu" },
  { key: "yumurta", label: "Yumurta", short: "Yumurta" },
  { key: "balik", label: "Balık", short: "Balık" },
  { key: "yerfistigi", label: "Yer fıstığı", short: "Yer f." },
  { key: "soya", label: "Soya", short: "Soya" },
  { key: "sut", label: "Süt", short: "Süt" },
  { key: "kuruyemis", label: "Antep fıstığı ve kuruyemiş", short: "Fıstık" },
  { key: "kereviz", label: "Kereviz", short: "Kereviz" },
  { key: "hardal", label: "Hardal", short: "Hardal" },
  { key: "susam", label: "Susam", short: "Susam" },
  { key: "sulfit", label: "Sülfit", short: "Sülfit" },
  { key: "acibakla", label: "Acı bakla", short: "A. bakla" },
  { key: "yumusakcalar", label: "Yumuşakçalar", short: "Yumuşakça" },
];

export type Dish = {
  key: string;
  name: string;
  line: string;
  source: string;
  allergens: AllergenKey[];
  pairing: string;
  short: boolean; // also served in Kısa sofra
};

export const DISHES: Dish[] = [
  {
    key: "domates",
    name: "Bahçe domatesi, nar ekşisi",
    line: "Son hasat domates, ince kıyılmış maydanoz, sumak ve ilk sıkım zeytinyağı.",
    source: "Domates Oğuzeli’ndeki bahçelerden, zeytinyağı Nizip’ten.",
    allergens: [],
    pairing: "Koruk ekşisi, soda",
    short: true,
  },
  {
    key: "patlican",
    name: "Köz patlıcan, süzme yoğurt",
    line: "Közde yumuşayan patlıcan, pul biberli tereyağı, dövülmüş fıstık.",
    source: "Mevsimin son patlıcanları; yoğurdu her sabah evde süzüyoruz.",
    allergens: ["sut", "kuruyemis"],
    pairing: "Sumak şerbeti",
    short: true,
  },
  {
    key: "corba",
    name: "Mercimek, pul biber yağı",
    line: "Süzülmüş kırmızı mercimek, kızgın tereyağında pul biber, kavrulmuş nohut.",
    source: "Pul biberi ağustosta damda kurutulanlardan seçiyoruz.",
    allergens: ["sut"],
    pairing: "Ihlamur demlemesi",
    short: false,
  },
  {
    key: "firik",
    name: "Firik, kuzu, acı portakal",
    line: "Közlenmiş taze buğday, ağır ateşte kuzu, acı portakal kabuğu, fıstık.",
    source: "Firik, buğday henüz yeşilken Oğuzeli köylerinde tarlada kavrulur.",
    allergens: ["gluten", "kuruyemis"],
    pairing: "Acı portakal ekşimesi",
    short: true,
  },
  {
    key: "salata",
    name: "Kış lahanası, süzme yoğurt",
    line: "İnce doğranmış lahana ve kereviz kökü, süzme yoğurt, dereotu, taze kırmızı biber.",
    source: "Sebzeler sabah pazarından, ilk soğuklarla tatlanmış.",
    allergens: ["sut", "kereviz"],
    pairing: "Salatalık ve nane suyu",
    short: false,
  },
  {
    key: "humus",
    name: "Humus, kavurma, kızgın tereyağı",
    line: "Sıcak humus, iplik iplik kavurma, nane ve maydanoz, üstüne kızgın tereyağı.",
    source: "Nohut bir gece suda bekler, tahin taş değirmende çekilir.",
    allergens: ["susam", "sut"],
    pairing: "Siyah havuç şırası",
    short: true,
  },
  {
    key: "incik",
    name: "Kuzu incik, taze ot sosu",
    line: "Saatlerce pişen kuzu incik, maydanoz ve nane sosu, közlenmiş sarımsak.",
    source: "Kuzu, Yavuzeli yaylalarında otlayan sürülerden.",
    allergens: ["kereviz"],
    pairing: "Nar ve kuşburnu demlemesi",
    short: true,
  },
  {
    key: "ayva",
    name: "Ayva, karanfil, kaymak",
    line: "Fırında kızaran ayva, karanfil ve tarçın; yanında dövme kaymak ve fıstık.",
    source: "Ayvalar ekim sonunda dalından, kaymak her gün taze.",
    allergens: ["sut", "kuruyemis"],
    pairing: "Ayva çekirdeği şerbeti",
    short: false,
  },
  {
    key: "sarma",
    name: "Fıstık sarması",
    line: "Taze çekilmiş Antep fıstığı ve gül suyu, ince sarılmış; yanında kaymak.",
    source: "Fıstık Araban’ın bahçelerinden, ağustos hasadı.",
    allergens: ["kuruyemis", "sut"],
    pairing: "Menengiç kahvesi",
    short: true,
  },
];

/** Plates served only at the counter (text only, no photograph). */
export const COUNTER_EXTRAS = [
  { name: "Ocaktan sıcak yufka, sade yağ", line: "Tezgâhta açılır, ocakta pişer, elden ele gelir." },
  { name: "Közde pancar, çökelek", line: "Külde pişen pancar, keçi çökeleği, ceviz." },
  { name: "Yaz kurusu, pekmez", line: "Kurutulmuş dut ve kayısı, Yavuzeli bağlarından üzüm pekmezi." },
];

export const MENUS = {
  sofra: { label: "Sofra", plates: 9, hours: "yaklaşık 3 saat", price: 6500 },
  kisa: { label: "Kısa sofra", plates: 6, hours: "yaklaşık 2 saat", price: 4800 },
  tezgah: { label: "Tezgâh menüsü", plates: 12, hours: "yaklaşık 3,5 saat", price: 8900 },
} as const;
export type MenuKey = keyof typeof MENUS;

export const PAIRING_PRICE = 1900;
export const DEPOSIT = 1500;

/** Words engraved round the sini’s rim band (the season’s produce). */
export const RIM_WORDS = [
  "güz sofrası",
  "nizip zeytinyağı",
  "araban fıstığı",
  "son patlıcan",
  "taze firik",
  "ayva",
  "kış lahanası",
  "pul biber",
  "dövme kaymak",
];
