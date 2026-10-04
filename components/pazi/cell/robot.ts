// The procedural six-axis collaborative arm, its gripper, riser and hose.
//
// Kinematic layout (in the J1 frame, X radial, Y up, Z lateral):
//   J1 vertical axis at the base · J2 shoulder at height d1 · upper arm a2 ·
//   J3 elbow · forearm a3 · J4 wrist kept level · wrist hangs straight down by
//   `wrist` to the tool flange · J6 turns the tool about the vertical.
// The shoulder, elbow and wrist housings step sideways like a real cobot, so
// the tool centre sits at a lateral offset `zt`; the base angle accounts for it.

import * as THREE from "three";
import type { GripperId, ModelSpec } from "@/lib/pazi/plan";
import { axisX, axisZ, mesh, rbox, roundCyl, tubeX } from "./geo";
import { labelTexture, type Mats } from "./materials";

export type Pose = { t1: number; t2: number; t3: number; t6: number };

export class Robot {
  readonly root = new THREE.Group();
  readonly j1 = new THREE.Group();
  readonly j2 = new THREE.Group();
  readonly j3 = new THREE.Group();
  readonly j4 = new THREE.Group();
  readonly j6 = new THREE.Group();
  /** Tool flange face: the gripper hangs from here (Y down). */
  readonly flange = new THREE.Group();
  /** Points the hose is clipped to. */
  readonly clips: THREE.Object3D[] = [];
  readonly led: THREE.Mesh;
  readonly d1: number;
  readonly a2: number;
  readonly a3: number;
  readonly hang: number;
  readonly zt: number;
  readonly spec: ModelSpec;
  pose: Pose = { t1: 0, t2: 1.2, t3: -2.2, t6: 0 };

