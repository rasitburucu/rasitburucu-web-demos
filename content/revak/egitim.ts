// "Nasıl öğretir, nasıl ölçeriz" (/revak/egitim/). Metinler Raşit onayı bekliyor (2026-10-04).
// Başarı rakamı yok; yöntem ve takvim var. Gelişim raporu kurgusal ve isimsizdir.

import type { Kademe } from "@/lib/revak/store";

export const egitim = {
  metaTitle: "Nasıl öğretir, nasıl ölçeriz | Revak Okulları",
  crumb: "Eğitim",
  title: "Nasıl öğretir, nasıl ölçeriz.",
  intro:
    "Başarı listesi yayımlamıyoruz. Onun yerine yöntemimizi yazıyoruz: derste ne yapılır, çocuğun ilerlemesi neyle ölçülür, siz bunu ne zaman ve nasıl öğrenirsiniz.",

  levelsTitle: "Dört kademe, dört saat",
  levelsNote: "Revak boyunca ışık sabahtan akşama döner; her kademe günün bir saatinde durur.",

  principlesTitle: "Altı ilke ve sınıftaki karşılığı",
  principles: [
    { line: "Önce soru gelir.", practice: "Fen dersi bir deneyle değil, bir soruyla açılır. Öğrenci tahminini deftere yazar; deneyden sonra kendi tahminine geri döner." },
    { line: "Hata defterde kalır.", practice: "Yanlış çözüm silinmez, yanına düzeltme notu yazılır. Öğretmen dönem sonunda bu notlara bakarak çocuğun nerede takıldığını görür." },
    { line: "Herkes söz alır.", practice: "5. sınıftan itibaren her öğrenci her hafta bir şey sunar: bir deney, bir kitap, bir proje. Anaokulunda bu, sabah halkasında bir şey anlatmaktır." },
    { line: "Ödevin bir amacı yazar.", practice: "Her ödevin neden verildiği ajandada yazar. Kademe başına süre sınırı var; aşılırsa öğretmene haber vermeniz yeterli." },
    { line: "Sanat ve spor ders saatindedir.", practice: "Her gün bir saat müzik, görsel sanatlar ya da spor. Kulüpler bunun üstüne gelir, yerine değil." },
    { line: "Her çocuğu bir yetişkin tanır.", practice: "Her öğrencinin bir danışmanı var. Danışman haftada bir öğrenciyle, ayda bir veliyle konuşur; bir sorun çıkmasını beklemeden." },
  ],

  measureTitle: "Bir yılda neyi, ne zaman ölçeriz",
  measureIntro: "Rakam vermiyoruz, takvimi veriyoruz. Çizelge bir öğretim yılını eylülden hazirana gösterir.",
  months: ["Eyl", "Eki", "Kas", "Ara", "Oca", "Şub", "Mar", "Nis", "May", "Haz"],
  monthsLong: ["Eylül", "Ekim", "Kasım", "Aralık", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
  measureLevelsLabel: "Kademeler",
  measure: [
    {
      name: "Tanıma haftası",
      text: "Her derste kısa, notsuz bir başlangıç çalışması. Amaç, çocuğun nereden başladığını görmek.",
      months: [0],
      levels: ["anaokulu", "ilkokul", "ortaokul", "lise"] as Kademe[],
    },
    {
      name: "Ünite sonu çalışması",
      text: "Her ünitenin sonunda yirmi dakikalık kısa bir çalışma. Sonuç öğrenciye not olarak değil, yazılı geri bildirim olarak döner.",
      months: [1, 2, 3, 5, 6, 7, 8],
      levels: ["ilkokul", "ortaokul", "lise"] as Kademe[],
    },
    {
      name: "Gelişim raporu",
      text: "Dönemde bir kez: her ders için iki-üç cümle ve çocuğun kendi değerlendirmesi. Karneden önce gelir; ardından veli görüşmesi yapılır.",
      months: [2, 7],
      levels: ["anaokulu", "ilkokul", "ortaokul", "lise"] as Kademe[],
    },
    {
      name: "Deneme sınavı",
      text: "Ortaokulun son iki yılında ve lisede yılda altı deneme. Sonuç sıralama olarak değil, konu konu geri bildirim olarak döner.",
      months: [3, 6, 8],
      levels: ["ortaokul", "lise"] as Kademe[],
    },
    {
      name: "Karne ve danışman mektubu",
      text: "Ulusal programın karnesi ve yanında danışmanın bir sayfalık mektubu. Anaokulunda karne yerine gelişim dosyası verilir.",
      months: [4, 9],
      levels: ["anaokulu", "ilkokul", "ortaokul", "lise"] as Kademe[],
    },
    {
      name: "Portfolyo sergisi",
      text: "Yılın işleri bir sınıfta sergilenir; öğrenci velisine işini kendisi anlatır.",
      months: [9],
      levels: ["anaokulu", "ilkokul", "ortaokul", "lise"] as Kademe[],
    },
  ],

  reportTitle: "Bir gelişim raporu nasıl görünür",
  reportIntro: "Kasım ayında gelen raporun bir örneği. Öğrenci kurgusal, notlar örnektir.",
  reportOpen: "Raporun tamamını açın",
  reportClose: "Raporu kapatın",
  report: {
    school: "Revak Okulları · Gelişim raporu",
    student: "Öğrenci: E. (kurgusal)",
    grade: "3. sınıf",
    term: "1. dönem, Kasım",
    head: ["Ders", "Gözlem", "Sonraki adım"],
    rows: [
      ["Türkçe", "Sesli okumada akıcı. Okuduğunu anlatırken olayların sırasını karıştırıyor.", "Hikâyeyi üç resimle anlatma çalışması."],
      ["Matematik", "Çarpmayı ezberden değil, gruplayarak yapıyor. Yavaş ama doğru.", "Hız için zorlamıyoruz; ünite sonunda yeniden bakacağız."],
      ["İngilizce", "Konuşma grubunda söz alıyor; yazarken Türkçe cümle düzenini kullanıyor.", "Kısa günlük: haftada üç cümle."],
      ["Fen bilimleri", "Tahminini yazmadan deneye başlamak istiyor.", "Deney defterinde önce tahmin sütunu."],
      ["Sınıf hayatı", "Oyunlarda kural koymayı seviyor; kaybettiğinde toparlanması zaman alıyor.", "Danışman saatinde konuşuldu; veliyle birlikte izliyoruz."],
    ],
    selfTitle: "Öğrencinin kendi notu",
    self: "En çok seramik atölyesini seviyorum. Bölme zor ama gruplayınca oluyor.",
    sign: "Danışman parafı",
  },

  informTitle: "Size nasıl haber veririz",
  inform: [
    { when: "Her hafta", text: "Danışman öğrenciyle birebir görüşür. Önemli bir şey varsa aynı gün sizi arar." },
    { when: "Her ay", text: "Danışman sizi arar. On dakika; nottan önce çocuğun nasıl olduğunu konuşursunuz." },
    { when: "Her dönem", text: "İki yüz yüze görüşme: biri gelişim raporundan sonra, biri karneden önce." },
    { when: "Her gün", text: "Veli uygulamasından öğretmene yazabilirsiniz; cevap en geç iki iş günü içinde gelir." },
  ],

  homeworkTitle: "Ödev ve ekran",
  homeworkIntro: "Kademe başına üst sınırlar. Sınır aşılırsa öğretmene haber vermeniz yeterli; ödev kısaltılır.",
  homeworkHead: ["Kademe", "Günlük ödev", "Hafta sonu", "Cihaz kuralı"],
  homework: [
    ["Anaokulu", "Ödev yok", "Yok", "Okulda ekran yok; müzik ve hikâye dışında"],
    ["İlkokul", "1-2. sınıf 20 dk, 3-4. sınıf 30 dk", "Yok", "Telefon okula getirilmez; tabletler sınıfta kalır"],
    ["Ortaokul", "En fazla 45 dk", "Yalnız proje haftasında", "Telefon okul saatinde dolapta"],
    ["Lise", "En fazla 90 dk", "Sınav haftaları dışında hafif", "Telefon derste çantada; dizüstü bilgisayar öğretmen izniyle"],
  ],

  closing: {
    title: "Yöntemi bir derste görün.",
    text: "Tur sırasında bir dersin ilk on dakikasını kapıdan izleyebilirsiniz. Hangi kademeyi görmek istediğinizi formda seçin.",
  },
};
