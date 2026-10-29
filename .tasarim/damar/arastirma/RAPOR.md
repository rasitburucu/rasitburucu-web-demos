# Damar — Türk doğal taş ve mermer ihracatçı siteleri araştırması

- Tarih: 2026-10-09 · Amaç: kurgusal "Damar" (Muğla/Milas mermer ihracatçısı) konsept demosuna girdi. Kod yok, yalnız saha araştırması.
- Yöntem: web araması, Stonecontact kayıtları ve haberlerden aday listesi → alan adı denemesi → **12 yeni firma ayrıntılı** + **daha önce bakılmış 5 site hızlı bakış** (tablolarda "(önceki)").
  - Muğla: 6 firma Muğla merkezli (Alpay, Ermaş, Ayhan, Kentmer, Koçar, Karmaden); 1 firmanın ocağı Milas'ta, fabrikası İzmir Torbalı'da (Eminoğlu SBV).
  - Diğer: Aytaş Akın (Burdur), Temmer ve Gençler (Afyon), Ionic Stone (Denizli), Delta (Afyon; Bilecik Bej ocağı).
  - Her ana sayfa Playwright ile 1440×900 ve 390×844 açıldı. İlk ekran görüntüleri: `ekran/arastirma/{firma}-1440.png` ve `-390.png` (36 dosya, Yöntaş dahil).
  - Alt sayfalar (taş/ürün, ocak, fabrika, numune, iletişim, indirmeler) Playwright ile metin olarak okundu (sayfa aşağı kaydırılarak, animasyonla gizlenen metin dahil). Gerektiğinde WebFetch kullanıldı.
  - Ham ölçüm: `arastirma/olcum.json`.
  - Bölüm 3–6 (konteyner, tescilli adlar, "Damar" ad çakışması, kitap açılımının piyasadaki yeri) ayrıca eklendi. Kaynaklar: web araması, TÜRKPATENT belgeleri, Ermaş taş sayfası.
- Kapsam dışı kalanlar:
  - Muğla'da çalışan sitesi bulunamayanlar:
    - Yatağan Mermer: yataganmermer.com, barındırma firmasının reklam sayfasına yönleniyor.
    - Wonder Stone (Milas, ÇED olumlu haberi var): wonderstone.com.tr boş sayfa; aitliği doğrulanamadı.
    - Renkmer (Milas, Rosso Laguna): renkmer.com sunucu hatası veriyor; aitliği doğrulanamadı.
    - İpek Mermer (Muğla White): ipekmermer.com sunucu hatası veriyor; aitliği doğrulanamadı.
    - Caria Marble (Milas Lilac ocağı): alan adı bulunamadı.
    - Mak Stone / Mylasa (Milas): makstone.com satılık; firmaya ait olduğu doğrulanamadı.
    - Fimar Mermer: fimarmermer.com yalnız cPanel varsayılan sayfası; konumu doğrulanamadı.
    - Karya Madencilik: karyamadencilik.com "yapım aşamasında"; konumu doğrulanamadı.
    - Entaş (Milas): entasmermer.com yalnız sunucu giriş ekranı; aitliği doğrulanamadı.
    - Ünmersan (Milas rehber kaydı): unmersan.com yalnız Eskişehir'deki Esmer'in sitesine bağlantı veriyor.
  - Yöntaş (yontasmadencilik.com): Eminoğlu SBV ile aynı ürün ve ocak listesi, aynı Milas ocağı metni. Eski ve bozuk bir kardeş site gibi görünüyor. Ekran görüntüsü alındı, sayıma katılmadı.
  - Bölge dışı olduğu için elenenler: Akdağ (Elazığ), İvme (Trabzon), Altıntaş (Marmara Adası), Esmer (Eskişehir; sitede bir "canlı stok" bağlantısı ve "Mapastone" altyapı ibaresi görüldü, açılmadı), Tureks (çok ilde).
  - Bilecik merkezli firma incelenmedi; Bilecik Bej, Delta'nın Bilecik ocağı üzerinden kapsandı.
- Ölçüm kısıtları:
  - Yükleme süresi:
    - Tek ölçüm, her ölçüm temiz tarayıcıyla (önbellek yok), bağlantı Türkiye'den. Yurt dışındaki alıcı için süreler daha uzun olabilir.
    - Süre, tarayıcının "sayfa yüklendi" anını gösterir; JS ile sonradan dolan içerik dahil değil.
    - Aktarım (MB): açılıştan ekran görüntüsüne kadar (yüklenme + 3,5 sn) gelen veri.
  - Tarayıcı İngilizce istedi; buna rağmen birçok site Türkiye IP'sine Türkçe açtı (Ionic doğrudan /tr/'ye yönlendiriyor).
  - Karmaden masaüstünde "Confirm you are human" doğrulaması çıktı ve **geçilmedi**. Masaüstü görüntüsü bu ekranı gösteriyor. Mobil profil siteyi açtı; alt sayfalar WebFetch ile okundu.
  - Oynak ölçümler: Delta ilk denemede 40 sn'de yüklenmedi, ölçüm turunda 1,5 sn sürdü. Mazzmar iki görünümde de 45 sn'de yüklenmedi.
  - Ermaş masaüstü görüntüsü slayt geçişine denk geldi; başlık o anda görünmüyor.
  - PDF katalog, föy ve rapor dosyaları açılmadı, yalnız adları not edildi.
  - Çerez bannerlarına dokunulmadı, görüntülerde duruyorlar. Hiçbir form gönderilmedi.
  - Eminoğlu'nun "Online Stok" bağlantısına ne açtığını görmek için tıklandı; hiçbir şey açılmadı.
- Gerçek firma adları yalnız bu araştırmada geçer; kurgusal siteye ad, metin ya da görsel taşınmaz. Tırnak içindekiler ya arayüz, ürün ya da düğme adıdır ya da dil hatası kanıtıdır (en çok 15 kelime); site metni kopyalanmadı.

---

## 1. İncelenen firmalar

### 1a. Kimlik ve ilk ekran

| # | Firma · alan adı | Adres (sitede yazan) | Tür | İlk ekranın (1440) söylediği | Menü |
|---|---|---|---|---|---|
| 1 | Alpay Mermer · alpaymermer.com | Merkez/fabrika Salihpaşalar, Menteşe; fabrika ve ocak Kavaklıdere | Ocak + 2 fabrika | Beyaz zemin, sağda ocak drone fotoğrafı, sürdürülebilirlik başlığı ve sivil toplum üyeliği kutusu; altta Ocaklar / Fabrikalar / Ürünler kartları. Satış eylemi yok | Hakkımızda, Politikalarımız, Ocaklar, Fabrikalar, Ürünler, Sertifikalar, Referanslar, Haberler, İletişim, İK, Dil |
| 2 | Ermaş · ermas.com.tr | Genel merkez Ula; fabrikalar Yatağan ve Seydikemer; Menteşe'de kuvars fabrikası | Ocak (4–5) + 4 fabrika | Tam ekran koyu mermer dokusu, "taşları keşfet / ocakları gör" düğmeleri (başlık slaytla geliyor); karanlık mod, TR bayrağı | Ana Sayfa, Ürünler, Ocaklar, Fabrikalar, Projeler, Hakkımızda, **Mimarlar** |
| 3 | Ayhan Mermer · ayhanmarble.net | Akyol Mah., Aşağıova, Yatağan | Ocak + fabrika | Üstte 8 bayrak (makine çevirisi), santral ve gmail adresi; 5 taş karesi ("İncele"); gerçek ocak ve eski fabrika fotoğrafı; WhatsApp balonu | Anasayfa, Kurumsal, Fabrika, Ürünlerimiz, Blog, Bize Ulaşın |
| 4 | Kentmer · kentmer.com | Elmacık Köyü, Muğla | Ocak (Yatağan Beyaz, Milas Siyah) + fabrika | Mavi üst şerit (EN, telefon, e-posta, sosyal), tam genişlik drone fotoğrafı (ocak + fabrika). Başlık ve eylem yok | Anasayfa, Kurumsal, Fabrika-Ocaklar, Ürünler, Galeri, İletişim |
| 5 | Koçar Marble · kocarmermer.com | Çayboyu Mah., Kavaklıdere | 4 ocak + 2 fabrika (Kavaklıdere, Karacasu) | Ocak drone videosu, dilbilgisi hatalı İngilizce slogan, "Products" düğmesi | Home, About Us, Products, Quarries, Factories, Catalog, Contact, Languages |
| 6 | Kar Maden · karmaden.com | Fabrika Dipsiz Mevkii; ocak Yatağan–Bodrum yolu 5. km, Yatağan | Ocak + fabrika | Masaüstünde bot doğrulaması (bkz. kısıt). Mobilde: Ibiza White adı, "Mugla White" ve "Get a quote" düğmeleri, WhatsApp | About Us ("Abous Us"), Marbles, Finishes, Projects, Contact; ikinci menüde Catalogs, Downloadable Content, **Marble Analysis Reports** |
| 7 | Eminoğlu SBV · eminoglusbv.com | Fabrika ve depo Ortaköy, Torbalı/İzmir; ocaklar Milas, Marqueen, Mioni Bej | Ocak + fabrika (+ inşaat/otel grubu) | Koyu zemin, "Online Stok" düğmesi; UBER yazılı bir ofis resepsiyonu fotoğrafı + "Lilac Medium" adı ve açıklaması; çerez kutusu | (Hamburger) Online Stok, Kurumsal (grup şirketleri: inşaat, otel vb.), Ürünler, Fabrika, Showroom, Ocaklar, Haberler, İletişim |
| 8 | Aytaş Akın · aytasakinmermer.com | Burdur OSB; ocaklar Burdur (Yaylabeli bej, Alanköy gri) ve Antalya | Ocak + fabrika | Mermerden pikap görseli + el yazısı fontla müzik metaforlu slogan; çerez şeridi | Anasayfa, Hakkımızda, Fabrikamız, Ocaklarımız, Ürünlerimiz, Projelerimiz, İletişim + TR/EN |
| 9 | Temmer · temmermarble.com | Afyon OSB; plaka galerileri Atlanta, İstanbul Haliç, Afyon | Ocak + fabrika + tüccar (ithal taş adları da var) | Siyah üst çubuk, tam ekran Noel süslü mutfak adası fotoğrafı, WhatsApp düğmesi; slogan slayt metninde | Products, Projects, Showrooms, About Us, **Online Stock**, Contact, Instagram |
| 10 | Gençler Mermer · genclermermer.com | Eski Hamam Mah., İscehisar/Afyon; ocaklar Antalya, Bursa, Kütahya, İscehisar | Ocak + fabrika | Üst şerit telefon, e-posta, dil; fabrika havadan fotoğrafı; E-Katalog kapağı + koleksiyon kareleri | Koleksiyon, Tesisler, Kurumsal, İletişim, YouTube |
| 11 | Ionic Stone · ionicstone.com | Kocabaş Mah., Honaz/Denizli; UK deposu St Albans | Fabrika (ince karo uzmanı) + Burdur'da ocak | (TR açıldı) e-posta ve telefon şeridi; banyo karosu slaytı, yeni koleksiyon duyurusu | Ürünler, Kurumsal, Projeler, Fuarlar, Katalog, İletişim + Hikâyeler + TR / UK / GL |
| 12 | Delta · deltamarble.com | Afyon OSB; İstanbul Dudullu showroom; ocaklar Bilecik ve Şuhut | Ocak + 3 tesis + showroom | 4 dil + Blog + **Bayi Sipariş Formu**; lobi fotoğrafı + taş adı + "View Product"; sağda sabit WhatsApp / form / telefon; çerez şeridi | About, Products, Slabs, Projects, Catalog, Contact |
| 13 | Majen (önceki) · majen.com.tr | Ofis Muratpaşa/Antalya; ocak Uşak–Ulubey | Ocak (traverten) + ihracat | Ocak fotoğrafı + büyük marka adı + "Call us"; Eylül'deki Marmomac fuarının afişi hâlâ açılıyor | Products, Travertines, Blocks, Slabs, Tiles, Pavers, Blog, Contact, Gallery, About |
| 14 | Kaymer (önceki) · kaymermining.com | Ofis Çankaya/Ankara; ocak Kepez/Antalya | Ocak + seçme Türk mermerleri | Almanca: ne sattığı, kime sattığı (ithalatçı, toptancı, taş işleyen), "teklif iste" düğmesi; sağda taş dokusu | Startseite, Produkte, Über uns, Steinbruch, Katalog, Blog, Kontakt, EN, Angebot anfragen |
| 15 | Acar Stone (önceki) · acarstone.com | Afyon merkez + İscehisar OSB | Fabrika/depo + ocak (iddia) + tüccar | 6 dil bayrağı + Sipariş Formu; iç mekân fotoğrafı üstünde uzun alıntı cümle; sağda sabit WhatsApp / form / telefon | Ana Sayfa, Hakkımızda, Ürünler, Projelerimiz, Sanatsal Tablo, İletişim |
| 16 | Mazzmar (önceki) · mazzmar.com | Kocabaş Mah., Honaz/Denizli | Traverten üretici-tüccar, stok satışı | Logo + "Stocks ready to ship" + konteyner simgeli sepet (0) + traverten slaytı | Home, Company, Stocks Ready to Ship, News, Contacts |
| 17 | Dora Marble (önceki) · doramarble.com | Kazım Dirik Mah., Bornova/İzmir (sitede 2 fabrika ve 3 ocak yazıyor) | Ocak + fabrika (iddia) | Kırık logo (yerine "Home Page" yazısı), "Welcome to Doramar" + bina fotoğrafı | Home, Company, Factory, Quarry, Products, Projects, Contact |

