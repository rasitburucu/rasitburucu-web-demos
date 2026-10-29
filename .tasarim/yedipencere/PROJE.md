# PROJE: Yedi Pencere (konsept demo)

- Tarih: 2026-10-09 · Durum: yön (Aşama 1 bitti: brif, saha araştırması, referans, yön adayları ve ilk ekran maketleri; taze gözden sonra 2 aday, seçim bekliyor)
- Repo: `D:/Yazılım Projeleri/rasitburucu-web-demos` · rota önerisi `app/yedipencere` → `rasitburucu.com/web/yedipencere/` · Tür: konsept demo (kurgusal marka)
- Vitrinin 7. demosu (Onikitaş villa, Revak okul, Kalemkâr restoran, Pazı cobot, Sazbahçe düğün, Gelidonya sera). Aynı turda Damar (mermer) ve Pafta (prefabrik ev) da Aşama 1'de.
- Girdi: onaylı plan `~/.claude/plans/bana-yeni-tane-elegant-wreath.md` (Fikir 1), saha araştırması `arastirma/RAPOR.md`.

## Marka (kurgusal)
- Ad: **Yedi Pencere**. Alt satır: "Kaleiçi'nde konak otel" (EN: "A townhouse hotel in Kaleiçi, Antalya"). Slug: `yedipencere`.
- Ad nereden: konağın yedi odası, her odanın kendi penceresi var; site odayı penceresinden seçtirir. Ad ürünün yapısını söyler, süs değildir.
- İsim kontrolü (2026-10-09, ayrıntı `arastirma/RAPOR.md` §6): otelcilikte ya da Antalya'da "Yedi Pencere" adlı işletme bulunamadı. `yedipencere.com` bir kişisel sanat blogu (Twitter/Facebook'ta @YediPencere); Çıralı'da (Kemer, Antalya) "Yedi (7) Butik Hotel" var. Doğrudan çakışma yok, ad kalabilir. Yedek gerekirse: "Kafesli Konak", "Yedi Cumba" (aramada eşi çıkmadı).

## Tasarım okuması (tek satır)
Bunu şöyle okuyorum: yedi odalı bir konak otelin doğrudan rezervasyon sitesi (önce Kullanım, sonra İkna), Kaleiçi'ne ilk kez gelecek yerli ve yabancı çiftler için; tarihî yapı rölövesi (ölçüm çizimi) dili; ana hamle: oda, konağın kendi çiziminde penceresinden seçilir ve her pencere o odanın gerçeğini (manzara, kapıdan basamak, gece sesi, tavan, fiyat) söyler; varış kuşbakışı harita yerine gerçek yaya yolundan çıkarılmış "kapıdan kapıya" şeridiyle anlatılır.

