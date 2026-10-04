// Every third-party asset in the Pazı Robotik concept, with source and licence.
// The robot, the cell, every texture and every drawing are generated in code
// for this project: no photographs, no stock images, no downloaded 3D models.
// Fonts are self-hosted from the @fontsource-variable packages (latin +
// latin-ext subsets), licence files kept next to them in public/pazi/fonts/.

export type Credit = { group: "font" | "code"; author: string; title: string; url: string; licence: string; use: string };

export const credits: Credit[] = [
  { group: "font", author: "Omnibus-Type", title: "Archivo (variable, wdth 62–125, wght 100–900)", url: "https://github.com/Omnibus-Type/Archivo", licence: "SIL Open Font License 1.1", use: "Başlıklar, arayüz ve metin" },
  { group: "font", author: "Evil Martians", title: "Martian Mono (variable, wdth 75–112,5, wght 100–800)", url: "https://github.com/evilmartians/mono", licence: "SIL Open Font License 1.1", use: "Ölçüler, sayılar, HMI şeridi" },
  { group: "code", author: "three.js authors", title: "three.js (RoomEnvironment, RoundedBoxGeometry dahil)", url: "https://github.com/mrdoob/three.js", licence: "MIT", use: "3B hücre" },
  { group: "code", author: "Vercel", title: "Next.js, React", url: "https://github.com/vercel/next.js", licence: "MIT", use: "Site çatısı" },
];
