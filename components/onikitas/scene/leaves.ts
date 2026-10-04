import * as THREE from "three";
import { mulberry32 } from "@/lib/onikitas/noise";

// Olive-branch silhouettes drawn once into a canvas and used as a shadow mask
// on the limewash wall. Red = near branches (crisp), green = far (soft).

function branch(
  ctx: CanvasRenderingContext2D,
  rand: () => number,
  x: number,
  y: number,
  angle: number,
  length: number,
  width: number,
  depth: number,
) {
  const steps = Math.max(6, Math.floor(length / 14));
  let a = angle;
  let px = x;
  let py = y;
  ctx.lineCap = "round";
  for (let i = 0; i < steps; i++) {
    a += (rand() - 0.5) * 0.24;
    const nx = px + Math.cos(a) * (length / steps);
    const ny = py + Math.sin(a) * (length / steps);
    ctx.lineWidth = width * (1 - i / steps) + 0.8;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    // lanceolate olive leaves in loose pairs
    if (i > 1) {
      for (const side of [-1, 1]) {
        if (rand() < 0.2) continue;
        const la = a + side * (0.5 + rand() * 0.45);
        const len = 20 + rand() * 18;
        const cx = nx + Math.cos(la) * len * 0.5;
        const cy = ny + Math.sin(la) * len * 0.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, len * 0.5, 3 + rand() * 2.2, la, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (depth > 0 && i > 2 && rand() < 0.22) {
      branch(ctx, rand, nx, ny, a + (rand() > 0.5 ? 1 : -1) * (0.5 + rand() * 0.5), length * 0.45, width * 0.6, depth - 1);
    }
    px = nx;
    py = ny;
  }
}

/** One layer of branches, drawn sharp in a single colour on a transparent sheet. */
function layer(size: number, seed: number, count: number, colour: string) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = colour;
  ctx.strokeStyle = colour;
  const rand = mulberry32(seed);
  for (let i = 0; i < count; i++) {
    const edge = rand();
    const x = edge < 0.5 ? size * (0.55 + rand() * 0.5) : size * rand();
    const y = edge < 0.5 ? -20 : size * (0.1 + rand() * 0.4);
    const a = edge < 0.5 ? Math.PI * (0.55 + rand() * 0.3) : Math.PI * (0.8 + rand() * 0.4);
    branch(ctx, rand, x, y, a, size * (0.45 + rand() * 0.3), 6, 2);
  }
  return c;
}

const SIZE = 768;

/**
 * The shadow mask in two steps (one per layer, a frame between them in the
 * scene's build): near branches crisp in red, far ones soft in green, added
 * onto one black sheet. The blur runs on the canvas (GPU-backed), the result
 * goes to WebGL as a canvas: no pixel read-back and no per-pixel JS loop,
 * which used to cost 40 to 130 ms of main thread in one piece.
 */
export function leafSheet() {
  const out = document.createElement("canvas");
  out.width = out.height = SIZE;
  const o = out.getContext("2d")!;
  o.fillStyle = "#000";
  o.fillRect(0, 0, SIZE, SIZE);
  o.globalCompositeOperation = "lighter";
  return { out, o };
}

export function addLeafLayer(sheet: ReturnType<typeof leafSheet>, near: boolean) {
  const l = near ? layer(SIZE, 3, 5, "#f00") : layer(SIZE, 11, 7, "#0f0");
  sheet.o.filter = `blur(${near ? 2.5 : 9}px)`;
  sheet.o.drawImage(l, 0, 0);
  sheet.o.filter = "none";
  l.width = l.height = 0;
}

export function leafTexture(sheet: ReturnType<typeof leafSheet>) {
  const tex = new THREE.CanvasTexture(sheet.out);
  // same orientation as the old pixel-array texture (rows top down)
  tex.flipY = false;
  tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}
