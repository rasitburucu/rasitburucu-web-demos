// Point-to-point moves the way a palletizing program runs them: straight up
// off the pick, an arc over the top at a safe height, straight down onto the
// place. The path is sampled once, then timed with a velocity profile: slow
// near the product (approach speed), fast in the open, limited acceleration
// in between and on the curve, smoothed so the acceleration ramps instead of
// jumping (an S-curve rather than a bare trapezoid). A loaded arm moves with
// lower speed and acceleration than an empty one.

import * as THREE from "three";

export type MoveLimits = {
  /** Cruise speed in the open (m/s). */
  v: number;
  /** Speed on the vertical approach and departure legs (m/s). */
  vApproach: number;
  /** Acceleration limit along the path (m/s²). */
  a: number;
  /** Sideways acceleration limit on the arc (m/s²). */
  aLat: number;
};

export type MoveSpec = {
  from: THREE.Vector3;
  to: THREE.Vector3;
  /** Straight vertical lift off `from` before the arc (m). */
  up: number;
  /** Straight vertical descent onto `to` after the arc (m). */
  down: number;
  /** Extra height of the arc over the higher of the two vertical legs (m). */
  clear: number;
};

const N_ARC = 64;
const N_LEG = 10;
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** A timed path. Sample it with `at(t)`; `u` (0..1) runs over the arc only, for wrist turn and lift column. */
export class Move {
  readonly duration: number;
  private p: Float32Array;
  private t: Float32Array;
  private u: Float32Array;
  private n: number;
  private i = 0;

