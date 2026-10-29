# YÖN ADAYLARI: Vaziyet (ilk çalışma adı Pafta)

Ad notu: "Pafta" gerçek firmalarla çakıştı (bkz. `arastirma/RAPOR.md` bölüm 5); maketlerde ve belgelerde çalışma adı **Vaziyet**. İkinci aday: **Plankote**.

Tarih: 2026-10-09 · Girdi: `PROJE.md`, `REFERANSLAR.md`, `arastirma/RAPOR.md`, kardeş demoların `YON.md` dosyaları · Prototipler: `yon-a.html`, `yon-b.html`, `yon-c.html` (her biri `?durum=tasma` ile taşma anını açar) · Ekranlar: `ekran/yon-{a,b,c}-{1440,1440-tasma,390,390-tam,390-tasma}.png` · Karşılaştırma: `yon-panosu.png`

Üç aday da aynı aracı çalıştırıyor (aynı örnek arsa 30 × 22 m, aynı imar değerleri, aynı beş kurgusal model, aynı maliyet formülü); karşılaştırma yalnız görsel dil ve imza an üzerinden yapılsın diye.

## 1. Rutin ve tersi
- **Bu kategorinin hep yaptığı sayfa** (17 sitelik taramadan): karartılmış fotoğraf ya da havuzlu villa render'ı üstünde beyaz başlık ve slayt ("Hayalinizdeki ev", "Lüksü yeniden tanımlayın", "X TL'den"); turuncu/yeşil/kırmızı düğme; sayaçlar; model kartı ızgarası ya da fiyat tablosu, kapsamı dipnotta; konutla şantiye kampı aynı menüde; ilk ekranı kapatan çerez ve kampanya pencereleri; yüzen WhatsApp balonu; "ruhsat gerekir mi" SEO yazıları.
- **Tahmin edilebilir tersi:** (1) "premium editoryal": krem zemin, iri serif başlığın ikinci satırı italik bordo, aralıklı büyük harf künye, 3B render. Sektörün en iyi sitesi Aktaş tam olarak bu. (2) İskandinav minimal tiny house: beyaz, ince grotesk, ormanda A-çatılı kulübe fotoğrafı. İkisi de yasak.
- **Kardeş demolardan ayrışma:** Sazbahçe'nin "plan + antet = yapılandırıcı" düzeni, Gelidonya'nın "kâğıt sipariş formu + tükenmez mavisi", Pazı'nın "ölçü plakası + mono veri + RAL sarısı", Onikitaş'ın "beyaz maket + gün döngüsü" tekrar edilmez. Sarı vurgu (Pazı, Sazbahçe) ana vurgu olarak kullanılmaz.

## 2. Yedi dünya (sekiz aday)
| # | Dünya | Aile | Kitle neden tanır | Sitede neye dönüşür |
|---|---|---|---|---|
| 1 | İmar paftası ve plan lejantı (parsel köşe noktaları, ada/parsel numarası, yapı yaklaşma sınırı, nazım plan renkleri) | Kâğıt-baskı · işaret | Arsası olan herkes belediyede ya da parsel sorgu ekranında paftasını görmüş | Arsa çizimi plan diliyle; yapılaşma alanı plan lejantının konut sarısıyla |
| 2 | İmar durumu belgesi (TAKS, KAKS, Hmax, bahçe mesafeleri satırları, plan notları) | Kâğıt-baskı · arşiv | Ev yaptıracak herkesin ilk aldığı kâğıt | Girdi formu belgenin kendisi; "belgede nerede yazar" |
| 3 | Aplikasyon: harita mühendisinin kazıkları, gergin ip, ölçü çizgileri | İşaret ve yön bulma · alet | Arsasına aplikasyon yaptıran herkes köşelere çakılan kazığı ve ipi görmüş | Evin köşelerine kazık çakılır, ip gerilir; dışarıda kalan kazık kırmızı |
| 4 | Masa oyunu tahtası ve taş (ızgara, parça, döndürme, kural kartı, skor) | Oyun ve ritüel | Tavla, okey, kutu oyunları; Raşit'in kendi dünyası | Arsa tahta, ev taş; kural dışı yerleşim kırmızı; skor şeridi |
| 5 | Mimari maket (kesim matı, mantar levha, renkli akrilik bina, sünger ağaç) | Taş-mimari-mekân · zanaat | Satış ofislerindeki site maketleri, mimarlık vitrinleri | Arsanın maketi; ev hacmi ve yükseklik sınırı pleksisi |
| 6 | Fabrika panel etiketi ve sevkiyat planı (panel numarası, tır yükleme şeması) | Mekanizma-alet · arşiv | Prefabrik alan herkes "paketli sevk" ve montaj gününü görür | Maliyet dökümünde kaç tır, kaç gün; "nasıl üretiyoruz" bölümü |
| 7 | Güneş yolu diyagramı (doğu-güney-batı yayı, kış öğlesi gölgesi) | Işık-optik · doğa | "Salon güneye baksın" herkesin ilk isteği | Salonun baktığı yön ve gölgenin düştüğü bahçe |
| 8 | Tapu senedi ve nitelik satırı (arsa / tarla / bağ) | Kâğıt-baskı | Çekmecedeki tapu; "tarla" yazısı herkesin derdi | Nitelik seçimi ve dürüst ruhsat paneli |

