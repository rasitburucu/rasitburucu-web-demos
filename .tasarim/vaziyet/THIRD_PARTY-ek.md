# THIRD_PARTY ek: Vaziyet (kök `THIRD_PARTY.md`'ye birleştirilecek)

Tarih: 2026-10-09. Demo: `vaziyet` (rasitburucu.com/web/vaziyet/). Worktree `rasitburucu-web-demos-wt/vaziyet`, dal `demo/vaziyet`.

## Yazı karakterleri
| Varlık | Kaynak | Lisans | Ne için | Dosya |
|---|---|---|---|---|
| Gabarito (değişken, wght 400–900; Naipe Foundry, "The Gabarito Project Authors") | https://github.com/google/fonts/tree/main/ofl/gabarito (`Gabarito[wght].ttf`, 158 KB) · https://fonts.google.com/specimen/Gabarito | SIL OFL 1.1 | Başlıklar, logo, iri rakamlar, durum kutusu | `app/vaziyet/fonts/gabarito-tr.woff2` (38 KB) + `OFL-Gabarito.txt` |
| Host Grotesk (değişken, wght 300–800; Element Type, "The Host Grotesk Project Authors") | https://github.com/google/fonts/tree/main/ofl/hostgrotesk (`HostGrotesk[wght].ttf`, 82 KB) · https://fonts.google.com/specimen/Host+Grotesk | SIL OFL 1.1 | Gövde, form, etiket, çizim yazıları | `app/vaziyet/fonts/host-grotesk-tr.woff2` (20 KB) + `OFL-HostGrotesk.txt` |

- İndirme: 2026-10-09, Raşit'in izniyle (yalnız bu iki aile, google/fonts deposu). Kaynak TTF'ler `scratchpad/indirilen/vaziyet-font/` klasöründe, repoya girmedi.
- Alt küme: `python -P -m fontTools.subset … --flavor=woff2 --layout-features='*'`; Latin (U+0020–007E, U+00A0–00FF) + Türkçe (Ğ ğ İ ı Ş ş) + tire, tırnak, üç nokta, ok, eksi ve ₺ (Host Grotesk'te var). Değişken eksen tam bırakıldı. Alt küme OFL'ye göre bir değişikliktir; font adları değiştirilmedi.
- Türkçe glif denetimi: ğ Ğ ı İ ş Ş ç Ç ö Ö ü Ü iki dosyada da var (fontTools ile okundu). Host Grotesk rakamları varsayılan olarak eş genişlikte; Gabarito'da `tnum` özelliği açık tutuldu.

## Veri
| Veri | Kaynak | Lisans | Ne için | Dosya |
|---|---|---|---|---|
| Eskişehir'den 81 il merkezine karayolu mesafesi | OpenStreetMap yol ağı, OSRM tablo servisi (router.project-osrm.org), derleme öncesi tek istek (`scripts/fetch-vaziyet-distances.mjs`, 2026-10-09) | ODbL 1.0 · © OpenStreetMap katkıda bulunanlar; atıf il seçicinin altında | Maliyet dökümündeki nakliye satırı | `content/vaziyet/mesafe.json` |

İl merkezi koordinatları elle yazıldı (iki ondalık); OSRM her noktayı en yakın yola oturtur. Değerler 5 km'ye yuvarlandı, sitede "yaklaşık" yazar. Çalışma anında dış istek yok.

## Görseller (hepsi kendi üretimimiz; dış görsel yok)
| Görsel | Nasıl | Lisans | Kaynak dosya |
|---|---|---|---|
| Beş modelin aynı ölçekte dizisi (`public/vaziyet/raf-*`) | Blender 5.2.2 Cycles, tamamen koddan: kesim matı (gölgelendirici ızgara), mantar levha (Voronoi), kobalt akrilik evler 1:100 (`content/vaziyet/modeller.ts` ölçüleri ve pencere verisiyle), sünger ağaç, plastik cetvel; `scripts/vaziyet-blender/maket.py raf` | Kendi çalışmamız | PNG `.tasarim/vaziyet/blender/render/raf.png` |
| Model görselleri (`model-{sundurma,sofa,hayat,cumba,avlu}-*`, OG kartı) | aynı betik, `model:<id>` sahnesi: arsa, yapılaşma sınırı bandı, gri karton yol, ağaçlar | Kendi çalışmamız | `render/model-*.png` |
| Üretim adımları (`panel-*`, `tir-*`, `kurulum-*`) | aynı betik, `panel`, `tir`, `kurulum` sahneleri: pencere boşluklu duvar panelleri ve numara etiketli istifler, panel yüklü tır, temel üstünde yarım kurulmuş ev | Kendi çalışmamız | `render/{panel,tir,kurulum}.png` |
| Plan, maket (3B), kat planları, panel planı, patlatılmış maket, örnek imar durumu belgesi, logo, favicon | SVG ve Three.js (R3F), koddan; dokular tarayıcıda canvas ile çizilir (ızgara, mantar); ışık `RoomEnvironment` | Kendi çalışmamız | `components/vaziyet/**` |

İşleme: `node scripts/process-vaziyet-images.mjs <render klasörü>` (sharp) → AVIF + WebP setleri, `content/vaziyet/image-dims.json`, `app/vaziyet/opengraph-image.jpg`. HDRI, doku, hazır model, fotoğraf ve yapay zekâ görseli kullanılmadı. Render ayarı: Cycles 128 örnek + gürültü giderme, AgX "Punchy", pozlama −0,75, GPU (OptiX).

## Kütüphane
Yeni paket eklenmedi. Kullanılanlar repo bağımlılıkları: Next 15.5, React 19, three (`RoomEnvironment` dahil, paket içinden), @react-three/fiber. drei kullanılmadı (maket etiketleri düz DOM).
