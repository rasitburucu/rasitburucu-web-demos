# Revak Okulları: içerik derinliği analizi

Tarih: 2026-10-04 · Yöntem: gerçek okul sitelerinin yalnızca bilgi mimarisi (hangi bölüm var, nasıl sunulmuş, veliye ne veriyor) okundu. Metin, görsel, logo, ad ve kod alınmadı; kişisel veri not edilmedi. Hiçbir form gönderilmedi, giriş yapılmadı, çerez kabul edilmedi.

Revak tarafında okunanlar: `content/revak/tr.ts`, `app/revak/*`, `components/revak/*`, `.tasarim/revak/{PROJE,YON,ELESTIRI,TASARIM}.md`.

---

## 1. İncelenen siteler

| Site | Adres | Tek cümle izlenim |
|---|---|---|
| Müjgan Çetin Okulları (Kumluca, Antalya; anaokulu, ilkokul, ortaokul) | mujgancetinokullari.k12.tr | Görev metnindeki okul budur. Okulun kendi adını taşıyan beş paket programı (sınav hazırlığı, dil, proje, dijital beceri, rehberlik) var ve kademe sayfaları bunları tekrar ediyor. Ayrıca e-güvenlik menüsü ve proje/ödül menüsü var. Veliye günlük hayatta lazım olan bilgiler ise eksik: yemek menüsü, servis, takvim, ücret, kayıt adımları, harita. |
| Koç Okulu (İstanbul, anasınıfından liseye, yatılı merkezli) | koc.k12.tr | Kayıt bölümü en derli toplu olan site. Kabul politikası, aday süreçleri, nakil, ücret, burs ve indirimler, idari ve mali bilgiler ayrı sayfalarda. Sanal tur, mezun platformu ve iş başvurusu ayrı alt sitelerde. Ücret tablosu ise PDF. |
| Eyüboğlu Eğitim Kurumları (İstanbul, 7 kampüs) | eyuboglu.k12.tr | Menüsü en geniş site. Yemek, giyim, kitap, servis, sağlık ve güvenlik için ayrı hizmet sayfaları var ama hepsi yüzeysel (menü yok, güzergâh yok). Akademik takvim HTML liste olarak duruyor. Rehberlik veli, öğrenci ve öğretmen diye üçe ayrılmış. |
| İSTANBUL ENKA Okulları (anaokulundan liseye) | enka.k12.tr/istanbul | Mevcut veliye en çok hizmet eden site. "Hızlı bağlantılar" altında takvim, yemek menüsü, günlük açılış-kapanış saatleri ve servis var, çocuk koruma programının da ayrı sayfası var. Ama menü, saat çizelgesi ve ücret PDF ya da görsel olarak verilmiş. |

Not: Müjgan Çetin, Koç ve Eyüboğlu sitelerinde kademe sayfaları ayrı. ENKA'da her kademenin başvuru sayfası ayrı.

---

## 2. Gerçek okul sitelerinde ortak bilgi mimarisi

### 2.1 Menü iskeleti (dört sitenin ortak paydası)

1. **Hakkımızda:** kurucu ve tarihçe, misyon-vizyon-değerler, yönetim, idari birimler, kurumsal belgeler (KVKK)
2. **Eğitim / Akademik:** kademe sayfaları, akademik programlar, yabancı dil, uluslararası programlar, akreditasyonlar, kütüphane ve laboratuvarlar, teknoloji, rehberlik, üniversite danışmanlığı, akademik takvim
3. **Okulda yaşam:** kulüpler, sanat, müzik, spor, yayınlar, gelenekselleşmiş etkinlikler, sosyal sorumluluk, öğrenci konseyi, haberler
4. **Hizmetler** (ayrı başlık ya da yaşamın altında): yemek, servis, sağlık, güvenlik, giyim, kitap ve kırtasiye
5. **Kayıt / Kabul:** ön kayıt formu, kabul şartları, kademe bazlı süreçler, sınavlar (düzey belirleme, bursluluk, lise kabul), ücretler, burs ve indirimler, okul tanıtım günleri
6. **Kampüs:** alanlar, spor tesisleri, yatılı merkez, sanal tur
7. **Portal ve dış bağlantılar:** veli ve öğrenci portalı (okul yönetim sistemi, sınıf platformu), kütüphane kataloğu, mezun derneği, iş başvurusu
8. **İletişim:** form, adres, harita, birim bazlı telefon ve e-posta
9. **Alt bilgi:** KVKK, çerez politikası, gizlilik, sosyal medya, kısa hızlı bağlantılar

### 2.2 Öğe öğe: veliye ne veriyor, nasıl sunulmuş

