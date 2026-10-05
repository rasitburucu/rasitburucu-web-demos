# THIRD_PARTY ek: Gelidonya (kök `THIRD_PARTY.md`'ye birleştirilecek)

Tarih: 2026-10-05. Demo: `gelidonya` (rasitburucu.com/web/gelidonya/).

## Yazı karakterleri
| Varlık | Kaynak | Lisans | Ne için | Dosya |
|---|---|---|---|---|
| Big Shoulders Display (değişken, wght 100–900) | https://fonts.google.com/specimen/Big+Shoulders+Display · github.com/xotypeco/big_shoulders | SIL OFL 1.1 | Başlıklar, iri rakamlar, viyol isim kazığı | `app/gelidonya/fonts/big-shoulders-display-tr.woff2` (Latin + Türkçe alt küme, fontTools) + `OFL-BigShouldersDisplay.txt` |
| Schibsted Grotesk (değişken, wght 400–900) | https://fonts.google.com/specimen/Schibsted+Grotesk · github.com/schibsted/schibsted-grotesk | SIL OFL 1.1 | Gövde, form, etiket | `app/gelidonya/fonts/schibsted-grotesk-tr.woff2` + `OFL-SchibstedGrotesk.txt` |

Türkçe glif (ğ Ğ ı İ ş Ş) alt kümede var. Kaynak TTF: google/fonts deposu (2026-10-05 indirildi, yön aşamasında).

## Görseller (hepsi kendi üretimimiz; dış görsel yok)
| Görsel | Nasıl | Lisans | Kaynak dosya |
|---|---|---|---|
| Sera içi (`public/gelidonya/sera-ici-*`, `sera-ici-dar-*`, OG kartı) | Blender 5.2.2 Cycles, tamamen koddan: domates bitkisi, sera iskeleti, örtü, torba, boru (`scripts/gelidonya-blender/bitki.py`, `sera.py`) | Kendi çalışmamız | `.tasarim/gelidonya/blender/gelidonya-sera.blend` (kamera `GD_Kamera`) |
| Ürünlerimiz açılış görseli (`urun-*`) | Sera içi render'ının kırpımı (salkım yakın çekimi `GD_SalkimKamera` artık sitede yok) | Kendi çalışmamız | aynı .blend |
| Fidelik (`fidelik-*`) ve ziyaret görünümü (`ziyaret-*`, İletişim) | Blender, koddan: viyol, torf, fide, tezgâh (`fide.py`); kameralar `GD_FideKamera`, `GD_ZiyaretKamera` | Kendi çalışmamız | `.tasarim/gelidonya/blender/gelidonya-fidelik.blend` |
| Ova (`ova-*`) | Blender, koddan: arazi gürültüsü, sera blokları, deniz, gökyüzü (`ova.py`); gerçek harita ya da fotoğraf izlenmedi | Kendi çalışmamız | `.tasarim/gelidonya/blender/gelidonya-ova.blend` |
| Sipariş viyolü ve fideler (`viyol-*-torf`, `fide-*`) | Blender, koddan, üstten ortografik kareler (`viyol_kare.py`); tarayıcıda `lib/gelidonya/viyol-kare.ts` ile doldurulur, isim kazığı canvas (`viyol-ciz.ts`) | Kendi çalışmamız | Ana kareler `.tasarim/gelidonya/blender/render/viyol/` |
| İletişim harita kesiti | Elle yazılmış SVG (`HaritaKesiti`), gerçek harita izlenmedi, örnek konum | Kendi çalışmamız | — |

HDRI, doku ya da hazır model kullanılmadı (Poly Haven dahil). Işık: Blender gökyüzü dokusu + güneş lambası.

## Bilgi kaynakları (sitede alıntı değil, değerin dayanağı)
| Bilgi | Kaynak | Not |
|---|---|---|
| Dekara 2.800 aşısız, tek tepe domates fidesi | T.C. Tarım ve Orman Bakanlığı, Bitkisel Üretim Genel Müdürlüğü, "Topraksız Ortamda Domates Üretimi İçin Jeotermal Sera Yatırımı Fizibilite Raporu (5.000 m² Üretim Alanı)", s. 9. https://www.tarimorman.gov.tr/BUGEM/Belgeler/YATIRIMCI%20REHBER%C4%B0/Topraksiz%20Ortamda%20Domates%20Uretimi%20I%C3%A7in%20Jeotermal%20Sera%20Yatirimi%20Fizibilite%20Raporu%20(5.000%20m2%20Uretim%20Alani).pdf | Sitede kaynak bağlantısıyla. Aşılı domates 1.400 = 2.800 tepe ÷ 2 gövde (bizim türetmemiz, sitede formül açık) |
| Aşılı fide 45–60 gün, aşısız 40–45 gün; aşılı domates (çift gövde) 55–65 gün; aşılı karpuz 35–55 gün; 45 göz (domates/biber/patlıcan), 24–32 göz (karpuz/kavun); cuma–cumartesi kargo yok | agrowy.com, "Fidelikler nasıl ve ne zaman sipariş alır" (yön aşaması araştırması) | Sektör yazısı; sitede "≈" ve "örnek" |
| Biber, patlıcan, hıyar, karpuz, kavun dekar sıklığı | Kaynak bulunamadı | Sitede "Örnek değer, kaynak yok" yazar (içerik açığı) |
| Hasat sezonu ayları | Genel bölge bilgisi, kaynaksız | Sitede "örnek takvim" |

## Kütüphane
Yeni paket eklenmedi (repo bağımlılıkları: Next 15.5, React 19). three/GSAP/Lenis bu demoda kullanılmadı.
