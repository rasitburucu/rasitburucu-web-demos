import * as THREE from "three";
import { chapters, smooth } from "@/lib/onikitas/chapters";
import { FOCUS, villaLocal, villaSites } from "@/lib/onikitas/site";

// Camera choreography. One key per chapter boundary; chapter i travels from
// key i to key i+1 along a Catmull-Rom spline. Chapter 0 is the wall: the camera
// starts inside a limewashed room and passes through an arched opening.

const F = new THREE.Vector3(FOCUS.x, FOCUS.y, FOCUS.z);
const off = (base: THREE.Vector3, x: number, y: number, z: number) => base.clone().add(new THREE.Vector3(x, y, z));
// öğle drops onto Villa VII's terrace, framed from its front right, in its own frame
const V7 = villaSites[6];
const P7 = V7.plan;
const local7 = (x: number, y: number, z: number) => new THREE.Vector3(...villaLocal(V7, x, y, z));
const v7Terrace = local7(P7.pool.x * 0.55, 0.6, (P7.main.z + P7.main.d / 2 + P7.slab.z1) / 2);
const v7Camera = local7(P7.pool.x * 0.55 + 9, 8.5, P7.slab.z1 + 11);

type Key = { pos: THREE.Vector3; tgt: THREE.Vector3 };

// keys[i] = camera at the START of chapter i (i >= 1); keys[7] = end of the day
const keys: Key[] = [
  { pos: new THREE.Vector3(), tgt: new THREE.Vector3() }, // chapter 0 is custom
  { pos: off(F, 30, 13, 98), tgt: off(F, -2, 5, -10) }, // sabah: the cove from the sea
  { pos: off(F, -36, 17, 84), tgt: off(F, 2, 3, -8) }, // kuşluk: wide, the sweep crosses
  { pos: off(F, -6, 20, 88), tgt: off(F, 1, 2, -8) }, // kuşluk end: the whole hillside turned real
  { pos: v7Camera, tgt: v7Terrace }, // öğle: down to VII's terrace
  { pos: off(F, 40, 10, 42), tgt: off(F, 4, 0, -8) }, // ikindi end: low, through the olives
  { pos: off(F, -30, 11, 62), tgt: off(F, 4, 3, -8) }, // akşam: dial hold, side light
  // night, wide and high, aimed above the village: the houses sit in the lower
  // half of the frame and the title gets the dark hill above them
  { pos: off(F, 2, 36, 132), tgt: off(F, 2, 12, -10) },
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

/** Tangent of half the landscape camera's vertical field of view (38deg). */
const TAN_HALF = Math.tan((19 * Math.PI) / 180);

export function cameraGoal(chapter: number, t: number, out: { pos: THREE.Vector3; tgt: THREE.Vector3 }, sel: number, selected: number, portrait = false, aspect = 1.6) {
  if (chapter <= 0) {
    // hold on the wall while the title reads, then walk through the arch
    const a = smooth(0, 0.3, t);
    const b = ease(THREE.MathUtils.clamp((t - 0.3) / 0.7, 0, 1));
    // landscape: step back on squarer screens so the arch (1.12 wide) never
    // takes more than a third of the width, and keep it centred at ~79% of
    // the width at any aspect, clear of the title on the left
    const d0 = portrait ? 3.6 : Math.max(3.1, 4.9 / aspect);
    const dist = t < 0.3 ? d0 - 0.35 * a : THREE.MathUtils.lerp(d0 - 0.35, -7, b);
    const shift = portrait ? -0.08 : -0.574 * TAN_HALF * aspect * d0;
    // landscape: arch to the right of the title; portrait: arch below it
    const ox = shift * (1 - smooth(0.3, 0.62, t));
    const oy = (portrait ? 0.95 : -0.06) * (1 - smooth(0.3, 0.62, t));
    out.pos.copy(WF.wall).addScaledVector(WF.dir, -dist).addScaledVector(WF.right, ox).addScaledVector(WF.up, oy);
    out.tgt.copy(out.pos).addScaledVector(WF.dir, 10);
    // after the arch, ease the aim onto the chapter-1 target
    const blend = smooth(0.7, 1, t);
    out.tgt.lerp(keys[1].tgt, blend);
    return out;
  }
  const c = Math.min(chapter, chapters.length - 1);
  const span = c === 5 ? [0, 0.4] : c === 3 ? [0, 0.55] : c === 6 ? [0, 0.55] : [0, 1];
  const local = smooth(span[0], span[1], t);
  const u = THREE.MathUtils.clamp((c - 1 + local) / (keys.length - 2), 0, 1);
  posCurve.getPointAt(u, out.pos);
  tgtCurve.getPointAt(u, out.tgt);
  if (c === 6) {
    // night holds: once the lamps are lit, a slow drift closer, under the stars
    const drift = smooth(0.5, 1, t);
    out.pos.add(tmp.set(0, -1 * drift, -7 * drift));
    out.tgt.y += 1.2 * drift;
  }
  if (sel > 0.001 && selected >= 0) {
    const v = villaSites[selected];
    tmp.set(v.x, v.y + 1.2, v.z);
    out.tgt.lerp(tmp, 0.35 * sel);
  }
  return out;
}