## Konu ve iş
- **Konu:** Kurgusal tarihî konak otel. Konum gerçek coğrafya: Kaleiçi'nin güneybatı kenarı, Hıdırlık Kulesi ile Mermerli arasındaki falezin üstü (kapı numarası verilmez). 19. yüzyıl sonu; zemin + bir kat + köşk katı. Kaleiçi evlerinin belgeli öğeleri: sokağa açılan çift kanatlı kapı, çakıl mozaikli **taşlık**, avlu ve **sarnıç**, taşlıktan çıkan ahşap merdiven, **sofa**, süslemeli ahşap tavanlı baş oda, sokağa taşan **cumba**, demir parmaklıklı zemin pencereleri, 45° pahlı köşeler (`arastirma/RAPOR.md` §5). Falez tarafındaki odalar körfezi ve karşı kıyıdaki Beydağları'nı görür; sokak ve avlu tarafı görmez. Bu ayrım, "deniz mi, avlu mu, sokak mı" seçimini anlamlı kılar.
- **Gerçek dünyadaki karşılığı:** Kaleiçi'nde onlarca butik/konak otel var; 15'inin resmî sitesi incelendi. Hepsi odayı tip olarak satıyor; hiçbiri asansör olup olmadığını yazmıyor; 12'si varışı hiç anlatmıyor; hiçbirinde cephe/plan üzerinden oda seçimi ya da metreli, basamaklı yürüyüş rotası yok.
- **Sitenin tek işi:** ziyaretçinin tarih ve kişi seçip **belirli bir odayı** (tip değil) seçmesi ve otelin rezervasyon motoruna (demoda: rezervasyon özeti) geçmesi. Başarı: rezervasyon özeti açıldı. İkincil iş: varış planını (kapıdan kapıya şerit) kaydetmek ya da yol arkadaşına göndermek.
- **Sitenin alıcısı (otelci) neden alır:** aracı platform her rezervasyondan komisyon alır. Booking.com ortalama komisyonunu %15 açıklamıştı (2017); büyük zincirlerin çevrim içi acentelere %15–25 ödediği aktarılıyor; Türkiye'de yabancı platformlara yurt içi satışta %17 komisyon tavanı getiren teklif 7 Ekim 2026'da TBMM komisyonundan geçti, henüz yasalaşmadı (kaynaklar `arastirma/RAPOR.md` §8). Doğrudan rezervasyon getiren site kendini öder. Otelcinin ilk sorusu "müsaitlik nereden gelecek?": site, otelin kullandığı kanal yöneticisine ya da rezervasyon motoruna bağlanır. Kaleiçi'nde görülenler: HotelRunner, Exely/TravelLine, Rezervasyonal, Reseliva, Mirai, Vertical Booking. Demoda doluluk örnek veridir ve bu sitede yazar.
- **Kitle ve kullanım sahnesi:**
  - Yabancı çift (Varsayım: Almanya, Birleşik Krallık, Rusya, Hollanda), 30–65 yaş. Oteli bir platformda bulmuş, "doğrudan daha iyi mi, hangi oda?" diye otelin kendi sitesine gelir. Akşam, tablet ya da telefon; acelesi yok, karşılaştırıyor. Kaygıları: manzara gerçekten deniz mi, bavulla kaç basamak, gece gürültü var mı, taksi kapıya gelir mi.
  - Yerli çift (İstanbul, Ankara): hafta sonu kaçamağı, telefonda; çoğu araçla gelir. Baskın soru: aracı nereye bırakırım, Kaleiçi'ne girebilir miyim.
  - Hareket kısıtlı ya da yaşlı misafir, bebek arabalı aile: basamak bilgisi karar verdirir.
  - Otelci (asıl alıcı): sezon dışında siteyi yeniletir (Varsayım: Kasım–Mart); satış görüşmesinde masaüstünde bakar.
  - Sonuç: telefonda tek elle kullanılır cephe ve tarih seçimi; sabit alt çubuk (Tarih · Ara · Rezervasyon). Tema yöne göre (A ve C gündüz açık, B akşam koyu); yoğunluk orta.
- **Yüzey modu:**
  | Sayfa | Mod |
  |---|---|
  | Ana sayfa: cephe/oda seçici + tarih + oda kartı | Kullanım + İkna |
  | Oda ayrıntısı (7 oda) | İkna + Kullanım |
  | Varış: kapıdan kapıya | Kullanım |
  | Konak ve avlu (taşlık, sofa, kahvaltı) | İkna + Okuma |
  | Rezervasyon özeti | Kullanım |
  | Ev kuralları ve SSS (asansör yok, giriş-çıkış, çocuk, iptal) | Okuma |
- **Sayfa sırası (alıcının satın alma sırası):** tarihlerim boş mu ve hangi oda bana göre → oraya nasıl varırım (bavulla) → evin kendisi → özet ve rezervasyon.

## Kurgusal konak ve yedi oda (Varsayım; site verisi, kanıt değil)
Basamak = sokak kapısından oda kapısına. Kat yüksekliği 3,40 m, rıht 17–18 cm varsayımıyla; köşk katına son 14 basamak dar ahşap merdiven. Fiyatlar "örnek", sitede de öyle yazar.

