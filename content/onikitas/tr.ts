// Onikitaş copy, Turkish. Every visible string lives here so an English file
// with the same shape can be added later (see `Copy` type).
// Onikitaş is fictional: the brand, the villas, their facts and hours.

export type ChapterId = "safak" | "sabah" | "kusluk" | "ogle" | "ikindi" | "aksam" | "yatsi";

export type VillaStatus = "satista" | "opsiyonlu" | "satildi";

export type VillaCopy = {
  /** Roman numeral, also the villa's name. */
  no: string;
  facing: string;
  /** Facing, short form for the registry table. */
  dir: string;
  /** The hour this house "loves", HH:MM. Fictional. */
  hour: string;
  line: string;
  /** Fictional facts for the registry ("On iki ev"). No prices, by rule. */
  area: number;
  beds: number;
  plot: number;
  pool: string;
  status: VillaStatus;
};

export type Copy = {
  meta: { title: string; description: string };
  strip: { text: string; href: string };
  skip: string;
  brand: string;
  nav: { visit: string; sound: string; dayNav: string };
  loader: { label: string };
  /** Chapter names and copy. Their hours come from lib/onikitas/chapters.ts. */
  chapters: Record<ChapterId, { name: string; title: string; body: string }>;
  /** Closing links under the night chapter. */
  close: { visit: string; homes: string };
  dial: {
    label: string;
    hint: string;
    villaLegend: string;
    villaPrefix: string;
    cta: string;
    lightsAt: (time: string) => string;
  };
  tip: { loves: (time: string) => string };
  registry: {
    title: string;
    lead: string;
    caption: string;
    cols: { no: string; dir: string; area: string; beds: string; plot: string; pool: string; hour: string; status: string };
    status: Record<VillaStatus, string>;
    m2: (n: number) => string;
    see: string;
    /** Sold houses: ask about a similar one instead. */
    seeSimilar: string;
    note: string;
  };
  visit: {
    title: string;
    lead: string;
    summary: string;
    lightAt: (time: string) => string;
    statusNote: Record<Exclude<VillaStatus, "satista">, string>;
    date: string;
    dateHint: string;
    weekdays: string[];
    name: string;
    contact: string;
    contactHint: string;
    phone: string;
    email: string;
    people: string;
    peopleCount: (n: number) => string;
    privacy: string;
    submit: string;
    close: string;
    errDate: string;
    errName: string;
    errContact: string;
    errPhone: string;
    errEmail: string;
    done: {
      title: string;
      body: string;
      rows: { villa: string; light: string; date: string; people: string; name: string; contact: string };
      notSent: string;
      ok: string;
    };
  };
  footer: {
    fiction: string;
    made: string;
    back: string;
    creditsTitle: string;
    groups: { fonts: string; textures: string; code: string };
    procedural: string;
  };
  fallback: { stills: string };
};