### 1b. Hangi bilgiyi veriyorlar (+ var, – yok, ~ kısmen/bozuk)

| Firma | Teknik değerler | Standart adı | Föy/PDF | Yüzey işlemleri | Gerçek plaka foto | Blok/plaka no, stok | Bookmatch | Numune akışı | Fiyat/FOB dili | Konteyner/yükleme | WhatsApp | Form | Pazar yeri | Diller |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Alpay | – | – | + katalog, 2 sürdürülebilirlik raporu | + kumlama, cilalı, honlu | ~ genel blok/plaka/ebatlı görseli | – | – | – | – | – | – | + | – | TR + Google Çeviri |
| Ermaş | **+ 7 değer** | **+ EN 1936, 13755, 1926, 12372, 14157** | **+ taş başına datasheet; BIM, CAD doku, renk kartı** | – (ürün sayfasında yok) | **+ 6 ardışık plaka görseli** (gerçek mi render mı doğrulanamadı) + 3B önizleme | ~ "REF." ve sıra no; blok no yok | ~ "ardışık plaka takımı" (terim yok) | **+ form** (ücret yazmıyor) | – | – | – | + | – | Yalnız TR (dil düğmesi var, EN bulunamadı) |
| Ayhan | – | – | – | – | ~ taş karesi | – | – | – | – | – | + | + | – | TR + makine çevirisi (8 bayrak) |
| Kentmer | – | – | – | – | ~ | – | – | – | – | ~ ahşap sandık + strafor | ~ simge var, bağlantı boş | + | – | TR / EN (makine kokulu) |
| Koçar | + 5 değer (birim kgf/cm²) | – | ~ çevrimiçi e-katalog (flipbook) | – | ~ tek görsel | – | – | – | – | – | – | ~ yalnız bülten | – | EN / ES / TR |
| Karmaden | ~ rapor PDF listesi + don deneyi özeti | + ÖNORM EN 12372, EN 12371 | + 3 katalog, analiz raporları | + 5 yüzey | ~ galeriler | – | – | – | ~ "Get a quote" | – | + (mobil) | ~ görülmedi | – | EN / TR |
| Eminoğlu | + fiziksel + kimyasal | – | – | ~ yalnız cilalanma notu | ~ ürün başına ~90 karelik galeri (plaka ve uygulama karışık) | ~ "Online Stok" ölü | – | – | – | ~ liman 41 km, yükleme sahası | – | + | – | TR / EN |
| Aytaş | – | – | + 2025 katalog PDF | – | ~ | – | – | – | – | – | + | + | – | TR / EN |
| Temmer | – | – | + 11 indirme (katalog, numune stok kitapçığı) | ~ açıklamada | ~ render; fiziksel plaka galerileri | ~ stok = Google Drive klasörü | – | ~ yalnız stok kitapçığı | – | – | + | – (e-posta) | – | EN / TR |
| Gençler | – | – | ~ e-katalog | ~ Savoie Blue kumlanmış/eskitme adları | ~ doku karesi | – | – | – | – | – | – | – | – | TR / EN / AR (EN yarım) |
| Ionic | ~ ocak sayfasında "dosyada" | – | + katalog 2024, 2021 | + 5 yüzey filtresi | + karo ürün fotoğrafları | – | **+ bookmatch karo koleksiyonu** | – | ~ ticari hesap / sipariş sorusu | ~ UK deposu | – | + (konu seçmeli; ürün sayfasında "bilgi iste" penceresi) | – | TR / EN (global, UK) |
| Delta | – | ~ "TSE analiz raporu" belgesi | + katalog, sertifikalar | ~ ürün kodunda "polished 2 cm" | ~ | ~ ürün kodu (DLT …) | – | – | ~ "Request Offer"; bayi formunda iskontolu fiyat alanı | – | + | + teklif + bayi sipariş formu | – | TR / EN / FR / AR |
| Majen (önceki) | – | – | – | + 4 yüzey, 2/3/5 cm | + işaretli blok fotoğrafı | ~ plakalar kesim sırasıyla numaralı (liste yok) | + lot bir arada tutuluyor | ~ hazır metinli e-posta ("sample board") | **+ FOB / CIF / EXW** | ~ konteyner yükleme, paketleme, blok ölçüsü | + hazır mesajlı | + varış ülkesi, ürün grubu, tahmini miktar | – | EN / TR |
| Kaymer (önceki) | ~ standart listesi; değerler talep üzerine | **+ EN 1936, 13755, 12372, 12371, 14157, 14231; CE için EN 12057/12058/1341/1342/1469** | + çevrimiçi katalog | + 5 yüzey; 2 ve 3 cm | ~ talep üzerine | ~ numaralı blok, plaka listesi talep üzerine | ~ aynı bloktan demet | ~ talep üzerine; onaylı numune bağlayıcı | **+ EXW / FOB / CFR / CIF / DAP** | **+ konteyner/tır, ISPM 15, yükleme fotoğrafı, A.TR** | – | + teklif | – | DE / EN |
| Acar (önceki) | – | – | – | ~ | ~ | – | – | – | ~ sipariş formu | – | + | + | – | 6 dil |
| Mazzmar (önceki) | – | – | – | + dolgulu-honlu, eskitme, splitface | ~ | **+ stokta ürün, m², SKU** | – | – | **+ USD fiyat** (birim yazmıyor) | ~ "Your Container" sepeti; 2.800 m² hazır | – (sohbet aracı) | ~ bülten + sepet | – | EN (+ İspanyolca parçalar) |
| Dora (önceki) | – | – | – | – | ~ | – | – | – | ~ yalnız uygun fiyat sıfatı | – | – | – | – | EN / TR |

Notlar:
- **Numune:** hiçbir Türk sitesi numunenin ücretli mi ücretsiz mi olduğunu, boyutunu ya da kargonun kimde olduğunu yazmıyor. Tek gerçek form Ermaş'ta (ad, e-posta, telefon, şirket/stüdyo, proje adı, 17 taştan seçim, not).
- **Pazar yeri:** hiçbir site Alibaba, Stonecontact, Made-in-China gibi bir pazar yerine bağlantı vermiyor.
  - Arama sonuçlarına göre Stonecontact'ta firmaların bir kısmının ocak/tedarikçi kaydı var: Koçar (Kestanecik), Ayhan, Kentmer, Ermaş, Eminoğlu (Milas Lilac). Bu sayfalar ayrıca açılmadı.
  - Bir Alman dağıtıcı, "Milas Lilak Super" plakalarını lot olarak listeliyor (bkz. 2.1).

