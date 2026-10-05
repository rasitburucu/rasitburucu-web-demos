# TASARIM: Gelidonya Sera ve Fidelik

İnşadan sonra, kodda gerçekten kullanılan değerlerden yazıldı. Sonraki değişiklik bu dosyaya uyar ya da dosyayı günceller.

- Son güncelleme: 2026-10-06 (cila 2) · Yerel adres: http://localhost:3340/web/gelidonya/ (dal `demo/gelidonya`, çalışma kopyası `rasitburucu-web-demos-wt/gelidonya`) · Yayın: yok (onay bekliyor)

## Kullanılan tokenlar (`app/gelidonya/gelidonya.css`, `.gd-root`)
| Token | Değer | Kullanım |
|---|---|---|
| `--gd-bg` | `#f3f4f1` | zemin, masa paneli, `theme-color` |
| `--gd-surface` | `#ffffff` | form alanları, kartlar, etiket, tablo |
| `--gd-ink` | `#111311` | metin, kenar çizgileri (2 px), seçili çip, koyu bantlar |
| `--gd-ink-2` | `#454a44` | ikincil metin |
| `--gd-bench` / `--gd-bench-2` | `#bec2bb` / `#9ea39b` | galvaniz tezgâh deseni, ince çizgiler |
| `--gd-green` | `#3f8f1f` | yalnız "dolu" anlamı (son adım işareti, menüde geçerli sayfa) |
| `--gd-focus` | `#235a0e` | 3 px odak halkası, `caret-color` |
| `--gd-tomato` | `#b3261e` | form hatası, fiş damgası, 404'teki boş göz |
| Tip | `--gd-t-h1: clamp(2.25rem, 3vw + 0.4rem, 3.6rem)` (≤599 px: 2.35rem), `--gd-t-h2: clamp(2rem, 3vw + 0.5rem, 3.5rem)`, h3 1.25rem, gövde 1.0625rem, satır 1.5 | |
| Yazı | Big Shoulders Display 800 büyük harf (başlık, iri rakam, isim kazığı); Schibsted Grotesk 400–700 (gövde, form) | yerel woff2, Latin + Türkçe alt küme |
| Ölçü | `--gd-gutter: clamp(16px, 3vw, 48px)`, `--gd-max: 1360px`, başlık çubuğu 72 px (≤599 px: 60), radius 0 (viyol çizimi 3 px) | |
| Hareket | `--gd-ease-out: cubic-bezier(0.16, 1, 0.3, 1)`, `--gd-ease-io: cubic-bezier(0.77, 0, 0.175, 1)` | |
| Tarayıcı yüzeyleri | `::selection` ink/bg, `scrollbar-color #454a44 #dfe1dc`, `accent-color` ink, `scroll-padding-top 88px`, alanlarda `scroll-margin-top` başlık + 28 px | |

İlk ekran (cila 2): render tam genişlikte arka plan (`object-position: 66% 45%`, kaçış noktası ~x %66, y %43); masa paneli `minmax(0, 600px)` render'ın önünde, sağ kenarında gölge (`16px 0 36px -22px`), iç sol boşluk logo hizasında. h1 masaüstünde `min(var(--gd-t-h1), 2.6rem)`. Dikim haftası masaüstünde 3×2 ızgara + Önceki/Sonraki haftalar (sayfa başına 6). Etiket sağ üstte 250 px; viyol sağ altta `min(470px, 33vw)`, `perspective(1000px) rotateX(34deg)` ile koridor zeminine yatık, 8° düzlem içi dönüş, yazısı altında düz şeritte. Telefonda viyol banttan ~35 px taşar (desk üst boşluğu 58 px); alt çubuk görünürken ilk ekrandaki düğme satırı gizli.

