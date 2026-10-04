# YÖN: Kalemkâr · A "Sini"

Tarih: 2026-10-04 · Seçen: kullanıcı (Raşit, plan `docs/plans/sef-restorani.md` §3) · Diğer aday: B "Köz" (WebGL köz efekti; süs olarak kalma riski nedeniyle elendi)

## Yön sözleşmesi
- **TEZ:** Restoranın sattığı şey oturulacak akşamın kendisi; site bunu tek bir nesneyle, şefin dedesinin kazıdığı bakır siniyle gösterir. Ana sayfada mevsim menüsü bu siniye tabak tabak servis edilir, rezervasyonda aynı sini ziyaretçinin masasına dönüşür. · Reddettiği varsayılan: "koyu zemin + altın + el yazısı logo + yemek yakın çekimi slaytı + Rezervasyon düğmesi" restoran rutini ve onun tersi olan beyaz, steril "Nordic" tadım menüsü sitesi.
- **KENDİ DÜNYASI:** Bakırcılar Çarşısı'nın dövme bakırı ve kalem kazıması, Antep taş evinin avlusu ve kubbeli kileri, isli ocak, fıstık. Işık: tek yönlü pencere ışığı, sol üstten. İçerik silinse bile kazımalı bakır sini ve tepeden çizilmiş kat planı dünyayı taşır.
- **HİKÂYE:** İlk ekranda kazımalı sini ve "kaç kişi, hangi akşam" cümlesi. Aşağı inince aynı sini küçülerek servis yerine iner, ekranda kalır ve dokuz tabak sırayla gelir. Şefin elleri ve dedenin kazıma kalemi, evin kat planı (alana dokununca o deneyimle rezervasyon açılır), dürüst kurallar, aylık açılış. Rezervasyonda sini kuverleri açar, alerji işaretini düşürür, tezgâhta uzun tepsiye dönüşür.
- **İLK EKRAN:** Asimetrik. Sol %44: Young Serif başlık (LCP metni), iki satırlık alt başlık, satır içi rezervasyon cümlesi ("[2 kişi] için [Cuma 9 Ekim] akşamı · Masalara bak"), altında bu haftanın iki boş oturumu. Sağ: Blender'da modellenmiş tepeden bakır sini, ekranın sağından ve altından taşar (yaklaşık 110vh). Kenar bandındaki kazıma yazı 120 sn'de bir tur atar; imleç bakırın üstünde gezdikçe sıcak bir parıltı onunla kayar. Görsel kütle: sini; derinlik: sini gölgesi + zeminde ince bakır tozu tanesi.
- **İMZA ETKİLEŞİM:** Servis. Giriş sinisi kaydırmayla servis sahnesine iner (tek nesne; kaydırma güdümlü CSS). Sini sağda yapışkan kalır, soldaki metin blokları kaydıkça her blok ortaya geldiğinde yeni tabak garsonun geldiği yönden (sağ üst) hafif dönüşle konur, önceki tabak sola kayarak kalkar. Kaydırmayla birebir ilerleyen bir video değil, tek tek atılan servis adımları.
- **BİTİŞ:** Aylık açılış geri sayımı ve alt bilgi. 404: boş sini, "Bu tabak menüde yok." Seçim rengi fıstık yeşili, odak halkası fıstık, favicon kazıma rozeti.

## Kadranlar (1–10)
Çeşitlilik: 6 · Hareket: 5 · Yoğunluk: 4

## Tokenlar
| Rol | Değer (OKLCH ≈ hex) | Kaynak |
|---|---|---|
| zemin | oklch(0.19 0.012 60) ≈ #17130F | Isınmış bakır kabın içindeki is |
| yüzey | oklch(0.235 0.014 60) ≈ #211B16 | Ocak taşının gölgesi |
| yüzey-2 | oklch(0.28 0.016 60) ≈ #2C241D | Kiler duvarı |
| metin-1 | oklch(0.92 0.02 80) ≈ #EEE5D6 | Kalaylı bakır kenarı, kaymak |
| metin-2 | oklch(0.74 0.02 75) ≈ #B3A794 | Taş ev bej taşı, gölgede |
| çizgi | rgba(238,229,214,.14) | Kazıma çizgisi |
| vurgu | oklch(0.73 0.09 120) ≈ #9DB26A | Antep fıstığı içi |
| vurgu-üstü yazı | #17130F | (yeşil düğmede koyu yazı) |
| odak | #9DB26A, 2 px + 3 px boşluk | |

