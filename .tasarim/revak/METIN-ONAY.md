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
