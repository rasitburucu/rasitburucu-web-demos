# YÖN: Gelidonya Sera ve Fidelik · v2 "Sade ve profesyonel" (sera kütlesi + işin nesneleri)

Tarih: 2026-10-06 · v1 (A, Viyol Masası, 2026-10-05) `YON-v1.md` dosyasında arşivde.
Neden değişti: Raşit'in hükmü ("şu ana kadar yaptığın en kötü site olabilir") ve 22 gerçek Batı Antalya fidelik/üretici sitesinin incelemesi (`arastirma/RAPOR.md`). v1 gösteriş mekaniğine dayanıyordu (dolan viyol, teslim tezgâhına inen viyoller, fiş damgası); sahadaki üreticinin ilk iki sorusu ("kimi ararım", "elde ne var") ikinci plana düşüyordu, geniş ekranda düzen çöküyordu. v2 aynı kimliği (renk, yazı, render) koruyup siteyi sektörün gerçek işine göre yeniden kurar.

## Yön sözleşmesi
- **TEZ:** Kumluca'da kendi serası olan bir fidelik; site üreticiye üç saniyede iki cevap verir: "burası fide aldığım ve kendi serası olan yer" ve "şimdi kimi ararım, elde ne var". Gerisi işin kendi nesneleriyle anlatılır: hazır fide listesi, sipariş formu ve kaparo, viyol tipi, anaç, aşı klipsi, torba, harita. Reddettiği varsayılan: slaytlı drone sera, dönen sayaç, "lider", yüzen WhatsApp balonu, boş "Ekstra liste" sayfası, şablon artığı.
- **KENDİ DÜNYASI:** Örtüaltı domates serası (Blender render, koridor) ve fideliğin evrakı: hazır fide listesi (tür, tip, anaç, gövde, viyol, adet, hazır tarihi, durum: Hazır / Boylu / Hazır olacak), seri numaralı sipariş formu, ±3 gün teslim, ziraat kitabı plakası gibi numaralı teknik çizimler, OSM'den kendi stilimizde çizilmiş harita.
- **HİKÂYE (ana sayfa):** ilk ekran → bu hafta tezgâhta ne var (5 satır) → sipariş nasıl işler (4 gerçek adım) → fideyi satmadan önce kendimiz dikiyoruz (kendi seramız) → domatesimizi almak istiyorsanız (12 aylık takvim, ihracat kapısı) → fidelik nerede (adres, teslim noktası, saat).
- **İLK EKRAN (karma, rapordaki karar):** geniş ekranda solda düz panel (logo hizasında): yer satırı, başlık, tek cümle, **Ara** ve **WhatsApp** düğmeleri, saatler, **Hazır fide listesi** kapısı (bugün hazır kalem sayısı, son güncelleme). Sağda sağ kenara kadar fidelik render'ı (tezgâhlarda viyoller; taze gözün "sera render'ında yaprak domates yaprağına benzemiyor" bulgusundan sonra sera koridorundan fidelik görüntüsüne geçildi). Render'ın sol altında düz bir kart: **Fide hesabı** (ürün, dönüm, aşı, gövde, viyol, dikim haftası → fide, viyol, tohum ekim haftası, formül açık). Hesap ikincil: ilk ekranda görünür ama Ara/WhatsApp ve liste kapısı ondan önce okunur. Tablet: render bant olur, panel iki sütun. Telefon: ince render bandı, başlık, Ara + WhatsApp yan yana, liste kapısı, altında hesap. Telefonda alt sabit çubuk: Ara · WhatsApp · Yol tarifi (ilk ekrandaki düğmeler ve alt bilgi görünürken çekilir).
- **İMZA NESNESİ:** seri numaralı **fide sipariş formu**, kâğıt olarak çizilmiş (No 0412 [örnek], üretici, köy, ürün/aşı/gövde, viyol × göz, fide, teslim haftası ±3 gün, tohum, kaparo, kaşe ve imza kutuları). Ana sayfada üstteki fide hesabının değerleri forma tükenmez mavisiyle "yazılır"; hesap değişince form satırları değişir. Fidelik sayfasında aynı form örnek değerlerle.
- **İMZA:** gösteri değil, doğruluk: hesaplayıcının formülü açık ("3 dönüm × 2.800 tepe ÷ 2 gövde = 4.200 fide · 4.200 ÷ 98 göz = 43 viyol"), hazır listede her satırda "Bu fideyi sor" (hazırlanmış mesaj), teknik çizimler numaralı ve ölçülü, harita gerçek veriden.
- **BİTİŞ:** ziyaret bandı (koyu), alt bilgide fide üretici belge no [örnek], künye. 404: viyolde tek boş göz.

