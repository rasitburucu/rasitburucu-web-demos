# Robotik konsept — tasarım ve yapım planı

> Durum: plan (2026-10-03). Kod yok. Önce Raşit'in TR metin + 3 açık karar onayı, sonra yapım.
> Slug önerisi: `kat` → `rasitburucu.com/web/kat/`

---

## 1. Konsept (tek paragraf)

**Kat**, Gebze'de hat sonu otomasyonu yapan hayali bir robot entegratörü: gıda, içecek, kimya ve yapı kimyasalı fabrikalarına iş birlikçi robotlu (cobot = insanla aynı alanda çitsiz çalışabilen hafif robot kol) **paletleme hücresi** kurar. Site bir broşür değil, bir mühendislik aracı gibi davranır: ziyaretçi ilk ekranda kendi kolisinin ölçüsünü ve ağırlığını yazar, yandaki canlı hücrede robot kol o koliyi, o desenle, gerçek hızında palete dizmeye başlar. Aynı veriden hangi modelin uyduğu, paletin kaç kat olacağı, hattın hızına yetişip yetişmediği ve tahmini geri ödeme süresi çıkar; sonuç tek tıkla satın almacıya gönderilecek bir bağlantıya ya da yazdırılabilir ön föye dönüşür. Sanat burada süs değil, işlevin kendisi: fabrika zemininin sarı bandı, teknik izometri çizimi ve kat kat yükselen palet, sitenin bütün görsel dilini taşır. Önceki iki demo kaydırmayla anlatıyordu; bu demo **doğrudan elle kurmayla** anlatıyor.

---

## 2. Alt sektör kararı ve hedef alıcı

| Seçenek | Türkiye'de gerçekçilik | Satılabilirlik / site işlevi | Risk |
|---|---|---|---|
| **A. Hat sonu paletleme (cobot entegratörü)** | Çok yüksek. IFR 2026 raporuna göre Türkiye'de 2025'te kurulan robotların %59'u taşıma-yerleştirme işinde; robot yoğunluğu hâlâ düşük (her 10 bin çalışana ~52), yani büyüme alanı var. Gebze, Bursa, Manisa, Konya OSB'lerinde binlerce aday fabrika. | Ürünleştirilebilir (koli ölçüsü + hız + palet = model). Yapılandırıcı ve geri ödeme hesabı doğal olarak oturur. Robotiq, UR, Vention bu modeli dünyada satıyor. | Düşük. Görsel olarak "sıkıcı" sanılabilir — sanat yönü bunu çözmeli. |
| B. Otonom depo robotu (AMR) | Orta. Büyük lojistik ve e-ticaret depoları; alıcı az ve büyük, çoğu yabancı markadan doğrudan alıyor. | Yapılandırıcı zor (depo yerleşimi, yazılım entegrasyonu). Site daha çok "bizi arayın" olur. | Orta. Görsel olarak jenerik "tech" görünümüne kayma eğilimi. |
| C. Tarım robotu (ilaçlama, hasat) | Düşük-orta. Alıcı dağınık, mevsimsel, bütçe kısıtlı, kooperatif/hibe ağırlıklı. | Satış hunisi web'den çok bayi ve fuar üstünden işler. | Yüksek bütçeli müşteri vitrini olarak zayıf. |
| D. Tıbbi / cerrahi robot | Düşük (üretici değil distribütör olur). | Hekime yönelik tanıtım. | **Yüksek:** tıbbi cihaz reklam ve tanıtım yönetmeliği; hayali olsa bile "tedavi iddiası" görüntüsü riskli. Eleme. |
| E. İnsansı robot | Türkiye'de gerçek alıcı yok. | Hype sitesi olur, işlev yok. | Tam olarak kaçındığımız "AI/tech startup" görünümü. Eleme. |

**Öneri: A — hat sonu paletleme hücresi kuran cobot entegratörü.** İkincil hat olarak kaynak hücresi tek satırla anılır (Türkiye'de yeni robotların %16'sı kaynakta), ama site ona sayfa açmaz; odak dağılmaz.

**Gerçek alıcı (satın alma komitesi) — site dördüne ayrı ayrı cevap verir:**

1. **Fabrika / üretim müdürü** (karar verici): "Gece vardiyasına adam bulamıyorum, 25 kilo torbayı kimse kaldırmak istemiyor." → Ana sayfa başlığı, geri ödeme.
2. **Proses / üretim mühendisi** (teknik doğrulayıcı): "Benim kolim, benim hızım, benim paletim sığar mı?" → Yapılandırıcı, teknik föy.
3. **Satın alma / finans**: "Kaça, kaç ayda döner, kiralanabilir mi?" → Geri ödeme hesabı, kiralama seçeneği, paylaşılabilir bağlantı.
4. **İSG uzmanı** (veto hakkı olan): "Çitsiz robot güvenli mi?" → Güvenlik bölgesi etkileşimi.

---

## 3. Marka

**Ad seçenekleri**

