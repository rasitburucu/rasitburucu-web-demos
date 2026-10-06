# Gelidonya — Batı Antalya fidelik, sera ve ihracatçı siteleri araştırması

- Tarih: 2026-10-06 · Amaç: kurgusal "Gelidonya Sera ve Fidelik" (Kumluca) konsept sitesinin yeniden tasarımına girdi.
- Yöntem: web araması → 26 aday → **22 gerçek firma sitesi** incelendi (16 fidelik, 6 üretici/ihracatçı). Her site Playwright ile 1440 ve 390 genişlikte açıldı; ilk ekran görüntüsü `ekran/{firma}-1440.png` ve `ekran/{firma}-390.png`. Alt sayfalar (sipariş, ekstra liste, iletişim, belgeler, ihracat) metin olarak okundu. Ham ölçüm: `olcum.json`, `olcum-onder-alfa-onursal-durdaslar.json`.
- Kapsam dışı kalanlar: Kumsal Fide (alan adı Wix'te "bağlı değil", 404), OSK Birleşik Tarım (alan adı çözülmüyor), Aymuz Fide (Manavgat, doku kültürü, sebze fidesi değil), Ekinciler (Burdur). **Kemer'de** fidelik/üretici sitesi bulunamadı; **Finike'de** yalnız Yaşa Fide'nin şubesi var.
- Ölçüm kısıtı: yükleme süresi tek ölçüm, ilk ziyaret (önbellek yok); sayfa ağırlığı `content-length` toplamı, yani alt sınır. Önder ve Alfa masaüstü görüntüleri fontlar engellenerek alındı (Önder'deki kare ikonlar bundan; sitenin hatası değil).
- Gerçek firma adları yalnız bu araştırmada geçer; kurgusal siteye ad, metin, görsel taşınmaz.

---

## 1. İncelenen firmalar

### 1a. Kimlik ve ilk ekran

| # | Firma | Adres (sitede yazan) | Tür | İlk ekranın (1440) söylediği | Menü |
|---|---|---|---|---|---|
| 1 | Olympos Fide · olymposfide.com.tr | Karşıyaka Mah., Kumluca | Fidelik (aşılı/düz) | Karartılmış bina fotoğrafı, solda "Fide nedir?" ikonları, başlık ekranın altında kesik | Anasayfa, Hakkımızda, Bilgilendirmeler, Galeri, **Ekstra Fide Listesi**, İletişim + YouTube, WhatsApp |
| 2 | Bars Fide · barsfide.com.tr | Karşıyaka, Şirket Cd. 5, Kumluca | Fidelik | "Fidesinin Arkasında Duran Firma" + stok yaprak fotoğrafı; altta 4 kart: Fide Siparişi / Teslim / Dikim / Pratik Bilgiler | Hakkımızda, **Ekstra Fide Listesi**, **Çiftçi Bilgilendirme**, Tesisler, Galeri, İletişim |
| 3 | Altın Fide · altinfide.com.tr | Kumluca merkez + Salur tesisi | Fidelik | Stok filiz-bokeh slaytı, başlık yok | Ürünler, Hazır Fide Nedir?, Üretim Tavsiyeleri, **Sipariş Ver**, Galeri |
| 4 | Alyans Fide · alyansfide.com | Karşıyaka Mah., Kumluca | Fide tedarikçisi (online) | Stok filiz slaytı; üst şeritte "Ekstra Listesi" + telefon | Ürünlerimiz, Önemli Bilgiler, Hakkımızda, İletişim |
| 5 | Maki Fide · makifide.com | Beykonak (aşılı) + Yeni Mah. (düz), Kumluca | Fidelik | "AŞILI & DÜZ FİDE ÜRETİM TESİSİ" + aşı klipsli fide fotoğrafı (gerçek) | Kurumsal, Galeri, İletişim |
| 6 | Duran Fide · duranfide.com | Göksu Mah., Kumluca | Fidelik | "AŞILI & DÜZ FİDE" + sera içi fotoğraf + **Bize Ulaşın / Whatsapp** + adres-telefon kartı + tesis videosu | **Ekstra Fide Listesi**, Hakkımızda, Galeri, İletişim |
| 7 | Yaşa Fide · yasafide.com | Göksu Mah., Kumluca + Finike şubesi | Fidelik | Yalnız viyol fotoğrafı; başlık yok | Çiftçi Bilgilendirme, **Ekstra Listesi** (ürün grubu alt menüsü), Ürünlerimiz |
| 8 | Has Fide · hasfide.com.tr | Fettahlı ve Kurşunlu, Aksu | Fidelik | Bina fotoğrafı; başlık ve eylem yok; sol üstte boşta kalmış madde imi | **Ekstra Listesi**, Hakkımızda, Galeri, Bilgilendirme |
| 9 | Grow Fide · growfide.com | Pınarlı-Çamköy, Aksu | Fidelik (Hollanda ortaklı) | Aşılama salonunda ekip fotoğrafı (gerçek), slayt; çerez penceresi ekranı kapatıyor | Kurumsal, Ürünlerimiz, **Sipariş**, Duyurular, **Spot Listesi**, İletişim · TR/EN |
| 10 | Fidenova · fidenova.com.tr | Topallı Mah., Aksu | Fidelik (küçük) | "Adına Doğru Fidenin Başlangıç Noktasına Hoşgeldiniz" + viyol fotoğrafı + "Fide Çeşitlerimiz" | Düz Fide, Aşılı Fide, Galeri |
| 11 | İklim Fide · iklimfide.com | Çalkaya Mah., Aksu | Fidelik (marul uzmanı) | "Marul Fidesi Üreticisinden alınır." + **Hemen Sipariş Ver (WhatsApp)** + Hızlı İletişim kartı (telefon, e-posta, adres, yol tarifi) | Marul Fidesi, Galeri, Blog, **SSS**, **Sipariş** · TR/EN |
| 12 | Güven Fide · guvenfide.com | Altınova, Kepez | Fide satıcısı | Afiş tipi slayt + "Tüm Aşılı & Aşısız Sebze Fideleri Temin Edilir" | 50+ maddelik ürün ağacı, Extra Fide, "Nasıl Sipariş Verebilirim?" |
| 13 | Öztürk Fide · ozturkfide.com | Serik | E-ticaret (hobi + üretici) | "YÜKSEK VERİMLİ DOMATES FİDESİ" + "%100 Organik / 7/24 Destek / 256-bit SSL" kartları | Kategoriler, Fırsatlar, sepet |
| 14 | Antalya Fidecim · antalyafidecim.com | Antalya (adres açık değil) | E-ticaret (hobi) | Pembe e-ticaret şablonu, dünya-elde-fide görseli, "1 günde kargo" | Kategori ağacı, Hesap Numaralarımız |
| 15 | Alfa Fide · alfafide.com.tr | Doğrulanamadı | Fidelik | Masaüstünde 9 sn+ yalnız yükleniyor simgesi; mobilde fide tutan çocuklar görseli | Ürünlerimiz, Önemli Bilgiler, Kataloglar |
| 16 | Arslan Fide · arslanfide.com | Mandırlar Mah., Antalya | Fidelik (küçük) | Sayaçlar "0+ / 0% / 0K+" | Yalnız Anasayfa, İletişim |
| 17 | Babacanlar · babacanlardemre.com | Küçükkum Mah., Demre + Antalya hal şubeleri | **Üretici + ihracatçı** | Markalı salkım domates fotoğrafı (gerçek ürün etiketi) | Hakkımızda, Ürünlerimiz, **Belgelerimiz**, Foto Galeri · TR/EN/RU |
| 18 | Durdaşlar · durdaslar.com.tr | Bağlık Mah., Kumluca (+ Elmalı, Plovdiv) | **Komisyoncu + paketleme + ihracat** | Paketleme hattı videosu + "Geçmişin Deneyimi, Geleceğin Tazeliği" | Hakkımızda, Ürünlerimiz, İletişim · TR/EN |
| 19 | Önder Export · onderexport.com | Kumluca | **İhracatçı** | "Güçlü Filomuzla Antalya Kumluca'dan Dünya'ya İhraç Ediyoruz" + TIR filosu | Hizmetlerimiz (Sebze/Meyve İhracatı, İç Piyasa), Ürünlerimiz · 14 dil (çeviri eklentisi) |
| 20 | Onursal Tarım · onursaltarim.com | Kumluca tesisi + Bursa, İstanbul depoları | **Toptan + ihracat** | Güneş paneli drone videosu | 30+ ürün maddesi, sepet, giriş · TR/EN/RU |
| 21 | Erbeyler · erbeyler.com | Antalya hal, Kumluca, Demre tesisleri | **Tarım + lojistik + ihracat** | Stok patlıcan kasası + "TAZELİK ve GIDA GÜVENLİĞİ" | Ürünler, Tesis, **ISO Belgeleri** · Diller |
| 22 | SAD Tarım · sadtarim.com.tr | Altınova (hal), Kepez | **İhracatçı** | Stok "kasa tutan gülümseyen kadın" + "Sağlıklı Yaşamın Anahtarı" | Sebzeler, Meyveler, **İhracat**, Foto Galeri |

### 1b. Hangi bilgiyi veriyorlar (+ var, – yok, ~ kısmen/bozuk)

| Firma | Çeşit listesi | Aşılı/aşısız | Anaç, gövde | Ekstra/hazır liste | Sipariş yolu anlatılmış | Kapasite | Belge | Tesis foto | Kişi/rol | Harita | Telefon tıklanır | WhatsApp |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Olympos | ~ (ekstra listede) | + | + (listede) | **+ canlı tablo** | – | + 80 milyon | – | + | – | – | + | + |
| Bars | ~ | + | + (listede) | **+ canlı tablo** | **+ ayrıntılı** | – | – | + | – | – | + | – |
| Altın | ~ | + | – | – | **+ ayrıntılı + viyol tablosu** | ~ m² | – | + | – | + | ~ (yanlış numara) | – |
| Alyans | + | + | – | ~ PDF indirme | – | – | – | – | – | – | – | – |
| Maki | – | + | – | – | – | + 100 milyon | – | + | – | – | + | – |
| Duran | ~ | + | + (tablo başlığı) | ~ tablo boş | – | + 60 milyon | – | + video | **+ 8 kişi, görevli** | – | + | + |
| Yaşa | + | + | + (tablo başlığı) | ~ tablo boş | – | + 100 milyon | – | ~ | – | + link | + | – |
| Has | + | + | – | ~ "#" bağlantı | – | + 85 milyon | – | + | ~ "10 ziraat müh." | + link | + | – |
| Grow | + | + | – | – | **+ ayrıntılı** | ~ m² | – | + | **+ bölge temsilcileri** | – | + | – |
| Fidenova | ~ | + | – | – | – | – | – | + | – | – | ~ yalnız mobil | ~ yalnız mobil |
| İklim | + (3 ürün sayfası) | – (marul) | – | – | ~ "WhatsApp'tan" | + | – | + | + kurucular | + | + | + |
| Güven | + | + | – | ~ "Yapım aşamasında" | ~ "WhatsApp'tan teyit" | – | – | ~ | ~ | + | + | + |
| Öztürk | + (e-ticaret) | + | – | – | sepet | – | ~ "sertifikalı tohum" | – | – | – | – | – |
| Babacanlar | ~ | n/a | n/a | n/a | – | – | **+ 7 belge adı** | + | – | ~ harita hatası | – | + |
| Durdaşlar | **+ ambalajlı** | n/a | n/a | n/a | – | + 60.000 ton | ~ | + video | + şube yetkilileri | ~ | – | – |
| Önder | + | n/a | n/a | n/a | – | – | – | + filo | – | – | – | + |
| Erbeyler | + | n/a | n/a | n/a | ~ "hasat takvimi için e-posta" | – | + ISO menüsü | ~ boş sayfa | – | + link | – | – |
| SAD | + | n/a | n/a | n/a | – | – | – | stok | – | – | – | – |

Fiyat: hiçbir ticari fidelik fiyat yazmıyor (Alyans: "güncel fiyat için arayın"; Güven: "toplu alımda indirim, WhatsApp'tan teyit"). Yalnız hobi e-ticaretleri (Öztürk, Fidecim) fiyatlı.

### 1c. Mobil ve teknik

| Firma | Masaüstü yük. (sn) | Mobil yük. (sn) | Ağırlık (MB, alt sınır) | Mobilde ilk ekran | Teknik/özen sorunu |
|---|---|---|---|---|---|
| Olympos | 24,3 | 1,4 | ~16 | Slogan + "80+" sayaç, eylem yok | Her sayfada görünen "WooCommerce should be installed and activated!"; sayaç metni "0+" |
| Bars | 24,7 | 1,4 | ~3,3 | Başlık + "İletişime Geç" + Fide Siparişi kartı | İlk ziyarette 25 sn |
| Altın | 7,8 | 2,7 | ~15 | Telefon başlıkta, slayt | Başlıkta yazan numara ile tıklanınca aranan numara farklı (iki tesis) |
| Alyans | 4,0 | 3,9 | ~1,2 | Slayt | Telefon tıklanamaz |
| Maki | 9,9 | 5,2 | **~24** | Fotoğraf + başlık | WordPress 5.9 (eski) |
| Duran | 5,4 | 4,8 | ~15 | **Başlık + Ara + WhatsApp + adres** (en iyi mobil ilk ekranlardan) | "WooCommerce…" artığı, sayaçlar "0+" |
| Yaşa | 4,7 | 3,5 | ~7 | Yalnız fotoğraf | Ekstra liste tabloları "No Result Found" (sezon içinde) |
| Has | 4,5 | 2,5 | ~11 | Yalnız bina fotoğrafı, eylem yok | Boşta madde imi |
| Grow | 1,5 | 0,6 | ~3,3 | Slayt | Çerez penceresi ilk ekranı kapatıyor; "Spot Listesi" aslında satış temsilcisi listesi |
| Fidenova | 2,2 | 1,4 | ~12 | Başlık + buton | Hakkımızda ve İletişim bağlantıları 404 |
| İklim | 1,6 | **0,5** | ~1,4 | **Başlık + tam genişlik WhatsApp sipariş + rakamlar** | Rakam tutarsızlığı: "750 milyon fide üretimi" ve "45 milyon/yıl" yan yana |
| Güven | 3,6 | 2,8 | ~8,9 | Afiş + **alt sabit eylem çubuğu** (ara, e-posta, WhatsApp, Facebook, konum) | Afiş görselde metin; ekstra sayfa "Yapım aşamasında" |
| Öztürk | 1,3 | 1,0 | ~8,8 | E-ticaret | Ana sayfada telefon yok |
| Alfa | yüklenmedi (önyükleme simgesi) | 1,5 | ~1,1 | Çocuklu görsel | Mobilde yatay taşma (398 px) |
| Arslan | 9,3 | 1,8 | ~2,7 | — | Sayaçlar "0K+ zamanında teslimat" |
| Babacanlar | 1,3 | 1,1 | ~2,6 | Logo + slayt | İletişimde Google Haritalar hatası; Ürünlerimiz sayfası boş |
| Durdaşlar | 4,9 | 8,3 | ~10,5 | Video | Telefonlar tıklanamaz; ürün listesinde fiyat yokken "Fiyata göre sırala" |
| Önder | 45+ (zaman aşımı) | 1,2 | ~0,7 | Telefon, saat, e-posta + başlık | Masaüstünde 45 sn'de açılmadı |
| Onursal | 13,5 | 9,4 | **~30** | Video | Sepet/karşılaştır gibi e-ticaret araçları B2B'de anlamsız |
| Erbeyler | 0,6 | 0,7 | ~1,3 | Stok görsel + slogan | Yalnız e-posta; telefon yok; Tesis sayfası boş; mobilde yatay taşma (405 px) |
| SAD | 26,1 | 0,8 | ~1,1 | Stok görsel | Telefonlar tıklanamaz |

Ortak altyapı: 22 sitenin 13'ü WordPress (çoğu Elementor/hazır tema); Kumluca fideliklerinin birkaçı aynı ajans şablonunu ve aynı "ekstra liste" yazılımını paylaşıyor (Bars ve Olympos'ta birebir aynı arayüz ve alt alan adı yapısı).

---

## 2. Sentez

### 2.1 Ziyaretçi gerçekte ne arıyor (sıklık sırasıyla)

Sıralama, sitelerin menüye ve ilk ekrana neyi koyduğuna, sipariş sayfalarında anlattıkları gerçek sürece ve iletişim sayfalarındaki kanal yoğunluğuna dayanıyor.

**Bölge üreticisi (seracı, ustabaşı)**

| Sıra | Aradığı | Kanıt |
|---|---|---|
| 1 | **Kimi arayacağım, numara ne?** (tek dokunuşla arama, WhatsApp) | 22 sitenin hepsinde telefon üst şeritte ya da ilk ekranda; Duran 8 kişiyi görev ve cep numarasıyla listeliyor (ziraat mühendisi, sipariş-sevkiyat, pazarlama) |
| 2 | **Şu an elde hazır fide var mı?** (ekstra/hazır fide listesi) | Kumluca'daki 7 fideliğin 5'i menüde "Ekstra Listesi" taşıyor; Has ve Güven'de de var. Bars ve Olympos'ta canlı tablo: tür, çeşit+anaç, adet, hazır tarihi, durum (Hazır/Boylu/Teslim tarihi), aşı, viyol, tohum firması |
| 3 | **Sipariş nasıl verilir, teslim nasıl alınır?** | Bars, Altın, Grow neredeyse aynı metinle: sipariş zirai ilaç bayisi, hal komisyoncusu, tarım kredi kooperatifi, firma bürosu ya da satış temsilcisi üzerinden; seri numaralı sipariş formu kaşeli-imzalı alınır; kaparo makbuzu; teslim istenen tarihte **±3 gün**; tesisten form + kimlikle teslim; irsaliyede kutu sayısı, cins, miktar kontrolü |
| 4 | **Doğru fide birimi:** çeşit + anaç, tek/çift gövde, viyol tipi, teslim tarihi | Ekstra listelerdeki çeşit adları "çeşit+anaç TEKLİ/ÇİFTLİ" yapısında; Yaşa'nın tablo başlıkları: Bitki türü / Dal / Anaç / Çeşit / Viyol tipi / Miktar / Teslim tarihi |
| 5 | **Dikim ve teslim alma tavsiyesi** | "Çiftçi Bilgilendirme / Üretim Tavsiyeleri / Önemli Bilgiler" 8 fidelikte: aşı noktası toprağa gömülmez, can suyu, ipe alma, hastalık tanıma |
| 6 | **Tesis nerede, yol tarifi, saat** | Teslim çoğunlukla tesisten şahsen; Güven ve Önder çalışma saatini yazıyor, İklim "yol tarifi" düğmesi koyuyor |

**Bayi / hal komisyoncusu / kooperatif**: bölgesinin satış temsilcisi (Grow'un bölge tablosu), sipariş formu, hazır fide listesini **yazdırma ve Excel'e indirme** (Bars ve Olympos listesinde var; bayinin müşterisine okuması için).

**Ürün alıcısı (yurt içi zincir, ihracat alıcısı)**: (1) ürün ve **ambalaj** seçenekleri (Durdaşlar: koli ölçüleri, şale 250/500 g, dizme), (2) **hangi aylarda** tedarik (Babacanlar ürün sayfasında 12 aylık tablo; Erbeyler: "hasat takvimi ve sipariş için e-posta atın"), (3) **belgeler** (Babacanlar: GlobalG.A.P., ISO 9001, ISO 22000, ISO 45001, BRCGS, SMETA, GRASP adlarını listeliyor), (4) lojistik ve soğuk zincir (Önder ve Erbeyler kendi soğutmalı filosunu gösteriyor), (5) EN/RU dil, (6) yetkili kişiye doğrudan ulaşım (Durdaşlar her şube için ad + cep).

**Çiftçi telefon ve WhatsApp mı kullanıyor? — Doğrulama: büyük ölçüde evet, ama sipariş hâlâ kâğıt ve aracı üzerinden kesinleşiyor.**
- Fideliklerin neredeyse hepsinde telefon var, 16'nın 5'inde WhatsApp düğmesi; hiçbir ticari fidelikte çevrimiçi sipariş ya da ödeme yok. Güven Fide açıkça "ürünler spot olduğu için sipariş öncesi WhatsApp'tan teyit edin" diyor; İklim'in tüm "Sipariş" düğmeleri WhatsApp'a gidiyor.
- Büyük Kumluca fidelikleri siparişi bayi, komisyoncu ve kooperatif ağıyla, seri numaralı formla ve kaparoyla kesinleştiriyor (Bars, Altın, Grow metinleri). Yani web sitesinin işi **siparişi almak değil, doğru kişiyi ve doğru bilgiyi buldurmak**.
- Genel veri: TÜİK verisine dayanan haberde tarım, ormancılık ve su ürünleri çalışanlarında internet kullanımı 2017'de %38,6 iken 2026'da %86 (egetelgraf.com). İzmir'de 134 çiftçiyle yapılan çalışma: akıllı telefon kullanımı iyi, bilgisayar ve e-posta kullanımı düşük, çevrimiçi işleme güven düşük (Tarım Ekonomisi Dergisi). WhatsApp'a özel sayısal veri bulunamadı; bu, saha gözlemine dayanan bir çıkarım.

### 2.2 Mevcut sitelerin ortak eksikleri

| Sorun | Somut örnek |
|---|---|
| İlk ekran iş yapmıyor: bina, filiz ya da slayt var, "ne satıyorum, nasıl ulaşırsın" yok | Has (yalnız bina, mobilde eylem yok), Yaşa (yalnız viyol fotoğrafı), Altın ve Alyans (stok filiz slaytı), Fidenova ("Hoşgeldiniz" başlığı) |
| Telefon var ama tıklanmıyor ya da yanlış numarayı arıyor | Alyans, SAD, Durdaşlar numaraları düz metin; Erbeyler'de telefon hiç yok, yalnız e-posta; Altın'da başlıkta Salur numarası yazıyor, tıklayınca Kumluca numarası aranıyor |
| Sitenin en değerli bölümü (hazır fide listesi) bakımsız | Duran ve Yaşa tabloları Ekim başında (sezon içinde) boş; Güven "Yapım aşamasında"; Has menüde "#"; Alyans PDF indiriyor; listelerde "son güncelleme" bilgisi yok |
| Şablon artığı ve özensizlik güveni düşürüyor | Olympos ve Duran'da her sayfada "WooCommerce should be installed and activated!"; Olympos, Duran, Arslan'da sayaçlar metinde "0+", Arslan'da "0K+ zamanında teslimat"; Durdaşlar'da fiyat yokken "fiyata göre sırala"; Onursal'da B2B'de sepet ve karşılaştırma |
| Ölü sayfa ve alan adı | Kumsal Fide alan adı boşa düşmüş; OSK Birleşik Tarım açılmıyor; Fidenova Hakkımızda ve İletişim 404; Babacanlar haritası hata veriyor, Ürünlerimiz sayfası boş; Erbeyler Tesis sayfası boş |
| Ağır ve yavaş | İlk ziyarette Olympos 24 sn, Bars 25 sn, SAD 26 sn, Önder 45 sn+; ağırlık Onursal ~30 MB, Maki ~24 MB, Olympos ~16 MB. Alfa masaüstünde yalnız yükleniyor simgesi gösteriyor |
| Rakamlar doğrulanamıyor ya da çelişiyor | İklim "750 milyon" ile "45 milyon/yıl" aynı sayfada; Has metinde "50 kişilik uzman kadro", Duran "200 kişi"; hiçbirinde kaynak ya da tarih yok |
| Asıl resmî belge gösterilmiyor | Tarım ve Orman Bakanlığı'nın fide üretici kuruluş listesinde Bars, Yaşa, Altın, Grow, Has kayıtlı (belge no + bitiş tarihi ile), ama **hiçbir fidelik sitesinde bu belge geçmiyor**. Bunun yerine "kalite ve güven" sloganı |
| Yalnız Türkçe | 16 fideliğin 14'ü yalnız TR; Önder'in 14 dili çeviri eklentisi (makine çevirisi) |
| Mobilde yatay taşma | Erbeyler (405 px), Alfa (398 px) |
| Tüketiciye konuşan dil (B2B alıcı için yanlış) | SAD "Sağlıklı yaşamın anahtarı", Öztürk "%100 organik / 7/24 destek / 256-bit SSL" |

### 2.3 İyi yapılanlar (fikir olarak; metin, görsel, kod kopyalanmaz)

| Fikir | Kimde görüldü | Gelidonya'daki karşılığı |
|---|---|---|
| Filtrelenebilir hazır fide tablosu: tür, aşı durumu, tarih ve adete göre sıralama, Excel indir, yazdır | Bars, Olympos | Ana sayfada 5 satırlık önizleme + tam liste sayfası |
| Fidenin gerçek birimiyle konuşmak: anaç, dal (tek/çift gövde), viyol tipi, teslim tarihi | Yaşa tablo başlıkları, ekstra listeler | Sipariş fişi ve listede aynı kolonlar |
| Sipariş → teslim → dikim → pratik bilgi dörtlüsü, ±3 gün teslim penceresi, irsaliye kontrolü | Bars, Altın, Grow | "Sipariş nasıl işler" 4 adımı (kendi metnimizle) |
| Viyol tipi ölçü ve hacim tablosu | Altın | Fide sayfasında küçük teknik tablo |
| Görev bazlı kişi listesi: kimi hangi iş için arayacağın | Duran | Rol kartları: sipariş-sevkiyat, ziraat mühendisi, ihracat |
| Bölge bazlı satış temsilcisi tablosu | Grow | "Bölgenizdeki temsilci / bayi" bölümü |
| Tek uzmanlığı ilk ekranda söyleyen başlık + tam genişlik WhatsApp + hızlı iletişim kartı + yol tarifi; hafif sayfa | İklim | İlk ekranın netliği ve hızı için örnek |
| Mobilde alt sabit eylem çubuğu + çalışma saatleri | Güven, Önder | Ara / WhatsApp / Yol tarifi sabit çubuğu |
| Ürün sayfasında ambalaj ölçüleri ve tedarik dönemi | Durdaşlar | İhracat ürün kartı |
| 12 aylık tedarik tablosu ve ayrı belgeler sayfası | Babacanlar | Hasat takvimi bölümü |
| "Hasat takvimi ve sipariş için yazın" eylemi | Erbeyler | Alıcının ana eylemi |
| Aşılı ve düz tesisin hijyen gerekçesiyle ayrı olması, iki ayrı adres-telefon | Maki | Seralarımız sayfasında tesis düzeni |
| Gerçek iş fotoğrafı: aşılama salonu, klipsli fide, markalı ürün etiketi | Grow, Maki, Babacanlar | Stok yerine işin nesneleri |

### 2.4 Sektörün görsel dili ve kaçınılacak klişeler

- **Ortak dil:** beyaz zemin, doygun yeşil butonlar, yeşil-kırmızı logo (yaprak + domates), tam ekran karartılmış fotoğraf üstünde beyaz büyük başlık, 3–5 karelik slayt (en az 10 sitede), yüzen WhatsApp balonu, animasyonlu sayaçlar, el yazısı logolar.
- **Klişeler (kullanılmamalı):** toprağa dizilmiş filizler + bokeh (Altın, Alyans); avuçta fide ya da dünya (Fidecim); sebze kasası tutan gülümseyen stok kişi (SAD, Erbeyler); fide tutan çocuklar (Alfa); drone sera ya da güneş paneli; TIR filosu dizisi; "Tarladan sofraya", "Kalite asla tesadüf değildir", "Hoşgeldiniz", "%100 organik"; boş dönen sayaçlar.
- **Az kullanılan, sahici nesneler (Gelidonya'nın dili olabilir):** viyol ve göz sayısı, aşı klipsi, etiketli fide kolisi, irsaliye ve sipariş formu, teslim haftası, kalibre ve koli ölçüsü, hal. Bu nesneler PROJE.md'deki "viyol, ekim cetveli, aşı klipsi" yönüyle örtüşüyor; araştırma bu yönü destekliyor.

---

## 3. Gelidonya için öneriler (sade ve profesyonel)

### 3.1 Bilgi mimarisi

| Sayfa | Bölümler |
|---|---|
| **Ana sayfa** | (1) İlk ekran (bkz. 3.2) · (2) Hazır fide listesi önizlemesi: 5 satır, "son güncelleme" tarihi · (3) Sipariş nasıl işler: 4 adım · (4) "Kendi seramıza diktiğimiz fide": Kumluca/Finike seraları, kısa · (5) Ürün ve ihracat kapısı · (6) Ziyaret: adres, saat, yol tarifi |
| **Fide** | Ürün grupları (domates, biber, patlıcan, hıyar, karpuz-kavun); her biri için aşılı/aşısız, tek/çift gövde, viyol tipi, yetiştirme süresi. Ticari çeşit ve anaç adı yerine "örnek çeşit / güçlü anaç" (PROJE.md kuralı) |
| **Hazır fide** | Tablo: tür, çeşit tipi, anaç tipi, gövde, viyol, adet, hazır tarihi, durum. Filtre: tür, aşı, tarih. Her satırda "Bu fideyi sor" → önceden doldurulmuş WhatsApp mesajı. Yazdır. Üstte "son güncelleme" |
| **Sipariş ve teslim** | Süreç, ne kadar önce sipariş verilir, kaparo ve sipariş formu nerede imzalanır (tesiste ya da bayide), ±3 gün teslim penceresi, teslim alırken irsaliye kontrolü, sevkiyat günleri; "bayiniz ya da kooperatifiniz üzerinden de verebilirsiniz" |
| **Çiftçi bilgisi** | Dikim, aşı noktası, can suyu, teslim sonrası ilk hafta. Kısa, maddeli |
| **Seralarımız** | Kumluca ve Finike seraları, aşılı/düz bölüm ayrımı, ekip rolleri. Rakam yok (PROJE.md) |
| **Ürünlerimiz ve ihracat** (EN) | Bkz. 3.6 |
| **İletişim ve ziyaret** | Rol kartları, adres, harita bağlantısı, saatler, ayrı teslim noktası |

### 3.2 İlk ekranın işi

Üç saniyede iki cevap: "burası fide aldığım ve kendi serası olan yer" ve "şimdi kimi ararım". Bunun için ilk ekranda tek cümlelik konum (Kumluca, sera + fidelik), **Ara** ve **WhatsApp** düğmeleri, ve sezon içinde en sık soruya giden kapı: **hazır fide**.

> **Karar noktası (Raşit):** PROJE.md ilk ekrana fide hesaplayıcısını (dönüm → fide → viyol → ekim haftası) koyuyor.
> A → hesaplayıcı ilk ekranda: demo olarak özgün ve akılda kalır / risk: sahadaki en sık soru "elde ne var, kimi arayayım"; hesaplayıcı bu soruyu bir adım geciktirir.
> B → ilk ekranda "Hazır fideye bak" + Ara/WhatsApp, hesaplayıcı sipariş akışının ilk adımı: sahadaki davranışa daha yakın / risk: ilk izlenim daha sıradan olabilir.
> Önerim B'ye yakın bir karma: hesaplayıcı ilk ekranda kalabilir ama Ara ve WhatsApp ondan önce görünmeli, hazır fide kapısı aynı ekranda olmalı.

### 3.3 Sipariş ve iletişim akışı

- Hesaplayıcı ve sipariş fişi **WhatsApp'a gönder** ve **Ara** ile biter; fişte ürün, aşılı/aşısız, gövde, viyol tipi, adet (viyolun katı), teslim haftası, köy/ilçe yazar. Demo'da gönderilmez (PROJE.md).
- Çevrimiçi ödeme ve sepet yok; sahada sipariş kaparo ve imzalı formla kesinleşiyor. Sitede bu süreç dürüstçe anlatılır.
- Mobilde alt sabit çubuk: Ara · WhatsApp · Yol tarifi. Her telefon `tel:` bağlantısı, görünen numara ile aranan numara aynı.
- Rol bazlı iletişim: "Sipariş ve sevkiyat", "Ziraat mühendisi (çeşit ve anaç danışmanlığı)", "Ürün ve ihracat". Kişi adları `[örnek içerik]`.
- Bayi kanalı görünür: "Bölgenizdeki bayi ya da kooperatif üzerinden de sipariş verebilirsiniz" + bölge listesi yer tutucusu.

### 3.4 Güven unsurları (uydurmadan)

| Unsur | Nasıl gösterilir |
|---|---|
| Bakanlık fide üretici belgesi | "Fide üretici belge no: `[örnek içerik]` · geçerlilik: `[örnek içerik]`" — gerçek bir zorunluluk, rakiplerin hiçbiri göstermiyor |
| Hazır fide listesinin tazeliği | "Son güncelleme: tarih" satırı; boş tablo yerine "Bu hafta hazır fide yok, sipariş için arayın" |
| Süreç şeffaflığı | ±3 gün teslim penceresi, irsaliye kontrolü, sevkiyat günleri |
| Teknik doğruluk | Viyol tipi tablosu, yetiştirme süreleri (kaynaklı, "örnek değer" notuyla) |
| Yer ve insan | Adres, harita bağlantısı, saatler, rol kartları |
| Kendi serası | "Kendi seramıza diktiğimiz fideyi size de yetiştiriyoruz" + sera ve fidelik aynı firmada |
| Kaçınılacaklar | Sayaç, "lider", "%100", müşteri yorumu, kurgusal ton/dekar/ülke sayısı |

### 3.5 Harita ve ziyaret

Ağır gömülü harita yerine statik konum çizimi + "Yol tarifi" bağlantısı (Babacanlar'daki gibi harita hatası riskini de ortadan kaldırır). Fidelik teslim noktası ile seralar ayrı işaretlenir; teslim saatleri ve sevkiyat yapılmayan günler aynı kartta durur.

### 3.6 İhracat bölümü ne içermeli

- Ürün kartı: ürün tipi (salkım, tane, kokteyl, pembe…), ambalaj seçenekleri (koli ölçüsü, ağırlık; `[örnek içerik]`), tedarik ayları (12 aylık çubuk), yükleme şekli (palet, soğutmalı TIR).
- Hasat takvimi: kendi seralarının haftalık/aylık takvimi.
- Belgeler: "alıcının sorduğu belgeler" listesi (GlobalG.A.P., kalıntı analizi raporu…), sahiplik iddiası yok, `[örnek içerik]` alanlarıyla.
- Eylem: "Fiyat ve hasat takvimi iste" formu → ürün, hafta, varış ülkesi, ambalaj, miktar (palet/TIR). Ayrıca ihracat sorumlusunun e-postası ve WhatsApp'ı.
- Dil: EN elle yazılmış (makine çevirisi eklentisi değil), RU yer tutucu.

### 3.7 Teknik çizgi

İlk yük ~1,5 MB altında, slayt ve önyükleme ekranı yok, yatay taşma yok, şablon artığı yok, tüm telefonlar tıklanır, hazır fide listesi yazdırılabilir. İklim Fide (~1,4 MB, mobilde 0,5 sn) sektörde bunun mümkün olduğunu gösteriyor.

### 3.8 PROJE.md için düzeltme notu (risk)

- **Viyol göz sayısı:** PROJE.md "domates/biber/patlıcan için 45 göz yaygın" diyor. Kumluca'daki canlı listelerde aşılı salkım domatesin tamamı **98 gözlü** viyolde (Bars ve Olympos, 30+ satır); aşısız biberde 98 ve 136; adetler viyolün katı (ör. 1.372 = 14 × 98). Altın Fide'nin tablosunda 96, 150, 200, 216, 384, 600 gözlü tipler var. Hesaplayıcıdaki varsayılan göz sayısı bu veriye göre güncellenmeli.
- **Gövde:** listeler "TEKLİ" ve "ÇİFTLİ" ayrımını adın içinde taşıyor; hesaplayıcıda tek/çift gövde seçimi olmalı (dekar başına fide sayısını değiştirir).
- **Durum dili:** sahadaki karşılık "Hazır / Boylu / Teslim tarihi"; sitede aynı sözcükler kullanılabilir.

---

## Kaynaklar

Firma siteleri: olymposfide.com.tr, ekstralistesi.olymposfide.com.tr, barsfide.com.tr, ekstralistesi.barsfide.com.tr, altinfide.com.tr, alyansfide.com, makifide.com, duranfide.com, yasafide.com, hasfide.com.tr, growfide.com, fidenova.com.tr, iklimfide.com, guvenfide.com, ozturkfide.com, antalyafidecim.com, alfafide.com.tr, arslanfide.com, babacanlardemre.com, durdaslar.com.tr, onderexport.com, onursaltarim.com, erbeyler.com, sadtarim.com.tr (erişim 2026-10-06).

Diğer:
- Tarım ve Orman Bakanlığı BUGEM, fideci kuruluşlar listesi (25.10.2024): https://www.tarimorman.gov.tr/BUGEM/Belgeler/fideci_kuruluslar%20(003).pdf
- Tarım çalışanlarında internet kullanımı (TÜİK verisine dayanan haber): https://www.egetelgraf.com/tarladan-dijital-dunyaya-ciftcilerin-internet-kullanimi-10-yilda-iki-katini-asti
- Çiftçilerin Bilgi Teknolojisi Kullanımı: İzmir İli Örneği, Tarım Ekonomisi Dergisi: https://dergipark.org.tr/tr/pub/tarekoder/article/1380528
- Antalya Valiliği, fide üretimi: https://www.antalya.gov.tr/antalya-fide-uretiminde-tum-dunyaya-hizmet-ediyor