## Raşit'in v2 istekleri ve karşılıkları
1. Geniş ekran: içerik `--gd-max: 90rem`, yan boşluk `--gd-side` kapsayıcı genişliğinden (100cqw) hesaplanır; ilk ekran paneli logo hizasında, render sağ kenara kadar; 1800 ve 2300 px üstünde kök yazı boyu %106 / %119, düzen aynı oranda büyür.
2. Bilgi mimarisi rapora göre: Hazır fide (yeni) · Fidelik ve sipariş · Seralarımız · Ürün ve ihracat · İletişim.
3. Harita: OSM verisi derleme zamanında (Sazbahçe yöntemi), iki ölçek, ODbL atfı görünür, konum örnek ve öyle yazar.
4. Çizimler: torba boyuna + enine kesit, aşılı (çift gövde) / aşısız (tek gövde) plakası; numaralar HTML açıklamada, telefonda dar kırpım.
5. "Teslim sabahı kamyonete yüklenecek viyoller" kaldırıldı; yerine "Sipariş nasıl işler" (sorun → form ve kaparo → ekim → teslim ±3 gün).
6. Reaktif kısımlar: hafta çipleri yerine yerel seçim kutusu; bütün denetimler sabit ölçüde; tablolar telefonda kart, 600–1099 px'te iki sütun kart.

## Kadranlar (1–10)
Çeşitlilik: 4 · Hareket: 2 · Yoğunluk: 6

## Tokenlar (v1'den aynen)
| Rol | Değer | Kaynak |
|---|---|---|
| zemin | `#F3F4F1` | strafor viyol kutusu beyazı |
| yüzey | `#FFFFFF` | tablo, form, kart |
| metin-1 | `#111311` (17,4:1) | PS viyol siyahı |
| metin-2 | `#454A44` (8,5:1) | viyol kenarı grisi |
| tezgâh | `#BEC2BB` / `#9EA39B` | galvaniz, ince çizgiler |
| yeşil (anlam: hazır, dolu, onay) | `#3F8F1F` | fide kotiledonu; yalnız "Hazır" durumu, hesapta fide sayısı, haritada fidelik işareti |
| odak | `#235A0E`, 3 px halka | koyu yaprak |
| domates | `#B3261E` | yalnız hata, 404, çizimde tepe kesimi, sipariş formunun seri numarası (matbaa kırmızısı) |
| tükenmez mavisi | `#23408E` | yalnız sipariş formuna elle yazılmış değerler (karbonlu form üstünde tükenmez kalem) |

Tipografi: Big Shoulders Display 800 büyük harf (başlık, iri rakam), Schibsted Grotesk 400–800 (gövde, form, tablo). Radius 0. Açık tema (güneş altında telefon).

## Hareket
Kaydırma sahnesi, paralaks, giriş animasyonu yok. Yalnız: düğme/çip renk geçişi 120 ms, telefon çubuğunun çekilmesi 200 ms, harita ölçek geçişi 600 ms (azaltılmış harekette anında). Render durağan.

## Bu yönün yanlış izleri
- Yeşili arayüz rengine yaymak (WhatsApp düğmesi de yeşil değil).
- Sayaç, "lider", "%100", müşteri yorumu, kurgusal kapasite.
- Gerçek `wa.me` bağlantısı (rastgele birine mesaj gidebilir): her WhatsApp düğmesi hazırlanmış mesaj penceresi açar.
- Metni render'ın üstüne bindirmek (yalnız düz kart/panel).

## İstisna gerekçeleri (YZ izi listesinden kalanlar)
- Büyük harf gösterim fontu: fide arabası ve koli işaretlemesinin dar harfi; yalnız başlık ve iri rakamda.
- Numaralı adımlar (Sipariş nasıl işler): içerik gerçek bir sıra.
- `A · B` satırları yalnız gerçek veri ayrımında (aşı · anaç, belge no · geçerlilik).

## v2.1 cila (2026-10-06)

Raşit'in hükmü v2 için "çok vasat, çok standart". Karar A: iskelet aynı, deri yeni. Bu tur yalnız ana sayfa (ilk ekran + iki bölüm) ve ortak tokenlar.

