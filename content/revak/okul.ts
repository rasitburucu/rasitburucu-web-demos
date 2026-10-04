// Okulumuz (/revak/okulumuz/), İletişim (/revak/iletisim/), Veli girişi (/revak/veli/).
// Metinler Raşit onayı bekliyor (2026-10-04). Kişi adı yok; roller var.
// Telefon numarası kurgusal (0212 000 ...), e-posta alan adı kurgusal.

export const okulumuz = {
  metaTitle: "Okulumuz | Revak Okulları",
  crumb: "Okulumuz",
  title: "Revak: altından geçilen bir çatı.",
  intro:
    "Revak, bir avluyu çevreleyen kemerli galeridir. Yağmurda da güneşte de altından geçilir, biri ötekine yol verir. Okula bu adı, çocuğun on beş yıl boyunca altından geçeceği bir çatı olsun diye verdik.",

  archTitle: "Bir kemer nasıl ayakta durur",
  archIntro: "Bir parçayı seçin. Kemerin her taşının okulda bir karşılığı var.",
  archLabel: "Kemerin parçaları",
  parts: [
    { id: "kilit", name: "Kilit taşı", text: "En son konur ve bütün kemeri tutar. Bizde bu taş danışmandır: her öğrencinin onu tanıyan bir yetişkini olur." },
    { id: "taslar", name: "Kemer taşları", text: "Her biri ötekine yaslanır. Öğretmenler birbirinin dersini bilir ve bir öğrenci hakkında birlikte konuşur." },
    { id: "silme", name: "Başlık silmesi", text: "Ayakla kemerin buluştuğu taş. Kademe geçişleri burada: anaokulundan ilkokula geçen çocuğu iki kademenin öğretmenleri birlikte karşılar." },
    { id: "ayaklar", name: "İki ayak", text: "Kemer iki ayağın üstünde durur: ulusal program ve aile. Biri olmadan öteki yükü taşımaz." },
  ],

  valuesTitle: "Kapının üstünde yazanlar",
  values: [
    "Her çocuğu adıyla tanırız.",
    "Soru, cevaptan önce gelir.",
    "Hata saklanmaz, düzeltilir.",
    "Sanat ve spor dersin parçasıdır.",
    "Veli masadadır.",
  ],

  orgTitle: "Okulu kim yönetir",
  orgIntro: "Bu bir konsept okul; şemaya adları değil rolleri yazdık. Gerçek bir okulda her kutunun altında bir yüz ve bir e-posta olur.",
  org: {
    top: { name: "Kurucu kurul", text: "Bütçe, kampüs ve uzun vadeli kararlar. Yılda dört toplantı." },
    head: { name: "Okul müdürü", text: "Eğitimin ve günlük işleyişin sorumlusu; Bakanlığa karşı okulu temsil eder." },
    rows: [
      { name: "Kademe koordinatörleri", text: "Dört kademe, dört koordinatör. Kademenin programından ve öğretmenlerinden sorumlu." },
      { name: "Rehberlik birimi", text: "İki psikolojik danışman ve üniversite danışmanları." },
      { name: "Kabul ofisi", text: "Ön kayıt, tur, bursluluk ve ücret bilgisi." },
      { name: "İdari işler", text: "Muhasebe, servis, mutfak, revir ve güvenlik." },
    ],
    parents: { name: "Okul aile birliği", text: "Her sınıfın seçilmiş veli temsilcisi; yılda dört toplantı." },
  },

  accountTitle: "Kime hesap veririz",
  account: [
    { name: "Millî Eğitim Bakanlığı", text: "Özel okul olarak ulusal programı uygularız; il ve ilçe millî eğitim müdürlüklerinin denetimine açığız." },
    { name: "Uluslararası diploma programı", text: "Programın yetkili kuruluşu, lisedeki diploma programını belirli aralıklarla yerinde denetler." },
    { name: "Bağımsız mali denetim", text: "Yıllık hesaplar bağımsız bir denetim şirketince incelenir; özeti okul aile birliğiyle paylaşılır." },
    { name: "Kişisel veriler", text: "Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusuyuz. Aydınlatma metni sitenin altında." },
  ],

  closing: { title: "Revağı yerinde görün.", text: "Tur bir saat sürer. Kapıdan girer, revağın altından yürür, sınıflara uğrarsınız." },
};

