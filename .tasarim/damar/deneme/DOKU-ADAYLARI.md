# Doku adayları (indirme yok, Raşit onayı bekliyor)

Tarih: 2026-10-09 · Kaynak: Poly Haven API (`api.polyhaven.com/assets?type=textures`, 867 doku) ve ambientCG API (`q=marble`, 77 malzeme). Sayfalar ve küçük önizlemeler yalnızca görüntülendi; hiçbir doku dosyası indirilmedi.

## Önce bulgu: aradığımız şey bu iki kaynakta yok

- **ambientCG:** "marble" aramasında çıkan 77 malzemenin 76'sı **prosedürel**; yani Substance programında üretilmiş, gerçek taş çekimi değil (API alanı `creationMethod = PBRProcedural`). Gerçek çekim olan tek mermer **Marble026**; o da bej renkli ve neredeyse damarsız.
- **Poly Haven:** mermer taramaları gerçek fotoğraf, ama hepsi **karo döşeme** (derz çizgili) ya da kaya yüzü. 3 m'lik bir plakayı tek parça gösterecek, kesintisiz damarlı beyaz mermer taraması yok.
- Sonuç: kitap açılımına uygun, **gerçek taramalı ve plaka ölçeğinde** CC0 mermer bu iki kaynakta bulunmuyor. Aşağıdaki adaylar bu sınır bilinerek seçildi.

## Adaylar

| # | Ad | Sayfa | Ne | Çözünürlük ve gerçek ölçü | Dosya boyutu | Lisans | İşe yarar mı |
|---|---|---|---|---|---|---|---|
| 1 | Marble 026 (ambientCG) | https://ambientcg.com/a/Marble026 | Gerçek çekim (yükseklik alanı fotogrametrisi), bej cilalı mermer, 2021-08-08 | 1K–8K, ölçü belirtilmemiş | ZIP (bütün haritalar): 2K-JPG 15,5 MB · 4K-JPG 48,3 MB · 8K-JPG 143,5 MB | CC0 1.0 | Bej/krem bir taş için gerçek yüzey. Damar zayıf olduğu için kitap açılımında ayna etkisi hemen hemen görünmez. |
| 2 | Grey Cartago 01 (Poly Haven) | https://polyhaven.com/a/grey_cartago_01 | Gerçek tarama, gri mermer karo (pas renkli damarlar), 2025 | 16K, 0,75 × 0,75 m | Yalnız renk haritası (JPG): 4K 11,3 MB · 8K 38,5 MB · 16K 105,7 MB | CC0 | Gerçek damar dokusu var, ama derzli karo. Ancak tek karo kırpılıp yakın çekim yüzey karesinde kullanılabilir; plaka boyuna büyütülünce damarlar iri ve tekrarlı görünür. |
| 3 | Marble 01 (Poly Haven) | https://polyhaven.com/a/marble_01 | Gerçek tarama, bej mermer karo döşeme, 2018 | 8K, 1,5 × 1,5 m | Yalnız renk haritası (JPG): 2K 1,3 MB · 4K 5,0 MB · 8K 17,1 MB | CC0 | Derzli ve damarsız. Yalnız honlu ile cilalı yüzey arasındaki farkı göstermek için işe yarar. |
| K | Marble 012 (ambientCG), **karşılaştırma için** | https://ambientcg.com/a/Marble012 | Gerçek değil, **prosedürel**: beyaz-gri damarlı cilalı mermer | 2K–8K, kesintisiz döşenir | ZIP: 2K-JPG 14,8 MB · 4K-JPG 59,4 MB · 8K-JPG 268,7 MB | CC0 | Bizim prosedürel dokudan daha fotoğraf gibi duruyor ve kesintisiz döşendiği için kitap açılımına uygun. Ama "gerçek tarama" şartını karşılamıyor. |

Notlar:
- Poly Haven boyutları tek harita içindir (yalnız renk). ambientCG boyutları ise bütün haritaları (renk, normal, pürüzlülük, yükseklik) içeren ZIP paketidir.
- İki sitenin lisansı da CC0: atıf gerekmez, ticari kullanım serbest. Yine de demo repodaki `THIRD_PARTY.md` dosyasına kaynak ve tarih yazılır.

## Önerim (karar Raşit'te)

1. **İndirme yapmadan devam:** Demo, tarayıcıda üretilen prosedürel dokuyla ve "temsili doku" etiketiyle kalır. Deneme bunun kitap açılımını anlatmaya yettiğini gösterdi; taşı gerçekmiş gibi göstermeye yetmiyor.
2. **Tek dosya denemesi (indirme onayı gerekir):** Marble 012, 4K ZIP, 59 MB; kullanılacak olan yalnız renk haritası. Prosedürel ile yan yana konup hangisinin daha inandırıcı olduğuna bakılır. Gerçek tarama olmadığı için kazanç sınırlı olabilir.
3. **Gerçekçilik şartsa:** Lisanslı gerçek plaka fotoğrafı satın alınır; ücretli olduğu için karar Raşit'in. Gerçek bir müşteride bu sorun kendiliğinden çözülür: ihracatçı her plakayı zaten fotoğraflıyor, sitede o fotoğraflar kullanılır.
