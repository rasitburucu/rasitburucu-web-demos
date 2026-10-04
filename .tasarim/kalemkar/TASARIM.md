# TASARIM: Kalemkâr

Yapılmış olandan yazıldı. Sonraki değişiklikler bu dosyaya uyar ya da dosyayı günceller.

- Son güncelleme: 2026-10-04 (cila turu 2) · Yerel: `http://localhost:3310/web/kalemkar/` · Canlıda değil (worktree `demo/kalemkar`, commit yok)

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
| easing | `--kk-out` (0.16,1,0.3,1) · `--kk-io` (0.77,0,0.175,1) · `--kk-drawer` (0.32,0.72,0,1) · `--kk-scroll` (0.45,0,0.2,1) | `--kk-scroll` yalnız kaydırmaya bağlı yolculukta (sininin uçuşu) |
| süre | `--kk-t-fast` 140ms · `--kk-t-state` 220ms · `--kk-t-step` 380ms · `--kk-t-layout` 520ms · `--kk-t-serve` 980ms | basma/renk · küçük durum, menü · adım ve sayfa girişi · FLIP, ilerleme çizgisi · tabak gelişi |
| radius | çip/düğme 999px · alan 10px · panel 14px | |
| tip | Young Serif 400 (`clamp(2.6rem,5.4vw,5.6rem)` h1, `clamp(1.95rem,3.4vw,3.2rem)` h2) · Geologica 330/500, 17px gövde | |

Tarayıcı yüzeyleri: `::selection` fıstık, `caret-color` fıstık, `scrollbar-color`, `:focus-visible` 2px fıstık + 3px boşluk, `color-scheme: dark`, SVG favicon (`icon.svg`, kazıma rozeti), OG görseli (`opengraph-image.jpg`).

## Bileşen envanteri
| Bileşen | Dosya | İş |
|---|---|---|
| Sini | `components/kalemkar/sini/Sini.tsx` | Tek nesne: hero (dönen kazıma yazı + imleç parıltısı), serve (tabak katmanı), table (kuverler, alerji işareti, tabak sayısı noktaları, tezgâh tepsisine dönüşme) |
| SentenceForm | `components/kalemkar/home/SentenceForm.tsx` | İlk ekranda "[kişi] için [akşam] akşamı" + bu haftanın boş oturumları |
| Servis | `components/kalemkar/home/Servis.tsx` | Girişten servise tek sini (kaydırma güdümlü CSS; JS yalnız iki kutuyu ölçer), metin solda / sini sağda yapışkan, 9 tabak servisi (IntersectionObserver + Web Animations API); uçuş olmayan yerde saydamlıkla el değiştirme |
| PageTransitions | `components/kalemkar/shell/PageTransitions.tsx` | Aynı belge View Transitions: iç bağlantılarda sayfa geçişi, görünen sini `kk-sini` adıyla yeni sayfadaki siniye dönüşür |
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
| Sininin uçuşu (giriş → servis) | kaydırma, 0 → sahnenin yapışkan olduğu nokta | iki katman: `.kk-fly` kaydırmayı doğrusal iptal eder, `.kk-fly-path` giriş kutusundan sahne kutusuna `--kk-scroll` ile taşır; gölge yolun ortasında kalkar (7%/10% kayma, %72) ve inişte sıkılaşır. Yalnız ≥768px, `animation-timeline` destekli tarayıcı | uçuş yok; servis sinisi ekrana girince giriş sinisi saydamlıkla çekilir, aynı anda iki sini görünmez |
| Tabak servisi | blok ekran ortasına gelince | geliş 980 ms `--kk-out` (sağ üstten, 16° dönüş, gölge sıkılaşır), kalkış 560 ms `--kk-io`, saydamlık sürenin %62'sinde biter (bakırdan çıkmadan kaybolur); geri kaydırınca yön ters; yarıda kesilirse bulunduğu yerden devam | 160 ms saydamlık geçişi |
| Sayfa geçişi | iç bağlantı (kat planı hariç) | eski sayfa 160 ms solar, yeni sayfa 380 ms `--kk-out` 8px yükselir; sini 640 ms (0.65,0,0.35,1) yer ve boy değiştirir | 120 ms saydamlık |
| Rezervasyon adımı | İleri / Geri / adım adı | yeni adımın parçaları 12px yandan (ileri: sağdan, geri: soldan) 380 ms `--kk-out`, 30 ms kademe; üstte ilerleme çizgisi `scaleX(adım/6)` 520 ms | 120 ms saydamlık; çizgi anında |
| Mobil rezervasyon sinisi | kişi, oda ya da alerji değişince | 112 → 180 px, 380 ms `--kk-out`, 2 sn sonra geri | anında |
| Mobil menü | Menü düğmesi | `@starting-style`: 220 ms solma + 10px iniş `--kk-drawer`; kapanış 160 ms | anında |
| Mobil alt çubuk | ana sayfada giriş cümlesi ekrandan çıkınca | 300 ms `--kk-drawer` alttan gelir | anında |
| Kuverlerin yer değiştirmesi | kişi sayısı / deneyim değişimi | FLIP 560 ms `--kk-out`, kuver başına 18 ms kademe; yeni kuver 460 ms ölçek+saydamlık | 120 ms saydamlık |
| Sini → tezgâh tepsisi | deneyim "tezgâh" | yuvarlak sini scaleY .34 + solma 520 ms `--kk-io`; tepsi scaleX .42→1, 640 ms `--kk-out` | anında |
| Çip, düğme, gün, alan | hover (yalnız ince imleç) / basma | 140 ms renk; basmada düğme .97, çip .96, gün .94 | renk aynı, ölçek yok |

