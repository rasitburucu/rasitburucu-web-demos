# Onikitaş: tasarım kaydı ve borç tablosu

Güncelleme: 2026-10-04, dal `gelistir/onikitas`. Yön bilgisi: `~/.claude/plans/imdi-senden-yle-bir-replicated-donut.md` (Onikitaş v2), son eleştiri `_web-atolyesi/onikitas-elestiri-2026-10-04/ELESTIRI.md`.

Dokunulmayanlar (Raşit'in kararı): ilk ekrandaki kemer, Pinyon Script logo, DM Serif Display + Instrument Sans, palet (badana / traverten / kiremit), gün akışının bölüm yapısı, VisitDialog ve Registry işlevi.

## Bu turda kodda kullanılan değerler

| Konu | Değer | Yer |
|---|---|---|
| Yön | Yamaç batıya bakar: +z batı (deniz), -z doğu (sırt), +x güney. Güneş yolu yaz günü: doğuş 05:51 az 62°, batış 20:15 az 298° | `lib/onikitas/terrain.ts`, `scene/palette.ts` `dirFrom` |
| Ev cephesi | `bearingOf` = eski açı + 90°; evler 231°–338° (GB, B, KB) | `lib/onikitas/layout.ts` |
| Maket | Kontur katmanı `STEP` 1,25 birim, `STEP_OFF` 0,3 (en alt kara katmanı deniz düzleminin üstünde). Üçgen başına bant kesme + her kontur geçişinde dik kesit; levha kenarı -12,5'e iner | `scene/build.ts` `buildMaquette` |
| Maket ağı | yüksek 200 / orta 160 / düşük 110 hücre (≈185k / 125k / 80k üçgen), kurulum ~50 ms | `Scene.tsx` `Q.maq` |
| Maket rengi | `OKI_CLAY` (0,875; 0,858; 0,83); kesit kenarı ×(0,99; 0,96; 0,91), her levhada kıl çizgisi | `glsl.ts`, `materials.ts` |
| Şafak dolgusu | gök #dbd1c4, zemin sekmesi #bba78e, hemi 1,08 (06:30: #dcd7ce / #b9a790 / 0,98) | `palette.ts` |
| Pleksi deniz | renk (0,37; 0,50; 0,58), saydamlık 0,74 − 0,14·fresnel; levha dışında opak, kesik kenarı açık çizgi | `materials.ts` `waterMaterial` |
| Gerçek zemin | maket önünde `discard`; eski köşe kaydırma (aStepY) kaldırıldı | `materials.ts` `terrainMaterial` |
| Kaide | teras duvarı 0,5 (eski 0,9), kaide derinliği 3,6; pad ağırlığı `w⁴/(1−w)`: kendi kenarında ev her zaman kazanır, alttaki komşu zemini aşağı çekip kaideyi havada bırakamaz | `lib/onikitas/site.ts` |
| Temas gölgesi | evler zemin yükseklik dokusunu okur (`uGround`, yarım float), zemine 0,85 birim kala %52'ye kadar kararır; teras duvarı dibinde zemin %68 | `materials.ts` |
| Havuz | açık taban, duvara doğru koyulaşan su, karo çizgisi, hareketli ışık ağı, fresnel yansıma | `materials.ts` |
| Kamera | yakın plan kaldırıldı; anahtarlar `getPoint` ile bölüm sınırına oturur; her gündüz anahtarında deniz kadrajın altında | `scene/rig.ts` |
| Mobil kadraj | gündüz `PORTRAIT_DOLLY` 0,7, `PORTRAIT_LIFT` −1,5; gece `NIGHT_FIT` −0,4, `NIGHT_LIFT` 13 | `scene/rig.ts` |
| Sis | 140 → 1100 (uzak sırt düz bir kama değil, sırt olarak okunur) | `Scene.tsx` |
| Bölüm saatleri | 05:41, 06:30, 07:45, 11:45, 14:30, 17:45, 19:40 (tek kaynak) | `lib/onikitas/chapters.ts` |
| İlk başlık | şafak h1 harf animasyonsuz, gövde metni yükleme beklemeden görünür | `Chapters.tsx`, `onikitas.css` |
| Ziyaret düğmesi | gölge yok | `onikitas.css` |
| Durağan kareler | 7 kare yeni sahneden yeniden çekildi (1600×1000 webp, 29–93 KB) | `public/onikitas/frames/` |

## Ölçüm

| Ölçüt | Önce | Sonra | Not |
|---|---|---|---|
| Mobil LCP, CPU 4× + yavaş 4G, 3 koşu medyanı | 12 224 ms (canlı, LCP = şafak gövde metni, yükleme ekranı bitince) | 2 936 ms (yerel derleme, LCP = h1, FCP ile aynı an) | Aynı kısıtlar; sunucular farklı (canlı CDN, yerel statik). LCP artık ilk boyamaya eşit, kalan süre ağ ve CSS/font |
| Mobil LCP, kısıtsız (jüri aracı, başsız) | 3 780 ms | 96 ms | `ekran/gelistir-2026-10-04/report.md` |
| CLS | 0,0085 / 0 | 0,0123 / 0 | masaüstü / mobil |
| İlk rota JS (gzip, sayfanın indirdiği 11 dosya) | ölçülmedi (jüri: betik aktarımı 416,6 KB, CF Insights dahil) | 386 KB | Sahne kodu tembel yükleniyor; ilk yük sayfası 122 KB (değişmedi) |

## Borç tablosu

| # | Borç | Neden açık | Öneri |
|---|---|---|---|
| 1 | Düşük kademede (telefon) maket gölgeleri zayıf, katmanlar masaüstü kadar derin okunmuyor | Telefonda ortam gölgelemesi (AO) yok, gölge haritası 1024 | Gerçek telefonda bak; gerekirse düşük kademede kesit kenarını bir ton koyulaştır |
| 2 | Akşam karesinde güneş kameranın arkasında; evler önden aydınlanıyor, gölgeler yamaca düşüyor | Coğrafya gereği (güneş denize batıyor) | Kabul; istenirse akşam kamerası kuzeyden yan ışığa alınır |
| 3 | Yazılım çizicide (SwiftShader) sahne düşük kademede yine kuruluyor | Önceden beri böyle; kalite tabanı durağan kare yedeği istiyor | `detectTier` yazılım çizicide `stills` moduna geçsin (tek satır), ayrı karar |
| 4 | Gece mobil karede 12 evin 7'si görünür | Pencereler okunsun diye bilinçli kırpma | Kabul |
| 5 | Kamera artık bölüm sınırlarına oturuyor (`getPoint`); bazı bölümler arası geçiş eskisinden biraz hızlı | Her gündüz karesinde deniz şartı | Telefonda kaydırma hissine bak |
| 6 | THREE.Clock uyarısı, D3D "gradient in loop" gölgelendirici uyarısı | Kütüphane içi / önceden beri | Zararsız, izlenecek |
| 7 | Öğle metni "Her avluyu evin kuzeyine aldık" sahnede gösterilmiyor | Kapsam dışı | Kabul |
