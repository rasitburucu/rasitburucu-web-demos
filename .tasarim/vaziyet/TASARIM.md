# TASARIM: Vaziyet

İnşadan sonra, kodda gerçekten kullanılan değerlerden yazıldı. Sonraki değişiklikler bu dosyaya uyar ya da dosyayı günceller.

- Son güncelleme: 2026-10-09 · Adres: `/web/vaziyet/` (worktree `rasitburucu-web-demos-wt/vaziyet`, dal `demo/vaziyet`, commit yok)
- Sayfalar: `/web/vaziyet/`, `/modeller/`, `/modeller/{sundurma,sofa,hayat,cumba,avlu}/`, `/nasil-uretiyoruz/`, `/ruhsat-ve-imar/`, `/teklif/`, `/teklif/vaziyet-plani/` (A4), `/404/` (+ `not-found`)

## Renk tokenları (`app/vaziyet/vaziyet.css`, `.vz-root`)
| Değişken | Değer | Not |
|---|---|---|
| `--vz-mat` | #1d5444 | kesim matı yeşili: araç, bantlar, başlık; `theme-color` aynı |
| `--vz-mat-deep` / `--vz-mat-night` | #123a2f / #0f2f26 | şerit, alt bilgi, kapanış / telefon alt çubuğu |
| `--vz-on-mat` | #f3f6f2 | mat üstünde metin, 8,0:1 |
| `--vz-on-mat-2` | #c9dbd3 | mat üstünde ikincil metin, 6,1:1 |
| `--vz-on-mat-3` | #a9c7bc | mat üstünde küçük not ve etiket, 4,8:1 |
| `--vz-paper` / `--vz-card` | #f4f1ea / #fbfaf6 | maket kartonu (okuma sayfaları) / kart |
| `--vz-ink` / `--vz-ink-2` | #13201b / #4b5e57 | metin 14,9:1 / ikincil 6,1:1 (kâğıtta) |
| `--vz-cork` / `--vz-cork-edge` / `--vz-cork-dark` | #c89b68 / #9e7445 / #7a5530 | arsa levhası, kenarı, çekme şeridi tonu |
| `--vz-cobalt` / `--vz-cobalt-hi` / `--vz-cobalt-deep` | #3157d5 / #2a4cc0 / #1b3790 | ev ve ana düğme (üstünde beyaz 6,1:1), hover, bağlantı ve oyma pencere |
| `--vz-red` | #e5392d | yalnız dolgu: taşan parça (plan ve maket) |
| `--vz-red-ink` / `--vz-red-on-mat` | #b42318 / #ffb3ac | kâğıtta kırmızı metin ve "Olası ihlal" etiketi zemini (beyaz 6,6:1) / matta kırmızı metin 5,1:1 |
| Yol kartonu, ağaç | #8c9996, #3e8a4e / #5ba86a | çizimde |