| Ad | Anlam | Avantaj | Risk |
|---|---|---|---|
| **Kat** (öneri) | Paletteki her sıra bir "kat"; "kat kat yükselir". | Üç harf, EN'de de okunur ("Kat Robotics"), logo kendiliğinden çıkar (üst üste üç çubuk = palet katları). Slug kısa: `/web/kat/`. | İngilizcede "cat" çağrışımı — zararsız. |
| İstif | Paletlemenin Türkçesi "istifleme". | Çok net, yerli. | Büyük "İ" ve "ş/ı" yok ama "İ" EN'de ve URL'de sorun; ad biraz depo/hamaliye kokar. |
| Hamal | Yükü taşıyan meslek. | Akılda kalıcı, esprili, hikâyesi güçlü. | **Riskli:** "işçinin yerini alan robot" algısı ve sınıfsal çağrışım. Fabrika müdürüne bile ters gelebilir. Önermiyorum. |

Ad çakışma kontrolü: kısa web aramasında "Kat Robotik" adlı bir robotik firması çıkmadı (kesin tescil kontrolü değil; konsept olduğu için yeterli).

**Merkez şehir: Gebze (Kocaeli).**
- Neden: Gebze/Dilovası boya, kimya ve yapı kimyasalı fabrikalarının merkezi — yani 25 kg torba ve ağır koli, paletlemenin en acı çektiği yer. İstanbul'a ve Bursa'ya bir saat; "ürününüzü getirin, deneme hücresinde deneyelim" vaadi coğrafi olarak inandırıcı.
- Alternatif: Bursa (otomotiv yan sanayi; ama orada iş daha çok kaynak/montaj, paletleme ikincil). Konya (gıda + makine; özgün ama İstanbul merkezli alıcıya uzak).

**Kısa hikâye (sitede "Hakkımızda" yerine üç cümle):**
Kat'ı Dilovası'nda bir boya fabrikasının hat sonunda bakım mühendisliği yapmış biriyle bir endüstriyel yazılımcı kurdu. Her vardiya yüzlerce kez elle kaldırılan 25 kiloluk torbaları izleyen ilk kurucu, büyük ve çitli robot hücrelerinin küçük fabrikaya hem pahalı hem yer kaplayan bir çözüm olduğunu gördü. İkisi, bir palet yerine sığan, operatörün tabletten yeni desen öğretebildiği ve kiralanabilen bir hücre tasarladı; Gebze'deki atölyelerinde bugün de her müşterinin kendi ürünüyle deneme yapılıyor.

*(Kurucu adı, kuruluş yılı, kurulum sayısı, müşteri adı yok. Uydurma rakam yok.)*

---

## 4. Sanat yönü — iki alternatif

İki yön de önceki demolarla çakışmaz: Onikitaş (sıcak kireç beyazı, Didone serif, el yazısı, kaydırma = gün), Revak (taş/mürekkep, editoryal serif, mühür kırmızısı, kaydırma = yürüyüş). Burada serif yok, kırmızı yok, kaydırma imza değil.

### Yön A — "Zemin Bandı" (öneri)

Fabrika zemininin kendisi: beton grisi epoksi zemin, üstünde güvenlik bandı, her şey teknik izometride (30° eksen, perspektifsiz) çizilmiş. Fotoğraf yerine kendi 3D sahnemiz ve teknik çizim.

- **Baskın renk:** beton grisi `#D6D7D1` (zemin), panel `#ECECE6`, mürekkep grafit `#151615`.
- **Tek vurgu:** **RAL 1003 sinyal sarısı** `#F5A800` — fabrika zemin bandının gerçek standardı. Yalnızca üç yerde: seçili/aktif durum, güvenlik bölgesi çizgisi, ana eylem düğmesi. Siyah-sarı tarama yalnızca uyarı durumunda (ör. "bu yük cobot sınırını aşıyor") — dekor değil, anlam.
- **Fontlar (Google Fonts):**
  - Başlık + arayüz: **Archivo** (değişken genişlik ekseni 62–125). Başlıklar geniş ve kalın (Expanded Black, depo duvarındaki boyalı yazı gibi), veri tabloları dar (Condensed) — tek aile, iki karakter.
  - Sayılar, ölçüler, etiketler: **Martian Mono** (geniş monospace; ölçü çizgisi ve föy hissi).
  - Türkçe karakter (ş, ğ, İ, ı) ikisinde de latin-ext ile var; yapımın 1. adımında görsel kontrol edilecek.
- **İmza etkileşim — "Kolinizi girin, robot dizsin":** ana sayfanın ilk ekranında yarısı canlı 3D hücre, yarısı üç kutu (ölçü, ağırlık, hız). Ziyaretçi değeri değiştirdiği anda robot kol eldeki koliyi bırakır, palet sıfırlanır, yeni ölçüdeki kolileri yeni desende dizmeye başlar; zemindeki sarı bant robotun erişimine göre yeniden çizilir. Palet dolunca dışarı kayar, robot diğer istasyondaki boş palete döner (gerçek hücrelerdeki çift istasyon — hat hiç durmaz). İkinci küçük an: zemine bir "operatör" işaretini sürükleyin, sarı bölgeye girince robot yavaşlar, iç bölgede durur — çitsiz güvenliğin canlı kanıtı.
- **Avantaj:** İşlev ile sanat aynı şey; "gerçek müşteri bunu ister mi?" sorusunun cevabı evet (Robotiq'in Palletizing Fit Tool'u tam bunu satış aracı olarak kullanıyor). Beton + sarı jenerik tech görünümünün tam tersi. Fotoğraf ihtiyacı neredeyse sıfır, telif riski yok.
- **Risk:** Gri zemin donuk düşebilir → tipografinin ölçeği (dev geniş başlıklar) ve sarının cimri kullanımı bunu taşımalı. Sarı + siyah, Fanuc'un sarı robotlarını hatırlatabilir → robotumuz mat beyaz/açık gri, sarı robotta değil zeminde.

