// Every visible Turkish string of the Revak Okulları concept lives here, so an
// English file can be added later with the same shape (`const en: RevakCopy`).
// Revak Okulları is a fictional brand; people, numbers and placements are
// illustrative (see footer.note).

import type { Kademe } from "@/lib/revak/store";
import type { ImageKey } from "./images";

const img = (k: ImageKey) => k;

export type SinifOption = { id: string; label: string; age: [number, number] };

export const tr = {
  meta: {
    title: "Revak Okulları | Anaokulundan liseye, Sarıyer",
    description:
      "Sarıyer Zekeriyaköy'de anaokulundan liseye tek kampüs. Sınıflar en fazla 18 öğrenci, üç dil, lisede uluslararası diploma programı. Kampüs turu planlayın, ön kayıt yaptırın.",
  },

  // One line on every screen size (ortak künye kuralı, 2026-10-05).
  strip: {
    text: "Konsept çalışma —",
    link: "rasitburucu.com",
    href: "https://rasitburucu.com",
  },
  skip: "İçeriğe geç",
  crumb: "Bulunduğunuz sayfa",
  // The "örnek" seal: every block that reads like real data (menu, calendar, hours, timetable) carries one.
  sample: {
    content: "Örnek içerik",
    menu: "Örnek menü",
    policy: "Örnek politika",
    schedule: "Örnek çizelge",
    calendar: "Okula ait tarihler örnek",
    report: "Örnek rapor · kurgusal öğrenci",
    contact: "Kurgusal numaralar",
  },

  announce: {
    lead: "Bursluluk sınavı",
    // phones: the notice shares one line with the concept strip
    leadShort: "Bursluluk",
    // {date} {weekday} {deadline} {days}
    text: (date: string, weekday: string, deadline: string, days: number) =>
      days > 0
        ? `${date} ${weekday}. Son başvuru ${deadline}; ${days} gün kaldı.`
        : `${date} ${weekday}. Başvurular bugün kapanıyor.`,
    // phones: one line, the date only ({date})
    short: (date: string) => date,
    cta: "Sınava başvurun",
    ctaShort: "Başvurun",
    close: "Duyuruyu kapat",
  },

  brand: { name: "Revak", full: "Revak Okulları", home: "Revak Okulları ana sayfa", place: "Zekeriyaköy, Sarıyer · İstanbul" },

  nav: {
    label: "Ana menü",
    // Six headings; a group opens a small panel of at most five links (menu yapısı, 2026-10-04).
    groups: [
      {
        id: "okul",
        label: "Okulumuz",
        href: "/revak/okulumuz/",
        items: [
          { label: "Revak'ı tanıyın", text: "Adın kökeni ve ilkeler", href: "/revak/okulumuz/" },
          { label: "Yönetim ve denetim", text: "Roller, kime hesap veririz", href: "/revak/okulumuz/#yonetim" },
          { label: "Güvende", text: "Rehberlik, çocuk koruma, sağlık", href: "/revak/guvende/" },
        ],
      },
      {
        id: "egitim",
        label: "Eğitim",
        href: "/revak/egitim/",
        items: [
          { label: "Nasıl öğretir, nasıl ölçeriz", text: "İlkeler, ölçme takvimi, rapor", href: "/revak/egitim/" },
          { label: "Anaokulu", text: "3-5 yaş", href: "/revak/egitim/anaokulu/" },
          { label: "İlkokul", text: "1-4. sınıf", href: "/revak/egitim/ilkokul/" },
          { label: "Ortaokul", text: "5-8. sınıf", href: "/revak/egitim/ortaokul/" },
          { label: "Lise", text: "Hazırlık-12. sınıf", href: "/revak/egitim/lise/" },
        ],
      },
      {
        id: "yasam",
        label: "Kampüs ve yaşam",
        href: "/revak/kampus/",
        items: [
          { label: "Kampüs planı", text: "Tesisler ve tur noktaları", href: "/revak/kampus/#plan" },
          { label: "Bir gün burada", text: "İlkokul ve lise, saat saat", href: "/revak/kampus/#bir-gun" },
          { label: "Yemek menüsü", text: "İki hafta, alerjen işaretli", href: "/revak/kampus/#yemek" },
          { label: "Servis güzergâhları", text: "Duraklar ve saatler", href: "/revak/kampus/#servis" },
          { label: "Sağlık ve güvenlik", text: "Revir, tatbikat, teslim", href: "/revak/guvende/#saglik" },
        ],
      },
      {
        id: "kabul",
        label: "Kabul",
        href: "/revak/kabul/",
        items: [
          { label: "Kabul süreci", text: "Dört adım, önemli tarihler", href: "/revak/kabul/" },
          { label: "Hangi sınıfa başlar?", text: "Yaş hesaplayıcı", href: "/revak/kabul/#yas" },
          { label: "Gerekli belgeler", text: "İşaretlenebilir liste", href: "/revak/kabul/#belgeler" },
          { label: "Ücrete neler dahil", text: "Kalemler, taksit, iade", href: "/revak/kabul/#ucret" },
          { label: "Bursluluk sınavı", text: "Oturumlar ve oranlar", href: "/revak/kabul/#bursluluk" },
          { label: "Bursluluk başvurusu", text: "Sınava kayıt", href: "/revak/kabul/bursluluk/" },
          { label: "Ücret bilgisi isteyin", text: "Size uyan ücret tablosu", href: "/revak/kabul/ucret-bilgisi/" },
        ],
      },
      { id: "almanak", label: "Almanak", href: "/revak/almanak/", items: [] },
      { id: "iletisim", label: "İletişim", href: "/revak/iletisim/", items: [] },
    ],
    open: (label: string) => `${label} alt menüsü`,
    tour: "Kampüs turu",
    apply: "Ön kayıt",
    parents: "Veli girişi",
    menu: "Menü",
    close: "Menüyü kapat",
  },

  mobileBar: { label: "Hızlı erişim", tour: "Tur", apply: "Ön kayıt", call: "Ara" },

  contact: {
    phone: "0212 000 19 87",
    phoneHref: "tel:+902120001987",
    email: "kabul@revak.k12.tr",
    address: ["Çamlık Yolu No: 12, Zekeriyaköy", "34450 Sarıyer, İstanbul"],
    hours: "Kabul ofisi hafta içi 08.30-17.30",
    mapsHref: "https://www.google.com/maps/search/?api=1&query=Zekeriyak%C3%B6y+Sar%C4%B1yer+%C4%B0stanbul",
  },

  /* ---------------- home ---------------- */

  hero: {
    title: "Her çocuğu adıyla tanıyan okul.",
    sub: "Zekeriyaköy'de anaokulundan liseye tek kampüs. Sınıflar 18 öğrenciyi geçmez, her öğrencinin bir danışmanı var.",
    season: "2027-2028 kabul dönemi açık.",
    primary: "Ön kayıt yaptırın",
    secondary: "Kampüs turu planlayın",
  },

  sentence: {
    label: "Nereden başlamak istersiniz?",
    before: "Çocuğum",
    middle: "için",
    after: "istiyorum.",
    kademeLabel: "Kademe",
    intentLabel: "Ne yapmak istiyorsunuz?",
    kademe: { anaokulu: "anaokulu", ilkokul: "ilkokul", ortaokul: "ortaokul", lise: "lise" } as Record<Kademe, string>,
    intents: [
      { id: "on-kayit", label: "ön kayıt yaptırmak" },
      { id: "tur", label: "kampüsü görmek" },
      { id: "ucret", label: "ücret bilgisi almak" },
      { id: "burs", label: "bursluluk sınavına girmek" },
    ],
    go: "Devam edin",
  },

  proof: {
    title: "Kısaca Revak.",
    // A poster: each sentence is split around its numeral (pre, big numeral, post); the spaces are the markup's.
    lines: [
      { pre: "Her sınıfta en fazla", big: "18", post: "öğrenci." },
      { pre: "Anaokulunda", big: "2", post: "dil, 5. sınıfta üçüncüsü." },
      { pre: "Lisenin son", big: "2", post: "yılında uluslararası diploma programı." },
      { pre: "Anaokulundan liseye", big: "1", post: "kampüs." },
    ],
    items: [
      { big: "En fazla 18 öğrenci", text: "Her sınıfta. Anaokulunda 14 çocuk ve iki öğretmen." },
      { big: "Üç dil", text: "Türkçe ve İngilizce anaokulunda başlar; 5. sınıfta Almanca ya da İspanyolca eklenir." },
      { big: "Uluslararası diploma programı", text: "Lisenin son iki yılında, ulusal programla birlikte isteyen her öğrenciye açık." },
      { big: "Tek kampüs", text: "Anaokulundan liseye aynı bahçe. Kardeşler aynı servise biner, aynı kapıdan girer." },
    ],
  },

  levels: {
    title: "Revak boyunca",
    // what the word means, set like a dictionary entry beside the title
    term: { word: "revak", def: "sütunlara oturan kemerlerin taşıdığı, önü açık, üstü örtülü geçit." },
    plate: "Lev.",
    rulerLabel: "Kademeler",
    ageLabel: "yaş",
    // the walk is long: a way past it, at its start, for keyboard and impatient readers
    skip: "Kademeleri geçin, rehberliğe inin",
    exit: {
      title: "Revağın sonunda, dünya.",
      text: "On beş yıl aynı kapıdan girip çıkan çocuk, buradan kendi seçtiği bir üniversiteye yürür.",
      link: "Üniversite rehberliği nasıl işliyor",
    },
    intro:
      "Anaokulundan liseye dört kademe, tek bir çatı altında. Çocuğunuz büyüdükçe okul da onunla birlikte değişir; onu tanıyan yüzler değişmez.",
    cta: "Bu kademe için ön kayıt",
    more: "Bu kademeyi tanıyın",
    classSize: "Sınıf mevcudu",
    languages: "Diller",
    items: {
      anaokulu: {
        name: "Anaokulu",
        range: "3-5 yaş",
        size: "14 çocuk, iki öğretmen",
        lang: "İngilizce her gün, oyunla",
        line: "Kendi bahçesi olan ayrı bir bina. Günün yarısı açık havada, yarısı atölyede geçer.",
        moment: "Sabah kapıda her çocuk adıyla karşılanır; gün o selamla başlar.",
        image: img("anaokulu"),
      },
      ilkokul: {
        name: "İlkokul",
        range: "1-4. sınıf",
        size: "En fazla 18 öğrenci",
        lang: "Haftada 10 saat İngilizce",
        line: "Okuma saatiyle başlayan günler, her dönem bir çalgı, haftada iki gün yüzme.",
        moment: "Her gün 08.40'ta yirmi dakika okuma. Herkesin kendi hızında bir kitabı var.",
        image: img("ilkokul"),
      },
      ortaokul: {
        name: "Ortaokul",
        range: "5-8. sınıf",
        size: "En fazla 18 öğrenci",
        lang: "İngilizce ve Almanca ya da İspanyolca",
        line: "Haftada en az bir fen dersi laboratuvarda. Her öğrenci her hafta küçük bir projeyi sunar.",
        moment: "Deney önce yanlış yapılabilir. Doğrusunu kendisi bulan öğrenci unutmaz.",
        image: img("ortaokul"),
      },
      lise: {
        name: "Lise",
        range: "Hazırlık-12. sınıf",
        size: "En fazla 18, diploma programı sınıflarında 16",
        lang: "İngilizce, ikinci dil, isteğe bağlı üçüncü",
        line: "Ulusal program ve uluslararası diploma programı. Üniversite danışmanlığı 9. sınıfta başlar.",
        moment: "Üniversite planı son sınıfta değil, 9. sınıfta danışmanla ilk görüşmede başlar.",
        image: img("classroom"),
      },
    } as Record<Kademe, { name: string; range: string; size: string; lang: string; line: string; moment: string; image: ImageKey }>,
  },

  approach: {
    title: "Üç alışkanlık, anaokulundan mezuniyete.",
    imageAlt: "Deftere kurşun kalemle not alan bir el",
    items: [
      {
        title: "Her öğrencinin bir danışmanı var.",
        text: "Danışman öğretmen haftada bir öğrencisiyle birebir görüşür, ayda bir velisini arar. Nottan önce çocuğun nasıl olduğunu konuşuruz.",
      },
      {
        title: "Her hafta bir sunum.",
        text: "5. sınıftan itibaren öğrenciler her hafta küçük bir projeyi sınıfa anlatır. Söz almak zamanla alışkanlık olur.",
      },
      {
        title: "Sanat ve spor, ders programının içinde.",
        text: "Her gün bir saat müzik, görsel sanatlar ya da spor. Kulüpler bunun üstüne gelir, yerine değil.",
      },
    ],
  },

  // The end of the walk: the arch is laid stone by stone, the keystone seats last, and a
  // parent can carve the child's name into the inscription stone (never sent, never stored).
  keystone: {
    title: "Son taş oturunca kemer kendini taşır.",
    // the inscription when no name is carved: the school's word, in two lines
    motto: ["Her çocuk", "adıyla tanınır."],
    label: "Çocuğunuzun adı",
    submit: "Taşa kazıyın",
    note: "Bu bir tasarım örneği; ad hiçbir yere gönderilmez.",
    carved: (n: string) => `Kitabede şimdi ${n} yazıyor.`,
  },

  guidance: {
    title: "Üniversite tercihi dört yılda yazılır.",
    intro: "Her öğrenci 9. sınıfta bir üniversite danışmanıyla eşleşir. Yurt içi ve yurt dışı başvurular için ayrı ekipler çalışır; veli her adımda masadadır.",
    steps: [
      { grade: "9. sınıf", title: "Tanışma", text: "Danışmanla ilk görüşme: ilgi alanları, ders seçimi ve ulusal program ya da diploma programı kararı için ön hazırlık." },
      { grade: "10. sınıf", title: "Keşif", text: "Üniversite tanıtım günleri, yaz okulları ve bir haftalık meslek gözlemi. Yurt dışını düşünenler için dil sınavı takvimi." },
      { grade: "11. sınıf", title: "Kısa liste", text: "Liste veliyle birlikte konuşulur. Deneme sınavları, portfolyo ve başvuru yazıları başlar." },
      { grade: "12. sınıf", title: "Başvuru", text: "Başvuru ve tercih dönemi. Danışman, veliyle birlikte en az üç kez oturup listeyi yeniden düşünür." },
    ],
    link: "Rehberlikle ilgili sorular",
    linkHref: "/revak/kabul/#sss",
  },

  clubs: {
    title: "Ders bittiğinde",
    intro: "Otuzdan fazla kulüp ve takım var. Her öğrenci yılda en az birine katılır; çoğu ikiye.",
    items: [
      { name: "Oda orkestrası", range: "4-12. sınıf", image: img("music") },
      { name: "Robotik", range: "5-12. sınıf", image: img("robotics") },
      { name: "Münazara", range: "7-12. sınıf", image: img("debate") },
      { name: "Seramik atölyesi", range: "1-12. sınıf", image: img("ceramics") },
      { name: "Tiyatro", range: "3-12. sınıf", image: img("stage") },
      { name: "Model Birleşmiş Milletler", range: "8-12. sınıf", image: img("library") },
      { name: "Yüzme", range: "Anaokulundan 12. sınıfa", image: img("pool") },
      { name: "Basketbol", range: "3-12. sınıf", image: img("court") },
      { name: "Satranç", range: "1-12. sınıf", image: img("chess") },
    ],
    more: "ve 23 kulüp daha",
  },

  campusPreview: {
    title: "Zekeriyaköy'de, ormanın kıyısında 48 dönüm.",
    imageAlt: "Bahçeden bakınca taş revak: kemerler, servi ağaçları ve arkada orman",
    facilities: [
      { name: "Yarı olimpik kapalı havuz", text: "Yüzme anaokulundan itibaren ders programında." },
      { name: "Üç katlı kütüphane", text: "38.000 kitap, lise için akşam 19.00'a kadar açık." },
      { name: "Altı fen laboratuvarı", text: "İki öğrenciye bir mikroskop." },
      { name: "420 kişilik sahne", text: "Konserler, oyunlar, mezuniyet." },
    ],
    cta: "Kampüsü keşfedin",
  },

  events: {
    title: "Yaklaşan etkinlikler",
    filterLabel: "Etkinlik türü",
    filters: { all: "Tümü", onsite: "Yerinde", online: "Çevrim içi" },
    columns: { date: "Tarih", event: "Etkinlik", where: "Yer ve saat", action: "İşlem" },
    addToCal: "Takvime ekleyin",
    empty: "Bu türde yaklaşan etkinlik yok.",
    items: [
      {
        id: "acik-kapi",
        iso: "2026-10-10",
        day: "10",
        month: "Ekim",
        weekday: "Cumartesi",
        title: "Açık Kapı Günü",
        text: "Kampüs yürüyüşü, açık sınıflar ve kademe koordinatörleriyle sohbet. Kayıt gerekmez.",
        where: "Kampüs, ana giriş",
        time: "10.00-13.00",
        start: "10.00",
        minutes: 180,
        mode: "onsite" as const,
      },
      {
        id: "veli-semineri",
        iso: "2026-10-21",
        day: "21",
        month: "Ekim",
        weekday: "Çarşamba",
        title: "Veli semineri: Ergenlikte ekran ve uyku",
        text: "Psikolojik danışmanlık birimimizle bir saatlik söyleşi ve soru-cevap.",
        where: "Çevrim içi",
        time: "19.00-20.00",
        start: "19.00",
        minutes: 60,
        mode: "online" as const,
      },
      {
        id: "lise-tanitim",
        iso: "2026-11-04",
        day: "4",
        month: "Kasım",
        weekday: "Çarşamba",
        title: "Lise ve diploma programı tanıtım toplantısı",
        text: "Ulusal program ile uluslararası diploma programı arasındaki farklar, üniversite rehberliği ve ders seçimi.",
        where: "Çevrim içi",
        time: "18.30-19.30",
        start: "18.30",
        minutes: 60,
        mode: "online" as const,
      },
      {
        id: "bursluluk",
        iso: "2026-11-15",
        day: "15",
        month: "Kasım",
        weekday: "Pazar",
        title: "Bursluluk sınavı",
        text: "Şu an 4-11. sınıfta olan öğrenciler için. %25 ile %100 arasında burs.",
        where: "Kampüs, B Blok",
        time: "10.00-11.30",
        start: "10.00",
        minutes: 90,
        mode: "onsite" as const,
        cta: { label: "Sınava başvurun", href: "/revak/kabul/bursluluk/" },
      },
      {
        id: "kis-konseri",
        iso: "2026-12-18",
        day: "18",
        month: "Aralık",
        weekday: "Cuma",
        title: "Kış konseri",
        text: "Oda orkestrası ve ilkokul korosu. Aday aileler de davetli.",
        where: "Revak Sahnesi",
        time: "19.30-21.00",
        start: "19.30",
        minutes: 90,
        mode: "onsite" as const,
      },
    ],
  },

  faq: {
    title: "Velilerin en çok sorduğu sorular",
    intro: "Burada cevabını bulamadığınız her soru için kabul ofisimiz hafta içi 08.30-17.30 arasında telefonda.",
    feeCta: "Ücret bilgisini alın",
    groups: [
      {
        title: "Kabul",
        items: [
          {
            q: "Ön kayıt bir yükümlülük getirir mi?",
            a: "Hayır. Ön kayıt, sizinle bir tanışma görüşmesi planlamamızı sağlar. Kesin kayıt, görüşme ve gözlem gününden sonra, siz karar verdiğinizde yapılır.",
          },
          {
            q: "Yıl ortasında nakil kabul ediyor musunuz?",
            a: "Kontenjanı olan sınıflarda evet. Ön kayıt formunda 2026-2027 ara dönemini seçebilirsiniz; kabul ofisi uygun sınıfları aynı gün bildirir.",
          },
          {
            q: "Üniversite rehberliği nasıl işliyor?",
            a: "9. sınıfta her öğrenciye bir üniversite danışmanı atanır. Yurt içi ve yurt dışı başvurular için ayrı ekiplerimiz var; tercih döneminde veliyle birlikte en az üç görüşme yapılır.",
          },
        ],
      },
      {
        title: "Ücret ve burs",
        items: [
          {
            q: "Ücretleri neden sitede yayımlamıyorsunuz?",
            a: "Ücret kademeye, servis ve yemek tercihine göre değişiyor. Size uyan tabloyu, geçerli indirimlerle birlikte aynı gün gönderiyoruz.",
          },
          {
            q: "Hangi indirimler var?",
            a: "Kardeş indirimi %10, erken kayıt indirimi %7, peşin ödeme indirimi %5. Bursluluk sınavıyla %25 ile %100 arasında burs kazanılabilir.",
          },
        ],
      },
      {
        title: "Servis ve yemek",
        items: [
          {
            q: "Servis hangi semtlere gidiyor?",
            a: "Sarıyer, Beşiktaş, Şişli, Kağıthane, Eyüpsultan, Beykoz ve Üsküdar'a. Kampüs sayfasında semtinizi seçip sabah alınma saatini görebilirsiniz.",
          },
          {
            q: "Yemekleri kim hazırlıyor?",
            a: "Kampüs mutfağında, beslenme uzmanımızın hazırladığı menüyle her gün taze pişiyor. Haftanın menüsü her cuma veli uygulamasında yayımlanır.",
          },
        ],
      },
      {
        title: "Güvenlik ve sağlık",
        items: [
          {
            q: "Kampüse girişler nasıl kontrol ediliyor?",
            a: "Kampüsün tek girişi var. Ziyaretçiler kimlikle kaydolur ve kampüste refakatle dolaşır; öğrenciler veliye kartla teslim edilir.",
          },
          {
            q: "Okulda hemşire var mı?",
            a: "Revirde iki hemşire tam gün görevde, okul doktoru haftada üç gün kampüste. Acil durumlar için en yakın hastaneyle anlaşmamız var.",
          },
        ],
      },
    ],
  },

  closing: {
    title: "Kampüsü görmeden karar vermeyin.",
    text: "Tur yaklaşık bir saat sürer. Sınıfları dolaşır, öğretmenlerle tanışır, sorularınızı kabul ofisine sorarsınız.",
    slotsLabel: "En yakın boş saatler",
    left: (n: number) => (n === 1 ? "son 1 yer" : `${n} yer kaldı`),
    other: "Başka bir gün seçin",
    loading: "Boş saatler yükleniyor",
  },

  // Künye: the same structure and labels on every concept site (ortak künye kuralı, 2026-10-05).
  footer: {
    visitTitle: "Ziyaret",
    reachTitle: "İletişim",
    pagesTitle: "Sayfalar",
    kvkk: "KVKK aydınlatma metni",
    directions: "Yol tarifi",
    note: "Revak Okulları kurgusal bir markadır; bu site rasitburucu.com için hazırlanmış bir tasarım örneğidir. Adres, telefon, rakamlar, tarihler ve programlar örnektir; formlar hiçbir yere gönderilmez.",
    kunye: {
      title: "Proje künyesi",
      design: "Tasarım ve geliştirme:",
      designBy: "Raşit Burucu",
      designHref: "https://rasitburucu.com",
      render: "3B ve render:",
      renderText: "Revak sahnesi ve kemer görselleri bu site için Blender'da modellenip işlendi; dış kaynak kullanılmadı.",
      photos: "Fotoğraflar:",
      fonts: "Yazı karakterleri:",
      year: "Yıl:",
      yearValue: "2026",
    },
    copyright: "© 2026 Revak Okulları · Konsept çalışma —",
  },

  kvkk: {
    title: "Kişisel verilerin korunması hakkında aydınlatma metni",
    close: "Kapat",
    body: [
      "Revak Okulları olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusuyuz. Bu metin, ön kayıt, kampüs turu, bursluluk sınavı ve ücret bilgisi formlarında paylaştığınız bilgileri nasıl kullandığımızı anlatır.",
      "Topladığımız bilgiler: veli adı soyadı, telefon, e-posta; öğrencinin adı soyadı, doğum tarihi, sınıfı ve şu an gittiği okul. Bu formlarda sağlık bilgisi ve kimlik numarası istemeyiz.",
      "Amacımız: başvurunuzu değerlendirmek, sizinle görüşme ve tur planlamak, sınav giriş belgesi hazırlamak ve istediğiniz ücret bilgisini iletmek. Bilgileriniz bu amaçlar dışında kullanılmaz ve üçüncü kişilerle pazarlama amacıyla paylaşılmaz.",
      "Saklama süresi: kesin kayda dönüşmeyen başvurular iki yıl sonra silinir. Etkinlik ve duyuru iletileri yalnızca ayrıca izin verdiyseniz gönderilir; bu izni istediğiniz an geri alabilirsiniz.",
      "Kanunun 11. maddesi kapsamındaki haklarınız için kvkk@revak.k12.tr adresine yazabilirsiniz.",
    ],
  },

  notFound: {
    metaTitle: "Sayfa bulunamadı | Revak Okulları",
    title: "Bu kemerin ardında bir oda yok.",
    text: "Aradığınız sayfa taşınmış ya da hiç olmamış olabilir. Revağa geri dönün ya da başvurunun ilk adımına geçin.",
    home: "Ana sayfaya dönün",
    apply: "Ön kayıt",
  },

  /* ---------------- kampüs ---------------- */

  kampus: {
    metaTitle: "Kampüs ve yaşam | Revak Okulları",
    title: "Bir günün tamamı, tek bir bahçede.",
    intro:
      "Zekeriyaköy'deki kampüsümüz 48 dönüm. Anaokulunun kendi bahçesi, lisenin kendi binası var; kütüphane, sahne, havuz ve yemekhane herkesin.",
    heroAlt: "Servi sırası ile taş revak arasındaki bahçe yolu; yolun sonunda orman, sabah güneşinde",
    facilitiesTitle: "Her tesisin bir dersi var.",
    facilities: [
      { name: "Fen laboratuvarları", text: "Altı laboratuvar, iki öğrenciye bir mikroskop. Ortaokulda haftada en az bir ders laboratuvarda geçer.", image: img("lab") },
      { name: "Kütüphane", text: "Üç katta 38.000 kitap ve sessiz çalışma odaları. Lise öğrencileri akşam 19.00'a kadar kalabilir.", image: img("library") },
      { name: "Sahne ve müzik odaları", text: "420 kişilik sahne, on iki bireysel çalışma odası. Her öğrenci ilkokulda bir çalgıya başlar.", image: img("music") },
      { name: "Spor salonu ve havuz", text: "Yarı olimpik kapalı havuz, iki salon ve açık pist. Yüzme anaokulundan itibaren ders programında.", image: img("pool") },
      { name: "Yemekhane", text: "Kendi mutfağımızda her gün taze pişen üç öğün. Alerji ve diyet listeleri mutfakta ve sınıf öğretmeninde.", image: img("dining") },
      { name: "Atölyeler", text: "Seramik fırını, ahşap ve robotik atölyesi. Dönem boyunca yapılan işler dönem sonunda sergilenir.", image: img("ceramics") },
      { name: "Bahçeler ve orman yolu", text: "Teneffüsler açık havada. Baharda fen dersleri kampüsün orman kıyısında da yapılır.", image: img("garden") },
    ],
    day: {
      title: "Bir gün burada",
      intro: "Servisten inişten eve dönüşe kadar, bir öğrencinin günü saat saat. İlkokul ve lise günleri birbirinden epey farklı.",
      toggleLabel: "Kademe",
      toggle: { ilkokul: "İlkokul", lise: "Lise" },
      railLabel: "Günün saatleri",
      cta: "Bu günü yerinde görün",
      ctaNote: "En yakın boş tur saati seçili olarak açılır.",
      ilkokul: [
        { time: "08.10", title: "Kapıda karşılama", text: "Servisler 08.10'da kampüste. Nöbetçi öğretmen her çocuğu adıyla karşılar.", image: img("revak") },
        { time: "08.40", title: "Okuma saati", text: "Güne yirmi dakikalık okumayla başlarız. Herkes kendi kitabıyla, sınıfın kitaplığından ya da evden.", image: img("ilkokul") },
        { time: "10.20", title: "İngilizce", text: "Ana dili İngilizce olan öğretmenle, dört kişilik gruplarda konuşma çalışması.", image: img("writing") },
        { time: "12.00", title: "Öğle yemeği ve bahçe", text: "Öğretmenler çocuklarla aynı masada yer. Ardından bahçede kırk dakika.", image: img("dining") },
        { time: "13.30", title: "Sanat ya da yüzme", text: "Haftanın iki günü havuzda, üç günü atölyede ya da müzik odasında.", image: img("ceramics") },
        { time: "15.40", title: "Kulüpler ve etüt", text: "Satranç, seramik, orkestra, tiyatro. İsteyen öğrenci ödevini etüt saatinde bitirir.", image: img("chess") },
        { time: "16.30", title: "Servise biniş", text: "Servis kampüsten çıktığında veli uygulaması size haber verir.", image: img("revakWide") },
      ],
      lise: [
        { time: "07.45", title: "Kütüphane açılır", text: "Erken gelen öğrenciler için lise kütüphanesi ilk dersten önce açık.", image: img("library") },
        { time: "08.40", title: "İlk ders", text: "Ulusal program ve diploma programı dersleri 40 dakikalık bloklar hâlinde.", image: img("classroom") },
        { time: "10.20", title: "Laboratuvar", text: "Kimya ve biyoloji derslerinin üçte biri laboratuvarda geçer.", image: img("lab") },
        { time: "12.30", title: "Öğle ve kulüp toplantıları", text: "Yemekten sonra münazara ve Model BM kulüpleri kısa toplantılarını yapar.", image: img("debate") },
        { time: "14.00", title: "Danışman saati", text: "Haftada bir, danışman öğretmenle birebir görüşme. Üniversite planı bu saatlerde şekillenir.", image: img("lise") },
        { time: "15.40", title: "Takımlar", text: "Basketbol, yüzme, robotik. Maçlar ve turnuvalar okul takviminde.", image: img("court") },
        { time: "16.30", title: "Servis ya da etüt", text: "Servisler 16.30'da kalkar; kütüphane 19.00'a kadar açık kalır.", image: img("corridor") },
      ],
    },
    transport: {
      title: "Servis bölgeleri",
      intro: "Semtinizi seçin; sabah alınma saatini ve yaklaşık yolculuk süresini görün.",
      label: "Oturduğunuz semt",
      placeholder: "Semt seçin",
      found: (district: string) => `${district} için güzergâhımız var.`,
      pickup: "Sabah alınma",
      pickupNote: "yaklaşık",
      duration: "Yolculuk",
      minutes: (n: number) => `yaklaşık ${n} dakika`,
      features: [
        "Her araçta rehber personel ve emniyet kemeri.",
        "Aracın konumunu veli uygulamasından canlı izlersiniz.",
        "Akşam 16.30 ve etüt sonrası 17.45 olmak üzere iki dönüş.",
      ],
      none: (district: string) => `${district} bölgesine henüz servisimiz yok.`,
      noneText: "Talep bırakın; aynı semtten yeterli aile olduğunda yeni güzergâh açıyoruz.",
      requestLabel: "Cep telefonunuz",
      requestCta: "Talep bırakın",
      requestDone: "Talebinizi aldık. Güzergâh planlandığında sizi arayacağız.",
      districts: [
        { id: "sariyer", name: "Sarıyer", pickup: "07.35", minutes: 25 },
        { id: "besiktas", name: "Beşiktaş", pickup: "07.10", minutes: 45 },
        { id: "sisli", name: "Şişli", pickup: "07.05", minutes: 50 },
        { id: "kagithane", name: "Kağıthane", pickup: "07.15", minutes: 45 },
        { id: "eyupsultan", name: "Eyüpsultan", pickup: "07.20", minutes: 40 },
        { id: "beykoz", name: "Beykoz", pickup: "07.00", minutes: 55 },
        { id: "uskudar", name: "Üsküdar", pickup: "06.55", minutes: 60 },
        { id: "atasehir", name: "Ataşehir", pickup: null, minutes: null },
        { id: "kadikoy", name: "Kadıköy", pickup: null, minutes: null },
        { id: "basaksehir", name: "Başakşehir", pickup: null, minutes: null },
      ] as { id: string; name: string; pickup: string | null; minutes: number | null }[],
    },
    care: {
      title: "Güvenlik ve sağlık",
      text: "Tek giriş, kartla teslim, revirde iki hemşire, yılda üç tatbikat. Ayrıntılar ve \"bir şey olursa ne olur\" senaryoları Güvende sayfasında.",
      link: "Güvende sayfasına geçin",
    },
    closing: {
      title: "Kampüsü bir saatte görün.",
      text: "Yerinde tur, sınıf ziyareti ve kabul ofisiyle görüşme. Çevrim içi tur da akşam 18.30'a kadar mümkün.",
    },
  },

  /* ---------------- kabul ---------------- */

  kabul: {
    metaTitle: "Kabul | Revak Okulları",
    title: "Başvurudan ilk güne, adım adım.",
    intro:
      "Kabul ofisimiz hafta içi 08.30-17.30 arasında açık. Hangi adımdan başlayacağınızı bilmiyorsanız bir tur planlayın; gerisini birlikte konuşuruz.",
    pathsTitle: "Nereden başlamak istersiniz?",
    paths: [
      { id: "on-kayit", title: "Ön kayıt", text: "Tanışma görüşmesi için ilk adım. Dört dakikada tamamlanır, hiçbir yükümlülük getirmez.", cta: "Ön kayıt yaptırın", href: "/revak/kabul/on-kayit/" },
      { id: "tur", title: "Kampüs turu", text: "Yerinde bir saat ya da çevrim içi yarım saat. Çalışan veliler için akşam 18.30 seçeneği var.", cta: "Tur planlayın", href: "/revak/kabul/kampus-turu/" },
      { id: "burs", title: "Bursluluk sınavı", text: "Şu an 4-11. sınıfta olan öğrenciler için. %25 ile %100 arasında burs.", cta: "Sınava başvurun", href: "/revak/kabul/bursluluk/" },
      { id: "ucret", title: "Ücret bilgisi", text: "Size uyan ücret tablosu ve geçerli indirimler, aynı gün e-postanızda.", cta: "Ücret bilgisini alın", href: "/revak/kabul/ucret-bilgisi/" },
    ],
    processTitle: "Kayıt süreci dört adımda",
    process: [
      { title: "Ön kayıt", text: "Formu doldurduğunuzda kabul ofisi bir iş günü içinde sizi arar ve görüşme saati belirler." },
      { title: "Tanışma görüşmesi", text: "Kabul müdürü ve kademe koordinatörüyle kırk beş dakika. Çocuğunuzu ve beklentilerinizi dinleriz." },
      { title: "Gözlem günü", text: "Çocuğunuz yaşıtlarıyla bir sınıfta yarım gün geçirir. Anaokulu ve ilkokulda oyunla, ortaokul ve lisede kısa bir değerlendirmeyle." },
      { title: "Kesin kayıt", text: "Sonucu üç iş günü içinde bildiririz. Kesin kayıt sözleşmesi kampüste, sizinle birlikte imzalanır." },
    ],
    datesTitle: "Önemli tarihler",
    dates: [
      { date: "10 Ekim", text: "Açık Kapı Günü" },
      { date: "11 Kasım", text: "Bursluluk sınavı son başvuru" },
      { date: "15 Kasım", text: "Bursluluk sınavı" },
      { date: "1 Aralık", text: "2027-2028 kesin kayıtları başlar" },
      { date: "15 Mart", text: "Erken kayıt indirimi sona erer" },
    ],
    burs: {
      title: "Bursluluk sınavı",
      intro: "Şu an 4-11. sınıfta olan öğrenciler girebilir. Sınav 90 dakika sürer; Türkçe, matematik, fen bilimleri, sosyal bilgiler ve İngilizce sorularından oluşur. Soru sayısı sınıfa göre 50 ile 60 arasındadır.",
      countdownLabel: (date: string) => `${date} oturumuna kalan süre`,
      units: { days: "gün", hours: "saat", minutes: "dakika", seconds: "saniye" },
      sessionsTitle: "Oturumlar",
      tiersTitle: "Burs oranları",
      tiersHead: { rank: "Sıralama", rate: "Burs" },
      tiersNote: "Oran, sınıf düzeyindeki sıralamaya göre belirlenir ve öğrenim süresince başarı koşuluyla devam eder.",
      tiers: [
        { rank: "İlk %1", rate: "%100" },
        { rank: "Sonraki %4", rate: "%75" },
        { rank: "Sonraki %10", rate: "%50" },
        { rank: "Sonraki %15", rate: "%25" },
      ],
      sampleTitle: "Örnek sorular",
      sampleIntro: "Sınavın zorluk düzeyini görmek için üç soru.",
      correct: "Doğru.",
      wrong: "Tam değil.",
      samples: [
        {
          tag: "4. sınıf, matematik",
          q: "Bir kırtasiyede 3 defter 45 lira. Aynı defterlerden 5 tanesi kaç lira eder?",
          options: ["60 lira", "65 lira", "75 lira", "90 lira"],
          answer: 2,
          why: "Bir defter 45 ÷ 3 = 15 lira; 5 defter 75 lira eder.",
        },
        {
          tag: "6. sınıf, Türkçe",
          q: "Hangi cümlede \"yüz\" sözcüğü \"bir şeyin dışa bakan tarafı\" anlamında kullanılmıştır?",
          options: ["Havuzda yüz metre yüzdü.", "Kumaşın yüzü daha parlak.", "Yüzünü yıkayıp kahvaltıya indi.", "Onunla yüz yüze konuşmak istedi."],
          answer: 1,
          why: "Kumaşın yüzü, dışa bakan tarafıdır. Diğer cümlelerde sayı, organ ve \"karşı karşıya\" anlamları var.",
        },
        {
          tag: "9. sınıf, İngilizce",
          q: "If it ___ tomorrow, we will cancel the trip.",
          options: ["will rain", "rains", "rained", "would rain"],
          answer: 1,
          why: "Birinci tip koşul cümlesinde \"if\" kısmı geniş zamanla kurulur: If it rains, we will...",
        },
      ],
      cta: "Sınava başvurun",
    },
    fees: {
      title: "Ücretler ve indirimler",
      text: "Ücret; kademeye, servis ve yemek tercihine göre değişir. Size uyan tabloyu geçerli indirimlerle birlikte gönderiyoruz.",
      discounts: [
        { rate: "%10", text: "Kardeş indirimi, ikinci çocuktan itibaren" },
        { rate: "%7", text: "Erken kayıt indirimi, 15 Mart'a kadar" },
        { rate: "%5", text: "Peşin ödeme indirimi" },
      ],
      cta: "Ücret bilgisini alın",
    },
    faqTitle: "Kabulle ilgili sorular",
  },

  /* ---------------- flows ---------------- */

  flows: {
    common: {
      back: "Geri",
      next: "Devam edin",
      // under every submit button of the concept: the forms go nowhere (approved by Raşit, 2026-10-04)
      demoNote: "Bu bir tasarım örneği; form hiçbir yere gönderilmez.",
      close: "Kabul sayfasına dön",
      closeShort: "Kapat",
      step: (i: number, n: number) => `Adım ${i} / ${n}`,
      stepsLabel: "Başvuru adımları",
      plateLabel: "Başvurduğunuz kademe",
      edit: "Düzenle",
      toSummary: "Özete dönün",
      optional: "isteğe bağlı",
      select: "Seçin",
      help: { title: "Sorunuz mu var?", text: "Kabul ofisimiz hafta içi 08.30-17.30 arasında telefonda." },
      phonePrefix: "+90",
      kvkkPre: "",
      kvkkLink: "Aydınlatma metnini",
      kvkkPost: " okudum; başvurum için kişisel verilerimin işlenmesine açık rıza veriyorum.",
      kvkkError: "Devam etmek için aydınlatma metnini onaylayın.",
      marketing: "Etkinlik ve duyurulardan e-posta ya da SMS ile haberdar olmak istiyorum.",
      errors: {
        phone: "Cep telefonu 5 ile başlamalı ve 10 haneli olmalı.",
        email: "E-posta adresini kontrol edin; örneğin ad@alanadi.com",
        choose: "Bir seçenek belirleyin.",
      },
      fields: {
        veliAd: "Adınız soyadınız",
        telefon: "Cep telefonunuz",
        eposta: "E-posta adresiniz",
      },
      fieldErrors: {
        veliAd: "Adınızı ve soyadınızı yazın.",
      },
      kademe: { anaokulu: "Anaokulu", ilkokul: "İlkokul", ortaokul: "Ortaokul", lise: "Lise" } as Record<Kademe, string>,
      kademeHint: { anaokulu: "3-5 yaş", ilkokul: "1-4. sınıf", ortaokul: "5-8. sınıf", lise: "Hazırlık-12" } as Record<Kademe, string>,
      siniflar: {
        anaokulu: [
          { id: "3y", label: "3 yaş grubu", age: [3, 3] },
          { id: "4y", label: "4 yaş grubu", age: [4, 4] },
          { id: "5y", label: "5 yaş grubu", age: [5, 5] },
        ],
        ilkokul: [
          { id: "1", label: "1. sınıf", age: [5, 7] },
          { id: "2", label: "2. sınıf", age: [6, 8] },
          { id: "3", label: "3. sınıf", age: [7, 9] },
          { id: "4", label: "4. sınıf", age: [8, 10] },
        ],
        ortaokul: [
          { id: "5", label: "5. sınıf", age: [9, 11] },
          { id: "6", label: "6. sınıf", age: [10, 12] },
          { id: "7", label: "7. sınıf", age: [11, 13] },
          { id: "8", label: "8. sınıf", age: [12, 14] },
        ],
        lise: [
          { id: "hz", label: "Hazırlık", age: [13, 15] },
          { id: "9", label: "9. sınıf", age: [13, 15] },
          { id: "10", label: "10. sınıf", age: [14, 16] },
          { id: "11", label: "11. sınıf", age: [15, 17] },
          { id: "12", label: "12. sınıf", age: [16, 18] },
        ],
      } as Record<Kademe, SinifOption[]>,
    },

    onKayit: {
      metaTitle: "Ön kayıt | Revak Okulları",
      name: "Ön kayıt",
      steps: ["Sınıf", "Öğrenci", "Veli", "Onay"],
      helpNote: "Ön kayıt hiçbir yükümlülük getirmez. Kesin kayıt kararı, tanışma görüşmesinden sonra sizindir.",
      s1: {
        title: "Hangi sınıf için başvuruyorsunuz?",
        yil: "Akademik yıl",
        yillar: [
          { id: "2027-2028", label: "2027-2028", hint: "Eylül 2027'de başlar" },
          { id: "2026-2027", label: "2026-2027 ara dönem", hint: "Şubat 2027'de başlar" },
        ],
        kademe: "Kademe",
        sinif: "Sınıf",
        sinifPick: "Önce kademe seçin.",
        errors: { yil: "Akademik yılı seçin.", kademe: "Kademeyi seçin.", sinif: "Sınıfı seçin." },
      },
      s2: {
        title: "Çocuğunuzu tanıyalım.",
        ad: "Adı",
        soyad: "Soyadı",
        dogum: "Doğum tarihi",
        okul: "Şu an gittiği okul",
        okulHintOpt: "Anaokulu için isteğe bağlı",
        ingilizce: "İngilizce düzeyi",
        seviyeler: ["Başlangıç", "Orta", "İleri", "Emin değilim"],
        kardes: "Kardeşi Revak'ta okuyor",
        ozel: "Görüşmede konuşmak istediğimiz özel bir durum var",
        ozelHint: "Ayrıntıyı görüşmede sizden dinleriz; sağlık bilgisi bu formda istenmez.",
        ageWarn: "Seçtiğiniz sınıf için yaş aralığının dışında görünüyor. Görüşmede birlikte değerlendiririz.",
        errors: {
          ad: "Çocuğunuzun adını yazın.",
          soyad: "Çocuğunuzun soyadını yazın.",
          dogum: "Doğum tarihini girin.",
          dogumRange: "Doğum tarihini kontrol edin.",
          okul: "Şu an gittiği okulu yazın.",
        },
      },
      s3: {
        title: "Size nasıl ulaşalım?",
        yakinlik: "Çocuğa yakınlığınız",
        yakinliklar: ["Anne", "Baba", "Vasi"],
        kanal: "Tercih ettiğiniz iletişim",
        kanallar: ["Telefon", "E-posta", "WhatsApp"],
        saat: "Aranmak için uygun saat",
        saatler: ["09.00-12.00", "12.00-15.00", "15.00-18.00", "18.00-20.00"],
        ikinci: "İkinci veliyi ekleyin",
        ikinciKaldir: "İkinci veliyi kaldırın",
        ikinciAd: "İkinci velinin adı soyadı",
        ikinciTel: "İkinci velinin cep telefonu",
        errors: { yakinlik: "Yakınlığınızı seçin.", ikinciAd: "İkinci velinin adını yazın." },
      },
      s4: {
        title: "Bilgilerinizi kontrol edin.",
        sections: { sinif: "Sınıf", ogrenci: "Öğrenci", veli: "Veli" },
        yes: "Evet",
        submit: "Ön kaydı tamamlayın",
      },
      done: {
        title: "Ön kaydınız alındı.",
        ref: "Başvuru numaranız",
        text: (name: string, channel: string) =>
          `${name} için kabul ofisimiz bir iş günü içinde ${channel} size ulaşacak.`,
        channel: { Telefon: "telefonla", "E-posta": "e-postayla", WhatsApp: "WhatsApp'tan" } as Record<string, string>,
        nextTitle: "Sırada ne var",
        next: [
          "Kabul ofisi sizi arar ve görüşme saatini birlikte belirleriz.",
          "Tanışma görüşmesi: kırk beş dakika, kampüste ya da çevrim içi.",
          "Gözlem günü: çocuğunuz yaşıtlarıyla yarım gün geçirir.",
          "Kesin kayıt: karar sizindir, acele etmeyiz.",
        ],
        tour: "Kampüs turu da planlayın",
        tourText: "Bilgileriniz hazır; yalnızca gün ve saat seçmeniz yeterli.",
        seal: (yil: string) => `REVAK OKULLARI · ÖN KAYIT · ${yil} · `,
        sealLabel: (name: string) => `${name} için basılmış ön kayıt mührü`,
        burs: "Bursluluk sınavına da başvurun",
        bursText: "Çocuğunuzun sınıfı sınava girmeye uygun.",
      },
    },

    tur: {
      metaTitle: "Kampüs turu | Revak Okulları",
      name: "Kampüs turu",
      steps: ["Tur türü", "Gün ve saat", "İletişim"],
      s1: {
        title: "Kampüsü nasıl görmek istersiniz?",
        tur: "Tur türü",
        types: {
          yerinde: { label: "Yerinde tur", text: "Yaklaşık 60 dakika. Kampüs yürüyüşü, bir sınıf ziyareti ve kabul ofisiyle görüşme." },
          cevrimici: { label: "Çevrim içi tur", text: "30 dakika, canlı ve görüntülü. Akşam 18.30 seçeneği de var." },
        },
        kademeler: "İlgilendiğiniz kademeler",
        errors: { tur: "Tur türünü seçin.", kademeler: "En az bir kademe seçin." },
      },
      s2: {
        title: "Size uyan günü seçin.",
        day: "Gün",
        time: "Saat",
        parts: { sabah: "Sabah", ogleden: "Öğleden sonra", aksam: "Akşam" },
        left: (n: number) => (n === 1 ? "son 1 yer" : `${n} yer kaldı`),
        full: "Dolu",
        closed: "Kapalı",
        holiday: "Tatil",
        pickDay: "Önce bir gün seçin.",
        see: "Özellikle görmek istedikleriniz",
        seeOptions: ["Fen laboratuvarları", "Kütüphane", "Spor salonu ve havuz", "Sahne ve müzik odaları", "Yemekhane", "Servis ve güvenlik", "Anaokulu binası ve bahçesi", "Revir", "Orman yolu ve bahçeler"],
        errors: { day: "Bir gün seçin.", time: "Bir saat seçin." },
      },
      s3: {
        title: "Sizi kimin adına bekleyelim?",
        kisi: "Kaç kişi geleceksiniz?",
        less: "Bir kişi azaltın",
        more: "Bir kişi ekleyin",
        cocuk: "Çocuğum da gelecek",
        cocukHint: "Tur sırasında çocuklar bir öğretmenimizle atölyede vakit geçirir.",
        plaka: "Araç plakası",
        plakaHint: "Güvenlik girişinde adınız hazır olur.",
        submit: "Turu planlayın",
      },
      summary: {
        title: "Tur özeti",
        type: "Tür",
        date: "Gün",
        time: "Saat",
        length: "Süre",
        minutes: (n: number) => `${n} dakika`,
        price: "Ücretsiz",
        empty: "Seçim yapılmadı",
      },
      done: {
        title: (name: string) => (name ? `Görüşmek üzere, ${name}.` : "Görüşmek üzere."),
        text: "Turunuz planlandı. Bir gün önce kısa bir hatırlatma mesajı gönderiyoruz.",
        card: "Kampüs turu",
        meet: "Buluşma noktası",
        meetOnsite: "Ana giriş, Revak Kapısı",
        meetOnline: "Görüntülü görüşme bağlantısı turdan bir gün önce e-postanıza gelir.",
        host: "Sizi karşılayacak",
        hostName: "Kabul ofisinden bir öğretmenimiz",
        guests: (n: number) => (n === 1 ? "1 kişi" : `${n} kişi`),
        ics: "Takvime ekleyin",
        directions: "Yol tarifi",
        change: "Saati değiştirin",
        icsTitle: "Revak Okulları kampüs turu",
        icsTitleOnline: "Revak Okulları çevrim içi tur",
        icsDesc: "Sizi kabul ofisinden bir öğretmenimiz karşılayacak. Telefon: 0212 000 19 87",
        location: "Revak Okulları, Çamlık Yolu No: 12, Zekeriyaköy, Sarıyer, İstanbul",
        onKayit: "Ön kaydı da şimdi yaptırın",
      },
    },

    burs: {
      metaTitle: "Bursluluk sınavı başvurusu | Revak Okulları",
      name: "Bursluluk sınavı",
      steps: ["Oturum", "Aday ve veli", "Onay"],
      helpNote: "Sınava başvuru ücretsizdir. Sonuçlar sınavdan sonraki on gün içinde veliye bildirilir.",
      s1: {
        title: "Öğrenciniz şu an kaçıncı sınıfta?",
        sinif: "Şu anki sınıfı",
        sinifLabel: (n: number) => `${n}. sınıf`,
        oturum: "Oturum",
        pickGrade: "Sınıfı seçtiğinizde uygun oturumlar burada listelenir.",
        none: "Bu sınıf için başvurusu açık oturum kalmadı. Bir sonraki dönem için ön kayıt yaptırabilirsiniz.",
        deadline: (d: string) => `Son başvuru ${d}`,
        left: (n: number) => `${n} kontenjan kaldı`,
        few: "Kontenjan azalıyor",
        full: "Kontenjan doldu",
        closed: "Başvurular kapandı",
        place: "Revak Kampüsü",
        errors: { sinif: "Sınıfı seçin.", oturum: "Bir oturum seçin." },
      },
      s2: {
        title: "Aday ve veli bilgileri",
        adayAd: "Adayın adı",
        adaySoyad: "Adayın soyadı",
        okul: "Şu an gittiği okul",
        idNote: "Kimlik numarası bu formda istenmez. Sınav günü girişte adayın kimlik kartını ya da öğrenci belgesini yanınızda getirin.",
        errors: { adayAd: "Adayın adını yazın.", adaySoyad: "Adayın soyadını yazın.", okul: "Şu an gittiği okulu yazın." },
      },
      s3: {
        title: "Son bir kontrol.",
        sections: { oturum: "Oturum", aday: "Aday ve veli" },
        rulesPre: "",
        rulesLink: "Sınav şartnamesini",
        rulesPost: " okudum ve kabul ediyorum.",
        rulesError: "Başvuru için sınav şartnamesini onaylayın.",
        submit: "Başvuruyu tamamlayın",
      },
      rules: {
        title: "Bursluluk sınavı şartnamesi",
        body: [
          "Sınava yalnızca 2026-2027 öğretim yılında 4-11. sınıfta okuyan öğrenciler girebilir. Her öğrenci bir öğretim yılında bir oturuma katılabilir.",
          "Adaylar giriş saatinde (09.30) kampüste olmalıdır. 10.15'ten sonra salona aday alınmaz; sınavın ilk 30 dakikasında salondan çıkılmaz.",
          "Adayın yanında kimlik kartı ya da öğrenci belgesi bulunmalıdır. Kurşun kalem ve silgi dışında araç kullanılmaz; cep telefonları salon girişinde teslim alınır.",
          "Burs oranı, aynı sınıf düzeyindeki adaylar arasındaki sıralamaya göre belirlenir. Sonuçlar sınavdan sonraki on gün içinde veliye bildirilir.",
          "Kazanılan burs, kesin kayıt yapılması ve her yıl sonunda ağırlıklı ortalamanın 80 ve üzeri olması koşuluyla öğrenim süresince devam eder.",
        ],
      },
      done: {
        title: "Sınav giriş belgeniz hazır.",
        text: "Belgeyi yazdırabilir ya da telefonunuzda gösterebilirsiniz. Bir kopyası e-postanıza da gönderildi.",
        card: "Bursluluk sınavı giriş belgesi",
        candidate: "Aday",
        number: "Aday numarası",
        grade: "Sınıf",
        session: "Oturum",
        room: "Salon",
        entry: "Giriş saati",
        start: "Sınav başlangıcı",
        place: "Revak Okulları, Zekeriyaköy, Sarıyer",
        print: "Yazdırın",
        ics: "Takvime ekleyin",
        note: "Sınav günü yanınızda kurşun kalem, silgi ve adayın kimlik kartı ya da öğrenci belgesi olsun.",
        icsTitle: "Revak Okulları bursluluk sınavı",
        onKayit: "Ön kaydı da yaptırın",
      },
    },

    ucret: {
      metaTitle: "Ücret bilgisi | Revak Okulları",
      name: "Ücret bilgisi",
      title: "Ücret bilgisini alın.",
      intro: "Size uyan ücret tablosunu, geçerli indirimlerle birlikte gönderelim.",
      kademe: "Kademe",
      yil: "Akademik yıl",
      yillar: ["2027-2028", "2026-2027 ara dönem"],
      kanal: "Nasıl ulaşalım?",
      kanallar: { email: "Tabloyu e-postayla gönderin", phone: "Arayın, anlatın" },
      submit: "Ücret bilgisini alın",
      errors: { kademe: "Kademeyi seçin.", kanal: "Size nasıl ulaşacağımızı seçin." },
      asideTitle: "Ücreti düşüren seçenekler",
      aside: [
        { rate: "%10", text: "Kardeş indirimi" },
        { rate: "%7", text: "15 Mart'a kadar erken kayıt" },
        { rate: "%5", text: "Peşin ödeme" },
        { rate: "%25-100", text: "Bursluluk sınavıyla burs" },
      ],
      asideLink: "Bursluluk sınavı hakkında",
      done: {
        title: "Talebiniz alındı.",
        email: (e: string) => `Ücret tablosu bugün mesai bitmeden ${e} adresinde olacak.`,
        phone: "Kabul ofisimiz bugün içinde sizi arayacak.",
        tour: "Bu arada kampüsü görmek isterseniz",
        tourCta: "Tur planlayın",
      },
    },
  },
};

export type RevakCopy = typeof tr;

/** Every page of the site, in menu order: the menu's headings and the pages among their links
 *  (anchors stay in the menu only), then the header's actions. The footer's "Sayfalar" list. */
export const PAGES: { label: string; href: string }[] = (() => {
  const seen = new Set<string>();
  const out: { label: string; href: string }[] = [];
  const add = (label: string, href: string) => {
    if (href.includes("#") || seen.has(href)) return;
    seen.add(href);
    out.push({ label, href });
  };
  for (const g of tr.nav.groups) {
    add(g.label, g.href);
    for (const i of g.items) add(i.label, i.href);
  }
  add(tr.nav.apply, "/revak/kabul/on-kayit/");
  add(tr.nav.tour, "/revak/kabul/kampus-turu/");
  add(tr.nav.parents, "/revak/veli/");
  return out;
})();