Aileler: kâğıt-baskı, işaret, oyun-ritüel, mimari-mekân, alet, ışık (6 aile). Turistik ve "yuva" kitsch'i yok: kuş yuvası, kalp çatılı ev ikonu, anahtar ikonu, mutlu aile silueti, "hayalinizdeki ev".

## 3. Seçim ve zar
- Rezonansa göre en güçlü iki dünya: **3 Aplikasyon** (1 ile birlikte; işin gerçek hayattaki biçimi) ve **4+5 Tahta ve maket** (en akılda kalan; brifteki "parçayı tahtaya yerleştirme" hissi; 3B yükseklik kontrolünü de taşır).
- Üçüncüyü kalanlardan zarla:
  ```
  python -c "import random,sys; random.seed(sys.argv[1]); print(random.choice(sys.argv[2:]))" "pafta-2026-10-09" "İmar durumu belgesi" "Masa oyunu tahtası ve karo" "Fabrika panel etiketi ve montaj şeması" "Güneş yolu diyagramı" "Tapu senedi"
  → İmar durumu belgesi
  ```
  Not: zar listesinde masa oyunu da vardı; zar onu seçmeyince oyun hissi B'nin maketine taşındı (maket tahtasına taş koymak).
- Kanon (kategorinin standardı, tam kalitede) yalnız Raşit isterse yapılır; önermiyorum.
- **Görsel dil özeti:** A = yalnız 2B vaziyet planı · B = ana sahne kuzey oklu kuşbakışı plan (maket tahtasının tam üstten görünüşü), 3B yalnız "Maket" sekmesinde, yükseklik için · C = belge + 2B kroki. B'nin varsayılanı yurt dışı parsel araçlarının ortak kalıbına göre plan yapıldı (`REFERANSLAR.md` yurt dışı notu).

## 4. Yön kartları