// Facing and hour follow each house's real bearing on the west-facing slope
// (lib/onikitas/layout.ts) and the summer sun path of the scene: the hour is
// when the sun stands squarest to the house's front, or its last light.
export const villas: VillaCopy[] = [
  { no: "I", facing: "Güneybatıya bakar", dir: "Güneybatı", hour: "16:25", line: "İkindi güneşini terasında en uzun tutan ev.", area: 210, beds: 3, plot: 640, pool: "Özel", status: "satista" },
  { no: "II", facing: "Güneybatıya bakar", dir: "Güneybatı", hour: "17:10", line: "Kahvaltı gölgede, akşam yemeği güneşte.", area: 245, beds: 4, plot: 720, pool: "Özel, ısıtmalı", status: "satildi" },
  { no: "III", facing: "Batıya bakar", dir: "Batı", hour: "17:25", line: "Havuzu akşamüstü güneşini sonuna kadar alır.", area: 185, beds: 3, plot: 590, pool: "Özel", status: "satista" },
  { no: "IV", facing: "Batıya bakar", dir: "Batı", hour: "18:20", line: "Kuzeydeki avlusu öğle sıcağında bile serin.", area: 260, beds: 4, plot: 780, pool: "Özel", status: "opsiyonlu" },
  { no: "V", facing: "Batıya bakar", dir: "Batı", hour: "18:15", line: "Zeytinliğin hemen kıyısında.", area: 230, beds: 4, plot: 700, pool: "Özel", status: "satista" },
  { no: "VI", facing: "Batıya bakar", dir: "Batı", hour: "18:25", line: "Çardağı ikindi güneşini süzer.", area: 275, beds: 4, plot: 820, pool: "Özel, ısıtmalı", status: "satista" },
  { no: "VII", facing: "Kuzeybatıya bakar", dir: "Kuzeybatı", hour: "20:00", line: "Gün batımını salondan izlersiniz.", area: 320, beds: 5, plot: 960, pool: "Özel, ısıtmalı", status: "satista" },
  { no: "VIII", facing: "Batıya bakar", dir: "Batı", hour: "18:30", line: "Akşam meltemini ilk o alır.", area: 240, beds: 4, plot: 730, pool: "Özel", status: "satildi" },
  { no: "IX", facing: "Kuzeybatıya bakar", dir: "Kuzeybatı", hour: "20:10", line: "Yamacın en üstünde, en geniş manzarayla.", area: 300, beds: 5, plot: 910, pool: "Özel, ısıtmalı", status: "opsiyonlu" },
  { no: "X", facing: "Güneybatıya bakar", dir: "Güneybatı", hour: "16:10", line: "Denizle arasında yalnızca zeytin ağaçları var.", area: 195, beds: 3, plot: 610, pool: "Özel", status: "satista" },
  { no: "XI", facing: "Batıya bakar", dir: "Batı", hour: "19:40", line: "Çatı terası gün batımı için tasarlandı.", area: 285, beds: 4, plot: 870, pool: "Özel, ısıtmalı", status: "satista" },
  { no: "XII", facing: "Kuzeybatıya bakar", dir: "Kuzeybatı", hour: "20:15", line: "Günün son ışığı onun duvarına düşer.", area: 310, beds: 5, plot: 940, pool: "Özel, ısıtmalı", status: "satista" },
];