Renk stratejisi: Sakin. Vurgu yalnız seçili durum, ana eylem, alerji işareti ve fiyat yanındaki "örnek" etiketinde. Bakır arayüz rengi değildir; yalnız fotoğrafta ve sinide görünür.
Tema gerekçesi: Akşam restoranı, akşam rezervasyonu; ziyaretçi siteyi çoğunlukla akşam telefondan açar. Koyu zemin bakırın parlamasına ve yemek fotoğrafına sahne olur.

Tipografi:
| Rol | Font | Lisans | Türkçe glif | Ölçek |
|---|---|---|---|---|
| gösterim | Young Serif 400 | SIL OFL 1.1 (yerel woff2, TR alt küme) | ✓ (₺ yok: fiyatlar gövde fontunda) | `clamp(2.6rem, 5.4vw, 5.6rem)` başlık, `clamp(1.9rem,3.4vw,3.2rem)` bölüm |
| gövde/arayüz | Geologica 300–700 (değişken, wght) | SIL OFL 1.1 (yerel woff2, TR alt küme) | ✓ | 17 px gövde, 15 px arayüz, 13 px not |

Boşluk ölçeği: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 · 112 · 160 · Radius: düğme ve çip 999px (sini dili: daire), alan 10px, panel 14px · Easing: `--kk-out: cubic-bezier(0.16,1,0.3,1)`, `--kk-io: cubic-bezier(0.77,0,0.175,1)`, `--kk-drawer: cubic-bezier(0.32,0.72,0,1)`, `--kk-scroll: cubic-bezier(0.45,0,0.2,1)` (yalnız kaydırmaya bağlı yolculuk) · Süreler (token): `--kk-t-fast` 140 ms geri bildirim / `--kk-t-state` 220 ms durum / `--kk-t-step` 380 ms adım ve sayfa girişi / `--kk-t-layout` 520 ms yerleşim (Flip) / `--kk-t-serve` 980 ms servis

## Hareket tezi
- Odak an: servis (tabağın siniye konması).
- Süreklilik: aynı sini ana sayfada giriş, oradan inerek servis tepsisi, rezervasyonda masa. Sini bileşeni tektir; ana sayfada ekranda hep bir sini görünür. Sayfalar arasında (View Transitions) görünen sini yeni sayfadaki siniye dönüşür; sayfanın geri kalanı 160 ms solar, yenisi 8px yükselerek gelir.
- Geri bildirim: çip ve düğmelerde 140 ms renk/çerçeve, basmada hafif küçülme; kuverler Flip ile yeni yerlerine kayar; rezervasyon adımı geldiği yönden (ileri: sağdan, geri: soldan) girer, ilerleme çizgisi uzar.
- Bütçe (en fazla 3 imza an): 1) servis (girişten inişi dahil), 2) kuverlerin açılması ve tezgâha dönüşme, 3) kazıma halkasının bir kez "kazınarak" belirmesi.
- Azaltılmış hareket karşılığı: 1) sini inmez: servis sinisi ekrana girince giriş sinisi saydamlıkla çekilir (yine tek sini görünür); tabak 120 ms saydamlık geçişiyle değişir, yapışkanlık sürer (bilgi aynı); sayfa geçişi 120 ms saydamlık; 2) Flip yok, anlık yerleşim; 3) halka doğrudan tam görünür, dönmez; imleç parıltısı sabit. Lenis kurulmaz.