GSAP, Lenis ve Framer Motion bu demoda yüklenmiyor; bütün hareket CSS + Web Animations API.

## Ölçümler (2026-10-04, `next build` + eklentinin `dogrula.py`'si, yerel statik sunucu)
| Ölçüt | Değer |
|---|---|
| İlk yük JS (Next raporu, gzip) | ana sayfa 126 KB, rezervasyon 130 KB, menü 107 KB, özel davet 114 KB (cila turu 2 sonrası; GSAP yok) |
| LCP (laboratuvar) | masaüstü 220 ms, mobil 168 ms (öğe: sini görseli) |
| CLS | masaüstü 0,0019, mobil 0 |
| Konsol hatası | 0 |
| Mobil yatay taşma | yok |
| Türkçe glif | tam (tek font) |
| Azaltılmış hareket | "respects" |
| Görseller | sini 1100 px AVIF 98 KB; tabaklar "evin tabağı"na oturtulmuş 1000 px kaynak, 360/640/960 AVIF: tabak başına 16–24 / 40–60 / 67–104 KB (önceki 26–124 KB bandının içinde) |

## Bilinen borçlar ve kararlar
| Konu | Neden ertelendi | Ne zaman |
|---|---|---|
| Firefox'ta sininin uçuşu yok | `animation-timeline` Firefox kararlı sürümde yok; orada iki sini saydamlıkla el değiştirir (bilgi kaybı yok) | Firefox desteği gelince kendiliğinden |
| Sayfa geçişi Chromium ve Safari 18+'da | View Transitions; diğerlerinde normal geçiş | - |
| Tabaklar hâlâ dokuz ayrı fotoğrafçının yemeği | Yemek kısmı tek tabağa oturtuldu, renk ve ışık eşitlendi; yemeklerin kendi çekim açıları farklı | gerçek müşteride tek çekim günü |
| Salon fotoğrafı stok bir kemerli taş oda (pencereden kaya görünüyor) | Karlı kapı kırpıldı, gölgeler açıldı; Gaziantep taş ev iç mekânı açık lisanslı bulunamadı (arama aracı bu oturumda kullanılamadı) | daha iyi kare bulununca |
| Şef bölümünde gerçek şef fotoğrafı yok | Stok "çorbaya süs koyan aşçı" karesi Antep'e ait değildi; yerine kendi sini render'ımız + iki tabakla kompozisyon | gerçek müşteride şef çekimi |
| Mobil rezervasyon sinisinin büyümesi bir yerleşim geçişi (sütun genişliği) | Seyrek ve küçük alan; dönüşümle yapılırsa şerit yüksekliği atlar | izlenecek |
| 404 tasarımı `/web/kalemkar/404/` adresinde; bilinmeyen alt yolların buraya düşmesi ana sitenin yönlendirmesine bağlı | Statik dışa aktarım iç içe not-found üretmez; bu repoda çözülemez | yayın sırasında (ana site kuralı) |
| EN sürüm yok | Önce TR metin onayı | Raşit onayından sonra |
| Gerçek telefonda his testi yapılmadı | Ekran görüntüleri başsız Chromium'dan | yayından önce |
| Tezgâh görünümünde sini kutusu kare kalıyor, altında boşluk | Kare kutu yerleşim kaymasını önlüyor | sonraki tur |
| Taze göz turu 1 (2026-10-04): 7,35 / DÜZELT | Düzeltildi | - |
| Taze göz turu 2 (cila öncesi): 7,41 / DÜZELT | Bu turda düzeltilenler: tek sini, tabak seti, sayfa ve adım geçişleri, odak halkası, mobil şerit, mobil alt çubuk, kuverler, takvimde "dolu" deseni, kat planı etiketleri, alerjen yazımı, karlı salon karesi, çift sayaç | - |
