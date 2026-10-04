// The procedural six-axis collaborative arm, its gripper, riser and hose.
//
// Kinematic layout (in the J1 frame, X radial, Y up, Z lateral):
//   J1 vertical axis at the base · J2 shoulder at height d1 · upper arm a2 ·
//   J3 elbow · forearm a3 · J4 wrist kept level · wrist hangs straight down by
//   `wrist` to the tool flange · J6 turns the tool about the vertical.
// The shoulder, elbow and wrist housings step sideways like a real cobot, so
// the tool centre sits at a lateral offset `zt`; the base angle accounts for it.
//
// Build: every joint is a pair of cylinders that meet at a parting line (a dark
// seam), the way a joint module bolts to the cast end of a link: the module on
// one side, the link's casting on the other. Links are cast tubes with bosses
// where they enter a housing. Nothing intersects except where a tube sits in its
// socket, so the teardown view can pull any module straight off its seat.
// Primitives are merged per frame, service module and material (geo.ts Batch):
// the whole arm draws in about twenty calls.

import * as THREE from "three";
import type { GripperId, GripperSpec, ModelSpec } from "@/lib/pazi/plan";
import { axisX, axisZ, Batch, linkX, mesh, rbox, roundCyl } from "./geo";
import { armLayout, solveArm } from "./layout";
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

