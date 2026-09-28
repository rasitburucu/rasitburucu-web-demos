import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { baseHeight, HALF, padAt, stepped, villaSites, WORLD, type Tree, type VillaSite } from "@/lib/onikitas/site";
import { mulberry32 } from "@/lib/onikitas/noise";

// ---------- terrain ----------

export function buildTerrain(seg: number) {
  const geo = new THREE.PlaneGeometry(WORLD, WORLD, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const count = pos.count;
  const stepY = new Float32Array(count);
  const pad = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const b = baseHeight(x, z);
    const [w, ph] = padAt(x, z);
    const h = b + (ph - b) * w;
    pos.setY(i, h);
    stepY[i] = stepped(h, w);
    pad[i] = w;
  }
  geo.computeVertexNormals();
  const stepGeo = geo.clone();
  const sp = stepGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < count; i++) sp.setY(i, stepY[i]);
  stepGeo.computeVertexNormals();
  geo.setAttribute("aStepY", new THREE.BufferAttribute(stepY, 1));
  geo.setAttribute("aStepN", (stepGeo.attributes.normal as THREE.BufferAttribute).clone());
  geo.setAttribute("aPad", new THREE.BufferAttribute(pad, 1));
  stepGeo.dispose();
  geo.computeBoundingSphere();
  return geo;
}

/** Coarse hills that carry the landscape to the horizon around the maquette. */
export function buildBackdrop() {
  const size = 1400;
  const seg = 90;
  const geo = new THREE.PlaneGeometry(size, size, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const count = pos.count;
  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const inside = Math.max(Math.abs(x), Math.abs(z)) < HALF - 2;
    let h = baseHeight(x, z);
    // far hills north of the site rise higher, like the Bodrum ridge
    const north = Math.max(0, -z - HALF) / 200;
    h += north * 55 * (0.6 + 0.4 * Math.sin(x * 0.012 + 1.3));
    pos.setY(i, inside ? h - 2.5 : h);
  }
  geo.computeVertexNormals();
  geo.setAttribute("aStepY", new THREE.BufferAttribute(Float32Array.from({ length: count }, (_, i) => pos.getY(i)), 1));
  geo.setAttribute("aStepN", (geo.attributes.normal as THREE.BufferAttribute).clone());
  geo.setAttribute("aPad", new THREE.BufferAttribute(new Float32Array(count), 1));
  return geo;
}

// ---------- villas ----------

type Part = { w: number; h: number; d: number; x: number; y: number; z: number; kind: number; round?: boolean };

const S = 0.3; // terrace slab thickness (top of the slab = floor level)

