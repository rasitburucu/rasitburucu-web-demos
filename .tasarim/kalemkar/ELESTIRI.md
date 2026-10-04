# ELEŞTİRİ: Kalemkâr

## Tur 2 / önce (2026-10-04, cila turundan önce)

Yakalama: `ekran/v1-*.png` (geliştirme sunucusu, 1440×900, 390×844, azaltılmış hareket). Sol alttaki "N" rozeti Next geliştirme göstergesi; yok sayıldı.

**Özgünlük: yazarlı.** Değiştirme testi: logo ve metin başka bir restoranınkiyle değişse kazımalı sini, kazıma yazıdaki Antep ürünleri ve kat planı yine Antep'i anlatır; sayfa başka markada çalışmaz. İskelet testi: metin silinince "sini + tabak sırası + ev planı" yapısı anlam taşıyor. Hafıza testi: "tabakların bakır siniye tek tek konduğu site". Kalıp testi: G kalıbının parçaları yok (krem zemin, mono büyük harf etiket, koordinat şeridi yok). Yoğunluk: ilk ekranda bakır gerçekten var; sakinlik boşluğa dönmemiş.

| Ölçüt | Puan | Kanıt |
|---|---|---|
| Tasarım (%40) | 7,4 | `v1-d-01`: güçlü asimetrik ilk ekran, Young Serif + bakır tutarlı. Ama `v1-d-09`/`v1-d-05`: tabak fotoğrafları dört ayrı seramikte (beyaz, turkuaz, pembe, gri) ve firik/humusta tabak yok; CSS ile çizilen koyu kenar fotoğrafın üstüne yapışık duruyor. Tek mutfak hissi kırılıyor. |
| Kullanılabilirlik (%30) | 7,2 | Satır içi rezervasyon cümlesi ilk ekranda, 6 adım net, mobil alt çubuk var. Eksik: odaklanan hap düğmeler köşeli dikdörtgene dönüyor (`:focus-visible` kuralı `border-radius: 4px` basıyor); rezervasyon adımları arasında geçiş yok, içerik birden değişiyor; mobil menü anında açılıp kapanıyor. |
| Yaratıcılık (%20) | 7,6 | Servis fikri konseptten çıkıyor. Ama sözleşmedeki "tek nesne" sürekliliği yok: `v1-d-02-ucus-2` iki ayrı sini aynı karede görünüyor (girişteki kaybolurken servis sinisi aşağıdan geliyor). İmza an iki nesneye bölünmüş. |
| İçerik (%10) | 7,3 | Metin somut ve yerel (Oğuzeli, Nizip, Yavuzeli); "örnek" etiketleri dürüst. Görsel içerik farklı fotoğrafçılardan, tabaklar eşleşmiyor. |

Ağırlıklı: 0,4·7,4 + 0,3·7,2 + 0,2·7,6 + 0,1·7,3 = **7,37** → Mansiyon olası, Günün Sitesi sınırda.
Geliştirici: Semantik 7,5 · Animasyon 7 · Erişilebilirlik 6,8 · WPO 8,2 · Duyarlı 7,3 · Markup 7

### Bulgular

