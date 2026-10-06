# TASARIM: Gelidonya Sera ve Fidelik (v2)

Koddan, gerçekten kullanılan değerlerden yazıldı. v1 (Viyol Masası) belgesi `TASARIM-v1.md`.

- Son güncelleme: 2026-10-06 (v2 yeniden yapım) · Çalışma kopyası `rasitburucu-web-demos-wt/gelidonya` (dal `gelistir/gelidonya-v2`, commitsiz) · Yerel: `npx next dev -p 3340` → http://localhost:3340/web/gelidonya/ · Yayın: Raşit'te (sync:site + deploy).

## Sayfalar
| Rota | İş |
|---|---|
| `/web/gelidonya/` | İlk ekran (Ara, WhatsApp, hazır fide kapısı "4 HAZIR · 2 BOYLU", fidelik render'ı, fide hesabı) · bu hafta tezgâhta (5 satır) · sipariş nasıl işler (4 adım + kâğıt sipariş formu, hesabın değerleri forma yazılır) · kendi seramız (ova bandı) · ürün kapısı + takvim · fidelik nerede |
| `/hazir-fide/` (yeni) | Süzülebilir liste (ürün, aşı, viyol, hazır; sıra Hazır → Boylu → Hazır olacak), her satırda "Bu fideyi sor", yazdır, CSV indir, "Son güncelleme: 6 Ekim 2026 [örnek liste]"; telefonda süzgeç tek düğmeye katlanır |
| `/fidelik/` | Ziyaret render'ı (tezgâh geçidi) · fide üretici belgesi [örnek] · ürün tablosu (aşı, gövde, viyol, süre, dekara tepe, dayanak) · aşılı/aşısız plakası · anaç · viyol tipleri · sipariş ve teslim (#siparis: 4 adım + örnek sipariş formu, ne kadar önce, bayi/kooperatif tablosu, teslim alırken) · dikimden sonraki ilk hafta |
| `/seralarimiz/` | Ova render'ı (küçültüldü, 8:3) · kışın domates (metin) · topraksız tarım + torba kesiti · fidelik de buradan çıkar (takvim ürün sayfasında) |
| `/urunlerimiz/` | Başlıkta "Fiyat ve hasat takvimi iste" + ihracat hattı · ürün ve ambalaj tablosu [örnek] + ambalaj ve yükleme plakası (Euro palet, koli, şale) · yükleme · alıcının istediği belgeler [örnek] · 12 aylık tedarik takvimi · ihracat sorumlusu + "Fiyat ve hasat takvimi iste" formu (#talep, gönderilmez) |
| `/iletisim/` | Santral + üç görev kartı (sipariş-sevkiyat, ziraat mühendisi, ihracat) · OSM haritası (Yakın / Bölge) + adres, teslim noktası, "gelmeden önce arayın", saatler. Ziyaret randevusu formu kaldırıldı (sahada seracı arar ve gelir) |

## Tokenlar (`app/gelidonya/gelidonya.css`, `.gd-root`)
| Token | Değer | Kullanım |
|---|---|---|
| `--gd-bg` / `--gd-surface` | `#f3f4f1` / `#fff` | zemin / tablo, form, kart |
| `--gd-ink` / `--gd-ink-2` | `#111311` / `#454a44` | metin, 2 px kenarlar, koyu bant / ikincil metin |
| `--gd-bench` / `--gd-bench-2` | `#bec2bb` / `#9ea39b` | ince çizgiler |
| `--gd-green` | `#3f8f1f` | yalnız "Hazır" durumu, hesapta fide sayısı imi, liste kapısında hazır imi, haritada fidelik |
| `--gd-focus` | `#235a0e` | 3 px odak halkası, caret |
| `--gd-tomato` | `#b3261e` | hata, 404, çizimde tepe kesimi, sipariş formunun seri numarası |
| tükenmez mavisi | `#23408e` | yalnız sipariş formuna yazılmış değerler (`.gd-ink-blue`); değer değişince 900 ms açık mavi zemin sönümü (azaltılmış harekette yok) |
| `--gd-max` | `90rem` | içerik azami genişliği |
| `--gd-side` | `max(gutter, (100cqw − max)/2 + gutter)` | sayfa kenarından içerik sütununa uzaklık; `.gd-root` boyut kapsayıcısı (`container-type: inline-size`), kaydırma çubuğundan etkilenmez |
| `--gd-gutter` | `clamp(1rem, 3.2vw, 3rem)` | |
| Kök yazı | 100 % · ≥1800 px 106,25 % · ≥2300 px 118,75 % | rem ile verilen her şey (tip, boşluk, düğme) birlikte büyür |
| Tip | h1 `clamp(2.4rem, 1.6rem + 2.6vw, 4.25rem)`, ilk ekranda `clamp(2.4rem, 1.2rem + 2.6vw, 5rem)` (1100–1279: 2.6rem; ≤767: `clamp(2rem, 1.2rem + 3.6vw, 2.6rem)`); h2 `clamp(2rem, 1.5rem + 1.7vw, 3.25rem)`; gövde 1.0625rem | Big Shoulders Display 800 büyük harf + Schibsted Grotesk |
| Bölüm boşluğu | `clamp(3.5rem, 2rem + 4vw, 7rem)` | |
| Başlık çubuğu | şerit 2rem + başlık 4.5rem (≤599: 3.75rem) | |

## İlk ekran düzeni
- ≥1100 px: ızgara `calc(var(--gd-side) + clamp(25rem, 38cqw, 40rem)) | 1fr`; render sol kenarı bu çizgide, sağ kenara kadar (`object-position 62% 45%`); panel dikeyde ortalı; hesap kartı ikinci sütunda alta yaslı, genişlik `min(35rem, 100% − 2×kenar)`, sonuç rakamları 1.875rem, formül üç satır, altında "Sipariş formunda gör", üst boşluk `clamp(6rem, 18vh, 20rem)`. Yükseklik `min(100svh − üst, 76rem)`.
- 900–1099: render bant (`clamp(10rem, 30vw, 20rem)`), panel iki sütun (metin+düğmeler | liste kapısı), hesap kartı tam genişlik.
- ≤767: render bandı `clamp(8.5rem, 34vw, 14rem)` (dar kırpım), tek sütun, Ara + WhatsApp yan yana (≤379 alt alta), hesap 2 sütun; h1 için 3 satır yer ayrılır (≤479, yazı değişiminde kayma yok).
- Hesap: 12 sütunlu form (ürün 4, dönüm 4, aşı 4 | gövde 3, viyol 3, dikim haftası 6). Hafta seçimi yerel `<select>` (kayan çip yok). Tek gövdeli ürünlerde "Çift" devre dışı, açıklama sabit yerde. Formül ve not için en uzun hâlin satır yüksekliği ayrılır (masaüstünde 2, telefonda 3–4 satır).

## Bileşenler
| Bileşen | Dosya | İş |
|---|---|---|
| `Hero`, `Hesap` | `components/gelidonya/home/` | İlk ekran; hesap `lib/gelidonya/hesap.ts` (`calc`: fide = ⌈dönüm × dekara tepe ÷ gövde⌉, viyol = ⌈fide ÷ göz⌉, ekim = dikim − süre) |
| `HazirOnizleme`, `SurecSection`/`Surec`, `Kendi`, `Sezon`, `UrunKapisi`, `Ziyaret` | `home/Sections.tsx` | Ana sayfa bölümleri; `Surec` Fidelik'te de |
| `HazirTablo` | `ui/HazirTablo.tsx` | Liste tablosu; ≤1099 px kart (600–1099 iki sütun), durum imi, satır mesajı |
| `HazirListe` | `pages/HazirListe.tsx` | Süzgeç (yerel select, sabit ızgara, sonuç sayısı `aria-live`), boş durum, yazdır, CSV |
| `Harita` | `pages/Harita.tsx` + `content/gelidonya/map-geo.json` | OSM'den SVG; Yakın (10 km, 16:10; telefonda 6,2 km, 4:5) / Bölge (126 km; telefonda 84 km); ölçek değişimi 600 ms (azaltılmış harekette anında); atıf; Google/Apple/OSM bağlantıları |
| `TorbaKesiti`, `AsiKarsilastirma`, `AmbalajPlakasi` | `ui/Cizimler.tsx` | Numaralı plakalar; açıklama HTML listede; torba boyuna kesitinin telefonda dar kırpımı |
| `SiparisFormu` | `ui/SiparisFormu.tsx` + `lib/gelidonya/hesap-ctx.tsx` | Kâğıt sipariş formu (No 0412 [örnek]); ana sayfada `HesapProvider` ile hesap kartının değerlerini yazar, Fidelik'te örnek değerlerle |
| `WaProvider`, `WaButton` | `shell/Wa.tsx` | Her WhatsApp düğmesi `<dialog>` açar: hazır mesaj, "Metni kopyala", demo notu. Gerçek `wa.me` yok |
| `MobileBar` | `shell/MobileBar.tsx` | ≤899: Ara · WhatsApp · Yol tarifi; ilk ekran düğmeleri ve alt bilgi görünürken, menü açıkken gizli |
| `AliciFormu`, `RandevuFormu` | `pages/` | Gönderilmeyen formlar, özet kartı |

## Betikler
- `scripts/fetch-gelidonya-map.mjs`: Overpass → `content/gelidonya/map-geo.json` (ham önbellek `scripts/.raw/gelidonya/`, git dışı; `--fetch` ile yeniden indirir). Fidelik işareti 36.3372 K 30.3058 D (kurgusal, kontrol notu betikte).
- `scripts/process-gelidonya-images.mjs`: render → AVIF/WebP (viyol kareleri bölümü çıkarıldı).

## Ölçümler (statik çıktı, ana sitenin CSP başlıklarıyla yerel sunucu, Playwright Chromium, kısma yok, 2026-10-06)
| Sayfa | LCP 1440 / 390 | CLS 1440 / 390 | Aktarım (sıkıştırmasız, alt sınır) |
|---|---|---|---|
| ana | 0,19 / 0,17 sn (render) | 0,005 / 0,001 | ~1,26 MB / 0,85 MB |
| hazir-fide | 0,13 / 0,12 sn | 0,005 / 0 | ~1,18 / 0,81 MB |
| fidelik | 0,20 / 0,18 sn | 0,001 / 0 | ~1,42 / 1,00 MB |
| seralarimiz | 0,17 / 0,16 sn | 0,001 / 0 | ~1,42 / 1,19 MB |
| urunlerimiz | 0,16 / 0,15 sn (metin) | 0,004 / 0 | ~1,21 / 0,89 MB |
| iletisim | 0,16 / 0,19 sn | 0,001 / 0 | ~1,32 / 0,91 MB |
İlk yük JS (Next raporu): ana 122 KB, alt sayfalar 107–122 KB, iletişim 165 KB (harita verisi ~50 KB). Etkileşim denetimi (`etk.py`): hesapta 6 ürün × aşı, 250 dönüm ve son hafta seçiminde kart, sonuç ve sonraki bölüm konumu sabit (1440, 1100, 390, 2560); liste süzgecinde kutu ve tablo konumu sabit; WhatsApp penceresi açılır, kopyalar, Esc ile kapanır. Konsol hatası, CSP ihlali, dış istek: yok (`kk6.py`). Yatay taşma: 390/600/768/900/1100/1440/1920/2560 hepsinde 0.

## Bilinen borçlar
| Konu | Neden | Ne zaman |
|---|---|---|
| EN (ihracat sayfası) ve RU yok | TR önce; rapor EN'yi öneriyor | TR onayından sonra |
| OSM'de Kumluca seralarının çoğu işaretli değil; yakın haritada sera dokusu az | Uydurma çizmek yerine yalnız OSM verisi | Gerçek müşteride kendi sera parselleri çizilebilir |
| Hazır fide listesi statik örnek | Demo; gerçek firmada bir tablo ya da paylaşılan veri kaynağı gerekir | Müşteri işinde |
| Ova render'ı hâlâ orta kalite | Küçültüldü (8:3; Seralarımız başlığı ve ana sayfa bandı) | Gerekirse yeni render |
| Sera içi (domates koridoru) render'ı siteden çıktı | Taze göz: yapraklar domates yaprağı gibi okunmuyor, cam seraya benziyor | Plastik örtülü Kumluca serası + parçalı domates yaprağıyla yeni render, ya da gerçek fotoğraf |

## Taze göz (2026-10-06, üç bağımsız ajan, her biri önceki puanı bilmeden)
| Tur | Puan | Karar | Ana bulgular ve yapılan |
|---|---|---|---|
| 1 | 6,9 | DÜZELT | Sera render'ında yaprak domates yaprağı değil → ilk ekran fidelik render'ına geçti; aynı koridor görseli 4 yerde → 0; sipariş formu nesnesi yok → kâğıt sipariş formu (hesap değerlerini yazar); ürün sayfasında alıcı çağrısı yok → başlıkta çağrı + ihracat hattı; "Sorun" → "Arayın ya da yazın"; hazır tarihleri tutarsız → düzeltildi; ziyaret randevusu formu kaldırıldı |
| 2 | 7,1 | DÜZELT | Ürün sayfasındaki sera render'ı → ambalaj ve yükleme plakası; hesap–form bağı görünmüyor → "Sipariş formunda gör" + mürekkep sönümü; hesap kartı ağır → 35rem, rakamlar 1.875rem, kapı "4 HAZIR · 2 BOYLU"; araştırma sesi metinden çıktı; telefonda süzgeç katlandı; bölüm çizgileri 1 px |
| 3 | 7,0 | DÜZELT | (puanlatma turu sınırı doldu; ucuz olanlar uygulandı) başlık satır aralığı 0,95 → 1,04 (İ/Ğ çarpması); Fidelik'te formun "2. nüsha" sarı kopyası, farklı örnek sipariş; künye açılır işareti; mikro kusurlar |
Hedef 7,5'e ulaşılmadı (6,9 → 7,1 → 7,0; ajanlar arası oynama ±0,2). Üç ajanın ortak kalan eleştirisi: sayfa iskeleti kurumsal kalıp, beklenmedik bir "an" yok; telefonda ambalaj plakası küçük; Seralarımız ince (tesis planı, sezon cetveli önerildi); ova render'ı bir ajana göre klişe, diğerine göre güçlü.
