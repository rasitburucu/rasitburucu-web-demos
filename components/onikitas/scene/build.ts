import * as THREE from "three";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { baseHeight, ground, HALF, padAt, quant, STEP, STEP_OFF, WORLD, type Tree } from "@/lib/onikitas/site";
import { mulberry32 } from "@/lib/onikitas/noise";

// ---------- terrain ----------

/**
 * The real hillside: one height-field sheet. In the clay hours it is hidden
 * (the shader discards it behind the reveal front) and the contour maquette
 * below shows instead; the maquette never rises above it, so as the front
 * sweeps the real ground simply covers the model.
 * Also returns the heights as a texture for the houses' contact shading.
 */
export function buildTerrain(seg: number) {
  const geo = new THREE.PlaneGeometry(WORLD, WORLD, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const count = pos.count;
  const pad = new Float32Array(count);
  const heights = new Uint16Array(count);
  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const [w, ph] = padAt(x, z);
    const h = ground(baseHeight(x, z), w, ph);
    pos.setY(i, h);
    pad[i] = w;
    heights[i] = THREE.DataUtils.toHalfFloat(h);
  }
  geo.computeVertexNormals();
  geo.setAttribute("aPad", new THREE.BufferAttribute(pad, 1));
  geo.computeBoundingSphere();
  // PlaneGeometry rows run from -z to +z after the rotation, matching a
  // texture's v from 0 to 1; texel centres sit on the vertices
  const n = seg + 1;
  const tex = new THREE.DataTexture(heights, n, n, THREE.RedFormat, THREE.HalfFloatType);
  tex.magFilter = tex.minFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return { geo, ground: tex, texels: n };
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
    // far hills inland (east) of the site rise higher, like the Bodrum ridge
    const inland = Math.max(0, -z - HALF) / 200;
    h += inland * 55 * (0.6 + 0.4 * Math.sin(x * 0.012 + 1.3));
    pos.setY(i, inside ? h - 2.5 : h);
  }
  geo.computeVertexNormals();
  geo.setAttribute("aPad", new THREE.BufferAttribute(new Float32Array(count), 1));
  return geo;
}

// ---------- contour maquette ----------

/** Foot of the maquette's board edge, below the deepest sea floor. */
const BOARD_FOOT = -12.5;

type V3 = [number, number, number];

/**
 * The architect's model: the same ground cut into stacked contour sheets, each
 * STEP thick, with flat tops and vertical cut edges, and the board's own edge
 * showing every layer. Built by slicing each grid triangle into the bands
 * between contour levels (flat at the band's level) plus a riser along each
 * contour crossing. Every point lies at or under the real ground (quant).
 */