export const iletisim = {
  metaTitle: "İletişim ve ulaşım | Revak Okulları",
  crumb: "İletişim",
  title: "İletişim ve ulaşım.",
  intro:
    "Hangi birime yazacağınızı bilmiyorsanız kabul ofisini arayın; doğru kişiye biz yönlendiririz. Kabul ofisi hafta içi 08.30-17.30 arasında açık.",
  unitsTitle: "Birimler",
  unitsHead: ["Birim", "Ne için", "Telefon ve e-posta", "Saat"],
  units: [
    { name: "Kabul ofisi", for: "Ön kayıt, kampüs turu, ücret bilgisi, bursluluk", phone: "0212 000 19 87", tel: "+902120001987", email: "kabul@revak.k12.tr", hours: "Hafta içi 08.30-17.30" },
    { name: "Muhasebe", for: "Ödeme planı, fatura, iade", phone: "0212 000 19 88", tel: "+902120001988", email: "muhasebe@revak.k12.tr", hours: "Hafta içi 09.00-17.00" },
    { name: "Servis birimi", for: "Güzergâh, durak, servis değişikliği", phone: "0212 000 19 89", tel: "+902120001989", email: "servis@revak.k12.tr", hours: "Okul günlerinde 07.00-18.30" },
    { name: "Revir", for: "Sağlık formu, ilaç onayı, alerji listesi", phone: "0212 000 19 90", tel: "+902120001990", email: "revir@revak.k12.tr", hours: "Okul günlerinde 07.45-17.45" },
    { name: "Rehberlik birimi", for: "Görüşme randevusu, veli seminerleri", phone: "0212 000 19 91", tel: "+902120001991", email: "rehberlik@revak.k12.tr", hours: "Hafta içi 08.30-17.00" },
    { name: "Koruma sorumlusu", for: "Bir çocuğun güvenliğiyle ilgili kaygı", phone: "0212 000 19 92", tel: "+902120001992", email: "koruma@revak.k12.tr", hours: "E-postalar her gün okunur" },
  ],
  addressTitle: "Adres",
  mapLink: "Haritada açın",
  mapAlt: "Kampüsün konumunu gösteren çizim: Sarıyer-Kilyos yolu, Zekeriyaköy, orman ve Revak Okulları",
  mapLabels: { forest: "Belgrad Ormanı yönü", road: "Sarıyer-Kilyos yolu", village: "Zekeriyaköy", school: "Revak", metro: "Hacıosman metrosu", sea: "Karadeniz yönü" },
  waysTitle: "Nasıl gelinir",
  ways: [
    { title: "Özel araçla", text: "Sarıyer-Kilyos yolundan Zekeriyaköy sapağına girin; Çamlık Yolu'nun sonunda ana kapı. Kampüste ziyaretçi otoparkı var. Tur formuna plakanızı yazarsanız kapıda adınız hazır olur." },
    { title: "Toplu taşımayla", text: "Hacıosman metro istasyonundan Zekeriyaköy yönüne giden otobüslerle yaklaşık 25 dakika; son duraktan okula kısa bir yürüyüş." },
    { title: "Servisle", text: "Yedi semtte güzergâhımız var. Durakları ve saatleri kampüs sayfasında semtinizi seçerek görebilirsiniz." },
  ],
  servisLink: "Servis güzergâhlarına bakın",
  hoursTitle: "Saatler",
  hours: [
    ["Kabul ofisi", "Hafta içi 08.30-17.30; açık kapı günlerinde cumartesi 10.00-13.00"],
    ["Kampüs kapısı", "Okul günlerinde 07.30-19.30"],
    ["Kampüs turları", "Hafta içi 09.30, 11.00, 14.00; çevrim içi tur 18.30'a kadar"],
  ] as [string, string][],
  closing: { title: "Gelmeden önce bir saat ayırın.", text: "Tur planlarsanız kapıda adınız hazır olur, sizi kabul ofisinden bir öğretmen karşılar." },
};

export const veli = {
  metaTitle: "Veli girişi | Revak Okulları",
  crumb: "Veli girişi",
  title: "Veli portalı bu konsept demonun dışında.",
  text: "Gerçek bir okulda bu sayfa sizi okulun veli sistemine götürürdü. Revak hayali bir okul olduğu için arkasında bir sistem yok: alanlar kapalı, hiçbir bilgi gönderilmez.",
  formTitle: "Veli girişi",
  email: "E-posta adresiniz",
  password: "Şifreniz",
  submit: "Giriş yapın",
  closed: "Kapalı",
  sealRing: "REVAK OKULLARI · KONSEPT · VELİ PORTALI · ",
  sealLabel: "Kapalı mührü: veli portalı bu demoda çalışmaz",
  listTitle: "Portalda neler olurdu",
  listIntro: "Gerçek bir okulun veli sisteminde bulunan beş şey ve bu sitedeki açık karşılıkları.",
  list: [
    { title: "Haftanın yemek menüsü", text: "Alerjen işaretleriyle, iki haftalık.", link: "Örnek menü", href: "/revak/kampus/#yemek" },
    { title: "Servisin konumu", text: "Aracın canlı konumu ve tahmini varış saati.", link: "Güzergâhlar", href: "/revak/kampus/#servis" },
    { title: "Okul takvimi", text: "Tatiller, veli görüşmeleri, sınav haftaları.", link: "Almanak", href: "/revak/almanak/" },
    { title: "Ödev, devamsızlık ve gelişim raporu", text: "Her ders için ödev, devamsızlık kaydı, dönem raporları.", link: "Örnek rapor", href: "/revak/egitim/#rapor" },
    { title: "Danışmanla randevu", text: "Görüşme saati seçme ve öğretmene mesaj.", link: "Birimler", href: "/revak/iletisim/" },
  ],
  back: "Ana sayfaya dönün",
};
