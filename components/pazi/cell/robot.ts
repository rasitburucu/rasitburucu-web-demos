// The procedural six-axis collaborative arm, its gripper, riser and hose.
//
// Kinematic layout (in the J1 frame, X radial, Y up, Z lateral):
//   J1 vertical axis at the base · J2 shoulder at height d1 · upper arm a2 ·
//   J3 elbow · forearm a3 · J4 wrist kept level · wrist hangs straight down by
//   `wrist` to the tool flange · J6 turns the tool about the vertical.
// The shoulder, elbow and wrist housings step sideways like a real cobot, so
// the tool centre sits at a lateral offset `zt`; the base angle accounts for it.

import * as THREE from "three";
import type { GripperId, GripperSpec, ModelSpec } from "@/lib/pazi/plan";
import { axisX, axisZ, mesh, rbox, roundCyl, tubeX } from "./geo";
import { labelTexture, type Mats } from "./materials";

export type Pose = { t1: number; t2: number; t3: number; t6: number };

/**
 * Service modules of the arm, as a technician would take it apart. The cell
 * ignores this; the teardown view (components/pazi/about) moves each module
 * along its joint axis. Every mesh the constructor builds belongs to one.
 */
export type RobotPart =
  | "mount"
  | "base"
  | "shoulder"
  | "shoulderCover"
  | "upperArm"
  | "elbow"
  | "forearm"
  | "wrist1"
  | "wrist2"
  | "wrist3"
  | "toolFlange"
  | "clips";

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
  /** Shoulder housing frame (J2 axis along local Z). */
  readonly shoulder = new THREE.Group();
  /** Elbow housing frame (J3 axis along local Z). */
  readonly elbow = new THREE.Group();
  /** Meshes by service module (see RobotPart). */
  readonly parts = new Map<RobotPart, THREE.Object3D[]>();
  /** Housing radii and lateral offsets, for parts built around the arm. */
  readonly dims: { R1: number; R2: number; R3: number; o1: number; o2: number; o3: number; h1: number; w3h: number };
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
    const tag = <T extends THREE.Object3D>(part: RobotPart, o: T): T => {
      const list = this.parts.get(part);
      if (list) list.push(o);
      else this.parts.set(part, [o]);
      return o;
    };

    const root = this.root;
    root.add(this.j1);

    // Mounting flange with bolt heads
    const plate = tag("mount", mesh(roundCyl(R1 * 1.42, 0.022, 0.005), m.anodized));
    plate.position.y = 0.011;
    root.add(plate);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      const b = tag("mount", mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.008, 6), m.metal, false));
      b.position.set(Math.cos(a) * R1 * 1.24, 0.026, Math.sin(a) * R1 * 1.24);
      root.add(b);
    }

    // J1 base housing: vertical, meets the shoulder housing from below
    const baseH = d1 - 0.022;
    const base = tag("base", mesh(roundCyl(R1 * 1.0, baseH, R1 * 0.12), m.paint));
    base.position.y = 0.022 + baseH / 2;
    this.j1.add(base);
    const baseRing = tag("base", mesh(new THREE.CylinderGeometry(R1 * 1.012, R1 * 1.012, 0.014, 48, 1, true), m.capDark));
    baseRing.position.y = 0.022 + baseH * 0.28;
    this.j1.add(baseRing);

    // Shoulder (J2) housing, axis lateral, offset sideways
    const sh = this.shoulder;
    sh.position.set(0, d1, 0);
    this.j1.add(sh);
    const shHouse = tag("shoulder", mesh(axisZ(roundCyl(R1, R1 * 2.05, R1 * 0.16)), m.paint));
    shHouse.position.z = o1 * 0.55;
    sh.add(shHouse);
    this.cap(sh, R1, o1 * 0.55 + R1 * 1.025, m).forEach((o) => tag("shoulder", o));
    this.cap(sh, R1, o1 * 0.55 - R1 * 1.025, m, -1).forEach((o) => tag("shoulderCover", o));

    // Upper arm
    this.j2.position.z = o1;
    sh.add(this.j2);
    const ua = tag("upperArm", mesh(tubeX(r * 1.02, r * 0.84, a2), m.paint));
    this.j2.add(ua);
    // label band on the outer side
    const labMap = labelTexture(spec.name);
    labMap.center.set(0.5, 0.5);
    labMap.rotation = Math.PI / 2;
    const lab = tag(
      "upperArm",
      new THREE.Mesh(
      new THREE.CylinderGeometry(r * 1.004, r * 1.004, a2 * 0.4, 32, 1, true, Math.PI * 0.3, Math.PI * 0.4),
        new THREE.MeshStandardMaterial({ map: labMap, transparent: true, roughness: 0.5, depthWrite: false }),
      ),
    );
    lab.rotation.z = -Math.PI / 2;
    lab.rotation.x = -Math.PI / 2;
    lab.position.x = a2 * 0.5;
    this.j2.add(lab);

    // Elbow (J3) housing: a double lobe stepping back to the forearm plane
    const el = this.elbow;
    el.position.x = a2;
    this.j2.add(el);
    const elA = tag("elbow", mesh(axisZ(roundCyl(R2, R2 * 1.9, R2 * 0.16)), m.paint));
    elA.position.z = 0;
    el.add(elA);
    const elB = tag("elbow", mesh(axisZ(roundCyl(R2 * 0.97, o2 + R2 * 0.6, R2 * 0.16)), m.paint));
    elB.position.z = -o2 / 2 - R2 * 0.1;
    el.add(elB);
    this.cap(el, R2, R2 * 0.95, m).forEach((o) => tag("elbow", o));
    this.cap(el, R2 * 0.97, -o2 - R2 * 0.4, m, -1).forEach((o) => tag("elbow", o));

    this.j3.position.set(a2, 0, -o2);
    this.j2.add(this.j3);
    const fa = tag("forearm", mesh(tubeX(r * 0.88, r * 0.64, a3), m.paint));
    this.j3.add(fa);

    // Wrist 1 (J4) housing at the forearm end
    this.j4.position.x = a3;
    this.j3.add(this.j4);
    const w1 = tag("wrist1", mesh(axisZ(roundCyl(R3, o3 + R3 * 1.1, R3 * 0.16)), m.paint));
    w1.position.z = o3 / 2;
    this.j4.add(w1);
    this.cap(this.j4, R3, -R3 * 0.55, m, -1).forEach((o) => tag("wrist1", o));

    // Neck down to wrist 2, whose axis is radial
    const h1 = wrist * 0.42;
    const neck = tag("wrist2", mesh(new THREE.CylinderGeometry(R3 * 0.92, R3 * 0.92, h1, 32), m.paint));
    neck.position.set(0, -h1 / 2, o3);
    this.j4.add(neck);
    const w2 = tag("wrist2", mesh(axisX(roundCyl(R3, R3 * 2.0, R3 * 0.16)), m.paint));
    w2.position.set(0, -h1, o3);
    this.j4.add(w2);
    const capW2 = tag("wrist2", mesh(axisX(new THREE.CylinderGeometry(R3 * 0.86, R3 * 0.86, 0.006, 40)), m.capDark));
    capW2.position.set(R3 * 1.0, -h1, o3);
    this.j4.add(capW2);
    const ringW2 = tag("wrist2", mesh(axisX(new THREE.TorusGeometry(R3 * 0.86, 0.0022, 6, 40)), m.capRing, false));
    ringW2.rotation.y = Math.PI / 2;
    ringW2.position.set(R3 * 1.003, -h1, o3);
    this.j4.add(ringW2);

    // Wrist 3 (J6): vertical, tool flange underneath
    this.j6.position.set(0, -h1 - R3 * 0.62, o3);
    this.j4.add(this.j6);
    const w3h = wrist - h1 - R3 * 0.62 - 0.012;
    const w3 = tag("wrist3", mesh(roundCyl(R3 * 0.9, w3h, R3 * 0.14), m.paint));
    w3.position.y = -w3h / 2;
    this.j6.add(w3);
    this.led = tag("wrist3", mesh(new THREE.CylinderGeometry(R3 * 0.915, R3 * 0.915, 0.008, 40, 1, true), m.led.clone(), false));
    this.led.position.y = -w3h * 0.62;
    this.j6.add(this.led);
    const fl = tag("toolFlange", mesh(new THREE.CylinderGeometry(R3 * 0.62, R3 * 0.62, 0.012, 32), m.metal));
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
      const band = tag("clips", mesh(new THREE.TorusGeometry(0.016, 0.004, 6, 16), m.rubber, false));
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

    this.dims = { R1, R2, R3, o1, o2, o3, h1, w3h };
    this.apply();
  }

  /** A joint end cap (dark disc, bright ring, anodised hub); returns its meshes. */
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
    return [c, ring, hub];
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

