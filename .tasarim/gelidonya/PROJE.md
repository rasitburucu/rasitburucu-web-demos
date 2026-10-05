# PROJE: Gelidonya Sera ve Fidelik (konsept demo)

- Tarih: 2026-10-05 · Durum: yön (3 aday + ilk ekran prototipleri, seçim bekliyor)
- Repo: `D:/Yazılım Projeleri/rasitburucu-web-demos` · yayın adresi (inşa sonrası): `rasitburucu.com/web/gelidonya/`
- Tür: konsept demo (kurgusal marka). Sitede "Konsept çalışma — rasitburucu.com" şeridi olur; formların hiçbir yere gönderilmediği şeritte ve form altında yazar.

## Marka (kurgusal)
- Ad: **Gelidonya** (sitede alt satır: "Sera ve fidelik, Kumluca"). Slug: `gelidonya`.
- Ad nereden: Kumluca kıyısının güney ucundaki Gelidonya Burnu. Bölge firmaları yer adı kullanır (Beydağı, Patara gibi); bu ad turistik kitsch değil, haritadaki gerçek bir nokta. 2026-10-05 web aramasında bu adla fide/sera/ihracat firması çıkmadı (taklit riski düşük).
- **Kimlik (Raşit düzeltmesi, 2026-10-05):** ihracat ya da ticaret evi değil, **kökü yerel, büyük bir üretici tarım firması**. Kumluca ve Finike'de kendi seralarında üretir (başta domates), yanında fide üretip bölge üreticisine satar ve kendi ürününü ihraç eder (ör. Rusya'ya domates). Toprağı, serası, ekibi bölgede. Kimlik sırası: (1) sera üretimi, (2) fidelik, (3) ihracat; üçü de firmanın kendi işi. "Yabancı alıcının teklif verdiği platform" kurgusu yok.
- Bu kimliğin sitedeki karşılığı: fide satışının en güçlü gerekçesi "kendi seramıza diktiğimiz fideyi size de yetiştiriyoruz" cümlesidir (üç prototipin alt başlığında). Alıcı tarafı "Ürünlerimiz / Ürün ve ihracat": firmanın kendi seralarının hasat takvimi ve "fiyat sorun".
- Sitede firma büyüklüğü için **rakam yazılmaz** (dekar, fide/yıl, ton, ülke sayısı). Gerekirse `[örnek içerik]` etiketiyle.

## Tasarım okuması (tek satır)
Bunu şöyle okuyorum: kökü yerel bir sera üreticisinin fide sipariş sitesi (önce Kullanım, sonra İkna), Batı Antalya'daki seracı için, ikincil olarak firmanın kendi ürününü alan alıcı için; fidelik ve sera üretim takviminin kendi nesneleri (viyol, ekim cetveli, aşı klipsi) dili; ana hamle: fide ön rezervasyonu ilk ekranda, üreticinin "kaç dönüm, hangi hafta" cümlesiyle başlar ve sonucu fidenin gerçek birimiyle (göz, viyol, teslim haftası) gösterir.

## Konu ve iş
- **Konu:** Batı Antalya (Kumluca, Finike, Demre, Kemer hattı) örtüaltı sebzeciliği. Gerçek dünyada fidelik üreticiden sipariş alır (çeşit, adet, anaç, teslim tarihi), tohumu teslimden geriye sayarak eker; aşılı fide 45–60 gün, aşısız 40–45 gün sürer (kaynak: agrowy.com fidelik sipariş yazısı). Sipariş haftalarca önceden verilir; teslim kaçarsa üreticinin hasat takvimi ve fiyat penceresi kayar.
- **Sitenin tek işi:**
  1. (Birincil) **Fide ön rezervasyonu**: ürün → miktar (dönüm ya da adet) → dikim/teslim haftası → ad ve telefon. Başarı: üretici rezervasyon fişini gönderdi (demo: gönderilmez, fiş ekranda kalır).
  2. (İkincil) **Firmanın kendi ürününü almak** (yurt içi toptancı/zincir ya da ihracat alıcısı): kendi seralarımızın hasat takvimine bak → ürün, hafta, nereye → fiyat sor.