Kırmızı yalnız kural dışı (olası ihlal) için. Sarı ana vurgu yok (Pazı ve Sazbahçe'den ayrışma). Fosforlu yeşil (#e6f5a8) yalnız "belgede nerede yazar" satırında.

## Tipografi
| Rol | Font | Ayar |
|---|---|---|
| h1 (araç) | Gabarito (yerel woff2, wght 400–900) | masaüstü `clamp(2.2rem, 1.15rem + 1.95vw, 3.25rem)`, telefon `clamp(2.05rem, 1.3rem + 3.6vw, 2.6rem)`, 800, satır 0,98, −0,02em |
| h1 (sayfalar) / h2 / h3 | Gabarito | `clamp(2.3rem, 1.25rem + 2.7vw, 3.55rem)` 800 / `clamp(1.85rem, 1.25rem + 1.7vw, 2.9rem)` 800 / 1.25rem 750 |
| Logo | Gabarito | 1.6rem, 800 |
| İri rakamlar (skor, fiş) | Gabarito, `tnum` | 1.5–2rem, 720–800 |
| Gövde, form, çizim yazıları | Host Grotesk (yerel woff2, wght 300–800) | 1.0625rem / 1.55; rakamlar varsayılan eş genişlikte |
| Belge satırı | sistem mono (ui-monospace, Cascadia Mono, Consolas) | yalnız örnek imar durumu satırları |

Büyük ekran: kök font 1800 px'te %106,25, 2300 px'te %118,75 (yerleşim aynı, ölçek büyür). "TL" yazılır (₺ yok).

## Boşluk ve ölçü
- Kenar boşluğu `--vz-gutter: clamp(1rem, 3vw, 2.5rem)`, içerik genişliği `--vz-max: 86rem`, araç `120rem`.
- Bant dikey boşluğu `--vz-sec-y: clamp(3.5rem, 2rem + 4.5vw, 7rem)`.
- Radius: kart ve görsel 10 px, düğme 7 px, küçük düğme 6 px, çip ve sekme 999 px.
- Dokunma hedefleri telefonda ≥ 44 px (girdiler, pusula hücreleri, çipler, Plan/Maket, alt çubuk); masaüstünde fare için pusula 30 px, çip 36 px.
- Araç masaüstünde tek ekran: sol sütun 440 px (≥1200), plan yüksekliği `clamp(360px, 100svh − üst − 318px, 920px)`.

## Çizim kuralları (`components/vaziyet/arac/Plan.tsx`)
- Dünya birimi metre; plan yazıları ekranda ~12,5 px kalacak şekilde ölçeklenir (ResizeObserver).
- Katmanlar: mat ızgarası (1 m ince, 5 m kalın) → yol kartonu ve kesikli orta çizgi → mantar arsa → çekme şeridi (koyu mantar, evenodd) → beyaz kesikli yapılaşma sınırı → bahçe etiketleri → ağaç gölgesi ve ağaç → ev gölgesi → ev (kobalt, mahya çizgisi) → taşan parça (kırmızı tarama) → kırmızı ölçü → ev adı → salon oku → kuzey oku (halka içinde).
- Basılı taslak (`tur="pafta"`): mat yok, mantar açık ton, çekme şeridi taramalı, toplam ölçüler ve evin dört sınıra uzaklığı mavi ölçü çizgileriyle.
- Kat planı (`KatPlani.tsx`): duvarlar odaların arasında kalan boşluktur (dış 15 cm, iç 10 cm); oda m²'si çizimin kendi alanı. Islak hacim mavi-gri, servis bej.

## Hareket envanteri
| An | Tetikleyici | Süre / eğri | Azaltılmış hareket |
|---|---|---|---|
| Evin inişi (odak an) | model ya da dönüş değişince | planda 420 ms ölçek 1,22→1 + opaklık, `cubic-bezier(.16,1,.3,1)`; makette 6 m yukarıdan 420 ms ease-out | yok, ev anında yerinde |
| Plan ↔ maket | "Maket" / "Plan" | maket ilk karede plana birebir oturur, 180 ms belirir, sonra 620 ms eğilir (ease-in-out); dönüşte tersi | eğilme anında |
| Kural işareti ✕ | kural bozulunca | 260 ms ölçek 0,4→1 | yok |
| Düğme, çip, alan | hover / basma | 120–140 ms renk; basınca ölçek 0,97 | süre ~0 |
| Telefon alt çubuğu | alt bilgi görünürken | 220 ms aşağı kayar | süre ~0 |
| Sayfa kaydırma | bağlantı | `scroll-behavior: smooth` yalnız `no-preference` | anında |

Kamera sabit (serbest döndürme yok). Maket `frameloop="demand"`: yalnız değişince çizer.

## Bileşen envanteri
| Bileşen | Dosya | İş |
|---|---|---|
| Arac, DurumKutusu, Skor, RuhsatNotu | `components/vaziyet/arac/Arac.tsx` | ilk ekran aracı, durum ve öneri, skor şeridi, ruhsat notu |
| Plan | `components/vaziyet/arac/Plan.tsx` | kuşbakışı plan (sürükle, yön tuşu, Enter = çevir), basılı ve boş türleri |
| Maket | `components/vaziyet/arac/Maket.tsx` | R3F maket, tembel yüklenir; etiketler DOM'da, izdüşümle |
| Kurallar, Pusula | `components/vaziyet/arac/Kurallar.tsx` | kural kartı, "belgede nerede yazar", "Belgem elimde yok", yol yönü |
| Raf, EvIkon | `components/vaziyet/arac/Raf.tsx` | model rafı, aynı ölçekte izometrik ev |
| Fiyat (+ Katmanlar) | `components/vaziyet/home/Fiyat.tsx` | canlı maliyet dökümü ve patlatılmış maket çizimi |
| Surec | `components/vaziyet/home/Surec.tsx` | mat ızgarası üstünde hafta cetveli |
| RuhsatBand, ModellerBand, UretimBand, Kapanis | `components/vaziyet/home/Bantlar.tsx` | ana sayfa bantları |
| ModelListe, ModelSayfa, KatPlani | `components/vaziyet/pages/` | modeller, model ayrıntısı, kat planı |
| Uretim (+ PanelPlani, ErisimBolumu) | `components/vaziyet/pages/Uretim.tsx` | üretim adımları, panel planı, tır ve vinç soruları |
| Rehber | `components/vaziyet/pages/Rehber.tsx` | ruhsat ve imar rehberi, örnek belge |
| Teklif, Pafta, Bulunamadi | `components/vaziyet/pages/` | teklif özeti ve form, A4 vaziyet planı taslağı, 404 |
| lib | `lib/vaziyet/{hesap,url,durum,erisim,bicim}.ts(x)` | hesap, adres kodlama, oturum durumu, erişim cevapları, biçim |
