# ELEŞTİRİ: Revak Okulları (v2, commit 3f634de sonrası hâli)

Tarih: 2026-10-04 · Yöntem: LODOS web atölyesi `skills/elestiri` · Yakalama: Playwright, masaüstü 1440×900, mobil 390×844 (DPR 2), azaltılmış hareket; ekranlar `ekran/once-*.png`.

## 1. Özgünlük kararı

**Yarı yazarlı.** İmza an (revak yürüyüşü: kemerlerin altından yürümek, kademe başına bir kemer, çocuğun yaşının sayması) ve "Çocuğum [ilkokul] için [ön kayıt yaptırmak] istiyorum." cümle formu markaya ait. Çevresi ise "premium editoryal" kalıbıdır (YZ izi G) ve başka bir markaya taşınabilir.

| Test | Sonuç |
|---|---|
| Değiştirme | İlk ekran bir butik otele ya da hukuk bürosuna olduğu gibi yapışır: dev serif başlık, ikinci satırı italik tek kelime ("adıyla"), aralıklı BÜYÜK HARF künye şeridi, küçük bir kemer fotoğrafı. Yürüyüş yapışmaz. |
| İskelet | Sıra okul portalıyla birebir: giriş, rakamlar, kademeler, mezunlar, ilkeler, kulüpler, kampüs, etkinlikler, veli yorumu, SSS, kapanış. Ayrışan yalnız cümle formu ve yürüyüş. |
| Hafıza | Akılda kalan: iç içe kemerler, büyüyen yaş rakamı, "Her çocuğun adıyla tanındığı okul". Geçti. |
| Kalıp (G) | Taş-gri kâğıt zemin + italik ikinci satır + her bölümde "§ 0X + BÜYÜK HARF" künye + "LEV. 0 — …" altyazıları + ince çizgili tablolar + tek kırmızı vurgu: kalıbın tamamı var. |
| Yoğunluk | İlk ekranda dünyanın malzemesi yok: taş yalnız zemin rengi. Tek görsel kütle 15vw genişliğinde bir stok fotoğraf. Sitenin tek işi (cümle formu) ilk ekranın altında kalıyor. |

## 2. Puan (kendi yargım, tarama öncesi)

| Ölçüt | Puan | Kanıt |
|---|---|---|
| Tasarım (%40) | 6,5 | Tipografi ölçeği ve ritim güçlü (once-01). Ama taş malzeme yok; yürüyüşün kemerleri düz bej SVG, "düz renkle boyanmış clip-art nesne" (once-03/04); kalıp G; mobilde yaklaşım fotoğrafı başlığın üstüne biniyor (once-07); 404 İngilizce beyaz Next sayfası (once-08). |
| Kullanılabilirlik (%30) | 6,8 | Akışlar sağlam: adım göstergesi, alan hataları, mobil alt çubuk, cümle formu yönlendirmesi. Eksi: cümle formu ilk ekranda değil; hata sonrası ön kayıt başlığı yapışkan başlığın altında kalıyor (once-05); yürüyüş ~8 ekran sürüyor, ara karelerin yarısı yalnız soluk bir yaş rakamı. |
| Yaratıcılık (%20) | 6,8 | Yürüyüş konseptten doğuyor ama uygulaması fotoğrafı kemerle çerçevelemenin ötesine geçmiyor; ışık değişimi düz renk kaymasından ibaret. |
| İçerik (%10) | 5,5 | Türkçe somut ve iyi. Ama brif yasakları sitede: mezunların gerçek üniversite adlarıyla sayıları, "Velilerimizden" alıntıları, adı verilmiş öğretmen/mezun alıntıları. Kampüs görselleri kırmızı tuğla (taş dünyasıyla çelişiyor). |

**Ağırlıklı: 6,5** → Mansiyon sınırında, Günün Sitesi uzak.
Geliştirici (tahmini): Semantik 7 · Animasyon 7 · Erişilebilirlik 6,5 · WPO 7 · Duyarlı 6,5 · Markup 5 (404, OG görseli yok).

## 3. YZ izi taraması (yargıdan sonra okundu)

`slop_tarama.py`: 0 yüksek, 1 orta, 9 bilgi.
- orta: Newsreader aşırı kullanılan gösterim fontu listesinde. **Geçerli** → değişecek.
- bilgi: krem zemin #f3f1ea / #fbf9f6 / #efece6. Zemin #E7E5E0 taş grisi, krem değil; açık tonlar yalnız panel/alan yüzeyi. **Kısmen yanlış alarm**, taş gerekçesi YON.md'ye.
- bilgi: 4 backdrop-blur (başlık, alt çubuk). Yapışkan başlıkta okunurluk için; dekor değil. **Yanlış alarm.**
- bilgi: next/font/google bulutta derlenmez. Yerel derlemede sorun yok; borç olarak not.

## 4. Taze göz (bağlamsız inceleyici, aynı ekranlarla)

Karar **DÜZELT**, ağırlıklı **6,9** (Tasarım 6,9 · Kullanılabilirlik 6,8 · Yaratıcılık 7,4 · İçerik 5,4). Benimkiyle aynı yönde, Yaratıcılıkta yarım puan daha cömert. Ek bulguları: yaş sayacı ile kademe sekmesi uyuşmuyor ("8 yaş" görünürken "Ortaokul" sekmesi açık); "Devam edin" hap düğmesi diğer köşeli düğmelerle çelişiyor; mühür kırmızısı hiçbir yerde gerçek bir mühür olarak yok; aynı anda iki hata metni ("Kademeyi seçin." ve "Önce kademe seçin.").

