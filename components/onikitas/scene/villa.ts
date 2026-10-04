import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { lampHours, PLINTH_DEPTH, SLAB, villaSites, type VillaSite } from "@/lib/onikitas/site";
import { mulberry32 } from "@/lib/onikitas/noise";

// The twelve houses as architect's models. One material language (limewash
// walls a hand thick, travertine, oak, Bodrum rubble stone, painted shutters,
// terracotta) and one programme per house (lib/onikitas/layout.ts); a seeded
// variant per house picks shutters, stone surrounds, frames, chimney caps,
// pots and terrace furniture, so no two are copies.
//
// Two levels of detail per house, switched by distance (THREE.LOD):
//   far:  massing, walls with real window reveals, glass, shutters, pergola,
//         garden walls, pool coping, terrace steps
//   near: all of that plus frames and mullions, stone surrounds and sills,
//         thresholds, parapet coping and spouts, roof floor, chimney vents and
//         caps, pergola bases, tables, loungers, pool ladder, pots
// Everything is boxes, a rounded box per volume and one lathed pot, written
// straight into typed arrays (no per-part BufferGeometry), so building all
// twelve houses at both levels stays well under one frame budget.

/** Material kinds read by villaMaterial (materials.ts). 2 = glass (own mesh). */
export const KIND = { LIME: 0, TRAV: 1, OAK: 3, STONE: 4, PAINT: 5, DARK: 6, CLAY: 7, LINEN: 8, FRAME: 9 } as const;

/** Depth of a facade wall in front of the core: every window and door sits this far back. */
const T = 0.16;
const S = SLAB;
/** Beyond this camera distance (world units) a house draws its simple level. */
export const LOD_FAR = 42;

type V3 = [number, number, number];

/** Writes boxes and small meshes in a house's local frame into flat arrays. */
class Mesher {
  pos: number[] = [];
  nor: number[] = [];
  kind: number[] = [];
  lp: number[] = [];
  idx: number[] = [];
  private c = 1;
  private s = 0;
  private o: V3 = [0, 0, 0];

  /** Local frame: +z towards the house's view, rotated by `rot`, origin at `o`. */
  frame(rot: number, o: V3) {
    this.c = Math.cos(rot);
    this.s = Math.sin(rot);
    this.o = o;
  }

  private vert(p: V3, n: V3, k: number) {
    const { c, s, o } = this;
    this.pos.push(o[0] + c * p[0] + s * p[2], o[1] + p[1], o[2] - s * p[0] + c * p[2]);
    this.nor.push(c * n[0] + s * n[2], n[1], -s * n[0] + c * n[2]);
    this.kind.push(k);
    this.lp.push(p[0], p[1], p[2]);
    return this.kind.length - 1;
  }

  /** A quad facing `n`, wound counter-clockwise around it whatever the corner order. */
  quad(a: V3, b: V3, c: V3, d: V3, n: V3, k: number) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    const flip = (uy * vz - uz * vy) * n[0] + (uz * vx - ux * vz) * n[1] + (ux * vy - uy * vx) * n[2] < 0;
    const i0 = this.vert(a, n, k);
    const i1 = this.vert(b, n, k);
    const i2 = this.vert(c, n, k);
    const i3 = this.vert(d, n, k);
    if (flip) this.idx.push(i0, i2, i1, i0, i3, i2);
    else this.idx.push(i0, i1, i2, i0, i2, i3);
  }

  /** Axis-aligned box (local frame): size and centre. The bottom face is left out (everything stands on something). */
  box(w: number, h: number, d: number, x: number, y: number, z: number, k: number, bottom = false) {
    if (w <= 0.001 || h <= 0.001 || d <= 0.001) return;
    const x0 = x - w / 2, x1 = x + w / 2, y0 = y - h / 2, y1 = y + h / 2, z0 = z - d / 2, z1 = z + d / 2;
    this.quad([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0], k);
    this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0], k);
    this.quad([x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [0, 1, 0], k);
    if (bottom) this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0], k);
    this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1], k);
    this.quad([x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [0, 0, -1], k);
  }

  /** A box tilted about the local x axis by `a` (radians), pivoting on its lower back edge. */
  tilted(w: number, h: number, d: number, x: number, y: number, z: number, a: number, k: number) {
    const ca = Math.cos(a), sa = Math.sin(a);
    // local box corners about its pivot, then rotated about x
    const P = (px: number, py: number, pz: number): V3 => [x + px, y + py * ca - pz * sa, z + py * sa + pz * ca];
    const N = (nx: number, ny: number, nz: number): V3 => [nx, ny * ca - nz * sa, ny * sa + nz * ca];
    const x0 = -w / 2, x1 = w / 2;
    this.quad(P(x1, 0, 0), P(x1, h, 0), P(x1, h, d), P(x1, 0, d), N(1, 0, 0), k);
    this.quad(P(x0, 0, 0), P(x0, 0, d), P(x0, h, d), P(x0, h, 0), N(-1, 0, 0), k);
    this.quad(P(x0, h, 0), P(x0, h, d), P(x1, h, d), P(x1, h, 0), N(0, 1, 0), k);
    this.quad(P(x0, 0, 0), P(x1, 0, 0), P(x1, 0, d), P(x0, 0, d), N(0, -1, 0), k);
    this.quad(P(x0, 0, d), P(x1, 0, d), P(x1, h, d), P(x0, h, d), N(0, 0, 1), k);
    this.quad(P(x0, 0, 0), P(x0, h, 0), P(x1, h, 0), P(x1, 0, 0), N(0, 0, -1), k);
  }

  /** A template geometry (indexed or not), scaled and placed at a local point. */
  add(g: THREE.BufferGeometry, x: number, y: number, z: number, scale: number, k: number) {
    const p = g.attributes.position as THREE.BufferAttribute;
    const n = g.attributes.normal as THREE.BufferAttribute;
    const base = this.kind.length;
    for (let i = 0; i < p.count; i++) {
      this.vert([x + p.getX(i) * scale, y + p.getY(i) * scale, z + p.getZ(i) * scale], [n.getX(i), n.getY(i), n.getZ(i)], k);
    }
    const index = g.index;
    if (index) for (let i = 0; i < index.count; i++) this.idx.push(base + index.getX(i));
    else for (let i = 0; i < p.count; i++) this.idx.push(base + i);
  }

  geometry(villa: number) {
    const g = new THREE.BufferGeometry();
    const n = this.kind.length;
    g.setAttribute("position", new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute("aKind", new THREE.Float32BufferAttribute(this.kind, 1));
    g.setAttribute("aLp", new THREE.Float32BufferAttribute(this.lp, 3));
    g.setAttribute("aVilla", new THREE.BufferAttribute(new Float32Array(n).fill(villa), 1));
    g.setIndex(n > 65535 ? new THREE.Uint32BufferAttribute(this.idx, 1) : new THREE.Uint16BufferAttribute(this.idx, 1));
    g.computeBoundingSphere();
    g.computeBoundingBox();
    return g;
  }
}