export function buildMaquette(seg: number) {
  const n = seg + 1;
  const cell = WORLD / seg;
  const H = new Float32Array(n * n);
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const x = -HALF + i * cell;
      const z = -HALF + j * cell;
      const [w, ph] = padAt(x, z);
      H[j * n + i] = ground(baseHeight(x, z), w, ph);
    }

  const P: number[] = [];
  const N: number[] = [];
  const push = (a: V3, b: V3, c: V3, nx: number, ny: number, nz: number) => {
    // wind counter-clockwise around the given normal
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
    if (cx * nx + cy * ny + cz * nz < 0) [b, c] = [c, b];
    P.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    for (let k = 0; k < 3; k++) N.push(nx, ny, nz);
  };
  const lvl = (k: number) => STEP_OFF + k * STEP;

  // clip a polygon (x, h, z) to h >= t (keepAbove) or h <= t
  const clip = (poly: V3[], t: number, keepAbove: boolean) => {
    const out: V3[] = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      const ina = keepAbove ? a[1] >= t : a[1] <= t;
      const inb = keepAbove ? b[1] >= t : b[1] <= t;
      if (ina) out.push(a);
      if (ina !== inb) {
        const f = (t - a[1]) / (b[1] - a[1]);
        out.push([a[0] + (b[0] - a[0]) * f, t, a[2] + (b[2] - a[2]) * f]);
      }
    }
    return out;
  };

  const tri = (a: V3, b: V3, c: V3) => {
    const lo = Math.min(a[1], b[1], c[1]);
    const hi = Math.max(a[1], b[1], c[1]);
    const k0 = Math.floor((lo - STEP_OFF) / STEP);
    const k1 = Math.floor((hi - STEP_OFF) / STEP);
    // horizontal gradient of the triangle's plane: risers face downhill
    const e1x = b[0] - a[0], e1h = b[1] - a[1], e1z = b[2] - a[2];
    const e2x = c[0] - a[0], e2h = c[1] - a[1], e2z = c[2] - a[2];
    const det = e1x * e2z - e2x * e1z;
    let gx = 0;
    let gz = 0;
    if (Math.abs(det) > 1e-9) {
      gx = (e1h * e2z - e2h * e1z) / det;
      gz = (e1x * e2h - e2x * e1h) / det;
    }
    const gl = Math.hypot(gx, gz) || 1;
    const rx = -gx / gl;
    const rz = -gz / gl;
    for (let k = k0; k <= k1; k++) {
      const y = lvl(k);
      let band: V3[] = [a, b, c];
      if (k > k0) band = clip(band, y, true);
      if (k < k1) band = clip(band, lvl(k + 1), false);
      if (band.length >= 3) {
        const flat = band.map((v): V3 => [v[0], y, v[2]]);
        for (let i = 1; i + 1 < flat.length; i++) push(flat[0], flat[i], flat[i + 1], 0, 1, 0);
      }
      if (k > k0) {
        // the contour where the ground crosses this level: a cut edge one layer high
        const cut: V3[] = [];
        for (const [p, q] of [
          [a, b],
          [b, c],
          [c, a],
        ] as [V3, V3][]) {
          if (p[1] < y !== q[1] < y) {
            const f = (y - p[1]) / (q[1] - p[1]);
            cut.push([p[0] + (q[0] - p[0]) * f, y, p[2] + (q[2] - p[2]) * f]);
          }
        }
        if (cut.length === 2) {
          const [p, q] = cut;
          const lo2 = y - STEP;
          push([p[0], lo2, p[2]], [q[0], lo2, q[2]], [q[0], y, q[2]], rx, 0, rz);
          push([p[0], lo2, p[2]], [q[0], y, q[2]], [p[0], y, p[2]], rx, 0, rz);
        }
      }
    }
  };

  const at = (i: number, j: number): V3 => [-HALF + i * cell, H[j * n + i], -HALF + j * cell];
  for (let j = 0; j < seg; j++)
    for (let i = 0; i < seg; i++) {
      const a = at(i, j);
      const b = at(i + 1, j);
      const c = at(i, j + 1);
      const d = at(i + 1, j + 1);
      tri(a, c, b);
      tri(b, c, d);
    }

  // the board's edge: a vertical wall down each side whose top follows the
  // stepped profile, sampled finely so every layer shows as its own course
  const edge = (x0: number, z0: number, x1: number, z1: number, nx: number, nz: number) => {
    const steps = Math.ceil(Math.hypot(x1 - x0, z1 - z0) / (cell / 4));
    let px = x0;
    let pz = z0;
    for (let s = 1; s <= steps; s++) {
      const f = s / steps;
      const qx = x0 + (x1 - x0) * f;
      const qz = z0 + (z1 - z0) * f;
      const mx = (px + qx) / 2;
      const mz = (pz + qz) / 2;
      const [w, ph] = padAt(mx, mz);
      const top = quant(ground(baseHeight(mx, mz), w, ph));
      push([px, BOARD_FOOT, pz], [qx, BOARD_FOOT, qz], [qx, top, qz], nx, 0, nz);
      push([px, BOARD_FOOT, pz], [qx, top, qz], [px, top, pz], nx, 0, nz);
      px = qx;
      pz = qz;
    }
  };
  edge(-HALF, HALF, HALF, HALF, 0, 1);
  edge(HALF, -HALF, -HALF, -HALF, 0, -1);
  edge(HALF, HALF, HALF, -HALF, 1, 0);
  edge(-HALF, -HALF, -HALF, HALF, -1, 0);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(N, 3));
  geo.computeBoundingSphere();
  return geo;
}

