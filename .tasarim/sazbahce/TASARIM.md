# TASARIM: Sazbahçe

İnşadan sonra, kodda gerçekten kullanılan değerlerden yazıldı. Sonraki değişiklikler bu dosyaya uyar ya da dosyayı günceller.

- Son güncelleme: 2026-10-05 · Adres: `/web/sazbahce/` (worktree `rasitburucu-web-demos-wt/sazbahce`, dal `demo/sazbahce`, commit yok)
- Sayfalar: `/web/sazbahce/`, `/alanlar/`, `/kurumsal/`, `/teklif/`, `/ziyaret/`, `/404/` (+ `not-found`)

## Kullanılan tokenlar (`app/sazbahce/sazbahce.css`, `.sb-root`)
| Değişken | Değer | Not |
|---|---|---|
| `--sb-bg` | #e9ede6 | zemin; `theme-color` aynı |
| `--sb-paper` | #f3f5f1 | kâğıt, kartlar, plan sayfası |
| `--sb-ink` | #1d3830 | metin; zeminde 10,7:1 |
| `--sb-ink-2` | #4f655c | ikincil metin; zeminde 5,3:1 |
| `--sb-line` / `--sb-line-2` | #a9b8ae / #c9d2cb | çizgiler |
| `--sb-accent` | #e8af56 | ayva sarısı: ana düğme, pist, seçili gün noktası, seçim; üstünde mürekkep 6,4:1 |
| `--sb-accent-hi` | #efbe6e | düğme hover |
| `--sb-accent-deep` | #7a5a12 | uyarı kutusu çerçevesi; zeminde 5,4:1 |
| `--sb-night` / `--sb-on-night` / `--sb-on-night-2` | #12261f / #e9ede6 / #b5c4ba | şerit, ilk ekran zemini, alt bilgi |
| Plan renkleri (SVG içinde) | kâğıt #f3f4ee, çayır #e2ebdd, su #cfe0dc→#93b4af, saz #486a59, söğüt #cfdcc6, ceviz #b7c9ae, ambar zemini #f1eadb, avlu taşı #ece6da, fener #e8af56, akşam ışığı #f2c27a (radyal, multiply) | |
| Easing | `--sb-out: cubic-bezier(.16,1,.3,1)`, `--sb-io: cubic-bezier(.77,0,.175,1)`, `--sb-drawer: cubic-bezier(.32,.72,0,1)` | |
| Süreler | `--sb-t-fast` 140 ms, `--sb-t-state` 220 ms, `--sb-t-sheet` 420 ms; masa yerleşimi 500 ms + 14 ms kademe; plan kadraj geçişi 600 ms | |
| Boşluk | `--sb-gutter: clamp(16px, 4vw, 48px)`, `--sb-max: 1320px`; bant dikey `clamp(64px, 9vw, 120px)` | |
| Radius | kontrol 4 px, çip/segment 3 px, kâğıt sayfa 6 px, mobil alt sayfa 12 px | |

Tipografi:
| Rol | Font | Ayar |
|---|---|---|
| h1 | Anybody (yerel woff2, wdth 100–150, wght 500–850) | `clamp(2rem, 1.05rem + 2.5vw, 3.5rem)`, 690, stretch 106%, satır 0,98, -0,02em |
| h2 / h3 | Anybody | `clamp(1.75rem, 1.15rem + 1.6vw, 2.75rem)` 700 / `clamp(1.35rem, 1.1rem + .6vw, 1.7rem)` 700, stretch 106% |
| logo | Anybody | 22 px, 800, stretch 135% |
| plan etiketleri | Anybody 125%, 680 | ekranda sabit 11,5 px (`--sb-k` ile ölçeklenir) |
| gövde | Onest (yerel woff2, wght 400–700) | 16,5 px / 1,55; küçük 12,5–14,5 px |

Tarayıcı yüzeyleri: `::selection` ayva + mürekkep, `caret-color` mürekkep, `scrollbar-color` #a9b8ae/#e9ede6, odak halkası 2 px mürekkep (koyu zeminde ayva), `color-scheme: light`, SVG favicon (`app/sazbahce/icon.svg`, iskele + alçak güneş), OG görseli `opengraph-image.jpg` (1200×630, ilk ekran).