function massing(v: VillaSite) {
  const r = mulberry32(1000 + v.index);
  const solid: Part[] = [];
  const windows: Part[] = [];
  const hasWing = r() > 0.22;
  const upperShift = (r() - 0.5) * 1.4;
  const tall = 1.85 + r() * 0.25;

  // terrace slab around a pool opening (x -4.4..0, z 1.35..3.05)
  const px0 = -4.4, px1 = 0, pz0 = 1.35, pz1 = 3.05;
  const sx0 = -5.2, sx1 = 5.2, sz0 = -3.9, sz1 = 4.6;
  const slab = (x0: number, x1: number, z0: number, z1: number) =>
    solid.push({ w: x1 - x0, h: S, d: z1 - z0, x: (x0 + x1) / 2, y: S / 2, z: (z0 + z1) / 2, kind: 1 });
  slab(sx0, px0, sz0, sz1);
  slab(px1, sx1, sz0, sz1);
  slab(px0, px1, pz1, sz1);
  slab(px0, px1, sz0, pz0);
  // pool basin floor
  solid.push({ w: px1 - px0, h: 0.06, d: pz1 - pz0, x: (px0 + px1) / 2, y: 0.03, z: (pz0 + pz1) / 2, kind: 1 });

  // main mass, upper room, wing
  const main = { w: 5.2, h: tall, d: 3.7, x: -1.5, z: -1.85 };
  solid.push({ ...main, y: S + main.h / 2, kind: 0, round: true });
  const up = { w: 3.1, h: 1.65, d: 2.9, x: -2.2 + upperShift, z: -2.25 };
  solid.push({ ...up, y: S + main.h + up.h / 2, kind: 0, round: true });
  const roofY = S + main.h;
  // parapet around the main roof terrace
  const pt = 0.12, ph = 0.3;
  solid.push({ w: main.w, h: ph, d: pt, x: main.x, y: roofY + ph / 2, z: main.z + main.d / 2 - pt / 2, kind: 0 });
  solid.push({ w: pt, h: ph, d: main.d, x: main.x + main.w / 2 - pt / 2, y: roofY + ph / 2, z: main.z, kind: 0 });
  solid.push({ w: pt, h: ph, d: main.d, x: main.x - main.w / 2 + pt / 2, y: roofY + ph / 2, z: main.z, kind: 0 });
  // Bodrum chimney with its little cap
  const cx = up.x - up.w / 2 + 0.45;
  const cy = roofY + up.h;
  solid.push({ w: 0.36, h: 0.75, d: 0.36, x: cx, y: cy + 0.375, z: up.z - 0.7, kind: 0 });
  solid.push({ w: 0.62, h: 0.08, d: 0.62, x: cx, y: cy + 0.79, z: up.z - 0.7, kind: 0 });
  if (hasWing) {
    const wg = { w: 2.8, h: 1.6, d: 3.1, x: 2.75, z: -2.15 };
    solid.push({ ...wg, y: S + wg.h / 2, kind: 0, round: true });
    windows.push({ w: 0.6, h: 1.0, d: 0.04, x: wg.x, y: S + 0.72, z: wg.z + wg.d / 2 + 0.01, kind: 2 });
  }
  // low garden walls
  solid.push({ w: sx1 - sx0, h: 0.5, d: 0.22, x: 0, y: S + 0.25, z: sz1 - 0.11, kind: 0 });
  solid.push({ w: 0.22, h: 0.5, d: sz1 - sz0, x: sx0 + 0.11, y: S + 0.25, z: (sz0 + sz1) / 2, kind: 0 });
  // pergola over the terrace: its slats draw striped shadows
  const gx0 = 0.9, gx1 = 4.5, gz0 = 0.15, gz1 = 2.9, gh = 1.75;
  for (const [x, z] of [[gx0, gz0], [gx1, gz0], [gx0, gz1], [gx1, gz1]])
    solid.push({ w: 0.13, h: gh, d: 0.13, x, y: S + gh / 2, z, kind: 3 });
  for (const z of [gz0, gz1]) solid.push({ w: gx1 - gx0 + 0.3, h: 0.12, d: 0.14, x: (gx0 + gx1) / 2, y: S + gh + 0.06, z, kind: 3 });
  for (let i = 0; i < 9; i++) {
    const x = gx0 + ((gx1 - gx0) * i) / 8;
    solid.push({ w: 0.09, h: 0.07, d: gz1 - gz0 + 0.4, x, y: S + gh + 0.155, z: (gz0 + gz1) / 2, kind: 3 });
  }
  // windows on the sea facades
  const fz = main.z + main.d / 2 + 0.01;
  for (const x of [-3.3, -2.05, -0.8]) windows.push({ w: 0.5, h: 1.15, d: 0.04, x, y: S + 0.74, z: fz, kind: 2 });
  windows.push({ w: 1.15, h: 0.7, d: 0.04, x: up.x + 0.3, y: roofY + 0.9, z: up.z + up.d / 2 + 0.01, kind: 2 });
  // a door-height opening on the east face for night silhouettes
  windows.push({ w: 0.04, h: 1.3, d: 0.7, x: main.x + main.w / 2 + 0.01, y: S + 0.8, z: main.z + 0.6, kind: 2 });

  const pool = { w: px1 - px0, d: pz1 - pz0, x: (px0 + px1) / 2, y: S - 0.07, z: (pz0 + pz1) / 2 };
  return { solid, windows, pool };
}

function partGeometry(p: Part) {
  const g = p.round ? new RoundedBoxGeometry(p.w, p.h, p.d, 2, 0.07) : new THREE.BoxGeometry(p.w, p.h, p.d);
  g.translate(p.x, p.y, p.z);
  const ng = g.index ? g.toNonIndexed() : g;
  if (ng !== g) g.dispose();
  return ng;
}

export function villaMatrix(v: VillaSite) {
  const m = new THREE.Matrix4();
  const flip = v.flip ? -1 : 1;
  m.compose(
    new THREE.Vector3(v.x, v.y, v.z),
    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), v.rot),
    new THREE.Vector3(flip, 1, 1),
  );
  return m;
}

function withAttrs(g: THREE.BufferGeometry, attrs: Record<string, number>) {
  const n = g.attributes.position.count;
  for (const [name, val] of Object.entries(attrs)) g.setAttribute(name, new THREE.BufferAttribute(new Float32Array(n).fill(val), 1));
  return g;
}