// Villas: see ./villa.ts

// ---------- olive trees ----------

// An olive is not a ball on a stick: a short leaning trunk forks into two or
// three limbs, each carrying its own loose clump of foliage with sky between
// them. Each clump is a jittered low-poly blob (80 triangles); the whole tree
// is ~530 triangles, under half the old four-sphere crown. `aCl` tags every
// vertex: -1 bark, 0..1 a per-clump shade the material uses for variety.

type Clump = [x: number, y: number, z: number, r: number, shade: number];
const CLUMPS: Clump[] = [
  // west limb
  [-0.4, 0.98, 0.12, 0.5, 0.25],
  [-0.69, 0.9, -0.12, 0.3, 0.1],
  // east limb, a little lower
  [0.42, 0.92, -0.1, 0.46, 0.8],
  [0.63, 1.04, 0.2, 0.28, 0.95],
  // crown over the fork
  [0.02, 1.32, -0.02, 0.44, 0.55],
  [-0.14, 1.45, 0.24, 0.27, 0.4],
];
// limbs from the fork towards the clumps they carry
const FORK: [x: number, y: number, z: number] = [0.04, 0.58, 0.02];
const LIMBS: [x: number, y: number, z: number][] = [
  [-0.38, 0.92, 0.1],
  [0.4, 0.86, -0.08],
  [0.03, 1.2, -0.02],
];

function tag(g: THREE.BufferGeometry, v: number) {
  g.setAttribute("aCl", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count).fill(v), 1));
  return g;
}

function limb(from: THREE.Vector3, to: THREE.Vector3, r0: number, r1: number, sides: number) {
  const len = from.distanceTo(to);
  const g = new THREE.CylinderGeometry(r1, r0, len, sides, 1, true);
  g.translate(0, len / 2, 0);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
  g.applyQuaternion(q);
  g.translate(from.x, from.y, from.z);
  return g;
}

export function buildTreeGeometry() {
  const r = mulberry32(77);
  const parts: THREE.BufferGeometry[] = [];
  // trunk leans a touch and forks low, like an old grove tree
  const base = new THREE.Vector3(0, 0, 0);
  const fork = new THREE.Vector3(...FORK);
  parts.push(limb(base, fork, 0.15, 0.1, 6));
  for (const [x, y, z] of LIMBS) parts.push(limb(fork, new THREE.Vector3(x, y, z), 0.075, 0.045, 5));
  const bark = parts.map((g) => tag(g.toNonIndexed(), -1));
  parts.forEach((g) => g.dispose());

  const leaves: THREE.BufferGeometry[] = [];
  for (const [x, y, z, s, shade] of CLUMPS) {
    const ico = new THREE.IcosahedronGeometry(s, 1);
    ico.deleteAttribute("normal");
    ico.deleteAttribute("uv");
    const g = mergeVertices(ico);
    ico.dispose();
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      // ragged outline: every vertex pushed in or out on its own
      const k = 0.78 + r() * 0.4;
      p.setXYZ(i, p.getX(i) * k * 1.1, p.getY(i) * k * 0.8, p.getZ(i) * k * 1.1);
    }
    g.translate(x, y, z);
    g.computeVertexNormals();
    const ng = g.toNonIndexed();
    g.dispose();
    leaves.push(tag(ng, shade));
  }
  const all = [...bark, ...leaves].map((g) => {
    if (!g.attributes.normal) g.computeVertexNormals();
    if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    return g;
  });
  const merged = mergeGeometries(all)!;
  all.forEach((g) => g.dispose());
  return merged;
}

export function treeMatrices(trees: Tree[]) {
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  return trees.map((t) => {
    q.setFromAxisAngle(up, t.r);
    // a wider or narrower spread per tree, from values the tree already has
    const spread = 0.86 + 0.28 * ((t.r * 2.713 + t.k * 5.17) % 1);
    m.compose(new THREE.Vector3(t.x, t.y - 0.05, t.z), q, new THREE.Vector3(t.s * spread, t.s * (0.9 + t.k * 0.25), t.s * (1.9 - spread)));
    return m.clone();
  });
}
