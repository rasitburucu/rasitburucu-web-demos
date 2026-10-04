# PROJE: Revak Okulları (konsept demo)

- Tür: konsept demo, rasitburucu.com/web/revak/ altında yayınlanır. Kurgusal marka; site bunu açıkça yazar.
- Konu: İstanbul Sarıyer Zekeriyaköy'de anaokulundan liseye tek kampüslü hayali bir özel okul.
- Kitle: 3–17 yaş çocuğu olan, okul araştıran veliler; çoğu siteyi akşam telefondan açar, karar haftalarca sürer.
- Sitenin işi: başvuru hunisi. Ön kayıt, kampüs turu randevusu, bursluluk sınavı başvurusu, ücret bilgisi talebi. Hepsi ön yüzde çalışır, hiçbir yere gönderilmez.
- Çıta (Raşit): sıradan okul portalı reddedilir; kullanılamayacak kadar uçuk sanat da reddedilir. Gerçek bir okulun isteyeceği sitenin çok özenli, sanatlı hâli: işlev merkezde ve çalışır, üstünde özgün sanat yönetimi.
- Kimlik (korunur): taş ve mürekkep, mühür kırmızısı, revak (kemerli galeri) dünyası; imza an "revak yürüyüşü": kaydırdıkça kemerlerin altından yürünür, her kademe bir kemerde durur, çocuğun yaşı sayar, ışık sabahtan akşama döner.
- Aynı repoda Kalemkâr (bakır sini, koyu) ve Pazı Robotik (canlı robot hücresi) demoları var; Revak onlardan geride kalmamalı, onlara benzememeli.
- Yasaklar: uydurma başarı rakamı, ödül, veli yorumu, üniversite sıralaması; aile/finans içerikli görsel; tanınabilir çocuk yüzü yerine eller/arkadan/uzaktan.

## Sayfa haritası (v5, 2026-10-04 derinlik turu)
| Adres | İçerik | Metin dosyası |
|---|---|---|
| `/revak/` | Giriş, cümle formu, revak yürüyüşü (her kademede "Bu kademeyi tanıyın"), rehberlik, kulüpler, kampüs bandı, etkinlikler, SSS | `content/revak/tr.ts` |
| `/revak/okulumuz/` | Adın kökeni, kemer parçaları diyagramı, değerler, roller (adsız), kime hesap veririz | `okul.ts` |
| `/revak/egitim/` | Altı ilke, yıllık ölçme çizelgesi, örnek gelişim raporu, veliye haber ritmi, ödev ve ekran kuralları | `egitim.ts` |
| `/revak/egitim/{anaokulu,ilkokul,ortaokul,lise}/` | Kademe plakası (kemer + saat ışığı), sınıf düzeni, dil modeli, ders cetveli, günlük saatler, "Bir gün Revak'ta", kademeye özel rehberlik, SSS | `kademe.ts` |
| `/revak/almanak/` | 2026-2027 akademik takvim; kademe ve tür süzgeci, satır ya da yıl takvime ekleme | `almanak.ts` |
| `/revak/guvende/` | "Bir şey olursa" senaryoları, rehberlik, çocuk koruma, sağlık, güvenlik ve acil durum | `guvende.ts` |
| `/revak/kampus/` | Tesisler, tıklanabilir kampüs planı (tur seçimine bağlı), bir gün burada, iki haftalık yemek menüsü (alerjen), servis güzergâh şeması ve kuralları | `tr.ts`, `yasam.ts` |
| `/revak/kabul/` | Yollar, yaş/sınıf hesaplayıcı, süreç + gözlem günü farkı, belgeler, kayıttan ilk güne, bursluluk, ücrete neler dahil | `tr.ts`, `kabul-ek.ts` |
| `/revak/iletisim/` | Birim defteri, konum çizimi, ulaşım, saatler | `okul.ts` |
| `/revak/veli/` | Kapalı veli portalı ekranı ve sitedeki açık karşılıkları | `okul.ts` |
| `/revak/kabul/*` | Ön kayıt, tur, bursluluk, ücret akışları (kampüs planından `?gor=` ile tur seçimi gelir) | `tr.ts` |

Kurallar (v5): gerçek kurum/akreditasyon adı yok ("uluslararası diploma programı"); kamu düzenlemeleri (MEB, yaş kuralı, resmî tatiller) gerçek adla. v5'te eklenen bütün metinler Raşit onayı bekliyor.
