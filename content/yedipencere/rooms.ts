// The seven rooms in words. Numbers (steps, m², price, capacity) live in
// lib/yedipencere/house.ts. Durum: taslak, Raşit'in onayını bekliyor
// (.tasarim/yedipencere/METIN-ONAY.md). The house and its rooms are fictional.

import type { RoomId } from "@/lib/yedipencere/house";
import type { Lang } from "@/lib/yedipencere/dates";

export type RoomCopy = {
  /** "1. kat, deniz tarafı" */
  position: string;
  view: string;
  ceiling: string;
  night: string;
  bed: string;
  bath: string;
  lead: string;
  body: string;
  forWhom: string;
  notes: string[];
};

export const ROOM_INTERIOR: Record<RoomId, "ic-zemin" | "ic-birinci" | "ic-kosk"> = {
  taslik: "ic-zemin",
  avlu: "ic-zemin",
  cumba: "ic-birinci",
  sofa: "ic-birinci",
  korfez: "ic-birinci",
  hidirlik: "ic-kosk",
  kosk: "ic-kosk",
};

export const rooms: Record<Lang, Record<RoomId, RoomCopy>> = {
  tr: {
    taslik: {
      position: "Zemin kat, sokak tarafı",
      view: "Sokak; pencere demir parmaklıklı, sokak hizasında",
      ceiling: "3,15 m; taş duvar, ahşap kiriş",
      night: "Hafta sonları gece yarısına kadar sokaktan geçenler duyulur",
      bed: "Çift kişilik yatak (160 × 200)",
      bath: "Duşlu banyo",
      lead: "Taşlığın hemen yanındaki eski kiler. Kalın taş duvarlar odayı yazın serin tutar.",
      body: "Kapıdan girer girmez sağdaki oda; tek basamakla ulaşılır. Pencere demir parmaklıkların ardından sokağa açılır, tül perde gün boyu ışığı yumuşatır.",
      forWhom: "Basamak istemeyenler ve günü dışarıda geçirip akşam dönenler için.",
      notes: ["Hafta sonları gece yarısına kadar sokaktan ses gelir; kulak tıkacı komodinde.", "Pencere sokak hizasında; tül perde açılınca içerisi görünür."],
    },
    cumba: {
      position: "Birinci kat, sokak tarafı",
      view: "Sokak; cumbadan iki yöne",
      ceiling: "3,00 m; ahşap tavan",
      night: "Cuma ve cumartesi gece yarısına kadar sokak sesi",
      bed: "Çift kişilik yatak; cumbada sedir",
      bath: "Duşlu banyo",
      lead: "Sokağa taşan cumbanın içinde bir sedir var. Oturduğunuz yerden sokağın iki ucunu görürsünüz.",
      body: "Sabah kahvenizi cumbada içersiniz; karşı evlerin saçakları el uzatsanız değecek kadar yakın. Sedir üçüncü kişi için yatağa dönüşür.",
      forWhom: "Kaleiçi'nin sokak hayatını pencereden izlemek isteyenler ve üç kişilik aileler için.",
      notes: ["Cuma ve cumartesi geceleri yarıya kadar sokak sesi gelir; panjur kapanınca azalır.", "Ana merdivenle 21 basamak; iki yanda korkuluk var."],
    },
    avlu: {
      position: "Zemin kat, avlu tarafı",
      view: "Avlu, turunç ağacı ve sarnıç",
      ceiling: "3,10 m; ahşap kiriş",
      night: "Sessiz; sabah kahvaltı saatinde avlu canlanır",
      bed: "Çift kişilik yatak (160 × 200)",
      bath: "Duşlu banyo",
      lead: "Kapısı doğrudan avluya açılır. Kahvaltı masası iki adım ötede, turunç ağacının altında kurulur.",
      body: "Taşlıktan bir basamak, avludan bir basamak: iki basamakla odadasınız. Pencereniz turunca ve sarnıcın bileziğine bakar.",
      forWhom: "Basamak istemeyenler, bebek arabalı aileler ve avluda oturmayı sevenler için.",
      notes: ["Kahvaltı saatinde (08.00–10.30) pencerenizin önünden misafirler geçer.", "Konağın basamağı en az iki odasından biri."],
    },
    sofa: {
      position: "Birinci kat, avlu tarafı; sofaya açılır",
      view: "Avlu; oda sofaya açılır",
      ceiling: "3,20 m; göbekli, süslemeli ahşap tavan",
      night: "Sessiz",
      bed: "Çift kişilik yatak ve duvar boyu sedir",
      bath: "Duşlu banyo",
      lead: "Evin baş odası. Süslemeli ahşap tavanın ortasında bir göbek, duvar boyunca sedir ve gömme dolaplar var.",
      body: "Konağın en geniş odası. Kapınız evin ortak yaşama alanı sofaya açılır; pencereden avludaki turunç ağacının tepesi görünür.",
      forWhom: "Geniş oda isteyenler ve üç kişilik aileler için.",
      notes: ["Kapınız sofaya açılır; diğer misafirler sofadan geçerek odalarına gider.", "Ana merdivenle 21 basamak; iki yanda korkuluk var."],
    },
    korfez: {
      position: "Birinci kat, deniz tarafı",
      view: "Deniz; karşıda Konyaaltı ve Beydağları",
      ceiling: "2,90 m; ahşap tavan",
      night: "Yaz akşamları limandan müzik gelebilir",
      bed: "Çift kişilik yatak (180 × 200)",
      bath: "Duşlu banyo",
      lead: "Deniz kanadının ilk odası. Pencere surun üstünden körfeze açılır.",
      body: "Sabah ilk ışık karşıdaki Beydağları'na vurur; akşam güneş aynı dağların ardında batar. Denize bakan odaların en az basamaklısı.",
      forWhom: "Denizi görmek isteyip köşk merdivenine çıkmak istemeyenler için.",
      notes: ["Yaz akşamları limandan müzik gelebilir.", "Ana merdivenden sonra deniz kanadına iki basamak daha çıkılır; toplam 23."],
    },
    hidirlik: {
      position: "Köşk katı, deniz tarafı",
      view: "Deniz ve yanda Hıdırlık Kulesi",
      ceiling: "2,90 m; çatı ahşabı, pencere tarafında 2,30 m",
      night: "Sessiz",
      bed: "Çift kişilik yatak (160 × 200)",
      bath: "Duşlu banyo",
      lead: "Köşk katında, çatının altında. Pencereden bakınca solda Hıdırlık Kulesi, karşıda körfez.",
      body: "Akşam güneşi kuleyi ve dağları aynı anda boyar. Tavan çatı eğimiyle pencereye doğru alçalır; oda bu yüzden sıcak ve toplu durur.",
      forWhom: "Manzarayı sessizlikle birlikte isteyen, merdivenden çekinmeyen çiftler için.",
      notes: ["Köşk merdiveni dar ve diktir: 14 basamak, 23 cm. Bavulunuzu biz çıkarırız.", "Tavan pencere tarafında 2,30 m'ye iner."],
    },
    kosk: {
      position: "Köşk katı, deniz tarafı; üç yönde pencere",
      view: "Deniz, üç yönden pencere",
      ceiling: "3,10 m; açık çatı ahşabı",
      night: "Rüzgâr ve dalga sesi",
      bed: "Çift kişilik yatak (180 × 200), oturma köşesi",
      bath: "Pencereli, duşlu banyo",
      lead: "Evin en üstü. Üç duvarda pencere var: bir yanda Kaleiçi'nin çatıları, karşıda körfez, öbür yanda dağlar.",
      body: "Konağın en geniş manzarası ve en çok basamağı burada. Oturma köşesindeki sedir üçüncü kişi için yatağa dönüşür.",
      forWhom: "Özel bir gece için, 37 basamağı göze alan misafirler için.",
      notes: ["37 basamak; bunların 14'ü dar ve dik köşk merdiveni. Bavulunuzu biz çıkarırız.", "Rüzgârlı gecelerde panjurlar ses yapabilir; isterseniz kapatırız."],
    },
  },
  en: {
    taslik: {
      position: "Ground floor, lane side",
      view: "The lane, through an iron-barred window at street level",
      ceiling: "3.15 m; stone walls, timber beams",
      night: "On weekends you hear passers-by until midnight",
      bed: "Double bed (160 × 200)",
      bath: "Shower room",
      lead: "The old storeroom beside the taşlık, the stone-floored entrance hall. Thick stone walls keep it cool in summer.",
      body: "The first door on the right as you come in, one step up. The window opens onto the lane behind iron bars; a sheer curtain softens the light all day.",
      forWhom: "For guests who would rather not climb, and for those out all day and back in the evening.",
      notes: ["At weekends the lane is audible until midnight; earplugs are in the bedside drawer.", "The window is at street level; with the curtain open, passers-by can see in."],
    },
    cumba: {
      position: "First floor, lane side",
      view: "The lane, both ways from the bay window",
      ceiling: "3.00 m; timber ceiling",
      night: "Street noise until midnight on Fridays and Saturdays",
      bed: "Double bed; divan in the bay",
      bath: "Shower room",
      lead: "A divan runs along the bay window that juts over the lane. From it you see both ends of the street.",
      body: "Morning coffee in the bay, with the neighbours' eaves almost within reach. The divan becomes a bed for a third guest.",
      forWhom: "For watching Kaleiçi's street life from the window, and for families of three.",
      notes: ["On Friday and Saturday nights the lane is audible until midnight; the shutters cut it down.", "21 steps by the main stair, with a rail on both sides."],
    },
    avlu: {
      position: "Ground floor, courtyard side",
      view: "The courtyard, its bitter-orange tree and cistern",
      ceiling: "3.10 m; timber beams",
      night: "Quiet; the courtyard wakes up at breakfast",
      bed: "Double bed (160 × 200)",
      bath: "Shower room",
      lead: "The door opens straight onto the courtyard. Breakfast is laid two steps away, under the orange tree.",
      body: "One step into the hall, one step into the room: that is all. Your window looks at the orange tree and the cistern's stone rim.",
      forWhom: "For guests who would rather not climb, families with a pushchair and anyone who likes to sit out.",
      notes: ["At breakfast (08.00–10.30) guests pass in front of your window.", "One of the two rooms with the fewest steps."],
    },
    sofa: {
      position: "First floor, courtyard side; opens onto the hall",
      view: "The courtyard; the room opens onto the hall",
      ceiling: "3.20 m; carved timber ceiling with a centre rosette",
      night: "Quiet",
      bed: "Double bed and a wall-length divan",
      bath: "Shower room",
      lead: "The principal room of the house: a carved timber ceiling with a rosette, a divan along the wall and built-in cupboards.",
      body: "The largest room. Your door opens onto the sofa, the shared upstairs hall; from the window you see the top of the orange tree.",
      forWhom: "For guests who want space, and for families of three.",
      notes: ["Your door opens onto the hall; other guests cross it to reach their rooms.", "21 steps by the main stair, with a rail on both sides."],
    },
    korfez: {
      position: "First floor, sea side",
      view: "The sea, with Konyaaltı and the Beydağları range opposite",
      ceiling: "2.90 m; timber ceiling",
      night: "On summer evenings music may drift up from the harbour",
      bed: "Double bed (180 × 200)",
      bath: "Shower room",
      lead: "The first room of the sea wing. The window opens over the old city wall onto the bay.",
      body: "First light falls on the Beydağları across the water; in the evening the sun sets behind the same peaks. The sea-view room with the fewest steps.",
      forWhom: "For a sea view without the belvedere stair.",
      notes: ["On summer evenings music may drift up from the harbour.", "Two more steps after the main stair up into the sea wing: 23 in all."],
    },
    hidirlik: {
      position: "Belvedere floor, sea side",
      view: "The sea, with Hıdırlık Tower to one side",
      ceiling: "2.90 m; exposed roof timbers, 2.30 m at the window",
      night: "Quiet",
      bed: "Double bed (160 × 200)",
      bath: "Shower room",
      lead: "Under the roof on the belvedere floor. Look out and Hıdırlık Tower is on your left, the bay straight ahead.",
      body: "The evening sun colours the tower and the mountains at once. The ceiling slopes down towards the window, which keeps the room snug.",
      forWhom: "For couples who want the view with quiet, and do not mind a stair.",
      notes: ["The belvedere stair is narrow and steep: 14 steps of 23 cm. We carry your luggage up.", "The ceiling drops to 2.30 m at the window."],
    },
    kosk: {
      position: "Belvedere floor, sea side; windows on three sides",
      view: "The sea, through windows on three sides",
      ceiling: "3.10 m; open roof timbers",
      night: "Wind and waves",
      bed: "Double bed (180 × 200), sitting corner",
      bath: "Shower room with a window",
      lead: "The top of the house, with windows on three walls: Kaleiçi's roofs on one side, the bay ahead, the mountains on the other.",
      body: "The widest view in the house and the most steps. The divan in the sitting corner becomes a bed for a third guest.",
      forWhom: "For a special night, if 37 steps do not put you off.",
      notes: ["37 steps, 14 of them on the narrow, steep belvedere stair. We carry your luggage up.", "On windy nights the shutters can rattle; we close them if you like."],
    },
  },
};