export const tr: Copy = {
  meta: {
    title: "Onikitaş Villaları · Yalıkavak, Bodrum",
    description:
      "Yalıkavak'ta koya ve gün batımına bakan yamaçta, her birinin önü deniz olan on iki taş villa. Kurgusal bir marka için hazırlanmış rasitburucu.com konsept çalışması.",
  },
  strip: { text: "Konsept çalışma — rasitburucu.com", href: "/tr" },
  skip: "İçeriğe geç",
  brand: "Onikitaş",
  nav: { visit: "Ziyaret", sound: "Ses", dayNav: "Günün saatleri" },
  loader: { label: "Sahne hazırlanıyor" },
  chapters: {
    safak: {
      name: "Şafak",
      title: "Yamaçta on iki ev. Hepsinin önü deniz.",
      body: "Onikitaş Villaları, Yalıkavak koyuna bakan yamaçta taş, kireç ve zeytin arasında yükseliyor. Her ev batıya, denize ve gün batımına dönük yerleştirildi.",
    },
    sabah: {
      name: "Sabah",
      title: "Hiçbir ev, komşusunun denizini kesmiyor.",
      body: "Evleri yamacın eğimine göre kademe kademe yerleştirdik. Hangi terasa çıkarsanız çıkın, önünüzde yalnızca deniz ve zeytin var.",
    },
    kusluk: {
      name: "Kuşluk",
      title: "Bodrum taşı, kireç sıva, meşe ve traverten.",
      body: "Yarımadanın yüzyıllardır kullandığı malzemeleri seçtik. Kalın taş duvarlar sabahın serinliğini öğleden sonraya kadar içeride tutar.",
    },
    ogle: {
      name: "Öğle",
      title: "En sıcak saatte bile avlunuz gölgede.",
      body: "Her avluyu evin kuzeyine aldık. Öğle güneşinde bile avlunun yarısı gölgede kalır.",
    },
    ikindi: {
      name: "İkindi",
      title: "İkindi meltemi, klimadan iyidir.",
      body: "Evler, yarımadanın kuzeybatı rüzgârına açık konumlandı. Akşamüstü pencereleri açmanız, evi serinletmeye yeter.",
    },
    aksam: {
      name: "Akşam",
      title: "Evinizi hangi ışıkta görmek istersiniz?",
      body: "Bir saat ve bir ev seçin; ziyaretinizi o ışığa göre planlayalım.",
    },
    yatsi: {
      name: "Yatsı",
      title: "Gece, on iki pencere yanar.",
      body: "Yamaç sessizleşir, geriye denizin sesi kalır. Onikitaş, 2027 yazında ilk sahiplerini ağırlıyor.",
    },
  },
  close: { visit: "Ziyaret planla", homes: "Evleri tek tek inceleyin" },
  dial: {
    label: "Ziyaret saati",
    hint: "Güneşi sürükleyerek saati seçin.",
    villaLegend: "Hangi ev?",
    villaPrefix: "Villa",
    cta: "Bu ışıkta ziyaret iste",
    lightsAt: (time) => `${time} ışığında`,
  },
  tip: { loves: (time) => `En güzel saati ${time}` },
  registry: {
    title: "On iki ev, tek tek.",
    lead: "Her evin alanı, oda sayısı, cephesi ve gün içinde en güzel göründüğü saat. Beğendiğiniz evi seçin, ziyaretinizi o eve göre planlayalım.",
    caption: "On iki villanın cephesi, alanı, oda sayısı, arsası, havuzu, en güzel saati ve satış durumu",
    cols: {
      no: "Villa",
      dir: "Cephe",
      area: "Kapalı alan",
      beds: "Yatak odası",
      plot: "Arsa",
      pool: "Havuz",
      hour: "En güzel saati",
      status: "Durum",
    },
    status: { satista: "Satışta", opsiyonlu: "Opsiyonlu", satildi: "Satıldı" },
    m2: (n) => `${n} m²`,
    see: "Bu evi gör",
    seeSimilar: "Benzerini sorun",
    note: "Örnek bilgiler; Onikitaş kurgusal bir projedir. Fiyat bilgisi görüşmede paylaşılır.",
  },
  visit: {
    title: "Ziyaretinizi planlayalım.",
    lead: "Seçtiğiniz evi, seçtiğiniz ışıkta birlikte gezelim.",
    summary: "Seçiminiz",
    lightAt: (time) => `${time} ışığında`,
    statusNote: {
      opsiyonlu: "Bu ev için bir opsiyon var. Ziyarette güncel durumu birlikte konuşuruz.",
      satildi: "Bu ev satıldı. Ziyarette aynı cepheye bakan evleri gösteririz.",
    },
    date: "Hangi gün gelirsiniz?",
    dateHint: "Önümüzdeki 30 gün",
    weekdays: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
    name: "Ad soyad",
    contact: "Size nasıl ulaşalım?",
    contactHint: "Telefon ya da e-posta; biri yeterli.",
    phone: "Telefon",
    email: "E-posta",
    people: "Kaç kişi gelirsiniz?",
    peopleCount: (n) => `${n} kişi`,
    privacy: "Bilgileriniz yalnızca bu sekmede tutulur, hiçbir yere gönderilmez.",
    submit: "Ziyaret talebini hazırla",
    close: "Kapat",
    errDate: "Ziyaret için bir gün seçin.",
    errName: "Adınızı ve soyadınızı yazın.",
    errContact: "Telefon numaranızı ya da e-posta adresinizi yazın.",
    errPhone: "Telefon numarası en az 10 haneli olmalı.",
    errEmail: "Geçerli bir e-posta adresi yazın.",
    done: {
      title: "Talebiniz hazır.",
      body: "Satış ofisimiz bir iş günü içinde sizi arar, ziyaret saatini birlikte netleştirirsiniz.",
      rows: { villa: "Ev", light: "Işık", date: "Gün", people: "Kişi", name: "Ad soyad", contact: "İletişim" },
      notSent: "Konsept: hiçbir bilgi gönderilmedi.",
      ok: "Tamam",
    },
  },
  footer: {
    fiction:
      "Onikitaş kurgusal bir projedir. Adı, evleri, saatleri ve bu sayfadaki bütün bilgiler bir konsept çalışma için yazıldı.",
    made: "Tasarım ve geliştirme: rasitburucu.com",
    back: "rasitburucu.com'a dön",
    creditsTitle: "Künye",
    groups: { fonts: "Yazı tipleri", textures: "Dokular", code: "Yazılım" },
    procedural: "Arazi, evler, zeytinler, deniz ve gökyüzü tarayıcıda kodla üretilir; hazır üç boyutlu model yoktur.",
  },
  fallback: { stills: "Hareket azaltıldı: sahne, günün saatlerinden seçilmiş durağan karelerle gösteriliyor." },
};