| Oda | Kat | Ne görür | Kapıdan basamak | Tavan | Gece | m² | Yatak | Örnek fiyat (TL/gece) |
|---|---|---|---|---|---|---|---|---|
| Taşlık | Zemin | Sokak (demir parmaklıklı pencere) | 1 | 3,80 m, taş duvar, ahşap kiriş | Hafta sonu gece yarısına kadar sokaktan geçenler duyulur | 17 | Çift | 4.600 |
| Avlu | Zemin | Avlu, turunç ağacı ve sarnıç | 2 | 3,60 m, ahşap kiriş | Sessiz | 18 | Çift | 5.200 |
| Cumba | 1. kat | Sokak, cumbadan iki yöne | 21 | 3,20 m, ahşap | Cuma ve cumartesi gece yarısına kadar sokak sesi | 20 | Çift + sedir | 5.900 |
| Sofa | 1. kat | Avlu (sofaya açılır) | 21 | 3,40 m, göbekli süslemeli ahşap tavan | Sessiz | 26 | Çift + sedir | 7.400 |
| Körfez | 1. kat | Deniz, Konyaaltı ve Beydağları | 23 | 3,20 m | Yaz akşamları limandan müzik gelebilir | 22 | Çift | 8.600 |
| Hıdırlık | Köşk katı | Deniz ve yanda Hıdırlık Kulesi | 35 | 2,90 m, çatı ahşabı | Sessiz | 19 | Çift | 9.200 |
| Köşk | Köşk katı | Deniz, üç yönden pencere | 37 | 3,10 m, çatı ahşabı | Rüzgâr ve dalga | 28 | Çift + oturma köşesi | 12.400 |

Konakta asansör yok; sitede bu, her odanın basamak sayısıyla birlikte açıkça yazar. Basamak istemeyen misafire iki zemin oda (1 ve 2 basamak) önerilir.

## Varış verisi (gerçek; ayrıntı `arastirma/RAPOR.md` §4, ham özet `arastirma/osm-rota-ozet.json`)
Kapı noktası yaklaşık: Hıdırlık Sokak, falez kenarı. Mesafe ve basamak OpenStreetMap yaya ağından; yükseklik SRTM 30 m'den (yalnız toplam fark güvenilir, sokak eğimi değil).

| Nereden | Yürüme | Basamak (OSM) | Yükseklik | Bavulla basamaksız yol |
|---|---|---|---|---|
| Kale Kapısı durağı (nostaljik tramvay, taksi bırakma) | 735 m | yok | 42 → 32 m, hafif iniş | aynı yol |
| İsmetpaşa durağı (AntRay: havalimanı ve otogar hattı) | 948 m | yok | 46 → 32 m | aynı yol |
| Üç Kapılar / Hadrian Kapısı (açık otopark yanı) | 737 m | 10 iniş + 13 çıkış | 43 → 32 m | 851 m (+114 m), kısa Arnavut kaldırımı |
| Yat Limanı (marina) | 765 m | 42 m'lik taş merdiven (sayısı OSM'de yok) | 2 → 32 m, 30 m çıkış | 849 m; İskele Caddesi ve Merdivenli Sokak, Arnavut kaldırımı yokuş |
| Cumhuriyet Meydanı yeraltı otoparkı | 958 m | 67 m'lik merdiven | 43 → 32 m | 1.068 m |

## İçerik envanteri
| İçerik | Var mı | Kaynak | Not |
|---|---|---|---|
| Metin | Yok | Biz yazarız; TR önce, EN elle | `METIN-ONAY.md` tablosuyla Raşit onayı |
| Fotoğraf | Yok | Maketlerde Unsplash bağlantıları (kaynaklar `YON-ADAYLARI.md` §7) | İnşada yerel kopya + `THIRD_PARTY.md`; gerçek bir otelin fotoğrafı ya da cephesi kullanılmaz. Yön B'de görseller Blender modelinden |
| Rölöve ve kesit çizimi | Yok | Biz çizeriz (SVG), kurgusal konak | Gerçek bir yapının rölövesi kopyalanmaz; Eldem vb. çizimlerin dili öğrenilir, çizim alınmaz |
| Logo, renk, font | Prototipte | Google Fonts (SIL OFL) | Türkçe glif kontrolü `YON-ADAYLARI.md` §7 |
| Gerçek kanıt | Yok | — | Puan rozeti, misafir yorumu, ödül, "en iyi fiyat garantisi" yazılmaz |
| Müsaitlik | Kurgu | Tohumlu örnek veri | "Örnek doluluk" etiketi; gerçek kurulumda kanal yöneticisi |
| Yürüyüş şeridi | Gerçek + açık | OSM (ODbL, atıf zorunlu) + SRTM 30 m | Mesafe tam; basamak, yüzey, eğim kısmen. Eksikler sahada bir kez ölçülür |
| Ulaşım bilgisi | Gerçek | AntRay ve nostaljik tramvay durakları, otoparklar (OSM), panoramik asansör | Saat ve ücret yazılmaz ya da "teyit edin" notuyla |
| Araç giriş kuralı | Doğrulanamadı | En yeni yazılı kural 2017 UKOME kararı | Sitede "kural değişebiliyor, varmadan önce bize yazın" |
| 3B / ses | Yok | Yön B seçilirse Blender | Ses yok |