  constructor(spec: ModelSpec, m: Mats) {
    this.spec = spec;
    const { d1, a2, a3, wrist, r } = spec.link;
    this.d1 = d1;
    this.a2 = a2;
    this.a3 = a3;
    this.hang = wrist;

    const R1 = r * 1.28; // shoulder housing
    const R2 = r * 1.06; // elbow housing
    const R3 = r * 0.78; // wrist housings
    const o1 = R1 * 1.02; // upper arm plane (lateral)
    const o2 = R2 * 1.75; // forearm steps back
    const o3 = R3 * 1.25; // wrist neck steps out
    const zf = o1 - o2;
    this.zt = zf + o3;

    const root = this.root;
    root.add(this.j1);

    // Mounting flange with bolt heads
    const plate = mesh(roundCyl(R1 * 1.42, 0.022, 0.005), m.anodized);
    plate.position.y = 0.011;
    root.add(plate);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      const b = mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.008, 6), m.metal, false);
      b.position.set(Math.cos(a) * R1 * 1.24, 0.026, Math.sin(a) * R1 * 1.24);
      root.add(b);
    }

    // J1 base housing: vertical, meets the shoulder housing from below
    const baseH = d1 - 0.022;
    const base = mesh(roundCyl(R1 * 1.0, baseH, R1 * 0.12), m.paint);
    base.position.y = 0.022 + baseH / 2;
    this.j1.add(base);
    const baseRing = mesh(new THREE.CylinderGeometry(R1 * 1.012, R1 * 1.012, 0.014, 48, 1, true), m.capDark);
    baseRing.position.y = 0.022 + baseH * 0.28;
    this.j1.add(baseRing);

    // Shoulder (J2) housing, axis lateral, offset sideways
    const sh = new THREE.Group();
    sh.position.set(0, d1, 0);
    this.j1.add(sh);
    const shHouse = mesh(axisZ(roundCyl(R1, R1 * 2.05, R1 * 0.16)), m.paint);
    shHouse.position.z = o1 * 0.55;
    sh.add(shHouse);
    this.cap(sh, R1, o1 * 0.55 + R1 * 1.025, m);
    this.cap(sh, R1, o1 * 0.55 - R1 * 1.025, m, -1);

    // Upper arm
    this.j2.position.z = o1;
    sh.add(this.j2);
    const ua = mesh(tubeX(r * 1.02, r * 0.84, a2), m.paint);
    this.j2.add(ua);
    // label band on the outer side
    const labMap = labelTexture(spec.name);
    labMap.center.set(0.5, 0.5);
    labMap.rotation = Math.PI / 2;
    const lab = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 1.004, r * 1.004, a2 * 0.4, 32, 1, true, Math.PI * 0.3, Math.PI * 0.4),
      new THREE.MeshStandardMaterial({ map: labMap, transparent: true, roughness: 0.5, depthWrite: false }),
    );
    lab.rotation.z = -Math.PI / 2;
    lab.rotation.x = -Math.PI / 2;
    lab.position.x = a2 * 0.5;
    this.j2.add(lab);

    // Elbow (J3) housing: a double lobe stepping back to the forearm plane
    const el = new THREE.Group();
    el.position.x = a2;
    this.j2.add(el);
    const elA = mesh(axisZ(roundCyl(R2, R2 * 1.9, R2 * 0.16)), m.paint);
    elA.position.z = 0;
    el.add(elA);
    const elB = mesh(axisZ(roundCyl(R2 * 0.97, o2 + R2 * 0.6, R2 * 0.16)), m.paint);
    elB.position.z = -o2 / 2 - R2 * 0.1;
    el.add(elB);
    this.cap(el, R2, R2 * 0.95, m);
    this.cap(el, R2 * 0.97, -o2 - R2 * 0.4, m, -1);

    this.j3.position.set(a2, 0, -o2);
    this.j2.add(this.j3);
    const fa = mesh(tubeX(r * 0.88, r * 0.64, a3), m.paint);
    this.j3.add(fa);

    // Wrist 1 (J4) housing at the forearm end
    this.j4.position.x = a3;
    this.j3.add(this.j4);
    const w1 = mesh(axisZ(roundCyl(R3, o3 + R3 * 1.1, R3 * 0.16)), m.paint);
    w1.position.z = o3 / 2;
    this.j4.add(w1);
    this.cap(this.j4, R3, -R3 * 0.55, m, -1);

    // Neck down to wrist 2, whose axis is radial
    const h1 = wrist * 0.42;
    const neck = mesh(new THREE.CylinderGeometry(R3 * 0.92, R3 * 0.92, h1, 32), m.paint);
    neck.position.set(0, -h1 / 2, o3);
    this.j4.add(neck);
    const w2 = mesh(axisX(roundCyl(R3, R3 * 2.0, R3 * 0.16)), m.paint);
    w2.position.set(0, -h1, o3);
    this.j4.add(w2);
    const capW2 = mesh(axisX(new THREE.CylinderGeometry(R3 * 0.86, R3 * 0.86, 0.006, 40)), m.capDark);
    capW2.position.set(R3 * 1.0, -h1, o3);
    this.j4.add(capW2);
    const ringW2 = mesh(axisX(new THREE.TorusGeometry(R3 * 0.86, 0.0022, 6, 40)), m.capRing, false);
    ringW2.rotation.y = Math.PI / 2;
    ringW2.position.set(R3 * 1.003, -h1, o3);
    this.j4.add(ringW2);

    // Wrist 3 (J6): vertical, tool flange underneath
    this.j6.position.set(0, -h1 - R3 * 0.62, o3);
    this.j4.add(this.j6);
    const w3h = wrist - h1 - R3 * 0.62 - 0.012;
    const w3 = mesh(roundCyl(R3 * 0.9, w3h, R3 * 0.14), m.paint);
    w3.position.y = -w3h / 2;
    this.j6.add(w3);
    this.led = mesh(new THREE.CylinderGeometry(R3 * 0.915, R3 * 0.915, 0.008, 40, 1, true), m.led.clone(), false);
    this.led.position.y = -w3h * 0.62;
    this.j6.add(this.led);
    const fl = mesh(new THREE.CylinderGeometry(R3 * 0.62, R3 * 0.62, 0.012, 32), m.metal);
    fl.position.y = -w3h - 0.006;
    this.j6.add(fl);
    this.flange.position.y = -w3h - 0.012;
    this.j6.add(this.flange);

    // hose clips (anchors), in link frames
    const clip = (parent: THREE.Object3D, x: number, y: number, z: number) => {
      const c = new THREE.Object3D();
      c.position.set(x, y, z);
      parent.add(c);
      this.clips.push(c);
      const band = mesh(new THREE.TorusGeometry(0.016, 0.004, 6, 16), m.rubber, false);
      band.position.set(x, y, z);
      parent.add(band);
      return c;
    };
    // base rear, upper arm (two), forearm (two), wrist
    const baseClip = new THREE.Object3D();
    baseClip.position.set(-R1 * 1.0, 0.09, -R1 * 0.2);
    this.j1.add(baseClip);
    this.clips.push(baseClip);
    clip(this.j2, a2 * 0.18, r * 1.25, -r * 0.45);
    clip(this.j2, a2 * 0.82, r * 1.2, -r * 0.45);
    clip(this.j3, a3 * 0.2, r * 1.05, r * 0.35);
    clip(this.j3, a3 * 0.85, r * 0.95, r * 0.35);
    const wristClip = new THREE.Object3D();
    wristClip.position.set(-R3 * 1.1, -h1, o3);
    this.j4.add(wristClip);
    this.clips.push(wristClip);

    this.apply();
  }

  private cap(parent: THREE.Object3D, R: number, z: number, m: Mats, dir = 1) {
    const c = mesh(axisZ(new THREE.CylinderGeometry(R * 0.86, R * 0.86, 0.007, 48)), m.capDark);
    c.position.z = z + dir * 0.0035;
    parent.add(c);
    const ring = mesh(new THREE.TorusGeometry(R * 0.86, 0.0024, 6, 48), m.capRing, false);
    ring.position.z = z + dir * 0.0072;
    parent.add(ring);
    const hub = mesh(axisZ(new THREE.CylinderGeometry(R * 0.32, R * 0.32, 0.004, 32)), m.anodized, false);
    hub.position.z = z + dir * 0.009;
    parent.add(hub);
  }

  apply() {
    const p = this.pose;
    this.j1.rotation.y = p.t1;
    this.j2.rotation.z = p.t2;
    this.j3.rotation.z = p.t3;
    this.j4.rotation.z = -(p.t2 + p.t3);
    this.j6.rotation.y = p.t6 - p.t1;
  }

  /**
   * Inverse kinematics for a flange point (world) and tool yaw (world).
   * Returns the pose; `reach` is false when the point had to be clamped.
   */
  solve(target: THREE.Vector3, yaw: number, out: Pose = { t1: 0, t2: 0, t3: 0, t6: 0 }) {
    const base = this.root.position;
    const px = target.x - base.x;
    const pz = target.z - base.z;
    const py = target.y - base.y;
    const zt = this.zt;
    const d = Math.max(Math.hypot(px, pz), Math.abs(zt) + 0.02);
    const rho = Math.sqrt(d * d - zt * zt);
    const t1 = Math.atan2(-pz, px) - Math.atan2(-zt, rho);
    const dx = rho;
    const dy = py + this.hang - this.d1;
    const a2 = this.a2;
    const a3 = this.a3;
    let D = Math.hypot(dx, dy);
    const maxD = a2 + a3 - 1e-4;
    const minD = Math.abs(a2 - a3) + 1e-3;
    const reach = D <= maxD && D >= minD;
    D = Math.min(maxD, Math.max(minD, D));
    const base2 = Math.atan2(dy, dx);
    const cosA = (a2 * a2 + D * D - a3 * a3) / (2 * a2 * D);
    const cosB = (a2 * a2 + a3 * a3 - D * D) / (2 * a2 * a3);
    const t2 = base2 + Math.acos(Math.min(1, Math.max(-1, cosA)));
    const t3 = -(Math.PI - Math.acos(Math.min(1, Math.max(-1, cosB))));
    out.t1 = t1;
    out.t2 = t2;
    out.t3 = t3;
    out.t6 = yaw;
    return { pose: out, reach };
  }

  setLed(color: THREE.ColorRepresentation, intensity = 1.6) {
    const mat = this.led.material as THREE.MeshStandardMaterial;
    mat.emissive.set(color);
    mat.emissiveIntensity = intensity;
  }
}

