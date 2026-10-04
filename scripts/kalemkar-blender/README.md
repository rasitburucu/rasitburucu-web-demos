# Kalemkâr: bakır sini ve tezgâh tepsisi (Blender)

Sitedeki bakır sini (`public/kalemkar/img/sini-*`) ve tezgâh tepsisi (`tepsi-*`) bu çalışma için Blender 5.2'de modellendi. Dış model ya da doku kullanılmadı; kazıma desenleri bu klasördeki iki Python betiğiyle çizildi.

## Adımlar

1. Kazıma maskeleri (Pillow): `python engrave_sini.py` → `engrave.png` (4096², nesne XY [-1,1]); `python engrave_tray.py` → `engrave-tray.png` (4800×1600, nesne X [-1,5..1,5], Y [-0,5..0,5]). Beyaz = oyuk.
2. Sahne (ayrı `KK_Sini` ve `KK_Tepsi` sahneleri; kullanıcının açık sahnesine dokunulmaz):
   - Sini: döndürme profili (`bmesh.ops.spin`, 256 adım). Taban r 0–0,86, hafif çukur (z = 0,045·(r/0,86)²; düz taban tepeden tek renk yansıttığı için çukurluk şart), eğim r 0,86–0,962, kıvrık kenar (merkez r 0,982, yarıçap 0,02, 270°).
   - Tepsi: 3,0×1,0 yuvarlatılmış dikdörtgen (köşe 0,22); ızgara taban aynı çukurlukla, eğim halkaları, kenar eğri + yuvarlak bevel.
   - Malzeme `KK_Bakir`: Principled, metalik 1; taban rengi gürültüyle (0,36,0,12,0,05)–(0,86,0,40,0,20) arası; oyuklarda koyu çarpma (0,09,0,035,0,02); pürüzlülük 0,16–0,30, oyukta 0,55; çekiç izi Voronoi (ölçek 34, bump 0,10) + kazıma bump (ters, 1,0).
   - Işık: Poly Haven `studio_small_09` HDRI (CC0, güç 0,35, 35° döndürülmüş); sol üstte sıcak alan ışığı (1600 W, 1 m); serin dolgu (60 W); tepede sol üstte dikdörtgen parlama ışığı (2,4×0,9 m, 60 W) çukur tabanda yumuşak bir parıltı bandı verir.
   - Kamera: perspektif 85 mm, tam tepeden; gölge yakalayıcı zemin; saydam film; AgX; Cycles OptiX 256 örnek + gürültü giderme.
3. Çıktılar `scripts/.raw/kalemkar/blender/sini.png` (2400²) ve `tepsi.png` (2400×840); `node scripts/process-kalemkar-images.mjs sini tepsi` ile AVIF/WebP.

Ham PNG'ler repoya girmez (`scripts/.raw/` yok sayılır); işlenmiş dosyalar `public/kalemkar/img/` altında.