| # | Önce | Sonra | Neden |
|---|---|---|---|
| 1 | Giriş sinisi ile servis sinisi iki ayrı nesne; kaydırınca biri kaybolur, öteki aşağıdan gelir (`v1-d-02-ucus-2`) | Tek nesne: giriş sinisi kaydırmayla küçülerek servis sahnesindeki yerine iner (kaydırma güdümlü CSS, iki katmanlı dönüşüm), servis sahnesinde sini sağda kalır, metin solda. Mobilde, azaltılmış harekette ve desteklemeyen tarayıcıda bugünkü iki nesneli düzen | Yaratıcılık +0,4, Tasarım +0,2 |
| 2 | Dokuz tabak dört ayrı seramikte, ikisinde tabak kenarı kadraj dışında (`v1-d-09`) | Her fotoğraftan yalnız yemek dairesi kesilir; hepsi aynı "evin tabağına" (prosedürel, sol üstten ışıklı, mat krem sırlı taş tabak) oturtulur; ortak beyaz dengesi, siyah noktası, sol üst ışık katmanı | Tasarım +0,3, İçerik +0,3 |
| 3 | `:focus-visible { border-radius: 4px }` hap düğmeleri odakta köşeli yapıyor | Odak kuralından yarıçap kaldırılır; halka öğenin kendi yarıçapını izler, yalnız düz metin bağlantılarına 3px | Erişilebilirlik +0,3, Kullanılabilirlik +0,1 |
| 4 | Rezervasyon adımları birden değişiyor | İleri giderken yeni adım sağdan 24px kayarak, geri giderken soldan gelir (360ms `--kk-out`); adım çizelgesinin altında ilerleme çizgisi `scaleX(adım/6)` | Kullanılabilirlik +0,1, Animasyon +0,5 |
| 5 | Sayfa geçişi yok (menü ↔ rezervasyon sert kesme) | Aynı belge View Transitions: eski sayfa 160ms solar, yeni sayfa 8px yükselerek gelir; görünen sini rezervasyondaki masaya dönüşür (ortak `view-transition-name`) | Animasyon +0,4, Yaratıcılık +0,1 |
| 6 | Mobil menü anında açılıp kapanıyor | `@starting-style` ile 220ms solma + 8px iniş, `--kk-drawer` | Kullanılabilirlik +0,05 |
| 7 | Süreler CSS'te dağınık sabit sayılar | `--kk-t-fast 140ms`, `--kk-t-state 220ms`, `--kk-t-layout 520ms`, `--kk-t-serve 900ms` tokenları | Tutarlılık, Animasyon +0,1 |
| 8 | Seçim durumları yalnız renk değiştiriyor | Çip ve gün seçiminde 140ms renk + basmada `scale(.97)`; seçili kuver/menü kartında fıstık çerçeve geçişi | Kullanılabilirlik +0,05 |

**Karar: DÜZELT.** Ödül eşiği (7,5) iki maddeye bağlı: tek nesne sürekliliği ve tabak setinin tek çekim günü gibi görünmesi.

### Taze göz (bağlamsız alt ajan), cila öncesi: 7,41 / DÜZELT
Tasarım 7,4 · Kullanılabilirlik 7,3 · Yaratıcılık 7,6 · İçerik 7,4. Benim puanımla (7,37) aynı bant. Ek bulguları: üç ayrı rezervasyon düğmesi adı ve mobil ilk ekranda iki yeşil düğme, mobilde şeridin ikinci satırını sini kesiyor, takvimde "dolu" yalnız renkle, kuverler kenardan taşıyor, çift sayaç, kat planı etiketleri mobilyaya biniyor, karlı salon karesi, "Süt, Kereviz" yazımı. Hepsi bu turda ele alındı.

## Tur 2 / sonra

Yakalama: `ekran/v2-*.png` (statik dışa aktarım, `out/`, 1440×900, 390×844, azaltılmış hareket; geliştirme rozeti yok).

### Uygulanan
1. Tek sini: masaüstünde giriş sinisi kaydırmayla küçülerek servis sahnesine iner (`v2-d-01` → `v2-d-02-ucus-1/2` → `v2-d-03`); servis sahnesinde metin solda, sini sağda. Telefonda ve azaltılmış harekette uçuş yok, iki sini saydamlıkla el değiştirir; hiçbir karede iki sini birlikte görünmüyor (`v2-az-02`).
2. Tabak seti: dokuz fotoğraftan yalnız yemek alındı, tek prosedürel "evin tabağı"na oturtuldu; ortak beyaz dengesi, seviye, gama, doygunluk, sıcaklık, sol üst ışık, tane. Mercimekte sıcaklık korunur, patlıcandaki turkuaz kâse tabak sırına boyanır (`v2-d-09`, `v2-d-05`).
3. Geçişler: sayfa geçişi (View Transitions; sini sayfalar arasında aynı nesne, `v2-d-14`), rezervasyon adımları yönlü giriş + ilerleme çizgisi (`v2-d-12`), mobil menü açılışı (`v2-m-14`), mobil alt çubuk giriş cümlesi kaybolunca gelir, tabak kalkışı bakırdan çıkmadan söner (`v2-d-04`).
4. Zanaat: odak halkası hap biçimini izliyor (`v2-d-16`), süre ve easing tokenları, basma durumları, hover yalnız ince imleçte, takvimde "dolu" noktalı desen, kuverler büyüdü ve kenarın içinde, kat planı ince duvar ve okunur etiket, şef karesi elle sınırlı (dövme ve kol dışarıda), salon karesi aydınlatıldı ve karlı kapı kırpıldı, "Perşembe, 18.30" çipleri, tek düğme adı ("Masanızı ayırın"), mobil şerit ve mobil menü hizası, alerjen yazımı.

