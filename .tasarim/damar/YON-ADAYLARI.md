# YÖN ADAYLARI: Damar

Tarih: 2026-10-09
- Girdiler: `PROJE.md`, `REFERANSLAR.md`, `arastirma/RAPOR.md`, `deneme/README.md` (kitap açılımı denemesi).
- Maketler: `yon-a.html`, `yon-b.html`, `yon-c.html`.
- Karşılaştırma panosu: `yon-panosu.png`.
- Ekran görüntüleri: `ekran/yon/` (1440, 390, Türkçe sürüm, imza anının durağan karesi).

**Maketler nasıl açılır.** Sunucu repo kökünden çalışmalı:

```
cd "D:\Yazılım Projeleri\rasitburucu-web-demos"
python -m http.server 8765 --bind 127.0.0.1
```

Adres: `http://127.0.0.1:8765/.tasarim/damar/yon-a.html`
- `?lang=tr`: Türkçe sürüm.
- `?anim=0`: açılış hareketi olmadan.
- `?k=0.3`: imza anını o noktada dondurur.

Plaka görselleri `yon-dokular/` klasöründe: denemedeki prosedürel üreticiden bir kez çıkarılmış 34 WebP, toplam 0,47 MB. Maketlerde tarayıcı doku üretmiyor; inşada da önerilen yol bu.

## 1. Rutin ve tersi
- **Bu kategorinin hep yaptığı sayfa:**
  - Tam ekran koyu mermer dokusu ya da ocaktan drone videosu. Üstünde aralıklı büyük harf ya da altın-serif slogan ("doğanın sanatı").
  - Menü: Hakkımızda, Ocaklar, Fabrikalar, Ürünler, Katalog (PDF).
  - Kare taş ızgarası; kapasite sayaçları, ISO rozeti, bayat fuar afişi, WhatsApp balonu, bayraklı makine çevirisi.
  - Teknik değer, blok/plaka numarası, teslim şartı ve numune akışı yok.
  - Kanıt: 17 Türk sitesi (`arastirma/RAPOR.md`) ve Scalvini Marmi.