### 1c. Mobil ve teknik

| Firma | Masaüstü yük. (sn) | Mobil yük. (sn) | Aktarım (MB) | Mobilde ilk ekran (390) | Sertifika (sitede) | Teknik/özen sorunu |
|---|---|---|---|---|---|---|
| Alpay | 1,1 | 1,7 | 6,4 | Logo + sürdürülebilirlik başlığı + "Sosyal Sorumluluk"; ardından Ocaklar kartı. İletişim eylemi yok | **ISO 9001 ve 14001 (29.11.2023)** | Ana sayfada telefon tıklanmıyor (yalnız iletişim sayfasında); © 2021, son haber 2023; dil düğmesi = Google Çeviri |
| Ermaş | 5,0 | 4,8 | 1,2 | Koyu doku + kuruluş yılı/Muğla etiketi + başlık + "Patara Dark'ı gör" | – | **Mobilde 396 px yatay taşma**; büyük harfe çevirmede İ/I bozuk; sosyal bağlantılar yanlış etiketli ("Instagram" Pinterest'e, "LinkedIn" Twitter'a gidiyor); sayılar çelişkili (bkz. 2.2) |
| Ayhan | 1,0 | 1,0 | 3,9 | Bayraklar + "Ayhan Bej / İncele" karesi + çerez + WhatsApp balonu | "Belgelerimiz: çok yakında" | Ürün sayfaları boş (yalnız başlık); gmail adresi; Türkçe formda İngilizce yer tutucular (First, Last, Phone, Subject) |
| Kentmer | 0,8 | 0,6 | 3,2 | Telefon iki satıra bölünüyor; açık zeminde düşük kontrastlı hamburger; drone fotoğrafı; başlık yok | – | Kaynak kodda 10+ lorem ipsum bloğu (ekranda gizli); WhatsApp simgesi boş bağlantı; Türkçe sayfada İngilizce "Terms of use / Cookies"; © 2021 |
| Koçar | 1,4 | 2,4 | 5,9 | Video + slogan + "Products" | – | Telefonlar tıklanmıyor; yazım hataları (1e) |
| Karmaden | doğrulama ekranı | 1,9 | 3,0 (mobil) | Taş adı + "Get a quote" + WhatsApp; solda beyaz şerit | – (analiz raporları var) | Masaüstünde insan doğrulaması; **mobilde 405 px taşma** |
| Eminoğlu | 1,7 | 1,6 | **10,8** | Ofis fotoğrafı + taş adı + açıklama; çerez kutusu sağdan taşıyor | – | **Mobilde 565 px taşma**; "Online Stok" ölü; iki taşa aynı açıklama; 1 kırık görsel |
| (Yöntaş) | 0,4 | 0,2 | 0,3 | Bozuk: görseller kırık, menüler açık, CSS yok | – | Mobil ayarı yok (1009 px); 6 kırık görsel, 31 konsol hatası |
| Aytaş | **10,1** | **12,0** | 8,8 | Pikap görseli + slogan + **18 slayt noktası**; çerez kutusu ekranın yarısını kapatıyor | Patent (İZOBOX) anılıyor; ISO görülmedi | En yavaş site; **mobilde 405 px taşma**; aynı proje TR'de "Hotel", EN'de "Hospital" |
| Temmer | 3,6 | 2,2 | 3,3 | Yalnız mutfak fotoğrafı + WhatsApp; tek cümle yok | – | Ana sayfada telefon yok; altbilgide büyük harf hatası; çerez yönetimi Cookiebot |
| Gençler | 1,4 | 1,8 | 7,3 | Fabrika havadan + E-Katalog kapağı | – | İletişimde Google Haritalar hatası; EN tesis sayfası Türkçe; taş sayfaları boş |
| Ionic | 1,9 | 2,0 | **12,6** | (TR) banyo karosu slaytı + "Şimdi keşfet" | DENİB ihracat ödülü | **Masaüstünde 1478 px yatay taşma**; en ağır sayfa; Türkiye IP'sine TR açılıyor |
| Delta | 1,5 (ilk denemede 40+) | 1,6 | 2,0 | Fabrika fotoğrafı + uzun SEO paragrafı + çerez | **ISO 45001, 14001, TSE analiz raporu** | WordPress 6.9; çerez metni onayı varsayıyor; ilk ziyarette çok yavaş açıldı |
| Majen (önceki) | 0,3 | 1,1 | 7,3 | İşaretli blok fotoğrafı + marka + **geçmiş fuar afişi** ekranı kapatıyor | Kalite belgelerinden genel ifadeyle söz ediliyor | Fuar afişi fuardan iki hafta sonra hâlâ açılıyor; afişte "STAND/ ROOTH" |
| Kaymer (önceki) | 0,1 | 0,1 | 0,3 | Başlık + açıklama + onay kutusu ("yalnız gerekli" seçeneği var) | CE ve performans beyanı anlatılıyor | Varsayılan dil Almanca |
| Acar (önceki) | 0,9 | 0,9 | 1,9 | İki satır bayrak + slogan + uzun anahtar kelimeli metin; sağda sabit düğmeler | – | WordPress; anahtar kelime doldurma; Delta ile aynı şablon yapısı |
| Mazzmar (önceki) | 45+ (zaman aşımı) | 45+ | 10,0 | Logo + kırık simgeler + sosyal balonlar + sohbet aracı | – | **WordPress 4.4 (2016 dönemi)**; 5 kırık görsel; 22 konsol hatası; altbilgide kendi adı "Mazmar" |
| Dora (önceki) | 0,4 | 0,4 | 2,0 | Kırık logo + "Welcome to Doramar" | – | Çalışma saati "GMT+2" (Türkiye UTC+3); © 2022 |

Ortak altyapı:
- WordPress: Ayhan, Temmer, Delta, Acar, Mazzmar ve görsel yollarına göre Ermaş.
- ASP.NET: Koçar, Eminoğlu.
- Delta ile Acar aynı şablon yapısını paylaşıyor: sağda sabit WhatsApp / form / telefon, bayraklı dil çubuğu.
- Her taşta aynı alanlarla tekrar eden bir taş sayfası şablonu yalnız Ermaş (değer tablosu), Ionic (ebat, yüzey, renk), Eminoğlu ve Koçar (değer tablosu) sitelerinde var. Diğerlerinde taş sayfası ya yok, ya boş, ya da serbest metin.

### 1d. Sattıkları taşların ticari adları (sitede nasıl yazıyorsa)

#### Muğla taşları

| Firma | Taş adları |
|---|---|
| Alpay | Blanco Ibiza (sitede "Muğla Beyazı"; yurt dışında "Alpay Beyazı" diye anıldığı yazıyor), Blanco Lea, Blanco Luna, Karia Grey |
| Ermaş | Muğla White, Muğla Sugar, Golden Wave, Golden Crystal, Patara Beige, Patara Dark, Mystic Beige, Andromeda Black, Sandras Grey, Dream Night, Olive Dark, Natalie, Anatolian Red, Dolomit Spica, Dolomit Tyana, Dolomit Leon, Kalsit (17 taş) |
| Ayhan | Ayhan Bej, Ayhan Siyah, Milas Leylak, Milas Sedef, Milas Limon |
| Kentmer | Karia Nera, Karia Grigio, Muğla Dolomiti White, "New Quarry" (ürün adı olarak); ocaklar: Yatağan Beyaz, Milas Siyah |
| Koçar | Milas Lilac Light (ürün sayfasında "Milas Leylak Light"), Milas Lilac Dark, Milas Pearl, Newyork, Muğla White, Limon White, Limon Sugar, Koçar White, Ice White, Ice Gray; Kestanecik ocağından Milas Leylak, Milas Sedef, Newyork |
| Karmaden | Ibiza White (sitede Mugla White ile aynı taş), Snow White, Arctic White, Orient White, Pineta Black (Grigio Pineta) |
| Eminoğlu (Milas ocağı) | Milas Lilac (Light / Medium / Dark), Milas Pearl, New York; ocak sayfasında Milas Beyaz, Milas Leylak, Milas Newyork, Milas Sedef, Milas Limon. Diğer ocaklar: MarqueeN, Mioni Beige; ayrıca Marera |
| Bölge dışı firmalarda Muğla adı | Delta plaka listesinde Mugla White ve Lilac White; Ionic'te Lilac Bookmatch Tiles ve Tavas Beyaz (Denizli, ruhsat sürecinde; sitede Muğla Beyazına benzetiliyor); bir Alman dağıtıcıda "Milas Lilak Super" lotu |

Gözlem: aynı Milas taşı en az dört adla satılıyor: Lilac, Leylak, Lilak ve "Lilac White". Sedef ile Pearl de aynı taş için kullanılıyor. Antik yer adları da yaygın: Karia/Caria (Alpay, Kentmer), Patara (Ermaş), Mylasa (Milas haberleri), Blaundos (Majen). Bölgede renk/ton kademesi (Light/Medium/Dark) Milas Lilac için standart hale gelmiş.

#### Diğer bölgeler

