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
