// "Güvende" (/revak/guvende/): rehberlik, çocuk koruma, sağlık, güvenlik ve acil durum.
// Metinler Raşit onayı bekliyor (2026-10-04). Politikalar örnektir; mevzuat adı verilmez.

export const guvende = {
  metaTitle: "Güvende: rehberlik, sağlık, acil durum | Revak Okulları",
  crumb: "Güvende",
  title: "Bir şey olursa ne olacağını şimdiden yazıyoruz.",
  intro:
    "Rehberlik, çocuk koruma, sağlık ve acil durum. Kayıttan önce bilmek isteyeceğiniz her şey tek sayfada, sade dille. Buradaki politikalar örnektir; kesin kayıtta imzaladığınız belgeler bunların ayrıntılı hâlidir.",
  indexLabel: "Bu sayfada",
  index: [
    { id: "olursa", label: "Bir şey olursa" },
    { id: "rehberlik", label: "Rehberlik" },
    { id: "koruma", label: "Çocuk koruma" },
    { id: "saglik", label: "Sağlık" },
    { id: "acil", label: "Güvenlik ve acil durum" },
  ],

  scenariosTitle: "Kim, hangi sırayla ne yapar",
  scenariosIntro: "Bir durum seçin; kimin, hangi sırayla ne yaptığını görün.",
  scenariosLabel: "Durum",
  scenarios: [
    {
      id: "ates",
      label: "Çocuğum okulda ateşlendi",
      steps: [
        { who: "Öğretmen", what: "Çocuğu bir refakatçiyle revire gönderir; sınıfta yalnız bırakmaz." },
        { who: "Hemşire", what: "Ateşini ölçer, dinlendirir. 38 derecenin üstündeyse ilaç vermeden önce sizi arar." },
        { who: "Veli", what: "Sizi ya da formdaki ikinci kişiyi ararız; bir saat içinde almanızı rica ederiz. Çocuk o sırada revirde, yanında biriyle bekler." },
        { who: "Kayıt", what: "Ölçüm, saat ve verilen her şey sağlık dosyasına yazılır. Okula dönüş kuralı aynı gün size yazılı gelir." },
      ],
    },
    {
      id: "dusme",
      label: "Teneffüste düştü, başını çarptı",
      steps: [
        { who: "Nöbetçi öğretmen", what: "Çocuğu yerinden kaldırmadan hemşireyi çağırır, diğer çocukları uzaklaştırır." },
        { who: "Hemşire", what: "Değerlendirir. Bilinç kaybı, kusma ya da derin yara varsa 112 aranır." },
        { who: "Veli", what: "Hafif bile olsa başa çarpma her zaman size telefonla bildirilir; mesajla değil." },
        { who: "Kayıt", what: "Olay formu doldurulur. Akşam izlemeniz gerekenler size yazılı gönderilir." },
      ],
    },
    {
      id: "dislanma",
      label: "Arkadaşları onu dışlıyor",
      steps: [
        { who: "Öğrenci ya da veli", what: "Danışmana ya da rehberlik birimine söyler. Telefon, e-posta ya da yüz yüze; hepsi aynı kayda girer." },
        { who: "Psikolojik danışman", what: "İki iş günü içinde öğrenciyle görüşür, sınıf öğretmenini dinler." },
        { who: "Okul", what: "Gerekirse diğer öğrencilerle ve aileleriyle ayrı ayrı görüşülür. Kimse sınıfın önünde suçlanmaz ya da teşhir edilmez." },
        { who: "Takip", what: "İki hafta sonra veliyle bir görüşme daha. Durum düzelmediyse yeni bir plan birlikte yazılır." },
      ],
    },
    {
      id: "kaygi",
      label: "Bir yetişkinin davranışı beni kaygılandırdı",
      steps: [
        { who: "Siz", what: "Kaygınızı kademenin koruma sorumlusuna ya da okul müdürüne iletin. Emin olmanız gerekmez; söylemeniz yeterli." },
        { who: "Koruma sorumlusu", what: "Aynı gün kaydeder ve çocuğun güvenliğini önceler. Gerekirse ilgili çalışan çocuklarla temastan hemen çekilir." },
        { who: "Okul", what: "Bildirim yükümlülüğü olan durumlarda yetkili kurumlara bildirilir. Süreç boyunca size bilgi verilir." },
        { who: "Gizlilik", what: "Kayıt yalnızca koruma ekibinin göreceği ayrı bir dosyada durur." },
      ],
    },
    {
      id: "deprem",
      label: "Okul saatinde deprem oldu",
      steps: [
        { who: "Sınıf", what: "Sarsıntı boyunca çök, kapan, tutun. Öğretmen sınıfı tahliye planındaki yoldan toplanma alanına götürür." },
        { who: "Toplanma alanı", what: "Her öğretmen yoklama alır; eksik öğrenci arama ekibine bildirilir." },
        { who: "Veli", what: "Yoklama tamamlanınca bütün velilere toplu mesaj gider: öğrenciler güvende mi, nerede toplandılar, teslim nasıl yapılacak." },
        { who: "Teslim", what: "Çocuk yalnız kartlı veliye ya da formdaki kişiye, toplanma alanından teslim edilir. Mesaj gelmeden yola çıkmamanızı rica ederiz." },
      ],
    },
  ],

  guidanceTitle: "Rehberlik",
  guidanceIntro:
    "Rehberlik biriminde iki psikolojik danışman çalışır. Her kademede ayrı bir program var; veli seminerleri yılda altı kez yapılır ve Almanak'ta yazar.",
  guidance: [
    { level: "Anaokulu", text: "Uyum, oyun içinde gözlem, dönemde bir veli görüşmesi. İlkokula hazırlık değerlendirmesi 5 yaş grubunda." },
    { level: "İlkokul", text: "Arkadaşlık ve duygular üzerine dönemde iki ders. Okuma ve dikkat güçlüğü için erken tarama." },
    { level: "Ortaokul", text: "Çalışma becerileri, ergenlik, akran ilişkileri. 7. sınıftan itibaren lise yönlendirmesi." },
    { level: "Lise", text: "Üniversite ve meslek danışmanlığı, sınav kaygısı, uyku. Yurt dışı başvuruları için ayrı danışman." },
  ],
  bullyingTitle: "Akran zorbalığına karşı",
  bullying: [
    "Her sınıfta yılın başında sınıf kuralları öğrencilerle birlikte yazılır.",
    "Teneffüste ve serviste en az bir yetişkin görevlidir; kör nokta haritası her yıl güncellenir.",
    "Bildirilen her durum aynı hafta konuşulur; sessiz kalınmaz, sınıfın önünde de konuşulmaz.",
  ],
  seminarsLink: "Veli seminerlerini Almanak'ta görün",

  protectionTitle: "Çocuk koruma",
  protectionIntro:
    "Her kademede bir koruma sorumlusu var: kademe koordinatörü ya da psikolojik danışman. Okul genelinde koruma ekibi müdür, iki psikolojik danışman ve hemşireden oluşur.",
  protectionStepsTitle: "Bir kaygıyı nasıl iletirsiniz",
  protectionSteps: [
    "Herhangi bir çalışana söyleyin; öğretmen, servis görevlisi, hemşire.",
    "Çalışan aynı gün koruma sorumlusuna yazılı iletir.",
    "Sorumlu durumu değerlendirir ve en geç ertesi iş günü size döner.",
    "Konuşulanlar yalnızca koruma ekibiyle paylaşılır.",
  ],
  protectionRulesTitle: "Çalışanlar için kurallar",
  protectionRules: [
    "Bütün çalışanlar, servis şoförleri ve mutfak ekibi dahil, işe başlarken ve her yıl çocuk koruma eğitimi alır.",
    "Bir yetişkin bir çocukla kapalı kapı ardında yalnız kalmaz; birebir görüşmeler camlı odalarda yapılır.",
    "Çalışanlar öğrencilerle kişisel hesaplardan yazışmaz; iletişim okulun sisteminden yürür.",
    "Okul ağında içerik süzgeci var; 5. ve 9. sınıfta çevrim içi güvenlik dersi, velilere yılda bir seminer.",
  ],

  healthTitle: "Sağlık",
  healthHead: ["Konu", "Kural"],
  healthIntro: "Revir her okul günü açık. Kayıtta doldurduğunuz sağlık formu revirde, sınıfta ve serviste aynı bilgiyi taşır.",
  health: [
    ["Revir saatleri", "Okul günlerinde 07.45-17.45"],
    ["Kadro", "İki hemşire tam gün; okul doktoru salı, çarşamba ve perşembe"],
    ["İlaç", "Yalnızca reçete ve veli onay formuyla; doz ve saat formda yazar"],
    ["Alerji ve kronik durum", "Liste mutfakta, sınıfta ve serviste. Acil ilacı olan öğrencinin ilacı hem revirde hem sınıfta durur"],
    ["Aşı", "Ulusal aşı takvimi; kayıtta aşı kartının kopyası istenir"],
    ["Bulaşıcı hastalık", "24 saat ateşsiz ve ilaçsız kalmadan okula dönülmez; kusma ve ishalden sonra 48 saat"],
    ["Veliye haber", "Revire gelen her öğrenci için aynı gün bilgi. Ateş, ilaç ve başa çarpmada hemen telefon"],
  ] as [string, string][],

  safetyTitle: "Güvenlik ve acil durum",
  safetyIntro: "Kampüsün tek girişi var ve 24 saat görevli bulunur.",
  safety: [
    { title: "Ziyaretçi", text: "Kimlikle kaydolur, ziyaretçi kartı takar ve kampüste refakatle dolaşır." },
    { title: "Çocuğu teslim almak", text: "Veli kartıyla. Kartı olmayan biri ancak veli okulu önceden aradıysa ve kimlik gösterirse." },
    { title: "Tatbikat", text: "Yılda iki deprem, bir yangın tatbikatı: eylül, şubat ve nisan. Velilere toplu mesaj provası da yapılır." },
    { title: "Toplanma alanları", text: "Spor sahası ve anaokulu bahçesi. Her sınıfın kapısında tahliye yolu çizili." },
    { title: "Acil durumda mesaj", text: "Önce öğrencilerin güvende olup olmadığı, sonra toplanma yeri, sonra teslimin nasıl yapılacağı. Üç mesaj, bu sırayla." },
  ],

  closing: {
    title: "Sorularınızı revirde ve rehberlikte sorun.",
    text: "Yerinde turda revire ve rehberlik birimine uğramak isteyip istemediğinizi formda seçebilirsiniz.",
  },
};
