# YÖN: Sazbahçe · A · Kıyı Planı

Tarih: 2026-10-05 · Seçen: Raşit · Diğer adaylar: B Altın Saat, C Nilüfer
Prototip: `yon-a.html` (ilk ekran). İnşa: `rasitburucu-web-demos-wt/sazbahce` (dal `demo/sazbahce`), rota `/web/sazbahce/`.

## Yön sözleşmesi
- **TEZ:** Mekânı slaytla değil, sizin düğününüzün planıyla tanıtırız: misafir sayısını yazdığınız anda masalar çayıra dizilir, alan dar gelirse site söyler; plan bir teknik çizim değil, mekânın akşam ışığında çizilmiş zarif haritasıdır. · Reddettiği varsayılan: gün batımı çift slaytı + Gümüş/Altın/Platin paket kartları + sayfa dibinde takvimsiz form (ve tersi: siyah-beyaz "premium editoryal" düğün dergisi).
- **KENDİ DÜNYASI:** Uluabat'ın doğu kıyısı tepeden: göl derinlik eğrileri, saz yatakları, söğüt taçları ve doğuya uzanan akşam gölgeleri, iskele tahtaları, ambar çatısının kiremit taraması, taş duvarlı avlu ve ceviz, çakıl yolda fener noktaları. Plan kâğıdı akşam gölünün fotoğrafı üstünde durur (masadaki harita). İçerik silinse plan ve göl kalır.
- **HİKÂYE:** Çift telefonda akşam açar: "o gün boş mu" (takvim, her günde 4 alan noktası) → misafir sayısını artırır, masalar halka halka dizilir → alana dokunur, alanın akşam fotoğrafı açılır → teklif özetini ailesine yollar. Kurumsal planlayıcı masaüstünde aynı planı uzun masa, tiyatro, U düzenle kurar. Alt sayfalarda alanların ayrıntısı, adım adım teklif ve ziyaret randevusu.
- **İLK EKRAN (1440×900):** Arka planda tam genişlik Uluabat gün batımı fotoğrafı (Gölyazı, gerçek göl; LCP görseli), sol sütunda fotoğraf üstünde açık renkli başlık ve alt cümle, altında kâğıt takvim kartı (her günde 4 nokta) ve seçili günün satırı (boş alanlar + gün batımı saati). Sağda büyük kâğıt plan sayfası (gölge, kâğıt dokusu): kıyı haritası, okuma kutusu (sol üst), seçili alanın akşam fotoğrafı kartı (sağ üst), planın altında künye bloğu = yapılandırıcı (tören, misafir, alan, saat, "Teklif özetini gör"). Sitenin tek işi burada gerçek biçimiyle başlar.
- **İLK EKRAN (390×844):** Fotoğraf bandı (başlık üstünde) → kâğıt plan (üstte tören çipleri, altta 4 alan sekmesi) → seçili alanın fotoğraf şeridi → takvim. Altta sabit çubuk: tarih, − misafir +, "Özet". Plan telefonda okunur: seçili alana yakınlaşır.
- **İMZA ETKİLEŞİM:** Canlı yerleşim: tören türü düzeni değiştirir (nikâh = iskeleye dönük sandalye sıraları; düğün/kına/nişan = pistin çevresinde yelpaze yuvarlak masalar; kurumsal = uzun masalar), kapasite aşılınca ya da alan o gün doluysa okuma kutusu uyarıya döner ve boş alana tek tıkla geçirir. Alana dokununca plan o alana kayar ve alanın fotoğrafı açılır.
- **BİTİŞ:** Ana sayfa "Göle karşı ilk görüşme" ziyaret çağrısıyla ve künyeli alt bilgiyle biter. 404: "Bu yol göle çıkmıyor" — planın boş kıyısı, ana sayfa ve alanlar bağlantısı.