### Yön B — "Aydınger" (teknik resim)

Site baştan sona bir mühendislik paftası: kenar çerçevesi, antet (başlık kutusu), revizyon tablosu, ölçü çizgileri. Kaydırınca robot kol eksenlerine ayrılır (patlatılmış görünüm), ölçülerle etiketlenir, sonra seçilen modele göre yeniden birleşir.

- **Baskın renk:** aydınger beyazı `#E8EDEE`, çizim mürekkebi koyu petrol mavisi `#0F2B3D`.
- **Tek vurgu:** işaretleme turuncusu `#FF6A13` (revizyon bulutları, seçili ölçü).
- **Fontlar:** **Barlow Condensed** (DIN benzeri, teknik resim yazısı) + **Spline Sans Mono** (ölçüler).
- **İmza etkileşim:** kaydırmaya bağlı patlatılmış görünüm + model seçince ölçü çizgilerinin yeniden hesaplanması.
- **Avantaj:** Çok "mühendis işi", ilk bakışta etkileyici; föy indirme ile doğal bağ.
- **Risk:** Kaydırma imzası yine kaydırma (önceki iki demoyla aynı mekanik). Patlatılmış görünüm Awwwards ürün sitelerinin klişesi. Açık zemin + çizim dili Revak'ın baskı/editoryal havasına yaklaşır. İşlev (yapılandırıcı) imzadan kopuk kalır.

**Öneri: A.** Gerekçe tek cümle: imza etkileşimin kendisi satış aracı; Raşit'in "gerçek işlev merkezde, üstüne sanat" formülüne birebir oturuyor ve önceki iki demodan mekanik olarak ayrışıyor.

---

## 5. Sayfa haritası

### Sayfalar (statik export)

| Yol | Ne | Öncelik |
|---|---|---|
| `/web/kat/` | Ana sayfa (canlı hücre + bölümler) | Zorunlu |
| `/web/kat/yapilandir/` | Hat sonu ön fizibilite (ana satış akışı) | Zorunlu |
| `/web/kat/modeller/p12/`, `/p20/`, `/p30/` | Model detay + teknik föy | Zorunlu (tek şablon, 3 veri) |
| `/web/kat/modeller/[model]/foy/` | Yazdırılabilir teknik föy (tarayıcıdan "PDF olarak kaydet") | Zorunlu |
| Uygulama sayfaları | v1'de ayrı sayfa yok; ana sayfada 3 örnek senaryo, her biri yapılandırıcıyı doldurup açar | İkincil |

