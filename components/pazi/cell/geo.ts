// Geometry helpers: soft-edged primitives so highlights roll over edges the way
// they do on cast and machined parts (hard 90° edges read as toys).

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/** Cylinder along Y with rounded rims (radius c), as a lathe. */
export function roundCyl(R: number, h: number, c = Math.min(R, h) * 0.18, seg = 40) {
  const pts: THREE.Vector2[] = [];
  const steps = 5;
  pts.push(new THREE.Vector2(0, -h / 2));
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(R - c + Math.sin(a) * c, -h / 2 + c - Math.cos(a) * c));
  }
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(R - c + Math.cos(a) * c, h / 2 - c + Math.sin(a) * c));
  }
  pts.push(new THREE.Vector2(0, h / 2));
  const g = new THREE.LatheGeometry(pts, seg);
  g.computeVertexNormals();
  return g;
}

/** Tapered tube along +X from 0 to len. */
export function tubeX(r0: number, r1: number, len: number, seg = 36) {
  const g = new THREE.CylinderGeometry(r1, r0, len, seg, 1, false);
  g.rotateZ(-Math.PI / 2);
  g.translate(len / 2, 0, 0);
  return g;
}

export const axisZ = (g: THREE.BufferGeometry) => g.rotateX(Math.PI / 2);
export const axisX = (g: THREE.BufferGeometry) => g.rotateZ(Math.PI / 2);

export function rbox(w: number, h: number, d: number, r = 0.004, seg = 2) {
  return new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2.1, h / 2.1, d / 2.1));
}

export function mesh(g: THREE.BufferGeometry, m: THREE.Material | THREE.Material[], cast = true, receive = true) {
  const o = new THREE.Mesh(g, m);
  o.castShadow = cast;
  o.receiveShadow = receive;
  return o;
}

/** Pillow shape for a filled bag: full height in the middle, pinched seams at the ends. */
export function pillowGeometry(w: number, h: number, d: number) {
  const g = new THREE.BoxGeometry(w, h, d, 14, 4, 18);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const nx = (v.x / w) * 2;
    const ny = (v.y / h) * 2;
    const nz = (v.z / d) * 2;
    const fx = 1 - Math.pow(Math.abs(nx), 4);
    const fz = 1 - Math.pow(Math.abs(nz), 3);
    const thick = 0.28 + 0.72 * Math.sqrt(Math.max(0, fx * fz));
    v.y = ny * (h / 2) * thick;
    // sides bow out a little at mid height
    const bulge = 1 + 0.035 * (1 - ny * ny) * thick;
    v.x *= bulge;
    v.z *= 1 + 0.02 * (1 - ny * ny) * thick;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/** Outline of a rounded rectangle as a flat strip (floor tape), lying on XZ. */
export function roundRectStrip(w: number, d: number, r: number, width: number, seg = 10) {
  const outer = new THREE.Shape();
  const inner = new THREE.Path();
  const rr = (s: THREE.Path, W: number, D: number, R: number) => {
    const x = -W / 2;
    const y = -D / 2;
    s.moveTo(x + R, y);
    s.lineTo(x + W - R, y);
    s.absarc(x + W - R, y + R, R, -Math.PI / 2, 0, false);
    s.lineTo(x + W, y + D - R);
    s.absarc(x + W - R, y + D - R, R, 0, Math.PI / 2, false);
    s.lineTo(x + R, y + D);
    s.absarc(x + R, y + D - R, R, Math.PI / 2, Math.PI, false);
    s.lineTo(x, y + R);
    s.absarc(x + R, y + R, R, Math.PI, Math.PI * 1.5, false);
  };
  rr(outer, w + width, d + width, r + width / 2);
  rr(inner, w - width, d - width, Math.max(0.001, r - width / 2));
  outer.holes.push(inner);
  const g = new THREE.ShapeGeometry(outer, seg);
  g.rotateX(-Math.PI / 2);
  // UVs along the perimeter are not needed for a plain tape colour; keep planar UVs scaled for texture repeat
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 4, uv.getY(i) * 4);
  return g;
}

/** Straight strip on the floor from a to b (XZ), with the texture running along it. */
export function stripGeometry(ax: number, az: number, bx: number, bz: number, width: number, texLen = 0.5) {
  const len = Math.hypot(bx - ax, bz - az);
  const g = new THREE.PlaneGeometry(len, width);
  g.rotateX(-Math.PI / 2);
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * (len / texLen));
  g.rotateY(-Math.atan2(bz - az, bx - ax));
  g.translate((ax + bx) / 2, 0, (az + bz) / 2);
  return g;
}
