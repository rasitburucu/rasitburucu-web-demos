# Metin onayı: Revak Okulları

Raşit onaylayacak. Her satır `content/revak/tr.ts`'te.

## 2026-10-04 geliştirme turu (jüri 7,2 → hedef 7,6)

| Yer | Eski | Yeni | Neden |
|---|---|---|---|
| Ana sayfa, "Revak boyunca" başlığının altı (yeni bağlantı, `levels.skip`) | (yoktu) | Kademeleri geçin, rehberliğe inin | Yürüyüş uzun bir kaydırma; klavyeyle ya da acelesi olan veli için doğrudan rehberlik bölümüne atlama yolu |
| Telefonda üst şerit (`strip.short`, yalnız 560 px altı) | Konsept çalışma: Revak Okulları hayali bir okuldur. Rakamlar örnektir, formlar hiçbir yere gönderilmez. rasitburucu.com | Konsept: hayali okul. (rasitburucu.com'a bağlantı) | Bursluluk duyurusuyla tek satıra sığsın diye; uzun cümle telefonda alt bilgi notunda ("Revak Okulları kurgusal bir markadır…") eksiksiz duruyor. Masaüstünde değişmedi |
| Telefonda bursluluk duyurusu (`announce.leadShort`) | Bursluluk sınavı 15 Kasım | Bursluluk 15 Kasım | Aynı satıra sığma; masaüstünde "Bursluluk sınavı" kalıyor |

**ONAYLANDI:** Raşit, 2026-10-04 (bu dosyadaki bütün satırlar; firik tabağı olduğu gibi kalır).

Revak telefon şeridi kısa kalır; karşılığında ön kayıt formunun gönder düğmesi yanına tek satır not eklenecek: "Bu bir tasarım örneği; form hiçbir yere gönderilmez." (Raşit onayı, 2026-10-04)

## 2026-10-04 ikinci tur (jürinin küçük bulguları)

| Yer | Eski | Yeni | Neden |
|---|---|---|---|
| Ön kayıt, kampüs turu, bursluluk, ücret bilgisi formları ve kampüs sayfasındaki geri arama formu: gönder düğmesinin altı (`flows.common.demoNote`) | (yoktu) | Bu bir tasarım örneği; form hiçbir yere gönderilmez. | Telefon şeridi kısaldığı için not düğmenin yanına taşındı. **ONAYLI** (Raşit, 2026-10-04, yukarıdaki not) |
| "Kısaca Revak" dipnot işaretleri (`proof.lines[].ref`) | 1, 2, 3, 4 (rakamın yanında üs) | a, b, c, d (cümlenin sonunda); alttaki liste de harfle | Büyük rakamın yanındaki üs sayı gibi okunuyordu (18¹, 2³) |
| Dipnot işaretinin ekran okuyucu etiketi (`proof.refLabel`) | (yoktu) | dipnot (okunuşu: "dipnot a") | Yalnız ekran okuyucu için; görünmez |

Not: sihirbazın pasif "Devam edin" düğmesi, tur sayfasındaki "Bu kademeyi tanıyın" bağlantısının telefonda altta yinelenmesi ve bölüm başlıklarının küçülmesi yeni metin gerektirmedi (mevcut `sinifPick`, `errors.kademe`, `levels.more` kullanıldı).


**ONAYLANDI (ikinci tur):** Raşit, 2026-10-05, yukarıdaki yeni satırların hepsi.

## 2026-10-05 üçüncü tur

| Yer | Eski | Yeni | Neden |
|---|---|---|---|
| Ana başlık (`hero.title`) | Her çocuğun adıyla tanındığı okul. | Her çocuğu adıyla tanıyan okul. | Raşit: Türkçesi zayıftı. Sayfa başlığı, açıklama ve OG metninde bu cümle geçmiyor; OG görseli yazısız |
| "Revak boyunca" başlığının altı (`levels.term`, yeni) | (yoktu) | revak: sütunlara oturan kemerlerin taşıdığı, önü açık, üstü örtülü geçit. | Raşit: kelimenin anlamı tek yerde, sözlük maddesi gibi |
| "Kısaca Revak." (`proof.lines`, `proof.notes`, `proof.refLabel`) | Dört cümle a, b, c, d dipnot işaretli; altında dört dipnot ("Anaokulunda 14 çocuk ve iki öğretmen." vb.) ve ekran okuyucu için "dipnot" | Aynı dört cümle, dipnot işareti ve dipnot listesi yok | Raşit: dipnotlar kalksın, bölüm poster gibi olsun. Cümlelerin kelimeleri değişmedi |
| Üst şerit, her ekran boyutu (`strip`) | Masaüstü: "Konsept çalışma: Revak Okulları hayali bir okuldur. Rakamlar örnektir, formlar hiçbir yere gönderilmez. rasitburucu.com"; telefon: "Konsept: hayali okul." | Konsept çalışma — rasitburucu.com (bağlantı https://rasitburucu.com) | Ortak künye kuralı: dört sitede tek ve aynı şerit |
| Alt bilgi marka satırı (`brand.place`, yeni) | (yoktu) | Zekeriyaköy, Sarıyer · İstanbul | Künye şablonu: marka + tek satır yer adı |
| Alt bilgi sütun başlıkları (`footer.visitTitle`, `reachTitle`, `pagesTitle`) | Bize ulaşın · Kabul · Veliler için | Ziyaret · İletişim · Sayfalar | Künye şablonu (adres/saat/yol tarifi Ziyaret'e, telefon/e-posta İletişim'e). "Bütün birimler" bağlantısı kalktı: İletişim sayfası Sayfalar listesinde |
| Alt bilgi "Sayfalar" listesi | Kabul ve Veliler için sütunlarında 10 bağlantı | Menüyle aynı tam sayfa listesi (16 sayfa, menüden üretilir) | Künye şablonu: menüyle aynı liste, tek kaynak |
| Kabul menüsü (`nav.groups.kabul`, iki yeni bağlantı) | (yoktu) | Bursluluk başvurusu / Sınava kayıt · Ücret bilgisi isteyin / Size uyan ücret tablosu | Kural: bütün sayfalar üst menüden erişilebilir; bu iki sayfa yalnız düğmelerden açılıyordu |
| Konsept notu (`footer.note`) | … Rakamlar, tarihler ve programlar örnektir; … | … Adres, telefon, rakamlar, tarihler ve programlar örnektir; … | Künye şablonu: sitede örnek olanlar sayılır |
| Künye başlığı (`footer.kunye.title`) | Görseller ve yazı karakterleri | Proje künyesi | Künye şablonu |
| Künye satırları (`footer.kunye`) | Render notu, "Fotoğraflar Pexels lisansıyla kullanılmıştır:", tek cümlelik font notu | Tasarım ve geliştirme: Raşit Burucu · 3B ve render: (aynı render notu) · Fotoğraflar: yazar, lisans, kullanıldığı yer · Yazı karakterleri: ad, tasarımcı, lisans · Yıl: 2026 | Künye şablonu, sabit sıra ve etiketler; bilgi credits.ts'den |
| Telif satırı (`footer.copyright`) | © 2026 Revak Okulları | © 2026 Revak Okulları · Konsept çalışma — rasitburucu.com | Künye şablonu |
