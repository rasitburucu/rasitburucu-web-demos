// Every third-party asset used by the Onikitaş concept, with source and licence.
// Shown in the footer. Geometry, terrain, trees, sea, sky, leaf shadows and the
// optional ambient sound are generated in code (no downloaded 3D models or audio).

export type CreditGroup = "fonts" | "textures" | "code";

export type Credit = {
  group: CreditGroup;
  name: string;
  author: string;
  licence: string;
  url: string;
  use: string;
};

export const credits: Credit[] = [
  {
    group: "fonts",
    name: "DM Serif Display",
    author: "Colophon Foundry",
    licence: "SIL Open Font License 1.1",
    url: "https://fonts.google.com/specimen/DM+Serif+Display",
    use: "Başlıklar ve saat",
  },
  {
    group: "fonts",
    name: "Pinyon Script",
    author: "Nicole Fally",
    licence: "SIL Open Font License 1.1",
    url: "https://fonts.google.com/specimen/Pinyon+Script",
    use: "Onikitaş yazısı",
  },
  {
    group: "fonts",
    name: "Instrument Sans",
    author: "Instrument",
    licence: "SIL Open Font License 1.1",
    url: "https://fonts.google.com/specimen/Instrument+Sans",
    use: "Metin ve arayüz",
  },
  {
    group: "textures",
    name: "White Plaster Rough 01",
    author: "Poly Haven",
    licence: "CC0",
    url: "https://polyhaven.com/a/white_plaster_rough_01",
    use: "Kireç duvar ve cepheler",
  },
  {
    group: "textures",
    name: "Travertine 009",
    author: "ambientCG",
    licence: "CC0",
    url: "https://ambientcg.com/view?id=Travertine009",
    use: "Teraslar ve havuz kenarları",
  },
  {
    group: "code",
    name: "three.js",
    author: "three.js authors",
    licence: "MIT",
    url: "https://github.com/mrdoob/three.js",
    use: "WebGL",
  },
  {
    group: "code",
    name: "React Three Fiber, Drei, React Postprocessing",
    author: "Poimandres",
    licence: "MIT",
    url: "https://github.com/pmndrs",
    use: "Sahne",
  },
  {
    group: "code",
    name: "postprocessing",
    author: "Raoul van Rüschen",
    licence: "Zlib",
    url: "https://github.com/pmndrs/postprocessing",
    use: "Işık sonrası işlem",
  },
  {
    group: "code",
    name: "N8AO",
    author: "N8python",
    licence: "ISC",
    url: "https://github.com/N8python/n8ao",
    use: "Ortam gölgesi",
  },
  {
    group: "code",
    name: "three-custom-shader-material",
    author: "Faraz Shaikh",
    licence: "MIT",
    url: "https://github.com/FarazzShaikh/THREE-CustomShaderMaterial",
    use: "Maketten gerçeğe geçiş malzemesi",
  },
  {
    group: "code",
    name: "Lenis",
    author: "darkroom.engineering",
    licence: "MIT",
    url: "https://github.com/darkroomengineering/lenis",
    use: "Yumuşak kaydırma",
  },
];