## Bileşen envanteri
| Bileşen | Dosya | İş |
|---|---|---|
| Planner, Stepper, AreaCard, DayLine, MobileBar | `components/sazbahce/home/Planner.tsx` | İlk ekran: fotoğraf + kâğıt sayfa (takvim, plan, alan fotoğrafı, künye çubuğu); telefonda alt çubuk |
| SummaryDialog | `components/sazbahce/home/SummaryDialog.tsx` | Teklif özeti; yerel `<dialog>`: masaüstünde sağ çekmece, telefonda alt sayfa; paylaş (Web Share / pano) |
| AreasBand, SunsetBand, KnowBand, SplitBand | `components/sazbahce/home/Sections.tsx` | Ana sayfa bantları |
| PlanBase | `components/sazbahce/plan/PlanBase.tsx` | Tohumlu, deterministik kıyı çizimi (zemin + taç katmanı) |
| PlanView | `components/sazbahce/plan/PlanView.tsx` | Plan + yerleşim katmanı + alan seçimi (`<a>` isabet alanları) + kadraj geçişi (rAF, viewBox) |
| Reading | `components/sazbahce/plan/Reading.tsx` | Okuma kutusu: yerleşim özeti ya da uyarı + tek tıkla alan değişimi |
| Calendar | `components/sazbahce/ui/Calendar.tsx` | Ay takvimi, günde 4 alan noktası, "Örnek doluluk" |
| summary.ts | `components/sazbahce/ui/summary.ts` | Özet satırları, paylaşım metni |
| CorporatePlanner | `components/sazbahce/pages/CorporatePlanner.tsx` | Kurumsal: alan × düzen × kişi, yakın kadraj |
| RequestFlow | `components/sazbahce/pages/RequestFlow.tsx` | Teklif: 5 adım + özet, doğrulama (ad soyad, 5xx telefon) |
| Appointment, RegionMap | `components/sazbahce/pages/Visit.tsx` | Ziyaret randevusu (gönderilmez), şematik bölge haritası |
| PlanWith | `components/sazbahce/pages/PlanWith.tsx` | Seçimi ortak plana yazıp sayfa açar |
| Header/Strip, Footer, Mark, NotFound | `components/sazbahce/shell/` | Üst şerit, menü, künyeli alt bilgi, 404 |
| lib | `lib/sazbahce/{venue,plan,assess,availability,sun,store}.ts(x)` | Mekân verisi, yerleşim algoritmaları, uygunluk, NOAA güneş hesabı, oturum durumu (sessionStorage) |