Model adları hayali ürün serisi: **Kat P12 / P20 / P30** (taşıma kapasitesi 12 / 20 / 30 kg). Teknik değerler gerçek cobot sınıflarıyla tutarlı aralıkta seçilir (ör. erişim 1300–1750 mm, palet yüksekliği asansör kolonuyla 2000 mm'ye kadar) ve föyde "konsept ürün, örnek değer" notu yer alır.

### Ana sayfa — bölümler sırasıyla

0. **Konsept şeridi** (sabit üst ince bant): "Konsept çalışma — Kat hayali bir markadır. Tasarım: Raşit Burucu." + rasitburucu.com bağlantısı.
1. **Üst menü:** KAT logosu · Modeller · Nasıl çalışır · Güvenlik · Deneme hücresi · [Ön fizibilite] (sarı düğme).
2. **Giriş = canlı hücre.** Sol: dev başlık + alt başlık + üç hızlı girdi (koli ölçüsü U×G×Y mm, ağırlık kg, dakikada ürün). Sağ: 3D hücre, robot varsayılan koliyi diziyor. Altında canlı sayaç şeridi (Martian Mono): `kat 3/8 · 12 koli/kat · gerekli 9/dk · kapasite ~11/dk · UYGUN`. Düğme: "Bu ölçüyle devam et →" (değerleri yapılandırıcıya taşır).
3. **Kat kat nasıl kurulur** (tek kaydırma anı, mütevazı): yandan görülen palet kaydırdıkça kat kat yükselir, her kat bir adım — Keşif ziyareti → Numune testi (kendi ürününüzle) → Hücre kurulumu → Operatör eğitimi → Servis. Süreler "tipik" diye etiketli.
4. **Modeller** (kart değil, föy tablosu): P12 / P20 / P30 yan yana; kapasite, erişim, maks. palet yüksekliği, taban alanı, tipik hız. Satır üstüne gelince 3D'de robot o modele dönüşür (yalnızca masaüstü). Her sütun model sayfasına gider.
5. **Güvenlik — "Çit yok, sınır var."** Üstten görünen hücre çizimi (SVG): operatör işaretini sürükle → sarı bölge "yavaşlar", iç bölge "durur". İSG uzmanı için üç satır: alan tarayıcı, hız ve kuvvet sınırlama, kurulum öncesi risk değerlendirmesi (CE dosyası). Rakam iddiası yok.
6. **Örnek senaryolar** (açıkça "örnek senaryo" etiketi): 25 kg yapı kimyasalı torbası · içecek shrink paketi · dondurulmuş gıda kolisi. Her biri "Bu senaryoyu yapılandırıcıda aç" → ön dolu akış.
7. **Geri ödeme özeti:** iki girdi (vardiya sayısı, aylık işçilik maliyeti) → "tahmini X–Y ay". Altında "Varsayımları gör / tam hesap" → yapılandırıcının 5. adımı.
8. **Deneme hücresi — "Ürününüzü getirin."** Gebze atölyesinin izometrik çizimi (Google Maps gömme yok; statik çizim + adres metni + "Yol tarifi" dış bağlantısı). "Bir palet ürününüzü getirin, kendi kolinizle deneyelim." → randevu talebi (mailto).
9. **Servis:** "Robot durursa ne olur?" — uzaktan bağlantı, yedek parça, eğitim. Süre vaatleri "hedef" etiketiyle.
10. **Alt bilgi:** konsept notu, kaynak/credits (fontlar, kütüphaneler, IFR verisi), noindex.

### Model detay sayfası (`/modeller/p20/`)

- Üstte: model adı (Archivo Expanded dev), tek cümle "kime uygun", 3D'de yalnız o robot yavaşça bir çevrim yapar.
- Teknik tablo (föy düzeni): kapasite, erişim, tekrarlanabilirlik, eksen sayısı, palet yükseklik aralığı, taban alanı, güç, koruma sınıfı, ağırlık — hepsi "örnek değer".
- "Bu model sizin için mi?" → yapılandırıcıya model kilitli giriş.
- "Teknik föyü indir" → `/foy/` yazdırma sayfası (A4, yazdırma CSS'i; kullanıcı tarayıcıdan PDF kaydeder). Gerçek PDF dosyası üretmeye gerek yok.
- Kenar: model sayfası doğrudan açılırsa (yapılandırma yok) föy genel değerlerle basılır.

### Ana satış akışı — "Hat sonu ön fizibilite" (`/yapilandir/`)

Düzen (Mobbin'deki Stripe "solda ayarlar, sağda canlı önizleme" kalıbı): solda adımlar, sağda sürekli canlı hücre + özet. Mobilde önizleme üstte yapışkan küçük şerit, adımlar altta. Her değişiklik adres çubuğuna yazılır (yalnızca ürün/palet verisi, kişisel veri asla) → "Bağlantıyı kopyala" ile satın almacıya gönderilebilir.

**Adım 1 — Ürün**
- Görülen: ürün tipi seçimi (koli / torba / kasa-shrink), ölçü U×G×Y (mm), ağırlık (kg).
- Canlı: 3D'de konveyörün ucunda o ürün belirir (torba yumuşak yastık şekli, koli bantlı kutu).
- Kenar durumlar:
  - Ağırlık > 30 kg → siyah-sarı uyarı: "Bu yük cobot sınıfının üstünde. Çitli endüstriyel robot gerekir; mühendisle görüşelim." Akış devam eder ama sonuç "özel proje"ye döner.
  - Torba seçildiyse tutucu otomatik "pençe" olur (vakum torbada tutmaz) — kısa açıklama.
  - Mantıksız ölçü (ör. 20 mm koli veya palet genişliğinden büyük) → alan altında açıklayıcı hata, değer kabul edilmez.
  - Boş bırakılan alan → varsayılan örnek değer gri yazıyla gösterilir, "örnek" etiketi.

**Adım 2 — Hat**
- Görülen: dakikada ürün sayısı, kaç hat beslenecek (1 / 2), vardiya sayısı (1–3).
- Canlı: hız değişince robotun çevrim hızı ve sağdaki "gerekli / kapasite" çubuğu güncellenir.
- Kenar: gerekli hız kapasitenin üstündeyse → "Tek robot yetişmez" + öneri: çift tutucu (iki koli birden) veya ikinci hücre. 2 hat seçildiyse çift giriş konveyörü çizilir.

**Adım 3 — Palet**
- Görülen: palet tipi (EUR 800×1200 / endüstriyel 1000×1200 / özel ölçü), maksimum yük yüksekliği (mm), ara karton var/yok, desen (otomatik öneri + elle seçim: sütun / örgü / fırıldak).
- Canlı: üstten kat planı (SVG, ölçülü) + 3D palet. Sayılar: koli/kat, kat sayısı, koli/palet, palet alan doluluğu %.
- Kenar:
  - Koli palet kenarından taşıyorsa → kırmızı değil, sarı tarama ile taşan kısım işaretlenir: "Taşma 40 mm. Döndürmeyi deneyin."
  - Yükseklik robot erişimini aşıyorsa → "Asansör kolonu gerekir" otomatik eklenir, model önerisi değişebilir.
  - Örgü deseni bu ölçüye sığmıyorsa seçenek pasifleşir, nedeni yazılır.

**Adım 4 — Sonuç**
- Görülen: önerilen model (P12/P20/P30 veya "özel proje"), gerekli ve tahmini kapasite, hücre taban alanı (m²), eklenen opsiyonlar (asansör kolonu, çift tutucu, ara karton yerleştirici), güvenlik notu.
- Canlı: robot artık kullanıcının tam yapılandırmasını çalıştırıyor; palet dolup çıkıyor.
- Dürüstlük kuralı: her rakamın yanında "tahmini"; altında varsayım listesi (çevrim süresi hesabı, hız sınırı).
- Kenar: hiçbir model uymuyorsa → "Standart hücre bu işe uymuyor. Bu bir eksiklik değil, özel proje demek." + doğrudan görüşme talebi.

**Adım 5 — Geri ödeme (isteğe bağlı, atlanabilir)**
- Girdi: vardiya başına bu işte çalışan kişi, aylık kişi başı brüt maliyet (TL), yatırım tutarı (örnek değerle dolu, kullanıcı değiştirebilir), satın alma / kiralama seçimi.
- Çıktı: "Tahmini geri ödeme 14–19 ay" gibi aralık (tek rakam değil, ±%15 bant), aylık tasarruf; kiralamada "aylık kira, aylık işçilik tasarrufunun altında mı" göstergesi.
- Varsayımlar açık: bakım payı, verim, vergi/teşvik dahil değil.
- Kenar: tasarruf ≤ bakım maliyeti → "Bu senaryoda robot kendini ödemiyor. Vardiya sayısı artarsa tablo değişir." (Gerçek bir entegratörün söyleyeceği dürüst cümle; güven yaratır.)
- Para birimi: tek TL (karmaşıklık yok); yatırım tutarı alanı serbest. *(Ucuz karar, alındı.)*

**Adım 6 — Gönder**
- Seçenekler: (a) "Mühendise gönder" — ad, firma, e-posta, telefon (opsiyonel), fabrika şehri, not → **mailto** (yapılandırma özeti gövdeye yazılır, sunucu yok); (b) "Ön föyü yazdır" — yapılandırmaya özel A4 özet; (c) "Bağlantıyı kopyala"; (d) "Deneme hücresi randevusu iste" (mailto).
- Gönderim sonrası ekran: "Taslak e-postanız açıldı. Gönder'e bastığınızda mühendisimize ulaşır." + konsept notu ("Bu demo hiçbir veri toplamaz.").
- Kenar: e-posta istemcisi yoksa → özet metni "Kopyala" düğmesiyle sunulur. Form doğrulaması yalnızca biçim (boş, e-posta biçimi).

---

## 6. İmza etkileşimin teknik tarifi

**Mimari: tek veri, iki görüntü.**
- `lib/kat/plan.ts` — saf fonksiyonlar (React'siz): `planLayer(ürün, palet, desen)` → her kolinin konumu; `fit(yapılandırma)` → model önerisi, kapasite, uyarılar; `payback(girdi)` → aralık. Hem SVG kat planı hem 3D sahne bu çıktıyı okur. Yani 3D yüklenmese bile **bütün işlev çalışır**; 3D bir gösteri katmanıdır, işlev ona bağlı değildir. "Kullanışsız sanat" riskinin teknik cevabı budur.
- Durum: Onikitaş'taki küçük store kalıbı (`useSyncExternalStore`) + adres çubuğu senkronu. Yeni kütüphane yok.

**3D (React Three Fiber) — neden:** robotun koliyi gerçekten alıp koyması, desenin canlı değişmesi ve çift istasyon döngüsü video veya CSS ile yapılamaz (her yapılandırma farklı). R3F, three, drei repoda yüklü; Onikitaş'ta kademeli kalite (tier) altyapısı zaten var.

- **Kamera:** ortografik, sabit teknik izometri (30°). Serbest döndürme yok (OrbitControls yüklenmez; oyuncak hissi ve bayt tasarrufu). Üç hazır açı düğmesi: İzometrik / Üstten / Operatör gözü.
- **Robot:** model dosyası yok — **prosedürel geometri** (silindir, yuvarlatılmış kutu, kapsül; ~6 parça). Mat beyaz gövde, grafit eklemler, MeshStandardMaterial + three'nin kendi `RoomEnvironment`'ı (indirilen HDR yok). İnce kontur çizgisi (teknik çizim hissi) kenar çizgileriyle.
- **Hareket:** analitik ters kinematik (IK = "elin gideceği noktadan eklem açılarını hesaplama"): taban dönüşü + iki parçalı düzlemsel kol + bileğin hep dikey kalması. Paletleme robotları zaten böyle çalışır; 6 eksenli tam IK gerekmez. Yol: al → kaldır → taşı → yerine in → bırak → dön; yumuşak hız profili. Çevrim süresi `fit()`'in hesabından gelir; ekrandaki hız ile tablodaki hız aynıdır.
- **Koliler:** tek `InstancedMesh` (en fazla ~150 koli), karton rengi + bant şeridi küçük canvas dokusuyla (indirme yok).
- **Zemin:** düz düzlem + gürültü dokusu (prosedürel), sarı bant ve güvenlik bölgeleri düz çizgi/şerit meshleri. Gölge: tek seferlik temas gölgesi, yalnız palet değişince yeniden çizilir.
- **Performans kuralları:** görünür değilse çizim durur (IntersectionObserver + sekme gizliyse durdur); robot beklerken `frameloop="demand"`; DPR üst sınırı 1.75; post-processing yok (Onikitaş'tan farklı olarak bu sahnede gerek yok).

**GSAP — neden:** yalnızca ana sayfadaki "kat kat" kaydırma anı ve arayüz geçişleri. Framer Motion bu demoda kullanılmaz (iki animasyon kütüphanesi = çift bayt). Lenis yalnızca ana sayfada; yapılandırıcıda yerli kaydırma (form ve sayı girişleriyle çatışmasın).

**CSS:** sayaç şeridi, uyarı taraması, adım geçişleri.

**Performans bütçesi**

| Kalem | Hedef |
|---|---|
| İlk yükleme JS (3D'siz: Next çekirdeği + sayfa + GSAP) | ≤ 170 KB gzip |
| 3D parçası (three + R3F + seçili drei), ilk boyamadan sonra boşta yüklenir | ≤ 260 KB gzip |
| Mobil toplam JS | ≤ ~350 KB hedef; aşarsa mobil orta kademe de SVG sürümüne düşer |
| GLB / 3D model | **0 KB** (prosedürel). Dış model kullanılırsa üst sınır 1.5 MB, Draco/meshopt sıkıştırmalı |
| Doku | ≤ 150 KB toplam (prosedürel tercih) |
| Fontlar | 2 aile, değişken, latin + latin-ext alt kümesi |
| LCP | Başlık metni (3D'yi beklemez) |

Bayt sayıları yapım 2. adımında gerçek build çıktısıyla ölçülür; tahmin değil ölçüm esas.

**Yedekler**
- **Düşük güçlü cihaz / WebGL yok:** Onikitaş'taki GPU yoklama + kademe mantığı uyarlanır. Düşük kademede three hiç indirilmez; yerine aynı `planLayer` verisinden üretilen **SVG izometrik çizim** gelir, koliler GSAP ile tek tek "düşer". Görsel dil aynı kalır (izometri zaten çizim dili).
- **prefers-reduced-motion:** robot döngüsü yok; palet son hâliyle durağan gösterilir, değer değişince anında yeniden çizilir; sayılar animasyonsuz güncellenir; kaydırma anı statik katlara döner.
- **JS kapalı:** başlık, metin, model tablosu, iletişim e-postası okunur; yapılandırıcı yerine "e-postayla ölçünüzü gönderin" metni.
- Klavye: tüm girdiler, desen seçimi ve operatör sürükleme için ok tuşu alternatifi; 3D tuval `aria-hidden`, yanındaki canlı metin özeti (`aria-live`) ekran okuyucuya durumu söyler.

---

## 7. Ana sayfa örnek TR metinleri (Raşit onayı bekliyor)

**Başlık (seçenekler; öneri ilki):**
1. **Hat sonunda kimse 25 kilo kaldırmasın.**
2. Kolinizi yazın. Robot dizsin.
3. Paletleme artık vardiya beklemiyor.

**Alt başlık:**
Kat, gıda, içecek ve kimya fabrikalarına çitsiz çalışan robotlu paletleme hücresi kurar. Kolinizin ölçüsünü girin; hangi model, palet kaç kat, hattınıza yetişiyor mu, kaç ayda kendini öder — beş dakikada görün.

**Ana satırlar:**
1. **Önce kolinizi ölçeriz, robotu sonra seçeriz.** Ölçü, ağırlık ve hat hızı; model önerisi buradan çıkar, katalogdan değil.
2. **Çit yok, sınır var.** Alan tarayıcı insanı görür: yaklaşınca robot yavaşlar, iç bölgeye girince durur.
3. **Bir palet yerine sığar.** Hücre iki palet istasyonuyla çalışır; biri dolarken diğeri hazır, hat durmaz.
4. **Yeni deseni operatörünüz öğretir.** Ürün değişince mühendis çağırmazsınız; desen tabletten seçilir.
5. **Ürününüzü getirin, deneyelim.** Gebze'deki deneme hücremize bir palet kolinizi getirin; kendi ürününüzle görün.
6. **Satın alın ya da kiralayın.** Kiralamada ödeme ilk paletten başlar; işçilik tasarrufuyla yan yana görün.

**Mikro metinler (örnek):**
- Sayaç şeridi: `kat 3/8 · 12 koli/kat · gerekli 9/dk · kapasite ~11/dk · uygun`
- Uyarı: "Bu yük cobot sınıfının üstünde. Çitli endüstriyel robot gerekir — bu bir özel proje."
- Geri ödeme altı: "Tahmindir. Vergi, teşvik ve finansman dahil değildir; kesin hesap keşif ziyaretinden sonra."
- Konsept şeridi: "Konsept çalışma. Kat hayali bir markadır; ürünler, değerler ve senaryolar örnektir."

**Kullanılabilecek tek gerçek veri (kaynaklı):** "Türkiye'de 2025'te kurulan endüstriyel robotların %59'u taşıma ve yerleştirme işinde." — IFR World Robotics 2026 (basın haberleri; yapımda IFR'nin kendi bülteninden doğrulanacak, doğrulanamazsa çıkarılır).

---

## 8. Görsel / 3D ihtiyaç listesi

| Varlık | Kaynak | Not |
|---|---|---|
| Cobot (3 model varyantı) | **Prosedürel**, kodda | Sketchfab'daki CC-BY robot kolları genelde gerçek markaların (UR, KUKA) birebir kopyası → marka varlığı riski; ayrıca 5–30 MB, eklemleri ayrık değil, temizleme işi büyük. Elendi. |
| Koli, torba, palet, konveyör, asansör kolonu, alan tarayıcı | Prosedürel | Torba: yumuşatılmış kutu + hafif şişkinlik. |
| Karton / zemin dokusu | Canvas ile üretilen | Gerekirse Poly Haven CC0 beton dokusu (küçük, ≤ 100 KB webp). |
| Operatör işareti | SVG, kendi çizim | Siluet değil, zemin işareti (ayak izi/pin) — insan figürü çizme riski yok. |
| Deneme hücresi izometrik çizimi | SVG, kendi çizim | |
| Teknik föy çizimleri (robot ön/yan görünüş, ölçülü) | SVG, kendi çizim (3D'den türetilebilir) | |
| Fotoğraf | En fazla 1–2, Pexels lisansı (Revak'taki gibi) | Yalnızca markasız palet/depo atmosferi; görünür robot markası (turuncu KUKA, sarı Fanuc) içeren kare **kullanılmaz**. Fotoğrafsız da çalışır. |
| Sosyal paylaşım görseli / ikon | 3D sahneden kendi render'ımız | |
| Fontlar | Archivo, Martian Mono (SIL OFL 1.1) | credits'e |
| Kod | three.js, R3F, GSAP (lisansları credits'e) | |

---

## 9. Referanslar (ne aldığımız, tek cümle)

Not: Firecrawl hesabında kredi bitti; araştırma WebSearch ile yapıldı. Mobbin'de "canlı önizlemeli çok adımlı yapılandırıcı" araması yapıldı.

1. **Robotiq — Palletizing Fit Tool / PE20** (robotiq.com/solutions/palletizing): satış aracının kendisi — "projeyi yatırımdan önce doğrula, 3D simülasyon, geri ödeme, iç onay için paylaşılabilir rapor" dörtlüsünü birebir akış iskeleti olarak alıyoruz.
2. **Universal Robots — ROI / Justification Calculator ve UR Studio** (universal-robots.com): geri ödeme hesabının varsayımlarını açıkça listeleme ve "hücreyi önce sanal kur" vaadi.
3. **Vention — MachineBuilder ve Pallet Configurator** (vention.com): palet desenini dört adımda tanımlama (ürün → ara karton → desen → doğrulama) sırası.
4. **Formic** (formic.co): kiralama / üretim başına ödeme dilinin ("robot değil verim satıyoruz") ilk kez otomasyona geçen fabrikaya nasıl satıldığı — kiralama seçeneğinin gerekçesi.
5. **Fauna Robotics — Awwwards SOTD, Haziran 2026**: iki renkli sakin palet ve "yerine geçme değil birlikte çalışma" söylemi — insan-robot güvenlik bölümünün tonu.
6. **iyO — Awwwards SOTD (3D ürün yapılandırıcı)**: 3D modelin yapılandırma seçimine anında tepki verdiği sahne + seçenek paneli düzeni.
7. **Mobbin — Stripe "pricing table oluşturma" akışı**: solda ayarlar, sağda sürekli canlı önizleme, altta Geri/Devam düzeni — yapılandırıcının iskelet kalıbı.
8. **Robomation (Türkiye, robomation.com.tr)**: yerli rakip sitelerin tipik hâli (ürün listesi + "bize ulaşın"); neyi geçmemiz gerektiğinin ölçüsü — onlarda olmayan şey canlı doğrulama.

Kod, metin, marka varlığı kopyalanmaz; yalnızca kalıp ve satış mantığı.

Kaynak bağlantıları:
- https://robotiq.com/solutions/palletizing · https://blog.robotiq.com/where-to-start-with-palletizing-automation-the-robotiq-palletizing-fit-tool-tells-you-exactly-what-you-need
- https://www.universal-robots.com/q22021/mmi_justification_calculator/ · https://roboticsandautomationnews.com/2025/06/24/universal-robots-launches-new-online-simulation-tool/92498/
- https://vention.com/tools/configurators/pallets · https://vention.io/machine-builder
- https://www.robotics247.com/article/formic_offers_robotics_as_a_service_and_financing_to_manufacturers/Industrial_Automation
- https://www.awwwards.com/sites/fauna-robotics · https://www.awwwards.com/sites/iyo
- https://mobbin.com/flows/7ef71a1c-f23e-4416-8cc4-d67882c1475c
- https://robomation.com.tr/
- IFR verisi: https://n24.com.tr/teknoloji/ifr-turkiyede-robot-stoku-31-bine-cikti-dunya-5-milyonu-asti · https://www.atptech.com/turkiyede-robot-yogunlugu-artiyor-fark-kapaniyor-mu/

---

## 10. Riskler ve açık kararlar

**Riskler**
- **"Sıkıcı sektör" algısı:** paletleme, insansı robota göre gösterişsiz. Çözüm: imza etkileşim ilk 5 saniyede çalışır görünmeli; dev geniş tipografi. Ölçüt: Raşit ilk ekranı görünce "bunu bir fabrika gerçekten ister" ve "bunu kimse yapmamış" diyebilmeli.
- **Mobil bayt bütçesi:** three + R3F mobilde 350 KB'ı zorlayabilir → ölçüm 2. adımda; aşarsa mobil SVG sürümüne düşer (işlev kaybı yok).
- **Hesap güvenilirliği:** uydurma kesinlik görüntüsü → her sonuç aralık + "tahmini" + varsayım listesi. Fiyat gösterimi aşağıdaki karara bağlı.
- **IK hareketi "robotik değil" görünebilir:** gerçek paletleme robotunun hız profili (hızlı taşı, yavaş in) uygulanmazsa oyuncak gibi durur → yapımda referans videoya göre ayar.
- **EN önemi:** B2B robotikte EN, Raşit'in yurt dışı müşterisine gösterim ve sektörün dili için kritik. Öneri: içerik baştan `content/kat/tr.ts` + `en.ts` yapısında kurulur, sayı/birim biçimi dile göre (TR 1.200 mm, EN 1,200 mm); EN metni TR onayının hemen ardından, aynı yapım turunda yazılır (birebir çeviri değil, doğal İngilizce). Bu bir öneri, ayrı karar değil.

**Raşit'e sorulacak kararlar (en fazla 3)**
1. **Marka adı:** Kat (öneri) / İstif / Hamal (riskli). Hangisi?
2. **Sanat yönü:** A "Zemin Bandı" — beton grisi + sinyal sarısı, canlı hücre imzası (öneri) / B "Aydınger" — teknik resim, kaydırmalı patlatılmış görünüm. Hangisi?
3. **Fiyat görünürlüğü:** (a) model başına "örnek fiyat aralığı" gösterilir (daha gerçekçi, ama hayali rakam) / (b) fiyat hiç gösterilmez, geri ödemede yatırım tutarını kullanıcı girer, alan "örnek" değerle dolu gelir (öneri: b — uydurma rakam kuralına daha uygun). Hangisi?

---

## 11. Yapım adımları (sıralı)

1. **Metin ve karar onayı:** bu plandaki 3 karar + bölüm 7 TR metinleri Raşit'ten onay. Font Türkçe karakter kontrolü (Archivo, Martian Mono; ş ğ İ ı ç ö ü örnek satırı).
2. **İskelet + bütçe ölçümü:** `app/kat/` (layout: fontlar, noindex, konsept şeridi, tema rengi), `content/kat/tr.ts`, `content/kat/credits.ts`, `lib/kat/`. Boş R3F sahnesiyle build alıp gerçek JS boyutunu ölçmek — bütçe tutmuyorsa mobil stratejisi burada kesinleşir.
3. **Hesap çekirdeği:** `lib/kat/plan.ts` — kat planı, desenler (sütun/örgü/fırıldak), model uygunluğu, kapasite, geri ödeme; kenar durumların hepsi burada. Basit bir doğrulama betiğiyle örnek senaryolar elle kontrol (test paketi yok; uydurma `npm test` yazılmaz).
4. **2D işlev katmanı:** yapılandırıcının 6 adımı, SVG kat planı, adres çubuğu senkronu, mailto ve yazdırma föyü — 3D olmadan uçtan uca çalışır hâle gelir. (Önce işlev, sonra şov.)
5. **3D hücre:** prosedürel robot, IK hareket, InstancedMesh koliler, çift istasyon döngüsü, zemin bandı, kamera açıları, operatör/güvenlik bölgesi etkileşimi; kademe (tier) yoklaması ve düşük kademe SVG izometri yedeği.
6. **Ana sayfa:** canlı hücreli giriş, "kat kat" GSAP kaydırma anı, model föy tablosu, güvenlik, örnek senaryolar, geri ödeme özeti, deneme hücresi, servis, alt bilgi.
7. **Model sayfaları + föy:** üç model tek şablon, `generateStaticParams`, A4 yazdırma CSS'i.
8. **Erişilebilirlik ve hareket azaltma:** klavye yolları, `aria-live` özet, reduced-motion, JS kapalı durumu; düşük güçlü telefonda ve `?tier=low` ile deneme.
9. **Denetim:** `web-design-guidelines` + `qa-quality-control` ajanı (kenar durumlar: aşırı değerler, boş alanlar, mobil); `npm run lint` + `npm run build`; bayt bütçesi raporu.
10. **EN + yayın hazırlığı:** TR son onayından sonra `en.ts`; `npm run preview` → Raşit görsel onay → `npm run sync:site` → ana sitede kendi yayın sırası (lint, build, preview, Raşit onayı, deploy, canlı kontrol). Ana sitedeki demo destesine kart eklemek ayrı küçük iş.
