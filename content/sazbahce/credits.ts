// Every third-party asset in the Sazbahçe concept, with source and licence.
// Photos: three Pexels photographs of the real lake (Pexels licence, credited anyway).
// The four areas are our own renders: modelled in Blender 5.2 from a script
// (.tasarim/sazbahce/blender/sazbahce_scene.py) with CC0 models and textures from
// Poly Haven. The site plan, table layouts and favicon are drawn in code (SVG). The visit
// map is drawn in code from OpenStreetMap data (ODbL; see scripts/fetch-sazbahce-map.mjs).

export type Credit = {
  group: "photo" | "font";
  key?: string;
  author: string;
  title: string;
  url: string;
  licence: string;
  use: string;
};

export const credits: Credit[] = [
  { group: "photo", key: "golyazi", author: "mustafa memish", title: "Serene sunset at Lake Ulubat in Gölyazı, Bursa", url: "https://www.pexels.com/photo/serene-sunset-at-lake-ulubat-in-golyazi-bursa-36520717/", licence: "Pexels License", use: "İlk ekran, Uluabat Gölü" },
  { group: "photo", key: "sazlik", author: "Ali Uğur", title: "Serene lake view with rowboat and reeds in Bursa", url: "https://www.pexels.com/photo/serene-lake-view-with-rowboat-and-reeds-in-bursa-33066315/", licence: "Pexels License", use: "Ziyaret, Uluabat sazlığı" },
  { group: "photo", key: "liman", author: "Betül Şen", title: "Harbour in Bursa", url: "https://www.pexels.com/photo/harbour-in-bursa-19962368/", licence: "Pexels License", use: "Ziyaret, Gölyazı kıyısı" },
  { group: "font", author: "The Anybody Project Authors (Etcetera Type Co.)", title: "Anybody", url: "https://fonts.google.com/specimen/Anybody", licence: "SIL Open Font License 1.1", use: "Başlıklar, logo, plan etiketleri" },
  { group: "font", author: "The Onest Project Authors", title: "Onest", url: "https://fonts.google.com/specimen/Onest", licence: "SIL Open Font License 1.1", use: "Gövde ve arayüz" },
];
