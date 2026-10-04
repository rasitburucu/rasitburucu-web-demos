# TASARIM: Revak Okulları

İnşadan sonra, kodda geçen değerlerden yazıldı. Sonraki değişiklikler bu dosyaya uyar ya da dosyayı günceller.

- Son güncelleme: 2026-10-04 (v5 derinlik turu: 10 yeni sayfa, 6 derinleşen blok; ayrıntı aşağıda "v5") · Yayın adresi: rasitburucu.com/web/revak/
- Önceki hâl: commit `8a08ddb` (v4 değişiklikleri commit edilmedi)

## Kullanılan tokenlar

| Token | Değer | Nerede |
|---|---|---|
| `--rv-stone` | #E7E5E0 | zemin |
| `--rv-stone-hi` / `--rv-stone-lo` | #F1F0EC / #DCD9D2 | panel, derz |
| `--rv-ink` / `--rv-ink-2` | #16202E / #223044 | metin, kapanış bloğu |
| `--rv-ash` | #5E6470 | ikincil metin |
| `--rv-seal` / `--rv-seal-deep` | #B8372B / #962B21 | ana eylem, mühür, odak halkası, imleç |
| `--rv-line` | #C9C4BA | çizgiler |
| `--w-vault` / `--w-floor` / `--w-haze` / `--w-shade` | #C9C0B0 / #B8AB96 / #B3A895 / #6F6455 | yürüyüş penceresinin tonozu, zemini, uzak sisi, kemer içi gölgesi |
| `--rv-ease-out` / `--rv-ease-io` | cubic-bezier(0.16,1,0.3,1) / (0.65,0,0.35,1) | giriş/çıkış, yer değiştirme |
| `--rv-radius` | 2px | bütün arayüz (düğmeler dahil; hap düğme kalktı) |
| Gösterim | Marcellus 400, `font-synthesis: none`, italik yok | başlık `clamp(2.7rem, 0.8rem + 5.2vw, 6.4rem)`, satır 1,04; bölüm `.rv-h2` `clamp(2.3rem, 1.2rem + 3.4vw, 4.6rem)`, satır 1,05 |
| Gövde | Hanken Grotesk, 17 px, satır 1,6 | |
| Tarayıcı yüzeyleri | `::selection` mürekkep/taş, `:focus-visible` 2 px mühür + 3 px boşluk, `caret-color` mühür, `scrollbar-color` mürekkep %40, `theme-color` #E7E5E0 | |

## Bileşen envanteri

| Ad | Dosya | İş |
|---|---|---|
| Giriş (cover) | `app/revak/page.tsx`, `almanak.css` "cover" | Başlık + alt başlık + cümle formu solda, revak render'ı sağda kemer içinde |
| SentenceForm | `components/revak/home/SentenceForm.tsx` | "Çocuğum [kademe] için [niyet] istiyorum." → doğru akış, kademe seçili |
| Walk | `components/revak/home/Walk.tsx` | Revak yürüyüşü; render edilmiş kemer yüzleri (`public/revak/walk/kemer-{sabah,aksam}-{720,1440}`) |
| Rehberlik | `page.tsx` `.rv-guide-*` | 9.–12. sınıf adımları, rakamsız |
| SealMark (adlı) | `components/revak/flow/kit.tsx` | Ön kayıt sonunda çocuğun adını taşıyan kırmızı mühür; adsız hâli diğer akışlarda tik |
| NotFound | `components/revak/shell/NotFound.tsx`, `app/revak/not-found.tsx`, `app/revak/404/page.tsx` | Örülmüş kemer 404 |
| Strip | `components/revak/shell/Footer.tsx` | "Konsept çalışma: … hayali bir okuldur" şeridi |
| Avlu / akşam bahçesi / bahçe yolu render'ları | `public/revak/img/avlu-*`, `aksamBahce-*`, `bahceYolu-*` | Kampüs bandı (bahçeden revağa), yürüyüşün son kemerinde akşam bahçesi, kampüs sayfası girişi (servi sırası ile revak arası bahçe yolu, sığ kemer kesimli) |
| Üst bant | `components/revak/shell/Header.tsx` `.rv-topbar` | 1100 px üstünde konsept şeridi solda, bursluluk duyurusu sağda tek 32 px mürekkep bant; telefonda duyuru tek satır (tarih + "Başvurun") |
| 404 kemeri | `public/revak/walk/kemer-orulu-720.*` | Akşam kemer yüzü, açıklığı moloz kesme taşla örülmüş (Blender `face-walled`) |
| Render hattı | `scripts/revak-blender/revak_scene.py`, `scripts/process-revak-renders.mjs` | Blender 5.2 (arka planda, fabrika ayarlı sahne) → PNG → AVIF/WebP + OG. Bitki örtüsü yordamsal: geometri düğümleriyle yaprak kümeleri (servi, fıstık çamı, meşe/gürgen, çalı, ormanlık sırt); kalker taşta blok başına pürüz ve yağmur izi |

