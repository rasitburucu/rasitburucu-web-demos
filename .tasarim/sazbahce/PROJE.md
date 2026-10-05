# PROJE: Sazbahçe (konsept demo)

- Tarih: 2026-10-05 · Durum: yön (3 aday + ilk ekran prototipleri hazır, seçim bekliyor)
- Repo: `D:/Yazılım Projeleri/rasitburucu-web-demos` · rota önerisi `app/sazbahce` → `rasitburucu.com/web/sazbahce/` · Tür: konsept demo (kurgusal marka)
- Vitrinin 5. demosu. Aynı repoda Onikitaş (villa), Revak (okul), Kalemkâr (restoran), Pazı (cobot) var; paralelde otel demosu yürüyor.

## Tasarım okuması (tek satır)
Bunu şöyle okuyorum: tarih ve teklif odaklı bir mekân sitesi, evlenecek çiftler (akşam, telefon, aileyle paylaşarak) ve kurumsal etkinlik planlayıcıları (gündüz, masaüstü) için; göl kıyısı, saz ve söğüt dili; ana hamle, takvimin ve tören planının sitenin ilk ekranında çalışması.

## Konu ve iş
- Konu: Varsayım: Bursa'da, Uluabat Gölü'nün doğu kıyısında (Gölyazı'ya yakın) kurgusal bir düğün ve davet bahçesi. Eski bir balıkçı ağ ambarı ve göle uzanan iskele restore edilmiş; çayır batıya, göle bakar. Gerçek dünyadaki karşılığı: Sapanca, Abant, Gölyazı çevresindeki "kır düğünü / göl kenarı davet" mekânları; İstanbul'a yaklaşık iki saat (Osmangazi Köprüsü üzerinden), Bursa sanayisine yarım saat.
- Neden bu coğrafya: Bodrum (deniz), Alaçatı (Ege kasabası), Gaziantep (taş, bakır), Gebze (fabrika), İstanbul (okul) kullanıldı. Göl; deniz değil, durgun su, saz, söğüt, nilüfer, gün batımı demek. Alkol vurgusu yok.
- Kurgusal alanlar (Varsayım, mekân verisi; kanıt değil):
  | Alan | Tür | Oturarak kapasite | Not |
  |---|---|---|---|
  | Söğüt Çayırı | açık, göle bakar | 80–360 | Nisan–Ekim |
  | Ağ Ambarı | kapalı, ahşap çatı | 40–200 | dört mevsim; kurumsal sunum |
  | Ceviz Avlusu | avlu | 30–140 | kına, nişan |
  | İskele | nikâh kürsüsü | 90'a kadar sandalye | yalnız tören |
- Sitenin tek işi: ziyaretçinin bir tarih seçip tören türü, misafir sayısı, alan, saat dilimi ve ikramla **teklif talebi özeti** oluşturması ve bunu göndermesi (demoda gönderilmez) ya da ailesiyle paylaşması. Fiyat yok; özet fiyat yerine geçer.
- Kitle ve kullanım sahnesi:
  - Evlenecek çift: akşam, telefonda, kanepede; ekran görüntüsü alıp aile grubuna atar. Acelesi yok ama dikkati kısa; ilk ekranda "o gün boş mu" cevabını ister.
  - Kurumsal planlayıcı (bayi toplantısı, lansman, yılsonu yemeği): gündüz, masaüstü; kapasite, yerleşim düzeni (uzun masa, tiyatro), ulaşım ve kapalı alan sorar.
  - Aile büyükleri: paylaşılan bağlantıyla gelir; okunur punto ve sade dil ister.
- Yüzey modu:
  | Sayfa | Mod |
  |---|---|
  | Ana sayfa (takvim + yapılandırıcı + özet) | Kullanım + İkna |
  | Alanlar (çayır, ambar, avlu, iskele) | İkna |
  | Kurumsal | İkna + Kullanım (kapasite tablosu, yerleşim seçimi) |
  | Teklif özeti / paylaşım sayfası | Kullanım |
  | Yol tarifi, SSS, kurallar (müzik saati, yağmur planı) | Okuma |

## İçerik envanteri
| İçerik | Var mı | Kaynak | Not |
|---|---|---|---|
| Metin | Taslak | Bu klasör (prototip metinleri) | TR önce; Raşit onayı. EN sonra |
| Fotoğraf / video | Yok | — | Prototiplerde görsel tamamen prosedürel (SVG/canvas). İnşada: göl, saz, söğüt, iskele fotoğrafı gerekecek (Unsplash/Pexels, yerel kopya, `THIRD_PARTY.md`) ya da Blender sahnesi. Tanınabilir çift yüzü yok |
| Logo, renk, font | Prototipte var | Google Fonts (OFL) | Anybody, Onest, Sofia Sans (+Extra Condensed), Funnel Display/Sans: hepsi SIL OFL, latin-ext ile Türkçe glif tam; ₺ yalnız Anybody/Onest'te var (fiyat yazmadığımız için sorun değil) |
| Gerçek kanıt | Yok | — | Uydurma çift yorumu, "500+ düğün", ödül, basın logosu yazılmaz |
| Doluluk takvimi | Kurgu | Tohumlu sahte veri | Sitede "örnek doluluk" diye etiketlenmeli |
| Gün batımı saatleri | Gerçek hesap | NOAA güneş denklemi, 40,17 K / 28,60 D, UTC+3 | Ufuk hizasına göre ±2–3 dk; tepe gölgesi hesaba katılmaz |
| 3B / ses | Yok | — | Gerekmez |

İçerik açıkları (kim sağlayacak):
1. Fotoğraf seti (göl, iskele, çayır kurulumu, ambar içi, kurumsal düzen): Claude stok seçer, Raşit onaylar; ya da Blender sahnesi (süre artar).
2. Kurgusal alan kapasiteleri ve kurallar (müzik saati 00.30, yağmur planı, araç sayısı): Varsayım; Raşit onaylar.
3. Nilüfer mevsimi bilgisi (C yönünün ana cümlesi): Uluabat'ta nilüfer olduğu yaygın biliniyor; çiçeklenme aralığı kaynakla doğrulanacak.
4. İkram seçenekleri ve menü dili: alkolsüz, sade adlar; Raşit onaylar.
5. EN metin: TR onayından sonra.

## Kısıtlar
- Diller: TR (EN sonra) · Süre: demo dikey dilimi (ana sayfa + 1 alan sayfası + teklif akışı) · Bütçe: 0 (OFL font, prosedürel ya da ücretsiz lisanslı görsel) · İçeriği düzenleyen: Claude, `content/sazbahce/*.ts` · Barındırma: statik export, `npm run sync:site` ile ana siteye.
- Formlar hiçbir yere gönderilmez; "Konsept çalışma — rasitburucu.com" şeridi her sayfada.
- Alkol, şarap, kadeh vurgusu yok. Fiyat yok (bkz. Açık kararlar).

## Hedef ve "bitti" ölçütü
- Hedef: satış vitrini (yüksek bütçeli mekân sahibine "bunu istiyorum" dedirtmek) + portföy.
- Bitti ölçütü: kalite tabanı geçti (kontrast, klavye, azaltılmış hareket, Türkçe), telefon ve masaüstünde gerçek kaydırma kareleriyle çakışma kontrolü yapıldı, taze göz puanı ≥ 7,5, TR metin Raşit onaylı.

## Açık kararlar
| Karar | Seçenekler | Kim | Tarih |
|---|---|---|---|
| Yön seçimi | A Kıyı Planı / B Altın Saat / C Nilüfer / Kanon | Raşit | — |
| Marka adı | "Sazbahçe" (öneri; aramada aynı adlı mekân çıkmadı) | Raşit | — |
| Fiyat aralığı gösterilsin mi | Hayır (öneri): yalnız teklif özeti. Seçenek: alan başına "örnek" etiketli kişi başı aralık, ayrı satırda ve kurgu notuyla. Risk: uydurma TL rakamı sahte kanıt gibi okunur ve gerçek müşteriye yanlış beklenti verir | Raşit | — |
| Fotoğraf mı, prosedürel mi | Yön seçimine bağlı (A ve C prosedürelle yaşar; B'de fotoğraf gereksiz) | Raşit | — |
