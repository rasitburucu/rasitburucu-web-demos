# Onikitaş: metin onayı (2026-10-04, gelistir/onikitas)

Neden: Yalıkavak koyu batı-kuzeybatıya açılır. Sahne de buna çevrildi: güneş tepenin arkasından doğuyor, denizin üstünde batıyor; evler batı, kuzeybatı ve güneybatıya bakıyor. Her evin "en güzel saati", sahnedeki güneşin o evin cephesine tam karşıdan geldiği saat (ya da gün batımının son ışığı).

Not: Evlerin numaraları cepheye göre yeniden dağıtıldı. Yamaçta eskiden XII olan ev artık VII (yaz gün batımına en dik bakan ev), eski VII de XII oldu. Alan, oda, arsa, durum bilgileri numarayla birlikte kaldı (örnek bilgi).

## Sayfa metinleri

| Yer | Eski | Yeni | Neden |
|---|---|---|---|
| Sayfa açıklaması (meta) | Yalıkavak'ın güney sırtlarında, her birinin önü deniz olan on iki taş villa. … | Yalıkavak'ta koya ve gün batımına bakan yamaçta, her birinin önü deniz olan on iki taş villa. … | Yön hatası: Yalıkavak'ta deniz batıda |
| Şafak gövde | Onikitaş Villaları, Yalıkavak'ın güney sırtlarında taş, kireç ve zeytin arasında yükseliyor. Her ev, günün en güzel ışığını alacak açıyla yerleştirildi. | Onikitaş Villaları, Yalıkavak koyuna bakan yamaçta taş, kireç ve zeytin arasında yükseliyor. Her ev batıya, denize ve gün batımına dönük yerleştirildi. | Yön hatası; somut vaat (gün batımı) |

## Saat cetveli (sağdaki gün listesi, saat göstergesi, yükleme ekranı)

Saatler artık tek yerden geliyor (`lib/onikitas/chapters.ts`, bölümün başladığı saat). Sol alttaki saatle cetvel artık çelişmiyor.

| Bölüm | Eski | Yeni |
|---|---|---|
| Şafak | 05:41 | 05:41 |
| Sabah | 07:00 | 06:30 |
| Kuşluk | 10:00 | 07:45 |
| Öğle | 13:00 | 11:45 |
| İkindi | 16:30 | 14:30 |
| Akşam | 19:40 | 17:45 |
| Yatsı | 21:30 | 19:40 |

## Ev künyesi ve ev kartı (cephe, en güzel saat, tek satır)

| Ev | Eski | Yeni | Neden |
|---|---|---|---|
| I | Güneydoğuya bakar · 06:10 · Yamaçta güne ilk uyanan ev. | Güneybatıya bakar · 16:25 · İkindi güneşini terasında en uzun tutan ev. | Batıya bakan yamaçta sabah güneşi evin arkasından gelir |
| II | Güneydoğuya bakar · 08:30 · Kahvaltı terasına sabah güneşi tam oturur. | Güneybatıya bakar · 17:10 · Kahvaltı gölgede, akşam yemeği güneşte. | Aynı neden; batı cephenin gerçek faydası |
| III | Güneye bakar · 11:00 · Havuzu gün içinde en erken ısınan ev. | Batıya bakar · 17:25 · Havuzu akşamüstü güneşini sonuna kadar alır. | Cephe ve saat |
| IV | Güneye bakar · 13:20 · (satır aynı) | Batıya bakar · 18:20 · Kuzeydeki avlusu öğle sıcağında bile serin. | Cephe ve saat |
| V | Güneye bakar · 09:40 · (satır aynı) | Batıya bakar · 18:15 · Zeytinliğin hemen kıyısında. | Cephe ve saat |
| VI | Güneye bakar · 15:00 · (satır aynı) | Batıya bakar · 18:25 · Çardağı ikindi güneşini süzer. | Cephe ve saat |
| VII | Batıya bakar · 18:40 · (satır aynı) | Kuzeybatıya bakar · 20:00 · Gün batımını salondan izlersiniz. | Artık yaz gün batımına en dik bakan ev |
| VIII | Güneye bakar · 17:30 · (satır aynı) | Batıya bakar · 18:30 · Akşam meltemini ilk o alır. | Cephe ve saat |
| IX | Güneybatıya bakar · 07:20 · (satır aynı) | Kuzeybatıya bakar · 20:10 · Yamacın en üstünde, en geniş manzarayla. | Cephe ve saat |
| X | Güneydoğuya bakar · 12:10 · (satır aynı) | Güneybatıya bakar · 16:10 · Denizle arasında yalnızca zeytin ağaçları var. | Cephe ve saat |
| XI | Güneye bakar · 19:10 · (satır aynı) | Batıya bakar · 19:40 · Çatı terası gün batımı için tasarlandı. | Cephe ve saat |
| XII | Güneybatıya bakar · 20:05 · (satır aynı) | Kuzeybatıya bakar · 20:15 · Günün son ışığı onun duvarına düşer. | Cephe ve saat |

Künye tablosundaki "Cephe" sütunu aynı kısa adları kullanır: Güneybatı, Batı, Kuzeybatı.

Değişmeyen ama kontrol edilen: İkindi gövdesi ("yarımadanın kuzeybatı rüzgârına açık") yeni yönle tutarlı. Öğle gövdesi ("Her avluyu evin kuzeyine aldık") cepheden bağımsız, olduğu gibi kaldı.

**ONAYLANDI:** Raşit, 2026-10-04 (bu dosyadaki bütün satırlar; firik tabağı olduğu gibi kalır).

---

# İkinci tur (2026-10-05, gelistir2/onikitas): ONAY BEKLİYOR

| Yer | Eski | Yeni | Neden |
|---|---|---|---|
| Sağdaki gün listesi, Yatsı saati (ve ekran okuyucu etiketi "Yatsı, saat …") | 19:40 | 20:30 | Akşam bölümü artık 20:00'de bitiyor (kadranın açıldığı saat, Villa VII'nin en güzel saati). Yatsı 19:40'ta başlarken saat 20:00 "Akşam" etiketiyle yazıyordu; güneş sahnede 20:15'te batıyor, gece 20:30'da başlıyor |
| Sol alttaki saat, Akşam bölümünün sonu | 19:40 | 20:00 | Aynı neden. Her bölümün saati artık bir sonraki bölümün başladığı dakikaya varmadan durur (ör. Şafak 06:29'da biter, 06:30 "Sabah" yazar) |
| Kadranın açılış saati | 19:40 (her ev için) | Seçili evin en güzel saati (Villa VII: 20:00) | Kadranla evin künyesi çelişiyordu. Bir ev seçilince güneş o evin saatine gider; ziyaretçi güneşi kendisi sürüklediyse artık dokunulmaz |
| Kadranın saat aralığı (sayılar) | 06 … 21 (05:00–22:00) | 15 16 17 18 19 20 21 (15:00–21:00), çeyrek saat çentikleri | Bütün evlerin en güzel saati 16:10–20:15 arasında; dar aralık güneşi daha ince ayarlatıyor |
| "On iki ev" bölümü, telefonda kartların altı | (yok; 12 kart alt alta) | Hepsini göster | Telefonda ilk 4 kart görünür, düğme kalan 8'i açar ve odağı 5. karta taşır |

Not: Bölüm adları, başlıklar, gövde metinleri değişmedi.
