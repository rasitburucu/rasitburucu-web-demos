// Gelidonya Sera ve Fidelik: every Turkish string on the site. Same shape can
// be copied to en.ts later (TR first). v2 (2026-10-06), awaiting Raşit's
// approval (.tasarim/gelidonya/METIN-ONAY.md, "v2").
// Fictional brand. Address, phones, e-mail, list, packs, seasons and the
// certificate number are examples; the site says so where they appear. No
// customer, certificate, capacity or country is claimed.

export type NavLink = { label: string; href: string };

const BASE = "/gelidonya";

export const tr = {
  base: BASE,
  meta: {
    title: "Gelidonya | Sera ve fidelik, Kumluca",
    description:
      "Kumluca'da kendi seralarında domates yetiştiren Gelidonya'dan aşılı ve aşısız fide: hazır fide listesi, sipariş ve teslim, fide hesabı, ziyaret. Konsept çalışma.",
    notFoundTitle: "Sayfa bulunamadı | Gelidonya",
  },
  brand: {
    word: "Gelidonya",
    line: "Sera ve fidelik, Kumluca",
    home: "Gelidonya ana sayfa",
    phone: "0242 000 00 00",
    phoneHref: "tel:+902420000000",
    phoneNote: "örnek numara",
    email: "fide@gelidonya.com.tr",
    emailNote: "örnek adres",
  },
  skip: "İçeriğe geç",
  strip: {
    text: "Konsept çalışma —",
    link: "rasitburucu.com",
    href: "https://rasitburucu.com",
  },
  nav: {
    label: "Ana menü",
    menu: "Menü",
    close: "Kapat",
    items: [
      { label: "Hazır fide", href: `${BASE}/hazir-fide/` },
      { label: "Fidelik ve sipariş", href: `${BASE}/fidelik/` },
      { label: "Seralarımız", href: `${BASE}/seralarimiz/` },
      { label: "Ürün ve ihracat", href: `${BASE}/urunlerimiz/` },
      { label: "İletişim", href: `${BASE}/iletisim/` },
    ] as NavLink[],
    call: "Ara",
  },

  // WhatsApp: never a real link (a random number could belong to someone)
  wa: {
    button: "WhatsApp'tan yaz",
    buttonTail: "'tan yaz",
    title: "WhatsApp mesajınız hazır",
    lead: "Gerçek firmada bu düğme WhatsApp'ı açar ve mesaj aşağıdaki metinle hazır gelir.",
    demo: "Bu bir tasarım örneği; numara kurgusal olduğu için WhatsApp açılmaz, mesaj hiçbir yere gitmez.",
    copy: "Metni kopyala",
    copied: "Kopyalandı",
    close: "Kapat",
    textLabel: "Mesaj metni",
    general: "Merhaba, fide hakkında bilgi almak istiyorum.",
  },

  // ---------------------------------------------------------------- home
  hero: {
    title: "Kendi seramıza diktiğimiz fideyi sizin için de yetiştiriyoruz.",
    lead: "Kumluca'da fidelik ve sera. Aşılı ve aşısız domates, biber, patlıcan, hıyar, karpuz ve kavun fidesi; tohumu dikim tarihinizden geriye sayarak ekeriz.",
    call: "Ara",
    imageAlt:
      "Gelidonya fideliği: galvaniz tezgâhlarda uzanan siyah viyoller, gözlerde teslime yakın fideler. Bilgisayarda çizilmiş görsel.",
    gateTitle: "Hazır fide listesi",
    gateHazir: "hazır",
    gateBoylu: "boylu",
    gateSoon: (n: number) => `İki hafta içinde ${n} kalem daha hazır olacak.`,
    gateDate: (d: string) => `Son güncelleme: ${d} (örnek liste)`,
    gateLink: "Listeyi aç",
    hours: "Fidelik hafta içi 07.30–17.00, cumartesi 07.30–12.00.",
    hoursNote: "Saatler ve numara örnektir.",
  },

  calc: {
    title: "Fide hesabı",
    lead: "Dönümünüzü ve dikim haftanızı seçin; kaç fide, kaç viyol ve tohumun ne zaman ekileceği çıksın.",
    product: "Ürün",
    graft: "Aşı",
    graftNames: { asili: "Aşılı", asisiz: "Aşısız" },
    stems: "Gövde",
    stemNames: { 1: "Tek", 2: "Çift" },
    stemOnly: "Bu üründe tek gövde",
    tray: "Viyol",
    trayValue: (n: number) => `${n} gözlü`,
    trayShort: (n: number) => `${n} göz`,
    donum: "Dönüm",
    minus: "Bir dönüm azalt",
    plus: "Bir dönüm artır",
    week: "Dikim haftası",
    weekValue: (w: number, range: string, y?: number) => `${w}. hafta · ${range}${y ? ` ${y}` : ""}`,
    outFide: "Fide",
    outViyol: "Viyol",
    outSowing: "Tohum ekimi",
    outSowingValue: (w: number) => `${w}. hafta`,
    lastTray: (n: number, cells: number) => `son viyolde ${n}/${cells} göz`,
    formula1: (d: string, heads: string, stems: number, fide: string) => `${d} dönüm × ${heads} tepe${stems > 1 ? ` ÷ ${stems} gövde` : ""} = ${fide} fide`,
    formula2: (fide: string, cells: number, viyol: string) => `${fide} fide ÷ ${cells} göz = ${viyol} viyol`,
    formula3: (week: number, weeks: number, sowing: number) => `${week}. hafta − ${weeks} hafta = ${sowing}. hafta (tohum ekimi)`,
    toForm: "Sipariş formunda gör",
    noteSourced: "Dekara 2.800 tepe domateste Bakanlık raporundan",
    noteSource: "kaynağı aç",
    noteRest: "Diğer sıklıklar ve süreler örnektir; siparişte ziraat mühendisimiz seranıza göre teyit eder.",
    noteUnsourced: "Bu üründe dekara tepe sayısı ve süre örnektir; siparişte ziraat mühendisimiz seranıza göre teyit eder.",
    ask: "Bu hesabı WhatsApp'tan sor",
    message: (p: string, kind: string, stems: string, tray: number, donum: string, fide: string, viyol: string, week: string) =>
      `Merhaba, fide siparişi için soruyorum: ${p}, ${kind}, ${stems} gövde, ${tray} gözlü viyol. ${donum} dönüm (≈ ${fide} fide, ${viyol} viyol). Dikim: ${week}. Köy/mahalle: `,
  },

  hazirOn: {
    title: "Bu hafta tezgâhta ne var",
    lead: "Teslime hazır fidelerden bir kesit. Liste her sabah 08.00'de güncellenir [örnek].",
    all: (n: number) => `Listenin tamamı (${n} kalem)`,
  },

  surec: {
    title: "Sipariş nasıl işler",
    lead: "Siparişi telefonda konuşur, seri numaralı formla ve kaparoyla kesinleştiririz. Bayiniz, komisyoncunuz ya da kooperatifiniz üzerinden de olur.",
    steps: [
      {
        title: "Arayın ya da yazın",
        text: "Bizi arayın ya da WhatsApp'tan yazın. Bayiniz, hal komisyoncunuz ya da tarım kredi kooperatifiniz üzerinden de sipariş verebilirsiniz.",
      },
      {
        title: "Form ve kaparo",
        text: "Çeşit, anaç, gövde, viyol, adet ve dikim tarihi seri numaralı sipariş formuna yazılır; form kaşelenip imzalanır, kaparo makbuzu elinize verilir.",
      },
      {
        title: "Ekim",
        text: "Tohum dikim tarihinizden geriye sayılarak ekilir. Ekildiği gün, aşılıda aşı haftasında da telefonunuza mesaj gelir.",
      },
      {
        title: "Teslim",
        text: "Fide istediğiniz tarihte, ±3 gün içinde hazırdır. Formunuz ve kimliğinizle fidelikten alırsınız; viyol sayısını, cinsi ve adedi irsaliyeyle araca yüklemeden karşılaştırın.",
      },
    ],
    note: "Kaparo oranı ve sipariş koşulları [örnek içerik].",
    link: "Sipariş ve teslim ayrıntıları",
  },

  form: {
    firm: "Sera ve Fidelik · Kumluca",
    title: "Fide sipariş formu",
    no: "No",
    example: "örnek",
    grower: "Üretici",
    growerValue: "[üretici adı]",
    place: "Köy / mahalle",
    placeValue: "Beykonak, Kumluca",
    placeValue2: "Hasyurt, Finike",
    copy: "2. nüsha · fidelikte kalır",
    phone: "Telefon",
    phoneValue: "05__ ___ __ __",
    cols: { urun: "Ürün", asi: "Aşı / anaç", govde: "Gövde", viyol: "Viyol × göz", adet: "Fide" },
    anac: "güçlü anaç",
    delivery: "Teslim (dikim) haftası",
    deliveryValue: (w: number, range: string, y: number) => `${w}. hafta, ${range} ${y} · ±3 gün`,
    sowing: "Tohum ekimi",
    sowingValue: (w: number, y: number) => `${w}. hafta ${y}`,
    seed: "Tohum",
    seedOurs: "Fidelik",
    seedMine: "Üretici",
    deposit: "Kaparo",
    depositValue: "______ TL · makbuz no ______",
    pickup: "Teslim yeri",
    pickupValue: "Fidelik kapısı",
    stampDealer: "Bayi / kooperatif kaşesi",
    signGrower: "Üretici imzası",
    signNursery: "Fidelik onayı",
    caption:
      "Sipariş bu formla kesinleşir. Örnek form: üstteki fide hesabını değiştirirseniz satırlar da değişir. Seri numarası, kaparo ve koşullar gerçek firmada kendi formundan gelir.",
    captionStatic: "Örnek form: gerçek firmada seri numarası, kaparo ve koşullar kendi formundan gelir.",
  },

  kendi: {
    title: "Fideyi satmadan önce kendimiz dikiyoruz.",
    text: [
      "Kumluca ve Finike'deki seralarımızda kış boyu domates yetiştiriyoruz. Size verdiğimiz fide, kendi seramıza diktiğimiz fideyle aynı tezgâhtan, aynı takvimle çıkar.",
      "Bir anaç ya da çeşit seramızda iyi gitmediyse ilk biz görürüz; size önerirken bunu da söyleriz.",
    ],
    imageAlt: "Kumluca ovası: denize kadar uzanan sera çatıları, arkada dağlar. Bilgisayarda çizilmiş görsel.",
    link: "Seralarımız",
  },

  urunKapi: {
    title: "Domatesimizi almak istiyorsanız",
    text: "Kendi seralarımızın ürününü yurt içine ve yurt dışına satıyoruz. Hangi ay ne hasatta, hangi ambalajla çıkıyor, alıcının hangi belgeleri istediği ürün sayfasında.",
    cta: "Fiyat ve hasat takvimi iste",
    seasonCaption: "Hasat sezonu (örnek takvim, Kumluca örtüaltı)",
  },

  ziyaret: {
    title: "Fidelik nerede",
    text: "Kumluca'nın güneyinde, ovanın içinde; merkezden on dakika. Fide teslimi fidelik kapısından yapılır.",
    teslim: "Teslim noktası",
    teslimText: "Fidelik kapısı, hafta içi 07.30–17.00, cumartesi 07.30–12.00. Pazar teslim yok.",
    teslimNote: "örnek",
    map: "Haritada gör ve yol tarifi al",
  },

  // --------------------------------------------------------------- shared tables
  months: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
  monthsLong: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
  season: "hasat",

  // --------------------------------------------------------------- ready list
  hazir: {
    title: "Hazır fide listesi",
    lead: "Tezgâhta teslime hazır ya da birkaç gün içinde hazır olacak fideler. Fide canlı üründür; ayırmadan önce telefonla ya da WhatsApp'tan teyit edin.",
    updated: (d: string) => `Son güncelleme: ${d}`,
    updatedNote: "örnek liste",
    filters: "Listeyi süz",
    fUrun: "Ürün",
    fAsi: "Aşı",
    fViyol: "Viyol",
    fHazir: "Hazır",
    all: "Tümü",
    asiNames: { asili: "Aşılı", asisiz: "Aşısız" },
    hazirOpts: { today: "Bugün hazır", two: "İki hafta içinde" },
    reset: "Süzgeci temizle",
    count: (shown: number, total: number) => (shown === total ? `${total} kalem` : `${total} kalemden ${shown} kalem`),
    empty: "Bu süzgeçle hazır fide yok. Sipariş için arayın; dikim tarihinize göre ekeriz.",
    cols: { urun: "Ürün", tip: "Tip", anac: "Aşı ve anaç", govde: "Gövde", viyol: "Viyol", adet: "Adet", hazir: "Hazır", durum: "Durum", ask: "Sor" },
    govdeValue: (n: number) => (n === 2 ? "Çift" : "Tek"),
    viyolValue: (n: number) => `${n} gözlü`,
    adetValue: (adet: string, viyol: number) => `${adet} (${viyol} viyol)`,
    durum: { hazir: "Hazır", boylu: "Boylu", olacak: "Hazır olacak" },
    durumHelp: "Hazır: teslime hazır. Boylu: dikim boyunu geçmek üzere, hemen dikilecek yere uygun. Hazır olacak: tarihte hazır.",
    ask: "Bu fideyi sor",
    askShort: "Sor",
    message: (r: string) => `Merhaba, hazır fide listesindeki şu fideyi soruyorum: ${r}. Kaç viyol ayırabilirsiniz?`,
    print: "Listeyi yazdır",
    csv: "Tabloyu indir (CSV)",
    csvName: "gelidonya-hazir-fide-ornek.csv",
    typeNote:
      "Gerçek listede çeşit ve anaç ticari adlarıyla yazılır; bu örnekte tip adı var. Karpuz ve kavun fidesi ocak–şubat dikimi için aralıkta listeye girer.",
    printHead: "Gelidonya Sera ve Fidelik · Hazır fide listesi (örnek) · 0242 000 00 00 (örnek numara)",
  },

  // --------------------------------------------------------------- pages
  fidelik: {
    title: "Fidelik ve sipariş",
    lead: "Domates, biber, patlıcan, hıyar, karpuz ve kavun fidesi; aşılı ya da aşısız, tek ya da çift gövde. Siparişi dikim tarihinizden geriye sayarak planlarız.",
    imageAlt: "Fideliğin içi: iki yanda viyollerle dolu uzun tezgâhlar, aradaki geçit ileriye uzanıyor. Bilgisayarda çizilmiş görsel.",
    belge: "Fide üretici belgesi (Tarım ve Orman Bakanlığı)",
    belgeNo: "Belge no",
    belgeDate: "Geçerlilik",
    belgeValue: "[örnek]",
    tableTitle: "Ürünler",
    tableNote:
      "Dekara tepe, viyol ve süre örnektir; çeşide, mevsime, sıra arasına ve gövdeye göre değişir. Siparişte ziraat mühendisimiz sizin seranıza göre teyit eder.",
    cols: { urun: "Ürün", asi: "Aşı", govde: "Gövde", viyol: "Viyol", sure: "Tohumdan teslime", tepe: "Dekara tepe", kaynak: "Dayanak" },
    weeksValue: (w: number) => `≈ ${w} hafta`,
    sourced: "Bakanlık raporu (BÜGEM)",
    unsourced: "Örnek değer, kaynak yok",
    graftTitle: "Aşılı mı, aşısız mı?",
    grafted: {
      title: "Aşılı fide",
      text: [
        "Kökü güçlü bir anaçtan, gövdesi sizin çeşidinizden. Yıllardır domates dikilen, toprak kökenli hastalığın görüldüğü seralarda ilk tercih.",
        "Domateste çoğu zaman tepesi alınıp iki gövdeye alınır: aynı tepe sayısı için dekara yarı fide gider. Hazırlığı aşısıza göre iki üç hafta uzun sürer.",
      ],
    },
    plain: {
      title: "Aşısız fide",
      text: [
        "Daha kısa sürede hazır olur. Toprağı temiz seralarda ve topraksız tarımda birçok üretici aşısız diker.",
        "Tek gövdeyle yetiştirilir; her tepe bir fidedir.",
      ],
    },
    rootTitle: "Anaç",
    rootText:
      "Anacın ticari adını siparişte birlikte seçeriz. Burada yalnız ne işe yaradığını yazıyoruz; hangisinin seranıza uyduğunu toprağınızı ve dikim zamanınızı bilen ziraat mühendisimiz söyler.",
    roots: [
      { title: "Toprak hastalığına dayanıklı", text: "Aynı yere üst üste domates dikilen, toprağı yorgun seralar için." },
      { title: "Güçlü anaç", text: "Sonbaharda dikilip bahara kadar hasat edilecek, uzun sezonlu seralar için." },
      { title: "Kabak anacı", text: "Hıyar, karpuz ve kavunda; soğuk toprağa ve kök hastalığına karşı." },
    ],
    rootNote: "[Örnek içerik: gerçek fidelikte anaç listesi ve hangi çeşitle eşleştiği burada yazar.]",
    trayTitle: "Viyol tipleri",
    trayLead: "Fideyi viyolün katı olarak sayarız: 14 viyol × 98 göz = 1.372 fide. Göz küçüldükçe fide sıklaşır, boy ve kök hacmi küçülür.",
    trayCols: { cells: "Göz", use: "Nerede", basis: "Dayanak" },
    orderTitle: "Sipariş ve teslim",
    orderLead:
      "Sipariş telefonla, WhatsApp'tan, bayi ya da kooperatif üzerinden başlar; seri numaralı formla ve kaparoyla kesinleşir. Koşullar [örnek içerik].",
    when: "Ne kadar önce sipariş verilir",
    whenText:
      "Aşılı fidede dikimden en az 9–10 hafta, aşısızda 7 hafta önce. Sezon başında (ağustos–eylül ve ocak) tezgâh erken dolar; daha önce yazdırmak teslim tarihinizi garantiler.",
    channelTitle: "Bayi ve kooperatif üzerinden",
    channelText: "Bölgenizdeki bayi, hal komisyoncusu ya da tarım kredi kooperatifi sipariş formunu doldurup kaparoyu alabilir; fide yine fidelikten teslim edilir.",
    channels: [
      { bolge: "Kumluca merkez ve ova", kanal: "Fidelik bürosu ve satış temsilcisi" },
      { bolge: "Finike", kanal: "[örnek içerik: bayi adı]" },
      { bolge: "Demre", kanal: "[örnek içerik: bayi adı]" },
      { bolge: "Kaş, Kale ve Elmalı", kanal: "[örnek içerik: kooperatif]" },
    ],
    channelCols: { bolge: "Bölge", kanal: "Sipariş noktası" },
    pickupTitle: "Teslim alırken",
    pickup: [
      "Sipariş formunuzu ve kimliğinizi getirin; başkası alacaksa formun arkasına adını yazın.",
      "İrsaliyedeki viyol sayısını, cinsi ve adedi araca yüklemeden önce sayın; eksik ya da yanlışı orada söyleyin.",
      "Fideyi kapalı ya da gölgeli araçla taşıyın; açık kasada rüzgâr yaprağı yakar.",
      "Kargoyla giden fide cuma ve cumartesi yola çıkmaz; hafta sonunu kolide geçirmesin.",
    ],
    farmerTitle: "Dikimden sonraki ilk hafta",
    farmerLead: "Genel bilgi; seranıza özel öneriyi ziraat mühendisimiz verir.",
    farmer: [
      { title: "Aşı noktası dışarıda kalır", text: "Aşılı fideyi aşı noktası toprağa ya da torbaya değmeyecek derinlikte dikin; gömülürse kalem kök salar, anacın faydası gider." },
      { title: "Can suyu", text: "Dikimden hemen sonra her fideye can suyu verin; viyolden çıkan topak kurumadan toprakla buluşsun." },
      { title: "Bekletmeyin", text: "Fideyi geldiği gün gölgeye alıp viyolü sulayın; dikimi en geç iki gün içinde yapın." },
      { title: "Klipse dokunmayın", text: "Aşı klipsi gövde kalınlaştıkça kendiliğinden açılır ve düşer; elle sökmeyin." },
      { title: "İpe alma", text: "Fide tuttuktan sonra (≈ bir hafta) askı ipine sarın ve klipsle tutturun; çift gövdede her gövde ayrı ipe." },
    ],
    cta: "Hazır fide listesine bak",
  },

  seralarimiz: {
    title: "Seralarımız",
    lead: "Kumluca ve Finike'de kendi seralarımızda domates yetiştiriyoruz. Fidelik bu seraların yanında, önce kendi seramız için kuruldu.",
    imageAlt: "Kumluca ovası: denize kadar uzanan sera çatıları, arkada dağlar. Bilgisayarda çizilmiş görsel.",
    kis: {
      title: "Kışın domates",
      text: [
        "Isıtmalı serada eylülde, ısıtmasız serada ekimde dikeriz. İlk salkımlar kasımda kesilir, hasat mayısa kadar sürer. Şubatta ilkbahar dikimi yapılan seralar da var.",
        "Bitki askı ipine sarılarak tavana doğru büyür; alt yaprakları alınır, salkımlar alttan kızarır. Hasat ekibi aynı sırayı haftada birkaç kez dolaşır.",
      ],
    },
    topraksiz: {
      title: "Topraksız tarım",
      text: [
        "Seraların bir kısmında domates toprağa değil, hindistancevizi lifi (cocopeat) dolu torbalara dikilir. Her bitkiye damla hattından ölçülü su ve gübre gider; fazlası torbanın altındaki yarıktan oluğa süzülür.",
        "Toprak kökenli hastalık riski azalır, su ve gübre bitkinin ihtiyacına göre ayarlanır. Bu seralarda çoğunlukla aşısız fide kullanırız.",
      ],
    },
    fidelik: {
      title: "Fidelik de buradan çıkar",
      text: [
        "Fidelik kendi seralarımıza fide yetiştirmek için kuruldu. Bölgedeki üreticiye verdiğimiz fide de aynı tezgâhlarda, aynı takvimle büyür.",
        "Aşı salonu ve iyileştirme odası, düz fide tezgâhlarından ayrı bölümde; aşılı fide hijyen için ayrı kapıdan girer çıkar.",
      ],
    },
    seasonNote: "Örnek takvim: dikim zamanına, havaya ve çeşide göre birkaç hafta oynar.",
    gap: "[Örnek içerik: gerçek firmada sera alanı, sera yerleri ve ekip burada yazar.]",
    cta: "Ürün ve ihracat",
  },

  urunlerimiz: {
    title: "Ürün ve ihracat",
    lead: "Kendi seralarımızda yetiştirdiğimiz domatesi ve mevsim sebzesini yurt içine ve yurt dışına satıyoruz. Ürünü, haftayı, ambalajı ve nereye istediğinizi yazın; fiyatı ve hasat takvimini haftasına göre gönderelim.",
    productsTitle: "Ürünler ve ambalaj",
    productsCols: { urun: "Ürün", tip: "Tip", pack: "Ambalaj seçenekleri", season: "Hasat" },
    packNote: "[Örnek içerik: gerçek firmada koli ölçüsü, net ağırlık ve palet düzeni ürün ürün burada yazar.]",
    loadTitle: "Yükleme",
    load: ["Euro palet (120 × 80 cm), koli adedi ambalaja göre", "Soğutmalı TIR ya da konteyner, yükleme sıcaklığı alıcıyla yazılı belirlenir", "Paketleme ve ön soğutma tesiste, yükleme aynı gün"],
    loadNote: "[Örnek içerik]",
    seasonTitle: "12 aylık tedarik takvimi",
    docsTitle: "Alıcının isteyebileceği belgeler",
    docs: ["GlobalG.A.P. sertifikası", "İyi Tarım Uygulamaları sertifikası", "Kalıntı analiz raporu (akredite laboratuvar)", "Bitki sağlık sertifikası", "Menşe şahadetnamesi"],
    docsNote: "[Örnek içerik: gerçek firmada hangi belgenin olduğu, belge numarası ve geçerlilik tarihi burada yazar. Bu sitede hiçbir belgenin varlığı iddia edilmez.]",
    headCta: "Fiyat ve hasat takvimi iste",
    headCall: "İhracat hattı",
    contactTitle: "İhracat sorumlusu",
    contactText: "Fiyat, numune ve yükleme haftası için doğrudan yazabilirsiniz.",
    waMessage: "Merhaba, kendi seralarınızın ürünü için fiyat ve hasat takvimi istiyorum. Ürün: , hafta: , varış: , ambalaj: , miktar: ",
    formTitle: "Fiyat ve hasat takvimi iste",
    formLead: "Fiyat haftaya, miktara ve ambalaja göre değişir. Talebinizi okuyup aynı gün döneriz.",
    fields: {
      product: "Ürün",
      week: "Hangi hafta",
      weekHint: "Örnek: 48. hafta ya da Aralık başı",
      where: "Varış ülkesi ve şehri",
      whereHint: "Ülke, şehir",
      pack: "Ambalaj",
      amount: "Miktar",
      unit: "Birim",
      units: ["Palet", "TIR", "Koli"],
      company: "Firma",
      name: "Adınız",
      contact: "E-posta ya da telefon",
      note: "Not (isteğe bağlı)",
    },
    submit: "Talebi hazırla",
    demo: "Bu bir tasarım örneği; form hiçbir yere gönderilmez.",
    required: "Bu alanı doldurun.",
    summaryTitle: "Talebiniz hazır",
    summaryText: "İhracat sorumlumuz bu talebi okuyup fiyat, hasat takvimi ve yükleme haftasıyla döner.",
    summaryDemo: "Tasarım örneği: talep hiçbir yere gönderilmedi.",
    summaryEdit: "Talebi değiştir",
  },

  iletisim: {
    title: "İletişim ve ziyaret",
    lead: "Kimi arayacağınızı işe göre yazdık. Fide teslimi ve ziyaret fidelik kapısından.",
    rolesTitle: "Kimi arayayım",
    roles: [
      { role: "Sipariş ve sevkiyat", who: "Fidelik sorumlusu", for: "Hazır fide, sipariş formu, teslim günü", phone: "0242 000 00 01", href: "tel:+902420000001" },
      { role: "Çeşit ve anaç", who: "Ziraat mühendisi", for: "Hangi anaç, kaç gövde, ne zaman dikim", phone: "0242 000 00 02", href: "tel:+902420000002" },
      { role: "Ürün ve ihracat", who: "İhracat sorumlusu", for: "Kendi seralarımızın ürünü, ambalaj, fiyat", phone: "0242 000 00 03", href: "tel:+902420000003" },
    ],
    roleNote: "Kişi adları yerine görev yazıldı; numaralar örnektir.",
    exportMail: "ihracat@gelidonya.com.tr",
    central: "Santral",
    addressTitle: "Adres",
    hoursTitle: "Çalışma saatleri",
    teslimTitle: "Fide teslimi",
    mapTitle: "Haritada",
    mapLead: "Kumluca'dan Camikırığı Caddesi'yle denize doğru inin; yaklaşık 2 km sonra sola, tarla yoluna dönün. Fidelik bir kilometre ileride, yolun sağında. (Örnek konum.)",
    imageAlt: "Fideliğin içi: iki yanda viyollerle dolu uzun tezgâhlar, aradaki geçit ileriye uzanıyor. Bilgisayarda çizilmiş görsel.",
    visitTitle: "Gelmeden önce arayın",
    visitText: "Fide teslimi ve fidelik gezisi için önce sipariş ve sevkiyat hattını arayın; tezgâhta ne olduğunu, kimin karşılayacağını söyleriz. Fidelikte kapalı ayakkabı giyin.",
    newTab: "(yeni sekmede açılır)",
  },

  map: {
    scaleLabel: "Harita ölçeği",
    views: { region: "Bölge", close: "Yakın" },
    regionLabel: "Antalya'dan Demre'ye kıyı ve D400 yolu; Kemer, Kumluca, Finike ve Demre. Gelidonya fideliği Kumluca'nın güneydoğusunda işaretli.",
    closeLabel: "Kumluca ovası: D400, Camikırığı Caddesi, köy yolları ve dereler. Gelidonya fideliği Kumluca'nın yaklaşık 3,5 km güneyinde, Camikırığı Caddesi'nden doğuya giden bir tarla yolunun üzerinde işaretli.",
    venue: "Gelidonya fidelik",
    venueNote: "Kurgusal firma, konum örnektir",
    sea: "Akdeniz",
    cape: "Gelidonya Burnu",
    toElmali: "Elmalı",
    north: "K",
    attribution: "© OpenStreetMap katkıcıları",
    licence: "ODbL",
    links: { google: "Google Haritalar'da aç", apple: "Apple Haritalar'da aç", osm: "OpenStreetMap'te aç", pinName: "Gelidonya fidelik (örnek konum)" },
  },

  contact: {
    address: ["Fidelik Yolu No: 12 [örnek]", "Kum Mahallesi, Kumluca / Antalya"],
    hours: ["Fidelik ve büro: hafta içi 07.30–17.00", "Cumartesi 07.30–12.00, pazar kapalı [örnek]"],
  },

  mobileBar: {
    label: "Hızlı eylemler",
    call: "Ara",
    wa: "WhatsApp",
    route: "Yol tarifi",
  },

  footer: {
    brand: "Gelidonya",
    visit: "Fidelik",
    contact: "İletişim",
    pages: "Sayfalar",
    belge: "Fide üretici belge no: [örnek] · geçerlilik: [örnek]",
    note:
      "Gelidonya kurgusal bir markadır; bu site rasitburucu.com için hazırlanmış bir tasarım örneğidir. Adres, telefonlar, e-posta, hazır fide listesi, fide değerleri, ambalaj ve hasat takvimi örnektir; formlar ve WhatsApp düğmeleri hiçbir yere mesaj göndermez.",
    kunye: {
      title: "Proje künyesi",
      design: "Tasarım ve geliştirme:",
      designBy: "Raşit Burucu",
      designHref: "https://rasitburucu.com",
      three: "3B ve render:",
      threeText:
        "Sera içi, fidelik ve ova görselleri Blender 5.2 ile koddan kuruldu (bitki, fide, viyol, sera ve arazi kendi modelimiz; hazır model ya da fotoğraf kullanılmadı).",
      maps: "Harita:",
      mapsText: "OpenStreetMap verisinden (© OpenStreetMap katkıcıları, ODbL) kendi çizimimiz; dış harita servisi yüklenmez.",
      fonts: "Yazı karakterleri:",
      fontsText: "Big Shoulders Display (Patric King, Xotype) ve Schibsted Grotesk (Schibsted), SIL Open Font License 1.1.",
      year: "Yıl:",
      yearText: "2026",
    },
    copyright: "© 2026 Gelidonya Sera ve Fidelik · Konsept çalışma — rasitburucu.com",
  },

  cizim: {
    legend: "Çizimdeki numaralar",
    note: "Ölçüler örnektir; torba, damlatıcı ve sıklık seranın sistemine göre değişir.",
    torba: {
      title: "Torbada domates: boyuna ve enine kesit",
      desc: "Bir metrelik hindistancevizi lifi torbasına dikilmiş üç domates. Her bitkinin dibinde damlatıcı çubuğu, torbanın altında drenaj yarığı ve toplama oluğu; gövde klipsle askı ipine tutturulmuş. Sağda aynı torbanın enine kesiti.",
      long: "Boyuna kesit",
      cross: "Enine kesit",
      parts: [
        "Askı ipi: tele bağlı, bitki ona sarılarak büyür",
        "Gövde klipsi: gövdeyi ipe tutturur",
        "Fide küpü: viyolden gelen topak torbaya oturtulur",
        "Damlatıcı çubuğu: suyu ve gübreyi kök dibine verir",
        "Damla hattı (PE boru) ve damlatıcı",
        "Torba: hindistancevizi lifi (cocopeat), UV dayanımlı örtü",
        "Kök bölgesi: kökler torbanın içine yayılır",
        "Drenaj yarığı: fazla su torbanın altından çıkar",
        "Toplama oluğu: drenaj suyunu sera ucuna taşır",
      ],
      dims: { bag: "100 cm", plant: "≈ 33 cm", height: "10 cm", width: "20 cm", wire: "tele ≈ 3,5 m" },
    },
    ambalaj: {
      title: "Ambalaj ve yükleme",
      cap: "Euro palet üstünde karton koli · koli ve şale üstten",
      desc: "Solda Euro palet üstünde yedi kat, katta üç yüz karton koli; köşebentler, iki çember ve palet etiketi. Sağ üstte üstten açık bir koli: tek kat salkım domates. Sağ altta 250 ve 500 gramlık şaleler.",
      parts: [
        "Karton koli 40 × 30 cm, 5 kg salkım domates, tek kat",
        "Şale 250 g ve 500 g, kokteyl domates",
        "Euro palet 120 × 80 cm",
        "Köşebent: koli sütunlarını taşımada sabit tutar",
        "Çember ya da streç film",
        "Palet etiketi: ürün, lot numarası, hasat tarihi, net ağırlık",
        "Havalandırma delikleri: ön soğutmada hava koliden geçer",
      ],
      note: "Ölçü, kat sayısı ve ağırlıklar örnektir; gerçek firmada alıcının şartnamesine göre yazılır.",
    },
    asi: {
      title: "Aşılı ve aşısız fide",
      desc: "Solda aşılı fide: altta anacın güçlü kökü ve gövdesi, aşı noktasında silikon klips, üstte çeşidin gövdesi; tepesi alınmış, iki gövdeye ayrılıyor. Sağda aşısız fide: kendi kökü ve tek gövdesi.",
      grafted: "Aşılı · çift gövde",
      plain: "Aşısız · tek gövde",
      parts: [
        "Kalem: sizin seçtiğiniz çeşidin gövdesi ve yaprakları",
        "Tepe kesimi: iki gerçek yapraktan sonra tepe alınır",
        "İki gövde: koltuklardan çıkan iki sürgün ayrı iplere alınır",
        "Aşı klipsi: aşı noktasını kaynayana kadar tutar, sonra düşer",
        "Aşı noktası: dikimde toprak ya da torba üstünde kalır",
        "Anaç gövdesi",
        "Anaç kökü: güçlü, geniş kök sistemi",
        "Torf topağı: viyol gözünden çıkan kök topu",
        "Aşısız fidenin kendi kökü ve tek gövdesi",
      ],
      soil: "Dikim seviyesi",
      gap: "≥ 3 cm",
    },
  },

  notFound: {
    title: "Bu gözde fide yok.",
    text: "Aradığınız sayfa yok ya da taşındı. Viyolün geri kalanı dolu:",
  },
};

/** Footer "Sayfalar" and the mobile menu: every page, home first. */
export const navPages: NavLink[] = [{ label: "Ana sayfa", href: `${BASE}/` }, ...tr.nav.items];
