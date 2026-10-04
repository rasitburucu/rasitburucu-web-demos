# Onikitaş: tasarım kaydı ve borç tablosu

Güncelleme: 2026-10-05, dal `gelistir3/onikitas` (üçüncü tur; önceki: `gelistir2/onikitas`, `gelistir/onikitas`). Yön bilgisi: `~/.claude/plans/imdi-senden-yle-bir-replicated-donut.md` (Onikitaş v2), son eleştiri `_web-atolyesi/onikitas-elestiri-2026-10-04/ELESTIRI.md`.

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
| Kamera | anahtarlar `getPoint` ile bölüm sınırına oturur; her gündüz anahtarında deniz kadrajın altında. Üçüncü tur: kadran açıkken seçilen eve yakın plan (`closeGoal`: 29° yükseklik, 30° yan açı, yan engel/arazi testiyle seçilir; mesafe evin pad'ini panelin bıraktığı boş alana sığdırır), evden eve geçişte yükselen yay, yere çarpmaz (`aboveGround`), lens kaydırması (`setViewOffset`) çerçeve merkezini boş alana taşır | `scene/rig.ts`, `Scene.tsx` Director |
| Mobil kadraj | gündüz `PORTRAIT_DOLLY` 0,7, `PORTRAIT_LIFT` −1,5; gece `NIGHT_FIT` −0,4, `NIGHT_LIFT` 13 | `scene/rig.ts` |
| Sis | 140 → 1100 (uzak sırt düz bir kama değil, sırt olarak okunur) | `Scene.tsx` |
| Bölüm saatleri | 05:41, 06:30, 07:45, 11:45, 14:30, 17:45, 20:30 (tek kaynak); Akşam 20:00'de biter; her bölümün saati bir sonrakinin başladığı dakikadan bir dakika önce durur | `lib/onikitas/chapters.ts` `hourFor` |
| Kadran | 15:00–21:00, çeyrek saat çentiği, saat etiketi her saat; seçili evin en güzel saatinde açılır, ev seçimi güneşi o saate götürür (ziyaretçi sürüklediyse götürmez); seçilen saat bölümden çıkınca da saklanır | `Sundial.tsx`, `Experience.tsx` |
| Kadran kartı | tek 1 px çerçeve, düz traverten plaka (traverten dokusu %80 badana altında), gölge ve cam yok; taşlar düz dolgu + kıl çizgi, seçili taş düz kiremit | `onikitas.css` |
| Metin zemini | Üçüncü tur: şeritler, üst perde ve tam genişlik bantlar kaldırıldı; sahne her yerde net. Yalnız metnin altında yumuşak zemin: metnin en geniş satırını saran kutu + 24–48 px taşma, 16–24 px yumuşak kenar (`--bed-x/y/f`); yoğunluk %86 (kuşluk/ikindi %90, saat %90, şafak %80, telefon %88, logo ve menü %86). Satır kenarları `Experience.tsx` `fitBeds` ile ölçülür | `onikitas.css` "text beds" |
| Mürekkep tonu | koyu zemine geçiş 18:00 yerine 19:24 (altın saat açık şeritle kalır) | `Experience.tsx` |
| Kayıt bölümü | üstünde 45vh gece rengine geçiş; geçmiş başlık zemini düz `--night`; telefonda ilk 4 kart + "Hepsini göster" | `onikitas.css`, `Registry.tsx` |
| İlk başlık | şafak h1 harf animasyonsuz, gövde metni yükleme beklemeden görünür | `Chapters.tsx`, `onikitas.css` |
| Ziyaret düğmesi | gölge yok | `onikitas.css` |
| Durağan kareler | 7 kare yeni sahneden yeniden çekildi (1600×1000 webp, 29–93 KB) | `public/onikitas/frames/` |
| Villalar (üçüncü tur) | Her ev mimari maket: 0,16 kalın cephe duvarı, içe gömülü pencere ve kapılar, doğrama (kayıt, orta dikme, kayıt kirişi, kapı alt tablası), taş söve ve denizlik, eşik, panjur (pier genişse duvara yatık, dar ise 90° açık; panjur boyası eve göre üç renk, panjur çıtaları shader'da), parapet harpuşta taşı, çörten, çatı döşemesi, merdiven kulübesi kapısı ve sedir, havalandırmalı baca başı ve şapkası, pergola taban taşları, masa ve bank, havuz kopingesi ve merdiveni, şezlong, teras basamakları (plinte bir, istinat duvarından üç), bahçe duvarı harpuştası, küp ve küpte genç zeytin (ağaç örneklemesine eklenir). Traverten derzleri (30×20, şaşırtmalı) ve moloz taş dizileri evin kendi eksenine göre (`aLp`). Seed'li varyant: panjur yok/hepsi/zemin, söve var/yok, meşe/boyalı doğrama, şapka, küp sayısı, şezlong, masa | `scene/villa.ts`, `materials.ts` |
| Villa LOD | Ev başına THREE.LOD: yakın seviye 42 birim içinde (bütün ayrıntı), uzak seviye kütle + gerçek pencere boşlukları + panjur + pergola. Kutular doğrudan dizilere yazılır (parça başına geometri yok); 12 evin iki seviyesi 31–34 ms | `scene/villa.ts` |
| Gölge yakın planda | Yakın plan oranında gölge kamerası ±66 → ±15 birime daralır ve eve kayar (2048 dokuda pergola çıtaları net) | `Scene.tsx` Sun |
| Kadran paneli | "Paneli sola/sağa al" (masaüstü); panel solda iken akşam sorusu sağa geçer. Yakın plan açıkken soru geçici çekilir. "Yakın planı kapat", Esc; künyeden gelindiyse "Listeye dön" (satır ekranın üçte birine gelir, düğmesi odaklanır) | `Sundial.tsx`, `Experience.tsx` |
| Menü ve künye | Menü: Gün, Evler, Ziyaret (masaüstü sözcük, telefonda `<details>` panel). Künye ortak şablona göre; künye metni `footerCopy` ayrı dışa aktarım (sayfa JS'ine girmez) | `Chrome.tsx`, `Chapters.tsx` Footer |
| Ziyaret formu | İlk kullanımda yüklenir (`next/dynamic`, düğmeye yaklaşınca ısınır); bir kez yüklenince bağlı kalır, yarım talep korunur | `Sundial.tsx` |
| Gece metni | 19vh → 13vh (telefon 104 → 98 px): bağlantılarla ilk evler arasında ince boşluk | `onikitas.css` |

## Ölçüm

### Üçüncü tur (2026-10-05, GPU açık, `ekran/gelistir3/perf-once.txt`, `perf-sonra2.txt`)

| Ölçüt | Önce (3 koşu) | Sonra (5 koşu) |
|---|---|---|
| İlk boyamaya kadar inen JS | 404 KB / 119 KB gzip / 102 KB br | 399 KB / 118 KB / 101 KB |
| Toplam JS, masaüstü yüksek kademe | 1731 / 550 / 480 KB | 1740 / 554 / 484 KB (villa.ts, sahne paketinde) |
| TBT masaüstü | 60 ms | 75 ms (62–95) |
| TBT telefon kademesi (öykünme) | 37 ms | 66 ms (63–70) |
| Villa kurulumu | 22 ms | 31–34 ms (iki LOD, 12 ev) |
| Okunurluk (32 metin bloğu, eşik hepsi için 4,5:1) | şeritle | en düşük 7,37:1 (masaüstü menü "Gün"); `ekran/gelistir3/kontrast.txt` |


### Performans: hangi sayı neyi ölçüyor (2026-10-05)

Ölçüm: RTX 4070 SUPER, Chromium 153, GPU açık (`headless=False`, ANGLE D3D11), her koşu yeni tarayıcı profili (soğuk shader önbelleği, ilk ziyaret gibi), 5 koşu medyanı. Betik: scratchpad `oki_perf.py`; ham veri `ekran/gelistir2-2026-10-04/gpu/perf-once.json`, `perf-sonra.json`.

| Sayı | Kim ölçtü | Ne ölçüyor |
|---|---|---|
| 386 KB | önceki geliştirici | Telefon kademesinde indirilen 12 JS dosyasının (ilk yük + sahne) gzip toplamı. İlk yük değil |
| 1,4 MB | jüri aracı | Aynı 12 dosya, sıkıştırmasız: yerel Python sunucusu gzip yapmıyor. 386 KB ile aynı şey |
| 1541 ms TBT, 22 shader / 672 KB | jüri aracı | Başsız Chromium = yazılım çizici (SwiftShader). Sahne düşük kademede kuruluyor, shader'lar CPU'da derleniyordu. Master'da yazılım çizici artık durağan kare gösteriyor; bu ortamda sahne hiç kurulmuyor (başsız TBT şimdi 132 ms, 0 shader) |

| Ölçüt | Önce | Sonra |
|---|---|---|
| İlk boyamaya kadar inen JS (7 dosya) | 404 KB açık / 119 KB gzip / 102 KB brotli | 404 KB / 119 KB / 102 KB (büyümedi) |
| Toplam JS, masaüstü yüksek kademe (sahne + efektler, 16 dosya) | 1731 KB / 550 KB gzip / 480 KB br | 1731 KB / 550 KB / 480 KB |
| Toplam JS, telefon kademesi (12 dosya, efekt yok) | 1393 KB / 386 KB gzip / 327 KB br | 1394 KB / 387 KB / 327 KB |
| TBT masaüstü (FCP sonrası uzun görevler) | 515 ms (482–624) | 50 ms (41–68) |
| En uzun görev masaüstü | 546 ms (efekt katmanı devralırken bütün sahne shader'larının üçüncü bir türü eşzamanlı derleniyordu) | 150 ms (React'in sayfayı canlandırması, ilk boyamayla çakışık) |
| TBT telefon kademesi (masaüstünde 390×844 öykünme) | 78 ms | 43 ms |
| Derlenen shader, masaüstü | 152 kaynak / 3196 KB (76 program) | 92 / 2009 KB (46 program) |
| Derlenen shader, telefon kademesi | 22 / 672 KB | 22 / 672 KB |
| Sahne kodu ne zaman iniyor | sayfa canlanır canlanmaz (GPU yoklaması hidrasyon içinde, 68 ms) | ilk boyamadan 2 kare sonra + tarayıcı boşta (en geç 700 ms); GPU yoklaması da orada |
| Sahnenin ilk karesi (masaüstü, soğuk) | ~1990 ms | ~1840 ms |
| Efektler (AO, bloom) devraldığında | ~3100 ms, 450–550 ms donma | ~3000 ms, donma yok |

Ne değişti: (1) efekt katmanı ısınırken renderer ACES ton eşlemesini korur (kütüphane kapatıyordu; her sahne malzemesi bir daha derleniyordu); (2) her efekt shader'ı yalnız çizdiği hedef için derlenir (ekran + ara bellek çiftleri yok); (3) sahnenin ara bellek türü ilk kareden sonra, efektlerle birlikte, kare kare derlenir; (4) zeytin gölgesi dokusu piksel geri okuması ve JS döngüsü olmadan, iki adımda çizilir (40–130 ms → 5 ms); (5) sahne kodu ve GPU yoklaması ilk boyamadan sonra ve boşta. Efekt katmanı zaten kademeye bağlı: telefon yok, orta kademe bloom+vinyet+tane, yüksek kademe + AO.

### Okunurluk (GPU açık, metin gizlenip zemin çekilerek; metin gölgesi sayılmaz)

14 kaydırma adımı × masaüstü ve telefon: bütün bölüm başlıkları ve gövdeleri, saat, saat adı ve gün listesi eşiğin üstünde. En düşükler: masaüstü saat adı 4,89:1, telefon saat adı 4,83:1, masaüstü kuşluk gövdesi 5,99:1. Ayrıntı `ekran/gelistir2-2026-10-04/gpu/kontrast.txt`.

### Önceki tur

| Ölçüt | Önce | Sonra | Not |
|---|---|---|---|
| Mobil LCP, CPU 4× + yavaş 4G, 3 koşu medyanı | 12 224 ms (canlı) | 2 936 ms (yerel) | LCP = h1 |
| CLS | 0,0085 / 0 | 0,0123 / 0 | Bu tur (başsız): 0,0004 / 0 |

## Borç tablosu

| # | Borç | Neden açık | Öneri |
|---|---|---|---|
| 1 | Düşük kademede (telefon) maket gölgeleri zayıf, katmanlar masaüstü kadar derin okunmuyor | Telefonda ortam gölgelemesi (AO) yok, gölge haritası 1024 | Gerçek telefonda bak; gerekirse düşük kademede kesit kenarını bir ton koyulaştır |
| 2 | Akşam karesinde güneş kameranın arkasında; evler önden aydınlanıyor, gölgeler yamaca düşüyor | Coğrafya gereği (güneş denize batıyor) | Kabul; istenirse akşam kamerası kuzeyden yan ışığa alınır |
| 3 | ~~Yazılım çizicide sahne kuruluyor~~ | Kapandı (master `3d0dd15`: yazılım çizicide durağan kare) | |
| 4 | Gece mobil karede 12 evin 7'si görünür | Pencereler okunsun diye bilinçli kırpma | Kabul |
| 5 | Kamera artık bölüm sınırlarına oturuyor (`getPoint`); bazı bölümler arası geçiş eskisinden biraz hızlı | Her gündüz karesinde deniz şartı | Telefonda kaydırma hissine bak |
| 6 | THREE.Clock uyarısı, D3D "gradient in loop" gölgelendirici uyarısı | Kütüphane içi / önceden beri | Zararsız, izlenecek |
| 7 | Öğle metni "Her avluyu evin kuzeyine aldık" sahnede gösterilmiyor | Kapsam dışı | Kabul |
| 8 | ~~Villa ayrıntısı~~ | Kapandı (üçüncü tur, `scene/villa.ts`) | |
| 9 | Durağan kareler (yazılım çizici ve hareket azaltma yedeği) eski kutu villaları ve akşamı 19:40 ışığıyla gösteriyor | Kareler sahneden yeniden çekilmedi (bu turun listesinde yoktu) | 7 kareyi `?still=n` ile GPU açık yeniden çek |
| 10 | ~~Metin şeridi sahneyi örtüyor~~ | Kapandı (üçüncü tur: yalnız metin zemini) | |
| 11 | İlk boyamayla çakışan ~140 ms'lik React canlandırma görevi (soğuk tarayıcı) | Ortak Next/React yükü, demoya özgü değil | Kabul; FCP sonrası TBT'ye girmiyor |
| 12 | Telefon ölçümü masaüstü GPU'sunda öykünme; orta sınıf Android'de TBT ölçülmedi | Cihaz yok | Yayından sonra PageSpeed Insights ya da gerçek telefon |
| 13 | Yakın planda akşam sorusu geçici olarak çekiliyor | Ev panelin yanındaki alanı doldursun diye (D maddesi) | Raşit beğenmezse soru kalır, ev alt yarıya sığar |
| 14 | Telefon kademesi TBT 37 → 66 ms (öykünme) | Ev başına iki LOD geometrisi | Eşik 300 ms; gerçek telefonda bak |
| 15 | Yakın plan yalnız kadran açıkken; gündüz bölümlerinde eve tıklamak yalnız seçer | Kapsam: D maddesi akşam bölümü | Kabul |
