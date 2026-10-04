# Şef restoranı konsept sitesi: tasarım ve yapım planı

> Durum: taslak, Raşit onayı bekliyor. Kod yazılmadı.
> Tarih: 2026-10-03. Rota: `app/kalemkar/` → canlıda `rasitburucu.com/web/kalemkar/` (ad onaylanınca slug kesinleşir).
> Kurallar: önce yalnızca TR (EN, TR metin onayından sonra), "Konsept çalışma" şeridi, `noindex`, uydurma başarı / ödül / yorum yok, backend yok. Ödeme ve form gönderimi sahte ya da mailto. Görseller açık lisanslı, kaynakları credits'te.

---

## 1. Konsept

Kalemkâr, Gaziantep'te tek menüyle çalışan bir akşam restoranı. Site "burada iyi yemek var" demekle yetinmiyor. Asıl sattığı şey, ziyaretçinin oturacağı akşamın kendisi: hangi gün, kaç kişi, hangi masa, hangi tabaklar. Bütün site tek bir nesnenin etrafında kuruldu. Bu nesne, şefin bakırcı dedesinin kazıdığı bakır sini. Ana sayfada mevsim menüsü bu sininin üstüne tabak tabak servis edilir. Rezervasyonda aynı sini sizin masanıza dönüşür: dört kişi seçerseniz dört kuver (bir misafirin önüne kurulan tabak-çatal takımı) açılır, alerji yazdığınız misafirin önüne bir işaret düşer, şefin tezgâhını seçerseniz yuvarlak sini uzun bir tezgâha dönüşür. Ziyaretçi yemeği daha masaya oturmadan görür, o yüzden rezervasyonu formdan çok "akşamı kurmak" gibi yaşar. Bu bir portal görünümü değil, sanat enstalasyonu da değil. Gerçek bir fine-dining restoranının isteyebileceği rezervasyon sitesinin çok özenli bir hâli.

---

## 2. Marka

### Ad ve konum seçenekleri