| Firma | Taş adları |
|---|---|
| Aytaş (Burdur) | Burdur Beige – Moonstone Cream (Cream, Light, Angelica, Classic, Rhapsody, Antique), Moonstone Ivory (+ HR), Crema Stella (+ HR), Favorito Beige (+ HR); Burdur Grey – Moonstone Fantasy, Moonstone Silver (+ HR), Marino Grey (Cross Cut / Vein Cut, + HR) |
| Temmer (Afyon) | Ocak adları: Pantera Bianca, Jaguar Afrodit, Affumicato, Rosalia. Ürün listesi ithal adlarla karışık (Aegean White, Afrodit, Amazonia, Arabescato, Carrara, Thassos, Nero Marquina, "Verde Guatamala" …) |
| Gençler (Afyon) | Sultan (Antalya Korkuteli), Bianco White (Bursa), Red Travertine (Kütahya), Vialo Violette, Savoie Blue (+ Sandblasted, Tumbled), "Mont Blac", Giselle Grey, Alanya Black, Alexandra Black, Bruno Perla, Orange Onyx |
| Ionic (Denizli) | Lilia (açık Burdur Bej, kendi ocağı), Lilia Sandbrushed, Calacatta Isola, Invisible Blue, Rosso Levanto, Caressi Verde; koleksiyonlar: Dimensions, Victorian, Mayfair, CK1, Bookmatch |
| Delta (Afyon / Bilecik) | Bilecik Bej ocağından Classic, Perlato, Novana, Novana Antique, Crema Nova, Rosalia, Coctail, Regal, Regal Sapphire, Delta Daino Beige; Şuhut ocağından Tundra Grey, Tundra Forest; plaka listesinde Snow White, Carrara White, Likia Beige, Bardiglio Grey, Nero Laurent, Nero Picasso, Emperador (Blue/Dark/Golden), Red Levante |
| Majen (Uşak, önceki) | Blaundos Antico/Antiko, Blaundos Light, Blaundos Ivory; Chiaro (Bianco, Brecciato) |
| Kaymer (Antalya, önceki) | Classic Beige, Noce, Silver, Scabos (traverten); Tundra Grey (Light, Medium), Dupont Beige, Emily Spider (Art, Dark, Dynamic) |
| Mazzmar (Denizli, önceki) | Classic, Ivory, Light, Silver Travertine (kesim ve yüzeyle: vein cut, filled honed, tumbled, splitface) |

### 1e. İngilizce kalitesi ve TR–EN tutarlılığı

| Firma | Örnek hata (kısa alıntı) | TR–EN tutarlılığı |
|---|---|---|
| Alpay | Türkçe menüde "POLİKİTASI" | İngilizce içerik yok, yalnız Google Çeviri |
| Ermaş | "MUGLA WHİTE", "PATARA BEİGE", "BIZIMLE İLETIŞIME GEÇIN", adreste "Bulvari" | Türkçe sayfada İngilizce etiketler ("Fine crystalline, uniform", "YEARS OF EXCELLENCE"); İngilizce sürüm bulunamadı |
| Ayhan | "Site Desing", "Ldt.Şti" | Makine çevirisi; formda İngilizce yer tutucular |
| Kentmer | "90 Personality Employment" (90 kişilik istihdam); TR'de "türk firma", "ülkemizde ki" | EN sayfa makine çevirisi izlenimi veriyor |
| Koçar | "Pressureç Resistance (kgf/cm2)"; "With investments in 2014 ve 2015, our block marble production capacity has benn reached" | Menüde "Lilac", ürün sayfasında "Leylak" |
| Karmaden | "Abous Us", "See Marble Tiles Galerry", "From the The Supreme Court Building" | Metin ithalatçıya değil ev sahibine ve alışverişe konuşuyor |
| Eminoğlu | "Absorbend (%by Weight)", "Ratio of Fullness (% voll)", "MnD [%]" | Kimyasal değerler "Mechanical Specs" başlığı altında; Türkçe ana sayfadan İngilizce ürün sayfasına bağlantı |
| Aytaş | "brings to get her perfection, trust and aesthetics"; "Every project is, a Success Story"; "with tax awards" | Hakkımızda sayfasında aynı cümle doğru yazılmış; proje adı TR'de "Hotel", EN'de "Hospital" |
| Temmer | "It's completely computerized machines possess ultra modern Italian technology"; "Verde Guatamala" | Altbilgide Türkçe büyük harf hatası ("KIŞISEL VERILERIN") |
| Gençler | "are discipline-free and connected with passion for work"; "Mont Blac" | EN tesis sayfası Türkçe; çalışan sayısı aynı sayfada 200 ve 300 |
| Ionic | "plans to take a part in the upcoming Coverings 2025" (fuar geçmiş); TR'de "paçalarından", "inaniriz" | Global ve UK siteleri ayrı, düzgün; TR'de "İnnovatif" ve "İnovatif" karışık |
| Delta | "FOR EXPORT DEPARTMANT" | TR ve EN düzgün ayrılmış; EN metin SEO kokulu |
| Majen (önceki) | Afiş görselinde "STAND/ ROOTH" | EN akıcı ama "Travertine Supplier from Turkey" sürekli tekrarlanıyor |
| Kaymer (önceki) | Hata görülmedi | DE ve EN aynı yapı, akıcı |
| Acar (önceki) | "tadariğinde", "Cararra" | Türkçe sayfada Fransızca başlık parçası |
| Mazzmar (önceki) | "recieve"; altbilgide "Mazmar" | EN sayfada İspanyolca cümleler, çok dilli etiket doldurma |
| Dora (önceki) | "Welcome to Doramar" (site adı Dora Marble); "GMT+2" | – |

---

## 2. Sentez

### 2.1 Alıcı gerçekte ne arıyor ve siteler ne kadar yanıt veriyor

Sıralama şunlara dayanıyor: bu süreci en açık anlatan sitelerin (Kaymer, Majen, Ermaş, Delta) yazdıkları, formların sorduğu alanlar ve bir Avrupa dağıtıcısının Milas taşını nasıl listelediği.

**İthalatçı, toptancı, plaka deposu**

| Sıra | Aradığı | Kim anlatıyor (kanıt) | 17 sitede durum |
|---|---|---|---|
| 1 | **Alacağı malı görmek**: numaralı blok, aynı bloktan plaka listesi (demet/lot), ölçü, m², kusur | Kaymer blokları numaralı, ölçülü ve fotoğraflı sunuyor; plaka listesi ve fotoğraf gönderiyor; video görüşmeyle seçtiriyor. Majen plakaları kesim sırasıyla numaralıyor ve lotu bir arada tutuyor. Bir Alman dağıtıcının "Milas Lilak Super" lotu (drylayout.com): 22 plaka, 4 ebat, 101,22 m², 2 cm cilalı, tek plakada çatlak notu, blok ağırlığı, depo, "fiyat iste" | Çalışan çevrimiçi liste yalnız Mazzmar'da (m² ve fiyatla). Temmer'de Google Drive klasörü var. Eminoğlu'nun "Online Stok" düğmesi ölü. **7 Muğla sitesinin hiçbirinde blok ya da plaka numarası yok** |
| 2 | **Teslim şartı ve belgeler**: Incoterm, çeki listesi, menşe, A.TR, fümigasyon | Kaymer (EXW, FOB, CFR, CIF, DAP; belge listesi; AB gümrük birliği notu), Majen (FOB, CIF, EXW; belge listesi) | 15/17'de yok |
| 3 | **Renk aralığı ve kalite sınıfının yazılı tanımı** | Kaymer: 1. kalitenin tanımı, renk aralığı üretimden önce numuneyle yazılı belirleniyor, aynı bloktan plaka | Diğerlerinde yalnız genel bir kalite sıfatı |
| 4 | **Kapasite ve süreklilik** | Neredeyse hepsi veriyor: Alpay Kavaklıdere ocağı 60–70 bin m³/yıl; Ermaş Muğla Beyaz ocağı 50 bin m³/yıl; Koçar 45 bin m³ blok + 750 bin m² işleme; Eminoğlu Milas ocağı 11 bin m³; Aytaş 80 bin m²/ay | Sitelerde **en bol bulunan bilgi**; ama doğrulanamıyor ve kimi zaman kendi içinde çelişiyor (2.2) |
| 5 | **Doğru kişiye hızlı ulaşmak** | Delta ihracat ve iç piyasa için ayrı numara ve isimli e-posta veriyor; Majen'in WhatsApp düğmesi hazır mesajla açılıyor | 7/17'de çalışan WhatsApp; isimli ihracat sorumlusu yalnız Delta'da |

**İç mimar, mimar (taşı projeye yazan)**

| Sıra | Aradığı | Kim anlatıyor | Durum |
|---|---|---|---|
| 1 | **Teknik değer + standart adı.** Deneyler: EN 1936 yoğunluk/gözeneklilik, EN 13755 su emme, EN 12372 eğilme, EN 1926 basınç, EN 14157 aşınma. İşlenmiş ürünlerde CE için EN 12057, 12058, 1341, 1469 | Ermaş (7 değer + EN adları + datasheet), Karmaden (laboratuvar raporları, ÖNORM EN 12372/12371, 2023 tarihli), Kaymer (standart listesi + CE açıklaması) | Değer ve standart birlikte yalnız 2/17'de. Koçar ve Eminoğlu değer veriyor ama standart adı yok, birim karışık (kgf/cm², kg/cm²) |
| 2 | **Numune**: hangi yüzey, hangi boyut, ücreti, kargosu | Ermaş formu (proje adı, taş seçimi). Yabancı karşılaştırma Polycor: rol, taş + yüzey, adet, teslim adresi, tahmini kargo | Form yalnız 1/17'de. **Hiçbirinde ücret, boyut ve kargo bilgisi yok** |
| 3 | **Doku dosyası, BIM/CAD, renk kartı** | Ermaş (Revit, doku haritası, renk kartı) | 1/17 |
| 4 | **Yüzey, kalınlık ve ebat aynı yerde** | Majen, Ionic (mm cinsinden ebat + yüzey filtresi), Kaymer, Delta (ürün kodunda), Mazzmar | 5/17 |
| 5 | **Bookmatch / ardışık kesim** | Ionic (bookmatch karo), Majen (lot), Ermaş (ardışık plaka takımı) | 3/17 |
| 6 | **Hangi taş hangi projede, hangi yıl** | Ermaş (proje + taş + yer + yıl), Aytaş, Temmer, Alpay (3 proje adı) | Proje adı çok sitede var; taş–proje eşlemesi az |

**Proje yüklenicisi**

