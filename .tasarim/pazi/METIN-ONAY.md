# Metin onayı: Pazı Robotik

Raşit'in onayını bekleyen yeni ya da değişen Türkçe kullanıcı metinleri. Kaynak: `content/pazi/tr.ts`.

| Tarih | Anahtar | Eski | Yeni | Neden |
|---|---|---|---|---|
| 2026-10-04 | `view.still` | (yoktu; durağan çizimde "Zemindeki operatör işaretini sürükleyin." ipucu ve görünüm/hız/durdur düğmeleri görünüyordu ama çalışmıyordu) | Bu cihaz 3B hücreyi çalıştırmıyor; aynı hesapla çizilmiş durağan görünüm gösteriliyor. | GPU'suz ya da düşük kademeli cihazda çalışmayan düğmeler ve ipucu gizlendi; ziyaretçi neden durağan çizim gördüğünü HMI şeridinde okur. |
| 2026-10-04 (gelistir2) | `scenarios.tag` | Örnek senaryo (her satırda kutulu etiket) | (kaldırıldı) | Başlık "Üç örnek iş" ve bölüm notu "Değerler örnektir" zaten örnek olduğunu söylüyor; satır etiketi başlıkla tekrar ediyordu. Sahte kanıt kuralı bölüm başındaki notla korunuyor. |
| 2026-10-04 (gelistir2) | HMI durum hücresi | "Uygun" (operatör iç bölgedeyken de) | Operatör bölgedeyken "Yavaşladı" / "Durdu"; dışarıdayken eski durum | Yeni metin yok: `safety.status` metinleri yeniden kullanıldı. Bilgi için yazıldı. |

**ONAYLANDI:** Raşit, 2026-10-04 (yalnız `view.still` satırı; firik tabağı olduğu gibi kalır).

**ONAY BEKLİYOR:** 2026-10-04 (gelistir2) tarihli iki satır.

**ONAYLANDI (ikinci tur):** Raşit, 2026-10-05, yukarıdaki yeni satırların hepsi.

## 2026-10-05 üçüncü tur (arayüz)

| Tarih | Anahtar | Eski | Yeni | Neden |
|---|---|---|---|---|
| 2026-10-05 | `strip` | Konsept çalışma. Pazı Robotik hayali bir markadır; ürünler, değerler ve senaryolar örnektir. Tasarım: Raşit Burucu | Konsept çalışma — rasitburucu.com | Ortak kural: her boyutta tek satır |
| 2026-10-05 | `nav.items` (Modeller) | Modeller (ana sayfa bölümüne bağlantı) | Modeller açılır listesi: Üç model, karşılaştırma / P12 föyü / P20 föyü / P30 föyü | Model föyleri menüden ulaşılabilir olmalı |
| 2026-10-05 | `nav.items` (Daha fazla) | (yoktu) | Daha fazla açılır listesi: Örnek işler / Tasarruf / Servis / Kaynaklar ve lisanslar | Ana sayfa bölümleri ve Kaynaklar menüden ulaşılabilir olmalı; sığmayan öğeler tek listede |
| 2026-10-05 | `footer.visit` | (yoktu) | Ziyaret | Künye şablonu (adres, saatler, Yol tarifi) |
| 2026-10-05 | `brand.phone` | (yoktu) | 0262 000 42 18 (örnek) | Künye şablonu: telefon. Kurgusal, 000 bloklu |
| 2026-10-05 | `footer.pages` | Sayfalar (5 bağlantı + Kaynaklar) | Sayfalar: menüyle aynı tam liste (13 bağlantı, Ön fizibilite dahil) | Menü ile alt bilgi tek kaynak |
| 2026-10-05 | `footer.note` | Bu demo hiçbir veri toplamaz. Formlar e-posta taslağı açar; sunucuya bir şey gönderilmez. / Konsept çalışma: Pazı Robotik, ürünleri, adresi ve senaryoları hayalidir. Tasarım ve kod: Raşit Burucu. | Pazı Robotik kurgusal bir markadır; bu site rasitburucu.com için hazırlanmış bir tasarım örneğidir. Adres, telefon, ürünler, rakamlar ve senaryolar örnektir; formlar hiçbir yere gönderilmez. | Künye şablonundaki tek konsept notu; iki eski cümle tek paragrafa indi |
| 2026-10-05 | `footer.kunye` | (yoktu) | Proje künyesi (açılır): Tasarım ve geliştirme: Raşit Burucu / 3B ve render: Robot ve hücre sahnesi tarayıcıda three.js (WebGL) ile kodla üretildi; hazır 3B model kullanılmadı. / Fotoğraflar: Fotoğraf kullanılmadı. / Yazı karakterleri: Archivo (Omnibus-Type) ve Martian Mono (Evil Martians), SIL Open Font License 1.1. / Yıl: 2026 | Künye şablonu; bilgiler credits.ts ve THIRD_PARTY.md'den |
| 2026-10-05 | `footer.copyright` | (yoktu) | © 2026 Pazı Robotik · Konsept çalışma — rasitburucu.com | Künye şablonu |
| 2026-10-05 | alt bilgi "Neden Pazı" sütunu | Neden Pazı + "Pazı: kolun yükü kaldıran kası." + üç paragraf | (alt bilgiden çıktı; `story` ve `brand.meaning` anahtarları duruyor, aynı hikâye Biz kimiz sayfasında) | Künye şablonunun üst bölümü Marka, Ziyaret, İletişim, Sayfalar |
| 2026-10-05 | `safety.howto` | Operatör işaretini plan üzerinde sürükleyin ya da aşağıdaki düğmeleri kullanın. Klavyede işarete gelip ok tuşlarıyla da taşıyabilirsiniz. | Zemindeki ayak izi işaretini plan üzerinde sürükleyin; klavyede işarete gelip ok tuşlarıyla da taşıyabilirsiniz. | İşaretin ne olduğunu ve sürüklenebildiğini açık söyler |
| 2026-10-05 | `safety.buttonsLead` | (yoktu) | Ya da işareti tek tıkla bir bölgeye gönderin: | Bölge düğmelerinin tıklanabilir olduğunu anlatır |
| 2026-10-05 | `safety.drag` | (yoktu) | Sürükleyin | İşaretin üstünde, ilk kullanıma kadar görünen etiket |

**ONAY BEKLİYOR:** 2026-10-05 üçüncü tur (arayüz), yukarıdaki 13 satır.

## 2026-10-05 üçüncü tur (3B)

Yeni ya da değişen Türkçe kullanıcı metni yok. Robot görünümü, hareketi, güvenlik planındaki çizim ve performans değişti; `content/pazi/tr.ts`'e dokunulmadı.
