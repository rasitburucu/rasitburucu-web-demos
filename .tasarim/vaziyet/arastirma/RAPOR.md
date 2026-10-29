# Vaziyet (ilk çalışma adı Pafta) — prefabrik / modüler / çelik ev üreticisi siteleri, mevzuat ve isim araştırması

- Tarih: 2026-10-09 · Amaç: kurgusal "Vaziyet" (ilk çalışma adı "Pafta"; arsa sahibine prefabrik ve hafif çelik ev satan üretici) konsept sitesinin brif ve yön aşamasına girdi.
- Yöntem: arama (WebSearch, DuckDuckGo HTML; DuckDuckGo birkaç sorgudan sonra robot doğrulaması istedi, orada bırakıldı) → **17 site** incelendi: planda adı geçen 6 site + 11 yeni (9 üretici, Karmod'a bağlı ikinci alan adı prefabrik.com ve bir içerik sitesi). Her site Playwright ile 1440 ve 390 genişlikte açıldı, ilk ekran görüntüsü `../ekran/arastirma/{ad}-1440.png` ve `{ad}-390.png` (bu klasör git'e girmez). Fiyat, ruhsat, SSS ve model sayfaları metin olarak okundu. Koçtaş'taki pazaryeri ilanları otomatik tarayıcıya 403 döndü; o satır arama dizini özetinden alındı ve öyle işaretli.
- Hiçbir sitede form gönderilmedi, çerez bandına tıklanmadı. Bir sitede (Nestavilla) taramadaki bağlantı izleyici katalog PDF'ine denk geldi; dosya kaydedilmedi, betik PDF ve görsel bağlantılarını atlayacak biçimde düzeltildi.
- Ölçüm kısıtı: yükleme süresi tek ölçüm, ilk ziyaret (önbellek yok); sayfa ağırlığı `transferSize` toplamı, yani alt sınır (başka alan adından gelen dosyalar 0 sayılabilir).
- Mevzuat bölümü (3) birincil kaynaklardan derlendi; kesin olmayan her şey "teyit edilmeli" diye işaretli. Gerçek firma adları yalnız bu araştırmada geçer; kurgusal siteye ad, metin, görsel taşınmaz.

---

## 1. İncelenen siteler

### 1a. Kimlik, ilk ekran ve satış yolu

| # | Firma · alan adı | Yer (sitede/telefonda) | Ürün | İlk ekranın (1440) söylediği | Satış yolu |
|---|---|---|---|---|---|
| 1 | Karmod · karmod.com | Tuzla, İstanbul | Prefabrik ve çelik ev, konteyner, şantiye-okul-kamp yapıları | Şantiye kampı slaytı ("İhtiyaca Yönelik Tasarım ve Üretkenlik"); konut ikinci planda | 444 hattı, WhatsApp, model başına "Fiyat Al" formu |
| 1b | prefabrik.com | Karmod'la aynı adres ve 444 20 35 hattı | Aynı | "Prefabrik Yapıların Önemi ve Özellikleri" | Telefon, form. Markasız ikinci alan adı (aynı firma olduğu güçlü işaret, doğrulanmadı) |
| 2 | Prefabrik Evim · prefabrikevim.com (logoda "idealev") | Cep telefonu, il yok | Prefabrik, çelik ev, konteyner, tiny house | Model fotoğrafı ızgarası, "Kampanyalı evler" | Telefon, WhatsApp, yol tarifi; 17 dilli çeviri menüsü (makine çevirisi) |
| 3 | Çelik Yapım Merkezi · celikyapimmerkezi.com | Sakarya (tesis) | Tek/çift katlı prefabrik ev, prefabrik villa | Çerez bandı + slaytta "₺1.050.000,00" | Telefon, WhatsApp, form; il il fiyat sayfaları (Sivas, Kayseri, Mersin…) |
| 4 | Hane House · hanehouse.com | İstanbul (0212) | Tekerlekli tiny house | Gece çekimi tiny house fotoğrafı | Telefon, form; fiyat avro |
| 5 | Mooble House · mooblehouse.com | İstanbul (0212) | Tiny house | Kampanya açılır penceresi + çerez bandı ilk ekranı tümüyle kapatıyor | Telefon, e-katalog |
| 6 | MB Tiny House · mbtinyhouse.com | Cep telefonu | Tiny house (O2/O3), modüler | Karanlık video üstünde logo, çerez bandı | WhatsApp, telefon; fiyat yok |
| 7 | **Aktaş Prefabrik Ev** · aktasprefabrikev.com | Sakarya Söğütlü (tesis) | Tek/çift katlı prefabrik, çelik ev | "Prefabrik evi kendi fabrikamızda üretiyor, çalışır teslim ediyoruz." + 3B montaj animasyonu + "40 m² 483.700 ₺'den" | Telefon, WhatsApp, teklif formu, **fiyat hesaplayıcı**, **3B ev tasarlayıcı**, keşif; EN/DE |
| 8 | Makro Prefabrik · makroprefabrik.com | İstanbul (0216) | Prefabrik ev + şantiye, okul, yemekhane yapıları | Fabrika makinesi fotoğrafı, "Güçlü Üretim Altyapısı" | Telefon, WhatsApp; fiyat tablosu |
| 9 | Modern Prefabrik · modernprefabrik.com.tr | Cep telefonu | Prefabrik, çelik ev | "Prefabrik Ev 695.000 TL'den" koyu fotoğraf üstünde | "WhatsApp'tan fiyat al", telefon |
| 10 | Smart Çelik Yapı · smartcelikyapi.com | Ankara (0312) | Çelik, modüler, prefabrik ev | "Ankara Çelik Ev Modelleri ve Fiyatları 2026" + havuzlu villa render'ı | Telefon, WhatsApp, teklif; **2B ev planı stüdyosu** |
| 11 | SerVilla · servilla.net | İstanbul (0216) | Hafif çelik villa | "Geleceğin Yapı Teknolojisiyle Lüksü Yeniden Tanımlayın" + havuzlu villa + sayaçlar | Telefon, WhatsApp; **120 ay iç finansman** |
| 12 | Nestavilla (Vefa Group) · nestavilla.com | İstanbul (0216) | Fugalı panel prefabrik, hafif çelik, modül ev | Ev fotoğrafı kolajı + çerez bandı | **Bayi ve satış noktası ağı**, WhatsApp; fiyat yok |
| 13 | Pramo · pramo.com.tr | İstanbul (0216) | Prefabrik, hafif çelik, konteyner, kabin, modüler | Fabrika makinesi fotoğrafı, "Büyük ve Prestijli Projeler Pramo ile Başlar" | Telefon, WhatsApp, bayilik |
| 14 | İkranur Prefabrik · ikranurprefabrik.com | 444 hattı | Çelik ev, prefabrik | "Hayalinizdeki Çelik Eve İlk Adımı Atın" + havuzlu villa render'ı | 444 hattı |
| 15 | Ender Çelik Yapı · endercelikyapi.com.tr | Kartal, İstanbul | Çelik ev, prefabrik | "Çelik Evler" yazısı karışık fotoğraf üstünde (telefonda okunmuyor) | Telefon (bağlantı bozuk), WhatsApp, form |
| 16 | Sismik Prefabrik & Çelik Yapı · Koçtaş pazaryeri | — | Prefabrik çelik ev | (ilan sayfası; 403, arama dizini özetinden) | Pazaryerinde sepete ekle |
| — | Prefabrikhane · prefabrikhane.com | — | **Üretici değil**, reklamlı içerik sitesi | Blog ızgarası | Fiyat ve ruhsat aramalarında üretici sitelerinin önünde çıkıyor |

