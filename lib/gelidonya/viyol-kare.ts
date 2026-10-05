// Gelidonya: the order tray drawn from Blender renders (scripts/gelidonya-blender/
// viyol_kare.py), so it shares the greenhouse render's light: an empty tray, the
// same tray peat-filled, and a sheet of eight seedlings per crop (cotyledons +
// first true leaf, each with its own shadow). The tray is filled with peat; the
// canvas sets a seedling in each filled cell. Same sun (upper left) everywhere.
import geo from "@/content/gelidonya/viyol-kare.json";
import type { Fide, Leaf } from "@/content/gelidonya/urunler";
import { asset } from "@/lib/asset";

export type TraySet = { cells: 45 | 28; leaf: Leaf; torf: HTMLImageElement; fide: HTMLImageElement };

const cache = new Map<string, Promise<HTMLImageElement>>();
let avifOk: boolean | null = null;

function loadOne(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.decoding = "async";
    im.onload = () => (im.decode ? im.decode().catch(() => undefined).then(() => res(im)) : res(im));
    im.onerror = rej;
    im.src = src;
  });
}

/** AVIF first, WebP if the browser cannot decode AVIF. */
export function loadImg(name: string) {
  let p = cache.get(name);
  if (!p) {
    const webp = () => loadOne(asset(`/gelidonya/${name}.webp`));
    p =
      avifOk === false
        ? webp()
        : loadOne(asset(`/gelidonya/${name}.avif`)).then(
            (im) => ((avifOk = true), im),
            () => ((avifOk = false), webp()),
          );
    cache.set(name, p);
  }
  return p;
}

export async function loadSet(f: Pick<Fide, "cells" | "leaf">): Promise<TraySet> {
  const [torf, fide] = await Promise.all([loadImg(`viyol-${f.cells}-torf`), loadImg(`fide-${f.leaf}`)]);
  return { cells: f.cells, leaf: f.leaf, torf, fide };
}

/** Height ÷ width of the tray picture (tray plus its shadow margin). */
export function trayImgRatio(cells: number) {
  const s = geo.sizes[`viyol-${cells}-torf` as keyof typeof geo.sizes];
  return s[1] / s[0];
}

/** Share of the picture's width that is tray (the rest is shadow margin). */
export function trayShare(cells: number) {
  const g = geo.trays[String(cells) as "45" | "28"];
  const s = geo.sizes[`viyol-${cells}-torf` as keyof typeof geo.sizes];
  return { x: g.tray[0] / s[0], y: g.tray[1] / s[1], w: g.tray[2] / s[0], h: g.tray[3] / s[1] };
}

/** Seeded random, so each tray looks the same between frames. */
export function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Seedling size against its sprite square: the leaves stay mostly inside their own cell. */
const SPRITE = 0.82;

/**
 * Draws the peat-filled tray at (x, y), width w; the first `filled` cells get a
 * seedling. growth(n) 0..1 sizes the n-th seedling (the filling moment).
 */
export function drawTrayImg(
  cx: CanvasRenderingContext2D,
  set: TraySet,
  x: number,
  y: number,
  w: number,
  filled: number,
  seed: number,
  growth?: (n: number) => number,
) {
  const g = geo.trays[String(set.cells) as "45" | "28"];
  const sh = geo.sheets[set.leaf];
  const size = geo.sizes[`viyol-${set.cells}-torf` as keyof typeof geo.sizes];
  const s = w / size[0];
  const h = size[1] * s;
  cx.drawImage(set.torf, x, y, w, h);
  const R = rng(seed);
  const n = Math.min(filled, g.cols * g.rows);
  const picks: number[] = [];
  const jit: { size: number; turn: number }[] = [];
  for (let k = 0; k < n; k++) {
    picks.push(Math.floor(R() * sh.cols * sh.rows));
    jit.push({ size: 0.85 + R() * 0.3, turn: (R() - 0.5) * 0.4 });
  }
  const step = sh.step;
  for (let k = 0; k < n; k++) {
    const a = growth ? growth(k) : 1;
    if (a <= 0) continue;
    const i = k % g.cols;
    const j = Math.floor(k / g.cols);
    const v = picks[k];
    const ccx = x + (g.x0 + (i + 0.5) * g.cell) * s;
    const ccy = y + (g.y0 + (j + 0.5) * g.cell) * s;
    // no two seedlings alike: ±15 % size, a small turn (kept small so the
    // shadow still falls down and to the right)
    const vs = jit[k];
    const d = step * s * SPRITE * vs.size * (0.25 + 0.75 * a);
    cx.globalAlpha = Math.min(1, a * 3);
    cx.save();
    cx.translate(ccx, ccy);
    cx.rotate(vs.turn);
    cx.drawImage(set.fide, (v % sh.cols) * step, Math.floor(v / sh.cols) * step, step, step, -d / 2, -d / 2, d, d);
    cx.restore();
  }
  cx.globalAlpha = 1;
  return h;
}

/** A finished tray (or the partly filled last one) as one bitmap, for the bench.
 *  Large enough: the render. Small: a clean count (black tray, a green dot per
 *  seedling, peat brown where a cell is empty), since texture turns to noise. */
export function trayBitmap(set: TraySet, width: number, filled: number, seed: number) {
  const size = geo.sizes[`viyol-${set.cells}-torf` as keyof typeof geo.sizes];
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(width));
  c.height = Math.max(1, Math.round((width * size[1]) / size[0]));
  const cx = c.getContext("2d");
  if (!cx) return c;
  cx.imageSmoothingQuality = "high";
  if (c.width >= 220) {
    drawTrayImg(cx, set, 0, 0, c.width, filled, seed);
    return c;
  }
  const g = geo.trays[String(set.cells) as "45" | "28"];
  const s = c.width / size[0];
  const [tx, ty, tw, th] = g.tray.map((v) => v * s);
  // soft shadow down and to the right, as in the renders
  cx.fillStyle = "rgba(20, 24, 20, 0.28)";
  cx.fillRect(tx + tw * 0.025, ty + th * 0.05, tw, th);
  cx.fillStyle = "#0d0e0e";
  cx.fillRect(tx, ty, tw, th);
  const cs = g.cell * s;
  for (let k = 0; k < g.cols * g.rows; k++) {
    const cxm = (g.x0 + ((k % g.cols) + 0.5) * g.cell) * s;
    const cym = (g.y0 + (Math.floor(k / g.cols) + 0.5) * g.cell) * s;
    cx.fillStyle = k < filled ? (k * 7) % 5 === 0 ? "#6fa83f" : "#4f8f2c" : "#3a2a1c";
    cx.beginPath();
    cx.arc(cxm, cym, cs * (k < filled ? 0.4 : 0.3), 0, Math.PI * 2);
    cx.fill();
  }
  return c;
}