## Hareket envanteri
| An | Tetikleyici | Süre / eğri | Azaltılmış hareket |
|---|---|---|---|
| Masaların yerleşmesi (odak an) | tören, misafir, alan değişimi; yalnız yeni masalar | 500 ms `--sb-out`, ölçek .2→1 + opaklık, 14 ms kademe (28'de döner) | animasyon yok, anında yerinde |
| Alan geçişi | alan seçimi (plan, çubuk, uyarı düğmesi) | viewBox 600 ms ease-out-quart; fotoğraf kartı 220 ms çapraz geçiş | anında yeni kadraj, geçişsiz fotoğraf |
| Özet çekmecesi / alt sayfa | "Teklif özetini gör", "Özet" | 420 ms `--sb-drawer` (`@starting-style`) | geçişsiz |
| Geri bildirim | çip, segment, gün, düğme | 140 ms renk; basışta ölçek .97 | aynı (renk) |
| Alan kartı fotoğrafı hover | "Dört alan" | 600 ms ölçek 1,03 | yok |
Lenis, GSAP yok. Ham `scroll` dinleyicisi yok.

## Ölçümler (2026-10-05, yerel statik derleme `out/`, Playwright Chromium)
| Sayfa | LCP 1440 / 390 | CLS 1440 / 390 | Yatay taşma |
|---|---|---|---|
| Ana sayfa | 0,23 sn / 0,12 sn (görsel) | 0,002 / 0 | yok |
| Alanlar | 0,15 / 0,19 | 0,006 / 0 | yok |
| Kurumsal | 0,12 / 0,12 | 0,001 / 0 | yok |
| Teklif | 0,08 / 0,11 | 0,02 / 0 | yok |
| Ziyaret | 0,09 / 0,08 | 0,001 / 0 | yok |
İlk yük JS (Next, gzip): ana sayfa 130 KB, kurumsal 130 KB, teklif 131 KB, alanlar 120 KB, ziyaret 115 KB (paylaşılan 103 KB). Konsol hatası yok. Lint + build yeşil. Yerel ölçüm; gerçek telefon ölçümü yapılmadı.

## Bilinen borçlar ve kararlar
| Konu | Neden ertelendi | Ne zaman |
|---|---|---|
| Plan, gerçek ölçülü bir rölöveden değil kurgudan çizildi (10 birim = 1 m) | Kurgusal marka | Gerçek müşteride mimari plandan |
| EN metin yok | TR onayı bekleniyor | METIN-ONAY sonrası |
| Gerçek cihaz testi (orta sınıf Android) | Ortam yok | Yayından önce Raşit telefonda bakar |
| Kısa masaüstü ekranlarında (≤ 859 px yükseklik) alan fotoğrafı planın üstüne biniyor | Takvim sütununa sığmıyor | Kabul; kart sol altta, gölün üstünde |
| `next dev --turbopack` worktree'de çalışmıyor (node_modules kavşağı dosya sistemi kökü dışına işaret ediyor) | Turbopack sınırlaması | Geliştirmede `next dev -p 3330` (webpack) kullanıldı |

## Taze göz (bağımsız alt ajan, 2026-10-05)
- Tur 1: 7,37 (T 7,2 · K 7,4 · Y 7,7 · İ 7,1) → DÜZELT. Düzeltilenler: plan etiketleri/pusula sabit ekran boyu + kâğıt hale, kadraj payları, künye çubuğu genişletildi, mobil kadraj göle kaydı, foto kırpımları (çadır çatısı, çıkış tabelası), başlık genişliği 106%, akşam ışığı güçlendi, "Dört alan" mini krokileri, ortak bantta kâğıt kartlar.
- Tur 2: 7,56 (T 7,5 · K 7,5 · Y 7,9 · İ 7,3) → DÜZELT (iki çakışma). İkisi kapatıldı: 1280×720'de alan kartı takvim altına kompakt satır oldu; "Teklif özetini gör" planın üstünden alınıp planın altındaki kendi kâğıt şeridine taşındı. Ajanın notu: "1 ve 2 kapanınca YAYINLA". Son hal yeniden puanlanmadı.
- Kalan: telefonda harita kenarında yarım kalan etiketler ("LÜ"), çayır fotoğrafında göl yok (temsilî), Anybody büyük S.

## Cila turu (2026-10-05, Raşit "önce bir cila turu")
- **Alan görselleri:** 9 temsilî stok fotoğraf çıktı; yerine 9 kendi render'ımız geldi: Söğüt Çayırı (geniş + masa yakın), Ağ Ambarı (yuvarlak masa düğün + sunum düzeni + uzun masa), Ceviz Avlusu (geniş + kına masası), İskele (nikâh sıraları + iskele ucu masası). Blender 5.2 Cycles, OptiX, AgX, alan derinliği, OptiX denoise, 1800×1200, 384 örnek. Komut satırından ayrı süreçle (`blender -b --factory-startup -P sazbahce_scene.py -- <mod> <çıktı>`); açık Blender oturumuna (MCP) dokunulmadı. Betik, render'lar, .blend dosyaları: `.tasarim/sazbahce/blender/` (`render_all.sh`, `ph_get.py`). Yerleşim plana göre: göl batıda, pist göl tarafında, masalar doğuya yelpaze; ambar 12×26 m, batı kapısı çayıra; avlu 15,6 m taş duvarlı, ortada ceviz; iskele 17 m + uç platform. Varlıklar: Poly Haven CC0 (sandalye, fener, çay takımı, çimen, dokular); söğüt, ceviz, saz, hasır sandalye, örtüler, ağlar, ambar, ev, karşı kıyı kodla modellendi.
- **Etiket:** her alan görselinin köşesinde "3B canlandırma"; notlar "alan görselleri 3B canlandırmadır".
- **Tipografi kararı:** Anybody yalnız h1, logo, takvim başlığı ve misafir sayacında kaldı. h2/h3, alan adları, menü ve plan/harita etiketleri Onest'e geçti (Anybody'nin büyük S'si küçük harf gibi okunuyor; küçük puntoda Türkçe noktalar kayboluyordu).
- **Doluluk tek kaynaktan:** `daySummary()` (lib/sazbahce/availability.ts). Metin, takvim çizgisi, ekran okuyucu etiketi, telefon alt çubuğu ve uyarı aynı cevabı veriyor; opsiyonlu ayrı yazılıyor. Dolu günde yalnız misafir sayısını alan alanlar öneriliyor.
- **Takvim işaretleri:** boş = dolu nokta, opsiyonlu = yarım, dolu = boş halka (yalnız renge dayanmıyor); 6 px.
- **Plan:** kesik etiketler gizleniyor; okuma kutusu için kadrajın üstünde 64 px pay; ambar/avlu kadrajları sıkılaştı; nikâh düzeninde sandalyeler yönlü çizim + koridor, yakın kadraj.
- **Telefon:** takvim plandan hemen sonra; alt çubukta "2 boş · 1 opsiyonlu"; ilk ekran için ayrı (gün batımı köşesi) kırpım; kurumsal planı yapışkan; ziyaret haritası dar kadraj.
- **1280×720:** kısa ekran düzeni, ilk ekran tek ekrana sığıyor.
- **Bulunan hata:** `ch` birimi yüklenen yazı tipine göre değiştiği için teklif sayfasında font gelince yerleşim kayıyordu (CLS 0,17) → `em` birimine geçildi (CLS 0,017).

### Taze göz (cila turu, her tur yeni bağımsız inceleyici; önceki puan söylenmedi)
- Tur A 7,26 DÜZELT → 1280×720 sığdırma, telefonda takvim öne, alan kadrajları, çip boşlukları, nikâh görünümü, kapasite metni, render pozlama.
- Tur B 7,30 DÜZELT → okuma kutusu boş masa sayısı kapasiteden; plan/harita etiketleri Onest; takvim işaretleri şekille; ambar düğün render'ı; telefon ilk ekran kırpımı.
- Tur C 7,30 DÜZELT → doluluk tek kaynaktan (gerçek hata: opsiyonlu alan bir yerde boş, bir yerde dolu sayılıyordu), çayır render'ı, "3B canlandırma" köşe etiketi.
- Tur D 7,45 DÜZELT → telefon altyazı çakışması, dolu günde kapasiteye göre öneri, kurumsal yapışkan plan, ziyaret haritası dar kadraj.
- Tur D yeniden kontrol: **7,56 YAYINLA** (T 7,3 · K 7,7 · Y 7,9 · İ 7,5).

### Cila sonrası ölçümler (yerel statik derleme)
LCP 1440 / 390: ana 0,14 / 0,11 sn · alanlar 0,16 / 0,23 · kurumsal 0,16 / 0,14 · teklif 0,09 / 0,12 · ziyaret 0,12 / 0,09. CLS ≤ 0,017. Yatay taşma yok, konsol hatası yok. İlk yük JS ana sayfa 131 KB (gzip). Lint + build yeşil.

### Kalan borçlar
| Konu | Neden ertelendi | Ne zaman |
|---|---|---|
| İlk ekran fotoğrafı kış (yapraksız ağaç), sitenin vaadi yaz | Uluabat'ın lisanslı yaz akşamı fotoğrafı bulunamadı; altyazı "bir kış akşamı" diyor | Yaz fotoğrafı ya da Gölyazı render'ı |
| Ana sayfanın alt yarısı (kart ızgarası, kural listesi, iki kartlı bant) kıyı dilinden uzak | Kapsam; mini krokiler eklendi | Sonraki tur: "Dört alan" haritanın kesiti olsun |
| Plandaki söğüt tepeleri nilüfer yaprağına benziyor | Kozmetik | Sonraki tur |
| Söğütler render'da perde gibi, tek tip; sandalyeler tek model | Zaman | Ağaç çeşitliliği, ikinci sandalye modeli |
| Gerçek telefon testi | Ortam yok | Yayından önce |
