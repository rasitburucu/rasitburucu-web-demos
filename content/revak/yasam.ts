// Kampüs sayfasının derinleşen bölümleri: kampüs planı, yemek menüsü, servis güzergâhı.
// Metinler Raşit onayı bekliyor (2026-10-04). Menü, duraklar ve saatler örnektir.

import type { ImageKey } from "./images";

export type PlanPoint = {
  id: string;
  name: string;
  text: string;
  x: number;
  y: number;
  image: ImageKey;
  /** the matching choice in the tour form (tr.flows.tur.s2.seeOptions); null = every tour passes it */
  see: string | null;
};

export const plan = {
  title: "Kampüs planı",
  intro: "Bir işarete dokunun: orada ne olduğunu görün, turda özellikle görmek istiyorsanız işaretleyin.",
  label: "Kampüs planı, işaretler",
  hint: "Plan ölçekli değildir.",
  pick: "Turda bunu görmek istiyorum",
  always: "Her tur buradan geçer.",
  picked: "Tur formunda seçili olarak açılır.",
  tourCta: (n: number) => (n === 1 ? "Bu noktayla tur planlayın" : `${n} noktayla tur planlayın`),
  labels: { library: "Kütüphane", dining: "Yemekhane", blockB: "B Blok", stage: "Sahne", sports: "Spor salonu", kinder: "Anaokulu", court: "Avlu", road: "Çamlık Yolu", forest: "Orman", north: "K" },
  points: [
    { id: "kapi", name: "Revak Kapısı", text: "Kampüsün tek girişi. Ziyaretçi kaydı, servislerin iniş yeri ve çocuk teslim noktası burada.", x: 500, y: 560, image: "revakWide", see: "Servis ve güvenlik" },
    { id: "avlu", name: "Avlu ve revak", text: "Bütün binaları birbirine bağlayan kemerli galeri. Teneffüsler ve törenler avluda.", x: 500, y: 352, image: "avlu", see: null },
    { id: "anaokulu", name: "Anaokulu ve bahçesi", text: "Ayrı bina, kendi kapısı ve çitle çevrili bahçesi. Kum havuzu, sebze tarhları, yağmur saçağı.", x: 212, y: 404, image: "anaokulu", see: "Anaokulu binası ve bahçesi" },
    { id: "yemekhane", name: "Yemekhane", text: "Kampüs mutfağında her gün taze pişen yemek. Öğretmenler öğrencilerle aynı masada yer.", x: 322, y: 212, image: "dining", see: "Yemekhane" },
    { id: "kutuphane", name: "Kütüphane", text: "Üç kat, 38.000 kitap ve sessiz çalışma odaları. Lise öğrencilerine akşam 19.00'a kadar açık.", x: 575, y: 104, image: "library", see: "Kütüphane" },
    { id: "lab", name: "Fen laboratuvarları", text: "B Blok'ta altı laboratuvar; iki öğrenciye bir mikroskop. Ortaokulda haftada en az bir ders burada.", x: 792, y: 176, image: "lab", see: "Fen laboratuvarları" },
    { id: "sahne", name: "Revak Sahnesi", text: "420 kişilik sahne ve on iki müzik odası. Konserler, oyunlar ve mezuniyet töreni.", x: 332, y: 378, image: "stage", see: "Sahne ve müzik odaları" },
    { id: "havuz", name: "Spor salonu ve havuz", text: "Yarı olimpik kapalı havuz, iki salon ve açık pist. Yüzme anaokulundan itibaren ders programında.", x: 830, y: 380, image: "pool", see: "Spor salonu ve havuz" },
    { id: "revir", name: "Revir", text: "Kapıya en yakın bina; ambulans doğrudan yanaşır. İki hemşire tam gün görevde.", x: 648, y: 492, image: "corridor", see: "Revir" },
    { id: "orman", name: "Orman yolu", text: "Kampüsün kuzeyindeki orman kıyısında bir kilometrelik yol. Baharda fen dersleri burada da yapılır.", x: 890, y: 120, image: "bahceYolu", see: "Orman yolu ve bahçeler" },
  ] as PlanPoint[],
};

export type Dish = { d: string; a?: Allergen[] };
export type Allergen = "G" | "S" | "Y" | "K" | "B" | "Su";
type PrimaryDay = { day: string; dishes: Dish[]; veg: Dish | null };
type KinderDay = { day: string; kahvalti: Dish; ogle: Dish; ikindi: Dish };

