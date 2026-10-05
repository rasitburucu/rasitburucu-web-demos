// Gelidonya Sera ve Fidelik: every Turkish string on the site. Same shape can
// be copied to en.ts later (TR first). Status: draft, awaiting Raşit's approval
// (.tasarim/gelidonya/METIN-ONAY.md).
// Fictional brand. Address, phone, e-mail, seed figures and seasons are
// examples; the site says so where they appear. No customer, certificate,
// capacity or country is claimed.

export type NavLink = { label: string; href: string };

const BASE = "/gelidonya";

export const tr = {
  base: BASE,
  meta: {
    title: "Gelidonya | Sera ve fidelik, Kumluca",
    description:
      "Kumluca ve Finike'de kendi seralarında domates yetiştiren Gelidonya'dan aşılı ve aşısız fide. Dönümünüzü ve dikim haftanızı yazın; fide, viyol ve tohum ekim haftası hemen çıksın. Konsept çalışma.",
    ogAlt: "Gelidonya serasının içi: tavana uzanan domates sıraları, altta kızarmış salkımlar.",
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
      { label: "Fide siparişi", href: `${BASE}/#siparis` },
      { label: "Fidelik", href: `${BASE}/fidelik/` },
      { label: "Seralarımız", href: `${BASE}/seralarimiz/` },
      { label: "Ürünlerimiz ve ihracat", href: `${BASE}/urunlerimiz/` },
      { label: "İletişim ve ziyaret", href: `${BASE}/iletisim/` },
    ] as NavLink[],
    call: "Ara",
  },

  // ---------------------------------------------------------------- home
  hero: {
    title: "Dikim haftanızı seçin, fideniz o hafta serada olsun.",
    lead:
      "Kendi seralarımıza diktiğimiz fideyi sizin için de yetiştiriyoruz. Tohumu teslim haftanızdan geriye sayarak ekeriz; ne zaman ekildiğini de, ne zaman geleceğini de bugünden bilirsiniz.",
    imageAlt:
      "Gelidonya serasının içi: iki yanda tavana uzanan domates sıraları, altta kızarmış salkımlar, üstte örtüden süzülen ışık. Bilgisayarda çizilmiş görsel.",
    product: "Ürün",
    amount: "Ne kadar",
    unitDonum: "Dönüm",
    unitAdet: "Adet",
    amountDonum: "Miktar (dönüm)",
    amountAdet: "Miktar (adet fide)",
    minus: "Azalt",
    plus: "Artır",
    week: "Dikim haftası",
    weekHint: "fideniz bu hafta teslim edilir",
    weekLabel: (w: number) => `${w}. hafta`,
    weeksNext: "Sonraki haftalar",
    weeksPrev: "Önceki haftalar",
    cta: "Ön rezervasyon yap",
    ctaNote: "Ad, telefon ve teslim yerini bir sonraki adımda sorarız.",
    trayLabel: (filled: number, cells: number) => `Son viyol: ${filled} / ${cells} göz dolu`,
    trayAlt: (filled: number, cells: number, product: string) =>
      `Siparişinizin son viyolü: ${cells} gözlü viyolün ${filled} gözünde ${product} fidesi var.`,
  },

  // the cart label beside the last tray (also the slip)
  label: {
    fide: "Fide",
    viyol: "Viyol",
    sowing: "Tohum ekimi",
    delivery: "Teslim",
    viyolValue: (n: string, cells: number) => `${n} viyol, ${cells} gözlü`,
    weekValue: (w: number, range: string) => `${w}. hafta (${range})`,
    formulaDonum: (d: string, rate: string, fide: string, cells: number, viyol: string, weeks: number) =>
      `${d} dönüm × ${rate} fide = ${fide} fide. ${fide} ÷ ${cells} göz = ${viyol} viyol. Tohum, teslimden ≈ ${weeks} hafta önce ekilir.`,
    formulaAdet: (fide: string, cells: number, viyol: string, weeks: number) =>
      `${fide} fide ÷ ${cells} göz = ${viyol} viyol. Tohum, teslimden ≈ ${weeks} hafta önce ekilir.`,
    spare: (n: string) => `Yedek fide dahil (+%5, ${n} fide).`,
    note: "Sıklık, göz sayısı ve süre örnektir; siparişte ziraat mühendisimiz teyit eder.",
    rateSource: "Dekara fide sayısının kaynağı",
  },

  tezgah: {
    title: "Teslim sabahı kamyonete yüklenecek viyoller",
    lead: "Her kare bir viyol. Sonuncusu yarım dolu: kaç fide istediyseniz o kadar ekeriz.",
    more: (n: string) => `+${n} viyol daha`,
    benchCap: (n: string, last: number, cells: number) => `${n} viyol; sonuncusunda ${last} / ${cells} göz dolu`,
    canvasAlt: (n: string, last: number, cells: number) =>
      `Siparişin bütün viyolleri: ${n} viyol; sonuncusunda ${last} / ${cells} göz dolu.`,
    formTitle: "Fideyi kime ve nereye getirelim?",
    name: "Adınız",
    phone: "Telefonunuz",
    place: "Teslim yeri (köy, mahalle ya da sera yeri)",
    placeHint: "Örnek: Mavikent, sahil yolu",
    seed: "Tohum",
    seedOurs: "Tohumu siz temin edin",
    seedSlip: { ours: "Fidelik temin eder", mine: "Üretici getirir" },
    seedMine: "Tohumu ben getireceğim",
    rootstock: "Anaç (aşılı fide için)",
    rootstockOptions: ["Ziraat mühendisiniz önersin", "Toprak kökenli hastalıklara dayanıklı", "Güçlü kök, uzun sezon", "Soğuk döneme dayanıklı"],
    rootstockNone: "Aşısız fidede anaç yok",
    spare: "Yedek fide ekle (+%5)",
    spareHint: "Dikimde kırılan ya da tutmayan fidenin yerine.",
    submit: "Ön rezervasyonu tamamla",
    demo: "Bu bir tasarım örneği; form hiçbir yere gönderilmez.",
    required: "Bu alanı doldurun.",
    phoneInvalid: "Telefon numarasını 10 ya da 11 rakamla yazın.",
    slipTitle: "Ön rezervasyon fişi",
    slipStamp: "Ön rezervasyon",
    slipNext:
      "Ziraat mühendisimiz sizi arar; sıklığı, anacı ve teslim saatini birlikte netleştirirsiniz. Tohum ekildiği gün telefonunuza mesaj gelir.",
    slipDemo: "Tasarım örneği: fiş hiçbir yere gönderilmedi.",
    slipEdit: "Siparişi değiştir",
    slipPrint: "Fişi yazdır",
    slipRows: {
      product: "Ürün",
      fide: "Fide",
      viyol: "Viyol",
      sowing: "Tohum ekimi",
      delivery: "Teslim",
      place: "Teslim yeri",
      seed: "Tohum",
      rootstock: "Anaç",
      name: "Ad",
      phone: "Telefon",
    },
  },

  seralar: {
    title: "Fideyi satmadan önce kendimiz dikiyoruz.",
    text: [
      "Kumluca ve Finike'deki seralarımızda kış boyu domates yetiştiriyoruz. Size verdiğimiz fide, kendi seramıza diktiğimiz fideyle aynı tezgâhtan çıkar; tutmazsa ilk biz görürüz.",
      "Ova denize kadar örtü. Biz de o örtünün altındayız; fideyi de domatesi de aynı toprağın takvimine göre yetiştiriyoruz.",
    ],
    imageAlt: "Kumluca ovası yukarıdan: denize kadar uzanan sera çatıları, solda denize inen dağlar. Bilgisayarda çizilmiş görsel.",
    link: "Seralarımızı görün",
  },

  yol: {
    title: "Tohumdan teslime, aşılı domates fidesinin yolu",
    lead: "Haftalar örnektir; mevsime ve çeşide göre bir iki hafta oynar. Siparişinizde kesin takvimi ziraat mühendisimiz yazar.",
    steps: [
      { week: "Teslimden ≈ 9 hafta önce", title: "Ön rezervasyon", text: "Ürün, miktar ve dikim haftası. Bu üçü belli olunca ekim günü de bellidir." },
      { week: "≈ 8 hafta önce", title: "Tohum ekimi", text: "Hem çeşidiniz hem anaç ekilir. Çimlenmeyecek tohum payını biz koyarız; size eksik viyol gitmez." },
      { week: "≈ 5 hafta önce", title: "Aşı", text: "Çeşidin gövdesi anacın köküne birleştirilir, birleşme yeri klipsle tutturulur." },
      { week: "≈ 4 hafta önce", title: "İyileştirme odası", text: "Aşılı fide birkaç gün nemli ve loş odada kalır; birleşme yeri kaynar." },
      { week: "Son hafta", title: "Sertleştirme", text: "Fide açık serada güneşe ve rüzgâra alıştırılır; sizin seranıza şaşırmadan girsin diye." },
      { week: "Dikim haftanız", title: "Teslim", text: "Sabah erken, viyoller tezgâhtan kamyonete. Kargoyla giden fide cuma ve cumartesi yola çıkmaz." },
    ],
    link: "Fidelik: çeşitler, anaçlar, sipariş",
  },

  urunler: {
    title: "Kendi seramızın domatesi, sezonunda",
    lead: "Kendi seralarımızda yetiştirdiğimiz ürünü yurt içine ve yurt dışına satıyoruz. Hangi ay neyin hasatta olduğuna bakın, ürünü, miktarı ve nereye istediğinizi yazın; fiyatı haftasına göre veririz.",
    seasonCaption: "Hasat sezonu (örnek takvim, Kumluca örtüaltı)",
    months: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
    monthsLong: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
    season: "hasat",
    cta: "Ürün ve fiyat sorun",
  },

  ziyaret: {
    title: "Fideliği gelip görün.",
    text: "Viyolleri tezgâhta, aşı odasını camın arkasından gösteririz. Gelmeden bir gün önce haber verin.",
    cta: "Ziyaret randevusu al",
  },

  // --------------------------------------------------------------- pages
  fidelik: {
    title: "Fidelik",
    lead: "Domates, biber, patlıcan, hıyar, karpuz ve kavun fidesi; aşılı ya da aşısız. Siparişi dikim haftanızdan geriye sayarak planlarız.",
    imageAlt: "Gelidonya fideliği: galvaniz tezgâhlarda uzanan siyah viyoller, gözlerde üç dört haftalık domates fideleri. Bilgisayarda çizilmiş görsel.",
    tableTitle: "Ürün başına örnek değerler",
    tableNote:
      "Dekara fide, viyol gözü ve süre örnektir: çeşide, mevsime, sıra arasına ve tek ya da çift gövdeye göre değişir. Siparişte ziraat mühendisimiz sizin seranıza göre teyit eder.",
    cols: { product: "Ürün", kind: "Fide", rate: "Dekara fide (örnek)", cells: "Viyol", weeks: "Tohumdan teslime", source: "Dayanak" },
    weeksValue: (w: number) => `≈ ${w} hafta`,
    cellsValue: (c: number) => `${c} gözlü`,
    graftTitle: "Aşılı mı, aşısız mı?",
    grafted: {
      title: "Aşılı fide",
      text: [
        "Kökü güçlü bir anaçtan, gövdesi sizin seçtiğiniz çeşitten. Aynı serada yıllardır domates dikilen, toprak kökenli hastalığın görüldüğü yerlerde ilk tercih.",
        "Daha seyrek dikilir ve çoğu zaman iki gövdeye alınır; bu yüzden dekara daha az fide gider. Hazırlığı aşısıza göre iki üç hafta uzun sürer.",
      ],
    },
    plain: {
      title: "Aşısız fide",
      text: [
        "Daha kısa sürede hazır olur. Toprağı temiz seralarda ve topraksız tarımda (torbada yetiştiricilik) birçok üretici aşısız diker.",
        "Dekara daha çok fide gider; tek gövdeyle yetiştirilir.",
      ],
    },
    rootTitle: "Anaç",
    rootText:
      "Anacın ticari adını siparişte birlikte seçeriz. Sitede yalnız ne işe yaradığını yazıyoruz; hangi anacın sizin seranıza uyduğunu toprağınızı ve dikim zamanınızı bilen ziraat mühendisimiz söyler.",
    roots: [
      { title: "Toprak kökenli hastalıklara dayanıklı", text: "Aynı yere üst üste domates dikilen, toprağı yorgun seralar için." },
      { title: "Güçlü kök, uzun sezon", text: "Sonbaharda dikilip bahara kadar hasat edilecek seralar için." },
      { title: "Soğuk döneme dayanıklı", text: "Isıtmasız serada kışı geçirecek dikimler için." },
    ],
    rootNote: "[Örnek içerik: gerçek fidelikte anaç listesi ve hangi çeşitle eşleştiği burada yazar.]",
    flowTitle: "Sipariş nasıl ilerler",
    flow: [
      { title: "Ön rezervasyon", text: "Sitede ya da telefonla: ürün, miktar, dikim haftası, teslim yeri." },
      { title: "Teyit araması", text: "Ziraat mühendisimiz arar; sıklığı, anacı ve tohumu kimin getireceğini birlikte netleştirirsiniz." },
      { title: "Yazılı sipariş", text: "Ekim haftası, teslim haftası ve viyol sayısı yazılı olarak elinize geçer." },
      { title: "Ekim mesajı", text: "Tohum ekildiği gün telefonunuza mesaj gelir; aşılıda aşı haftası da." },
      { title: "Teslim", text: "Dikim haftanızda sabah erken. Kendi aracımızla getiririz ya da fidelikten alırsınız." },
    ],
    rulesTitle: "Teslimde bilmeniz gerekenler",
    rules: [
      "Kargoyla giden fide cuma ve cumartesi yola çıkmaz; hafta sonunu kolide geçirmesin.",
      "Fideyi geldiği gün gölgeye alın, viyolü sulayın; dikimi en geç iki gün içinde yapın.",
      "Teslim haftası değişecekse en az iki hafta önce haber verin; tohum ekildikten sonra fide beklemez.",
    ],
    rulesNote: "[Örnek içerik: gerçek firmada teslim bölgesi ve taşıma koşulları burada yazar.]",
    cta: "Fide siparişine başla",
  },

  seralarimiz: {
    title: "Seralarımız",
    lead: "Kumluca ve Finike'de kendi seralarımızda domates yetiştiriyoruz. Fidelik bu seraların yanında, önce kendi seramız için kuruldu.",
    imageAlt: "Kumluca ovası yukarıdan: denize kadar uzanan sera çatıları ve denize inen dağlar. Bilgisayarda çizilmiş görsel.",
    insideAlt: "Seranın içinden: domates sıraları, askı ipleri, ısıtma boruları ve beyaz zemin örtüsü. Bilgisayarda çizilmiş görsel.",
    sections: [
      {
        title: "Kışın domates",
        text: [
          "Isıtmalı serada eylülde, ısıtmasız serada ekimde dikeriz. İlk salkımlar kışın kesilir, hasat bahara kadar sürer. Şubatta ilkbahar dikimi yapılan seralar da var.",
          "Bitki askı ipine sarılarak tavana doğru büyür; alt yaprakları alınır, salkımlar alttan kızarır. Hasat ekibi aynı sırayı haftada birkaç kez dolaşır.",
        ],
      },
      {
        title: "Topraksız tarım",
        text: [
          "Seraların bir kısmında domates toprağa değil, hindistancevizi lifi dolu torbalara dikilir. Her bitkiye damla hattından ölçülü su ve gübre gider.",
          "Toprak kökenli hastalık riski azalır, su ve gübre bitkinin ihtiyacına göre ayarlanır. Bu seralarda çoğunlukla aşısız fide kullanırız.",
        ],
      },
      {
        title: "Fide de buradan çıkar",
        text: [
          "Fidelik, kendi seralarımıza fide yetiştirmek için kuruldu. Bölgedeki üreticiye verdiğimiz fide de aynı tezgâhlarda, aynı takvimle büyür.",
        ],
      },
    ],
    seasonTitle: "Hasat sezonu",
    seasonText: "Domatesin ilk salkımları kasımda kesilir; hasat mayısa kadar sürer. Biber, hıyar ve patlıcan da kış boyu seralarımızdan çıkar. Hangi ay hangi ürünün hasatta olduğu, ürün sayfamızdaki takvimde.",
    seasonLink: "Hasat takvimi ve fiyat sorma",
    seasonNote: "Örnek takvim: dikim zamanına, havaya ve çeşide göre birkaç hafta oynar.",
    gap: "[Örnek içerik: gerçek firmada sera alanı, sera yerleri ve ekip burada yazar.]",
    cta: "Ürünlerimize bakın",
  },

  urunlerimiz: {
    title: "Ürünlerimiz ve ihracat",
    lead: "Kendi seralarımızda yetiştirdiğimiz domatesi ve mevsim sebzesini yurt içine ve yurt dışına satıyoruz. Ürünü, miktarı, nereye ve hangi hafta istediğinizi yazın; fiyatı haftasına göre veririz.",
    imageAlt: "Seramızın içi: torbalardaki domates sıraları boyunca alttan kızaran salkımlar, aradaki beyaz örtülü geçit. Bilgisayarda çizilmiş görsel.",
    productsTitle: "Hangi hafta ne var",
    packTitle: "Ambalaj",
    pack: ["Karton koli", "Plastik kasa", "Paletli sevkiyat"],
    packNote: "[Örnek: gerçek firmada koli ölçüleri, kilogram ve palet düzeni burada yazar.]",
    docsTitle: "Alıcının isteyebileceği belgeler",
    docs: ["GlobalG.A.P. sertifikası", "İyi Tarım Uygulamaları sertifikası", "Kalıntı analiz raporu", "Bitki sağlık sertifikası", "Menşe belgesi"],
    docsNote: "[Örnek içerik: gerçek firmada hangi belgenin olduğu ve belge numaraları burada yazar. Bu sitede hiçbir belgenin varlığı iddia edilmez.]",
    formTitle: "Ürün ve fiyat sorun",
    formLead: "Fiyat haftaya, miktara ve ambalaja göre değişir; talebinizi okuyup aynı gün döneriz.",
    fields: {
      product: "Ürün",
      amount: "Miktar",
      unit: "Birim",
      units: ["Koli", "Palet", "Ton"],
      where: "Nereye",
      whereHint: "Şehir ya da ülke",
      when: "Ne zaman",
      whenHint: "Hafta ya da tarih aralığı",
      pack: "Ambalaj",
      company: "Firma",
      name: "Adınız",
      contact: "E-posta ya da telefon",
      note: "Not (isteğe bağlı)",
    },
    submit: "Talebi hazırla",
    demo: "Bu bir tasarım örneği; form hiçbir yere gönderilmez.",
    required: "Bu alanı doldurun.",
    summaryTitle: "Talebiniz hazır",
    summaryText: "Satış ekibimiz bu talebi okuyup fiyat ve sevkiyat haftasıyla döner.",
    summaryDemo: "Tasarım örneği: talep hiçbir yere gönderilmedi.",
    summaryEdit: "Talebi değiştir",
  },

  iletisim: {
    title: "İletişim ve ziyaret",
    lead: "Fideliği ve seralarımızı gelip görebilirsiniz. Gün ve saati seçin; sizi fidelik kapısında karşılarız.",
    imageAlt: "Fideliğin içi: iki yanda viyollerle dolu uzun tezgâhlar, aradaki geçit ileriye uzanıyor. Bilgisayarda çizilmiş görsel.",
    formTitle: "Ziyaret randevusu",
    day: "Gün",
    slot: "Saat",
    slots: ["08.00–10.00", "11.00–13.00", "14.00–16.00"],
    what: "Ne görmek istersiniz?",
    whatOptions: ["Fidelik", "Seralar", "İkisi de"],
    people: "Kaç kişi?",
    name: "Adınız",
    phone: "Telefonunuz",
    submit: "Randevuyu hazırla",
    demo: "Bu bir tasarım örneği; form hiçbir yere gönderilmez.",
    required: "Bu alanı doldurun.",
    phoneInvalid: "Telefon numarasını 10 ya da 11 rakamla yazın.",
    sunday: "Pazar kapalıyız.",
    slipTitle: "Randevunuz hazır",
    slipText: "Bir gün önce telefonla teyit ederiz. Fidelikte kapalı ayakkabı giymenizi rica ederiz.",
    slipDemo: "Tasarım örneği: randevu hiçbir yere gönderilmedi.",
    slipEdit: "Randevuyu değiştir",
    addressTitle: "Adres",
    hoursTitle: "Çalışma saatleri",
    callTitle: "Telefon",
    callText: "Sipariş ve teslim için en hızlı yol.",
    mapLink: "Kumluca'yı haritada aç",
    mapTitle: "Fidelik nerede",
    mapText: "Kumluca'dan Finike yoluna çıkın; sahil yolundan sonraki ilk sapaktan sağa dönün, fidelik yolun sonunda.",
    mapAlt:
      "Şematik harita: solda dağlar, altta deniz kıyısı; Kumluca ile Finike arasındaki D400 yolundan sapan fidelik yolu ve yolun sonunda Gelidonya fideliği.",
    mapLabels: { sea: "Akdeniz", town: "Kumluca", road: "D400", finike: "Finike", antalya: "Antalya", nursery: "Gelidonya fidelik" },
    mapNote: "Şematik çizim, örnek konum.",
    bigPhoneTitle: "Randevusuz da arayabilirsiniz",
    newTab: "(yeni sekmede açılır)",
  },

  contact: {
    address: ["Fidelik Yolu No: 12 [örnek]", "Kumluca / Antalya"],
    hours: ["Fidelik: hafta içi 07.30–17.00", "Cumartesi 07.30–12.00, pazar kapalı [örnek]"],
    mapsHref: "https://www.google.com/maps/search/?api=1&query=Kumluca%2C+Antalya",
  },

  mobileBar: {
    label: "Hızlı eylemler",
    summary: (fide: string) => `${fide} fide`,
    summary2: (viyol: string, sowing: number, week: number) => `${viyol} viyol · ekim ${sowing}. hf · teslim ${week}. hf`,
    summary2Long: (viyol: string, sowing: number, week: number) =>
      `${viyol} viyol, tohum ekimi ${sowing}. hafta, teslim ${week}. hafta`,
    cta: "Ön rezervasyon",
    call: "Ara",
    order: "Fide siparişi",
  },

  footer: {
    brand: "Marka",
    visit: "Ziyaret",
    contact: "İletişim",
    pages: "Sayfalar",
    note:
      "Gelidonya kurgusal bir markadır; bu site rasitburucu.com için hazırlanmış bir tasarım örneğidir. Adres, telefon, e-posta, fide değerleri ve hasat takvimi örnektir; formlar hiçbir yere gönderilmez.",
    kunye: {
      title: "Proje künyesi",
      design: "Tasarım ve geliştirme:",
      designBy: "Raşit Burucu",
      designHref: "https://rasitburucu.com",
      three: "3B ve render:",
      threeText:
        "Sera içi, fidelik, ova ve viyol görselleri Blender 5.2 ile koddan kuruldu (bitki, fide, viyol, sera ve arazi kendi modelimiz; hazır model ya da fotoğraf kullanılmadı). Sipariş viyolü tarayıcıda bu karelerden doldurulur.",
      photos: "Fotoğraflar:",
      photosText: "Fotoğraf kullanılmadı.",
      fonts: "Yazı karakterleri:",
      fontsText: "Big Shoulders Display (Patric King, Xotype) ve Schibsted Grotesk (Schibsted), SIL Open Font License 1.1.",
      year: "Yıl:",
      yearText: "2026",
    },
    copyright: "© 2026 Gelidonya Sera ve Fidelik · Konsept çalışma — rasitburucu.com",
  },

  cizim: {
    torba: {
      title: "Torbada domates: kesit",
      desc: "Hindistancevizi lifi dolu torbaya dikilmiş iki domates; damla hattından gelen çubuk her bitkinin dibine su ve gübre verir, fazlası alttaki yarıktan oluğa akar.",
      drip: "Damla hattı",
      stake: "Damlatıcı çubuk",
      coir: "Hindistancevizi lifi",
      drain: "Drenaj yarığı",
      gutter: "Toplama oluğu",
      twine: "Askı ipi",
    },
    asi: {
      title: "Aşılı fide: iki bitki, tek gövde",
      desc: "Üstte sizin seçtiğiniz çeşidin gövdesi ve yaprakları, altta anacın kökü; aşı noktası silikon klipsle tutulur.",
      scion: "Üst: sizin çeşidiniz",
      clip: "Aşı klipsi",
      root: "Alt: anaç (kök)",
      plug: "Torf topağı",
    },
  },

  notFound: {
    title: "Bu gözde fide yok.",
    text: "Aradığınız sayfa yok ya da taşındı. Viyolün geri kalanı dolu:",
    home: "Fide siparişi",
  },
};

/** Footer "Sayfalar" and the mobile menu: every page, home first. */
export const navPages: NavLink[] = [{ label: "Ana sayfa", href: `${BASE}/` }, ...tr.nav.items];