```
YÖN A: Aplikasyon  (dünya: imar paftası + aplikasyon, aile: işaret ve kâğıt-baskı)
Tez: Evi broşürle değil, arsanızın paftası üzerinde ölçüsüyle gösteririz; köşelerine
kazık çakılır, sığmayan köşe kırmızı kalır.
Reddettiği varsayılan: havuzlu villa slaytı + "X TL'den" + model ızgarası; ve tersi olan
premium editoryal.
Kendi dünyası: ozalit (diazo) kopyanın morumsu kâğıdı ve koyu mor çizgisi; numaralı parsel
köşe noktaları, ada/parsel etiketi, komşu parsel çizgileri, yol bandı, 45° taralı çekme
şeridi, kesikli yapı yaklaşma sınırı, oklu ölçü çizgileri, kuzey oku, öğle güneşi yayı,
ölçek çubuğu. Evin köşelerinde jalon başı gibi çeyrekleri boyalı kazıklar ve aralarında
turuncu ip. İçerik silinse pafta kalır.
İlk ekran (1440): sol %36: başlık (LCP), alt cümle, üç kart: 1 Arsanız (cephe, derinlik,
tapudaki niteliği) · 2 İmar durumunuz (TAKS, KAKS, yükseklik, ön/yan/arka; odakta
"belgede nerede yazar") · 3 Model (ayak izi küçük resimli 5 düğme). Sağ %64: durum kutusu
("Sığıyor. 582 m² bahçe kalıyor." / "Bu haliyle sığmıyor."), Evi çevir / Kuzeyi çevir,
büyük plan; altında sonuç şeridi (taban/TAKS, bahçe, yükseklik, salon, toplam tahmini
maliyet, "Bu yerleşimle teklif iste", "Dökümü gör") ve ruhsat notu.
  +-------------------------+------------------------------------------+
  | Ev arsanıza sığar mı?   | [Sığıyor. 582 m² bahçe]   [Evi çevir][K] |
  | Sipariş vermeden bilin. |   komşu        30,0 m        komşu        |
  | alt cümle               |   1 o-----------------------o 2   (K)     |
  | [1 Arsa  30 × 22]       |     |///[ yapılaşma alanı ]///|          |
  | [2 İmar TAKS KAKS H ...]|     |///  x==[ Sofa 78 ]==x  //|          |
  | [3 Model □ ■ ▬ ▪ ▭]     |   4 o----------YOL----------o 3          |
  |                         | taban | bahçe | yükseklik | salon | 1,0 M |
  +-------------------------+------------------------------------------+
  Mobil: başlık → durum → pafta → sonuç ızgarası → kartlar; sabit çubuk Ara · WhatsApp ·
  Talebimi gör.
İmza etkileşim: "Aplikasyon". Model seçilince ev ayak izi belirir, dört köşesine sırayla
kazık çakılır (70 ms arayla), ip gerilir (çizgi çizilir), ölçüler yazılır. Ev sürüklenir,
ok tuşlarıyla 0,5 m kayar, 90° döner ("Evi çevir"; arsanın kuzey yönü "Arsanın yönü" düğmesiyle). Sınırı aşan parça kırmızı taranır, aştığı mesafe
kırmızı ölçüyle yazılır ("Ön bahçe çizgisini 1,4 m aşıyor"); çevirince sığıyorsa düğme
çıkar. Konseptten çıkışı: evin yeri arsada gerçekten böyle işaretlenir.
Tipografi: Chivo (başlık 850, gövde 400–500) + Chivo Mono (yalnız ölçü ve değer) · SIL OFL ·
Türkçe glif ✓ (latin-ext). ₺ yerine "TL" yazılır.
Renk: Sakin + tek kararlı bölge (yapılaşma alanı) · kâğıt #F1F0F6, yüzey #FBFAFD,
mürekkep (ozalit moru) #2C2366, metin-2 #5A5390, çizgi #B7B2D6, yapılaşma alanı #FFF7B8
(nazım imar planı gösterimlerinde gelişme konut alanının açık sarısına yakın, Ek-1ç
255/254/168), ip ve güneş #D98A1E, taşma #C8322A (yalnız ihlal).
Hareket tezi: odak an kazık + ip (≤ 700 ms); süreklilik: sürüklerken ölçülerin canlı
güncellenmesi; geri bildirim: alanlar ve düğmeler 120–150 ms. Azaltılmış harekette kazık
ve ip anında yerinde.
Kadranlar: çeşitlilik 3/10 · hareket 3/10 · yoğunluk 6/10
Risk ve maliyet: en düşük maliyet (yalnız SVG). En büyük risk "vasat/standart": iyi
yapılmış bir hesap aracı gibi durabilir; Sazbahçe'nin "planı kahraman yap" hamlesine
yakın (fark: masa planı değil kadastro ve aplikasyon). Sol sütunda üç form kartı ağır
duruyor. İnşada ozalit kâğıdı dokusu ve daha cesur bir pafta sunumu gerekir.
Bu yönün yanlış stil izleri: koyu mavi zemin üstünde beyaz çizgili "blueprint" kostümü;
her yerde mono etiket; koordinat şeridi; CAD katman paneli taklidi.
```

