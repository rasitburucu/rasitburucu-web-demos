// Kademe sayfaları (/revak/egitim/[kademe]/). Bütün metinler Raşit onayı bekliyor (2026-10-04).
// Saatler, ders dağılımı ve dil saatleri örnektir; sayfada "örnek" mührüyle basılır.
// Ulusal programın ders adları genel tutuldu; çizelge resmî bir çizelge iddiası taşımaz.

import type { Kademe } from "@/lib/revak/store";
import type { ImageKey } from "./images";
import { tr } from "./tr";

export type LessonRow = { name: string; hours: (number | null)[]; ek?: boolean };
export type DayStop = { time: string; title: string; text: string };

export type KademeCopy = {
  slug: Kademe;
  /** 0 = sabah, 1 = akşam: the light of the walk at this level */
  sun: number;
  hour: string;
  hourName: string;
  metaTitle: string;
  lede: string;
  setupTitle: string;
  setup: { label: string; value: string }[];
  lang: { title: string; intro: string; head: string[]; rows: string[][]; note: string };
  lessons: { title: string; intro: string; cols: string[]; colLabel: string; rows: LessonRow[]; note: string };
  hours: { title: string; rows: { label: string; time: string }[] };
  day: { title: string; intro: string; stops: DayStop[] };
  guide: { title: string; intro: string; steps: { when: string; title: string; text: string }[] };
  faq: { q: string; a: string }[];
  closing: { title: string; text: string };
  image: ImageKey;
};

const lv = tr.levels.items;
const ilkDay = tr.kampus.day.ilkokul.map(({ time, title, text }) => ({ time, title, text }));
const liseDay = tr.kampus.day.lise.map(({ time, title, text }) => ({ time, title, text }));

export const kademeCommon = {
  crumb: "Eğitim",
  levelOf: (i: number) => `${["I", "II", "III", "IV"][i]}. kademe`,
  hourLabel: "Revakta ışık",
  ekLabel: "Revak'ın eklediği ders",
  lesson: "Ders",
  none: "yok",
  totalLabel: "Haftada toplam",
  hoursUnit: "saat",
  colPick: "Sınıf seçin",
  faqTitle: "Bu kademeye özel sorular",
  apply: "Bu kademe için ön kayıt",
  tour: "Bu kademeyi turda görün",
  prev: "Önceki kademe",
  next: "Sonraki kademe",
  allLevels: "Nasıl öğretir, nasıl ölçeriz",
  sunLabel: "Günün saatleri, güneşin yolunda",
};

