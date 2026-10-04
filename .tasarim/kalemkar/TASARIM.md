# TASARIM: Kalemkâr

Yapılmış olandan yazıldı. Sonraki değişiklikler bu dosyaya uyar ya da dosyayı günceller.

- Son güncelleme: 2026-10-04 · Yerel: `http://localhost:3310/web/kalemkar/` · Canlıda değil (worktree `demo/kalemkar`, commit yok)

## Kullanılan tokenlar (`app/kalemkar/kalemkar.css`, `.kk-root`)
| Token | Değer | Kullanım |
|---|---|---|
| `--kk-bg` | #17130F | zemin, `theme-color`, kaydırma çubuğu izi |
| `--kk-surface` / `--kk-surface-2` | #211B16 / #2C241D | şef bölümü, alanlar / açılış bölümü, notlar, şerit |
| `--kk-ink` / `-2` / `-3` | #EEE5D6 / #B3A794 / #8A7F6F | metin rolleri |
| `--kk-line` / `-2` | rgba(238,229,214,.14 / .26) | çizgiler, çip çerçevesi |
| `--kk-accent` | #9DB26A | seçili durum, ana eylem, alerji işareti, "örnek" etiketi, seçim, odak |
| `--kk-warn` | #E0B36A | uyarı notu kenarı, 31 Aralık işareti |
| `--kk-copper` | #C9794A | yalnız logo rozeti ve harita halkaları (render'daki bakırdan örneklendi) |
| easing | `--kk-out` (0.16,1,0.3,1) · `--kk-io` (0.77,0,0.175,1) · `--kk-drawer` | |
| radius | çip/düğme 999px · alan 10px · panel 14px | |
| tip | Young Serif 400 (`clamp(2.6rem,5.4vw,5.6rem)` h1, `clamp(1.95rem,3.4vw,3.2rem)` h2) · Geologica 330/500, 17px gövde | |

Tarayıcı yüzeyleri: `::selection` fıstık, `caret-color` fıstık, `scrollbar-color`, `:focus-visible` 2px fıstık + 3px boşluk, `color-scheme: dark`, SVG favicon (`icon.svg`, kazıma rozeti), OG görseli (`opengraph-image.jpg`).

## Bileşen envanteri
| Bileşen | Dosya | İş |
|---|---|---|
| Sini | `components/kalemkar/sini/Sini.tsx` | Tek nesne: hero (dönen kazıma yazı + imleç parıltısı), serve (tabak katmanı), table (kuverler, alerji işareti, tabak sayısı noktaları, tezgâh tepsisine dönüşme) |
| SentenceForm | `components/kalemkar/home/SentenceForm.tsx` | İlk ekranda "[kişi] için [akşam] akşamı" + bu haftanın boş oturumları |
| Servis | `components/kalemkar/home/Servis.tsx` | Yapışkan sini + 9 tabak servisi (IntersectionObserver + Web Animations API) |
| FloorPlan | `components/kalemkar/home/FloorPlan.tsx` | Tepeden kat planı; alan seçimi, rezervasyona deneyimle geçiş |
| Chef, Know, Opening | `components/kalemkar/home/Sections.tsx`, `Opening.tsx` | Şef, açılır kurallar, aylık açılış geri sayımı |
| Flow | `components/kalemkar/flow/Flow.tsx` | 6 adımlı rezervasyon, ödeme ara ekranı (`<dialog>`), onay + .ics + mailto |
| Calendar, Waitlist, Invite, kit | `components/kalemkar/flow/*` | Takvim, bekleme listesi dalı, özel davet formu, alan/çip/fiyat parçaları |
| Header, MobileBar, Footer, Strip, NotFound | `components/kalemkar/shell/*` | Kabuk, konsept şeridi, 404 |
| availability, store, format, ics | `lib/kalemkar/*` | Doluluk simülasyonu ve kurallar, oturum durumu (kişisel veri yalnız bellekte), TR biçimleme, takvim dosyası |

