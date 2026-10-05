# THIRD_PARTY ek: Sazbahçe (2026-10-05, cila turu sonrası)

Kök `THIRD_PARTY.md`'ye birleştirilecek satırlar. Yalnız gerçek göl fotoğrafları Pexels'ten (alan fotoğrafları çıkarıldı, yerlerine kendi render'larımız geldi). Fotoğraflar Pexels sayfasından yerel indirildi (hot-link yok), `scripts/process-sazbahce-images.mjs` ile tek akşam tonuna çekildi ve AVIF/WebP'ye çevrildi. Ham dosyalar `scripts/.raw/sazbahce/` (git dışında). Kaynaklar sitede de "Proje künyesi"nde listeli (`content/sazbahce/credits.ts`).

## Fotoğraflar (Pexels License: ücretsiz, ticari kullanım serbest, atıf zorunlu değil; yine de atıf verildi)

| Dosya anahtarı | Pexels sayfası | Yazar | Kullanım | Tarih |
|---|---|---|---|---|
| golyazi | https://www.pexels.com/photo/serene-sunset-at-lake-ulubat-in-golyazi-bursa-36520717/ | mustafa memish | İlk ekran, Uluabat Gölü (gerçek yer) | 2026-10-05 |
| sazlik | https://www.pexels.com/photo/serene-lake-view-with-rowboat-and-reeds-in-bursa-33066315/ | Ali Uğur | Ziyaret, Uluabat sazlığı (gerçek yer) | 2026-10-05 |
| liman | https://www.pexels.com/photo/harbour-in-bursa-19962368/ | Betül Şen | Ziyaret, Gölyazı kıyısı (gerçek yer) | 2026-10-05 |

## Yazı karakterleri (SIL Open Font License 1.1)

| Font | Kaynak | Dosya | Not |
|---|---|---|---|
| Anybody (The Anybody Project Authors, Etcetera Type Co.) | https://github.com/google/fonts/tree/main/ofl/anybody | `app/sazbahce/fonts/anybody-tr.woff2` + `OFL-Anybody.txt` | wdth 100–150, wght 500–850 kesildi; Latin + Türkçe alt küme |
| Onest (The Onest Project Authors) | https://github.com/google/fonts/tree/main/ofl/onest | `app/sazbahce/fonts/onest-tr.woff2` + `OFL-Onest.txt` | wght 400–700 kesildi; Latin + Türkçe alt küme |

## 3B modeller ve dokular (Poly Haven, CC0; atıf zorunlu değil)
Alan render'larında kullanıldı; render'a gömülü, siteye dosya olarak girmez. İndirme: `.tasarim/sazbahce/blender/ph_get.py` (2026-10-05).

| Varlık | Tür | Sayfa | Kullanım |
|---|---|---|---|
| dining_chair_02 | model | https://polyhaven.com/a/dining_chair_02 | Ağ Ambarı sandalyeleri |
| wooden_lantern_01 | model | https://polyhaven.com/a/wooden_lantern_01 | Yol ve iskele fenerleri |
| Lantern_01 | model | https://polyhaven.com/a/Lantern_01 | Ceviz dallarında, iskele korkuluğunda fenerler |
| caged_hanging_light | model | https://polyhaven.com/a/caged_hanging_light | Ambar avizeleri |
| tea_set_01 | model | https://polyhaven.com/a/tea_set_01 | Kına masası |
| grass_medium_01, grass_medium_02 | model | https://polyhaven.com/a/grass_medium_01 | Çayırda çimen tutamları |
| leafy_grass, old_wood_floor, raw_plank_wall, plastered_stone_wall, stone_wall_04, roof_planks, clay_roof_tiles_02, rough_linen, gravel_ground_01, brown_mud_02, bark_brown_02 | doku | https://polyhaven.com/textures | Zemin, ahşap, taş duvar, çatı, örtü, kabuk |

## Kendi üretimimiz
- Dört alanın 8 görseli (Söğüt Çayırı, Ağ Ambarı, Ceviz Avlusu, İskele; ikişer kare): Blender 5.2 Cycles, komut satırından ayrı süreçle (`blender -b -P sazbahce_scene.py`). Söğütler, ceviz, saz, hasır sandalye, masa örtüleri, ambar, ağlar, avlu, ev, iskele, karşı kıyı kodla modellendi. Betik ve .blend dosyaları `.tasarim/sazbahce/blender/`.
- Kıyı planı, masa yerleşim algoritması, bölge haritası, favicon/işaret: kodla çizildi (SVG).
- Ambar sunum perdesindeki görüntü, sitenin Gölyazı fotoğrafıdır (yukarıdaki Pexels satırı).
