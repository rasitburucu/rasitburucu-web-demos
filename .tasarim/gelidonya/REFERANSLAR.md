# REFERANSLAR: Gelidonya Sera ve Fidelik

Tarih: 2026-10-05. Referans kopyalanacak model değildir; her satır öğrenilecek **tek şeyi** söyler. Referans sitelerin kodu, metni, görseli alınmaz.

Araç durumu (dürüst not): Firecrawl kredisi bitti, Unsplash MCP e-posta onayı istedi (ikisi çalışmadı). Awwwards sayfaları WebFetch ile okundu; sektör siteleri Playwright ile yalnız iç not için çekildi (`scratchpad/fide/ref/`, repoya girmez). Mobbin çalıştı.

## Seçilen referanslar (6)
| Site | Kaynak (tarih, puan) | Öğrenilecek tek şey | Teknik etiketi | Söküme değer mi |
|---|---|---|---|---|
| Farm Minerals (ADELT) | Awwwards SOTD 19 Şubat 2026, 7,42 (Tasarım 7,56 · Kullanılabilirlik 7,14 · Yaratıcılık 7,50 · İçerik 7,54) | Tarım B2B ürünü tek kahraman nesneyle anlatılınca ödül alabiliyor; zayıf puan yine Kullanılabilirlik. Paleti (koyu adaçayı + bej) ise bizim yasakladığımız "premium organik" tersi | WebGL ürün, büyüyen bitki animasyonlu düğmeler | Hayır (kalibrasyon) |
| Encyclopedia of the Farm (Studio Airport) | Awwwards SOTD 13 Eylül 2021, 7,34 (İçerik 7,96) | İçerik puanı ürünün gerçek yolculuğundan geliyor (tarladan mutfağa bölümler). Bizde: tohum → aşı → teslim → hasat → soğuk zincir | Video + editoryal yerleşim | Hayır |
| Kononenko Mimarlık | Awwwards SOTD Ağustos 2026 (atölye kaynak haritası) | Aynı içeriğin iki okuması arasında morf. Bizde: aynı takvim üretici için "dikim → teslim", alıcı için "ay → hasattaki ürün" | GSAP Flip | Evet (Yön B'nin dikim/hasat geçişi için) |
| Tengile MalaMala (DashDigital) | Awwwards SOTD 3 Ekim 2026, 7,22 (atölye kaynak haritası) | İki renkli disiplinli palet, WebGL olmadan ödül; baskı hissi renk kısıtından gelir | Next.js + GSAP | Hayır (Yön B'nin iki mürekkep kuralı için kalibrasyon) |
| Uxcel, toplu alım bölümü (Mobbin) | https://mobbin.com/sites/sections/6617fad0-2e06-4d84-86e6-65dab7323560 | İşlevsel kalıp: tek miktar girdisi + canlı sonuç satırı + tek ana düğme. Sonuç girdinin yanında, aynı bakışta | Kaydırıcı + toplam | Hayır (kalıp) |
| Kâğıt hesap diskleri (volvelle), 20. yy tarım/ilaç promosyon cetvelleri | Konu dışı ilham (web sitesi değil) | Döner kâğıt diskin pencereleri: bir değeri çevirince bağlı üç değer aynı anda okunur. Yön B'nin kökü | — | Teknik: SVG dönen disk, klavye alternatifi |

## Kategori rutini (kaçınılacak)
Bu kategorinin hep yaptığı sayfa (Batı Antalya fidelikleri, fide portalları, yaş sebze ihracatçıları; Hishtil Türkiye, Altın Fide, Agrowy ve arama sonuçlarındaki fidelik/ihracatçı sitelerine bakıldı, 2026-10-05):
- Yeşil yaprak ya da filiz simgeli logo, yeşil + beyaz arayüz.
- Kahramanda kaydırmalı slayt: drone'dan beyaz sera çatıları, topraktan çıkan filiz stok fotoğrafı, kırmızı domates kasası; altta slayt noktaları.
- Menü: Ana Sayfa / Kurumsal / Ürünlerimiz / Üretici Dostu / Teknoloji / Galeri / İletişim. "Sipariş Ver" düğmesi bir iletişim formuna gider; sipariş için gereken bilgi (çeşit, adet, anaç, hafta) sorulmaz.
- Ürünler: aynı boy yuvarlak kartlarda sebze fotoğrafı + ad.
- İhracat tarafı: dünya haritasında noktalar, "Kalite / Güven / Tazelik" üç ikon kartı, sertifika logo şeridi, "doğadan sofranıza" dili.
- Sosyal medya yüzen düğmesi, WhatsApp balonu, çerez bandı.

Onun tahmin edilebilir tersi (o da yasak): "premium organik" ödül sitesi: koyu adaçayı yeşili ya da krem zemin, ince serif, tek 3B ürün nesnesi ortada, yavaş büyüyen bitki animasyonu, "Reinvented / For the planet" sloganı (Farm Minerals çizgisi). Ve atölyenin "premium editoryal" kalıbı (krem + italik ikinci satır + mono büyük harf etiketler + koordinat şeridi).

## İşlevsel kalıplar
| Kalıp | Örnek | Bizim için not |
|---|---|---|
| Toplu miktar + canlı sonuç | Uxcel (Mobbin, yukarıda) | Sonuç satırı birimle konuşur: "6.000 fide · 134 viyol · teslim 44. hafta". Düğme tek: "Ön rezervasyon" |
| Fidelik sipariş bilgisi | agrowy.com "Fidelikler nasıl ve ne zaman sipariş alır" | Form gerçek sipariş alanlarını sorar: ürün, çeşit/tohum kimden, anaç, adet, teslim haftası, teslim yeri. Cuma-cumartesi teslim yok |
| Kendi ürünü için fiyat sorma | Üretici-ihracatçı firmaların "ürünlerimiz" sayfaları | Alıcıdan: ürün, hafta, miktar aralığı, nereye (yurt içi ya da ülke), istenen belgeler. Fiyat yazılmaz; platform/pazar yeri dili kullanılmaz (firma kendi ürününü satar) |

## Kaçınılacaklar (bu projeye özgü)
- Yaprak logosu, filiz fotoğrafı, traktör, hasır sepetteki domates, "doğadan sofranıza", "tazelik garantisi".
- Uydurma kapasite ("yılda X milyon fide"), uydurma ihracat ülkesi sayısı, sertifika sahipliği iddiası.
- Ticari çeşit ve anaç adları (tescilli markalar).
- Repodaki kardeş demolara benzerlik: Pazı'nın "ölçü plakası ± rakam + mono veri yazısı + RAL sarısı", Revak'ın "cümle formu + mühür", Kalemkâr'ın "satır içi rezervasyon cümlesi". Hesaplayıcı bu üçünden farklı bir biçimle kurulmalı.