### 1b. Fiyat, kapsam ve süre

| Firma | Fiyat gösterimi | Örnek (Ekim 2026) | Fiyata dahil / hariç | Süre |
|---|---|---|---|---|
| Karmod | Tablo, "başlangıç seviyesinde"; model kartında fiyat + "Fiyat Al" | 28 m² 1+0 401.768 TL · 64 m² 2+1 628.486 TL · 100 m² 3+1 940.576 TL · 126 m² 1.659.103 TL | "Standart koşullar"; kapsam tabloda yazmıyor | Yazmıyor (SSS başlığı var, cevap kapalı) |
| Prefabrik Evim | Model kodlu tablo (44 kod), "son güncelleme 21 Ağustos 2026" | 33 m² 1+1 429.000 TL · 70 m² 2+1 699.000 TL | Fabrika teslim, KDV hariç; **ruhsat, zemin betonu, parke, fayans, mutfak dolabı, vitrifiye, nakliye, montaj ekibinin yemek ve konaklaması hariç** | — |
| Çelik Yapım Merkezi | Tablo + **TL/m² sütunu**, "son güncelleme 22 Eylül 2026" | 40 m² 452.000 TL (11.300 TL/m²) · 82 m² 3+1 710.000 TL · çift kat 940.000 TL'den | Zemin betonu ve hafriyat hariç, nakliye teklifte; "liste fiyatı ile arsada tamamlanmış toplam maliyet aynı değildir" diye açıkça yazıyor | — |
| Hane House | Avro aralığı + opsiyon fiyatları | €40.750–64.000; İroko cephe +€1.000 | Plakalı-ruhsatlı (araç) teslim, kurulum aynı gün | **30–45 iş günü** |
| Mooble House | Fiyat yok | — | 24 ay garanti | 45 gün |
| MB Tiny House | Fiyat yok ("Ücret için teklif alın") | — | O2/O3 tip onaylı | — |
| **Aktaş** | 57 modelin liste fiyatı açık; m² cetveli; hesaplayıcı | 40 m² 483.700 TL · 75 m² 711.800 TL · 98 m² 914.800 TL · 82 m² çift kat 997.800 TL; çelik ev "fiyat sorun" | **Dahil:** montaj, elektrik ve sıhhi tesisat, doğrama, iç kapı, boya. **Ayrı satır:** beton temel (projesi üreticiden, dökümü arsa sahibinden), nakliye, vinç, altyapı abonelikleri | **Temel hazırsa montaj 3–7 gün** |
| Makro | Tablo | 40 m² 1+1 369.600 TL · 61 m² 2+1 507.000 TL | "İstanbul dışına nakliye ekstra masraf çıkarır" | — |
| Modern | "695.000 TL'den" + rehber sayfaları | 76 m² 695.000 TL · 92 m² 645.000 TL (büyük model ucuz: sıra tutarsız) · çift kat 101 m² 1.010.000 TL | "Teklifte dahil/hariç yazılı paylaşılır"; statik proje ve ruhsat evrakını hazırladığını yazıyor | — |
| Smart Çelik | m² formülü | 80 m² × 19.000 TL/m² = 1.520.000 TL "başlangıç hesabı" | Temel, nakliye ve saha koşulları kesin teklifte | — |
| SerVilla | Anahtar teslim toplam + 120 ay vade tablosu | 135 m² tek kat 3+1 hafif çelik 4.387.500 TL | **50 cm su basman temeli, statik projeler ve montaj dahil** | ~60 gün kurulum |
| Nestavilla | Fiyat yok | — | 1 yıl garanti (imalat ve montaj hatası) | "Sözleşmede taahhüt edilen sürede" |
| Pramo | Fiyat yok (e-katalog) | — | — | — |
| İkranur | Aralık | 150 m² çift katlı çelik ev "anahtar teslim" 3,7–4,5 M TL | Temel ve zemin projeye göre | — |
| Ender | "Katalog / Fiyat Listesi" sayfası **boş**; blogda başka kaynaklardan 7.500–30.000 TL/m² | — | — | — |
| Sismik (Koçtaş) | Pazaryeri liste fiyatı | 72 m² 775.000 TL · 98 m² 995.000 TL · çift kat 101 m² 1.271.000 TL | Dahil: kurulum, panel, çatı, kapı-pencere, sıva altı tesisat, boya. Hariç: nakliye ve sigorta, vinç-iskele, zemin betonu ve kazı, zemin kaplama, yalıtım (arama dizini özeti, sayfa doğrulanamadı) | — |