/* ------------------------------------------------------------------ gripper */

export class Gripper {
  readonly group = new THREE.Group();
  /** Where the carried products hang (their top faces touch this plane). */
  readonly hold = new THREE.Group();
  readonly height: number;
  readonly kind: GripperId;
  private tines: THREE.Object3D[] = [];
  private hoseTop: THREE.Object3D;

  constructor(kind: GripperId, padW: number, padL: number, m: Mats) {
    this.kind = kind;
    const g = this.group;
    // ISO flange adapter + quick changer
    const adapter = mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.03, 32), m.anodized);
    adapter.position.y = -0.015;
    g.add(adapter);
    this.hoseTop = new THREE.Object3D();
    this.hoseTop.position.set(-0.05, -0.03, 0);
    g.add(this.hoseTop);

    if (kind === "pence") {
      // Bag claw: top frame, clamp plate, a row of fork tines on each side that swing shut
      const W = Math.max(0.36, padW + 0.06);
      const L = Math.max(0.5, padL + 0.04);
      const frame = mesh(rbox(W, 0.04, L, 0.006), m.alu);
      frame.position.y = -0.05;
      g.add(frame);
      const rails = mesh(rbox(0.05, 0.05, L * 0.9, 0.006), m.anodized);
      rails.position.set(0, -0.09, 0);
      g.add(rails);
      const clamp = mesh(rbox(W * 0.7, 0.012, L * 0.86, 0.004), m.graphitePaint);
      clamp.position.y = -0.118;
      g.add(clamp);
      const n = Math.max(4, Math.round(L / 0.09));
      for (const side of [-1, 1]) {
        for (let i = 0; i < n; i++) {
          const pivot = new THREE.Group();
          pivot.position.set((side * W) / 2, -0.07, -L / 2 + (i + 0.5) * (L / n));
          const tine = mesh(rbox(0.012, 0.2, 0.03, 0.004), m.metal);
          tine.position.set(0, -0.09, 0);
          pivot.add(tine);
          const foot = mesh(rbox(0.1, 0.008, 0.03, 0.003), m.metal);
          foot.position.set((-side * 0.05) as number, -0.186, 0);
          pivot.add(foot);
          pivot.userData.side = side;
          g.add(pivot);
          this.tines.push(pivot);
        }
      }
      const cyl = mesh(axisX(new THREE.CylinderGeometry(0.018, 0.018, W * 0.8, 16)), m.metal);
      cyl.position.set(0, -0.035, L * 0.3);
      g.add(cyl);
      const cyl2 = cyl.clone();
      cyl2.position.z = -L * 0.3;
      g.add(cyl2);
      this.height = 0.12;
      this.setOpen(1);
    } else {
      // Vacuum: aluminium profile cross, generator block, foam pad
      const W = Math.max(0.2, padW * 0.82);
      const L = Math.max(0.24, padL * 0.86);
      const beam = mesh(rbox(0.045, 0.045, L * 0.9, 0.004), m.alu);
      beam.position.y = -0.055;
      g.add(beam);
      const cross = mesh(rbox(W * 0.9, 0.04, 0.045, 0.004), m.alu);
      cross.position.y = -0.052;
      g.add(cross);
      // T-slot grooves (thin dark lines)
      for (const s of [-1, 1]) {
        const groove = mesh(new THREE.BoxGeometry(0.004, 0.006, L * 0.9), m.anodized, false);
        groove.position.set(s * 0.012, -0.0325, 0);
        g.add(groove);
      }
      const gen = mesh(rbox(0.07, 0.045, 0.09, 0.006), m.graphitePaint);
      gen.position.set(-0.07, -0.025, 0.06);
      g.add(gen);
      const silencer = mesh(axisX(new THREE.CylinderGeometry(0.012, 0.012, 0.05, 12)), m.metal);
      silencer.position.set(-0.12, -0.025, 0.06);
      g.add(silencer);
      const plate = mesh(rbox(W, 0.012, L, 0.003), m.anodized);
      plate.position.y = -0.084;
      g.add(plate);
      const foam = mesh(rbox(W * 0.98, 0.022, L * 0.98, 0.006), m.foam);
      foam.position.y = -0.101;
      g.add(foam);
      // grid of suction holes on the pad's edge (read as texture from afar)
      this.height = 0.112;
    }
    this.hold.position.y = -this.height;
    g.add(this.hold);
  }

  /** 0 = closed on the product, 1 = open (claw only). */
  setOpen(t: number) {
    for (const p of this.tines) p.rotation.z = (p.userData.side as number) * (0.05 + t * 0.55);
  }

  get hoseAnchor() {
    return this.hoseTop;
  }
}