- **Öncelik (Raşit kararıyla kesin):** fide almak isteyen bölge üreticisi önce. Gerekçe: fidelik siparişi tekrar eden, zamana bağlı, sezon başında yoğun bir iş; ziyaret çoğunlukla telefondan. Ürün alıcısı ikincil; masaüstünde, sakin gelir. İlk ekran üreticinin; alıcının kapısı üst menüde ("Ürün ve ihracat", "Ürünlerimiz") ve Yön B'de ilk ekrandaki ikinci sekmede.
- **Kitle ve kullanım sahnesi:**
  - Üretici: 35–65 yaş seracı ya da ustabaşı. Sera kenarında, öğle güneşinde, telefonla; elleri toprak/eldivenli; acele. → Açık tema, yüksek kontrast (metin ≥ 7:1 hedef), büyük dokunma hedefleri (≥ 48 px), az yazı, sayılar iri, tek elle kullanılabilir. Telefon numarası her an görünür.
  - Ürün alıcısı: yurt içi toptancı/market zinciri satın almacısı ya da ihracat alıcısı (Antalya yaş sebzesinin ana pazarları arasında Rusya, Almanya, Romanya, Polonya, Hollanda geçiyor; kaynak: BAİB ve Ticaret Bakanlığı 2025 verisi haberleri). Ofiste masaüstü, gündüz. EN ve ileride RU sürümü (Varsayım: demo yalnız TR; EN anahtarı yer tutucu). Sitede firmanın hangi ülkeye sattığı yazılmaz (kanıt yok); alıcıya yalnız "nereye" diye sorulur.
- **Yüzey modu:**
  | Sayfa | Mod |
  |---|---|
  | Ana sayfa ilk ekran (fide ön rezervasyonu) | Kullanım |
  | Ana sayfa devamı (fidelik nasıl çalışır, aşı, teslim) | İkna |
  | Seralarımız (üretim, ekip, Kumluca/Finike) | Okuma + İkna |
  | Ürünlerimiz: hasat takvimi + fiyat sorma (yurt içi ve ihracat) | Kullanım |
  | Fidelik / aşı / soğuk zincir anlatısı | Okuma |

## Sektör notları (web araştırması 2026-10-05; sitede rakam olarak firmaya mal edilmez)
- Antalya 2024'te yaklaşık 1,7 milyar fide üretti; Türkiye'deki 216 sebze fidesi firmasının 95'i Antalya'da (Antalya Kent Haber). Kumluca, Aksu, Kepez, Serik üretim merkezleri.
- Sipariş: üretici çeşit, adet, anaç tipi ve teslim tarihini haftalar önce sözleşmeyle bildirir. Fidelik çimlenme kaybına %10 fazla eker. Aşılı fide 45–60 gün; aşısız 40–45 gün. Aşılı karpuz mevsime göre 35–55 gün, aşılı domates (çift gövde) 55–65 gün. Canlı ürün olduğu için cuma-cumartesi kargolanmaz.
- Dekar başına fide: aşılı 1.800–2.000, standart 2.500–3.000 (agrowy). Domates tekli dikimde 2.200–2.500, çift baş (V) 1.200–1.400 (başka kaynak). Viyol: domates/biber/patlıcan için 45 göz yaygın; karpuz/kavun gibi iri tohumlar için 24–32 göz.
- Kumluca takvimi: ısıtmalı serada tek ürün dikimi eylül, ısıtmasız ekim; ilkbahar dikimi şubat ortası (alata/örtüaltı kaynakları, arama özeti). Kış sebzesinin ihracat sezonu kabaca ekim–mayıs.
- Seralar: Kumluca, Finike, Demre topraksız tarımın da yoğun olduğu ilçeler (cocopeat, kaya yünü torbalar).
- GlobalG.A.P., İyi Tarım Uygulamaları (İTU), kalıntı analizi, soğuk zincir (ATP anlaşması) sektörün ortak dili. **Kurgusal firmaya sertifika sahipliği yazılmaz**; sitede "alıcının istediği belgeler: GlobalG.A.P., kalıntı analizi raporu… [örnek içerik: gerçek firmada belge numarası buraya]" diliyle geçer.

