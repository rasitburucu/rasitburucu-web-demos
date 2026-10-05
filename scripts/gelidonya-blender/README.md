# Gelidonya: sera, fidelik ve ova render'ları (Blender)

Sitedeki dört görsel (`public/gelidonya/sera-ici-*`, `salkim-*`, `fidelik-*`, `ova-*`) Blender 5.2.2'de bu klasördeki betiklerle koddan kuruldu. Dış model, doku, HDRI ya da fotoğraf kullanılmadı.

| Betik | Ne kurar |
|---|---|
| `bitki.py` | Yüksek telli domates bitkisi (6 çeşitleme): tüylü gövde, alt metresi alınmış bileşik yapraklar (yaprakçık başına ton, sararan alt yapraklar), sap üstünde salkım (tek malzeme, yüz özniteliği `ton` ile yeşilden kırmızıya), çanak yaprakları, askı ipi |
| `sera.py` | Gotik kemerli çok açıklıklı plastik sera: galvaniz dikme ve kemerler, süt beyazı örtü (saydam + yarı saydam karışım), beyaz zemin örtüsü, torbalar, damla hatları, ısıtma ray boruları; bitkiler Geometry Nodes ile ~6.300 kopya; güneş + hafif sis; kameralar `GD_Kamera` (ilk ekran) ve `GD_SalkimKamera` (Ürünlerimiz) |
| `fide.py` | Fidelik: galvaniz tezgâhlar, 45 gözlü siyah viyoller, perlitli torf, 3–4 haftalık domates fidesi; kameralar `GD_FideKamera` (alan derinliği) ve `GD_ZiyaretKamera` (İletişim) |
| `ova.py` | Kıyı ovası: gürültüyle dağlar, koy, deniz; tarla bölgelerine dizilmiş ~6.500 sera bloğu, narenciye bahçeleri; gökyüzü dokusu + güneş + hava sisi |
| `viyol_kare.py` | Sipariş viyolü için üstten (ortografik) kareler: torflu 45 ve 28 gözlü viyol, ürün başına 8 fidelik sprite (kotiledon + ilk gerçek yaprak, gölge yakalayıcıyla kendi gölgesi), `viyol-kare.json` piksel geometrisi. Işık sera render'ıyla aynı yönde (sol üst). `blender -b --factory-startup -P viyol_kare.py -- <çıktı klasörü> [örnek]` |
| `render_kare.py` | Arka planda tek kare: `blender -b <dosya.blend> -P render_kare.py -- <çıktı.png> [en boy örnek kamera]` (GPU, OptiX) |

Sahne dosyaları: `.tasarim/gelidonya/blender/gelidonya-sera.blend`, `gelidonya-fidelik.blend`, `gelidonya-ova.blend` (ana repoda). Ham PNG'ler `.tasarim/gelidonya/blender/render/`; `node scripts/process-gelidonya-images.mjs <render klasörü>` AVIF/WebP setlerini, telefon kırpımını (`sera-ici-dar`) ve OG kartını üretir.

Kullanım (açık Blender'da): `sys.path`'e bu klasörü ekle, `import sera; sera.build()` (ya da `fide.build()`, `ova.build()`), sonra kaydet ve `render_kare.py` ile arka planda çiz. Ayarlar: Cycles 256–384 örnek + gürültü giderme, AgX "Medium High Contrast".
