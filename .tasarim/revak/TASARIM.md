# TASARIM: Revak Okulları

İnşadan sonra, kodda geçen değerlerden yazıldı. Sonraki değişiklikler bu dosyaya uyar ya da dosyayı günceller.

- Son güncelleme: 2026-10-04 · Yayın adresi: rasitburucu.com/web/revak/ (henüz yayında değil; commit ve sync yapılmadı)
- Önceki hâl: commit `3f634de`

## Kullanılan tokenlar

| Token | Değer | Nerede |
|---|---|---|
| `--rv-stone` | #E7E5E0 | zemin |
| `--rv-stone-hi` / `--rv-stone-lo` | #F1F0EC / #DCD9D2 | panel, derz |
| `--rv-ink` / `--rv-ink-2` | #16202E / #223044 | metin, kapanış bloğu |
| `--rv-ash` | #5E6470 | ikincil metin |
| `--rv-seal` / `--rv-seal-deep` | #B8372B / #962B21 | ana eylem, mühür, odak halkası, imleç |
| `--rv-line` | #C9C4BA | çizgiler |
| `--w-vault` / `--w-floor` / `--w-haze` / `--w-shade` | #C9C0B0 / #B8AB96 / #B3A895 / #6F6455 | yürüyüş penceresinin tonozu, zemini, uzak sisi, kemer içi gölgesi |
| `--rv-ease-out` / `--rv-ease-io` | cubic-bezier(0.16,1,0.3,1) / (0.65,0,0.35,1) | giriş/çıkış, yer değiştirme |
| `--rv-radius` | 2px | bütün arayüz (düğmeler dahil; hap düğme kalktı) |
| Gösterim | Marcellus 400, `font-synthesis: none`, italik yok | başlık `clamp(2.7rem, 0.8rem + 5.2vw, 6.4rem)`, satır 1,04; bölüm `.rv-h2` `clamp(2.3rem, 1.2rem + 3.4vw, 4.6rem)`, satır 1,05 |
| Gövde | Hanken Grotesk, 17 px, satır 1,6 | |
| Tarayıcı yüzeyleri | `::selection` mürekkep/taş, `:focus-visible` 2 px mühür + 3 px boşluk, `caret-color` mühür, `scrollbar-color` mürekkep %40, `theme-color` #E7E5E0 | |

## Bileşen envanteri

| Ad | Dosya | İş |
|---|---|---|
| Giriş (cover) | `app/revak/page.tsx`, `almanak.css` "cover" | Başlık + alt başlık + cümle formu solda, revak render'ı sağda kemer içinde |
| SentenceForm | `components/revak/home/SentenceForm.tsx` | "Çocuğum [kademe] için [niyet] istiyorum." → doğru akış, kademe seçili |
| Walk | `components/revak/home/Walk.tsx` | Revak yürüyüşü; render edilmiş kemer yüzleri (`public/revak/walk/kemer-{sabah,aksam}-{720,1440}`) |
| Rehberlik | `page.tsx` `.rv-guide-*` | 9.–12. sınıf adımları, rakamsız |
| SealMark (adlı) | `components/revak/flow/kit.tsx` | Ön kayıt sonunda çocuğun adını taşıyan kırmızı mühür; adsız hâli diğer akışlarda tik |
| NotFound | `components/revak/shell/NotFound.tsx`, `app/revak/not-found.tsx`, `app/revak/404/page.tsx` | Örülmüş kemer 404 |
| Strip | `components/revak/shell/Footer.tsx` | "Konsept çalışma: … hayali bir okuldur" şeridi |
| Avlu / akşam bahçesi render'ları | `public/revak/img/avlu-*`, `aksamBahce-*` | Kampüs bandı ve kampüs girişi (bahçeden revağa bakış); yürüyüşün son kemerinde akşam bahçesi |
| Render hattı | `scripts/revak-blender/revak_scene.py`, `scripts/process-revak-renders.mjs` | Blender (arka planda, fabrika ayarlı sahne) → PNG → AVIF/WebP + OG |

## Hareket envanteri

