# PROJE: Vaziyet (konsept demo; klasör adı `pafta`)

- Tarih: 2026-10-09 · Durum: yön (Aşama 1: brif + saha araştırması + referans + yön adayları; Raşit'in seçimi bekleniyor)
- Repo: `D:/Yazılım Projeleri/rasitburucu-web-demos` · rota önerisi (ad kesinleşince) `app/vaziyet` → `rasitburucu.com/web/vaziyet/` · Tür: konsept demo (kurgusal marka). Tasarım klasörü şimdilik `.tasarim/pafta/`.
- Vitrinin 9. demosu. Canlıda: Onikitaş (villa), Revak (okul), Kalemkâr (restoran), Pazı (cobot), Sazbahçe (düğün bahçesi), Gelidonya (sera). Paralelde Aşama 1'de: Yedi Pencere (otel), Damar (mermer).
- Girdi: onaylı plan `~/.claude/plans/bana-yeni-tane-elegant-wreath.md` (Fikir 3), saha araştırması `arastirma/RAPOR.md`, referanslar `REFERANSLAR.md`.

## Tasarım okuması (tek satır)
Bunu şöyle okuyorum: arsa sahibine prefabrik ev satan bir üreticinin satış sitesi (önce Kullanım, sonra İkna), arsası olan orta gelirli aile için; imar paftası ve vaziyet planı dili (parsel sınırı, çekme çizgisi, ölçü, kuzey oku); ana hamle: ziyaretçinin kendi arsası ilk ekranda ölçüsüyle çizilir, seçtiği ev ona oturur ve "sığar mı, kaça mal olur, ruhsat alır mı" sorularının dürüst cevabı aynı bakışta görünür.

## Marka (kurgusal)
- Ad: **Vaziyet** (çalışma adı). Alt satır: "Prefabrik ve hafif çelik ev". Ad nereden: mimari projede evin arsaya oturuşunu gösteren çizim, "vaziyet planı"; aracın kendi çıktısı. İlk çalışma adı **Pafta** gerçek firmalarla çakıştı (Kayseri'de "PAFTA Proje-Tasarım / Pafta Mimarlık & Mühendislik", pafta.com.tr; İstanbul ve Ankara'da Pafta adlı mimarlık/inşaat firmaları), bu yüzden bırakıldı; ayrıntı `arastirma/RAPOR.md` bölüm 5. İkinci aday: **Plankote**.
- Varsayım: fabrika **Eskişehir**'de (kurgusal tesis, gerçek adres yazılmaz). Neden: Marmara, İç Anadolu ve Ege'ye karayoluyla dengeli uzaklıkta; nakliye bedeli mesafeyle değiştiği için araçta il seçimi anlamlı olur. Kardeş demolardan ayrışır (Pazı Gebze, Sazbahçe Bursa, Gelidonya Kumluca).
- Ölçek: orta büyüklükte üretici; tek katlı ve iki katlı prefabrik + hafif çelik ev, 6–8 model. Sitede firma büyüklüğü için rakam yazılmaz (yıl, adet, metrekare, "binlerce mutlu aile" yok).

## Konu ve iş
- **Konu:** Türkiye'de prefabrik, hafif çelik ve modüler konut. Gerçek dünyadaki akış (saha araştırmasından): üretici model ve liste fiyatı yayınlar (çoğunlukla fabrika teslim; temel, nakliye, vinç, ruhsat ve bazen KDV ayrı) → müşteri telefon/WhatsApp'tan teklif ister → keşif → sözleşme → fabrikada üretim (birkaç hafta) → arsa sahibi temeli döktürür (projesini üretici verir) → montaj (temel hazırsa 3–7 gün, Aktaş Prefabrik beyanı) → yapı kullanma izni (iskân) ve abonelikler. Ruhsat dosyası mal sahibinin ya da müellifinin işidir; üretici kat planı, ölçü ve yük değerlerini verir.
- **Sitenin tek işi:** Ziyaretçi arsasının ölçülerini ve imar durumu belgesindeki değerleri girer, bir modeli arsaya oturtur, sığan bir yerleşimle **vaziyet planı taslağı + teklif talebi özeti** oluşturur ve gönderir (demoda gönderilmez) ya da yazdırır. Başarı: talep özeti oluştu (model, yerleşim, arsa ve imar değerleri, il, tahmini maliyet aralığı, iletişim tercihi).
- **İkinci iş:** "Ruhsat alır mı?" sorusuna dürüst cevap (araç geometriye bakar; ruhsatı belediye verir; tarla vasıflı arazide kalıcı konut ruhsatı alınamaz). Bu metin satışı korur: yanlış arsaya satılan ev üretici için de iade, ceza ve itibar kaybıdır.
- **Kitle ve kullanım sahnesi:**
  - Birincil: arsası olan orta gelirli aile, 35–60 yaş. Şehirde kirada ya da apartmanda; memleketinde, kasaba kenarında ya da yazlık bölgede arsası var; emeklilik evi, yazlık ya da kiradan kurtulma derdinde. Akşam, evde, **telefonda**; sosyal medya ya da arama reklamından gelir. Elinde çoğu zaman yalnız tapu bilgisi var; imar durumu belgesini henüz almamış olabilir, araç "nereden alınır, hangi satıra bakılır" der. Sonucu eşine/çocuğuna WhatsApp'tan gönderir.
  - İkincil: belediyeye gitmiş, imar durumu belgesi elinde, masaüstünde ayrıntıya giren ziyaretçi. Değerleri birebir girer, vaziyet planı taslağını yazdırıp mimara, belediyeye ya da yapı denetime götürür.
  - Üçüncül: üreticinin satış temsilcisi ya da bayisi; aracı müşteriyle telefonda birlikte kullanır ("arsanızın ölçüsünü söyleyin, ekranda birlikte bakalım").
  - Sonuç: açık tema (gündüz ve akşam telefon), iri rakamlar, tek elle kullanılabilir giriş (adım adım, sayısal klavye), dokunma hedefi ≥ 44 px, telefonda sabit çağrı çubuğu (Ara · WhatsApp · Talebi gör).
- **Yüzey modu:**
  | Sayfa | Mod |
  |---|---|
  | Ana sayfa ilk ekran: "Evinizi arsanıza oturtun" aracı | Kullanım |
  | Ana sayfa devamı: maliyetin dökümü (fabrika teslim, nakliye, temel, vinç; neyin dahil olduğu), süreç takvimi, ruhsat gerçeği, üretim | İkna + Okuma |
  | Modeller (liste) ve model sayfası (plan, dış ölçü, taban alanı, yükseklik, fiyat aralığı, "arsama oturt") | Kullanım + İkna |
  | Nasıl üretiyoruz (fabrika, panel/çelik sistem, montaj sırası, garanti) | İkna |
  | Ruhsat ve imar rehberi (arsa vasfına göre yol haritası, belgede nerede yazar, tarla/hobi bahçesi gerçeği) | Okuma |
  | Teklif özeti / vaziyet planı taslağı (yazdırılabilir A4) | Kullanım |

## İmza araç: "Evinizi arsanıza oturtun" (işleyiş; görünüş yön aşamasında)
1. **Arsa:** en ve boy (m), yola bakan kenar, kuzey yönü (ok çevrilir). Varsayım: ilk sürümde dikdörtgen parsel; dörtgen/çokgen parsel inşada karar (bkz. Açık kararlar).
2. **İmar değerleri:** TAKS, KAKS (emsal), ön/yan/arka bahçe (çekme) mesafesi, en fazla yükseklik ya da kat adedi, nizam. Her alanın yanında "belgede nerede yazar" ipucu. Belge elde yoksa (akşam telefonda bakan ailenin çoğunda yoktur) yönetmeliğin en az değerleriyle başlanır (ön 5, yan 3, arka 3 m; Planlı Alanlar İmar Yönetmeliği md. 23) ve "ada ve parsel numaranızla belediyenizin e-imar sayfasına bakın" yolu gösterilir. Kaynak ve kesinlik `arastirma/RAPOR.md` bölüm 3.
3. **Model:** seçilen evin dış ölçüsü, taban alanı, toplam alanı, yüksekliği, salon cephesi.
4. **Sonuç (canlı):** yapılaşma alanı (çekme çizgileri içi) çizilir; ev oturur; 90° döndürülebilir ve kaydırılabilir. Sığmıyorsa taşan kısım kırmızı ve sebebi yazılı ("ön bahçe çizgisini 1,4 m aşıyor", "taban alanı TAKS hakkını 12 m² aşıyor", "yükseklik sınırı 6,50 m, model 7,10 m"). Sığıyorsa: kalan bahçe (m²), TAKS ve emsal kullanımı (%), salonun baktığı yön ("salon güneydoğuya bakıyor").
5. **Maliyet aralığı (tahmini):** fabrika teslim (model liste fiyatı, `[örnek]`) + nakliye (fabrikadan ile karayolu mesafesi; birim bedel `[örnek]`) + temel (taban alanı × birim aralığı, zemin etüdüne göre değişir, `[örnek]`) + vinç; ayrı satırda "bu fiyata dahil olmayanlar": ruhsat, proje ve yapı denetim bedelleri, harçlar, abonelikler, KDV (markanın kuralına göre). Teslim süresi: "ruhsat elinize geçtikten sonra" haftalarla.
6. **Çıktı:** basılabilir vaziyet planı taslağı (A4; ölçülü, kuzey oklu, "taslaktır, mimari proje yerine geçmez" damgalı) + teklif talebi özeti (önizleme; hiçbir yere gönderilmez).
7. **Dürüst ruhsat paneli** her sonuçta görünür: araç yalnız geometriye bakar; ruhsatı belediye (belediye dışında il özel idaresi) verir; tarla vasıflı arazide kalıcı konut ruhsatı alınamaz; "hobi bahçesi" bir imar statüsü değildir. Her rakamın yanında "tahmini".

## Sektör notları (saha araştırmasından; sitede firmaya mal edilmez)
- Liste fiyatları (Ekim 2026, KDV ve kapsam firmaya göre değişiyor): tek katlı prefabrik 33–40 m² için 369.600–483.700 TL'den; 100 m² civarı 3+1 için ~0,88–1,17 M TL; iki katlı ~1–1,9 M TL; hafif çelik "anahtar teslim" 135–150 m² için 3,7–4,5 M TL. Ayrıntı ve kaynak: `arastirma/RAPOR.md` bölüm 1–2.
- Fiyata çoğunlukla **dahil olmayanlar:** temel/zemin betonu ve hafriyat, nakliye, vinç, ruhsat ve proje, altyapı abonelikleri, bazı sitelerde KDV, mutfak, vitrifiye, zemin kaplaması.
- Süreler: tiny house üretimi 30–45 iş günü (Hane House); hafif çelik villa kurulumu ~60 gün (SerVilla beyanı); panel prefabrikte temel hazırsa montaj 3–7 gün (Aktaş beyanı).
- Sektörün en iyi sitesi (Aktaş Prefabrik) fiyat hesaplayıcı, 3B ev tasarlayıcı ve dürüst izin rehberi sunuyor; Smart Çelik Yapı 2B kat planı editörü sunuyor. **Hiçbiri evin arsaya imar değerleriyle sığıp sığmadığını çizmiyor.** Vaziyet'in farkı bu.

## İçerik envanteri
| İçerik | Var mı | Kaynak | Not |
|---|---|---|---|
| Metin | Taslak (prototip başlıkları) | Biz yazarız; TR, Raşit onayı | Reklam metin yazarı dili; mekanik anlatım yok. Ruhsat metinlerinde avukat/mimar teyidi gereken cümleler işaretli (`arastirma/RAPOR.md` bölüm 3.6) |
| Model kataloğu (6–8 model: plan, dış ölçü, taban alanı, yükseklik, salon cephesi) | Yok | Biz tasarlarız (kurgusal), `[örnek]` | Ölçüler gerçekçi ve kendi içinde tutarlı olmalı (taban alanı = dış ölçü çarpımı); gerçek firmanın planı kopyalanmaz |
| Fiyatlar | Kurgu | Sektör aralıklarına göre `[örnek]` | Her rakamın yanında "örnek" ve "tahmini"; gerçek müşteride üreticinin liste fiyatı |
| İmar varsayılanları ve ruhsat metni | Kısmen | Planlı Alanlar İmar Yönetmeliği, Plansız Alanlar İmar Yönetmeliği, 3194 ve 5403 sayılı Kanunlar | Kesinlik etiketi `arastirma/RAPOR.md` bölüm 3'te; "teyit edilmeli" satırları açık |
| Örnek imar durumu belgesi çizimi | Yok | Biz çizeriz, şematik | Gerçek bir belediyenin adı, logosu, form düzeni kullanılmaz; üzerinde "ÖRNEK — gerçek belge değildir" yazar |
| Nakliye mesafeleri | Yok | KGM il mesafeleri (gerçek veri) + birim bedel `[örnek]` | İnşada derleme anında tabloya alınır, dış istek yok |
| Fotoğraf / render | Yok | Prototipte SVG/CSS çizim. İnşada: Blender ile ev modelleri ve fabrika/montaj sahnesi ya da lisanslı fotoğraf | Havuzlu villa render'ı, mutlu aile stok fotoğrafı kullanılmaz (aile içerikli görsel kuralı da var) |
| Logo, renk, font | Prototipte | Google Fonts (OFL), Türkçe glif kontrolü | Yön aşamasında |
| Gerçek kanıt (yorum, referans, sertifika, deprem testi) | Yok | — | Uydurulmaz. "Depreme dayanıklı, yıkılmaz" gibi mutlak iddia yazılmaz; yerine "statik proje Türkiye Bina Deprem Yönetmeliği'ne göre hesaplanır `[örnek]`" gibi süreç cümlesi |
| 3B / ses | Yok | Yöne bağlı | Ses yok |

İçerik açıkları (kim sağlayacak):
1. Model ölçüleri ve kat planları: Claude kurgusal 6–8 model tasarlar, Raşit onaylar.
2. Fiyat ve birim bedeller (nakliye km bedeli, temel m² bedeli, vinç günlüğü): `[örnek]`; gerçek müşteride üretici.
3. Ruhsat metninin hukuki teyidi: avukat ya da imar konusunda deneyimli bir mimar (gerçek müşteride zorunlu; demoda "teyit edilmeli" listesi).
4. Görseller: yön seçimine göre SVG çizim ya da Blender render.

## Kısıtlar
- Diller: TR (EN yok; plan kararı). · Bütçe: 0 (OFL font, prosedürel görsel). · İçeriği düzenleyen: yok (statik `content/pafta/*.ts`). · Barındırma: demo reposu statik export → `rasitburucu.com/web/pafta/`.
- Formlar ve talep hiçbir yere gönderilmez; her sayfada "Konsept çalışma — rasitburucu.com" şeridi; talep düğmesinin yanında "Bu bir tasarım örneği; hiçbir yere gönderilmez."
- Yasal dil: araç söz vermez; "ruhsat gerekmez", "her araziye kurulur", "imarsız arsaya yasal", "depreme dayanıklı, yıkılmaz" gibi cümleler yazılmaz. Her hesap "tahmini".
- Finansman ve kredi vaadi yok (vade/taksit tablosu demoya girmez; sektörde "bankasız, kefilsiz 120 ay" gibi riskli örnekler var, bkz. RAPOR).
- Harita/coğrafya gerçek: fabrika şehri ve il mesafeleri gerçek; fabrikanın adresi kurgusal olduğu için haritada nokta gösterilmez.

## Hedef ve "bitti" ölçütü
- Hedef: satış vitrini (reklam bütçesi olan orta ölçekli prefabrik/çelik ev üreticisine "bunu istiyorum" dedirtmek) + portföy.
- Bitti ölçütü: kalite tabanı geçti (kontrast, klavye, azaltılmış hareket, Türkçe); telefon 390 px'te araç ilk ekranda başlar ve kaydırmadan bir sonuç verir; 5 genişlikte (390 → 2560) gerçek kaydırma kareleriyle çakışma kontrolü yapıldı; vaziyet planı taslağı A4'e taşmadan basılıyor; taze göz puanı ≥ 7,5; TR metin ve ruhsat paneli Raşit onaylı.

## Açık kararlar
| Karar | Seçenekler | Kim | Tarih |
|---|---|---|---|
| Yön | A / B / C (`YON-ADAYLARI.md`) | Raşit | — |
| Marka adı | "Vaziyet" (öneri, çalışma adı) / "Plankote"; "Pafta" çakıştığı için elendi (`arastirma/RAPOR.md` bölüm 5) | Raşit | — |
| Parsel biçimi | Dikdörtgen (önerim: ilk sürüm, telefonda iki sayı) / dörtgen (dört kenar + köşe) / haritadan çizim (gerçek veri gerekir, demoda yok) | Raşit | inşa öncesi |
| Fiyat gösterimi | Model başına `[örnek]` liste fiyatı + nakliye/temel aralığı (önerim) / yalnız toplam aralık | Raşit | inşa öncesi |
| Görsel üretim | SVG çizim (ucuz, hafif) / Blender ev modelleri (model sayfaları ve üretim bölümü için) | Raşit | inşa öncesi |