## Hareket envanteri

| An | Tetikleyici | Süre / easing | Azaltılmış hareket |
|---|---|---|---|
| Giriş başlığı | yükleme | 0,9 sn `--rv-ease-out`, 0,35em yükselme | anında |
| Giriş render'ı | yükleme | 1,6 sn ölçek 1,12→1 (gizlenmez; LCP öğesi) | yok |
| Revak yürüyüşü | kaydırma, pin, `scrub: 0.6` | MOVE 1,25, HOLD 1,1 zaman birimi; 0,42 vh/birim masaüstü, 0,36 mobil | dört kademe yıllık sayfası; pin ve Lenis yok |
| Işık sabah→akşam | yürüyüşle | akşam render'ı `opacity: var(--sun)` | yok |
| Fotoğraf kemerin arkasında | yürüyüşle | fotoğraf düzlemi kemerin 0,45 birim arkasında (bahçe 1,5): kaçış noktasından ölçek, kemerden yavaş büyür; kemer içi gölgesi (tonoz, güneş tarafındaki söve, zemin teması), kemer ışığına renk eşleme (`saturate .74`, sabah/akşam çarpma tonu), soffit taş bandı | yok |
| Kemerin altından geçiş | yürüyüşle | kamera durakta kemerin 0,55 birim önünde; geçerken kemer gölgesi (`.rv-walk-under`, en çok %32) ve 2,2 px adım salınımı; fotoğraflar sırayla (eski z<0,3'te çıkar, yeni z 2,35→1,75'te girer); yaş sayacı geçiş boyunca solda | yok |
| Kemer → ön kayıt | kademe düğmesi | View Transitions 0,75 sn | düz gezinme |
| Mühür | ön kayıt bitince | 0,52 sn ölçek 1,35→1, -13°→-7° | basılı hâliyle |
| Lenis | okuma sayfaları | kendi rAF döngüsü; ana sayfada yürüyüş takılıyken `gsap.ticker` sürer, `lagSmoothing(0)` | kurulmaz |

## Ölçümler (2026-10-04, üretim derlemesi, yerel, ağ kısıtlaması yok)

