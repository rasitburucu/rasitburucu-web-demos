import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { baseHeight, ground, HALF, lampHours, padAt, PLINTH_DEPTH, SLAB, stepped, villaSites, WORLD, type Tree, type VillaSite } from "@/lib/onikitas/site";
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
    const h = ground(b, w, ph);
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

// kind: 0 limewash, 1 travertine, 2 (windows), 3 oak, 4 rubble stone
type Part = { w: number; h: number; d: number; x: number; y: number; z: number; kind: number; round?: boolean };

const S = SLAB; // terrace slab thickness (top of the slab = floor level)

/** Parts of one house in its local frame, from its seeded programme. */
function massing(v: VillaSite) {
  const P = v.plan;
  const r = mulberry32(1000 + Math.floor(v.seed * 1e6));
  const solid: Part[] = [];
  const windows: Part[] = [];
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, kind: number, round = false) =>
    solid.push({ w, h, d, x, y, z, kind, round });

  // stone plinth under the whole pad: its faces are the terrace retaining walls
  box(P.pad.hx * 2, PLINTH_DEPTH, P.pad.hz * 2, 0, -PLINTH_DEPTH / 2, 0, 4);

  // travertine terrace around the pool opening
  const { x0: sx0, x1: sx1, z0: sz0, z1: sz1 } = P.slab;
  const px0 = P.pool.x - P.pool.w / 2;
  const px1 = P.pool.x + P.pool.w / 2;
  const pz0 = P.pool.z - P.pool.d / 2;
  const pz1 = P.pool.z + P.pool.d / 2;
  const slab = (x0: number, x1: number, z0: number, z1: number) => {
    if (x1 - x0 > 0.01 && z1 - z0 > 0.01) box(x1 - x0, S, z1 - z0, (x0 + x1) / 2, S / 2, (z0 + z1) / 2, 1);
  };
  slab(sx0, px0, sz0, sz1);
  slab(px1, sx1, sz0, sz1);
  slab(px0, px1, pz1, sz1);
  slab(px0, px1, sz0, pz0);
  box(P.pool.w, 0.06, P.pool.d, P.pool.x, 0.03, P.pool.z, 1);

  // limewashed blocks
  const M = P.main;
  box(M.w, M.h, M.d, M.x, S + M.h / 2, M.z, 0, true);
  if (P.wing) box(P.wing.w, P.wing.h, P.wing.d, P.wing.x, S + P.wing.h / 2, P.wing.z, 0, true);
  const roofY = S + M.h;
  const U = P.upper;
  if (U) box(U.w, U.h, U.d, U.x, roofY + U.h / 2, U.z, 0, true);
  // roof edge: a parapet round a roof terrace, otherwise a thin eave
  const pt = 0.12;
  if (P.roofTerrace) {
    const ph = 0.3 + r() * 0.12;
    box(M.w, ph, pt, M.x, roofY + ph / 2, M.z + M.d / 2 - pt / 2, 0);
    box(pt, ph, M.d, M.x + M.w / 2 - pt / 2, roofY + ph / 2, M.z, 0);
    box(pt, ph, M.d, M.x - M.w / 2 + pt / 2, roofY + ph / 2, M.z, 0);
    if (!U) {
      box(M.w, ph, pt, M.x, roofY + ph / 2, M.z - M.d / 2 + pt / 2, 0);
      // stair head on a single-storey roof terrace
      const kx = M.x + (r() < 0.5 ? -1 : 1) * (M.w / 2 - 0.65);
      box(1.05, 1.05, 1.0, kx, roofY + 0.525, M.z - M.d / 2 + 0.62, 0, true);
    }
  } else {
    box(M.w + 0.16, 0.08, M.d + 0.16, M.x, roofY + 0.04, M.z, 0);
  }
  if (U) box(U.w + 0.12, 0.07, U.d + 0.12, U.x, roofY + U.h + 0.035, U.z, 0);
  if (P.wing) box(P.wing.w + 0.12, 0.07, P.wing.d + 0.12, P.wing.x, S + P.wing.h + 0.035, P.wing.z, 0);

  // Bodrum chimneys with their little caps, on the highest roof
  const top = U ?? M;
  const topY = U ? roofY + U.h : roofY;
  const first = r() < 0.5 ? -1 : 1;
  for (let i = 0; i < P.chimneys; i++) {
    const side = i === 0 ? first : -first;
    const cx = top.x + side * (top.w / 2 - 0.4);
    const cz = top.z - top.d / 2 + 0.45 + r() * 0.5;
    const ch = 0.62 + r() * 0.25;
    box(0.36, ch, 0.36, cx, topY + ch / 2, cz, 0);
    box(0.62, 0.08, 0.62, cx, topY + ch + 0.04, cz, 0);
  }

  // low garden wall along the terrace edge with a gap for the steps, and one side
  const wk = P.wallStone ? 4 : 0;
  const wh = P.wallH;
  const gapW = 1.1;
  const gapX = P.pool.x > (sx0 + sx1) / 2 ? sx0 + 0.9 + gapW / 2 : sx1 - 0.9 - gapW / 2;
  const fw = (x0: number, x1: number) => {
    if (x1 - x0 > 0.2) box(x1 - x0, wh, 0.24, (x0 + x1) / 2, S + wh / 2, sz1 - 0.12, wk);
  };
  fw(sx0, gapX - gapW / 2);
  fw(gapX + gapW / 2, sx1);
  const wallSide = P.wing ? -Math.sign(P.wing.x - M.x) : r() < 0.5 ? -1 : 1;
  const wx = wallSide < 0 ? sx0 + 0.12 : sx1 - 0.12;
  const wd = (sz1 - sz0) * (0.55 + r() * 0.45);
  box(0.24, wh, wd, wx, S + wh / 2, sz1 - wd / 2, wk);

  // oak pergola over the terrace: its slats draw striped shadows
  if (P.pergola) {
    const { x0: gx0, x1: gx1, z0: gz0, z1: gz1 } = P.pergola;
    const gh = 1.7 + r() * 0.15;
    for (const x of [gx0, gx1]) box(0.13, gh, 0.13, x, S + gh / 2, gz1, 3);
    for (const z of [gz0 + 0.07, gz1]) box(gx1 - gx0 + 0.3, 0.12, 0.14, (gx0 + gx1) / 2, S + gh + 0.06, z, 3);
    const slats = Math.max(5, Math.round((gx1 - gx0) / 0.42));
    for (let i = 0; i <= slats; i++) {
      const x = gx0 + ((gx1 - gx0) * i) / slats;
      box(0.09, 0.07, gz1 - gz0 + 0.4, x, S + gh + 0.155, (gz0 + gz1) / 2, 3);
    }
  }

  // windows on the sea facade, in this house's own rhythm
  const fz = M.z + M.d / 2 + 0.01;
  const { n: wn, w: ww, h: whh } = P.windows;
  const span = M.w - 1.0;
  const sill = whh > 1 ? 0.62 : 0.85;
  const doorAt = Math.floor(r() * wn);
  for (let i = 0; i < wn; i++) {
    const x = M.x - span / 2 + (span * (i + 0.5)) / wn;
    const door = i === doorAt && ww < 0.7;
    const h = door ? 1.5 : whh;
    windows.push({ w: ww, h, d: 0.04, x, y: S + (door ? 0.02 : sill - 0.4) + h / 2, z: fz, kind: 2 });
  }
  if (U) {
    const two = U.w > 3.1 && r() < 0.6;
    for (const k of two ? [-0.5, 0.5] : [0]) {
      windows.push({ w: two ? 0.55 : 1.1, h: two ? 0.95 : 0.7, d: 0.04, x: U.x + k * U.w * 0.5, y: roofY + 0.9, z: U.z + U.d / 2 + 0.01, kind: 2 });
    }
  }
  if (P.wing) windows.push({ w: 0.6, h: 1.0, d: 0.04, x: P.wing.x, y: S + 0.72, z: P.wing.z + P.wing.d / 2 + 0.01, kind: 2 });
  // a door-height opening on a side face for night silhouettes
  const sideX = P.wing ? -Math.sign(P.wing.x - M.x) : 1;
  windows.push({ w: 0.04, h: 1.3, d: 0.7, x: M.x + sideX * (M.w / 2 + 0.01), y: S + 0.8, z: M.z + 0.4, kind: 2 });

  const pool = { w: P.pool.w, d: P.pool.d, x: P.pool.x, y: S - 0.07, z: P.pool.z };
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
  m.compose(
    new THREE.Vector3(v.x, v.y, v.z),
    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), v.rot),
    new THREE.Vector3(1, 1, 1),
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
  for (const v of villaSites) {
    const m = villaMatrix(v);
    const { solid, windows, pool } = massing(v);
    for (const p of solid) solids.push(withAttrs(partGeometry(p).applyMatrix4(m), { aKind: p.kind, aVilla: v.index }));
    const { on, off } = lampHours(v);
    for (const p of windows) wins.push(withAttrs(partGeometry(p).applyMatrix4(m), { aOn: on, aOff: off, aVilla: v.index }));
    const pg = new THREE.PlaneGeometry(pool.w, pool.d);
    pg.rotateX(-Math.PI / 2);
    pg.translate(pool.x, pool.y, pool.z);
    const png = pg.toNonIndexed();
    pg.dispose();
    png.applyMatrix4(m);
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