```
YÖN B: Tahta  (dünya: mimari maket + masa oyunu tahtası, aile: mimari-mekân ve oyun)
Tez: Evinizi arsanızın maketine bir oyun taşı gibi koyarsınız; yukarıdan bakınca ölçülü plan,
"Maket" sekmesinde aynı sahne eğilir ve izin verilen yükseklik görünür.
Reddettiği varsayılan: fotogerçekçi 3B yapılandırıcı (Aktaş, Goedhuis) ve havuzlu render;
tersi olan beyaz ya da kireç minimal maket (Onikitaş'ın dünyası). Burada maket renkli
malzemeyle ve oyun tahtası mantığıyla kurulur, gün döngüsü yok.
Kendi dünyası: maket masasının yeşil kesim matı ve 1 m / 5 m ızgarası; mantar levhadan
kesilmiş arsa (kenar kalınlığı görünür), koyu mantar çekme şeridi, kesikli yapılaşma
sınırı; gri kartondan yol ve şeritleri; kobalt mavi akrilik ev taşı (beşik çatılı);
izin verilen yüksekliği gösteren ince pleksi levha ve köşe çubukları; sünger top ağaçlar; masa
lambasının yumuşak temas gölgesi (güneş saati yok, gölge anlatısı Onikitaş'tan ayrışmak için çıkarıldı).
İçerik silinse masa ve maket kalır.
İlk ekran (1440): koyu yeşil zemin. Sol 440 px: başlık (LCP), alt cümle, taş rafı (beş
model, küçük izometrik taş), "Arsanızın kuralları" kartı (oyun kural kartı gibi; her
satırda ✓/✕): arsa ölçüsü, tapudaki niteliği, TAKS, KAKS, ön·yan·arka, yükseklik.
Sağ: durum kutusu, Plan/Maket anahtarı, Evi çevir; büyük tahta (varsayılan kuşbakışı plan, salon
yönü okla); altta skor şeridi
(taban/TAKS, bahçe, saçak/sınır, salon, toplam tahmini maliyet + teklif) ve ruhsat notu.
  +----------------------+------------------------------------------------+
  | Evi almadan önce     | [Sığıyor. 582 m² bahçe…]     [Maket|Plan][Çevir]|
  | arsanıza koyun.      |        ·  ·  ·  ·  ·  ·  ·  ·  (kesim matı)     |
  | alt cümle            |       /‾‾‾‾‾‾ mantar arsa ‾‾‾‾‾‾/   ⇣K           |
  | [taş][taş][taş]...   |      /  ┌ ─ ─ ─ ─ ┐  pleksi  /                   |
  | ┌ Kurallar ───────┐  |     /   │ ▲Sofa78 │         /                    |
  | │ TAKS 0,30     ✓ │  |    /____└ ─ ─ ─ ─ ┘________/                     |
  | │ Ön·yan·arka   ✓ │  |   ==========  YOL  ==========                    |
  | └─────────────────┘  | taban | bahçe | saçak | salon | 1,02–1,09 M TL  |
  +----------------------+------------------------------------------------+
  Mobil: başlık → durum → anahtarlar → maket (ekran genişliği) → skor → taş rafı →
  kurallar; sabit çubuk.
İmza etkileşim: "Evi koy" (iç adı "taşı koy"; ekranda "taş/tahta" kelimesi yok, ev alan aile
evi ev diye görür). Modeller rafından bir ev seçilince tahtaya iner ve 0,5 m ızgaraya oturur
(420 ms); kural dışıysa taşan kısım kırmızıya döner, kural kartındaki satır ✕ olur, durum
kutusu "Evi çevirirseniz sığıyor" der ve tek "Evi çevir" düğmesi vurgulanır. "Maket" sekmesi
aynı sahneyi eğer (askerî perspektif: plan ölçüsü bozulmaz): izin verilen yükseklik pleksisi
ve köşe çubukları görünür, aşan kat kırmızı. İmza şeridi: `ekran/yon-b-imza-seridi.png`.
Konseptten çıkışı: satış ofisindeki maket ve kutu oyunundaki taş yerleştirme, aynı
ölçü kurallarıyla.
Tipografi: Gabarito (başlık 800; geometrik, kalın, kutu oyunu kapağı karakteri ama ciddi) +
Host Grotesk (gövde, arayüz) · SIL OFL · Türkçe glif ✓ (çizimle sınandı). İlk denemedeki
Golos Text Google Fonts sürümünde "ğ" harfini kırmasız çiziyor ("sağda" → "sagda"), elendi;
Bricolage Grotesque yapay zekâ sitelerinde çok görüldüğü için (taze göz uyarısı) bırakıldı.
Renk: Tam palet, bölge bölge (malzemeden) · kesim matı #1D5444, mat ızgarası #2E6957 /
#4C8471, kart #F7F8F5, metin (kartta) #13201B, mantar #C89B68 (kenar #9E7445), kobalt taş
#3157D5 (yan yüz #1B3790), taşma #E5392D, açık metin #F3F6F2. Vurgu kilidi: ana düğme
kobalt (ev taşının rengi = "sizin eviniz").
Hareket tezi: odak an evin inişi ve oturması; süreklilik plan↔maket eğilmesi (620 ms,
aynı sahne); geri bildirim kural kartında ✓/✕. Bütçe 3 imza an. Azaltılmış harekette ev
anında yerinde, eğilme anında.
Kadranlar: çeşitlilik 5/10 · hareket 5/10 · yoğunluk 5/10
Risk ve maliyet: orta emek (SVG askerî perspektif, görünür yüz ve gölge hesabı;
prototipte çalışıyor, WebGL gerekmiyor, hafif). Riskler: "oyuncak" algısı (renk dozu,
köşe yuvarlaklığı ve metin ciddiyetiyle dengelenir); koyu yeşil ilk ekranı üreticinin
kabul etmesi; "maket" kelimesi Onikitaş'la ortak (görsel olarak karışmıyor: renkli, gün
döngüsü ve güneş gölgesi yok, ana sahne plan). Model sayfaları ve "nasıl üretiyoruz" bölümü de aynı maket
dilinde kalmalı (render + düz vektör + stok foto karışımına düşmemek için).
Bu yönün yanlış stil izleri: çizgi film ev ikonu; parlak plastik oyuncak; serbest
döndürülen 3B kamera; gün döngüsü ya da gün batımı ışığı; "SimCity" kalabalığı.
```