Temel bedeli için tek ulaşılabilen kamuya açık aralık bir içerik sitesinden: prefabrik ev, 30 cm radye temel **2.800–3.500 TL/m²**; zemin etüdü 15.000–30.000 TL (Prefabrikhane, 6 Haziran 2026; kaynak belirtilmemiş, aynı yazıda çelişen rakamlar var → yalnız `[örnek]` olarak kullanılır). Nakliye ve vinç için kamuya açık rakam bulunamadı.

Model ölçüsü: Aktaş model sayfası **dış ölçüyü ve oda ölçülerini** yazıyor (ör. 62 m² 2+1 için 7,73 × 7,57 m, "çizimden okundu, ±2 cm tolerans"). Karmod 100 m² sayfasının metninde dış ölçü yok. Yani "ev arsaya sığar mı" hesabı için gereken veri sektörün en iyi sitesinde zaten var; hesap yapılmıyor.

### 1c. Ruhsat ve güven iddiaları (riskli olanlar işaretli)

| Firma | İddia (kısa alıntı ya da özet) | Değerlendirme |
|---|---|---|
| Hane House | Modeller O2 tip onaylı "çekme karavan" statüsünde; "imarlı veya imarsız tüm arazilerinizde, ekstra bir yapı ruhsatına ihtiyaç duymadan yasal olarak" konumlandırılabilir | **YÜKSEK RİSK.** Araç statüsü yapı ruhsatı sorusunu çözebilir; ama arazinin tarım dışı kullanımı (5403), kalıcı yaşam ve altyapı bağlantısı ayrı konular. Bkz. bölüm 3 |
| Pramo | "Ruhsat istemeyen prefabrik evler": "genellikle 100 m²'nin altında" yapılar; "tarla veya bahçelerde yaşam alanı… uygun bir çözüm" | **YÜKSEK RİSK.** 100 m² eşiğinin mevzuat dayanağı gösterilmiyor. Aynı sitenin "prefabrik ev nasıl yapılır" sayfası imar durumu ve yapı ruhsatı adımlarını sayıyor: kendi içinde çelişki |
| Prefabrik Evim | Tiny house kategorisi "imarsız arsalarda büyük problem olan ev yapılarına" çözüm gibi sunuluyor; "ruhsatlı ve plakalı olduğundan imar iznine tabi olmamaktadır" | **ORTA-YÜKSEK.** Aynı sayfada doğru uyarı da var: "Prefabrik evlerde imar izni olmadan resmi olarak bir ev yapmak mümkün değildir" |
| Mooble House | "Mobil eviniz araç statüsündedir, plakalı ve ruhsatlıdır." | **ORTA.** Doğru ama eksik; "ruhsatlı" araç ruhsatıdır, yapı ruhsatı sanılabilir |
| Karmod | Fiyat listesinde "28 m² 1+0 Prefabrik **Hobi Bahçesi**" model adı; "tarla üzerine yapılacak evin arsa büyüklüğünün en az 10.000 m² olması durumunda evin maksimum 500 m² ile sınırlandırıldığı belirtilir" | **ORTA.** "Hobi bahçesi" adıyla ürün satmak; 10.000 m² / 500 m² rakamının dayanağı yazmıyor, mevzuattaki eşiklerle örtüşmüyor (bölüm 3) |
| Makro | "Hobi bahçesi sahibi olan insanlar tarafından çokça tercih"; "temel gerektirmeyen… malzemelerden" | **ORTA.** Aynı sitede "Ruhsatsız prefabrik ev yapmanın cezaları" yazısı da var |
| Nestavilla | "Depreme dayanıklıdır, yıkılmaz." | **ORTA** (ruhsat değil, mutlak güvenlik iddiası) |
| SerVilla | "Bankasız, kefilsiz 120 ay vadelendirme… faizsiz… kredi puanınıza bakılmaz" | **ORTA-YÜKSEK** (finansal; tüketici ve mevzuat açısından avukat görüşü gerekir) |
| İyi örnekler | **Aktaş**: arsa türüne göre yol haritası (imarlı, köy yerleşik alanı, tarla, imarsız), 2026 değişikliklerini tarihle anlatıyor, "Bu sayfa bilgilendirme amaçlıdır, hukuki görüş değildir", "parselin izin durumunu bilmeden sipariş almıyoruz". **İkranur**: "5 dönüm tarlaya ev yapılır", "ruhsat istemez", "muhtardan izin yeter", "tarlanın %5'ine ev" mitlerini tek tek ele alıyor. **prefabrik.com**: belediyelerin "tarla ya da ruhsat olmayan arazilere ev yaptırmadığını", yapılsa da yıkım riski olduğunu yazıyor. **Smart**: plan stüdyosunda "otomatik kontrol ruhsat, statik proje… imar uygunluğu onayı değildir". **Karmod blogu**: kalıcı konteyner evde ruhsatın "çoğu durumda" gerektiğini yazıyor | Dürüst ruhsat panelinin sektörde metin olarak karşılığı var; araç olarak yok |

