# YÖN ADAYLARI: Sazbahçe

Tarih: 2026-10-05 · Girdi: `PROJE.md`, `REFERANSLAR.md`, önceki demoların `YON.md` dosyaları · Prototipler: `yon-a.html`, `yon-b.html`, `yon-c.html` · Ekranlar: `ekran/` · Karşılaştırma: `yon-panosu.png`

## 1. Rutin ve tersi
- **Bu kategorinin hep yaptığı sayfa:** gün batımı çift silüetli tam ekran slayt, beyaz + altın/pudra, el yazısı logo, "Paketlerimiz" Gümüş/Altın/Platin üçlü kartı, sayfa dibinde takvimsiz "Teklif al" formu, WhatsApp balonu, Instagram akışı, "Mutlu çiftlerimiz".
- **Tahmin edilebilir tersi:** siyah-beyaz düğün dergisi; krem kâğıt, büyük italik serif, aralıklı büyük harf künyeler ("premium editoryal").
- İkisi de yasak. Ayrıca aynı aileden ayrışma kuralı: otel = tarih aralığı + oda + fiyat; restoran = saat + kişi; **düğün = tarih uygunluğu + paket yapılandırıcı + teklif özeti**.

## 2. Yedi dünya (Uluabat kıyısı)
| # | Dünya | Aile | Kitle neden tanır | Sitede neye dönüşür |
|---|---|---|---|---|
| 1 | Vaziyet planı / mimari röleve (kıyı, iskele, ambar tepeden) | Taş, mimari, mekân | Düğün sahibi de kurumsal planlayıcı da "masalar nereye, pist nereye" diye sorar; oturma planı her düğünün ortak kâğıdıdır | Misafir sayısıyla canlı çizilen masa yerleşimi; yapılandırıcı planın künye bloğu (antet) olur |
| 2 | Koparmalı günlük takvim (duvar takvimi, yaprak koparma) ve gün batımı çizelgesi | Kâğıt ve baskı + Doğa | Her Türk evinde güneş doğuş/batış saatli koparmalı takvim asılıydı | Takvim yaprağı tarih seçiminin kendisi; her günün gün batımı saati yazar, gök tören saatine göre değişir |
| 3 | Balıkçı ağı ve dalyan düğümleri | Doku ve zanaat | Göl kıyısı köylerinde kurutulan ağlar | Takvim ağ gözleri; dolu gün düğümlenmiş göz |
| 4 | Saz ve hasır örgü | Doku ve zanaat | Hasır sandalye, sepet; kıyının sazı | Yapılandırıcı seçenekleri örgü şeritleri; seçim örgüyü sıklaştırır |
| 5 | Tören programı ve davetiye matbaası | Kâğıt ve baskı | Her düğünün davetiyesi ve "program" kartı | Yapılandırıcı programı canlı dizer: karşılama, nikâh, yemek, pasta |
| 6 | Nilüfer yüzeyi (sarı ve beyaz nilüfer, Uluabat'ın simgesi) | Doğa ve organik | Göl nilüferle anılır; Bursa'nın Nilüfer'i | Takvimin her günü bir nilüfer yaprağı; seçilen gün çiçek açar |
| 7 | İskele su mirası (seviye ölçer çubuğu) | İşaret ve yön bulma | İskelelerde boyalı ölçü çubuğu | Misafir sayısı ölçer çubuğunda yükselen su |
| 8 | Leylek göç takvimi | Doğa ve organik | Gölyazı çatılarındaki leylek yuvaları | Sezon takvimi: leylekler gelince açık alan sezonu başlar |

Aileler: mimari, kâğıt-baskı, doğa, doku-zanaat, işaret (5 aile).
Turistik kitsch reddi: çini, lale, nazar, "Osmanlı köşkü" pastişi yok.

## 3. Seçim ve zar
- Rezonansa göre en güçlü iki dünya: **1 Vaziyet planı** (iki kitlenin de gerçek sorusu) ve **2 Koparmalı takvim + gün batımı** (gerçek veri, duygusal fayda).
- Üçüncü zarla:
  ```
  python -c "import random,sys; random.seed(sys.argv[1]); print(random.choice(sys.argv[2:]))" "sazbahce-2026-10-05" "Ağ ve dalyan" "Saz hasır örgüsü" "Tören programı matbaası" "İskele su mirası" "Nilüfer yüzeyi" "Leylek göç takvimi" "Kayık boyası ve sıra numarası"
  → Nilüfer yüzeyi
  ```
- Kanon (kategorinin standardı, tam kalitede) yalnız Raşit seçerse yapılır; önermiyorum.

## 4. Yön kartları

```
YÖN A: Kıyı Planı  (dünya: vaziyet planı, aile: mimari)
Tez: Mekânı fotoğrafla değil, sizin düğününüzün planıyla tanıtırız; misafir sayısını
yazdığınız anda masalar çayıra dizilir, alan dar gelirse site söyler.
Reddettiği varsayılan: slayt + paket kartı + sayfa dibinde takvimsiz form.
Kendi dünyası: tepeden çizilmiş kıyı; göl derinlik eğrileri ve derinlik rakamları, saz
yatakları, söğüt taçları (sarkık dal çizgileri), iskele tahtaları, ambar çatısının kiremit
taraması, avlu duvarı, çakıl yol, kuzey oku, ölçek çubuğu. İçerik silinse plan kalır.
İlk ekran: sol 40%: başlık (LCP metni), alt başlık, ay takvimi (her günde 4 nokta = 4 alanın
durumu), seçili günün özeti ve gün batımı saati. Sağ 60%: plan; altında planın künye
bloğu (antet) = yapılandırıcı: tören çipleri, misafir sayacı + kaydırıcı, alan ve saat,
"Teklif özetini gör". Planın sol üstünde okuma kutusu: "18 masa, 180 sandalye. Pist göl
tarafında; en arka masa bile suyu görür."
  +----------------------+-------------------------------------------+
  | Söğütlerin altında,  | [18 masa, 180 sandalye]          K         |
  | göle bakan bir sofra.|  ~~göl~~ |iskele==| (pist) o o o   [AMBAR]  |
  | alt başlık           |  ~~saz~~ |        |  o o o o o     [     ]  |
  | [ Haziran 2027  < > ]|  ~~~~~~  söğüt    o o o o        [AVLU ]  |
  | Pt Sa Ça Pe Cu Ct Pz |-------------------------------------------|
  | .. takvim .. ••••    | Tören [Nikâh][Kına][Düğün] | Misafir − 180 + |
  | 25 Haziran: Çayır boş| Alan/Saat [▼][▼] | [Teklif özetini gör]   |
  +----------------------+-------------------------------------------+
  Mobil: başlık → plan (300 px, üstünde − 180 + sayacı) → takvim → antet.
İmza etkileşim: canlı yerleşim. Tören türü düzeni değiştirir (nikâh = iskeleye dönük
sandalye sıraları; düğün/kına/nişan = pistin çevresinde yelpaze yuvarlak masalar; kurumsal
= uzun masalar). Kapasite aşılınca ya da alan o tarihte doluysa okuma kutusu uyarıya döner
ve boş alana tek tıkla geçirir. Konseptten çıkışı: mekânın asıl sattığı şey alan ve düzen.
Tipografi: Anybody (genişlik ekseni 112–135%, 700–800; antet ve plan etiketleri mimari
çizim künyesinin geniş harfi) + Onest (gövde, arayüz) · lisans: SIL OFL (Google Fonts)
· Türkçe glif: ✓ (ç ğ ı İ ö ş ü, ₺ dahil). Not: Anybody küçük puntoda (<24 px) geniş-kalın
hâlde i noktası çok küçülüyor; 24 px altı metin Onest'le yazılır.
Renk: strateji Sakin · tokenlar: zemin #E9EDE6 (söğüt yaprağının gümüşi alt yüzü),
plan kâğıdı #F3F5F1, mürekkep #1D3830 (saz yeşili), metin-2 #4F655C, su #D3E1DE,
su çizgisi #8EAEAA, vurgu #E3B21F (sarı nilüfer, Nuphar lutea), opsiyon #C9A54A.
Hareket tezi: odak an masaların pistten dışa halka halka yerleşmesi (14 ms kademe,
0,5 sn ease-out); süreklilik: alan değişince planın o alana kayması (inşada); geri
bildirim: çip ve sayaç 150 ms. Bütçe: 1) yerleşim, 2) alan geçişi, 3) özet çekmecesi.
Azaltılmış harekette masalar anında yerinde.
Kadranlar: çeşitlilik 5/10 · hareket 4/10 · yoğunluk 6/10
Risk ve maliyet: plan ve yerleşim algoritması emek ister (her alan için masa noktaları,
ağaç ve pist çakışması); gerçek bir müşteride plan mekânın ölçülü planından çizilmeli.
Fotoğraf olmadan da çalışır; alan sayfalarında fotoğraf gerekir. Performans hafif (SVG).
Bu yönün yanlış stil izleri: mavi "blueprint" teknik çizim kostümü; her yere mono etiket;
CAD ekranı taklidi (koordinat, katman paneli).
```

```
YÖN B: Altın Saat  (dünya: koparmalı takvim + gün batımı, aile: kâğıt-baskı ve doğa)
Tez: Nikâh tarihini o günün güneşiyle seçersiniz; takvimin her günü güneşin göle kaçta
indiğini söyler, tören saatini oynattıkça göl o saatin ışığına bürünür.
Reddettiği varsayılan: gün batımı çift silüeti slaytı (aynı duyguyu sahte fotoğraf
yerine gerçek veriyle verir).
Kendi dünyası: duvardaki koparmalı takvim (cilt şeridi, delik sırası, altında yaprak
yığını), dev gün rakamı, "Güneş doğar / Göle iner" kutuları; prosedürel göl manzarası:
karşı kıyı tepeleri, kavaklı köy silüeti, suda güneş yansıması, ön planda saz.
İlk ekran: sol üstte başlık (LCP), sağda takvim yaprağı (gün, haftanın günü, doğuş/batış,
boş alanlar, önerilen nikâh saati); altta koyu gece gölü paneli: ayın bütün günleri tek
şeritte (her hücrede gün batımı saati ve doluluk noktası), tören saati kaydırıcısı
(gün batımı işaretli), tören çipleri, misafir sayacı, "Bu günü sorun".
  +---------------------------------------------------------------+
  | Sazbahçe                         Alanlar Kurumsal  (Teklif iste)|
  | Nikâhınızı güneş                          +-------------+      |
  | göle inmeden kıyın.                       | Haziran 2027|      |
  | alt başlık        ~~ tepeler ~~ (güneş)   |     25      |      |
  | ~~~~~~~ göl ~~~~~~~~~ yansıma ~~~~~~~~~   |    CUMA     |      |
  | |||saz|||                                 | 05.37|20.39 |      |
  |---------------------------------------------------------------|
  | < Haziran 2027 >  1 2 3 4 ... 25 ... 30 (her biri 20.3x)      |
  | Tören saati [=========o|=====]  Tören [..] Misafir − 150 + [Sor]|
  +---------------------------------------------------------------+
  Mobil: manzara 430 px (başlık + küçük yaprak), altında kaydırılır gün şeridi ve kaydırıcı.
İmza etkileşim: tören saati kaydırıcısı gerçek güneş yüksekliğini hesaplar; gök, tepeler,
su ve yansıma renkleri ona göre değişir, başlık rengi kontrasta göre kendini seçer.
Gün seçince eski yaprak koparılıp düşer (0,7 sn). Kaydırıcının altındaki tek satır fotoğraf
tavsiyesi verir ("Altın saat: yüzler sıcak, gölgeler uzun.").
Tipografi: Sofia Sans Extra Condensed (800–900; takvim rakamının dar, ağır harfi) +
Sofia Sans (gövde) · lisans: SIL OFL · Türkçe glif: ✓ (₺ yok, fiyat yazmıyoruz).
Renk: strateji Boğulmuş (gök tek atmosfer, durumla değişir) + sabit kâğıt ve gece paneli ·
tokenlar: panel #13232A (gece gölü), panel-2 #1C313A, kâğıt #F1F2EC, mürekkep #1A2131,
vurgu #E0612A (güneşin göle değdiği an; düğmede koyu yazı #1A1206), gök 8 duraklı
renk tablosu (güneş yüksekliği −14°…60°).
Hareket tezi: odak an gökyüzünün saatle dönmesi; süreklilik: yaprak koparma; geri
bildirim: gün hücresi. Bütçe: 1) gök, 2) yaprak, 3) özet çekmecesi. Azaltılmış harekette
yaprak düşmez, gök anında değişir.
Kadranlar: çeşitlilik 6/10 · hareket 6/10 · yoğunluk 5/10
Risk ve maliyet: en duygusal ve en "satan" ilk izlenim; ama Onikitaş'ın imzası da
"ışığın saate göre değişmesi"ydi. Fark: Onikitaş kaydırmayla geçen bir gün ve 3B sahneydi,
burada gerçek tarih verisiyle tören saati seçimi ve 2B manzara. Yine de vitrinde iki demo
"gün ışığı" temasında buluşur. Gök renk tablosu ince ayar ister (alacakaranlıkta mora
kaçmasın). Prosedürel manzara inşada fotoğrafla değiştirilmezse "illüstrasyon" kalır.
Bu yönün yanlış stil izleri: mor-turuncu "sunset gradient" duvar kâğıdı; retro takvim
pastişi (eski kâğıt lekesi, sararmış kenar); gün batımı emojisi.
```

```
YÖN C: Nilüfer  (dünya: nilüfer yüzeyi, aile: doğa ve organik; zarla)
Tez: Takvim gölün yüzeyidir: her gün bir nilüfer yaprağı, sizin gününüz sarı çiçek açar.
Reddettiği varsayılan: beyaz-altın "masalsı düğün" sitesi; onun yerine akşam gölünün koyu
yeşili ve Uluabat'ın kendi çiçeği.
Kendi dünyası: gece gölü (canvas dalga haritası, fareyle hafif halkalanma), suda yavaşça
dönen bulanık yapraklar, sarı ve beyaz nilüfer; takvim yaprakları damarlı, yarıklı.
İlk ekran: sol: başlık (LCP), alt başlık, yapılandırıcı kutusu (tören çipleri, misafir,
saat, "Teklif özetini hazırla"). Sağ: ay takvimi 7×5 yaprak; boş = canlı yeşil, opsiyonlu
= tomurcuklu, dolu = batık koyu; seçili gün çiçek açar. Altında seçili günün özeti.
  +--------------------------+------------------------------------+
  | (logo) Sazbahçe          |  Haziran 2027              ( < )( > )|
  | Nilüferler açarken,      |  (1)(2)(3)(4)(5)(6)                  |
  | göl kıyısında evlenin.   |  (7)(8)(9)(10)(11)(12)(13)           |
  | alt başlık               |  ... (25 çiçek) ...                  |
  | [Tören çipleri]          |  lejant                               |
  | − 120 +  [Öğle][Gün b.]  |  | 25 Haziran: Çayır ve Ambar boş   |
  | [Teklif özetini hazırla] |                                      |
  +--------------------------+------------------------------------+
  Mobil: başlık → yaprak takvimi (tam genişlik) → özet → yapılandırıcı.
İmza etkileşim: güne dokununca yaprak çiçek açar ve suda o noktadan halka yayılır.
Tipografi: Funnel Display (600–650; damla gibi uçlanan sapları suya yakışıyor) + Funnel
Sans · lisans: SIL OFL · Türkçe glif: ✓ (₺ yok).
Renk: strateji Boğulmuş · tokenlar: su #0D211D, su-2 #14302A, metin #E8EEE6, metin-2
#A6BAAF, yaprak #5E8A45, dolu #24382F, vurgu #F2C230 (sarı nilüfer; üstünde #1B1704),
beyaz nilüfer #F4F1E8.
Hareket tezi: odak an çiçeğin açılması + halka; süreklilik: suda yüzen yapraklar
(çok yavaş); geri bildirim: yaprak hover'da hafif döner. Bütçe: 1) çiçek, 2) halka,
3) özet. Azaltılmış harekette su durgun, halka yok, çiçek doğrudan açık.
Kadranlar: çeşitlilik 5/10 · hareket 5/10 · yoğunluk 4/10
Risk ve maliyet: en "sevimli" yön; yüksek bütçeli mekân sahibine oyuncak gibi görünebilir.
Takvim bilgisi en zayıf olan (hangi alanın boş olduğu ancak seçince görünür; A'daki 4 nokta
yok). Kurumsal planlayıcıya hitap etmiyor. Canvas su tam ekran çalışır (pil, düşük cihaz).
Bu yönün yanlış stil izleri: çizgi film nilüfer ve kurbağa; pastel "spa" paleti; her yere
yaprak serpiştirme.
```

## 5. Benzer brif testi
- **A:** Başka bir düğün mekânı brifiyle buraya varır mıydım? "Oturma planı" fikri kategoriye açık; ama planı kahraman yapıp yapılandırıcıyı çizimin künye bloğuna dönüştürmek ve kıyı/saz/söğüt çizim dilini kurmak bu mekâna bağlı. Değiştirilen: ilk taslakta masa ızgarası düz satırlardı (her mekâna uyar); pistten göle doğru açılan yelpazeye çevrildi, okuma kutusu "en arka masa bile suyu görür" diye bu kıyıya özgü konuşur.
- **B:** "Gün batımı" düğün sitelerinin ilk refleksidir. Kurtaran iki şey: gerçek hesaplanmış saat (dekor değil veri) ve koparmalı takvim nesnesi (Türk evinin tanıdık eşyası). Değiştirilen: söğüt dalı perdesi menüyü örttüğü ve süs kaldığı için çıkarıldı; gök renkleri sabit "sunset gradyanı" değil, güneş yüksekliğinden türetiliyor.
- **C:** Nilüfer, Uluabat'a özgü olduğu için başka bir göle aynen taşınmaz; ama "takvim = yaprak" fikri her su kenarı mekânına uyar. Değiştirilen: süs yaprakları ilk hâlde başlığın ve logonun üstüne biniyordu, tıklanabilir yapraklarla karışıyordu; arka plana itildi (bulanık, koyu, kenarlarda).

Kartlar birbirinin renk varyantı değil: A açık/çizim/plan, B manzara/kâğıt/gök, C gece suyu/organik. Fontlar üç ayrı aile; imza etkileşimler ayrı (yerleşim / ışık / çiçek).

Önceki demolarla çakışma kontrolü: font (DM Serif Display, Instrument, Pinyon Script, Bodoni Moda, Gloock, Schibsted, Marcellus, Hanken Grotesk, Newsreader, Young Serif, Geologica, Archivo, Martian Mono) hiçbiri kullanılmadı. Palet: badana-traverten, taş-mühür kırmızısı, bakır-fıstık, RAL sarısı-beton tekrar edilmedi. Not: A'nın sarı vurgusu Pazı'nın zemin bandı sarısına (RAL 1003) yakın tonda; Pazı'da sarı bütün zemin bandıydı, burada yalnız pist ve ana düğme. İnşada sarıyı biraz daha sıcak/yeşile (nilüfer) çekmek mümkün.

## 6. Önerim: A · Kıyı Planı
Gerekçe: Raşit'in çıtası "gerçek müşteri isteğinin çok süslüsü". A'da imza etkileşim işin kendisi: çift "180 kişi sığar mı, pist nereye düşer" sorusunun cevabını, kurumsal planlayıcı "uzun masa düzeninde kaç kişi" cevabını ilk ekranda görüyor; yüksek bütçeli mekân sahibi bunu satış görüşmesinde gösterebileceği bir araç olarak okur. Kategori bunu yapmıyor (takvim bile yok). B daha duygusal ve görsel olarak en güçlü ilk izlenim, ama Onikitaş'ın "ışık saati" imzasına yakın; C en sevimli ama en az bilgi veren.
Karıştırma önerisi (tezi bozmaz): A'ya B'nin gün batımı saatini koymak (prototipte seçili günün satırında zaten var: "Güneş göle 20.39'da iner"); "Gün batımı" saat seçeneği töreni otomatik güneşe göre kurar.

## 7. Prototip notları
- Görseller tamamen prosedürel (SVG/canvas, JS ile üretilmiş); dış fotoğraf yok, bu yüzden `GORSEL-KAYNAK.md` gerekmedi. Fontlar Google Fonts bağlantısıyla (prototip içi; inşada yerel dosya + `THIRD_PARTY.md`).
- Doluluk verisi tohumlu sahte veridir; gün batımı NOAA güneş denklemiyle gerçek hesaptır (40,17 K, 28,60 D, UTC+3).
- Ek durum kareleri: `ekran/yon-a-1440-nikah.png` (iskeleye dönük sandalyeler), `yon-a-1440-kapasite.png` (Ambar 260 kişiyi almaz uyarısı), `yon-a-1440-ozet.png` (teklif özeti), `yon-b-1440-gunbatimi-sonrasi.png` ve `yon-b-1440-ogle.png` (gök değişimi), `yon-c-1440-halka.png`.
- Bilinen küçük kusurlar (prototip düzeyi): A'da Ambar dönük çizildiği için masalar duvar çizgisine değiyor; B'de mobilde gök orta bölümü boş kalıyor; C'de su dokusu düşük çözünürlükte (bilinçli, performans için).
