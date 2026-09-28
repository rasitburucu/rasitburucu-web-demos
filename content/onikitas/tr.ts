// Onikitaş copy, Turkish. Every visible string lives here so an English file
// with the same shape can be added later (see `Copy` type).
// Onikitaş is fictional: the brand, the villas, their facts and hours.

export type ChapterId = "safak" | "sabah" | "kusluk" | "ogle" | "ikindi" | "aksam" | "yatsi";

export type VillaCopy = {
  /** Roman numeral, also the villa's name. */
  no: string;
  /** Turkish accusative suffix for the numeral as read aloud ("VII'yi"). */
  acc: string;
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
  loader: { coords: string; time: string; label: string };
  chapters: Record<ChapterId, { name: string; time: string; title: string; body: string }>;
  dial: {
    label: string;
    hint: string;
    villaLegend: string;
    villaPrefix: string;
    cta: string;
    copy: string;
    opened: string;
    copied: string;
    copyFailed: string;
    mailTo: string;
    subject: (villa: string, time: string) => string;
    body: (villaAcc: string, time: string) => string;
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
  { no: "I", acc: "I'i", facing: "Doğuya bakar", hour: "06:10", line: "Günün ilk ışığı onun duvarına düşer." },
  { no: "II", acc: "II'yi", facing: "Güneydoğuya bakar", hour: "08:30", line: "Kahvaltı masası gölgeye hiç girmez." },
  { no: "III", acc: "III'ü", facing: "Güneye bakar", hour: "11:00", line: "Havuzu en erken ısınan ev." },
  { no: "IV", acc: "IV'ü", facing: "Güneye bakar", hour: "13:20", line: "Öğlen avlusu serin bir odaya döner." },
  { no: "V", acc: "V'i", facing: "Güneydoğuya bakar", hour: "09:40", line: "Zeytinliğe en yakın ev." },
  { no: "VI", acc: "VI'yı", facing: "Güneye bakar", hour: "15:00", line: "Pergolası ikindide çizgili gölge örer." },
  { no: "VII", acc: "VII'yi", facing: "Batıya bakar", hour: "18:40", line: "Akşamı sever; avlusu altın rengine döner." },
  { no: "VIII", acc: "VIII'i", facing: "Güneybatıya bakar", hour: "17:30", line: "Meltemi ilk o duyar." },
  { no: "IX", acc: "IX'u", facing: "Doğuya bakar", hour: "07:20", line: "Yamacın en yukarısında; sabahı herkesten önce görür." },
  { no: "X", acc: "X'u", facing: "Güneye bakar", hour: "12:10", line: "Denizle arasında yalnızca zeytin var." },
  { no: "XI", acc: "XI'i", facing: "Güneybatıya bakar", hour: "19:10", line: "Gün batımını çatıdan izlemek için yapıldı." },
  { no: "XII", acc: "XII'yi", facing: "Batıya bakar", hour: "20:05", line: "Son ışığı o alır, ilk lambayı o yakar." },
];

export const tr: Copy = {
  meta: {
    title: "Onikitaş · Bir günün ışığında on iki ev",
    description:
      "Bodrum'da kurgusal on iki ev, bir günün ışığında gezilen gerçek zamanlı bir maket. rasitburucu.com konsept çalışması.",
  },
  strip: { text: "Konsept çalışma — rasitburucu.com", href: "https://rasitburucu.com/tr" },
  skip: "İçeriğe geç",
  brand: "Onikitaş",
  nav: { visit: "Ziyaret", soundOn: "Sesi kapat", soundOff: "Sesi aç", dayNav: "Günün saatleri" },
  loader: { coords: "37°02′K  27°26′D", time: "05:41", label: "Sahne hazırlanıyor" },
  chapters: {
    safak: {
      name: "Şafak",
      time: "05:41",
      title: "On iki taş. Bir yamaç. Bir gün.",
      body: "Bodrum'da, denize dönük bir yamaçta on iki ev. Onları bir günün ışığında gösteriyoruz; kaydırdıkça gün ilerler.",
    },
    sabah: {
      name: "Sabah",
      time: "07:00",
      title: "Yamaca yaslanan on iki taş.",
      body: "Evler eğimi izler, hiçbiri ötekinin denizini kesmez. Güneş önce en doğudakine, I'e değer.",
    },
    kusluk: {
      name: "Kuşluk",
      time: "10:00",
      title: "Işık değdiği yeri gerçek kılar.",
      body: "Beyaz maket, güneş geçtikçe kirece, travertene ve zeytine döner. Kalın duvarlar sabahın serinliğini öğlene taşır.",
    },
    ogle: {
      name: "Öğle",
      time: "13:00",
      title: "Öğlen, gölge bir oda olur.",
      body: "Her avlu kuzeye çekilmiş. En sıcak saatte bile havuzun yarısı gölgede kalır.",
    },
    ikindi: {
      name: "İkindi",
      time: "16:30",
      title: "Meltem ikindiyle gelir.",
      body: "Zeytinler gümüş yüzünü çevirir. Bir eve dokunun; hangi saati sevdiğini söyler.",
    },
    aksam: {
      name: "Akşam",
      time: "19:40",
      title: "Evi hangi saatin ışığında görmek istersiniz?",
      body: "Güneşi sürükleyin, bir ev seçin. Ziyaretinizi o ışığa göre ayarlayalım.",
    },
    yatsi: {
      name: "Yatsı",
      time: "21:30",
      title: "Gece, on iki pencere.",
      body: "Lambalar birer birer yanar. Yamaç sabaha kadar denizi dinler.",
    },
  },
  dial: {
    label: "Ziyaret saati",
    hint: "Güneşi sürükleyin ya da ok tuşlarıyla saati değiştirin.",
    villaLegend: "Hangi ev?",
    villaPrefix: "Villa",
    cta: "Bu ışıkta ziyaret iste",
    copy: "Metni kopyala",
    opened: "E-posta taslağı açıldı. Bu bir konsept çalışma: adres kurgusal, mesaj kimseye ulaşmaz.",
    copied: "Metin kopyalandı. Bu bir konsept çalışma: adres kurgusal, mesaj kimseye ulaşmaz.",
    copyFailed: "Kopyalanamadı. Metni e-posta düğmesiyle açabilirsiniz.",
    mailTo: "ziyaret@onikitas.example",
    subject: (villa, time) => `Onikitaş, Villa ${villa}, ${time} ışığı`,
    body: (villaAcc, time) =>
      `Merhaba,\n\nVilla ${villaAcc} ${time} ışığında görmek istiyorum. Uygun bir gün önerebilir misiniz?\n\nAd:\nTelefon:\n\n(Bu metin rasitburucu.com için hazırlanmış Onikitaş konsept çalışmasından geldi. Adres kurgusaldır.)`,
    lightsAt: (time) => `${time} ışığında`,
  },
  tip: { loves: (time) => `En sevdiği saat ${time}` },
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
