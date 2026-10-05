# YÖN ADAYLARI: Gelidonya Sera ve Fidelik

Tarih: 2026-10-05 · Durum: Raşit'in seçimini bekliyor · Girdi: `PROJE.md`, `REFERANSLAR.md`, kardeş demoların `YON.md` dosyaları (Onikitaş, Revak, Kalemkâr, Pazı)

Kimlik notu: Raşit'in 2026-10-05 düzeltmesiyle firma **kökü yerel bir üretici** (kendi seraları, yanında fidelik, kendi ürününün ihracatı). Üç yön de buna göre uyarlandı: alt başlıkların hepsi "kendi seramıza diktiğimiz fideyi size de yetiştiriyoruz" fikrini taşır; alıcı tarafı "Ürünlerimiz / Ürün ve ihracat" olarak firmanın kendi hasadını gösterir. Platform ya da pazar yeri dili yok.

## 1. Rutin (adıyla yasak)

**Bu kategorinin hep yaptığı sayfa:** yeşil yaprak/filiz logosu; kahramanda kaydırmalı slayt (drone'dan beyaz sera çatıları, topraktan çıkan filiz stok fotoğrafı, kasada kırmızı domates); "Kurumsal / Ürünlerimiz / Galeri" menüsü; "Sipariş Ver" düğmesi düz bir iletişim formuna gider; ihracat tarafında dünya haritası noktaları, "Kalite / Güven / Tazelik" üç ikon kartı, sertifika logo şeridi, "doğadan sofranıza". (Hishtil Türkiye ve Altın Fide ilk ekranları bunu birebir gösteriyor; bkz. `REFERANSLAR.md`.)

**Onun tahmin edilebilir tersi (o da yasak):** "premium organik" ödül sitesi: koyu adaçayı ya da krem zemin, ince serif, ortada tek 3B ürün nesnesi, yavaş büyüyen bitki animasyonu, "Reinvented" sloganı (Farm Minerals çizgisi). Ve atölyenin "premium editoryal" kalıbı (krem + italik ikinci satır + mono büyük harf etiketler + koordinat şeridi).

Ek yasak (kardeş demolar): Pazı'nın ± ölçü plakası + mono veri yazısı + RAL sarısı; Revak'ın cümle formu + mühür; Kalemkâr'ın satır içi rezervasyon cümlesi.

## 2. Yedi dünya

| # | Dünya | Aile | Kitle neden tanır | Sitede neye dönüşür |
|---|---|---|---|---|
| 1 | Viyol ve fidelik tezgâhı (siyah PS viyol, beyaz strafor, torf-perlit, galvaniz tezgâh, viyole saplanan isim kazığı) | Mekanizma ve alet | Her seracı fideyi viyolle teslim alır; adedi "kaç viyol" diye konuşur | Sipariş miktarı gözlere dolan fideye ve viyol sayısına dönüşür; son viyol yarım dolu görünür |
| 2 | Ekim cetveli: kâğıt döner hesap diski + fideliğin hafta numaralı ekim defteri | Kâğıt ve baskı | Fidelik "45. haftada ekeriz, 52'de teslim" diye konuşur; tarım bayilerinin döner kâğıt cetvelleri tanıdıktır | Dikim haftası çevrilince tohum ekimi ve ilk hasat pencerelerde okunur; disk çevrilince alıcı yüzü (hasat takvimi) |
| 3 | Aşı masası (jilet, silikon klips, iyileştirme odasının pembe LED ışığı) | Doku ve zanaat | Aşılı fide bölgede standart; anaç seçimi seracının en çok sorduğu şey | Sipariş iki yarım: üstte çeşit, altta anaç; klips ikisini birleştirir |
| 4 | Sera örtüsü ışığı (polietilen film altında süt beyazı yayılmış ışık, UV film etiketleri) | Işık ve optik | Seracı günün yarısını o ışığın altında geçirir | Sayfa film arkasından bakılır gibi; içerik "örtü" katmanlarıyla açılır |
| 5 | Kendi kolimiz: oluklu mukavva, flekso baskı, menşe ve sınıf etiketi, palet kartı | Kâğıt ve baskı / İşaret | Hal ve ihracat dünyasının ortak nesnesi; firmanın kendi ürününün yüzü | Ürünlerimiz sayfası koli yan yüzü ve palet kartı düzeninde; fiyat sorma kartı palet etiketi |
| 6 | Soğuk zincir termografı (sıcaklık kaydedici şeridi, frigorifik dorse) | Arşiv ve veri | İhracatın kabusu "zincir koptu mu"; kayıt şeridi her teslimde imzalanır | Seradan alıcıya yolculuk tek bir sıcaklık çizgisi; adımlar çizgi üstünde |
| 7 | Beydağları'ndan plastik deniz (Kumluca ovasının sera çatısı dokusu) | Doğa ve organik / mekân | Bölgeyi tanıyan herkesin gözündeki ilk görüntü | Kahraman sera çatılarının yukarıdan dokusu; seralarımızın haritası |

Not: 4 ve 7 rutine en yakın olanlar (drone sera fotoğrafı); seçilirse fotoğraf değil soyut doku olmak zorunda.

## 3. Seçim ve zar

- Rezonansa göre en güçlü iki dünya: **1 Viyol** (siparişin kendi birimi) ve **2 Ekim cetveli** (siparişin kendi zamanı). İkisi de üreticinin gerçek fiilinden çıkar: saymak ve haftaya göre planlamak.
- Üçüncüsü kalan beş arasından zarla:
  ```
  python -c "import random,sys; random.seed(sys.argv[1]); print(random.choice(sys.argv[2:]))" "gelidonya-2026-10-05" "asi-masasi-klipsleri" "sera-ortusu-isigi" "ihracat-kolisi-baskisi" "soguk-zincir-termografi" "beydagindan-plastik-deniz"
  → asi-masasi-klipsleri
  ```
- Kanon (kategorinin standardı, tam kalitede) yalnız Raşit seçebilir; önermiyorum.

## 4. Yön kartları

```
YÖN A: Viyol Masası  (dünya: viyol ve fidelik tezgâhı, aile: mekanizma ve alet)
Tez: Fidelikte sipariş adetle değil gözle ve viyolle sayılır; site üreticinin dönümünü
     dolu gözlere çevirir, ekrandaki viyoller teslim günü kamyonete yüklenecek olanlardır.
     Reddettiği varsayılan: "Sipariş Ver" düğmesinin arkasındaki boş iletişim formu ve
     filiz fotoğraflı slayt.
Kendi dünyası: siyah PS viyol, beyaz strafor, perlitli torf, galvaniz genişletilmiş
     metal tezgâh, viyole saplanmış plastik isim kazığı, fide arabasına asılı etiket.
     İçerik silinse bile tezgâh ve viyol ızgarası kalır.
İlk ekran: sol %41 başlık (LCP metni) + sipariş: ürün çipleri (7), dönüm/adet + sayaç,
     dikim haftası şeridi (hafta no + tarih), "Ön rezervasyon yap". Sağ %59 tezgâh:
     üstte siparişin bütün viyolleri küçük ölçekte (127 viyol), altta son viyol büyük
     ve ayrıntılı (30/45 göz dolu, isim kazığı), solda araba etiketi: fide, viyol,
     tohum ekim haftası, teslim haftası ve hesabın açık formülü.
  +------------------------------------------------------------------+
  | şerit: Konsept çalışma — rasitburucu.com. Kurgusal marka...       |
  | GELİDONYA  menü ...                    tel  [Ürün ve ihracat]     |
  |---------------------------+--------------------------------------|
  | DİKİM GÜNÜNÜZÜ SÖYLEYİN,  | [son viyol 30/45]                    |
  | FİDENİZ O SABAH SERADA... | ▦▦▦▦▦▦▦▦▦▦▦▦▦  (127 viyol)          |
  | alt başlık                | ▦▦▦▦▦▦▦▦▦▦▦▦▦                        |
  | Ürün [Domates aşılı][..]  | ▦▦▦▦▦▦▦▦▦▦▦▦▦                        |
  | Ne kadar [Dönüm|Adet][-3+]| ┌etiket────────┐  ┌─son viyol──────┐ |
  | Dikim haftası [7][8][9].. | │5.700 fide    │  │✿✿✿✿✿✿✿✿✿      │ |
  | [Ön rezervasyon yap]      | │127 viyol ... │  │✿✿✿✿✿✿ · · ·   │ |
  +------------------------------------------------------------------+
  Telefon: üstte son viyol bandı (124 px), başlık, form; altta sabit çubuk
  "5.700 fide / 127 viyol, teslim 7. hafta  [Ön rezervasyon]".
İmza etkileşim: miktar değişince yeni viyoller tezgâha sırayla iner, son viyolün
     gözleri tek tek fideyle dolar (karpuz/kavunda 28 gözlü viyole geçer, yaprak
     biçimi ürüne göre değişir).
Tipografi: Big Shoulders Display 800 (gösterim; fide arabası ve koli üstündeki dar,
     şablon harfli işaretlemenin karakteri) + Schibsted Grotesk 400–700 (gövde/arayüz)
     · lisans: ikisi de SIL OFL 1.1 (Google Fonts) · Türkçe glif: ✓ (font_tr_kontrol)
Renk: strateji Kararlı (siyah viyol kütlesi + galvaniz tezgâh ekranın %55'i)
     · tokenlar: zemin #F3F4F1 (strafor beyazı, soğuk; krem değil), metin #111311
     (viyol siyahı, 16,9:1), metin-2 #454A44 (8,2:1), tezgâh #BEC2BB, torf #4A3826,
     yeşil #3F8F1F yalnız "dolu göz" anlamında, yeşil-koyu #235A0E (odak, 7,5:1)
Hareket tezi: odak an viyollerin dolması; süreklilik aynı viyol ızgarası sipariş
     sayfası boyunca; bütçe ≤3: (1) gözlerin dolması, (2) yeni viyolün tezgâha inmesi,
     (3) gönderince etiketin fişe dönüşmesi. Azaltılmış harekette son durum anında çizilir.
Kadranlar: çeşitlilik 5/10 · hareket 5/10 · yoğunluk 6/10
Risk ve maliyet: en düşük risk. Canvas çizimi hafif (WebGL yok). Büyük siparişte
     (50 dönüm = 2.000+ viyol) küçük ölçek dokuya döner; 900 üstü "+N viyol" yazar.
     Gerçek fidelik fotoğrafı gerekmez. Zayıf yanı: alıcı tarafına doğal bir yüz
     vermiyor (ayrı sayfa olarak tasarlanır).
Bu yönün yanlış stil izleri: yeşili arayüz rengine yaymak (rutine döner); viyolü
     dekor deseni yapmak (her göz gerçek bir fide sayısı olmalı); mono "teknik" etiket.
```

```
YÖN B: Ekim Cetveli  (dünya: kâğıt döner ekim cetveli, aile: kâğıt ve baskı)
Tez: Seracı yılı haftayla sayar. Gelidonya'nın sitesi iki mürekkeple basılmış bir
     ekim cetvelidir: dikim haftanızı çevirin, tohumun ekileceği hafta ve ilk hasadın
     aşağı yukarı başlayacağı hafta aynı anda pencerelerde okunur. Aynı disk
     çevrildiğinde firmanın kendi seralarında hangi haftada neyin hasatta olduğunu gösterir.
     Reddettiği varsayılan: yeşil yapraklı fidelik sitesi ve "premium organik" krem-adaçayı.
Kendi dünyası: kuşe karton, ultramarin ve floresan turuncu iki renk baskı, tram noktası,
     perçin, pencere kesikleri. İçerik silinse bile ay halkası ve hafta çentikleri kalır.
İlk ekran: sol 600 px başlık (LCP metni), iki sekme (Fide siparişi / Ürünlerimiz: hasat
     takvimi), alt başlık, kesikli çizgili kupon: ürün, dönüm sayacı (= fide), üç okuma
     (tohum ekimi / teslim ve dikim / ilk hasat ≈), "Ön rezervasyon yap". Sağda ultramarin
     tramlı alan, üstünde ~900 px kâğıt disk ekranın sağından ve altından taşar; okuma
     penceresi saat 12'de.
  +------------------------------------------------------------------+
  | GELİDONYA  Ekim cetveli  Seralarımız ...               tel       |
  |----------------------------+-------------------------------------|
  | Fideniz, dikim             | [‹ Önceki][Sonraki ›]   ŞUBAT       |
  | haftanızda serada.         |        OCAK  ┌7┐   MART             |
  | [Fide siparişi][Ürünlerimiz]      ┌51┐  TESLİM VE DİKİM  ┌17┐   |
  | alt başlık                 |  ARALIK  TOHUM   DOMATES  İLK HASAT  |
  | ┌ kupon ─ ─ ─ ─ ─ ─ ─ ─ ┐  |              aşılı fide             |
  | │ÜRÜN [..][..][..]      │  |  KASIM          ( • )               |
  | │MİKTAR [-3 dönüm+]=5.700  |            GELİDONYA EKİM CETVELİ   |
  | │52.hf   7.hf    ≈17.hf │  |  EKİM                         (taşar)|
  | │[Ön rezervasyon yap]   │  |                                     |
  +------------------------------------------------------------------+
  Telefon: diskin üst yarısı bant olarak en üstte (236 px; pencereler saat 12 civarında
  okunur), sonra başlık, sekmeler, kupon; altta sabit çubuk "7. hafta, 5.700 fide /
  Tohum 52. haftada ekilir [Ön rezervasyon]".
İmza etkileşim: takvimi çevirmek. Disk elle sürüklenir (ya da ‹ › düğmeleri, ok
     tuşları; role=slider). Hafta erken kalırsa kupon "Bu hafta için tohum ekmeye geç
     kaldık; en erken 50. hafta" der ve düğme kapanır. Alıcı sekmesinde üst diskin
     pencereleri radyal bir yarığa dönüşür: yarıktan altı ürünün hasat halkası görünür,
     kupon "bu hafta hasatta" listesini ve "Fiyat sorun" formunu açar.
Tipografi: Sofia Sans Extra Condensed 700–900 (gösterim ve diskin yay yazıları; dar
     ve uzun harf, dairesel cetvelde 52 haftayı sığdırır) + Sofia Sans 400–800 (gövde)
     · lisans: SIL OFL 1.1 · Türkçe glif: ✓ (₺ yok: fiyat zaten yazılmıyor)
     · ek gerekçe: aile Kiril de içerir; ileride RU sürümünde font değişmez.
Renk: strateji Kararlı (ultramarin alan ekranın ~%55'i) · tokenlar: kâğıt #FBFBF8,
     mürekkep #2338A6 (Gelidonya Burnu'nun denizi; kâğıtta 9,3:1, beyaz yazı üstünde
     9,6:1), mürekkep-koyu #121A52 (15,6:1), mürekkep-2 #3E477C (8,5:1), tram #E7EAF6,
     turuncu #FF5B1F (yalnız okuma penceresi, seçili hafta ve telefonda ana düğme; koyu
     yazıyla 5,2:1), turuncu-koyu #B83A0B (uyarı metni, 5,8:1)
Hareket tezi: odak an diskin dönüp haftaya oturması (520 ms, güçlü ease-out); süreklilik
     tek disk, sayfalar arasında (Fidelik, Ürünlerimiz) aynı disk farklı yüzüyle; bütçe
     ≤3: (1) disk dönüşü, (2) üretici ↔ alıcı yüzü geçişi (pencereler yarığa morf, GSAP
     Flip ya da maske geçişi), (3) kuponun "fiş" olarak yırtılması. Azaltılmış harekette
     disk anında yerine oturur, geçişler yalnız saydamlık.
Kadranlar: çeşitlilik 6/10 · hareket 5/10 · yoğunluk 6/10
Risk ve maliyet: en güçlü kimlik, ama en çok zanaat: SVG disk metin yolları, sürükleme,
     klavye erişimi ve iki yüz geçişi. Telefonda disk küçük kalır; asıl okuma kupondadır
     (prototipte öyle). Hasada kadar hafta ve hasat sezonları kaynaksız: sitede "≈" ve
     "örnek" diye yazıyor. Fotoğraf gerektirmez; seralar sayfası için yine görsel lazım.
Bu yönün yanlış stil izleri: ikinci disk/kadran eklemek (tek nesne); turuncuyu düğmelere
     yaymak; vintage kâğıt dokusu, sararmış krem (kâğıt temiz kuşe kalır).
```

```
YÖN C: Aşı Masası  (dünya: aşı masası ve iyileştirme odası, aile: doku ve zanaat; zarla geldi)
Tez: Aşılı fide iki bitkinin tek gövdede buluşmasıdır; sipariş de öyle verilir: üstte
     çeşidinizi, altta anacı seçersiniz, klips ikisini birleştirir. Reddettiği varsayılan:
     "Ürünlerimiz" kartlarında sebze fotoğrafı.
Kendi dünyası: iyileştirme odasının pembe LED ışığı (bitkiler bu ışıkta koyu görünür,
     kenarlarına pembe vurur), silikon klips, aşı kesiği, torf topağı ve beyaz kökler.
     İçerik silinse bile pembe oda ve klipsli gövde kalır.
İlk ekran: sol %54 başlık (LCP metni) + üç yarım satır: Üst (çeşit çipleri, "tohumu ben
     getireceğim"), Alt (anaç çipleri, her birinde klips rengi), Ne zaman (adet sayacı,
     teslim haftası seçici, "Ön rezervasyon yap"). Sağ %46 pembe LED paneli, makro ölçekte
     tek aşılı fide: yukarıdan çerçeve dışına taşan yapraklar, ortada klips, altta torf
     topağı; sağ üstte "Üst, kalem: Domates", sağ altta "Alt, anaç: Toprağa dayanıklı",
     solda fidenin yolu (Ekim, Aşı, İyileştirme odası, Sertleştirme, Teslim).
  +------------------------------------------------------------------+
  | gelidonya   Fide siparişi  Anaçlar  Seralarımız ... [Ürün ve ihracat]
  |-------------------------------------+----------------------------|
  | Çeşidinizi seçin,                   |  pembe LED  ║  Üst: Domates |
  | kökünü biz verelim.                 |   yaprak ❦  ║               |
  | alt başlık                          |             ║               |
  | Üst   (Domates)(Biber)(Patlıcan)... |  Aşı noktası[▣] klips       |
  | Alt   (▮Toprağa dayanıklı)(▮Güçlü)..|             ║               |
  | Ne zaman (- 6.000 +)(7. hafta ▾)    |  • Ekim     ▓torf▓  Alt: ...  |
  |          (Ön rezervasyon yap)       |  • Aşı ...                  |
  +------------------------------------------------------------------+
  Telefon: üstte pembe bant (208 px; klips ve iki etiket), başlık, çipler yatay kayar,
  altta sabit çubuk "6.000 aşılı domates / Toprağa dayanıklı, teslim 7. hafta".
İmza etkileşim: aşılama. Çeşit değişince üst yarı kalkar ve yeni çeşit yaprağıyla iner
     (domates bileşik, karpuz derin loblu, biber düz kenarlı), anaç değişince klips rengi
     değişip kapanır; "Aşısız" seçilince klips ve kesik kaybolur, gövde tek parça olur.
Tipografi: Bricolage Grotesque (opsz 96, wdth 84, 700; mürekkep tuzaklı köşeleri jilet
     kesiği gibi) + Onest 400–700 (gövde; Kiril de var) · lisans: SIL OFL 1.1 ·
     Türkçe glif: ✓
Renk: strateji Kararlı (pembe LED paneli ekranın %46'sı) · tokenlar: zemin #FBFAFB,
     metin #1E0E19 (17,8:1), metin-2 #5A4553 (8,4:1), led #B0156C (beyaz yazı 6,6:1;
     zemin üstünde 6,4:1), led-koyu #6E0A44, klips amber #F2A516 / camgöbeği #14A398 /
     açık #E7E2EA (yalnız klips ve çipteki renk işareti)
Hareket tezi: odak an klipsin kapanması; süreklilik aynı fide fidelik sayfasında
     "yolculuk" anlatısına (ekim → aşı → iyileştirme odası → sertleştirme → teslim)
     dönüşür; bütçe ≤3: (1) aşılama, (2) iyileştirme odasında ışığın kısılması (sayfa
     aşağı inince), (3) teslim fişi. Azaltılmış harekette yeni fide doğrudan çizilir.
Kadranlar: çeşitlilik 6/10 · hareket 5/10 · yoğunluk 5/10
Risk ve maliyet: en çok görsel zanaat ister. Prototipteki prosedürel SVG fide fikri
     taşıyor ama "elle çizilmiş" kalıyor; gerçek inşada Blender render ya da gerçek
     iyileştirme odası fotoğrafı şart (Kalemkâr ve Revak'taki gibi). Pembe, tarım için
     cesur ve sektörden geliyor ama ilk bakışta "mor YZ gradyanı" sanılma riski var;
     düz LED rengi olarak kalmalı. Ayrıca yalnız aşılı fideyi öne çıkarıyor; aşısız
     fide ve seralar ikinci planda kalır. Anaç adları niteleyici (tescilli marka yok).
Bu yönün yanlış stil izleri: pembe→mor gradyan, neon parıltı, cam efekti; "bilim
     kurgu laboratuvarı" dili; anaç için uydurma verim yüzdesi.
```

## 5. Benzer brif testi

- **A:** Başka bir fidelik brifiyle buraya varır mıydım? Viyolü dolduran sipariş fikri kategoriye yakın (brifte örnek olarak da geçti), o yüzden riskli. Değiştirdiğim: fikri dekor dolumundan çıkarıp gerçek hesaba bağladım (son viyolün yarım dolması, 45/28 göz değişimi, açık formüllü araba etiketi). Görsel dil (galvaniz tezgâh + isim kazığı + şablon harf) Gelidonya'ya ait; ama yine de üçün en "beklenen"i.
- **B:** Başka fidelik brifiyle buraya varmazdım: kâğıt döner cetvel tarım sitelerinde yok, renk denizden (marka adı Gelidonya Burnu) geliyor, yeşil hiç yok. Taslak planında okuma penceresi saat 9 yönündeydi (yazılar dik dönecekti); kodlamadan önce 12 yönüne aldım, telefonda da aynı yön çalışsın diye.
- **C:** Pembe LED odası ve klipsli makro gövde başka bir fidelikte de kullanılabilir (aşılı fide herkesin işi). Fark yaratan, siparişin "üst / alt" iki yarımla verilmesi. İlk taslaktaki arka plan siluetleri mantar gibi okunuyordu, kaldırdım.
- Kartlar birbirinin renk varyantı değil: dünya (tezgâh / kâğıt cetvel / aşı odası), tipografi (şablon dar grotesk / ekstra dar grotesk + Kiril / mürekkep tuzaklı grotesk) ve imza etkileşim (doldurmak / çevirmek / birleştirmek) ayrı.
- Kardeş demolardan fark: hiçbirinde Big Shoulders, Sofia Sans, Bricolage, Schibsted, Onest yok; ultramarin, pembe LED ve galvaniz grisi kullanılmadı. Pazı'nın ± plakası yerine A'da dönüm/adet sayacı + viyol görseli, B'de disk, C'de iki yarım çip; mono veri yazısı hiçbirinde yok.

## 6. Önerim: B, Ekim Cetveli

Gerekçe: fidelik işinin özü "hangi hafta" sorusu; B bu soruyu tek bir tanıdık nesneyle cevaplıyor ve aynı nesne firmanın üç işini birbirine bağlıyor: fide (tohum → teslim), sera (dikim → hasat), ürün alıcısı (hangi hafta ne hasatta). Kimlik sırasına (sera, fide, ihracat) en iyi oturan yön bu. Rutinden en uzak olanı ve telefonda kupon + alt çubukla kullanılabilirliği koruyor.
Maliyet: üçünün en çok zanaat isteyeni (SVG disk, sürükleme, klavye, iki yüz). A daha güvenli ve hızlı yapılır; C en çok görsel üretim ister.

Raşit'e tek soru: **Hangi yönle devam edelim? B (önerilen), A, C ya da Kanon.**

## 7. Paralel demoyla font çakışması (2026-10-05 sonu kontrolü)
Aynı gün başlayan `sazbahce` demosunun yön adaylarında da **Sofia Sans + Sofia Sans Extra Condensed** (onların yön B'si) ve **Onest** (onların yön A'sı) var; Schibsted de anılıyor. İki demo da seçim bekliyor.
- B seçilirse ve sazbahçe de Sofia Sans'lı yönü seçerse, Gelidonya'da yedek: **Saira Extra Condensed** (gösterim, OFL, Türkçe ✓, Kiril yok) + **Golos Text** (gövde, OFL, Türkçe ✓, Kiril var). Disk yazıları dar kaldığı için tez bozulmaz.
- C seçilirse ve sazbahçe Onest'li yönü seçerse gövde **Golos Text**'e geçer.
- Karar: ikinci seçilen demo değiştirir (ucuz karar, ajan alır).