## Bileşen envanteri
| Bileşen | Dosya | İş |
|---|---|---|
| `OrderProvider`, `useOrder` | `lib/gelidonya/siparis.tsx` | Tek sipariş durumu (ürün, birim, miktar, teslim haftası, yedek); ilk ekran, tezgâh ve telefon çubuğu paylaşır. Sunucu sabit tarihle (5 Eki 2026) çizer, tarayıcıda gerçek tarihe geçer |
| Hesap | `lib/gelidonya/hesap.ts` | fide = dönüm × dekara fide (+%5), viyol = ⌈fide ÷ göz⌉, ekim = teslim − süre; ISO hafta, hafta aralığı |
| Viyol kareleri | `lib/gelidonya/viyol-kare.ts` + `content/gelidonya/viyol-kare.json` | Blender'dan torflu viyol (45/28) ve ürün başına 8 fide sprite'ı (`scripts/gelidonya-blender/viyol_kare.py`); dolu gözlere fide konur (±%15 boy, ±11° dönüş). AVIF, yoksa WebP |
| İsim kazığı | `lib/gelidonya/viyol-ciz.ts` | Canvas'ta plastik kazık; gölgesi sol üst ışığa göre |
| `Hero` | `components/gelidonya/home/Hero.tsx` | Sera render'ı + masa paneli (h1 iki sabit satır, ürün/miktar/hafta) + asılı etiket + son viyol |
| `Etiket` | `home/Etiket.tsx` | Araba etiketi: fide, viyol, tohum ekimi, teslim, açık formül, kaynak bağlantısı |
| `SonViyol` | `home/SonViyol.tsx` | Son viyol canvas'ı, göz dolumu |
| `Tezgah` | `home/Tezgah.tsx` | Bütün viyoller (en çok 900): 220 px üstünde render karesi, altında temiz sayım (siyah kasa, fide başına yeşil nokta, boş göz torf); uzak sıralar canvas içinde %10 küçülür (perspektif, keskin); tuval yüksekliği sıralara eşit (en çok 560 / telefonda 320 px); altında "94 viyol; sonuncusunda 15 / 45 göz dolu". Teslim formu, fiş (tohum satırı "Fidelik temin eder / Üretici getirir", telefon 0532 000 00 00 biçiminde) |
| `Seralar`, `Yol`, `Urunler`, `Sezon`, `Ziyaret` | `home/Sections.tsx` | Ova bandı, fidenin yolu (6 adım), hasat takvimi (masaüstü: 14 px ince çubuk; ≤599 px: ürün başına tek satır şerit + "Kas–May"), ziyaret bandı |
| Harita kesiti | `ui/Cizimler.tsx` `HaritaKesiti` | İletişim: şematik yol tarifi (örnek konum), yanında büyük telefon; form 2/3 genişlik |
| `TorbaKesiti`, `AsiNoktasi` | `ui/Cizimler.tsx` | Etiketli SVG kesitler (Seralarımız, Fidelik) |
| `Resim` | `ui/Resim.tsx` | AVIF/WebP `<picture>`, telefona dar kırpım |
| `AliciFormu`, `RandevuFormu` | `pages/*.tsx` | Gönderilmeyen alıcı talebi ve ziyaret randevusu; özet kartı |
| İletişim düzeni | `app/gelidonya/iletisim/page.tsx`, `.gd-visit*` | Diğer alt sayfalardan farklı: solda bilgi künyesi (dl), sağda tam yükseklik fidelik görünümü; telefonda görsel üstte |
| Kabuk | `shell/Shell.tsx`, `Header.tsx`, `MobileBar.tsx`, `NotFound.tsx` | Şerit, başlık + menü, alt bilgi künyesi, telefon alt çubuğu, 404 |

## Hareket envanteri
| An | Tetikleyici | Süre / easing | Azaltılmış hareket |
|---|---|---|---|
| Göz dolumu (imza 1) | ilk yükleme, ürün/miktar/yedek değişimi | göz başına 22 ms aralık, 300 ms büyüme | anında dolu (kanıt: `ekran-insa/dolum-karsilastirma.png`, 150. ms) |
| Viyollerin tezgâha inmesi (imza 2) | tezgâh görünür olunca, miktar artınca | 6 ms aralık, 260 ms, 12 px iniş + opaklık | anında yerinde |
| Fiş damgası (imza 3) | form gönderilince | 420 ms `--gd-ease-out`, 120 ms gecikme | damga sabit, animasyon yok |
| Telefon alt çubuğu | form ya da alt bilgi görünürken çekilir | 200 ms `--gd-ease-out` | aynı (durum geri bildirimi) |
| Düğme/çip | hover, basış | 120 ms renk, 1 px basış | aynı |
Render'lar durağan; paralaks, kaydırma sahnesi, Lenis, GSAP yok.

