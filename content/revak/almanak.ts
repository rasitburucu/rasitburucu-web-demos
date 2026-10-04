// Almanak: 2026-2027 akademik takvimi (/revak/almanak/). Metinler Raşit onayı bekliyor (2026-10-04).
// "resmi" ve "donem" satırları kamuya açık takvimden alındı: MEB 2026-2027 çalışma takvimi
// (ders yılı 14 Eylül 2026 - 25 Haziran 2027, ara tatiller 16-20 Kasım ve 8-12 Mart, yarıyıl 25 Ocak - 5 Şubat)
// ve resmî tatiller (dinî bayramlar Diyanet takvimine göre: Ramazan Bayramı 9-11 Mart 2027,
// Kurban Bayramı 16-19 Mayıs 2027). Okula ait bütün satırlar örnektir ve sayfada mühürlenir.

import type { Kademe } from "@/lib/revak/store";

export type AlmanakKind = "resmi" | "donem" | "okul" | "veli" | "sinav" | "kabul";

export type AlmanakItem = {
  id: string;
  start: string; // YYYY-MM-DD
  end?: string; // inclusive
  title: string;
  note?: string;
  kind: AlmanakKind;
  /** omitted: every level */
  levels?: Kademe[];
  /** half day from 13.00 (arife) */
  half?: boolean;
};

