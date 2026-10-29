# YÖN ADAYLARI: Yedi Pencere

Tarih: 2026-10-09 · Girdi: `PROJE.md`, `REFERANSLAR.md`, `arastirma/RAPOR.md`, önceki demoların `YON.md` dosyaları · Prototipler: `yon-a.html`, `yon-b.html` (`yon-c.html` elendi, başvuru için) · Ekranlar: `ekran/` (git'e girmez) · Karşılaştırma: `yon-panosu.png` · Taze göz: §9

## 1. Rutin ve tersi
- **Bu kategorinin hep yaptığı sayfa** (Kaleiçi'ndeki 15 otel sitesi): oklu tam ekran kaydırıcı (alacakaranlıkta cumbalı konak, palmiyeli avlu havuzu, liman dronu), üstünde "Giriş · Çıkış · Kişi · ODA BUL" çubuğu, puan rozeti ve "en iyi fiyat garantisi"; koyu zemin + altın, arma/madalyon logo; "Odalarımız" Standart/Deluxe/Suit kartları; yüzen WhatsApp; varış bilgisi yok; asansör ve basamak hiç yok.
- **Tahmin edilebilir tersi:** "premium editoryal" butik otel: krem kâğıt, ince serif, italik ikinci satır, aralıklı büyük harf etiketler, siyah-beyaz yaşam tarzı fotoğrafı.
- İkisi de yasak. Ayrıca aynı ailede ayrışma: Sazbahçe = tepeden vaziyet planı; Yedi Pencere = dikey çizim (görünüş, kesit) ya da taş mozaik; tepeden plan kullanılmaz.

## 2. Yedi dünya (Kaleiçi konağı)
| # | Dünya | Aile | Kitle neden tanır | Sitede neye dönüşür |
|---|---|---|---|---|
| 1 | Rölöve paftası: görünüş, kesit, kot işareti, malzeme taraması | Kâğıt-baskı + Mimari | Kaleiçi'nde her restorasyon Koruma Kurulu'na rölöveyle başlar; otelci bu paftaları bizzat ödemiştir. Konuk için evin kimlik kartı | Konağın üç cephesi; her pencere bir oda; panjur = doluluk |
| 2 | Bebek evi kesiti ve akşam ışığı: içi görünen ev, yanan pencereler | Mimari + Işık | Herkes çocukluktan bilir; akşam yanan pencere "içeride hayat var" demektir | Sokaktan denize kesit; oda seçilince kapıdan odaya yol ve basamak |
| 3 | Ogilby yol şeridi (1675): yolcuya göre dönen şerit harita | İşaret ve yön bulma | Metro şeridi, durak listesi gibi okunur | Kapıdan kapıya şeridi (üç yönde de var; biçimi yöne göre değişir) |
| 4 | Seyir terası panorama levhası: dağ zirveleri adlarıyla | İşaret + Doğa | Karaalioğlu ve Hıdırlık'ta herkesin baktığı Beydağları manzarası | Deniz odalarında "pencereden ne görünür" satırı |
| 5 | Taşlık çakıl mozaiği: siyah-beyaz dere çakılından döşeme | Doku ve zanaat | Kaleiçi evinin kapısından girer girmez basılan ilk yüzey (belgeli, `arastirma/RAPOR.md` §5) | Doluluk tablosu taşlardan; konak mozaiği |
| 6 | Resepsiyon anahtar panosu: anahtar yerindeyse oda boş | Mekanizma + Ritüel | Eski otellerin tezgâh arkası | Odaların anahtar etiketleri (yedek) |
| 7 | Emaye sokak tabelası ve kapı numarası | İşaret | Türk şehirlerinin mavi emaye levhası | Oda numaraları, yön levhaları (yedek) |

Aileler: kâğıt-baskı, mimari, ışık, işaret, doğa, doku-zanaat, mekanizma (7 aile). Turistik kitsch reddi: lale, nazar, çini deseni, "Osmanlı konağı" altın-bordo pastişi yok. "Panjur kapanır" bir dünya değil, üç yönde ortak doluluk dilidir.

## 3. Seçim ve zar
- Rezonansa göre en güçlü iki dünya: **1 Rölöve paftası** (onaylı planın çekirdeği) ve **2 Akşam kesiti** ("kaç basamak" sorusunu görsel olarak en doğrudan yanıtlayan).
- Üçüncü zarla:
  ```
  python -c "import random,sys; random.seed(sys.argv[1]); print(random.choice(sys.argv[2:]))" "yedipencere-2026-10-09" "Ogilby yol şeridi" "Seyir terası panorama levhası" "Taşlık çakıl mozaiği" "Resepsiyon anahtar panosu" "Emaye sokak tabelası ve kapı numarası"
  → Taşlık çakıl mozaiği
  ```
- Kanon (kategorinin standardı, tam kalitede) yalnız Raşit seçerse yapılır; önermiyorum.

## 4. Yön kartları

```
YÖN A: Rölöve  (dünya: rölöve paftası, aile: kâğıt-baskı + mimari)
Tez: Odayı tipinden değil penceresinden seçersiniz; konağın kendi ölçüm çiziminde her
pencere bir odadır ve neye baktığını, kaç basamak çıktığınızı, gecenin sesini söyler.
Reddettiği varsayılan: kaydırıcı + tarih çubuğu + Standart/Deluxe kartları.
Kendi dünyası: aydınger üstünde koyu ceviz mürekkep; moloz taş, sur bloğu, kiremit,
Arnavut kaldırımı, falez traverteni taramaları; kot işaretleri (±0,00 / +3,40 / +6,60);
cumba konsolları, saçak altı gölge taraması, demir parmaklık, sarnıç bileziği, turunç
ağacı, kapı üstünde begonvil. Konağın ÜÇ cephesi açınım olarak yan yana: Sokak (2 oda),
Avlu (2 oda), Deniz (3 oda, falez ve körfez). İçerik silinse çizim kalır.
İlk ekran (1440): üstte başlık (iki satır), altında alt başlık + tarih/gece/kişi; altında
pafta: sol üstte bakış yönü anahtarı (küçük plan, üç ok), üç cephe. Sağ sütunda seçili oda:
büyük pencere detayı (camda o odanın manzarası, kanatlar duvara katlı), ad, kapıdan odaya
basamak şeması (sayaç), ne görür, tavan, gece, oda, örnek fiyat, "Bu odayı ayırın".
LCP metin (başlık).
  +---------------------------------------------+---------------------+
  | Sabah hangi pencereden                      | [pencere detayı:    |
  | uyanacağınızı siz seçin.                    |  camda manzara]     |
  | alt başlık        [Giriş ‹›|Gece −+|Kişi −+]| Körfez              |
  | +-----------------------------------------+ | 23 basamak ___/‾‾▢  |
  | |[anahtar] SOKAK |  AVLU     |  DENİZ köşk | | Ne görür / Tavan    |
  | | [▥▥▥]cumba     | [▢] sofa  |  [▢][▢▢▢]   | | Gece / Oda          |
  | | [▢]  kapı      | turunç[▢] |  [■]Körfez  | | 8.600 TL (örnek)    |
  | | ±0,00          | sarnıç    |  falez ≈30 m| | [Bu odayı ayırın]   |
  | +-----------------------------------------+ |                     |
  +---------------------------------------------+---------------------+
  Altında: "Konakta asansör yok" basamak cetveli (0–40, yedi oda) ve Kapıdan kapıya.
  Mobil: başlık → tarih → Sokak/Avlu/Deniz sekmesi (cephe büyük, tek tek) → oda kartı;
  alt çubuk Tarih · Ara · Rezervasyon.
İmza etkileşim: pencereyi seçince kanatlar duvara katlanır, camda o odanın manzarası
görünür; kartta sokak kapısından o odaya giden merdiven çizilir ve basamaklar sayılır
(B'nin en iyi anı, A'nın mürekkep dilinde). Tarih değişince dolu odaların panjuru kapanır;
dolu odada manzara soluk görünür ve kart "18–20 Ekim arası boş" diye en yakın boş aralığı
önerir.
Görsel dil kuralı (çizim + fotoğraf): çizim ana dildir; fotoğraf YALNIZ açıklığın içinde
görünür (pencere camı, kapı, kemer), çizilmiş çerçeveyle kırpılır, serbest yüzen fotoğraf
yok. Bütün fotoğraflar aynı saatte (ikindi) ve aynı renk ayarıyla. Render yok. Renk yalnız
üç lavi (deniz, taş, begonvil) ve fotoğraflarda; ikon ve şerit aynı mürekkeple çizilir.
Tipografi: Spectral 300–500 (başlık; kalem ucunun ince kılcalı gibi) + Barlow Semi
Condensed 400–600 (arayüz, çizim notları, rakam; rölöve şablon yazısına yakın tek kalınlık)
· lisans: SIL OFL · Türkçe glif: ✓ (tarayıcı ölçümü, iki font tam).
Renk: strateji Sakin · tokenlar: zemin #EEEDE9 (kireç badanasının gölgesi; ilk taslaktaki
soğuk aydınger mavisi taze gözde "cansız" bulundu), pafta #FAFAF8, mürekkep #2A201B (Kaleiçi
pencerelerinin koyu ceviz ahşabı), metin-2 #5E544E, vurgu #B0245E (begonvil; düğme, seçim,
basamak yolu), vurgu-derin #8C1A4A, lavi deniz #D3DFE6, lavi taş #E7E0D3.
Kontrast: mürekkep/pafta ≈15:1, metin-2 ≈7:1, beyaz/begonvil 6,4:1.
Hareket tezi: odak an pencerenin açılması (kanatlar 0,45 sn ease-out); süreklilik: tarih
değişince panjurların kapanması; geri bildirim: 150 ms. Bütçe: 1) pencere, 2) panjur,
3) şeridin çizilmesi. Azaltılmış harekette kanatlar anında yerinde.
Kadranlar: çeşitlilik 5/10 · hareket 4/10 · yoğunluk 6/10
Risk ve maliyet: çizim emeği yüksek (3 cephe + 7 pencere detayı + oda sayfaları), ama SVG,
hafif ve Blender gerektirmez. Gerçek müşteride 7 manzara + 7 oda fotoğrafı tek çekim günü.
Risk: Sazbahçe (plan) ve muhtemelen Pafta ile yan yana "teknik çizim" yorgunluğu; soğuk
"mimarlık ofisi" havası. Karşılık: fotoğraflı pencereler, begonvil, panjur hareketi.
Bu yönün yanlış stil izleri: mavi "blueprint" kostümü; antet bloğu ve "Ölçek 1:25" gibi
sahte teknik künye; her yere mono büyük harf etiket.
```

```
YÖN B: Akşam Kesiti  (dünya: bebek evi kesiti ve akşam ışığı, aile: mimari + ışık)
Tez: Konağın içine mavi saatte bakarsınız: yedi odanın hepsi yanar, o tarihlerde dolu olan
taralı ve panjuru kapalıdır; odanızı seçince sokak kapısından odanıza giden yol çizilir ve
basamaklar tek tek sayılır. (İlk taslakta dolu oda sönüyordu; taze göz bunun gerçek hayattaki
okumayı ters çevirdiğini söyledi: gece yanan pencere "içeride biri var" demektir. Düzeltildi.)
Reddettiği varsayılan: alacakaranlık cephe fotoğraflı kaydırıcı (aynı duyguyu veri taşıyan
bir kesitle verir).
Kendi dünyası: sokak feneri, Arnavut kaldırımı, komşu evin yanan penceresi; kesitte çakıl
döşemeli taşlık, avluda turunç ve sarnıç, avludan çıkan ahşap merdiven ve sofa galerisi,
deniz kanadında sur duvarı, köşke çıkan dar merdiven; falez, körfez, Beydağları'nın
arkasında gün batımı kızıllığı.
İlk ekran (1440): sahne tam genişlik; sol üstte göğün içinde başlık, alt başlık, tarih.
Ortada kesit. Altta "raf": seçili odanın sahneden kırpılmış yakın görünümü, ad, "23
basamak" sayacı ve yolun tarifi (taşlık, avlu merdiveni, sofa), olgular, fiyat, düğme.
  +-------------------------------------------------------------------+
  | Yedi oda, üç kat,                                      gök          |
  | asansör yok.                          [köşk: Hıdırlık | Köşk]     |
  | alt başlık   [tarih]       [Cumba  ] [Sofa] [Körfez        ]  dağlar|
  | fener  sokak [Taşlık ]~~turunç/merdiven~~[ sur ]   falez   deniz   |
  | [yakın görünüm] Körfez | 23 basamak: taşlık, avlu merdiveni… | 8.600 [Ayır] |
  +-------------------------------------------------------------------+
  Mobil: başlık ve tarih üstte, kesit tam genişlik (kırpılmış), raf altta, alt çubuk.
İmza etkileşim: odaya dokununca turunç bir çizgi sokak kapısından başlar, merdivenleri
tırmanıp odanın kapısına varır; sayaç 0'dan 23'e sayar (1,3 sn) ve yanında yol tek cümleyle
yazar ("Avlu merdiveniyle sofaya, deniz kanadına iki basamak daha."). Tarih değişince dolu
odalar taranır, panjuru kapanır.
Görsel dil kuralı (çizim + render): "tek model". Kesit, oda yakın görünümleri, oda sayfaları
ve varış şeridinin nirengileri aynı Blender modelinden aynı mavi saatte render edilir.
Çizgi dili yalnız sunum paftası notudur: ince açık renk kot, oda adı, basamak sayısı.
Stok fotoğraf yok; manzara da modelin parçası. Maketteki sahne SVG taslaktır.
Tipografi: Besley 400–600 (19. yüzyıl Clarendon'u; konağın çağının dükkân ve otel
levhaları) + Host Grotesk 400–700 (arayüz; Element Type, İstanbul) · lisans: SIL OFL ·
Türkçe glif: ✓.
Renk: strateji Boğulmuş (sayfa mavi saate batmış) · tokenlar: gece #0F1E2B, yüzey
#13283A, çizgi #2C455B, metin #EEF1F3, metin-2 #A9B7C4, vurgu #F08A3C (turunç; yol, ana
düğme; üstünde #1A0F06), oda ışığı #F6CF8E (yalnız sahnede). Kontrast: metin 14,9:1,
metin-2 8,3:1, turunç/gece 6,8:1. Koyu tema gerekçesi: konuk siteye akşam telefondan
bakar; konak en güzel hâlini pencereleri yandığında gösterir.
Hareket tezi: odak an yolun çizilmesi + sayaç; süreklilik: ışıkların sönmesi; geri bildirim:
oda çerçevesi. Bütçe 3. Azaltılmış harekette yol tek seferde, sayaç son sayıda.
Kadranlar: çeşitlilik 6/10 · hareket 6/10 · yoğunluk 5/10
Risk ve maliyet: en çok "vay" diyen ilk izlenim, en pahalı üretim: konağın Blender modeli
(dış + 7 oda içi) ve tutarlı render seti. Sazbahçe'de geniş renderların "CG belli" eleştirisi
burada da gelebilir. Telefonda kesit küçülür; oda listesi yedeği gerekir. Onikitaş ve
Kalemkâr'dan sonra üçüncü koyu demo. Bir otelci kendi binası için model ister; satışta bu
maliyet söylenmeli.
Bu yönün yanlış stil izleri: sinematik sis, lens parlaması, yıldızlı gök; neon turuncu;
oyun ekranı gibi izometrik kostüm.
```

**C taze göz turunda elendi** (≈6,8; gerekçe §9). Kart kayıt için duruyor; `yon-c.html` başvuru içindir.

```
YÖN C (ELENDİ): Çakıl  (dünya: taşlık çakıl mozaiği, aile: doku ve zanaat; zarla)
Tez: Konağın taşlığındaki çakıl döşeme gibi, yedi odanın iki haftası taş taş önünüzde:
beyaz taş boş gece, siyah taş dolu gece. Tarih sorup cevap beklemezsiniz.
Reddettiği varsayılan: "müsaitlik sor" formu ve tip kartları.
Kendi dünyası: koyu dere çakılı zemin üstünde ak çakıldan konak, iki sıra bordür, gri
çakıl çatı; doluluk tablosu aynı taşlardan; kapıdan kapıya şeridinde her taş 10 metre.
Hiç çizgi çizim yok.
İlk ekran (1440): solda başlık, alt başlık ve konağın çakıl mozaiği; sağda "Önümüzdeki
iki hafta": 7 oda × 14 gece taş tablosu (oda adı, yön ve basamak satır başında, fiyat
sonda), gece sayısı; altında oda kartı (renkli fotoğraf + olgular + düğme).
  +-----------------------------+--------------------------------------+
  | Hangi gece hangi            | Önümüzdeki iki hafta    ○ boş ● dolu |
  | oda boş, tek bakışta.       | Köşk   ○○○●●●●○○○○●●●  12.400       |
  | alt başlık                  | Körfez ○○●●●○○○●●●●○○   8.600       |
  | [konağın çakıl mozaiği,     | …                                     |
  |  pencereler kararır]        | [foto] Körfez · olgular · [Ayır]     |
  +-----------------------------+--------------------------------------+
  Mobil: başlık → mozaik → 7 gecelik tablo → kart; alt çubuk.
İmza etkileşim: tarih seçince seçili gecelerin taşları ve mozaikteki pencerenin çakılları
tek tek döner (beyazdan siyaha, 0–0,45 sn rastgele gecikme).
Görsel dil kuralı (mozaik + fotoğraf): "renk yalnız fotoğrafta". Arayüz ve bütün grafikler
siyah-beyaz-gri çakıl dilinde; fotoğraflar tam renkli, dikdörtgen, süssüz; fotoğraf hiçbir
zaman mozaik biçimine kırpılmaz. Çizgi çizim ve render yok, karışacak üçüncü dil yok.
Tipografi: Atkinson Hyperlegible Next 400–800 (Braille Institute; yaşlı ve az gören
konuk için okunurluk, basamak bilgisini arayan kitleyle örtüşür) · lisans: SIL OFL ·
Türkçe glif: ✓.
Renk: strateji Sakin (tam siyah-beyaz) · tokenlar: zemin #FAF9F6 (ak çakıl), metin #1A1A18,
metin-2 #57544F, kara çakıl #1E1E1C (ana düğme, dolu), gri çakıl #8F8B84, harç #E7E4DD.
Kontrast: metin 16,6:1, metin-2 7,2:1.
Hareket tezi: odak an taşların dönmesi; süreklilik yok; geri bildirim 150 ms. Azaltılmış
harekette taşlar anında.
Kadranlar: çeşitlilik 4/10 · hareket 3/10 · yoğunluk 7/10
Risk ve maliyet: en işlevsel, en ucuz üretim; ama renksizlik riski en yüksek (Gelidonya
v2'nin "vasat, gri-beyaz" eleştirisine yakın). Mozaik küçük ölçekte gürültü gibi okunabilir;
iyi görünmesi için elle ayarlanmış çakıl akışı gerekir. Konak mozaiği bir amblemdir, cephe
değildir: odanın gerçek yönü tabloda yazar.
Bu yönün yanlış stil izleri: piksel sanatı/LED nokta matris kostümü; "Rodos çakıl
mozaiği" turistik motifleri (yunus, gemi); renkli taşlar.
```

## 5. Benzer brif testi
- **A:** Başka bir otel brifiyle buraya varır mıydım? Cephe üzerinden oda seçmek yalnız az odalı, her odası farklı tarihî bir evde anlamlı; 40 odalı bir otele uymaz. Değiştirilen: ilk taslakta yedi pencere tek cephedeydi; bu, sokağa bakan odayı da denize bakıyormuş gibi gösteriyordu. Üç cephe açınımına (Sokak, Avlu, Deniz) geçildi: pencere neredeyse oda oraya bakar.
- **B:** Akşam kesiti her konak otele taşınabilir; bu projeye bağlayan şey Kaleiçi'nin belgeli öğeleri (çakıl taşlık, avlu merdiveni, sofa, sarnıç, sur, falez) ve "asansör yok" başlığı. Değiştirilen: oda kartı sağ sütundaydı ve gün batımını örtüyordu; sahnenin altındaki boş toprak kesitine "raf" olarak indi; sahne yukarı kaydırıldı, ev kartın altında kalmıyor.
- **C:** Taş taş doluluk tablosu her küçük otele uyar; bağlayan şey taşlık mozaiği geleneği ve konak mozaiği. Değiştirilen: ilk mozaik açık zeminde gürültüydü; gerçek döşemeler gibi koyu zemin, iki sıra bordür ve konturu izleyen çakıl akışıyla yeniden kuruldu; boş pencereler gri, dolu pencereler siyah.
- Kartlar birbirinin renk varyantı değil: A gündüz mürekkep çizim, B akşam render kesit, C siyah-beyaz taş mozaik; üç ayrı font ailesi, üç ayrı imza (pencere açılır / yol çizilir / taşlar döner).

## 6. Portföy içi tekrar kontrolü
- Fontlar: Spectral, Barlow Semi Condensed, Besley, Host Grotesk, Atkinson Hyperlegible Next. Önceki demolarda kullanılanlar (DM Serif Display, Instrument Sans, Pinyon Script, Bodoni Moda, Gloock, Marcellus, Hanken Grotesk, Newsreader, Young Serif, Geologica, Archivo, Martian Mono, Anybody, Onest, Big Shoulders Display, Schibsted Grotesk) tekrar edilmedi.
- Paralel demolarla çakışma (15:55 kontrolü, `.tasarim/damar` ve `.tasarim/pafta`): Damar'ın adayları (Sofia Sans Extra Condensed, Mona Sans, Brygada 1918) çakışmıyor. **Pafta'nın iki adayı çakışıyor:** biri gövdede Host Grotesk (bizim B), biri Atkinson Hyperlegible Next + Mono (bizim C). Önerilen A (Spectral + Barlow Semi Condensed) temiz. B seçilirse arayüz yazısı Albert Sans'a, C seçilirse Lexend'e geçer (ikisi de OFL, latin-ext; Türkçe ölçümü inşada) ya da çakışan adayı hangi demo alırsa diğeri değiştirir.
- Paletler: begonvil vurgusu (A) ve turunç (B) önceki demolarda yok. B'nin koyu zemini Onikitaş gecesi ve Kalemkâr'dan sonra üçüncü koyu demo olur. C'nin siyah-beyazı Gelidonya'nın gri-beyazına en yakın olan.
- Dil ailesi riski: Sazbahçe tepeden plan, Gelidonya sipariş fişi, Pazı ölçü plakası ve büyük olasılıkla Pafta vaziyet planı. A da çizim dilinde; ayrım: dikey görünüş, tarihî yapı, mürekkep, fotoğraflı açıklıklar. Vitrinde dört "teknik çizim" demosu yan yana gelirse yorgunluk riski var; B ve C bu riski taşımaz.

## 7. Prototip notları
- Maketler tek HTML; fontlar Google Fonts bağlantısıyla (yalnız maket; inşada yerel woff2 + Türkçe alt küme + `THIRD_PARTY.md`). Durum adresle açılır: `?oda=cumba` (dolu oda), `?dil=en`, `?mod=arac|marina|otogar|havalimani`.
- Doluluk tohumlu örnek veri (16–29 Ekim 2026); fiyatlar "örnek". Kapıdan kapıya şeridindeki metre, basamak ve yüzey gerçek OSM verisinden (`arastirma/osm-rota-ozet.json`); basamak sayısı OSM'de olmayan merdivenler "sahada sayılır" diye yazılı. Bavul hizmeti "örnek".
- Türkçe glif kontrolü: tarayıcıda her font ve 400/600 ağırlık için ç Ç ğ Ğ ı İ ö Ö ş Ş ü Ü ölçüldü (fontlar yüklendikten sonra yedek fontla genişlik karşılaştırması): beş font da tam. ₺ kontrol edilmedi; fiyatlar "TL" yazılıyor.
- Ekranlar (`ekran/`): her yön için `yon-x-1440.png`, `-1440-dolu.png`, `-1440-en.png`, `-1440-varis.png`, `-390.png`, `-390-alt.png`, `-768.png`, `-1920.png`, `-2560.png`. Üç makette 390, 768, 1440, 1920 ve 2560 genişlikte yatay taşma 0 px, konsol hatası yok (yalnız ilk ekran ve bir kaydırma karesi; tam kaydırma kontrolü inşada).
- Bilinen kusurlar (maket düzeyi): A'da sokak cephesinin kot yazıları kenarda kesik, dağ silüeti cephe yanlarında küçük kama gibi duruyor; B'de telefonda oda yazıları çok küçük, sahne SVG taslağı render kalitesinde değil; C'de mozaik küçük ölçekte gürültülü, telefonda yalnız 7 gece görünüyor.

**Fotoğraflar (Unsplash, yalnız maket yer tutucusu; bağlantıyla gösterildi, indirilmedi):**
| Oda | Fotoğrafçı | Sayfa | Not |
|---|---|---|---|
| Körfez (deniz) | Sergey Konstantinov | https://unsplash.com/photos/a-view-of-a-body-of-water-with-mountains-in-the-background-QWxc5zGHMxc | Antalya körfezi, dağlar |
| Hıdırlık (deniz) | Igor Sporynin | https://unsplash.com/photos/a-body-of-water-with-trees-and-mountains-in-the-background-jxAhpeXqylQ | Falezden gün batımı |
| Köşk (deniz) | Igor Sporynin | https://unsplash.com/photos/a-group-of-houses-next-to-a-body-of-water-YUu9QqvNy64 | Kaleiçi çatıları ve körfez |
| Taşlık (sokak) | Daniel Silva | https://unsplash.com/photos/a-narrow-cobblestone-street-lined-with-buildings-0WMdxGvqhfE | Kaleiçi sokağı |
| Cumba (sokak) | Kseniia Ilinykh | https://unsplash.com/photos/a-narrow-street-with-buildings-and-a-clock-tower-in-the-distance-xG2uKMgxGzw | Kaleiçi sokağı, Saat Kulesi |
| Avlu (avlu) | Yana Ralko | https://unsplash.com/photos/orange-trees-with-ripe-fruit-in-a-courtyard-5fixJa9vMoU | Yeri belirsiz; turunçlu avlu |
| Sofa (avlu) | Bob Jenkin | https://unsplash.com/photos/orange-tree-with-ripe-fruit-in-courtyard-k6Fia0wSpvc | Yeri belirsiz |
Gerçek Kaleiçi sokak fotoğraflarında tabela ve işletme görünebilir; inşada ya kendi çekim ya Blender ya da tabelasız kare seçilir. Gerçek bir otelin fotoğrafı kullanılmaz.

## 8. Önerim: A · Rölöve
Gerekçe: imza an işin kendisi (pencere = oda, panjur = doluluk) ve rakiplerin hiçbirinin vermediği üç bilgiyi (oda bazında manzara, basamak, gece sesi) tek bakışta veriyor; görsel dili en tutarlı (çizim + yalnız açıklıkta fotoğraf), üretimi Blender'a bağlı değil, otelci "rölöve"yi restorasyondan tanıyor. Taze göz de A'yı önerdi.
Karıştırma (yapıldı, tezi bozmuyor): B'nin "kapıdan odaya" yolu A'nın oda kartına mürekkep şeması olarak girdi. Önerilen ikinci adım: C'nin 7 oda × 14 gece tablosu A'da "Bütün odalar, iki hafta" adlı ikinci görünüm olsun (cephe ↔ tablo geçişi; Kononenko referansındaki görünüm morfu). B'nin "Yedi oda, üç kat, asansör yok." cümlesi A'da asansör satırının başlığı olabilir.

## 9. Taze göz turu (2026-10-09, bağlamsız ajan; kurallar + jüri dersleri + 21 ekran)
| Yön | Tahmini puan | En zayıf | Hüküm |
|---|---|---|---|
| A Rölöve | ≈7,35 (T 7,3 · K 6,9 · Y 8,0 · İ 7,6) | Kullanılabilirlik | Dengede, en olgun; "zarif ama cansız" riski |
| B Akşam Kesiti | ≈7,1 (T 7,1 · K 6,6 · Y 7,8 · İ 7,3) | Kullanılabilirlik | Dengede, uçuğa en yakın; en iyi an "kapıdan odaya yol" |
| C Çakıl | ≈6,8 (T 6,5 · K 7,2 · Y 6,8 · İ 6,9) | Tasarım | Vasat, standart: siyah-beyaz tablo; imza fikir süse dönmüş → **elendi** |

Uygulanan düzeltmeler:
- **A:** soğuk aydınger zemini kireç badanası tonuna döndü; başlık "Odanızı penceresinden seçin." (site mekaniği anlatıyordu) yerine "Sabah hangi pencereden uyanacağınızı siz seçin."; pafta köşesine bakış yönü anahtarı (üç cephe "üç ayrı ev" sanılıyordu); kartta kapıdan odaya basamak şeması ve sayaç; çizim etiketleri 15 px; dolu odada manzara soluk görünüyor, panjur aralık; telefonda pencere seçilince kart görünür alana kayıyor; asansör satırı "Zemindeki iki odaya bir iki basamakla girilir, köşke 37 basamak çıkılır."; varış şeridinden araştırma dili (yüzey bilinmiyor, SRTM, "sahada sayılır") kalktı; telefon çubuğunda "Ara" yerine "Telefon".
- **B:** dolu oda artık sönmüyor, taralı ve panjuru kapalı; karttaki ajans notu ("sitede 3B modelden render olur") kalktı; yol tek cümleyle anlatılıyor; şeritte yakın merdivenler "10 + 13 basamak" diye birleşti; "Telefon".

Açık kalan (inşada): oda içi fotoğrafı (A'da oda kapısının açıklığında); gerçek takvim (14 günlük ok gezinmesi yerine); her odanın manzarası o odanın penceresinden çekilmeli, aksi hâlde jüri "çizim + stok foto" der; B seçilirse telefonda kesit yerine kat kat oda listesi.