## Hareket envanteri
| An | Tetikleyici | Süre / easing | Azaltılmış hareket |
|---|---|---|---|
| Kazıma yazının belirmesi | ilk yükleme (hero) | 2,6 sn, `--kk-out`, stroke-dasharray | doğrudan tam görünür |
| Kazıma yazının dönmesi | görünürken | 120 sn/tur, linear; ekran dışında duraklar | dönmez |
| İmleç parıltısı | `pointermove` (yalnız ince imleç) | lerp 0,12 / kare, rAF yalnız hareket varken | sabit |
| Tabak servisi | blok ekran ortasına gelince | geliş 980 ms `--kk-out` (sağ üstten, 16° dönüş, gölge sıkılaşır), kalkış 620 ms `--kk-io`; geri kaydırınca yön ters; yarıda kesilirse bulunduğu yerden devam | 160 ms saydamlık geçişi |
| Kuverlerin yer değiştirmesi | kişi sayısı / deneyim değişimi | FLIP 560 ms `--kk-out`, kuver başına 18 ms kademe; yeni kuver 460 ms ölçek+saydamlık | 120 ms saydamlık |
| Sini → tezgâh tepsisi | deneyim "tezgâh" | yuvarlak sini scaleY .34 + solma 520 ms `--kk-io`; tepsi scaleX .42→1, 640 ms `--kk-out` | anında |
| Çip, düğme, alan | hover/basma | 140 ms renk; basmada scale .98 | aynı (renk) |

GSAP, Lenis ve Framer Motion bu demoda yüklenmiyor; bütün hareket CSS + Web Animations API.

## Ölçümler (2026-10-04, `next build` + eklentinin `dogrula.py`'si, yerel statik sunucu)
| Ölçüt | Değer |
|---|---|
| İlk yük JS (Next raporu, gzip) | ana sayfa 126 KB, rezervasyon 129 KB, menü 107 KB, özel davet 114 KB |
| LCP (laboratuvar) | masaüstü 220 ms, mobil 168 ms (öğe: sini görseli) |
| CLS | masaüstü 0,0019, mobil 0 |
| Konsol hatası | 0 |
| Mobil yatay taşma | yok |
| Türkçe glif | tam (tek font) |
| Azaltılmış hareket | "respects" |
| Görseller | sini 1100 px AVIF 98 KB; tabaklar 360/640/960 AVIF 26–124 KB |

## Bilinen borçlar ve kararlar
| Konu | Neden ertelendi | Ne zaman |
|---|---|---|
| Tabak fotoğrafları farklı fotoğrafçılardan, tabak seramikleri farklı | Tek fotoğrafçılı tutarlı set bulunamadı; renk eşitleme ve daire kırpma ile birleştirildi. Gerçek müşteride tek çekim günü | gerçek müşteri |
| Firik ve humus karelerinde tabak kenarı kadraj dışında | Kaynak fotoğraf öyle | daha iyi kare bulununca |
| 404 tasarımı `/web/kalemkar/404/` adresinde; bilinmeyen alt yolların buraya düşmesi ana sitenin yönlendirmesine bağlı | Statik dışa aktarım iç içe not-found üretmez | yayın sırasında (ana site kuralı) |
| EN sürüm yok | Önce TR metin onayı | Raşit onayından sonra |
| Gerçek telefonda his testi yapılmadı | Ekran görüntüleri başsız Chromium'dan | yayından önce |
| Giriş sinisi ile servis sinisi iki ayrı nesne (taze göz bulgusu 3) | Sürekli tek nesne için girişten servise uçan bir geçiş gerekir; maliyetli, Raşit'in imza önceliğine göre | onaydan sonra |
| Tezgâh görünümünde sini kutusu kare kalıyor, altında boşluk | Kare kutu yerleşim kaymasını önlüyor | cila turu |
| Taze göz turu (2026-10-04): 7,35 / DÜZELT | Düzeltilenler: ana düğme kontrastı (CSS özgüllük hatası), tabak kenarı + gölge, mobil servis, mobil alt çubuk, takvimde "az kaldı" işareti, ’ kesme işareti, kısa adım adları | - |
