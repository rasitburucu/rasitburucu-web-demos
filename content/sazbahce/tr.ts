// Every Turkish string of the Sazbahçe concept. Pages and components read from
// here; nothing is typed into the markup.
//
// Durum: taslak, Raşit’in onayını bekliyor (.tasarim/sazbahce/METIN-ONAY.md).
// Sazbahçe hayalidir. Kapasiteler, kurallar, teknik bilgiler ve doluluk örnektir.
// Gün batımı saatleri gerçek hesaptır (lib/sazbahce/sun.ts).

import type { AreaKey, Ceremony, Setup, Slot } from "@/lib/sazbahce/venue";

const BASE = "/sazbahce";

export type NavLink = { label: string; href: string };

const NAV_ITEMS: NavLink[] = [
  { label: "Takvim ve plan", href: `${BASE}/#planla` },
  { label: "Alanlar", href: `${BASE}/alanlar/` },
  { label: "Kurumsal", href: `${BASE}/kurumsal/` },
  { label: "Ziyaret", href: `${BASE}/ziyaret/` },
];
const REQUEST: NavLink = { label: "Teklif iste", href: `${BASE}/teklif/` };

export type AreaCopy = {
  name: string;
  /** Dative ("…’na"), used in "X’na geç". */
  dat: string;
  /** Upper-case label on the plan. */
  plan: string;
  kind: string;
  season: string;
  lead: string;
  body: string[];
  notes: string[];
  photoAlt: string;
  photo2Alt: string;
};

