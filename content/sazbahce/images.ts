// Image registry: Turkish alt text (from tr.ts) and focal point, merged with the
// sizes written by scripts/process-sazbahce-images.mjs.
import dims from "./image-dims.json";
import { tr } from "./tr";

const a = tr.areas;
const meta = {
  golyaziM: { alt: "Uluabat Gölü’nde gün batımı, Gölyazı kıyısında kayıklar", pos: "40% 60%" },
  golyazi: { alt: "Uluabat Gölü’nde gün batımı: Gölyazı kıyısında yapraksız iki ağaç ve suya çekilmiş kayıklar", pos: "38% 55%" },
  cayir: { alt: a.cayir.photoAlt, pos: "46% 50%" },
  cayir2: { alt: a.cayir.photo2Alt, pos: "50% 70%" },
  ambar: { alt: a.ambar.photoAlt, pos: "50% 55%" },
  ambar2: { alt: a.ambar.photo2Alt, pos: "50% 50%" },
  ambarUzun: { alt: tr.corporatePage.photo2Alt, pos: "50% 50%" },
  avlu: { alt: a.avlu.photoAlt, pos: "45% 55%" },
  avlu2: { alt: a.avlu.photo2Alt, pos: "50% 50%" },
  iskele: { alt: a.iskele.photoAlt, pos: "50% 55%" },
  iskele2: { alt: a.iskele.photo2Alt, pos: "50% 60%" },
  sazlik: { alt: tr.home.visit.photoAlt, pos: "40% 50%" },
  liman: { alt: tr.visitPage.photoAlt, pos: "50% 60%" },
} as const;

export type ImageKey = keyof typeof meta;
export type Img = { key: ImageKey; alt: string; pos: string; w: number; h: number; widths: number[] };

type Dim = { w: number; h: number; widths: number[] };
const d = dims as Record<string, Dim>;

export const img = (key: ImageKey): Img => ({ key, ...meta[key], ...d[key] });
