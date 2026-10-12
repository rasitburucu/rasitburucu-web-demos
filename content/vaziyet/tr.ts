// Vaziyet: every Turkish string on the site. Fictional brand (concept study for
// rasitburucu.com). Prices, durations, phone, e-mail and the sample ratios are
// examples and say so where they appear. Sentences marked in
// .tasarim/vaziyet/METIN-ONAY.md as "avukat/mimar teyidi" need a professional's
// check before a real client uses them. Awaiting Raşit's approval.
import type { Ihlal, Nitelik, Yon } from "@/lib/vaziyet/hesap";

export type NavLink = { label: string; href: string };

const BASE = "/vaziyet";

export const YON_AD: Record<Yon, string> = {
  K: "Kuzey",
  KD: "Kuzeydoğu",
  D: "Doğu",
  GD: "Güneydoğu",
  G: "Güney",
  GB: "Güneybatı",
  B: "Batı",
  KB: "Kuzeybatı",
};
const YON_E: Record<Yon, string> = {
  K: "kuzeye",
  KD: "kuzeydoğuya",
  D: "doğuya",
  GD: "güneydoğuya",
  G: "güneye",
  GB: "güneybatıya",
  B: "batıya",
  KB: "kuzeybatıya",
};
const YON_DE: Record<Yon, string> = {
  K: "kuzeyinde",
  KD: "kuzeydoğusunda",
  D: "doğusunda",
  GD: "güneydoğusunda",
  G: "güneyinde",
  GB: "güneybatısında",
  B: "batısında",
  KB: "kuzeybatısında",
};
const GUNES: Record<Yon, string> = {
  G: "gün boyu güneş alır",
  GD: "sabahtan öğleye güneş alır",
  GB: "öğleden akşama güneş alır",
  D: "sabah güneşi alır",
  B: "akşamüstü güneşi alır",
  KD: "yalnız yaz sabahları güneş alır",
  KB: "yalnız yaz akşamları güneş alır",
  K: "doğrudan güneş neredeyse hiç almaz",
};
const NITELIK: Record<Nitelik, string> = { arsa: "Arsa", tarla: "Tarla", bilmiyorum: "Bilmiyorum" };

// Turkish case endings for place names (with the apostrophe): Bursa'ya, İzmir'e;
// Bursa'daki, Bilecik'teki. Proper names keep their consonants.
const SESLI = "aeıioöuüâîû";
const sonSesli = (ad: string) => [...ad.toLocaleLowerCase("tr")].reverse().find((c) => SESLI.includes(c)) ?? "e";
const kalin = (ad: string) => "aıouâû".includes(sonSesli(ad));
const sesliyleBiter = (ad: string) => SESLI.includes(ad.toLocaleLowerCase("tr").slice(-1));
export const yonelme = (ad: string) => `${ad}'${sesliyleBiter(ad) ? "y" : ""}${kalin(ad) ? "a" : "e"}`;
export const bulunmaKi = (ad: string) => {
  const son = ad.toLocaleLowerCase("tr").slice(-1);
  const sert = "çfhkpsşt".includes(son);
  return `${ad}'${sert ? "t" : "d"}${kalin(ad) ? "a" : "e"}ki`;
};

