// Kabul sayfasının derinleşen bölümleri: yaş hesaplayıcı, gözlem günü farkı, belgeler,
// kayıttan ilk güne, ücrete neler dahil. Metinler Raşit onayı bekliyor (2026-10-04).
//
// Yaş kuralı (doğrulandı 2026-10-04): MEB Okul Öncesi Eğitim ve İlköğretim Kurumları
// Yönetmeliği, madde 11 (6) a-b ve madde 4; Bakanlığın Kasım 2025'te yayımladığı güncel metin
// (son değişiklik RG 17/1/2025). Yaş, kaydın yapıldığı yılın eylül ayı sonuna göre ay olarak:
//   - 69 ayını dolduran: 1. sınıfa kaydedilir
//   - 66, 67, 68 aylık: velinin yazılı isteğiyle 1. sınıfa kaydedilebilir
//   - 69, 70, 71 aylık: velinin yazılı talebiyle okul öncesine yönlendirilir ya da kaydı bir yıl ertelenir
//   - anaokulu 36-68 ay
// Basında konuşulan "72 ay" düzenlemesi bu tarihte yürürlükte değil; sayfa "bilgi amaçlı" etiketlidir.

import type { Kademe } from "@/lib/revak/store";

export const yas = {
  title: "Çocuğum hangi sınıfa başlar?",
  intro:
    "Doğum tarihini girin. Millî Eğitim Bakanlığı'nın kayıt yaşı kuralına göre hangi yıl hangi sınıfa ya da yaş grubuna uygun olduğunu hesaplayalım.",
  birth: "Doğum tarihi",
  year: "Başlamak istediğiniz yıl",
  years: [
    { id: "2027-2028", start: 2027, label: "2027-2028 (Eylül 2027)", when: "Eylül 2027" },
    { id: "2028-2029", start: 2028, label: "2028-2029 (Eylül 2028)", when: "Eylül 2028" },
    { id: "2026-2027", start: 2026, label: "2026-2027 ara dönem (Şubat 2027)", when: "Şubat 2027" },
  ],
  empty: "Doğum tarihini girdiğinizde sonuç burada yazılır.",
  invalid: "Doğum tarihini kontrol edin.",
  monthsShort: (m: number, y: number) => `30 Eylül ${y} itibarıyla ${Math.floor(m / 12)} yaş ${m % 12} ay (${m} ay)`,
  result: (when: string, sinif: string) => `${when} · ${sinif}`,
  notes: {
    tooYoung: (yil: number) => `Anaokulumuz 3 yaş grubundan başlar. Çocuğunuz Eylül ${yil}'de 3 yaş grubuna uygun olacak.`,
    early: "Bu yıl 5 yaş grubuna uygun. Velinin yazılı isteğiyle 1. sınıfa da başlayabilir; hangisinin uygun olduğunu görüşmede birlikte değerlendiririz.",
    defer: "1. sınıfa kayıt hakkı var. Velinin yazılı talebiyle bir yıl ertelenebilir ya da okul öncesine devam edebilir.",
    later: "Sınıf, çocuğun 1. sınıfa zamanında başladığı varsayılarak hesaplandı. Nakilde son karnesindeki sınıf esas alınır.",
    tooOld: "Bu yaş lise son sınıfının üstünde görünüyor. Doğum tarihini kontrol edin ya da kabul ofisini arayın.",
    hazirlik: "Lisede isteğe bağlı bir hazırlık yılı var; İngilizce düzey sınavına göre belirlenir.",
  },
  alt: { early: "İsterseniz 1. sınıf", defer: "İsterseniz 5 yaş grubu" },
  timelineTitle: "Revak boyunca",
  timelineLabel: "Çocuğunuzun önündeki dört kemer",
  timelineAge: (a: number) => `${a} yaş`,
  graduation: "Mezuniyet",
  sept: "Eylül",
  june: "Haziran",
  tag: "Bilgi amaçlı",
  tagText: "Kesin sonucu kabul ofisi verir.",
  sourceTitle: "Kural ve kaynak",
  source:
    "MEB Okul Öncesi Eğitim ve İlköğretim Kurumları Yönetmeliği, madde 11. Yaş, kaydın yapıldığı yılın 30 Eylül tarihine göre ay olarak hesaplanır: 69 ayını dolduran çocuk 1. sınıfa kaydedilir; 66-68 aylık çocuk velinin yazılı isteğiyle başlayabilir; 69-71 aylık çocuğun kaydı velinin talebiyle bir yıl ertelenebilir. Anaokulu 36-68 aylık çocuklar içindir. Kural değişirse hesaplayıcı güncellenir; son kontrol Ekim 2026.",
  cta: "Bu sınıf için ön kayıt",
  ctaAlt: "Diğer seçenekle ön kayıt",
};