/* ------------------------------------------------------------------- riser */

export class Riser {
  readonly group = new THREE.Group();
  private inner?: THREE.Object3D;
  private bellows?: THREE.Object3D;
  readonly lift: boolean;
  readonly minH: number;
  readonly maxH: number;

  constructor(lift: boolean, height: number, m: Mats) {
    this.lift = lift;
    const g = this.group;
    const basePlate = mesh(rbox(0.56, 0.02, 0.56, 0.004), m.graphitePaint);
    basePlate.position.y = 0.01;
    g.add(basePlate);
    for (const sx of [-1, 1])
      for (const sz of [-1, 1]) {
        const bolt = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.016, 6), m.metal, false);
        bolt.position.set(sx * 0.23, 0.026, sz * 0.23);
        g.add(bolt);
      }
    if (!lift) {
      this.minH = this.maxH = height;
      const post = mesh(rbox(0.26, height - 0.04, 0.26, 0.012), m.graphitePaint);
      post.position.y = 0.02 + (height - 0.04) / 2;
      g.add(post);
      const top = mesh(rbox(0.36, 0.02, 0.36, 0.004), m.graphitePaint);
      top.position.y = height - 0.01;
      g.add(top);
      // gussets
      for (let i = 0; i < 4; i++) {
        const gus = mesh(new THREE.BoxGeometry(0.006, 0.12, 0.1), m.graphitePaint);
        const a = (i * Math.PI) / 2;
        gus.position.set(Math.cos(a) * 0.16, 0.08, Math.sin(a) * 0.16);
        gus.rotation.y = -a;
        g.add(gus);
      }
    } else {
      // Telescoping lift column: fixed outer section, moving inner section
      this.minH = 0.62;
      this.maxH = 1.32;
      const outer = mesh(rbox(0.34, 0.58, 0.34, 0.01), m.graphitePaint);
      outer.position.y = 0.02 + 0.29;
      g.add(outer);
      const band = mesh(new THREE.BoxGeometry(0.345, 0.03, 0.345), m.capDark);
      band.position.y = 0.56;
      g.add(band);
      const hazard = mesh(new THREE.BoxGeometry(0.346, 0.012, 0.346), m.scanner);
      hazard.position.y = 0.53;
      g.add(hazard);
      const inner = new THREE.Group();
      const innerMesh = mesh(rbox(0.27, 0.8, 0.27, 0.008), m.alu);
      innerMesh.position.y = -0.4;
      inner.add(innerMesh);
      const top = mesh(rbox(0.36, 0.02, 0.36, 0.004), m.graphitePaint);
      top.position.y = -0.01;
      inner.add(top);
      g.add(inner);
      this.inner = inner;
      const cab = mesh(rbox(0.12, 0.3, 0.06, 0.006), m.graphitePaint);
      cab.position.set(-0.2, 0.24, 0);
      g.add(cab);
      void this.bellows;
    }
  }

  clampHeight(h: number) {
    return this.inner ? Math.min(this.maxH, Math.max(this.minH, h)) : this.minH;
  }

  /** Top height for the lift (clamped). */
  setHeight(h: number) {
    if (!this.inner) return this.minH;
    const v = Math.min(this.maxH, Math.max(this.minH, h));
    this.inner.position.y = v;
    return v;
  }
}