| | Ad | Konum | Gerekçe | Çakışma kontrolü (2026-10-03, web araması) |
|---|---|---|---|---|
| **Önerilen** | **Kalemkâr** | **Gaziantep, Bey Mahallesi** (tarihî taş evler, Bakırcılar Çarşısı'na yürüme mesafesi) | Kalemkâr, bakıra desen kazıyan usta demek. Bakır sini imzasıyla doğrudan bağlanıyor. Gaziantep Türkiye'nin gastronomi şehri (UNESCO Yaratıcı Şehirler Ağı'nda gastronomi dalında). Fıstık, bakır, köz gibi güçlü yerel imgeleri var. Diğer demolarla çakışmıyor: Bodrum (Onikitaş), İstanbul (Revak), Alaçatı (otel demosu). Böylece üçüncü bir Ege sitesinden de kaçınılmış oluyor. | Gaziantep'te bu adla bir restoran bulunamadı. |
| Alternatif | Tüf | Ürgüp, Kapadokya (tüf kayaya oyulmuş eski bir kiler) | Yabancı ziyaretçisi çok, yüksek bütçeli bir pazar. Mekân kendi başına hikâye anlatıyor. | Bulunamadı. Risk: tüfün açık bej rengi Onikitaş'ın traverten paletine fazla yakın. Bölge şarap bölgesi olduğu için alkol riski de daha yüksek. |
| Alternatif | Tezgâh | İstanbul, Karaköy (8 kişilik şef tezgâhı) | Fine-dining pazarı en büyük şehirde. Konsept tamamen tezgâh deneyimi üstüne kurulu. | Bulunamadı. Risk: Revak'tan sonra ikinci bir İstanbul sitesi olur, coğrafi çeşitlilik kaybolur. |

Elenen adlar: **Sini** (Gaziantep'te "Sini Baklava" var), **Firik** (Bey Mahallesi'nde aynı adlı bir restoran kaydı var).

### Şefin hikâyesi (hayali, kısa)

Şef **Nesrin Ekinci** (hayali ad; yapım öncesi gerçek bir şefle çakışıyor mu, kısa bir aramayla kontrol edilecek). Bakırcılar Çarşısı'nda, sini kazıyan dedesinin dükkânında büyüdü. On iki yıl İstanbul'da ve Lyon'da mutfaklarda çalıştı, sonra Antep'e döndü. Dükkânın arka sokağındaki 19. yüzyıldan kalma taş evi restorana çevirdi. Her mevsim, yörenin üreticilerinden gelen ürünle tek bir akşam menüsü yazıyor. Tabaklar dedesinin kazıdığı sinilerde servis ediliyor. Sini kenarındaki kazıma, o mevsimin ürünlerini sayıyor.

Mekân bilgileri (kapasite bilgisi, başarı iddiası değil): salonda 11 masa, mutfağa bakan 8 kişilik şef tezgâhı, kubbeli eski kilerde 8–14 kişilik özel oda. Açık günler Çarşamba–Pazar, saat 18.00–24.00.

---

## 3. Sanat yönü

### Diğer demolardan ayrım

| | Onikitaş | Revak | Kalemkâr (A önerisi) |
|---|---|---|---|
| Zemin | Açık: badana, traverten | Açık: taş, mürekkep | **Koyu: is / kömür** |
| Vurgu | Kiremit | Mühür kırmızısı #B8372B | **Fıstık yeşili** |
| Font | DM Serif Display, Bodoni Moda, Instrument Sans, Pinyon Script | Newsreader, Hanken Grotesk | **Young Serif + Geologica** |
| İmza | WebGL arazi, kaydırdıkça gün ilerliyor | GSAP ile kaydırmaya bağlı revak yürüyüşü, ışık sabahtan akşama dönüyor | **Durumu gösteren nesne: sini tabak tabak servis ediliyor, rezervasyonda masaya dönüşüyor** |
| Zaman/ışık metaforu | Var | Var | **Yok** (bilinçli olarak bırakıldı) |

### Yön A: "Sini" (önerilen)

- **Baskın renk:** is siyahı `#17130F`. Isınmış bakır kabın içindeki is gibi sıcak bir siyah. Metin rengi kırık beyaz `#EEE5D6`. Bakırın kendisi fotoğrafta ve sini nesnesinde görünüyor. Arayüzde renk olarak kullanılmıyor.
- **Tek vurgu:** Antep fıstığı yeşili `#9DB26A`. Yalnızca seçili saat, seçili kişi sayısı, ana eylem düğmesi ve alerji işaretinde kullanılıyor. Koyu zemin üstündeki kontrastı yaklaşık 8:1. Yeşil düğmenin üstündeki yazı koyu renk olacak.
- **Font çifti (Google Fonts):**
  - **Young Serif**: başlıklar, tabak adları ve sini kenarındaki kazıma yazı. Tok, sıcak, biraz kaba saba bir serif. Bakır işçiliğine yakışıyor ve şık restoran sitelerinde sık görülen ince serif kalıbından uzak.
  - **Geologica**: arayüz, form ve gövde metni. Değişken bir grotesk; sayılar net okunuyor, ki saat ve kişi seçiminde bu önemli.
  - Yapım adımı 1'de Türkçe karakter testi yapılacak (ğ ş ı İ, latin-ext alt kümesi). Young Serif'te eksik çıkarsa yedek: **Castoro**.
- **İmza etkileşim:** sini, sitenin hem sanatı hem de rezervasyon özeti. (1) Ana sayfada güz menüsünün 9 tabağı sırayla siniye konup kaldırılıyor, garson servisi gibi. (2) Rezervasyonda aynı sini seçimleri gösteriyor: kuverler, alerji işareti, tezgâha dönüşme. (3) İmleç bakırın üstünde gezerken ışık parıltısı onunla birlikte kayıyor.
- **Avantaj:** imza süs değil, işlevin kendisi (Onikitaş v2 dersi). Rezervasyon özeti normalde sıkıcı bir metin kutusu; burada görsel olarak keyifli. Akılda kalan tek bir nesne var. three.js gerekmiyor, mobilde hafif kalıyor.
- **Risk:** tepeden çekilmiş tabak fotoğraflarının ışığı ve arka planı birbirini tutmayabilir (çözüm: daire kırpma ve renk eşitleme, bkz. Bölüm 7). Koyu zemin fine-dining'de yaygın, sıradan kaçabilir (çözüm: bakır doku ve Young Serif kişiliği). Revak'taki kaydırmaya sabitlenen bölüm hissine benzeme riski var (çözüm: servis, sürekli bir kaydırma akışı değil, tek tek atılan adımlar olarak tasarlanıyor).

### Yön B: "Köz"

- **Baskın renk:** kömür `#121212`. **Tek vurgu:** köz turuncusu `#E2572B`.
- **Font çifti:** **Bricolage Grotesque** (başlıklar, sıkışık ve ağır) + **Spectral** (menü metni, ürünün geldiği yer italik).
- **İmza etkileşim:** ana sayfanın girişinde tam ekran bir WebGL ateş efekti: ızgara telinin altında kızaran közler. İmleç hızlı hareket ettikçe közler "üflenmiş" gibi parlıyor. Aynı efekt sayfa geçişlerinde kısa bir an tekrar görünüyor.
- **Avantaj:** ilk saniyede "vay" etkisi güçlü. Antep'in ocakbaşı kültürüne doğrudan bağlanıyor.
- **Risk:** jenerik ateş ve parçacık efekti olarak okunma ihtimali yüksek ("AI görünümü" riski). Rezervasyon işlevine bağlanmıyor, yalnızca dekor kalıyor, yani Onikitaş v2'nin düştüğü tuzak. WebGL mobilde pil ve performans yiyor. Turuncu-kırmızı vurgu, Revak'ın mühür kırmızısına yakın. "Fine dining" yerine "kebapçı / steakhouse" algısı yaratabilir.

**Öneri: A.** Raşit'in formülüne ("gerçek bir müşteri isteğinin çok süslüsü") doğrudan oturuyor: süs, rezervasyonun içinde çalışıyor.

---

## 4. Sayfa haritası

Dikey dilim: ana sayfa + menü detayı + rezervasyon akışı (bekleme listesi ve özel davet dalları dahil).

```
/web/kalemkar/                 Ana sayfa
/web/kalemkar/sofra/           Mevsim menüsü (detay sayfası)
/web/kalemkar/rezervasyon/     Rezervasyon akışı (?deneyim=salon|tezgah|ozel-oda)
/web/kalemkar/ozel-davet/      Özel oda / tamamını kiralama talebi (ayrı sayfa, akıştan da açılır)
```

Her sayfada üstte "Konsept çalışma" şeridi var. Masaüstünde başlıkta, mobilde altta sabit bir "Masa ayır" düğmesi bulunuyor (Revak'taki MobileBar kalıbı).

### Ana sayfa bölümleri (sırasıyla)

1. **Şerit + başlık.** Yazı logosu "KALEMKÂR" (Young Serif). Menü: Sofra · Şef · Ev · Özel davet. Sağda "Masa ayır".
2. **Giriş.** Ortalanmış bir hero değil. Solda büyük başlık ve kısa alt başlık. Sağda tepeden görünen bakır sini, ekranın dışına taşacak şekilde. Sini çok yavaş dönüyor (2 dakikada bir tur), parıltı imleci izliyor. Başlığın altında satır içi bir rezervasyon cümlesi: "**[2 kişi]** için **[Cuma, 9 Ekim]** akşamı → Masalara bak". Altında hızlı seçim çipleri: "Bu hafta boş: Prş 21.30 · Cmt 18.30". Yani işlev ilk ekranda.
3. **Bu mevsim sofrada (imza bölüm).** Sini ekrana sabitleniyor ve 9 tabak sırayla servis ediliyor. Yanda her tabağın adı, tek satırlık tarifi ve ürünün nereden geldiği (ilçe/köy ve üretici), bir de "3 / 9" sayacı var. Son tabaktan sonra "Menünün tamamı →" ve "Bu menüye masa ayır →" çıkıyor.
4. **Şef.** Fotoğrafta yüz yerine eller ve tabak tabağa servis anı. Üç kısa paragraf ve bir alıntı. Dedenin dükkânındaki kazıma kalemleri, sini kenarındaki kazıma yazıya bağlanıyor.
5. **Ev.** Avlu, salon, kiler odası fotoğrafları. Ardından evin **tepeden çizilmiş kat planı**: Salon, Tezgâh ve Özel oda alanlarından birinin üstüne gelince o alan vurgulanıyor, tıklayınca rezervasyon o deneyim seçilmiş olarak açılıyor. Bu, alışılmış "3 kart" kalıbının yerine geçiyor ve sininin tepeden bakış diliyle tutarlı.
6. **Bilmeniz gerekenler.** Depozito, iptal, geç kalma, kıyafet, çocuk politikası, alerji, erişilebilirlik. Kısa, açılır-kapanır satırlar.
7. **Rezervasyon takvimi.** "Rezervasyonlar her ayın 1'inde saat 10.00'da bir sonraki ay için açılır." Kasım ayının açılmasına kalan süre ve "Açılınca haber ver" (mailto) seçeneği.
8. **Alt bilgi.** Adres, açık günler, telefon (hayali, `tel:` biçiminde), mailto, görsel kaynakları, konsept notu.

### Menü sayfası: `/sofra/`

- Başlık: "Güz sofrası" ve menünün geçerli olduğu aralık ("Ekim – Aralık").
- 9 tabak dikey olarak listeleniyor. Her birinde daire fotoğraf, ad, içindekiler, alerjen simgeleri ve üretici/köy notu var.
- **Alerjen tablosu:** tabaklar × 14 alerjen. Fıstık sütunu ayrıca vurgulanıyor.
- **Kısa sofra** (6 tabak) ve **Tezgâh menüsü** (12 tabak) farkları.
- **Eşleşme notu (satış değil):** "Her tabak için alkolsüz bir eşleşme hazırlıyoruz: şıra, demleme, şerbet, ev yapımı ekşimeler. Şarap eşleşmesini masada sommelier'nizle konuşabilirsiniz." Şarap adı, fiyatı ya da görseli yok. Bkz. Bölüm 9.
- **Kaynak haritası:** Gaziantep ve çevresinin sade bir çizimi. Tabak üretici noktalarına bağlanıyor (statik SVG).
- **Geçen mevsimler:** "Yaz sofrası" arşivi, soluk ve tıklanamaz. Menünün mevsimle değiştiğini gösteriyor.
- Sayfa sonunda "Bu menüye masa ayır".

### Rezervasyon akışı: `/rezervasyon/`

Yerleşim: masaüstünde solda adımlar, sağda yapışkan sini ve altında metin özeti. Mobilde sini 120 piksellik bir şerit hâlinde üstte, metin özeti onun altında. Aşağıda yapışkan "Devam" çubuğu ve kişi başı toplam.

Diğer rezervasyon demolarından farkı: otel tarih aralığı + oda + fiyat, düğün takvim + paket + teklif üzerine kurulu. Restoran **tek akşam + saat + kişi + menü** ve **özel davet talebi** üzerine kurulu.

**Adım 1. Deneyim ve kişi**
- Görülen: üç deneyim, kat planı küçük resmiyle (kart değil, satır).
  - **Salon**: 1–6 kişi, Sofra 9 tabak ya da Kısa sofra 6 tabak.
  - **Şefin tezgâhı**: 1–4 kişi, tek oturum, 12 tabak.
  - **Özel oda**: 8–14 kişi, talep formuna gider.
- Kişi çipleri 1–6 ve bir "7+" çipi. Seçilince sinide kuverler açılıyor.
- Kenar durumlar:
  - **Tek kişi:** "Yalnız gelenler için tezgâhı öneririz, mutfakla sohbet edersiniz" önerisi çıkıyor, zorlama yok.
  - **Tezgâhta 5+ kişi:** o çipler üstü çizili, yanında "Tezgâh en fazla 4 kişi" notu.
  - **7–14 kişi:** "Bu kadar kalabalık bir grupta yemek salonda bölünür. Size özel oda kuralım" deniyor, özel davet dalına geçiliyor (seçimler taşınıyor).
  - **15+ kişi:** "Evin tamamını kiralama" seçeneği, yine özel davet dalı.
  - **Çocuk:** "Akşam menüsü 12 yaş ve üzeri içindir. Daha küçük misafirler için bizi arayın" notu.

**Adım 2. Akşam (tarih)**
- Görülen: iki aylık takvim. Pazartesi ve Salı "kapalı" olarak soluk. Her günün altında bir doluluk işareti: boş / az kaldı / dolu.
- Gösterilen aralık bugünden ay sonuna kadar. Bir sonraki ay kilitli: "1 Kasım 10.00'da açılır". Doluluk, bugünün tarihine göre her seferinde aynı sonucu veren bir simülasyonla hesaplanıyor (Revak'taki `schedule.ts` kalıbı). Sunucu yok.
- Kenar durumlar:
  - **Dolu gün:** tıklanabilir ama "Bu akşam dolu" yazıyor. Yanında "En yakın boş akşamlar: Prş 8 · Paz 11" çipleri (Mobbin / Tripadvisor kalıbı) ve "Bekleme listesine yazıl" bağlantısı.
  - **Aynı gün:** saat 14.00'ten sonra online rezervasyon kapanıyor, "Bu akşam için bizi arayın" çıkıyor.
  - **Bayram / özel gece:** örneğin 31 Aralık "Yılbaşı sofrası, ayrı menü" etiketiyle gösteriliyor ve özel davete yönlendiriyor.

**Adım 3. Saat ve menü**
- Görülen:
  - **Salon oturumları:** 18.30 · 19.00 (yalnızca Kısa sofra) · 21.00 · 21.30.
  - **Tezgâh:** tek oturum, 19.30.
  - Her saatin altında küçük bir not var, örneğin "son 2 masa" (demo simülasyonu, başarı iddiası değil).
  - Menü seçimi:
    - **Sofra** 9 tabak, yaklaşık 3 saat.
    - **Kısa sofra** 6 tabak, yaklaşık 2 saat, yalnızca 18.30 ve 19.00'da.
    - Tezgâh seçilmişse menü otomatik **Tezgâh menüsü** (12 tabak).
  - İsteğe bağlı **alkolsüz eşleşme** onay kutusu, kişi başı fiyatıyla.
  - Sinide merkezdeki tabak sayısı seçilen menüye göre değişiyor.
- Fiyatlar (hayali, Raşit kararı 3): Sofra 6.500 TL, Kısa sofra 4.800 TL, Tezgâh 8.900 TL, alkolsüz eşleşme 1.900 TL, kişi başı. "KDV dahil, servis ücreti yok."
- Kenar durumlar:
  - **Dolu saat:** üstü çizili, "Bekleme listesi" seçeneği.
  - **Kısa sofra + 21.00 seçimi:** o saat pasif, nedeni yazıyor ("Kısa sofra yalnızca erken oturumda").
  - **Kişi sayısı değişip saat artık uygun değilse:** seçim kaldırılıyor ve açık bir uyarı gösteriliyor, sessizce sıfırlanmıyor.

**Adım 4. Misafir notları**
- Görülen: her kuver için ayrı satır ("1. misafir", "2. misafir" ... ve isteğe bağlı ad). Alerji / diyet çipleri: gluten, süt, **fıstık ve kuruyemiş**, susam, yumurta, kabuklu deniz ürünü, vejetaryen, hamilelik, diğer (serbest metin). Seçilen misafirin sinideki kuverine yeşil bir işaret düşüyor.
- Özel gün: doğum günü, yıl dönümü, iş yemeği, diğer. Tek satır not.
- Erişilebilirlik: "Tekerlekli sandalye: salon ve avlu katı uygun. Tezgâh tabureli ve yüksek."
- Kenar durumlar:
  - **Fıstık / kuruyemiş:** belirgin bir uyarı: "Güz menüsünde 4 tabak fıstık içerir. Size ayrı bir sofra hazırlarız, ancak mutfakta fıstık kullanılır. Ciddi bir alerjiniz varsa lütfen bizi arayın." Bu, şehrin imzası olan malzemeyle dürüst bir yüzleşme ve sitenin gerçekçi görünmesini sağlıyor.
  - **Vegan:** "Menü tam vegan uyarlanamıyor. Sebze ağırlıklı bir alternatif için 72 saat önceden haber verin."
  - **Rezervasyona 48 saatten az kalmışken alerji eklemek:** "Alternatif tabak için bizi arayın" notu.

**Adım 5. İletişim, politika, depozito**
- Görülen: ad soyad, telefon, e-posta. Altında sade bir politika kutusu:
  - **Depozito:** kişi başı 1.500 TL, hesaptan düşülür.
  - **İptal:** 48 saat öncesine kadar ücretsiz. Sonrasında depozito iade edilmez.
  - **Geç kalma:** 20 dakika beklenir.
  - **Kıyafet:** özel bir kural yok.
- Sağda/üstte özet: tarih, saat, deneyim, kişi, menü, eşleşme, toplam ve "Bugün alınacak: depozito".
- **Ödeme yok, kart alanı yok.** Düğme "Depozitoyu öde" yerine **"Ödeme sayfasına geç (konsept)"**. Tıklanınca kısa bir ara ekran çıkıyor: "Gerçek sitede bu adımda bankanın güvenli ödeme sayfası açılır. Bu bir konsept çalışmadır, kart bilgisi istenmez." Ardından onay ekranı.
- Kişisel veriler yalnızca React belleğinde tutuluyor. sessionStorage'a yalnızca kişisel olmayan seçimler (deneyim, kişi, tarih, saat, menü) yazılıyor. Revak'taki `store.tsx` gizlilik kuralı aynen geçerli.
- Kenar durumlar: hatalı telefon/e-posta için satır içi hata mesajı. Politika onayı işaretlenmeden devam edilemiyor.

**Adım 6. Onay**
- Görülen: "Masanız hazır." Sinide kuverler kurulmuş, alerji işaretleri yerinde. Rezervasyon kodu (örnek: KLM-1017-4). Özet. ".ics olarak takvime ekle" (Revak'taki `ics.ts` yeniden kullanılıyor). Haritada adres bağlantısı. "Değişiklik için bize yazın" (konu satırı dolu bir mailto). "48 saat önce hatırlatma göndereceğiz" notu.
- Kenar durum: sayfa yenilenirse kişisel bilgiler silinmiş oluyor, onay ekranı yerine "Rezervasyon özetiniz bu oturumda kaldı" ve yeni rezervasyon bağlantısı çıkıyor.

**Dal: Bekleme listesi** (dolu gün ya da saatten açılır)
- Görülen: tercih edilen akşamlar (en fazla 3) × saat aralığı (erken / geç / fark etmez), kişi sayısı, iletişim. Fresha'daki "tercih ekle" kalıbı. Seçilen günlerde başka boş saat varsa "Bu akşam 21.30 boş, hemen ayırın" önerisi.
- Sonuç: "Listeye eklendiniz. Bir masa boşalırsa sizi önce ararız" (sahte; hiçbir şey gönderilmez).

**Dal: Özel davet** (`/ozel-davet/`, 7+ kişi ya da kat planından açılır)
- Görülen: vesile (iş yemeği, kutlama, nişan sofrası, lansman), kişi (8–14 özel oda, 15–34 evin tamamı), tercih edilen tarihler (esnek), menü isteği (şefle birlikte menü yazma, alkolsüz eşleşme), bütçe aralığı, not.
- Sonuç: "Talebinizi aldık. Etkinlik ekibimiz bir iş günü içinde size döner" mesajı ve aynı bilgilerle hazırlanmış bir **mailto** bağlantısı. Bu bir teklif oluşturucu değil (düğün demosundan farkı bu), bir talep formu.

---

## 5. İmza etkileşimin teknik tarifi

**Seçim: CSS/SVG + GSAP (ScrollTrigger, Flip). three.js / R3F yok.**

Neden: sini düz, tepeden görünen bir nesne. Gerçek 3D'ye ihtiyacı yok. Parıltıyı katmanlı gradyanlarla, tabak servisini dönüşüm animasyonlarıyla (transform) yapmak, WebGL'in getireceği yaklaşık 150–200 KB'lık yükü ve mobil pil maliyetini ortadan kaldırıyor. Onikitaş'ta masaüstü JS 539 KB olmuştu, bu sefer o hatayı tekrarlamıyoruz. Framer Motion bu demoda kullanılmayacak. Tek animasyon dili GSAP olacak, böylece iki kütüphane birden yüklenmiyor.

**Bileşen: `<Sini state={...} />`** (ana sayfa ve rezervasyonda aynı bileşen)
1. **Bakır disk:** tepeden bakır sini görseli (AVIF/WebP, 1200 px, yaklaşık 90 KB).
2. **Parıltı katmanı:** `radial-gradient(at var(--lx) var(--ly), ...)` ile `mix-blend-mode: overlay`. İmleç hareket ettikçe `--lx/--ly` her karede (requestAnimationFrame) güncelleniyor. Mobilde parıltı kaydırma ilerlemesine bağlı, jiroskop izni istenmiyor.
3. **Kazıma halkası:** SVG `textPath` ile sini kenarına Young Serif küçük harflerle mevsimin ürünleri yazılıyor. İlk görünüşte "kalemle kazınıyor" gibi açılıyor (`stroke-dashoffset`, bir kez).
4. **Tabak katmanı:** daire kırpılmış tabak fotoğrafları. Kuver katmanı SVG (küçük tabak, peçete, çatal-bıçak çizgisi). Yerleşim kutupsal koordinatla hesaplanıyor: n kişi için 360/n derece aralıkla.
5. **Ana sayfadaki servis:** ScrollTrigger bölümü sabitliyor (`pin`) ve 9 adıma kilitliyor (`snap`). Animasyon kaydırmayla birebir ilerlemiyor: her adımda bir GSAP zaman çizelgesi oynuyor. Yeni tabak sağ üstten (garsonun geldiği yönden) hafif dönüşle ve gölgesi büyüyerek konuyor, öncekisi kayarak kalkıyor. Böylece hissedilen şey "video ileri sarmak" değil, "servis". "Sonraki tabak" düğmesi ve ok tuşlarıyla da ilerletilebiliyor.
6. **Rezervasyondaki dönüşümler:** kişi sayısı değişince kuverler GSAP Flip ile yeni yerlerine kayıyor. **Tezgâh seçilince** yuvarlak sini Flip ile uzun yuvarlatılmış bir dikdörtgene, kuverler tek sıraya dönüşüyor: sitenin tek "vay" anı. Özel odada sini büyüyor ve 8–14 kuver açılıyor.
7. **Erişilebilirlik:** sini `aria-hidden`. Aynı bilgi, `aria-live="polite"` olan bir metin özetinde ("4 kişi · Cuma 9 Ekim · 21.00 · Sofra · 1 alerji notu"). Her adım değişiminde odak, adım başlığına taşınıyor (Revak'taki flow `kit.tsx` kalıbı).

**Performans bütçesi** (gzip'li aktarım boyutu)

| Kalem | Tahmin |
|---|---|
| Next + React çalışma zamanı (ortak) | ~95 KB |
| GSAP çekirdek + ScrollTrigger + Flip | ~45 KB |
| Lenis (yumuşak kaydırma) | ~4 KB |
| Sayfa kodu (sini, akış, içerik) | ~40–60 KB |
| **Toplam mobil JS hedefi** | **≤ 220 KB** (üst sınır 300 KB) |
| Görsel, ilk ekran | ≤ 350 KB (sini + ilk 2 tabak önden yükleniyor, gerisi tembel yükleme) |

Kurallar:
- Yalnızca `transform` ve `opacity` canlandırılıyor.
- `will-change` yalnızca animasyon sırasında açık.
- Sini ekran dışındayken parıltı döngüsü duruyor (IntersectionObserver).
- Tabak görselleri animasyondan önce `decode()` ile çözülüyor.
- Ölçüm her zaman `next build` çıktısı ve Lighthouse mobil ile yapılıyor.

**prefers-reduced-motion yedeği** (`gsap.matchMedia`)
- Sini dönmüyor, parıltı sabit, kazıma halkası doğrudan görünüyor.
- Servis bölümü sabitlenmiyor. 9 tabak, sabit bir ızgara ve liste olarak görünüyor. Bilgi aynı, yalnızca hareket yok.
- Rezervasyonda Flip yerine anlık geçiş ve kısa bir saydamlık geçişi (yaklaşık 120 ms). Tezgâh dönüşümü animasyonsuz.

---

## 6. Ana sayfa için örnek TR metinler (Raşit onayına)

Dil kuralı: somut fayda, doğal söz dizimi. Sitenin nasıl çalıştığını anlatma yok, süs amaçlı teknik veri yok.

| Yer | Öneri | Alternatif |
|---|---|---|
| Başlık | **Antep'in sofrası, dokuz tabakta.** | Bakır sinide, bu mevsimin Antep'i. |
| Alt başlık | Her mevsim tek bir akşam menüsü yazıyoruz. Bu güz sofrada Nizip'in yeni zeytinyağı, Araban'ın fıstığı ve bahçeden son patlıcanlar var. | Şef Nesrin Ekinci, yöre üreticilerinden gelen ürünle her mevsim yeni bir menü hazırlıyor. |
| Satır 1 | Her akşam tek menü: dokuz tabak, üç saat, on bir masa. | |
| Satır 2 | Menü mevsimle değişir. Bir ürün tarladan kalkınca sofradan da kalkar. | |
| Satır 3 | Şefin tezgâhında sekiz kişi, mutfağın tam karşısında oturur. Her tabağı onu hazırlayan elden alırsınız. | |
| Satır 4 | Fıstık bu şehrin imzası. Alerjiniz varsa önceden söyleyin, size ayrı bir sofra kuralım. | |
| Satır 5 | Özel odamız on dört kişiyi ağırlar. İş yemeği, nişan sofrası, sessiz bir kutlama: menüyü birlikte yazalım. | |
| Satır 6 | Rezervasyonlar her ayın ilk günü, bir sonraki ay için açılır. | |
| Ana eylem | **Masanızı ayırın** | Akşamınızı seçin |

Kontrol edilecek nokta: Nizip zeytinyağı ve Araban fıstığı yöreyle doğru eşleşiyor mu, yapımdan önce bir kez doğrulanacak. Deprem bölgesine (İslahiye, Nurdağı) ait yer adları ürün kaynağı olarak **kullanılmayacak**, bkz. Bölüm 9.

---

## 7. Görsel ihtiyaç listesi

Kaynak önceliği **Pexels** (Revak'ta lisansı yapılandırılmış veriden doğrulanabildi; Unsplash sayfaları bot kontrolüne takılıyordu). Her kare `content/kalemkar/credits.ts` dosyasına yazar, başlık, URL ve lisansla girer. İşleme için `scripts/process-kalemkar-images.mjs` (sharp ile daire kırpma, renk eşitleme, AVIF/WebP) kullanılacak.

| # | Kare | Kullanım | Not |
|---|---|---|---|
| 1 | Tepeden boş bakır sini / tepsi | İmza nesnesi | Temiz bir tepeden çekim bulunamazsa **Blender'da üretilecek** (Poly Haven CC0 dövme bakır dokusu, tepeden ortografik kamera). En kontrollü yol bu. |
| 2–10 | Tepeden tabak fotoğrafları, 9 tabak (+3 yedek): patlıcan, yoğurtlu çorba (yuvalama benzeri), içli köfte, firik pilavı, kuzu, ızgara sebze, otlu salata, katmer / fıstıklı tatlı, kaymak-meyve | Servis sekansı ve menü sayfası | Daire kırpmaya uygun, tabak kadrajın ortasında olmalı. Koyu ya da nötr zemin tercih edilecek. Renk eşitleme betikte yapılacak. |
| 11 | Şefin elleri, cımbızla servis (yüz yok ya da arkadan) | Şef bölümü | |
| 12 | Bakır kazıma / çekiç detayı (Bakırcılar Çarşısı havası) | Şef hikâyesi | |
| 13 | Taş ev avlusu, kemerler | Ev bölümü | "Gaziantep old house courtyard" ya da benzeri bir Anadolu taş avlusu |
| 14 | Kubbeli taş oda / kiler | Özel oda | |
| 15 | Ocak / köz / mutfak ateşi | Tezgâh deneyimi | |
| 16 | Fıstık hasadı ya da yakın çekim fıstık | Menü / kaynak | |
| 17 | Kurutulmuş biber dizileri, zeytin, bakliyat | Menü sayfası dokusu | |
| 18 | Mum ışığında masa detayı (insan yüzü yok) | Rezervasyon onayı arka planı | |

Yasaklar: **alkol görseli yok** (kadeh, şişe), aile/finans içerikli kare yok (ana site kuralı), tanınabilir yüzlü "mutlu müşteri" karesi yok.

Logo: yalnızca yazı ("KALEMKÂR", Young Serif). İsteğe bağlı olarak sini kenarındaki kazıma halkasından türetilen küçük bir simge (SVG), favicon için.

---

## 8. Referans listesi

Kod, metin ya da marka varlığı kopyalanmayacak. Yalnızca fikir alınıyor.

**Awwwards** (arama 2026-10-03; FWA ve SiteInspire aramalarında kullanılabilir bir restoran sonucu çıkmadı)

| # | Site | Tanınma | Aldığımız tek fikir |
|---|---|---|---|
| 1 | [Quay](https://www.awwwards.com/sites/quay-restaurant) (quay.com.au, Pollen) | SOTD, 2014 | Tabak fotoğrafını kahraman yapmak ve az renkle yetinmek. |
| 2 | [Restaurant Zimmerl](https://www.awwwards.com/sites/restaurant-zimmerl) (Georg Ertl, GSAP) | Honorable Mention, 2025 | Koyu kömür + sıcak ten tonu ikilisinin ölçülü kullanımı; fine-dining sadeliği. |
| 3 | [AKANEYA](https://www.awwwards.com/sites/akaneya) (Firma, GSAP) | Honorable Mention, 2025 | Köz / ateş anlatısını editoryal fotoğraf ritmiyle anlatmak. |
| 4 | [Restaurant Passionne Paris](https://www.awwwards.com/sites/restaurant-passionne-paris) (Boite à Oeufs) | Honorable Mention, 2023 | Restoranı şefin adı ve hikâyesiyle öne çıkarmak. |
| 5 | [Onyx Restaurant Paris](https://www.awwwards.com/sites/onyx-restaurant-paris) (Boite à Oeufs, Three.js) | Nominee, 2025 | Menüyü durağan bir liste yerine animasyonlu bir bölüm olarak sunmak (biz WebGL'siz yapıyoruz). |
| 6 | [Tastavents](https://www.awwwards.com/sites/tastavents-restaurant) | Honorable Mention, 2024 | Rezervasyonu anlatının içine gömmek, ayrı bir sayfaya sürgün etmemek. |
| 7 | [Qissa](https://www.awwwards.com/sites/qissa-a-tale-of-food) (Red Dash Media) | Nominee, 2026 | Ana sayfa kurgusunun "hikâye → imza tabaklar → ayrılmış masa" diye bitmesi. |
| 8 | [Hio Fine Dining](https://www.awwwards.com/sites/hio-fine-dining) (hantha.) | Honorable Mention, 2023 | Ürünün geldiği tarlayı / üreticiyi tabakla birlikte yazmak. |
| 9 | [Amrit Palace, menü kaydırma](https://www.awwwards.com/inspiration/restaurant-menu-scroll-amrit-palace) (GSAP + Webflow) | Awwwards ilham öğesi | Menüyü kaydırmayla tabak tabak açan etkileşim (servis sekansına ilham). |

**Mobbin, rezervasyon ekran kalıpları** (Mobbin MCP çalıştı)

| Uygulama | Kalıp | Nerede kullanıyoruz |
|---|---|---|
| [Airbnb, hizmet rezervasyonu](https://mobbin.com/flows/da3b6a13-e25f-48f6-a479-8e1601ad48b7) | Kişi sayacı + gün şeridi + saat çipi ızgarası + yapışkan toplam ve "İleri" | Adım 1–3 iskeleti |
| [Tripadvisor, tur rezervasyonu](https://mobbin.com/flows/6c4e0750-7b17-4c42-a149-d82f072f5d5a) | "Bu tarih uygun değil → en yakın boş tarihler" çipleri; özet panelinde ücretsiz iptal son tarihi | Dolu gün kenar durumu, Adım 5 özeti |
| [Places, müsaitlik](https://mobbin.com/screens/8177ef09-ff01-4e36-930c-c111037ee9be) | Uygun olmayan kişi sayılarının üstü çizili; günlük "masa yok" etiketi | Tezgâhta 5+ kişi, takvim doluluğu |
| [Fresha, bekleme listesi](https://mobbin.com/screens/f0d70080-560a-45b4-92d0-36b906228356) | Birden fazla tercih tarihi + saat aralığı; "seçtiğin günde boş yer var" uyarısı | Bekleme listesi dalı |
| [Deliveroo (Dishoom), masa](https://mobbin.com/screens/a5bf982b-7d2d-4726-a3c2-80e0ca3be55d) | Takvimde boş günler renkli; saatler servise göre gruplu | Salon oturumlarını gruplamak |
| [Grab, masa bul](https://mobbin.com/screens/0f72e22f-5943-4a13-9d89-458261522ea3) | Yetişkin çipleri + hafta şeridi + saat aralığı | Mobil düzen |

Fine-dining sektör kalıpları (genel bilgi): ön ödemeli/depozitolu tadım menüsü (Tock modeli), aylık rezervasyon açılışı, alerji ve diyet notu, bekleme listesi, mevsimlik menü değişimi, 12 yaş sınırı, geç kalma süresi.

---

## 9. Riskler ve açık kararlar

### Riskler

| Risk | Önlem |
|---|---|
| **Alkol:** Türkiye'de alkollü içkinin internetten satışı ve reklamı yasak / sınırlı (4250 sayılı Kanun'da 2013 değişiklikleri, TAPDK düzenlemeleri). | Şarap eşleşmesi satılmıyor, fiyatı ve görseli yok, şarap adı geçmiyor. Yalnızca "masada sommelier'nizle konuşabilirsiniz" notu var. Satılan eşleşme **alkolsüz** eşleşme. Bu bir konsept önlemi, hukuki görüş değil. Gerçek bir müşteriye uyarlanırken avukata danışılmalı. |
| **Deprem hassasiyeti:** Gaziantep bölgesi 2023 depreminden etkilendi. | Metinlerde deprem, "yeniden doğuş" söylemi ya da İslahiye/Nurdağı gibi yer adları kullanılmıyor. Şefin dönüşü tarihsiz anlatılıyor. |
| **Sahte ödeme hissi:** kart alanı oltalama (phishing) gibi algılanabilir ya da gerçek ödeme sanılabilir. | Kart alanı hiç yok. Konsept ara ekranı açıkça "kart bilgisi istenmez" diyor. |
| **Ad çakışması** | "Kalemkâr" için Gaziantep'te restoran bulunamadı. Şef adı yapım öncesi kontrol edilecek. |
| **Görsel tutarlılığı:** tepeden tabak kareleri farklı ışıkta. | Daire kırpma + renk eşitleme betiği. Sini görseli için Blender yedeği. Bulunamayan tabak menüden çıkarılır, menü görsele göre yazılır. |
| **Uydurma iddia** | Michelin, yıldız, ödül, puan ya da yorum yok. "Son 2 masa" yalnızca demo simülasyonu. Kapasite bilgisi başarı iddiası değil. |
| **Revak'a benzeme** (GSAP ile sabitlenen bölüm) | Servis kaydırmayla birebir ilerlemiyor, tek tek adımlarla oynuyor. Asıl imza rezervasyondaki durum nesnesi. Zaman/ışık metaforu yok. |
| **Mobilde sini yer kaplar** | Rezervasyonda 120 piksellik şerit + metin özeti. Ana sayfada 80vw genişlik, metin altta. |

### Raşit'e sorulacak açık kararlar (en fazla 3)

1. **Marka ve konum:** Kalemkâr · Gaziantep (önerilen) / Tüf · Ürgüp / Tezgâh · Karaköy. Hangisi?
2. **Sanat yönü:** A "Sini" (koyu is + fıstık yeşili, bakır sini rezervasyonda masaya dönüşüyor, WebGL yok, önerilen) / B "Köz" (WebGL köz efekti, daha gösterişli ama süs olarak kalma riski var). Hangisi?
3. **Fiyat görünürlüğü:** menü fiyatı ve depozito sitede açıkça yazsın mı (fine-dining standardı, daha gerçekçi, önerilen), yoksa "fiyat için bize ulaşın" mı?

Kendi aldığım ucuz kararlar: Revak'taki yardımcılar (`ics.ts`, takvim mantığı, akış adımları, şerit) ortak klasöre çıkarılmıyor, `lib/kalemkar`'a **kopyalanıp uyarlanıyor**. Böylece canlıdaki Revak'ı bozma riski yok. Framer Motion bu demoda kullanılmıyor. Şef kadın.

---

## 10. Yapım adımları

0. **Onay:** Raşit üç açık kararı ve Bölüm 6'daki TR metin taslağını onaylar.
1. **Yazı ve renk doğrulaması:** Young Serif ve Geologica'da Türkçe karakter testi, `#9DB26A` / `#17130F` kontrast ölçümü. Şef adı ve marka adı için son çakışma araması.
2. **Görseller:** Pexels'ten aday kareler (lisans her karenin sayfasından doğrulanacak). Gerekirse Blender'da sini. `scripts/process-kalemkar-images.mjs` ile daire kırpma, renk eşitleme, AVIF/WebP. `content/kalemkar/credits.ts`.
3. **İskelet:** `app/kalemkar/layout.tsx` (noindex, konsept şeridi, `next/font` ile fontlar, tema rengi `#17130F`). `content/kalemkar/tr.ts` (bütün metinler), `content/kalemkar/menu.ts` (tabaklar, alerjenler, üreticiler), `lib/kalemkar/availability.ts` (bugüne göre her seferinde aynı sonucu veren doluluk, kapalı günler, aylık açılış), `lib/kalemkar/store.tsx` (kişisel olmayan seçimler sessionStorage'da).
4. **Sini bileşeni:** disk, parıltı, kazıma halkası, kuver yerleşimi, alerji işareti, tezgâh ve özel oda dönüşümleri (Flip), hareket azaltma yedeği. Önce tek başına bir test sayfasında doğrulanacak.
5. **Rezervasyon akışı:** 6 adım + bekleme listesi + özel davet dalı. Bölüm 4'teki bütün kenar durumlar. Konsept ödeme ara ekranı. `.ics` ve mailto. Klavye ve odak yönetimi.
6. **Ana sayfa:** giriş + satır içi rezervasyon cümlesi, servis sekansı (ScrollTrigger sabitleme ve adım kilidi), şef, ev + tıklanabilir kat planı, bilmeniz gerekenler, aylık açılış, alt bilgi. Mobilde alt çubuk.
7. **Menü sayfası:** güz sofrası, alerjen tablosu, kısa sofra / tezgâh farkı, alkolsüz eşleşme notu, kaynak haritası, geçmiş mevsim arşivi.
8. **Cila ve ölçüm:** `npm run lint` + `npm run build` (JS boyutu tabloya), Lighthouse mobil, 375 px ve 1280×720 kontrolü, ekran okuyucu ve klavye turu, hareket azaltma modu. `top-design` / `taste-skill` ve `web-design-guidelines` denetimi. "AI görünümü" kontrol listesi (ortalanmış hero, üç eş kart, gradyan yok).
9. **Metin onayı ve yayın:** TR metin tablosu Raşit'e → onay sonrası EN (doğal İngilizce). `npm run sync:site` → rasitburucu.com'da deste kartı (yazilim, `/web/kalemkar/`) → ana sitenin yayın adımları (lint + build → preview → **Raşit onayı** → deploy → canlı kontrol).