const m1 = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const m0 = (n: number) => Math.round(n).toLocaleString("tr-TR");
const m2f = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const tr = {
  base: BASE,
  meta: {
    title: "Vaziyet | Prefabrik ve hafif çelik ev, Eskişehir",
    description:
      "Evi almadan önce arsanıza koyun: arsanızın ölçüsünü ve imar durumunuzdaki değerleri yazın, bir model seçin; sığıp sığmadığını, kalan bahçeyi ve tahmini maliyeti hemen görün. Konsept çalışma.",
    notFoundTitle: "Sayfa bulunamadı | Vaziyet",
    modeller: "Modeller",
    modellerAciklama: "Beş prefabrik ev modeli: dış ölçü, kat planı, hangi arsaya sığdığı, fiyat ve teslim süresi. Konsept çalışma.",
    model: (ad: string) => ad,
    modelAciklama: (ad: string, oda: string) => `${ad}, ${oda}: kat planı, dış ölçü, en küçük arsa, fiyat ve teslim süresi. Konsept çalışma.`,
    uretim: "Nasıl üretiyoruz",
    uretimAciklama: "Fabrikada panel üretimi, tır ve vinç erişimi, kurulum günleri. Konsept çalışma.",
    rehber: "Ruhsat ve imar",
    rehberAciklama: "Sığması ruhsat alacağı anlamına gelmez: imar durumu belgesi, tapudaki nitelik, tarla ve hobi bahçesi gerçeği, kaynaklarıyla. Konsept çalışma.",
    teklif: "Teklif özeti",
    pafta: "Vaziyet planı taslağı",
  },
  brand: {
    ad: "Vaziyet",
    satir: "Prefabrik ve hafif çelik ev",
    home: "Vaziyet ana sayfa",
    phone: "0222 000 00 00",
    phoneHref: "tel:+902220000000",
    phoneNote: "örnek numara",
    email: "teklif@vaziyet.com.tr",
    emailNote: "örnek adres",
  },
  ornek: "örnek",
  skip: "İçeriğe geç",
  strip: { text: "Konsept çalışma —", link: "rasitburucu.com", href: "https://rasitburucu.com" },
  nav: {
    label: "Ana menü",
    menu: "Menü",
    close: "Kapat",
    home: "Ana sayfa",
    items: [
      { label: "Modeller", href: `${BASE}/modeller/` },
      { label: "Nasıl üretiyoruz", href: `${BASE}/nasil-uretiyoruz/` },
      { label: "Ruhsat ve imar", href: `${BASE}/ruhsat-ve-imar/` },
      { label: "Teklif özeti", href: `${BASE}/teklif/` },
    ] as NavLink[],
    call: "Ara",
  },

  // ------------------------------------------------------------------ WhatsApp (never a real link)
  wa: {
    button: "WhatsApp",
    title: "WhatsApp mesajınız hazır",
    lead: "Gerçek firmada bu düğme WhatsApp'ı açar ve mesaj aşağıdaki metinle hazır gelir.",
    demo: "Bu bir tasarım örneği; numara kurgusal olduğu için WhatsApp açılmaz, mesaj hiçbir yere gitmez.",
    copy: "Metni kopyala",
    copied: "Kopyalandı",
    close: "Kapat",
    textLabel: "Mesaj metni",
    genel: "Merhaba, prefabrik ev için bilgi almak istiyorum.",
    arsa: (W: string, D: string, model: string, il: string, nitelik: string) =>
      `Merhaba, ${bulunmaKi(il)} ${W} × ${D} m arsam için ${model} modeline bakıyorum. Tapuda yazan: ${nitelik}. Arsaya birlikte bakabilir miyiz?`,
  },

  mobileBar: { label: "Hızlı iletişim", call: "Ara", wa: "WhatsApp", teklif: "Teklif özeti" },

  // ------------------------------------------------------------------ the plot check
  arac: {
    h1: "Evi almadan önce arsanıza koyun.",
    lead: "Sığar mı, ne kadar bahçe kalır, salon güneşi görür mü? İmar durumunuzdaki rakamlarla, sipariş vermeden görün.",
    rafBaslik: "Bir model seçin",
    rafEtiket: "Modeller",
    kartBaslik: "Arsanızın kuralları",
    kartNot: "imar durumu belgesinden",
    arsa: "Arsa",
    arsaAlt: "yol cephesi × derinlik",
    cephe: "Yol cephesi, metre",
    derinlik: "Derinlik, metre",
    nitelik: "Tapuda yazan",
    nitelikAd: NITELIK,
    taks: "TAKS",
    taksAlt: "taban alanı oranı",
    kaks: "KAKS",
    kaksAlt: "emsal",
    bahce: "Bahçe mesafesi",
    bahceAlt: "ön · yan · arka",
    on: "Ön bahçe, metre",
    yan: "Yan bahçe, metre",
    arka: "Arka bahçe, metre",
    hmax: "Yükseklik sınırı",
    hmaxAlt: "Hmax",
    yol: "Yol hangi yanda?",
    yolAria: (y: Yon) => `Yol arsanın ${YON_DE[y]}`,
    yonAd: YON_AD,
    birim: "m",
    gecersiz: (a: string, b: string) => `${a} ile ${b} arasında bir değer yazın.`,
    durumKural: { tamam: "uygun", ihlal: "olası ihlal" },
    ipucuBaslik: "Belgede nerede yazar?",
    ipucu: {
      arsa: {
        belge: "Ada 412 · Parsel 7 · Yüzölçümü 660 m²",
        metin: "Tapuda yüzölçümü yazar, kenar ölçüleri yazmaz. Yol cephesini ve derinliği aplikasyon krokisinden ya da e-imar ve parsel sorgu ekranlarından okuyabilirsiniz.",
      },
      nitelik: {
        belge: "Niteliği: Arsa",
        metin: "Tapunuzun “Niteliği” satırına bakın: arsa, tarla, bağ, bahçe… “Tarla” yazıyorsa ruhsat yolu bambaşka işler.",
      },
      taks: {
        belge: "TAKS: 0,30",
        metin: "“TAKS” ya da “Taban alanı kat sayısı” satırında yazar. Evin oturduğu alanın arsaya oranıdır.",
      },
      kaks: {
        belge: "KAKS (Emsal): 0,60",
        metin: "“KAKS”, “Emsal” ya da “E = 0,60” diye yazar. Bütün katların toplam alanının arsaya oranıdır.",
      },
      bahce: {
        belge: "Bahçe mesafeleri: Ön 5,00 · Yan 3,00 · Arka 3,00 m",
        metin: "Belgenizde yazmıyorsa yönetmeliğin en az değerleri geçerlidir: ön 5, yan 3, arka 3 metre.",
      },
      hmax: {
        belge: "Hmax: 6,50 m",
        metin: "“Hmax” ya da “Yençok” diye yazar. Yalnız kat adedi yazıyorsa (ör. “A-2”: ayrık nizam, 2 kat) yükseklik sınırını belediyenize sorun.",
      },
      yol: {
        belge: "",
        metin: "Yol arsanızın hangi yanından geçiyor? Telefonunuzun haritası gösterir. Salonun güneşi görüp görmediği buna bağlı.",
      },
    },
    belgeYok: {
      buton: "Belgem elimde yok",
      baslik: "Belgeniz yanınızda değilse",
      metin:
        "En sık görülen değerlerle başladık. Bahçe mesafelerinde yönetmeliğin en az değerleri geçerli: ön 5, yan 3, arka 3 metre. TAKS ve KAKS ise imar planına göre değişir; buradakiler örnektir.",
      nasil:
        "Kendi değerlerinizi öğrenmek için tapunuzdaki ada ve parsel numarasıyla belediyenizin e-imar sayfasına bakın ya da belediyeden imar durumu belgesi isteyin.",
      sifirla: "Yönetmelik değerlerine dön",
      kapat: "Kapat",
    },
    gorunum: "Görünüm",
    plan: "Plan",
    maket: "Maket",
    cevir: "Evi çevir",
    cevirAria: "Evi 90 derece çevir",
    surukle: "Evi sürükleyerek ya da yön tuşlarıyla yerleştirebilirsiniz.",
    maketYukleniyor: "Maket hazırlanıyor…",
    maketHata: "Bu cihazda maket açılamadı; plan aynı sonucu gösteriyor.",
    // status box
    sigiyor: (bahce: number) => `Sığıyor. ${m0(bahce)} m² bahçe kalıyor.`,
    salon: (y: Yon) => `Salon ${YON_E[y]} bakıyor; ${GUNES[y]}.`,
    sigmiyor: "Bu haliyle sığmıyor.",
    olasiIhlal: "Olası ihlal",
    ihlal: (i: Ihlal): string => {
      switch (i.kural) {
        case "alan":
          return "Bu bahçe mesafeleriyle arsada ev yapılabilecek alan kalmıyor.";
        case "yan":
          if (i.sol && i.sag) return `Ev, yan bahçe çizgisini iki yanda da aşıyor: solda ${m1(i.sol)} m, sağda ${m1(i.sag)} m.`;
          return `Ev, yan bahçe çizgisini ${i.sol ? "solda" : "sağda"} ${m1(i.sol || i.sag)} m aşıyor.`;
        case "on":
          return `Ev, ön bahçe çizgisini ${m1(i.m)} m aşıyor.`;
        case "arka":
          return `Ev, arka bahçe çizgisini ${m1(i.m)} m aşıyor.`;
        case "taks":
          return `Taban alanı ${m0(i.taban)} m²; TAKS ile hakkınız ${m0(Math.floor(i.hak))} m².`;
        case "kaks":
          return `Toplam alan ${m0(i.toplam)} m²; emsal hakkınız ${m0(Math.floor(i.hak))} m².`;
        case "hmax":
          return `Yükseklik sınırı ${m2f(i.sinir)} m; bu modelin saçağı ${m2f(i.sacak)} m.`;
      }
    },
    dahaFazla: (n: number) => `ve ${n} olası ihlal daha`,
    oneri: {
      cevir: "Evi çevirirseniz sığıyor.",
      cevirBtn: "Evi çevir",
      yerlestir: "Ev bu arsaya sığıyor; yalnız yeri değişmeli.",
      yerlestirBtn: "Sınırların içine al",
      salon: (y: Yon) => `Evi çevirirseniz salon ${YON_E[y]} bakar.`,
      salonBtn: "Salonu güneşe çevir",
      model: (ad: string) => `Bu arsaya ${ad} sığıyor.`,
      modelBtn: (ad: string) => `${ad} modeline bak`,
      yok: "Bu değerlerle modellerimizden hiçbiri sığmıyor. Arsanıza birlikte bakalım.",
    },
    yalnizOlcu: "Bu hesap yalnız ölçülere bakar.",
    // score strip
    skor: {
      taban: "Taban / TAKS hakkı",
      bahce: "Kalan bahçe",
      sacak: "Saçak / sınır",
      salon: "Salon",
      fiyat: "Tahmini maliyet",
      fiyatNot: "temel, nakliye ve kurulum dahil",
      teklif: "Bu yerleşimle teklif iste",
      dokum: "Dökümü gör",
    },
    ruhsat: {
      arsa: [
        "Bu hesap yalnız ölçülere bakar; ruhsatı belediye verir.",
        "Tapunuzda “tarla” yazıyorsa kalıcı konut ruhsatı alınamaz.",
      ],
      tarla: [
        "Tapuda “tarla” yazıyorsa bu arsaya kalıcı konut ruhsatı alınamaz.",
        "Ölçüler tutsa bile önce izin yolunu birlikte netleştirelim.",
      ],
      bilmiyorum: [
        "Tapunuzun “Niteliği” satırına bakın.",
        "“Tarla” yazıyorsa kalıcı konut ruhsatı alınamaz; “arsa” yazıyorsa sıradaki adım imar durumu belgesi.",
      ],
      link: "Ruhsat ve imar rehberi",
    },
    // drawing
    svgBaslik: "Arsanın planı ve seçilen ev",
    svgOzet: (W: number, D: number, ad: string, sigar: boolean) => `${m1(W)} × ${m1(D)} m arsa; ${ad} ${sigar ? "sığıyor" : "bu haliyle sığmıyor"}.`,
    evAria: (ad: string) => `${ad}. Yön tuşlarıyla yarım metre kaydırın.`,
    cizim: {
      yol: "yol",
      cephe: (W: number) => `yol cephesi ${m1(W)} m`,
      derinlik: (D: number) => `derinlik ${m1(D)} m`,
      on: (n: number) => `ön bahçe ${m1(n)} m`,
      arka: (n: number) => `arka ${m1(n)} m`,
      yan: (n: number) => `yan ${m1(n)} m`,
      salon: (y: Yon) => `salon, ${YON_AD[y].toLocaleLowerCase("tr")}`,
      kuzey: "K",
      metre: (n: number) => `${m1(n)} m`,
      yukseklik: (n: number) => `izin verilen yükseklik ${m2f(n)} m`,
      sacak: (n: number) => `saçak ${m2f(n)} m`,
    },
  },

  // ------------------------------------------------------------------ cost
  maliyet: {
    baslik: "Fiyatın içinde ne var",
    lead: "Liste fiyatı, evin fabrikadan çıkış fiyatıdır. Evin arsanızda oturması için üç kalem daha var; hepsini baştan yazıyoruz.",
    il: "Arsanız hangi ilde?",
    mesafeKaynak: "Mesafe: il merkezleri arası karayolu, OpenStreetMap verisiyle (© OpenStreetMap katkıda bulunanlar).",
    ev: "Ev, fabrika teslim",
    evNot: "Paneller, çatı, pencere ve kapılar, bina içi elektrik ve sıhhi tesisat, iç kapılar, boya.",
    nakliye: "Nakliye",
    nakliyeNot: (tir: number, il: string, km: number) => `${tir} tır, Eskişehir'den ${yonelme(il)}, yaklaşık ${m0(km)} km.`,
    nakliyeYerel: (tir: number) => `${tir} tır, fabrikadan arsanıza.`,
    temel: "Temel",
    temelNot: (taban: number) => `${m0(taban)} m² radye temel. Projesini biz veririz; birim fiyatı zemin etüdüne göre değişir.`,
    kurulum: "Kurulum",
    kurulumNot: (gun: string, vinc: number) => `Montaj ekibi ${gun} gün, vinç ${vinc} gün.`,
    toplam: "Tahmini toplam",
    kdv: "Tutarlar KDV dahildir.",
    tahmini: "tahmini",
    dahilDegil: "Bu tutara dahil olmayanlar",
    dahilDegilListe: [
      "Ruhsat, proje ve yapı denetim bedelleri",
      "Belediye harçları",
      "Zemin etüdü",
      "Elektrik, su ve doğalgaz bağlantıları",
      "Eğimli arsada hafriyat ve istinat duvarı",
      "Mutfak dolabı ve beyaz eşya",
      "Bahçe düzenlemesi",
    ],
    sure: "Ne kadar sürer?",
    sureUretim: (h: string) => `Üretim ${h} hafta`,
    sureKurulum: (g: string) => `Kurulum ${g} gün`,
    sureNot: "Temel, üretim sürerken arsanızda dökülür; ev geldiğinde hazır olur. Süre, ruhsatınız çıktıktan sonra başlar.",
    yazili: "Yazılı teklifte her kalemi ayrı satırda görürsünüz; fiyatlar örnektir.",
    katmanEtiket: "Fiyatın katmanları: ev, temel, nakliye ve kurulum",
  },

  // ------------------------------------------------------------------ home sections
  surec: {
    baslik: "Ruhsattan anahtara: kim, ne zaman?",
    lead: "Bir evin arsada geçen süresi kısa; uzun olan kâğıt işi. Hangi adımın kimde olduğunu baştan bilin.",
    hafta: "hafta",
    degisir: "belediyeye göre değişir",
    sifir: "ruhsat çıktı",
    gun: "gün",
    adimlar: [
      { id: "imar", ad: "İmar durumu", kim: "Siz", metin: "Belediyeden alırsınız. Bu sayfadaki hesabı belgenizdeki rakamlarla birlikte yeniden yaparız." },
      { id: "ruhsat", ad: "Proje ve ruhsat", kim: "Mimarınız ve belediye", metin: "Projeyi mimarınız çizer, ruhsatı belediye verir. Kat planını, ölçüleri ve statik hesap verilerini biz hazırlarız." },
      { id: "uretim", ad: "Üretim", kim: "Biz", metin: "Duvar, döşeme ve çatı panelleri fabrikada kesilir, numaralanır, tesisatı döşenir." },
      { id: "temel", ad: "Temel", kim: "Yerel usta ya da ekibimiz", metin: "Üretimle aynı haftalarda dökülür. Projesini biz veririz." },
      { id: "nakliye", ad: "Nakliye", kim: "Biz", metin: "Paneller montaj sırasıyla tıra yüklenir." },
      { id: "kurulum", ad: "Kurulum", kim: "Biz", metin: "Vinç panelleri temele indirir; ekip önce duvarları, sonra çatıyı kapatır." },
      { id: "iskan", ad: "Bağlantılar ve iskân", kim: "Kurumlar ve belediye", metin: "Elektrik, su ve doğalgazı ilgili kurumlar bağlar; yapı kullanma iznini belediye verir." },
    ],
    temelSure: "≈ 2 hafta",
    nakliyeSure: "1 gün",
    ornek: (ad: string) => `Süreler ${ad} için; fiyatlar ve süreler örnektir.`,
  },
  ruhsatBand: {
    baslik: "Sığması, ruhsat alacağı anlamına gelmez.",
    lead: "Bu hesap yalnız ölçülere bakar. Ruhsatı belediye verir; bağlayan, belediyeden alacağınız imar durumu belgesidir.",
    kartlar: [
      {
        baslik: "Tapuda “arsa” yazıyorsa",
        metin: "Ruhsat, imar planındaki değerlere uyan projeye verilir. Önce imar durumu belgesini isteyin; hesabı onunla birlikte yaparız.",
        isaret: "ok",
      },
      {
        baslik: "Tapuda “tarla” yazıyorsa",
        metin: "Kalıcı konut ruhsatı alınamaz. Tarım arazisinde izinsiz yapılan yapıya 20 Haziran 2026'dan beri elektrik, su ve doğalgaz aboneliği de bağlanmıyor.",
        isaret: "no",
      },
      {
        baslik: "Köyün yerleşik alanındaysa",
        metin: "Belediye sınırı dışında, köyün yerleşik alanında yapı ruhsatı aranmaz; ama projenin valilikçe onaylanması ve muhtarlığa bildirilmesi gerekir.",
        isaret: "bilgi",
      },
    ],
    link: "Ruhsat ve imar rehberi",
  },
  modellerBand: {
    baslik: "Beş model, aynı ölçekte.",
    lead: "Her modelin dış ölçüsü yanında yazar; arsaya sığıp sığmadığı ona bağlı. Hepsi arsanıza göre çevrilebilir.",
    gorselAlt:
      "Yeşil kesim matı üstünde, aynı ölçekte dizilmiş beş kobalt mavisi ev maketi: soldan sağa Sundurma, Sofa, Hayat, iki katlı Cumba ve Avlu. Bilgisayarda modellenmiş maket görseli.",
    koy: "Arsama koy",
    plan: "Planı gör",
    tumu: "Bütün modeller",
    sigar: (bahce: number) => `Arsanıza sığıyor, ${m0(bahce)} m² bahçe kalıyor.`,
    sigmaz: "Arsanıza bu haliyle sığmıyor.",
    arsaNot: (W: number, D: number) => `Kartlardaki sonuç, hesaptaki ${m1(W)} × ${m1(D)} m arsanız için.`,
  },
  uretimBand: {
    baslik: "Fabrikada üretilir, arsanızda birkaç günde kurulur.",
    maddeler: [
      "Paneller kapalı salonda ölçüsünde kesilir ve numaralanır; yağmur, kar ve şantiye sürprizi görmez.",
      "Tır ve vinç arsanıza ulaşabilir mi? Dört soruyla baştan bakarız.",
      "Temel hazırsa Sofa 78 üç ila dört günde kurulur.",
    ],
    link: "Nasıl üretiyoruz",
    gorselAlt: "Maket: tır römorkunda numaralı panel istifleri, yanında mobil vinç. Bilgisayarda modellenmiş maket görseli.",
  },
  kapanis: {
    baslik: "Arsanızın ölçüsünü söyleyin, telefonda birlikte bakalım.",
    lead: "Satış ekibimiz bu hesabı sizinle aynı ekranda açar; belgenizdeki rakamlarla birlikte yeniden yaparız.",
    saat: "Hafta içi 09.00–18.00, cumartesi 10.00–14.00",
    teklif: "Teklif özetine geç",
  },

  // ------------------------------------------------------------------ models
  modeller: {
    baslik: "Modeller",
    lead: "Beş model, hepsi arsanıza göre çevrilebilir. Her birinin dış ölçüsünü, kat planını ve hangi arsaya sığdığını burada görürsünüz.",
    tablo: {
      baslik: "Beş modeli yan yana karşılaştırın",
      model: "Model",
      oda: "Oda",
      alan: "Kapalı alan",
      olcu: "Dış ölçü",
      sacak: "Saçak",
      arsa: "En küçük arsa",
      fiyat: "Fabrika teslim",
      kurulu: "Kurulu, tahmini",
      sure: "Üretim / kurulum",
      sureDeger: (h: string, g: string) => `${h} hafta / ${g} gün`,
    },
    not: (il: string) => `Fiyatlar örnektir ve KDV dahildir. Kurulu fiyata temel, nakliye ve kurulum dahildir; ${il} için hesaplandı.`,
    arsaNot: "En küçük arsa: yönetmeliğin en az bahçe mesafeleriyle (ön 5, yan 3, arka 3 m), ev çevrilmeden.",
    kat: (n: 1 | 2) => (n === 2 ? "iki kat" : "tek kat"),
  },
  model: {
    tanitim: {
      sundurma:
        "Küçük ama eksiksiz: salon ve mutfak bir arada, yatak odası ve banyo ayrı. Yazlık, emeklilik evi ya da büyük bir bahçenin dibinde misafir evi.",
      sofa: "Ortada aydınlık bir sofa, iki yanında birer yatak odası. Sofa iki cepheye açıldığı için gün boyu ışık alır.",
      hayat: "Bahçe boyunca uzanan geniş bir hayat: salon ve mutfak tek parça. Yatak odaları ön tarafta, hayat bahçeye bakar.",
      cumba: "İki katlı, tabanı küçük: dar ya da küçük arsada bahçeyi büyük bırakır. Üst kattaki cumbalı oda yola bakar.",
      avlu: "Kalabalık aile için dört yatak odası. Salon ve mutfak evin bir ucunu boydan boya kaplar, iki cepheden bahçeye açılır.",
    } as Record<string, string>,
    gorselAlt: (ad: string) => `${ad} maketi: mantar arsa parçası üstünde kobalt mavisi ev, sünger ağaçlar ve gri karton yol. Bilgisayarda modellenmiş maket görseli.`,
    bilgi: {
      alan: "Kapalı alan",
      oda: "Oda",
      kat: "Kat",
      olcu: "Dış ölçü",
      olcuNot: "arsaya yerleşim bu ölçüyle hesaplanır",
      taban: "Taban alanı",
      sacak: "Saçak yüksekliği",
      mahya: "Mahya yüksekliği",
      tir: "Nakliye",
      tirDeger: (n: number) => `${n} tır`,
      uretim: "Üretim",
      kurulum: "Kurulum",
      hafta: (s: string) => `${s} hafta`,
      gun: (s: string) => `${s} gün`,
    },
    planBaslik: "Kat planı",
    planNot: "Ölçüler dıştan dışa, oda alanları nettir. Plan örnektir; mimari projede arsanıza göre yeniden çizilir.",
    katSec: "Kat",
    yolTarafi: "yola bakan cephe",
    bahceTarafi: "bahçe cephesi",
    toplamNet: (n: string) => `Odaların toplamı ${n} m² net`,
    sigarBaslik: "Hangi arsaya sığar?",
    sigar: (cephe: string, derinlik: string) =>
      `Yönetmeliğin en az bahçe mesafeleriyle (ön 5, yan 3, arka 3 m) yol cephesi en az ${cephe} m, derinliği en az ${derinlik} m olan arsaya sığar.`,
    cevrilince: (cephe: string, derinlik: string) => `Ev çevrilirse ${cephe} m cepheli, ${derinlik} m derinlikli arsaya da sığar.`,
    alanSarti: (alan: string) => `TAKS 0,30 ve KAKS 0,60 olan bir arsada en az ${alan} m² gerekir (örnek oranlar).`,
    fiyatBaslik: "Fiyat",
    fabrika: "Fabrika teslim",
    kurulu: "Arsanızda kurulu, tahmini",
    dokumLink: "Dökümün tamamı",
    koy: "Arsama koy",
    teklif: "Teklif iste",
    dahilBaslik: "Fiyata dahil olanlar",
    dahil: [
      "Hafif çelik taşıyıcı ve yalıtımlı duvar, döşeme ve çatı panelleri",
      "PVC pencere ve çelik dış kapı",
      "Bina içi elektrik ve sıhhi tesisat",
      "Banyo vitrifiyesi ve armatürler",
      "İç kapılar, zemin kaplaması ve boya",
    ],
    statik: "Statik proje, Türkiye Bina Deprem Yönetmeliği'ne göre her arsa için ayrıca hesaplanır.",
    digerleri: "Diğer modeller",
  },

  // ------------------------------------------------------------------ production
  uretim: {
    baslik: "Fabrikada üretilir, arsanızda birkaç günde kurulur.",
    lead: "Eviniz Eskişehir'deki fabrikamızda, kapalı bir salonda üretilir; yağmur, kar ve şantiye sürprizi görmez. Arsanızda geçen süre birkaç gündür.",
    basGorselAlt: "Maket: mantar arsada beton temelin üstünde duvarları kurulmuş ev, çatının bir yarısı yerinde, öbür yarısı önde yerde bekliyor. Bilgisayarda modellenmiş maket görseli.",
    adimlar: [
      {
        ad: "Ölçü ve panel çizimi",
        metin: "Ruhsat projeniz onaylanınca evi panel panel çizeriz. Her panelin numarası, yeri ve montaj sırası bellidir.",
        sure: "1 hafta",
      },
      {
        ad: "Panel üretimi",
        metin: "Hafif çelik iskelet, yalıtım ve kaplama kapalı salonda birleşir; pencere ve kapı boşlukları açılır, tesisat boruları yerine konur.",
        sure: "3–6 hafta",
        gorsel: "panel",
        alt: "Maket: fabrika tezgâhında pencere boşlukları açılmış duvar panelleri ve yanında numaralı panel istifi. Bilgisayarda modellenmiş maket görseli.",
      },
      {
        ad: "Tıra yükleme",
        metin: "Paneller montaj sırasının tersine yüklenir: ilk takılacak panel en üstte durur. Arsada istif beklemez.",
        sure: "1 gün",
        gorsel: "tir",
        alt: "Maket: römorkunda numaralı panel istifleri taşıyan tır, toprak yolda. Bilgisayarda modellenmiş maket görseli.",
      },
      {
        ad: "Vinçle kurulum",
        metin: "Temel hazırsa vinç panelleri temele indirir; ekip önce duvarları, sonra çatıyı kapatır.",
        sure: "2–8 gün",
        gorsel: "vinc",
        alt: "Maket, yakından: duvarları ve iki üçgen alın duvarı kurulmuş ev, arka çatı yerinde; ön çatı paneli takozların üstünde sırasını bekliyor. Bilgisayarda modellenmiş maket görseli.",
      },
      {
        ad: "Teslim",
        metin: "Elektrik ve su tesisatını sizinle birlikte deneriz; eksik listesini aynı gün kapatırız.",
        sure: "1 gün",
        gorsel: "teslim",
        alt: "Maket: mantar arsa üstünde tamamlanmış kobalt mavisi ev, önünde gri karton yol ve sünger ağaçlar. Bilgisayarda modellenmiş maket görseli.",
      },
    ],
    erisim: {
      baslik: "Tır ve vinç arsanıza ulaşabilir mi?",
      lead: "Kurulum gününün sürprizi çoğu zaman yoldadır. Dört soruya bugünden bakın; cevaplarınız teklif talebinize de eklenir.",
      sorular: [
        { id: "yol", soru: "Arsaya giden yol en az 4 metre genişliğinde mi?", iyi: "evet", secenek: ["evet", "hayir", "bilmiyorum"] },
        { id: "rampa", soru: "Yolda keskin viraj ya da dik bir rampa var mı?", iyi: "hayir", secenek: ["hayir", "evet", "bilmiyorum"] },
        { id: "hat", soru: "Arsanın önünden ya da üstünden elektrik teli geçiyor mu?", iyi: "hayir", secenek: ["hayir", "evet", "bilmiyorum"] },
        { id: "vinc", soru: "Vincin kurulacağı yaklaşık 8 × 8 metrelik düz bir yer var mı?", iyi: "evet", secenek: ["evet", "hayir", "bilmiyorum"] },
      ],
      cevap: { evet: "Evet", hayir: "Hayır", bilmiyorum: "Bilmiyorum" } as Record<string, string>,
      sonuc: {
        bos: "Sorulara cevap verdikçe sonucu burada görürsünüz.",
        iyi: "Standart nakliye ve kurulum yeter.",
        belirsiz: "Bilmediğiniz yerlere keşifte birlikte bakarız.",
        sorun: "Daha küçük araç, ek vinç günü ya da elektrik idaresiyle önceden görüşme gerekebilir; keşifte netleşir, teklife yazılır.",
      },
      not: "4 metre ve 8 × 8 metre örnek değerlerdir; kesin ölçüyü keşifte araç ve vinç tipine göre veririz.",
    },
    kurulumTablo: {
      baslik: "Hangi model kaç günde kurulur?",
      model: "Model",
      tir: "Tır",
      vinc: "Vinç",
      kurulum: "Kurulum",
      not: "Temel hazır ve hava uygunsa. Süreler örnektir.",
    },
    sonCta: "Arsanızda nasıl duracağını görün",
    panelPlaniBaslik: (ad: string) => `${ad} · yola bakan cephe, panel planı`,
    panelPlaniEtiket: (ad: string) => `${ad} evinin yola bakan cephesi, numaralı duvar panellerine bölünmüş çizim.`,
    panelOlcu: (n: number, w: string) => `${n} panel, her biri ${w} m`,
  },

  // ------------------------------------------------------------------ permit guide
  rehber: {
    baslik: "Ruhsat ve imar: önce bunları bilin.",
    lead: "Evinizin arsaya sığması, ruhsat alacağı anlamına gelmez. Kimin neye karar verdiğini, hangi belgeye bakacağınızı ve tapudaki tek kelimenin neyi değiştirdiğini sade bir dille anlatıyoruz.",
    kisaca: "Kısaca",
    ozet: [
      {
        baslik: "Ruhsatı belediye verir.",
        metin: "Belediye sınırı dışında il özel idaresi verir. Prefabrik ya da çelik olması bunu değiştirmez: prefabrik ev de betonarme ev gibi yapı ruhsatı ister.",
        kaynak: "3194 sayılı İmar Kanunu md. 21",
      },
      {
        baslik: "Bağlayan, imar durumu belgesidir.",
        metin: "Bu sitedeki hesap ve vaziyet planı taslağı bir ön kontroldür; bu çizimden hak doğmaz. Belediyeden alacağınız imar durumu belgesi ne diyorsa o geçerlidir.",
        kaynak: "",
      },
      {
        baslik: "Tapuda “tarla” yazıyorsa kalıcı konut ruhsatı alınamaz.",
        metin: "Tarım arazisinde izinsiz yapılan yapıya 20 Haziran 2026'dan beri elektrik, su ve doğalgaz aboneliği de bağlanmıyor.",
        kaynak: "5403 sayılı Kanun md. 21; 7584 sayılı Kanun md. 25",
      },
    ],
    tapuBaslik: "Tapunuzda ne yazıyor?",
    tapuLead: "Tapunun “Niteliği” satırı, hangi yoldan gideceğinizi belirler.",
    tapu: [
      {
        id: "arsa",
        baslik: "Arsa, imar planı içinde",
        metin: "Ruhsat, imar planındaki değerlere uyan projeye verilir. Sıra şöyle işler:",
        adimlar: ["İmar durumu belgesi", "Mimari ve statik proje", "Yapı ruhsatı", "Üretim ve kurulum", "Yapı kullanma izni (iskân)"],
        kaynak: "3194 md. 21; Planlı Alanlar İmar Yönetmeliği",
      },
      {
        id: "koy",
        baslik: "Köyün yerleşik alanı",
        metin:
          "Belediye ve mücavir alan sınırı dışında, köyün yerleşik alanında ve civarında konut için yapı ruhsatı aranmaz. Projenin valilikçe onaylanması, muhtarlığa bildirilmesi ve fen ve sağlık kurallarına uyması zorunludur.",
        adimlar: [],
        kaynak: "3194 md. 27",
      },
      {
        id: "plansiz",
        baslik: "İmar planı olmayan alan",
        metin:
          "Köy yerleşik alanı dışında, plan olmayan yerde bir ailenin oturacağı ev için sınırlar dardır: inşaat alanı arsanın en çok yüzde 5'i ve toplam en çok 250 m², saçak yüksekliği en çok 7,50 m ve iki kat, yola 5, komşu parsellere 3 metre. Arsa tarım arazisiyse ayrıca tarım dışı kullanım izni gerekir.",
        adimlar: [],
        kaynak: "Plansız Alanlar İmar Yönetmeliği md. 62–63",
      },
      {
        id: "tarla",
        baslik: "Tarla, tarım arazisi",
        metin:
          "Tarım arazisi izinsiz tarım dışı kullanılamaz. İzinsiz yapıya metrekare başına idari para cezası uygulanır, yıkılmazsa katlanır. 20 Haziran 2026'dan beri bu yapılara elektrik, su ve doğalgaz aboneliği bağlanmaz. Tarımsal amaçlı yapı izni ayrı bir yoldur; konut ruhsatı yerine geçmez.",
        adimlar: [],
        kaynak: "5403 sayılı Kanun md. 13, 14, 21; 7584 sayılı Kanun md. 25",
      },
      {
        id: "hobi",
        baslik: "Hisseli “hobi bahçesi”",
        metin:
          "Mevzuatta “hobi bahçesi” diye bir imar durumu yok. Bu adla satılan yerlerin çoğu tapuda tarladır; tarla için yazılanlar aynen geçerlidir. Tarım arazisini fiilen bölerek satana hapis ve para cezası da öngörülüyor.",
        adimlar: [],
        kaynak: "5403 sayılı Kanun md. 21",
      },
    ],
    belgeBaslik: "İmar durumu belgesi nasıl okunur?",
    belgeLead: "Belge belediyeden belediyeye farklı görünür; aradığınız satırlar hemen hep aynıdır. Hesaptaki her kutunun karşılığı burada.",
    belgeOrnek: "ÖRNEK — gerçek belge değildir",
    belgeAd: "İMAR DURUMU",
    belgeSatirlar: [
      { etiket: "Ada / Parsel", deger: "412 / 7", not: "Tapunuzla aynı olmalı." },
      { etiket: "Plan kullanımı", deger: "Konut alanı", not: "Konut yapılabilecek alan." },
      { etiket: "Nizam / Kat", deger: "A-2", not: "Ayrık nizam, iki kat." },
      { etiket: "TAKS", deger: "0,30", not: "Evin oturduğu alan, arsanın en çok yüzde 30'u.", alan: "taks" },
      { etiket: "KAKS (Emsal)", deger: "0,60", not: "Bütün katların toplamı, arsanın en çok yüzde 60'ı.", alan: "kaks" },
      { etiket: "Hmax", deger: "6,50 m", not: "Saçak seviyesine kadar en fazla yükseklik.", alan: "hmax" },
      { etiket: "Bahçe mesafeleri", deger: "Ön 5 · Yan 3 · Arka 3 m", not: "Evin parsel sınırına en fazla ne kadar yaklaşabileceği.", alan: "bahce" },
      { etiket: "Plan notları", deger: "…", not: "Çatı eğimi, otopark gibi özel kurallar burada yazar." },
    ],
    kimBaslik: "Kim, ne yapar?",
    kim: [
      { kim: "Siz", is: "Tapu ve imar durumu belgesi; belediyeye başvuru." },
      { kim: "Mimarınız", is: "Mimari ve statik proje; ruhsat dosyası." },
      { kim: "Yapı denetim", is: "Projeye uygun yapıldığının denetimi." },
      { kim: "Belediye", is: "Yapı ruhsatı ve yapı kullanma izni (iskân)." },
      { kim: "Vaziyet", is: "Kat planı, ölçüler, statik hesap verileri; üretim, nakliye ve kurulum." },
    ],
    duymazBaslik: "Bizden duymayacağınız cümleler",
    duymazLead: "Satışta sık duyulur; hiçbiri tek başına doğru değildir.",
    duymaz: [
      { cumle: "“Prefabrik eve ruhsat gerekmez.”", neden: "Gerekir. Prefabrik ya da çelik olması yapı ruhsatı şartını değiştirmez." },
      { cumle: "“Her araziye kurulur.”", neden: "Kurulur ama kalıcı konut olarak kullanılamayabilir; arsanın niteliği ve imar durumu belirler." },
      { cumle: "“Tarlaya ev yapılır, muhtardan izin yeter.”", neden: "Tarlada kalıcı konut ruhsatı alınamaz; muhtar izni ruhsat yerine geçmez." },
      { cumle: "“Hobi bahçesi modeli.”", neden: "Böyle bir imar durumu yok; o arazi çoğu zaman tarladır." },
      { cumle: "“Depreme dayanıklı, yıkılmaz.”", neden: "Hiçbir yapı için mutlak söz verilmez. Bizim sözümüz: statik proje her arsa için yönetmeliğe göre hesaplanır." },
    ],
    kaynakBaslik: "Kaynaklar",
    kaynaklar: [
      { ad: "3194 sayılı İmar Kanunu (md. 21, 27, 32, 42)", href: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=3194&MevzuatTur=1&MevzuatTertip=5" },
      { ad: "Planlı Alanlar İmar Yönetmeliği (md. 4, 23, 42)", href: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=23722&MevzuatTur=7&MevzuatTertip=5" },
      { ad: "Plansız Alanlar İmar Yönetmeliği (md. 62–63)", href: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=4882&MevzuatTur=7&MevzuatTertip=5" },
      { ad: "5403 sayılı Toprak Koruma ve Arazi Kullanımı Kanunu (md. 13, 14, 21)", href: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5403&MevzuatTur=1&MevzuatTertip=5" },
      { ad: "7584 sayılı Kanun md. 25: 5403 md. 21'e eklenen abonelik yasağı, yürürlük 20.06.2026", href: "" },
    ],
    uyari: "Bu sayfa bilgilendirme içindir, hukuki görüş değildir. Mevzuat metinlerine son bakış: 9 Ekim 2026. Arsanıza özel karar için belediyenize, bir avukata ya da mimarınıza danışın.",
    cta: "Arsanızla birlikte bakın",
  },

  // ------------------------------------------------------------------ quote
  teklif: {
    baslik: "Teklif özeti",
    lead: "Arsanız, değerleriniz ve seçtiğiniz model aşağıda. Önce sonucu görün; teklif isterseniz kısa formu doldurun.",
    bos: "Henüz bir arsa girmediniz; örnek arsayla gösteriyoruz.",
    duzenle: "Hesaba dön, değiştir",
    arsaBaslik: "Arsanız",
    imarBaslik: "İmar değerleri",
    modelBaslik: "Model ve yerleşim",
    sonucBaslik: "Sonuç",
    maliyetBaslik: "Tahmini maliyet",
    alan: "Yüzölçümü",
    olcu: "Ölçü",
    nitelik: "Tapuda yazan",
    yol: "Yol",
    taks: "TAKS",
    kaks: "KAKS",
    bahce: "Bahçe mesafeleri",
    hmax: "Yükseklik sınırı",
    model: "Model",
    disOlcu: "Dış ölçü",
    donus: "Yerleşim",
    donusDeger: (rot: number) => (rot === 0 ? "girişi yola bakıyor" : rot === 180 ? "girişi bahçeye bakıyor" : "yola yan duruyor"),
    kalanBahce: "Kalan bahçe",
    salon: "Salon",
    sigiyor: "Sığıyor",
    sigmiyor: "Bu haliyle sığmıyor",
    sigmiyorNot: "Teklifi yine isteyebilirsiniz; olası ihlallere keşifte birlikte bakarız.",
    taslak: "Vaziyet planı taslağını aç",
    taslakNot: "Yazdırıp mimarınıza ya da belediyeye götürebileceğiniz tek sayfa.",
    kopyala: "Bağlantıyı kopyala",
    kopyalandi: "Bağlantı kopyalandı",
    kopyalaNot: "Eşinize ya da mimarınıza gönderin; bağlantı aynı arsayla açılır.",
    form: {
      baslik: "Teklif için birkaç bilgi",
      lead: "Satış ekibi sizi aradığında bu sayfayı ve vaziyet planı taslağını önünde görür.",
      ad: "Adınız soyadınız",
      tel: "Telefon",
      telIpucu: "05xx xxx xx xx",
      ilce: "İlçe, köy ya da mahalle",
      istege: "isteğe bağlı",
      erisim: "Arsanıza ulaşım",
      belge: "İmar durumu belgesi",
      belgeSecenek: ["Elimde", "Henüz almadım", "Bilmiyorum"],
      zaman: "Ne zaman başlamak istersiniz?",
      zamanSecenek: ["Ruhsat çıkar çıkmaz", "Bu yıl içinde", "Gelecek yıl", "Henüz bilmiyorum"],
      donus: "Size nasıl dönelim?",
      donusSecenek: ["Telefonla", "WhatsApp'tan"],
      saat: "Uygun saat",
      saatSecenek: ["Sabah", "Öğleden sonra", "Akşam"],
      not: "Eklemek istedikleriniz",
      gonder: "Talebi hazırla",
      demo: "Bu bir tasarım örneği; form hiçbir yere gönderilmez.",
      hataAd: "Adınızı ve soyadınızı yazın.",
      hataTel: "Telefonu 05 ile başlayan 11 haneyle yazın.",
      hataOzet: (n: number) => `${n} alanı düzeltin.`,
    },
    hazir: {
      baslik: "Talebiniz hazır",
      metin: "Gerçek firmada bu talep satış ekibine düşer ve seçtiğiniz saatte aranırsınız. Bu örnekte hiçbir yere gitmedi.",
      duzenle: "Düzenle",
    },
  },

  // ------------------------------------------------------------------ printable site plan
  pafta: {
    baslik: "Vaziyet planı taslağı",
    damga: "Ön kontrol",
    damgaAlt: "ruhsat, ölçüm ya da hukuki görüş değildir",
    tarih: "Tarih",
    geri: "Teklif özetine dön",
    yazdir: "Yazdır ya da PDF olarak kaydet",
    olcek: "ölçeksiz; ölçüler metre",
    arsa: "Arsa",
    imar: "İmar değerleri (girilen)",
    model: "Model ve yerleşim",
    kullanim: "Kullanım",
    hak: "hak",
    kullanilan: "kullanılan",
    mesafeler: "Evin sınırlara uzaklığı",
    on: "ön (yol)",
    arka: "arka",
    sol: "sol",
    sag: "sağ",
    maliyet: "Tahmini maliyet",
    notlar: [
      "Bu bir ön kontroldür; ruhsat, ölçüm ya da hukuki görüş değildir.",
      "Bu çizim taslaktır; hak doğurmaz ve mimari projenin yerine geçmez. Bağlayıcı olan, belediyenin vereceği imar durumu belgesidir.",
      "Evin arsadaki kesin yerini mimarınız ve harita mühendisiniz belirler.",
      "Fiyatlar tahminidir ve örnektir; yazılı teklifte kalem kalem verilir.",
    ],
    kavram: "Vaziyet kurgusal bir markadır; bu sayfa rasitburucu.com konsept çalışmasının örneğidir.",
    ref: "Bu taslağın bağlantısı",
  },

  // ------------------------------------------------------------------ not found
  notFound: {
    baslik: "Bu parselde bir şey yok.",
    metin: "Aradığınız sayfa taşınmış ya da hiç olmamış. Evinizi koyabileceğiniz arsa ana sayfada duruyor.",
    ana: "Ana sayfaya dön",
    modeller: "Modellere bak",
  },

  // ------------------------------------------------------------------ footer
  footer: {
    marka: "Marka",
    ziyaret: "Ziyaret",
    iletisim: "İletişim",
    sayfalar: "Sayfalar",
    fabrika: "Fabrika: Eskişehir",
    adres: ["Fabrika ve satış ofisi", "Eskişehir"],
    adresNot: "kurgusal tesis, adres yok",
    saat: "Hafta içi 09.00–18.00, cumartesi 10.00–14.00",
    randevu: "Fabrikayı randevuyla gezebilirsiniz.",
    note: "Vaziyet kurgusal bir markadır; bu site rasitburucu.com'un konsept çalışmasıdır. Modeller, fiyatlar, süreler ve iletişim bilgileri örnektir. Hesaplar tahminidir; ruhsat, ölçüm ya da hukuki görüş değildir.",
    kunye: {
      title: "Proje künyesi",
      design: "Tasarım ve geliştirme",
      designBy: "Raşit Burucu",
      designHref: "https://rasitburucu.com",
      three: "3B ve render",
      threeText:
        "Maket görselleri Blender'da koddan modellenip render edildi; ana sayfadaki maket tarayıcıda Three.js ile çiziliyor. İndirilmiş model, doku ya da fotoğraf yok.",
      photos: "Fotoğraflar",
      photosText: "Kullanılmadı.",
      fonts: "Yazı karakterleri",
      fontsText: "Gabarito ve Host Grotesk, SIL Open Font License 1.1.",
      year: "Yıl",
      yearText: "2026",
    },
    copyright: "© 2026 Vaziyet (kurgusal marka) · Konsept: rasitburucu.com",
  },
};

export const sayfalar: NavLink[] = [{ label: tr.nav.home, href: `${BASE}/` }, ...tr.nav.items];
export const yonAd = (y: Yon) => YON_AD[y];
export const nitelikAd = (n: Nitelik) => NITELIK[n];