## Hesaplayıcı (ilk ekran) — formül ve varsayımlar sitede açık yazar
- `fide = dönüm × dekar başına fide`, `+ yedek` (Varsayım: üretici seçer, varsayılan %0; "boşa düşen fide için yedek" anahtarı %5).
- `viyol = ⌈fide ÷ viyoldaki göz⌉`; son viyol kısmen dolu görünür.
- `tohum ekim haftası = teslim haftası − üretim süresi (hafta)`; teslim haftası = dikim haftası.
- Ürün başına sıklık, göz ve süre değerleri **örnektir** ve sitede "örnek değer, siparişte ziraat mühendisimiz teyit eder" notuyla durur. Kaynaklı olanlar: aşılı 1.800–2.000/da, standart 2.500–3.000/da, aşılı 45–60 gün, standart 40–45 gün, 45 göz ve 24–32 göz. Biber, hıyar, patlıcan, kavun için ayrı sıklık kaynağı bulunmadı → içerik açığı.
- 1 dönüm = 1 dekar = 1.000 m² (Antalya'da "dönüm" konuşulur; sitede "dönüm" yazılır, yanında "(dekar)").

## İçerik envanteri
| İçerik | Var mı | Kaynak | Not |
|---|---|---|---|
| Metin | Hayır | Biz yazarız (TR önce, Raşit onayı) | EN doğal İngilizce; RU ileride |
| Fotoğraf / video | Hayır | Prototipte prosedürel çizim (SVG/canvas). İnşada: Blender render ya da gerçek fidelik fotoğrafı | Stok "drone sera / filizlenen tohum" fotoğrafı rutindir, kullanılmaz. Aile/finans görseli yok |
| Logo, renk, font | Hayır | Kelime logosu, yaprak simgesi yok; fontlar Google Fonts (OFL) | Türkçe glif kontrol edildi |
| Gerçek kanıt | Yok | — | Ton, dekar, ülke sayısı, sertifika, müşteri, yorum uydurulmaz. `[örnek içerik]` |
| Ürün/çeşit listesi | Kısmen | Genel ürün adları (domates, biber…) | Ticari çeşit ve anaç adları (tescilli markalar) yazılmaz; "örnek çeşit", "güçlü anaç" gibi niteleyici |
| 3B / ses | Hayır | İnşada viyol ya da aşılı fide modeli (Blender) düşünülebilir | |

İçerik açıkları:
1. Ürün başına dekar sıklığı, viyol göz sayısı, üretim süresi tablosu (biber, hıyar, patlıcan, kavun için kaynak yok) → gerçek müşteride ziraat mühendisi; demoda "örnek değer" etiketi.
2. Firma rakamları (sera alanı, fidelik kapasitesi, ihracat hacmi) → demoda yok.
3. Sertifika ve belge numaraları → demoda yalnız belge adları, "örnek" etiketiyle.
4. Ambalaj seçenekleri (koli tipi, kg, palet düzeni) → demoda "[örnek]" listesi.
5. Fotoğraf → inşa aşamasında Blender render ya da gerçek çekim kararı.

## Kısıtlar
- Diller: TR (demo); EN anahtarı görünür ama "yakında" (Varsayım). · Süre: brif-yön bugün, inşa Raşit'in seçiminden sonra. · Bütçe: 0 (OFL font, prosedürel görsel). · İçerik düzenleyen: yok (statik `content/gelidonya/*.ts`). · Barındırma: demo reposu statik export → rasitburucu.com/web/.

## Hedef ve "bitti" ölçütü
- Hedef: web tasarım hizmeti vitrini (satış). Ödül başvurusu yok.
- Bitti ölçütü: kalite tabanı geçti; telefon 390 px ilk ekranda hesaplayıcı tam görünür ve kaydırmadan kullanılır; masaüstünde alıcı yolu tek tıkta; taze göz puanı ≥ 7; Raşit onayı.

## Açık kararlar
| Karar | Seçenekler | Kim | Tarih |
|---|---|---|---|
| Yön | A Viyol Masası / B Ekim Cetveli (önerilen) / C Aşı Masası / Kanon | Raşit | — |
| Görsel üretimi | Prosedürel SVG (ucuz, hızlı) / Blender render (Revak, Kalemkâr gibi) | Raşit | inşa öncesi |
| EN sürümü | Demoda yalnız TR / alıcı sayfası EN | Raşit | inşa öncesi |