| Öğe | Veliye ne veriyor | Gerçek sitelerde nasıl sunulmuş |
|---|---|---|
| **Kademe sayfaları** (anaokulu / ilkokul / ortaokul / lise) | "Benim çocuğumun yaşındaki hayat nasıl?" sorusunun cevabı: program, dersler, dil, kulüpler, rehberlik, kademe yöneticisinin mesajı | Her kademe ayrı sayfa. İçerikleri: yaklaşım paragrafı, ders alanları listesi, destek hizmetleri, kademeye özel kulüpler, birkaç fotoğraf. Günlük akış, ders çizelgesi ve uyum süreci çoğunda yok ya da PDF'te. |
| **Akademik program** | Ulusal programın üstüne ne eklendiği, ders saatleri, proje çalışmaları | Ders alanlarının adı geçen listeler; okulun kendi markalı program paketleri (Müjgan Çetin'de beş tane, her birinin kısaltması var). |
| **Yabancı dil modeli** | Kaç saat İngilizce, ikinci dil hangi sınıfta başlıyor, ana dili İngilizce öğretmen var mı, seviye grupları | Kademe sayfasında birkaç cümle ya da markalı dil programı. Haftalık saat tablosu nadir. |
| **Uluslararası programlar ve akreditasyon** | Programın denetlendiği, diplomanın tanındığı güvencesi | "Akreditasyonlar ve üyelikler" sayfası, logo şeridi. |
| **Ölçme ve değerlendirme** | Deneme sınavı sıklığı, karne dışı gelişim raporu, veliye geri bildirim düzeni | Çoğunlukla sınav hazırlık paketinin içinde, deneme sayısıyla. "Nasıl ölçüyoruz" yöntemini anlatan sayfa yok. |
| **Rehberlik / PDR** | Uyum, sosyal-duygusal destek, zorbalıkla mücadele, meslek ve üniversite yönlendirmesi, veli seminerleri | Eyüboğlu'nda öğrenci, veli ve öğretmen diye üç grup; rehberlik bülteni. ENKA'da yurt içi ve yurt dışı üniversite danışmanlığı ayrı sayfalar. |
| **Çocuk koruma ve e-güvenlik** | Kötü bir şey olursa kime, nasıl söyleneceği; çevrim içi güvenlik | ENKA: koruma ekibi, kademe başına sorumlu, yıllık veli semineri, gizli bildirim formu. Müjgan Çetin: e-güvenlik menüsünde politika ve mevzuat bağlantıları. |
| **Kulüpler, sanat, spor** | Ders sonrası çocuğun ne yapacağı, kulüp sayısı | Ayrı sayfalar; çoğunlukla liste ve fotoğraf. Saat, kademe ve ücret bilgisi az. |
| **Servis** | Semtime servis var mı, kaçta alınır, rehber personel, araç takibi, ücret | Eyüboğlu ve ENKA: hizmet niteliklerini sayan düz metin (kapıdan kapıya, emniyet kemeri, araç yaşı, uydudan takip, sertifikalar). Güzergâh, durak saati ve ücret **hiçbirinde yok**. |
| **Yemek menüsü** | Bugün ne yiyecek, alerji, diyet, ara öğün | ENKA: aylık PDF, anaokulu ayrı. Eyüboğlu: menü yok, yalnızca beslenme ilkeleri ve denetim. Alerjen ve kalori bilgisi hiçbirinde yok. |
| **Sağlık** | Revir saatleri, hekim ve hemşire, ilaç politikası, acil durumda veliye haber verme | Eyüboğlu: revir saatleri, ilaç ancak reçeteyle, elektronik sağlık dosyası. Aşı, alerji ve salgın protokolü yok. |
| **Güvenlik** | Giriş kontrolü, kamera, ziyaretçi, tatbikat, teslim alma | Eyüboğlu: yasal çerçeve ve görev listesi. Ziyaretçi kuralı, deprem tatbikatı ve çocuk teslimi anlatılmıyor. |
| **Kampüs olanakları** | Havuz, kütüphane, laboratuvar, sahne; "çocuğum nerede vakit geçirecek" | Liste sayfası ve tesis başına alt sayfa (Koç). Fotoğraflar ve büyüklük rakamları. |
| **Sanal tur** | Gezmeye gelmeden kampüsü görmek | Koç: ayrı alt alan adında 360° tur. |
| **Akademik takvim** | Okul ne zaman açılıyor, tatiller, karne, veli görüşmeleri | Eyüboğlu: HTML liste, anaokulu tatili ayrı. ENKA: takvim sayfası. Takvime ekleme özelliği hiçbirinde yok. |
| **Günlük saatler** | Kaçta bırakıp kaçta alacağım, kulüp ve etüt saatleri | ENKA: görsel ve PDF çizelge. Diğerlerinde yok. |
| **Duyurular ve haberler** | Okulun yaşadığını görmek, etkinlik dönüşleri | Ana sayfada haber kaydırıcısı, haber listesi, yayınlar. |
| **Etkinlik takvimi** | Aday veli için tanıtım günleri, mevcut veli için gösteriler | Koç: ana sayfada etkinlik takvimi. |
| **Galeri** | Okul ortamını görmek | Müjgan Çetin: fotoğraf ve video galerisi menüde. Diğerlerinde haberlerin içinde. |
| **Kayıt süreci adımları** | Ne zaman, hangi sırayla, hangi değerlendirmeyle | Eyüboğlu: kademeye göre görüşme, düzey belirleme sınavı ve lise kabul sınavı. Koç: ilkokulda noter huzurunda kura, lisede merkezî sınav sonucu. Kabul politikası ayrı sayfa. Belge listesi ve tarihler çoğunlukla duyurularda dağınık. |
| **Burs ve indirim** | Ne kadar indirim, hangi şartla | Koç: başarı ve ihtiyaç birlikte; erken ödeme, kardeş, mezun ve grup çalışanı indirimleri kural olarak yazılmış. ENKA: başvuru dönemi, rıza formu, mevcut ve yeni öğrenci için ayrı form. |
| **Ücret politikası** | Toplam maliyet, kalemler, taksit, iade | Koç ve ENKA: yıllık ücret **PDF**. Sayfada yalnızca yemek, servis ve kıyafet notları var. Dahil olan ve ayrıca ödenen kalemler, taksit ve iade sayfada değil. |
| **SSS** | Hızlı cevap | İncelenen dört sitede belirgin bir SSS sayfası yok; sorular telefona yönlendiriliyor. |
| **İletişim ve ulaşım** | Adres, harita, birim bazlı iletişim, çalışma saatleri | Müjgan Çetin: form ve çalışma saatleri, harita yok. Koç: birim ve dahili hat listesi. ENKA: alt bilgide genel iletişim. |
| **Veli portalı** | Not, devamsızlık, ödev, duyuru, ödeme | Dış sisteme bağlantı (okul yönetim sistemi, sınıf platformu). Sitenin içinde bir şey yok, yalnızca link. |
| **KVKK** | Verimin ne olacağı | Alt bilgide aydınlatma metni, çerez politikası, çerez yönetim paneli (ENKA'da dört kademeli onay). ENKA başvuru sayfasının asıl içeriği KVKK metni. |
| **İnsan kaynakları / kariyer** | Öğretmen adayına "burada çalışmak" | Koç ve Eyüboğlu: ayrı başvuru sistemi. |
| **Mezunlar** | Okulun uzun soluklu topluluğu | Ayrı platform ya da dernek sitesi. |
| **Kanıt bölümleri** | Güven | İstatistik bandı (kampüs, okul, kitap, kulüp sayısı), üniversite sonuçları sayfası (ENKA), yarışma ve ödüller menüsü (Müjgan Çetin). |
| **Sosyal medya** | Güncel hayat | Alt bilgide ikonlar. |

### 2.3 Gözlenen üç örüntü

1. **Gerçek siteler iki kitleye hizmet eder.** Biri aday veli (kayıt hunisi), öteki mevcut veli (menü, takvim, servis, portal). ENKA'nın "hızlı bağlantıları" ikinci kitle için yapılmış. Revak şu an neredeyse tamamen aday veliye çalışıyor.
2. **Derinlik genişlikten gelir, ayrıntıdan değil.** Gerçek sitelerde çok sayfa var ama her sayfa ince. Menü, güzergâh ve ücret gibi veliyi en çok ilgilendiren bilgiler ya PDF'te ya hiç yok. Revak burada gerçek siteleri **geçebilir**: daha az ama dolu sayfa.
3. **Güven, rakam vitrinine emanet.** İstatistik bandı, üniversite sonuçları, ödül menüsü. Revak bunları kullanamaz. Karşılığı yöntem anlatımı olmalı ("nasıl ölçüyoruz, nasıl haber veriyoruz").

---

## 3. Revak ile karşılaştırma

Revak'ın şu anki sayfaları: ana sayfa (giriş ve cümle formu, kısaca, revak yürüyüşü, üniversite rehberliği, üç alışkanlık, kulüpler, kampüs bandı, etkinlikler, SSS, tur saatleri), kampüs (tesisler, "bir gün burada" ilkokul ve lise, servis semt seçici, güvenlik-sağlık-yemek soruları, haftalık menü), kabul (yollar, dört adımlı süreç, önemli tarihler, bursluluk, ücret ve indirimler), dört akış (ön kayıt, tur, bursluluk, ücret bilgisi), 404, KVKK penceresi.

| Öğe | Gerçek sitelerde | Revak'ta var mı | Öneri | Öncelik |
|---|---|---|---|---|
| Kademe sayfaları | Dördünde de var, ayrı sayfa | **Yok.** Yürüyüşte kademe başına bir kart ve "bu kademe için ön kayıt" var | Ekle: tek şablon, dört sayfa | Yüksek |
| Yabancı dil modeli | Paragraf ya da markalı program | Kısmen: kademe kartında tek satır, "kısaca"da bir not | Derinleştir: kademe başına haftalık saat, ikinci dil seçimi, seviye grupları | Yüksek |
| Ölçme ve değerlendirme | Deneme sınavı sayısıyla, zayıf | Yok | Ekle: "Nasıl ölçüyoruz" (rakam vitrini yerine yöntem) | Yüksek |
| Akademik program / ders çizelgesi | Ders alanları listesi | Yok | Kademe sayfasında haftalık ders dağılımı tablosu | Orta |
| Rehberlik / PDR | Üç gruba ayrılmış hizmet | Yalnız 9.-12. sınıf üniversite rehberliği | Derinleştir: anaokulu uyumu, akran ilişkileri, zorbalıkla mücadele, veli seminerleri | Yüksek |
| Çocuk koruma ve e-güvenlik | ENKA'da ayrı sayfa | Tek soru-cevap | Derinleştir: sorumlu rol, bildirim yolu, ekran ve cihaz politikası | Orta |
| Kulüpler | Liste | Var (9 kulüp + "23 daha") | Derinleştir: kademe ve gün filtresi, ücretli mi | Düşük |
| Servis | Düz metin, güzergâh yok | **Var ve gerçeklerden iyi** (semt seç, alınma saati) | Derinleştir: güzergâh şeması, kurallar, ücret dahil mi | Orta |
| Yemek menüsü | PDF ya da yok | Var: tek haftalık statik liste | Derinleştir: hafta seçici, anaokulu menüsü ve ara öğünler, alerjen işaretleri | Orta |
| Sağlık | Revir saatleri, ilaç politikası | Tek soru-cevap | Derinleştir: revir saatleri, ilaç ve alerji formu, aşı, salgın, veliye haber | Orta |
| Güvenlik | Görev listesi | Tek soru-cevap | Derinleştir: ziyaretçi, teslim alma, deprem ve yangın tatbikatı | Orta |
| Kampüs olanakları | Liste ve alt sayfalar | Var (7 tesis) | Şimdilik yeterli | Düşük |
| Sanal tur | Koç'ta 360° | Yok (yalnızca çevrim içi canlı tur seçeneği) | Ekle: kampüs planı üzerinde tur noktaları | Orta |
| Akademik takvim | HTML liste ya da sayfa | Yok (yalnızca 5 etkinlik ve kabul tarihleri) | Ekle: yıllık almanak, takvime ekleme | Yüksek |
| Günlük saatler | ENKA'da PDF | Kısmen ("bir gün burada" içinde saatler) | Kademe sayfasına sabah giriş, çıkış, etüt ve kulüp saatleri tablosu | Orta |
| Duyuru ve haberler | Ana sayfa kaydırıcısı, liste | Yok (yalnızca bursluluk duyuru şeridi) | Ekle: 3-4 örnek yazılık küçük almanak | Düşük |
| Etkinlik takvimi | Var | **Var**, filtreli, takvime ekleme var | Yeterli | — |
| Galeri | Menü öğesi | Yok | Gerek yok. Yerine kampüs tur noktaları ve öğrenci işi sergisi | Düşük |
| Kayıt adımları | Kademeye göre farklı | Var (4 adım, tek tip) | Derinleştir: kademeye göre değerlendirme farkı, gerekli belgeler listesi | Yüksek |
| Yaş / sınıf uygunluğu | Yok (formda bile yok) | Formda yaş uyarısı var | Ekle: "Çocuğum hangi sınıfa başlar" hesaplayıcı | Yüksek |
| Burs ve indirim | Kurallı sayfa | **Var ve iyi** (oranlar, şartname, örnek sorular) | Yeterli | — |
| Ücret politikası | PDF | Var: e-postayla tablo + indirim listesi | Derinleştir: dahil ve ayrı kalemler, taksit, iade, ücret artış ilkesi | Orta |
| SSS | Yok | **Var**, gruplu | Kademe sayfalarına kademeye özel SSS | Düşük |
| İletişim / ulaşım | Form, birim listesi | Yalnızca alt bilgi ("İletişim" menüsü alt bilgiye kayıyor) | Ekle: iletişim sayfası (birim bazlı, ulaşım tarifi, çalışma saatleri) | Orta |
| Veli portalı | Dış bağlantı | **Ölü bağlantı** ("Veli girişi" tıklanınca hiçbir şey olmuyor) | Düzelt: demo dışı olduğunu ve portalda neler olacağını anlatan küçük bir sayfa ya da pencere | Yüksek (küçük iş) |
| KVKK | Alt bilgi, çerez paneli | Var (pencere) | Yeterli. Çerez kullanılmıyorsa banner da gerekmez | — |
| Hakkımızda / hikâye / değerler | Dördünde de var | Yok ("Okulumuz" menüsü ana sayfadaki alışkanlıklara gidiyor) | Ekle: kısa bir okul sayfası (adın kökeni, ilkeler, yönetim yapısı adsız) | Orta |
| Kariyer / İK | Ayrı sistem | Yok | Gerek yok ya da en fazla tek bölüm | Düşük |
| Mezunlar | Platform | Yok | Gerek yok (uydurma mezun yasak) | — |
| Kanıt: istatistik, sonuç, ödül | Hepsinde | Yok (doğru karar) | Yerine "nasıl ölçüyoruz" ve "nasıl haber veriyoruz" | Yüksek |
| Mevcut veli hızlı bağlantıları | ENKA | Yok | Ekle: başlık ya da alt bilgide takvim, menü, servis, veli girişi | Orta |

**Ayrıca bir risk:** "Kısaca Revak" bölümünde "2014'ten beri IB Diploma Programı" yazıyor. IB gerçek bir kuruluş ve tescilli bir program. Kurgusal bir okulun bu programın yetkili okulu olduğunu söylemesi, brifteki "gerçek kurum adı yok" kuralıyla çelişebilir. Seçenekler:
- A. Olduğu gibi bırak. Avantajı: gerçekçi duruyor, veliler bu adı tanıyor. Riski: kurgusal bir okula gerçek bir yetki atfediliyor.
- B. "Uluslararası diploma programı" gibi genel bir ifadeye çevir. Avantajı: kural tam korunur. Riski: biraz soyut kalır.

Karar Raşit'in.

---

## 4. Revak dünyasına uyan en değerli 11 ekleme

Ortak kural (her ekleme için): Gerçek bir veri gibi görünen her blokta (menü, takvim, saat, ücret kalemi, haber) küçük bir **"örnek" mühür etiketi** dursun: mühür kırmızısı çerçeve, Hanken 12 px. Mühürde kısa bir yazı olsun, ör. "Örnek içerik". Alt bilgideki konsept şeridi kalır. Bu etiket tek bir bileşen olarak her yerde aynı görünür, böylece dürüstlük dekorun parçası olur. Uydurma başarı rakamı, ödül, veli yorumu, adı verilmiş öğretmen yok.

### 4.1 Kademe sayfaları (`/revak/egitim/anaokulu`, `ilkokul`, `ortaokul`, `lise`)
- **Yapı:** Başlıkta yürüyüşteki kemerin plakası olsun: kademe adı Marcellus, yaş aralığı ve Roma rakamı (I-IV) var olan sistemden. Sonra şu bölümler:
  1. Bu yaşta okul ne demek (2-3 cümle)
  2. Sınıf düzeni: mevcut, öğretmen oranı, danışman
  3. **Dil modeli:** sınıf sınıf haftalık İngilizce ve ikinci dil saatleri, mürekkep çizgili küçük bir tablo
  4. **Haftalık ders dağılımı:** "ders cetveli", defter sayfası görünümünde
  5. Günlük saatler: giriş, çıkış, etüt, kulüp, servis kalkışı
  6. "Bir gün burada" (kampüsteki bileşen buraya kademeye göre taşınır, dört kademe için)
  7. Kademeye özel rehberlik: anaokulunda uyum haftası, ilkokulda okumaya geçiş, ortaokulda liseye hazırlık, lisede var olan üniversite takvimi
  8. Kademeye özel 3-4 soruluk SSS
  9. Kapanış: "Bu kademe için ön kayıt" (kademe seçili gelir) ve tur
- **Etkileşim:** Yürüyüşteki kemerden bu sayfaya View Transitions ile geçiş (kemer görseli başlık plakasına dönüşür; kemerden ön kayda geçişte zaten kullanılan teknik).
- **Dünyaya uyumu:** Her kademenin bir "taşı" var: kemer render'ının o kademedeki ışığı (sabah, öğle, ikindi, akşam).
- **Dürüstlük:** Saatler ve ders dağılımı "örnek" mühürlü.

### 4.2 "Nasıl öğretir, nasıl ölçeriz" (`/revak/egitim/`)
- Gerçek sitelerdeki başarı vitrininin dürüst karşılığı. Bölümler:
  - **Öğretme ilkeleri** (öğretmen kadrosu sayfası yerine): 5-6 ilke, her biri bir "kitabe" satırı ve altında somut bir uygulama. Ör. "Hata önce yapılır" ilkesinin altında "deney yanlış kurulabilir, düzeltme notu defterde kalır" uygulaması.
  - **Ölçme düzeni:** hangi sıklıkta, hangi araçla. Dönem başı tanıma, ünite sonu küçük değerlendirme, dönemde iki gelişim raporu, ortaokul ve lisede deneme sınavı takvimi, portfolyo. Rakam yok, yöntem var.
  - **Veliye nasıl haber veriyoruz:** danışmanın haftalık görüşmesi, aylık arama, dönemde iki yüz yüze görüşme, rapor örneği.
  - **Ödev ve ekran politikası:** kademe başına ödev süresi üst sınırı, cihaz kuralı.
- **Etkileşim:** "Bir gelişim raporu nasıl görünür": örnek etiketli, kurgusal ve isimsiz bir rapor kartı. Mürekkep el yazısı notları ve danışman paraflı. Açılır kapanır.
- **Dürüstlük:** Rapor kartının köşesinde "Örnek rapor, kurgusal öğrenci" mührü.

### 4.3 Almanak: akademik takvim (`/revak/almanak/`)
- Yıl boyu dönemler, resmî tatiller, ara tatiller (anaokulu ayrı), karne günleri, veli görüşme haftaları, sınav haftaları, açık kapı ve kabul tarihleri, gelenekselleşmiş etkinlikler.
- **Etkileşim:** Ay ay dikey bir almanak sayfası. Kademe filtresi (anaokulu tatili farklı). Her satırda "takvime ekleyin" (etkinlik tablosundaki ICS mantığı). "Bugün" çizgisi mühür kırmızısı.
- **Dünyaya uyumu:** Taş kitabe gibi ay başlıkları. "Almanak" adı tasarım dilinde zaten geçiyor (`almanak.css`).
- **Dürüstlük:** Resmî tatil tarihleri gerçek takvimden gelebilir (kamuya açık bilgi). Okula ait tarihler "örnek" mühürlü.

### 4.4 "Çocuğum hangi sınıfa başlar?" hesaplayıcı (kabul sayfasında bölüm + ön kayıt 1. adımına bağlantı)
- Doğum tarihi girilir. Hangi akademik yılda hangi yaş grubuna ya da sınıfa uygun olduğu, ilkokula başlama yılı ve sınırda kalan durumlar ("görüşmede değerlendiririz") gösterilir. Sonuç doğrudan ön kayıtta seçili gelir.
- **Dünyaya uyumu:** Sonuç taşa kazınmış gibi tek satır ("2027 Eylül · 1. sınıf"). Altında küçük bir zaman şeridi: çocuğun önündeki dört kemer, hangisinin altında kaç yaşında olacağı. Yürüyüşün kişiselleştirilmiş özeti olur.
- **Uyarı:** Okula başlama yaş kuralı Millî Eğitim yönetmeliğinden alınmalı ve uygulamadan önce güncel hâli doğrulanmalı. Kurgusal okulda bile yanlış bir resmî kural yazılmamalı. Sayfada "kesin sonuç kabul ofisinde" notu olsun.

### 4.5 Haftalık yemek menüsü kartı (kampüs sayfasındaki listenin derinleşmesi)
- Hafta seçici (bu hafta / gelecek hafta). İlkokul ve üstü / anaokulu sekmesi. Anaokulunda kahvaltı, öğle ve ikindi ara öğünü. Her yemekte küçük alerjen işaretleri (gluten, süt, yumurta, kabuklu yemiş, balık…) ve işaretlerin açıklaması. Vejetaryen seçenek satırı. "Beslenme ilkeleri" 3 madde.
- **Dünyaya uyumu:** Yemekhane kara tahtası değil, mürekkeple yazılmış bir defter sayfası. Bugünün satırının kenarında mühür kırmızısı çizgi.
- **Dürüstlük:** "Örnek menü" mührü. FAQ'deki "veli uygulamasında yayımlanır" cümlesiyle bağlansın.

### 4.6 Servis: güzergâh şeması (kampüs sayfasındaki semt seçicinin derinleşmesi)
- Semt seçilince stilize bir hat şeması açılır: Revak'tan semtlere uzanan mürekkep çizgiler, durak noktaları, sabah ve akşam saatleri. Gerçek harita değil, çizim. Altında servis kuralları: durakta bekleme süresi, rehber personel, çocuğu kim teslim alabilir, etüt dönüşü, ücrete dahil mi.
- **Dünyaya uyumu:** Kemerden çıkan yollar gibi, yarım kemer eğrili hatlar.
- **Dürüstlük:** Saatler "örnek" mühürlü (veri zaten `transport.districts` içinde).

### 4.7 "Güvende" sayfası: rehberlik, çocuk koruma, sağlık, acil durum (`/revak/guvende/`)
- Gerçek sitelerde dağınık duran dört konu tek sayfada:
  - **Rehberlik:** kademe başına neler yapılır, veli seminerleri (var olan etkinlikle bağlantılı), akran zorbalığına karşı adımlar
  - **Çocuk koruma:** her kademede bir sorumlu (rol olarak, adsız), kaygı nasıl iletilir (adım adım), çalışanlara verilen eğitim, gizlilik
  - **Sağlık:** revir saatleri, ilaç politikası, alerji ve kronik durum bildirimi, aşı, bulaşıcı hastalıkta okula dönüş kuralı, veliye haber zinciri
  - **Güvenlik ve acil durum:** tek giriş, ziyaretçi kuralı, çocuk teslimi (kart), yılda kaç tatbikat, deprem toplanma alanı, acil durumda veliye mesaj sırası
- **Etkileşim:** "Bir şey olursa ne olur?" senaryo kartları. Ör. "Çocuğum okulda ateşlendi" seçilince 4 adımlık zincir açılır (revir → hemşire → veli araması → kayıt). Var olan Faq bileşeniyle ya da adım listesiyle yapılabilir.
- **Dünyaya uyumu:** Sakin ve havadar sayfa. Revağın "korunaklı galeri" anlamı burada metne döner.
- **Dürüstlük:** Politika metinleri örnek; gerçek mevzuat adı geçecekse yalnızca genel ifade.

### 4.8 Kampüs tur noktaları (kampüs sayfasında yeni bölüm)
- Blender sahnesinden kuşbakışı bir kampüs planı render'ı ya da mürekkep çizimi plan. Üzerinde 8-10 nokta: revak kapısı, anaokulu bahçesi, kütüphane, laboratuvar, sahne, havuz, yemekhane, revir, orman yolu.
- **Etkileşim:** Noktaya tıklayınca yan panelde kemerli görsel, iki cümle ve "turda bunu görmek istiyorum" düğmesi çıkar. Düğme tur akışının 2. adımındaki "Özellikle görmek istedikleriniz" seçimini önceden işaretler (bu alan akışta zaten var).
- **Dünyaya uyumu:** Kemer biçimli panel. Noktalar küçük kilit taşı işaretleri.
- **Not:** 360° fotoğraf yapma; render ve tek kare yeterli.

### 4.9 Kabul: gerekli belgeler ve "kayıttan ilk güne" listesi (kabul sayfasında iki bölüm)
- **Belgeler:** kademeye göre değişen işaretlenebilir liste (kimlik bilgisi, sağlık raporu, aşı kartı, son karne, nakil belgesi, fotoğraf). Seçimler bu tarayıcıda kalır. Yazdırılabilir.
- **İlk gün:** kesin kayıttan sonra sırasıyla kıyafet, kitap ve kırtasiye listesi, servis kaydı, uyum haftası, ilk veli toplantısı.
- **Kademeye göre değerlendirme farkı:** var olan 4 adımın içinde "gözlem günü" kademeye göre açılır (anaokulu oyun, ilkokul tanışma, ortaokul ve lise kısa değerlendirme).
- **Dünyaya uyumu:** Kayıt defteri sayfası. İşaretlenen her satıra küçük mühür tiki (var olan SealMark'ın adsız hâli).

### 4.10 Ücret şeffaflığı (kabul sayfasındaki ücret bölümünün derinleşmesi)
- **"Ücrete neler dahil":** iki sütunlu kalem listesi. Dahil olanlar: eğitim, öğle yemeği, kulüplerin çoğu… Ayrı ödenenler: servis, kıyafet, yurt dışı gezileri… Ayrıca taksit seçenekleri, ödeme takvimi, iade ilkesi, ücret artışının nasıl belirlendiği.
- Rakam gerekmez. Var olan "tabloyu e-postayla gönderiyoruz" kararı korunur, ama veli neyin karşılığını ödediğini görür. Gerçek sitelerin PDF'e gömdüğü bilginin bizde açık hâli.
- **Dürüstlük:** "Örnek politika" mührü.

### 4.11 Okulumuz ve iletişim (`/revak/okulumuz/` ve `/revak/iletisim/`)
- **Okulumuz:** "Revak adı nereden geliyor" (kemerli galeri, on beş yılın altından geçilen çatı), 4-5 değer cümlesi, yönetim yapısı (rol şeması, isimsiz: kurucu kurul, okul müdürü, kademe koordinatörleri, kabul ofisi), "neye bağlıyız": ulusal program ve hangi denetimlere açığız, gerçek kurum adı vermeden.
- **İletişim:** birim bazlı iletişim kartları (kabul ofisi, muhasebe, servis, revir, rehberlik), ulaşım tarifi (özel araç, toplu taşıma, otopark), çalışma saatleri, stilize konum çizimi ve harita bağlantısı. Başlıktaki "İletişim" artık alt bilgiye kaymaz, bu sayfaya gider.
- **Veli girişi:** ölü bağlantı yerine küçük bir pencere: "Veli portalı bu konsept demonun dışında". Altında portalda neler olacağı (ödev, devamsızlık, servis konumu, menü, randevu) 5 satırla. Mevcut veliler için alt bilgide hızlı bağlantılar: takvim, menü, servis, veli girişi.

---

## 5. Gerçek sitelerin yaptığı, bizim YAPMAMAMIZ gerekenler

1. **Banner kaydırıcı ve tanıtım videosu girişi.** Revak'ın girişi tek bir sabit render ve cümle formu, öyle kalmalı.
2. **PDF yığını.** Ücret, menü, günlük saat ve takvim gerçek sitelerde PDF. Bizde her biri sayfanın içinde, telefonda okunur hâlde olmalı. En fazla "yazdır" düğmesi.
3. **İstatistik bandı ve sayaç animasyonu** (kitap, kulüp, kampüs sayısı yukarı sayarak). "Kısaca" bölümündeki rakamlar metnin içinde kalsın, sayaç olmasın.
4. **Başarı vitrini:** üniversite sonuçları, derece yapan öğrenci posterleri, yarışma ve ödül menüsü, akreditasyon logo şeridi.
5. **Markalı program kısaltması yığını.** Beş ayrı programın her birinin kısaltması olması veliyi yorar. Revak'ın tek "markası" revak ve ad mührü; ek program adı uydurmayalım.
6. **Mevzuat bağlantısı yığını.** E-güvenlik menüsündeki yönetmelik ve genelge linkleri gibi. Politika sade dille anlatılsın, mevzuat adı en fazla bir dipnot.
7. **Uzun müdür mesajı ve şablon misyon-vizyon metni.** Okulumuz sayfasında değerler kısa kitabe cümleleri olsun.
8. **Kırk öğeli mega menü.** Menü 6 başlık kalsın, alt öğeler açılır panelde en fazla 5'er.
9. **Stok fotoğraf duvarı ve galeri sayfası.** Tanınabilir çocuk yüzü yok. Görsel ihtiyacı render, eller, arkadan çekimler ve öğrenci işi (seramik, çizim) ile karşılanır.
10. **Sosyal medya akışı gömmek, açılır kampanya penceresi, ağır çerez paneli.** Çerez kullanılmıyorsa banner da gerekmez.
11. **İngilizce sloganla Türkçe site karışımı** ("… School", "Global …").
12. **Kişisel veri ve dahili hat listeleri.** Birim kartlarında yalnızca rol, genel numara ve e-posta olsun.

---

## 6. Kapsam önerisi (dikey dilim)

Mantık: Önce aday velinin karar verirken en çok aradığı ama Revak'ta olmayanlar, sonra mevcut veliye hizmet eden küçük ama "gerçek okul" hissi veren araçlar. Gerçek sitelerdeki genişliği kopyalamıyoruz; her sayfa dolu olsun.

| # | Ekleme | Tür | İş büyüklüğü | Not |
|---|---|---|---|---|
| 1 | Kademe sayfası şablonu + 4 kademe (4.1) | 4 yeni sayfa, tek şablon | **Büyük**: şablon yaklaşık 1 gün, dört kademenin metni yaklaşık 1 gün | En yüksek etki. İçerik dört kat; TR metin onayı gerekir |
| 2 | Nasıl öğretir, nasıl ölçeriz (4.2) | 1 yeni sayfa | Orta: yaklaşık 0,5-1 gün | Kanıt bölümünün dürüst karşılığı |
| 3 | Almanak takvimi (4.3) | 1 yeni sayfa | Orta: yaklaşık 0,5-1 gün | Takvime ekleme mantığı var |
| 4 | Yaş / sınıf hesaplayıcı (4.4) | Kabul sayfasında bölüm | Küçük: yaklaşık 0,5 gün | Yönetmelik doğrulaması şart |
| 5 | Güvende sayfası (4.7) | 1 yeni sayfa | Orta: yaklaşık 0,5-1 gün | Kampüsteki 4 soru buraya taşınıp genişler |
| 6 | Yemek menüsü kartı (4.5) | Kampüste bölüm derinleşmesi | Küçük: yaklaşık 0,5 gün | |
| 7 | Belgeler ve ilk gün listesi + ücret dahil kalemler (4.9, 4.10) | Kabulde iki bölüm | Küçük: yaklaşık 0,5 gün | |
| 8 | Kampüs tur noktaları (4.8) | Kampüste bölüm | Orta-büyük: yaklaşık 1 gün (kuşbakışı render dahil) | Render hattı hazır; plan render'ı yeni iş |
| 9 | İletişim sayfası + veli girişi penceresi + hızlı bağlantılar (4.11) | 1 yeni sayfa + küçük düzeltme | Küçük: yaklaşık 0,5 gün | Ölü bağlantı en ucuz kazanç |
| 10 | Okulumuz sayfası (4.11) | 1 yeni sayfa | Küçük-orta: yaklaşık 0,5 gün | Kesilebilir |

- **Toplam:** yaklaşık 9 yeni sayfa ve 5 bölüm derinleşmesi. Ajan işiyle kabaca **6-8 iş günü**. En büyük kalem kod değil Türkçe metin yazımı ve onayı (her yeni metin önce Raşit'e).
- **Daha dar bir ilk dilim istenirse:** 1 (yalnız ilkokul ve anaokulu) + 2 + 3 + 4 + 9. Yaklaşık 3-4 gün. "Gerçek okul kadar detay" hissini en çok bunlar verir.
- **Bu turda yapılmaması önerilenler:** haber ve duyuru bölümü (örnek haber yazmak, kurgusal olay uydurmaya kayar; istenirse en sonda 3 yazı), galeri, kariyer, mezunlar, İngilizce sürüm.
- **Sıra önerisi:** 9 → 4 → 1 → 2 → 3 → 5 → 6/7 → 8 → 10. Ucuz düzeltme önce, imza niteliğindeki kademe sayfaları ortada, render isteyen iş sonda.
- **Dikkat:** Menü yeniden kurulmalı. Önerilen başlıklar: Okulumuz (hikâye, nasıl öğretiriz, güvende) · Eğitim (dört kademe, rehberlik) · Kampüs ve yaşam (kampüs, tur noktaları, bir gün, kulüpler, servis, yemek) · Kabul · Almanak · İletişim. Şu an "Eğitim" ve "Okulumuz" ana sayfadaki bölümlere gidiyor; kademe sayfaları gelince bu bağlantılar değişir.

---

## Kaynaklar (yalnız yapı için okundu)

- https://mujgancetinokullari.k12.tr/ · /birim/ortaokul · /birim/anaokulu · /iletisim
- https://www.koc.k12.tr/ · kayıt-kabul: okul ücretleri, burs olanakları ve indirimler, aday öğrenci süreçleri · ortaokul kademe sayfası
- https://www.eyuboglu.k12.tr/ · /yemek · /servis · /saglik · /guvenlik · /ogrenci-kabul-sartlari · /akademik-takvim · /rehberlik · /anaokulu
- https://www.enka.k12.tr/istanbul/ · quick-links/lunch-menu · our-campus/transportation · quick-links/schools-daily-opening-closing-hours · student-life/child-protection-program · admissions/application-process · admissions/tuition · admissions/financial-aid