## 5. Düzeltme tablosu (puan etkisine göre)

| # | Önce | Sonra | Neden |
|---|---|---|---|
| 1 | Yürüyüşte kemerler düz bej SVG yüzey; ara karelerde sol yarı boş | Blender'da modellenmiş kesme taş kemer (13 kemer taşı, kilit taşı, başlık silmesi, derzli ayaklar), sabah ve akşam ışığında iki render; kaydırdıkça biri ötekine döner. Duraklar uzun, yürüyüşler kısa (MOVE 1,8→1,25, HOLD 0,8→1,1, birim 0,5→0,42 vh); yaş sayacı mürekkep renginde, tam opak | Yaratıcılık +0,6, Tasarım +0,4 |
| 2 | İlk ekran: 15vw stok kemer fotoğrafı, cümle formu ekran altında | Sağda ekran yüksekliğinde kemer biçimli kendi revak render'ımız (çocuk göz hizasından, sabah güneşinin kemer gölgeleri); solda başlık + cümle formu ilk 900 px içinde | Tasarım +0,4, Kullanılabilirlik +0,3 |
| 3 | Mezun üniversite sayıları, veli yorumları, adı verilmiş öğretmen/mezun alıntıları | Rakamsız "Üniversite rehberliği nasıl işler" takvimi (9.–12. sınıf); veli bölümü kaldırıldı; alıntılar kademe başına somut bir gün anına çevrildi | İçerik +1,5, brif yasağı |
| 4 | Kalıp G: italik tek kelime, künye şeridi, § 01–09 numaraları, "LEV." altyazıları | Künye şeridi ve § numaraları kalkar; başlık tek ağırlık, italik yok; bölüm etiketi yalnız gerçek bilgi taşıdığı yerde | Özgünlük, Tasarım +0,3 |
| 5 | Gösterim fontu Newsreader (aşırı kullanılan, editoryal kalıp) | Marcellus: Trajan kitabesinden türemiş, kesme taş harfi; "adıyla tanınmak" = taşa kazınmış ad. Gövde Hanken Grotesk kalır | Tasarım +0,2, tarama orta bulgu |
| 6 | Mühür kırmızısı yalnız düğme rengi | Ön kayıt tamamlandığında çocuğun adı kırmızı bir mühürle basılır ("Her çocuğun adıyla tanındığı okul" sözünün karşılığı) | Yaratıcılık +0,2 |
| 7 | Mobilde yaklaşım fotoğrafı başlığın üstüne biniyor; giriş kemeri çok küçük | Mobilde görsel başlığın altında akışta; giriş render'ı başlığın altında tam genişlik kemer | Tasarım +0,2, Kullanılabilirlik +0,2 |
| 8 | Hata sonrası başlık yapışkan başlığın altında kalıyor; iki hata metni birden | Adım değişiminde odak başlığa, `scroll-margin-top` başlık yüksekliği + 24 px; kademe seçilmemişken "Önce kademe seçin." gizlenir | Kullanılabilirlik +0,2, WCAG 2.4.11 |
| 9 | Kampüs görselleri kırmızı tuğla | Kampüs bandı ve kampüs sayfası girişi aynı revak sahnesinin geniş render'ı | Tasarım/İçerik +0,1 |
| 10 | Yaş sayacı ile kademe sekmesi uyuşmuyor | Sekme yalnız duraklarda değişir; aradayken bir önceki kademe seçili kalır | Kullanılabilirlik, küçük |
| 11 | 404 İngilizce beyaz sayfa, OG görseli yok, caret rengi yok | Revak 404'ü (`/web/revak/404/` + not-found), 1200×630 OG görseli (render'dan), `caret-color` mühür | Markup +1 |
| 12 | Lenis kendi RAF döngüsünde, GSAP ayrı | Lenis `gsap.ticker`'dan sürülür, `lagSmoothing(0)` (yalnız ana sayfa); tek döngü | Animasyon, akıcılık |

## 6. Karar

**DÜZELT.** İskelet ve akışlar sağlam, imza fikri yazarlı; eksik olan imzanın malzemesi, ilk ekranın gücü ve içerik dürüstlüğü. Yeniden kurmaya gerek yok.

## 7. Sonuç turları (2026-10-04)

| Tur | Taze göz ağırlıklı | T / K / Y / İ | Karar |
|---|---|---|---|
| Önce | 6,9 | 6,9 / 6,8 / 7,4 / 5,4 | DÜZELT |
| 1. inşa turu | 6,9 | 7,0 / 6,6 / 7,2 / 6,8 | DÜZELT (özgünlük "yazarlı"a çıktı) |
| 2. düzeltme turu | 7,2 | 7,2 / 7,0 / 7,6 / 6,8 | DÜZELT (başvuru eşiği 7,5'in altında) |

Kalan bulgular (2. tur): yürüyüşte stok fotoğrafın render kemere düz oturması; servi ve ağaçların kil gibi durması; zemindeki vektör ışık lekeleri; üstte üç katman şerit (mobilde cümle formu ilk ekranın altında); akışta birincil düğmenin lacivert olması; 404'teki örgünün kepenk gibi okunması.