```
YÖN C: Belge  (dünya: imar durumu belgesi + fosforlu kalem; aile: kâğıt-baskı ve arşiv; zarla)
Tez: Belediyeden aldığınız kâğıdı birlikte okuruz; fosforlu kalemle işaretlediğiniz her
satır, yanındaki krokide evinizin sınırına dönüşür.
Reddettiği varsayılan: "ruhsat gerekmez" vaadi ve "ruhsat gerekir mi" diye uzayan SEO
yazıları; tersi olan hukuk bürosu ciddiyeti (lacivert-altın, terazi).
Kendi dünyası: gri masa laminatı üstünde iki yaprak A4: üstteki "İMAR DURUMU" belgesi
(satır tablosu, "ÖRNEK BELGE" filigranı, kurum adı ve logosu yok), fosforlu kalem
şeritleri, kurşun kalemle milimetrik kâğıda çizilmiş kroki (taralı ev, kesikli sınır),
kırmızı kalemle işaretli taşma; kontrol listesi (✓/✕).
İlk ekran (1440): sol: belge (değerler belgenin satırlarına doğrudan yazılır); sağ:
başlık (LCP), alt cümle, durum cümlesi, model sekmeleri, kroki + kontrol listesi +
toplam tahmini maliyet + teklif, ruhsat notu.
  +-----------------------------+----------------------------------------+
  | İMAR DURUMU      (örnek)    | İmar durumunuzu birlikte okuyalım.     |
  | Ada/parsel   412 / 7        | alt cümle                              |
  | TAKS         [0,30]         | Sofa 78 sığıyor; 582 m² bahçe kalıyor. |
  | KAKS         [0,60]         | (Sundurma)(Sofa)(Hayat)(Cumba)(Avlu)   |
  | Yençok       [6,50] m       | ┌ milimetrik kroki ┐ ┌ Kontrol ──────┐ |
  | Ön bahçe    [▓5▓] m ←fosfor | │  ▓▓ön bahçe▓▓     │ │ ✓ Bahçe mes.  │ |
  | Yan / Arka   [3] [3] m      | │    [Sofa 78]      │ │ ✓ TAKS  ✓ ... │ |
  | Plan notları (işaretli)     | └───────────────────┘ │ 1,02–1,09 M TL│ |
  +-----------------------------+----------------------------------------+
  Mobil: başlık → durum → sekmeler → kroki → kontrol ve fiyat → belge; sabit çubuk.
İmza etkileşim: "Satırı işaretle". Bir değere dokununca o satır fosforlu kalemle çizilir
(soldan sağa 320 ms), krokide karşılığı aynı yeşille parlar (ön bahçe → yol tarafındaki
şerit), okuma notu o değerin ne demek olduğunu söyler; kontrol listesindeki satır ✓ ya da
✕ olur. Konseptten çıkışı: insanlar resmî kâğıdı gerçekten fosforlu kalemle okur.
Tipografi: Atkinson Hyperlegible Next (başlık 800, gövde) + Atkinson Hyperlegible Mono
(belge değerleri, ölçüler) · SIL OFL · Türkçe glif ✓. Gerekçe: okunurluk için tasarlanmış
aile; kitlenin yaşı ve "belgeyi okumak" fiili.
Renk: Sakin + tek fosforlu vurgu · masa #DDE2E5, kâğıt #FDFDFB, mürekkep #1B1E22,
kurşun #3A3F45, metin-2 #4E555C, fosforlu kalem #D4F53C (üstünde her zaman koyu metin),
koyu fosfor #56701A (✓ ve not çizgisi), kırmızı kalem #C42B2B (yalnız taşma).
Hareket tezi: odak an fosforlu çizgi + krokideki karşılığın parlaması; süreklilik kontrol
listesi; geri bildirim alanlar. Azaltılmış harekette çizgi anında.
Kadranlar: çeşitlilik 3/10 · hareket 3/10 · yoğunluk 7/10
Risk ve maliyet: en düşük "vay" ve en yüksek "standart/bürokratik" riski; sol yarıyı
kaplayan belge uzun form gibi okunabilir. Gelidonya'nın kâğıt sipariş formu fikrine yakın
(fark: doldurmak değil, okumak ve işaretlemek). Fosforlu yeşil, "asit yeşili vurgu" izine
yakın; gerekçesi dünyada (fosforlu kalem) ama dozu düşük tutulmalı. Gerçek belge taklidi
riski: kurum adı, logo, mühür, imza kullanılmaz; filigran şart.
Bu yönün yanlış stil izleri: e-Devlet ekranı taklidi; sahte mühür ve ıslak imza; hukuk
sitesi lacivert-altın; her satırda fosforlu kalem (vurgu tek satırda kalır).
```