| An | Tetikleyici | Süre / easing | Azaltılmış hareket |
|---|---|---|---|
| Giriş başlığı | yükleme | 0,9 sn `--rv-ease-out`, 0,35em yükselme | anında |
| Giriş render'ı | yükleme | 1,6 sn ölçek 1,12→1 (gizlenmez; LCP öğesi) | yok |
| Revak yürüyüşü | kaydırma, pin, `scrub: 0.6` | MOVE 1,25, HOLD 1,1 zaman birimi; 0,42 vh/birim masaüstü, 0,36 mobil | dört kademe yıllık sayfası; pin ve Lenis yok |
| Işık sabah→akşam | yürüyüşle | akşam render'ı `opacity: var(--sun)` | yok |
| Kemerin altından geçiş | yürüyüşle | kamera durakta kemerin 0,55 birim önünde; geçerken kemer gölgesi (`.rv-walk-under`, en çok %32) ve 2,2 px adım salınımı; fotoğraflar sırayla (eski z<0,3'te çıkar, yeni z 2,35→1,75'te girer); yaş sayacı geçiş boyunca solda | yok |
| Kemer → ön kayıt | kademe düğmesi | View Transitions 0,75 sn | düz gezinme |
| Mühür | ön kayıt bitince | 0,52 sn ölçek 1,35→1, -13°→-7° | basılı hâliyle |
| Lenis | okuma sayfaları | kendi rAF döngüsü; ana sayfada yürüyüş takılıyken `gsap.ticker` sürer, `lagSmoothing(0)` | kurulmaz |

## Ölçümler (2026-10-04, üretim derlemesi, yerel, ağ kısıtlaması yok)

| Ölçüt | Değer | Bütçe |
|---|---|---|
| Ana sayfa ilk yük JS (mobil) | 175 KB brotli · 200 KB gzip · 616 KB ham, 17 dosya | ≤ 350 KB |
| Next "First Load JS" `/revak` | 186 KB | |
| LCP (mobil 390) | 0,50 sn, öğe: giriş render'ı (`revak-800.avif`) | ≤ 2,5 sn |
| CLS | 0 | ≤ 0,1 |
| Görsel (ilk ekran, mobil) | 113 KB; font 75 KB; CSS 79 KB | |
| Konsol hatası | yok (masaüstü, mobil, akışlar) | |
| Yatay taşma (390) | yok | |
| `npm run lint` / `npm run build` | temiz / yeşil | |

INP ve gerçek cihaz ölçümü yapılmadı.

## Bilinen borçlar ve kararlar

| Konu | Neden ertelendi | Ne zaman |
|---|---|---|
| Bilinmeyen `/web/revak/*` yollarının `/web/revak/404/`'e düşmesi | Statik dışa aktarım iç içe not-found üretmez; ana sitenin yönlendirmesi gerekir (Kalemkâr'la aynı) | yayın sırasında |
| Kullanılmayan eski görseller (`hero`, `campus`, `kampusHero` dosyaları `public/revak/img`'de) | Silmek yerine bırakıldı; yayına ~0,6 MB fazladan dosya gider, sayfalar istemez | Raşit onayıyla temizlik |
| Ölü CSS (`.rv-alumni-*`, `.rv-voice*`, `.rv-masthead`, `.rv-folio-n`) | Zararsız; ayrı temizlik turu | sonraki tur |
| `next/font/google` | Bulut aynasında derlenmez; yerel derlemede sorun yok | bulutta derleme gerekirse `next/font/local` |
| Kademe fotoğrafları stok (Pexels), ortaokul karesi yetişkin eldiveni | Render'la değiştirmek ayrı iş; çocuk yüzü yok | içerik turu |
| Yürüyüşte stok fotoğraf kemerin içine düz oturuyor; ağaçlar kil gibi; zemindeki ışık lekeleri vektör; üstte üç katman şerit (mobilde ~205 px); birincil düğme rengi akışta lacivert | İkinci taze göz turunun kalan bulguları (7,2) | sonraki tur |
| Yeni Türkçe metinler | Raşit onayı bekliyor (ELESTIRI.md değil, rapordaki liste) | onaydan sonra |
