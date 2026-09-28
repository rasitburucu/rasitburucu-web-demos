// Image registry: intrinsic size + generated widths per key.
// Files: /onikitas/img/{key}-{width}.webp (see scripts/process-images.mjs).
// Alt text lives in the copy file (tr.ts → images) so it can be translated.

export const imageMeta = {
  "hero-house": { w: 2400, h: 2400, widths: [800, 1200, 2000] },
  "bay-villa": { w: 2400, h: 1800, widths: [800, 1200, 2000] },
  "bay-pool": { w: 2400, h: 1800, widths: [800, 1200, 2000] },
  "pool-edge": { w: 2400, h: 1600, widths: [800, 1200, 2000] },
  "view-sunset": { w: 2400, h: 3199, widths: [800, 1200, 1600] },
  "view-night": { w: 2400, h: 1350, widths: [800, 1200, 2000] },
  "view-morning": { w: 2400, h: 1600, widths: [800, 1200, 2000] },
  "stone-wall": { w: 2400, h: 1600, widths: [800, 1200] },
  "tree-shadow": { w: 2400, h: 1600, widths: [800, 1200, 2000] },
  "lime-plaster": { w: 2400, h: 3382, widths: [800, 1200] },
  stair: { w: 2400, h: 3600, widths: [800, 1200, 1600] },
  "arch-hall": { w: 2400, h: 3595, widths: [800, 1200, 1600] },
  niche: { w: 2400, h: 2241, widths: [800, 1200, 1600] },
  olive: { w: 2400, h: 1617, widths: [800, 1200, 2000] },
  "hill-sea": { w: 2400, h: 1599, widths: [800, 1200, 2000] },
  oak: { w: 2400, h: 1768, widths: [800, 1200] },
  travertine: { w: 2400, h: 1628, widths: [800, 1200, 1600] },
  columns: { w: 2400, h: 1800, widths: [800, 1200, 2000] },
} as const;

export type ImageKey = keyof typeof imageMeta;

export const imgSrc = (key: ImageKey, width: number) => `/onikitas/img/${key}-${width}.webp`;

export function imgSrcSet(key: ImageKey) {
  return imageMeta[key].widths.map((w) => `${imgSrc(key, w)} ${w}w`).join(", ");
}

export function largest(key: ImageKey) {
  const ws = imageMeta[key].widths;
  return ws[ws.length - 1];
}
