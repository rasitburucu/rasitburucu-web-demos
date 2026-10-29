# THIRD_PARTY ek: Yedi Pencere (kök `THIRD_PARTY.md`'ye birleştirilecek)

Tarih: 2026-10-09. Demo: `yedipencere` (rasitburucu.com/web/yedipencere/). İndirme izni: Raşit, 2026-10-09 (yalnız aşağıdakiler; başka dosya indirilmedi).

## Yazı karakterleri
| Varlık | Kaynak | Lisans | Ne için | Dosya |
|---|---|---|---|---|
| Spectral Light, Regular (300, 400) · The Spectral Project Authors (Production Type) | github.com/google/fonts/tree/main/ofl/spectral (raw.githubusercontent.com, 2026-10-09) | SIL OFL 1.1 | Başlıklar, oda adları, fiyat, büyük rakamlar | `app/yedipencere/fonts/spectral-{300,400}-tr.woff2` + `OFL-Spectral.txt` |
| Barlow Semi Condensed Regular, Medium, SemiBold (400, 500, 600) · The Barlow Project Authors (Jeremy Tribby) | github.com/google/fonts/tree/main/ofl/barlowsemicondensed (2026-10-09) | SIL OFL 1.1 | Arayüz, gövde, çizim notları, rakamlar | `app/yedipencere/fonts/barlow-semi-condensed-{400,500,600}-tr.woff2` + `OFL-BarlowSemiCondensed.txt` |

Kaynak TTF'ler (6 dosya, 1,1 MB) yeni ve boş bir klasöre indirildi: oturum scratchpad'i `indirilen/yedipencere-font/` (repo dışı). Alt küme worktree'den `python -P -m fontTools.subset … --flavor=woff2 --layout-features='*'` ile: Latin, Latin-1, Türkçe (ğ Ğ ı İ ş Ş ç Ç ö Ö ü Ü), tipografik noktalama, ± ≈ − × ² ₺ €, oklar (yalnız Spectral'de var; Barlow'da ok yok, oklar sitede SVG çizilir). Sitede beş woff2, toplam 149 KB (Spectral Medium da indirilip alt kümelendi, ama ilk yükü hafifletmek için kullanılmadı ve dosyası siteden çıkarıldı; kaynağı scratchpad'de). Alt küme OFL'ye göre bir değişikliktir; font adları değiştirilmedi.

## Fotoğraflar
Asıl dosyalar: `.tasarim/yedipencere/foto/` (10 dosya, 12 MB; Unsplash'in resmî indirme bağlantısıyla `w=2400`, Pexels'te `w=2400`). Sitede kullanılan türevler `public/yedipencere/foto/*.webp` (`scripts/process-yedipencere-images.mjs`: pencere ya da kapı boşluğunun oranında kırpım, hepsine aynı hafif renk ayarı, WebP). Fotoğraflar yalnız çizilmiş pencere camının ya da kapı boşluğunun içinde görünür. Hiçbir karede kişi ana konu değil; gerçek otel adı ya da logosu yok.

