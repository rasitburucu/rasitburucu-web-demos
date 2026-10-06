# METİN ONAYI: Sazbahçe (2026-10-05, ilk inşa)

Bütün Türkçe metin `content/sazbahce/tr.ts` dosyasından otomatik çıkarıldı (ay ve gün adları, bağlantı adresleri hariç). Hepsi yeni; Raşit onayı bekliyor. EN, TR onayından sonra yazılacak.

Okuma notları:
- `{…}` ile gösterilen yerler canlı doldurulur (ör. `{n}` misafir sayısı, `{at}` gün batımı saati "20.30’da").
- Kurgusal mekân verisi (kapasite, müzik saati, teknik föy, uzaklıklar) sitede "örnek" etiketlidir.
- Nilüfer mevsimi gibi doğrulanmamış iddia yazılmadı. Gün batımı saatleri gerçek hesap (NOAA, 40,17 K / 28,60 D).
- Dikkat isteyen kararlarım: "Ağ Ambarı" adı ve hikâyesi (balıkçıların ağ kuruttuğu ambar) kurgudur; "Bursa merkezine yaklaşık 40 dakika", "İstanbul’dan yaklaşık 2,5 saat" yaklaşık değerdir; "Gölyazı’daki pansiyonlarda oda ayırma desteği" kurgusal bir hizmet sözüdür.
- "Onay" sütununa ✓ ya da düzeltmeyi yazman yeterli.