| Ölçüt | Değer | Bütçe |
|---|---|---|
| Ana sayfa ilk yük JS (mobil) | 175 KB brotli (v3 ölçümü; v4'te JS değişimi yalnız birkaç satır) | ≤ 350 KB |
| Next "First Load JS" `/revak` | 187 KB (v4) | |
| LCP (mobil 390) | 0,50 sn, öğe: giriş render'ı (`revak-800.avif`) | ≤ 2,5 sn |
| CLS | 0 | ≤ 0,1 |
| Görsel (ilk ekran, mobil) | 113 KB; font 75 KB; CSS 79 KB | |
| Konsol hatası | yok (masaüstü, mobil, akışlar) | |
| Yatay taşma (390) | yok | |
| `npm run lint` / `npm run build` | temiz / yeşil | |

INP ve gerçek cihaz ölçümü yapılmadı.

## Bilinen borçlar ve kararlar

| Konu | Neden ertelendi | Ne zaman |
|---|---|---|
| Bilinmeyen `/web/revak/*` yollarının `/web/revak/404/`'e düşmesi | Statik dışa aktarım iç içe not-found üretmez; ana sitenin yönlendirmesi gerekir (Kalemkâr'la aynı) | yayın sırasında |
| Kullanılmayan eski görseller (`hero`, `campus`, `kampusHero` dosyaları `public/revak/img`'de) | Silmek yerine bırakıldı; yayına ~0,6 MB fazladan dosya gider, sayfalar istemez | Raşit onayıyla temizlik |
| Ölü CSS (`.rv-alumni-*`, `.rv-voice*`, `.rv-masthead`, `.rv-folio-n`) | Zararsız; ayrı temizlik turu | sonraki tur |
| `next/font/google` | Bulut aynasında derlenmez; yerel derlemede sorun yok | bulutta derleme gerekirse `next/font/local` |
| Kademe fotoğrafları stok (Pexels), ortaokul karesi yetişkin eldiveni | Render'la değiştirmek ayrı iş; çocuk yüzü yok | içerik turu |
| Duraklarda kemer önden düz çerçeve; derinlik yalnız yürürken görünüyor | v4 taze göz bulgusu; fotoğrafın arkasında bir sonraki kemeri göstermek kurguyu değiştirir | ayrı tasarım kararı |
| Ortaokul karesinde yetişkin eldiveni (stok) | Yeni kare ya da render gerekir | içerik turu |
| Yakın ağaçlarda yaprak kümeleri hâlâ biraz "brokoli" | Gerçek model (Poly Haven/Sketchfab) lisans ve ağırlık kararı ister | istenirse |
| Kullanılmayan `kemer-aksam` dışı eski görseller, ölü CSS | Önceki turdan | Raşit onayıyla temizlik |
| Yeni Türkçe metinler | Raşit onayı bekliyor (ELESTIRI.md değil, rapordaki liste) | onaydan sonra |

## v5: derinlik turu (2026-10-04, commit edilmedi)

Stil dosyası: `app/revak/sayfalar.css` (bütün seçiciler `.rv-root` önekli; temel sıfırlamanın `.rv-root p/h/ul` kuralları tek sınıflı kuralları ezmesin diye).

### Yeni tokenlar
| Token | Değer | Nerede |
|---|---|---|
| `--kd-sky-am` / `--kd-sky-pm` | #E1E5E3 / #ECD5B3 | kademe sayfasında saatin rengi; `--kd-sky` = `--sun` ile karışım |
| `--rv-seal-ink` | #8E2A20 | taş üstünde küçük mühür kırmızısı metin (6,3:1) |
| `--sun` | anaokulu 0 · ilkokul 0,34 · ortaokul 0,67 · lise 1 | kemer yüzü, fotoğraf tonu, zemin ışığı, "Bir gün" zemini |

### Yeni bileşenler
| Ad | Dosya | İş |
|---|---|---|
| Sample ("örnek" mührü) | `components/revak/ui/Bits.tsx` | Gerçek veri izlenimi veren her blokta aynı damga |
| Ledger | `ui/Bits.tsx` | Basılı almanak tablosu; telefonda satırlar etiketli yığın |
| Crumb, CtaBand | `ui/Bits.tsx` | İç sayfa izi ve mürekkep kapanış bandı |
| DesktopNav | `shell/Header.tsx` | 6 başlık, 4 açılır panel (en çok 5 bağlantı); telefonda gruplu menü |
| KademeWindow | `kademe/Window.tsx` | Yürüyüşün kemeri durağan: sabah/akşam render yüzü + kademe fotoğrafı; `view-transition-name: rv-arch` (yürüyüşten geçiş) |
| Lessons | `kademe/Lessons.tsx` | Ders cetveli; masaüstünde tam tablo, telefonda sınıf sekmesi |
| DaySun | `kademe/DaySun.tsx` | Günün saatleri güneşin yayında; işaret edilen saate güneş gider |
| AlmanakList | `almanak/List.tsx` | Ay ay takvim, süzgeç, "bugün" çizgisi, tek satır / bütün yıl .ics |
| Scenarios | `guvende/Scenarios.tsx` | Durum seç → kim, hangi sırayla |
| ArchParts | `okul/ArchParts.tsx` | Kemer parçaları ↔ okulun alışkanlıkları |
| CampusPlan | `kampus/Plan.tsx` | Mürekkep plan, kilit taşı işaretleri, "turda görmek istiyorum" → `?gor=` |
| MenuBook | `kampus/MenuBook.tsx` | İki hafta × iki mutfak, alerjen işaretleri, bugün çizgisi |
| RouteMap, RouteRules | `kampus/Interactive.tsx` | Semt hattı (yarım kemer yollar), varış ve dönüş, servis kuralları |
| AgeCalc, Gozlem, Documents | `kabul/Extra.tsx` | Yaş/sınıf hesaplayıcı (MEB md. 11), kademeye göre gözlem günü, yazdırılabilir belge listesi |
| `lib/revak/age.ts`, `lib/revak/levels.ts` | | Yaş kuralı; sunucu bileşenlerinin okuyabildiği kademe sabitleri |

### Hareket (yeni)
| An | Süre | Azaltılmış hareket |
|---|---|---|
| Menü paneli | 0,22 sn, 4 px iniş | yok |
| DaySun güneşi | 0,6 sn `--rv-ease-out` | anında |
| Kampüs planı kartı, senaryo adımları | 0,35 sn, adımlar 60 ms arayla | yok |

### Ölçümler (2026-10-04, üretim derlemesi, yerel)
| Ölçüt | Değer | Bütçe |
|---|---|---|
| Yüklenen JS (mobil, gzip, Link ön yüklemesi dahil) | en çok 224 KB (`/revak/kampus/`, `/revak/veli/`); yeni sayfalar 209-214 KB | ≤ 350 KB |
| Next "First Load JS" | yeni sayfalar 107-133 KB; ana sayfa 189 KB | |
| LCP (mobil, yerel) | 92-196 ms | ≤ 2,5 sn |
| Konsol hatası | yok (statik çıktıda, masaüstü ve mobil, bütün yeni sayfalar) | |
| `npm run lint` / `npx tsc --noEmit` / `npm run build` | temiz / temiz / yeşil | |

Ekran görüntüleri: `ekran/v5-d-*` (1440×900) ve `ekran/v5-m-*` (390×844).

### v5 borçları
| Konu | Neden | Ne zaman |
|---|---|---|
| Kampüs planı mürekkep çizim, Blender kuşbakışı render değil | Rapor ikisini de kabul ediyor; render 1 gün ek iş | istenirse |
| Kademe fotoğrafları hâlâ stok (Pexels); ortaokulda yetişkin eldiveni | Önceki turdan | içerik turu |
| Resmî tatil ve MEB takvimi elle girildi | Takvim değişirse `content/revak/almanak.ts` güncellenmeli | her yıl Haziran |
| Yaş kuralı "72 ay" düzenlemesi basında konuşuluyor, yürürlükte değil | Değişirse `lib/revak/age.ts` ve `kabul-ek.ts` kaynak metni | yönetmelik değişince |
| Bütün yeni Türkçe metinler | Raşit onayı bekliyor | onaydan sonra |


## Geliştirme turu (2026-10-04, jüri 7,2 → hedef 7,6; dal `gelistir/revak`)

### Değişenler
| Konu | Önce | Sonra |
|---|---|---|
| Yürüyüşün sabitlenmesi | GSAP `pin` (sahne kaydırma ortasında `position: fixed`'e geçiyordu) | CSS `position: sticky`; bölüm yüksekliği CSS'te (`--rv-walk-len`), `html.rv-live` sınıfı ilk boyamadan önce `layout.tsx`'teki satır içi betikle konur; ScrollTrigger yalnız `top top → bottom bottom` eşler |
| Yürüyüş uzunluğu | masaüstü 6,2 ekran, telefon 5,4 ekran | masaüstü 4,6 ekran, telefon 4 ekran (zaman çizelgesi 14,9 → 14,4 sn; ilk yürüyüş başlık çıkarken başlar) |
| Atlama | yok | Başlığın altında "Kademeleri geçin, rehberliğe inin" (`#rehberlik`); yürüyüşün ortasında klavyeyle odaklanınca sayfa yürüyüşün başına döner, bağlantı görünür |
| Baştaki boş sütun | başlık çıkınca bir ekran boyu boş, yaş sayacı yalnız kademe aralarında | "3 yaş" başlık çıkarken girer, Anaokulu adı yükselirken çıkar; kademeden ayrılırken yaş hemen döner |
| Saat ışığı | `--sun` ile %14/%22 çarpma tonu | `--rv-hour`: sabah serin mavi #B4C8DF → öğle #F0D3A0 → akşam kehribar #E2914C; pencere tonu 0,16–0,30, duvar %13 karışım, ikindiden sonra avlu tarafından sıcak ışık (soft-light) |
| Kemer taşı | gri sıva gibi render | `tas-sabah/aksam`: CLAHE ile derz kontrastı, bal rengi kalker tonu (sharp; Blender yeniden render yok). Kademe sayfası kemeri de aynı dosyaları kullanır |
| Kemer içindeki fotoğraflar | CSS `saturate(.74) contrast(.9) sepia(.12)` | Dosyada saat tonu: `saat-<anahtar>` (anaokulu serin sabah, ilkokul öğle, ortaokul ikindi, lise kehribar akşam); CSS süzgeci kalktı |
| Telefon üst krom | konsept şeridi (2 satır) + bursluluk bandı ≈ 78 px | tek mürekkep satırı 36 px ("Konsept: hayali okul." + "Bursluluk 15 Kasım Başvurun ×"); kazanılan yer giriş kemerine: kemer başlık ve alt başlık boyunca uzanır (162 → 271 px yükseklik) |
| Marcellus rakamları | "1" Roma I'sı, "0" O gibi | `Revak Rakam` yüzü: Hanken Grotesk'in tabular rakamları (yalnız 0-9, ağırlık 380, 1,4 KB), `--rv-f-serif` yığınının başında, `unicode-range` ile. Gerekçe: rakamı yazıyla yazmak "Kısaca Revak" paragrafının fikrini (rakamlar metnin içinde) bozar ve tarih/saat/fiyat gibi dinamik yerlerde mümkün değil; tek kural bütün sayfalardaki ~60 yeri birden düzeltir ve YON.md'deki "rakamlar serif içinde sans" kuralının genellemesidir. Başlık fontu değişmedi |

### Ölçümler (yerel üretim derlemesi, `dogrula.py` + layout-shift kaynak ölçümü)
| Ölçüt | Önce (canlı, jüri) | Sonra |
|---|---|---|
| CLS masaüstü | 1,0005 (kaynak: `div.rv-walk-stage`, pin başında 1,0 ve sonunda 0,94) | 0,0003 (yalnız açılışta duyuru metni) |
| CLS mobil | 0,9992 | 0 |
| LCP masaüstü / mobil | 732 / 1016 ms (canlı) | 284 / 164 ms (yerel) |
| Konsol hatası | yok | yok |
| `npm run lint` / `npm run build` | | temiz / yeşil |

Ekranlar: `ekran/gelistir-2026-10-04/` (dogrula çıktısı; `sheet-walk-d.png`, `sheet-walk-m.png` yürüyüşün 8 noktası; `alt-*` alt sayfalar).

### Bu turun borçları
| Konu | Neden | Ne zaman |
|---|---|---|
| Blender render yenilenmedi | Blender MCP bağlantısı kurulamadı (addon el sıkışması başarısız); taş tonu sharp ile verildi, sert gün ışığı ve derz gölgesi gerçek render değil | Blender açık ve MCP eklentisi çalışırken: `face-am/pm` sert güneş (açı ~0,25), alçak yan ışık |
| JS paketleri yüklenmezse yürüyüş | `html.rv-live` satır içi betikle konduğu için, paketler düşerse sahne başlıkla kalır, kademeler gizli | Yalnız inline betik çalışıp React paketi düşerse; gerçek riski düşük |
| ~~Telefonda Lise durağında "Bu kademeyi tanıyın" alt çubuğun altında kalıyor~~ | Kapandı (2. tur): telefonda durak sınıf mevcudu/dil satırlarını göstermiyor; 667 px yüksekliğinde kırmızı düğme de çıkıyor | — |
| `dogrula.py` "Türkçe glif" uyarısı | `Revak Rakam` yalnız rakam içerir, harfler Marcellus'tan gelir: yanlış alarm | — |
| Rakam yüzünde orantılı rakam (`pnum`) yok | Google alt kümesinde OpenType özelliği yok; "1" geniş tabular. "Kısaca Revak" 4. satırı bu yüzden 4 sütun içeri alındı | gerekirse |

## 2026-10-04 ikinci tur (jürinin küçük bulguları)
| Konu | Ne yapıldı |
|---|---|
| Form notu | Gönder düğmesinin altında "Bu bir tasarım örneği; form hiçbir yere gönderilmez." (ön kayıt, tur, bursluluk, ücret, kampüs geri arama) |
| Kısaca dipnotları | a-d harfi, cümle sonunda; liste harfle eşleşir; son satırın altı 0,4 em + not listesi kenar boşluğu (kenar boşluğu `.rv-root ol` sıfırlamasına yenilmişti) |
| Sihirbaz | Kademe seçilmeden "Devam edin" `aria-disabled` + soluk görünüm; tıklanınca kademe alanına odak ve "Kademeyi seçin." |
| Telefonda yürüyüş | Sayaç altında kademe adı + satır + "Bu kademeyi tanıyın" (sayaçla birlikte belirir/kaybolur; süs kopyası, okuma ve sekme sırasında yok). Duraklarda facts gizli; kısa telefonda (<=740 px) sayaç küçük, satır ve kırmızı düğme gizli |
| Bölüm ritmi | Ana sayfada bölümler arası 96 (telefon) - 128 px (masaüstü); önceden ~269 px |
| Başlık boyutu | Dev başlık: yürüyüş ("Revak boyunca") ve kapanış. Yarı boyut (≈51 px masaüstü, 32 px telefon): Üniversite rehberliği, Üç alışkanlık, Ders bittiğinde, Kampüs, Etkinlikler, SSS; "Kısaca Revak" zaten küçük |


## 2026-10-05 üçüncü tur (Raşit'in listesi)
| Konu | Ne yapıldı |
|---|---|
| Üst şerit, menü, künye | Şerit her boyutta "Konsept çalışma — rasitburucu.com" (kısa/uzun ayrımı kalktı; telefonda bursluluk duyurusuyla artık iki kısa satır, 36 → 66 px). Menü 1180 px altında menü düğmesine geçer (1061-1180 arasında "Veli girişi" görünmüyordu); Kabul paneline bursluluk başvurusu ve ücret bilgisi sayfaları eklendi (panel 7 bağlantı). Alt bilgi künye şablonunda: marka + yer, Ziyaret, İletişim, Sayfalar (menüden üretilen 16 sayfa, `PAGES`), konsept notu, Proje künyesi, telif satırı |
| Performans (yürüyüş) | Dokunmatik ve ≤1180 px'te başlık, telefon çubuğu ve form düğmelerinin arkasındaki `backdrop-filter` kalktı (dolgu %97-98). Yürüyüşte her karede yazılan stiller adımlandı ve değişmeyen değer yazılmıyor (`--sun`/`--end` 0,01; pus ve fotoğraf opaklığı 0,02; sayaç 0,02). Sayaç, alt yazısı ve TOC çubuğu kendi küçük katmanlarında. Görünmeyen (opaklık 0) kemer fotoğrafı ve öğleden önceki avlu parıltısı (soft-light) sahneden çıkar. Ölçüm: yazılım GPU'da (SwiftShader, 4× CPU) kare başına GPU işi 5,75 → 3,16 ms, katman 57 → 54; ana iş parçacığı 4× ve 6×'te önce de sonra da 165 Hz'de kare kaçırmıyor (p95 6,2 ms) |
| Kısaca Revak | Dipnot işaretleri ve listesi kalktı; poster: 18 tam ölçüde dev rakam, altında üç derzli hücre (2 / 2 / 1). Cümleler aynı |
| Ana başlık | "Her çocuğu adıyla tanıyan okul." |
| Revak sözlük satırı | "Revak boyunca" başlığının altında tek madde |
| Üç alışkanlık fotoğrafı | Neden: kapalı kemer (`clip-path: inset(100% …)`) görseli sıfır alanlı yapıyordu, tarayıcının tembel yüklemesi kemer açılmaya başlayana kadar isteği hiç başlatmıyordu. Çözüm: 2,5 ekran önceden `loading=eager` + `decode()`. Yavaş 4G (150 ms, 1,6 Mbps), telefon: önce görüntü bölüme girdiğinde yüklenmemişti, 1,2 sn sonra geldi; sonra bölüme gelmeden yüklü |

### Bu turun borçları
| Konu | Neden | Ne zaman |
|---|---|---|
| Gerçek telefonda kare hızı | Bu makinede Chrome emülasyonu (4×/6× CPU) yürüyüşte kare kaçırmıyor; takılmanın kaynağı büyük olasılıkla telefon GPU'su ve Safari (bulanıklık, karışım modları, katman belleği). Laboratuvar ölçümü yalnız göstergedir | Raşit telefonunda ve tablette denesin |
| Küçük telefonda (360×740) "Revak boyunca" başlığı pencereye biniyor | Önceden de biniyordu; sözlük satırı iki satır daha ekledi | Raşit görmek isterse başlık boyutu kararı |