  constructor(spec: MoveSpec, lim: MoveLimits) {
    const pts: THREE.Vector3[] = [];
    const arcU: number[] = [];
    const a = spec.from;
    const b = spec.to;
    const A = a.clone().setY(a.y + spec.up);
    const Bp = b.clone().setY(b.y + spec.down);
    const flat = Math.hypot(A.x - Bp.x, A.z - Bp.z) < 0.01;
    // leg 1: straight up
    const put = (q: THREE.Vector3, u: number) => {
      pts.push(q);
      arcU.push(u);
    };
    if (spec.up > 0.001) for (let k = 0; k < N_LEG; k++) put(a.clone().lerp(A, k / N_LEG), 0);
    if (flat) {
      // no travel over the floor: one straight line between the legs
      for (let k = 0; k <= N_ARC / 4; k++) put(A.clone().lerp(Bp, k / (N_ARC / 4)), k / (N_ARC / 4));
    } else {
      // arc in cylindrical coordinates around the robot axis; vertical tangents at both ends
      const pa = Math.atan2(A.z, A.x);
      const pb = pa + wrap(Math.atan2(Bp.z, Bp.x) - pa);
      const ra = Math.hypot(A.x, A.z);
      const rb = Math.hypot(Bp.x, Bp.z);
      const safe = Math.max(A.y, Bp.y) + spec.clear;
      for (let k = 0; k <= N_ARC; k++) {
        const s = k / N_ARC;
        const w = 1 - s;
        const w0 = w * w * w;
        const w1 = 3 * w * w * s;
        const w2 = 3 * w * s * s;
        const w3 = s * s * s;
        const ang = pa * (w0 + w1) + pb * (w2 + w3);
        const rad = ra * (w0 + w1) + rb * (w2 + w3);
        const y = A.y * w0 + safe * (w1 + w2) + Bp.y * w3;
        put(new THREE.Vector3(Math.cos(ang) * rad, y, Math.sin(ang) * rad), s);
      }
    }
    // leg 3: straight down
    if (spec.down > 0.001) for (let k = 1; k <= N_LEG; k++) put(Bp.clone().lerp(b, k / N_LEG), 1);

    const n = pts.length;
    this.n = n;
    this.p = new Float32Array(n * 3);
    this.t = new Float32Array(n);
    this.u = new Float32Array(arcU);
    pts.forEach((q, k) => q.toArray(this.p, k * 3));

    // speed limit per sample: approach legs slow, arc limited by its curvature
    const ds = new Float32Array(n);
    const vlim = new Float32Array(n);
    for (let k = 0; k < n; k++) {
      if (k > 0) ds[k] = Math.max(1e-5, pts[k].distanceTo(pts[k - 1]));
      const leg = arcU[k] <= 0 || arcU[k] >= 1;
      let v = leg && !flat ? lim.vApproach : lim.v;
      if (!leg && k > 0 && k < n - 1) {
        // curvature from three points (circumradius)
        const p0 = pts[k - 1];
        const p1 = pts[k];
        const p2 = pts[k + 1];
        const c = p0.distanceTo(p2);
        const cross = new THREE.Vector3().subVectors(p1, p0).cross(new THREE.Vector3().subVectors(p2, p1)).length();
        const R = cross > 1e-9 ? (p0.distanceTo(p1) * p1.distanceTo(p2) * c) / (2 * cross) : 1e3;
        v = Math.min(v, Math.sqrt(lim.aLat * R));
      }
      // ease into the approach speed a little before the vertical legs begin
      if (!flat && !leg) v = Math.min(v, lim.vApproach + (lim.v - lim.vApproach) * Math.min(1, Math.min(arcU[k], 1 - arcU[k]) * 6));
      vlim[k] = v;
    }
    // forward and backward passes: accelerate and brake within the limit
    const v = new Float32Array(n);
    v[0] = 0;
    for (let k = 1; k < n; k++) v[k] = Math.min(vlim[k], Math.sqrt(v[k - 1] * v[k - 1] + 2 * lim.a * ds[k]));
    v[n - 1] = 0;
    for (let k = n - 2; k >= 0; k--) v[k] = Math.min(v[k], Math.sqrt(v[k + 1] * v[k + 1] + 2 * lim.a * ds[k + 1]));
    // round the corners of the profile: acceleration ramps up and down (jerk-limited feel)
    for (let pass = 0; pass < 3; pass++) {
      const c = v.slice();
      for (let k = 1; k < n - 1; k++) v[k] = Math.min(c[k], (c[k - 1] + 2 * c[k] + c[k + 1]) / 4);
    }
    // time stamps; the first and last samples start/stop from rest
    const vmin = Math.max(0.01, lim.vApproach * 0.12);
    let time = 0;
    this.t[0] = 0;
    for (let k = 1; k < n; k++) {
      time += ds[k] / Math.max(vmin, (v[k - 1] + v[k]) / 2);
      this.t[k] = time;
    }
    this.duration = time;
  }

  /** Position at time t (s since the start); returns the arc progress u (0..1). */
  at(t: number, out: THREE.Vector3) {
    const T = this.t;
    if (t <= 0) {
      this.i = 0;
      out.fromArray(this.p, 0);
      return this.u[0];
    }
    if (t >= this.duration) {
      out.fromArray(this.p, (this.n - 1) * 3);
      return 1;
    }
    let i = Math.min(this.i, this.n - 2);
    if (T[i] > t) i = 0;
    while (i < this.n - 2 && T[i + 1] < t) i++;
    this.i = i;
    const k = (t - T[i]) / Math.max(1e-6, T[i + 1] - T[i]);
    const P = this.p;
    const j = i * 3;
    out.set(P[j] + (P[j + 3] - P[j]) * k, P[j + 1] + (P[j + 4] - P[j + 1]) * k, P[j + 2] + (P[j + 5] - P[j + 2]) * k);
    return this.u[i] + (this.u[i + 1] - this.u[i]) * k;
  }
}

/** Smooth 0..1 for the wrist turn and lift column along the arc (zero slope at both ends). */
export const arcEase = (u: number) => {
  const x = Math.min(1, Math.max(0, u));
  return x * x * x * (10 + x * (-15 + 6 * x));
};