export const menu = {
  title: "Yemek menüsü",
  intro: "Beslenme uzmanımızın hazırladığı iki haftalık menü. Okul günlerinde bugünün satırı kırmızı bir kenar çizgisiyle işaretlenir.",
  weekLabel: "Hafta",
  weeks: ["Bu hafta", "Gelecek hafta"],
  tabLabel: "Menü",
  tabs: { ilk: "İlkokul ve üstü", ana: "Anaokulu" },
  meals: { kahvalti: "Kahvaltı", ogle: "Öğle", ikindi: "İkindi" },
  vegLabel: "Vejetaryen",
  vegSame: "Günün menüsü zaten etsiz",
  weekend: "Bugün okul yok; liste pazartesiden başlar.",
  today: "Bugün",
  legendTitle: "Alerjen işaretleri",
  allergens: {
    G: "Gluten",
    S: "Süt",
    Y: "Yumurta",
    K: "Kabuklu yemiş (mutfağımızda kullanılmaz)",
    B: "Balık",
    Su: "Susam",
  } as Record<Allergen, string>,
  principlesTitle: "Beslenme ilkeleri",
  principles: [
    "Aynı yemek iki hafta içinde tekrar etmez.",
    "Kızartma yok; tatlı haftada bir, meyve her gün.",
    "Alerjisi olan öğrencinin tabağı ayrı hazırlanır ve adıyla etiketlenir.",
  ],
  appNote: "Gerçek bir okulda menü her cuma veli uygulamasında yayımlanır.",
  ilk: [
    [
      { day: "Pazartesi", dishes: [{ d: "Mercimek çorbası" }, { d: "Fırında tavuk" }, { d: "Bulgur pilavı", a: ["G"] }, { d: "Mevsim salatası" }], veg: { d: "Fırında sebzeli nohut" } },
      { day: "Salı", dishes: [{ d: "Ezogelin çorbası", a: ["G"] }, { d: "Zeytinyağlı taze fasulye" }, { d: "Yoğurt", a: ["S"] }, { d: "Tam buğday ekmeği", a: ["G"] }], veg: null },
      { day: "Çarşamba", dishes: [{ d: "Sebze çorbası" }, { d: "İzmir köfte", a: ["G", "Y"] }, { d: "Pirinç pilavı" }, { d: "Ayran", a: ["S"] }], veg: { d: "Mercimek köftesi", a: ["G"] } },
      { day: "Perşembe", dishes: [{ d: "Tarhana çorbası", a: ["G", "S"] }, { d: "Fırında levrek", a: ["B"] }, { d: "Patates püresi", a: ["S"] }, { d: "Roka salatası" }], veg: { d: "Fırında kabak mücver", a: ["G", "Y", "S"] } },
      { day: "Cuma", dishes: [{ d: "Yayla çorbası", a: ["S", "G"] }, { d: "Nohutlu ıspanak" }, { d: "Erişte", a: ["G", "Y"] }, { d: "Mevsim meyvesi" }], veg: null },
    ],
    [
      { day: "Pazartesi", dishes: [{ d: "Domates çorbası", a: ["S"] }, { d: "Etli kuru fasulye" }, { d: "Pirinç pilavı" }, { d: "Ev turşusu" }], veg: { d: "Zeytinyağlı kuru fasulye" } },
      { day: "Salı", dishes: [{ d: "Şehriye çorbası", a: ["G"] }, { d: "Tavuk sote" }, { d: "Makarna", a: ["G"] }, { d: "Cacık", a: ["S"] }], veg: { d: "Sebzeli makarna", a: ["G"] } },
      { day: "Çarşamba", dishes: [{ d: "Mantar çorbası", a: ["S"] }, { d: "Karnıyarık" }, { d: "Bulgur pilavı", a: ["G"] }, { d: "Ayran", a: ["S"] }], veg: { d: "İmam bayıldı" } },
      { day: "Perşembe", dishes: [{ d: "Mercimek çorbası" }, { d: "Fırında somon", a: ["B"] }, { d: "Sebzeli kuskus", a: ["G"] }, { d: "Yeşil salata" }], veg: { d: "Fırında falafel, humus", a: ["G", "Su"] } },
      { day: "Cuma", dishes: [{ d: "Ezogelin çorbası", a: ["G"] }, { d: "Kıymalı pide", a: ["G", "S"] }, { d: "Mevsim salatası" }, { d: "Sütlaç", a: ["S"] }], veg: { d: "Peynirli pide", a: ["G", "S"] } },
    ],
  ] as PrimaryDay[][],
  ana: [
    [
      { day: "Pazartesi", kahvalti: { d: "Beyaz peynir, zeytin, domates, tam buğday ekmeği", a: ["S", "G"] }, ogle: { d: "Mercimek çorbası, fırında tavuk, bulgur pilavı", a: ["G"] }, ikindi: { d: "Elma dilimleri, ayran", a: ["S"] } },
      { day: "Salı", kahvalti: { d: "Haşlanmış yumurta, salatalık, ekmek", a: ["Y", "G"] }, ogle: { d: "Taze fasulye, yoğurt, pirinç pilavı", a: ["S"] }, ikindi: { d: "Ev yapımı havuçlu kek", a: ["G", "Y", "S"] } },
      { day: "Çarşamba", kahvalti: { d: "Yulaf lapası, muz", a: ["G", "S"] }, ogle: { d: "Sebze çorbası, köfte, pilav", a: ["G", "Y"] }, ikindi: { d: "Havuç çubukları, humus", a: ["Su"] } },
      { day: "Perşembe", kahvalti: { d: "Lor peyniri, pekmez, ekmek", a: ["S", "G"] }, ogle: { d: "Fırında levrek, patates püresi", a: ["B", "S"] }, ikindi: { d: "Mevsim meyvesi" } },
      { day: "Cuma", kahvalti: { d: "Menemen, ekmek", a: ["Y", "G"] }, ogle: { d: "Yayla çorbası, ıspanak, erişte", a: ["S", "G", "Y"] }, ikindi: { d: "Sütlü irmik tatlısı", a: ["S", "G"] } },
    ],
    [
      { day: "Pazartesi", kahvalti: { d: "Kaşar peyniri, domates, ekmek", a: ["S", "G"] }, ogle: { d: "Domates çorbası, kuru fasulye, pilav", a: ["S"] }, ikindi: { d: "Armut, ayran", a: ["S"] } },
      { day: "Salı", kahvalti: { d: "Omlet, salatalık, ekmek", a: ["Y", "G", "S"] }, ogle: { d: "Tavuk sote, makarna", a: ["G"] }, ikindi: { d: "Galeta, süt", a: ["G", "S"] } },
      { day: "Çarşamba", kahvalti: { d: "Sütlü mısır gevreği, mandalina", a: ["G", "S"] }, ogle: { d: "Mantar çorbası, karnıyarık, bulgur", a: ["S", "G"] }, ikindi: { d: "Yoğurt, meyve püresi", a: ["S"] } },
      { day: "Perşembe", kahvalti: { d: "Beyaz peynir, zeytin, ekmek", a: ["S", "G"] }, ogle: { d: "Fırında somon, sebzeli kuskus", a: ["B", "G"] }, ikindi: { d: "Mevsim meyvesi" } },
      { day: "Cuma", kahvalti: { d: "Haşlanmış yumurta, domates, ekmek", a: ["Y", "G"] }, ogle: { d: "Ezogelin çorbası, peynirli pide", a: ["G", "S"] }, ikindi: { d: "Sütlaç", a: ["S"] } },
    ],
  ] as KinderDay[][],
};

