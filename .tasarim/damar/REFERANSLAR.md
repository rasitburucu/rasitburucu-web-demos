# REFERANSLAR: Damar

Tarih: 2026-10-09. Referanslar kopyalanacak model değil; her satır öğreneceğimiz **tek şeyi** söylüyor. Hiçbir sitenin kodu, metni ya da görseli maketlere alınmadı.

Tarama notu:
- Awwwards site sayfaları yerel Playwright'la açıldı; ödül ve tarih sayfanın kendisinden okundu. Awwwards'ta doğal taş kategorisinde Günün Sitesi ödülü almış bir site bulunamadı; en üst düzey Mansiyon (HM).
- Mobbin çalıştı (`search_sections`).
- Firecrawl kredisi bitmişti, kullanılmadı. Web araması oturum sınırına takıldı; gerisi doğrudan sayfalar üzerinden yürüdü.
- Gerçek piyasa: `arastirma/RAPOR.md` (17 Türk sitesi).
- İç not ekran görüntüleri: `ekran/referans/` (git'e girmez).

## Seçilen referanslar (8)

| Site | Kaynak | Öğrenilecek tek şey | Teknik etiketi | Söküme değer mi |
|---|---|---|---|---|
| Arc Surfaces, "Live Inventory" (ABD dağıtıcısı) | Ödülsüz, gerçek piyasa; 2026-10-09'da denendi | **Kitap açılımı düğmesi stok bilgisinin hemen yanında durmalı.** Gerçek plaka fotoğrafı, "Bookmatch view" düğmesi, yanında depodaki/ayrılmış/satılabilir plaka sayısı, ebat, kalınlık, yüzey. Yani alıcı bu görünüme zaten alışık. Bizim farkımız: ardışık iki plakayı açmak, aynı fotoğrafı aynalamak değil. | Görüntüyü aynalama + döndürme | Evet, işleyiş olarak: plaka kartının bilgi düzeni (kod değil) |
| Ermaş (Muğla) | Ödülsüz; Muğla'nın en alıcı odaklı sitesi | **Mimara tek bir bölge.** BIM, CAD dokusu, föy, renk kartı ve numune formu tek yerde. Ayrıca "Ardışık Kesim" başlıklı 6 numaralı plaka ve döndürülebilir 3B plaka önizlemesi var. Aşmamız gereken yerel çıta bu; site yalnız Türkçe. | 3B plaka önizlemesi | Hayır (rakip; fikir düzeyinde biliyoruz) |
| Kaymer (Antalya) | Ödülsüz; 17 Türk sitesinin en iyisi | **Satın alma sürecini adım adım yazmak:** talep, teklif, seçim, numune onayı, üretim, sevk. Teslim şartları ve belgeler tek sayfada; site 0,3 MB. | Hafif statik site | Hayır |
| Palet, özel seramik karo (Verve + Baast Studio) | Awwwards Mansiyon, 4 Nisan 2024 | **Ana çağrı yapılandırıcı olmalı ("Design your tile").** İlk cümlede somut ticari bilgi var: 1 m²'den başlayan sipariş ve 8 haftadan başlayan teslim süresi. Bizde karşılığı: en az sipariş, blok başına m², sevk süresi. | 3B başlık + karo tasarlayıcı | Evet: tasarlayıcıdan siparişe geçiş akışı ("Create, design, order") |
| BAS Stone by DD.NYC (New York taş deposu) | Awwwards Mansiyon, 5 Haziran 2024 | **Taşı nesne olarak, açık zeminde göstermek** (#E5E5E2 / #D3D3CF). Kategorinin koyu, tam ekran doku klişesini bu kırıyor. Bir de "koleksiyon" ile "mekânda taş" ayrımı. Almayacağımız: büyük didone başlık ve şiirsel slogan ("premium editoryal" kalıbı). | Dekupe taş fotoğrafı, kaydırıcı | Hayır |
| Scalvini Marmi (İtalyan mermer üreticisi, Basilico) | Awwwards Mansiyon, 19 Aralık 2023 | **Çıta ayarı:** Mansiyon alan taş sitesi koyu zemin (#212121), büyük grotesk slogan ve üretim hikâyesiyle kuruluyor; stok yok, föy yok, numune yok. Yani tasarım puanı tek başına tipografiyle alınabiliyor; bizim payımız bunun üstüne işlev. | Kaydırma anlatımı, geçişler | Hayır |
| Polycor (ABD/Kanada ocak sahibi) | Ödülsüz; araştırma raporunda incelendi | **Numune bir ürün gibi sipariş edilir:** rol (mimar, yüklenici…), taş ve yüzey, adet, teslim adresi, tahmini kargo. "Bize ulaşın" ile geçiştirilmez. | Numune sepeti | Evet, işleyiş olarak: form alanları |
| Rivian ve Lightship yapılandırıcıları (Mobbin) | Ürün arayüzü arşivi | **Büyük önizleme + seçenek sütunu + görünüm düğmeleri.** Rivian: solda büyük ürün, sağda renk örnekleri. Lightship: önizlemenin üstünde Dış / İç / Plan düğmeleri. Bizde: Plaka / ×2 / ×4 / Duvar / Tezgâh düğmeleri ve yüzey seçimi. | Yapılandırıcı düzeni | Kalıp olarak (işleyiş) |

Lundhs Real Stone (Norveçli larvikit ihracatçısı, Awwwards Mansiyon 2017) da adaydı. Elendi: canlı bağlantısı artık "Page not found" veriyor.

## Kategori rutini (kaçınılacak)

Bu kategorinin hep yaptığı sayfa (17 Türk sitesinden ve Scalvini'den):
- **İlk ekran:** tam ekran koyu mermer dokusu ya da ocaktan drone videosu. Üstünde aralıklı büyük harf ya da altın-serif bir slogan ("doğanın sanatı", "zamansız zarafet"). İki düğme: "Taşları keşfet", "Ocaklarımız".
- **Menü:** Hakkımızda, Ocaklar, Fabrikalar, Ürünler, Projeler, Katalog (PDF), İletişim.
- **Ürünler:** kare taş fotoğraflarından ızgara; taş sayfası ya boş ya serbest metin.
- **Güven unsurları:** kapasite sayaçları ("60 ülke", "1.000.000 m²"), ISO rozetleri, bayat fuar afişi, sağ altta WhatsApp balonu, bayraklı makine çevirisi.
- **Eksikler:** teknik değer ve standart adı, blok/plaka numarası, teslim şartı (FOB/CIF), numune akışı, teslim süresi.

Onun tahmin edilebilir tersi: beyaz galeri. Açık zemin, büyük didone serif, tek bir dekupe taş, şiirsel İngilizce slogan (BAS Stone'un yolu). Güzel ama "premium editoryal" kalıbı: hiçbir alıcı sorusunu cevaplamıyor.

İkisi de yasak. Bizim yolumuz: ilk ekranda iş başlar (blok, plaka, açılım, konteyner), sanat yönü bunun üstüne giyer.

Örnekler: `ekran/arastirma/ermas-1440.png` (koyu doku + aralıklı büyük harf), `koçar` / `kentmer` (drone), `temmer` (yaşam tarzı mutfağı), `ekran/referans/scalvini-1440.png`, `basstone-1440.png`.

## İşlevsel kalıplar (Mobbin ve gerçek siteler)

| Kalıp | Örnek bağlantı | Bizim için not |
|---|---|---|
| Yapılandırıcı: büyük önizleme + seçenek sütunu | [Rivian R1T yapılandırıcı](https://mobbin.com/sites/sections/ab519b04-e8c0-4260-a70a-c8577fdcb520) | Taş, açılım ve yüzey seçimi sağ sütunda; önizleme sayfanın çoğunu kaplar |
| Önizleme üstünde görünüm düğmeleri | [Lightship](https://mobbin.com/sites/sections/2c2af3e7-b4ea-4f46-bc5e-deb7195e6760) | Plaka / ×2 / ×4 / Duvar / Tezgâh |
| Yüzey seçimi küçük hap içinde | [Oura "A finish for every lifestyle"](https://mobbin.com/sites/sections/30e57360-bd10-46cd-80b7-99aafc7c93aa) | Cilalı / Honlu / Eskitme seçimi önizlemenin altında |
| Toptan talep formu | [Graza toptan talep](https://mobbin.com/sites/sections/48277ebc-1984-41a6-b25e-f2ee7c4404f2) | "Hedef teslim tarihi" ve "en az 100 ürün" alanları. Bizde: hedef sevk ayı, m², varış limanı |
| Kurumsal sipariş talebi (iletişim + sipariş ayrıntısı yan yana) | [Blue Apron kurumsal](https://mobbin.com/sites/sections/9d4c1894-63c8-40ee-a561-8cc8a3c391cc) | Solda kim olduğu, sağda ne istediği. Teklif özeti tek kartta |
| Stok kartı + kitap açılımı düğmesi | Arc Surfaces Live Inventory (`ekran/referans/arc-bookmatch-1440.png`) | Plaka sayısı (stokta / ayrılmış / satılabilir), ebat aralığı, kalınlık, yüzey |
| Numune siparişi | Polycor "Request samples" (araştırma raporu 2.5) | Rol, taş + yüzey, adet, adres, tahmini kargo |

## Kaçınılacaklar
- **Arka plan olarak koyu, tam ekran mermer dokusu.** Hem kategori klişesi hem plaka görüntüsüyle yarışıyor; taşın kendisi önizlemede durmalı, zeminde değil.
- **"Lüks" işaretleri:** altın ya da pirinç vurgu, Roma yazıtı büyük harfleri (Trajan, Cinzel gibi; "mermer = Roma" klişesi). Kelimeler: "zamansız", "doğanın sanatı", "uniqueness of nature".
- **Hero görselleri:** ocaktan drone videosu, Noel süslü mutfak adası gibi yaşam tarzı fotoğrafı.
- **Kendini öven sayılar ve gürültü:** sayaçlar, "60 ülkeye ihracat", bayat fuar afişi, bayrak çubuğu, açılışta 18 slayt.
- **Uydurmalar:** referans proje, ödül, sertifika numarası. Gerekirse `[örnek]` etiketiyle.
- **Gerçek ad ve iddia:** gerçek taş adı (Milas Lilac, Muğla White…), coğrafi işaretli ad, "dünyada ilk".