export const tr = {
  base: BASE,
  meta: {
    title: "Sazbahçe | Uluabat Gölü kıyısında düğün ve davet bahçesi (konsept)",
    description:
      "Uluabat Gölü’nün doğu kıyısında hayali bir düğün ve davet bahçesi. Tarihinizi seçin, misafir sayınızı yazın; masalar planda dizilsin, teklif özetiniz hazır olsun. Konsept çalışma.",
    areasTitle: "Alanlar | Sazbahçe (konsept)",
    areasDescription: "Söğüt Çayırı, Ağ Ambarı, Ceviz Avlusu ve İskele: kapasite, kurulum düzenleri, sezon ve yağmur planı.",
    corporateTitle: "Kurumsal | Sazbahçe (konsept)",
    corporateDescription: "Toplantı, lansman ve yılsonu yemekleri için düzen planlayıcı, kapasite tablosu ve teknik föy.",
    requestTitle: "Teklif talebi | Sazbahçe (konsept)",
    requestDescription: "Beş adımda teklif talebi: tarih, tören, misafir, alan, ikram. Konsept çalışma, hiçbir bilgi gönderilmez.",
    visitTitle: "Ziyaret ve yol tarifi | Sazbahçe (konsept)",
    visitDescription: "İstanbul’dan, Bursa’dan ve havalimanından yol tarifi; alanları görmek için görüşme randevusu.",
    notFoundTitle: "Bu yol göle çıkmıyor | Sazbahçe (konsept)",
    ogAlt: "Sazbahçe: Uluabat Gölü kıyısında gün batımı ve kıyı planı.",
  },
  skip: "İçeriğe geç",
  strip: { text: "Konsept çalışma —", link: "rasitburucu.com", href: "https://rasitburucu.com" },
  brand: { name: "Sazbahçe", home: "Sazbahçe ana sayfa", place: "Uluabat Gölü kıyısı, Bursa" },
  nav: { label: "Ana menü", items: NAV_ITEMS, cta: REQUEST.label, ctaHref: REQUEST.href, menu: "Menü", close: "Kapat" },
  sample: "örnek",
  render: "3B canlandırma",

  ceremonies: { nikah: "Nikâh", kina: "Kına", nisan: "Nişan", dugun: "Düğün", kurumsal: "Kurumsal" } satisfies Record<Ceremony, string>,
  slots: {
    ogle: { label: "Öğle", range: "12.00–17.00" },
    gunbatimi: { label: "Gün batımı", range: "güneşe göre" },
    aksam: { label: "Akşam", range: "20.00–00.30" },
  } satisfies Record<Slot, { label: string; range: string }>,
  setups: {
    yuvarlak: "Yuvarlak masa",
    uzun: "Uzun masa",
    tiyatro: "Tiyatro",
    sinif: "Sınıf",
    u: "U düzen",
    kokteyl: "Kokteyl",
  } satisfies Record<Setup, string>,
  setupHints: {
    yuvarlak: "Gala yemeği, ödül gecesi",
    uzun: "Ekip yemeği, yılsonu",
    tiyatro: "Sunum, lansman",
    sinif: "Eğitim, not alınan toplantı",
    u: "Yönetim toplantısı, atölye",
    kokteyl: "Ayakta karşılama, tanışma",
  } satisfies Record<Setup, string>,

  areas: {
    cayir: {
      name: "Söğüt Çayırı",
      dat: "Söğüt Çayırı’na",
      plan: "SÖĞÜT ÇAYIRI",
      kind: "Açık hava, göle bakar",
      season: "Nisan–Ekim",
      lead: "Kıyıya inen çayırı yaşlı söğütler çevreler. Pist göl tarafına kurulur; güneş batarken misafirlerinizin önünde yalnız su kalır.",
      body: [
        "Çayır batıya, göle doğru hafifçe iner. Masaları bu eğime göre dizeriz: arka sıradaki misafir de ön sıranın üstünden suyu görür.",
        "Söğütlerin gölgesi öğleden sonra pisti serin tutar. Akşam çakıl yol boyunca fenerler yanar; misafirleriniz kıyıya kadar yürür.",
      ],
      notes: [
        "Zemin drenajlı; masa aralarına ahşap yürüme yolu döşenir, ince topukla rahat yürünür.",
        "Yağmur planı: çayır düğünü olan gün Ağ Ambarı başka davete verilmez. Hava kötüyse 48 saat önce birlikte karar veririz.",
        "Müzik 00.30’a kadar.",
      ],
      photoAlt: "Gün batımında göl kıyısındaki çayırda kurulu yuvarlak masalar, iki yanda salkım söğütler",
      photo2Alt: "Göle bakan bir masada mumlar, tabaklar ve beyaz çiçekler; arkada gün batımı",
    },
    ambar: {
      name: "Ağ Ambarı",
      dat: "Ağ Ambarı’na",
      plan: "AĞ AMBARI",
      kind: "Kapalı, ahşap çatı",
      season: "Dört mevsim",
      lead: "Balıkçıların ağ kuruttuğu eski ambarı ahşap çatısıyla koruduk. Kışın ısıtılır, yazın göl rüzgârı kapıdan girer.",
      body: [
        "Batı kapısı çayıra açılır: yaz düğünlerinde ambar ile çayır tek alan gibi kullanılır.",
        "Çatı makasları ışık asmaya hazır. Sahne, perde ve ses düzeni kuzey duvarında sabit durur; kurulum için saatlerce beklemezsiniz.",
      ],
      notes: [
        "Isıtma ve havalandırma var; Ocak’ta da Temmuz’da da rahat oturulur.",
        "Araç girebilen yükleme kapısı: sahne ve stant kurulumu kolay.",
        "Eşiksiz giriş, tekerlekli sandalyeye uygun tuvalet.",
      ],
      photoAlt: "Ahşap çatı makaslı ambarda yuvarlak masalar ve ampul dizileri; açık batı kapısından göl görünüyor",
      photo2Alt: "Ambar sunum düzeninde: perdeye dönük sandalye sıraları, pencerelerden öğleden sonra ışığı",
    },
    avlu: {
      name: "Ceviz Avlusu",
      dat: "Ceviz Avlusu’na",
      plan: "CEVİZ AVLUSU",
      kind: "Taş duvarlı avlu",
      season: "Nisan–Ekim",
      lead: "Taş duvarla çevrili avlunun ortasında yaşlı bir ceviz var. Kına gecesi için yeterince yakın, kalabalığa yetecek kadar geniş.",
      body: [
        "Avlu rüzgâr almaz: göl kıyısında akşam serinliği başladığında misafirleriniz burada üşümez.",
        "Kına tahtını cevizin altına kurarız; masalar ağacın çevresinde halka olur.",
      ],
      notes: [
        "Kına, nişan, söz ve 140 kişiye kadar düğün.",
        "Avlu kapısı çayıra açılır; tören çayırda, yemek avluda olabilir.",
        "Müzik 00.30’a kadar.",
      ],
      photoAlt: "Taş duvarlı avluda cevizin çevresinde yuvarlak masalar, dallarda fenerler, arkada ışıkları yanan taş ev",
      photo2Alt: "Avludaki bir masada mumlu pirinç kına tepsisi ve çay takımı",
    },
    iskele: {
      name: "İskele",
      dat: "İskele’ye",
      plan: "İSKELE",
      kind: "Nikâh için, göle uzanır",
      season: "Nisan–Ekim",
      lead: "Nikâh masası göle uzanan iskelenin ucunda durur. Siz evet derken arkanızda yalnız göl olur.",
      body: [
        "Doksan misafir kıyıda, iskeleye dönük sıralarda oturur. Tören bitince herkes yirmi adım ötedeki çayıra geçer.",
        "İskele yalnız tören içindir; yemek ve eğlence çayırda, ambarda ya da avluda.",
      ],
      notes: [
        "Nikâh masası, ses düzeni ve gölgelik hazır.",
        "Rüzgârlı günlerde tören kıyıdaki söğütlerin altına alınır.",
        "İskele korkuluklu; çocuklu misafirler için kıyı tarafına ip çekilir.",
      ],
      photoAlt: "Söğütlerin arasından göle uzanan iskeleye dönük sandalye sıraları, gün batımı",
      photo2Alt: "İskelenin ucunda beyaz örtülü nikâh masası ve çiçekler, arkada göl",
    },
  } satisfies Record<AreaKey, AreaCopy>,

  months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
  monthsShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
  weekdays: ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"],
  weekdaysShort: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
  weekdaysLong: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],

  hero: {
    title: "Söğütlerin altında, göle bakan bir sofra.",
    sub: "Misafir sayınızı yazın, masalarınız çayıra dizilsin. Pist göl tarafında kalır; alan dar gelirse bunu teklif beklemeden öğrenirsiniz.",
    photoCaption: "Uluabat Gölü, Gölyazı, bir kış akşamı",
    planHeading: "Takvim ve plan",
  },

  calendar: {
    label: "Uygunluk takvimi",
    prev: "Önceki ay",
    next: "Sonraki ay",
    legend: { bos: "boş", opsiyon: "opsiyonlu", dolu: "dolu" },
    perDot: "Her nokta bir alan",
    sample: "Örnek doluluk",
    free: "Boş:",
    held: "Opsiyonlu:",
    busy: "Dolu:",
    allBusy: "Bu gün bütün alanlar dolu.",
    winter: "Açık alanlar Kasım–Mart arası kapalı; Ağ Ambarı dört mevsim açık.",
    sunset: (at: string) => `Güneş göle ${at} iner.`,
    dayAria: (label: string, free: number, held: number) => `${label}, ${free ? `${free} alan boş` : "boş alan yok"}${held ? `, ${held} opsiyonlu` : ""}`,
    past: "geçmiş tarih",
  },

  planner: {
    ceremonyLabel: "Ne kutluyorsunuz?",
    guestsLabel: "Misafir",
    guestsUnit: "misafir",
    less: "10 misafir azalt",
    more: "10 misafir artır",
    areaLabel: "Alan",
    slotLabel: "Saat",
    slotSunset: (start: string, set: string) => `Tören ${start}, güneş ${set} batar.`,
    setupLabel: "Düzen",
    cta: "Teklif özetini gör",
    ctaNote: "Fiyat yerine size özel teklif hazırlarız.",
    planLabel: "Sazbahçe kıyı planı: batıda göl ve iskele, ortada Söğüt Çayırı, doğuda Ağ Ambarı ve Ceviz Avlusu. Bir alana dokunarak seçin.",
    pick: (name: string) => `${name} alanını seç`,
    north: "K",
    scale: "10 m",
    entrance: "Giriş",
    lake: "ULUABAT GÖLÜ",
    pist: "pist",
    sahne: "sahne",
    altar: "nikâh",
    seeArea: "Alanı yakından görün",
    capacity: (min: number, max: number) => `Yemekli düzende ${min}–${max} kişi`,
    upTo: (n: number) => `${n} kişiye kadar`,
    sampleCap: "Kapasiteler örnektir.",
  },

  reading: {
    round: (t: number, s: number) => `${t} masa, ${s} sandalye`,
    roundCayir: "Pist göl tarafında; en arka masa bile suyu görür.",
    roundAmbar: "Pist sahnenin önünde; batı kapısı çayıra açılır.",
    roundAvlu: "Masalar cevizin çevresinde; ağacın altı pist olur.",
    spare: (n: number) => `Yanında ${n} masalık boş yer kalır.`,
    full: "Alan tam dolu; ikram masaları dışarı alınır.",
    chairs: (n: number) => `${n} sandalye, töreni görür`,
    nikahIskele: "Nikâh masası iskelenin ucunda; arkanızda yalnız göl var.",
    nikahCayir: "Nikâh masası kıyıda; misafirler göle bakar.",
    nikahAmbar: "Nikâh masası kuzey duvarında; yağmurda da tören saatinde başlar.",
    nikahAvlu: "Nikâh masası cevizin altında; sıralar ağaca dönük.",
    long: (t: number, s: number) => `${t} uzun masa, ${s} kişi`,
    longNote: "Sunum perdesi ambarın kuzey duvarında; öğle yemeği çayırda.",
    theatre: (s: number) => `${s} sandalye, sahneye dönük`,
    classroom: (t: number, s: number) => `${t} masa, ${s} kişi not alır`,
    u: (s: number) => `U masada ${s} kişi`,
    cocktail: (t: number, s: number) => `${t} ayakta masa, ${s} kişi`,
    room: (n: number) => `${n} kişilik daha yer var.`,
    busy: (name: string, closed: boolean) => (closed ? `${name} bu tarihte kapalı` : `${name} bu tarihte dolu`),
    busyFree: "O gün alınabilecek alanlar:",
    busyNone: "O gün bu kalabalığı alan boş bir alan yok. Takvimden yakın bir gün seçin; birlikte bakalım.",
    go: (name: string) => `${name} geç`,
    goHeld: (name: string) => `${name} geç (opsiyonlu)`,
    iskeleTitle: "İskele yalnız nikâh içindir",
    iskeleBody: "Nikâh iskelede, yemek yirmi adım ötede çayırda. İkisini birlikte isteyebilirsiniz.",
    toNikah: "Nikâh olarak planla",
    overTitle: (name: string, cap: number) => `${name} en çok ${cap} kişi alır`,
    overSuggest: (n: number, name: string) => `${n} misafir için ${name} uygun.`,
    overNone: "Bu kalabalık için çayır ile avlu birlikte açılabilir; bunu teklifte konuşalım.",
    noSetup: (name: string, setup: string) => `${name} için ${setup} düzeni yok`,
    noSetupBody: "Bu düzen için başka bir alan seçin.",
  },

  summary: {
    title: "Teklif talebiniz",
    lead: "Seçtikleriniz aşağıda. Fiyatı bu bilgilere göre size özel hazırlarız.",
    rows: { date: "Tarih", ceremony: "Tören", guests: "Misafir", area: "Alan", slot: "Saat", setup: "Düzen", catering: "İkram", extras: "Ekler", reach: "Size nasıl ulaşalım" },
    guests: (n: number) => `${n} kişi`,
    over: "kapasiteyi aşıyor; size alternatif öneririz",
    slotSunset: (start: string, set: string) => `Gün batımı: tören ${start}, güneş ${set} batar`,
    name: "Adınız",
    phone: "Telefon",
    send: "Talebi gönder",
    share: "Ailemle paylaş",
    more: "Ayrıntıları ekle",
    close: "Kapat",
    notSent: "Bu bir tasarım örneği; form hiçbir yere gönderilmez.",
    sentNote: "Gönderilmedi: bu bir tasarım örneği. Gerçek sitede talebiniz satış ekibine düşer ve size aynı gün dönülür [örnek].",
    copied: "Özet panoya kopyalandı; aile grubunuza yapıştırabilirsiniz.",
    shareTitle: "Sazbahçe teklif talebi",
    shareIntro: "Sazbahçe için teklif talebimiz:",
  },

  mobileBar: { label: "Plan özeti", summary: "Özet", date: "Tarih", free: (n: number, m: number) => (n || m ? [n ? `${n} boş` : "", m ? `${m} opsiyonlu` : ""].filter(Boolean).join(" · ") : "Bütün alanlar dolu") },

  home: {
    areas: {
      title: "Dört alan, tek kıyı",
      sub: "Nikâh iskelede, yemek çayırda, kına avluda. Hepsi birbirine yürüme mesafesinde; misafirleriniz arabaya binmeden alan değiştirir.",
      more: "Alanları inceleyin",
      photosNote: "Alan görselleri 3B canlandırmadır.",
    },
    sunset: {
      title: "Töreni güneşe göre kuruyoruz",
      sub: "Nikâhı güneş göle inmeden 45 dakika önce başlatırız. Fotoğraflarınız altın saatte çekilir, yemek alacakaranlıkta başlar.",
      note: "Saatler bu kıyı için hesaplandı; karşı kıyıdaki tepeler güneşi birkaç dakika erken saklayabilir.",
      ceremony: "Tören",
      sunset: "Gün batımı",
      caption: "Her ayın 15’i",
    },
    know: {
      title: "Gelmeden önce",
      sample: "Kurallar örnektir.",
      items: [
        { q: "Yağmur planı", a: "Açık alandaki her düğün için Ağ Ambarı o gün boş tutulur. Hava kötüyse 48 saat önce birlikte karar veririz." },
        { q: "Müzik saati", a: "Müzik 00.30’da biter. Kıyıdaki köylere saygı için bu saati uzatmıyoruz." },
        { q: "Ulaşım", a: "Bursa merkezine yaklaşık 40 dakika. 120 araçlık otopark; misafir servisi ayarlayabiliriz." },
        { q: "Hazırlık", a: "Gelin odası ve damat odası sabah 10.00’dan itibaren sizin. Fotoğrafçınız alanları bir gün önce gezebilir." },
        { q: "İkram", a: "Yemek kendi mutfağımızdan. Pasta ve kına tepsisi dışarıdan gelebilir." },
        { q: "Erişilebilirlik", a: "Ambar ve avlu eşiksiz. Çayıra ahşap yürüme yolu döşenir; iskele korkuluklu." },
      ],
    },
    corporate: {
      title: "Ekibinizi göl kıyısına çağırın",
      body: "Sabah ambarda sunum, öğlen çayırda uzun masa, akşam gün batımında yemek. Bayi toplantısı ve yılsonu yemekleri için düzeni planda kurun.",
      cta: "Kurumsal planlayıcı",
    },
    visit: {
      title: "Önce bir çay içelim",
      body: "Hafta içi her gün, gün batımına bir saat kala alanları birlikte gezelim. Tarihinizi ve misafir sayınızı getirin; planı yerinde kuralım.",
      cta: "Ziyaret randevusu",
      photoAlt: "Uluabat Gölü’nde sazlar arasında bağlı bir kayık, gün batımı",
    },
  },

  areasPage: {
    title: "Alanlar",
    lead: "Dört alan, tek bahçe. Her birini ayrı ayrı kiralayabilir ya da tören, yemek ve eğlence için birlikte kullanabilirsiniz.",
    index: "Alanlar",
    capacity: "Kapasite",
    setup: "Düzen",
    people: "Kişi",
    season: "Sezon",
    size: "Alan",
    sizeValue: (m2: number) => `yaklaşık ${m2.toLocaleString("tr-TR")} m²`,
    notes: "Bilmeniz gerekenler",
    planWith: "Bu alanla planla",
    request: "Bu alan için teklif iste",
    planCaption: (name: string) => `${name}, kıyı planında`,
    sample: "Kapasiteler ve kurallar örnektir; alan görselleri 3B canlandırmadır.",
  },

  corporatePage: {
    title: "Kurumsal toplantı ve davetler",
    lead: "Bayi toplantısı, lansman, yılsonu yemeği. Ekibiniz sabah gelir, akşam yemeğini göl kıyısında yer. Bursa merkezine yaklaşık 40 dakika, İstanbul’a yaklaşık 2,5 saat.",
    plannerTitle: "Düzeni planda kurun",
    plannerSub: "Alanı, düzeni ve katılımcı sayısını seçin. Kapasite aşılırsa plan söyler.",
    people: "Katılımcı",
    matrixTitle: "Kapasite tablosu",
    matrixNote: "Kişi sayıları örnektir.",
    none: "—",
    dayTitle: "Örnek bir gün",
    day: [
      { t: "09.30", a: "Karşılama ve kahvaltı", w: "Ceviz Avlusu" },
      { t: "10.00", a: "Sunum, tiyatro düzeni", w: "Ağ Ambarı" },
      { t: "12.30", a: "Öğle yemeği, uzun masa", w: "Söğüt Çayırı" },
      { t: "14.00", a: "Atölyeler, sınıf ve U düzen", w: "Ağ Ambarı" },
      { t: "17.30", a: "Kıyıda yürüyüş ve kayık", w: "İskele" },
      { t: "Gün batımı", a: "Akşam yemeği", w: "Söğüt Çayırı" },
    ],
    techTitle: "Teknik föy",
    techNote: "Teknik bilgiler örnektir.",
    tech: [
      { k: "Elektrik", v: "Ambarda 3 faz 63 A pano; çayırda iki ayrı 32 A çıkış." },
      { k: "Görüntü", v: "4 × 2,5 m motorlu perde, 7.000 lümen projeksiyon, HDMI ve kablosuz yansıtma." },
      { k: "Ses", v: "Ambarda sabit ses düzeni, dört telsiz mikrofon, kürsü." },
      { k: "İnternet", v: "Ambar ve avluda fiber bağlantı; ayrı misafir ağı." },
      { k: "Karartma", v: "Ambar pencerelerinde karartma perdesi; gündüz sunumda perde net okunur." },
      { k: "Ulaşım ve park", v: "120 araç ve 4 otobüs için otopark. Bursa merkezden servis ayarlanabilir." },
      { k: "Konaklama", v: "Gölyazı’daki pansiyonlarda grup için oda ayırma desteği." },
    ],
    photoAlt: "Ağ Ambarı sunum düzeninde: perdeye dönük sandalye sıraları",
    photo2Alt: "Ağ Ambarı’nda uzun masalar, ahşap çatı makasları ve ampul dizileri",
    cta: "Kurumsal teklif iste",
  },

  requestPage: {
    title: "Teklif talebi",
    lead: "Beş adımda talebinizi hazırlayın. Fiyatı bu bilgilere göre size özel yazarız.",
    stepsLabel: "Adımlar",
    steps: ["Tarih", "Tören ve misafir", "Alan ve saat", "İkram ve ekler", "İletişim"],
    next: "Devam",
    back: "Geri",
    edit: "Düzenle",
    toSummary: "Özeti gör",
    stepOf: (i: number, n: number) => `Adım ${i}/${n}`,
    catering: {
      karsilama: "Karşılama ikramı (şerbet, limonata, kanepe)",
      aksam: "Servisli akşam yemeği",
      bufe: "Açık büfe",
      kina: "Kına sofrası (lokum, kuruyemiş, şerbet)",
      kahve: "Kahve arası ve öğle yemeği",
    } as Record<string, string>,
    cateringLabel: "İkram",
    extrasLabel: "Ekler (isteğe bağlı)",
    extras: {
      gelin: "Gelin ve damat odası, sabahtan",
      cicek: "Çiçek ve masa süsü",
      foto: "Fotoğrafçı önerisi",
      muzik: "Müzik ve ses ekibi",
      servis: "Bursa’dan misafir servisi",
      konak: "Gölyazı’da konaklama desteği",
    } as Record<string, string>,
    contact: {
      name: "Ad soyad",
      phone: "Cep telefonu",
      email: "E-posta (isteğe bağlı)",
      reach: "Size nasıl ulaşalım?",
      reachOptions: { telefon: "Telefon", whatsapp: "WhatsApp", eposta: "E-posta" },
      note: "Eklemek istedikleriniz",
      notePh: "Örneğin: nikâhı iskelede, yemeği çayırda istiyoruz.",
      errName: "Adınızı ve soyadınızı yazın.",
      errPhone: "5 ile başlayan 10 haneli bir numara yazın.",
    },
    summaryTitle: "Talebinizin özeti",
    summaryLead: "Bu özeti ailenizle paylaşabilir ya da gönderebilirsiniz.",
    send: "Talebi gönder",
    share: "Ailemle paylaş",
    notSent: "Bu bir tasarım örneği; form hiçbir yere gönderilmez.",
    sentTitle: "Gönderilmedi",
    sentBody: "Bu bir tasarım örneği. Gerçek sitede talebiniz satış ekibine düşer; size seçtiğiniz yoldan aynı gün dönülür [örnek].",
    noExtras: "Yok",
  },

  visitPage: {
    title: "Ziyaret ve yol tarifi",
    lead: "Sazbahçe, Uluabat Gölü’nün doğu kıyısında, Gölyazı yolunun üzerinde. Alanları görmek için en iyi saat, gün batımına bir saat kala.",
    waysTitle: "Nasıl gelinir",
    ways: [
      { t: "İstanbul’dan", d: "Osmangazi Köprüsü ve O-5 otoyolu üzerinden yaklaşık 2,5 saat." },
      { t: "Bursa merkezden", d: "Nilüfer üzerinden Gölyazı yönünde yaklaşık 40 dakika." },
      { t: "Havalimanından", d: "Bursa Yenişehir Havalimanı’ndan yaklaşık 1 saat; İstanbul Sabiha Gökçen’den yaklaşık 2 saat." },
      { t: "Otopark", d: "120 araç ve 4 otobüs. Giriş, Gölyazı yolundan sağa sapan çakıl yoldan." },
    ],
    distanceNote: "Süreler yaklaşıktır; trafiğe göre değişir.",
    mapLabel: "Bölge haritası: Bursa’nın batısında Uluabat Gölü, kuzey kıyısında Gölyazı, doğu kıyısında Sazbahçe.",
    map: { sea: "Marmara Denizi", lake: "Uluabat Gölü", golyazi: "Gölyazı", bursa: "Bursa", istanbul: "İstanbul", venue: "Sazbahçe", mudanya: "Mudanya", o5: "O-5" },
    mapNote: "Şematik harita; ölçekli değildir.",
    appointmentTitle: "Görüşme randevusu",
    appointmentSub: "Bir gün ve saat seçin; ekibimiz sizi kapıda karşılasın. Planınızı yanınızda getirin, alanda birlikte kuralım.",
    dayLabel: "Gün",
    timeLabel: "Saat",
    times: ["11.00", "14.00", "Gün batımına bir saat kala"],
    peopleLabel: "Kaç kişi geleceksiniz?",
    people: ["1–2", "3–4", "5 ve üzeri"],
    name: "Ad soyad",
    phone: "Cep telefonu",
    submit: "Randevu iste",
    notSent: "Bu bir tasarım örneği; form hiçbir yere gönderilmez.",
    sentTitle: "Gönderilmedi",
    sentBody: (day: string, time: string) => `Bu bir tasarım örneği. Gerçek sitede ${day}, ${time} için ekibimiz sizi arayıp randevuyu onaylar [örnek].`,
    closedDay: "Pazartesi kapalı",
    hours: "Ziyaret: salı–pazar, 10.00–19.00 [örnek]",
    photoAlt: "Gölyazı’da kıyıya bağlı kayıklar ve göle bakan evler",
  },

  contact: {
    address: ["Gölyazı yolu, Uluabat Gölü doğu kıyısı", "Nilüfer, Bursa"],
    phone: "+90 224 000 00 00",
    phoneHref: "tel:+902240000000",
    email: "davet@sazbahce.example",
    hours: "Ziyaret: salı–pazar 10.00–19.00",
    mapsHref: "https://www.openstreetmap.org/search?query=G%C3%B6lyaz%C4%B1%20Nil%C3%BCfer%20Bursa",
    directions: "Haritada aç",
  },

  footer: {
    visit: "Ziyaret",
    reach: "İletişim",
    pages: "Sayfalar",
    note: "Sazbahçe kurgusal bir markadır; bu site rasitburucu.com için hazırlanmış bir tasarım örneğidir. Adres, telefon, kapasiteler, kurallar ve doluluk örnektir; alan görselleri 3B canlandırmadır. Formlar hiçbir yere gönderilmez.",
    credits: "Proje künyesi",
    kunye: {
      design: "Tasarım ve geliştirme:",
      designBy: "Raşit Burucu",
      designHref: "https://rasitburucu.com",
      render: "3B ve render:",
      renderText: "Dört alanın görselleri bu çalışma için Blender’da modellenip render alındı; mobilya ve dokuların bir kısmı Poly Haven’dan (CC0). Kıyı planı, masa yerleşimi ve bölge haritası kodla çizildi (SVG).",
      photos: "Fotoğraflar:",
      fonts: "Yazı karakterleri:",
      year: "Yıl:",
      yearValue: "2026",
    },
    links: [...NAV_ITEMS, REQUEST],
    copyright: "© 2026 Sazbahçe · Konsept çalışma — rasitburucu.com",
  },

  notFound: {
    title: "Bu yol göle çıkmıyor.",
    body: "Aradığınız sayfa yok ya da taşındı. Plan ana sayfada, alanlar bir tık ötede.",
    home: "Ana sayfaya dön",
    areas: "Alanlar",
  },
};

export type Tr = typeof tr;