### Taze göz, ara tur (uçuş + tabak + geçişler sonrası, şef/kuver/menü düzeltmelerinden önce): 7,40 / DÜZELT
Tasarım 7,4 · Kullanılabilirlik 7,2 · Yaratıcılık 7,8 · İçerik 7,2. Ana kayıplar: mobil menüde "Sofra" başlığın altında, kuverler cılız, servis ara karesi bitişle aynı görünüyor (çekim zamanlaması), şef fotoğrafı (dövmeli kol), giriş ile servis arasında ölü boşluk, kat planı çizgileri kaba. Bunların hepsi son turda düzeltildi; mobilde uçuş istenmedi (aşağıda gerekçe).

### Taze göz, son tur (v2, şef/kuver/menü düzeltmelerinden sonra): 7,59 / DÜZELT
Tasarım 7,6 · Kullanılabilirlik 7,5 · Yaratıcılık 7,8 · İçerik 7,4; özgünlük yazarlı. Eşik (7,5) ilk kez geçildi. Kalan bulgular: kuverler küçük ve kazımanın üstünde, mobil rezervasyon sinisi okunmuyor, masaüstü 1. adımda "Devam" ekran dışında, takvimde "az kaldı" yalnız uzunlukla ayrılıyor, adım/menü geçişi karelerde görünmüyor, şef karesinde Antep'e ait olmayan çorba, salon karesi mağara gibi, servis sayacı metinden kopuk, başlık üç satıra kırılıyor, mobil planda "Giriş" kapıya biniyor, "7+" çipi tek başına alt satırda.

## Tur 3 (v3) — kendi değerlendirmem (yeni taze göz çalıştırılmadı)

Uygulanan: kuverler sini çapının yaklaşık beşte biri, kazıma halkası bu modda %30, kuver gölgesi sininin ışığıyla aynı yönde (`v3-d-11`); telefonda masa değişince sini 2 sn 180 px'e büyür (`v3-m-11`); 2. adımdan itibaren başlık 44 px, sini 380 px, "İleri/Geri" sol sütunun altında yapışkan (`v3-d-13`); "az kaldı" iki nokta, işaret 4 px (`v3-d-13`); adım geçişi 12 px + saydamlık, 100 ms'lik ara karede görünür (`v3-d-12`), menü 80 ms'de yarı saydam (`v3-m-14`); şef karesi kendi bakır sinimiz üstünde firik ve fıstık sarması (sharp kompozisyonu, stok çorba kaldırıldı) (`v3-d-06`); salon karesinin gölgeleri açıldı (`v3-d-07`); servis sayacı ve "Sonraki tabak" metin bloğunun altında, sini dikeyde ortalı (`v3-d-05`); başlık "Antep’in sofrası, / dokuz tabakta." (`v3-d-01`); "Giriş" etiketi kapıdan aşağı, kişi çipleri 4+3 (`v3-m-07`, `v3-m-11`).

| Ölçüt | Puan | Kanıt |
|---|---|---|
| Tasarım (%40) | 7,7 | Tek tabak seti, tek sini, iki satırlık başlık, şef karesi artık dünyanın içinden (`v3-d-01`, `v3-d-05`, `v3-d-06`) |
| Kullanılabilirlik (%30) | 7,5 | "İleri" her adımda görünür, takvim işaretleri biçimle ayrılıyor, mobil kuverler okunur (`v3-d-13`, `v3-m-11`) |
| Yaratıcılık (%20) | 7,9 | Sininin girişten servise inişi ve sayfalar arasında masaya dönüşmesi (`v3-d-02-ucus-*`, `v3-d-14`) |
| İçerik (%10) | 7,5 | Şef karesi menüden; salon karesi hâlâ stok bir taş oda |

Ağırlıklı (kendi değerlendirmem): 0,4·7,7 + 0,3·7,5 + 0,2·7,9 + 0,1·7,5 = **7,66**. İyimserlik payı düşülürse gerçekçi aralık 7,5–7,7.

**Karar: başvuruya yakın; önce gerçek telefonda his testi.** Açık kalanlar `TASARIM.md` borç tablosunda.