## Raşit'le konuşulan düzeltmeler (2026-10-05, bağlayıcı)
1. **Duygu şart.** Her alanın (Söğüt Çayırı, Ağ Ambarı, Ceviz Avlusu, İskele) gerçekçi, akşam ışığına çekilmiş fotoğrafı var: alan seçilince ya da planda alana dokununca planın yanında açılır. İlk ekranda Uluabat gün batımı fotoğrafı plana derinlik verir; plan "teknik çizim" değil "mekânın zarif haritası": dolgulu göl, akşam ışığı, uzun ağaç gölgeleri, fener noktaları. (Blender bu projede kullanılmadı: tek Blender oturumu başka projede. Görseller Pexels'ten yerel indirme + ortak akşam renk düzeltmesi.)
2. **Vurgu sarısı** Pazı'nın sinyal sarısından (#F5A800) ayrışır: ayva sarısı `#E8AF56` (oklch 0.79 0.125 76; daha az doygun, bal tonunda). Üstünde mürekkep #1D3830 = 6,4:1. Metin olarak sarı kullanılmaz; koyu ayva `#7A5A12` (zeminde 5,4:1) yalnız uyarı çerçevesi ve küçük vurgu metninde.
3. **Fiyat yok.** Yapılandırıcı "teklif talebi özeti" üretir. Takvim "örnek doluluk" diye etiketli.
4. **Doğrulanmamış iddia yok.** Nilüfer mevsimi yazılmadı. Gün batımı saatleri gerçek hesap (NOAA güneş denklemi, 40,17 K / 28,60 D, UTC+3) ve "tepeler nedeniyle birkaç dakika erken olabilir" notuyla. Uzaklıklar "yaklaşık".
5. **Kapsam:** ana sayfa + Alanlar (4 alan ayrıntısı: kapasite, kurulum türleri, görsel) + Kurumsal (masaüstü planlayıcı; uzun masa, tiyatro, sınıf, U, kokteyl; teknik bilgi) + Teklif (adım adım talep ve özet; gönderilmez) + Ziyaret (yol tarifi, görüşme randevusu; gönderilmez). Menüde hepsi. Kurgusal mekân verisi (kapasite, kural) "örnek" etiketli.
6. **Telefon önce:** plan + alt çubukta tarih/misafir/özet; özet alttan açılan sayfa.

## Kadranlar (1–10)
Çeşitlilik: 5 · Hareket: 4 · Yoğunluk: 6

## Tokenlar
| Rol | Değer | Kaynak |
|---|---|---|
| zemin | #E9EDE6 | söğüt yaprağının gümüşi alt yüzü |
| kâğıt (yüzey) | #F3F5F1 | plan kâğıdı |
| mürekkep (metin-1) | #1D3830 | saz yeşili; zeminde 10,7:1 |
| metin-2 | #4F655C | zeminde 5,3:1 |
| çizgi | #A9B8AE | planın ince kalemi |
| su | #CFDFDB → #9DBDB8 | göl, kıyıdan derine |
| vurgu | #E8AF56 | ayva / sarı nilüfer (pist, ana düğme, seçili gün noktası) |
| vurgu-derin | #7A5A12 | uyarı çerçevesi, küçük vurgu metni |
| gece | #12261F | fotoğraf üstü koyu perde, alt bilgi |
| odak | #1D3830 halka, koyu zeminde #E8AF56 | |

Renk stratejisi: Sakin (kâğıt + mürekkep), vurgu yalnız pist, ana düğme ve seçim. Fotoğraf bandı tek sıcak kütle.
Tema gerekçesi: çift akşam telefonda bakar ama aile büyükleri ve kurumsal planlayıcı gündüz okur; plan kâğıt gibi açık zemin ister. Akşamı fotoğraf ve plandaki ışık taşır.

Tipografi:
| Rol | Font | Lisans | Türkçe glif | Ölçek |
|---|---|---|---|---|
| gösterim | Anybody (wdth 100–150, wght 500–850; başlıkta 112%, logoda 135%) | SIL OFL 1.1 | ✓ (alt küme, ğ Ğ ı İ ş Ş) | h1 `clamp(2.1rem, 1.1rem + 2.6vw, 3.6rem)` |
| gövde/arayüz | Onest (wght 400–700) | SIL OFL 1.1 | ✓ | 16–17 px; küçük 13–14 px |
Kural: 24 px altı metin Onest'le (Anybody geniş-kalında i noktası küçülüyor).

Boşluk: 4 tabanlı (4, 8, 12, 16, 24, 32, 48, 72) · Radius: kontrol 4 px, kart 6 px, çip 3 px, fotoğraf 4 px · Easing: `--sb-out: cubic-bezier(.16,1,.3,1)`, `--sb-io: cubic-bezier(.77,0,.175,1)`, `--sb-drawer: cubic-bezier(.32,.72,0,1)` · Süreler: geri bildirim 140 ms / durum 220 ms / alan geçişi 600 ms / masa yerleşimi 500 ms + 14 ms kademe / çekmece 420 ms.

## Hareket tezi
- Odak an: masaların pistten dışa halka halka yerleşmesi (ölçek .2→1 + opaklık, 500 ms ease-out, 14 ms kademe).
- Süreklilik: alan değişince plan o alana kayar (viewBox geçişi 600 ms) ve fotoğraf kartı çapraz geçer (220 ms).
- Geri bildirim: çip, sayaç, takvim günü 140 ms renk.
- Bütçe: 1) yerleşim, 2) alan geçişi, 3) özet çekmecesi/alt sayfası.
- Azaltılmış hareket: masalar anında yerinde, plan anında yeni çerçevede, çekmece geçişsiz açılır. Lenis ve GSAP yok (gerekmiyor).