| Sıra | Aradığı | Kim anlatıyor | Durum |
|---|---|---|---|
| 1 | Ebatlı kesim, basamak, denizlik, çizime göre parça | Kaymer (CNC, su jeti, çizime göre), Ionic (profil, basamak), Delta (kategoriler) | Çoğu sitede istenen ebatta üretim cümlesi var, ayrıntı yok |
| 2 | Miktar, termin ve sevk adresiyle sipariş | Delta bayi formu: ürün kodu, m²/adet, iskontolu birim fiyat, farklı sevk adresi ve termin notu. Majen formu: varış ülkesi, ürün grubu, tahmini miktar | **Teslim süresi hiçbir sitede rakamla yazmıyor** |
| 3 | CE ve performans beyanı | Yalnız Kaymer | 1/17 |
| 4 | Kapasite ve referans | Çoğu veriyor | – |

Özet: sitelerin çoğu "biz büyüğüz" sorusuna (kapasite, tesis, ocak) yanıt veriyor. Alıcının "hangi blok, hangi plaka, hangi değer, hangi şart" sorusunu yalnız Kaymer, Majen ve kısmen Ermaş yanıtlıyor. Muğla firmaları arasında bu soruya en yakın yanıtı Ermaş veriyor, o da yalnız Türkçe.

### 2.2 Eksikler (en çok tekrar edenden aza; 17 site)

