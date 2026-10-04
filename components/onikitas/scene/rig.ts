import * as THREE from "three";
import { chapters, smooth } from "@/lib/onikitas/chapters";
import { FOCUS, villaSites } from "@/lib/onikitas/site";

// Camera choreography. One key per chapter boundary; chapter i travels from
// key i to key i+1 along a Catmull-Rom spline. Chapter 0 is the wall: the camera
// starts inside a limewashed room and passes through an arched opening.

const F = new THREE.Vector3(FOCUS.x, FOCUS.y, FOCUS.z);
const off = (base: THREE.Vector3, x: number, y: number, z: number) => base.clone().add(new THREE.Vector3(x, y, z));

type Key = { pos: THREE.Vector3; tgt: THREE.Vector3 };

// keys[i] = camera at the START of chapter i (i >= 1); keys[7] = end of the day.
// Every daylight key stays at a middle distance, aimed low enough that the
// shore and a band of sea close the bottom of the frame.
const keys: Key[] = [
  { pos: new THREE.Vector3(), tgt: new THREE.Vector3() }, // chapter 0 is custom
  { pos: off(F, 30, 13, 98), tgt: off(F, -2, 5, -10) }, // sabah: the cove from the sea
  { pos: off(F, -36, 17, 84), tgt: off(F, 2, -2, -4) }, // kuşluk: wide, the sweep crosses
  { pos: off(F, -6, 22, 90), tgt: off(F, 1, -4, -2) }, // kuşluk end: the whole hillside turned real
  { pos: off(F, 22, 16, 64), tgt: off(F, 2, -6, 0) }, // öğle: closer over the village, still the bay
  { pos: off(F, 46, 14, 66), tgt: off(F, 0, -6, 0) }, // ikindi end: from the south, low sun across
  { pos: off(F, -38, 15, 72), tgt: off(F, 4, -4, -2) }, // akşam: dial hold, the sun behind us
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

/**
 * Portrait screens, daylight: the copy takes the top of the frame, so the camera
 * comes closer (DOLLY of the landscape distance) and aims a little higher
 * (LIFT, world units): houses and the shore fill the lower two thirds, with a
 * strip of sea at the very bottom.
 */
const PORTRAIT_DOLLY = 0.7;
const PORTRAIT_LIFT = -1.5;
function portraitFrame(out: { pos: THREE.Vector3; tgt: THREE.Vector3 }, k = 1) {
  const d = THREE.MathUtils.lerp(1, PORTRAIT_DOLLY, k);
  out.pos.sub(out.tgt).multiplyScalar(d).add(out.tgt);
  out.tgt.y += PORTRAIT_LIFT * k;
  return out;
}
const K1_PORTRAIT = portraitFrame({ pos: keys[1].pos.clone(), tgt: keys[1].tgt.clone() });

/** Tangent of half the landscape camera's vertical field of view (38deg). */
const TAN_HALF = Math.tan((19 * Math.PI) / 180);
/** Same for portrait screens (58deg, see Director in Scene.tsx). */
const TAN_HALF_PORTRAIT = Math.tan((29 * Math.PI) / 180);

const NIGHT_DRIFT = new THREE.Vector3(0, -1, -7);
/**
 * Portrait night: the share of the all-twelve-houses pullback kept (negative
 * comes closer: the outer houses crop, the windows read), and how far the aim
 * rises so the slope, not open water, fills the bottom under the title.
 */
const NIGHT_FIT = -0.4;
const NIGHT_LIFT = 13;
/** World radius kept around each house centre when fitting the night frame. */
const HOUSE_R = 4.5;

/**
 * Narrow portrait screens: how far the night camera has to back away from its
 * aim so all twelve houses fit across the width (with a margin). 0 when they
 * already fit, so wide screens keep the authored frame. Memoised per aspect.
 */
const nightFit = new Map<number, number>();
function nightPullback(aspect: number) {
  const key = Math.round(aspect * 100);
  const hit = nightFit.get(key);
  if (hit !== undefined) return hit;
  const k = keys[keys.length - 1];
  const pos = k.pos.clone().add(NIGHT_DRIFT);
  const tgt = k.tgt.clone();
  tgt.y += 1.2;
  const fwd = tgt.clone().sub(pos).normalize();
  const right = fwd.clone().cross(new THREE.Vector3(0, 1, 0)).normalize();
  const tanH = TAN_HALF_PORTRAIT * aspect * 0.93;
  let need = 0;
  const d = new THREE.Vector3();
  for (const v of villaSites) {
    d.set(v.x, v.y, v.z).sub(pos);
    const lateral = Math.abs(d.dot(right)) + HOUSE_R;
    const depth = d.dot(fwd);
    need = Math.max(need, lateral / tanH - depth);
  }
  nightFit.set(key, need);
  return need;
}

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
    if (portrait) {
      out.pos.lerp(K1_PORTRAIT.pos, blend);
      out.tgt.lerp(K1_PORTRAIT.tgt, blend);
    } else out.tgt.lerp(keys[1].tgt, blend);
    return out;
  }
  const c = Math.min(chapter, chapters.length - 1);
  const span = c === 5 ? [0, 0.4] : c === 3 ? [0, 0.55] : c === 6 ? [0, 0.55] : [0, 1];
  const local = smooth(span[0], span[1], t);
  const u = THREE.MathUtils.clamp((c - 1 + local) / (keys.length - 2), 0, 1);
  // by curve parameter, not arc length: chapter i lands exactly on key i + 1
  posCurve.getPoint(u, out.pos);
  tgtCurve.getPoint(u, out.tgt);
  if (c === 6) {
    // night holds: once the lamps are lit, a slow drift closer, under the stars
    const drift = smooth(0.5, 1, t);
    out.pos.addScaledVector(NIGHT_DRIFT, drift);
    out.tgt.y += 1.2 * drift;
    // portrait: back away along the view line until most houses are in frame
    // (the outermost may crop), and aim lower so lit windows, not open water,
    // fill the bottom of the tall frame
    if (portrait) {
      const back = nightPullback(aspect) * NIGHT_FIT;
      out.pos.addScaledVector(tmp.copy(out.pos).sub(out.tgt).normalize(), back * local);
      out.tgt.y += NIGHT_LIFT * local;
    }
  }
  // portrait daylight: closer, the village under the copy (eased out at night)
  if (portrait) portraitFrame(out, c < 5 ? 1 : c === 5 ? 1 - smooth(0.6, 1, t) : 0);
  if (sel > 0.001 && selected >= 0) {
    const v = villaSites[selected];
    tmp.set(v.x, v.y + 1.2, v.z);
    out.tgt.lerp(tmp, 0.35 * sel);
  }
  return out;
}

