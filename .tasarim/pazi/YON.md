# YÖN: Pazı Robotik · A "Zemin Bandı"

Tarih: 2026-10-04 · Seçen: Raşit (plan `docs/plans/robotik.md` bölüm 4, yön A) · Diğer aday: B "Aydınger" (teknik resim, kaydırmalı patlatılmış görünüm; elendi)

Marka adı plandaki "Kat"tan **Pazı Robotik**'e değişti (Raşit kararı). "Pazı" kol kası: marka imgesi bükülmüş kol = robot kol. "Kat" palet katı olarak içerikte yaşar.

## Rutin (adıyla yasak)

- Kategorinin hep yaptığı sayfa: koyu zemin + mavi/mor ışık, eğik çekilmiş parlak robot render'ı, "Endüstri 4.0 / geleceğin fabrikası", üç özellik kartı, logo şeridi, "Bize ulaşın" formu. Yerli entegratörlerde: ürün listesi + katalog PDF + iletişim.
- Tahmin edilebilir tersi: beyaz minimal "Apple ürün sayfası" (tek robot ortada, büyük boşluk, kaydırınca patlatılmış görünüm). İkisi de yasak; "premium editoryal" kalıbı (krem + italik serif + mono etiket yağmuru) da.

## Yön sözleşmesi

- **TEZ:** Site bir broşür değil, hat sonu mühendislik aracıdır: ziyaretçi kendi kolisini yazar, robot onu gerçek hızında diz. Reddettiği varsayılan: "robotu göster, formu doldurt".
- **KENDİ DÜNYASI:** Epoksi kaplı beton fabrika zemini, üstünde RAL 1003 sarı zemin bandı ve siyah-sarı uyarı taraması; oluklu mukavva, streç, EUR palet tahtası; boyalı alüminyum gövdeli mat beyaz cobot; HMI ekranının dar, sayısal yazısı; depo duvarına boyanmış geniş harfler.
- **HİKÂYE:** İlk ekranda canlı hücre çalışıyor → ziyaretçi ölçü değiştirir, robot yeni deseni dizer → kat kat kurulum adımları → model föyü → güvenlik bölgesini kendi eliyle dener → örnek senaryolar → tasarruf → "ürününüzü getirin" → ön fizibilite akışı ve yazdırılabilir föy.
- **İLK EKRAN:** Tam genişlik zemin: 3B hücre tuvali bütün kahramanı kaplar, sis rengi sayfa zeminiyle aynı olduğu için hücre sayfanın betonuna "basar", tuval kenarı görünmez. Hücre sağda (kamera görüş kayması). Solda dev geniş başlık (Archivo, genişlik 112–125, ağırlık 800) üç satır; altında alt başlık; altında "ölçü plakası": koli U×G×Y, ağırlık, dakikada ürün (Martian Mono iri rakam, ± düğmeli). Altta tam genişlik HMI durum şeridi (kat, koli/kat, gerekli, kapasite, durum). LCP öğesi: başlık metni. Sitenin tek işi (koli bilgisi → uygunluk) ilk ekranda gerçek biçimiyle başlar.
- **İMZA ETKİLEŞİM:** "Kolinizi girin, robot dizsin": değer değişince robot eldeki koliyi bırakır, palet yeni desenle kurulur, zemin bandı (güvenlik bölgesi) robot modeline göre yeniden çizilir. İkinci küçük an: operatör işaretini sarı bölgeye sürükle → robot yavaşlar; iç bölge → durur.
- **BİTİŞ:** Alt bilgi zemin bandıyla kapanır; 404 "Bu koli palete sığmadı"; yazdırılabilir föyler A4.

## Kadranlar (1–10)

Çeşitlilik: 5 · Hareket: 5 (tek büyük hareket robotun kendisi; arayüz sakin) · Yoğunluk: 7 (mühendislik aracı; veri yoğun ama hiyerarşili)

## Tokenlar

| Rol | Değer | Kaynak |
|---|---|---|
| zemin | `#D6D7D1` | Epoksi kaplı beton zemin (gri, hafif yeşilimsi) |
| zemin-koyu | `#C7C8C1` | Tekerlek izi, gölge altı beton |
| yüzey | `#ECECE6` | Boyalı makine paneli, föy kâğıdı |
| metin-1 | `#151615` | Grafit mürekkep, makine etiketi |
| metin-2 | `#4A4D48` | Eskimiş baskı (zemin üstünde 7,4:1) |
| çizgi | `#9FA199` | Ölçü çizgisi |
| vurgu | `#F5A800` | RAL 1003 sinyal sarısı, zemin bandı standardı |
| vurgu-koyu | `#8A5E00` | Sarı üstünde/zemin üstünde okunur sarı metin yerine; odak halkası |
| uyarı | `#151615` + `#F5A800` tarama | Yalnız gerçek uyarıda (yük sınırı, taşma, yetişmeme) |
| tamam | `#2E5E3A` | Yeşil sinyal lambası (yalnız "UYGUN" durumu) |