### 1d. Mobil ve teknik

| Firma | Masaüstü yük. (sn) | Mobil yük. (sn) | Ağırlık (MB, alt sınır) | WordPress | Yatay taşma | Göze batan |
|---|---|---|---|---|---|---|
| Karmod | 4,5 | 0,3 | ~11 | – | – | İlk ekran konut değil şantiye kampı |
| Prefabrik Evim | 0,9 | 0,7 | ~5,9 | + | – | Alan adı "Prefabrik Evim", logo "idealev" |
| Çelik Yapım Merkezi | 1,9 | 1,8 | ~7,7 | + | – | Çerez bandı ilk ekranı kapatıyor |
| Hane House | 4,3 | 3,8 | ~1,5 | + | – | — |
| Mooble House | **32,9** | **23,1** | ~11,9 | + | – | Kampanya penceresi + çerez bandı ilk ekranın tamamı |
| MB Tiny House | 0,3 | 0,2 | ~6,7 | + | **154 px (masaüstü)** | jQuery hatası |
| Aktaş | 0,7 | 0,7 | ~3,3 | – | – | Çerez bandı; görsel dil "premium editoryal" kalıbı |
| Makro | 1,7 | 1,4 | ~11 | – | – | Konut ve şantiye yapıları aynı menüde |
| Modern | 1,1 | 1,0 | ~2,6 | – | – | Rehberde fiyat sırası tutarsız |
| Smart Çelik | 1,1 | 0,6 | ~0,8 | – | – | — |
| SerVilla | 3,5 | 2,1 | ~4,3 | – | – | Doğrulanamayan sayaçlar ("2000+ proje") |
| Nestavilla | 1,6 | 1,5 | ~3,9 | – | **100 px (masaüstü)** | Çerez bandı |
| Pramo | 2,4 | 1,2 | ~3,9 | + | – | İki sayfası birbirini yalanlıyor (ruhsat) |
| İkranur | 1,1 | 0,9 | ~1,4 | – | – | — |
| Ender | 1,1 | 0,9 | ~5,9 | – | – | **Telefon bağlantıları bozuk** (`tel:` adresinde "çelik ev" metni), fiyat listesi sayfası boş, 3 JS hatası |

Telefonda alt sabit Ara/WhatsApp/Teklif çubuğu 6 sitede var (Karmod, Prefabrik Evim, Çelik Yapım Merkezi, Aktaş, Modern, Smart): sektörde beklenen bir kalıp.

---

## 2. Sentez

### 2.1 Ziyaretçi ne soruyor (sitelerin neye en çok sayfa ayırdığına göre)

| Sıra | Soru | Kanıt |
|---|---|---|
| 1 | **Kaça mal olur, hepsi dahil mi?** | Her üreticide "fiyatlar 2026" sayfası; dahil/hariç dipnotları; "anahtar teslim" sözcüğü üç farklı kapsamda kullanılıyor |
| 2 | **Arsama/tarlama kurabilir miyim, ruhsat gerekir mi?** | İncelenen sayfalarda 17 sitenin 15'inde ruhsat, tarla, hobi bahçesi ya da imar sözü geçiyor (yalnız MB Tiny House ve Nestavilla'da yok); içerik siteleri de aynı aramayı hedefliyor |
| 3 | **Hangi model, kaç m², kaç oda?** | Model ızgaraları, m² cetveli (Aktaş), model kodları (Prefabrik Evim) |
| 4 | **Ne kadar sürede?** | Tiny house 30–45 iş günü, villa ~60 gün, montaj 3–7 gün; çoğu sitede yok |
| 5 | **Depreme dayanıklı mı, kaç yıl gider?** | SSS'lerin değişmez maddesi; bazen mutlak iddiayla ("yıkılmaz") |
| 6 | **Ödeme, taksit, kredi?** | SerVilla 120 ay; "prefabrik eve konut kredisi çıkar mı" SSS'leri |
| 7 | **Kime güveneyim?** | Fabrikayı ziyaret daveti, Google yorumları (Aktaş 157), bayi ağı (Nestavilla) |

**Cevapsız soru:** "Bu ev arsama sığar mı, nereye oturur, ne kadar bahçe kalır?" Sektörün en iyi sitesi bile bunu keşfe bırakıyor: Aktaş, imarsız arsa sayfasında "dar ve uzun parsellerde ev yerleşimi keşifte birlikte belirleniyor" diyor. Vaziyet'in imza aracı tam bu boşluğa oturuyor.

### 2.2 Ortak eksikler