export const kademeler: Record<Kademe, KademeCopy> = {
  anaokulu: {
    slug: "anaokulu",
    sun: 0,
    hour: "08.10",
    hourName: "sabah",
    image: lv.anaokulu.image,
    metaTitle: "Anaokulu, 3-5 yaş | Revak Okulları",
    lede: "Üç yaşında okul, günün bir düzeni olması demek. Her sabah aynı saatte, aynı yüzlerle başlar; çocuk neyin ne zaman olacağını bildiği için rahatlar. Burada okuma yazma değil, dinlemeyi, sırasını beklemeyi ve merak ettiğini sormayı öğrenir.",
    setupTitle: "Bir grup nasıl kurulur",
    setup: [
      { label: "Grup", value: "14 çocuk, yaşa göre ayrı gruplar" },
      { label: "Öğretmen", value: "İki öğretmen; biri gün boyu İngilizce konuşur" },
      { label: "Bina", value: "Kendi bahçesi olan ayrı bir bina" },
      { label: "Danışman", value: "Grup öğretmeni, ailenin de danışmanıdır" },
    ],
    lang: {
      title: "İngilizce, günün içinde",
      intro: "Anaokulunda İngilizce bir ders değil, bir öğretmenin konuştuğu dil. Çocuk onu şarkıda, oyunda, yemekte duyar.",
      head: ["Yaş grubu", "İngilizce", "Nasıl", "Okuma yazma"],
      rows: [
        ["3 yaş", "Haftada 4 saat", "Şarkı, oyun, günlük işler", "Yok"],
        ["4 yaş", "Haftada 5 saat", "Hikâye, rol oyunu", "Yok"],
        ["5 yaş", "Haftada 6 saat", "Hikâye, ilk sesler, kısa sunum", "Kalem tutma, sesler"],
      ],
      note: "İkinci yabancı dil 5. sınıfta başlar. Anaokulunda Türkçe dil çalışması İngilizceden daha uzun tutulur.",
    },
    lessons: {
      title: "Haftanın ritmi",
      intro: "Anaokulunda ders cetveli yok; haftanın saatleri etkinlik alanlarına bölünür. Bir gün 08.30'da başlar, 15.30'da biter.",
      cols: ["3 yaş", "4 yaş", "5 yaş"],
      colLabel: "Yaş grubu",
      rows: [
        { name: "Bahçe ve açık hava", hours: [8, 7, 6] },
        { name: "Serbest oyun ve atölye köşeleri", hours: [7, 6, 5] },
        { name: "Türkçe: dil, hikâye, sohbet", hours: [3, 4, 5] },
        { name: "İngilizce", hours: [4, 5, 6], ek: true },
        { name: "Müzik ve hareket", hours: [3, 3, 2] },
        { name: "Sanat atölyesi", hours: [3, 3, 3] },
        { name: "Yüzme", hours: [1, 1, 2], ek: true },
        { name: "Sayılar ve doğa gözlemi", hours: [1, 2, 3] },
        { name: "Yemek, dinlenme, öz bakım", hours: [5, 4, 3] },
      ],
      note: "3 yaş grubunda öğleden sonra bir saat dinlenme var; uyumak zorunlu değil.",
    },
    hours: {
      title: "Günün saatleri",
      rows: [
        { label: "Kapı açılır", time: "08.00" },
        { label: "Servisler kampüste", time: "08.10" },
        { label: "Sabah halkası", time: "08.40" },
        { label: "Öğle yemeği", time: "11.45" },
        { label: "Gün biter, veliye teslim", time: "15.30" },
        { label: "Servis kalkışı", time: "15.45" },
        { label: "Uzatılmış gün (isteğe bağlı)", time: "17.30'a kadar" },
      ],
    },
    day: {
      title: "Bir gün Revak'ta",
      intro: "4 yaş grubundan bir gün. Saatler aynı kalır, etkinlikler mevsime göre değişir.",
      stops: [
        { time: "08.10", title: "Kapıda, adıyla", text: "Öğretmen her çocuğu kapıda adıyla karşılar; montunu kendi askısına asar." },
        { time: "08.40", title: "Sabah halkası", text: "Hava nasıl, bugün kim yok, ne yapacağız. Bir çocuk evden getirdiği bir şeyi anlatır." },
        { time: "09.30", title: "Bahçe", text: "Kum havuzu, toprak, tırmanma. Yağmurda da çıkılır; çizmeler okulda durur." },
        { time: "10.30", title: "Atölye köşeleri", text: "Bloklar, boya, mutfak oyunu. Çocuk köşesini seçer, öğretmen gözlem notu alır." },
        { time: "11.45", title: "Öğle yemeği", text: "Öğretmenlerle aynı masada. Tabağını kendi alır, bitirince kendi bırakır." },
        { time: "13.00", title: "Hikâye ve dinlenme", text: "Işıklar kısılır, İngilizce bir hikâye okunur; isteyen uyur." },
        { time: "14.15", title: "Müzik ve hareket", text: "Ritim çalgıları, dans, sırayla şarkı söyleme." },
        { time: "15.30", title: "Eve dönüş", text: "Veliye ya da servis görevlisine elden teslim; günün notu veli uygulamasında." },
      ],
    },
    guide: {
      title: "Uyum, acele etmeden",
      intro: "Anaokulunda rehberliğin ilk işi uyum. Çocuk okula alışana kadar veli de bir süre okulun parçasıdır.",
      steps: [
        { when: "Ağustos sonu", title: "Tanışma saati", text: "Çocuk, velisiyle birlikte sınıfını ve iki öğretmenini bir saatliğine görür." },
        { when: "İlk hafta", title: "Kısa günler", text: "İlk gün bir saat, her gün biraz daha uzun. Veli ilk günlerde bahçedeki bekleme odasında kalabilir." },
        { when: "İlk ay", title: "Gözlem notu", text: "Öğretmen çocuğun uyumunu yazılı bir notla anlatır; ardından veliyle yarım saat görüşür." },
        { when: "5 yaş grubu", title: "İlkokula hazırlık", text: "İlkokul binasına küçük ziyaretler, birinci sınıf öğretmenleriyle tanışma, bahar döneminde bir gün ilkokulda." },
      ],
    },
    faq: [
      { q: "Tuvalet eğitimi şart mı?", a: "3 yaş grubunda şart değil. Öğretmenlerimiz evde kullandığınız yöntemi öğrenip aynısını uygular; yedek kıyafet sınıfta durur." },
      { q: "Okuma yazma öğretiyor musunuz?", a: "Hayır. Okuma yazma ilkokulda başlar. 5 yaş grubunda sesleri, kalem tutmayı ve kitapla vakit geçirmeyi çalışırız." },
      { q: "Ara tatillerde anaokulu kapalı mı?", a: "Anaokulu ara tatillerde isteğe bağlı oyun haftasıyla açık kalır. Tarihler Almanak'ta, anaokulu filtresiyle görünür." },
      { q: "Çocuğum hastalanırsa?", a: "Ateşi 38 derecenin üstündeyse sizi ararız. Okula dönmek için 24 saat ateşsiz ve ilaçsız kalması gerekir. Ayrıntılar Güvende sayfasında." },
    ],
    closing: { title: "Anaokulunu bir sabah görün.", text: "Turu 08.10'a planlarsanız kapıdaki karşılamayı da görürsünüz." },
  },

  ilkokul: {
    slug: "ilkokul",
    sun: 0.34,
    hour: "12.00",
    hourName: "öğle",
    image: lv.ilkokul.image,
    metaTitle: "İlkokul, 1-4. sınıf | Revak Okulları",
    lede: "İlkokul, çocuğun okumayı öğrendiği, sonra okuduğuyla öğrenmeye geçtiği dört yıl. Revak'ta her gün yirmi dakikalık okumayla başlar. Ödev kısa tutulur; asıl iş sınıfta yapılır. Sınıf öğretmeni dört yıl boyunca değişmez.",
    setupTitle: "Sınıf düzeni",
    setup: [
      { label: "Sınıf mevcudu", value: "En fazla 18 öğrenci" },
      { label: "Sınıf öğretmeni", value: "1. sınıftan 4. sınıfa aynı öğretmen" },
      { label: "İngilizce", value: "Dört kişilik konuşma grupları" },
      { label: "Danışman", value: "Sınıf öğretmeni; rehberlik birimiyle birlikte" },
    ],
    lang: {
      title: "Haftada on saat İngilizce",
      intro: "İngilizce saatlerinin yarısı ana dili İngilizce olan öğretmenle, küçük gruplarda konuşmaya ayrılır.",
      head: ["Sınıf", "İngilizce", "Ağırlık", "Gruplar"],
      rows: [
        ["1. sınıf", "10 saat", "Dinleme, şarkı, hikâye", "Tek grup"],
        ["2. sınıf", "10 saat", "Okumaya başlama", "Tek grup"],
        ["3. sınıf", "10 saat", "Yazma ve kısa sunum", "İki seviye grubu"],
        ["4. sınıf", "10 saat", "Küçük proje, okuma kulübü", "İki seviye grubu"],
      ],
      note: "İkinci yabancı dil 5. sınıfta başlar. İngilizcesi olmayan öğrenci için ilk dönem haftada iki saat destek dersi var.",
    },
    lessons: {
      title: "Ders cetveli",
      intro: "Ulusal programın dersleri ve Revak'ın ekledikleri, haftada 40 ders saati. Bir ders 40 dakika.",
      cols: ["1", "2", "3", "4"],
      colLabel: "Sınıf",
      rows: [
        { name: "Türkçe", hours: [10, 10, 8, 8] },
        { name: "Matematik", hours: [5, 5, 5, 5] },
        { name: "Hayat bilgisi", hours: [4, 4, 3, null] },
        { name: "Fen bilimleri", hours: [null, null, 3, 3] },
        { name: "Sosyal bilgiler", hours: [null, null, null, 3] },
        { name: "Din kültürü ve ahlak bilgisi", hours: [null, null, null, 2] },
        { name: "İngilizce", hours: [10, 10, 10, 10], ek: true },
        { name: "Görsel sanatlar", hours: [1, 1, 1, 1] },
        { name: "Müzik ve çalgı", hours: [2, 2, 2, 2], ek: true },
        { name: "Oyun, beden eğitimi", hours: [5, 5, 4, 2] },
        { name: "Yüzme", hours: [2, 2, 2, 2], ek: true },
        { name: "Atölye: seramik, ahşap, robotik", hours: [1, 1, 2, 2], ek: true },
      ],
      note: "Her sabah 08.40'taki yirmi dakikalık okuma saati bu çizelgenin dışındadır.",
    },
    hours: {
      title: "Günün saatleri",
      rows: [
        { label: "Kapı açılır", time: "07.50" },
        { label: "Servisler kampüste", time: "08.10" },
        { label: "Okuma saati, ilk ders", time: "08.40" },
        { label: "Öğle yemeği ve bahçe", time: "12.00" },
        { label: "Son ders biter", time: "15.30" },
        { label: "Kulüp ve etüt", time: "15.40-16.30" },
        { label: "Servis kalkışı", time: "16.30 ve 17.45" },
      ],
    },
    day: {
      title: "Bir gün Revak'ta",
      intro: "3. sınıftan bir salı. Pazartesi ve perşembe yüzme, çarşamba atölye günü.",
      stops: ilkDay,
    },
    guide: {
      title: "Okumaya geçiş ve arkadaşlık",
      intro: "İlkokulda rehberlik iki şeyi izler: okumanın oturması ve sınıfta herkesin bir yeri olması. Psikolojik danışman her sınıfa dönemde iki ders girer.",
      steps: [
        { when: "1. sınıf, ilk dönem", title: "Sesten harfe", text: "Okuma her hafta izlenir; takılan çocuk için aynı hafta küçük grup çalışması başlar, veliye kısa bir not gider." },
        { when: "1. sınıf, bahar", title: "Okuma günlüğü", text: "Çocuk okuduğu her kitabı bir satırla günlüğe yazar. Kütüphane kartını kendi alır." },
        { when: "2. ve 3. sınıf", title: "Okuduğunu anlatmak", text: "Haftada bir, okuduğunu sınıfa anlatır. Arkadaşlık, sıra beklemek ve hayır demek rehberlik derslerinde konuşulur." },
        { when: "4. sınıf", title: "Ortaokula hazırlık", text: "Ders başına öğretmen düzenine bahar döneminde alışılır; ortaokul binasında bir gün geçirilir." },
      ],
    },
    faq: [
      { q: "Sınıflar yıl içinde karışıyor mu?", a: "Hayır. Sınıf ve sınıf öğretmeni dört yıl aynı kalır. Bir değişiklik gerekirse rehberlik biriminin önerisiyle, veliyle konuşularak yapılır." },
      { q: "Ne kadar ödev var?", a: "1. ve 2. sınıfta günde en fazla 20 dakika, 3. ve 4. sınıfta 30 dakika. Hafta sonu ödevi verilmez." },
      { q: "İngilizcesi hiç olmayan çocuk geride kalır mı?", a: "İlk dönem haftada iki saat destek dersi alır ve konuşma grubunda kendi seviyesindeki çocuklarla çalışır. Çoğu çocuk ikinci dönemde gruba katılır." },
      { q: "Telefon getirebilir mi?", a: "İlkokulda telefon okula getirilmez. Gün içinde size ulaşmak gerekirse sınıf öğretmeni ya da sekreterlik arar." },
    ],
    closing: { title: "Bir ilkokul gününü yerinde görün.", text: "Tur sırasında bir sınıfın okuma saatine kapıdan bakabilirsiniz." },
  },

  ortaokul: {
    slug: "ortaokul",
    sun: 0.67,
    hour: "15.40",
    hourName: "ikindi",
    image: lv.ortaokul.image,
    metaTitle: "Ortaokul, 5-8. sınıf | Revak Okulları",
    lede: "Ortaokul, çocuğun kendi başına çalışmayı öğrendiği yıllar. Her derse ayrı öğretmen girer, ama her öğrencinin onu haftada bir dinleyen bir danışmanı vardır. İkinci yabancı dil 5. sınıfta başlar; her hafta küçük bir projeyi sınıfa anlatmak zamanla alışkanlık olur.",
    setupTitle: "Sınıf düzeni",
    setup: [
      { label: "Sınıf mevcudu", value: "En fazla 18 öğrenci" },
      { label: "Danışman", value: "Her öğrenciye bir öğretmen, haftada bir görüşme" },
      { label: "Laboratuvar", value: "Haftada en az bir fen dersi laboratuvarda" },
      { label: "Sunum", value: "Her öğrenci, her hafta bir kez" },
    ],
    lang: {
      title: "İki dil, seviye gruplarında",
      intro: "5. sınıfta öğrenci Almanca ile İspanyolca arasında seçim yapar. İngilizce dersleri üç seviye grubunda işlenir.",
      head: ["Sınıf", "İngilizce", "İkinci dil", "Gruplar"],
      rows: [
        ["5. sınıf", "8 saat", "4 saat", "Üç seviye"],
        ["6. sınıf", "8 saat", "4 saat", "Üç seviye"],
        ["7. sınıf", "6 saat", "4 saat", "Üç seviye"],
        ["8. sınıf", "6 saat", "4 saat", "İki seviye, uluslararası dil sınavına isteğe bağlı hazırlık"],
      ],
      note: "Seviye grupları dönem başında yeniden belirlenir; bir öğrenci yıl içinde grup değiştirebilir.",
    },
    lessons: {
      title: "Ders cetveli",
      intro: "Haftada 40 ders saati. Proje ve sunum dersi 5. sınıfta bir saatle başlar, 7. sınıfta üç saate çıkar.",
      cols: ["5", "6", "7", "8"],
      colLabel: "Sınıf",
      rows: [
        { name: "Türkçe", hours: [6, 6, 5, 5] },
        { name: "Matematik", hours: [5, 5, 5, 6] },
        { name: "Fen bilimleri", hours: [4, 4, 5, 5] },
        { name: "Sosyal bilgiler", hours: [3, 3, 3, null] },
        { name: "İnkılap tarihi ve Atatürkçülük", hours: [null, null, null, 2] },
        { name: "Din kültürü ve ahlak bilgisi", hours: [2, 2, 2, 2] },
        { name: "İngilizce", hours: [8, 8, 6, 6], ek: true },
        { name: "İkinci yabancı dil", hours: [4, 4, 4, 4], ek: true },
        { name: "Bilişim ve kodlama", hours: [2, 2, 2, 2] },
        { name: "Müzik, görsel sanatlar", hours: [2, 2, 2, 2] },
        { name: "Beden eğitimi ve yüzme", hours: [2, 2, 2, 2] },
        { name: "Proje ve sunum", hours: [1, 1, 3, 3], ek: true },
        { name: "Rehberlik saati", hours: [1, 1, 1, 1] },
      ],
      note: "8. sınıfta merkezî sınav için haftada üç akşam etüt var; çizelgeye dahil değildir.",
    },
    hours: {
      title: "Günün saatleri",
      rows: [
        { label: "Kapı açılır", time: "07.50" },
        { label: "İlk ders", time: "08.40" },
        { label: "Öğle yemeği", time: "12.20" },
        { label: "Son ders biter", time: "15.30" },
        { label: "Kulüp ve takımlar", time: "15.40-17.00" },
        { label: "Etüt", time: "15.40-17.30" },
        { label: "Servis kalkışı", time: "16.30 ve 17.45" },
      ],
    },
    day: {
      title: "Bir gün Revak'ta",
      intro: "6. sınıftan bir çarşamba: laboratuvar ve sunum günü.",
      stops: [
        { time: "08.40", title: "Matematik", text: "Haftanın sorusu tahtada: çözüm değil, iki farklı yol aranır." },
        { time: "09.40", title: "Laboratuvar", text: "Deney önce yanlış kurulabilir. Düzeltme notu deftere yazılır, silinmez." },
        { time: "11.00", title: "İkinci dil", text: "Almanca ya da İspanyolca; on iki kişilik gruplarda." },
        { time: "12.20", title: "Öğle ve bahçe", text: "Yemekten sonra bahçe ya da kütüphanenin sessiz katı." },
        { time: "13.30", title: "Proje sunumu", text: "Üç öğrenci haftanın projesini anlatır; sınıf her birine bir soru sorar." },
        { time: "14.30", title: "Bilişim atölyesi", text: "Kodlama, sensörler, küçük robotlar. Robotik takımının seçmeleri burada başlar." },
        { time: "15.40", title: "Takım ya da kulüp", text: "Basketbol, münazara, orkestra. Ya da etüt: danışman haftanın planına bakar." },
        { time: "17.45", title: "Etüt servisi", text: "Etütte kalan öğrenciler ikinci servisle evine döner." },
      ],
    },
    guide: {
      title: "Kendi başına çalışmak, liseyi seçmek",
      intro: "Ortaokulda danışman öğrencinin çalışma planını onunla birlikte kurar. 7. sınıftan itibaren lise seçimi konuşulur; veli her adımda masadadır.",
      steps: [
        { when: "5. sınıf", title: "Yeni düzen", text: "Ders başına öğretmen, ödev ajandası ve haftalık çalışma planı. İlk ay danışmanla haftada iki görüşme." },
        { when: "6. sınıf", title: "İlgi alanları", text: "Kısa bir ilgi envanteri, kulüp seçimi ve dönemde bir meslek söyleşisi." },
        { when: "7. sınıf", title: "Lise türlerini tanımak", text: "Lise türleri, merkezî sınav ve okul içi geçiş üzerine veli semineri. İlk deneme sınavları." },
        { when: "8. sınıf", title: "Tercih", text: "Danışman, veli ve öğrenci üç kez birlikte oturur. Revak lisesine geçiş ya da başka bir lise: karar ailenindir." },
      ],
    },
    faq: [
      { q: "Merkezî sınava hazırlık var mı?", a: "8. sınıfta haftada üç akşam etüt ve yılda altı deneme sınavı var. Sonuçlar sıralama olarak değil, konu konu geri bildirim olarak öğrenciye döner." },
      { q: "İkinci dili nasıl seçiyoruz?", a: "4. sınıfın baharında iki dilin tanıtım dersine katılır, sonra öğrenci ve veli birlikte seçer. 6. sınıfın sonuna kadar bir kez değiştirilebilir." },
      { q: "Telefon kullanabilir mi?", a: "Okul saatinde telefon dolapta durur, teneffüste de kullanılmaz. Ders bittiğinde alınır." },
      { q: "Ne kadar ödev var?", a: "Günde en fazla 45 dakika. Proje haftalarında ödev verilmez, proje evde bitirilmez; okulda tamamlanır." },
    ],
    closing: { title: "Bir ortaokul dersine kapıdan bakın.", text: "Yerinde turda laboratuvarı ve bir sunum dersini görmek isteyip istemediğinizi sorarız." },
  },

  lise: {
    slug: "lise",
    sun: 1,
    hour: "18.30",
    hourName: "akşam",
    image: lv.lise.image,
    metaTitle: "Lise, hazırlık-12. sınıf | Revak Okulları",
    lede: "Lise, öğrencinin kendi yolunu çizdiği dört yıl; isteyene bir hazırlık yılıyla beş. Ulusal programın yanında son iki yılda uluslararası bir diploma programı seçilebilir. Üniversite planı son sınıfta değil, 9. sınıfta danışmanla yapılan ilk görüşmede başlar.",
    setupTitle: "Sınıf düzeni",
    setup: [
      { label: "Sınıf mevcudu", value: "En fazla 18, diploma programı sınıflarında 16" },
      { label: "Danışman", value: "Okul danışmanına 9. sınıfta üniversite danışmanı eklenir" },
      { label: "Kütüphane", value: "Lise öğrencilerine akşam 19.00'a kadar açık" },
      { label: "Hazırlık", value: "İsteğe bağlı, yoğun İngilizce yılı" },
    ],
    lang: {
      title: "Hazırlıktan diplomaya diller",
      intro: "Hazırlık sınıfı İngilizce düzeyi yeterli olmayan öğrenci içindir. Üçüncü dil 9. sınıfta isteğe bağlı başlar.",
      head: ["Sınıf", "İngilizce", "İkinci dil", "Üçüncü dil (isteğe bağlı)"],
      rows: [
        ["Hazırlık", "20 saat", "4 saat", "Yok"],
        ["9. sınıf", "6 saat", "4 saat", "2 saat"],
        ["10. sınıf", "6 saat", "4 saat", "2 saat"],
        ["11. sınıf", "4 saat", "3 saat", "2 saat"],
        ["12. sınıf", "4 saat", "3 saat", "Yok"],
      ],
      note: "Uluslararası diploma programında derslerin çoğu İngilizce işlenir; dil saatleri programın kendi düzenine göre değişir.",
    },
    lessons: {
      title: "Ders cetveli",
      intro: "11. sınıfta öğrenci iki yoldan birini seçer: ulusal program ya da ulusal programla birlikte uluslararası diploma programı.",
      cols: ["9", "10", "11-12 ulusal", "11-12 diploma"],
      colLabel: "Sınıf ve program",
      rows: [
        { name: "Türk dili ve edebiyatı", hours: [5, 5, 5, 4] },
        { name: "Matematik", hours: [6, 6, 6, 5] },
        { name: "Fizik, kimya, biyoloji", hours: [6, 6, 8, 8] },
        { name: "Tarih, coğrafya, felsefe", hours: [5, 5, 4, 3] },
        { name: "Din kültürü ve ahlak bilgisi", hours: [2, 1, 1, 1] },
        { name: "İngilizce", hours: [6, 6, 4, 4], ek: true },
        { name: "İkinci yabancı dil", hours: [4, 4, 3, 3], ek: true },
        { name: "Beden eğitimi ve sanat", hours: [3, 3, 2, 2] },
        { name: "Seçmeli dersler", hours: [2, 3, 6, 5] },
        { name: "Bilgi felsefesi ve araştırma ödevi", hours: [null, null, null, 4], ek: true },
        { name: "Rehberlik saati", hours: [1, 1, 1, 1] },
      ],
      note: "Hazırlık sınıfının çizelgesi ayrıdır: 20 saat İngilizce, 4 saat ikinci dil, kalan saatler Türkçe, matematik, spor ve kulüp.",
    },
    hours: {
      title: "Günün saatleri",
      rows: [
        { label: "Kütüphane açılır", time: "07.45" },
        { label: "İlk ders", time: "08.40" },
        { label: "Öğle yemeği", time: "12.30" },
        { label: "Son ders biter", time: "15.30" },
        { label: "Takımlar ve kulüpler", time: "15.40-17.30" },
        { label: "Servis kalkışı", time: "16.30 ve 17.45" },
        { label: "Kütüphane kapanır", time: "19.00" },
      ],
    },
    day: {
      title: "Bir gün Revak'ta",
      intro: "11. sınıftan bir perşembe. Akşam kütüphanede kalanlar 19.00'da çıkar.",
      stops: liseDay,
    },
    guide: {
      title: tr.guidance.title,
      intro: tr.guidance.intro,
      steps: tr.guidance.steps.map((s) => ({ when: s.grade, title: s.title, text: s.text })),
    },
    faq: [
      { q: "Hazırlık sınıfı zorunlu mu?", a: "Hayır. Kayıttan önce yapılan İngilizce düzey belirleme sınavında yeterli olan öğrenci doğrudan 9. sınıfa başlar." },
      { q: "Uluslararası diploma programını kimler seçebilir?", a: "10. sınıfın sonunda isteyen her öğrenci. Danışman, ders yükünü ve üniversite planını öğrenci ve veliyle birlikte konuşur; seçim için not barajı yoktur." },
      { q: "Dışarıdan sınav desteği almak gerekir mi?", a: "11. sınıftan itibaren okulda deneme sınavları ve haftada üç akşam etüt var. Dışarıdan destek almak ailenin kararıdır; danışman çalışma takvimini buna göre birlikte kurar." },
      { q: "Yurt dışına başvuru yapacaklara destek var mı?", a: "Yurt dışı başvuruları için ayrı bir danışman çalışır: okul listesi, başvuru yazıları, öneri mektupları ve dil sınavı takvimi." },
    ],
    closing: { title: "Liseyi bir akşam görün.", text: "Çevrim içi tanıtım toplantısı ve yerinde tur; akşam 18.30 seçeneği çalışan veliler için." },
  },
};