## 5. Benzer brif testi
- **A:** Başka bir prefabrik üretici brifiyle buraya varır mıydım? "Plan çiz" fikri kategoriye açık (Smart'ın plan stüdyosu var). Kurtaran: ozalit paftası ve aplikasyon kazığı, arsanın gerçek hayattaki işaretlenme biçimi. Değiştirilen: ilk taslakta durum kutusu planın üstüne biniyor ve plan dar bir şeritte kalıyordu; örnek arsa yataylaştırıldı (30 × 22), durum kutusu çizimin dışına alındı; salon yönü etiketi bozuk çekim veriyordu ("güne"), düz yön adlarına çevrildi.
- **B:** "3B maket" her konut brifinde akla gelir, ama burada maket bir araç: plan ölçüsünü koruyan askerî perspektif, yükseklik sınırı pleksisi, kural kartı. Kutu oyunu taşı fikri Raşit'e özgü. Değiştirilen: maket ilk taslakta tuvalin yarısında küçük kalıyordu, görünüm kutusu arsaya ve evin yüksekliğine göre daraltıldı; gölge anlatısı önce bozuk Türkçeydi, sonra Onikitaş'ın gün/gölge fikrine benzediği için tümüyle çıkarıldı (salon yönü okla verildi); "Çevir" görünüm anahtarından ayrıldı; ekrandaki "taş/tahta" kelimeleri "ev" oldu; varsayılan görünüm plana çekildi.
- **C:** "Belge okuma" fikri her mevzuatlı ürüne uyar (sigorta, kredi). Kurtaran: imar durumu satırlarının krokide birebir karşılığı olması. Değiştirilen: başlığın tek kelimesi fosforlu vurguluydu (iz listesinde "başlıkta tek kelime vurgusu"), kaldırıldı; vurgu yalnız belgede. Kroki ilk ekranın altına düşüyordu; kroki ile kontrol listesi yan yana alındı.

Kartlar birbirinin renk varyantı değil: A açık mor-sarı kâğıt ve 2B çizim, B koyu yeşil masa ve 3B maket, C gri masa, beyaz belge ve fosforlu kalem. Fontlar üç ayrı aile; imza anlar ayrı (kazık / taş / fosforlu satır).

Önceki demolarla çakışma kontrolü: fontlar (DM Serif Display, Instrument Sans, Pinyon Script, Bodoni Moda, Gloock, Schibsted Grotesk, Marcellus, Hanken Grotesk, Newsreader, Young Serif, Geologica, Archivo, Martian Mono, Anybody, Onest, Big Shoulders Display) hiçbiri kullanılmadı; Chivo, Gabarito, Host Grotesk ve Atkinson Hyperlegible aşırı kullanılanlar listesinde yok; dördü de Türkçe harflerle çizilerek sınandı (Golos Text "ğ"de bozuk çıktı, Bricolage Grotesque yapay zekâ izi riski yüzünden bırakıldı). Paletler: badana-traverten, taş-mühür kırmızısı, bakır-fıstık, beton-RAL sarısı, söğüt-ayva, viyol beyazı-domates tekrar edilmedi. Paralel demolarla çakışma (15:40 kontrolü): Yedi Pencere'nin B adayı da gövdede **Host Grotesk** kullanıyor; iki demoda da B seçilirse Vaziyet'in gövde yazısı **Albert Sans** ya da **Rethink Sans** olur (ikisi de Türkçe harflerle çizilerek sınandı). Damar A: Sofia Sans ailesi; Yedi Pencere A: Barlow Semi Condensed + Spectral, B: Besley; Vaziyet'in adaylarıyla başka çakışma yok.

## 6. Önerim: B · Tahta
Gerekçe: Sektörün eksik kalan sorusunu ("bu ev arsama sığar mı") en akılda kalır biçimde yanıtlıyor; bağlamsız taze göz de B'yi seçti (satılabilirlik 8, özgünlük 8); taşma anı (taşın taşan hacmi kırmızı, "çevirince sığıyor") bir bakışta anlaşılıyor; yükseklik sınırı ve gölge gibi planın anlatamadığını gösteriyor; Raşit'in kutu oyunu kimliğine yakın ama araç ciddi kalıyor; sektörün en iyi sitesinin (Aktaş: fotogerçekçi 3B ev, krem editoryal) tam tersi bir yerde duruyor.
Karıştırma önerisi (tezi bozmaz): A'nın başlığı ("Ev arsanıza sığar mı? Sipariş vermeden bilin."), ölçü çizgileri ve kazıkları B'nin plan görünümüne; C'nin "belgede nerede yazar" okuma notu ve kontrol listesi dili B'nin kural kartına.
A güvenli yedek: aynı işi en az emekle yapar, ama "standart" riski en yüksek ikinci yön. C'yi önermiyorum: bürokratik duruyor ve Gelidonya'nın kâğıt form fikrine yakın.

## 7. Prototip notları
- Görseller tamamen prosedürel (SVG, JS ile üretilmiş); dış fotoğraf yok, `GORSEL-KAYNAK.md` gerekmedi. Fontlar prototipte Google Fonts bağlantısıyla; inşada yerel dosya + `THIRD_PARTY.md`.
- Araç gerçekten çalışıyor: ölçüler, imar değerleri, model ve tapudaki nitelik değiştirilebilir; ev sürüklenir (fare, dokunma), ok tuşlarıyla 0,5 m kayar, 90° döner; taşma, TAKS, emsal ve yükseklik kontrolleri ve öneri ("çevirince sığıyor") canlı.
- Örnek veriler kurgusal ve sitede `[örnek]` etiketlenecek: beş model (Sundurma 48, Sofa 78, Hayat 104, Cumba 124 iki kat, Avlu 138; dış ölçü, saçak yüksekliği, liste fiyatı); nakliye "Eskişehir → Bursa, yaklaşık 150 km", tır başına 19–23 bin TL; temel 2.800–3.500 TL/m² (içerik sitesi aralığı, doğrulanmamış); vinç 12–18 bin TL.
- Mevzuata göre: varsayılan bahçe mesafeleri ön 5, yan 3, arka 3 m (Planlı Alanlar İmar Yönetmeliği md. 23; ilk taslaktaki "arka H/2" kuralı güncel yönetmelikte olmadığı için kaldırıldı); yükseklik kontrolü saçak seviyesine göre (md. 4 "Bina yüksekliği"). Kaynak ve kesinlik `arastirma/RAPOR.md` bölüm 3.
- Belge elde yoksa: her üç maket "Belgeniz yanınızda değil mi? En sık görülen değerlerle başladık; ada ve parsel numaranızla belediyenizin e-imar sayfasından bakabilirsiniz" yolunu gösteriyor (taze göz uyarısı).
- URL kısayolları: `?durum=tasma` (18 × 26 m arsa, Avlu 138: iki yandan taşar, çevirince sığar), `?durum=tarla` (A'da ruhsat uyarısı), B'de `&gorunum=maket`.
- Bilinen kusurlar (prototip düzeyi): B'de beşik çatı basit (mahya uzun kenara paralel), ağaçlar sabit konumlu, salon oku yalnız plan görünümünde; C'de dar ekranda kroki yazıları küçük; kuzey yönü yalnız 45° adımla çevriliyor. Kontrast: B skor şeridindeki kırmızı rakam büyük metin olarak 3,9:1 (AA büyük metin için yeterli); diğer metin çiftleri 4,7:1 ve üstü.

## 8. Taze göz

Bağlamsız bir opus ajanı ekran görüntülerine Raşit'in demo kuralları, jüri dersleri ve YZ izi listesiyle baktı (2026-10-09). Puanlar (satılabilirlik / özgünlük / uçukluk riski, 10 = hiç uçuk değil / güven / telefon):

| Yön | Puan | En büyük sorunlar (ilk hâl) | Yapılan düzeltme |
|---|---|---|---|
| A Aplikasyon | 7 / 7 / 9 / 7 / 5 | Telefonda form planın iki ekran altında; ölçü yazıları üst üste; iki yan taşarken "sol tarafı aşıyor" diyor; iki ayrı "Evi çevir" düğmesi; "Kuzeyi çevir" anlaşılmıyor | Telefonda sıra: başlık → durum → plan (kaydırırken yapışkan) → model → arsa → imar; taşma metni iki yanı birlikte söylüyor; tek "Evi çevir" düğmesi önerildiğinde vurgulanıyor; "Arsanın yönü"; ada-parsel yazısı ve güneş yayı ölçülerden ayrıldı; kart numaraları kaldırıldı |
| B Tahta | 8 / 8 / 7 / 6 / 6 | Ekrana iç kavram dili sızmış ("Taşı çevir", "Tahta yalnız ölçülere bakar"); yazılar çakışıyor; havada duran pleksi anlaşılmıyor; telefonda model ve form en altta; "sol yanı" hatası; Onikitaş'a benzeyen kış gölgesi anlatısı; "A · B · C" meta satırı; Bricolage Grotesque YZ sitelerinin gediklisi | "Evi çevir", "Bu hesap yalnız ölçülere bakar"; zemin yazılarına koyu kenar; pleksiye köşe çubukları ve "izin verilen yükseklik" etiketi; telefonda tahta üstte yapışkan, hemen altında modeller ve kurallar; güneş gölgesi ve gölge cümlesi kaldırıldı, salon yönü okla; varsayılan görünüm kuşbakışı plan; fontlar Gabarito + Host Grotesk |
| C Belge | 5 / 5 / 9 / 8 / 3 | Telefonda model şeridi sayfayı yana kaydırıyor (sabit çubuk ekran dışına düşüyor); imza an telefonda kopuyor; devlet formu görünümü, Gelidonya v2'nin "vasat" reçetesine yakın; düz cümlelerde mono yazı | Yatay taşma düzeltildi (flex hizası, şerit kendi içinde kayıyor); kontrol listesindeki cümleler normal yazıyla; tek etiket "Teklif iste". Görünüm sorunu yapısal: C önerilmiyor |

Üç yönde ortak eksik ("belgem elimde yok" yolu) eklendi. Taze gözün seçimi B; bitirmeden istediği iki düzeltme (telefonda model ve ölçülerin ilk ekrana gelmesi, dil ve doğruluk turu) yapıldı. Düzeltmeler sonrası ikinci bir bağlamsız puanlama yapılmadı (oturum sınırı); kontrol, yeniden çekilen ekran görüntüleri üzerinden kendim yaptım: 390, 1440 ve taşma kareleri çakışmasız, yatay taşma 0 px, konsol hatası yok.