| Sorun | Somut örnek |
|---|---|
| Fiyatlar karşılaştırılamıyor: kapsam dipnotta ve her sitede farklı | 100 m² civarı için Karmod'da "başlangıç" 0,94 M TL (kapsam yok), SerVilla'da 135 m² "anahtar teslim, temel dahil" 4,39 M TL; Prefabrik Evim KDV hariç fabrika teslim |
| Ruhsat konusunda iki uç, arada araç yok | "Ruhsat gerekmez" (Hane, Pramo) ↔ binlerce kelimelik SEO yazıları; arsa ölçüsüyle konuşan tek bir hesap yok |
| Konut ile şantiye/kamp/yemekhane aynı menüde | Karmod ilk ekranı şantiye kampı; Makro, Pramo, Prefabrik Evim menüleri |
| Orta gelirli aileye uzak görseller | Havuzlu villa render'ları (Smart, SerVilla, İkranur), "Lüksü yeniden tanımlayın" |
| İlk ekranı kapatan pencereler | Mooble (kampanya + çerez), Çelik Yapım Merkezi, MB Tiny, Aktaş, Nestavilla (çerez) |
| Bozuk, boş, tutarsız | Ender'de telefon bağlantıları ve fiyat listesi; Modern'de büyük modelin ucuz görünmesi; MB ve Nestavilla'da masaüstünde yatay taşma |
| Kopya şehir sayfaları | "Sivas / Kayseri / Mersin / Samsun / Adana prefabrik ev fiyatları" (Çelik Yapım Merkezi), "İzmit / Bolu / Bursa" (Aktaş) |
| Ağır ve yavaş | Mooble 33 sn, ~12 MB; Karmod ve Makro ~11 MB |

### 2.3 İyi yapılanlar (fikir olarak; metin, görsel, kod alınmaz)

| Fikir | Kimde | Vaziyet'teki karşılığı |
|---|---|---|
| Bütün modellerin liste fiyatı açık; hesaplayıcı yeni rakam üretmez, en yakın gerçek modeli gösterir | Aktaş | Araçtaki fiyat model listesinden gelir; "tahmini" yalnız nakliye ve temel aralığında |
| Dahil / dahil değil listesi, temel-nakliye-vinç ayrı satır | Aktaş, Prefabrik Evim, Koçtaş ilanı | Maliyet dökümü: fabrika teslim + nakliye + temel + vinç; altında "bu tutara dahil değil" |
| TL/m² sütunu ve "son güncelleme" tarihi | Çelik Yapım Merkezi | Fiyat tablosunda güncelleme tarihi |
| Arsa türüne göre izin yol haritası, "hukuki görüş değildir" | Aktaş | Dürüst ruhsat paneli + rehber sayfası |
| Model sayfasında dış ölçü ve oda ölçüleri | Aktaş | Modelin dış ölçüsü araçta kullanılır, model sayfasında yazar |
| Kat planı editörü, kuzey yönü, sorumluluk reddi | Smart | Kuzey oku ve salon cephesi; "ön kontrol ruhsat onayı değildir" |
| Teslim süresi model kartında; opsiyon fiyatları açık | Hane House | Model kartında üretim haftası |
| Bayi ve satış noktası ağı | Nestavilla | Gerçek müşteride "size en yakın satış noktası" |
| Mobilde alt sabit çağrı çubuğu | 6 site | Ara · WhatsApp · Talebimi gör |

