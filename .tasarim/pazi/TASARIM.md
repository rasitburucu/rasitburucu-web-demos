# TASARIM: Pazı Robotik

İnşadan sonra, kodda gerçekten kullanılan değerlerden yazıldı. Sonraki değişiklikler bu dosyaya uyar ya da dosyayı günceller.

- Son güncelleme: 2026-10-04 · Yayın adresi (planlanan): `rasitburucu.com/web/pazi/` · Worktree: `rasitburucu-web-demos-wt/pazi` (branch `demo/pazi`, commitsiz)

## Kullanılan tokenlar (kodda geçen gerçek değerler)

`app/pazi/pazi.css` → `.pz-root`

| Token | Değer | Rol |
|---|---|---|
| `--pz-floor` | `#d6d7d1` | sayfa zemini (epoksi beton); `theme-color` |
| `--pz-floor-lo` / `--pz-floor-hi` | `#c7c8c1` / `#dfe0da` | hover, şerit zemini |
| `--pz-panel` | `#ecece6` | föy kâğıdı, plaka, form paneli |
| `--pz-ink` | `#151615` | metin, çizgi, HMI ve güvenlik bloğu |
| `--pz-ink-2` / `--pz-ink-3` | `#4a4d48` / `#6a6d67` | ikincil metin (zeminde 7:1 ve 4,9:1) |
| `--pz-line` / `--pz-line-soft` | `#9fa199` / `#bfc0b9` | ölçü ve ayırıcı çizgi |
| `--pz-yellow` | `#f5a800` | RAL 1003: aktif durum, güvenlik bölgesi, ana eylem |
| `--pz-stop` | `#b3321f` | form hatası |
| `--pz-on-ink` / `--pz-on-ink-2` | `#ecece6` / `#a9aba4` | koyu blok üstünde metin |
| lamba | `#5fd38a` / sarı / `#e0533b` | HMI durum (uygun / yetişmiyor / özel proje) |

Tipografi: `Pazi Archivo` (değişken, `font-stretch` 100–125%, ağırlık 600–880) ve `Pazi Mono` (Martian Mono, `font-stretch` 87,5%). Dosyalar `public/pazi/fonts/` (latin + latin-ext, `unicode-range` ile), ikisi `preload`. Ölçek: gösterim `clamp(2.45rem, 5vw, 5.6rem)` satır 0,9; h2 `clamp(2rem, 4.2vw, 4rem)`; gövde 1,0625rem. Model adı `clamp(5rem, 14vw, 13rem)`.

Radius 2px (her şey). Easing `--pz-ease: cubic-bezier(0.16,1,0.3,1)`, `--pz-move: cubic-bezier(0.77,0,0.175,1)`. Odak halkası: 3px grafit + 6px sarı gölge. `::selection` grafit üstüne sarı. Kaydırma çubuğu grafit/beton.

## Bileşen envanteri