export function buildVillas() {
  const solids: THREE.BufferGeometry[] = [];
  const wins: THREE.BufferGeometry[] = [];
  const pools: THREE.BufferGeometry[] = [];
  // lamps come on one by one after sunset; a few are still on at dawn
  const order = [3, 8, 0, 10, 5, 1, 11, 6, 2, 9, 4, 7];
  for (const v of villaSites) {
    const m = villaMatrix(v);
    const flipped = v.flip;
    const { solid, windows, pool } = massing(v);
    for (const p of solid) {
      const g = partGeometry(p).applyMatrix4(m);
      if (flipped) flipWinding(g);
      solids.push(withAttrs(g, { aKind: p.kind, aVilla: v.index }));
    }
    const on = 19.95 + order.indexOf(v.index) * 0.085;
    const off = v.index % 3 === 1 ? 5.78 + v.index * 0.02 : 0;
    for (const p of windows) {
      const g = partGeometry(p).applyMatrix4(m);
      if (flipped) flipWinding(g);
      wins.push(withAttrs(g, { aOn: on, aOff: off, aVilla: v.index }));
    }
    const pg = new THREE.PlaneGeometry(pool.w, pool.d);
    pg.rotateX(-Math.PI / 2);
    pg.translate(pool.x, pool.y, pool.z);
    const png = pg.toNonIndexed();
    pg.dispose();
    png.applyMatrix4(m);
    if (flipped) flipWinding(png);
    pools.push(withAttrs(png, { aVilla: v.index }));
  }
  const solid = mergeGeometries(solids)!;
  const windows = mergeGeometries(wins)!;
  const poolGeo = mergeGeometries(pools)!;
  solids.forEach((g) => g.dispose());
  wins.forEach((g) => g.dispose());
  pools.forEach((g) => g.dispose());
  solid.computeBoundingSphere();
  return { solid, windows, pools: poolGeo };
}

/** Mirroring with a negative scale inverts triangle winding; swap it back. */
function flipWinding(g: THREE.BufferGeometry) {
  const attrs = Object.values(g.attributes) as THREE.BufferAttribute[];
  const n = g.attributes.position.count;
  for (const a of attrs) {
    const s = a.itemSize;
    const arr = a.array as Float32Array;
    for (let i = 0; i < n; i += 3) {
      for (let k = 0; k < s; k++) {
        const t = arr[(i + 1) * s + k];
        arr[(i + 1) * s + k] = arr[(i + 2) * s + k];
        arr[(i + 2) * s + k] = t;
      }
    }
    a.needsUpdate = true;
  }
}

// ---------- olive trees ----------

export function buildTreeGeometry() {
  const r = mulberry32(77);
  const parts: THREE.BufferGeometry[] = [];
  const trunk = new THREE.CylinderGeometry(0.07, 0.12, 0.9, 5, 1);
  trunk.translate(0, 0.45, 0);
  parts.push(trunk.toNonIndexed());
  trunk.dispose();
  const blobs: [number, number, number, number][] = [
    [0, 1.15, 0, 0.72],
    [0.42, 1.0, 0.18, 0.52],
    [-0.36, 1.05, -0.2, 0.55],
    [0.05, 1.45, -0.1, 0.46],
  ];
  for (const [x, y, z, s] of blobs) {
    const ico = new THREE.IcosahedronGeometry(s, 2);
    ico.deleteAttribute("normal");
    ico.deleteAttribute("uv");
    const g = mergeVertices(ico);
    ico.dispose();
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const k = 0.82 + r() * 0.3;
      p.setXYZ(i, p.getX(i) * k * 1.1, p.getY(i) * k * 0.78, p.getZ(i) * k * 1.1);
    }
    g.translate(x, y, z);
    g.computeVertexNormals();
    const ng = g.index ? g.toNonIndexed() : g;
    if (ng !== g) g.dispose();
    parts.push(ng);
  }
  const merged = mergeGeometries(parts.map((g) => {
    if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    return g;
  }))!;
  parts.forEach((g) => g.dispose());
  return merged;
}

export function treeMatrices(trees: Tree[]) {
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  return trees.map((t) => {
    q.setFromAxisAngle(up, t.r);
    m.compose(new THREE.Vector3(t.x, t.y - 0.05, t.z), q, new THREE.Vector3(t.s, t.s * (0.9 + t.k * 0.25), t.s));
    return m.clone();
  });
}