| Sorun | Kaç sitede | Somut örnek |
|---|---|---|
| Teslim süresi (termin) rakamla yok | 17/17 | Majen yalnız zamanında teslimden genel olarak söz ediyor; Delta formunda termin alanı var, sitede süre yok |
| Fiyat ya da fiyat dili yok | 16/17 | Fiyat yalnız Mazzmar'ın stok ürünlerinde, birimi yazmadan ("$30") |
| Teknik değer + standart adı birlikte yok | 15/17 | Alpay'ın Muğla Beyazı sayfasında tek değer yok; Koçar değer verip standart vermiyor ("kgf/cm²") |
| Teslim şartı ve belge listesi yok | 15/17 | Muğla'nın 7 sitesinin hiçbirinde FOB/CIF yok |
| Blok/plaka numarası ve güncel stok yok ya da bozuk | 15/17 | Eminoğlu'nun başlıktaki "Online Stok" düğmesi hiçbir yere gitmiyor. İstisnalar: Mazzmar'ın stok listesi ve Temmer'in Google Drive klasörü (site içi liste değil). Kaymer ve Majen numaralamayı anlatıyor ama liste yayımlamıyor |
| Numune akışı yok | 13/17 (form yalnız 1 sitede) | Majen yalnız hazır metinli e-posta açıyor; Kaymer numuneyi talep üzerine gönderiyor |
| Ürün sayfasında yüzey + kalınlık birlikte yok | 12/17 | Ermaş'ın en ayrıntılı taş sayfasında bile yüzey listesi yok |
| Çalışan WhatsApp yok | 10/17 | Kentmer'de WhatsApp simgesi var ama bağlantısı boş |
| Bayat fuar ya da haber | 9/17 | Majen'de Eylül'deki fuarın afişi Ekim'de açılıyor; Ionic'te geçmiş fuar hâlâ gelecek zamanla yazılı; Alpay © 2021, son haber 2023 |
| Şablon kalıntısı, kırık öğe | 8/17 | Kentmer'in kaynak kodunda lorem ipsum, boş WhatsApp bağlantısı; Gençler'de harita hatası; Dora'da kırık logo; Mazzmar'da kırık simgeler; Ayhan'da ürün sayfaları boş ve belgeler "çok yakında"; Ermaş'ta yanlış etiketli sosyal bağlantılar; Eminoğlu'nda ölü stok düğmesi; Koçar'da e-katalog altında başıboş "Recent" yazısı |
| Ana sayfada telefon tıklanmıyor ya da yok | 8/17 | Koçar, Eminoğlu, Gençler, Mazzmar'da numara düz metin; Temmer ana sayfada numara vermiyor |
| Kendi içinde çelişen bilgi | 7/17 | Ermaş aynı sayfada hem dört hem beş aktif ocak yazıyor; Muğla White yoğunluğu bir sayfada 2,68, diğerinde 2,72 g/cm³, aşınma 14,49 ve 12. Kentmer ana sayfada 1.000.000 m² üretim alanı, fabrika sayfasında 10.000 + 5.000 m² yazıyor. Alpay'ın üç ayrı taşı aynı açıklamayı taşıyor. Eminoğlu'nda iki taş aynı açıklamayı paylaşıyor |
| Gerçek İngilizce yok | 5/17 (Muğla'da 4/7) | Ermaş yalnız TR; Alpay ve Ayhan makine çevirisi; Kentmer'in EN'i makine kokulu; Gençler'in EN'i yarım |
| Mobilde yatay taşma | 4/17 (+ Yöntaş; Ionic masaüstünde) | Eminoğlu 565 px, Aytaş 405, Karmaden 405, Ermaş 396 |
| Yavaş (5 sn ve üstü ya da zaman aşımı) | 4/17 | Aytaş 10–12 sn, Mazzmar 45 sn+, Ermaş 5 sn, Delta ilk denemede 40 sn+ |

### 2.3 Satış yolu gerçeği (sipariş nasıl kesinleşiyor)

- **Sitede sipariş ya da ödeme yok.** Mazzmar'ın stok ürünlerinde "konteynerine ekle" sepeti var; ödeme adımı denenmedi, yine de toptan alımda sipariş kesinleşmesi teklif üzerinden yürüyor.
- **Sitelerin anlattığı gerçek akış** (en açık anlatan Kaymer; Majen ve Delta da destekliyor), altı adım:
  1. Talep: taş, ürün, yüzey, kalınlık, miktar, varış yeri.
  2. Teklif: teslim şartıyla.
  3. Seçim: fotoğraf, plaka listesi ya da video görüşme.
  4. Numune onayı: onaylanan numune bağlayıcı referans oluyor.
  5. Üretim, kontrol ve paketleme: ISPM 15 ahşap sandık, yükleme fotoğrafı.
  6. Taşıma: anlaşılan Incoterm ile, A.TR dahil belgelerle.
- **Siparişin kesinleştiği yer sitenin dışında**: e-posta, WhatsApp, ziyaret ya da fuar. Sitenin işi siparişi almak değil, bu yazışmayı kısaltmak: taşın verisi, eldeki blok ve plakalar, şartlar, belgeler, doğru kişi.
- **İç piyasada bayi düzeni**: Delta'nın bayi formu ürün kodu, m²/adet ve iskontolu birim fiyat istiyor. İhracat ise ayrı numara ve isimli e-postayla yürüyor.
- **Fuar** hâlâ ana kanal (sitede görülen en son katılımlar aşağıda); ama fuar bilgisi sitelerde bakımsız.
- **Pazar yeri:** sitelerden bağlantı yok. Ocak kayıtları Stonecontact gibi dizinlerde, Milas plakaları ise Avrupa'daki dağıtıcıların lot listelerinde duruyor. Yani alıcı taşı çoğu zaman üretici sitesinde değil aracı listede görüyor.
- **Fiyat dili:** "Teklif iste", "Get a quote", "Request offer". FOB/CIF'i sade dille anlatan yalnız Majen ve Kaymer. Ücretsiz numune, minimum sipariş ya da teslim süresi vaadi hiçbir sitede yok.

| Firma | Ana sayfada telefon tıklanır | Fuar (sitede görülen en son) |
|---|---|---|
| Alpay | ~ (yalnız iletişim sayfasında) | Fuar yok; TİM Barselona ticaret heyeti (Mart 2022) |
| Ermaş | + | – |
| Ayhan | – | – |
| Kentmer | + | Fuar adı vermeden katıldığını söylüyor |
| Koçar | – | – |
| Karmaden | + (mobil) | – |
| Eminoğlu | – | Marble İzmir, Nisan 2024 |
| Aytaş | + | – |
| Temmer | – (numara yok) | Bursa Blok Fuarı, Ekim 2023 |
| Gençler | – | Marble İzmir ve Kore Building Week, 2024 |
| Ionic | + | Marmomac 2023/2024, Coverings 2024/2025, Marble İzmir 2024/2025 |
| Delta | + | – |
| Majen (önceki) | + | Marmomac, Eylül 2026 (afiş hâlâ açık) |
| Kaymer (önceki) | + | – |
| Acar, Mazzmar, Dora (önceki) | Acar +, diğerleri – | – |

### 2.4 Göze batan kusurlar ve her firmanın en iyi yaptığı şey

| Firma | Göze batan kusur (tek cümle) | En iyi yaptığı tek şey |
|---|---|---|
| Alpay | Üç ayrı beyaz taş (Ibiza, Lea, Luna) birebir aynı açıklamayı taşıyor; teknik değer ve gerçek İngilizce yok. | Merkez, Kavaklıdere fabrikası ve ocağı ayrı adres, telefon ve yol tarifiyle veriyor; ISO belgelerini tarihleriyle gösteriyor. |
| Ermaş | Muğla'nın en alıcı odaklı sitesi yalnız Türkçe; aynı taşın değerleri iki sayfada farklı. | "Mimar Bölgesi": BIM, CAD doku, datasheet, renk kartı ve numune formu tek yerde. |
| Ayhan | Ürün sayfaları ve "Belgelerimiz" boş; ihracatçının e-postası gmail. | Gerçek ocak ve fabrika fotoğrafları. |
| Kentmer | Ürünlerden birinin adı "New Quarry"; ana sayfa 1.000.000 m², fabrika sayfası 15.000 m² diyor. | Ocak ile fabrikayı tek karede gösteren gerçek drone fotoğrafı. |
| Koçar | Teknik etiketlerde bozuk İngilizce ("Pressureç Resistance"); taş adı menüde Lilac, sayfada Leylak. | Her ocağın ayrı sayfası var, hangi taşın hangi ocaktan çıktığı yazıyor. |
| Karmaden | Menüde "Abous Us"; metin ithalatçıya değil ev sahibine konuşuyor. | Laboratuvar analiz raporlarını tarih ve standart adıyla listeliyor (sektörde nadir). |
| Eminoğlu | Başlıktaki "Online Stok" düğmesi ölü; iki farklı taş aynı açıklamayı taşıyor; mobilde 565 px taşma. | Taş başına geniş galeri ve fiziksel + kimyasal değer tablosu. |
| Aytaş | 10–12 sn açılış, 18 slaytlık giriş; İngilizce ana sayfada bozuk cümle. | Taş ailesini tutarlı alt adlarla düzenliyor (Moonstone, Marino Grey cross/vein cut, HR). |
| Temmer | Ana sayfada telefon yok, ilk ekranda tek cümle yok; "online stok" bir Drive klasörü. | Fiziksel plaka galerileri (Atlanta, İstanbul, Afyon) ve indirilebilir numune stok kitapçığı. |
| Gençler | İngilizce sayfalar yarı Türkçe, taş sayfaları boş, harita hata veriyor. | Fabrikadaki makine parkını adet adet sayıyor (katrak, köprü kesim, silim hatları). |
| Ionic | Masaüstünde yatay taşma, 12,6 MB; Türkiye'den girene TR açılıyor. | Ürün sayfasında mm cinsinden ebat, yüzey ve renk filtresi; bookmatch karo koleksiyonu; UK deposu. |
| Delta | Yoğun SEO metni, "Departmant" yazımı; ürün sayfasında teknik değer yok. | İhracat ve iç piyasa için ayrı kişi ve numara; bayiler için ürün kodlu sipariş formu. |
| Majen (önceki) | Geçmiş fuarın afişi ana sayfayı kapatıyor. | FOB/CIF/EXW, belge listesi, paketleme ve blok ölçüsü tek sayfada sade; hazır mesajlı WhatsApp. |
| Kaymer (önceki) | Test değerleri yalnız talep üzerine veriliyor; varsayılan dil Almanca. | Talepten gümrüğe altı adımı ve kalite tanımını açıkça yazıyor. |
| Acar (önceki) | Anahtar kelime doldurulmuş Türkçe metin ve yazım hataları. | Sağda sabit WhatsApp / form / telefon, 6 dil. |
| Mazzmar (önceki) | WordPress 4.4, 45 sn'de açılmıyor, altbilgide kendi adı yanlış. | Stoktaki ürünü miktar (m²) ve fiyatla gösteriyor; "konteynerine ekle" mantığı. |
| Dora (önceki) | Logo kırık, ekranda başka marka adı ("Doramar"), saat dilimi yanlış. | Üst şeritte telefon, e-posta ve çalışma saati. |

### 2.5 Sektörde en iyi site

**Türk siteler arasında en iyisi: Kaymer (kaymermining.com).** Daha önce çıta sayılan Majen'i alıcının sürecini anlatmakta geçiyor. Gerekçeler:

- **İlk ekran:** üç saniyede ne sattığını, nereden çıktığını ve kime sattığını söylüyor; tek eylemi teklif istemek.
- **Seçim ve kalite:** blokları numaralı, ölçülü ve fotoğraflı sunuyor; plakaları aynı bloktan demet halinde, plaka listesiyle veriyor. "1. kalite"yi tanımlıyor, renk aralığını numuneyle yazılı belirliyor.
- **Standartlar:** test standartlarını sayıyor; işlenmiş ürünlerde CE ve performans beyanının ne zaman gerektiğini açıklıyor.
- **Şartlar:** teslim şartları (EXW, FOB, CFR, CIF, DAP), belgeler (A.TR, fümigasyon) ve ISPM 15 paketleme yazılı.
- **Teknik:** 0,3 MB, 0,1 sn; çerez onayında "yalnız gerekli" seçeneği var.
- **Zayıf yanları:** değerleri sayfada göstermiyor (talep üzerine), çevrimiçi stok yok, WhatsApp yok.

**İkinci: Majen.** FOB/CIF/EXW'yi, belge listesini, paketlemeyi ve blok ölçüsünü en sade anlatan site. Plakaları kesim sırasıyla numaralıyor ve lot mantığını açıklıyor. Bayat fuar afişi ve SEO tekrarı onu geriye düşürüyor.

**Muğla'da en iyisi: Ermaş.**
- Güçlü yanları: EN adlı 7 değer, taş başına datasheet, ardışık plaka takımı ve 3B önizleme, BIM/CAD/renk kartı, numune formu, proje–taş–yıl eşlemesi.
- Bedeli: yalnız Türkçe; değerler ve ocak sayısı çelişkili; İ/I büyük harf hataları; yanlış etiketli sosyal bağlantılar; 5 sn açılış; mobilde taşma. Doğru fikirler sahada yarım uygulanmış.

**Yabancı karşılaştırma: Polycor (ABD/Kanada ocak sahibi).**
- Taş başına indirilebilir teknik föy var.
- Numune siparişi yapılandırılmış: rol (mimar, yüklenici …), taş + yüzey, adet, teslim adresi, tahmini kargo.
- "3B numune" ve uzmana ulaşma bağlantıları var.
- Türk sitelerinden farkı: numune adet, teslim adresi ve tahmini kargoyla bir ürün gibi sipariş ediliyor. Ermaş'ın formunda bu alanlar yok.

### 2.6 Damar demosu için çıkarımlar

1. **İlk ekran iki soruyu yanıtlasın: "kimim" ve "şimdi ne yaparsın".**
   - Kim: tek cümleyle Milas/Muğla'daki ocak + fabrika ve iki ana taş (Muğla Beyazı ailesi, Milas Lilac ailesi).
   - Eylemler: "Eldeki blok ve plakalar", "Numune iste" ve tıklanır telefon + hazır mesajlı WhatsApp.
   - Kaçınılacak: rakiplerdeki müzik, doğa, sürdürülebilirlik sloganları ve mutfak fotoğrafı bu soruları yanıtlamıyor.
2. **Taş sayfası bir teknik föy olsun.**
   - EN 1936 / 13755 / 12372 / 1926 / 14157 değerleri tek kaynaktan, tek tabloda, "örnek değer" notuyla, `[örnek içerik]`. Ermaş'taki 2,68 / 2,72 çelişkisi ders.
   - Yanında yüzeyler (cilalı, honlu, eskitme, fırçalı, kumlanmış), kalınlıklar (2/3 cm), ebatlar ve föy indirme düğmesi.
   - İşlenmiş ürün için CE / performans beyanı satırı.
3. **Lot ve blok kartı demonun özgün parçası olabilir.**
   - Blok kartı: blok no, ocak, ölçü, m³ ya da ton.
   - Lot kartı: plaka sayısı, ebatlar, toplam m², kalınlık, yüzey, kusur notu, depo, son güncelleme tarihi, "bu lotu sor" (hazır mesajlı WhatsApp ya da teklif formu).
   - Örnek kaynaklar: Kaymer'in numaralı blokları, Majen'in kesim sırası, Avrupa dağıtıcısının 22 plakalık Milas Lilak lotu.
   - Aynı bloktan ardışık plakalarla bookmatch önizlemesi (Ermaş'ın ardışık kesim fikri, Ionic'in bookmatch karosu) Milas Lilac'ın damarını göstermenin en güçlü yolu.
   - Stok düğmesi mutlaka çalışsın (Eminoğlu dersi).
4. **Numune akışı, rakiplerin bıraktığı boşluk.**
   - Form alanları: rol (ithalatçı / mimar / yüklenici), taş + yüzey, numune boyutu ve adedi, ülke, proje adı.
   - Hiçbir Türk sitesinin yazmadığı şeyi açıkça yazsın: numune ücreti, kargo kimde, kaç günde çıkar; değerler `[örnek içerik]`.
5. **Teklif yolu bir zaman çizelgesi olarak anlatılsın.**
   - Adımlar: talep → teklif → foto/video ile seçim → numune onayı → üretim ve kontrol → paketleme (ISPM 15, yükleme fotoğrafı) → sevk (Incoterm, A.TR).
   - FOB, CIF, EXW birer cümleyle; teklif formunda varış ülkesi, taş, kalınlık, yüzey, miktar.
   - Rakiplerin hiçbirinin yazmadığı teslim süresi yer tutucuyla gösterilsin.
6. **Dil önce İngilizce, elle yazılmış.**
   - Makine çevirisi eklentisi yok.
   - Rakiplerin hataları (taş adı karmaşası, "Personality Employment", "discipline-free", "WHİTE") demonun "özen" kanıtı olabilir.
   - `lang` doğru verilsin ki büyük harfte İ/I bozulmasın.
   - Taş adları tek bir sözlükten gelsin: Lilac mı Leylak mı, bir kez seçilip her yerde aynı kalsın.
7. **Güven, doğrulanabilir ayrıntıdan gelsin.**
   - Örnek nesneler: ISO belgesi + tarih (Alpay), laboratuvar raporu adı + tarih + standart (Karmaden), ocak ve fabrika adresleri + yol tarifi, proje + taş + yıl (Ermaş). Hepsi `[örnek içerik]`.
   - Kaçınılacaklar: sayaç, "dünyanın 3. büyüğü" türü iddia, bayat fuar afişi. Fuar bölümü tarihli olsun, tarihi geçince kendiliğinden arşive insin.
   - Sektörün görsel klişesi: koyu tam ekran mermer dokusu + altın/serif yazı, drone ocak fotoğrafı, yaşam tarzı mutfağı.
   - Az kullanılan sahici nesneler: üstüne kalemle numara yazılmış blok (Majen'in mobil görseli), ardışık plaka dizisi, plaka listesi, analiz raporu.
8. **Teknik çizgi.**
   - İlk yük 2 MB altı; 18 slaytlı giriş ve önyükleme ekranı yok.
   - 390 px'te yatay taşma yok (4 rakipte var); tüm telefonlar `tel:` bağlantısı, WhatsApp hazır mesajlı.
   - Bot doğrulama ekranı yok (Karmaden), kırık logo ve harita yok.
   - Rakiplerin çoğu bu çizgiyi aşmıyor; Kaymer (0,3 MB) mümkün olduğunu gösteriyor.

---

## 3. Konteyner yükleme gerçeği (tahmini, kaynaklı)

Taş ağır olduğu için konteyner hacimden önce ağırlıktan dolar. Bu yüzden taş ihracatında standart **20 feet** konteynerdir. 40 feet konteyner neredeyse aynı ağırlığı taşır (~28,8 t), yani ek bir şey kazandırmaz.

| Değer | Rakam | Kaynak |
|---|---|---|
| 20' kuru konteyner: dara / azami yük / hacim | ~2,3 t / ~28,2 t / 33 m³ | Stone Galleria |
| 40' kuru konteyner: azami yük | ~28,8 t | Stone Galleria |
| Taşta pratik tam yük (FCL) | 27–28 t | Stone Galleria (tablolar 27 t'yla hesaplı); Hangmao'nun Milas Lilac ilanı (27 t) |
| Bazı Avrupa varış yerleri | ~24 t | Stone Galleria |
| ABD kara yolu (yük) | Standart şasi ~38.000–39.200 lb (~17,2–17,8 t); üç akslı şasi ~44.000 lb (~20 t) | UK P&I Club rehberi, ACL konteyner özellikleri (arama özeti; eyaletten eyalete değişir) |
| Mermer yoğunluğu | 2,55–2,85 t/m³ | Brainbound; Stone Galleria hesaplarda 2,85 kullanıyor |
| 1 m² ağırlığı (hesap) | 2 cm ≈ 54–57 kg · 3 cm ≈ 81–86 kg | yoğunluk × kalınlık |
| 20 feet'e plaka (27 t) | 2 cm ≈ 468–471 m² (ebada göre 68–97 plaka) · 3 cm ≈ 311–312 m² | Stone Galleria tablosu (330×210, 300×200, 270×180 cm) |
| Aynısı, bir Milas Lilac ilanında | 2 cm 430–450 m² · 3 cm 270–300 m² | Hangmao (b2usa) |
| Demet (bundle) | 20 feet'e ortalama 7 demet (6–8). 2 cm demette 9–12 plaka (~50–60 m²), 3 cm demette 7–8 plaka (~35–40 m²) | Stone Galleria, Hangmao |
| Ebatlı karo (27 t) | 1,8 cm ≈ 526 m² · 2 cm ≈ 473 m² · 3 cm ≈ 316 m² | Stone Galleria |
| Ambalaj payı | Yükün %2–5'i (A çerçeve, sandık). Karo sandığı 2 t'ye kadar çıkabiliyor | Stone Galleria; TATA AIG Marine Newslink (2021) |
| Ambalaj ve belge | ISPM 15 fümigasyonlu ahşap; çeki listesi, menşe, A.TR | Kaymer, Majen, Hangmao (bkz. Ek) |

**Demodaki konteyner hesabı için öneri.** Sitede her rakamın yanında şu not durur: "tahmini; kesin çeki listesini fabrika verir".
- Ağırlık (t) = m² × kalınlık (m) × yoğunluk (t/m³) × (1 + ambalaj payı). Ambalaj payı plakada %4, karoda %8.
- Plaka sayısı = m² ÷ o bloğun ortalama plaka alanı (ör. 5,2 m²).
- Demet sayısı = plaka sayısı ÷ demet başına plaka (2 cm'de 10, 3 cm'de 7).
- Konteyner sayısı = ağırlık ÷ yük sınırı. Sınır varış yerine göre değişir: genel 27 t, bazı AB ülkeleri 24 t, ABD üç akslı şasi 20 t. Kullanıcı sınırı değiştirebilir.
- Örnek: 600 m², 2 cm, yoğunluk 2,71 → 32,5 t taş + %4 ambalaj = 33,8 t. Bu, 27 t sınırla da 20 t sınırla da 2 konteyner eder (27 t'de ikincisi yarı dolu). 116 plaka, 12 demet. `[örnek]`

## 4. Tescilli ve korunan adlar, Muğla'nın ticari taş adları, kurgusal adlar

**TÜRKPATENT coğrafi işaret kayıtları (kayıt belgesiyle doğrulandı):**

| Ad | No | Tür | Tarih | Tescil ettiren |
|---|---|---|---|---|
| Denizli Traverteni | 151 | Menşe adı | 09.01.2008'den geçerli (Resmî Gazete 14.01.2011) | Denizli Ticaret Odası |
| Afyon Mermeri | 114 | Menşe adı | 10.07.2009 | (portal detay sayfası) |
| Amasya Beji Mermeri | 358 | Menşe adı | 11.06.2018 | Amasya Bilim, Sanayi ve Teknoloji İl Müdürlüğü |
| Elazığ Vişne Mermeri | 1515 | Mahreç işareti | 27.12.2023 | Fırat Kalkınma Ajansı ve diğerleri |

**Doğrulanamayanlar:**
- **Muğla Beyaz Mermeri (Muğla Beyazı).** Basın 2018'de coğrafi işaret aldığını yazıyor (Türkgün/AA, 08.02.2025), ama TÜRKPATENT kaydı bulunamadı. Tescilli kabul edip kullanmıyoruz.
- **Marmara Adası Mermeri.** Ansiklopedi kaydında 387 numara geçiyor; resmî kayıt açılmadı.

**Muğla'nın ticari taş adları.** Bunlar satıcıların kullandığı adlar, tescil değil:
- Muğla White / Muğla Beyazı; aynı taş için Blanco Ibiza ve Ibiza White da kullanılıyor.
- Milas Lilac / Leylak / Lilak / Lilac White; Light, Medium ve Dark kademeleriyle.
- Milas Pearl / Sedef, Milas Limon, New York.
- Karia Grey / Nera / Grigio, Patara Beige / Dark, Ege Gümüş.

Ayrıntı: 1d.

**Demo kuralı: bu adların hiçbiri kullanılmaz.** Üç nedeni var:
1. Coğrafi işaretli ad ancak o bölgede ve şartnameye uygun üretimde kullanılabilir.
2. Ticari adlar gerçek firmaların ürünlerini çağrıştırır.
3. Kurgusal bir firmanın "Milas Lilac satıyoruz" demesi, gerçek bir ürünü temsilen satmak olur.

**Kurgusal taş adları (öneri).** Hızlı aramada hiçbiri mermer ticari adı olarak çıkmadı; marka tescilinde aranmadı.

| Ad (EN yazımı) | Görünüm | Not |
|---|---|---|
| Eflatun | Beyaz zemin, leylak ile mor arası damar ağı | Milas'ın imza taşına karşılık gelir. "Eflatun" Türkçede leylak/mor rengi demek. |
| Duman | Duman grisi zemin, beyaz damar | |
| Sırma (Sirma) | Sıcak beyaz zemin, altın ve vizon damar | "Sırma" = altın ip |
| Kırağı (Kiragi) | Neredeyse beyaz zemin, tüy gibi ince gri damar | |

Elenen adlar:
- **Ayaz White:** İngiliz bir porselen karonun ürün adı.
- **Kumru:** İzmir kumrusu coğrafi işaretli bir sandviç; yanlış çağrışım yapıyor.

## 5. "Damar" adı: çakışma kontrolü

**Türkiye'de çakışma yok.**
- "Damar Mermer", "Damar Granit" ya da "Damar Doğal Taş" adında firma veya site bulunmadı (web araması).
- Şu alan adları 2026-10-09'da çözülmüyor: damarmermer.com, damarmermer.com.tr, damar.com.tr, damartas.com, damartas.com.tr, damarmarble.com.
- TÜRKPATENT marka araması yapılmadı; arama form doldurmayı gerektiriyor.

**Yurt dışında, aynı sektörde iki firma var:**
1. **Damar Natural Stone Imports, Inc.**, Northbrook, Illinois, ABD.
   - Doğal taş tezgâh ve karo ithalatçısı; 1991'den beri aile şirketi (yerel rehber kaydı).
   - Kayıtta yazan damarstone.com çözülmüyor; firmanın bugün çalışıp çalışmadığı doğrulanamadı.
2. **Damar Marmi S.r.l.**, İtalya.
   - Profilde Trani yazıyor, şirket verisinde Fano adresi var.
   - Mimar ve tasarımcılara özel mermer işleri yapıyor; 2000'de kurulmuş (edilizia.com profili).
   - damarmarmi.it alan adı açılıyor ama yalnız "yapım aşamasında" sayfası gösteriyor.

**Değerlendirme: kısmi çakışma.** Demo İngilizce öncelikli ve alıcı yurt dışında. "Damar Stone / Damar Marble" adı ABD'deki bir taş ithalatçısının adıyla aynı.
- Kurgusal demo için risk düşük.
- Bu ad gerçek bir müşteriye marka olarak önerilecekse risk var.

**İki alternatif.** Hızlı aramada doğal taş sektöründe bu adlarla firma ya da ürün çıkmadı; marka tescilinde aranmadı.
1. **Varak.** Eski Türkçede "kitap yaprağı" demek; kitap açılımına doğrudan bağlanıyor ve İngilizcede kolay okunuyor. Ek çağrışımlar: Türkçede "altın varak" (olumlu); Hint tatlılarında yaldız olarak kullanılan gümüş varak.
2. **Beçin** (EN: Becin). Milas'ın hemen güneyindeki tarihî Menteşe başkenti; yerel ve kısa. Riskleri: bir yer adı olduğu için başka işletmelerde kullanılıyor olabilir; adında Türkçe "ç" var.

**Önerim:** Demoda "Damar" kalsın. Plan ve klasör adı (slug) bu, Türkçe anlamı güçlü, çakışan iki firma da küçük ve biri muhtemelen kapanmış. Sitede tam ad Türkçede "Damar Mermer", İngilizcede "Damar Marble, Milas" olarak geçsin. Raşit daha temkinli olmak isterse: Varak.

## 6. Kitap açılımı piyasada var mı? (iddiamızın sınırı)

**Var olanlar:**
- **Fabrikatör yazılımları.**
  - SlabSmith, "Perfect Match" modülü: ölçekli plaka fotoğrafının üstüne parça yerleştiriyor, ek yerinde damarı eşliyor; 2023.6 sürümünde 3B duvar ve oda kurulumu eklendi.
  - Moraware CounterGo: plaka fotoğrafı üstünde tezgâh yerleşimi.
- **Uygulama.** Ücretsiz iPad uygulaması MarbleArch, fotoğraftan 2×2 ve 4×4 kitap açılımı görselleştiriyor.
- **Dağıtıcılar.**
  - ABD'de lot ve plaka fotoğraflı canlı plaka stoğu var: Arc Surfaces "live inventory", MSI "SlabInventory".
  - **En yakın örnek bu.** Arc Surfaces (Architectural Surfaces, ABD) herkese açık stok sayfasında gerçek plaka fotoğrafına **"Bookmatch view" düğmesi** koymuş (2026-10-09'da denendi; ekran: `ekran/referans/arc-bookmatch-1440.png`).
    - Düğme fotoğrafı ortadan aynalıyor ve döndürme düğmeleri sunuyor.
    - Yanında stok bilgisi var: depodaki plaka 5, ayrılmış 0, satılabilir 5; ebat aralığı, 2 cm, honlu, depo şehri.
    - Sınırı: aynı fotoğrafı aynalıyor; ardışık iki plakayı yan yana koymuyor. Sahne yok, konteyner hesabı yok. Kapsamı ABD içi dağıtım, ihracat değil.
  - Kitap açılımı ürün olarak da satılıyor: Hangmao "Book Matched Milas Lilac" ilanı, Ionic "Lilac Bookmatch Tiles" koleksiyonu.
- **Muğla'daki en yakın örnek: Ermaş.**
  - Taş sayfasında "Ardışık Kesim" başlıklı 6 numaralı plaka görseli, döndürülebilir 3B plaka önizlemesi, datasheet ve numune talebi düğmesi var.
  - Mimarlar bölümünde Revit kütüphanesi, CAD dokusu ve renk kartı var.
  - Eksikleri: site yalnız Türkçe; aynalama (kitap açılımı), sahne, kalan plaka sayısı ve konteyner hesabı yok.

**Sonuç: "dünyada ilk" denmez, "sektörde ilk" de denmez.** Herkese açık bir dağıtıcı sitesinde gerçek fotoğrafla kitap açılımı görüntüsü zaten var (Arc Surfaces).
- Doğru iddia şu: aynı bloğun ardışık plakalarıyla kitap açılımı, sahne, kalan plaka sayısı ve konteyner hesabı bir arada, **bir Türk ihracatçısının herkese açık sitesinde**. İncelenen 17 Türk sitesinde bunu yapan yok.
- Bu bulgu satışta aleyhimize değil, lehimize de kullanılabilir: "ABD'deki alıcınızın kendi deposunun sitesinde gördüğü özellik, sizin sitenizde de olsun." Alıcı bu görünüme zaten alışık.
- Satış dilinde "rakibinizin sitesinde olmayan" denebilir.
- Satış görüşmesinde Ermaş'ı bilmek gerek. Muğla'daki patron bu siteyi tanıyor olabilir; Damar onun bir adım ötesi olarak anlatılmalı: İngilizce, aynalama, stok ve konteyner.

---

## Ek: sitelerde görülen yükleme bilgileri

| Firma | Sitede ne yazıyor (özet) | Kaynak |
|---|---|---|
| Majen | FOB'da konteyner Türk limanında yükleniyor, CIF'te varış limanına kadar taşıma ve sigorta, EXW seçeneği. Paketleme: takviyeli ahşap çerçeve, naylon sarma, metal çember. Standart blok 280×220×200 cm, ortalama 30–35 ton. Belgeler: ticari fatura, çeki listesi, menşe, muayene raporu, gümrük belgeleri | https://majen.com.tr/en |
| Majen | Plaka 2/3/5 cm; plakalar kesim sırasıyla numaralı, lot bir arada tutuluyor; numune için hazır metinli e-posta | https://majen.com.tr/en/travertine-slabs |
| Kaymer | Konteyner ya da tırla sevk. ISPM 15 fümigasyonlu ahşap sandık ve çerçeve, yükleme fotoğrafı. Teslim şartları EXW, FOB, CFR, CIF, DAP. Belgeler: fatura, çeki listesi, A.TR, konşimento ya da CMR, fümigasyon belgesi, menşe. Blok m³ ya da tonla satılıyor | https://www.kaymermining.com/en/export-logistics/ ve https://www.kaymermining.com/en/ |
| Kentmer | Ürünler tahta sandıklara yerleştirilip straforla destekleniyor (yurt içi ve yurt dışı sevkiyat) | https://kentmer.com/fabrikaocaklar.html |
| Eminoğlu | Fabrika İzmir limanına 41 km, havalimanına 25 km; 24.000 m² açık alanda yükleme-boşaltma ve stok sahaları; Milas ocağı İzmir limanına yaklaşık 160 km | https://eminoglusbv.com/fabrika.aspx ve https://eminoglusbv.com/milas-ocagi.aspx |
| Mazzmar | Stok ürün: 2.800 m² "ithalata hazır"; bu taş için aylık tedarik kapasitesi 13.000 m²; sepetin adı "Your Container" | http://www.mazzmar.com/stock-sale-product/light-travertine-veincut-filled-honed-40x80x2-cm-tiles/ |
| Ionic | Global sitede İngiltere'ye sevk edilecek ürünler için ayrı UK sitesine yönlendirme; St Albans'ta UK adresi | https://www.ionicstone.com/global/ |
| Temmer | Plaka galerileri (stok noktası): Atlanta, İstanbul Haliç, Afyon | https://temmermarble.com/slab-gallery/ |
| Aytaş | Aylık üretim kapasitesi 80.000 m² (yükleme rakamı değil). **Doğrulanamadı:** arama motoru özetinde sitenin eski bir sürümünden "ayda 80–100 konteyner" ifadesi geçiyordu; güncel sitede bulunamadı | https://aytasakinmermer.com/En/Pages/42/Our-Factory |
| Delta | Bayi sipariş formunda "farklı sevk adresi, termin" için not alanı; ürün kodunda kalınlık ve yüzey ("polished 2 cm slab") | https://www.deltamarble.com/tr/bayi-siparis-formu/ |

---

## Kaynaklar

Firma siteleri (erişim 2026-10-09):
- Muğla: alpaymermer.com, ermas.com.tr, ayhanmarble.net, kentmer.com, kocarmermer.com, karmaden.com.
- Milas ocaklı İzmir firması: eminoglusbv.com (+ yontasmadencilik.com).
- Diğer bölgeler: aytasakinmermer.com, temmermarble.com, genclermermer.com, ionicstone.com (/tr, /global), deltamarble.com.
- Daha önce bakılmış (önceki): majen.com.tr, kaymermining.com, acarstone.com, mazzmar.com, doramarble.com.

Diğer:
- Konteyner: https://www.stonegalleria.in/how-many-granite-slabs-or-sq-ft-a-shipping-container-can-hold/ · https://b2usa.com/hotsite/hangmaostonemarble/book-matched-milas-lilac-marble-slabs · https://www.ukpandi.com/news-and-resources/news/article/bulletins/2021/overweight-container-guide/ · https://myacl.aclcargo.com/containerSpecs.php · https://www.tataaig.com/s3/Marine_Newslink_October_2021_4184672738.pdf · https://brainbound.blog/marble-density-guide
- Coğrafi işaret: https://ci.turkpatent.gov.tr/Files/GeographicalSigns/76193036-8a8a-4de2-97ef-79722e6992e8.pdf (Denizli Traverteni 151) · https://ci.turkpatent.gov.tr/cografi-isaretler/detay/37937 (Afyon Mermeri 114) · https://ci.turkpatent.gov.tr/Files/GeographicalSigns/358.pdf (Amasya Beji 358) · https://ci.turkpatent.gov.tr/Files/GeographicalSigns/2e9e8bf2-caa7-43b1-a57b-3e789c8823ff.pdf (Elazığ Vişne 1515) · https://www.turkgun.com/ekonomi/mugla-beyaz-mermeri-dunyanin-prestijli-yapilarinda/266027
- "Damar" çakışması: https://local.dailyherald.com/northbrook-il/damar-natural-stone-imports-inc-630-834-8470 · https://www.edilizia.com/?p=40477 · http://www.damarmarmi.it/
- Kitap açılımı piyasası: https://slabwise.com/guides/how-to-do-countertop-layout-on-a-slab-using-slabsmith · https://stoneworld.com/articles/93283-slabsmith-20236-released-with-new-3d-features · https://apps.apple.com/in/app/marblearch/id6757943152 · https://arcsurfaces.com/live-inventory/volakas/107850/ (Bookmatch view) · https://www.msisurfaces.com/SlabInventory/Search/marble/carrara-white/edison-slabs · https://ermas.com.tr/products/mugla-white · https://ermas.com.tr/architects
- Avrupa dağıtıcısının Milas Lilak lotu: https://drylayout.com/item?id=49859
- Polycor numune siparişi: https://www.polycor.com/resources/request-samples/ ve https://www.polycor.com/stones/
- Stonecontact Milas ocak kayıtları (arama sonucu, sayfalar ayrıca açılmadı): https://www.stonecontact.com/quarries-2225/mugla-milas-lilac-marble-quarry
- Milas taşı ve Mylasa adı, Milas Boğayokuşu ocağı: https://www.haber48.com.tr/milas-mermeri-dunyaya-ihrac-ediliyor
- Ham ölçüm: `arastirma/olcum.json`; ekran görüntüleri: `ekran/arastirma/`.
