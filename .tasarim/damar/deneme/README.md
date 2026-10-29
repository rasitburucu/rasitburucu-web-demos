# Damar: kitap açılımı denemesi (Aşama 1 kapısı)

Tarih: 2026-10-09. Bu bir deneme sayfası; demo değildir. `app/`, `package.json` ve `node_modules` değişmedi. three.js repodaki `node_modules/three` klasöründen okunuyor (0.186.1). Yeni paket kurulmadı, doku dosyası indirilmedi.

## Nasıl açılır

Sunucunun kökü **repo kökü** olmalı, çünkü sayfa three.js'i `/node_modules/three/...` yolundan yüklüyor.

```powershell
cd "D:\Yazılım Projeleri\rasitburucu-web-demos"
python -m http.server 8765 --bind 127.0.0.1
```

Tarayıcıda açılacak adresler:
- Deneme: `http://127.0.0.1:8765/.tasarim/damar/deneme/`
- Doku galerisi (yalnız 2B, three.js kullanmaz): `http://127.0.0.1:8765/.tasarim/damar/deneme/doku.html`

Adres parametreleri (ekran görüntüsü almak için):
- `view=slab|book2|book4|wall|island`
- `stone=eflatun|duman|sirma|kiragi`
- `finish=polished|honed|antiqued`
- `slab=21`: blokta başlangıç plakası. Satılmış plakalar atlanır.
- `anim=0`: açılma hareketi olmadan açar.
- `k=0.6`: açılma hareketini o anda dondurur.
- `cam=close`: yüzey işlemi için yakın, yandan ışıklı kadraj (yalnız `slab` görünümünde).
- `cam=end`: ada tezgâhının yan paneline yakın kadraj (yalnız `island` görünümünde).
- `res=2048`: plaka dokusunun piksel genişliği.

Doku galerisi parametreleri: `doku.html?kind=gallery|single|book2|book4&stone=…&finish=…`

## Dosyalar

| Dosya | Ne |
|---|---|
| `marble-glsl.js` | Prosedürel mermer gölgelendiricisi (tek kaynak) ve dört kurgusal taşın ayarları: Eflatun, Duman, Sırma, Kırağı. Blok, 3B gürültü hacmi olarak modellenir. Her plaka bu hacmin bir dilimidir; ardışık iki plaka yalnız testere payı (5 mm) kadar farklı derinlikten gelir. |
| `marble-2d.js` | Aynı gölgelendiriciyle three.js olmadan düz WebGL2 çizici. Yön maketleri bunu kullanır. |
| `index.html`, `app.js` | three.js denemesi: tek plaka, ikili ve dörtlü kitap açılımı ("kitabı aç" hareketiyle), duvar ve ada tezgâhı sahneleri, yüzey işlemi seçimi, blok şeridi. |
| `doku.html` | Dört taşın düz galerisi. |
| `disa-aktar.html` | Plaka görsellerini bir kez üretip dosyaya çıkarır. Yön maketlerindeki `../yon-dokular/*.webp` (34 dosya, 0,47 MB) bununla üretildi. Siteye önerilen yol da bu: plaka görselleri önceden hazırlanır, tarayıcıda üretilmez. |
| `DOKU-ADAYLARI.md` | Gerçek taramalı CC0 doku adayları ve sınırları. |

Ekran görüntüleri: `../ekran/deneme/`. Bu klasör git'e girmez.
- `deneme-ikili.png`: ikili açılım (Eflatun, cilalı)
- `deneme-dortlu.png`: dörtlü açılım (Kırağı, cilalı)
- `deneme-tezgah.png`: ada tezgâhı, ortada ek yeri, iki uçta damarı devam eden yan paneller (Eflatun)
- `deneme-tezgah-uc.png`: aynı ada, yan panele yakın bakış
- `deneme-duvar.png`: dörtlü açılımlı duvar, 4,80 × 3,00 m (Duman, honlu)
- `deneme-acilis.png`: "kitabı aç" hareketinin ortası (Sırma)
- `deneme-tek-plaka.png`: ham kenarlı tek plaka (Sırma)
- `deneme-yuzey.png`: cilalı, honlu ve eskitme yüzeyin yandan ışıkta yakın çekimi (Duman)
- `deneme-dokular.png`: dört taşın düz galerisi
- `deneme-390.png`: telefon genişliği (kumanda paneli alt yarıda, plaka üstte)

