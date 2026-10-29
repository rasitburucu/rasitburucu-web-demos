# PROJE: Damar (konsept demo)

- Tarih: 2026-10-09 · Durum: yön. Hazır olanlar: brif, saha araştırması, kitap açılımı denemesi ve 3 yön adayı. Seçim bekleniyor.
- Repo: `D:/Yazılım Projeleri/rasitburucu-web-demos`. Önerilen rota `app/damar`, yayın adresi `rasitburucu.com/web/damar/`. Tür: konsept demo, kurgusal marka.
- Yeni üçlünün parçası: Yedi Pencere, Damar, Pafta. Plan: `~/.claude/plans/bana-yeni-tane-elegant-wreath.md`.

## Tasarım okuması (tek satır)
Bunu şöyle okuyorum: taş kataloğu ile numune ve teklif aracını birleştiren bir B2B ihracat sitesi. Muhatabı yurt dışındaki ithalatçı, iç mimar ve proje yüklenicisi; siteye ofiste, masaüstünden, tedarikçileri karşılaştırırken bakıyorlar. Dili ocağın ve blok kayıt defterinin dili: blok numarası, kesim sırası, demet etiketi. Ana hamle şu: ziyaretçi ilk ekranda bir bloğun ardışık plakalarını kitap gibi açar, bunun kaç konteyner ettiğini görür.

## Konu ve iş
- **Konu.** Varsayım: Milas'ta (Muğla) kendi ocağı ve fabrikası olan kurgusal bir mermer ihracatçısı.
  - Gerçek dünyadaki karşılığı: Muğla'da yaklaşık 120 ocak ve 140 fabrika var (Muğla Mermerciler Derneği, 2018 civarı, basın).
  - Ürünler: blok, plaka (2 ve 3 cm), ebatlı karo. Yüzeyler: cilalı, honlu, eskitme.
  - Kurgusal taşlar: Eflatun (leylak damarlı, imza taşı), Duman, Sırma, Kırağı. Gerçek ve tescilli adlar kullanılmaz (`arastirma/RAPOR.md` §4).
- **Sitenin tek işi.** Ziyaretçi bir taş seçer, aynı bloğun ardışık plakalarını kitap gibi açıp sonucu görür, sonra **numune talebi** ya da **teklif talebi** hazırlar. Talebin yanında basılabilir teknik föy ve konteyner hesabı olur. Demo hiçbir yere gönderim yapmaz.
- **Kitle ve kullanım sahnesi:**
  - **İthalatçı ve toptancı (ABD, AB, Körfez).** Ofiste, mesai saatinde, masaüstünde. Birkaç Türk tedarikçiyi yan yana karşılaştırıyor. Sorduğu şeyler: eldeki blok ve plakalar, m², kalınlık, yüzey, teslim şartı (FOB/CIF), konteyner sayısı. Aceleci değil, titiz.
  - **İç mimar ve mimar.** Masaüstünde ve tablette, taşı projeye yazmadan önce. Sorduğu şeyler: duvarda ya da tezgâhta nasıl duracağı (kitap açılımı), teknik değerler ve standart adları, numune, föy. Kararı duyguyla verir, teknik veriyle doğrular.
  - **Proje yüklenicisi.** Miktar, teslim süresi, ebatlı kesim, CE ve performans beyanı.
  - **Siteyi satın alan kişi: Milas'taki patron.** Siteye Türkçe bakar. Görmesi gereken şey: "taşımızı dünyaya bu gösteriyor" ve rakiplerinde olmayanın bu sitede olması. Türkçe sürüm şart.
  - **Işık:** gündüz, ofis ekranı. Kategori koyu temaya alışık ama tema kararını kategori değil yön verir.
- **Yüzey modu:**

  | Sayfa | Mod |
  |---|---|
  | Ana sayfa (kitap açılımı aracı, taş seçimi, konteyner özeti) | Kullanım + İkna |
  | Taşlar (her taşın künyesi ve teknik föyü) | Okuma + Kullanım |
  | Stok (eldeki bloklar ve plakalar) | Kullanım |
  | Ocak ve fabrika | İkna |
  | Örnek projeler | İkna |
  | Numune ve teklif | Kullanım |
  | Basılabilir teknik föy | Okuma (baskı) |

## İçerik envanteri

