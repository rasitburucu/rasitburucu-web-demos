# Yedi Pencere — Kaleiçi konak otelleri, varış ve yaya yolu araştırması

- Tarih: 2026-10-09 · Amaç: kurgusal "Yedi Pencere" (Kaleiçi'nde falez kenarında konak otel, TR+EN) konsept sitesine girdi.
- Yöntem:
  - **Saha:** web araması → **15 gerçek otelin resmî sitesi** incelendi (plandaki 4 site dahil). Her site Playwright ile 1440 ve 390 genişlikte açıldı; ilk ekran ve bir oda sayfası çekildi (`../ekran/arastirma/{otel}-1440.png`, `-390.png`, `-oda-1440.png`; 46 dosya, git'e girmez). Oda, konum, iletişim ve SSS sayfaları metin olarak okundu. Ham ölçüm: `olcum.json`.
  - **Kural ve ulaşım:** belediye, valilik ve yerel basın taraması (WebSearch/WebFetch).
  - **Yaya yolu verisi:** OpenStreetMap, Overpass sorgusuyla okundu (dosya indirilmedi); yükseklik OpenTopoData SRTM 30 m. Türetilmiş rota özeti: `osm-rota-ozet.json`.
- Kapsam dışı: Castle (alan adı şüpheli bir sayfaya yönleniyor, açılmadı), Blue Sea Garden (alan adı park edilmiş), Kaleiçi Lodge, Oscar ve Hadrianus (kendi sitesi bulunamadı), Atelya (Doğan ve Karyatit ile aynı altyapı).
- Ölçüm kısıtı: bağlantı VPN üzerindeydi (çıkış Türkiye). Yükleme süresi tek ölçüm, ilk ziyaret. Adalya Port'un ham 27 sn'si kapanmış bir AddThis betiği ile VPN DNS'inden; normal DNS'le 4,4 sn ölçüldü (ikisi de `olcum.json`'da).
- Gerçek otel adları yalnız bu araştırmada geçer; kurgusal siteye ad, metin, görsel taşınmaz.
- Hiçbir sitede form gönderilmedi, tarih seçilmedi, çerez bandı kabul edilmedi, dosya indirilmedi.

---

## 1. İncelenen oteller

### 1a. Kimlik ve ilk ekran

| # | Otel · alan adı | Kaleiçi'nde konum | Oda | İlk ekranın (1440) söylediği | Diller |
|---|---|---|---|---|---|
| 1 | Tuvana · tuvanahotel.com | Karanlık Sk., Saat Kulesi yakını, iç kısım; deniz iddiası yok | Yazmıyor (7 tip, 7 yapı) | Logo, menü, tarih alanları, "Check availability", avlu-havuz fotoğrafı; vaat cümlesi yok | EN, TR, DE, RU, AR (elle; TR sayfada form İngilizce kalmış) |
| 2 | Doğan · doganhotel.com | Mermerli Sk., liman tarafı; deniz iddiası yok | Yazmıyor (4 tip) | Konak cephesi fotoğrafı, 8,9/10 puan rozeti, tarih çubuğu | TR, EN, DE, RU, AR, ZH (platform çevirisi; EN menüde "ABOUT HOTEL INN") |
| 3 | Villa Perla · villaperla.com | Hesapçı Sk., iç kısım | Adı olan 7 oda | Siyah zemin, "200 yıllık taş bina", 360° rozeti; rezervasyon ve telefon yok | TR, EN (Wix, makine çevirisi) |
| 4 | Mediterra Art · mediterraarthotel.com | Zafer Sk., Hadrian Kapısı tarafı, iç kısım | Yazmıyor (4 tip) | Ortada "%20 indirim, otelde nakit öde" penceresi, cephe, tarih çubuğu, WhatsApp | EN, TR, PT-BR, FR |
| 5 | Alp Paşa · alppasa.com | 3 yapı grubu, iç kısım (tahmin) | 155 (TR) / 156 (EN) | Tam ekran video, YouTube arayüzü görünüyor; vaat ve çağrı yok | TR, EN |
| 6 | Minyon · minyonhotel.com | Tabakhane Sk., güney falez tarafı (tahmin); "deniz manzaralı bahçe" | Yazmıyor (3 tip) | Taş cephe, "Hemen Ara", altta sabit tarih çubuğu | TR, EN, DE |
| 7 | Puding · pudinghotel.com | Mermerli Sk., limanın üstünde, falez üstü; limana kendi merdiveni | Yazmıyor (5 tip) | Liman, falez ve Beydağları panoraması; alt ikon çubuğu | TR, EN, RU |
| 8 | Adalya Port · adalyaporthotel.com | İskele Cd., eski limana 30 m | 29 | Mor filtreli lobi, "Just DREAM it", puan rozeti | Yalnız EN |
| 9 | Route · routehotelkaleici.com | Hıdırlık Sk., surun ve falezin kenarı | ~9 (tahmin) | Ekranı kaplayan grup logosu; otel adı, fotoğraf, çağrı yok | TR, EN |
| 10 | Antalya Inn · antalyainnhotel.com | Hıdırlık Sk., güney uç (tahmin) | Yazmıyor (10 tip adı) | Liman ve falezin dron fotoğrafı, "Hoş geldiniz", tarih, "Üye ol" | TR, EN, RU |
| 11 | Tekeli Konakları · tekeli.com.tr | Dizdar Hasan Sk., limana 100 m; 6 konak | Yazmıyor (3 tip) | Ekranın tamamını kaplayan, geçerliliği 11.09.2021'de bitmiş COVID sertifikası | TR, EN |
| 12 | Aspen · aspenhotel.com.tr | Mermerli Sk., liman tarafı | "8 oda seçeneği" / menüde 10 tip | Ekranı kilitleyen çerez penceresi, bar videosu | EN, TR |
| 13 | Özmen · ozmenotel.com | Zeytin Çıkmazı, Karaalioğlu Parkı'na yakın (tahmin); "tüm odalarda deniz manzarası" | 25 | Körfeze bakan teras fotoğrafı, solda sabit menü | TR, EN (EN'de Türkçe artıklar) |
| 14 | White Garden · whitegardenhotel.com | Hesapçı Geçidi; çatı terasında deniz ve dağ iddiası | Yazmıyor | Gece konak cephesi, tarih kutusu (tarih kesik) | TR, EN, DE, RU listede; EN ana sayfa boş |
| 15 | Karyatit · karyatithotel.com | Kadir Paşa Sk., iç kısım; "deniz manzarasıyla çevrili konum" | 30 | Havuzlu avlu, tarih çubuğu, promosyon kartı | TR, EN, DE, RU |

### 1b. Hangi bilgiyi veriyorlar (+ var, – yok, ~ kısmen/bozuk)

| Otel | Oda tek tek | m² | Oda bazında manzara | Asansör | Kat / merdiven / erişilebilirlik | Ses | Yazılı varış | Otopark / araç kuralı | Bavul / transfer | Rezervasyon altyapısı | Fiyat sitede |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Tuvana | – | + | – | – | – | ~ | **+ km'li sürüş tarifi** | + (girişte bilet, vale) | + (transfer 50 €) | Vertical Booking | + (93 € / 60 €, çelişkili) |
| Doğan | – | + | – | – | – | – | – | – | – | Exely/TravelLine | + (canlı; tutarsız) |
| Villa Perla | ~ (7 adlı sayfa, oda bilgisi yok) | – | – | – | – | – | – | – | – | Yok (düğme telefon) | – |
| Mediterra | – | – | ~ (bir tipe 4 manzara) | – | ~ | – | – | – | – | HotelRunner | – |
| Alp Paşa | – (8 tip) | + | ~ ("sokak, bahçe veya havuz") | – | **+ (engelliye özel oda yok, açıkça)** | – | – | – | – | Rezervasyonal | – |
| Minyon | – | – | ~ | – | – | – | – | ~ | – | HotelRunner | – |
| Puding | – | ~ | ~ | – | ~ (kat bilgisi) | – | ~ | ~ (15 araç, vale) | **+ (buggy)** | Rezervasyonal | – |
| Adalya Port | – | + | – | – | – | ~ | + | **+ (plaka önceden)** | – | Exely/TravelLine | – |
| Route | **~ (3 birim tek tek)** | – | + | – | ~ ("Kırk Merdivenler") | ~ | – | – | – | Rezervasyonal | – |
| Antalya Inn | – (detay sayfaları HTTP 500) | – | + (tip adında "kısmi deniz") | – | – | ~ | – | – | ~ | Kendi sistemi, üyelikli | – |
| Tekeli | – | + | – | – | – | ~ | + (metreli) | + (40 araç) | – | Tema rezervasyonu + Booking.com | + (sabit) |
| Aspen | – | + | ~ | – | – | – | – | – | – | Mirai | – |
| Özmen | – | – | ~ ("tüm odalar") | – | – | – | ~ | – | + (otogar 12 €, havalimanı 20 €) | Reseliva + havale ile kapora | – |
| White Garden | – | – | – | – | – | – | ~ | – | – | Reseliva (http, şifresiz) | – |
| Karyatit | – | + | – | – | – | – | ~ | ~ | – | Exely/TravelLine | + (canlı) |

Asansör sütunu 15 sitede de "–": hiçbir otel asansörü olup olmadığını yazmıyor. Kamuya açık panoramik asansörü yalnız White Garden bir mesafe listesinde anıyor.

### 1c. Mobil ve teknik

| Otel | Masaüstü yük. (sn) | Mobil yük. (sn) | Ağırlık (MB, masaüstü) | Mobil ilk ekran | Özen sorunu (somut) |
|---|---|---|---|---|---|
| Tuvana | 2,3 | 2,1 | 3,7 | Rezervasyon ve tarih; telefon tıklanmıyor | WordPress 5.3.3 (2019); mobilde 47 konsol hatası; EN tarifte "beggining" |
| Doğan | 4,9 | 5,3 | 5,2 | Tarihli rezervasyon kartı | TR metinde HTML kodu sızıyor; "Mermeli" yazım hatası |
| Villa Perla | 1,1 | 2,0 | 1,7 | Fotoğraf ve slogan; çerez bandı ekranın ~%32'si | Eski Wix, mobil düzen 320 px sabit; adreslerde "kopyası-oda-3" |
| Mediterra | 2,9 | 1,9 | 5,2 | Tarih çubuğu indirim penceresinin altında | Yandex harita hatası; "Single" odaya çift yatak |
| Alp Paşa | 1,9 | 3,4 | 5,6 (mobil 9,4) | Yalnız video ve menü ikonu | Adres bağlantısı New York Times Square'e gidiyor |
| Minyon | 2,7 | 1,7 | 4,3 | Altta sabit tarih ve rezervasyon çubuğu | 2026'da menüde COVID sayfası; © 2023 |
| Puding | 1,7 | 3,2 | 3,1 | Rezervasyon, telefon, WhatsApp | Arama formu varsayılanı "3 yetişkin"; EN'de "They economy rom" |
| Adalya Port | 4,4 | 4,1 | 4,1 | Kahraman yazıları üst üste | Kapanmış AddThis betiği sayfayı bekletiyor |
| Route | 1,1 | 2,1 | 6,6 | Yüzen düğmeler metni örtüyor | Kaydırıcıdan kalma "12345678" metni |
| Antalya Inn | 2,1 | 1,3 | 5,5 | Rezervasyon düğmesi ekran altında | 10 oda bağlantısının hepsi HTTP 500, geliştirici hata ekranı açık |
| Tekeli | 1,1 | 1,5 | 3,5 | Sertifika penceresi tam ekran | Varlıklar tema sağlayıcısının demo sunucusundan; varsayılan tarih geçmişte |
| Aspen | 2,5 | 2,1 | **15,1** | Çerez penceresi alt yarıda | En ağır site (video) |
| Özmen | 3,5 | 3,5 | 2,4 | Teras fotoğrafı, altta sabit telefon çubuğu | © 2020; rezervasyon için havale ile kapora |
| White Garden | 2,7 | 2,4 | 2,5 | Tarih metni kesik | Telefon bağlantısında "+" yok; motor bağlantısı http |
| Karyatit | 3,5 | 3,7 | 3,6 | Tarihli rezervasyon kartı | Mobilde 20 px yatay taşma |

---

## 2. Sentez

### 2.1 Konuk gerçekte ne soruyor (sitelerin vermediği bilgiye göre sıralı)

| Sıra | Soru | Sitelerde durum |
|---|---|---|
| 1 | **Bu tarihlerde boş mu, kaça?** | Çoğunda tarih çubuğu var; fiyat 4 sitede görünüyor, ikisinde çelişkili (Tuvana 93/60 €, Doğan 1.039,50/105,77 €) |
| 2 | **Hangi oda bana göre; denizi gerçekten görüyor mu?** | 15 sitenin 13'ü odayı tip olarak satıyor; 8 site deniz/limandan söz ediyor ama yalnız 2'si bunu oda ya da tip bazında yazıyor (Route, Antalya Inn) |
| 3 | **Bavulla kaç basamak; asansör var mı?** | 15'te 15 asansör bilgisi yok; kat bilgisi yalnız Puding'de. Kaleiçi konakları iki-üç katlı, ahşap merdivenli: soru gerçek |
| 4 | **Oraya nasıl varırım, aracı nereye bırakırım?** | 12 site varışı anlatmıyor; tarihli araç kuralı hiçbir sitede yok. En iyileri: Tuvana (km'li sürüş tarifi), Adalya Port (plaka önceden), Tekeli (metreli tarif) |
| 5 | **Gece gürültü olur mu?** | Canlı müzikli oteller (Villa Perla, Alp Paşa) bile değinmiyor; ses yalnız misafir yorumlarında |
| 6 | **Evin kendisi nasıl (taşlık, avlu, tavan)?** | Malzeme hikâyesi var (Tekeli: Edirnekâri işleme, sedir kokusu) ama oda bazında değil |

### 2.2 Ortak kusurlar

| Sorun | Somut örnek |
|---|---|
| Odanın kimliği yok, tip satılıyor | Alp Paşa "her oda farklı" deyip 8 tip sayfası veriyor; White Garden'da Suit sayfası Standart'ın kopyası |
| Manzara odaya atanmıyor ya da çelişkili | Mediterra aynı tipe bahçe, havuz, sokak ve avlu manzarasını birden yazıyor; Özmen "tüm odalarda deniz" diyor, kanıt yok |
| Asansör, kat, basamak bilgisi yok | 15 sitenin 15'i |
| Varış ve araç kuralı yok ya da belirsiz | 12 sitede yazılı varış yok; kural yalnız dolaylı ("bilet al", "plaka bildir", "şu kapıdan gir") |
| İlk ekranı kapatan pencere | Tekeli (süresi dolmuş sertifika), Aspen (çerez), Mediterra (indirim), Villa Perla (çerez %32) |
| Bayat içerik | Minyon'da COVID sayfası; 5 sitede © 2020/2023; Tuvana 2019 WordPress |
| Kırık akış ve şablon artığı | Antalya Inn HTTP 500 + debug ekranı; Alp Paşa'da Times Square bağlantısı; Tekeli demo sunucusu; Route "12345678" |
| Özensiz çeviri | Villa Perla, Doğan, Puding EN; White Garden EN boş; Adalya Port'ta TR yok |
| Telefon tıklanmıyor ya da bozuk | Tuvana, Mediterra, Antalya Inn; White Garden'da "+" eksik |
| Ağırlık | Aspen 15 MB, Alp Paşa mobilde 9,4 MB |

### 2.3 İyi yapılanlar (fikir olarak; metin, görsel, kod alınmaz)

| Fikir | Kimde | Yedi Pencere'deki karşılığı |
|---|---|---|
| Odayı fiziksel ayrıntıyla tek tek anlatmak (sur duvarı, iki zeytin ağacı, parka açılan kapı, plaja 15 m merdiven) | Route | Her oda kendi sayfası ve kendi gerçekleri |
| Araçla gelenin plakasını önceden alıp kapı geçişini ayarlamak | Adalya Port | Varış şeridinde "plakanızı yazın" adımı (örnek hizmet) |
| Km işaretli kapı tarifi, vale buluşma noktası | Tuvana | Kapıdan kapıya şerit (metin değil, ölçülü şerit) |
| Buggy ile Kaleiçi içinde bırakma | Puding | Bavul teslim noktası (örnek hizmet) |
| Açık sözlülük: "engelliye özel oda yok" | Alp Paşa | "Konakta asansör yok" + oda başına basamak |
| Manzarayı oda adına yazmak | Antalya Inn | Odanın adı ve ilk satırı neyi gördüğünü söyler |
| Açık transfer ücretleri | Özmen, Tuvana | Şeritte "örnek ücret" alanı |
| Mobilde sabit alt çubuk | Minyon, Mediterra, Özmen | Tarih · Ara · Rezervasyon |

### 2.4 Görsel dil ve klişeler (kaçınılacak)
- **Renk:** koyu zemin (siyah, lacivert, kahve) + altın/bronz: "Osmanlı lüksü". Az sayıda kurumsal yeşil ya da turkuaz.
- **Fotoğraf:** alacakaranlıkta cumbalı beyaz konak cephesi; palmiyeli avlu havuzu; dantel örtülü yatak; liman-falez-dağ dron çekimi; yaşam tarzı videosu.
- **Logo:** arma, kemer, sütun, madalyon, altın varak, el yazısı.
- **Slogan:** "Tarihle iç içe", "Kaleiçi'nde bir inci", "huzurlu tatil", "Hidden Paradise", "Just DREAM it".
- **Düzen:** oklu tam genişlik kaydırıcı + üstünde tarih çubuğu; puan rozeti; yüzen WhatsApp; ikonlu oda kaydırıcısı; ansiklopedik Kaleiçi rehberi.

### 2.5 Fark iddiası doğrulandı mı?
Evet. 15 sitenin hiçbirinde kat planı ya da cephe üzerinden oda seçimi, ya da otoparktan veya duraktan kapıya metre ve basamak veren yürüyüş rotası yok. En yakın örnekler: rezervasyon motorlarının tip kartları (konum, kat, cephe yok), Tuvana ve Tekeli'nin düz metin tarifleri, Route'un tek odalık metin rotası, Villa Perla'nın 360° turu (mekânsal ama oda seçilmiyor). İddiayı "Kaleiçi'nde incelediğimiz 15 otel sitesinde yok" sınırıyla kurarız; "dünyada ilk" demeyiz (konut projelerinde cephe üzerinden daire seçimi yaygın, bkz. `../REFERANSLAR.md`).

---

## 3. Kaleiçi'ne araç girişi ve ulaşım: güncel durum

**Sonuç: güncel genel kural doğrulanamadı.** Bulunan en yeni yazılı genel düzenleme 2017 tarihli.

| Tarih | Kaynak | Ne diyor |
|---|---|---|
| 18.07.2017 (uygulama 24.07.2017) | Hürriyet, "Kaleiçi'nde büyük değişim" | UKOME kararı: dağıtım araçları yalnız 07.00–12.00, öğrenci servisleri 07.00–18.00, acil araçlar 24 saat. Otopark cepleri dışında park yasak; giren taksi yarım saatten fazla kalırsa ceza. Parselinde otoparkı olan turizm tesisi otopark sayısı kadar izin alır; olmayana talep hâlinde UKOME bir "passcard" verir. Bölgeye 2 ring hattı (4 elektrikli taksi, 2 buggy). Yat Limanı'na turnike. "Amaç tüm araçları kapatmak değil." |
| 31.12.2025 | Akdeniz Manşet | Valilik, yılbaşı için 14.00'ten itibaren araç girişini ve parkı yasakladı (geçici) |
| 08.07.2026 | Antalya Ekspres | Vali Hulusi Şahin (ATSO Kaleiçi Zirvesi): "Kaleiçi'ne araçla giriliyor, güzide mekânı otoparka çevirmişler"; önce ulaşım düzeni çözülmeli |
| 10.07.2026 | Haberaktif07 | Kaleiçi İşletmeciler Derneği Başkanı: araç giriş-çıkışları kontrol edilmeli; toplu yasağın işletmeye etkisi tartışılmalı |

- Sahada fiziksel denetim var: OpenStreetMap'te Üç Kapılar (Hadrian Kapısı) yanında ve Kalekapısı yanında **yükselen bollard** (`bollard=rising`) işaretli. Kuralın saatleri ve kimin girebildiği belgelenmemiş.
- Otellerin yazdıkları dolaylı: Tuvana "girişte bilet", Adalya Port "plakanızı önceden bildirin, Yat Limanı kapısını biz ayarlarız", Tekeli "Saat Kulesi kapısından girin". Hiçbiri tarih ya da saat vermiyor.
- **Sitedeki dil (öneri):** kural yazılmaz. "Kaleiçi'ne araç girişi zaman zaman değişiyor. Gelmeden plakanızı bize yazın, kapı geçişini biz soralım; olmazsa aracınızı X otoparkına bırakın, bavulunuzu biz alalım." Hizmet kısmı "örnek" etiketli.

**Ulaşım (gerçek, kaynaklı; saat ve ücret sitede yazılmaz ya da "teyit edin" notuyla):**
- Havalimanı → İsmetpaşa: AntRay T1A tek hat, yaklaşık 50 dk (Turkey Travel Planner, Temmuz 2025 güncellemesi); havalimanı resmî sayfası hattı "havalimanı–Meydan–Fatih" diye veriyor.
- Otogar → İsmetpaşa: AntRay, 8 durak, yaklaşık 20 dk (Lonely Planet Fransızca rehberi); otogarda tünel yürüyüşü yaklaşık 10 dk ek.
- Nostaljik tramvay durakları Kaleiçi çevresinde: Kale Kapısı, Üç Kapılar, Cumhuriyet Meydanı, Belediye (OSM).
- Otoparklar (OSM): Cumhuriyet Meydanı yeraltı otoparkı; Hadrian Kapısı yakınında adsız açık otopark; ayrıca adı "Katlı Otopark" ve "Mekanik Katlı Otopark" olan iki tesis (konumları bu taramada çıkarılmadı).
- Limandan yukarı: **Kaleiçi Panoramik Asansörü** (OSM, `access=yes`) limanı Cumhuriyet Meydanı'na bağlıyor; konağın bulunduğu güney uca değil, ama marina seçeneğinde anılmalı.

---

## 4. OpenStreetMap: Kaleiçi yaya yolları ne kadar dolu?

Kapsam: Kaleiçi'nin dört mahallesi (Kılınçarslan, Barbaros, Tuzcular, Selçuk) içindeki bütün yollar, Overpass ile 2026-10-09'da okundu.

| Ölçü | Değer |
|---|---|
| Yol (highway) sayısı ve uzunluk | 205 yol, 17,7 km |
| Tür | sokak (residential) 76 yol / 9,7 km · yaya yolu 72 / 4,0 km · yaya alanı 16 / 2,4 km · **merdiven 30 / 527 m** · diğer |
| `surface` (yüzey) dolu | uzunluğun **%42**'si: taş kaplama (paving_stones) 4,2 km, **Arnavut kaldırımı (sett) 1,4 km**, asfalt 1,2 km |
| `step_count` (basamak sayısı) | **30 merdivenin yalnız 3'ünde** (10, 13, 20 basamak) |
| `incline` (eğim) | uzunluğun **%0,8**'i (12 yol, yalnız yukarı/aşağı yönü) |
| `width`, `handrail`, `wheelchair` | %4,8 · 11 yol · **0** |
| Sokak adı | uzunluğun %59'u |
| Araç etiketi | Hesapçı Sokak `motor_vehicle=no/private`; Akarçeşme Sokak `destination`. Çoğu sokak "residential", yani OSM'ye göre araç girebilir: araç kuralı haritada yok |

Dikkat çeken boşluk: **"Merdivenli Sokak"** OSM'de basamak değil, Arnavut kaldırımlı sokak olarak işaretli. Adı basamağı düşündürüyor; sahada bakılmadan şeride yazılmaz.

**Yükseklik (SRTM 30 m, yaklaşık):** Yat Limanı 2–7 m · Kalekapısı 37–42 m · Hadrian Kapısı 43–45 m · konağın kapısı ~32 m. Liman ile yukarı şehir arasındaki ~30 m'lik fark güvenilir; sokak ölçeğinde eğim bu veriden çıkmaz (30 m'lik hücre dar sokakta gürültü üretiyor).

**Kurgusal kapıya gerçek rotalar** (yaya ağında en kısa yol; "bavul" satırı merdiveni 25 kat ağır sayan alternatif):

| Nereden | En kısa | Basamak (OSM) | Bavulla | Not |
|---|---|---|---|---|
| Kale Kapısı durağı | 735 m | yok | aynı | Uzunçarşı Sk. → Aralık Geçidi → Mermerli Sk. → Hıdırlık Sk.; yüzey çoğunlukla bilinmiyor |
| İsmetpaşa (AntRay) | 948 m | yok | aynı | İlk 193 m çarşı yaya alanı |
| Üç Kapılar / Hadrian Kapısı | 737 m | **10 iniş + 13 çıkış** | 851 m (+114 m) | Hesapçı Sk. 382 m taş kaplama; bavul yolu 12 m Arnavut kaldırımı |
| Yat Limanı | 765 m | 42 m taş merdiven (sayı yok) | 849 m | Bavul yolu: İskele Caddesi 141 m + Aydoğdu ve Merdivenli Sk., hepsi Arnavut kaldırımı, ~30 m çıkış |
| Cumhuriyet Meydanı otoparkı | 958 m | 67 m merdiven (sayı yok) | 1.068 m | |

**Yürüyüş şeridi gerçek veriyle kurulabilir mi? Evet, kısmen.**
- Tam: güzergâh, mesafe, sokak adları, kayıtlı merdivenlerin yeri, liman-yukarı şehir yükseklik farkı.
- Eksik: basamak sayısı (30 merdivenden 27'si), yüzeyin yarısından fazlası, sokak eğimi, genişlik, korkuluk.
- Gerçek müşteride çözüm: otel personeli dört rotayı bir kez yürür, basamak sayar, yüzeyi ve dönemeçleri fotoğraflar (yaklaşık bir saat). İstenirse bu ölçümler OSM'ye de işlenir.
- Demoda: OSM'den gelen değer olduğu gibi; eksikler "örnek" etiketiyle. Veri derleme anında alınır (Sazbahçe `fetch-sazbahce-map.mjs` gibi), sayfa dışarıya istek atmaz. Atıf zorunlu: "© OpenStreetMap katkıda bulunanlar".

---

## 5. Kaleiçi konaklarının mimarisi ve deniz manzarası gerçeği

**Belgeli özellikler** (kaleicioldtown.com, Kaleiçi geleneksel evleri sayfası; GTÜ 2017 ve İTÜ 1996 tezlerinin özetleri):
- Konutların çoğu 19. yüzyılın ikinci yarısı – 20. yüzyıl başı. Kaynaklar iki katlı diyor; ansiklopedi maddesi iki-üç kat diyor.
- Zemin kat duvarları deprem için **ahşap karkas + moloz taş**; üst kat aynı yöntem ya da çıtalı sıvalı ahşap karkas. Duvarlar badanalı ya da sıvalı.
- Sokak cephesinde büyük **çift kanatlı kapı**; bitişik nizam nedeniyle kapı doğrudan bahçeye değil, yarı kapalı **taşlığa** açılır.
- Taşlık zemini **çakıl mozaiği**: çoğunlukla çiçek ve geometrik desen, seyrek insan figürü. Taşlığın çevresindeki odalar depo ve servis.
- Her avluda yağmur suyuyla dolan **sarnıç**; şebekeden önce kanal ve boru sistemi.
- Taşlıktan **ahşap merdivenle** üst kata çıkılır; **sofa** yarı açık ortak yaşam alanıdır, bütün odalara buradan girilir.
- Baş oda: gömme dolaplar, şerbetlikli nişler, duvar boyu sedir, halı kaplı ahşap döşeme, **süslemeli ahşap tavan**.
- Sokak cephesinde çıkma (cumba), panjur, bol pencere; 45° **pahlı köşeler** (yaklaşık 2 m'ye kadar, araba tekerinden korumak için); kapı-pencere sövelerinde kesme taş, alçı kabartma, oyma motifler.
- İç ve dış sofalı plan tipleri yaygın (İTÜ tez özeti).

**Fotoğrafla görülen, akademik kaynakla doğrulanmayan:** cumbanın Kaleiçi'ne özgü biçimleri (Doğan, White Garden, Karyatit cephelerinde açıkça görülüyor), avlulardaki turunç ağaçları, ahşap tavan göbeği. Sitede bunlar "konağımızda" diye kurgunun parçası olarak yazılır; "Kaleiçi evlerinin hepsinde" gibi genelleme yapılmaz. Sivil mimari sayısı kaynaklarda 356 ile 456 arasında değişiyor; sitede rakam verilmez.

**Deniz manzarası gerçeği:**
- Kaleiçi evleri içe dönük: sokak ve avlu. Denizi yalnız surun ve falezin kenarındaki parseller görür. İncelenen sitelerde deniz iddiası olanlar bu şeritte: Mermerli Sk. (Puding), Hıdırlık Sk. (Route, Antalya Inn), Zeytin Çıkmazı (Özmen), Hesapçı Geçidi (White Garden, çatı terası).
- OSM kıyı çizgisi limandan Hıdırlık Kulesi'ne güney-güneybatı yönünde iner; kıyıya en yakın sokaklar Mermerli Banyo Sk. (~32 m), Hıdırlık Sk. (~47 m), Zeytin Çıkmazı (~65 m).
- Bu kenardan görülen: körfez, karşıda Konyaaltı ve arkasında **Beydağları (Toros)**. Gün batımı dağların üstündedir (Hıdırlık ve Karaalioğlu anlatımları: Turkey Travel Planner, Wikipedia, MEB gezi planı, ziyaretçi yorumları).
- Falez kenarında bile zemin kat odaları çoğu zaman sur ya da avlu duvarına bakar; denizi üst katlar görür. Kurgusal konaktaki dağılım (deniz yalnız 1. kat ve köşk katında) bu gerçeğe uygun.

---

## 6. İsim kontrolü: "Yedi Pencere"

| Arama | Sonuç |
|---|---|
| "Yedi Pencere" otel / Antalya / kafe-restoran-pansiyon | İşletme bulunamadı |
| "7 Pencere", "Yedipencere", "Seven Windows" otel | Bulunamadı |
| `yedipencere.com` | Var: kişisel sanat blogu (WordPress, "Sonsuza açılan sanat pencereniz"), @YediPencere Twitter/Facebook. Konaklama değil |
| `yedipencere.com.tr`, `.net`, `7pencere.com` | Alan adı yok (DNS) |
| Benzer adlar | "Yedi (7) Butik Hotel", Çıralı/Kemer (Antalya ili, pansiyon belgeli); "Yedi Kapı Otel", Erzurum; "Yedi Bilgeler", Selçuk |

**Karar: çakışma yok, ad kalabilir.** Risk düşük: aynı ilde "Yedi" ön ekli bir pansiyon var; `.com` alan adı ve sosyal hesaplar başkasında (demo için önemsiz, gerçek müşteride önemli). TÜRKPATENT marka araması yapılmadı (etkileşimli arayüz); gerçek müşteri işinde yapılmalı. Yedek adlar (aramada eşi çıkmadı): **Kafesli Konak**, **Yedi Cumba**.

---

## 7. Yedi Pencere için öneriler

### 7.1 Bilgi mimarisi
| Sayfa | Bölümler |
|---|---|
| Ana sayfa | (1) İlk ekran: cephe/oda seçici + tarih ve kişi + seçili odanın kartı · (2) Asansör yok: basamak karşılaştırması tek satırda · (3) Kapıdan kapıya: dört varış seçeneği, şerit · (4) Konak: taşlık, avlu, sofa, kahvaltı (kısa) · (5) Ev kuralları ve SSS · (6) Rezervasyon özeti çağrısı |
| Oda (7 sayfa) | Ne görür, kat ve basamak, tavan, gece sesi, m², yatak, fiyat (örnek), 4–6 fotoğraf (aynı ışık), "bu odayı sor/rezerve et" |
| Varış | Havalimanı, otogar, kendi aracınız, marina; her biri için şerit; bavul teslim noktası; araç kuralı notu; OSM atfı |
| Konak ve avlu | Evin kısa hikâyesi (kurgu olduğu yazar), malzemeler, kahvaltı saati |
| Rezervasyon özeti | Tarih, gece, oda, kişi, toplam (örnek), iptal koşulu, "Bu bir tasarım örneği" |

### 7.2 İlk ekranın işi
Üç saniyede iki cevap: "burası Kaleiçi'nde falez kenarında yedi odalı bir konak" ve "benim tarihlerimde hangi oda boş, hangisi denize bakıyor". Bunun için ilk ekranda konağın çizimi (yedi pencere), tarih ve kişi alanı, seçili odanın kartı (ne görür, basamak, gece, tavan, fiyat) ve tek ana düğme. Kaydırıcı, açılır pencere, puan rozeti, yüzen balon yok.

### 7.3 Güven unsurları (uydurmadan)
| Unsur | Nasıl |
|---|---|
| Asansör yok | Açıkça, ilk ekranın altında, her odanın basamak sayısıyla |
| Manzara | Oda başına tek ifade; denizi görmeyen odaya "deniz" yazılmaz |
| Ses | Oda başına bir cümle; sokak odalarında hafta sonu notu |
| Müsaitlik | "Otelin rezervasyon sisteminden anlık gelir" + demoda "örnek doluluk" |
| Varış | Ölçülü şerit + "kural değişebiliyor, bize yazın" |
| Kaçınılacak | Puan rozeti, uydurma yorum, "en iyi fiyat garantisi" (kanıtsız), sayaç, "Kaleiçi'nde bir inci" |

### 7.4 Teknik çizgi
İlk yük ~1,5 MB altında; kaydırıcı, video kahraman ve tam ekran açılır pencere yok; çerez bandı ilk ekranı kapatmaz; bütün telefonlar `tel:`; tarih varsayılanı bugünden sonra, gece sayısı ≥ 1; EN elle yazılmış ve tam; yatay taşma yok. Sektörde en ağır site 15 MB, en sık hata kırık bağlantı ve bayat açılır pencere: bu çıta kolay geçilir ve satış konuşmasında somut fark olarak gösterilir.

---

## 8. Müşteri gerekçesi: doğrudan rezervasyon

- Booking.com 2017'de ortalama komisyonunu %15 olarak açıkladı (NTV).
- Financial Times'a dayanan habere göre Marriott ve Hilton çevrim içi acentelere %15–25 ödüyor ve doğrudan rezervasyona yöneliyor (CNBC-e). Küresel örnek, Türkiye'ye özgü değil.
- Türkiye: yabancı dijital konaklama platformlarına izin belgesi ve yurt içi satışta **%17 komisyon tavanı** getiren teklif 7 Ekim 2026'da TBMM Bayındırlık, İmar, Ulaştırma ve Turizm Komisyonu'nda kabul edildi; Genel Kurul'dan geçmedi, yasalaşırsa 1 Ocak 2027'de yürürlüğe girecek (Euronews Türkçe).
- Booking.com'da Türkiye içindeki tesislerin Türkiye'den rezervasyonu 2017'den beri erişim engelli (Milliyet, Ağustos 2026). Yabancı konuk için platform hâlâ ana kanal; yerli konuk için otelin kendi sitesi ve yerli acenteler.
- Satış cümlesi (öneri): "Konuğunuz odayı platformda bulsa da sizin sitenizde seçer; çünkü hangi odanın denize baktığını ve kaç basamak çıktığını yalnız siz söylüyorsunuz."

---

## Kaynaklar

Otel siteleri (erişim 2026-10-09): tuvanahotel.com, doganhotel.com, villaperla.com, mediterraarthotel.com, alppasa.com, minyonhotel.com, pudinghotel.com, adalyaporthotel.com, routehotelkaleici.com, antalyainnhotel.com, tekeli.com.tr, aspenhotel.com.tr, ozmenotel.com, whitegardenhotel.com, karyatithotel.com.

Kural, ulaşım, sektör:
- Hürriyet, Kaleiçi'nde büyük değişim (18.07.2017): https://www.hurriyet.com.tr/yerel-haberler/antalya/kaleicinde-buyuk-degisim-40524078
- Akdeniz Manşet, Kaleiçi'ne araç girişi yasaklandı (31.12.2025): https://www.akdenizmanset.com.tr/kaleicine-arac-girisi-yasaklandi
- Antalya Ekspres, Vali Şahin'den "Kaleiçi'nde araç" isyanı (08.07.2026): https://www.antalyaekspres.com.tr/vali-sahinden-kaleicinde-arac-isyani
- Haberaktif07, Kaleiçi İşletmeciler Derneği açıklaması (10.07.2026): https://haberaktif07.com/haber/antalya-kaleici-tarihiyle-degil-alkol-ile-aniliyor-yeni-bir-yol-cizilmeli-62133
- Turkey Travel Planner, Antalya tramvayları: https://turkeytravelplanner.com/go/med/Antalya/trans/tram.html
- Antalya Havalimanı, toplu taşıma: https://www.antalya-airport.aero/passengers-visitors/transportation/buses-and-mass-transport
- Lonely Planet (FR), Antalya ulaşım: https://www.lonelyplanet.fr/destinations/europe/turquie/antalya/transport
- NTV, Booking.com aldığı komisyonu açıkladı: https://www.ntv.com.tr/ekonomi/booking-com-aldigi-komisyonu-acikladi,BUIl25W2O0WDN-fo2eSrkw
- CNBC-e, Marriott ve Hilton'dan Booking'e alternatif plan: https://www.cnbce.com/teknoloji/marriott-ve-hiltondan-bookinge-alternatif-plan-musteriye-dogrudan-ulasma-yarisi-h22078
- Euronews Türkçe, Booking, Expedia ve Airbnb gibi platformlara yeni kurallar (07.10.2026): https://tr.euronews.com/2026/10/07/booking-expedia-ve-airbnb-gibi-platformlara-turkiyede-yeni-kurallar
- Milliyet, Booking.com teklifi (Ağustos 2026): https://www.milliyet.com.tr/7633608

Mimari ve manzara:
- Kaleiçi Old Town, Traditional houses of Kaleiçi: https://www.kaleicioldtown.com/en/historic-sites/traditional-houses-of-kaleici/14
- GTÜ, Geleneksel konut cephelerindeki bozulma… Antalya-Kaleiçi örneği (2017): https://acikerisim.gtu.edu.tr/items/b3626a73-55a9-483a-8cb9-79a3f0aebda6
- İTÜ, Hakkı Misistreli Evi ve Tekeli Evi restorasyon projeleri (1996): https://polen.itu.edu.tr/items/39205fe5-2a70-4691-92fd-c384c1bdbeda
- İTÜ, Antalya-Kaleiçi yapılarının günümüzdeki durumu: https://polen.itu.edu.tr/items/12661ddd-142d-41df-915c-5be190e59b16
- Hıdırlık Kulesi: https://en.wikipedia.org/wiki/Hidirlik_Tower ve https://turkeytravelplanner.com/go/med/Antalya/sights/hidirlik.html
- Karaalioğlu Parkı: https://en.wikipedia.org/wiki/Karaalio%C4%9Flu_Park

Veri:
- OpenStreetMap katkıda bulunanlar, ODbL 1.0; Overpass API (overpass-api.de, maps.mail.ru) ile okundu.
- OpenTopoData, SRTM 30 m: https://api.opentopodata.org