### 2.4 Sektörde en iyi site: Aktaş Prefabrik Ev
Neden: 57 modelin fiyatı ve kat planı açık, model sayfasında dış ölçü, fiyat hesaplayıcı, 3B ev tasarlayıcı (360°, iç mekân, arsa fotoğrafına yerleştirme), dahil/hariç listesi, arsa türüne göre izin rehberi (2026 değişiklikleri tarihli), Google yorumları, hızlı (0,7 sn, ~3,3 MB), EN/DE.
Eksikleri (Vaziyet'in farkı): (1) evin arsaya imar değerleriyle sığıp sığmadığı, nereye oturduğu ve ne kadar bahçe kaldığı yok; (2) 3B tasarlayıcı evi gösteriyor, arsayı ölçüsüyle değil; (3) görsel dili markaya özgü değil: krem zemin, iri serif başlığın ikinci satırı italik bordo, aralıklı büyük harf künyeler (atölyenin "premium editoryal" kalıbı). Vaziyet'in görsel yönü bu kalıba da düşmemeli.

### 2.5 Görsel dil ve klişeler
- **Ortak dil:** karartılmış fotoğraf üstünde beyaz başlık ve slayt; havuzlu villa render'ı; turuncu/yeşil/kırmızı düğmeler; sayaçlar ("18+ yıl", "2000+ proje"); yüzen WhatsApp balonu; çerez bandı.
- **Klişe metin:** "Hayalinizdeki ev", "Geleceğin yapı teknolojisi", "Lüksü yeniden tanımlayın", "Depreme dayanıklı", "Anahtar teslim" (kapsamı belirsiz).
- **Az kullanılan sahici nesneler:** kat planı ve dış ölçü, m² cetveli, panel kesiti, temel projesi, tır yükleme, montaj günü, imar durumu belgesi, aplikasyon krokisi. Vaziyet'in görsel dünyası bunlardan kurulabilir.

### 2.6 Satış yolu
Telefon ve WhatsApp hâkim; model başına teklif formu; Aktaş'ta hesaplayıcı ve tasarlayıcıdan teklife; Nestavilla'da bayi ağı; Koçtaş'ta pazaryeri sepeti; SerVilla'da iç finansman; Aktaş'ta keşif ve tesis ziyareti. Online ödeme yalnız pazaryerinde. Sitenin işi siparişi kapatmak değil, **doğru arsaya doğru modelle hazırlanmış bir talebi** satış ekibine getirmek.

---

## 3. Mevzuat

Kaynak: mevzuat.gov.tr güncel (konsolide) metinleri, 2026-10-09'da açıldı: Planlı Alanlar İmar Yönetmeliği (PAİY, RG 03.07.2017/30113; metindeki son değişiklik izleri RG 28/1/2025, 11/3/2025, 13/8/2025, 14/1/2026, 1/7/2026), Plansız Alanlar İmar Yönetmeliği (son değişiklik izi RG 17/10/2024), 3194 sayılı İmar Kanunu, 5403 sayılı Toprak Koruma ve Arazi Kullanımı Kanunu. Bu bölüm için başlatılan ayrı araştırma ajanı oturum sınırı yüzünden sonuç vermeden düştü; aşağıdakiler doğrudan bu metinlerden okundu. Okunamayanlar "teyit edilmeli" diye işaretli. Bu bölüm hukuki görüş değildir.

### 3.1 Aracın varsayılan değerleri

| Değer | Varsayılan | Kaynak | Kesinlik |
|---|---|---|---|
| Ön bahçe | en az 5,00 m (yol kenarı ve kamusal alana komşu bahçeler dahil) | PAİY md. 23(1)(a): "Uygulama imar planında, aksine bir hüküm bulunmadığı durumlarda…" | Kesin (planda aksi yoksa) |
| Yan bahçe | en az 3,00 m | PAİY md. 23(1)(b) | Kesin |
| Arka bahçe | en az 3,00 m | PAİY md. 23(1)(c) | Kesin. **Prototiplerdeki "H/2" kuralı kaldırıldı**: güncel yönetmelikte yok; eski bazı planlarda yazabilir, o zaman belgeden okunur |
| Kat artışı | 4'ten fazla katlı binada her kat için yan ve arka +0,50 m | PAİY md. 23(1)(ç) | Kesin; 1–2 katlı prefabrik konutta etkisiz |
| Yükseklik | "Binanın kot aldığı noktadan saçak seviyesine kadar olan… yüksekliği" | PAİY md. 4, "Bina yüksekliği" | Kesin; araç Hmax'ı modelin **saçak** yüksekliğiyle karşılaştırır |
| Saçak | planda yoksa en çok 1,00 m; parsel sınırını aşamaz | PAİY md. 42 | Kesin; saçağın bahçe mesafesine girip giremeyeceği plana ve idareye göre değişebilir (teyit edilmeli) |
| TAKS | "Taban alanının imar parseli alanına oranı" | PAİY md. 4 | Kesin. Dikkat: oran tapudaki alana değil **imar parseline** göre; yola terk varsa alan küçülür (araçta not) |
| KAKS (emsal) | "Yapının inşa edilen tüm kat alanlarının toplamının imar parseli alanına oranı" | PAİY md. 4 | Kesin; emsale girmeyen alanlar ayrı hesap ister, araç modelin toplam alanını kullanır ve "tahmini" yazar |
| TAKS / KAKS sayısı | Yönetmelikte genel varsayılan yok; plan ve imar durumu belgesi verir | — | Demoda 0,30 / 0,60 yalnız `[örnek]` |
| İskân dışı (plansız) alanda konut | inşaat alanı katsayısı en çok %5, toplam en çok 250 m², saçak 7,50 m ve 2 kat, yola 5,00 m, parsel sınırlarına 3,00 m (md. 63); ifrazla oluşacak her parsel en az 5.000 m² ve kamu yoluna en az 25 m cephe (md. 62) | Plansız Alanlar İmar Yönetmeliği md. 62–63 ("bir ailenin oturmasına mahsus bağ ve sayfiye evi") | Kesin (metin). Parsel tarım arazisiyse 5403 izni ayrıca gerekir (iki mevzuatın birlikte uygulanması teyit edilmeli) |

Karmod'un fiyat sayfasındaki "tarla üzerine yapılacak evin arsa büyüklüğünün en az 10.000 m² olması durumunda evin maksimum 500 m²" cümlesinin bu yönetmeliklerde karşılığı bulunamadı.

### 3.2 İmar durumu belgesinde değerler nasıl yazar
- Belgeyi parselin bağlı olduğu belediye verir (belediye ve mücavir alan dışında il özel idaresi). Ulusal tek tip bir form bu çalışmada bulunamadı; düzen belediyeye göre değişir (teyit edilmeli).
- Tipik satırlar (sektör rehberleri ve plan kısaltmaları): ada/parsel, pafta, plan türü ve ölçeği, kullanım ("konut alanı"), nizam ve kat adedi ("A-2": ayrık nizam 2 kat), TAKS, KAKS ya da "Emsal / E=0,60", "Hmax" ya da "Yençok", bahçe mesafeleri (ön/yan/arka), plan notları. Birçok belediye aynı bilgiyi e-imar ekranında ada-parsel sorgusuyla gösterir.
- Tapudaki **nitelik** (arsa, tarla, bağ, bahçe) imar durumundan ayrıdır; "tarla" yazıyorsa tarım mevzuatı (5403) devreye girer. Araçtaki "Tapuda: Arsa / Tarla / Bilmiyorum" seçimi bu yüzden var.

### 3.3 Ruhsat
- 3194 md. 21: "Bu Kanunun kapsamına giren bütün yapılar için 26 ncı maddede belirtilen istisna dışında belediye veya valiliklerden… yapı ruhsatiyesi alınması mecburidir." Prefabrik ya da çelik olmak istisna değildir.
- 3194 md. 27: belediye ve mücavir alan dışında köy yerleşik alanında ve civarında konut için yapı ruhsatı aranmaz; ama etüt ve projelerin valilik onayı ve muhtarlığa bildirimi, fen ve sağlık kurallarına uygunluk zorunludur.
- 3194 md. 32 ve 42: ruhsatsız ya da aykırı yapı mühürlenir, durdurulur; idari para cezası uygulanır.
- Tekerlekli tiny house: O2 tip onaylı römork olarak plakalandığında araç statüsünde sayıldığı, sabitlendiğinde, altyapıya bağlandığında ya da sürekli konut olarak kullanıldığında yapı sayılma riski taşıdığı hukuk bürosu yazılarında ve haberlerde geçiyor; tarım arazisinde 5403 ayrıca uygulanır. Birincil düzenleme bu çalışmada açılmadı → **teyit edilmeli**.

### 3.4 Tarım arazisi (5403)
- md. 21 (güncel metin): tarım dışı kullanıma izinsiz başlanırsa valilik işi durdurur, iş bitmişse kullanımına izin vermez; "kullanılan veya zarar verilen alanın her metrekaresi için iki bin beş yüz Türk Lirası idarî para cezası" (en az 1.000 TL), büyük ova koruma alanında iki katı; iki ay içinde yıkılmazsa üç katı.
- md. 21'e **11/6/2026 tarihli 7584 sayılı Kanun md. 25** ile eklenen fıkra: "Bu Kanun uyarınca izin alınmadan yapılmış her türlü yapı ve tesise… elektrik, su ve doğal gaz bağlantısı ve abonelikleri tesis edilmez." Aykırı davranan kuruma abone başına 100.000 TL. mevzuat.gov.tr değişiklik tablosuna göre 7584 sayılı Kanun 5403'ün 8, 20 ve 21. maddelerini değiştirdi, yürürlük 20/6/2026. (Metre kare cezasının 10 TL'den 2.500 TL'ye bu kanunla çıktığı Aktaş'ın yazısında geçiyor; birincil metinde güncel tutar 2.500 TL.)
- md. 21'de "fiili hisse" hükmü: tarım arazisini tescili mümkün olmayan fiili hisselerle bölerek bütünlüğünü bozanlara 1–3 yıl hapis ve adli para cezası, aracı tüzel kişiye 50.000–250.000 TL idari para cezası (güncel metin; hangi değişiklikle eklendiği teyit edilmeli).
- Tarım arazisinin tarım dışı kullanımı izne bağlıdır (md. 13 ve 14); izin yolu ve "tarımsal amaçlı yapı" kriterleri yönetmelikte. Aktaş'ın aktarımına göre bağ evi için asgari arazi 2026'da 5 hektardan 2 hektara inmiş, taban alanı 30 m² esas alınıyor → birincil metin açılmadı, **teyit edilmeli**.
- Sonuç: "Tapuda tarla yazıyorsa kalıcı konut ruhsatı alınamaz" cümlesi aile için doğru genel uyarıdır; istisnalar (tarımsal amaçlı yapı izni, köy yerleşik alanı, plan değişikliği) avukat ya da mimar teyidiyle ayrı sayfada anlatılmalı.

### 3.5 2025 sonrası izinsiz yapı düzenlemeleri
- 7584 sayılı Kanun (11/6/2026, yürürlük 20/6/2026): 5403'te abonelik yasağı ve ceza hükümleri (3.4).
- PAİY'de 2025–2026'da beş değişiklik izi var (3. bölüm başı); içerikleri tek tek incelenmedi → teyit edilmeli.
- 3194 md. 32 ve 42 yaptırımları sürüyor.

### 3.6 Hobi bahçesi gerçeği
Mevzuatta "hobi bahçesi" diye bir imar statüsü yok; bu adla satılan parsellerin çoğu tapuda tarla ve hisseli (Aktaş ve İkranur rehberleri de böyle anlatıyor). Bu arazide kalıcı yapı = 5403 md. 21 cezaları + 20/6/2026'dan sonra elektrik-su-doğal gaz aboneliği yok + fiili hisse hükmü. Sitede "hobi bahçesi modeli" diye ürün satılmaz; Karmod ve Makro'daki örnekler bu yüzden riskli işaretlendi.

### 3.7 Sitede söylenebilecek ve söylenmeyecek cümleler
Söylenebilir (sade, söz vermeyen):
1. "Bu hesap yalnız ölçülere bakar. Ruhsatı belediye verir."
2. "Tapunuzda 'tarla' yazıyorsa bu arsaya kalıcı konut ruhsatı alınamaz; önce izin yolunu birlikte netleştirelim."
3. "Prefabrik ev de betonarme ev gibi yapı ruhsatı ister."
4. "Belgeniz yanınızda değilse yönetmeliğin en az değerleriyle başladık: ön 5, yan 3, arka 3 metre."
5. "Köyün yerleşik alanındaysanız ruhsat yerine valilik onayı ve muhtarlık bildirimi gerekir."
6. "Fiyat tahminidir; temel, nakliye ve vinç arsanıza göre değişir. Yazılı teklifte kalem kalem görürsünüz."
7. Basılı vaziyet planında: "Bu çizim taslaktır; hak doğurmaz, mimari projenin yerine geçmez."

Söylenmez: "ruhsat gerekmez", "her araziye kurulur", "imarsız arsaya yasal", "tarlaya ev yapılır", "hobi bahçesi modeli", "tiny house ile imardan kurtulun", "depreme dayanıklı, yıkılmaz", "ruhsat garantisi", "bankasız kefilsiz vade".

### 3.8 Avukat / mimar teyidi gereken yerler
1. Ruhsat panelindeki bütün cümleler; özellikle "tarla → kalıcı konut ruhsatı alınamaz" genellemesinin istisnaları.
2. Tekerlekli tiny house'un araç statüsü ve tarım arazisinde kullanımı.
3. Tarımsal amaçlı yapı / bağ evi kriterlerinin 2026 güncel hâli.
4. 7584 sayılı Kanun'un abonelik yasağının mevcut yapılara uygulanma biçimi.
5. Saçak ve açık çıkmaların bahçe mesafesine girip giremeyeceği.
6. TAKS ve emsalin imar parseli üzerinden hesabı (yola terk) ve emsale girmeyen alanlar.
7. Köy yerleşik alanı ve iskân dışı alan sınırının parsel bazında tespiti.
8. Fiyat ya da taksit gösterilecekse tüketici mevzuatı.

## 4. Yurt dışı iyi örnekler (özet; ayrıntı `../REFERANSLAR.md`)

| Örnek | Ne yapıyor | Vaziyet'e alacağımız |
|---|---|---|
| canibuild (Avustralya, ev üreticilerine satılan araç; "ShowLot" akışı) | Adres → model seç → evi parselde sürükle ve döndür; ölçü balonuna sayı yazınca ev o mesafeye kayar; **sonuç iletişim formundan önce** gösterilir | Sonuç önce, form sonra; sürüklemenin sayıyla yapılan karşılığı (ölçüye dokun, "1,5 m" yaz) |
| Dwellito Site Planner (ABD, ev üreticilerine B2B) | Sürükle-bırak yerleşim, canlı çekme çizgileri, yükseklik ve taban alanı uyarıları, tek tıkla PDF | Kural ihlalinin plan üzerinde işaretlenmesi; teklif PDF'i |
| Abodu (ABD, bahçe evi) | Fiyatı iki blokta veriyor: **Ev** (fabrika, izin, nakliye) + **Kurulum** (temel, altyapı hattı, vinç) | Maliyet dökümünü iki bloğa ayırmak |
| Archistar (Avustralya, fizibilite) | Taşmaya kesin hüküm yerine "olası ihlal" diyor | Dil: "sınırı aşıyor görünüyor, tahmini" |
| Hollanda belediyelerinin "kavelpaspoort"u | Tek sayfalık arsa pasaportu: yapılaşma alanı, yükseklik; "bu çizimden hak doğmaz, imar planı bağlar" notu | Basılı vaziyet planı taslağı tek sayfa ve aynı dürüstlük notuyla |
| Ecoliv (Avustralya, modüler) | Teklifte tır ve vinç erişimini soruyor | Talep özetine "yol genişliği, eğim, vinç erişimi" soruları |

Görsel karar (yan araştırmanın önerisi, B'ye uygulandı): **ana sahne kuzey oklu kuşbakışı 2B plan** (basılı çıktı da bu), 3B yalnız "Maket" sekmesi; en iyi yurt dışı araçların hepsi önce planı gösteriyor.

## 5. İsim çakışması

- **"Pafta": ÇAKIŞIYOR.** Kayseri'de aktif "PAFTA Proje–Tasarım / Pafta Mimarlık & Mühendislik" (pafta.com.tr); ayrıca İstanbul ve Ankara'da Pafta adlı mimarlık ve inşaat firmaları var (yan araştırma, 2026-10-09). Kelimenin kadastrodaki jenerik kullanımı ("pafta ada parsel sorgulama") arama görünürlüğünü de zorlaştırır.
- **Çalışma adı: "Vaziyet"** (yan araştırmanın en temiz adayı: aynı sektörde firma çıkmadı; "vaziyet planı" aracın kendi çıktısı). İkinci aday: **"Plankote"**.
- TÜRKPATENT marka kaydı bu çalışmada doğrulanmadı; gerçek müşteride marka araştırması şart. Tasarım klasörü şimdilik `.tasarim/pafta/`.

## Kaynaklar

Mevzuat (mevzuat.gov.tr, erişim 2026-10-09): Planlı Alanlar İmar Yönetmeliği (MevzuatNo 23722), Plansız Alanlar İmar Yönetmeliği (4882), 3194 sayılı İmar Kanunu, 5403 sayılı Toprak Koruma ve Arazi Kullanımı Kanunu (7584 sayılı Kanun değişiklikleriyle). Yurt dışı: canibuild.com, configure.so (Dwellito), abodu.com, archistar.ai, Hollanda belediyelerinin kavelpaspoort sayfaları, ecoliv.com.au; isim: pafta.com.tr.

Firma siteleri (erişim 2026-10-09): karmod.com, prefabrik.com, prefabrikevim.com, celikyapimmerkezi.com, hanehouse.com, mooblehouse.com, mbtinyhouse.com, aktasprefabrikev.com, makroprefabrik.com, modernprefabrik.com.tr, smartcelikyapi.com, servilla.net, nestavilla.com, pramo.com.tr, ikranurprefabrik.com, endercelikyapi.com.tr, prefabrikhane.com; Koçtaş ilanı (arama dizini özeti): koctas.com.tr/sismik-prefabrik-celik-yapi-98-m2-prefabrik-ev/p/5003007336.