Renk stratejisi: Sakin. Sarı yalnız üç işte: aktif/seçili durum, güvenlik bölgesi çizgisi, ana eylem düğmesi. Siyah-sarı tarama dekor değil, uyarı anlamı.
Tema gerekçesi: alıcı (üretim müdürü, mühendis) gün ışığında ofiste ya da fabrikada, çoğu zaman tablette bakar; açık beton zemin hem gerçek mekânın rengi hem en okunur seçenek. Tek tema.

Tipografi:

| Rol | Font | Lisans | Türkçe glif | Ölçek |
|---|---|---|---|---|
| gösterim | Archivo Variable, `font-stretch: 118–125%`, 760–850 | SIL OFL 1.1 | ✓ (latin + latin-ext, birlikte yüklenir) | `clamp(2.6rem, 6.4vw, 6.6rem)`, satır 0,92 |
| arayüz/gövde | Archivo, `font-stretch: 100%` (tablolarda 82%) | SIL OFL 1.1 | ✓ | 1,0625rem; tablo 0,9375rem |
| veri | Martian Mono Variable, `font-stretch: 87.5–100%` | SIL OFL 1.1 | ✓ (₺ yok → "TL" yazılır) | 0,8125–2,25rem, `tabular-nums` |

Neden: Archivo'nun genişlik ekseni depo duvarına boyanmış geniş harfleri (Expanded) ve dar veri tablolarını (Condensed) tek ailede verir. Martian Mono geniş monospace; HMI ekranı ve ölçü etiketi yazısı. İkisi de son projelerde (Onikitaş: DM Serif/Instrument; Revak: Newsreader/Hanken) kullanılmadı.

Boşluk ölçeği: 4 tabanlı (4, 8, 12, 16, 24, 32, 48, 64, 96, 128) · Radius: arayüz 2px, düğme 2px, rozet 0 (bant kesik köşeli) · Easing: `--pz-ease: cubic-bezier(0.16, 1, 0.3, 1)`, `--pz-move: cubic-bezier(0.77, 0, 0.175, 1)` · Süreler: geri bildirim 120 ms / durum 200 ms / yerleşim 420 ms / sahne 900 ms.

## Hareket tezi

- Odak an: robotun al-bırak çevrimi (minimum sarsıntı eğrisi: hızlı taşı, yavaş in; ekrandaki hız = hesaplanan kapasite).
- Süreklilik: aynı yapılandırma (adres çubuğunda) ana sayfa → fizibilite → föy arasında taşınır; robot aynı koliyi dizmeye devam eder.
- Geri bildirim: değer değişince sayılar anında; uyarı şeridi 200 ms içinde; düğmeler 120 ms basma.
- Bütçe (3 imza an): 1) canlı hücre, 2) "kat kat" kurulum adımları (kaydırdıkça palete kat iner), 3) güvenlik bölgesi (operatör işareti → robot yavaşlar/durur).
- Azaltılmış hareket: 1) robot döngüsü yok; palet son hâliyle durağan, değer değişince anında yeniden kurulur. 2) Bütün katlar baştan görünür, adım vurgusu kalır. 3) Mini robot durağan; bölge durumu metin ve renkle değişir.

## Sayfa akışı (ana sayfa)

| # | Bölüm | Yerleşim ailesi | Yüzey | Hareket | İçerik |
|---|---|---|---|---|---|
| 0 | Konsept şeridi | ince bant | grafit | yok | tr.concept |
| 1 | Giriş: canlı hücre | tam genişlik zemin + sol katman | zemin | imza 1 | tr.hero |
| 2 | Kat kat kurulum | yapışkan çizim + adım listesi | zemin | imza 2 | tr.steps |
| 3 | Modeller | föy tablosu + yan görünüş çizimleri | yüzey (kâğıt) | yok | content/pazi/models |
| 4 | Güvenlik | üst görünüş planı + üç satır | grafit blok (tek koyu bölge) | imza 3 | tr.safety |
| 5 | Örnek senaryolar | iş emri satırları | zemin | yok | tr.scenarios |
| 6 | Tasarruf özeti | hesap makinesi (iki sütun) | yüzey | sayı güncelleme | tr.savings |
| 7 | Deneme hücresi | izometrik çizim + metin | zemin | yok | tr.trial |
| 8 | Servis | üç satırlık liste | zemin | yok | tr.service |
| 9 | Alt bilgi | bant + sütunlar | grafit | yok | tr.footer, credits |

## Bu yönün yanlış stil izleri

- Sarıyı süs olarak yaymak (başlık vurgusu, ikon rengi). Sarı = aktif, bölge, ana eylem.
- Robotu sarı boyamak (FANUC çağrışımı). Robot mat beyaz/açık gri.
- Siyah-sarı taramayı dekor şeridi yapmak.
- Sahte HMI paneli (div ile çizilmiş ekran). Bizim HMI şeridi gerçek hesap çıktısı.
- "Endüstri 4.0", "akıllı fabrika", "geleceğin" dili.

