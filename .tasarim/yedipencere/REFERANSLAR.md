# REFERANSLAR: Yedi Pencere

Tarih: 2026-10-09. Referans kopyalanacak model değildir; her satır öğrenilecek **tek şeyi** söyler. Hiçbir sitenin kodu, metni, görseli maketlere alınmadı.

Tarama notu: Awwwards site sayfaları yerleşik tarayıcıyla açıldı; puan ve tarih sayfadan okundu (White Desert, Units, Tandjung Sari, Poklonnaya 9, Sobha Privy Collection). Mobbin MCP çalıştı (`search_sections`, `search_flows`, `search_screens`). Firecrawl kullanılmadı (kredi bitti). Kaleiçi'ndeki 15 otel sitesinin sahası `arastirma/RAPOR.md`'de.

Kalibrasyon: konaklama kategorisinde son SOTD'ler 7,2–7,4 aralığında (White Desert 7,31, Units 7,33, Tengile MalaMala 7,22). Hiçbiri WebGL'e dayanmıyor; güçlerini fotoğraf disiplini ve iki renkli paletten alıyorlar. Bizim farkımız işlevde: hiçbiri tek tek oda seçtirmiyor.

## Seçilen referanslar (8)
| Site | Kaynak (tarih, puan) | Öğrenilecek tek şey | Almayacağımız | Teknik etiketi | Söküme değer mi |
|---|---|---|---|---|---|
| White Desert (Malvah) · yurt dışı | Awwwards SOTD 11 Eyl 2026, 7,31 · Geliştirici 7,61 | Lüks konaklamada her ürün (kamp, rota) kendi olgu sayfasıyla satılıyor; iki renk (#1F2A44, #E9E7E1) ve fotoğraf disiplini | Antarktika tonundaki lacivert-krem palet; tam ekran video | Next.js, GSAP, Contentful | Hayır (kalibrasyon) |
| Kononenko Mimarlık · yurt dışı | SOTD Ağustos 2026 (atölye kaynak haritası) | Aynı içeriğin görünüm modları arasında morf (GSAP Flip). Bizde: cephe ↔ kesit ↔ oda listesi geçişi | Portfolyo ızgarası | GSAP Flip | **Evet** (yön A ve B'de görünüm geçişi) |
| AeroLOPA (aerolopa.com) · konu dışı | Ödül yok; uçak koltuk haritası arşivi | Her koltuk "İyi / Dikkat / Kaçının" ile ve gerekçesiyle (pencere hizası, diz mesafesi, tuvalete yakınlık) çizimin üstünde. Olumsuz bilgiyi saklamamak çizimi güvenilir kılar. Bizde: "37 basamak", "hafta sonu sokak sesi" | Kabin şeması estetiği, renk kodlu koltuk kalabalığı | Teknik çizim + birim başına not | Hayır (fikir) |
| John Ogilby, Britannia (1675) şerit yol haritaları · konu dışı | Basılı atlas; Brock Üniversitesi ve Stanford'da sayısal kopyası | Rota yolcunun gidiş yönüne göre döner, kuzeye göre değil; yol boyu mesafe, yokuş işaretleri, nirengiler (köprü, kilise). "Kapıdan kapıya" şeridinin kökü | Antika harita kostümü (sararmış kâğıt, kartuş, pusula gülü süsü) | Şerit harita | Hayır (fikir) |
| AccessAble ayrıntılı erişim rehberleri · yurt dışı | accessable.co.uk (İngiltere) | Ölçülü, yargısız dil: "iki basamak, en yükseği 14 cm, korkuluk yok; giriş rampası dik". Basamak ve rota bilgisini yazma kalıbı | Uzun form düzeni, ikon kalabalığı | İçerik kalıbı | Hayır |
| Sedad Hakkı Eldem, Türk Evi rölöveleri · yurt içi | Basılı (Türk Evi Plan Tipleri 1954; Türk Evi 1984–87) | Türk evi görünüş ve kesitlerinin çizim grameri: çizgi kalınlığı sırası, cumba konsolu, saçak, kafes, moloz taş ve ahşap taraması | Çizimlerin kendisi (telifli); plan tipi sınıflandırmasının akademik dili | Mürekkep rölöve | Hayır (dil öğrenilir, çizim sıfırdan) |
| tuvanahotel.com · yurt içi, Kaleiçi | Saha, 2026-10-09 | Kaleiçi'nde varışı yazıyla anlatan tek iyi örnek: havalimanından ve otogardan km işaretli tarif, iki giriş için ayrı yol, vale buluşma noktası | Düz metin bloğu, haritasız anlatım, bozuk İngilizce, 2019 WordPress | İçerik | Hayır |
| routehotelkaleici.com · yurt içi, Kaleiçi | Saha, 2026-10-09 | Odayı fiziksel gerçeğiyle tek tek anlatan tek site: sur duvarı, iki zeytin ağacı, parka açılan kapı, "15 m merdivenle 1 dakikada plaj" | Ekranı kaplayan grup logosu, dağınık düzen, yüzen düğmelerin metni örtmesi | İçerik | Hayır |

Konudan uzak ama ilgili not: konut projesi sitelerinde bina cephesi ya da kat planı üzerinden daire seçmek yaygın bir kalıp (ör. Vide Infra'nın Poklonnaya 9 işi "görsel daire seçimi" diye anlatılıyor; Awwwards SOTD 21 Oca 2022, 7,5). Otelde aynı fikri kimse kullanmıyor; iddiamızı "Kaleiçi'nde incelediğimiz 15 otel sitesinde yok" diye sınırlıyoruz.

## Kategori rutini (kaçınılacak)
Bu kategorinin hep yaptığı sayfa (Kaleiçi'ndeki 15 otel sitesi ve Mobbin'deki otel kahramanları):
- Tam ekran, oklu kaydırıcı: alacakaranlıkta cumbalı beyaz konak, palmiyeli avlu havuzu, dantelli yatak, limanın dron çekimi.
- Üstüne yapışık tarih çubuğu "Giriş · Çıkış · Kişi · ODA BUL"; yanında "8,9/10" puan rozeti ve "en iyi fiyat garantisi".
- Koyu zemin + altın/bronz ("Osmanlı lüksü"), arma, kemer, madalyon ya da el yazısı logo.
- "Odalarımız": Standart / Deluxe / Suit kartları, aynı özellik listesi, oda yerine tip.
- Yüzen WhatsApp balonu, çerez bandı, "Hoş geldiniz", "Tarihle iç içe", "Kaleiçi'nde bir inci".
- İletişimde gömülü harita (çoğu zaman bozuk), varış bilgisi yok.

Onun tahmin edilebilir tersi (o da yasak): "premium editoryal" butik otel: krem kâğıt, ince serif, italik ikinci satır, her başlığın üstünde aralıklı büyük harf etiket, siyah-beyaz yaşam tarzı fotoğrafı, "Slow living in the old town" (Mobbin'deki KOBU kahramanı bu çizginin örneği: serif başlık + "Book Now ↗" + tek fotoğraf). Tandjung Sari'nin kırmızı #A62A23 + krem #F1ECDE paleti de bu izin ta kendisi.

Örnekler: `arastirma/RAPOR.md` §1 ve §2.4; Mobbin [KOBU otel kahramanı](https://mobbin.com/sites/sections/79b3c5a4-83c8-46f4-a63a-fcd4697964cd).

## İşlevsel kalıplar (Mobbin)
| Kalıp | Örnek bağlantı | Bizim için not |
|---|---|---|
| Oda seçimi: tarih ve kişi üstte sabit, oda kartında yatak, kişi, olanak, iptal koşulu, fiyat, tek düğme; ayrı "Erişilebilirlik" sekmesi | [Expedia, Choosing a room](https://mobbin.com/flows/e87f6f40-6e2b-4f5a-8bba-26db2fb878cd) | Tarih seçimi alışılmış kalıpta kalır (yeniden icat edilmez); bizde kart "tip" değil tek oda ve erişilebilirlik ayrı sekme değil, kartın ilk satırı (basamak) |
| Rezervasyon özeti: giriş-çıkış saatleri, oda, fiyat ayrıntısı, şimdi ya da otelde öde | [Expedia, Reserving a room](https://mobbin.com/flows/0bc816fd-c964-40dc-95db-81486a00f0fc) | Özet tek sayfa; ödeme demoda yok, "Bu bir tasarım örneği" |
| Yükselti profili: mesafe ekseninde yükseklik, yüzey türüne göre renkli parçalar, yol boyu işaretler | [komoot, rota ayrıntısı](https://mobbin.com/screens/f87c2397-d781-4aaa-bae8-0f05ab298af2) | Liman seçeneğinde 30 m'lik çıkış tek bakışta görünür; yüzey "Arnavut kaldırımı / taş kaplama / bilinmiyor" |
| Dikey durak şeridi: başlangıç → duraklar → varış | [GetYourGuide, güzergâh](https://mobbin.com/screens/4c6089bb-c5ed-4e53-8b37-307c502463ea) | Telefonda şerit dikey akar; her durak bir karar noktası (merdiven, dönemeç, bavul teslimi) |
| Varış modu seçimi: araç / toplu taşıma / yürüme, hedef değiştir | [Zillow, Travel times](https://mobbin.com/screens/94ef7f4a-907a-44ae-b484-542a3f05e7ce) | Bizde dört düğme: Havalimanı · Otogar · Kendi aracınız · Marina |

## Kaçınılacaklar (bu projeye özgü)
- Altın/bronz + koyu zemin, arma/madalyon logo, el yazısı; lale, nazar, çini deseni, "Osmanlı" pastişi.
- Kaydırıcı + puan rozeti + "en iyi fiyat garantisi" (kanıtsız), "son 1 oda" baskısı, sayaç.
- Kuşbakışı harita + iğne (varış aracımız şerittir; harita yalnız küçük bir "yerini gör" bağlantısı olabilir).
- Mavi "blueprint" kostümü, CAD ekranı taklidi (koordinat, katman paneli), her yere mono büyük harf etiket. Rölöve dili gerçek ölçüyü taşıdığı yerde kalır (kot, basamak, metre), süs etiketi olmaz.
- Gerçek bir otelin cephesi, fotoğrafı ya da oda adı. Kaleiçi'nde çekilmiş stok fotoğraf yalnız maket yer tutucusudur.
- Kardeş demolara benzerlik: Sazbahçe'nin tepeden "Kıyı Planı" ve künye bloğu, Pazı'nın ölçü plakası ve RAL sarısı, Gelidonya'nın sipariş fişi. Aynı turda Pafta (prefabrik ev) da büyük olasılıkla tepeden arsa/vaziyet planı kullanacak: Yedi Pencere'nin çizimi dikeydir (görünüş ve kesit), tarihî bir yapının mürekkep rölövesidir; tepeden plan kullanmaz. Üç demonun yan yana "teknik çizim" yorgunluğu yaratma riski `YON-ADAYLARI.md` §6'da.
