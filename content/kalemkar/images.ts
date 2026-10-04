// Image registry: Turkish alt text (part of the copy) and focal point, merged
// with the sizes written by scripts/process-kalemkar-images.mjs.
import dims from "./image-dims.json";

const meta = {
  domates: { alt: "Tepeden: geniş tabağın ortasında gül gibi dizilmiş domates dilimleri, koyu nar ekşisi ve taze otlar", pos: "50% 50%" },
  patlican: { alt: "Tepeden: süzme yoğurdun üstünde köz patlıcan ve pul biberli yağ", pos: "50% 50%" },
  corba: { alt: "Tepeden: kenarı noktalı tabakta mercimek çorbası, ortasında kavrulmuş nohut", pos: "50% 50%" },
  firik: { alt: "Yakından: firik pilavının üstünde kuzu ve acı portakal dilimleri", pos: "50% 50%" },
  salata: { alt: "Tepeden: tabağın ortasında küçük bir yığın ince doğranmış lahana, dereotu dalı ve kırmızı biber", pos: "50% 50%" },
  humus: { alt: "Tepeden: humusun üstünde kavurma ve taze otlar", pos: "50% 50%" },
  incik: { alt: "Tepeden: beyaz tabakta ot soslu iki kuzu incik", pos: "50% 50%" },
  ayva: { alt: "Tepeden: döküm tavada karanfil ve tarçınla kızarmış ayva dilimleri", pos: "50% 50%" },
  sarma: { alt: "Tepeden: siyah tabakta dövülmüş fıstık üstünde fıstık sarmaları", pos: "50% 50%" },
  sinide: { alt: "Tepeden: kazımalı bakır sinide firik ve fıstık sarması tabakları", pos: "50% 50%" },
  bakirci: { alt: "Gaziantep’te bir bakırcı, kalemle bakır siniye desen kazıyor", pos: "50% 45%" },
  cekic: { alt: "Bakırcının elleri, çekiç ve kalemle bakır tabağı işliyor", pos: "50% 55%" },
  ev: { alt: "Gaziantep’te ahşap cumbalı eski taş ev", pos: "50% 45%" },
  kubbe: { alt: "Kalın taş kemerlerin altından uzanan loş bir oda", pos: "50% 50%" },
  salon: { alt: "Nişli kesme taş duvarların önünde kurulmuş bir sofra, yerde kilim", pos: "60% 50%" },
  ocak: { alt: "Ocakta kor hâlinde kömürler, maşayla çevriliyor", pos: "45% 50%" },
  fistik: { alt: "Bakır kâsede kabuklu Antep fıstıkları", pos: "50% 50%" },
  mum: { alt: "Karanlıkta yanan beyaz mumlar", pos: "50% 50%" },
  servis: { alt: "Bir el, servis için tabağı uzatıyor", pos: "50% 50%" },
  sini: { alt: "", pos: "50% 50%" },
  tepsi: { alt: "", pos: "50% 50%" },
} as const;

export type ImageKey = keyof typeof meta;
export type Img = { key: ImageKey; alt: string; pos: string; w: number; h: number; widths: number[]; alpha?: boolean };

type Dim = { w: number; h: number; widths: number[]; alpha?: boolean };
const d = dims as Record<string, Dim>;

export const img = (key: ImageKey): Img => ({ key, ...meta[key], ...d[key] });
