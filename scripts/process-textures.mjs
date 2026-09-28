// Converts the CC0 source textures (Poly Haven, ambientCG) in scripts/.raw/tex
// into small webp files for the Onikitaş scene. Sources: content/onikitas/credits.ts
import sharp from "sharp";
const src = "scripts/.raw/tex";
const out = "public/onikitas/tex";
const jobs = [
  [`${src}/plaster_diff.jpg`, `${out}/plaster.webp`, 1024, 64, true],
  [`${src}/plaster_nor.jpg`, `${out}/plaster-n.webp`, 1024, 86],
  [`${src}/trav/Travertine009_1K-JPG_Color.jpg`, `${out}/travertine.webp`, 512, 80],
];
for (const [i, o, size, q, gray] of jobs) {
  const info = await (gray ? sharp(i).grayscale() : sharp(i)).resize(size, size).webp({ quality: q }).toFile(o);
  console.log(o, Math.round(info.size / 1024) + " KB");
}
