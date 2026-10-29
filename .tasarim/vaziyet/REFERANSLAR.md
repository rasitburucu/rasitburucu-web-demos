# REFERANSLAR: Vaziyet (ilk çalışma adı Pafta)

Tarih: 2026-10-09. Referans kopyalanacak model değildir; her satır öğrenilecek **tek şeyi** söyler. Hiçbir sitenin kodu, metni, görseli prototiplere alınmadı.

Tarama notu: Awwwards site sayfaları yerleşik tarayıcıyla açıldı (ödül ve tarih site sayfasından okundu; puanlar sayfanın sunucu çıktısında görünmediği için yazılmadı, Mansiyon için jüri ortalaması ≥ 6,5). Mobbin çalıştı (`search_screens`, `search_flows`). Firecrawl kullanılmadı (kredi bitti). Yurt dışı parsel araçları ayrıca web araması ve sayfa okumasıyla incelendi.

## Seçilen referanslar (8)
| Site | Kaynak (tarih, ödül) | Öğrenilecek tek şey | Teknik etiketi | Söküme değer mi |
|---|---|---|---|---|
| canibuild (canibuild.com), "ShowLot" akışı | Avustralya; ev üreticilerine satılan parsel aracı (ödül sitesi değil, işlev referansı) | Akış sırası: adres → model → evi parselde sürükle ve döndür; ölçü balonuna sayı yazınca ev o mesafeye kayar; **sonuç iletişim formundan önce** gelir. Vaziyet'te de sonuç önce, talep sonra; sürüklemenin sayıyla yapılan karşılığı | Kuşbakışı 2B parsel planı + ölçü balonu | Evet: ölçü balonuna sayı yazarak yerleştirme (sürüklemenin erişilebilir karşılığı) |
| Dwellito Site Planner (configure.so) | Dwellito pazaryeri Awwwards Mansiyon, 14 Mart 2019; Site Planner ev üreticilerine satılan B2B ürün | Sürükle-bırak yerleşim, **canlı çekme çizgileri** ve otomatik uygunluk uyarıları (yükseklik, taban alanı) aynı ekranda; tek tıkla teklif PDF'ine ekran görüntüsü. Vaziyet'in aracı Türkiye'de üreticinin kendi sitesinde bunu yapar | Parsel planı + kural uyarıları | Evet: kural ihlalinin plan üzerinde nasıl işaretlendiği |
| Goedhuis ev yapılandırıcısı (configurator.goedhuis.nl) | Awwwards Aday, 15 Aralık 2022 | Her seçimin yanında "Inclusief" ya da tutar: kalem kalem dahil/ek fiyat ve canlı toplam; teknik özetin içinde **saçak ve mahya yüksekliği**; "aynalı ev" seçeneği (planın ters çevrilmesi) | 3B yapılandırıcı + kalem listesi | Hayır (kalıp: maliyet dökümü ve yükseklik verisi) |
| Kononenko Mimarlık | Awwwards Günün Sitesi, Ağustos 2026 (atölye kaynak haritası) | Aynı içeriğin iki okuması arasında morf: Vaziyet B'de aynı sahne plan ↔ maket arasında eğilir, ölçü kaybolmaz | GSAP Flip görünüm modları | Evet (B'nin plan↔maket geçişi için) |
| Aktaş Prefabrik Ev (aktasprefabrikev.com) | Yurt içi, sektörün en iyi sitesi (`arastirma/RAPOR.md` 2.4) | Fiyat hesaplayıcı yeni rakam üretmez, **en yakın gerçek modeli** ve onun liste fiyatını gösterir; izin rehberi arsa türüne göre yol haritası ve "hukuki görüş değildir" | Hesaplayıcı + 3B ev tasarlayıcı + rehber | Hayır. Görsel dili (krem, italik bordo serif) kaçınılacaklar listesinde |
| Smart Çelik Yapı ev tasarım stüdyosu (smartcelikyapi.com/ev-tasarim-studyo) | Yurt içi | Kullanıcının çizdiği planın yanında **sınırını söyleyen** sorumluluk cümlesi ("otomatik kontrol ruhsat… imar uygunluğu onayı değildir"); arsanın kuzey yönü girdisi | 2B plan editörü + PDF | Hayır (dil kalıbı) |
| Zillow "Estimated net proceeds" (Mobbin akışı) | [Mobbin](https://mobbin.com/flows/372c4cf5-116e-4d77-93c6-e53cff5613c4) | Tahmini toplamın altında kalem kalem açılır satırlar, kaydırıcı ve tek satır dürüst dipnot ("tahminidir, gerçek tutar değişebilir") | Açılır maliyet dökümü | Kalıp olarak |
| komoot rota planlayıcı (Mobbin ekranı) | [Mobbin](https://mobbin.com/screens/bed1ae73-569b-4969-88c0-f9184a0d3275) | Solda girdiler, ortada büyük harita, altta tek şerit hâlinde ölçüler (mesafe, süre, eğim): Vaziyet'in "girdi · çizim · sonuç şeridi" düzeni | Panel + tuval + metrik şeridi | Kalıp olarak |

Yurt dışı notu: en iyi parsel araçlarının hepsi (canibuild, Dwellito, Archistar, kavelpaspoort) ana sahnede **kuzey oklu kuşbakışı 2B planı** kullanıyor; 3B ikincil. Bu yüzden önerilen B yönünde varsayılan görünüm plan, "Maket" sekmesi yükseklik için.

## Kategori rutini (kaçınılacak)
Bu kategorinin hep yaptığı sayfa (17 Türk üretici ve içerik sitesi, `arastirma/RAPOR.md`):
- Tam ekran karartılmış fotoğraf ya da havuzlu villa render'ı üstünde beyaz başlık ve slayt; "Hayalinizdeki ev", "Geleceğin yapı teknolojisi", "Lüksü yeniden tanımlayın", "X TL'den".
- Model ızgarası ya da fiyat tablosu; kapsam (temel, nakliye, KDV) dipnotta ve her sitede başka.
- Konutla şantiye kampı, yemekhane, kabin aynı menüde.
- Çerez bandı ve kampanya penceresi ilk ekranı kapatır; yüzen WhatsApp balonu; "2000+ proje", "18+ yıl" sayaçları.
- "Ruhsat gerekir mi?", "Tarlaya ev yapılır mı?" diye uzayan blog yazıları; bazılarında "ruhsat gerekmez" vaadi.

Onun tahmin edilebilir tersi: krem zemin + iri serif + ikinci satırı italik bordo + aralıklı büyük harf künye + 3B render ("premium editoryal"; sektörde Aktaş tam olarak bu) ve İskandinav minimal tiny house sitesi (beyaz, orman, A-çatı). İkisi de yasak.

Örnekler: Karmod ana sayfa (şantiye kampı slaytı), Smart Çelik ve SerVilla (havuzlu villa), Mooble (kampanya + çerez penceresi), Aktaş (premium editoryal). Ekranlar: `ekran/arastirma/` (git'e girmez).

## İşlevsel kalıplar (Mobbin)
| Kalıp | Örnek bağlantı | Bizim için not |
|---|---|---|
| Plan üzerinde birim seçme + yanında durum kartı | [Zillow, property map](https://mobbin.com/screens/f1ba004e-97b5-45f9-802c-3a7ab2722180) | Planın kendisi tıklanır; seçim kartı planın yanında, üstünde değil |
| Girdi paneli + büyük tuval + alt metrik şeridi | [komoot](https://mobbin.com/screens/bed1ae73-569b-4969-88c0-f9184a0d3275) | Telefonda sıra değişir: önce tuval ve sonuç, sonra girdiler |
| Kalem kalem tahmini maliyet, açılır satırlar, dürüst dipnot | [Zillow, Zestimate akışı](https://mobbin.com/flows/372c4cf5-116e-4d77-93c6-e53cff5613c4) | "Dökümü gör": fabrika teslim, nakliye, temel, vinç; altında "bu tutara dahil değil" |
| Aralıklı tahmin + "yalnız örnek amaçlıdır" notu | [DoorDash Merchant, promosyon önizleme](https://mobbin.com/screens/86676055-1448-4b15-9f97-1602ec8b6e27) | Toplam tek rakam değil aralık; yanında "tahmini" |
| Uygunluk aralığı göstergesi (hedef / üst sınır çubuğu) | [Zillow, BuyAbility akışı](https://mobbin.com/flows/8a965955-1fc3-4938-b6a8-d8d7af6d25de) | TAKS hakkının ne kadarı kullanıldı: 78 / 198 m² çubuğu |
| Fiyatın iki bloğa ayrılması | Abodu (abodu.com): "Ev" (fabrika, izin, nakliye) + "Kurulum" (temel, altyapı hattı, vinç) | Maliyet dökümü iki blok; altında "bu tutara dahil değil" |
| Taşmaya kesin hüküm vermeyen dil | Archistar (archistar.ai): "olası ihlal" | "Sınırı aşıyor görünüyor (tahmini)"; ruhsat dili hiçbir zaman "uygun/onaylı" demez |
| Tek sayfalık arsa pasaportu + hak doğmaz notu | Hollanda belediyelerinin "kavelpaspoort"u | Basılı vaziyet planı taslağı tek A4 ve "bu çizimden hak doğmaz" notuyla |
| Teslimat erişimi sorusu | Ecoliv (ecoliv.com.au): tır ve vinç erişimi | Talep özetinde yol genişliği, eğim, vinç erişimi |

## Kaçınılacaklar (bu projeye özgü)
- Havuzlu villa render'ı, gün batımında aile silueti, "hayalinizdeki ev", anahtar ve kalp-çatı ikonu, kuş yuvası.
- "Ruhsat gerekmez", "her araziye kurulur", "imarsız arsaya yasal", "depreme dayanıklı, yıkılmaz", "hobi bahçesi" adıyla ürün.
- Kurgusal sayaç, yorum, sertifika, "lider" iddiası; bankasız/kefilsiz vade vaadi.
- Gerçek bir belediyenin imar durumu belgesi düzeni, adı, logosu; e-Devlet ekranı taklidi.
- Kardeş demolara benzerlik (ve sektörün en iyisi Aktaş'ın krem, italik bordo serif editoryal görünümü): Sazbahçe'nin plan + antet yapılandırıcısı, Gelidonya'nın kâğıt sipariş formu ve tükenmez mavisi, Pazı'nın ölçü plakası ve RAL sarısı, Onikitaş'ın beyaz maketi ve gün döngüsü.
