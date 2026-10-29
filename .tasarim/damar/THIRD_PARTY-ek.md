# Damar: üçüncü taraf kaynakları (ek)

Birleştirmede kök `THIRD_PARTY.md` dosyasına ana oturum taşır. Tarih: 2026-10-09.

## Mermer fotoğrafları (Raşit izni, 2026-10-09)

İzin sınırı: yalnız Unsplash, Pexels ya da ambientCG; ücretsiz lisans; en çok 4 dosya, toplam en çok 80 MB; yalnız `.tasarim/damar/doku/`. İndirilen: 4 dosya, toplam 12,6 MB. Her dosya kendi alt klasöründe.

| Dosya (`.tasarim/damar/doku/`) | Kaynak | Yazar | Lisans | Boyut | Çözünürlük | Sitedeki taş |
|---|---|---|---|---|---|---|
| `karakalem/akbar-nemati-2yp6ICVr2VM-unsplash.jpg` | https://unsplash.com/photos/2yp6ICVr2VM | Akbar Nemati (unsplash.com/@akbarnemati) | Unsplash License (https://unsplash.com/license) | 2,66 MB | 6000 × 4000 | Karakalem |
| `sirma/akbar-nemati-nXVXHtJiDnI-unsplash.jpg` | https://unsplash.com/photos/nXVXHtJiDnI | Akbar Nemati | Unsplash License | 1,74 MB | 6000 × 3628 | Sırma |
| `kiragi/akbar-nemati-7aKvziqeTfg-unsplash.jpg` | https://unsplash.com/photos/7aKvziqeTfg | Akbar Nemati | Unsplash License | 2,32 MB | 6000 × 3538 | Kırağı |
| `duman/karolina-grabowska-pexels-6634152.jpg` | https://www.pexels.com/photo/pattern-on-gray-marble-6634152/ | Karolina Grabowska / Kaboompics (pexels.com/@karola-g) | Pexels License (https://www.pexels.com/license/) | 5,86 MB | 4480 × 6720 | Duman |

Notlar:
- Dördü de düz karşıdan çekilmiş gerçek cilalı mermer fotoğrafı (prosedürel değil). Üç Unsplash karesi aynı fotoğrafçının aynı gün aynı makineyle çektiği seriden (Sony ILCE-7M3, 2023-09-10); ışık ve renk bir arada tutarlı.
- Sitede plaka görselleri çalışma anında üretilmez. `scripts/process-damar-images.mjs` bu dört kareden her plaka için bir kez kesim alır (aynı bloğun ardışık plakaları: kayan pencere + hafif, yumuşak bükülme, böylece ikiz plakalar birebir ayna değil) ve `public/damar/` altına AVIF + WebP olarak yazar. Ayna (kitap açılımı), dörtlü açılım ve yüzey görünümü tarayıcıda yalnız CSS dönüşümü ve filtresiyle yapılır.
- Taş adları fotoğraflara göre değişti: "Eflatun" (leylak damarlı) için ücretsiz lisanslı gerçek leylak damarlı plaka fotoğrafı bulunamadı; imza taşı "Karakalem" oldu (beyaz zemin, karakalem çizgisi gibi gri damar ağı ve tek güçlü fay çizgisi). Duman, Sırma ve Kırağı adları fotoğraflara uyduğu için kaldı. "Karakalem" için hızlı aramada mermer ticari adı çıkmadı; marka tescilinde aranmadı.
- Denenip elenenler (indirilmedi, yalnız tarayıcıda bakıldı): Pexels 9990273 (breş, leylak tonlu; yakından bakınca cilasız kaya yüzü), Unsplash yJ-CjL110UI (alan derinliği bulanık), Unsplash Wfu-u_T1o3k (lekeli), Unsplash qBtmjsoO8Jo (kitap açılımı için kontrastı düşük).
- Lisans özeti: üç lisans da ücretsiz ticari kullanıma izin verir, atıf zorunlu değildir; yine de sitenin künyesinde ve burada anılır. Unsplash ve Pexels lisansları fotoğrafların değiştirilmeden tek başına satışını ve benzer bir fotoğraf hizmeti kurmayı yasaklar; bu kullanım ikisine de girmez.

## Yazı karakterleri (Raşit izni, 2026-10-09)

İzin sınırı: yalnız Brygada 1918 ve Albert Sans, kaynak google/fonts deposu, OFL, toplam en çok 5 MB. İndirilen: 4 dosya, toplam 380 KB (iki değişken TTF + iki OFL metni), oturum karalama klasörüne (`scratchpad/indirilen/damar-font/`). Siteye yalnız alt küme ve lisans metni girdi.

| Varlık | Kaynak | Lisans | Ne için | Dosya |
|---|---|---|---|---|
| Brygada 1918 (değişken, wght 400–700; Mateusz Machalski, Borys Kosmynka, Przemek Hoffer; The Brygada 1918 Project Authors) | https://fonts.google.com/specimen/Brygada+1918 · https://github.com/google/fonts/tree/main/ofl/brygada1918 (`Brygada1918[wght].ttf`, 242 KB) | SIL OFL 1.1 (ayrılmış ad yok) | Başlıklar, taş adları, sayfa numaraları, hesap ve tablo rakamları (tnum + lnum) | `app/damar/fonts/brygada-1918-tr.woff2` (22 KB) + `OFL-Brygada1918.txt` |
| Albert Sans (değişken, wght 100–900; Andreas Rasmussen; The Albert Sans Project Authors) | https://fonts.google.com/specimen/Albert+Sans · https://github.com/google/fonts/tree/main/ofl/albertsans (`AlbertSans[wght].ttf`, 129 KB) | SIL OFL 1.1 (ayrılmış ad yok) | Gövde, menü, form, etiket | `app/damar/fonts/albert-sans-tr.woff2` (32 KB) + `OFL-AlbertSans.txt` |

Alt küme: fontTools subset (worktree'den, `python -P -m fontTools.subset … --flavor=woff2`), Latin + Latin-1 + Türkçe (ğ Ğ ı İ ş Ş; ç Ç ö Ö ü Ü Latin-1'de) + tire, tırnak, üç nokta, ok ve ′ ″ işaretleri. Alt küme OFL'ye göre bir değişikliktir; font adları değiştirilmedi. Albert Sans'ta tablo rakamı (tnum) yok; değişen rakamlar bu yüzden Brygada 1918'in tablo rakamlarıyla yazılır. Albert Sans'ta ok ve ′ işareti yok; oklar SVG çizilir.

## Veri

- Konteyner hesabındaki aralıklar: `arastirma/RAPOR.md` §3 (Stone Galleria, Hangmao/b2usa, UK P&I Club, TATA AIG Marine Newslink). Sitede "tahmini" etiketiyle.
- Teknik değerler: rakip sitelerde yayımlanan tipik aralıktan yazılmış örnek değerler; tek kaynak `content/damar/stones.ts`. Sitede "örnek değer" notuyla.