export const almanak = {
  metaTitle: "Almanak: 2026-2027 akademik takvim | Revak Okulları",
  crumb: "Almanak",
  title: "Almanak 2026-2027",
  intro:
    "Okulun bir yılı, ay ay. Resmî tatiller ve dönem tarihleri Millî Eğitim Bakanlığı takviminden; veli görüşmeleri, sınavlar ve etkinlikler okulun kendi takviminden. Her satırı ya da süzdüğünüz bütün yılı telefonunuzun takvimine ekleyebilirsiniz.",
  filtersLabel: "Takvimi süzün",
  levelLabel: "Kademe",
  levelAll: "Bütün kademeler",
  kindLabel: "Tür",
  kindAll: "Hepsi",
  kinds: {
    resmi: "Resmî tatil",
    donem: "Dönem",
    okul: "Okul etkinliği",
    veli: "Veli",
    sinav: "Sınav ve değerlendirme",
    kabul: "Kabul",
  } as Record<AlmanakKind, string>,
  today: "Bugün",
  addOne: "Takvime ekleyin",
  addAll: (n: number) => `Süzülen ${n} satırı takvime ekleyin`,
  empty: "Bu süzgeçle eşleşen satır yok.",
  half: "13.00'ten sonra",
  official: "Resmî takvim",
  icsSample: "Örnek: okula ait tarih",
  sourceNote:
    "Kaynak: MEB 2026-2027 eğitim öğretim yılı çalışma takvimi; dinî bayram tarihleri Diyanet İşleri Başkanlığı takvimine göre. Resmî tarihler değişirse bu sayfa güncellenir. Okula ait tarihler örnektir.",
  icsFile: "revak-almanak-2026-2027.ics",
  levelsShort: { anaokulu: "Anaokulu", ilkokul: "İlkokul", ortaokul: "Ortaokul", lise: "Lise" } as Record<Kademe, string>,
  items: [
    { id: "tanisma-ana", start: "2026-09-03", title: "Anaokulu tanışma saatleri", note: "Çocuk ve veli, sınıf ve öğretmenlerle bir saat.", kind: "okul", levels: ["anaokulu"] },
    { id: "uyum", start: "2026-09-07", end: "2026-09-11", title: "Uyum haftası", note: "Okul öncesi ve 1. sınıf için kısa günler.", kind: "donem", levels: ["anaokulu", "ilkokul"] },
    { id: "acilis", start: "2026-09-14", title: "Ders yılı başlar", kind: "donem" },
    { id: "tatbikat-1", start: "2026-09-24", title: "Deprem tatbikatı", note: "Velilere toplu mesaj provası da yapılır.", kind: "okul" },
    { id: "veli-toplanti", start: "2026-09-29", title: "İlk veli toplantısı", note: "Sınıf veli temsilcisi seçilir.", kind: "veli" },
    { id: "acik-kapi", start: "2026-10-10", title: "Açık Kapı Günü", note: "10.00-13.00, kayıt gerekmez.", kind: "kabul" },
    { id: "seminer-ekran", start: "2026-10-21", title: "Veli semineri: ergenlikte ekran ve uyku", note: "Çevrim içi, 19.00.", kind: "veli", levels: ["ortaokul", "lise"] },
    { id: "cumhuriyet-arife", start: "2026-10-28", title: "Cumhuriyet Bayramı arifesi", kind: "resmi", half: true },
    { id: "cumhuriyet", start: "2026-10-29", title: "Cumhuriyet Bayramı", kind: "resmi" },
    { id: "lise-tanitim", start: "2026-11-04", title: "Lise ve diploma programı tanıtım toplantısı", note: "Çevrim içi, 18.30.", kind: "kabul", levels: ["ortaokul", "lise"] },
    { id: "burs-son", start: "2026-11-11", title: "Bursluluk sınavı son başvuru", kind: "kabul", levels: ["ilkokul", "ortaokul", "lise"] },
    { id: "rapor-1", start: "2026-11-13", title: "Birinci gelişim raporu", kind: "sinav" },
    { id: "burs", start: "2026-11-15", title: "Bursluluk sınavı", note: "4-11. sınıf öğrencileri için.", kind: "kabul", levels: ["ilkokul", "ortaokul", "lise"] },
    { id: "ara-1", start: "2026-11-16", end: "2026-11-20", title: "Birinci dönem ara tatili", kind: "donem" },
    { id: "oyun-1", start: "2026-11-16", end: "2026-11-20", title: "Anaokulu oyun haftası", note: "Ara tatilde isteğe bağlı, 08.30-15.30.", kind: "okul", levels: ["anaokulu"] },
    { id: "gorusme-1", start: "2026-11-23", end: "2026-11-27", title: "Veli görüşme haftası", note: "Gelişim raporu üzerine yüz yüze.", kind: "veli" },
    { id: "kesin-kayit", start: "2026-12-01", title: "2027-2028 kesin kayıtları başlar", kind: "kabul" },
    { id: "deneme-1", start: "2026-12-07", end: "2026-12-11", title: "Deneme sınavı haftası", kind: "sinav", levels: ["ortaokul", "lise"] },
    { id: "kis-konseri", start: "2026-12-18", title: "Kış konseri", note: "Revak Sahnesi, 19.30.", kind: "okul" },
    { id: "yilbasi", start: "2027-01-01", title: "Yılbaşı", kind: "resmi" },
    { id: "karne-1", start: "2027-01-22", title: "Birinci dönem sonu, karne", note: "Yanında danışman mektubu.", kind: "donem" },
    { id: "yariyil", start: "2027-01-25", end: "2027-02-05", title: "Yarıyıl tatili", kind: "donem" },
    { id: "donem-2", start: "2027-02-08", title: "İkinci dönem başlar", kind: "donem" },
    { id: "tatbikat-2", start: "2027-02-18", title: "Yangın tatbikatı", kind: "okul" },
    { id: "ramazan-arife", start: "2027-03-08", title: "Ramazan Bayramı arifesi", kind: "resmi", half: true },
    { id: "ara-2", start: "2027-03-08", end: "2027-03-12", title: "İkinci dönem ara tatili", kind: "donem" },
    { id: "ramazan", start: "2027-03-09", end: "2027-03-11", title: "Ramazan Bayramı", kind: "resmi" },
    { id: "erken-kayit", start: "2027-03-15", title: "Erken kayıt indirimi sona erer", kind: "kabul" },
    { id: "deneme-2", start: "2027-03-22", end: "2027-03-26", title: "Deneme sınavı haftası", kind: "sinav", levels: ["ortaokul", "lise"] },
    { id: "rapor-2", start: "2027-04-09", title: "İkinci gelişim raporu", kind: "sinav" },
    { id: "gorusme-2", start: "2027-04-12", end: "2027-04-16", title: "Veli görüşme haftası", kind: "veli" },
    { id: "cocuk-bayrami", start: "2027-04-23", title: "Ulusal Egemenlik ve Çocuk Bayramı", kind: "resmi" },
    { id: "tatbikat-3", start: "2027-04-28", title: "Deprem tatbikatı", kind: "okul" },
    { id: "emek", start: "2027-05-01", title: "Emek ve Dayanışma Günü", kind: "resmi" },
    { id: "bahar", start: "2027-05-08", title: "Bahar şenliği", note: "Aileler davetli, 11.00-16.00.", kind: "okul" },
    { id: "deneme-3", start: "2027-05-10", end: "2027-05-14", title: "Deneme sınavı haftası", kind: "sinav", levels: ["ortaokul", "lise"] },
    { id: "kurban-arife", start: "2027-05-15", title: "Kurban Bayramı arifesi", kind: "resmi", half: true },
    { id: "kurban", start: "2027-05-16", end: "2027-05-19", title: "Kurban Bayramı", kind: "resmi" },
    { id: "genclik", start: "2027-05-19", title: "Atatürk'ü Anma, Gençlik ve Spor Bayramı", kind: "resmi" },
    { id: "portfolyo", start: "2027-06-04", title: "Portfolyo sergisi", note: "Öğrenciler işlerini velilerine anlatır.", kind: "okul" },
    { id: "mezuniyet", start: "2027-06-18", title: "Mezuniyet töreni", note: "12. sınıf, Revak Sahnesi.", kind: "okul", levels: ["lise"] },
    { id: "karne-2", start: "2027-06-25", title: "Ders yılı sonu, karne", kind: "donem" },
    { id: "yaz-okulu", start: "2027-06-28", end: "2027-07-23", title: "Yaz okulu", note: "İsteğe bağlı; anaokulu ve ilkokul.", kind: "okul", levels: ["anaokulu", "ilkokul"] },
  ] as AlmanakItem[],
};