export const servis = {
  mapTitle: (district: string) => `${district} hattı`,
  mapLabel: (district: string) => `${district} servis hattının durakları ve sabah saatleri`,
  school: "Revak",
  arrive: "Kampüse varış",
  evening: "Dönüş",
  eveningText: (min: number) => `16.30 ve etüt sonrası 17.45'te kalkar; ilk durağa yaklaşık ${min} dakika.`,
  rulesTitle: "Servis kuralları",
  rules: [
    "Araç durakta en fazla iki dakika bekler. Geç kalacaksanız servis biriminin numarasına mesaj atın.",
    "Her araçta bir rehber personel var. Anaokulu ve ilkokul öğrencisi araçtan yalnızca kartlı veliye ya da formdaki kişiye indirilir.",
    "Etüt ve kulüp günleri için 17.45 dönüşü; günü bir gün önceden veli uygulamasında işaretlersiniz.",
    "Servis ücreti eğitim ücretine dahil değildir; güzergâha göre belirlenir ve aynı ödeme planına eklenir.",
    "Araçlar en fazla beş yaşında ve her ders yılı başında muayeneden geçer.",
  ],
  stops: {
    sariyer: [["Tarabya", "07.35"], ["Kireçburnu", "07.41"], ["Bahçeköy", "07.49"]],
    besiktas: [["Levent", "07.10"], ["Etiler", "07.18"], ["Ulus", "07.26"]],
    sisli: [["Nişantaşı", "07.05"], ["Esentepe", "07.16"], ["Maslak", "07.31"]],
    kagithane: [["Seyrantepe", "07.15"], ["Hamidiye", "07.22"], ["Ayazağa", "07.33"]],
    eyupsultan: [["Mithatpaşa", "07.20"], ["Göktürk", "07.31"], ["Kemerburgaz", "07.38"]],
    beykoz: [["Çubuklu", "07.00"], ["Kavacık", "07.10"], ["Rüzgarlıbahçe", "07.15"]],
    uskudar: [["Kuzguncuk", "06.55"], ["Beylerbeyi", "07.03"], ["Çengelköy", "07.10"]],
  } as Record<string, [string, string][]>,
};