| Bileşen | Dosya | İşi |
|---|---|---|
| Hesap çekirdeği | `lib/pazi/plan.ts` | kat planı (sütun/örgü/fırıldak), istif, model uygunluğu, kapasite, geri ödeme, doğrulama, güvenlik bölgeleri |
| Adres ↔ yapılandırma | `lib/pazi/url.ts` | yalnız ürün/hat/palet/geri ödeme sayıları; kişisel veri yok |
| Store | `lib/pazi/store.ts` | `useSyncExternalStore`; motor doğrudan abone olur |
| Kalite kademesi | `lib/pazi/tier.ts` | atölye modülü; `yok`/`dusuk` → vektör çizim |
| 3B motor | `components/pazi/cell/engine.ts` | three.js (R3F'siz): ışık, zemin, yerleşim, al-bırak simülasyonu, çift istasyon, konveyör kuyruğu, operatör işareti, kamera açıları |
| Robot | `components/pazi/cell/robot.ts` | 6 eksenli cobot (prosedürel), analitik IK, tutucular (vakum/çift vakum/torba pençesi), sabit ayak / asansör kolonu, hortum |
| Malzemeler | `components/pazi/cell/materials.ts` | canvas ile üretilen beton, karton, torba, shrink, ahşap, bant, etiket |
| Hücre kabı | `components/pazi/cell/Cell.tsx` | WebGL/vektör kararı, three.js'i ilk boyamadan sonra yükler, dar ekranda ortalar |
| Vektör hücre | `components/pazi/cell/IsoCell.tsx` | aynı plandan izometrik SVG (yedek + föy) |
| HMI şeridi | `components/pazi/cell/Hmi.tsx` | model, kat, koli/kat, gerekli, kapasite, durum; görünüm/zaman/durdur |
| Ana sayfa | `components/pazi/home/*` | Hero (plaka), Steps (kat kat), Models (föy tablosu), Safety (plan), Scenarios, Savings, Trial (atölye çizimi), Service |
| Fizibilite | `components/pazi/flow/Flow.tsx` | 6 adım, canlı önizleme, mailto, kopyala, yazdır |
| Föyler | `app/pazi/modeller/[model]/foy`, `components/pazi/print/FlowSheet.tsx` | A4 yazdırma |
| Çizimler | `ui/Elevation.tsx`, `ui/LayerPlan.tsx`, `home/Workshop.tsx`, `ui/Mark.tsx` | yan görünüş, kat planı, atölye, logo |
| Biz kimiz | `app/pazi/biz-kimiz/`, `components/pazi/about/*` | söküm sahnesi (`scene.ts`, three.js), zaman çizelgesi (`model.ts`), yedek çizim (`Drawing.tsx`), pin + etiketler (`Teardown.tsx`), ilkeler föyü ve atölye notu (`Sections.tsx`) |
| Robot parça listesi | `cell/robot.ts` → `Robot.parts`, `shoulder`, `elbow`, `dims`, `Gripper.adapter` | her mesh bir servis modülüne etiketli; hücre kullanmaz, söküm sahnesi kullanır |

## Hareket envanteri

| An | Tetikleyici | Süre / eğri | Azaltılmış hareket |
|---|---|---|---|
| Al-bırak çevrimi | sürekli (görünürken) | çevrim = `fit().cycleSec`; minimum sarsıntı (10t³−15t⁴+6t⁵), silindirik Bézier "kalk-taşı-in" | döngü yok; palet dolu, robot hazır pozda |
| Palet değişimi | istasyon dolunca | 1,2 sn bekleme, 4,2 sn çıkış, 3,4 sn giriş | yok |
| Ön dolum | yapılandırma değişince | ürün başı 12 ms kademe, 320 ms düşüş | anında |
| Güvenlik yavaşlaması | operatör bölgede | hız hedefi 1 / 0,3 / 0; üstel yumuşatma (durmada λ=9) | uygulanmaz (döngü yok) |
| Kamera açısı | düğme | 900 ms minimum sarsıntı | anında |
| Kat kat | adım ortadan geçince | kol 720 ms `--pz-move`, kat 520 ms hafif yaylanma, 260 ms gecikme | bütün katlar görünür, kol üstte |
| Güvenlik mini kolu | görünürken | 1,6 sn/bacak, bölgeye göre hız | durağan |
| Tuval belirme | ilk kare | 700 ms opaklık | geçişsiz |
| Pazının içi (Biz kimiz) | kaydırma, pin + scrub 0,6 | masaüstü 7 ekran boyu, telefon 4,6; parça başı minimum sarsıntı; söküm %7,5–52, duraklama %52–62, montaj %62–83, hücre %84–100 | pin yok; patlatılmış hâl durağan, bütün etiketler |

## Ölçümler (2026-10-04, `npm run build` çıktısı, yerel statik sunucu, Chromium)

- İlk yükleme JS (Next): `/pazi` 130 kB, `/pazi/fizibilite` 131 kB (Next raporu, gzip).
- Sayfanın gerçekten indirdiği bütün JS (three.js dahil): ana sayfa 336 KB (masaüstü ve mobil), fizibilite 336 KB, model sayfası 339 KB (gzip -9 ile ölçüldü; brotli daha küçük). Hedef ≤ ~350 KB: tuttu.
- 3B model / doku indirmesi: 0 KB (hepsi prosedürel). OG görseli 72 KB JPEG.
- LCP (yerel, ağ gecikmesiz): masaüstü ~0,5 sn, mobil ~0,2 sn; LCP öğesi başlık metni.
- Yatay taşma: 1440 ve 390'da yok.
- Biz kimiz (`/pazi/biz-kimiz`, 2026-10-04): Next ilk yükleme 174 kB (GSAP + ScrollTrigger dahil). Sayfanın indirdiği bütün JS, three.js dahil: gzip -9 ile 378 KB, brotli 11 ile 321 KB (Cloudflare brotli sunar; kalite tabanı ≤ 350 KB brotli: tuttu, gzip ölçüsünde ~28 KB aşıyor). 3B model/doku indirmesi 0 KB. OG görseli `og-biz-kimiz.jpg` 68 KB. Tuval yalnız kaydırma değişince çizer, ekran dışında uyur; DPR üst sınırı 1,75 (dokunmatikte 1,5). Yatay taşma 1440 ve 390'da yok.
- Ekran görüntüleri: `.tasarim/pazi/ekran/20-…27-` (monte, yarı açık, tam açık, yeniden monte/çalışıyor, mobil iki kare, azaltılmış hareket, çizim yedeği). Kareler `?kare=0.57` gibi sabit ilerlemeyle alındı (bkz. `components/pazi/about/Teardown.tsx`).

## Taze göz (bağlamsız inceleme, 2026-10-04)

İlk tur: ağırlıklı 7,3 (Tasarım 7,4 · Kullanılabilirlik 6,8 · Yaratıcılık 7,7 · İçerik 7,2), karar DÜZELT. Uygulanan düzeltmeler: mobilde ölçü plakası 3B'nin önüne alındı ve ± düğmeleri geri geldi; ana sayfa 25 kg torba ile açılıyor (plakada ürün tipi seçimi); robot ışığı, gölge hatası ve kol incelmesi düzeltildi; plaka rakamları büyütüldü; azaltılmış harekette palet %60; HMI üst kenarı sarıdan grafite; güvenlik planı başlıkla hizalandı. İkinci puanlama yapılmadı.

## Geliştirme turu (2026-10-04, jüri 7,3 → hedef 7,6+)

- Telefonda (≤900 px) hücre ölçü plakasının üstünde, `clamp(220px, 32vw, 300px)` yükseklikte kısa kadraj (`zoomNarrow` 2,1, `frameNarrow` y 0,4); HMI şeridi plakanın hemen altında. Durağan çizim telefonda 1,6 ölçek.
- Durağan çizim modu (`cell.render === "vector"`, `lib/pazi/store.ts`): sürükleme ipucu ve görünüm/hız/durdur düğmeleri gizli; HMI şeridinde `tr.view.still` notu. Yüklenirken (`pending`) düğmeler `visibility: hidden`.
- Kahraman ekran yüksekliğine bağlı: başlık `clamp(2.45rem, min(5vw, 7.6svh), 5.6rem)`, plaka aralığı `--pz-hero-gap` ve alan yüksekliği `--pz-field-h` svh ile; `max-height: 880px` altında "devam" düğmesi ağırlık/hız satırına girer. İpucu şeridin üstünde yüzer. HMI şeridinin alt kenarı: 1280×720 → 718, 1366×768 → 761, 1440×900 → 892, 1536×864 → 856, 1920×1080 → 1047 (önce 1440×900'de 953).
- Robot: kol mat beyaz (`paint` clearcoat 0,18), ayak/asansör kolonu açık gri `pedestal #c9cbc6`; koyu yalnız eklem kapakları, flanş, taban plakası. Kahramanda zoom 1,06 → 1,38 (palet kadrajda ~%27–30 büyük); vektör çizim 1,3 ölçek, açık ayak, kalın beyaz kol.
- Durma bölgesi bandı dinlenirken düz sarı; siyah-sarı tarama yalnız operatör işareti yavaş/iç bölgedeyken (`engine.showZone`, IsoCell `zone`). Operatör işaretinin varsayılan yeri kadraj içine alındı (boş palet tarafı, bölge dışı); kahraman metin sütunu artık yalnız kendi öğelerinde tıklama alır, işaret sürüklenebilir.
- "Kat kat kurulum": çizim kahramanda seçilen ürünü dizer (torba varsayılan; koli, shrink); bölüm yüksekliği 1440×900'de 1977 → 1137 px (−%42). Mobilde 1483 → 1369.
- Ölçüm (yerel, `dogrula.py`): LCP masaüstü 340 ms / mobil 184 ms, CLS 0 / 0, konsol hatası 0, yatay taşma yok. GPU açık ekranlar: `ekran/gelistir-2026-10-04/gpu/`.

## Bilinen borçlar ve kararlar

| Konu | Neden ertelendi | Ne zaman |
|---|---|---|
| EN içerik (`content/pazi/en.ts`) | TR metin onayı bekleniyor; yapı hazır | TR onayından sonra |
| Mobilde yapışkan önizleme şeridi (fizibilite) | Önizleme adımların üstünde, yapışkan değil | İsteğe bağlı cila |
| 3B operatör işaretinin klavye karşılığı | Erişilebilir karşılık güvenlik bölümündeki planda var | Gerekirse |
| Demoya özel 404 | Statik dışa aktarımda alt klasör 404'ü üretilmez; `not-found.tsx` yalnız geçersiz model için. Gerçek 404 ana sitenin işi | Yayın aşamasında ana site |
| Gerçek cihaz performansı | Ölçüm masaüstü GPU'da; orta sınıf telefonda denenmedi | Raşit telefonda bakınca |
| IFR %59 verisi | Doğrulanamadı, siteye konmadı | Kaynak doğrulanırsa |
| Fiyat | Bilerek yok; kullanıcı teklif tutarını girer | Karar verildi |
| 1024×768'de HMI şeridi 3 px taşıyor | Turun hedef ölçüleri dışında; dar sütunda alt başlık bir satır uzuyor | İsteğe bağlı cila |
| ~~Operatör iç bölgedeyken durum hücresi "Uygun" kalıyor~~ | Kapandı (gelistir2, 2026-10-04): şerit bölgeyi yansıtıyor (Tam hız / Yavaşladı / Durdu), `aria-live="polite"` | Kapandı |
| `site_sokum.py --headed` bu makinede yine durağan çizime düşüyor | Betik GPU bayrağı açmıyor; 3B kanıtı ayrı Playwright çekimiyle (`--enable-gpu`) alındı | Eklenti tarafında |