export const gozlem = {
  title: "Gözlem günü kademeye göre değişir",
  label: "Kademe",
  items: {
    anaokulu: "Yarım gün oyun grubu. Öğretmen gözlem notu alır; test yapılmaz, çocuk sınava girdiğini anlamaz.",
    ilkokul: "1. sınıf için oyun ve tanışma. 2-4. sınıf için kısa bir okuma ve matematik etkinliği, ardından bahçe.",
    ortaokul: "Türkçe, matematik ve İngilizcede kırkar dakikalık değerlendirme. Sonuç kabul kararı için değil, sınıf düzeyini görmek için.",
    lise: "İngilizce düzey belirleme sınavı (hazırlık mı, 9. sınıf mı) ve öğrenciyle danışmanın yarım saatlik görüşmesi.",
  } as Record<Kademe, string>,
};

export type DocItem = { id: string; text: string; note?: string; levels?: Kademe[] };

export const belgeler = {
  title: "Kesin kayıt için gerekenler",
  intro: "Kademenizi seçin ve hazırladıklarınızı işaretleyin. İşaretler yalnızca bu tarayıcıda kalır; hiçbir şey gönderilmez.",
  levelLabel: "Kademe",
  progress: (done: number, all: number) => `${all} belgeden ${done} tanesi hazır`,
  print: "Listeyi yazdırın",
  reset: "İşaretleri temizleyin",
  items: [
    { id: "kimlik-ogr", text: "Öğrencinin kimlik kartının fotokopisi" },
    { id: "kimlik-veli", text: "Velinin kimlik kartının fotokopisi" },
    { id: "foto", text: "Son altı ayda çekilmiş iki vesikalık fotoğraf" },
    { id: "saglik", text: "Okulun sağlık formu, hekim imzalı", note: "Form kesin kayıt randevusundan önce e-postayla gelir." },
    { id: "asi", text: "Aşı kartının fotokopisi", levels: ["anaokulu", "ilkokul"] },
    { id: "karne", text: "Son karnenin fotokopisi", note: "1. sınıf ve anaokulu için gerekmez.", levels: ["ilkokul", "ortaokul", "lise"] },
    { id: "sinav", text: "Merkezî sınav sonuç belgesi, varsa", levels: ["lise"] },
    { id: "nakil", text: "Önceki okuldan nakil", note: "Sizden belge istenmez; nakli okul sistem üzerinden ister." },
    { id: "sozlesme", text: "Kesin kayıt sözleşmesi", note: "Kampüste, sizinle birlikte imzalanır." },
  ] as DocItem[],
};

export const ilkGun = {
  title: "Kesin kayıttan ilk güne",
  steps: [
    { when: "Kesin kayıt", text: "Sözleşme kampüste imzalanır; ödeme planı aynı gün belirlenir." },
    { when: "Haziran", text: "Kıyafet, kitap ve kırtasiye listesi e-postanıza gelir. Okul kıyafeti iki tedarikçiden alınabilir." },
    { when: "Temmuz", text: "Servis kaydı. Adresinize göre durak ve sabah saati bildirilir." },
    { when: "Ağustos sonu", text: "Sınıf öğretmeni ya da danışmanla yarım saatlik tanışma. Anaokulunda sınıf birlikte gezilir." },
    { when: "Eylül, ilk hafta", text: "Uyum haftası: anaokulu ve 1. sınıf için kısa günler, diğer sınıflar için bir günlük tanışma." },
    { when: "Eylül sonu", text: "İlk veli toplantısı. Sınıfın veli temsilcisi seçilir, yılın takvimi konuşulur." },
  ],
};

export const ucretEk = {
  includedTitle: "Ücrete neler dahil",
  includedIntro: "Rakamları size özel tabloyla gönderiyoruz; neyin karşılığını ödediğinizi ise burada açıkça yazıyoruz.",
  inLabel: "Dahil olanlar",
  outLabel: "Ayrıca ödenenler",
  included: [
    "Eğitim ve ders materyali (kitaplar hariç)",
    "Öğle yemeği ve ara öğünler",
    "Ders saatindeki yüzme, sanat ve müzik",
    "Kulüplerin çoğu: otuz kulübün yirmi beşi",
    "Okul içi geziler ve sergiler",
    "Rehberlik, revir ve öğrenci sigortası",
  ],
  extra: [
    "Servis, güzergâha göre",
    "Okul kıyafeti",
    "Kitap ve kırtasiye",
    "Bireysel çalgı dersi ve beş ücretli kulüp",
    "Yurt dışı ve yatılı geziler",
    "Yaz okulu",
  ],
  policyTitle: "Ödeme ve iade",
  policy: [
    { name: "Taksit", text: "Peşin ödemede %5 indirim. Ya da eylülden hazirana en fazla on taksit; ilk taksit kesin kayıtta, kalanlar her ayın 5'inde." },
    { name: "İade", text: "Ders yılı başlamadan vazgeçerseniz kayıt ücreti dışında ödediğiniz tutar iade edilir. Ders yılı başladıktan sonra iade, mevzuattaki oranlarla kalan aylar üzerinden hesaplanır." },
    { name: "Artış", text: "Yıllık artış bir önceki yılın resmî enflasyon oranına ve öğretmen maaş artışına göre belirlenir. Mart ayında ilan edilir ve kayıtlı veliye e-postayla bildirilir." },
  ],
};
