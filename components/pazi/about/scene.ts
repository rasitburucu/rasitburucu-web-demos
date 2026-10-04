// "Pazının içi": the same P30 arm the home page runs, built from the same
// geometry and materials (components/pazi/cell), split into its service
// modules. Scroll progress moves each module along its joint axis; nothing
// animates on its own, so the scene renders only when the progress changes
// and sleeps off screen.

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MODELS, PALLET_DECK } from "@/lib/pazi/plan";
import { sizeGripper } from "@/lib/pazi/gripper";
import { Gripper, Hose, Riser, Robot, type Pose, type RobotPart } from "@/components/pazi/cell/robot";
import { bagMaterial, floorTextures, makeMaterials, woodMaterial, type Mats } from "@/components/pazi/cell/materials";
import { axisZ, mesh, pillowGeometry, rbox, roundCyl, roundRectStrip } from "@/components/pazi/cell/geo";
import { PART_COUNT, PART_IDS, P_OPEN, amounts, cellPresence, framing, minJerk, span, workT, type PartId } from "./model";

export type SceneOptions = {
  quality: "high" | "mid";
  dpr: number;
  /** Narrow (phone) composition: robot under the text, then centred. */
  narrow: boolean;
  onRender?: () => void;
};

export type Anchor = { x: number; y: number; z: number };