/** Hold plane under the tool flange (m). The same for every tool, so a tool change never moves the arm. */
export const GRIP_H = 0.12;

type PadSet = { root: THREE.Group; items: { obj: THREE.Object3D; fx: number; fz: number }[] };
type TineSet = { root: THREE.Group; pivots: { obj: THREE.Group; side: number; fz: number }[] };

const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth01 = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

/**
 * The tool, drawn from its sized spec (lib/pazi/gripper.ts). Plate-sized parts
 * are unit geometry scaled to the current plate, so a new size can grow out of
 * the old one: `morphFrom` remembers the previous spec of the same family and
 * `setMorph(0..1)` slides the plate, crosses and generators to the new size
 * while the old pad (or finger) layout shrinks away and the new one grows in.
 * A change of family (vacuum to claw and back) swaps two tools with `setPresence`.
 */
export class Gripper {
  readonly group = new THREE.Group();
  /** Where the carried products hang (their top faces touch this plane). */
  readonly hold = new THREE.Group();
  readonly height = GRIP_H;
  readonly kind: GripperId;
  readonly spec: GripperSpec;
  /** ISO flange adapter and quick changer: the first thing under the tool flange. */
  readonly adapter: THREE.Mesh;
  /** Everything under the quick changer; scaled to zero and back when the tool family changes. */
  readonly body = new THREE.Group();
  private hoseTop: THREE.Object3D;
  private m: Mats;
  private from: GripperSpec | null = null;
  private mix = 1;
  private openT = 1;
  // vacuum parts
  private beam?: THREE.Object3D;
  private grooves: THREE.Object3D[] = [];
  private crosses: THREE.Object3D[] = [];
  private gens: THREE.Object3D[] = [];
  private plate?: THREE.Object3D;
  private divider?: THREE.Object3D;
  private padSets: PadSet[] = [];
  // claw parts
  private frame?: THREE.Object3D;
  private rails?: THREE.Object3D;
  private clampPlate?: THREE.Object3D;
  private cyls: THREE.Object3D[] = [];
  private tineSets: TineSet[] = [];

