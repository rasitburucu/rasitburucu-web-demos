// Every third-party asset in the Damar concept, with source and licence
// (same list in .tasarim/damar/THIRD_PARTY-ek.md). The four photographs stand
// in for four blocks: scripts/process-damar-images.mjs crops one image per slab
// in stock. Drawings, the favicon and the Open Graph card are made in code.
import type { StoneId } from "./stones";

export type Credit = {
  group: "photo" | "font";
  stone?: StoneId;
  author: string;
  title: string;
  url: string;
  licence: string;
};

export const credits: Credit[] = [
  { group: "photo", stone: "karakalem", author: "Akbar Nemati", title: "A close up of a white marble surface", url: "https://unsplash.com/photos/2yp6ICVr2VM", licence: "Unsplash License" },
  { group: "photo", stone: "duman", author: "Karolina Grabowska (Kaboompics)", title: "Pattern on gray marble", url: "https://www.pexels.com/photo/pattern-on-gray-marble-6634152/", licence: "Pexels License" },
  { group: "photo", stone: "sirma", author: "Akbar Nemati", title: "A close up of a white marble counter top", url: "https://unsplash.com/photos/nXVXHtJiDnI", licence: "Unsplash License" },
  { group: "photo", stone: "kiragi", author: "Akbar Nemati", title: "A close up of a white marble surface", url: "https://unsplash.com/photos/7aKvziqeTfg", licence: "Unsplash License" },
  { group: "font", author: "Mateusz Machalski, Borys Kosmynka, Przemek Hoffer", title: "Brygada 1918", url: "https://fonts.google.com/specimen/Brygada+1918", licence: "SIL Open Font License 1.1" },
  { group: "font", author: "Andreas Rasmussen", title: "Albert Sans", url: "https://fonts.google.com/specimen/Albert+Sans", licence: "SIL Open Font License 1.1" },
];