## Ölçümler, ilk inşa (2026-10-05, statik çıktı, yerel sunucu, Playwright Chromium, kısma yok)
| Sayfa | LCP (1440 / 390) | LCP öğesi | CLS (1440 / 390) | Yatay taşma | Konsol |
|---|---|---|---|---|---|
| ana | 0,15 / 0,14 sn | sera render'ı | 0,017 / 0 | 0 | temiz |
| fidelik | 0,09 / 0,16 sn | fidelik render'ı | 0 / 0 | 0 | temiz |
| seralarimiz | 0,09 / 0,10 sn | ova render'ı | 0 / 0 | 0 | temiz |
| urunlerimiz | 0,13 / 0,11 sn | salkım render'ı | 0,0007 / 0 | 0 | temiz |
| iletisim | 0,10 / 0,10 sn | giriş paragrafı | 0,001 / 0 | 0 | temiz |
İlk yük JS (Next raporu): ana 121 KB, alt sayfalar 106–115 KB. LCP görseli: masaüstü `sera-ici-1800.avif` 167 KB, telefon `sera-ici-dar-800.avif` 76 KB. Yerel ölçüm ağ gecikmesi içermez; gerçek telefon değeri yayından sonra PageSpeed ile.

## Bilinen borçlar ve kararlar
| Konu | Neden ertelendi | Ne zaman |
|---|---|---|
| Ova (cila 2'de yeniden kuruldu) hâlâ "arşiv görselleştirmesi" düzeyinde: 8 tünel tipi tekrar ediyor, yol/depo/paketevi az seçiliyor, beşik çatı yok | Daha çok sera tipi, sıkı yol ağı, deniz tarafına sıkı kırpım | Gerekirse 3. render turu |
| Domates bitkisi yakın planda yapay (taze göz 3); salkım yakın planı kaldırıldı, Ürünlerimiz'de sera koridoru kırpımı | Alfa dokulu yaprak / fotogrametri | Gerekirse |
| Tezgâh küçük ölçekte nokta matrisi (ilk ekrandaki viyolle görsel süreklilik zayıf) | 94 viyolde render karesi gürültüye dönüyordu; temiz sayım seçildi | Gerekirse 10'luk gruplar + sıra numarası |
| Ana sayfa alt yarısı kurumsal ritim (iki siyah bant, tablo 3 sayfada) | Brif Seralarımız'a sezon çubuğu istedi | Raşit'in yorumuna göre |
| Yapraklar: boy ±%25, bitki başına ton ±%8, 9 bitki çeşidi (cila 2); çok yakından hâlâ geometrik kenar seçilebiliyor | Alfa dokulu yaprak kartı ya da fotogrametri gerekir | Gerekirse |
| Fidelik / Seralarımız / Ürünlerimiz hâlâ aynı aile (başlık + tam genişlik render + bloklar); İletişim farklı | İkisi SVG kesitle kısmen kırıldı | Raşit'in yorumuna göre |
| EN/RU sürümü yok | Brif: TR önce | Onaydan sonra |
| Dev sunucu Turbopack ile açılmıyor (node_modules kavşağı kök dışına işaret ediyor); `npx next dev -p 3340` (webpack) kullanıldı | Kavşak yapısı ortak; değiştirilmedi | Ana repoya taşınınca sorun kalmaz |

## Cila turu (2026-10-05)
- Render: yaprakçık başına ton (yüz özniteliği `ton`), sararan alt yapraklar, sivri/dişli/kıvrık yaprakçık, gövde tüyü parıltısı (sheen), meyvede tek malzemeyle yeşil→kırılma→turuncu→kırmızı geçişi, coat + yüzey altı saçılma, çanak yaprakları; sis yoğunluğu 0,03 ve ileri saçılma 0,55 (örtü ve iplerde ışık huzmesi), sera kamerasında alan derinliği f/5,6; 384 örnek + gürültü giderme, AgX Medium High Contrast. Ova: arazi ağı 640×520, eğime göre çam ormanı / kireçtaşı, yüzeyde tümsek, speküler kapalı (yamaçtaki bej parlama buradan geliyordu), hava sisi 6e-6. Fidelik: viyol kenarı torfun üstünü kapatıyordu (düzeltildi), çift zemin Cycles'ta kendi kendini gölgeliyordu (kaldırıldı).
- Önce/sonra: `.tasarim/gelidonya/ekran-insa/render-once-sonra.png` (eski PNG'ler `blender/render/once/`).
- Küçükler: başlıktaki telefon "örnek numara" etiketli; isim kazığı "DOMATES AŞILI"; İletişim'e görsel ve farklı düzen; h1 telefonda serbest kırılıyor.

## Cila 2 (2026-10-06)
- **Ova** (`ova.py` baştan): kamera 36 m, 35 mm, sahil boyunca batıya bakış; sabah güneşi 11° (denizde parıltı yolu), yüksekliğe göre incelen pus (atmosferik perspektif). 8 sera tipi (tünel/gotik, eski-yeni, yan havalandırması açık, yeni dikilmiş, boş), örtü örneği başına %60–85 opak, eski örtü tozlu-sarı, ~%17 kireç badanalı, içi ekinli olanlarda yeşil gölge, kemerler örtüden seçilir; ~8.800 blok, selvi/kazuarina rüzgâr kıran sıraları (~11.000 ağaç), narenciye, su deposu ve havuz, paketevi, asfalt + stabilize yollar; Toroslar sırtlı gürültü + çam örtüsü/açıklık/kireçtaşı/oluk. Render 256 örnek, AgX MHC, pozlama −0,3.
- **Sera içi**: pozlama −0,7 (−0,5 EV, tavan patlaması yok), kamera `shift_y −0,06` (kaçış noktası %66/%43), yaprak boyu ±%25, yaprak tonu ±%8 (bitki başına), 9 bitki çeşidi; meyvede ±%15 boy, beş omuz loblu biçim, ton oynaması. Salkım yakın planı −0,2 pozlamada, sitede bulanık yaprak ve gövde uçları kırpılmış (1800×1012).
- **Viyol**: canvas çizimi yerine Blender kareleri (`viyol_kare.py`), torflu kasa, fide sprite'ları, gölge sol üst ışıkla.
- Önce/sonra: `ekran-insa/cila2-once-sonra.jpg`; eski PNG'ler `blender/render/once-cila2/`. Kareler: `ekran-insa/cila2/` (ilk ekran, karpuz 28 göz, fiş, 150 ms dolum / azaltılmış hareket, tam sayfa, 8 kaydırma temas tablosu, render'lar).
- Ölçüm (statik çıktı, yerel): LCP ana 0,15 / 0,12 sn, alt sayfalar 0,07–0,12 sn; CLS ≤ 0,003; yatay taşma 0; konsol temiz; ilk yük JS ana 122 KB, alt sayfalar 106–115 KB. Hero LCP `sera-ici-1800.avif` 121 KB.
- Taze göz (üç bağımsız ajan, her biri önceki puanı bilmeden): 7,1 → 7,2 → 7,3, üçünde de karar DÜZELT. Kalan bulgular yukarıdaki borç tablosunda.
- Kapanış (koordinatör kararı, 7,3'te duruldu): Ürünlerimiz açılış görseli salkım yakın planı yerine sera koridoru render'ının kırpımı (`urun-*`, 2400×960); salkım render'ı sitede kullanılmıyor. h1 "Dikim haftanızı seçin, fideniz o hafta serada olsun."