  constructor(spec: GripperSpec, m: Mats) {
    this.spec = spec;
    this.kind = spec.id;
    this.m = m;
    const g = this.group;
    const adapter = mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.03, 32), m.anodized);
    adapter.position.y = -0.015;
    g.add(adapter);
    this.adapter = adapter;
    g.add(this.body);
    this.hoseTop = new THREE.Object3D();
    this.hoseTop.position.set(-0.05, -0.03, 0);
    this.body.add(this.hoseTop);

    const b = this.body;
    if (spec.family === "pence") {
      this.frame = mesh(rbox(1, 0.04, 1, 0.004), m.alu);
      this.frame.position.y = -0.05;
      this.rails = mesh(rbox(0.05, 0.05, 1, 0.006), m.anodized);
      this.rails.position.y = -0.09;
      this.clampPlate = mesh(rbox(1, 0.012, 1, 0.003), m.graphitePaint);
      this.clampPlate.position.y = -0.118;
      b.add(this.frame, this.rails, this.clampPlate);
      for (let i = 0; i < 2; i++) {
        const c = mesh(axisX(new THREE.CylinderGeometry(0.018, 0.018, 1, 16)), m.metal);
        c.position.y = -0.035;
        b.add(c);
        this.cyls.push(c);
      }
      this.tineSets.push(this.buildTines(spec));
    } else {
      this.beam = mesh(rbox(0.045, 0.045, 1, 0.004), m.alu);
      this.beam.position.y = -0.05;
      b.add(this.beam);
      for (const s of [-1, 1]) {
        const groove = mesh(new THREE.BoxGeometry(0.004, 0.006, 1), m.anodized, false);
        groove.position.set(s * 0.012, -0.0275, 0);
        b.add(groove);
        this.grooves.push(groove);
      }
      for (let i = 0; i < 2; i++) {
        const cross = mesh(rbox(1, 0.04, 0.045, 0.004), m.alu);
        cross.position.y = -0.047;
        b.add(cross);
        this.crosses.push(cross);
      }
      // one vacuum generator per zone, with its silencer
      for (let i = 0; i < 2; i++) {
        const gen = new THREE.Group();
        const block = mesh(rbox(0.07, 0.045, 0.09, 0.006), m.graphitePaint);
        const sil = mesh(axisX(new THREE.CylinderGeometry(0.012, 0.012, 0.05, 12)), m.metal);
        sil.position.x = -0.05;
        gen.add(block, sil);
        gen.position.set(-0.07, -0.025, 0);
        b.add(gen);
        this.gens.push(gen);
      }
      this.plate = mesh(rbox(1, 0.012, 1, 0.003), m.anodized);
      this.plate.position.y = -0.078;
      this.divider = mesh(new THREE.BoxGeometry(1, 0.014, 0.008), m.capDark, false);
      this.divider.position.y = -0.078;
      b.add(this.plate, this.divider);
      this.padSets.push(this.buildPads(spec));
    }
    this.hold.position.y = -GRIP_H;
    g.add(this.hold);
    this.layout();
  }

  /** Suction pads on a grid under the plate: stem, bellows, lip; the lip meets the hold plane. */
  private buildPads(s: GripperSpec): PadSet {
    const root = new THREE.Group();
    root.position.y = -0.084;
    this.body.add(root);
    const R = s.pads.d / 2000;
    const prof = [
      [0.001, 0],
      [R * 0.36, 0],
      [R * 0.36, -0.008],
      [R * 0.66, -0.012],
      [R * 0.5, -0.017],
      [R * 0.72, -0.022],
      [R * 0.62, -0.026],
      [R * 1.0, -0.034],
      [R * 0.96, -0.036],
      [0.001, -0.036],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const geo = new THREE.LatheGeometry(prof, 20);
    geo.computeVertexNormals();
    const items: PadSet["items"] = [];
    const { nx, nz } = s.pads;
    for (let i = 0; i < nx; i++)
      for (let j = 0; j < nz; j++) {
        const p = mesh(geo, this.m.rubber, true);
        root.add(p);
        items.push({ obj: p, fx: (i + 0.5) / nx - 0.5, fz: (j + 0.5) / nz - 0.5 });
      }
    return { root, items };
  }

  /** Fork fingers on both sides, on pivots under the frame; each foot swings under the bag. */
  private buildTines(s: GripperSpec): TineSet {
    const root = new THREE.Group();
    this.body.add(root);
    const n = s.claw?.fingers ?? 4;
    const D = (s.claw?.depth ?? 186) / 1000;
    const tineGeo = rbox(0.012, D + 0.014, 0.03, 0.004);
    const footGeo = rbox(0.1, 0.008, 0.03, 0.003);
    const pivots: TineSet["pivots"] = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < n; i++) {
        const pivot = new THREE.Group();
        const tine = mesh(tineGeo, this.m.metal);
        tine.position.y = 0.01 - (D + 0.014) / 2;
        const foot = mesh(footGeo, this.m.metal);
        foot.position.set(-side * 0.05, -D, 0);
        pivot.add(tine, foot);
        root.add(pivot);
        pivots.push({ obj: pivot, side, fz: (i + 0.5) / n - 0.5 });
      }
    }
    return { root, pivots };
  }

  /** Start a resize from the previous tool of the same family (then drive setMorph from 0 to 1). */
  morphFrom(prev: GripperSpec) {
    if (prev.family !== this.spec.family) return;
    this.from = prev;
    if (prev.family === "pence") this.tineSets.push(this.buildTines(prev));
    else this.padSets.push(this.buildPads(prev));
    this.setMorph(0);
  }

  /** 0 = previous size, 1 = this tool's size. */
  setMorph(t: number) {
    this.mix = Math.min(1, Math.max(0, t));
    this.layout();
    if (this.mix >= 1 && this.from) {
      // drop the old layout (its geometry is disposed with the cell)
      const old = this.spec.family === "pence" ? this.tineSets.pop()?.root : this.padSets.pop()?.root;
      if (old) old.visible = false;
      this.from = null;
    }
  }

  /** 0 = retracted into the quick changer, 1 = in place (tool family swap). */
  setPresence(s: number) {
    const v = Math.max(0.001, Math.min(1, s));
    this.body.scale.setScalar(v);
    this.body.visible = s > 0.002;
  }

  private layout() {
    const t = this.spec;
    const f = this.from ?? t;
    const e = this.mix;
    const W = lerpN(f.plate.w, t.plate.w, e) / 1000;
    const L = lerpN(f.plate.l, t.plate.l, e) / 1000;
    const grow = this.from ? smooth01((e - 0.25) / 0.75) : 1;
    const shrink = 1 - smooth01(e / 0.6);
    if (t.family === "pence") {
      this.frame!.scale.set(W, 1, L);
      this.rails!.scale.set(1, 1, L * 0.9);
      this.clampPlate!.scale.set(W * 0.7, 1, L * 0.86);
      this.cyls.forEach((c, i) => {
        c.scale.set(W * 0.8, 1, 1);
        c.position.z = (i ? -1 : 1) * L * 0.3;
      });
      this.tineSets.forEach((set, k) => {
        const s = k === 0 ? grow : shrink;
        set.root.visible = s > 0.002;
        for (const p of set.pivots) {
          p.obj.position.set((p.side * W) / 2, -0.07, p.fz * L);
          p.obj.scale.setScalar(Math.max(0.001, s));
        }
      });
      this.setOpen(this.openT);
      return;
    }
    const z = lerpN(f.zones - 1, t.zones - 1, e);
    this.beam!.scale.set(1, 1, L * 0.92);
    for (const gr of this.grooves) gr.scale.set(1, 1, L * 0.92);
    const spread = lerpN(f.plate.l > 550 ? 0.28 : 0, t.plate.l > 550 ? 0.28 : 0, e);
    this.crosses.forEach((c, i) => {
      c.scale.set(W * 0.9, 1, 1);
      c.position.z = (i ? -1 : 1) * L * spread;
    });
    const gz = Math.max(0.05, L * 0.25);
    this.gens[0].position.z = lerpN(0.06, gz, z);
    this.gens[1].position.z = lerpN(0.06, -gz, z);
    this.gens[1].scale.setScalar(Math.max(0.001, z));
    this.gens[1].visible = z > 0.002;
    this.plate!.scale.set(W, 1, L);
    this.divider!.scale.set(W * 1.002, Math.max(0.001, z), 1);
    this.divider!.visible = z > 0.002;
    this.padSets.forEach((set, k) => {
      const s = k === 0 ? grow : shrink;
      set.root.visible = s > 0.002;
      for (const p of set.items) {
        p.obj.position.set(p.fx * W, 0, p.fz * L);
        p.obj.scale.setScalar(Math.max(0.001, s));
      }
    });
  }

  /** 0 = closed on the product, 1 = open (claw only). */
  setOpen(t: number) {
    this.openT = t;
    for (const set of this.tineSets) for (const p of set.pivots) p.obj.rotation.z = p.side * (0.05 + t * 0.55);
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
      const post = mesh(rbox(0.26, height - 0.04, 0.26, 0.012), m.pedestal);
      post.position.y = 0.02 + (height - 0.04) / 2;
      g.add(post);
      const top = mesh(rbox(0.36, 0.02, 0.36, 0.004), m.pedestal);
      top.position.y = height - 0.01;
      g.add(top);
      // gussets
      for (let i = 0; i < 4; i++) {
        const gus = mesh(new THREE.BoxGeometry(0.006, 0.12, 0.1), m.pedestal);
        const a = (i * Math.PI) / 2;
        gus.position.set(Math.cos(a) * 0.16, 0.08, Math.sin(a) * 0.16);
        gus.rotation.y = -a;
        g.add(gus);
      }
    } else {
      // Telescoping lift column: fixed outer section, moving inner section
      this.minH = 0.62;
      this.maxH = 1.32;
      const outer = mesh(rbox(0.34, 0.58, 0.34, 0.01), m.pedestal);
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
      const top = mesh(rbox(0.36, 0.02, 0.36, 0.004), m.pedestal);
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
