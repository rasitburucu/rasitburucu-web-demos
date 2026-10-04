# YÖN: Revak Okulları · "Kitabe ve revak"

Tarih: 2026-10-04 · Kaynak: v2 kimliği (taş/mürekkep, mühür kırmızısı, revak yürüyüşü) korunarak eleştiri sonrası yazıldı · Diğer adaylar: yok (yeniden kur kararı çıkmadı; yön değişmedi, uygulaması derinleşti)

## Yön sözleşmesi
- **TEZ:** Okul, çocuğun on beş yıl boyunca altından geçtiği bir revaktır; site bu revağı kendi taşıyla kurar ve ziyaretçiyi altından yürütür. Her çocuğun adı taşa kazınır gibi tanınır. · Reddettiği varsayılan: okul portalı (gülümseyen çocuk slaytı, dört renkli ikon kartları, "Neden biz?" üçlüsü, logo şeridi) ve tersi olan "premium editoryal" (krem kâğıt, italik ikinci satır, her yerde § ve büyük harf künye).
- **KENDİ DÜNYASI:** Kesme kalker, kemer taşları ve kilit taşı, başlık silmesi, sabah güneşinin kemer biçimli ışık lekeleri, badanalı tonoz, mürekkep (defter, karne), kırmızı mühür (kayıt defteri). İçerik silinse bile Blender'da kurulmuş taş revak ve kemer biçimi dünyayı taşır.
- **HİKÂYE:** İlk ekranda revağın içinden, çocuk göz hizasından bakış ve "Çocuğum … için … istiyorum." cümlesi. Aşağıda revak yürüyüşü: dört kademe, dört kemer; ışık sabahtan akşama döner, yaş 3'ten 18'e sayar, son kemer bahçeye açılır. Sonra rehberlik takvimi, alışkanlıklar, kulüpler, kampüs, etkinlikler, SSS, en yakın tur saatleri. Ön kayıt bitince çocuğun adı mühürle basılır.
- **İLK EKRAN:** Masaüstü 12 sütun. Sol 7 sütun: Marcellus başlık (LCP metni) üç satır, altında iki satırlık alt başlık, altında cümle formu ve ikincil tur bağlantısı; hepsi 900 px içinde. Sağ 5 sütun: üst ucu kemerli, başlığın üstünden zemine inen revak render'ı (~78vh), hafif yükselme açılışı. Mobil: başlık, alt başlık, tam genişlik kemer render (45vh), cümle formu.
- **İMZA ETKİLEŞİM:** Revak yürüyüşü (kaydırmayla). Kemer yüzleri render edilmiş taş; sabah ve akşam render'ı ışıkla çapraz geçer.
- **BİTİŞ:** Mürekkep zeminli kapanış (en yakın boş tur saatleri) ve alt bilgi. 404: kapalı bir kemer, "Bu kemerin ardında bir oda yok." Seçim rengi mürekkep, imleç ve odak mühür kırmızısı.

## Kadranlar (1–10)
Çeşitlilik: 5 · Hareket: 6 · Yoğunluk: 5

## Tokenlar (kodda geçen gerçek değerler)
| Rol | Değer | Kaynak |
|---|---|---|
| zemin (taş) | #E7E5E0 | Gölgedeki kalkerin soğuk grisi (render'daki tonoz gölgesi) |
| yüzey açık | #F1F0EC | Badanalı tonoz |
| yüzey koyu | #DCD9D2 | Derz ve gölge |
| metin-1 (mürekkep) | #16202E | Karne ve defter mürekkebi |
| metin-2 | #5E6470 | Kurşun kalem |
| vurgu (mühür) | #B8372B · derin #962B21 | Kayıt defterindeki ıslak mühür |
| çizgi | #C9C4BA | Derz |
| odak | 2 px #962B21, 3 px boşluk | |

Renk stratejisi: Sakin. Vurgu yalnız ana eylem, seçili durum, tarih vurgusu ve mühür.
Tema gerekçesi: Veliler gündüz işte, akşam evde araştırır; okul "aydınlık, havadar" görünmeli. Açık taş zemin; tek koyu blok kapanış.

Tipografi:
| Rol | Font | Lisans | Türkçe glif | Ölçek |
|---|---|---|---|---|
| gösterim | Marcellus 400 | SIL OFL 1.1 (Google Fonts, latin + latin-ext) | ✓ ğ ş İ ı | başlık `clamp(2.9rem, 1rem + 5.6vw, 6.6rem)`, bölüm `clamp(2.1rem, 1.2rem + 2.6vw, 3.8rem)` |
| gövde/arayüz | Hanken Grotesk 400–600 | SIL OFL 1.1 | ✓ | 17 px gövde, 15 px arayüz |