İçerik açıkları ve kim sağlar:
1. Oda iç fotoğrafları ve pencere manzaraları: demoda Claude (lisanslı stok ya da Blender); gerçek müşteride aynı saatte, aynı ışıkta tek çekim günü.
2. Basamak sayıları ve rota yüzeyleri: demoda OSM + "örnek"; gerçek müşteride otel personeli dört rotayı bir kez yürür, basamak sayar, her dönemeçte fotoğraf çeker (yaklaşık bir saat).
3. EN metin: TR onayından sonra Claude.
4. Ev kuralları, giriş-çıkış saatleri, fiyatlar: Varsayım; Raşit onaylar.
5. Kanal yöneticisi bağlantısı: demoda yok; satış konuşmasında "sizin sisteminize bağlanır" diye anlatılır.

## Kısıtlar
- Diller: TR + EN, ikisi de demoda (TR önce; EN elle yazılır, makine çevirisi yok). DE ve RU yok (Varsayım; gerçek müşteride istenir).
- Süre: Aşama 1 bugün; inşa yön seçiminden sonra (plan: worktree `-wt/yedipencere`, port 3350).
- Bütçe: 0 (OFL font, açık lisanslı ya da üretilmiş görsel, OSM verisi).
- İçeriği düzenleyen: Claude, `content/yedipencere/*.ts`.
- Barındırma: statik export → `rasitburucu.com/web/yedipencere/`. Rota verisi derleme anında alınır (Sazbahçe'deki `fetch-sazbahce-map.mjs` gibi); sayfa çalışırken dışarıya istek atmaz.
- Formlar hiçbir yere gönderilmez; her sayfada "Konsept çalışma — rasitburucu.com" şeridi; rezervasyon özetinde "Bu bir tasarım örneği" notu.

## Hedef ve "bitti" ölçütü
- Hedef: satış vitrini (otel sahibine "bunu istiyorum" dedirtmek) + portföy.
- Bitti ölçütü: kalite tabanı geçti (kontrast, klavye, azaltılmış hareket, Türkçe); 390 px'te cephe seçici ve tarih ilk ekranda kaydırmadan kullanılır; 390 → 2560 beş genişlikte gerçek kaydırma kareleriyle çakışma kontrolü yapıldı; taze göz puanı ≥ 7,5; TR metin Raşit onaylı; EN doğal.

## Açık kararlar
| Karar | Seçenekler | Kim | Tarih |
|---|---|---|---|
| Yön | A Rölöve (önerilen, taze göz ≈7,35) / B Akşam Kesiti (≈7,1) / Kanon. C Çakıl taze gözde elendi (≈6,8) | Raşit | — |
| Görsel üretimi | Çizim + lisanslı fotoğraf (A, C) / tek Blender modeli (B) | Raşit | inşa öncesi |
| Fiyat gösterimi | Oda başına "örnek" etiketli fiyat (öneri) / fiyatsız | Raşit | — |
| Sokak adı sitede geçsin mi | Şeritte gerçek sokak adları, kapı numarası yok (öneri). Not: Hıdırlık Sokak'ta gerçek oteller var (Route, Antalya Inn) | Raşit | — |
| EN kapsamı | Bütün sayfalar (öneri) / yalnız ana akış | Raşit | — |
