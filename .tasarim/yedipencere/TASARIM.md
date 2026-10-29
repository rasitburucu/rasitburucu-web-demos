# TASARIM: Yedi Pencere (A · Rölöve)

Tarih: 2026-10-09 · Kod: `app/yedipencere/yedipencere.css` (bütün sınıflar `yp-` önekli), çizimler `components/yedipencere/draw/`.

## Renk (tokenlar `[data-demo="yedipencere"]` üstünde)
| Token | Değer | Nerede |
|---|---|---|
| `--yp-zemin` | #EEEDE9 | Sayfa zemini (kireç badanasının gölgesi) |
| `--yp-kagit` | #FAFAF8 | Pafta, kartlar, alt bilgi |
| `--yp-mur` | #2A201B | Metin, çizgi, koyu bant (ceviz mürekkep) |
| `--yp-mur2` | #5E544E | İkincil metin |
| `--yp-ince` | #9C938C | Yalnız ince çizgi ve kenar; metinde kullanılmaz |
| `--yp-cizgi` / `--yp-cerceve` | #D8D2CA / #CDC6BD | Ayırıcılar, pafta çerçevesi |
| `--yp-deniz` / `--yp-tas` | #D3DFE6 / #E7E0D3 | Çizim lavileri, bilgi kutuları |
| `--yp-begonvil` | #B0245E | Ana düğme zemini, seçim, yol çizgisi |
| `--yp-begonvil-d` | #8C1A4A | Vurgulu metin (sayaç, seçili ad, dönüş etiketi) |
| `--yp-begonvil-a` | #F4DDE7 | "Bu tarihlerde dolu" kutusu |
| turunç | #D9822B | Yalnız çizimdeki turunçlar |

Kontrast (WCAG formülüyle hesaplandı, 2026-10-09): mürekkep/zemin 13,57:1 · mur2/zemin 6,28:1 · mur2/kağıt 7,04:1 · mur2/taş lavisi 5,61:1 · beyaz/begonvil (ana düğme) 6,44:1 · begonvil-d/zemin 7,59:1 · begonvil-d/begonvil-a 6,92:1 · koyu bant metni #D8CEC8/mürekkep 10,28:1. Metin çiftlerinin hepsi AA (≥4,5). Yalnız devre dışı takvim günleri 2,04:1 (etkin olmayan denetim, WCAG 1.4.3 istisnası); `--yp-ince` metinde kullanılmaz (2,88:1).

## Yazı
- **Spectral** 300/400 (başlık, oda adı, fiyat, büyük sayılar; 500 ilk yükü hafifletmek için çıkarıldı, serif hiçbir yerde 400'den kalın istenmez). H1 300, `clamp(2.3rem, 1.05rem + 2.55vw, 4.1rem)`, satır 1,03, -0,022em.
- **Barlow Semi Condensed** 400/500/600 (arayüz, gövde 17 px, çizim notları 12,5–15,5 px, rakamlar `tabular-nums`).
- Barlow'da ok glifi yok: oklar ve chevronlar SVG (`components/yedipencere/ui/icons.tsx`).
- Fontlar kendi sunucumuzdan, Latin + Türkçe alt küme (`app/yedipencere/fonts/`, `next/font/local`, `display: swap`).

## Ölçü ve düzen
- Kap: en çok 1680 px (2200 px üstünde 2080 px), kenar `clamp(16px, 2.2vw, 40px)`.
- İlk ekran: `[1fr | 380px]` (1900+: 460, 2200+: 540), kart yapışkan; 1100 altında tek sütun ve kart iki sütun (pencere | olgular); 760 altında tek sütun.
- Cepheler aynı ölçekte (28 birim/m), zemin çizgileri hizalı: üç SVG, genişlikleri viewBox oranında esnek. 960 altında Sokak/Avlu/Deniz düğmeleriyle tek cephe, alt boşluk kırpılır.
- Bölüm boşluğu `clamp(40px, 2rem + 2.5vw, 76px)`; ana sayfa alt yarısı her bantta başka bir çizim biçimi: şerit, kesit, numaralı notlar, koyu bant.
- Dokunma hedefi ≥44 px (pencerelerde görünmez hit alanı, takvim günleri ≥40 px kare).

## Çizim grameri
- Çizgi kalınlığı sırası: kesit/ana kontur 1,6–2 · orta 1 · ince 0,6 · silik (#9C938C) 0,6.
- Taramalar `Defs.tsx` içinde tek yerde: moloz, sur, kiremit, Arnavut kaldırımı, taş kaplama, traverten, deniz, gölge, çakıl, ahşap, panjur lameli (küçük/büyük).
- Kot işareti: üçgen + çizgi + "+3,40" (TR virgül, EN nokta). Kesik çizgisi: zikzaklı yatay çizgi.
- Çizim içi metin: kağıt renginde 4 px kontur (`paint-order: stroke`), çizgiyle çakışsa da okunur.
- "Örnek ölçüm": şeritte kesikli kenar, listede etiket.

## Fotoğraf
- Yalnız pencere camında ve kapı/kemer boşluğunda; boşluğun oranında kırpılmış (tek pencere 150:218, üç bölmeli 276:178, kapı 3:5).
- Ortak renk ayarı: doygunluk 0,9, siyahlar hafif açık (0,94·x+9), hafif sıcak. WebP, boşluğun boyuna göre 300–1440 px.
- Kapalı panjurda manzara %42 görünür; panjur lameli %90 opak.

## Hareket
| An | Süre | Eğri | Azaltılmış hareket |
|---|---|---|---|
| Kanatların açılması (kart, oda) | 0,45 sn (+0,05 gecikme) | `cubic-bezier(.16,1,.3,1)` | Anında |
| Panjurların kapanması (cephe) | 0,45 sn | aynı | Anında |
| Basamak yolu + sayaç (kart) | 1,1 sn | `cubic-bezier(.45,0,.2,1)` | Son hâl |
| Kesitte yol (görününce) | 1,6 sn | aynı | Son hâl |
| Şeridin yürüme çizgisi | 1,2 sn | aynı | Son hâl |
| Hover/odak | 0,15 sn | — | — |
Animasyon yalnız ziyaretçi seçince oynar; ilk boyamada oynamaz (CLS ≈ 0).

## Bileşenler
Pafta (cepheler + anahtar + lejant), WindowLayer (pencere: cam, foto, kanatlar, panjur, denizlik, odak halkası), WindowDetail, StairPath, StepProfile, Section (+ RouteLine, LiveRoute), Strip + Itinerary (ArrivalTool), DoorPhoto, DateBar + DateSheet (takvim), RoomCard, BookingBand, TwoWeeks, Header/Footer/MobileBar (ortak kabuk kuralı).

## Erişilebilirlik
Pencereler `role="button"`, `aria-pressed`, Enter/Boşluk; oda seçimi `aria-live` ile okunur; çizimlerin `aria-label`'ı var; takvim günleri tam tarihle etiketli; form alanları etiketli ve hata iletisi alana bağlı; odak halkası begonvil kesikli; `prefers-reduced-motion` destekli.