- **Tahmin edilebilir tersi:** beyaz galeri. Büyük didone serif, tek dekupe taş, şiirsel İngilizce slogan (BAS Stone'un yolu). Bu da "premium editoryal" kalıbı.
- **İkisi de yasak.** Bizim yolumuz şu: ilk ekranda iş başlar (blok, plaka, kitap açılımı, konteyner), sanat yönü bunun üstüne giyer.

## 2. Yedi dünya (Milas mermer ihracatının kendi dünyası)

| # | Dünya | Aile | Kitle neden tanır | Sitede neye dönüşür |
|---|---|---|---|---|
| 1 | Blok kayıt defteri, bloğa sprey boyayla yazılan numara ve ölçü | Arşiv ve veri + İşaret | İthalatçı blok numarasıyla konuşur ("DM-0412'den 22 plaka"); patronun her günkü kâğıdı | Site fabrikanın blok defteri olur: numaralı blok kartı, kesim sırası şeridi, kalan plaka |
| 2 | Plaka sahası ve showroom: A çerçevelere yaslı plakalar, demeti çevirmek | Taş ve mekân + Işık | Taş alan herkes depoda plakaları tek tek çevirerek seçmiştir | Raftaki demeti çevirme; beğenilen plakanın öne çekilmesi |
| 3 | Kitap ve ayna: bookmatch adı kitaptan gelir, ardışık plakalar sayfa gibi açılır | Kâğıt ve baskı | İç mimarlar "open book" düzenini bilir | Her ekran bir açılım (forma); sayfa çevirmek bir sonraki çifte geçmek |
| 4 | Katrak ve kesim sırası: blok 60–80 bıçakla aynı anda dilimlenir | Mekanizma ve alet | Fabrika ziyaretinde ilk görülen makine | Bloğun dilimlenme çizimi; plaka seçimi kesim sırasına göre |
| 5 | Demet etiketi ve konteyner çeki listesi (ISPM 15 damgası) | Arşiv ve veri | İthalatçı her sevkiyatta bu kâğıtları görür | Konteyner hesabı çeki listesi biçiminde; teklif özeti bir etiket |
| 6 | Ocak basamakları ve jeolojik kesit | Doğa ve organik | Muğla dağlarındaki beyaz ocak yarmaları | Damarın blok içinde nasıl ilerlediğini gösteren kesit |
| 7 | Laboratuvar deney raporu (EN 1936, 13755, 12372…) | Arşiv ve veri | Mimar standart numaralı raporu okur | Föy tipografisi, değer çizelgesi |
| 8 | Mostra (numune) kutusu: 10×10 cm taşlar yuvalarda | Doku ve zanaat | Mimarın masasındaki numune paleti | Numune sepeti bir kutu olur; seçilen taş yuvasına oturur |

Beş aileye yayılıyor. **Turistik kitsch reddi:** Roma ya da antik heykel, "Karia / Mylasa" antik kent romantizmi (rakipler bu adları zaten kullanıyor), sütun başlığı, Ege mavisi.

## 3. Seçim ve zar
- **Rezonansta en güçlü iki dünya:**
  - 1 Blok defteri: alıcının asıl sorusu ("ne var, hangi bloktan, kaç tane kaldı") ve patronun gerçek işi.
  - 2 Plaka sahası: alıcının gerçek ritüeli, demeti çevirmek.
- **Üçüncüsü zarla seçildi:**
  ```
  python -c "import random,sys; random.seed(sys.argv[1]); print(random.choice(sys.argv[2:]))" "damar-2026-10-09" "Kitap ve ayna" "Katrak ve kesim sirasi" "Demet etiketi ve ceki listesi" "Ocak basamaklari ve kesit" "Laboratuvar foyu" "Mostra kutusu"
  → Kitap ve ayna
  ```
- **Kanon** (kategorinin standardı, tam kalitede) yalnız Raşit isterse yapılır; önermiyorum.

## 4. Yön kartları

```
YÖN A: Blok Defteri  (dünya: blok kayıt defteri ve sprey boyalı blok numarası; aile: arşiv ve veri + işaret)
Tez: İhracatçı taş değil blok satar. Site fabrikanın blok defteridir: her blok numaralı, her plaka
sıralı, kalan stok sayılıdır. Ziyaretçi bloğu seçer, ardışık çifti kitap gibi açar, kaç konteyner
ettiğini aynı ekranda görür.
Reddettiği varsayılan: koyu mermer dokusu + slogan + "Ürünlerimiz" ızgarası.
Kendi dünyası: stok sahası tozu (açık sıcak gri), bloğa sprey boyayla yazılmış ultramarin numara,
blok kartında izometrik blok çizimi (plakaların bloktaki yeri: satılanlar soluk, görünen çift
mavi), kesim sırasıyla numaralanmış plaka şeridi (satılanlar taralı), defter satırı gibi
konteyner hesabı, duvar görünümünde ölçü çizgili cephe çizimi. İçerik silinse de numara, blok,
şerit ve çizgi kalır.
İlk ekran (1440): sol 520 px'te başlık, alt cümle, blok kartı (DM-0412 büyük ve mavi; blok
ölçüsü, kesim, satışta kalan; 46 plakalık şerit) ve konteyner satırı (m², kalınlık → plaka,
demet, ton, 20′ konteyner, "tahmini"). Sağda büyük önizleme: Tek plaka / İkili / Dörtlü / Duvarda
düğmeleri; ikili açılımda sağ plaka sayfa gibi açılır; altta yüzey ve taş seçimi.
  +---------------------------+---------------------------------------------+
  | Pick the block. See the   | [Tek][İkili][Dörtlü][Duvarda]  [Cilalı|Honlu]|
  | bookmatch before it ships.|  +-------------------+-------------------+  |
  | alt cümle                 |  |  plaka 21         |  plaka 22 (ayna)  |  |
  | +-----------------------+ |  |      ~ damar ~    |    ~ damar ~      |  |
  | | Blok DM-0412   [blok]  | |  |                21 |22                 |  |
  | | 305×190×165 · 46 · 22 | |  +-------------------+-------------------+  |
  | | ||||||||■■|||||||||||  | |  [Eflatun][Duman][Sırma][Kırağı]  temsili   |
  | +-----------------------+ |                                             |
  | [120 m²][2|3 cm] → 20 plaka · 2 demet · 6,8 t · 1×20′ (tahmini)         |
  +---------------------------+---------------------------------------------+
  Telefon: başlık → önizleme → blok kartı → konteyner → sabit çubuk (Numune isteyin | WhatsApp).
Örnek başlık: EN "Pick the block. See the bookmatch before it ships." · TR "Bloğu seçin, kitap açılımını
sevkiyattan önce görün."
İmza etkileşim: plaka şeridinden ardışık iki plakayı seçmek. Önizlemede sağ plaka kapağı açılan
kitap gibi döner ve ilkinin yanına aynalanır. Satılmış plaka seçilemez. Sayı ve kitap açılımı aynı
anda değişir. Konseptten çıkışı: şerit gerçek kesim sırası, açılış da plakanın gerçekte nasıl
çevrildiği.
Tipografi: Sofia Sans Extra Condensed 800 (bloğa boyanan dar, uzun rakamların karşılığı) + Sofia
Sans 400–600 (gövde, tablo, tabular rakam) · lisans: SIL OFL (Google Fonts) · Türkçe glif: ✓
(ekran/yon/yon-a-1440-tr.png).
Renk: strateji Sakin (renk işini taş görüntüsü yapar) + tek vurgu · tokenlar: zemin #E4E3DE
(mermer tozu), yüzey #F3F2EE (plaka beyazı), metin #1B1D21 (zeminde 13,1:1), metin-2 #555960
(5,5:1), vurgu #2A3A98 işaret boyası ultramarini (zeminde 7,6:1; üstünde beyaz 9,7:1),
vurgu-açık #A9B2DE (satıştaki plaka), satıldı #D2CFC8 + tarama.
Hareket tezi: odak an kitabın açılması (1,45 sn, güçlü yavaşlayan eğri); süreklilik: şeritten
önizlemeye seçim; geri bildirim: düğmeler 150 ms. Bütçe en fazla 3 imza an: açılış, ×2'den ×4'e
katlanma, konteyner satırı. Azaltılmış harekette plaka doğrudan açık durur.
Kadranlar: çeşitlilik 4/10 · hareket 4/10 · yoğunluk 7/10
Risk ve maliyet: en düşük risk ve en kısa inşa; konteyner hesabı ve stok yapısı bütün sitede
yeniden kullanılır. Asıl risk "vasat/standart" okunmak (açık gri, beyaz paneller, segment
düğmeler). Kendi eleştiri turumda makete blok çizimi eklendi. İnşada ayrıca sprey dokulu numara
ve ardışık çiftler arasında sayfa çevirme hareketi gerekiyor.
Yanlış stil izleri: SaaS paneli görünümü (kart kiti, gölge, yuvarlak köşe); her etikette mono
font; ultramarini dağınık küçük vurgularda harcamak.
```

```
YÖN B: Plaka Sahası  (dünya: showroom ve plaka sahası, A çerçeve, demeti çevirmek; aile: taş ve mekân + ışık)
Tez: İthalatçı taşı fotoğraftan değil, depoda plakaların arasında yürüyerek seçer. Site bu
yürüyüşü ekrana taşır: demet rafta durur, ziyaretçi plakaları tek tek çevirir, beğendiğini çeker,
ikizini yanına açar.
Reddettiği varsayılan: koyu mermer dokusu duvar kâğıdı. Burada karanlık zemin bir depo ışığıdır;
taş zeminde değil, ışığın altında durur.
Kendi dünyası: akşam deposunun sıcak grafiti, tepe pencerelerinden gelen ışık konisi, A çerçevede
yan yana duran plakalar, plaka kenarına yazılmış numara, zemin yansıması. Vurgu rengi seçilen
taşın damarından gelir (Eflatun'da leylak, Sırma'da altın-kum, Duman'da gri-beyaz).
İlk ekran: sol üstte başlık ve alt cümle. Sol altta raf: 13'ten 26'ya plakalar perspektifte;
seçilen plaka öne döner. Sağda öne çekilmiş çift, ışık altında, sayfa gibi açılır. Altta kumanda
çubuğu: ‹ Plaka 21 / 46 ›, "Bu çifti çek", taş, yüzey.
  +-------------------------------------------------------------------+
  | Walk our slab yard                 +-------------+-------------+  |
  | without the flight.                |  plaka 21   |  22 (ayna)  |  |
  | alt cümle                          |   ~damar~   |   ~damar~   |  |
  |    ||||||[21]  ////////            |             |             |  |
  |    raf (perspektif)                +-------------+-------------+  |
  | [‹ Plaka 21/46 ›] [Bu çifti çek] [taşlar]          [Cilalı|Honlu] |
  +-------------------------------------------------------------------+
  Telefon: başlık → çift → raf yatay şerit (kaydırılır) → kumanda → sabit çubuk.
Örnek başlık: EN "Walk our slab yard without the flight." · TR "Plaka sahamızı uçağa binmeden gezin."
İmza etkileşim: demeti çevirmek (tekerlek, ok tuşu, sürükleme). Her adımda bir plaka öne döner;
"çek" deyince çift sağa geçer ve açılır. Konseptten çıkışı: depoda yapılan gerçek hareket.
Tipografi: Mona Sans, genişlik ekseni (başlıkta %122–125: depo duvarına boyanmış geniş harf;
gövdede %100) · lisans: SIL OFL (Google Fonts) · Türkçe glif: ✓.
Renk: strateji Boğulmuş (sıcak grafit) + taştan türeyen vurgu · tokenlar: zemin #161513, yüzey
#1F1D1A, metin #EEEAE3 (15,2:1), metin-2 #A8A39A (7,3:1), çizgi #36332E, vurgu (Eflatun)
#BCA8D6 (zeminde 8,4:1; üstünde koyu metin).
Hareket tezi: odak an çiftin ışık altında açılması; süreklilik: demetin çevrilmesi; geri
bildirim: plaka parlaklığı. Azaltılmış harekette çevirme anında olur, açılış yok.
Kadranlar: çeşitlilik 7/10 · hareket 7/10 · yoğunluk 4/10
Risk ve maliyet: en "vay" duran ilk ekran ve en güçlü duygu ("uçağa binmeden"). Ama:
- koyu zemin, kategorinin koyu-lüks klişesine yakın;
- raf CSS 3B ile şematik duruyor, gerçek plaka fotoğrafıyla çok daha iyi olur;
- konteyner ve teknik veri ilk ekrandan düşüyor;
- telefonda raf düz şeride iniyor.
Uçuk olma riski orta.
Yanlış stil izleri: siyah + altın lüks; ürün tanıtım filmi gibi kaydırma sahnesi; ışık efektinin
plakadan önemli hale gelmesi.
```

```
YÖN C: Forma  (dünya: kitap ve ayna, zarla; aile: kâğıt ve baskı)
Tez: Bookmatch'in adı kitaptan gelir: art arda kesilen iki plaka bir kitabın karşılıklı sayfaları
gibi açılır. Site bir taş kitabıdır. Her açılım aynı bloktan bir çift; sayfa çevirmek bir sonraki
çifte geçmek; kitabın sağdaki kalınlığı bloğun kalan plakası.
Reddettiği varsayılan: krem kâğıt + italik serif "premium editoryal". Burada kâğıt yok, cilt bezi
var; italik yok; meta satırı yok.
Kendi dünyası: bordo cilt bezi (düz; doku çizgisi ekran hatası gibi okunduğu için kaldırıldı),
taşın durduğu nötr gri bakış masası (taş kırmızı zeminde değil grinin üstünde değerlendirilir),
sayfa beyazı plakalar, ortada cilt yeri (aynı zamanda ek yeri), sayfa kenarlarında yaprak yığını
(solda geçilen, sağda kalan çiftler), köşelerde sayfa numarası = plaka numarası, solda içindekiler
(taş ve blok numarası, noktalı çizgi).
İlk ekran: ortada gri masada açık kitap (21 | 22), altında ← Önceki çift · 21–22 · Sonraki çift → ve
"Dörde aç". Solda başlık ve içindekiler. Sağda "Bu çift": büyük blok numarası, üretici satırı
(Milas ocağı, kendi fabrikası, kesim ayı), plakalar/ölçü/kalan, 46'lık blok şeridi, yüzey seçimi,
m² + kalınlık → plaka (%10 fire dahil), demet, ton, konteyner; blok yetmezse eşleşen sonraki blok;
miktarı taşıyan "Teklif isteyin: 22 plaka" düğmesi ve "Bu çifti numuneye ekle".
(Bu sağ sütun A'nın blok defteridir; taze göz turunun önerisiyle C'ye taşındı.)
  +-----------+-------------------------------------+-------------+
  | Two slabs,|  ||+--------------+--------------+||| | DM-0412     |
  | one       |  |||  sayfa 21    |  sayfa 22    ||| | Milas ocağı |
  | pattern.  |  |||   ~damar~    |   ~damar~    ||| | ||||■■||||  |
  | içindekiler| ||+--------------+--------------+||| | 120 m² → 22 |
  | Eflatun...|     ← Önceki · 21–22 · Sonraki →    | [Teklif: 22]|
  +-----------+-------------------------------------+-------------+
  Telefon: başlık → kitap → sayfa düğmeleri → künye → içindekiler → sabit çubuk.
Örnek başlık: EN "Two slabs, one pattern. Order them as a pair." · TR "İki plaka, tek desen. Çift olarak
sipariş verin."
İmza etkileşim: sayfa çevirmek. Sağdaki plaka kalkar, döner ve sonraki çiftin sol sayfası olur;
altında yeni sağ sayfa (aynalı) belirir. "Dörde aç" çifti aşağı doğru katlanan bir kapı sayfasına
çevirir (dörtlü açılım). Konseptten çıkışı: bookmatch'in kendi adı.
Tipografi: Brygada 1918 (1918 Polonya kitap harfinin yeniden çizimi; kitap dünyası için gerçek
baskı mirası, aşırı kullanılan editoryal serifler değil) + Albert Sans (arayüz) · lisans: SIL OFL
(Google Fonts) · Türkçe glif: ✓.
Renk: strateji Boğulmuş (cilt bezi) · tokenlar: zemin #3C1A1E bordo cilt bezi, masa #C9C5BF (taşın
durduğu nötr gri; taş kırmızıya göre değil griye göre okunur), zemin-2 #4A2227,
sayfa #F1EEE9, metin #F1E4E0 (12,5:1), metin-2 #C7AAA5 (7,2:1), sayfa üstü metin #24191A
(14,8:1), çizgi #5E3036.
Hareket tezi: odak an sayfa çevirme (1,1 sn); süreklilik: sayfa kenarındaki yaprak yığınının
incelmesi; geri bildirim: düğmeler. Azaltılmış harekette sayfa anında değişir.
Kadranlar: çeşitlilik 5/10 · hareket 5/10 · yoğunluk 5/10
Risk ve maliyet:
- Fikir en akılda kalan (kitap = kitap açılımı); orta düzey inşa.
- "Premium editoryal" kalıbına en yakın aday: serif + koyu zemin + içindekiler noktaları. Çizgiyi
  korumak dikkat ister ("butik yayınevi" izlenimi riski).
- Bordo ağır ve "lüks katalog" gibi okunabilir. Taş artık gri masada duruyor; bordo çerçevede kalıyor.
- Konteyner ve teklif artık ilk ekranda (sağ sütun); sağ sütun kalabalıklaşmaya açık.
Yanlış stil izleri: kitap pastişi (eski kâğıt lekesi, kurdele, varak); italik vurgu; büyük harf
aralıklı künye satırları.
```

## 5. Benzer brif testi
- **A.** Başka bir taş ihracatçısı brifiyle buraya varır mıydım? "Stok listesi" fikri kategoriye açık. Ama ultramarin sprey numarası, kesim sırası şeridi ve aynı satırda konteyner bu sektörün kendi nesneleri. Değiştirilen: ilk taslakta önizleme telefonda blok kartının altındaydı; iş ilk ekranda başlasın diye başlığın hemen altına alındı.
- **B.** Her depo, her mobilya mağazası "showroom gezisi" diyebilir. Kurtaran şey demeti çevirme hareketi; bu taşa özgü bir hareket. Değiştirilen: raf ilk hâlde başlığın ve alt cümlenin üstüne biniyordu; alçaltılıp sola çekildi. Telefonda önce çift, sonra raf geliyor.
- **C.** "Kitap" metaforu her yayıncıya uyar. Ama burada kitap bir süs değil, mekanizmanın adı (bookmatch). Sayfa yığını da gerçek bir veriyi taşıyor (kalan plaka). Değiştirilen: içindekiler telefonda kitabın önüne düşüyordu; sona alındı.

Kartlar birbirinin renk varyantı değil:
- A açık, veri ağırlıklı, dar grotesk.
- B karanlık, mekânsal, geniş grotesk.
- C cilt bezi, grafik, kitap serifi.

İmza etkileşimler de ayrı: şeritten seçmek, demeti çevirmek, sayfa çevirmek.

**Önceki ve paralel demolarla çakışma kontrolü:**
- **Fontlar.** Kullanılmayanlar: DM Serif Display, Instrument Sans, Pinyon Script, Bodoni Moda, Gloock, Schibsted Grotesk, Marcellus, Hanken Grotesk, Newsreader, Young Serif, Geologica, Archivo, Martian Mono, Anybody, Onest, Big Shoulders. Paralel demoların fontlarına da dokunulmadı: Pafta'nın Chivo, Bricolage, Gabarito, Host Grotesk ve Atkinson'u; Yedi Pencere'nin Barlow Semi Condensed ve Spectral'ı.
- **Paletler.** Önceki demoların hiçbiriyle aynı değil: badana-traverten, taş + mühür kırmızısı, bakır + fıstık, RAL sarısı + beton, saz yeşili + ayva, viyol beyazı + yeşil. Pafta'nın kırmızı, turuncu ve limon tonları da kullanılmadı.
- **Not.** A'nın ultramarini, Gelidonya'nın tükenmez mavisine (#23408E) ton olarak yakın. Gelidonya'da bu mavi yalnız forma elle yazılmış değerlerde kullanılıyordu; burada ana vurgu.

## 5b. Taze göz turu (bağlamsız ajan, 2026-10-09)

İlk maketlere bağlamsız bir ajan baktı. Puanlar 10 üzerinden; ağırlıklar Tasarım %40, Kullanılabilirlik %30, Yaratıcılık %20, İçerik %10.

| Yön | T | K | Y | İ | Ağırlıklı | Hüküm |
|---|---|---|---|---|---|---|
| A Blok Defteri | 6,5 | 7 | 7 | 8 | **6,9** | "vasat": işlevde en zengin ama görünüşte stok programı ekranı |
| B Plaka Sahası | 7 | 6 | 7,5 | 7 | **6,8** | dengeli ama koyu-lüks klişesine yaslanıyor; eylem belirsiz |
| C Forma | 7,5 | 7,5 | 7 | 7,5 | **7,4** | dengeli; miktar sorusu cevapsız, bordo taşın rengini bozuyor |

Firma sahibine satılabilirlik sıralaması C > B > A. Ajanın önerisi: C, A'nın blok defteriyle.

Bulgulardan uygulananlar:
- **C (Forma).** A'nın blok numarası, blok şeridi ve m² → konteyner hesabı sağ sütuna taşındı. %10 fire eklendi; blok yetmezse eşleşen sonraki blok öneriliyor. Teklif düğmesi miktarı taşıyor. Taş nötr gri masaya alındı; cilt bezindeki çizgi dokusu kaldırıldı. Üretici satırı eklendi (Milas ocağı, kendi fabrikası, kesim ayı). Sayfa çevirirken düğmeler sayfanın üstünde kalıyor.
- **A (Blok Defteri).** Teklif düğmesi miktarı taşıyor ve %10 fire eklendi. Blok çizimi eklendi. İlk ekran yeniden dengelendi, hesap ve teklif ilk ekrana sığıyor.
- **B (Plaka Sahası).** Açılış altyazısı plakanın üstünde kalıyor. Telefonda raf seçili plakadan başlıyor; eskiden satılmış plakalarla açılıyordu.
- **Üçü için ortak.** İkiz plakalar artık birebir ayna değil; ince damarlar derinliğe göre değişiyor (deneme gölgelendiricisi). Yatay taşma 360 → 2560 px arası yedi genişlikte ölçüldü; üç makette de yok.

Değişiklik sonrası yeniden puanlama yapılmadı. Ajan bu üç değişiklikle C için 8 civarı tahmin etmişti; bu bir tahmin, ölçüm değil.

## 6. Önerim: C · Forma (A'nın blok defteri içinde)

**Önerim değişti.** İlk önerim A'ydı ("en az riskli"). Bağlamsız taze göz A'yı "vasat, stok programı ekranı" buldu. Raşit'in Gelidonya v2'ye dediğiyle aynı tuzak, ona katılıyorum.

**Gerekçe.**
- C'nin imza anı işin kendisi: sayfa çevirmek sonraki çifti açıyor, kitabın adı mekanizmanın adı.
- A'nın blok defteri artık C'nin içinde: blok, kalan plaka, m² → konteyner, miktarı taşıyan teklif. Planın imza anının bütün parçaları ilk ekranda.
- Firma sahibine en satılabilir aday.

**Tez bozuluyor mu?** Hayır. C'nin tezi "taş kitabı"; sağ sütun o kitabın künyesi olur.

**Riski ve inşada şartlar:**
1. "Premium editoryal" çizgisini korumak: italik yok, aralıklı büyük harf künye yok, krem yok.
2. Sağ sütunu sade tutmak: en fazla 4 blok bilgi.
3. Bordo taşın yanına girmesin; gri masa kalır.

**Yedek: A.** Görünümü güçlendirilirse en işlevsel aday: sprey dokulu numara ve blok çizimi.

**B** ilk görüşte en etkileyici olanı. Ama gerçek fotoğraflar gelmeden raf şematik kalıyor, koyu zemin kategori klişesine yakın; önermiyorum. Satış cümlesi ("Plaka sahamızı uçağa binmeden gezin") hangi yön seçilirse seçilsin alınabilir.

## 7. Prototip notları
- **Görseller:** `deneme/` klasöründeki prosedürel üreticiden çıkarıldı (`deneme/disa-aktar.html`). Dış fotoğraf yok; `GORSEL-KAYNAK.md` gerekmedi.
- **Fontlar:** maketlerde Google Fonts bağlantısıyla geliyor. İnşada yerel dosya + `THIRD_PARTY.md`.
- **Etkileşim sınırı:** yalnız 21–22, 23–24 ve 25–26 çiftleri tıklanabilir. Diğer plakalar bunu söyleyen kısa bir not gösterir. Yüzey seçimi yalnız 21–22 için hazırlandı.
- **Konteyner satırı (A):** `arastirma/RAPOR.md` §3'teki formülü kullanır: yoğunluk 2,71, ambalaj payı %4, demet 10/7, sınır 27 t. Her rakam "tahmini".
- **Bilinen küçük kusurlar (prototip düzeyi):**
  - A'daki parlaklık şeridi çok silik.
  - B'deki raf plakaları düşük çözünürlüklü ve bulanık.
  - C'de sayfa çevirirken dönen yaprağa gölge yok; dönen yaprak bir an kitabın üst kenarından taşıyor.
  - C'nin sağ sütunu 1440'ta dolu; yeniden puanlanmadı.
  - Üçünde de dokular temsili; gerçekçilik sınırı deneme raporunda.
- **Konteyner satırı (C):** A ile aynı formül, %10 fire dahil; 22 plakadan fazlası için "eşleşen sonraki blok DM-0413 (örnek)" yazar.
- **Genişlik kontrolü:** 360, 390, 768, 1024, 1440, 1920 ve 2560 px'te yatay taşma yok (Playwright ölçümü). 2560'ta A ve C %130 ölçeklenir. Gerçek tekerlek kaydırmalı tam kontrol inşa aşamasında yapılacak; bu maketler tek ekranlık.
