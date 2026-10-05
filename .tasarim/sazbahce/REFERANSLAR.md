# REFERANSLAR: Sazbahçe

Tarih: 2026-10-05. Referans kopyalanacak model değildir; her satır öğrenilecek **tek şeyi** söyler. Hiçbir sitenin kodu, metni, görseli prototiplere alınmadı.

Tarama notu: Awwwards site sayfaları yerleşik tarayıcıyla açıldı (puan ve tarih sayfadan okundu). Mobbin MCP çalıştı (`search_sections`, `search_flows`). Firecrawl araması kredi bittiği için çalışmadı; piyasa taraması WebSearch/WebFetch ile yapıldı.

## Seçilen referanslar (6)
| Site | Kaynak (tarih, puan) | Öğrenilecek tek şey | Teknik etiketi | Söküme değer mi |
|---|---|---|---|---|
| KKL Luzern Immersive Venue (&why) | Awwwards Honorable Mention, 27 Tem 2023 | Mekân sitesinin işi "alan bulucu": filtre kenar çubuğu ile 3B mekân aynı ekranda; ziyaretçi salonu kapasiteye göre seçer | Filtre + 3B sürükle | Evet: alan seçimi ile görselin senkronu (A yönü için) |
| Veley / Ross Wedding | Awwwards SOTD, 20 Ağu 2019, 7,5 (Dev 7,22) | Düğün konusu jenerik romantizme düşmeden de ödül alabilir: 3 renk, siyah-beyaz fotoğraf, güçlü tipografi | Sonsuz tuval galerisi | Hayır |
| PAVELETSKY SPACE event venue | Awwwards Nominee | Etkinlik mekânını LiDAR taramasıyla gösterme fikri: mekânın "boş hâli" planlayıcıya kurulumdan daha çok şey anlatır | Nokta bulutu görselleştirme | Hayır (yalnız fikir) |
| Tengile MalaMala (DashDigital) | Awwwards SOTD, 3 Eki 2026, 7,22 (atölye kaynak haritası) | Lüks konaklama, WebGL'siz, iki renkli paletle de üst puan alıyor; cesaret tek yere harcanmış | GSAP, iki renk | Hayır |
| Kononenko Mimarlık | Awwwards SOTD, Ağu 2026 (atölye kaynak haritası) | "Seçenekleri karşılaştırma" işi etkileşim modeline dönüşür: alanları (çayır/ambar/avlu) aynı planda karşılaştırmak | GSAP Flip görünüm modları | Evet: alan değiştirirken planın morf etmesi |
| Calendly rezervasyon akışı | Mobbin akışı ([bağlantı](https://mobbin.com/flows/867f492f-df9c-4b83-8add-1b5a21a55321)) | Takvim + seçilen günün ayrıntısı yan yana; sonuç ekranında tek kartlık özet | Ay ızgarası + yan panel | Kalıp olarak (işleyiş) |

## Kategori rutini (kaçınılacak)
Bu kategorinin hep yaptığı sayfa (Türkiye'deki göl kenarı/kır düğünü mekânları, dugun.com ve dugunbuketi.com listeleri, mekânların kendi siteleri):
- Tam ekran slayt: gün batımında çift silüeti, süslü masa, "Hayallerinizdeki düğün".
- Beyaz + altın ya da pudra pembe, el yazısı logo, ince serif.
- "Paketlerimiz" üçlü kartı (Gümüş / Altın / Platin), fiyat yerine "Fiyat için arayın".
- Kapasite bilgisi dağınık (200–4.500 kişi gibi aralıklar), takvim yok; teklif formu ad + telefon + tarih + kişi sayısı, sayfanın en altında.
- Sağ altta WhatsApp balonu, Instagram akışı, "Mutlu çiftlerimiz" yorumları, galeri ızgarası.

Onun tahmin edilebilir tersi: siyah-beyaz, büyük editoryal serif, düğün dergisi havası, krem kâğıt üstünde italik ikinci satır ("premium editoryal" kalıbı). İkisi de yasak.

Örnekler: [dugun.com Sapanca Göl Evi](https://dugun.com/kir-dugunu/sakarya/sapanca-gol-evi), [dugunbuketi.com Sapanca](https://dugunbuketi.com/dugun-bolge/sapanca), Mobbin'de etkinlik formları ([Eventbrite satış formu](https://mobbin.com/sites/sections/af8d067c-1ede-4274-be13-49dd3d27637c), [Corgi "Host With Us"](https://mobbin.com/sites/sections/b484d4dd-f9bc-4f42-a140-d6fafbd4390b)): hepsi uzun, takvimsiz, bağlamsız alan listesi.

## İşlevsel kalıplar (Mobbin)
| Kalıp | Örnek bağlantı | Bizim için not |
|---|---|---|
| Takvim + seçilen gün paneli | [Calendly](https://mobbin.com/flows/867f492f-df9c-4b83-8add-1b5a21a55321) | Ay ızgarası tek bakışta doluluk göstermeli; seçili gün ayrıntısı hemen yanında |
| Grup teklifi formu (tarih, grup türü, bütçe kaydırıcısı) | [Expedia Groups & meetings](https://mobbin.com/flows/78ad3c52-3bd6-4583-8162-4337eea48b86) | "Grup türü" seçimi kurumsal planlayıcının dili; bizde tören türü çipleri |
| Etkinlik türü sorusu (Düğün / Kurumsal / Diğer) | [HoneyBook lead form](https://mobbin.com/flows/a8dee169-f7ef-4943-8327-ed5790e3666d) | Tür, sonraki alanları değiştirmeli (nikâhta sandalye sırası, kurumsalda uzun masa) |
| Seçim özeti kartı | HoneyBook "Selection summary" (aynı akış) | Bizde fiyatsız: tarih, tür, misafir, alan, saat; "Ailemle paylaş" düğmesi |

## Kaçınılacaklar
- Gün batımında öpüşen çift silüeti, kalp, yüzük, güvercin, havai fişek.
- Şarap kadehi, kokteyl masası, "open bar".
- Peri ışıkları (ampul zinciri) kahramanı, boho pampas otu, makrome.
- "Hayallerinizdeki", "unutulmaz", "masalsı", "eşsiz" kelimeleri.
- Uydurma "XXX mutlu çift", yıldız puanı, basın logosu.