// ---------- templates ----------

/** Rounded limewash volume: one template per size would be wasteful, so it is built per volume. */
function rounded(m: Mesher, w: number, h: number, d: number, x: number, y: number, z: number) {
  const g = new RoundedBoxGeometry(w, h, d, 2, 0.07);
  m.add(g, x, y, z, 1, KIND.LIME);
  g.dispose();
}

/** A Bodrum terracotta jar, 0.34 tall at scale 1: foot, belly, shoulder, lip. */
let jar: THREE.BufferGeometry | null = null;
function jarGeometry() {
  if (jar) return jar;
  const pts = [
    [0.0, 0.0],
    [0.075, 0.0],
    [0.115, 0.05],
    [0.145, 0.14],
    [0.14, 0.22],
    [0.105, 0.29],
    [0.09, 0.31],
    [0.105, 0.335],
    [0.09, 0.34],
    [0.0, 0.325],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  jar = new THREE.LatheGeometry(pts, 10);
  jar.computeVertexNormals();
  return jar;
}

// ---------- the house ----------

type Opening = { u: number; w: number; y0: number; y1: number; door: boolean; upper: boolean };
/** Which face of a volume: its front (towards the view) or one of its sides. */
type Dir = "z+" | "x+" | "x-";

type Variant = {
  shutters: "none" | "all" | "ground";
  sove: boolean;
  frame: number;
  spouts: number;
  hat: boolean;
  pots: number;
  loungers: boolean;
  table: boolean;
};

function variantOf(v: VillaSite): Variant {
  const r = mulberry32(31 + v.index * 977 + Math.floor(v.seed * 1e5));
  const sh = r();
  return {
    shutters: sh < 0.22 ? "none" : sh < 0.68 ? "all" : "ground",
    sove: r() < 0.62,
    frame: r() < 0.55 ? KIND.OAK : KIND.FRAME,
    spouts: 1 + Math.floor(r() * 2),
    hat: r() < 0.6,
    pots: 3 + Math.floor(r() * 3),
    loungers: r() < 0.85,
    table: r() < 0.75,
  };
}

/** A box given in a face's terms: along the face (u, du), up (y0..y1), out from the face plane (centre o, thickness dn). */
function fbox(m: Mesher, dir: Dir, plane: number, u: number, du: number, y0: number, y1: number, o: number, dn: number, k: number) {
  const h = y1 - y0;
  const y = (y0 + y1) / 2;
  if (dir === "z+") m.box(du, h, dn, u, y, plane + o, k);
  else if (dir === "x+") m.box(dn, h, du, plane + o, y, u, k);
  else m.box(dn, h, du, plane - o, y, u, k);
}

/** The facade wall in front of a core: piers, lintels and the wall under each sill, T deep. */
function wall(m: Mesher, dir: Dir, plane: number, u0: number, u1: number, y0: number, y1: number, ops: Opening[]) {
  let at = u0;
  for (const op of ops.slice().sort((a, b) => a.u - b.u)) {
    const a = op.u - op.w / 2;
    if (a - at > 0.005) fbox(m, dir, plane, (at + a) / 2, a - at, y0, y1, -T / 2, T, KIND.LIME);
    if (op.y0 - y0 > 0.005) fbox(m, dir, plane, op.u, op.w, y0, op.y0, -T / 2, T, KIND.LIME);
    if (y1 - op.y1 > 0.005) fbox(m, dir, plane, op.u, op.w, op.y1, y1, -T / 2, T, KIND.LIME);
    at = op.u + op.w / 2;
  }
  if (u1 - at > 0.005) fbox(m, dir, plane, (at + u1) / 2, u1 - at, y0, y1, -T / 2, T, KIND.LIME);
}

/**
 * One opening: glass at the back of the reveal (always), shutters (always,
 * when the house has them), and on the near level the frame with its mullion
 * and transom, the stone surround, the sill or the threshold.
 */
function opening(
  m: Mesher,
  glass: Mesher | null,
  dir: Dir,
  plane: number,
  op: Opening,
  room: [number, number],
  va: Variant,
  near: boolean,
) {
  const h = op.y1 - op.y0;
  if (glass) fbox(glass, dir, plane, op.u, op.w, op.y0, op.y1, -T + 0.02, 0.04, 2);

  const sw = va.sove ? 0.08 : 0;
  if (va.shutters === "all" || (va.shutters === "ground" && !op.upper)) {
    // two leaves: folded flat against the wall where the piers are wide
    // enough, otherwise standing open at right angles to it
    const lw = op.w / 2 + 0.015;
    const st = 0.035;
    for (const side of [-1, 1]) {
      const free = side < 0 ? room[0] : room[1];
      const edge = op.u + side * (op.w / 2 + sw);
      if (free >= lw + sw + 0.03) fbox(m, dir, plane, edge + side * (lw / 2 + 0.008), lw, op.y0, op.y1, (va.sove ? 0.024 : 0) + st / 2 + 0.003, st, KIND.PAINT);
      else fbox(m, dir, plane, edge + side * (st / 2 + 0.004), st, op.y0, op.y1, lw / 2 + 0.002, lw, KIND.PAINT);
    }
  }
  if (!near) return;

  // frame: jambs, head and sill rail just in front of the glass, mullion and transom
  const fb = 0.045;
  const fo = -T + 0.065;
  const fd = 0.05;
  const fk = va.frame;
  fbox(m, dir, plane, op.u - op.w / 2 + fb / 2, fb, op.y0, op.y1, fo, fd, fk);
  fbox(m, dir, plane, op.u + op.w / 2 - fb / 2, fb, op.y0, op.y1, fo, fd, fk);
  fbox(m, dir, plane, op.u, op.w - 2 * fb, op.y1 - fb, op.y1, fo, fd, fk);
  fbox(m, dir, plane, op.u, op.w - 2 * fb, op.y0, op.y0 + fb, fo, fd, fk);
  if (op.w > 0.6 || op.door) fbox(m, dir, plane, op.u, 0.04, op.y0 + fb, op.y1 - fb, fo, fd, fk);
  if (!op.door && h > 1.05) fbox(m, dir, plane, op.u, op.w - 2 * fb, op.y0 + h * 0.7, op.y0 + h * 0.7 + 0.035, fo, fd, fk);
  if (op.door) {
    // panelled lower third, and a travertine threshold out onto the terrace
    fbox(m, dir, plane, op.u, op.w - 2 * fb, op.y0 + fb, op.y0 + h * 0.34, fo - 0.005, fd, fk);
    fbox(m, dir, plane, op.u, op.w + 0.14, op.y0, op.y0 + 0.03, (-T + 0.14) / 2, T + 0.14, KIND.TRAV);
  } else {
    // a travertine sill through the reveal, standing proud of the wall
    fbox(m, dir, plane, op.u, op.w + 0.16, op.y0 - 0.05, op.y0 + 0.012, (-T + 0.075) / 2, T + 0.075, KIND.TRAV);
  }
  if (va.sove) {
    // stone surround: jambs and a deeper lintel stone, a finger proud of the limewash
    const so = 0.012;
    const sd = 0.024;
    fbox(m, dir, plane, op.u - op.w / 2 - sw / 2, sw, op.y0, op.y1, so, sd, KIND.TRAV);
    fbox(m, dir, plane, op.u + op.w / 2 + sw / 2, sw, op.y0, op.y1, so, sd, KIND.TRAV);
    fbox(m, dir, plane, op.u, op.w + 2 * sw + 0.04, op.y1, op.y1 + sw + 0.03, so + 0.004, sd + 0.008, KIND.TRAV);
  }
}

/** Free wall either side of each opening, up to the neighbour's half of the pier. */
function rooms(ops: Opening[], u0: number, u1: number): [number, number][] {
  const sorted = ops.map((o, i) => ({ o, i })).sort((a, b) => a.o.u - b.o.u);
  const out: [number, number][] = ops.map(() => [0, 0]);
  sorted.forEach(({ o, i }, k) => {
    const prev = sorted[k - 1]?.o;
    const next = sorted[k + 1]?.o;
    const l = prev ? (o.u - o.w / 2 - (prev.u + prev.w / 2)) / 2 : o.u - o.w / 2 - u0 - 0.12;
    const r = next ? (next.u - next.w / 2 - (o.u + o.w / 2)) / 2 : u1 - (o.u + o.w / 2) - 0.12;
    out[i] = [l, r];
  });
  return out;
}

type Rect = [x0: number, x1: number, z0: number, z1: number];
const hits = (a: Rect, b: Rect) => a[0] < b[1] && b[0] < a[1] && a[2] < b[3] && b[2] < a[3];

/** Potted olives: local spots (x, y, z, scale), turned into tree instances by the caller. */
export type Olive = { x: number; y: number; z: number; s: number };

/**
 * One house into `m` (solid) and `glass`. `near` adds the fine parts. Every
 * decision comes from the plan, the layout rng (as before) and the variant, so
 * the two levels always agree on what they share.
 */
function house(v: VillaSite, m: Mesher, glass: Mesher | null, near: boolean, olives: Olive[] | null) {
  const P = v.plan;
  const r = mulberry32(1000 + Math.floor(v.seed * 1e6));
  const rd = mulberry32(7000 + v.index * 131);
  const va = variantOf(v);
  const used: Rect[] = [];

  // stone plinth under the whole pad: its faces are the terrace retaining walls
  m.box(P.pad.hx * 2, PLINTH_DEPTH, P.pad.hz * 2, 0, -PLINTH_DEPTH / 2, 0, KIND.STONE);

  // travertine terrace around the pool opening, the pool floor, and its coping
  const { x0: sx0, x1: sx1, z0: sz0, z1: sz1 } = P.slab;
  const px0 = P.pool.x - P.pool.w / 2;
  const px1 = P.pool.x + P.pool.w / 2;
  const pz0 = P.pool.z - P.pool.d / 2;
  const pz1 = P.pool.z + P.pool.d / 2;
  const slab = (x0: number, x1: number, z0: number, z1: number) => {
    if (x1 - x0 > 0.01 && z1 - z0 > 0.01) m.box(x1 - x0, S, z1 - z0, (x0 + x1) / 2, S / 2, (z0 + z1) / 2, KIND.TRAV);
  };
  slab(sx0, px0, sz0, sz1);
  slab(px1, sx1, sz0, sz1);
  slab(px0, px1, pz1, sz1);
  slab(px0, px1, sz0, pz0);
  m.box(P.pool.w, 0.06, P.pool.d, P.pool.x, 0.03, P.pool.z, KIND.TRAV);
  // coping: a rim of travertine round the water, lipped over it
  const cw = 0.15;
  const ch = 0.035;
  m.box(P.pool.w + 2 * cw - 0.06, ch, cw, P.pool.x, S + ch / 2, pz0 - cw / 2 + 0.03, KIND.TRAV);
  m.box(P.pool.w + 2 * cw - 0.06, ch, cw, P.pool.x, S + ch / 2, pz1 + cw / 2 - 0.03, KIND.TRAV);
  m.box(cw, ch, P.pool.d - 0.06, px0 - cw / 2 + 0.03, S + ch / 2, P.pool.z, KIND.TRAV);
  m.box(cw, ch, P.pool.d - 0.06, px1 + cw / 2 - 0.03, S + ch / 2, P.pool.z, KIND.TRAV);
  used.push([px0 - 0.3, px1 + 0.3, pz0 - 0.3, pz1 + 0.3]);
  if (near) {
    // a steel ladder at the end nearest the house
    const lx = P.pool.w > 2.6 ? px1 - 0.45 : px0 + 0.45;
    for (const dx of [-0.13, 0.13]) {
      m.box(0.022, 0.42, 0.022, lx + dx, S - 0.12 + 0.21, pz0 + 0.03, KIND.DARK);
      m.box(0.022, 0.022, 0.16, lx + dx, S + 0.09, pz0 - 0.04, KIND.DARK);
    }
  }

  // ----- the house -----
  const M = P.main;
  const F = M.z + M.d / 2;
  const back = M.z - M.d / 2;
  const xl = M.x - M.w / 2;
  const xr = M.x + M.w / 2;
  const roofY = S + M.h;
  const U = P.upper;
  const W = P.wing;

  // front openings of the main block, in this house's own rhythm
  const { n: wn, w: ww, h: whh } = P.windows;
  const span = M.w - 1.0;
  const sill = whh > 1 ? 0.62 : 0.85;
  const doorAt = Math.floor(r() * wn);
  const front: Opening[] = [];
  for (let i = 0; i < wn; i++) {
    const u = M.x - span / 2 + (span * (i + 0.5)) / wn;
    const door = i === doorAt && ww < 0.7;
    const h = door ? 1.5 : whh;
    const y0 = S + (door ? 0 : sill - 0.4);
    front.push({ u, w: ww, y0, y1: y0 + h, door, upper: false });
  }
  // a door-height opening on the side away from the wing (night silhouettes)
  const sideX = W ? -Math.sign(W.x - M.x) || 1 : 1;
  const sideOp: Opening = { u: M.z + 0.4, w: 0.7, y0: S + 0.15, y1: S + 1.45, door: true, upper: false };
  const sideDir: Dir = sideX > 0 ? "x+" : "x-";
  const sidePlane = sideX > 0 ? xr : xl;

  // the core sits back from the walls that carry openings
  const cx0 = xl + (sideX < 0 ? T : 0);
  const cx1 = xr - (sideX > 0 ? T : 0);
  rounded(m, cx1 - cx0, M.h, F - T - back, (cx0 + cx1) / 2, S + M.h / 2, (back + F - T) / 2);
  wall(m, "z+", F, xl, xr, S, roofY, front);
  wall(m, sideDir, sidePlane, back, F - T, S, roofY, [sideOp]);
  const fr = rooms(front, xl, xr);
  front.forEach((op, i) => opening(m, glass, "z+", F, op, fr[i], va, near));
  opening(m, glass, sideDir, sidePlane, sideOp, [sideOp.u - sideOp.w / 2 - back - 0.1, F - T - (sideOp.u + sideOp.w / 2) - 0.1], { ...va, shutters: "none" }, near);
  const door = front.find((o) => o.door);
  if (door) used.push([door.u - door.w / 2 - 0.1, door.u + door.w / 2 + 0.1, F, F + 0.7]);

  if (W) {
    const FW = W.z + W.d / 2;
    const wop: Opening = { u: W.x, w: 0.6, y0: S + 0.22, y1: S + 1.22, door: false, upper: false };
    rounded(m, W.w, W.h, W.d - T, W.x, S + W.h / 2, W.z - T / 2);
    wall(m, "z+", FW, W.x - W.w / 2, W.x + W.w / 2, S, S + W.h, [wop]);
    opening(m, glass, "z+", FW, wop, [W.w / 2 - 0.42, W.w / 2 - 0.42], va, near);
    m.box(W.w + 0.12, 0.07, W.d + 0.12, W.x, S + W.h + 0.035, W.z, KIND.LIME);
  }

  if (U) {
    const FU = U.z + U.d / 2;
    const two = U.w > 3.1 && r() < 0.6;
    const uops: Opening[] = (two ? [-0.5, 0.5] : [0]).map((k) => {
      const h = two ? 0.95 : 0.7;
      const y0 = roofY + 0.9 - h / 2;
      return { u: U.x + k * U.w * 0.5, w: two ? 0.55 : 1.1, y0, y1: y0 + h, door: false, upper: true };
    });
    rounded(m, U.w, U.h, U.d - T, U.x, roofY + U.h / 2, U.z - T / 2);
    wall(m, "z+", FU, U.x - U.w / 2, U.x + U.w / 2, roofY, roofY + U.h, uops);
    const ur = rooms(uops, U.x - U.w / 2, U.x + U.w / 2);
    uops.forEach((op, i) => opening(m, glass, "z+", FU, op, ur[i], va, near));
  }

  // roof edge: a parapet round a roof terrace, otherwise a thin eave
  const pt = 0.12;
  if (P.roofTerrace) {
    const ph = 0.3 + r() * 0.12;
    // each parapet and its coping stone (copings butt, never overlap: no shared top faces)
    const cap = (w: number, d: number, x: number, z: number, cw: number, cd: number, cz: number) => {
      m.box(w, ph, d, x, roofY + ph / 2, z, KIND.LIME);
      if (near) m.box(cw, 0.035, cd, x, roofY + ph + 0.0175, cz, KIND.TRAV);
    };
    const o = 0.025;
    cap(M.w, pt, M.x, F - pt / 2, M.w + 2 * o, pt + 2 * o, F - pt / 2);
    for (const sx of [xr - pt / 2, xl + pt / 2])
      cap(pt, M.d - pt, sx, M.z - pt / 2, pt + 2 * o, M.d - pt, (back + F - pt) / 2 - o);
    if (!U) cap(M.w - 2 * pt, pt, M.x, back + pt / 2, M.w - 2 * pt - 2 * o, pt + 2 * o, back + pt / 2);
    if (near) {
      // travertine roof floor and the rainwater spouts through the front parapet
      m.box(M.w - 2 * pt, 0.03, M.d - pt - (U ? 0 : pt), M.x, roofY + 0.015, M.z - (U ? pt / 2 : 0), KIND.TRAV);
      for (let i = 0; i < va.spouts; i++) {
        const sx = i === 0 ? xl + 0.55 : xr - 0.55;
        m.box(0.07, 0.05, 0.32, sx, roofY + 0.08, F + 0.1, KIND.TRAV);
      }
    }
    if (!U) {
      // stair head on a single-storey roof terrace, its door to the terrace
      const kx = M.x + (r() < 0.5 ? -1 : 1) * (M.w / 2 - 0.65);
      const kz = back + 0.62;
      m.box(1.05, 1.05, 1.0, kx, roofY + 0.525, kz, KIND.LIME);
      if (near) {
        m.box(0.44, 0.74, 0.02, kx, roofY + 0.03 + 0.37, kz + 0.5 + 0.01, KIND.DARK);
        m.box(1.15, 0.05, 1.1, kx, roofY + 1.075, kz, KIND.LIME);
        // a built-in bench along the back parapet, away from the stair head
        const bw = Math.min(2.2, M.w - 2.0);
        if (bw > 0.8) m.box(bw, 0.2, 0.3, M.x - Math.sign(kx - M.x) * (M.w / 2 - pt - bw / 2 - 0.15), roofY + 0.1, back + pt + 0.15, KIND.LIME);
      }
    }
  } else {
    m.box(M.w + 0.16, 0.08, M.d + 0.16, M.x, roofY + 0.04, M.z, KIND.LIME);
  }
  if (U) m.box(U.w + 0.12, 0.07, U.d + 0.12, U.x, roofY + U.h + 0.035, U.z, KIND.LIME);

  // Bodrum chimneys on the highest roof: shaft, vented head, cap, a small hat
  const top = U ?? M;
  const topY = U ? roofY + U.h : roofY;
  const first = r() < 0.5 ? -1 : 1;
  for (let i = 0; i < P.chimneys; i++) {
    const side = i === 0 ? first : -first;
    const cx = top.x + side * (top.w / 2 - 0.4);
    const cz = top.z - top.d / 2 + 0.45 + r() * 0.5;
    const ch = 0.62 + r() * 0.25;
    if (!near) {
      m.box(0.36, ch, 0.36, cx, topY + ch / 2, cz, KIND.LIME);
      m.box(0.62, 0.08, 0.62, cx, topY + ch + 0.04, cz, KIND.LIME);
      continue;
    }
    const vent = 0.15;
    m.box(0.36, ch - vent - 0.03, 0.36, cx, topY + (ch - vent - 0.03) / 2, cz, KIND.LIME);
    m.box(0.22, vent, 0.22, cx, topY + ch - 0.03 - vent / 2, cz, KIND.DARK);
    for (const [dx, dz] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ])
      m.box(0.09, vent, 0.09, cx + dx * 0.135, topY + ch - 0.03 - vent / 2, cz + dz * 0.135, KIND.LIME);
    m.box(0.56, 0.06, 0.56, cx, topY + ch, cz, KIND.LIME);
    if (va.hat) m.box(0.3, 0.06, 0.3, cx, topY + ch + 0.06, cz, KIND.LIME);
    else m.box(0.62, 0.025, 0.62, cx, topY + ch + 0.04, cz, KIND.TRAV);
  }

  // low garden wall along the terrace edge with a gap for the steps, and one side
  const wk = P.wallStone ? KIND.STONE : KIND.LIME;
  const wh = P.wallH;
  const gapW = 1.1;
  const gapX = P.pool.x > (sx0 + sx1) / 2 ? sx0 + 0.9 + gapW / 2 : sx1 - 0.9 - gapW / 2;
  const gw = (len: number, dep: number, x: number, z: number) => {
    m.box(len, wh, dep, x, S + wh / 2, z, wk);
    if (near) m.box(len + 0.03, 0.04, dep + 0.06, x, S + wh + 0.02, z, P.wallStone ? KIND.TRAV : KIND.LIME);
  };
  const fw = (x0: number, x1: number) => {
    if (x1 - x0 > 0.2) gw(x1 - x0, 0.24, (x0 + x1) / 2, sz1 - 0.12);
  };
  fw(sx0, gapX - gapW / 2);
  fw(gapX + gapW / 2, sx1);
  const wallSide = W ? -Math.sign(W.x - M.x) : r() < 0.5 ? -1 : 1;
  const wx = wallSide < 0 ? sx0 + 0.12 : sx1 - 0.12;
  const wd = (sz1 - sz0) * (0.55 + r() * 0.45);
  gw(0.24, wd, wx, sz1 - wd / 2);
  used.push([gapX - gapW / 2, gapX + gapW / 2, sz1 - 0.9, sz1 + 2]);

  // steps through the gap: one down to the plinth, three more down the
  // retaining wall to the ground, each a solid block of stone with a tread
  const padZ = P.pad.hz;
  m.box(gapW - 0.1, 0.15, 0.24, gapX, 0.075, sz1 + 0.12, KIND.TRAV);
  for (let i = 0; i < 3; i++) {
    const topS = -0.17 * (i + 1);
    const z = padZ + 0.14 + i * 0.28;
    m.box(gapW - 0.1, 1.2 + topS, 0.28, gapX, (topS - 1.2) / 2, z, KIND.STONE);
    if (near) m.box(gapW - 0.06, 0.03, 0.3, gapX, topS + 0.015, z, KIND.TRAV);
  }

  // oak pergola over the terrace: its slats draw striped shadows
  if (P.pergola) {
    const { x0: gx0, x1: gx1, z0: gz0, z1: gz1 } = P.pergola;
    const gh = 1.7 + r() * 0.15;
    for (const x of [gx0, gx1]) {
      m.box(0.13, gh, 0.13, x, S + gh / 2, gz1, KIND.OAK);
      if (near) m.box(0.2, 0.1, 0.2, x, S + 0.05, gz1, KIND.TRAV);
    }
    for (const z of [gz0 + 0.07, gz1]) m.box(gx1 - gx0 + 0.3, 0.12, 0.14, (gx0 + gx1) / 2, S + gh + 0.06, z, KIND.OAK);
    const slats = Math.max(5, Math.round((gx1 - gx0) / 0.42));
    for (let i = 0; i <= slats; i++) {
      const x = gx0 + ((gx1 - gx0) * i) / slats;
      m.box(0.09, 0.07, gz1 - gz0 + 0.4, x, S + gh + 0.155, (gz0 + gz1) / 2, KIND.OAK);
    }
    used.push([gx0 - 0.15, gx1 + 0.15, gz0, gz1 + 0.15]);
    // a long table and two benches in its shade
    if (near && va.table && gx1 - gx0 > 1.5 && gz1 - gz0 > 1.3) {
      const tx = (gx0 + gx1) / 2;
      const tz = (gz0 + gz1) / 2 + 0.05;
      const tl = Math.min(1.2, gx1 - gx0 - 0.5);
      m.box(tl, 0.04, 0.46, tx, S + 0.37, tz, KIND.OAK);
      for (const dx of [-1, 1])
        for (const dz of [-1, 1]) m.box(0.04, 0.35, 0.04, tx + dx * (tl / 2 - 0.08), S + 0.175, tz + dz * 0.17, KIND.OAK);
      for (const dz of [-1, 1]) {
        m.box(tl, 0.035, 0.16, tx, S + 0.22, tz + dz * 0.37, KIND.OAK);
        for (const dx of [-1, 1]) m.box(0.035, 0.2, 0.12, tx + dx * (tl / 2 - 0.1), S + 0.1, tz + dz * 0.37, KIND.OAK);
      }
    }
  }

  if (!near) return;

  // two loungers: behind the pool if there is room, else beside it
  if (va.loungers) {
    const ld = 0.34;
    const ll = 0.92;
    const behind = pz0 - F > 0.95;
    const spots: Rect[] = behind
      ? [-1, 1].map((k): Rect => {
          const x = P.pool.x + k * 0.3;
          return [x - ld / 2, x + ld / 2, pz0 - 0.22 - ll, pz0 - 0.22];
        })
      : [];
    const sideRoom = P.pool.x < (sx0 + sx1) / 2 ? sx1 - (px1 + 0.25) : px0 - 0.25 - sx0;
    if (!behind && sideRoom > ll + 0.4) {
      const k = P.pool.x < (sx0 + sx1) / 2 ? 1 : -1;
      const x = k > 0 ? px1 + 0.3 + ll / 2 : px0 - 0.3 - ll / 2;
      for (const dz of [-0.24, 0.24]) spots.push([x - ll / 2, x + ll / 2, P.pool.z + dz - ld / 2, P.pool.z + dz + ld / 2]);
    }
    for (const sp of spots) {
      if (used.some((u) => hits(u, sp) && u !== used[0])) continue;
      const alongZ = sp[3] - sp[2] > sp[1] - sp[0];
      const cxl = (sp[0] + sp[1]) / 2;
      const czl = (sp[2] + sp[3]) / 2;
      if (alongZ) {
        // head towards the house, feet towards the water
        m.box(ld, 0.1, ll * 0.7, cxl, S + 0.11, czl + ll * 0.15, KIND.OAK);
        m.box(ld - 0.03, 0.045, ll * 0.68, cxl, S + 0.18, czl + ll * 0.15, KIND.LINEN);
        // the back rest rises from the seat towards the head
        m.tilted(ld - 0.03, 0.05, ll * 0.32, cxl, S + 0.2, czl - ll * 0.2, -2.52, KIND.LINEN);
        for (const dz of [-0.36, 0.36]) m.box(ld - 0.04, 0.06, 0.04, cxl, S + 0.03, czl + dz * ll, KIND.OAK);
      } else {
        // a lounger lying along x: build it in a frame turned a quarter
        m.box(ll * 0.7, 0.1, ld, cxl + ll * 0.15, S + 0.11, czl, KIND.OAK);
        m.box(ll * 0.68, 0.045, ld - 0.03, cxl + ll * 0.15, S + 0.18, czl, KIND.LINEN);
        m.box(ll * 0.3, 0.16, ld - 0.03, cxl - ll * 0.33, S + 0.22, czl, KIND.LINEN);
        for (const dx of [-0.36, 0.36]) m.box(0.04, 0.06, ld - 0.04, cxl + dx * ll, S + 0.03, czl, KIND.OAK);
      }
      used.push(sp);
    }
  }

  // jars on the terrace and the roof; the biggest carry a young olive
  const jarG = jarGeometry();
  const spots: [number, number, number][] = [
    [sx0 + 0.42, S, sz1 - 0.42],
    [sx1 - 0.42, S, sz1 - 0.42],
    [xl - 0.3, S, F + 0.3],
    [xr + 0.3, S, F + 0.3],
  ];
  if (door) spots.unshift([door.u - door.w / 2 - 0.3, S, F + 0.22], [door.u + door.w / 2 + 0.3, S, F + 0.22]);
  if (P.roofTerrace) spots.push([xl + pt + 0.25, roofY + 0.03, F - pt - 0.25], [xr - pt - 0.25, roofY + 0.03, F - pt - 0.25]);
  let placed = 0;
  let trees = 0;
  for (const [x, y, z] of spots) {
    if (placed >= va.pots) break;
    const s = 0.85 + rd() * 0.45;
    const rr = 0.15 * s;
    const rect: Rect = [x - rr, x + rr, z - rr, z + rr];
    if (x - rr < sx0 || x + rr > sx1 || z + rr > sz1 - 0.24 || used.some((u) => hits(u, rect))) continue;
    // not inside a volume of the house
    if (y < roofY && x > xl - 0.05 && x < xr + 0.05 && z < F + 0.05) continue;
    if (W && y < roofY && Math.abs(x - W.x) < W.w / 2 + rr && z < W.z + W.d / 2 + rr) continue;
    if (U && y >= roofY && Math.abs(x - U.x) < U.w / 2 + rr && z < U.z + U.d / 2 + rr) continue;
    const big = olives && trees < 2 && y < roofY && s > 1.05;
    const sc = big ? 1.5 : s;
    m.add(jarG, x, y, z, sc, KIND.CLAY);
    if (big) {
      olives.push({ x, y: y + 0.34 * sc - 0.02, z, s: 0.34 + rd() * 0.1 });
      trees++;
    }
    used.push(rect);
    placed++;
  }
}