## Sayfa akışı
| # | Bölüm | Yerleşim ailesi | Yüzey modu | Hareket | İçerik kaynağı |
|---|---|---|---|---|---|
| 1 | İlk ekran: fotoğraf + takvim + plan + künye | Fotoğraf üstünde kâğıt sayfalar (masadaki harita) | Kullanım | imza 1–2 | tr.ts, areas.ts |
| 2 | Dört alan | Yatay fotoğraf dizisi (mobilde kaydırmalı şerit) | İkna | yok | areas.ts + foto |
| 3 | Gün batımı çizelgesi | Tek satırlık gerçek veri şeridi (Nisan–Ekim) | Okuma | yok | sun.ts (hesap) |
| 4 | Bilmeniz gerekenler | İki sütun düz liste (yağmur planı, müzik saati, ulaşım) | Okuma | yok | tr.ts (örnek) |
| 5 | Kurumsal + ziyaret | Bölünmüş bant (fotoğraf + metin) | İkna | yok | tr.ts |
| 6 | Alt bilgi | Künye | — | yok | tr.ts, credits.ts |
Alt sayfalar: Alanlar (her alan bir "dosya": büyük foto, mini plan, kapasite tablosu, notlar), Kurumsal (planlayıcı + kapasite matrisi + teknik föy), Teklif (adım listesi + özet), Ziyaret (bölge haritası SVG + yol tarifi + randevu).

## Bu yönün yanlış stil izleri
- Mavi "blueprint" teknik çizim kostümü; her yere mono etiket; CAD ekranı taklidi (koordinat, katman paneli).
- Peri ışıkları kahramanı, pampas otu, makrome; şarap kadehi, kokteyl masası.
- "Hayallerinizdeki", "unutulmaz", "masalsı", "eşsiz".
- Uydurma çift yorumu, "500+ düğün", yıldız puanı.

## Benzer brif testi
Başka bir düğün mekânı brifiyle buraya varır mıydım? "Oturma planı" fikri kategoriye açık; kıyı/saz/söğüt çizim dili, göl tarafındaki pist ve "en arka masa bile suyu görür" mantığı bu kıyıya bağlı. İnşada değiştirilen: prototipteki düz kâğıt plan (teknik çizim gibi okunuyordu) akşam ışıklı, gölgeli, fotoğraf üstünde duran bir haritaya çevrildi; vurgu sarısı Pazı'dan ayrıştı.

## İstisna gerekçeleri (YZ izi listesinden kalanlar)
- Plan etiketlerinde aralıklı büyük harf (İSKELE, AĞ AMBARI): harita geleneğinin kendisi; yalnız plan içinde, sayfa başlıklarında eyebrow yok.
- Sıra numarası yalnız Teklif sayfasında (gerçek adımlar).