type Contribution = { part: number; dir: THREE.Vector3; tilt?: THREE.Vector3 };
type Mover = { obj: THREE.Object3D; base: THREE.Vector3; baseQ: THREE.Quaternion; parts: Contribution[] };
type Guide = { line: THREE.Line; part: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const idx = (id: PartId) => PART_IDS.indexOf(id);

/** Service pose: upper arm nearly upright, forearm level, wrist straight down. */
const T1 = Math.PI * 0.94;
const SERVICE: Pose = { t1: T1, t2: 1.4, t3: -1.4, t6: 0 };

const BAG = { u: 0.6, g: 0.4, y: 0.12 };
/** The arm stands on the cell's fixed post, as on the home page. */
const RISER_H = 0.42;

/** Camera azimuth and elevation (radians). The arm's open side (shoulder cover) faces the camera. */
const AZ = -0.7;
const EL = 0.36;
/** Floor directions as seen from the camera: screen right, and towards the viewer. */
const SCREEN_R = new THREE.Vector3(Math.cos(AZ), 0, -Math.sin(AZ));
const TOWARD = new THREE.Vector3(Math.sin(AZ), 0, Math.cos(AZ));
const floorAt = (right: number, toward: number) => SCREEN_R.clone().multiplyScalar(right).addScaledVector(TOWARD, toward);

export class TeardownScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(22, 1, 0.3, 40);
  private m: Mats;
  private opts: SceneOptions;
  private canvas: HTMLCanvasElement;
  private robot: Robot;
  private gripper: Gripper;
  private hose: Hose;
  private hoseStart = new THREE.Vector3();
  private movers = new Map<THREE.Object3D, Mover>();
  private anchors: THREE.Object3D[] = [];
  private guides: Guide[] = [];
  private cell = new THREE.Group();
  private cellMats: THREE.Material[] = [];
  private cellDecals: THREE.Material[] = [];
  private hoseWorking = false;
  private clamps: THREE.Object3D[] = [];
  private tape!: THREE.Mesh;
  private conveyorBag!: THREE.Mesh;
  private carriedBag!: THREE.Mesh;
  private placedBag!: THREE.Mesh;
  private pickAt = new THREE.Vector3();
  private placeAt = new THREE.Vector3();
  private pickYaw = 0;
  private placeYaw = 0;
  /** Claw turn from pick to place; the claw and bag are symmetric, so never more than a quarter turn. */
  private turn = 0;
  private servicePose: Pose = { ...SERVICE };
  private e: number[] = new Array(PART_COUNT).fill(0);
  private p = -1;
  private raf = 0;
  private visible = true;
  private dirty = true;
  private width = 1;
  private height = 1;
  private io?: IntersectionObserver;
  private ro?: ResizeObserver;
  private disposables: { dispose(): void }[] = [];
  private framesIntro = { target: new THREE.Vector3(), dist: 1 };
  private framesOpen = { target: new THREE.Vector3(), dist: 1 };
  private camDir = new THREE.Vector3();
  private v = new THREE.Vector3();
  private q = new THREE.Quaternion();
  private qt = new THREE.Quaternion();
  onResize?: () => void;

  constructor(canvas: HTMLCanvasElement, opts: SceneOptions) {
    this.canvas = canvas;
    this.opts = opts;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer = renderer;
    this.m = makeMaterials();

    // the cell's light: soft room reflections, one key light with shadows, a cool fill
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = env;
    this.scene.environmentIntensity = 0.5;
    pmrem.dispose();
    this.disposables.push(env);
    this.scene.add(new THREE.HemisphereLight("#eef0ea", "#8f918a", 0.55));
    const key = new THREE.DirectionalLight("#fff6e8", 3.0);
    key.position.set(-3.2, 7.2, 3.4);
    key.castShadow = true;
    const sm = opts.quality === "high" ? 2048 : 1024;
    key.shadow.mapSize.set(sm, sm);
    const sc = key.shadow.camera;
    sc.left = -2.6;
    sc.right = 2.6;
    sc.top = 2.6;
    sc.bottom = -2.6;
    sc.near = 3;
    sc.far = 14;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.03;
    key.shadow.radius = 3;
    this.scene.add(key);
    const fill = new THREE.DirectionalLight("#e6eef5", 0.6);
    fill.position.set(4, 3, 4);
    this.scene.add(fill);

    // epoxy floor that dissolves into the page
    const ft = floorTextures();
    ft.map.repeat.set(3, 3);
    ft.rough.repeat.set(3, 3);
    this.disposables.push(ft.map, ft.rough, ft.alpha);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 9),
      new THREE.MeshStandardMaterial({ map: ft.map, roughnessMap: ft.rough, roughness: 0.62, alphaMap: ft.alpha, transparent: true, depthWrite: false }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0.2, 0, 0.2);
    floor.receiveShadow = true;
    floor.renderOrder = -2;
    this.scene.add(floor);

    // ---- the arm
    const spec = MODELS.find((x) => x.id === "p30") ?? MODELS[MODELS.length - 1];
    const m = this.m;
    const riser = new Riser(false, RISER_H, m);
    this.scene.add(riser.group);
    this.robot = new Robot(spec, m);
    this.robot.root.position.y = RISER_H;
    this.scene.add(this.robot.root);
    // the same claw the fit sizes for this 25 kg bag (lib/pazi/gripper.ts)
    this.gripper = new Gripper(sizeGripper({ kind: "torba", u: BAG.u * 1000, g: BAG.g * 1000, y: BAG.y * 1000, kg: 25 }), m);
    this.robot.flange.add(this.gripper.group);
    // the quick changer stays with the tool flange when the claw comes off
    this.robot.flange.add(this.gripper.adapter);
    this.robot.pose = { ...SERVICE };
    this.robot.apply();
    this.robot.setLed("#5fd38a");
    this.scene.add(this.aoDecal(0.75, 0.75, 0.48));

    const parts = this.robot.parts;
    const get = (p: RobotPart) => parts.get(p) ?? [];
    const { R1, o1, o2, h1 } = this.robot.dims;
    const { a2, a3, d1 } = this.robot;

    // shoulder internals: hidden inside the housing until they slide out along J2
    const sh = this.robot.shoulder;
    const z0 = o1 * 0.55;
    const hl = R1 * 1.025;
    const brake = new THREE.Group();
    brake.position.z = z0 - hl * 0.74;
    {
      const disc = mesh(axisZ(roundCyl(R1 * 0.66, 0.028, 0.006)), m.anodized);
      const pad = mesh(axisZ(new THREE.CylinderGeometry(R1 * 0.5, R1 * 0.5, 0.032, 40)), m.capDark);
      const hub = mesh(axisZ(new THREE.CylinderGeometry(R1 * 0.2, R1 * 0.2, 0.04, 24)), m.metal);
      brake.add(disc, pad, hub);
    }
    const motor = new THREE.Group();
    motor.position.z = z0 - hl * 0.22;
    {
      const len = hl * 0.78;
      const body = mesh(axisZ(roundCyl(R1 * 0.74, len, 0.012)), m.graphitePaint);
      const ring = mesh(axisZ(new THREE.CylinderGeometry(R1 * 0.75, R1 * 0.75, len * 0.18, 40, 1, true)), m.capRing);
      ring.position.z = len * 0.2;
      const shaft = mesh(axisZ(new THREE.CylinderGeometry(R1 * 0.12, R1 * 0.12, len * 1.35, 16)), m.metal);
      const enc = mesh(axisZ(new THREE.CylinderGeometry(R1 * 0.4, R1 * 0.4, 0.012, 32)), m.foam);
      enc.position.z = -len / 2 - 0.008;
      motor.add(body, ring, shaft, enc);
    }
    const gearbox = new THREE.Group();
    gearbox.position.z = z0 + hl * 0.46;
    {
      const len = hl * 0.48;
      const outer = mesh(axisZ(roundCyl(R1 * 0.84, len, 0.008)), m.metal);
      const flex = mesh(axisZ(new THREE.CylinderGeometry(R1 * 0.6, R1 * 0.6, len * 1.08, 40)), m.alu);
      const wave = mesh(axisZ(new THREE.CylinderGeometry(R1 * 0.34, R1 * 0.34, len * 1.14, 6)), m.anodized);
      gearbox.add(outer, flex, wave);
    }
    sh.add(brake, motor, gearbox);

    // ---- cable line: from the floor (towards the control box) along the clips to the claw
    this.hose = new Hose(this.robot.clips.length + 3, 0.012, m.hose);
    this.scene.add(this.hose.mesh);

    // ---- control box and area scanner, beside the arm
    const ctrl = new THREE.Group();
    ctrl.position.copy(floorAt(-0.15, -0.95));
    ctrl.rotation.y = AZ + 0.2;
    let door: THREE.Group;
    {
      const W = 0.46;
      const H = 0.62;
      const D = 0.28;
      const body = mesh(rbox(W, H, D, 0.012), m.graphitePaint);
      body.position.y = 0.06 + H / 2;
      ctrl.add(body);
      for (const sx of [-1, 1])
        for (const sz of [-1, 1]) {
          const foot = mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.06, 12), m.rubber);
          foot.position.set(sx * (W / 2 - 0.04), 0.03, sz * (D / 2 - 0.04));
          ctrl.add(foot);
        }
      // inside, behind the door: back plate, three axis drives, a terminal rail
      const back = mesh(new THREE.BoxGeometry(W - 0.04, H - 0.06, 0.006), m.capDark);
      back.position.set(0, 0.06 + H / 2, D / 2 + 0.001);
      ctrl.add(back);
      for (let i = 0; i < 3; i++) {
        const drv = mesh(rbox(0.1, 0.26, 0.05, 0.004), m.anodized);
        drv.position.set(-0.13 + i * 0.13, 0.06 + H * 0.6, D / 2 + 0.026);
        const lamp = mesh(new THREE.SphereGeometry(0.008, 10, 8), m.led, false);
        lamp.position.set(-0.13 + i * 0.13 + 0.03, 0.06 + H * 0.6 + 0.1, D / 2 + 0.053);
        ctrl.add(drv, lamp);
      }
      const rail = mesh(rbox(W - 0.1, 0.04, 0.04, 0.004), m.metal);
      rail.position.set(0, 0.06 + H * 0.22, D / 2 + 0.02);
      ctrl.add(rail);
      door = new THREE.Group();
      door.position.set(0, 0.06 + H / 2, D / 2 + 0.012);
      const panel = mesh(rbox(W - 0.012, H - 0.012, 0.022, 0.006), m.paint);
      door.add(panel);
      const plate = mesh(rbox(0.12, 0.05, 0.004, 0.002), m.anodized, false);
      plate.position.set(-W * 0.26, H * 0.34, 0.013);
      door.add(plate);
      const handle = mesh(rbox(0.016, 0.1, 0.02, 0.004), m.capDark);
      handle.position.set(W * 0.38, 0, 0.02);
      door.add(handle);
      const collar = mesh(axisZ(new THREE.CylinderGeometry(0.034, 0.034, 0.008, 28)), m.scanner);
      collar.position.set(W * 0.22, H * 0.3, 0.014);
      const stop = mesh(axisZ(new THREE.CylinderGeometry(0.022, 0.026, 0.024, 24)), new THREE.MeshStandardMaterial({ color: "#b3321f", roughness: 0.45 }));
      stop.position.set(W * 0.22, H * 0.3, 0.03);
      door.add(collar, stop);
      ctrl.add(door);
      ctrl.add(this.aoDecal(W + 0.1, D + 0.1, 0.4));
    }
    this.scene.add(ctrl);

    const scan = new THREE.Group();
    scan.position.copy(opts.narrow ? floorAt(0.55, 0.62) : floorAt(0.98, 0.52));
    scan.rotation.y = AZ - 0.3;
    const scanHead = new THREE.Group();
    {
      const stand = mesh(rbox(0.14, 0.03, 0.14, 0.004), m.graphitePaint);
      stand.position.y = 0.015;
      scan.add(stand);
      const body = mesh(rbox(0.11, 0.13, 0.11, 0.012), m.scanner);
      body.position.y = 0.065;
      const win = mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.05, 24, 1, false, -Math.PI / 2, Math.PI), m.glassDark);
      win.position.set(0, 0.08, 0.035);
      scanHead.add(body, win);
      scanHead.position.y = 0.03;
      scan.add(scanHead);
      scan.add(this.aoDecal(0.18, 0.18, 0.4));
    }
    this.scene.add(scan);

    // ---- movers: every module moves along its own joint axis, in its parent's frame
    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    const add = (id: PartId, obj: THREE.Object3D, dir: THREE.Vector3, tilt?: THREE.Vector3) => {
      let mv = this.movers.get(obj);
      if (!mv) {
        mv = { obj, base: obj.position.clone(), baseQ: obj.quaternion.clone(), parts: [] };
        this.movers.set(obj, mv);
      }
      mv.parts.push({ part: idx(id), dir, tilt });
    };
    const anchor = (parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
      const a = new THREE.Object3D();
      a.position.set(x, y, z);
      parent.add(a);
      return a;
    };
    const A: Partial<Record<PartId, THREE.Object3D>> = {};

    // 01 cable line: lifts off the arm as one piece (its clamps leave with it, see pose())
    add("hose", this.hose.mesh, floorAt(-0.22, 0.12).setY(0.24), V(0, 0, 0.12));
    this.clamps = get("clips");
    // 02 claw: drops off the quick changer along J6
    add("gripper", this.gripper.group, V(0, -0.3, 0), V(0.18, 0, 0));
    A.gripper = anchor(this.gripper.group, 0.18, -0.12, 0);
    // 03 tool flange with the quick changer
    for (const o of get("toolFlange")) add("toolFlange", o, V(0, -0.13, 0));
    add("toolFlange", this.robot.flange, V(0, -0.13, 0));
    A.toolFlange = anchor(this.robot.flange, 0, -0.02, 0);
    // 04 wrist modules: off the end of the forearm, then J5 and J6 apart, downwards
    add("wrist", this.robot.j4, V(0.3, 0, 0));
    for (const o of get("wrist2")) add("wrist", o, V(0, -0.075, 0));
    add("wrist", this.robot.j6, V(0, -0.15, 0));
    A.wrist = anchor(this.robot.j4, 0, -h1, this.robot.dims.o3);
    // 05 forearm slides off the elbow along its own length, and a little off the J3 shaft
    const faAxis = V(Math.cos(SERVICE.t3), Math.sin(SERVICE.t3), 0); // forearm axis in the upper-arm frame
    add("forearm", this.robot.j3, faAxis.clone().multiplyScalar(0.4).add(V(0, 0, -0.05)));
    A.forearm = anchor(this.robot.j3, a3 * 0.5, 0, 0);
    // 06 elbow lifts off the top of the upper arm, along its length
    add("elbow", this.robot.elbow, V(0.26, 0, 0));
    add("elbow", this.robot.j3, V(0.26, 0, 0));
    A.elbow = anchor(this.robot.elbow, 0, 0, -o2 * 0.4);
    // 07 upper arm slides out of the shoulder along J2
    add("upperArm", this.robot.j2, V(0, 0, 0.3));
    A.upperArm = anchor(this.robot.j2, a2 * 0.55, 0, 0);
    // 08–11 shoulder: cover, brake, motor, strain-wave gear, out along J2 the other way
    for (const o of get("shoulderCover")) add("shoulderCover", o, V(0, 0, -0.62));
    A.shoulderCover = anchor(get("shoulderCover")[0] ?? sh, 0, 0, 0);
    add("brake", brake, V(0, 0, -0.47), V(0.25, 0, 0));
    add("motor", motor, V(0, 0, -0.32), V(0, 0.2, 0));
    add("gearbox", gearbox, V(0, 0, -0.16), V(0.15, 0, 0));
    A.brake = brake;
    A.motor = motor;
    A.gearbox = gearbox;
    // 12 base joint: the shoulder lifts off J1; 13 the base lifts off its mounting flange
    add("base", sh, V(0, 0.2, 0));
    A.base = anchor(get("base")[0] ?? this.robot.j1, 0, 0, 0);
    add("mount", this.robot.j1, V(0, 0.12, 0));
    A.mount = anchor(this.robot.root, R1 * 1.25, 0.03, R1 * 0.6);
    // 14 control box: rolls out from behind the arm into view, then its door swings out;
    // 15 scanner head lifts off its stand
    add("controller", ctrl, opts.narrow ? floorAt(0.42, 0.55) : floorAt(0.95, 0.2), V(0, 0.35, 0));
    add("controller", door, V(0, 0, 0.26), V(0, -0.5, 0));
    A.controller = anchor(door, 0.1, 0.1, 0.02);
    add("scanner", scanHead, V(0, 0.17, 0), V(0, 0.6, 0));
    A.scanner = anchor(scanHead, 0, 0.08, 0);

    // ---- dashed centre lines along the axes the parts travel
    const dash = (parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, id: PartId) => {
      const g = new THREE.BufferGeometry().setFromPoints([a, b]);
      const mat = new THREE.LineDashedMaterial({ color: "#4a4d48", dashSize: 0.03, gapSize: 0.012, transparent: true, opacity: 0, depthWrite: false });
      const line = new THREE.Line(g, mat);
      line.computeLineDistances();
      line.visible = false;
      parent.add(line);
      this.guides.push({ line, part: idx(id) });
    };
    const fl = this.robot.flange.position;
    dash(this.robot.j6, V(0, fl.y + 0.02, 0), V(0, fl.y - 0.62, 0), "gripper");
    dash(this.robot.j2, V(a2, 0, -o2).addScaledVector(faAxis, a3 * 0.4), V(a2, 0, -o2).addScaledVector(faAxis, a3 + 0.62), "forearm");
    dash(this.robot.j2, V(a2 + 0.02, 0, 0), V(a2 + 0.3, 0, 0), "elbow");
    dash(sh, V(0, 0, o1 * 0.55 + 0.1), V(0, 0, o1 + 0.42), "upperArm");
    dash(sh, V(0, 0, z0 - hl), V(0, 0, z0 - hl - 0.74), "shoulderCover");
    dash(this.robot.root, V(0, -0.01, 0), V(0, d1 + 0.42, 0), "mount");
    dash(this.robot.j3, V(a3 - 0.02, 0, 0), V(a3 + 0.22, 0, 0), "wrist");

    // label anchors in part order (the hose anchor sits on the cable itself)
    A.hose = anchor(this.hose.mesh, 0, 0, 0);
    this.anchors = PART_IDS.map((id) => A[id] ?? this.robot.root);

    // ---- the working cell that returns at the end
    this.buildCell();
    this.scene.add(this.cell);

    this.updateHose();
    this.placeHoseAnchor();

    this.measureFrames();
    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas.parentElement ?? canvas);
    this.io = new IntersectionObserver(
      (e) => {
        this.visible = e[0]?.isIntersecting ?? true;
        if (this.visible && this.dirty) this.schedule();
      },
      { rootMargin: "120px" },
    );
    this.io.observe(canvas);
  }

  /* ------------------------------------------------------------ public */

  setProgress(p: number) {
    if (Math.abs(p - this.p) < 1e-5) return;
    this.p = p;
    this.dirty = true;
    this.schedule();
  }

  /** Label anchors in canvas pixels, part order. `z` > 1 means behind the camera. */
  project(out: Anchor[] = []) {
    this.camera.updateMatrixWorld();
    for (let i = 0; i < this.anchors.length; i++) {
      this.anchors[i].getWorldPosition(this.v);
      this.v.project(this.camera);
      const a = out[i] ?? (out[i] = { x: 0, y: 0, z: 0 });
      a.x = (this.v.x * 0.5 + 0.5) * this.width;
      a.y = (-this.v.y * 0.5 + 0.5) * this.height;
      a.z = this.v.z;
    }
    return out;
  }

  /** Anchors with every part out (for laying out the label columns once). */
  projectOpen() {
    const keep = this.p;
    this.pose(P_OPEN);
    const out = this.project();
    this.pose(keep < 0 ? 0 : keep);
    return out;
  }

  /** Draw now (stills, first frame). */
  renderNow() {
    this.pose(this.p < 0 ? 0 : this.p);
    this.renderer.render(this.scene, this.camera);
    this.dirty = false;
    this.opts.onRender?.();
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.io?.disconnect();
    this.ro?.disconnect();
    this.scene.traverse((o) => {
      const me = o as THREE.Mesh;
      if (me.geometry) me.geometry.dispose();
      const mat = me.material as THREE.Material | THREE.Material[] | undefined;
      const all = Array.isArray(mat) ? mat : mat ? [mat] : [];
      for (const x of all) {
        (x as THREE.MeshStandardMaterial).map?.dispose();
        x.dispose();
      }
    });
    Object.values(this.m).forEach((x) => {
      (x as THREE.MeshStandardMaterial).map?.dispose();
      (x as THREE.Material).dispose();
    });
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
  }

  /* ------------------------------------------------------------ frame */

  private schedule() {
    if (this.raf || !this.visible) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      if (!this.visible) return;
      this.renderNow();
    });
  }

  private pose(p: number) {
    amounts(p, this.e);

    // the arm: service pose while apart; at the end it picks a bag and sets it down
    const w = workT(p);
    this.workPose(w);

    // modules along their axes
    for (const mv of this.movers.values()) {
      const pos = mv.obj.position.copy(mv.base);
      this.q.copy(mv.baseQ);
      for (const c of mv.parts) {
        const e = this.e[c.part];
        if (e <= 0) continue;
        pos.addScaledVector(c.dir, e);
        if (c.tilt) {
          // tilt on the way, square again when fully out (a drawing reads straight)
          const s = Math.sin(Math.PI * e);
          this.v.copy(c.tilt);
          const ang = this.v.length() * s;
          if (ang > 1e-4) {
            this.qt.setFromAxisAngle(this.v.normalize(), ang);
            this.q.multiply(this.qt);
          }
        }
      }
      // joint groups keep the rotation the pose gave them
      if (mv.parts.some((c) => c.tilt)) mv.obj.quaternion.copy(this.q);
    }

    const clampOn = this.e[idx("hose")] < 0.3;
    for (const c of this.clamps) c.visible = clampOn;

    for (const g of this.guides) {
      const e = this.e[g.part];
      const mat = g.line.material as THREE.LineDashedMaterial;
      mat.opacity = 0.55 * Math.min(1, e * 1.4);
      g.line.visible = e > 0.01;
    }

    // the working cell
    const c = Math.min(1, cellPresence(p));
    this.cell.visible = c > 0.01;
    for (const mat of this.cellMats) {
      mat.opacity = c;
      mat.transparent = c < 0.999;
      mat.depthWrite = c >= 0.999;
    }
    for (const mat of this.cellDecals) mat.opacity = c;

    // hose follows the arm while it works; otherwise it holds the service shape
    if (w > 0 || this.hoseWorking) {
      this.updateHose();
      this.hoseWorking = w > 0;
    }

    // status light: green in the cell, yellow in service
    const service = p > 0.06 && p < 0.86;
    this.robot.setLed(service ? "#f5a800" : "#5fd38a", service ? 1.2 : 1.6);

    this.frame(p);
  }

  private workPose(w: number) {
    const r = this.robot;
    const g = this.gripper;
    const show = (pick: boolean, carried: boolean, placed: boolean) => {
      this.conveyorBag.visible = pick;
      this.carriedBag.visible = carried;
      this.placedBag.visible = placed;
    };
    if (w <= 0.18) {
      r.pose = { ...this.servicePose };
      r.apply();
      g.setOpen(1);
      show(true, false, false);
      return;
    }
    const above = (pt: THREE.Vector3, h: number) => this.v.copy(pt).setY(pt.y + h);
    const tgt = new THREE.Vector3();
    let yaw = this.pickYaw;
    let open = 1;
    let state: [boolean, boolean, boolean] = [true, false, false];
    if (w < 0.36) {
      // swing from the service pose to above the conveyor bag, in joint space
      const k = minJerk(span(w, 0.18, 0.36));
      const goal = r.solve(above(this.pickAt, 0.16), this.pickYaw, { t1: 0, t2: 0, t3: 0, t6: 0 }).pose;
      const sp = this.servicePose;
      const t1 = sp.t1 + wrap(goal.t1 - sp.t1);
      const t6 = sp.t6 + wrap(goal.t6 - sp.t6);
      r.pose = { t1: lerp(sp.t1, t1, k), t2: lerp(sp.t2, goal.t2, k), t3: lerp(sp.t3, goal.t3, k), t6: lerp(sp.t6, t6, k) };
      r.apply();
      g.setOpen(1);
      show(true, false, false);
      return;
    }
    if (w < 0.46) {
      tgt.copy(this.pickAt).setY(this.pickAt.y + 0.16 * (1 - minJerk(span(w, 0.36, 0.46))));
    } else if (w < 0.52) {
      tgt.copy(this.pickAt);
      open = 1 - minJerk(span(w, 0.46, 0.51));
      state = open < 0.15 ? [false, true, false] : [true, false, false];
    } else if (w < 0.8) {
      // lift, carry, set down: a cylindrical arc like the live cell
      const k = minJerk(span(w, 0.52, 0.8));
      const lift = Math.sin(Math.PI * Math.min(1, k * 1.15)) * 0.18;
      tgt.lerpVectors(this.pickAt, this.placeAt, k);
      tgt.y += lift;
      yaw = this.pickYaw + this.turn * k;
      open = 0;
      state = [false, true, false];
    } else if (w < 0.88) {
      tgt.copy(this.placeAt);
      yaw = this.placeYaw;
      open = minJerk(span(w, 0.81, 0.87));
      state = open > 0.2 ? [false, false, true] : [false, true, false];
    } else {
      tgt.copy(this.placeAt).setY(this.placeAt.y + 0.14 * minJerk(span(w, 0.88, 1)));
      yaw = this.placeYaw;
      open = 1;
      state = [false, false, true];
    }
    r.solve(tgt, yaw, r.pose);
    r.apply();
    g.setOpen(open);
    show(...state);
  }

  /** Camera: closer on the assembled cell, wider as the parts spread out. */
  private frame(p: number) {
    const f = framing(p);
    const zoom = minJerk(span(p, 0.07, 0.3)) * (1 - minJerk(span(p, 0.72, 0.87)));
    const target = this.v.lerpVectors(this.framesIntro.target, this.framesOpen.target, zoom);
    const dist = lerp(this.framesIntro.dist, this.framesOpen.dist, zoom);
    this.camera.position.copy(target).addScaledVector(this.camDir, dist);
    this.camera.lookAt(target);
    const w = this.width;
    const h = this.height;
    const fx = this.opts.narrow ? 0.5 : lerp(0.7, 0.5, f);
    const fy = this.opts.narrow ? lerp(0.66, 0.5, f) : lerp(0.53, 0.5, f);
    this.camera.setViewOffset(w, h, (0.5 - fx) * w, (0.5 - fy) * h, w, h);
    this.camera.updateProjectionMatrix();
  }

  private resize() {
    const el = this.canvas.parentElement ?? this.canvas;
    const w = Math.max(1, el.clientWidth);
    const h = Math.max(1, el.clientHeight);
    this.width = w;
    this.height = h;
    this.renderer.setPixelRatio(this.opts.dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.measureFrames();
    this.dirty = true;
    this.renderNow();
    this.onResize?.();
  }

  /** Distances that fit the assembled cell and the fully open set into the canvas. */
  private measureFrames() {
    const aspect = this.width / this.height;
    this.camDir.set(Math.sin(AZ) * Math.cos(EL), Math.sin(EL), Math.cos(AZ) * Math.cos(EL)).normalize();
    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const fitH = (need: number, share: number) => {
      // the visible height needed, widened when the canvas is narrow
      const fitAspect = Math.min(1, aspect / share);
      return need / (2 * Math.tan(fov / 2)) / fitAspect;
    };
    if (this.opts.narrow) {
      // portrait: width is the limit, so the distances fit the width of the set
      this.framesIntro.target.copy(floorAt(0.18, 0)).setY(0.7);
      this.framesIntro.dist = fitH(3.85, 0.62);
      // the open set runs from the claw (far left) to the scanner: centre on that span
      this.framesOpen.target.copy(floorAt(-0.56, 0.1)).setY(0.86);
      this.framesOpen.dist = fitH(4.35, 0.62);
    } else {
      this.framesIntro.target.copy(floorAt(0.3, 0)).setY(0.72);
      this.framesIntro.dist = fitH(2.95, 1.1);
      // the open set reaches further left (wrist and claw) than right: aim a little left of the axis
      this.framesOpen.target.copy(floorAt(-0.3, 0)).setY(0.98);
      this.framesOpen.dist = fitH(3.45, 1.35);
    }
  }

  /* ------------------------------------------------------------ build */

  private updateHose() {
    const r = this.robot;
    const clips = r.clips;
    const n = clips.length;
    const pts: THREE.Vector3[] = [];
    r.root.updateMatrixWorld(true);
    pts.push(this.hoseStart.clone());
    for (let i = 0; i < n; i++) pts.push(clips[i].getWorldPosition(new THREE.Vector3()));
    const end = this.gripper.hoseAnchor.getWorldPosition(new THREE.Vector3());
    const mid = pts[n].clone().lerp(end, 0.5);
    mid.y -= 0.03;
    pts.push(mid, end);
    this.hose.update(pts);
  }

  /** The cable's label anchor sits on the cable where it runs along the forearm, clear of the upper arm's anchor. */
  private placeHoseAnchor() {
    const r = this.robot;
    r.root.updateMatrixWorld(true);
    const a = r.clips[5].getWorldPosition(new THREE.Vector3());
    this.anchors[idx("hose")].position.copy(a);
  }

  private buildCell() {
    const m = this.m;
    const fade = <T extends THREE.Material>(x: T) => {
      this.cellMats.push(x);
      return x;
    };
    const c = this.cell;

    // EUR pallet ahead of the arm, two full layers and one bag of the third
    const wood = fade(woodMaterial());
    const pallet = new THREE.Group();
    const L = 1.2;
    const W = 0.8;
    const deck = PALLET_DECK / 1000;
    for (let i = 0; i < 5; i++) {
      const b = mesh(rbox(0.12, 0.022, L, 0.003), wood);
      b.position.set(-W / 2 + 0.06 + (i * (W - 0.12)) / 4, deck - 0.011, 0);
      pallet.add(b);
    }
    for (const z of [-L / 2 + 0.07, 0, L / 2 - 0.07]) {
      for (const x of [-W / 2 + 0.07, 0, W / 2 - 0.07]) {
        const bl = mesh(rbox(0.14, deck - 0.044, 0.12, 0.004), wood);
        bl.position.set(x, 0.022 + (deck - 0.044) / 2, z);
        pallet.add(bl);
      }
      const s = mesh(rbox(W, 0.022, 0.14, 0.003), wood);
      s.position.set(0, deck - 0.033, z);
      pallet.add(s);
    }
    const bagGeo = pillowGeometry(BAG.g, BAG.y, BAG.u);
    const bagMat = fade(bagMaterial());
    const slots: [number, number][] = [
      [-0.2, -0.3],
      [0.2, -0.3],
      [-0.2, 0.3],
      [0.2, 0.3],
    ];
    for (let k = 0; k < 2; k++)
      for (const [x, z] of slots) {
        const b = mesh(bagGeo, bagMat);
        b.position.set(x, deck + BAG.y / 2 + k * BAG.y, z);
        pallet.add(b);
      }
    const top = mesh(bagGeo, bagMat);
    top.position.set(slots[2][0], deck + BAG.y * 2.5, slots[2][1]);
    pallet.add(top);
    // pallet to the arm's right and a little back; the conveyor ends in front of it
    const pc = floorAt(0.62, -0.85);
    pallet.position.copy(pc);
    pallet.rotation.y = AZ + Math.PI / 2;
    c.add(pallet);
    const placeLocal = new THREE.Vector3(slots[0][0], deck + BAG.y * 2.5, slots[0][1]);
    this.placedBag = mesh(bagGeo, bagMat);
    this.placedBag.position.copy(placeLocal);
    pallet.add(this.placedBag);
    pallet.updateMatrixWorld(true);
    const placeWorld = placeLocal.clone().applyMatrix4(pallet.matrixWorld);
    this.placeYaw = pallet.rotation.y;

    // conveyor end beside the arm, one bag waiting at the stop
    const conv = new THREE.Group();
    const cw = 0.52;
    const len = 1.3;
    const topY = 0.5;
    const frame = fade(m.frame.clone());
    const belt = fade(m.rubber.clone());
    const dark = fade(m.graphitePaint.clone());
    for (const s of [-1, 1]) {
      const rail = mesh(rbox(0.04, 0.09, len, 0.004), frame);
      rail.position.set((s * cw) / 2, topY - 0.03, -len / 2);
      conv.add(rail);
      for (const z of [-0.12, -len + 0.15]) {
        const leg = mesh(rbox(0.04, topY - 0.08, 0.04, 0.004), frame);
        leg.position.set((s * (cw - 0.06)) / 2, (topY - 0.08) / 2, z);
        conv.add(leg);
      }
    }
    const bed = mesh(rbox(cw - 0.04, 0.02, len, 0.004), belt);
    bed.position.set(0, topY - 0.01, -len / 2);
    conv.add(bed);
    const stopper = mesh(rbox(cw, 0.07, 0.03, 0.004), dark);
    stopper.position.set(0, topY + 0.02, 0.02);
    conv.add(stopper);
    const convEnd = floorAt(0.4, 0.05);
    conv.position.copy(convEnd);
    // +Z (the stop end) faces the arm; the belt runs away from it
    conv.lookAt(0, 0, 0);
    c.add(conv);
    this.conveyorBag = mesh(bagGeo, bagMat);
    this.conveyorBag.position.set(0, topY + BAG.y / 2, -BAG.u / 2 - 0.02);
    conv.add(this.conveyorBag);
    conv.updateMatrixWorld(true);
    const pickWorld = this.conveyorBag.position.clone().applyMatrix4(conv.matrixWorld);
    // flange targets: the bag's top touches the claw's hold plane
    const gH = this.gripper.height;
    this.pickAt.copy(pickWorld).setY(pickWorld.y + BAG.y / 2 + gH);
    this.placeAt.copy(placeWorld).setY(placeWorld.y + BAG.y / 2 + gH);
    const convYaw = new THREE.Euler().setFromQuaternion(conv.quaternion, "YXZ").y;
    this.pickYaw = convYaw;
    let turn = wrap(this.placeYaw - this.pickYaw);
    if (Math.abs(turn) > Math.PI / 2) turn -= Math.sign(turn) * Math.PI;
    this.turn = turn;
    this.placeYaw = this.pickYaw + turn;

    // the bag the claw carries
    this.carriedBag = mesh(bagGeo, bagMat);
    this.carriedBag.position.set(0, -BAG.y / 2, 0);
    this.carriedBag.visible = false;
    this.gripper.hold.add(this.carriedBag);

    // warning zone line on the floor around the cell
    const tapeMat = fade(m.tape.clone());
    const zone = roundRectStrip(2.5, 2.1, 0.45, 0.06, 10);
    this.tape = new THREE.Mesh(zone, tapeMat);
    const tc = floorAt(0.42, -0.3);
    this.tape.position.set(tc.x, 0.002, tc.z);
    this.tape.rotation.y = AZ;
    this.tape.receiveShadow = true;
    c.add(this.tape);
    c.add(this.aoDecalFaded(pc.x, pc.z, W + 0.1, L + 0.1, pallet.rotation.y));

    // hose starts on the floor behind the base, towards the control box
    this.hoseStart.copy(floorAt(0.05, -0.24)).setY(0.03);
  }

  private aoTexture(strength: number) {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 64;
    const x = cv.getContext("2d")!;
    const gr = x.createRadialGradient(32, 32, 6, 32, 32, 32);
    gr.addColorStop(0, `rgba(0,0,0,${strength})`);
    gr.addColorStop(0.6, `rgba(0,0,0,${strength * 0.55})`);
    gr.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = gr;
    x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(cv);
  }

  /** Soft contact shadow under a footprint. */
  private aoDecal(w: number, d: number, strength: number) {
    const me = new THREE.Mesh(
      new THREE.PlaneGeometry(w * 1.35, d * 1.35).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: this.aoTexture(strength), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }),
    );
    me.position.y = 0.001;
    me.renderOrder = -1;
    return me;
  }

  private aoDecalFaded(x: number, z: number, w: number, d: number, rot: number) {
    const mat = new THREE.MeshBasicMaterial({ map: this.aoTexture(0.42), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 });
    const me = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.35, d * 1.35).rotateX(-Math.PI / 2), mat);
    me.position.set(x, 0.001, z);
    me.rotation.y = rot;
    me.renderOrder = -1;
    // stays transparent; only its opacity follows the cell
    this.cellDecals.push(mat);
    return me;
  }
}