## Ölçüm (yerel, 2026-10-09)

| Durum | Süre |
|---|---|
| İlk açılış, RTX 4070 SUPER (ANGLE D3D11) | **7,3 sn**. Bunun büyük kısmı gölgelendiricinin derlenmesi. |
| Sonraki her değişiklik, aynı ekran kartı | 33–129 ms (2–4 plaka dokusu) |
| Ekran kartı olmadan (SwiftShader, yazılımla çizim) | ilk açılış 18 sn; sonraki her değişiklik 4–20 sn |

Bu sonuç demo için şu anlama geliyor: **dokular tarayıcıda üretilmemeli.** Plaka görselleri önceden hazırlanmış dosyalar olmalı; ya prosedürelden bir kez çıkarılmış WebP ya da gerçek fotoğraf. Kitap açılımının kendisi ise ucuz bir iş: aynı görüntüyü yansıtmak anında oluyor.

## Dürüst yargı

**Çalışan:**
- Kitap açılımı doğru ve ilk bakışta anlaşılıyor. İkili ve dörtlü açılımda damarlar ek yerinden ayna gibi açılıyor. Plakalar bloğun ardışık dilimleri olarak üretildiği için ikiz plakalar birebir aynı değil. Ana damarlar ek yerinde buluşuyor, ince damarlarda küçük farklar var; gerçek taşta da durum böyle. (Taze göz turunda ilk sürüm "birebir ayna, bilgisayarda çevrilmiş gibi" bulundu; ince damarlar derinliğe duyarlı yapıldı. Ölçülen fark artık görülebiliyor.)
- "Kitabı aç" hareketi kavramı açıklamaya gerek bırakmıyor: üstteki plaka sayfa gibi açılıp yanına yatıyor.
- Ada tezgâhında damar ek yerinden ve köşeden yan panele geçerek devam ediyor. Satıcının en çok övündüğü detay bu ("vein-matched waterfall").
- Blok şeridi "bu bloktan kaç plaka kaldı, hangileri yan yana" sorusunu cevaplıyor.
- Yüzey işlemi yakın çekimde ayırt ediliyor: cilalıda parlama, honluda mat yüzey, eskitmede kabartı. Uzaktan bakınca fark azalıyor; gerçekte de öyle.

**Zayıf:**
- Doku hâlâ "çizim" gibi duruyor. Damarlar fazla düzenli ve çizgisel; taşın kristal derinliği ve yarı saydamlığı yok. **Bir taşçı ilk bakışta bunun gerçek taş olmadığını anlar.** Bir iç mimar bunu "görselleştirme" diye kabul eder, ama belirli bir taşı bu görüntüye bakıp seçmez.
- Duvar ve ada sahneleri temiz, ama düz kutulardan oluşan bir bilgisayar çizimi düzeyinde kalıyor. Oda hissi yok.
- Gölgelendiricinin derlenmesi ilk açılışta 7 sn sürüyor, ekran kartı olmayan cihazda dakikaya yaklaşıyor. Bu hâliyle canlı siteye konamaz; çözümü yukarıdaki "Ölçüm" bölümünde.

**Kapı kararı (önerim):**
- **Araç geçti, prosedürel dokuyla gerçekçilik geçmedi.** Damar devam edebilir, şu şartlarla:
  1. İmza an düz plaka görünümüne kurulur: ikili ve dörtlü açılım, "kitabı aç" hareketi ve blok şeridi.
  2. 3B oda sahnesi ikincil kalır; tek bir sade duvar görünümüyle sınırlanabilir.
  3. Dokular sitede "temsili" etiketiyle durur.

**Gerçek doku gelince ne değişir:**
- Firmanın kendi plaka fotoğrafı (her plaka için düz ve renk ayarlı çekim) geldiğinde yansıtma işlemi aynen kalır, gerçekçilik ise fotoğrafın kalitesine çıkar. Taşçıyı ikna eden de bu olur: kendi plakasını görür.
- Prosedürel modelin tek artısı ardışık dilimlerdi; gerçek müşteride bu zaten var, çünkü plakalar sıra numarasıyla tek tek fotoğraflanıyor.
- CC0 taramalar bu boşluğu doldurmuyor (`DOKU-ADAYLARI.md`).
- Gerçek bir müşteride en büyük yük, her plakanın renk ayarlı fotoğrafı. Bu yük satış konuşmasında baştan söylenmeli.
