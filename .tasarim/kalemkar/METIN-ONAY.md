# METİN ONAYI: Kalemkâr (geliştirme turu, 2026-10-04)

Raşit onaylayana kadar bu metinler sitede "taslak" sayılır. Kaynak: `content/kalemkar/tr.ts`, `content/kalemkar/images.ts`.

| Yer | Eski | Yeni | Neden |
|---|---|---|---|
| İlk ekran, rezervasyon cümlesinin düğmesi (`hero.submit`) | Masalara bak | Masanızı ayırın | Aynı niyet için iki etiket vardı (başlıktaki ve alt çubuktaki düğme "Masanızı ayırın"). Niyet başına tek etiket. |
| Rezervasyon özeti, misafir notları satırı (`flow.sum.notes`) | Notlar: 2 misafir | Not bırakan: 2 misafir | "Notlar: 2 misafir" iki not mu, iki misafir mi belirsizdi. Telefonda da etiket artık satırın başında görünüyor (önce gizliydi, yalnız "2 misafir" kalıyordu). |
| Bahçe domatesi fotoğrafının alt metni | Tepeden: maydanozlu domates salatası, nar ekşili suyuyla | Tepeden: geniş tabağın ortasında gül gibi dizilmiş domates dilimleri, koyu nar ekşisi ve taze otlar | Fotoğraf değişti; alt metin yeni kareyi anlatıyor. Yemek adı ve menü satırı değişmedi. |
| Kış lahanası fotoğrafının alt metni | Tepeden: gri kâsede yoğurtlu lahana salatası, dereotu ve kırmızı biber | Tepeden: tabağın ortasında küçük bir yığın ince doğranmış lahana, dereotu dalı ve kırmızı biber | Fotoğraf değişti; yemek adı ve menü satırı değişmedi. |
| Salon fotoğrafının alt metni (kat planı, Salon) | Taş kemerin altında, küçük pencereli loş bir oda | Nişli kesme taş duvarların önünde kurulmuş bir sofra, yerde kilim | Fotoğraf değişti (karlı pencereli kaya oda yerine kesme taş misafir odası). |

Toplam: 5 satır.

## Öneri (uygulanmadı)

| Yer | Durum | Öneri |
|---|---|---|
| Firik tabağı | Fotoğraf değişmedi: Pexels'te tepeden çekilmiş, tabakta boş alan bırakan "firik + kuzu" karesi bulunamadı. Bulunan iyi kuzu karesi (36678405) firiksiz; firik kareleri kuzusuz. | Metni fotoğrafa uydurmuyoruz. Gerçek müşteride tek çekim günü çözer. İstersen sonraki turda yalnız kuzu görünen kareyle "Kuzu, firik, acı portakal" sırası düşünülebilir; karar senin. |

**ONAYLANDI:** Raşit, 2026-10-04 (bu dosyadaki bütün satırlar; firik tabağı olduğu gibi kalır).


# Geliştirme turu 2 (2026-10-04, jüri düzeltmeleri)

| Yer | Eski | Yeni | Neden |
|---|---|---|---|
| Rezervasyon özeti, menü satırı (`flow.sum.plates`; ekran okuyucu özeti dahil) | Menü: Sofra | Menü: Sofra, 9 tabak (Kısa sofra: 6, Tezgâh: 12) | Sininin ortasındaki noktalar menünün tabak sayısı; sayı hiçbir yerde yazmıyordu. Artık nokta sayısı satırdaki sayıyla aynı. |
| Telefonda servis şeridi (yeni satır, `content/kalemkar/menu.ts` tabak adları) | Yalnız "7 / 9" | 7 / 9  Kuzu incik, taze ot sosu | Pasif metin artık okunur olduğu için şeritte hangi tabağın sinide olduğu da yazılı. Yeni metin yok, mevcut tabak adı. |

Toplam bu tur: 2 satır. **ONAY BEKLİYOR.**
