// Materials and procedural textures for the cell. Every texture is drawn on a
// canvas at start-up: no downloads, no third-party images.

import * as THREE from "three";

export const COLORS = {
  floor: "#b2b3ad",
  page: "#d6d7d1",
  paint: "#ececE8",
  capDark: "#2a2d2f",
  graphite: "#151615",
  yellow: "#f5a800",
  cardboard: "#c19a6b",
  wood: "#c9ad86",
};

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

// Small deterministic PRNG so textures look the same on every load.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tex(c: HTMLCanvasElement, srgb = true, repeat = false) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.needsUpdate = true;
  return t;
}

/** Epoxy-coated concrete: speckle, faint trowel swirls, wheel-worn patches. */
export function floorTextures() {
  const N = 1024;
  const [c, x] = canvas(N, N);
  const r = rng(7);
  x.fillStyle = COLORS.floor;
  x.fillRect(0, 0, N, N);
  // broad mottling
  for (let i = 0; i < 260; i++) {
    const px = r() * N;
    const py = r() * N;
    const rad = 40 + r() * 140;
    const g = x.createRadialGradient(px, py, 0, px, py, rad);
    const a = 0.012 + r() * 0.018;
    const dark = r() > 0.5;
    g.addColorStop(0, dark ? `rgba(90,92,86,${a})` : `rgba(255,255,250,${a})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g;
    x.fillRect(px - rad, py - rad, rad * 2, rad * 2);
  }
  // aggregate speckle
  for (let i = 0; i < 26000; i++) {
    const v = r();
    x.fillStyle = v > 0.5 ? `rgba(60,62,58,${0.05 + r() * 0.12})` : `rgba(255,255,255,${0.05 + r() * 0.1})`;
    const s = r() < 0.92 ? 1 : 2;
    x.fillRect(r() * N, r() * N, s, s);
  }
  // trowel arcs
  x.lineWidth = 1;
  for (let i = 0; i < 70; i++) {
    x.strokeStyle = `rgba(80,82,76,${0.02 + r() * 0.03})`;
    x.beginPath();
    const cx = r() * N;
    const cy = r() * N;
    x.arc(cx, cy, 60 + r() * 200, r() * 6, r() * 6 + 0.6 + r());
    x.stroke();
  }
  const map = tex(c, true, true);

  // roughness: glossier where traffic polished it
  const [c2, y] = canvas(256, 256);
  const r2 = rng(11);
  y.fillStyle = "rgb(150,150,150)";
  y.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 90; i++) {
    const px = r2() * 256;
    const py = r2() * 256;
    const rad = 10 + r2() * 50;
    const g = y.createRadialGradient(px, py, 0, px, py, rad);
    const v = r2() > 0.5 ? 110 : 185;
    g.addColorStop(0, `rgba(${v},${v},${v},0.5)`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    y.fillStyle = g;
    y.fillRect(px - rad, py - rad, rad * 2, rad * 2);
  }
  const rough = tex(c2, false, true);

  // alpha: the floor fades into the page so the canvas has no edge
  const [c3, z] = canvas(256, 256);
  const g = z.createRadialGradient(128, 128, 30, 128, 128, 128);
  g.addColorStop(0, "#fff");
  g.addColorStop(0.55, "#fff");
  g.addColorStop(1, "#000");
  z.fillStyle = g;
  z.fillRect(0, 0, 256, 256);
  const alpha = tex(c3, false);
  return { map, rough, alpha };
}

/** Diagonal black/yellow hazard tape. */
export function hazardTexture() {
  const [c, x] = canvas(256, 32);
  x.fillStyle = COLORS.yellow;
  x.fillRect(0, 0, 256, 32);
  x.fillStyle = "#1a1b1a";
  for (let i = -2; i < 12; i++) {
    x.beginPath();
    x.moveTo(i * 32, 32);
    x.lineTo(i * 32 + 16, 32);
    x.lineTo(i * 32 + 48, 0);
    x.lineTo(i * 32 + 32, 0);
    x.closePath();
    x.fill();
  }
  // worn edges
  const r = rng(3);
  for (let i = 0; i < 500; i++) {
    x.fillStyle = `rgba(205,206,200,${0.25 + r() * 0.4})`;
    x.fillRect(r() * 256, r() < 0.5 ? r() * 3 : 29 + r() * 3, 1 + r() * 2, 1);
  }
  const t = tex(c, true, true);
  return t;
}

/** Yellow floor tape with scuffs. */
export function tapeTexture() {
  const [c, x] = canvas(512, 16);
  x.fillStyle = COLORS.yellow;
  x.fillRect(0, 0, 512, 16);
  const r = rng(5);
  for (let i = 0; i < 700; i++) {
    x.fillStyle = r() > 0.6 ? `rgba(120,90,20,${0.12 + r() * 0.2})` : `rgba(255,240,200,${0.1 + r() * 0.2})`;
    x.fillRect(r() * 512, r() * 16, 1 + r() * 4, 1);
  }
  return tex(c, true, true);
}

/** Corrugated cardboard: base, fibres, a strip of brown tape on the top face, handling marks on the sides. */
export function cardboardMaterials() {
  const r = rng(21);
  const base = (w: number, h: number) => {
    const [c, x] = canvas(w, h);
    x.fillStyle = COLORS.cardboard;
    x.fillRect(0, 0, w, h);
    for (let i = 0; i < w * h * 0.06; i++) {
      x.fillStyle = r() > 0.5 ? `rgba(120,86,50,${0.04 + r() * 0.06})` : `rgba(235,205,160,${0.04 + r() * 0.06})`;
      x.fillRect(r() * w, r() * h, 1 + r() * 3, 1);
    }
    return [c, x] as const;
  };
  // top: tape along the length (texture v axis)
  const [ct, xt] = base(256, 256);
  xt.fillStyle = "rgba(150,110,62,0.9)";
  xt.fillRect(100, 0, 56, 256);
  xt.fillStyle = "rgba(255,230,190,0.18)";
  xt.fillRect(104, 0, 3, 256);
  xt.fillStyle = "rgba(90,60,30,0.25)";
  xt.fillRect(100, 0, 1, 256);
  xt.fillRect(155, 0, 1, 256);
  // flap seam across the middle
  xt.fillStyle = "rgba(80,56,30,0.35)";
  xt.fillRect(0, 127, 100, 2);
  xt.fillRect(156, 127, 100, 2);
  const top = tex(ct);

  // side: tape wraps over the edge + "this side up" arrows + a label patch
  const [cs, xs] = base(256, 256);
  xs.fillStyle = "rgba(150,110,62,0.9)";
  xs.fillRect(100, 0, 56, 46);
  xs.fillStyle = "rgba(30,30,28,0.78)";
  const arrow = (ax: number, ay: number) => {
    xs.beginPath();
    xs.moveTo(ax, ay);
    xs.lineTo(ax + 9, ay + 12);
    xs.lineTo(ax + 4, ay + 12);
    xs.lineTo(ax + 4, ay + 26);
    xs.lineTo(ax - 4, ay + 26);
    xs.lineTo(ax - 4, ay + 12);
    xs.lineTo(ax - 9, ay + 12);
    xs.closePath();
    xs.fill();
  };
  arrow(36, 70);
  arrow(58, 70);
  xs.fillStyle = "rgba(244,242,236,0.92)";
  xs.fillRect(150, 150, 76, 52);
  xs.fillStyle = "rgba(30,30,28,0.7)";
  for (let i = 0; i < 18; i++) xs.fillRect(156 + i * 3.6, 176, r() > 0.4 ? 2 : 1, 20);
  xs.fillRect(156, 158, 40, 4);
  xs.fillRect(156, 166, 26, 3);
  const side = tex(cs);

  const [cb] = base(64, 64);
  const plain = tex(cb);

  const mk = (map: THREE.Texture) => new THREE.MeshStandardMaterial({ map, roughness: 0.86, metalness: 0 });
  // BoxGeometry group order: +x, -x, +y, -y, +z, -z
  const sideM = mk(side);
  const plainM = mk(plain);
  const topM = mk(top);
  return [plainM, sideM, topM, plainM, sideM, plainM];
}

/** Woven polypropylene bag: weave + a printed band. */
export function bagMaterial() {
  const [c, x] = canvas(256, 256);
  x.fillStyle = "#ebe9e2";
  x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 3) {
    x.fillStyle = "rgba(170,168,160,0.18)";
    x.fillRect(i, 0, 1, 256);
    x.fillRect(0, i, 256, 1);
  }
  x.fillStyle = "rgba(70,74,70,0.85)";
  x.fillRect(0, 96, 256, 34);
  x.fillStyle = "rgba(235,233,226,0.9)";
  x.fillRect(18, 106, 60, 6);
  x.fillRect(18, 116, 38, 5);
  x.fillStyle = "rgba(245,168,0,0.85)";
  x.fillRect(200, 100, 26, 26);
  return new THREE.MeshStandardMaterial({ map: tex(c), roughness: 0.78, metalness: 0 });
}

/** Shrink-wrapped bottle pack: caps on top, bottle bands on the sides, glossy film. */
export function shrinkMaterials() {
  const [ct, xt] = canvas(256, 256);
  xt.fillStyle = "#9fb7c2";
  xt.fillRect(0, 0, 256, 256);
  // 2 × 3 bottles seen from above (texture u = width, v = length)
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 2; j++) {
      const cx = 64 + j * 128;
      const cy = 43 + i * 85;
      xt.fillStyle = "#e8eef0";
      xt.beginPath();
      xt.arc(cx, cy, 30, 0, Math.PI * 2);
      xt.fill();
      xt.fillStyle = "#2f6f8f";
      xt.beginPath();
      xt.arc(cx, cy, 13, 0, Math.PI * 2);
      xt.fill();
    }
  const [cs, xs] = canvas(256, 256);
  const grd = xs.createLinearGradient(0, 0, 256, 0);
  for (let i = 0; i <= 6; i++) {
    grd.addColorStop(i / 6, i % 2 ? "#b8ccd4" : "#8fa9b5");
  }
  xs.fillStyle = grd;
  xs.fillRect(0, 0, 256, 256);
  xs.fillStyle = "rgba(255,255,255,0.85)";
  xs.fillRect(0, 120, 256, 46);
  xs.fillStyle = "rgba(47,111,143,0.9)";
  xs.fillRect(0, 132, 256, 10);
  const mk = (c: HTMLCanvasElement) => new THREE.MeshPhysicalMaterial({ map: tex(c), roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.25 });
  const top = mk(ct);
  const side = mk(cs);
  return [side, side, top, side, side, side];
}

/** Pallet timber. */
export function woodMaterial() {
  const [c, x] = canvas(512, 64);
  const r = rng(31);
  x.fillStyle = COLORS.wood;
  x.fillRect(0, 0, 512, 64);
  for (let i = 0; i < 90; i++) {
    x.strokeStyle = `rgba(${120 + r() * 30},${90 + r() * 20},${55},${0.08 + r() * 0.14})`;
    x.lineWidth = 0.5 + r() * 1.5;
    x.beginPath();
    const y0 = r() * 64;
    x.moveTo(0, y0);
    for (let k = 0; k <= 8; k++) x.lineTo(k * 64, y0 + Math.sin(k + r() * 2) * 2);
    x.stroke();
  }
  for (let i = 0; i < 4; i++) {
    x.fillStyle = "rgba(100,70,40,0.25)";
    x.beginPath();
    x.ellipse(r() * 512, r() * 64, 6 + r() * 6, 2 + r() * 2, 0, 0, Math.PI * 2);
    x.fill();
  }
  const t = tex(c, true, true);
  return new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 });
}

/** Text label for the robot's upper arm ("PAZI P20"). Drawn once the brand font is ready. */
export function labelTexture(model: string) {
  const [c, x] = canvas(512, 128);
  x.clearRect(0, 0, 512, 128);
  x.fillStyle = "#1b1c1b";
  x.font = `800 72px "Pazi Archivo", "Arial Black", sans-serif`;
  x.textBaseline = "middle";
  // stretch horizontally to imitate the expanded cut
  x.save();
  x.scale(1.18, 1);
  x.fillText("PAZI", 8, 66);
  x.restore();
  x.fillStyle = "#6a6d68";
  x.font = `500 44px "Pazi Mono", monospace`;
  x.fillText(model, 330, 68);
  x.fillStyle = COLORS.yellow;
  x.fillRect(300, 30, 8, 72);
  return tex(c);
}

/** The operator's tablet screen shows the current layer plan. */
export function screenCanvas() {
  const [c, x] = canvas(256, 160);
  return { canvas: c, ctx: x, texture: tex(c) };
}

export function makeMaterials() {
  return {
    paint: new THREE.MeshPhysicalMaterial({ color: COLORS.paint, roughness: 0.46, metalness: 0, clearcoat: 0.18, clearcoatRoughness: 0.5 }),
    capDark: new THREE.MeshStandardMaterial({ color: COLORS.capDark, roughness: 0.62, metalness: 0.05 }),
    capRing: new THREE.MeshStandardMaterial({ color: "#9a9ea2", roughness: 0.28, metalness: 1 }),
    metal: new THREE.MeshStandardMaterial({ color: "#b9bcbf", roughness: 0.3, metalness: 1 }),
    alu: new THREE.MeshStandardMaterial({ color: "#c7cacc", roughness: 0.42, metalness: 0.85 }),
    anodized: new THREE.MeshStandardMaterial({ color: "#3d4145", roughness: 0.42, metalness: 0.7 }),
    graphitePaint: new THREE.MeshStandardMaterial({ color: "#34383a", roughness: 0.55, metalness: 0.2 }),
    /** Robot pedestal and lift column: the same matte white family as the arm, a shade greyer so the two read apart. */
    pedestal: new THREE.MeshStandardMaterial({ color: "#c9cbc6", roughness: 0.62, metalness: 0.05 }),
    rubber: new THREE.MeshStandardMaterial({ color: "#1d1e1f", roughness: 0.82 }),
    foam: new THREE.MeshStandardMaterial({ color: "#232425", roughness: 0.95 }),
    hose: new THREE.MeshStandardMaterial({ color: "#2b2e30", roughness: 0.5 }),
    scanner: new THREE.MeshStandardMaterial({ color: COLORS.yellow, roughness: 0.5 }),
    glassDark: new THREE.MeshStandardMaterial({ color: "#0d0e0e", roughness: 0.15, metalness: 0.5 }),
    led: new THREE.MeshStandardMaterial({ color: "#1e1f1f", emissive: new THREE.Color("#5fd38a"), emissiveIntensity: 1.6, roughness: 0.4 }),
    roller: new THREE.MeshStandardMaterial({ color: "#aeb2b5", roughness: 0.25, metalness: 1 }),
    frame: new THREE.MeshStandardMaterial({ color: "#c3c6c8", roughness: 0.38, metalness: 0.8 }),
    tape: new THREE.MeshStandardMaterial({ map: tapeTexture(), roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
    hazard: new THREE.MeshStandardMaterial({ map: hazardTexture(), roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
    marker: new THREE.MeshStandardMaterial({ color: "#151615", roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }),
  };
}

export type Mats = ReturnType<typeof makeMaterials>;