export type RobotDims = {
  /** Housing radii: shoulder, elbow, wrist; base column. */
  R1: number;
  R2: number;
  R3: number;
  Rb: number;
  /** Lateral planes: upper arm (o1), forearm step back (o2), wrist neck out (o3). */
  o1: number;
  o2: number;
  o3: number;
  /** Wrist 2 axis below wrist 1; wrist 3 body length. */
  h1: number;
  w3h: number;
  /** Shoulder module (J2 stator) ends along the J2 axis, in the shoulder frame. */
  shA: number;
  shB: number;
  /** Outer end of the upper arm's cast end along the J2 axis, in the shoulder frame. */
  rB: number;
  /** J1 parting line height (base column top). */
  yS: number;
};

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
  /** Housing radii and offsets, for parts built around the arm. */
  readonly dims: RobotDims;
  pose: Pose = { t1: 0, t2: 1.2, t3: -2.2, t6: 0 };

  constructor(spec: ModelSpec, m: Mats, detail: "high" | "low" = "high") {
    this.spec = spec;
    const { d1, a2, a3, wrist } = spec.link;
    this.d1 = d1;
    this.a2 = a2;
    this.a3 = a3;
    this.hang = wrist;
    const seg = detail === "high" ? 40 : 28;

    // ---- proportions (all from the link radius r; shared with the plan drawing)
    const { R1, R2, R3, Rb, gap, ru, rue, rf, rfe, shA, shB, rA, o1, rB, eA, fr, o2, wA, neckR, o3, wB, h1, j6y, flT, w3h, yS, zt } = armLayout(spec.link);
    this.zt = zt;

    const B = new Batch();
    const P = m.paint;
    const rim = (R: number) => R * 0.12;
    /** Housing along local Z from z0 to z1. */
    const hz = (parent: THREE.Object3D, part: RobotPart, R: number, z0: number, z1: number, x = 0, y = 0) =>
      B.add(parent, part, axisZ(roundCyl(R, z1 - z0, rim(R), seg)), P, x, y, (z0 + z1) / 2);
    /** Joint end cap on a face at `at` along `axis`, facing `dir`: dark cover, bright bead, hub. */
    const cap = (parent: THREE.Object3D, part: RobotPart, R: number, axis: "x" | "z", at: number, dir: 1 | -1, x = 0, y = 0, z = 0) => {
      const place = (g: THREE.BufferGeometry, off: number, mat: THREE.Material, cast: boolean) => {
        if (axis === "z") B.add(parent, part, axisZ(g), mat, x, y, at + dir * off, cast);
        else B.add(parent, part, axisX(g), mat, at + dir * off, y, z, cast);
      };
      place(new THREE.CylinderGeometry(R * 0.84, R * 0.84, 0.006, seg), 0.0012, m.capDark, false);
      const bead = new THREE.TorusGeometry(R * 0.84, Math.max(0.0016, R * 0.018), 6, seg);
      if (axis === "z") B.add(parent, part, bead, m.capRing, x, y, at + dir * 0.0042, false);
      else B.add(parent, part, bead, m.capRing, at + dir * 0.0042, y, z, false, 0, Math.PI / 2, 0);
      place(new THREE.CylinderGeometry(R * 0.26, R * 0.26, 0.004, 24), 0.005, m.anodized, false);
    };
    /** Dark parting line between two housings (a thin disc filling the groove). */
    const seam = (parent: THREE.Object3D, part: RobotPart, R: number, axis: "x" | "y" | "z", at: number, x = 0, y = 0, z = 0) => {
      const g = new THREE.CylinderGeometry(R * 0.94, R * 0.94, gap + 0.002, seg);
      if (axis === "z") B.add(parent, part, axisZ(g), m.seam, x, y, at, false);
      else if (axis === "x") B.add(parent, part, axisX(g), m.seam, at, y, z, false);
      else B.add(parent, part, g, m.seam, x, at, z, false);
    };

    const root = this.root;
    root.add(this.j1);

    // ---- mounting flange: anodised plate, eight socket-head bolts
    const plateR = R1 * 1.42;
    B.add(root, "mount", roundCyl(plateR, 0.022, 0.004, seg), m.anodized, 0, 0.011);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      const bx = Math.cos(a) * plateR * 0.84;
      const bz = Math.sin(a) * plateR * 0.84;
      B.add(root, "mount", new THREE.CylinderGeometry(0.0078, 0.0078, 0.008, 12), m.screw, bx, 0.026, bz, false);
      B.add(root, "mount", new THREE.CylinderGeometry(0.0036, 0.0036, 0.002, 6), m.seam, bx, 0.0296, bz, false);
    }

    // ---- J1: fixed base column up to the parting line; the rotor above it turns with the shoulder
    const colH = yS - 0.022;
    B.add(root, "base", roundCyl(Rb, colH, Rb * 0.08, seg), P, 0, 0.022 + colH / 2);
    B.add(root, "base", new THREE.CylinderGeometry(Rb * 1.015, Rb * 1.015, 0.012, seg, 1, true), m.anodized, 0, 0.03, 0, false);
    seam(root, "base", Rb, "y", yS + gap / 2);
    // connector on the back of the base, cable down into the riser through a gland
    const ca = Math.PI * 1.18;
    const cx = Math.cos(ca);
    const cz = Math.sin(ca);
    const conY = 0.022 + Math.min(0.06, colH * 0.42);
    B.add(root, "base", rbox(0.046, 0.056, 0.03, 0.006), m.graphitePaint, cx * (Rb + 0.012), conY, cz * (Rb + 0.012), true, 0, -ca, 0);
    B.add(root, "base", axisX(new THREE.CylinderGeometry(0.012, 0.012, 0.03, 16)), m.metal, cx * (Rb + 0.04), conY, cz * (Rb + 0.04), false, 0, -ca, 0);
    {
      const s = Rb + 0.05;
      const e = plateR + 0.035;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(cx * s, conY, cz * s),
        new THREE.Vector3(cx * (s + 0.03), conY - 0.004, cz * (s + 0.03)),
        new THREE.Vector3(cx * (e + 0.01), conY * 0.45, cz * (e + 0.01)),
        new THREE.Vector3(cx * e, 0.012, cz * e),
        new THREE.Vector3(cx * e, -0.004, cz * e),
      ]);
      B.add(root, "base", new THREE.TubeGeometry(curve, 28, 0.0085, 8, false), m.cable);
      B.add(root, "base", new THREE.CylinderGeometry(0.016, 0.018, 0.016, 16), m.graphitePaint, cx * e, 0.006, cz * e, false);
    }

    // ---- shoulder: J1 rotor (vertical) carrying the J2 module (horizontal)
    const sh = this.shoulder;
    sh.position.set(0, d1, 0);
    this.j1.add(sh);
    const neckH = d1 - yS - gap;
    // the rotor's top ends inside the J2 module, below the motor and gear it carries
    B.add(sh, "shoulder", roundCyl(Rb, neckH - R1 * 0.25, Rb * 0.08, seg), P, 0, -neckH + (neckH - R1 * 0.25) / 2);
    hz(sh, "shoulder", R1, shA, shB);
    // the module's open front under the cover (dark): brake, motor and gear come out through it
    B.add(sh, "shoulder", axisZ(new THREE.CylinderGeometry(R1 * 0.86, R1 * 0.86, 0.002, seg)), m.seam, 0, 0, shA - 0.0006, false);
    cap(sh, "shoulderCover", R1, "z", shA, -1);
    seam(sh, "shoulder", R1, "z", shB + gap / 2);

    // ---- upper arm: its cast end beyond the shoulder seam, the tube, the elbow socket
    this.j2.position.z = o1;
    sh.add(this.j2);
    hz(this.j2, "upperArm", R1, rA - o1, rB - o1);
    cap(this.j2, "upperArm", R1, "z", rB - o1, 1);
    const xa = R1 * 1.3;
    const xb = a2 - R2 * 1.3;
    B.add(
      this.j2,
      "upperArm",
      linkX(
        [
          [0, ru],
          [R1 * 0.9, ru],
          [R1 * 0.97, ru * 1.075],
          [R1 * 1.14, ru * 1.075],
          [R1 * 1.22, ru * 1.03],
          [xa, ru],
          [xb, rue],
          [a2 - R2 * 1.22, rue * 1.03],
          [a2 - R2 * 1.14, rue * 1.075],
          [a2 - R2 * 0.97, rue * 1.075],
          [a2 - R2 * 0.9, rue],
          [a2, rue],
        ],
        seg,
      ),
      P,
    );
    // label band on the outer side, following the taper
    const radAt = (x: number) => ru + ((rue - ru) * (x - xa)) / (xb - xa);
    const labMap = labelTexture(spec.name);
    labMap.center.set(0.5, 0.5);
    labMap.rotation = Math.PI / 2;
    const lab = new THREE.Mesh(
      new THREE.CylinderGeometry(radAt(a2 * 0.68) * 1.006, radAt(a2 * 0.32) * 1.006, a2 * 0.36, 32, 1, true, Math.PI * 0.3, Math.PI * 0.4),
      new THREE.MeshStandardMaterial({ map: labMap, transparent: true, roughness: 0.5, depthWrite: false }),
    );
    lab.rotation.z = -Math.PI / 2;
    lab.rotation.x = -Math.PI / 2;
    lab.position.x = a2 * 0.5;
    this.j2.add(lab);
    this.tag("upperArm", lab);

    // elbow: the J3 module around the upper arm's end
    const el = this.elbow;
    el.position.x = a2;
    this.j2.add(el);
    hz(el, "elbow", R2, -eA, eA);
    cap(el, "elbow", R2, "z", eA, 1);
    seam(el, "elbow", R2, "z", -eA - gap / 2);

    // ---- forearm: its cast end on the J3 output, the tube, into the wrist socket
    this.j3.position.set(a2, 0, -o2);
    this.j2.add(this.j3);
    hz(this.j3, "forearm", R2 * 0.97, -fr, fr);
    cap(this.j3, "forearm", R2 * 0.97, "z", -fr, -1);
    const fa = R2 * 1.3;
    const fb = a3 - R3 * 1.3;
    B.add(
      this.j3,
      "forearm",
      linkX(
        [
          [0, rf],
          [R2 * 0.88, rf],
          [R2 * 0.95, rf * 1.08],
          [R2 * 1.12, rf * 1.08],
          [R2 * 1.2, rf * 1.03],
          [fa, rf],
          [fb, rfe],
          [a3 - R3 * 1.22, rfe * 1.04],
          [a3 - R3 * 1.12, rfe * 1.1],
          [a3 - R3 * 0.96, rfe * 1.1],
          [a3 - R3 * 0.9, rfe],
          [a3, rfe],
        ],
        seg,
      ),
      P,
    );

    // ---- wrist 1 (J4): socket on the forearm end, the module beyond the seam, the neck down
    this.j4.position.x = a3;
    this.j3.add(this.j4);
    const j4 = this.j4;
    hz(j4, "wrist1", R3, -wA, wA);
    cap(j4, "wrist1", R3, "z", -wA, -1);
    seam(j4, "wrist1", R3, "z", wA + gap / 2);
    hz(j4, "wrist1", R3, wA + gap, wB);
    cap(j4, "wrist1", R3, "z", wB, 1);
    B.add(j4, "wrist1", new THREE.CylinderGeometry(neckR, neckR, h1 - R3 * 1.1, seg), P, 0, -h1 / 2, o3);

    // wrist 2: axis radial, one housing below wrist 1
    B.add(j4, "wrist2", axisX(roundCyl(R3, R3 * 2.0, rim(R3), seg)), P, 0, -h1, o3);
    cap(j4, "wrist2", R3, "x", R3, 1, 0, -h1, o3);

    // ---- wrist 3 (J6): hangs from wrist 2, LED ring, tool flange underneath
    this.j6.position.set(0, -j6y, o3);
    j4.add(this.j6);
    const R6 = R3 * 0.86;
    const w3a = w3h * 0.42;
    B.add(this.j6, "wrist3", roundCyl(R6, w3a + R3 * 0.5, R6 * 0.06, seg), P, 0, (R3 * 0.5 - w3a) / 2);
    seam(this.j6, "wrist3", R6, "y", -w3a - gap / 2);
    const w3b = w3h - w3a - gap;
    B.add(this.j6, "wrist3", roundCyl(R6, w3b, R6 * 0.1, seg), P, 0, -w3a - gap - w3b / 2);
    this.led = mesh(new THREE.CylinderGeometry(R6 * 1.012, R6 * 1.012, 0.006, seg, 1, true), m.led.clone(), false);
    this.led.position.y = -w3a * 0.55;
    this.j6.add(this.led);
    this.tag("wrist3", this.led);
    // ISO-style tool flange: machined face, four bolt holes, centre bore, dowel
    const flR = R3 * 0.66;
    B.add(this.j6, "toolFlange", new THREE.CylinderGeometry(flR, flR, flT, seg), m.metal, 0, -w3h - flT / 2);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      B.add(this.j6, "toolFlange", new THREE.CylinderGeometry(0.0034, 0.0034, 0.0012, 10), m.seam, Math.cos(a) * flR * 0.68, -w3h - flT - 0.0005, Math.sin(a) * flR * 0.68, false);
    }
    B.add(this.j6, "toolFlange", new THREE.CylinderGeometry(flR * 0.3, flR * 0.3, 0.0012, 20), m.seam, 0, -w3h - flT - 0.0005, 0, false);
    this.flange.position.y = -w3h - flT;
    this.j6.add(this.flange);

    // ---- hose clips (anchors), banded around the hose on top of each tube
    const clip = (parent: THREE.Object3D, x: number, y: number, z: number) => {
      const c = new THREE.Object3D();
      c.position.set(x, y, z);
      parent.add(c);
      this.clips.push(c);
      B.add(parent, "clips", new THREE.TorusGeometry(0.016, 0.0042, 6, 16), m.rubber, x, y, z, false, 0, Math.PI / 2, 0);
      // strap down to the tube
      B.add(parent, "clips", rbox(0.012, 0.018, 0.02, 0.003), m.rubber, x, y - 0.018, z, false);
      return c;
    };
    // base rear, upper arm (two), forearm (two), wrist
    const baseClip = new THREE.Object3D();
    baseClip.position.set(-Rb * 1.12, yS - 0.02, -Rb * 0.25);
    root.add(baseClip);
    this.clips.push(baseClip);
    for (const k of [0.1, 0.9]) {
      const x = xa + (xb - xa) * k;
      clip(this.j2, x, radAt(x) + 0.02, -radAt(x) * 0.4);
    }
    for (const k of [0.12, 0.86]) {
      const x = fa + (fb - fa) * k;
      const rr = rf + ((rfe - rf) * (x - fa)) / (fb - fa);
      clip(this.j3, x, rr + 0.02, rr * 0.3);
    }
    const wristClip = new THREE.Object3D();
    wristClip.position.set(-R3 * 1.18, -h1, o3);
    j4.add(wristClip);
    this.clips.push(wristClip);

    B.flush((key, me) => this.tag(key as RobotPart, me));

    this.dims = { R1, R2, R3, Rb, o1, o2, o3, h1, w3h, shA, shB, rB, yS };
    this.apply();
  }

  private tag(part: RobotPart, o: THREE.Object3D) {
    const list = this.parts.get(part);
    if (list) list.push(o);
    else this.parts.set(part, [o]);
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
    const reach = solveArm(this.spec.link, this.zt, target.x - base.x, target.y - base.y, target.z - base.z, yaw, out);
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

/** One pad layout: every suction cup is an instance of one mesh (one draw call). */
type PadSet = { inst: THREE.InstancedMesh; items: { fx: number; fz: number }[] };
/** One finger layout: fingers and feet are two instanced meshes, posed from their pivots. */
type TineSet = { tine: THREE.InstancedMesh; foot: THREE.InstancedMesh; D: number; pivots: { side: number; fz: number }[]; W: number; L: number; s: number };

const _m = new THREE.Matrix4();
const _p = new THREE.Matrix4();
const _l = new THREE.Matrix4();
const _v = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _z = new THREE.Vector3(0, 0, 1);

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
      // rubber-faced clamp plate presses the bag from above while the fingers close under it
      this.clampPlate = mesh(rbox(1, 0.012, 1, 0.003), m.foam);
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
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) items.push({ fx: (i + 0.5) / nx - 0.5, fz: (j + 0.5) / nz - 0.5 });
    const inst = new THREE.InstancedMesh(geo, this.m.rubber, items.length);
    inst.position.y = -0.084;
    inst.castShadow = true;
    inst.receiveShadow = true;
    inst.frustumCulled = false;
    this.body.add(inst);
    return { inst, items };
  }

  /** Fork fingers on both sides, on pivots under the frame; each foot swings under the bag. */
  private buildTines(s: GripperSpec): TineSet {
    const n = s.claw?.fingers ?? 4;
    const D = (s.claw?.depth ?? 186) / 1000;
    const pivots: TineSet["pivots"] = [];
    for (const side of [-1, 1]) for (let i = 0; i < n; i++) pivots.push({ side, fz: (i + 0.5) / n - 0.5 });
    const mk = (g: THREE.BufferGeometry) => {
      const im = new THREE.InstancedMesh(g, this.m.metal, pivots.length);
      im.castShadow = true;
      im.receiveShadow = true;
      im.frustumCulled = false;
      this.body.add(im);
      return im;
    };
    return { tine: mk(rbox(0.012, D + 0.014, 0.03, 0.004, 1)), foot: mk(rbox(0.1, 0.008, 0.03, 0.003, 1)), D, pivots, W: 0.4, L: 0.6, s: 1 };
  }

  /** Pose every finger of a set: pivot under the frame edge, swung by the open amount. */
  private poseTines(set: TineSet) {
    const vis = set.s > 0.002;
    set.tine.visible = set.foot.visible = vis;
    if (!vis) return;
    const sc = Math.max(0.001, set.s);
    set.pivots.forEach((p, i) => {
      _q.setFromAxisAngle(_z, p.side * (0.05 + this.openT * 0.55));
      _p.compose(_v.set((p.side * set.W) / 2, -0.07, p.fz * set.L), _q, _s.set(sc, sc, sc));
      set.tine.setMatrixAt(i, _m.multiplyMatrices(_p, _l.makeTranslation(0, 0.01 - (set.D + 0.014) / 2, 0)));
      set.foot.setMatrixAt(i, _m.multiplyMatrices(_p, _l.makeTranslation(-p.side * 0.05, -set.D, 0)));
    });
    set.tine.instanceMatrix.needsUpdate = true;
    set.foot.instanceMatrix.needsUpdate = true;
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
      if (this.spec.family === "pence") {
        const old = this.tineSets.pop();
        if (old) old.tine.visible = old.foot.visible = false;
      } else {
        const old = this.padSets.pop();
        if (old) old.inst.visible = false;
      }
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
        set.s = k === 0 ? grow : shrink;
        set.W = W;
        set.L = L;
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
      set.inst.visible = s > 0.002;
      const sc = Math.max(0.001, s);
      set.items.forEach((p, i) => set.inst.setMatrixAt(i, _m.compose(_v.set(p.fx * W, 0, p.fz * L), _q.identity(), _s.set(sc, sc, sc))));
      set.inst.instanceMatrix.needsUpdate = true;
    });
  }

  /** 0 = closed on the product, 1 = open (claw only). */
  setOpen(t: number) {
    this.openT = t;
    for (const set of this.tineSets) this.poseTines(set);
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
  private readonly segs: number;
  private readonly radial: number;
  private readonly radius: number;
  private pts: THREE.Vector3[];

  constructor(count: number, radius: number, mat: THREE.Material, segs = 72, radial = 8) {
    this.radius = radius;
    this.segs = segs;
    this.radial = radial;
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