## Benzer brif testi

"Robot entegratörü sitesi" brifinde modelin kendi hâlinde vardığı yer: koyu zemin + render + kart. Burada bunun yerine açık beton + zemin bandı + çalışan araç var. Değiştirilen: ilk taslaktaki "model kartları" föy tablosuna, "güvenlik ikonları" sürüklenebilir plana dönüştü.

## İstisna gerekçeleri (YZ izi listesinden kalanlar)

- Mono font: yalnız gerçek veri (ölçü, kapasite, kat sayısı, föy değerleri) için; mikro etiket kostümü olarak değil.
- Durum şeridi (kat / koli/kat / gerekli / kapasite / durum): `A · B · C` meta satırı değil, hesap çıktısını gösteren HMI durum çubuğu; hücreler dikey çizgiyle ayrılır, orta nokta yok.
- Numaralı adımlar: yalnız gerçek sıralı süreçte (kurulum adımları, fizibilite adımları).
- Sarının dördüncü yeri, logo ve alt bilgi bandı: logodaki sarı şerit ve alt bilginin üst kenarındaki bant "zemin bandı"nın kendisi; markanın imzası olarak kalır. HMI şeridinin üst kenarı ise sarıdan grafite çekildi (taze göz bulgusu, 2026-10-04).
- Ana sayfa varsayılanı: başlık "25 kilo" dediği için canlı hücre 25 kg torba ile açılır (P30, torba pençesi); plakada ürün tipi seçilebilir.

## Ek imza an: "Pazının içi" (Biz kimiz sayfası, 2026-10-04)

Karar: Raşit'in briefi (yeni sayfa `/web/pazi/biz-kimiz/`). Sözleşmede olmayan efekt olduğu için buraya önce yazıldı.

- **Ne:** Sabitlenmiş (pin) bölüm. Kaydırdıkça P30 kolu, sahada söküldüğü sırayla 15 parçaya ayrılır (kablo hattı ve tutucudan başlar, taban flanşında biter; kontrol kutusu ve alan tarayıcı en sonda), her parça kendi eklem ekseni boyunca kayar. Tam açıkken kısa duraklama, sonra ters sırayla montaj; kol hücreye döner, konveyörden torbayı alıp palete koyar. Ters kaydırınca geri sarar.
- **Neden bu bir istisna, kural ihlali değil:** Yasaklanan şey "Apple ürün sayfası" kalıbıydı: beyaz boşlukta süs olarak dönen ve patlayan ürün, kahramanda. Burada (1) an kahramanda değil, ikincil bir sayfada; ana sayfanın tezi (çalışan araç) değişmedi. (2) Söküm bir iddiayı kanıtlıyor: "Kurduğumuz kolu vidasına kadar biliriz; arıza veren modül değişir." Parça sırası sahadaki söküm sırasıdır, etiketler parçanın işini söyler. (3) Dünya aynı: epoksi beton, sarı zemin bandı (yalnız kol hücreye dönünce, bölge çizgisi olarak), ana sayfadaki aynı prosedürel robot ve malzemeler, HMI durum şeridi (parça sayısı, modül, durum lambası: serviste sarı, çalışırken yeşil).
- **Etiketler:** Teknik resim çıkma çizgisi (ince çizgi + nokta). Mono yalnız veri için: parça numarası ve eksen kodu (J1–J6, ISO 9409). Parça adı ve işlev Archivo; tek satır işlev okunurluk için mono değil (YZ izi: "mono kostüm").
- **Sarı:** aktif parça numarası ve noktası (aktif durum), hücre dönünce zemin bandı (bölge). Başka yerde yok.
- **Hareket bütçesi:** Bu sayfanın tek imza anı bu. Diğer bölümler (ilkeler föyü, atölye notu) hareketsiz. Her hareketin gerekçesi açıklama: parçanın nereden çıktığını göstermek. Parçalar yolda hafif eğilir, tam açıkken düz durur (çizim gibi okunsun).
- **Azaltılmış hareket:** pin yok, kaydırma yok; patlatılmış hâl durağan, bütün etiketler görünür, sıralı liste DOM'da. Telefonda liste etiket yerine alt şeritte tek satır; sabitlenmiş bölümden sonra tam liste.
- **WebGL yok/zayıf:** aynı söküm, `ui/Elevation.tsx` diliyle çizilmiş yan görünüş (aynı renk, çizgi kalınlığı, kapak/göbek dili); aynı zaman çizelgesi grupları kaydırır. Omuz iç parçaları (J2 ekseni kâğıda dik) eğik izdüşümle sola-yukarı açılır.
- **Ekran okuyucu:** tuval ve çizim `aria-hidden` (çizimde `role="img"` + tam açıklama, WebGL yokken), parça listesi sıralı `<ol>`; durum şeridi `aria-hidden` (değişen değerler okunmaz, liste yeterli).
