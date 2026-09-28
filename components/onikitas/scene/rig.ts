import * as THREE from "three";
import { chapters, smooth } from "@/lib/onikitas/chapters";
import { FOCUS, villaSites } from "@/lib/onikitas/site";

// Camera choreography. One key per chapter boundary; chapter i travels from
// key i to key i+1 along a Catmull-Rom spline. Chapter 0 is the wall: the camera
// starts inside a limewashed room and passes through an arched opening.

const F = new THREE.Vector3(FOCUS.x, FOCUS.y, FOCUS.z);
const V7 = villaSites[6];
const v7 = new THREE.Vector3(V7.x, V7.y, V7.z);
const off = (base: THREE.Vector3, x: number, y: number, z: number) => base.clone().add(new THREE.Vector3(x, y, z));
const rot = (x: number, z: number, a: number) => [x * Math.cos(a) + z * Math.sin(a), -x * Math.sin(a) + z * Math.cos(a)];
const [c7x, c7z] = rot(9, 14, V7.rot);

type Key = { pos: THREE.Vector3; tgt: THREE.Vector3 };

// keys[i] = camera at the START of chapter i (i >= 1); keys[7] = end of the day
const keys: Key[] = [
  { pos: new THREE.Vector3(), tgt: new THREE.Vector3() }, // chapter 0 is custom
  { pos: off(F, 30, 13, 98), tgt: off(F, -2, 5, -10) }, // sabah: the cove from the sea
  { pos: off(F, -36, 17, 84), tgt: off(F, 2, 3, -8) }, // kuşluk: wide, the sweep crosses
  { pos: off(F, -6, 20, 88), tgt: off(F, 1, 2, -8) }, // kuşluk end: the whole hillside turned real
  { pos: off(v7, c7x, 8.5, c7z), tgt: off(v7, -0.8, 0.6, 0.6) }, // öğle: down to VII's terrace
  { pos: off(F, 40, 10, 42), tgt: off(F, 4, 0, -8) }, // ikindi end: low, through the olives
  { pos: off(F, -30, 11, 62), tgt: off(F, 4, 3, -8) }, // akşam: dial hold, side light
  { pos: off(F, 4, 30, 108), tgt: off(F, 0, 0, -10) }, // night, wide
];

const posCurve = new THREE.CatmullRomCurve3(keys.slice(1).map((k) => k.pos), false, "centripetal");
const tgtCurve = new THREE.CatmullRomCurve3(keys.slice(1).map((k) => k.tgt), false, "centripetal");

export function wallFrame() {
  const k1 = keys[1];
  const dir = k1.tgt.clone().sub(k1.pos).normalize();
  const wall = k1.pos.clone().addScaledVector(dir, -7);
  const right = dir.clone().cross(new THREE.Vector3(0, 1, 0)).normalize();
  const up = right.clone().cross(dir).normalize();
  return { dir, wall, right, up };
}
const WF = wallFrame();

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const tmp = new THREE.Vector3();

export function cameraGoal(chapter: number, t: number, out: { pos: THREE.Vector3; tgt: THREE.Vector3 }, sel: number, selected: number, portrait = false) {
  if (chapter <= 0) {
    // hold on the wall while the title reads, then walk through the arch
    const a = smooth(0, 0.3, t);
    const b = ease(THREE.MathUtils.clamp((t - 0.3) / 0.7, 0, 1));
    const d0 = portrait ? 3.6 : 3.1;
    const dist = t < 0.3 ? d0 - 0.35 * a : THREE.MathUtils.lerp(d0 - 0.35, -7, b);
    // landscape: arch to the right of the title; portrait: arch below it
    const ox = (portrait ? -0.08 : -0.98) * (1 - smooth(0.3, 0.62, t));
    const oy = (portrait ? 0.95 : -0.06) * (1 - smooth(0.3, 0.62, t));
    out.pos.copy(WF.wall).addScaledVector(WF.dir, -dist).addScaledVector(WF.right, ox).addScaledVector(WF.up, oy);
    out.tgt.copy(out.pos).addScaledVector(WF.dir, 10);
    // after the arch, ease the aim onto the chapter-1 target
    const blend = smooth(0.7, 1, t);
    out.tgt.lerp(keys[1].tgt, blend);
    return out;
  }
  const c = Math.min(chapter, chapters.length - 1);
  const span = c === 5 ? [0, 0.4] : c === 3 ? [0, 0.55] : [0, 1];
  const local = smooth(span[0], span[1], t);
  const u = THREE.MathUtils.clamp((c - 1 + local) / (keys.length - 2), 0, 1);
  posCurve.getPointAt(u, out.pos);
  tgtCurve.getPointAt(u, out.tgt);
  if (sel > 0.001 && selected >= 0) {
    const v = villaSites[selected];
    tmp.set(v.x, v.y + 1.2, v.z);
    out.tgt.lerp(tmp, 0.35 * sel);
  }
  return out;
}