İtalik yok (Marcellus'un italiği yok; `font-synthesis: none`). Vurgu ölçekle ve renkle.
Boşluk: 4 tabanlı · Radius: arayüz 2 px, fotoğraf ve render daima kemer · Easing: `--rv-ease-out: cubic-bezier(0.16,1,0.3,1)`, `--rv-ease-io: cubic-bezier(0.65,0,0.35,1)` · Süreler: geri bildirim 150 ms / durum 250 ms / mühür 520 ms / sahne kaydırmayla

## Hareket tezi
- Odak an: revak yürüyüşü.
- Süreklilik: kemer biçimi; kademe kemerine tıklayınca fotoğraf ön kayıt sayfasındaki kademe plakasına dönüşür (View Transitions).
- Geri bildirim: düğmeler 150 ms renk, basınca %97.
- Bütçe: 1) revak yürüyüşü, 2) kemerden ön kayda geçiş, 3) mühür basılması.
- Azaltılmış hareket: 1) yürüyüş yok, dört kademe kemerli fotoğraflı yıllık sayfası olarak okunur; 2) düz gezinme; 3) mühür doğrudan basılı görünür. Lenis kurulmaz.

## Sayfa akışı (ana sayfa)
| # | Bölüm | Yerleşim ailesi | Yüzey | Hareket |
|---|---|---|---|---|
| 1 | Giriş | asimetrik, kemer render taşar | taş | başlık satır açılışı, kemer yükselir |
| 2 | Kısaca | tipografik paragraf, rakamlar metnin içinde | taş | yok |
| 3 | Revak boyunca | pinlenmiş sahne | taş | yürüyüş |
| 4 | Rehberlik | dört adımlı zaman çizelgesi | taş | yok |
| 5 | Alışkanlıklar | başlık + kemerli görsel + liste | taş | kemer açılışı |
| 6 | Ders bittiğinde | liste + hover görseli | taş | yok |
| 7 | Kampüs | tam genişlik render bandı | taş | hafif paralaks |
| 8 | Etkinlikler | tablo | taş | yok |
| 9 | SSS | iki sütun açılır liste | taş | yükseklik |
| 10 | Kapanış | iki sütun, tur saatleri | mürekkep | yok |

## Bu yönün yanlış stil izleri
- Gülümseyen çocuk portresi, kep fırlatma, karatahta, elma, ABC harfleri.
- Lale, çini, nazar; "geleceğin liderleri", "dünya vatandaşı" söylemi.
- Her bölümde § numarası ve büyük harf künye; italik tek kelime vurgusu.
- Uydurma başarı rakamı, sıralama, veli yorumu.

## Benzer brif testi
Başka bir özel okul brifiyle buraya varır mıydım? Kemer motifi bir okul için ilk akla gelen değildir; buraya marka adından (Revak) varıldı. Yürüyüş, kemer render'ı ve mühürlü ad başka okula taşınamaz. Değiştirilen: editoryal kalıp sökülüp yerine taş/kitabe malzemesi kondu.

## İstisna gerekçeleri (YZ izi listesinden kalanlar)
- Açık taş zemin (#E7E5E0, tarama "krem" diye işaretledi): render'daki gölgede kalker; sarı değil soğuk gri.
- Roma rakamları (I–IV): gerçek sıra (kademeler).
- Rakam paragrafındaki dipnot numaraları: gerçek dipnot.
- Yapışkan başlıkta backdrop-blur: okunurluk için, dekor değil.

## Karar: mobil ilk ekranda form önde (2026-10-04, Raşit)
Yön sözleşmesindeki ilk mobil tarif "başlık, alt başlık, 45vh kemer render, cümle formu" idi. Uygulamada form, kemerin altında ilk ekranın dışına düşüyordu. Raşit'in kararı: **işlev merkezde**; telefonda cümle formu ilk ekranda kalır, render başlığın yanında küçük bir kemer olarak durur (dünya ilk ekranda görünür, iş de yapılır).
Gerekçe: veliler siteyi çoğunlukla akşam telefondan açar ve sitenin işi başvuru hunisidir; ilk dokunuşun kaydırmadan yapılabilmesi, büyük render'ın verdiği ilk izlenimden değerlidir. Masaüstünde tarif değişmedi (sağda ekran yüksekliğinde kemer).

## İç sayfalar için yön (v5, derinlik turu)
- **Tek dünya, sayfa başına bir yerleşim ailesi.** Kademe sayfaları ortak şablonu paylaşır ama her biri revaktaki bir saatte durur (anaokulu 08.10 sabah, ilkokul 12.00 öğle, ortaokul 15.40 ikindi, lise 18.30 akşam): kemer render'ının sabah/akşam yüzleri `--sun` ile karışır, "Bir gün" bölümünün zemini o saatin rengini alır, bölüm sırası kademenin önceliğine göre değişir.
- Eğitim: kitabe satırları (ilke) + mürekkep altyazı (uygulama), mürekkep zeminde yıl çizelgesi, katlanmış rapor kartı. Almanak: taş kitabe ay başlıkları, cetvelli satırlar, mühür kırmızısı "bugün" çizgisi. Güvende: yapışkan dizin + havadar bölümler + senaryo zinciri. Okulumuz: geniş render bandı, kemer parçaları diyagramı, lento yazıtı. İletişim: birim defteri + elle çizilmiş konum. Veli: mühürle kapatılmış form.
- **"Örnek" mührü** (çift çizgili, mühür kırmızısı, kemer işaretli küçük damga) gerçek veri izlenimi veren her blokta aynı bileşenle durur; dürüstlük dekorun parçası.
- Rakamlar serif içinde sans (`numerals()`): Marcellus sıfırı büyük O gibi çizer.
