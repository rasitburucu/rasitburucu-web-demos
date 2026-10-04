// Revak: graded copies of the walk's images (the originals stay untouched).
//
//   node .tasarim/revak/araclar/walk-grade.mjs            (from the repo root)
//
// 1. Arch faces (kemer-sabah / kemer-aksam): the Blender renders read as grey
//    plaster. Without a re-render (Blender MCP unreachable, 2026-10-04) the faces
//    get a limestone tone in sharp: local contrast (CLAHE) deepens the joints,
//    a warm honey cast replaces the grey, the evening face goes amber.
//    Output: public/revak/walk/tas-{sabah,aksam}-{720,1440}.{avif,webp}
// 2. Level photographs: the CSS grade (saturate .74, contrast .9, sepia) made them
//    muddy. Each level now carries its own hour, baked in: anaokulu cool morning,
//    ilkokul clear noon, ortaokul warm afternoon, lise amber evening; the garden
//    at the open arch is the late evening.
//    Output: public/revak/walk/saat-<key>-{480,800,1200}.{avif,webp}
//
// Sources are the largest published files (the raw renders and the original
// downloads are not in the repo).
import sharp from "sharp";

const IMG = "public/revak/img";
const WALK = "public/revak/walk";

// --- 1. arch faces -------------------------------------------------------
// recomb: a warm limestone cast (more red, less blue); linear: contrast around mid grey
const faces = [
  { out: "tas-sabah", src: "kemer-sabah-1440.webp", warm: [1.045, 1.0, 0.91], contrast: 1.2, bright: 1.05, sat: 1.0 },
  { out: "tas-aksam", src: "kemer-aksam-1440.webp", warm: [1.06, 0.985, 0.86], contrast: 1.24, bright: 1.03, sat: 1.0 },
];
for (const f of faces) {
  const src = `${WALK}/${f.src}`;
  const alpha = await sharp(src).extractChannel(3).toBuffer();
  // sharp runs its operations in a fixed order: CLAHE first, in its own pass
  const local = await sharp(src).removeAlpha().clahe({ width: 48, height: 48, maxSlope: 3 }).png().toBuffer();
  const rgb = await sharp(local)
    .recomb([
      [f.warm[0], 0, 0],
      [0, f.warm[1], 0],
      [0, 0, f.warm[2]],
    ])
    .linear(f.contrast, -(128 * f.contrast - 128))
    .modulate({ brightness: f.bright, saturation: f.sat })
    .toBuffer();
  const { width } = await sharp(src).metadata();
  const base = sharp(rgb).joinChannel(alpha);
  const png = await base.png().toBuffer();
  let bytes = 0;
  for (const w of [720, 1440]) {
    const r = sharp(png).resize({ width: Math.min(w, width) });
    bytes += (await r.clone().avif({ quality: 50, effort: 6 }).toFile(`${WALK}/${f.out}-${w}.avif`)).size;
    bytes += (await r.clone().webp({ quality: 76, alphaQuality: 90 }).toFile(`${WALK}/${f.out}-${w}.webp`)).size;
  }
  console.log(f.out.padEnd(12), `${Math.round(bytes / 1024)} KB`);
}

// --- 2. level photographs, one hour each ---------------------------------
// tint: per-channel gain (the colour of the hour); sat/contrast lift the muddy stock grade
const hours = [
  { key: "anaokulu", widths: [480, 800, 1200], tint: [0.95, 1.0, 1.08], sat: 1.12, contrast: 1.12, bright: 1.04 }, // 08.10 cool morning
  { key: "ilkokul", widths: [480, 800, 1200], tint: [1.02, 1.01, 0.98], sat: 1.15, contrast: 1.12, bright: 1.05 }, // 12.00 clear noon
  { key: "ortaokul", widths: [480, 800, 1200], tint: [1.07, 1.0, 0.88], sat: 1.15, contrast: 1.12, bright: 1.03 }, // 15.40 warm afternoon
  { key: "classroom", widths: [480, 800, 1200], tint: [1.12, 0.98, 0.78], sat: 1.12, contrast: 1.14, bright: 1.0 }, // 18.30 amber evening
  { key: "aksamBahce", widths: [480, 900], tint: [1.06, 0.99, 0.9], sat: 1.15, contrast: 1.1, bright: 1.0 }, // the garden, late evening
];
for (const h of hours) {
  const largest = h.widths[h.widths.length - 1];
  const src = `${IMG}/${h.key}-${largest}.webp`;
  const graded = await sharp(src)
    .recomb([
      [h.tint[0], 0, 0],
      [0, h.tint[1], 0],
      [0, 0, h.tint[2]],
    ])
    .linear(h.contrast, -(128 * h.contrast - 128))
    .modulate({ brightness: h.bright, saturation: h.sat })
    .png()
    .toBuffer();
  let bytes = 0;
  for (const w of h.widths) {
    const r = sharp(graded).resize({ width: w });
    bytes += (await r.clone().avif({ quality: 52, effort: 6 }).toFile(`${WALK}/saat-${h.key}-${w}.avif`)).size;
    bytes += (await r.clone().webp({ quality: 78 }).toFile(`${WALK}/saat-${h.key}-${w}.webp`)).size;
  }
  console.log(`saat-${h.key}`.padEnd(18), `${Math.round(bytes / 1024)} KB`);
}