/* -------------------------------------------------------------------- hose */

/** A vacuum hose that follows the arm: a tube rebuilt in place every frame. */
export class Hose {
  readonly mesh: THREE.Mesh;
  private curve: THREE.CatmullRomCurve3;
  private readonly segs = 72;
  private readonly radial = 8;
  private readonly radius: number;
  private pts: THREE.Vector3[];

  constructor(count: number, radius: number, mat: THREE.Material) {
    this.radius = radius;
    this.pts = Array.from({ length: count }, () => new THREE.Vector3());
    this.curve = new THREE.CatmullRomCurve3(this.pts, false, "centripetal");
    const geo = new THREE.BufferGeometry();
    const n = (this.segs + 1) * (this.radial + 1);
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geo.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const idx: number[] = [];
    for (let i = 0; i < this.segs; i++)
      for (let j = 0; j < this.radial; j++) {
        const a = i * (this.radial + 1) + j;
        const b = (i + 1) * (this.radial + 1) + j;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    geo.setIndex(idx);
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.castShadow = true;
    this.mesh.frustumCulled = false;
  }

  private t = new THREE.Vector3();
  private nrm = new THREE.Vector3(0, 1, 0);
  private bin = new THREE.Vector3();
  private p = new THREE.Vector3();
  private tmp = new THREE.Vector3();

  update(points: THREE.Vector3[]) {
    for (let i = 0; i < this.pts.length; i++) this.pts[i].copy(points[i]);
    this.curve.updateArcLengths();
    const pos = this.mesh.geometry.attributes.position as THREE.BufferAttribute;
    const nor = this.mesh.geometry.attributes.normal as THREE.BufferAttribute;
    // initial normal perpendicular to the first tangent
    this.curve.getTangentAt(0, this.t);
    this.nrm.set(0, 1, 0);
    if (Math.abs(this.t.dot(this.nrm)) > 0.9) this.nrm.set(1, 0, 0);
    this.nrm.sub(this.tmp.copy(this.t).multiplyScalar(this.t.dot(this.nrm))).normalize();
    for (let i = 0; i <= this.segs; i++) {
      const u = i / this.segs;
      this.curve.getPointAt(u, this.p);
      this.curve.getTangentAt(u, this.t);
      // parallel transport
      this.nrm.sub(this.tmp.copy(this.t).multiplyScalar(this.t.dot(this.nrm))).normalize();
      this.bin.crossVectors(this.t, this.nrm).normalize();
      for (let j = 0; j <= this.radial; j++) {
        const a = (j / this.radial) * Math.PI * 2;
        const cx = Math.cos(a);
        const sy = Math.sin(a);
        const nx = cx * this.nrm.x + sy * this.bin.x;
        const ny = cx * this.nrm.y + sy * this.bin.y;
        const nz = cx * this.nrm.z + sy * this.bin.z;
        const k = i * (this.radial + 1) + j;
        pos.setXYZ(k, this.p.x + nx * this.radius, this.p.y + ny * this.radius, this.p.z + nz * this.radius);
        nor.setXYZ(k, nx, ny, nz);
      }
    }
    pos.needsUpdate = true;
    nor.needsUpdate = true;
  }
}
