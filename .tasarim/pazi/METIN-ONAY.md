# Metin onayı: Pazı Robotik

Raşit'in onayını bekleyen yeni ya da değişen Türkçe kullanıcı metinleri. Kaynak: `content/pazi/tr.ts`.

| Tarih | Anahtar | Eski | Yeni | Neden |
|---|---|---|---|---|
| 2026-10-04 | `view.still` | (yoktu; durağan çizimde "Zemindeki operatör işaretini sürükleyin." ipucu ve görünüm/hız/durdur düğmeleri görünüyordu ama çalışmıyordu) | Bu cihaz 3B hücreyi çalıştırmıyor; aynı hesapla çizilmiş durağan görünüm gösteriliyor. | GPU'suz ya da düşük kademeli cihazda çalışmayan düğmeler ve ipucu gizlendi; ziyaretçi neden durağan çizim gördüğünü HMI şeridinde okur. |
| 2026-10-04 (gelistir2) | `scenarios.tag` | Örnek senaryo (her satırda kutulu etiket) | (kaldırıldı) | Başlık "Üç örnek iş" ve bölüm notu "Değerler örnektir" zaten örnek olduğunu söylüyor; satır etiketi başlıkla tekrar ediyordu. Sahte kanıt kuralı bölüm başındaki notla korunuyor. |
| 2026-10-04 (gelistir2) | HMI durum hücresi | "Uygun" (operatör iç bölgedeyken de) | Operatör bölgedeyken "Yavaşladı" / "Durdu"; dışarıdayken eski durum | Yeni metin yok: `safety.status` metinleri yeniden kullanıldı. Bilgi için yazıldı. |

**ONAYLANDI:** Raşit, 2026-10-04 (yalnız `view.still` satırı; firik tabağı olduğu gibi kalır).

**ONAY BEKLİYOR:** 2026-10-04 (gelistir2) tarihli iki satır.