| İçerik | Var mı | Kaynak | Not |
|---|---|---|---|
| Metin | Taslak, maketlerde | Bu klasör | Önce İngilizce yazılır (alıcının dili), Türkçesi yanında. Türkçe metni Raşit onaylar. |
| Plaka görselleri | Deneme var | `deneme/` (prosedürel) | Dokular tarayıcıda üretilmeyecek: ilk açılışta derleme 7,3 sn sürüyor. Plakalar önceden WebP olarak çıkarılır. Gerçekçilik kararı Raşit'in (`deneme/DOKU-ADAYLARI.md`). |
| Ocak, fabrika, proje görseli | Yok | — | Jüri dersi: render, düz vektör ve stok foto bir arada puan kırar. Görsel dili tek seçilir; karar yön aşamasında. |
| Logo, renk, font | Maketlerde | Google Fonts (OFL) | Yön adaylarında |
| Gerçek kanıt (sertifika, referans, fuar) | Yok | — | Uydurma yok. Gerekirse `[örnek]` etiketiyle. |
| Teknik değerler (EN 1936, 13755, 12372, 1926, 14157) | Örnek | Rakip sitelerde yayımlanan tipik aralık | `[örnek değer]`. Bütün değerler tek kaynaktan gelir; Ermaş'taki 2,68 / 2,72 çelişkisi ders. |
| Konteyner hesabı | Formül hazır | `arastirma/RAPOR.md` §3 | "Tahmini" etiketi |
| Blok ve plaka stoğu | Kurgu | Tohumlu sahte veri | "Örnek stok" etiketi |
| 3B ve ses | Deneme var | `deneme/` | Ses yok |

İçerik açıkları ve kimin sağlayacağı:
1. **Plaka görüntüsünün kaynağı:** prosedürel ("temsili" etiketiyle), Marble012 denemesi (59 MB indirme) ya da lisanslı gerçek plaka fotoğrafı (ücretli). Karar Raşit'in.
2. **Ocak ve fabrika görseli:** Blender sahnesi (ocak basamakları, blok, katrak) ya da çizim. Seçilen yöne göre Claude üretir, Raşit onaylar.
3. **Teknik değerler:** Claude, gerçekçi aralıktan `[örnek]` olarak yazar.
4. **Metinler:** İngilizceyi Claude yazar; Türkçe tabloyu Raşit onaylar.
5. **Örnek projeler:** kurgusal, `[örnek proje]` etiketli. Gerçek otel ya da marka adı geçmez.

## Kısıtlar
- **Diller:** İngilizce (varsayılan) ve Türkçe.
- **Kapsam (dikey dilim):** ana sayfa, bir taş föyü, stok, numune ve teklif özeti, basılabilir föy.
- **Bütçe:** 0 (OFL fontlar, prosedürel doku). Lisanslı doku alınırsa karar Raşit'in.
- **İçeriği düzenleyen:** Claude, `content/damar/*.ts`.
- **Barındırma:** statik export, ardından `npm run sync:site`.
- Formlar gönderilmez. Her sayfada "Konsept çalışma — rasitburucu.com" şeridi durur.
- Taş adları kurgusal. Tescilli ya da ticari ad yok, "dünyada ilk" iddiası yok. Sınırlar `arastirma/RAPOR.md` §6'da.

## Hedef ve "bitti" ölçütü
- **Hedef:** satış vitrini (Muğla, Burdur ya da Afyon'daki bir ihracatçıya "bunu istiyorum" dedirtmek) ve portföy.
- **Bitti ölçütü:**
  - Kalite tabanı geçti (kontrast, klavye, azaltılmış hareket, Türkçe karakter).
  - 390'dan 2560'a beş genişlikte gerçek kaydırma kareleriyle çakışma kontrolü yapıldı.
  - Taze göz puanı en az 7,5.
  - Türkçe metin Raşit onaylı.
  - `npm run lint` ve `npm run build` yeşil.

## Açık kararlar

| Karar | Seçenekler | Kim | Tarih |
|---|---|---|---|
| Kapı: devam mı, dur mu | Araç geçti, prosedürel doku gerçekçilikte geçmedi. Önerim: devam; imza an düz plaka görünümüne kurulur, 3B oda ikincil kalır (`deneme/README.md`) | Raşit | — |
| Yön seçimi | `YON-ADAYLARI.md`: A Blok Defteri, B Plaka Sahası, C Forma. Önerim: C, A'nın blok defteriyle (taze göz C 7,4, A 6,9, B 6,8; düzeltmelerden önce) | Raşit | — |
| Marka adı | Damar (önerim) / Varak / Beçin. Damar'ın yurt dışında aynı sektörde kısmi çakışması var (RAPOR §5) | Raşit (ucuz karar; önerim Damar) | — |
| Doku kaynağı | Prosedürel ("temsili") / Marble012 denemesi (indirme onayı) / lisanslı gerçek plaka (ücretli) | Raşit | — |
| Fiyat gösterilsin mi | Hayır (önerim): FOB/CIF/EXW dili ve teklif yeter. Uydurma fiyat sahte kanıt gibi okunur. | Raşit | — |
