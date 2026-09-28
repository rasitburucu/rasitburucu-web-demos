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

function layer(size: number, seed: number, blur: number, count: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.filter = `blur(${blur}px)`;
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  const rand = mulberry32(seed);
  for (let i = 0; i < count; i++) {
    const edge = rand();
    const x = edge < 0.5 ? size * (0.55 + rand() * 0.5) : size * rand();
    const y = edge < 0.5 ? -20 : size * (0.1 + rand() * 0.4);
    const a = edge < 0.5 ? Math.PI * (0.55 + rand() * 0.3) : Math.PI * (0.8 + rand() * 0.4);
    branch(ctx, rand, x, y, a, size * (0.45 + rand() * 0.3), 6, 2);
  }
  return ctx.getImageData(0, 0, size, size).data;
}

export function makeLeafTexture() {
  const size = 768;
  const near = layer(size, 3, 2.5, 5);
  const far = layer(size, 11, 9, 7);
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    data[i * 4] = near[i * 4];
    data[i * 4 + 1] = far[i * 4];
    data[i * 4 + 2] = 0;
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}