export type VillaModels = {
  /** Per house: near and far solid geometry, centred on the house (THREE.LOD sits at the house). */
  near: THREE.BufferGeometry[];
  far: THREE.BufferGeometry[];
  windows: THREE.BufferGeometry;
  pools: THREE.BufferGeometry;
  /** World matrices of the potted olives, for the instanced trees. */
  olives: THREE.Matrix4[];
};

function withAttrs(g: THREE.BufferGeometry, attrs: Record<string, number>) {
  const n = g.attributes.position.count;
  for (const [name, val] of Object.entries(attrs)) g.setAttribute(name, new THREE.BufferAttribute(new Float32Array(n).fill(val), 1));
  return g;
}

export function buildVillas(): VillaModels {
  const near: THREE.BufferGeometry[] = [];
  const far: THREE.BufferGeometry[] = [];
  const wins: THREE.BufferGeometry[] = [];
  const pools: THREE.BufferGeometry[] = [];
  const olives: THREE.Matrix4[] = [];
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  for (const v of villaSites) {
    const centred: V3 = [0, 0, 0];
    const mn = new Mesher();
    mn.frame(v.rot, centred);
    const local: Olive[] = [];
    house(v, mn, null, true, local);
    near.push(mn.geometry(v.index));

    const mf = new Mesher();
    mf.frame(v.rot, centred);
    const gl = new Mesher();
    gl.frame(v.rot, [v.x, v.y, v.z]);
    house(v, mf, gl, false, null);
    far.push(mf.geometry(v.index));
    const { on, off } = lampHours(v);
    const wg = gl.geometry(v.index);
    wg.deleteAttribute("aKind");
    wg.deleteAttribute("aLp");
    wins.push(withAttrs(wg, { aOn: on, aOff: off }));

    const P = v.plan;
    const c = Math.cos(v.rot);
    const s = Math.sin(v.rot);
    const pg = new THREE.PlaneGeometry(P.pool.w, P.pool.d);
    pg.rotateX(-Math.PI / 2);
    pg.translate(P.pool.x, S - 0.07, P.pool.z);
    const png = pg.toNonIndexed();
    pg.dispose();
    png.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(v.x, v.y, v.z), q.setFromAxisAngle(up, v.rot), new THREE.Vector3(1, 1, 1)));
    pools.push(withAttrs(png, { aVilla: v.index }));

    for (const o of local) {
      const wx = v.x + c * o.x + s * o.z;
      const wz = v.z - s * o.x + c * o.z;
      olives.push(new THREE.Matrix4().compose(new THREE.Vector3(wx, v.y + o.y, wz), q.setFromAxisAngle(up, v.rot * 3.1 + o.x), new THREE.Vector3(o.s, o.s * 1.05, o.s)));
    }
  }
  const windows = mergeGeometries(wins)!;
  const poolGeo = mergeGeometries(pools)!;
  wins.forEach((g) => g.dispose());
  pools.forEach((g) => g.dispose());
  return { near, far, windows, pools: poolGeo, olives };
}
