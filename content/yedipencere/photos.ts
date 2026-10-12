// Photos shown inside the drawn openings (window glass, doors). Sources and
// licences: .tasarim/yedipencere/THIRD_PARTY-ek.md. Derivatives are made by
// scripts/process-yedipencere-images.mjs (crop to the opening, shared grade).

import dims from "./photo-dims.json";
import { asset } from "@/lib/asset";
import type { Lang } from "@/lib/yedipencere/dates";

export type PhotoKey = "korfez" | "hidirlik" | "kosk" | "taslik" | "cumba" | "avlu" | "sofa" | "ic-zemin" | "ic-birinci" | "ic-kosk";

type Credit = { author: string; url: string; licence: "Unsplash License" | "Pexels License"; alt: Record<Lang, string> };

export const PHOTOS: Record<PhotoKey, Credit> = {
  korfez: {
    author: "Igor Sporynin",
    url: "https://unsplash.com/photos/a-body-of-water-with-trees-and-mountains-in-the-background-jxAhpeXqylQ",
    licence: "Unsplash License",
    alt: { tr: "Falezden körfeze gün batımı; karşıda Beydağları, önde ağaçlar", en: "Sunset over the bay from the cliff, the Beydağları opposite and trees below" },
  },
  hidirlik: {
    author: "Sergey Konstantinov",
    url: "https://unsplash.com/photos/a-view-of-a-body-of-water-with-mountains-in-the-background-QWxc5zGHMxc",
    licence: "Unsplash License",
    alt: { tr: "Akşam ışığında Hıdırlık Kulesi, körfez ve Beydağları", en: "Hıdırlık Tower, the bay and the Beydağları in evening light" },
  },
  kosk: {
    author: "Igor Sporynin",
    url: "https://unsplash.com/photos/a-group-of-houses-next-to-a-body-of-water-YUu9QqvNy64",
    licence: "Unsplash License",
    alt: { tr: "Kaleiçi'nin kiremit çatıları, ardında körfez ve dağlar", en: "Kaleiçi's tiled roofs, with the bay and the mountains beyond" },
  },
  taslik: {
    author: "Kseniia Ilinykh",
    url: "https://unsplash.com/photos/a-narrow-street-with-buildings-and-a-clock-tower-in-the-distance-xG2uKMgxGzw",
    licence: "Unsplash License",
    alt: { tr: "Arnavut kaldırımlı dar bir Kaleiçi sokağı", en: "A narrow cobbled lane in Kaleiçi" },
  },
  cumba: {
    author: "Daniel Silva",
    url: "https://unsplash.com/photos/a-narrow-cobblestone-street-lined-with-buildings-0WMdxGvqhfE",
    licence: "Unsplash License",
    alt: { tr: "Cumbalı evler ve ağaçlı bir Kaleiçi sokağı", en: "A Kaleiçi lane with overhanging upper floors and a shade tree" },
  },
  avlu: {
    author: "Yana Ralko",
    url: "https://unsplash.com/photos/orange-trees-with-ripe-fruit-in-a-courtyard-5fixJa9vMoU",
    licence: "Unsplash License",
    alt: { tr: "Avluda meyve vermiş turunç ağacı", en: "An orange tree in fruit in a courtyard" },
  },
  sofa: {
    author: "Bob Jenkin",
    url: "https://unsplash.com/photos/orange-tree-with-ripe-fruit-in-courtyard-k6Fia0wSpvc",
    licence: "Unsplash License",
    alt: { tr: "Ahşap korkuluğun ardında avludaki turunç ağacı", en: "The courtyard's orange tree beyond a timber gallery rail" },
  },
  "ic-zemin": {
    author: "Merve Eğlence",
    url: "https://www.pexels.com/photo/a-room-with-a-window-and-a-bed-with-curtains-27772361/",
    licence: "Pexels License",
    alt: { tr: "Taş duvarlı, ahşap kirişli bir oda; pencere önünde sedir", en: "A stone-walled room with timber beams and a window seat" },
  },
  "ic-birinci": {
    author: "Mesut Musluer",
    url: "https://www.pexels.com/photo/empty-cushion-chairs-11987617/",
    licence: "Pexels License",
    alt: { tr: "Süslemeli ahşap tavan, duvar boyu sedir ve gömme dolaplar", en: "A carved timber ceiling, a wall-length divan and built-in cupboards" },
  },
  "ic-kosk": {
    author: "hello aesthe",
    url: "https://www.pexels.com/photo/bedroom-interior-design-in-rustic-home-15699340/",
    licence: "Pexels License",
    alt: { tr: "Çatı ahşabının altında taş duvarlı bir yatak odası", en: "A bedroom under exposed roof timbers with a stone wall" },
  },
};

const D = dims as Record<PhotoKey, { ratio: number; widths: number[] }>;

/** The smallest prepared width that covers `want` CSS pixels at 2× (or the largest). */
export function photoSrc(key: PhotoKey, want: number): string {
  const widths = D[key].widths;
  const w = widths.find((x) => x >= want) ?? widths[widths.length - 1];
  return asset(`/yedipencere/foto/${key}-${w}.webp`);
}

export const photoRatio = (key: PhotoKey) => D[key].ratio;