## Sayfa akışı (ana sayfa)
| # | Bölüm | Yerleşim ailesi | Yüzey | Hareket | İçerik |
|---|---|---|---|---|---|
| 1 | Şerit + başlık | ince bant | zemin | yok | tr.strip, tr.nav |
| 2 | Giriş | asimetrik, taşan nesne | zemin | halka dönüşü, parıltı | tr.hero |
| 3 | Bu mevsim sofrada | akan metin (sol) + yapışkan sini (sağ) | zemin | sininin inişi, servis | menu.ts |
| 4 | Şef | iki fotoğraf + metin, kaydırılmış | yüzey | yok | tr.chef |
| 5 | Ev | tepeden kat planı (SVG) + seçili alanın fotoğrafı | zemin | alan vurgusu | tr.house |
| 6 | Bilmeniz gerekenler | açılır satırlar, dar sütun | zemin | yükseklik geçişi | tr.know |
| 7 | Rezervasyon takvimi | tek cümle + geri sayım | yüzey-2 | yok | tr.opening |
| 8 | Alt bilgi | dört sütun | zemin | yok | tr.footer |

## Bu yönün yanlış stil izleri
- Altın rengi, el yazısı font, "Bon appétit", şarap kadehi.
- Bakırı arayüz rengi olarak (düğme, başlık) kullanmak.
- Her bölümün aşağıdan süzülerek gelmesi; sininin her yerde tekrar etmesi (yalnız giriş, servis, rezervasyon, 404).
- Nazar boncuğu, çini deseni, "Doğu ile Batı'nın buluştuğu" söylemi.
- Deprem bölgesi ilçe adları, "yeniden doğuş" söylemi.

## Benzer brif testi
Başka bir şef restoranı brifiyle buraya varır mıydım? Koyu zemin evet, ama sini (Antep bakırcılığından), fıstık yeşili (şehrin ürünü), kazıma halkası ve kat planı başka şehre taşınamaz. Değişiklik: bakır arayüzden çıkarıldı, altın vurgu yerine fıstık; servis kaydırmaya bağlı video değil, adım.

## İstisna gerekçeleri (YZ izi listesinden kalanlar)
- "Neredeyse siyah zemin + tek yeşil vurgu": siyah, bakır kabın isinden; yeşil, Antep fıstığının içinden. Yeşil asit tonu değil, toprak tonlu (#9DB26A).
- Sayı ("3 / 9"): gerçek bir sıra (servis sırası) ve rezervasyon adımları gerçek adımlar.
- Sini kenarındaki kazıma yazıda orta nokta: bakır süslemesinin ayırıcısı, meta satırı değil.
- Bakır tonu #C9794A (tarama "kiremit vurgu" diye işaretledi): arayüz vurgusu değil; yalnız logo rozetinde ve menü sayfasındaki harita halkalarında, Blender render'ındaki bakırdan örneklenmiş ince çizgi rengi. Vurgu fıstık yeşili olarak kalır.
- GSAP yerine Web Animations API: plan GSAP öneriyordu; servis ve FLIP hareketi kütüphanesiz yazıldı, ilk yük JS 126 KB'ta kaldı.
- Servis sahnesinde metin solda, sini sağda (ilk sözleşmede tersiydi): giriş kompozisyonunun (metin sol, sini sağ) devamı. Böylece sini girişten servise ekranın öbür ucuna geçmeden, metnin üstünden kaymadan küçülerek iner; tek nesne sürekliliği bu yerleşimle mümkün.
- Tabaklar tek "evin tabağı"nda: dokuz ayrı fotoğrafçının tabakları eşleşmediği için her fotoğraftan yalnız yemek dairesi alınıp aynı prosedürel tabağa (mat krem sır, demir oksit kenar, sol üstten ışık) oturtuldu; renk ve tane ortak. Gerçek müşteride tek çekim günü bunun yerini alır.
- Uçuş yalnız `animation-timeline` destekli tarayıcıda ve ≥768px: Firefox ve telefonda iki sini saydamlıkla el değiştirir (bilgi kaybı yok, aynı anda iki sini görünmez).
