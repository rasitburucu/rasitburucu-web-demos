// Onikitaş copy, Turkish. Every visible string lives here so an English file
// with the same shape can be added later (see `Copy` type).
// Onikitaş is fictional: the brand, the villas, their facts and hours.

export type ChapterId = "safak" | "sabah" | "kusluk" | "ogle" | "ikindi" | "aksam" | "yatsi";

export type VillaCopy = {
  /** Roman numeral, also the villa's name. */
  no: string;
  facing: string;
  /** The hour this house "loves", HH:MM. Fictional. */
  hour: string;
  line: string;
};

export type Copy = {
  meta: { title: string; description: string };
  strip: { text: string; href: string };
  skip: string;
  brand: string;
  nav: { visit: string; soundOn: string; soundOff: string; dayNav: string };
  loader: { time: string; label: string };
  chapters: Record<ChapterId, { name: string; time: string; title: string; body: string }>;
  dial: {
    label: string;
    hint: string;
    villaLegend: string;
    villaPrefix: string;
    cta: string;
    lightsAt: (time: string) => string;
  };
  tip: { loves: (time: string) => string };
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

export const villas: VillaCopy[] = [
  { no: "I", facing: "Güneydoğuya bakar", hour: "06:10", line: "Yamaçta güne ilk uyanan ev." },
  { no: "II", facing: "Güneydoğuya bakar", hour: "08:30", line: "Kahvaltı terasına sabah güneşi tam oturur." },
  { no: "III", facing: "Güneye bakar", hour: "11:00", line: "Havuzu gün içinde en erken ısınan ev." },
  { no: "IV", facing: "Güneye bakar", hour: "13:20", line: "Kuzeydeki avlusu öğle sıcağında bile serin." },
  { no: "V", facing: "Güneye bakar", hour: "09:40", line: "Zeytinliğin hemen kıyısında." },
  { no: "VI", facing: "Güneye bakar", hour: "15:00", line: "Çardağı ikindi güneşini süzer." },
  { no: "VII", facing: "Batıya bakar", hour: "18:40", line: "Gün batımını salondan izlersiniz." },
  { no: "VIII", facing: "Güneye bakar", hour: "17:30", line: "Akşam meltemini ilk o alır." },
  { no: "IX", facing: "Güneybatıya bakar", hour: "07:20", line: "Yamacın en üstünde, en geniş manzarayla." },
  { no: "X", facing: "Güneydoğuya bakar", hour: "12:10", line: "Denizle arasında yalnızca zeytin ağaçları var." },
  { no: "XI", facing: "Güneye bakar", hour: "19:10", line: "Çatı terası gün batımı için tasarlandı." },
  { no: "XII", facing: "Güneybatıya bakar", hour: "20:05", line: "Günün son ışığı onun duvarına düşer." },
];

export const tr: Copy = {
  meta: {
    title: "Onikitaş Villaları · Yalıkavak, Bodrum",
    description:
      "Yalıkavak'ın güney sırtlarında, her birinin önü deniz olan on iki taş villa. Kurgusal bir marka için hazırlanmış rasitburucu.com konsept çalışması.",
  },
  strip: { text: "Konsept çalışma — rasitburucu.com", href: "/tr" },
  skip: "İçeriğe geç",
  brand: "Onikitaş",
  nav: { visit: "Ziyaret", soundOn: "Sesi kapat", soundOff: "Sesi aç", dayNav: "Günün saatleri" },
  loader: { time: "05:41", label: "Sahne hazırlanıyor" },
  chapters: {
    safak: {
      name: "Şafak",
      time: "05:41",
      title: "Yamaçta on iki ev. Hepsinin önü deniz.",
      body: "Onikitaş Villaları, Yalıkavak'ın güney sırtlarında taş, kireç ve zeytin arasında yükseliyor. Her ev, günün en güzel ışığını alacak açıyla yerleştirildi.",
    },
    sabah: {
      name: "Sabah",
      time: "07:00",
      title: "Hiçbir ev, komşusunun denizini kesmiyor.",
      body: "Evleri yamacın eğimine göre kademe kademe yerleştirdik. Hangi terasa çıkarsanız çıkın, önünüzde yalnızca deniz ve zeytin var.",
    },
    kusluk: {
      name: "Kuşluk",
      time: "10:00",
      title: "Bodrum taşı, kireç sıva, meşe ve traverten.",
      body: "Yarımadanın yüzyıllardır kullandığı malzemeleri seçtik. Kalın taş duvarlar sabahın serinliğini öğleden sonraya kadar içeride tutar.",
    },
    ogle: {
      name: "Öğle",
      time: "13:00",
      title: "En sıcak saatte bile avlunuz gölgede.",
      body: "Her avluyu evin kuzeyine aldık. Öğle güneşinde bile avlunun yarısı, havuzun da uzun kenarı gölgede kalır.",
    },
    ikindi: {
      name: "İkindi",
      time: "16:30",
      title: "İkindi meltemi, klimadan iyidir.",
      body: "Evler, yarımadanın kuzeybatı rüzgârına açık konumlandı; pencereleri açmanız yeter. Her evin gün içinde en güzel göründüğü bir saat var, evlerin üzerine gelip tanışın.",
    },
    aksam: {
      name: "Akşam",
      time: "19:40",
      title: "Evinizi hangi ışıkta görmek istersiniz?",
      body: "Bir saat ve bir ev seçin; ziyaretinizi o ışığa göre planlayalım.",
    },
    yatsi: {
      name: "Yatsı",
      time: "21:30",
      title: "Gece, on iki pencere yanar.",
      body: "Yamaç sessizleşir, geriye denizin sesi kalır. Onikitaş, 2027 yazında ilk sahiplerini ağırlıyor.",
    },
  },
  dial: {
    label: "Ziyaret saati",
    hint: "Güneşi sürükleyerek saati seçin.",
    villaLegend: "Hangi ev?",
    villaPrefix: "Villa",
    cta: "Bu ışıkta ziyaret iste",
    lightsAt: (time) => `${time} ışığında`,
  },
  tip: { loves: (time) => `En güzel saati ${time}` },
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