### Tokenlar (yeni ya da değişen)
| Rol | Değer | Kontrast | Kaynak |
|---|---|---|---|
| zemin | `#F8F7F2` | metin-1 17,4:1, metin-2 8,45:1 | güneş alan sera naylonunun sıcak beyazı (krem değil) |
| büyük alan yeşili | `#1E4A16` | beyaz 10,3:1, zemin rengi 9,6:1 | derin fide yeşili; hazır liste bandını ve liste kapısını boyar |
| yeşil üstü ikincil metin | `#C9D8BE` | 6,9:1 | |
| yeşil üstü işaret | `#9BD16A` | 5,7:1 | "Hazır" karesi, sayı işareti |
| Beydağları mavi-grisi | `#5E6F7A` | zeminde 4,9:1 | çizimlerin ikincil tonu: geri sayım ekseni ve durak halkaları |
| domates | `#C62F22` | zeminde 5,1:1, beyazda 5,5:1 | yalnız teslim durağı, formun seri numarası, hata, 404 |
| küçük yeşil | `#3F8F1F` | 3,8:1 (yalnız grafik) | açık zeminde "Hazır" karesi |
Metin siyahları (`#111311`, `#454A44`) aynı. Yeşil bantta renk tokenları yerel olarak tersine döner (`--gd-ink` açık), tablo ve düğmeler kendiliğinden uyar; odak halkası bantta açık renk.

### Tipografi kuralı
Big Shoulders Display yalnız h1 (ilk ekran ve sayfa başlıkları), logo ve iri rakamlarda (fide/viyol/hafta, hazır sayıları, liste kapısındaki sayı). Bölüm başlıkları (`.gd-h2`) Schibsted Grotesk 700, cümle düzeni, `clamp(2rem, 1.35rem + 2.1vw, 3.5rem)`, harf aralığı −0,03em, satır 1,06. Schibsted'in tablo rakamları noktayı da sabit genişlikte basar; "51. hafta" gibi noktalı değerlerde `tabular-nums` kullanılmaz.

### Hareket tezi
Tek orkestra edilmiş an: geri sayım şeridi görünüme girince fideler sırayla viyol gözünden büyür (bir kez, 420 ms + durak başı 55 ms, toplam ≈ 700 ms, yalnız transform/opacity, ease-out). Gerekçe: şeridin söylediği şey zaman içinde büyümedir; hareket tarihleri okutmadan önce yönü gösterir. Hesap değişince tarihler 260 ms yerine oturur, aşı değişince (6↔5 durak) duraklar transform ile 280 ms kayar. İçerik dinlenme hâlinde görünür; bekleme durumunu yalnız betik koyar. `prefers-reduced-motion: reduce` altında hiçbiri yok, şerit son hâliyle durur.

### Geri sayım şeridinin bilgi işlevi
Sitenin vaadi "tohumu dikim tarihinizden geriye sayarak ekeriz". Şerit bunu üreticinin takvimine çevirir: seçilen ürün, aşı ve dikim haftası için tohum ekimi haftası → çimlenme → (aşılıda) aşı ve kaynaşma / (aşısızda) ilk gerçek yaprak → sertleştirme → teslim (dikim haftası, ±3 gün). Uçlar hesaptan gelir (hesap ve sipariş formuyla aynı sayı); ara duraklar toplam sürenin sabit payı olduğu için altta "örnek takvim" yazar. Üreticinin sorduğu "ne zaman ekilir, ne zaman aşılanır (mesaj ne zaman gelir), ne zaman alırım" sorularını tek satırda cevaplar. Ekranda yatay sıralı liste (`ol`), 900 px altında dikey zaman çizelgesi; çizimler `aria-hidden`, her durak metinle anlaşılır.

### Yerleşim
İlk ekran: solda panel (başlık, tek cümle, Ara + WhatsApp, saat, yeşil liste kapısı), sağda render sağ kenara kadar, üstünde hiçbir şey yok. Fide hesabı ilk ekrandan çıktı, hemen altındaki imza bölüme taşındı (denetimler + sonuç + şerit). Hazır liste tam genişlik derin yeşil bant. Sıra: ilk ekran → geri sayım → yeşil liste → sipariş nasıl işler → kendi seramız → domatesimiz → fidelik nerede.
Görseller `gorsel("fidelik-gunes", "fidelik")` ile seçilir: güneşli render `image-dims.json`'a girdiği an kendiliğinden geçer.