| Dosya (asıl) | Ne gösteriyor · nerede | Fotoğrafçı | Sayfa | Lisans | Sitede |
|---|---|---|---|---|---|
| `korfez_igor-sporynin_jxAhpeXqylQ.jpg` | Falezden körfeze gün batımı, Beydağları · Kaleiçi, Antalya | Igor Sporynin | https://unsplash.com/photos/a-body-of-water-with-trees-and-mountains-in-the-background-jxAhpeXqylQ | Unsplash License (ücretsiz) | Körfez odasının penceresi |
| `hidirlik_sergey-konstantinov_QWxc5zGHMxc.jpg` | Gün batımında Hıdırlık Kulesi, körfez ve dağlar · Antalya | Sergey Konstantinov | https://unsplash.com/photos/a-view-of-a-body-of-water-with-mountains-in-the-background-QWxc5zGHMxc | Unsplash License (ücretsiz) | Hıdırlık odasının penceresi |
| `kosk_igor-sporynin_YUu9QqvNy64.jpg` | Kaleiçi çatıları, körfez ve dağlar (gündüz) · Kaleiçi, Antalya | Igor Sporynin | https://unsplash.com/photos/a-group-of-houses-next-to-a-body-of-water-YUu9QqvNy64 | Unsplash License (ücretsiz) | Köşk odasının üç bölmeli penceresi |
| `taslik_kseniia-ilinykh_xG2uKMgxGzw.jpg` | Arnavut kaldırımlı dar sokak, cumbalı evler · Kaleiçi | Kseniia Ilinykh | https://unsplash.com/photos/a-narrow-street-with-buildings-and-a-clock-tower-in-the-distance-xG2uKMgxGzw | Unsplash License (ücretsiz) | Taşlık odasının penceresi |
| `cumba_daniel-silva_0WMdxGvqhfE.jpg` | Cumbalı evler ve ağaçlı sokak · Kaleiçi, Antalya | Daniel Silva | https://unsplash.com/photos/a-narrow-cobblestone-street-lined-with-buildings-0WMdxGvqhfE | Unsplash License (ücretsiz) | Cumba odasının üç bölmeli penceresi. Uzaktaki küçük dükkân tabelası ve kapı levhası türevde yumuşatıldı (okunmuyor) |
| `avlu_yana-ralko_5fixJa9vMoU.jpg` | Meyve vermiş turunç ağaçları, avlu · Sevilla, İspanya | Yana Ralko | https://unsplash.com/photos/orange-trees-with-ripe-fruit-in-a-courtyard-5fixJa9vMoU | Unsplash License (ücretsiz) | Avlu odasının penceresi (çim alt kısım kırpıldı) |
| `sofa_bob-jenkin_k6Fia0wSpvc.jpg` | Ahşap galeri korkuluğu ve avludaki turunç · konum yazılmamış | Bob Jenkin | https://unsplash.com/photos/orange-tree-with-ripe-fruit-in-courtyard-k6Fia0wSpvc | Unsplash License (ücretsiz) | Sofa odasının penceresi |
| `ic-zemin_merve-eglence_27772361.jpg` | Taş duvarlı, ahşap kirişli oda, pencere önü sedir · konum yazılmamış | Merve Eğlence | https://www.pexels.com/photo/a-room-with-a-window-and-a-bed-with-curtains-27772361/ | Pexels License (ücretsiz) | Zemin kat odaları (Taşlık, Avlu), kapı boşluğunda. Şapkadaki yazı kırpımın dışında |
| `ic-birinci_mesut-musluer_11987617.jpg` | Süslemeli ahşap tavan, sedir, yüklük · Çankırı | Mesut Musluer | https://www.pexels.com/photo/empty-cushion-chairs-11987617/ | Pexels License (ücretsiz) | Birinci kat odaları (Cumba, Sofa, Körfez), kapı boşluğunda |
| `ic-kosk_helloaesthe_15699340.jpg` | Çatı ahşabı altında taş duvarlı yatak odası · konum yazılmamış | hello aesthe | https://www.pexels.com/photo/bedroom-interior-design-in-rustic-home-15699340/ | Pexels License (ücretsiz) | Köşk katı odaları (Hıdırlık, Köşk), kapı boşluğunda |

Lisanslar sayfalarından okundu (2026-10-09): Unsplash sayfalarında "Free to use under the Unsplash License" (hiçbiri Unsplash+ değil); Pexels sayfalarında "Free" (Pexels License). Atıf zorunlu değil; yine de sitede alt bilgideki "Proje künyesi"nde fotoğrafçı adı ve bağlantısıyla anılıyor.

## Harita ve yol verisi
| Veri | Kaynak | Lisans | Ne için | Dosya |
|---|---|---|---|---|
| Kaleiçi ve çevresinde yürünebilir bütün yollar (sokak, yaya yolu, merdiven; ad, yüzey, basamak sayısı, eğim etiketleri), tarihî yapılar (Hıdırlık Kulesi, Kesik Minare, Saat Kulesi, Hadrian Kapısı…), panoramik asansör | OpenStreetMap, Overpass API ile derleme öncesi (`scripts/fetch-yedipencere-route.mjs`, ham önbellek `scripts/.raw/yedipencere/`, git dışı); 2026-10-09'da overpass.openstreetmap.fr yanıt verdi | ODbL 1.0 · © OpenStreetMap katkıda bulunanlar; atıf her şeridin altında ve künyede | "Kapıdan kapıya" yürüyüş şeritleri: beş gerçek başlangıç noktasından kurgusal kapıya en kısa yol ve basamaksız ("bavul") yol, metre, basamak, yüzey, dönüşler, yol üstündeki yapılar | `content/yedipencere/route-geo.json` |
| Yükseklik (SRTM 30 m) | OpenTopoData genel API'si, derleme öncesi aynı betikle | SRTM kamu malı (NASA) | Başlangıç ve kapı yüksekliği (ör. Yat Limanı 2 m → kapı 32 m); sokak ölçeğinde eğim çıkarılmadı | aynı JSON |

OSM'de eksik olan basamak sayıları ve yüzeyler sitede "örnek ölçüm" etiketiyle doldurulur (kaynak: `content/yedipencere/arrival.ts`); gerçek müşteride personel rotaları bir kez yürüyüp sayar.

## Kendi üretimimiz
Konağın üç cephesi, bakış yönü anahtarı, pencere ve panjur çizimleri, kapıdan odaya basamak şeması, basamak profili, konak kesiti, iç görünüşler, yürüyüş şeridi, favicon: bu proje için elle kodlanmış SVG. Gerçek bir yapının rölövesi kopyalanmadı (Eldem vb. çizimlerin dili öğrenildi, çizim alınmadı). 3B, render, yapay zekâ üretimi görsel yok.

## Kütüphane
Yeni paket eklenmedi. sharp (repo bağımlılığı) görsel türevleri için; fontTools (Python, yerel kurulu) alt küme için.