| # | Yer (anahtar) | Metin | Onay |
|---|---|---|---|
| 1 | `meta.title` | Sazbahçe \| Uluabat Gölü kıyısında düğün ve davet bahçesi (konsept) | |
| 2 | `meta.description` | Uluabat Gölü’nün doğu kıyısında hayali bir düğün ve davet bahçesi. Tarihinizi seçin, misafir sayınızı yazın; masalar planda dizilsin, teklif özetiniz hazır olsun. Konsept çalışma. | |
| 3 | `meta.areasTitle` | Alanlar \| Sazbahçe (konsept) | |
| 4 | `meta.areasDescription` | Söğüt Çayırı, Ağ Ambarı, Ceviz Avlusu ve İskele: kapasite, kurulum düzenleri, sezon ve yağmur planı. | |
| 5 | `meta.corporateTitle` | Kurumsal \| Sazbahçe (konsept) | |
| 6 | `meta.corporateDescription` | Toplantı, lansman ve yılsonu yemekleri için düzen planlayıcı, kapasite tablosu ve teknik föy. | |
| 7 | `meta.requestTitle` | Teklif talebi \| Sazbahçe (konsept) | |
| 8 | `meta.requestDescription` | Beş adımda teklif talebi: tarih, tören, misafir, alan, ikram. Konsept çalışma, hiçbir bilgi gönderilmez. | |
| 9 | `meta.visitTitle` | Ziyaret ve yol tarifi \| Sazbahçe (konsept) | |
| 10 | `meta.visitDescription` | İstanbul’dan, Bursa’dan ve havalimanından yol tarifi; alanları görmek için görüşme randevusu. | |
| 11 | `meta.notFoundTitle` | Bu yol göle çıkmıyor \| Sazbahçe (konsept) | |
| 12 | `skip` | İçeriğe geç | |
| 13 | `strip.text` | Konsept çalışma — | |
| 14 | `strip.link` | rasitburucu.com | |
| 15 | `brand.name` | Sazbahçe | |
| 16 | `brand.home` | Sazbahçe ana sayfa | |
| 17 | `brand.place` | Uluabat Gölü kıyısı, Bursa | |
| 18 | `nav.label` | Ana menü | |
| 19 | `nav.cta` | Teklif iste | |
| 20 | `nav.menu` | Menü | |
| 21 | `nav.close` | Kapat | |
| 22 | `sample` | örnek | |
| 23 | `ceremonies.nikah` | Nikâh | |
| 24 | `ceremonies.kina` | Kına | |
| 25 | `ceremonies.nisan` | Nişan | |
| 26 | `ceremonies.dugun` | Düğün | |
| 27 | `ceremonies.kurumsal` | Kurumsal | |
| 28 | `slots.ogle.label` | Öğle | |
| 29 | `slots.ogle.range` | 12.00–17.00 | |
| 30 | `slots.gunbatimi.label` | Gün batımı | |
| 31 | `slots.gunbatimi.range` | güneşe göre | |
| 32 | `slots.aksam.label` | Akşam | |
| 33 | `slots.aksam.range` | 20.00–00.30 | |
| 34 | `setups.yuvarlak` | Yuvarlak masa | |
| 35 | `setups.uzun` | Uzun masa | |
| 36 | `setups.tiyatro` | Tiyatro | |
| 37 | `setups.sinif` | Sınıf | |
| 38 | `setups.u` | U düzen | |
| 39 | `setups.kokteyl` | Kokteyl | |
| 40 | `setupHints.yuvarlak` | Gala yemeği, ödül gecesi | |
| 41 | `setupHints.uzun` | Ekip yemeği, yılsonu | |
| 42 | `setupHints.tiyatro` | Sunum, lansman | |
| 43 | `setupHints.sinif` | Eğitim, not alınan toplantı | |
| 44 | `setupHints.u` | Yönetim toplantısı, atölye | |
| 45 | `setupHints.kokteyl` | Ayakta karşılama, tanışma | |
| 46 | `areas.cayir.name` | Söğüt Çayırı | |
| 47 | `areas.cayir.dat` | Söğüt Çayırı’na | |
| 48 | `areas.cayir.plan` | SÖĞÜT ÇAYIRI | |
| 49 | `areas.cayir.kind` | Açık hava, göle bakar | |
| 50 | `areas.cayir.season` | Nisan–Ekim | |
| 51 | `areas.cayir.lead` | Kıyıya inen çayırı yaşlı söğütler çevreler. Pist göl tarafına kurulur; güneş batarken misafirlerinizin önünde yalnız su kalır. | |
| 52 | `areas.cayir.body[0]` | Çayır batıya, göle doğru hafifçe iner. Masaları bu eğime göre dizeriz: arka sıradaki misafir de ön sıranın üstünden suyu görür. | |
| 53 | `areas.cayir.body[1]` | Söğütlerin gölgesi öğleden sonra pisti serin tutar. Akşam çakıl yol boyunca fenerler yanar; misafirleriniz kıyıya kadar yürür. | |
| 54 | `areas.cayir.notes[0]` | Zemin drenajlı; masa aralarına ahşap yürüme yolu döşenir, ince topukla rahat yürünür. | |
| 55 | `areas.cayir.notes[1]` | Yağmur planı: çayır düğünü olan gün Ağ Ambarı başka davete verilmez. Hava kötüyse 48 saat önce birlikte karar veririz. | |
| 56 | `areas.cayir.notes[2]` | Müzik 00.30’a kadar. | |
| 57 | `areas.cayir.photoAlt` | Gün batımında çimenlik bir bahçede kurulu yuvarlak masalar ve kılıflı sandalyeler | |
| 58 | `areas.cayir.photo2Alt` | Salkım söğüdün dalları altında kurulu bir uzun masa | |
| 59 | `areas.ambar.name` | Ağ Ambarı | |
| 60 | `areas.ambar.dat` | Ağ Ambarı’na | |
| 61 | `areas.ambar.plan` | AĞ AMBARI | |
| 62 | `areas.ambar.kind` | Kapalı, ahşap çatı | |
| 63 | `areas.ambar.season` | Dört mevsim | |
| 64 | `areas.ambar.lead` | Balıkçıların ağ kuruttuğu eski ambarı ahşap çatısıyla koruduk. Kışın ısıtılır, yazın göl rüzgârı kapıdan girer. | |
| 65 | `areas.ambar.body[0]` | Batı kapısı çayıra açılır: yaz düğünlerinde ambar ile çayır tek alan gibi kullanılır. | |
| 66 | `areas.ambar.body[1]` | Çatı makasları ışık asmaya hazır. Sahne, perde ve ses düzeni kuzey duvarında sabit durur; kurulum için saatlerce beklemezsiniz. | |
| 67 | `areas.ambar.notes[0]` | Isıtma ve havalandırma var; Ocak’ta da Temmuz’da da rahat oturulur. | |
| 68 | `areas.ambar.notes[1]` | Araç girebilen yükleme kapısı: sahne ve stant kurulumu kolay. | |
| 69 | `areas.ambar.notes[2]` | Eşiksiz giriş, tekerlekli sandalyeye uygun tuvalet. | |
| 70 | `areas.ambar.photoAlt` | Ahşap çatı makaslı geniş bir ambarın içinde kurulu yuvarlak masalar, sıcak ışık | |
| 71 | `areas.ambar.photo2Alt` | Ahşap ambarın içinde boydan boya uzun masalar ve tavandan sarkan ampuller | |
| 72 | `areas.avlu.name` | Ceviz Avlusu | |
| 73 | `areas.avlu.dat` | Ceviz Avlusu’na | |
| 74 | `areas.avlu.plan` | CEVİZ AVLUSU | |
| 75 | `areas.avlu.kind` | Taş duvarlı avlu | |
| 76 | `areas.avlu.season` | Nisan–Ekim | |
| 77 | `areas.avlu.lead` | Taş duvarla çevrili avlunun ortasında yaşlı bir ceviz var. Kına gecesi için yeterince yakın, kalabalığa yetecek kadar geniş. | |
| 78 | `areas.avlu.body[0]` | Avlu rüzgâr almaz: göl kıyısında akşam serinliği başladığında misafirleriniz burada üşümez. | |
| 79 | `areas.avlu.body[1]` | Kına tahtını cevizin altına kurarız; masalar ağacın çevresinde halka olur. | |
| 80 | `areas.avlu.notes[0]` | Kına, nişan, söz ve 140 kişiye kadar düğün. | |
| 81 | `areas.avlu.notes[1]` | Avlu kapısı çayıra açılır; tören çayırda, yemek avluda olabilir. | |
| 82 | `areas.avlu.notes[2]` | Müzik 00.30’a kadar. | |
| 83 | `areas.avlu.photoAlt` | Akşam ışığında taş bir evin önünde kurulu uzun ahşap masalar, üstte ampul zinciri | |
| 84 | `areas.avlu.photo2Alt` | Güneşli taş avluda tek bir ağacın gölgesi | |
| 85 | `areas.iskele.name` | İskele | |
| 86 | `areas.iskele.dat` | İskele’ye | |
| 87 | `areas.iskele.plan` | İSKELE | |
| 88 | `areas.iskele.kind` | Nikâh için, göle uzanır | |
| 89 | `areas.iskele.season` | Nisan–Ekim | |
| 90 | `areas.iskele.lead` | Nikâh masası göle uzanan iskelenin ucunda durur. Siz evet derken arkanızda yalnız göl olur. | |
| 91 | `areas.iskele.body[0]` | Doksan misafir kıyıda, iskeleye dönük sıralarda oturur. Tören bitince herkes yirmi adım ötedeki çayıra geçer. | |
| 92 | `areas.iskele.body[1]` | İskele yalnız tören içindir; yemek ve eğlence çayırda, ambarda ya da avluda. | |
| 93 | `areas.iskele.notes[0]` | Nikâh masası, ses düzeni ve gölgelik hazır. | |
| 94 | `areas.iskele.notes[1]` | Rüzgârlı günlerde tören kıyıdaki söğütlerin altına alınır. | |
| 95 | `areas.iskele.notes[2]` | İskele korkuluklu; çocuklu misafirler için kıyı tarafına ip çekilir. | |
| 96 | `areas.iskele.photoAlt` | Göl kıyısında çimenlikte iki sıra sandalye ve suya bakan nikâh masası | |
| 97 | `areas.iskele.photo2Alt` | Salkım söğüt dallarının altında göle uzanan ahşap iskele | |
| 98 | `hero.title` | Söğütlerin altında, göle bakan bir sofra. | |
| 99 | `hero.sub` | Misafir sayınızı yazın, masalarınız çayıra dizilsin. Pist göl tarafında kalır; alan dar gelirse bunu teklif beklemeden öğrenirsiniz. | |
| 100 | `hero.photoCaption` | Uluabat Gölü, Gölyazı | |
| 101 | `hero.planHeading` | Takvim ve plan | |
| 102 | `calendar.label` | Uygunluk takvimi | |
| 103 | `calendar.prev` | Önceki ay | |
| 104 | `calendar.next` | Sonraki ay | |
| 105 | `calendar.legend.bos` | boş | |
| 106 | `calendar.legend.opsiyon` | opsiyonlu | |
| 107 | `calendar.legend.dolu` | dolu | |
| 108 | `calendar.perDot` | Her nokta bir alan | |
| 109 | `calendar.sample` | Örnek doluluk | |
| 110 | `calendar.free` | Boş: | |
| 111 | `calendar.busy` | Dolu: | |
| 112 | `calendar.allBusy` | Bu gün bütün alanlar dolu. | |
| 113 | `calendar.winter` | Açık alanlar Kasım–Mart arası kapalı; Ağ Ambarı dört mevsim açık. | |
| 114 | `calendar.sunset` | Güneş göle {at} iner. | |
| 115 | `calendar.dayAria` | {label}, ${free ?  | |
| 116 | `calendar.past` | geçmiş tarih | |
| 117 | `planner.ceremonyLabel` | Ne kutluyorsunuz? | |
| 118 | `planner.guestsLabel` | Misafir | |
| 119 | `planner.guestsUnit` | misafir | |
| 120 | `planner.less` | 10 misafir azalt | |
| 121 | `planner.more` | 10 misafir artır | |
| 122 | `planner.areaLabel` | Alan | |
| 123 | `planner.slotLabel` | Saat | |
| 124 | `planner.slotSunset` | Tören {start}, güneş {set} batar. | |
| 125 | `planner.setupLabel` | Düzen | |
| 126 | `planner.cta` | Teklif özetini gör | |
| 127 | `planner.ctaNote` | Fiyat yerine size özel teklif hazırlarız. | |
| 128 | `planner.planLabel` | Sazbahçe kıyı planı: batıda göl ve iskele, ortada Söğüt Çayırı, doğuda Ağ Ambarı ve Ceviz Avlusu. Bir alana dokunarak seçin. | |
| 129 | `planner.pick` | {name} alanını seç | |
| 130 | `planner.north` | K | |
| 131 | `planner.scale` | 10 m | |
| 132 | `planner.entrance` | Giriş | |
| 133 | `planner.lake` | ULUABAT GÖLÜ | |
| 134 | `planner.pist` | pist | |
| 135 | `planner.sahne` | sahne | |
| 136 | `planner.altar` | nikâh | |
| 137 | `planner.seeArea` | Alanı yakından görün | |
| 138 | `planner.capacity` | {min}–{max} kişi | |
| 139 | `planner.upTo` | {n} kişiye kadar | |
| 140 | `planner.sampleCap` | Kapasiteler örnektir. | |
| 141 | `reading.round` | {t} masa, {s} sandalye | |
| 142 | `reading.roundCayir` | Pist göl tarafında; en arka masa bile suyu görür. | |
| 143 | `reading.roundAmbar` | Pist sahnenin önünde; batı kapısı çayıra açılır. | |
| 144 | `reading.roundAvlu` | Masalar cevizin çevresinde; ağacın altı pist olur. | |
| 145 | `reading.spare` | Yanında {n} masalık boş yer kalır. | |
| 146 | `reading.full` | Alan tam dolu; ikram masaları dışarı alınır. | |
| 147 | `reading.chairs` | {n} sandalye, töreni görür | |
| 148 | `reading.nikahIskele` | Nikâh masası iskelenin ucunda; arkanızda yalnız göl var. | |
| 149 | `reading.nikahCayir` | Nikâh masası kıyıda; misafirler göle bakar. | |
| 150 | `reading.nikahAmbar` | Nikâh masası kuzey duvarında; yağmurda da tören saatinde başlar. | |
| 151 | `reading.nikahAvlu` | Nikâh masası cevizin altında; sıralar ağaca dönük. | |
| 152 | `reading.long` | {t} uzun masa, {s} kişi | |
| 153 | `reading.longNote` | Sunum perdesi ambarın kuzey duvarında; öğle yemeği çayırda. | |
| 154 | `reading.theatre` | {s} sandalye, sahneye dönük | |
| 155 | `reading.classroom` | {t} masa, {s} kişi not alır | |
| 156 | `reading.u` | U masada {s} kişi | |
| 157 | `reading.cocktail` | {t} ayakta masa, {s} kişi | |
| 158 | `reading.room` | {n} kişilik daha yer var. | |
| 159 | `reading.busy` | {name} bu tarihte kapalı | |
| 160 | `reading.busyFree` | O gün boş olan alanlar: | |
| 161 | `reading.busyNone` | O gün bütün alanlar dolu. Takvimden yakın bir gün seçin; birlikte bakalım. | |
| 162 | `reading.go` | {name} geç | |
| 163 | `reading.iskeleTitle` | İskele yalnız nikâh içindir | |
| 164 | `reading.iskeleBody` | Nikâh iskelede, yemek yirmi adım ötede çayırda. İkisini birlikte isteyebilirsiniz. | |
| 165 | `reading.toNikah` | Nikâh olarak planla | |
| 166 | `reading.overTitle` | {name} en çok {cap} kişi alır | |
| 167 | `reading.overSuggest` | {n} misafir için {name} uygun. | |
| 168 | `reading.overNone` | Bu kalabalık için çayır ile avlu birlikte açılabilir; bunu teklifte konuşalım. | |
| 169 | `reading.noSetup` | {name} için {setup} düzeni yok | |
| 170 | `reading.noSetupBody` | Bu düzen için başka bir alan seçin. | |
| 171 | `summary.title` | Teklif talebiniz | |
| 172 | `summary.lead` | Seçtikleriniz aşağıda. Fiyatı bu bilgilere göre size özel hazırlarız. | |
| 173 | `summary.rows.date` | Tarih | |
| 174 | `summary.rows.ceremony` | Tören | |
| 175 | `summary.rows.guests` | Misafir | |
| 176 | `summary.rows.area` | Alan | |
| 177 | `summary.rows.slot` | Saat | |
| 178 | `summary.rows.setup` | Düzen | |
| 179 | `summary.rows.catering` | İkram | |
| 180 | `summary.rows.extras` | Ekler | |
| 181 | `summary.rows.reach` | Size nasıl ulaşalım | |
| 182 | `summary.guests` | {n} kişi | |
| 183 | `summary.over` | kapasiteyi aşıyor; size alternatif öneririz | |
| 184 | `summary.slotSunset` | Gün batımı: tören {start}, güneş {set} batar | |
| 185 | `summary.name` | Adınız | |
| 186 | `summary.phone` | Telefon | |
| 187 | `summary.send` | Talebi gönder | |
| 188 | `summary.share` | Ailemle paylaş | |
| 189 | `summary.more` | Ayrıntıları ekle | |
| 190 | `summary.close` | Kapat | |
| 191 | `summary.notSent` | Bu bir tasarım örneği; form hiçbir yere gönderilmez. | |
| 192 | `summary.sentNote` | Gönderilmedi: bu bir tasarım örneği. Gerçek sitede talebiniz satış ekibine düşer ve size aynı gün dönülür [örnek]. | |
| 193 | `summary.copied` | Özet panoya kopyalandı; aile grubunuza yapıştırabilirsiniz. | |
| 194 | `summary.shareTitle` | Sazbahçe teklif talebi | |
| 195 | `summary.shareIntro` | Sazbahçe için teklif talebimiz: | |
| 196 | `mobileBar.label` | Plan özeti | |
| 197 | `mobileBar.summary` | Özet | |
| 198 | `mobileBar.date` | Tarih | |
| 199 | `home.areas.title` | Dört alan, tek kıyı | |
| 200 | `home.areas.sub` | Nikâh iskelede, yemek çayırda, kına avluda. Hepsi birbirine yürüme mesafesinde; misafirleriniz arabaya binmeden alan değiştirir. | |
| 201 | `home.areas.more` | Alanları inceleyin | |
| 202 | `home.areas.photosNote` | Alan fotoğrafları temsilidir. | |
| 203 | `home.sunset.title` | Töreni güneşe göre kuruyoruz | |
| 204 | `home.sunset.sub` | Nikâhı güneş göle inmeden 45 dakika önce başlatırız. Fotoğraflarınız altın saatte çekilir, yemek alacakaranlıkta başlar. | |
| 205 | `home.sunset.note` | Saatler bu kıyı için hesaplandı; karşı kıyıdaki tepeler güneşi birkaç dakika erken saklayabilir. | |
| 206 | `home.sunset.ceremony` | Tören | |
| 207 | `home.sunset.sunset` | Gün batımı | |
| 208 | `home.sunset.caption` | Her ayın 15’i | |
| 209 | `home.know.title` | Gelmeden önce | |
| 210 | `home.know.sample` | Kurallar örnektir. | |
| 211 | `home.know.items[0].q` | Yağmur planı | |
| 212 | `home.know.items[0].a` | Açık alandaki her düğün için Ağ Ambarı o gün boş tutulur. Hava kötüyse 48 saat önce birlikte karar veririz. | |
| 213 | `home.know.items[1].q` | Müzik saati | |
| 214 | `home.know.items[1].a` | Müzik 00.30’da biter. Kıyıdaki köylere saygı için bu saati uzatmıyoruz. | |
| 215 | `home.know.items[2].q` | Ulaşım | |
| 216 | `home.know.items[2].a` | Bursa merkezine yaklaşık 40 dakika. 120 araçlık otopark; misafir servisi ayarlayabiliriz. | |
| 217 | `home.know.items[3].q` | Hazırlık | |
| 218 | `home.know.items[3].a` | Gelin odası ve damat odası sabah 10.00’dan itibaren sizin. Fotoğrafçınız alanları bir gün önce gezebilir. | |
| 219 | `home.know.items[4].q` | İkram | |
| 220 | `home.know.items[4].a` | Yemek kendi mutfağımızdan. Pasta ve kına tepsisi dışarıdan gelebilir. | |
| 221 | `home.know.items[5].q` | Erişilebilirlik | |
| 222 | `home.know.items[5].a` | Ambar ve avlu eşiksiz. Çayıra ahşap yürüme yolu döşenir; iskele korkuluklu. | |
| 223 | `home.corporate.title` | Ekibinizi göl kıyısına çağırın | |
| 224 | `home.corporate.body` | Sabah ambarda sunum, öğlen çayırda uzun masa, akşam gün batımında yemek. Bayi toplantısı ve yılsonu yemekleri için düzeni planda kurun. | |
| 225 | `home.corporate.cta` | Kurumsal planlayıcı | |
| 226 | `home.corporate.photoAlt` | Ahşap kirişli bir salonda sıra sıra beyaz sandalyeler ve ayakta masalar | |
| 227 | `home.visit.title` | Önce bir çay içelim | |
| 228 | `home.visit.body` | Hafta içi her gün, gün batımına bir saat kala alanları birlikte gezelim. Tarihinizi ve misafir sayınızı getirin; planı yerinde kuralım. | |
| 229 | `home.visit.cta` | Ziyaret randevusu | |
| 230 | `home.visit.photoAlt` | Uluabat Gölü’nde sazlar arasında bağlı bir kayık, gün batımı | |
| 231 | `areasPage.title` | Alanlar | |
| 232 | `areasPage.lead` | Dört alan, tek bahçe. Her birini ayrı ayrı kiralayabilir ya da tören, yemek ve eğlence için birlikte kullanabilirsiniz. | |
| 233 | `areasPage.index` | Alanlar | |
| 234 | `areasPage.capacity` | Kapasite | |
| 235 | `areasPage.setup` | Düzen | |
| 236 | `areasPage.people` | Kişi | |
| 237 | `areasPage.season` | Sezon | |
| 238 | `areasPage.size` | Alan | |
| 239 | `areasPage.sizeValue` | yaklaşık {m2.toLocaleString("tr-TR")} m² | |
| 240 | `areasPage.notes` | Bilmeniz gerekenler | |
| 241 | `areasPage.planWith` | Bu alanla planla | |
| 242 | `areasPage.request` | Bu alan için teklif iste | |
| 243 | `areasPage.planCaption` | {name}, kıyı planında | |
| 244 | `areasPage.sample` | Kapasiteler ve kurallar örnektir; fotoğraflar temsilidir. | |
| 245 | `corporatePage.title` | Kurumsal toplantı ve davetler | |
| 246 | `corporatePage.lead` | Bayi toplantısı, lansman, yılsonu yemeği. Ekibiniz sabah gelir, akşam yemeğini göl kıyısında yer. Bursa merkezine yaklaşık 40 dakika, İstanbul’a yaklaşık 2,5 saat. | |
| 247 | `corporatePage.plannerTitle` | Düzeni planda kurun | |
| 248 | `corporatePage.plannerSub` | Alanı, düzeni ve katılımcı sayısını seçin. Kapasite aşılırsa plan söyler. | |
| 249 | `corporatePage.people` | Katılımcı | |
| 250 | `corporatePage.matrixTitle` | Kapasite tablosu | |
| 251 | `corporatePage.matrixNote` | Kişi sayıları örnektir. | |
| 252 | `corporatePage.none` | — | |
| 253 | `corporatePage.dayTitle` | Örnek bir gün | |
| 254 | `corporatePage.day[0].t` | 09.30 | |
| 255 | `corporatePage.day[0].a` | Karşılama ve kahvaltı | |
| 256 | `corporatePage.day[0].w` | Ceviz Avlusu | |
| 257 | `corporatePage.day[1].t` | 10.00 | |
| 258 | `corporatePage.day[1].a` | Sunum, tiyatro düzeni | |
| 259 | `corporatePage.day[1].w` | Ağ Ambarı | |
| 260 | `corporatePage.day[2].t` | 12.30 | |
| 261 | `corporatePage.day[2].a` | Öğle yemeği, uzun masa | |
| 262 | `corporatePage.day[2].w` | Söğüt Çayırı | |
| 263 | `corporatePage.day[3].t` | 14.00 | |
| 264 | `corporatePage.day[3].a` | Atölyeler, sınıf ve U düzen | |
| 265 | `corporatePage.day[3].w` | Ağ Ambarı | |
| 266 | `corporatePage.day[4].t` | 17.30 | |
| 267 | `corporatePage.day[4].a` | Kıyıda yürüyüş ve kayık | |
| 268 | `corporatePage.day[4].w` | İskele | |
| 269 | `corporatePage.day[5].t` | Gün batımı | |
| 270 | `corporatePage.day[5].a` | Akşam yemeği | |
| 271 | `corporatePage.day[5].w` | Söğüt Çayırı | |
| 272 | `corporatePage.techTitle` | Teknik föy | |
| 273 | `corporatePage.techNote` | Teknik bilgiler örnektir. | |
| 274 | `corporatePage.tech[0].k` | Elektrik | |
| 275 | `corporatePage.tech[0].v` | Ambarda 3 faz 63 A pano; çayırda iki ayrı 32 A çıkış. | |
| 276 | `corporatePage.tech[1].k` | Görüntü | |
| 277 | `corporatePage.tech[1].v` | 4 × 2,5 m motorlu perde, 7.000 lümen projeksiyon, HDMI ve kablosuz yansıtma. | |
| 278 | `corporatePage.tech[2].k` | Ses | |
| 279 | `corporatePage.tech[2].v` | Ambarda sabit ses düzeni, dört telsiz mikrofon, kürsü. | |
| 280 | `corporatePage.tech[3].k` | İnternet | |
| 281 | `corporatePage.tech[3].v` | Ambar ve avluda fiber bağlantı; ayrı misafir ağı. | |
| 282 | `corporatePage.tech[4].k` | Karartma | |
| 283 | `corporatePage.tech[4].v` | Ambar pencerelerinde karartma perdesi; gündüz sunumda perde net okunur. | |
| 284 | `corporatePage.tech[5].k` | Ulaşım ve park | |
| 285 | `corporatePage.tech[5].v` | 120 araç ve 4 otobüs için otopark. Bursa merkezden servis ayarlanabilir. | |
| 286 | `corporatePage.tech[6].k` | Konaklama | |
| 287 | `corporatePage.tech[6].v` | Gölyazı’daki pansiyonlarda grup için oda ayırma desteği. | |
| 288 | `corporatePage.photoAlt` | Ahşap ambarın içinde boydan boya uzun masalar | |
| 289 | `corporatePage.photo2Alt` | Ahşap kirişli salonda sıra sıra sandalyeler ve ayakta masalar | |
| 290 | `corporatePage.cta` | Kurumsal teklif iste | |
| 291 | `requestPage.title` | Teklif talebi | |
| 292 | `requestPage.lead` | Beş adımda talebinizi hazırlayın. Fiyatı bu bilgilere göre size özel yazarız. | |
| 293 | `requestPage.stepsLabel` | Adımlar | |
| 294 | `requestPage.steps[0]` | Tarih | |
| 295 | `requestPage.steps[1]` | Tören ve misafir | |
| 296 | `requestPage.steps[2]` | Alan ve saat | |
| 297 | `requestPage.steps[3]` | İkram ve ekler | |
| 298 | `requestPage.steps[4]` | İletişim | |
| 299 | `requestPage.next` | Devam | |
| 300 | `requestPage.back` | Geri | |
| 301 | `requestPage.edit` | Düzenle | |
| 302 | `requestPage.toSummary` | Özeti gör | |
| 303 | `requestPage.stepOf` | Adım {i}/{n} | |
| 304 | `requestPage.catering.karsilama` | Karşılama ikramı (şerbet, limonata, kanepe) | |
| 305 | `requestPage.catering.aksam` | Servisli akşam yemeği | |
| 306 | `requestPage.catering.bufe` | Açık büfe | |
| 307 | `requestPage.catering.kina` | Kına sofrası (lokum, kuruyemiş, şerbet) | |
| 308 | `requestPage.catering.kahve` | Kahve arası ve öğle yemeği | |
| 309 | `requestPage.cateringLabel` | İkram | |
| 310 | `requestPage.extrasLabel` | Ekler (isteğe bağlı) | |
| 311 | `requestPage.extras.gelin` | Gelin ve damat odası, sabahtan | |
| 312 | `requestPage.extras.cicek` | Çiçek ve masa süsü | |
| 313 | `requestPage.extras.foto` | Fotoğrafçı önerisi | |
| 314 | `requestPage.extras.muzik` | Müzik ve ses ekibi | |
| 315 | `requestPage.extras.servis` | Bursa’dan misafir servisi | |
| 316 | `requestPage.extras.konak` | Gölyazı’da konaklama desteği | |
| 317 | `requestPage.contact.name` | Ad soyad | |
| 318 | `requestPage.contact.phone` | Cep telefonu | |
| 319 | `requestPage.contact.email` | E-posta (isteğe bağlı) | |
| 320 | `requestPage.contact.reach` | Size nasıl ulaşalım? | |
| 321 | `requestPage.contact.reachOptions.telefon` | Telefon | |
| 322 | `requestPage.contact.reachOptions.whatsapp` | WhatsApp | |
| 323 | `requestPage.contact.reachOptions.eposta` | E-posta | |
| 324 | `requestPage.contact.note` | Eklemek istedikleriniz | |
| 325 | `requestPage.contact.notePh` | Örneğin: nikâhı iskelede, yemeği çayırda istiyoruz. | |
| 326 | `requestPage.contact.errName` | Adınızı ve soyadınızı yazın. | |
| 327 | `requestPage.contact.errPhone` | 5 ile başlayan 10 haneli bir numara yazın. | |
| 328 | `requestPage.summaryTitle` | Talebinizin özeti | |
| 329 | `requestPage.summaryLead` | Bu özeti ailenizle paylaşabilir ya da gönderebilirsiniz. | |
| 330 | `requestPage.send` | Talebi gönder | |
| 331 | `requestPage.share` | Ailemle paylaş | |
| 332 | `requestPage.notSent` | Bu bir tasarım örneği; form hiçbir yere gönderilmez. | |
| 333 | `requestPage.sentTitle` | Gönderilmedi | |
| 334 | `requestPage.sentBody` | Bu bir tasarım örneği. Gerçek sitede talebiniz satış ekibine düşer; size seçtiğiniz yoldan aynı gün dönülür [örnek]. | |
| 335 | `requestPage.noExtras` | Yok | |
| 336 | `visitPage.title` | Ziyaret ve yol tarifi | |
| 337 | `visitPage.lead` | Sazbahçe, Uluabat Gölü’nün doğu kıyısında, Gölyazı yolunun üzerinde. Alanları görmek için en iyi saat, gün batımına bir saat kala. | |
| 338 | `visitPage.waysTitle` | Nasıl gelinir | |
| 339 | `visitPage.ways[0].t` | İstanbul’dan | |
| 340 | `visitPage.ways[0].d` | Osmangazi Köprüsü ve O-5 otoyolu üzerinden yaklaşık 2,5 saat. | |
| 341 | `visitPage.ways[1].t` | Bursa merkezden | |
| 342 | `visitPage.ways[1].d` | Nilüfer üzerinden Gölyazı yönünde yaklaşık 40 dakika. | |
| 343 | `visitPage.ways[2].t` | Havalimanından | |
| 344 | `visitPage.ways[2].d` | Bursa Yenişehir Havalimanı’ndan yaklaşık 1 saat; İstanbul Sabiha Gökçen’den yaklaşık 2 saat. | |
| 345 | `visitPage.ways[3].t` | Otopark | |
| 346 | `visitPage.ways[3].d` | 120 araç ve 4 otobüs. Giriş, Gölyazı yolundan sağa sapan çakıl yoldan. | |
| 347 | `visitPage.distanceNote` | Süreler yaklaşıktır; trafiğe göre değişir. | |
| 348 | `visitPage.mapLabel` | Bölge haritası: Bursa’nın batısında Uluabat Gölü, kuzey kıyısında Gölyazı, doğu kıyısında Sazbahçe. | |
| 349 | `visitPage.map.sea` | Marmara Denizi | |
| 350 | `visitPage.map.lake` | Uluabat Gölü | |
| 351 | `visitPage.map.golyazi` | Gölyazı | |
| 352 | `visitPage.map.bursa` | Bursa | |
| 353 | `visitPage.map.istanbul` | İstanbul | |
| 354 | `visitPage.map.venue` | Sazbahçe | |
| 355 | `visitPage.map.mudanya` | Mudanya | |
| 356 | `visitPage.map.o5` | O-5 | |
| 357 | `visitPage.mapNote` | Şematik harita; ölçekli değildir. | |
| 358 | `visitPage.appointmentTitle` | Görüşme randevusu | |
| 359 | `visitPage.appointmentSub` | Bir gün ve saat seçin; ekibimiz sizi kapıda karşılasın. Planınızı yanınızda getirin, alanda birlikte kuralım. | |
| 360 | `visitPage.dayLabel` | Gün | |
| 361 | `visitPage.timeLabel` | Saat | |
| 362 | `visitPage.times[0]` | 11.00 | |
| 363 | `visitPage.times[1]` | 14.00 | |
| 364 | `visitPage.times[2]` | Gün batımına bir saat kala | |
| 365 | `visitPage.peopleLabel` | Kaç kişi geleceksiniz? | |
| 366 | `visitPage.people[0]` | 1–2 | |
| 367 | `visitPage.people[1]` | 3–4 | |
| 368 | `visitPage.people[2]` | 5 ve üzeri | |
| 369 | `visitPage.name` | Ad soyad | |
| 370 | `visitPage.phone` | Cep telefonu | |
| 371 | `visitPage.submit` | Randevu iste | |
| 372 | `visitPage.notSent` | Bu bir tasarım örneği; form hiçbir yere gönderilmez. | |
| 373 | `visitPage.sentTitle` | Gönderilmedi | |
| 374 | `visitPage.sentBody` | Bu bir tasarım örneği. Gerçek sitede {day}, {time} için ekibimiz sizi arayıp randevuyu onaylar [örnek]. | |
| 375 | `visitPage.closedDay` | Pazartesi kapalı | |
| 376 | `visitPage.hours` | Ziyaret: salı–pazar, 10.00–19.00 [örnek] | |
| 377 | `visitPage.photoAlt` | Gölyazı’da kıyıya bağlı kayıklar ve göle bakan evler | |
| 378 | `contact.address[0]` | Gölyazı yolu, Uluabat Gölü doğu kıyısı | |
| 379 | `contact.address[1]` | Nilüfer, Bursa | |
| 380 | `contact.phone` | +90 224 000 00 00 | |
| 381 | `contact.hours` | Ziyaret: salı–pazar 10.00–19.00 | |
| 382 | `contact.directions` | Haritada aç | |
| 383 | `footer.visit` | Ziyaret | |
| 384 | `footer.reach` | İletişim | |
| 385 | `footer.pages` | Sayfalar | |
| 386 | `footer.note` | Sazbahçe kurgusal bir markadır; bu site rasitburucu.com için hazırlanmış bir tasarım örneğidir. Adres, telefon, kapasiteler, kurallar ve doluluk örnektir; alan fotoğrafları temsilidir. Formlar hiçbir yere gönderilmez. | |
| 387 | `footer.credits` | Proje künyesi | |
| 388 | `footer.kunye.design` | Tasarım ve geliştirme: | |
| 389 | `footer.kunye.designBy` | Raşit Burucu | |
| 390 | `footer.kunye.render` | 3B ve render: | |
| 391 | `footer.kunye.renderText` | 3B ve render kullanılmadı. Kıyı planı, masa yerleşimi ve bölge haritası bu çalışma için kodla çizildi (SVG). | |
| 392 | `footer.kunye.photos` | Fotoğraflar: | |
| 393 | `footer.kunye.fonts` | Yazı karakterleri: | |
| 394 | `footer.kunye.year` | Yıl: | |
| 395 | `footer.kunye.yearValue` | 2026 | |
| 396 | `footer.copyright` | © 2026 Sazbahçe · Konsept çalışma — rasitburucu.com | |
| 397 | `notFound.title` | Bu yol göle çıkmıyor. | |
| 398 | `notFound.body` | Aradığınız sayfa yok ya da taşındı. Plan ana sayfada, alanlar bir tık ötede. | |
| 399 | `notFound.home` | Ana sayfaya dön | |
| 400 | `notFound.areas` | Alanlar | |

## Cila turu (2026-10-05): değişen metinler

| # | Yer (anahtar) | Metin | Onay |
|---|---|---|---|
| C1 | `areas.cayir.photoAlt` | Gün batımında göl kıyısındaki çayırda kurulu yuvarlak masalar, iki yanda salkım söğütler | |
| C2 | `areas.cayir.photo2Alt` | Göle bakan bir masada mumlar, tabaklar ve beyaz çiçekler; arkada gün batımı | |
| C3 | `areas.ambar.photoAlt` | Ahşap çatı makaslı ambarda boydan boya uzun masalar ve ampul dizileri; açık kapıdan göl görünüyor | |
| C4 | `areas.ambar.photo2Alt` | Ambar sunum düzeninde: perdeye dönük sandalye sıraları, pencerelerden öğleden sonra ışığı | |
| C5 | `areas.avlu.photoAlt` | Taş duvarlı avluda cevizin çevresinde yuvarlak masalar, dallarda fenerler, arkada ışıkları yanan taş ev | |
| C6 | `areas.avlu.photo2Alt` | Avludaki bir masada mumlu pirinç kına tepsisi ve çay takımı | |
| C7 | `areas.iskele.photoAlt` | Söğütlerin arasından göle uzanan iskeleye dönük sandalye sıraları, gün batımı | |
| C8 | `areas.iskele.photo2Alt` | İskelenin ucunda beyaz örtülü nikâh masası ve çiçekler, arkada göl | |
| C9 | `home.areas.photosNote` | Alan görselleri 3B canlandırmadır. | |
| C10 | `areasPage.sample` | Kapasiteler ve kurallar örnektir; alan görselleri 3B canlandırmadır. | |
| C11 | `footer.note` | … kurallar ve doluluk örnektir; alan görselleri 3B canlandırmadır. Formlar hiçbir yere gönderilmez. | |
| C12 | `footer.kunye.renderText` | Dört alanın görselleri bu çalışma için Blender’da modellenip render alındı; mobilya ve dokuların bir kısmı Poly Haven’dan (CC0). Kıyı planı, masa yerleşimi ve bölge haritası kodla çizildi (SVG). | |
| C13 | `corporatePage.photoAlt` | Ağ Ambarı sunum düzeninde: perdeye dönük sandalye sıraları | |
| C14 | `corporatePage.photo2Alt` | Ağ Ambarı’nda uzun masalar, ahşap çatı makasları ve ampul dizileri | |
| C15 | `planner.capacity` | Yemekli düzende {min}–{max} kişi | |
| C16 | `mobileBar.free` | {n} boş · {m} opsiyonlu / Bütün alanlar dolu | |
| C17 | `calendar.held` | Opsiyonlu: | |
| C18 | `calendar.dayAria` | {tarih}, {n} alan boş, {m} opsiyonlu | |
| C19 | `reading.busyFree` | O gün alınabilecek alanlar: | |
| C20 | `reading.busyNone` | O gün bu kalabalığı alan boş bir alan yok. Takvimden yakın bir gün seçin; birlikte bakalım. | |
| C21 | `reading.goHeld` | {Alan}’na geç (opsiyonlu) | |
| C22 | `hero.photoCaption` | Uluabat Gölü, Gölyazı, bir kış akşamı | |
| C23 | `render` (görsel köşesi) | 3B canlandırma | |
| C24 | `areas.ambar.photoAlt` | Ahşap çatı makaslı ambarda yuvarlak masalar ve ampul dizileri; açık batı kapısından göl görünüyor | |
| C25 | görsel alt metni (`golyaziM`) | Uluabat Gölü’nde gün batımı, Gölyazı kıyısında kayıklar | |

## Raşit düzeltmesi (2026-10-06)

Ana sayfadaki "Töreni güneşe göre kuruyoruz" bölümü (başlık, alt metin, not, gün batımı grafiği ve tablosu) Raşit'in isteğiyle kaldırıldı. "Gelmeden önce" yerinde kalıyor. Takvim ve planlayıcıdaki gün batımı saati bilgisi duruyor.

## Harita (2026-10-06)

Ziyaret sayfasındaki şematik harita, OpenStreetMap verisinden çizilmiş gerçek haritaya çevrildi (iki ölçek: Bölge, Yakın). Yol tariflerinden süreler çıkarıldı (kaynağı yoktu); yerine gerçek yol adları geldi. Kaldırılanlar: "Şematik harita; ölçekli değildir.", eski üç süreli tarif, sayfadaki tek "Haritada aç" bağlantısı (alt bilgideki duruyor).

| # | Yer (anahtar) | Metin | Onay |
|---|---|---|---|
| H1 | `visitPage.ways[0]` Bursa merkezden | İzmir Yolu’ndan (D200) batıya, Karacabey yönüne gidin. Bursa Batı kavşağını geçtikten sonra Gölyazı sapağından sola, Gölyazı yoluna dönün. | |
| H2 | `visitPage.ways[1]` İstanbul’dan | Osmangazi Köprüsü üzerinden O-5 otoyoluyla Bursa’ya gelin. İzmir yönünde devam edip Bursa Çevre Yolu Batı kavşağından D200’e geçin; Karacabey yönünde Gölyazı sapağından sola dönün. | |
| H3 | `visitPage.ways[2]` Havalimanından | Bursa Yenişehir Havalimanı’ndan Bursa’ya gelip Bursa merkezden tarifini izleyin. İstanbul’un havalimanlarından gelenler için İstanbul tarifi geçerli. | |
| H4 | `visitPage.distanceNote` | Süre yazmadık; trafiğe göre çok değişiyor. Güncel süre için haritanın altındaki bağlantılardan yol tarifi alın. | |
| H5 | `visitPage.map.scaleLabel` (düğme grubu, ekran okuyucu) | Harita ölçeği | |
| H6 | `visitPage.map.views.region` | Bölge | |
| H7 | `visitPage.map.views.close` | Yakın | |
| H8 | `visitPage.map.regionLabel` (ekran okuyucu) | Bölge haritası: Marmara Denizi kuzeyde, Bursa doğuda, Uluabat Gölü batıda. Sazbahçe gölün doğu ucunda, Gölyazı’nın kuzeyinde; O-5 otoyolu ve D200 Bursa’dan göle uzanıyor. | |
| H9 | `visitPage.map.closeLabel` (ekran okuyucu) | Yakın harita: D200’den güneye inen Gölyazı yolu, yolun batısında göl kıyısında Sazbahçe, güneyde Gölyazı, doğuda Akçalar. | |
| H10 | `visitPage.map` yer adları | Marmara Denizi · Uluabat Gölü · Bursa · Mudanya · Karacabey · Gölyazı · Akçalar · Fadıllı | |
| H11 | `visitPage.map.golyaziYolu` | Gölyazı yolu | |
| H12 | `visitPage.map` kenar okları | İstanbul ↗ · Bursa → · ← Karacabey | |
| H13 | `visitPage.map` yol levhaları, kuzey | O-5 · D200 · K | |
| H14 | `visitPage.map.venue` + `venueNote` (işaret kartı) | Sazbahçe / Kurgusal mekân, konum örnektir | |
| H15 | `visitPage.map.attribution` + `licence` (harita köşesi) | © OpenStreetMap katkıcıları (ODbL) | |
| H16 | `visitPage.mapNote` (harita altı) | Harita OpenStreetMap verisinden çizildi: göl kıyısı, yollar ve köyler gerçek. Sazbahçe kurgusal bir mekân; işaretli konum örnektir. | |
| H17 | `visitPage.mapLinks.google` | Google Haritalar’da yol tarifi | |
| H18 | `visitPage.mapLinks.apple` | Apple Haritalar’da aç | |
| H19 | `visitPage.mapLinks.osm` | OpenStreetMap’te aç | |
| H20 | `visitPage.mapLinks.pinName` (Apple Haritalar’daki iğne adı) | Örnek konum | |
| H21 | `footer.kunye.renderText` | Dört alanın görselleri bu çalışma için Blender’da modellenip render alındı; mobilya ve dokuların bir kısmı Poly Haven’dan (CC0). Kıyı planı ve masa yerleşimi kodla çizildi (SVG); ziyaret haritası OpenStreetMap verisinden kodla çizildi (© OpenStreetMap katkıcıları, ODbL). | |
