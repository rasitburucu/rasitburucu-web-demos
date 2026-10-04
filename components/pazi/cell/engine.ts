// The live palletizing cell: renderer, layout built from the plan, and the
// pick-and-place simulation. Plain three.js (no React) so it can run a tight
// loop, sleep when off screen and rebuild itself when the configuration changes.

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { fit, palletSize, PALLET_DECK, STATION_GAP_M, type Config, type Fit, type GripperSpec, type ModelId, type ModelSpec, MODELS } from "@/lib/pazi/plan";
import { sameGripper } from "@/lib/pazi/gripper";
import type { CellStore, View, Zone } from "@/lib/pazi/store";
import { mesh, pillowGeometry, rbox, roundRectStrip, stripGeometry } from "./geo";
import { bagMaterial, cardboardMaterials, floorTextures, makeMaterials, screenCanvas, shrinkMaterials, woodMaterial, type Mats } from "./materials";
import { Gripper, Hose, Riser, Robot, type Pose } from "./robot";

export type EngineOptions = {
  quality: "high" | "mid";
  reduced: boolean;
  /** Where the cell's centre should sit in the canvas (0..1). */
  frame?: { x: number; y: number };
  /** Let the visitor drag the operator marker on the floor. */
  operator?: boolean;
  /** Scale of the cell in frame (1 = default). */
  zoom?: number;
  onFrame?: () => void;
};

const CONVEYOR_TOP = 0.74;
const CONVEYOR_END = -0.42;
const CONVEYOR_START = -3.7;
const BELT_SPEED = 0.42;

const minJerk = (t: number) => t * t * t * (10 + t * (-15 + 6 * t));
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const damp = (a: number, b: number, lambda: number, dt: number) => a + (b - a) * (1 - Math.exp(-lambda * dt));
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

type Task = { slots: number[]; x: number; z: number; yaw: number; top: number; layer: number };

type Station = {
  group: THREE.Group;
  boxes: THREE.InstancedMesh;
  sheets?: THREE.InstancedMesh;
  /** world-space slot matrices (centre of each product). */
  slotPos: THREE.Vector3[];
  slotTurned: boolean[];
  tasks: Task[];
  next: number;
  placed: number;
  state: "ready" | "full" | "out" | "in";
  timer: number;
  side: 1 | -1;
  drops: { i: number; t: number; delay: number }[];
};

type Item = { z: number; line: number };

type Phase = "toPick" | "wait" | "down" | "grip" | "up" | "transfer" | "down2" | "release" | "up2" | "idle";

export class CellEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private m: Mats;
  private cellGroup = new THREE.Group();
  private disposables: { dispose(): void }[] = [];
  private store: CellStore;
  private opts: EngineOptions;
  private canvas: HTMLCanvasElement;
  private raf = 0;
  private running = false;
  private visible = true;
  private last = 0;
  private io?: IntersectionObserver;
  private ro?: ResizeObserver;
  private unsub?: () => void;
  private width = 1;
  private height = 1;

  // layout
  private cfg!: Config;
  private fitR!: Fit;
  private model!: ModelSpec;
  private robot!: Robot;
  private riser!: Riser;
  private gripper!: Gripper;
  /** Tool of the previous build, and the outgoing tool while the families swap. */
  private lastGrip: GripperSpec | null = null;
  private oldGripper: Gripper | null = null;
  private morphT = 1;
  private hose!: Hose;
  private hoseRoot = new THREE.Vector3();
  private stations: Station[] = [];
  private productGeo!: THREE.BufferGeometry;
  private productMat!: THREE.Material | THREE.Material[];
  private carried: THREE.Mesh[] = [];
  private convBoxes!: THREE.InstancedMesh;
  private rollers!: THREE.InstancedMesh;
  private rollerMats: THREE.Matrix4[] = [];
  private rollerAngle = 0;
  private lines: number[] = [0];
  private items: Item[] = [];
  private spawnT: number[] = [];
  private pu = 0.4;
  private pg = 0.3;
  private py = 0.25;
  private layerH = 0.25;
  private zones = { stop: { ex: 1, ez: 1 }, slow: { ex: 2, ez: 2 } };
  /** Stop-zone band: plain yellow at rest, black/yellow hazard only while someone is inside a zone. */
  private stopPlain?: THREE.Mesh;
  private stopHazard?: THREE.Mesh;
  private marker?: THREE.Group;
  private markerRing?: THREE.Mesh;
  private screen = screenCanvas();

  // simulation
  private phase: Phase = "idle";
  private phaseT = 0;
  private phaseDur = 1;
  private station = 0;
  private task: Task | null = null;
  private pickLine = 0;
  private from = new THREE.Vector3();
  private to = new THREE.Vector3();
  private cur = new THREE.Vector3();
  private yawFrom = 0;
  private yawTo = 0;
  private yaw = 0;
  private liftFrom = 0;
  private liftTo = 0;
  private lift = 0;
  private timeScale = 1;
  private scaleTarget = 1;
  private cycleK = 1;
  private interval = 7.5;
  private pose: Pose = { t1: 0, t2: 0, t3: 0, t6: 0 };
  private lastLive = "";

  // camera
  private camPos = new THREE.Vector3();
  private camTarget = new THREE.Vector3();
  private camFromPos = new THREE.Vector3();
  private camFromTarget = new THREE.Vector3();
  private camGoalPos = new THREE.Vector3();
  private camGoalTarget = new THREE.Vector3();
  private camT = 1;
  private view: View = "iso";

  // pointer
  private raycaster = new THREE.Raycaster();
  private ndc = new THREE.Vector2();
  private dragging = false;
  private floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  constructor(canvas: HTMLCanvasElement, store: CellStore, opts: EngineOptions) {
    this.canvas = canvas;
    this.store = store;
    this.opts = opts;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer = renderer;

    this.camera = new THREE.PerspectiveCamera(20, 1, 0.5, 60);
    this.m = makeMaterials();

    // light: soft room reflections + one key light with shadows + cool fill
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = env;
    this.scene.environmentIntensity = 0.5;
    pmrem.dispose();
    this.disposables.push(env);

    const hemi = new THREE.HemisphereLight("#eef0ea", "#8f918a", 0.55);
    this.scene.add(hemi);
    const key = new THREE.DirectionalLight("#fff6e8", 3.0);
    key.position.set(-4.2, 7.2, 2.6);
    key.castShadow = true;
    key.shadow.mapSize.set(opts.quality === "high" ? 2048 : 1024, opts.quality === "high" ? 2048 : 1024);
    const sc = key.shadow.camera;
    sc.left = -4;
    sc.right = 4;
    sc.top = 4.5;
    sc.bottom = -4.5;
    sc.near = 2;
    sc.far = 16;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.04;
    key.shadow.radius = 3;
    this.scene.add(key);
    const fill = new THREE.DirectionalLight("#e6eef5", 0.55);
    fill.position.set(5, 3, -2);
    this.scene.add(fill);

    // floor
    const ft = floorTextures();
    ft.map.repeat.set(5, 5);
    ft.rough.repeat.set(4, 4);
    this.disposables.push(ft.map, ft.rough, ft.alpha);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 24),
      new THREE.MeshStandardMaterial({ map: ft.map, roughnessMap: ft.rough, roughness: 0.62, metalness: 0, alphaMap: ft.alpha, transparent: true, depthWrite: false }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -0.6);
    floor.receiveShadow = true;
    floor.renderOrder = -2;
    this.scene.add(floor);

    this.scene.add(this.cellGroup);
    this.setView("iso", true);

    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas.parentElement ?? canvas);
    this.io = new IntersectionObserver(
      (e) => {
        this.visible = e[0]?.isIntersecting ?? true;
        this.kick();
      },
      { rootMargin: "80px" },
    );
    this.io.observe(canvas);
    document.addEventListener("visibilitychange", this.onVis);

    if (opts.operator) {
      canvas.addEventListener("pointerdown", this.onDown);
      window.addEventListener("pointermove", this.onMove, { passive: true });
      window.addEventListener("pointerup", this.onUp);
    }

    // configuration from the store
    let lastCfg: Config | null = null;
    let lastLock: string | null = null;
    let lastView: View = "iso";
    let lastOp: unknown = null;
    let pending = 0;
    const sync = () => {
      const s = store.get();
      if (s.config !== lastCfg || s.lock !== lastLock) {
        const first = lastCfg === null;
        lastCfg = s.config;
        lastLock = s.lock;
        window.clearTimeout(pending);
        if (first) this.build(s.config, s.lock);
        else pending = window.setTimeout(() => this.build(store.get().config, store.get().lock), 220);
      }
      if (s.view !== lastView) {
        lastView = s.view;
        this.setView(s.view);
      }
      if (s.operator !== lastOp) {
        lastOp = s.operator;
        this.placeMarker();
      }
      this.kick();
    };
    this.unsub = store.subscribe(sync);
    sync();
    this.running = true;
    this.kick();
  }

  /* ------------------------------------------------------------- lifecycle */

  private onVis = () => this.kick();

  private kick() {
    if (!this.running) return;
    const active = this.visible && document.visibilityState === "visible";
    if (active && !this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.loop);
    }
  }

  private loop = (now: number) => {
    this.raf = 0;
    if (!this.running) return;
    const active = this.visible && document.visibilityState === "visible";
    if (!active) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const animating = this.step(dt);
    this.renderer.render(this.scene, this.camera);
    this.opts.onFrame?.();
    if (animating) this.raf = requestAnimationFrame(this.loop);
  };

  /** Run the simulation forward without the frame loop (stills, tests). */
  advance(seconds: number) {
    const n = Math.ceil(seconds / 0.02);
    for (let i = 0; i < n; i++) this.step(0.02);
    this.renderer.render(this.scene, this.camera);
    this.opts.onFrame?.();
  }

  dispose() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.unsub?.();
    this.io?.disconnect();
    this.ro?.disconnect();
    document.removeEventListener("visibilitychange", this.onVis);
    this.canvas.removeEventListener("pointerdown", this.onDown);
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerup", this.onUp);
    this.clearCell();
    this.scene.traverse((o) => {
      const me = o as THREE.Mesh;
      if (me.geometry) me.geometry.dispose();
      const mat = me.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    Object.values(this.m).forEach((x) => {
      (x as THREE.MeshStandardMaterial).map?.dispose();
      (x as THREE.Material).dispose();
    });
    this.disposables.forEach((d) => d.dispose());
    this.screen.texture.dispose();
    this.renderer.dispose();
  }

  private resize() {
    const el = this.canvas.parentElement ?? this.canvas;
    const w = Math.max(1, el.clientWidth);
    const h = Math.max(1, el.clientHeight);
    this.width = w;
    this.height = h;
    const cap = this.opts.quality === "high" ? 1.75 : 1.25;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    const f = this.opts.frame ?? { x: 0.5, y: 0.5 };
    this.camera.setViewOffset(w, h, (0.5 - f.x) * w, (0.5 - f.y) * h, w, h);
    this.camera.updateProjectionMatrix();
    this.setView(this.view, true);
    this.kick();
  }

  /* ---------------------------------------------------------------- camera */

  private viewGoal(v: View, pos: THREE.Vector3, target: THREE.Vector3) {
    const aspect = this.width / this.height;
    const zoom = this.opts.zoom ?? 1;
    // visible height needed, widened on tall screens
    const need = 4.6 / zoom;
    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const fitAspect = Math.min(1, aspect / 1.15);
    const dist = need / (2 * Math.tan(fov / 2)) / fitAspect;
    if (v === "top") {
      target.set(0, 0, -0.55);
      pos.set(0.001, dist * 1.12, -0.55 + 0.02);
    } else if (v === "op") {
      // a person standing just outside the slow zone, eye height 1.65 m
      target.set(-0.15, 0.85, -0.35);
      pos.set(2.6 / fitAspect, 1.65, 3.6 / fitAspect);
    } else {
      // closer framings drift towards the arm
      const k = THREE.MathUtils.clamp((zoom - 1) / 1.5, 0, 1);
      target.set(lerp(0, 0.15, k), lerp(0.62, 0.95, k), lerp(-0.45, -0.1, k));
      const dir = new THREE.Vector3(1.0, 0.86, 1.32).normalize();
      pos.copy(target).addScaledVector(dir, dist);
    }
  }

  setView(v: View, instant = false) {
    this.view = v;
    this.viewGoal(v, this.camGoalPos, this.camGoalTarget);
    if (instant || this.opts.reduced) {
      this.camPos.copy(this.camGoalPos);
      this.camTarget.copy(this.camGoalTarget);
      this.camT = 1;
      this.applyCamera();
      this.kick();
      return;
    }
    this.camFromPos.copy(this.camPos);
    this.camFromTarget.copy(this.camTarget);
    this.camT = 0;
    this.kick();
  }

  private applyCamera() {
    this.camera.position.copy(this.camPos);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(this.camTarget);
    this.camera.fov = this.view === "op" ? 30 : 20;
    this.camera.updateProjectionMatrix();
  }

  /* ----------------------------------------------------------------- build */

  private clearCell() {
    for (const c of [...this.cellGroup.children]) {
      this.cellGroup.remove(c);
      c.traverse((o) => {
        const me = o as THREE.Mesh;
        if (me.geometry) me.geometry.dispose();
        const mat = me.material as THREE.Material | THREE.Material[] | undefined;
        const shared = new Set(Object.values(this.m) as THREE.Material[]);
        const disp = (x: THREE.Material) => {
          if (shared.has(x)) return;
          (x as THREE.MeshStandardMaterial).map?.dispose();
          x.dispose();
        };
        if (Array.isArray(mat)) mat.forEach(disp);
        else if (mat) disp(mat);
      });
    }
    this.stations = [];
    this.carried = [];
  }

  private build(cfg: Config, lock: string | null) {
    this.clearCell();
    this.cfg = cfg;
    this.fitR = fit(cfg, lock as ModelId | null);
    const f = this.fitR;
    this.model = f.model ?? (lock ? MODELS.find((x) => x.id === lock)! : MODELS[2]);
    const m = this.m;
    const g = this.cellGroup;

    const { L: Lmm, W: Wmm } = palletSize(cfg);
    const L = Lmm / 1000;
    const W = Wmm / 1000;
    this.pu = cfg.u / 1000;
    this.pg = cfg.g / 1000;
    this.py = cfg.y / 1000;
    this.layerH = f.stack.layerH / 1000;

    // ---- product geometry
    if (cfg.kind === "torba") {
      this.productGeo = pillowGeometry(this.pg, this.py, this.pu);
      this.productMat = bagMaterial();
    } else if (cfg.kind === "shrink") {
      this.productGeo = rbox(this.pg, this.py, this.pu, 0.012, 3);
      this.productMat = shrinkMaterials();
    } else {
      this.productGeo = rbox(this.pg, this.py, this.pu, 0.006, 2);
      this.productMat = cardboardMaterials();
    }
    // the instanced meshes share this geometry/material; keep a holder for disposal
    const holder = new THREE.Mesh(this.productGeo, this.productMat);
    holder.visible = false;
    g.add(holder);

    // ---- robot on its riser
    const lift = f.lift;
    // the tool, sized for this product (lib/pazi/gripper.ts)
    const prevGrip = this.lastGrip;
    this.gripper = new Gripper(f.grip, m);
    const gH = this.gripper.height;
    const hang = this.model.link.wrist;
    const d1 = this.model.link.d1;
    const wPick = CONVEYOR_TOP + this.py + gH + hang;
    const wLow = PALLET_DECK / 1000 + this.py + gH + hang;
    const wHigh = f.stack.height / 1000 + gH + hang;
    const riserH = THREE.MathUtils.clamp((Math.max(wPick, wHigh) + Math.min(wLow, wPick)) / 2 - d1 - 0.12, 0.34, 1.05);
    this.riser = new Riser(lift, riserH, m);
    g.add(this.riser.group);
    this.robot = new Robot(this.model, m);
    g.add(this.robot.root);
    this.lift = this.liftTo = this.liftFrom = lift ? this.riser.setHeight((wPick + wLow) / 2 - d1) : riserH;
    this.robot.root.position.set(0, this.lift, 0);
    this.robot.flange.add(this.gripper.group);
    // a new size grows out of the old one; a new tool family swaps in after the old one retracts
    this.lastGrip = f.grip;
    this.oldGripper = null;
    this.morphT = 1;
    if (prevGrip && !this.opts.reduced && !sameGripper(prevGrip, f.grip)) {
      if (prevGrip.family === f.grip.family) this.gripper.morphFrom(prevGrip);
      else {
        const old = new Gripper(prevGrip, m);
        old.adapter.visible = false;
        this.robot.flange.add(old.group);
        this.oldGripper = old;
        this.gripper.setPresence(0);
      }
      this.morphT = 0;
    }

    // carried products
    for (let i = 0; i < 2; i++) {
      const c = new THREE.Mesh(this.productGeo, this.productMat);
      c.castShadow = true;
      c.receiveShadow = true;
      c.visible = false;
      this.gripper.hold.add(c);
      this.carried.push(c);
    }

    // hose from the riser to the gripper along the clips
    this.hose = new Hose(this.robot.clips.length + 3, 0.011, m.hose);
    this.hoseRoot.set(-0.17, 0.32, -0.12);
    g.add(this.hose.mesh);

    // ---- pallet stations
    for (const side of [1, -1] as const) {
      const sg = new THREE.Group();
      sg.position.set(side * (STATION_GAP_M + W / 2), 0, 0);
      g.add(sg);
      sg.add(this.pallet(L, W));
      const total = f.stack.total;
      const boxes = new THREE.InstancedMesh(this.productGeo, this.productMat, Math.max(1, total));
      boxes.castShadow = true;
      boxes.receiveShadow = true;
      boxes.count = 0;
      boxes.frustumCulled = false;
      sg.add(boxes);
      let sheets: THREE.InstancedMesh | undefined;
      if (cfg.sheet) {
        sheets = new THREE.InstancedMesh(new THREE.BoxGeometry(W - 0.01, 0.004, L - 0.01), new THREE.MeshStandardMaterial({ color: "#b89466", roughness: 0.9 }), Math.max(1, f.stack.layers));
        sheets.count = 0;
        sheets.receiveShadow = true;
        sg.add(sheets);
      }
      // floor tape around the station
      const tw = W + 0.16;
      const tl = L + 0.16;
      const tape = (ax: number, az: number, bx: number, bz: number) => {
        const t = new THREE.Mesh(stripGeometry(ax, az, bx, bz, 0.05, 0.6), m.tape);
        t.position.y = 0.0015;
        t.receiveShadow = true;
        sg.add(t);
      };
      tape(-tw / 2, -tl / 2, tw / 2, -tl / 2);
      tape(tw / 2, -tl / 2 - 0.025, tw / 2, tl / 2 + 0.025);
      tape(-tw / 2, -tl / 2 - 0.025, -tw / 2, tl / 2 + 0.025);
      // contact shadow under the pallet
      sg.add(this.aoDecal(W + 0.12, L + 0.12, 0.42));

      const st: Station = {
        group: sg,
        boxes,
        sheets,
        slotPos: [],
        slotTurned: [],
        tasks: [],
        next: 0,
        placed: 0,
        state: "ready",
        timer: 0,
        side,
        drops: [],
      };
      this.planStation(st);
      this.stations.push(st);
    }

    // ---- conveyor(s)
    const nLines = cfg.lines;
    const cw = Math.max(0.5, this.pg + 0.14);
    this.lines = nLines === 2 ? [-(cw / 2 + 0.05), cw / 2 + 0.05] : [0];
    let rollerCount = 0;
    const pitch = 0.08;
    const nRollers = Math.floor((CONVEYOR_END - CONVEYOR_START) / pitch);
    this.rollers = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.024, 0.024, cw - 0.04, 16).rotateZ(Math.PI / 2), m.roller, nRollers * this.lines.length);
    this.rollers.castShadow = false;
    this.rollers.receiveShadow = true;
    this.rollerMats = [];
    for (const lx of this.lines) {
      g.add(this.conveyor(lx, cw));
      for (let i = 0; i < nRollers; i++) {
        const mm = new THREE.Matrix4().makeTranslation(lx, CONVEYOR_TOP - 0.024, CONVEYOR_START + pitch / 2 + i * pitch);
        this.rollerMats.push(mm);
        this.rollers.setMatrixAt(rollerCount++, mm);
      }
    }
    g.add(this.rollers);
    this.convBoxes = new THREE.InstancedMesh(this.productGeo, this.productMat, 40);
    this.convBoxes.castShadow = true;
    this.convBoxes.receiveShadow = true;
    this.convBoxes.count = 0;
    this.convBoxes.frustumCulled = false;
    g.add(this.convBoxes);

    // ---- floor zones (scanner fields), drawn from the reach of the model
    const ex = STATION_GAP_M + W + 0.32;
    const ez = L / 2 + 0.36;
    this.zones = { stop: { ex, ez }, slow: { ex: ex + 0.95, ez: ez + 0.95 } };
    const stopG = roundRectStrip(ex * 2, ez * 2, 0.3, 0.09, 8);
    const hz = new THREE.Mesh(stopG, this.planarHazard());
    hz.position.y = 0.002;
    hz.receiveShadow = true;
    g.add(hz);
    const plain = new THREE.Mesh(stopG.clone(), m.tape);
    plain.position.y = 0.002;
    plain.receiveShadow = true;
    g.add(plain);
    this.stopHazard = hz;
    this.stopPlain = plain;
    this.showZone(this.store.get().zone);
    const slowG = roundRectStrip((ex + 0.95) * 2, (ez + 0.95) * 2, 0.6, 0.06, 10);
    const sl = new THREE.Mesh(slowG, m.tape);
    sl.position.y = 0.002;
    sl.receiveShadow = true;
    g.add(sl);

    // scanners at two corners
    for (const [sx, sz, rot] of [
      [ex - 0.08, ez - 0.08, Math.PI * 0.75],
      [-ex + 0.08, -ez + 0.08, -Math.PI * 0.25],
    ] as const) {
      const s = new THREE.Group();
      s.position.set(sx, 0, sz);
      s.rotation.y = rot;
      const body = mesh(rbox(0.11, 0.13, 0.11, 0.012), m.scanner);
      body.position.y = 0.065 + 0.03;
      const win = mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.05, 24, 1, false, -Math.PI / 2, Math.PI), m.glassDark);
      win.position.set(0, 0.11, 0.035);
      const stand = mesh(rbox(0.14, 0.03, 0.14, 0.004), m.graphitePaint);
      stand.position.y = 0.015;
      s.add(body, win, stand);
      g.add(s);
    }

    // operator tablet on a pole by the conveyor
    const hmi = new THREE.Group();
    hmi.position.set(-0.85, 0, -1.05);
    hmi.rotation.y = 0.6;
    const pole = mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.22, 16), m.alu);
    pole.position.y = 0.61;
    const foot = mesh(roundCylSafe(0.16, 0.02), m.graphitePaint);
    foot.position.y = 0.01;
    const tab = mesh(rbox(0.3, 0.2, 0.018, 0.008), m.graphitePaint);
    tab.position.set(0, 1.26, 0.02);
    tab.rotation.x = -0.45;
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.17), new THREE.MeshBasicMaterial({ map: this.screen.texture, toneMapped: false }));
    scr.position.set(0, 1.264, 0.031);
    scr.rotation.x = -0.45;
    hmi.add(pole, foot, tab, scr);
    g.add(hmi);
    this.drawScreen();

    // riser contact shadow
    g.add(this.aoDecal(0.75, 0.75, 0.45));

    // operator marker
    if (this.opts.operator) {
      const mk = new THREE.Group();
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.24, 40).rotateX(-Math.PI / 2), m.marker);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.24, 0.28, 48).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: "#f5a800", roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -3 }));
      const shoeMat = new THREE.MeshStandardMaterial({ color: "#ecece6", roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -4 });
      const shoe = (x: number, z: number, a: number) => {
        const g = new THREE.Group();
        const sole = new THREE.Mesh(new THREE.CircleGeometry(0.04, 20).rotateX(-Math.PI / 2), shoeMat);
        sole.scale.set(0.62, 1, 1.6);
        sole.position.z = -0.025;
        const heel = new THREE.Mesh(new THREE.CircleGeometry(0.026, 16).rotateX(-Math.PI / 2), shoeMat);
        heel.position.z = 0.05;
        g.add(sole, heel);
        g.position.set(x, 0.0005, z);
        g.rotation.y = a;
        return g;
      };
      mk.add(disc, ring, shoe(-0.06, 0.03, 0.17), shoe(0.06, -0.03, -0.17));
      mk.position.y = 0.003;
      this.marker = mk;
      this.markerRing = ring;
      g.add(mk);
      this.placeMarker();
    }

    // ---- simulation start
    const required = cfg.rate;
    this.interval = 60 / Math.max(0.2, required);
    this.items = [];
    this.spawnT = this.lines.map((_, i) => i * this.interval * 0.5);
    // queue a few products already on the belt
    for (let li = 0; li < this.lines.length; li++) {
      for (let k = 0; k < 3; k++) this.items.push({ line: li, z: CONVEYOR_END - this.pu / 2 - k * (this.pu + 0.004) - k * 0.35 });
    }
    const cyc = f.cycleSec > 0 ? f.cycleSec : 60 / (this.model.cycles * 0.8);
    this.cycleK = THREE.MathUtils.clamp(cyc / 5.1, 0.55, 2.2);
    this.station = 0;
    this.task = null;

    // prefill station A to about half so the pattern reads at once
    const a = this.stations[0];
    const perLayer = f.plan.perLayer;
    // reduced motion: a still frame with the pallet about 60% built, so the arm stays visible
    const preLayers = this.opts.reduced ? Math.max(1, Math.ceil(f.stack.layers * 0.6)) : Math.max(1, Math.floor(f.stack.layers * 0.55));
    const pre = Math.min(a.tasks.length, a.tasks.findIndex((t) => t.layer >= preLayers) === -1 ? a.tasks.length : a.tasks.findIndex((t) => t.layer >= preLayers));
    const stagger = Math.min(0.012, 1.4 / Math.max(1, pre));
    for (let i = 0; i < pre; i++) this.placeTask(a, a.tasks[i], this.opts.reduced ? 0 : 0.001 + stagger * i);
    a.next = pre;
    void perLayer;
    if (a.next >= a.tasks.length) a.state = "full";
    if (this.opts.reduced && this.stations[1]) {
      // still frame: the second station shows its first layer, the first is complete
      const b = this.stations[1];
      const n = b.tasks.findIndex((t) => t.layer >= 1);
      for (let i = 0; i < (n === -1 ? b.tasks.length : n); i++) this.placeTask(b, b.tasks[i], 0);
    }

    // robot ready pose above the pick
    this.yaw = 0;
    const pick = this.pickPoint(0, 1, this.cur);
    pick.y += 0.12;
    this.solveAt(this.cur);
    this.phase = f.status === "custom" && !f.model ? "idle" : "toPick";
    this.phaseT = 0;
    this.phaseDur = 0.01;
    this.from.copy(this.cur);
    this.to.copy(this.cur);
    this.robot.setLed(this.phase === "idle" ? "#d9442b" : "#5fd38a");
    this.publish(true);
    this.updateHose();
    this.updateConveyor(0);
    this.kick();
  }

  private planarHazard() {
    const [c, x] = (() => {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 128;
      return [cv, cv.getContext("2d")!] as const;
    })();
    x.fillStyle = "#f5a800";
    x.fillRect(0, 0, 128, 128);
    x.fillStyle = "#1a1b1a";
    for (let i = -4; i < 8; i++) {
      x.beginPath();
      x.moveTo(i * 32, 128);
      x.lineTo(i * 32 + 16, 128);
      x.lineTo(i * 32 + 16 + 128, 0);
      x.lineTo(i * 32 + 128, 0);
      x.closePath();
      x.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(0.62, 0.62);
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  }

  private aoDecal(w: number, d: number, strength: number) {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d")!;
    const gr = x.createRadialGradient(32, 32, 6, 32, 32, 32);
    gr.addColorStop(0, `rgba(0,0,0,${strength})`);
    gr.addColorStop(0.6, `rgba(0,0,0,${strength * 0.55})`);
    gr.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = gr;
    x.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    const me = new THREE.Mesh(
      new THREE.PlaneGeometry(w * 1.35, d * 1.35).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }),
    );
    me.position.y = 0.001;
    me.renderOrder = -1;
    return me;
  }

  private pallet(L: number, W: number) {
    const g = new THREE.Group();
    const wood = woodMaterial();
    const n = W > 0.9 ? 7 : 5;
    const deckY = PALLET_DECK / 1000;
    // top deck boards along the length
    for (let i = 0; i < n; i++) {
      const bw = i === 0 || i === n - 1 ? 0.145 : n === 5 && (i === 1 || i === 3) ? 0.1 : 0.12;
      const x = -W / 2 + bw / 2 + (i * (W - bw)) / (n - 1);
      const b = mesh(rbox(bw, 0.022, L, 0.003), wood);
      b.position.set(x, deckY - 0.011, 0);
      g.add(b);
    }
    // stringer boards across
    for (const z of [-L / 2 + 0.0725, 0, L / 2 - 0.0725]) {
      const s = mesh(rbox(W, 0.022, 0.145, 0.003), wood);
      s.position.set(0, deckY - 0.033, z);
      g.add(s);
      // blocks
      for (const x of [-W / 2 + 0.0725, 0, W / 2 - 0.0725]) {
        const bl = mesh(rbox(0.145, 0.078, z === 0 ? 0.145 : 0.1, 0.004), wood);
        bl.position.set(x, 0.022 + 0.039, z === 0 ? 0 : z + (z < 0 ? -0.0225 : 0.0225));
        g.add(bl);
      }
    }
    // bottom boards
    for (const x of [-W / 2 + 0.0725, 0, W / 2 - 0.0725]) {
      const bb = mesh(rbox(x === 0 ? 0.145 : 0.1, 0.022, L, 0.003), wood);
      bb.position.set(x, 0.011, 0);
      g.add(bb);
    }
    return g;
  }

  private conveyor(x: number, cw: number) {
    const g = new THREE.Group();
    const m = this.m;
    const len = CONVEYOR_END - CONVEYOR_START;
    const zc = (CONVEYOR_END + CONVEYOR_START) / 2;
    for (const s of [-1, 1]) {
      const rail = mesh(rbox(0.04, 0.09, len + 0.04, 0.004), m.frame);
      rail.position.set(x + (s * cw) / 2, CONVEYOR_TOP - 0.03, zc);
      g.add(rail);
      // side guide
      const guide = mesh(rbox(0.012, 0.04, len, 0.003), m.alu);
      guide.position.set(x + s * (Math.min(cw / 2 - 0.03, this.pg / 2 + 0.03)), CONVEYOR_TOP + 0.05, zc);
      g.add(guide);
      for (let k = 0; k < 5; k++) {
        const z = CONVEYOR_START + 0.15 + (k * (len - 0.3)) / 4;
        const post = mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.07, 8), m.metal, false);
        post.position.set(x + s * (Math.min(cw / 2 - 0.03, this.pg / 2 + 0.03) + 0.02), CONVEYOR_TOP + 0.03, z);
        g.add(post);
      }
    }
    // legs
    for (const z of [CONVEYOR_START + 0.25, zc, CONVEYOR_END - 0.2]) {
      for (const s of [-1, 1]) {
        const leg = mesh(rbox(0.04, CONVEYOR_TOP - 0.08, 0.04, 0.004), m.frame);
        leg.position.set(x + (s * (cw - 0.06)) / 2, (CONVEYOR_TOP - 0.08) / 2, z);
        g.add(leg);
        const ft = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.012, 16), m.rubber);
        ft.position.set(x + (s * (cw - 0.06)) / 2, 0.006, z);
        g.add(ft);
      }
      const brace = mesh(rbox(cw - 0.06, 0.03, 0.03, 0.003), m.frame);
      brace.position.set(x, 0.22, z);
      g.add(brace);
    }
    // end stop with a photo-eye
    const stop = mesh(rbox(cw, 0.08, 0.03, 0.004), m.graphitePaint);
    stop.position.set(x, CONVEYOR_TOP + 0.02, CONVEYOR_END + 0.02);
    g.add(stop);
    const eye = mesh(rbox(0.03, 0.04, 0.03, 0.004), m.scanner);
    eye.position.set(x + cw / 2 + 0.02, CONVEYOR_TOP + 0.06, CONVEYOR_END - 0.12);
    g.add(eye);
    // drive motor
    const motor = mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.18, 24).rotateZ(Math.PI / 2), m.graphitePaint);
    motor.position.set(x - cw / 2 - 0.1, CONVEYOR_TOP - 0.1, CONVEYOR_START + 0.35);
    g.add(motor);
    const strip = this.aoDecal(cw + 0.1, len, 0.22);
    strip.position.set(x, 0.001, zc);
    g.add(strip);
    return g;
  }

  /** Placement order, pairing and world positions for one station. */
  private planStation(st: Station) {
    const f = this.fitR;
    const deck = PALLET_DECK / 1000;
    const sx = st.group.position.x;
    const sheet = this.cfg.sheet ? 0.004 : 0;
    st.slotPos = [];
    st.slotTurned = [];
    st.tasks = [];
    let idx = 0;
    for (let k = 0; k < f.stack.layers; k++) {
      const layer = f.plan.layers[k % 2];
      const y = deck + k * this.layerH + sheet + this.py / 2;
      const ids: number[] = [];
      for (const s of layer) {
        st.slotPos.push(new THREE.Vector3(st.side * (s.x / 1000), y, s.z / 1000));
        st.slotTurned.push(s.turned);
        ids.push(idx++);
      }
      // far side first so the arm never reaches over a placed product
      const dist = (i: number) => {
        const p = st.slotPos[i];
        return Math.hypot(sx + p.x, p.z);
      };
      ids.sort((a, b) => dist(b) - dist(a) || st.slotPos[a].z - st.slotPos[b].z);
      const used = new Set<number>();
      for (const i of ids) {
        if (used.has(i)) continue;
        used.add(i);
        let partner = -1;
        if (f.double) {
          for (const j of ids) {
            if (used.has(j) || st.slotTurned[j] !== st.slotTurned[i]) continue;
            const a = st.slotPos[i];
            const b = st.slotPos[j];
            const along = st.slotTurned[i] ? Math.abs(a.x - b.x) : Math.abs(a.z - b.z);
            const across = st.slotTurned[i] ? Math.abs(a.z - b.z) : Math.abs(a.x - b.x);
            if (Math.abs(along - this.pu) < 0.003 && across < 0.003) {
              partner = j;
              break;
            }
          }
        }
        const slots = partner >= 0 ? [i, partner] : [i];
        if (partner >= 0) used.add(partner);
        const cx = slots.reduce((s, q) => s + st.slotPos[q].x, 0) / slots.length;
        const cz = slots.reduce((s, q) => s + st.slotPos[q].z, 0) / slots.length;
        st.tasks.push({ slots, x: sx + cx, z: cz, yaw: st.slotTurned[i] ? Math.PI / 2 : 0, top: y + this.py / 2, layer: k });
      }
    }
  }

  private tmpM = new THREE.Matrix4();
  private tmpQ = new THREE.Quaternion();
  private tmpS = new THREE.Vector3(1, 1, 1);
  private up = new THREE.Vector3(0, 1, 0);

  private slotMatrix(st: Station, i: number, dy = 0) {
    const p = st.slotPos[i];
    this.tmpQ.setFromAxisAngle(this.up, st.slotTurned[i] ? Math.PI / 2 : 0);
    return this.tmpM.compose(new THREE.Vector3(p.x, p.y + dy, p.z), this.tmpQ, this.tmpS);
  }

  private placeTask(st: Station, t: Task, dropDelay: number) {
    for (const i of t.slots) {
      st.boxes.setMatrixAt(st.placed, this.slotMatrix(st, i, dropDelay > 0 ? 0.3 : 0));
      if (dropDelay > 0) st.drops.push({ i: st.placed, t: 0, delay: dropDelay });
      st.placed++;
    }
    st.boxes.count = st.placed;
    st.boxes.instanceMatrix.needsUpdate = true;
    // slip sheet when a layer starts
    if (st.sheets && t.slots.length && st.sheets.count <= t.layer) {
      const y = PALLET_DECK / 1000 + t.layer * this.layerH + 0.002;
      st.sheets.setMatrixAt(st.sheets.count, this.tmpM.makeTranslation(0, y, 0));
      st.sheets.count++;
      st.sheets.instanceMatrix.needsUpdate = true;
    }
    // remember the slot index list for drops (slot order equals placement order)
    st.group.userData.order = st.group.userData.order ?? [];
    (st.group.userData.order as number[]).push(...t.slots);
  }

  /* ------------------------------------------------------------ simulation */

  /** Flange point above the front product(s) of a conveyor line. */
  private pickPoint(line: number, count: number, out: THREE.Vector3) {
    const x = this.lines[line] ?? 0;
    const z = CONVEYOR_END - (count === 2 ? this.pu : this.pu / 2);
    return out.set(x, CONVEYOR_TOP + this.py + this.gripper.height, z);
  }

  private placePoint(t: Task, out: THREE.Vector3) {
    return out.set(t.x, t.top + this.gripper.height, t.z);
  }

  private solveAt(p: THREE.Vector3) {
    this.robot.root.position.y = this.lift;
    this.robot.solve(p, this.yaw, this.pose);
    this.robot.pose = this.pose;
    this.robot.apply();
  }

  private readyCount(line: number) {
    const front = this.items.filter((it) => it.line === line).sort((a, b) => b.z - a.z);
    let n = 0;
    let limit = CONVEYOR_END - this.pu / 2;
    for (const it of front) {
      if (Math.abs(it.z - limit) < 0.01) {
        n++;
        limit -= this.pu + 0.004;
      } else break;
    }
    return n;
  }

  private chooseYaw(target: number) {
    // a box looks the same turned 180°: take the closer equivalent
    const c = this.yaw;
    const a = c + wrapAngle(target - c);
    const b = c + wrapAngle(target + Math.PI - c);
    return Math.abs(a - c) <= Math.abs(b - c) ? a : b;
  }

  private begin(phase: Phase, dur: number) {
    this.phase = phase;
    this.phaseT = 0;
    this.phaseDur = Math.max(0.01, dur);
  }

  private nextTask(): Task | null {
    const order = [this.station, 1 - this.station];
    for (const s of order) {
      const st = this.stations[s];
      if (st && st.state === "ready" && st.next < st.tasks.length) {
        this.station = s;
        return st.tasks[st.next];
      }
    }
    return null;
  }

  private moveDur(a: THREE.Vector3, b: THREE.Vector3, base: number) {
    const d = Math.hypot(a.x - b.x, a.z - b.z) + Math.abs(a.y - b.y) * 0.6;
    return (base + d * 0.42) * this.cycleK;
  }

  /** Cubic Bézier in cylindrical coordinates around the robot axis: up, over, down. */
  private transferPoint(a: THREE.Vector3, b: THREE.Vector3, s: number, out: THREE.Vector3) {
    const pa = Math.atan2(a.z, a.x);
    let pb = Math.atan2(b.z, b.x);
    pb = pa + wrapAngle(pb - pa);
    const ra = Math.hypot(a.x, a.z);
    const rb = Math.hypot(b.x, b.z);
    const safe = Math.max(a.y, b.y) + 0.14;
    const u = 1 - s;
    const w0 = u * u * u;
    const w1 = 3 * u * u * s;
    const w2 = 3 * u * s * s;
    const w3 = s * s * s;
    const ang = pa * (w0 + w1) + pb * (w2 + w3);
    const rad = ra * (w0 + w1) + rb * (w2 + w3);
    const y = a.y * w0 + safe * (w1 + w2) + b.y * w3;
    return out.set(Math.cos(ang) * rad, y, Math.sin(ang) * rad);
  }

  private step(dt: number): boolean {
    const s = this.store.get();
    let animating = false;

    // camera move
    if (this.camT < 1) {
      this.camT = Math.min(1, this.camT + dt / 0.9);
      const e = minJerk(this.camT);
      this.camPos.lerpVectors(this.camFromPos, this.camGoalPos, e);
      this.camTarget.lerpVectors(this.camFromTarget, this.camGoalTarget, e);
      this.applyCamera();
      animating = true;
    }

    // tool resize or swap after a configuration change (never under reduced motion)
    if (this.morphT < 1) {
      this.morphT = Math.min(1, this.morphT + dt / 0.75);
      const old = this.oldGripper;
      if (old) {
        old.setPresence(1 - minJerk(clamp01(this.morphT / 0.45)));
        this.gripper.setPresence(minJerk(clamp01((this.morphT - 0.4) / 0.6)));
        if (this.morphT >= 1) {
          old.group.visible = false;
          this.oldGripper = null;
        }
      } else this.gripper.setMorph(minJerk(this.morphT));
      animating = true;
    }

    if (this.opts.reduced) {
      return animating || this.dragging;
    }

    // safety: slow down / stop by zone, smoothly (the robot brakes, it does not freeze)
    const zone = s.zone;
    this.scaleTarget = s.paused ? 0 : zone === "stop" ? 0 : zone === "slow" ? 0.3 : 1;
    this.timeScale = damp(this.timeScale, this.scaleTarget, zone === "stop" ? 9 : 4, dt);
    if (Math.abs(this.timeScale - this.scaleTarget) < 0.002) this.timeScale = this.scaleTarget;
    const sdt = dt * this.timeScale * s.speed;
    this.robot.setLed(zone === "stop" || s.paused ? "#d9442b" : zone === "slow" ? "#f5a800" : "#5fd38a", 1.7);

    // product drops (prefill)
    for (const st of this.stations) {
      if (!st.drops.length) continue;
      const order = st.group.userData.order as number[];
      st.drops = st.drops.filter((d) => {
        d.t += dt;
        const k = clamp01((d.t - d.delay) / 0.32);
        const e = 1 - Math.pow(1 - k, 3);
        st.boxes.setMatrixAt(d.i, this.slotMatrix(st, order[d.i], 0.3 * (1 - e)));
        return k < 1;
      });
      st.boxes.instanceMatrix.needsUpdate = true;
      animating = true;
    }

    if (this.phase !== "idle") {
      this.updateConveyor(sdt);
      this.updateStations(sdt);
      this.updateRobot(sdt);
      this.updateHose();
      this.publish(false);
      animating = true;
    }
    return animating || this.dragging;
  }

  private updateConveyor(dt: number) {
    // spawn at line rate
    for (let li = 0; li < this.lines.length; li++) {
      this.spawnT[li] -= dt;
      if (this.spawnT[li] <= 0) {
        const last = this.items.filter((it) => it.line === li).reduce((mn, it) => Math.min(mn, it.z), Infinity);
        if (last - this.pu - 0.004 > CONVEYOR_START + this.pu / 2) {
          this.items.push({ line: li, z: CONVEYOR_START + this.pu / 2 });
          this.spawnT[li] += this.interval;
        } else this.spawnT[li] = 0; // belt full: the line backs up
      }
    }
    // move, accumulate behind the stop
    for (let li = 0; li < this.lines.length; li++) {
      const row = this.items.filter((it) => it.line === li).sort((a, b) => b.z - a.z);
      let limit = CONVEYOR_END - this.pu / 2;
      for (const it of row) {
        it.z = Math.min(limit, it.z + BELT_SPEED * dt);
        limit = it.z - this.pu - 0.004;
      }
    }
    this.rollerAngle -= (BELT_SPEED * dt) / 0.024;
    let i = 0;
    const rq = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.rollerAngle);
    const pos = new THREE.Vector3();
    for (const mm of this.rollerMats) {
      pos.setFromMatrixPosition(mm);
      this.rollers.setMatrixAt(i++, this.tmpM.compose(pos, rq, this.tmpS));
    }
    this.rollers.instanceMatrix.needsUpdate = true;
    // draw
    let n = 0;
    for (const it of this.items) {
      if (n >= 40) break;
      this.tmpQ.identity();
      this.convBoxes.setMatrixAt(n++, this.tmpM.compose(new THREE.Vector3(this.lines[it.line], CONVEYOR_TOP + this.py / 2, it.z), this.tmpQ, this.tmpS));
    }
    this.convBoxes.count = n;
    this.convBoxes.instanceMatrix.needsUpdate = true;
  }

  private updateStations(dt: number) {
    for (const st of this.stations) {
      if (st.state === "full") {
        st.timer += dt;
        if (st.timer > 1.2) {
          st.state = "out";
          st.timer = 0;
        }
      } else if (st.state === "out") {
        st.timer += dt;
        const k = clamp01(st.timer / 4.2);
        st.group.position.z = minJerk(k) * 3.4;
        if (k >= 1) {
          // fresh pallet
          st.placed = 0;
          st.next = 0;
          st.boxes.count = 0;
          if (st.sheets) st.sheets.count = 0;
          st.group.userData.order = [];
          st.state = "in";
          st.timer = 0;
        }
      } else if (st.state === "in") {
        st.timer += dt;
        const k = clamp01(st.timer / 3.4);
        st.group.position.z = (1 - minJerk(k)) * 3.4;
        if (k >= 1) {
          st.state = "ready";
          st.group.position.z = 0;
        }
      }
    }
  }

  private carry(n: number, task: Task | null) {
    for (let i = 0; i < 2; i++) {
      const c = this.carried[i];
      c.visible = i < n;
      if (!c.visible) continue;
      const off = n === 2 ? (i === 0 ? -0.5 : 0.5) * this.pu : 0;
      c.position.set(0, -this.py / 2, off);
      c.rotation.set(0, 0, 0);
    }
    void task;
  }

  private updateRobot(dt: number) {
    this.phaseT += dt;
    const k = clamp01(this.phaseT / this.phaseDur);
    const e = minJerk(k);
    const f = this.fitR;
    const pairs = f.double ? 2 : 1;

    switch (this.phase) {
      case "toPick": {
        this.transferPoint(this.from, this.to, e, this.cur);
        this.yaw = lerp(this.yawFrom, this.yawTo, e);
        this.lift = lerp(this.liftFrom, this.liftTo, e);
        if (k >= 1) this.begin("wait", 0.05);
        break;
      }
      case "wait": {
        // choose a line with product(s) at the stop
        const task = this.task ?? this.nextTask();
        if (!task) break;
        this.task = task;
        const need = task.slots.length;
        let line = -1;
        for (let i = 0; i < this.lines.length; i++) {
          const l = (this.pickLine + i) % this.lines.length;
          if (this.readyCount(l) >= need) {
            line = l;
            break;
          }
        }
        if (line < 0) break;
        this.pickLine = line;
        // shift over the chosen line if needed
        this.from.copy(this.cur);
        this.pickPoint(line, need, this.to);
        if (this.from.distanceTo(new THREE.Vector3(this.to.x, this.to.y + 0.12, this.to.z)) > 0.02) {
          this.to.y += 0.12;
          this.yawFrom = this.yaw;
          this.yawTo = this.chooseYaw(0);
          this.liftFrom = this.lift;
          this.begin("toPick", this.moveDur(this.from, this.to, 0.4));
          break;
        }
        this.from.copy(this.cur);
        this.pickPoint(line, need, this.to);
        this.begin("down", 0.42 * this.cycleK);
        break;
      }
      case "down":
      case "up":
      case "down2":
      case "up2": {
        this.cur.lerpVectors(this.from, this.to, e);
        if (k >= 1) {
          if (this.phase === "down") this.begin("grip", f.gripper === "pence" ? 0.4 : 0.22);
          else if (this.phase === "up") {
            const t = this.task!;
            this.from.copy(this.cur);
            this.placePoint(t, this.to);
            this.to.y += 0.1;
            this.yawFrom = this.yaw;
            this.yawTo = this.chooseYaw(t.yaw);
            this.liftFrom = this.lift;
            this.liftTo = this.riser.lift ? this.riser.clampHeight((this.to.y + this.robot.hang + CONVEYOR_TOP + this.py + this.gripper.height + this.robot.hang) / 2 - this.robot.d1) : this.lift;
            this.begin("transfer", this.moveDur(this.from, this.to, 0.75));
          } else if (this.phase === "down2") this.begin("release", f.gripper === "pence" ? 0.36 : 0.18);
          else {
            // up2 done → next task
            this.task = null;
            const t = this.nextTask();
            this.from.copy(this.cur);
            this.pickPoint(this.pickLine, t ? t.slots.length : pairs, this.to);
            this.to.y += 0.12;
            this.yawFrom = this.yaw;
            this.yawTo = this.chooseYaw(0);
            this.liftFrom = this.lift;
            const placeY = t ? t.top + this.gripper.height + 0.1 : this.to.y;
            this.liftTo = this.riser.lift ? this.riser.clampHeight((placeY + this.robot.hang + this.to.y + this.robot.hang) / 2 - this.robot.d1) : this.lift;
            this.task = t;
            this.begin("toPick", this.moveDur(this.from, this.to, 0.55));
          }
        }
        break;
      }
      case "grip": {
        if (f.gripper === "pence") this.gripper.setOpen(1 - e);
        if (k >= 1) {
          const t = this.task!;
          const need = t.slots.length;
          // take the front product(s) off the belt
          const row = this.items.filter((it) => it.line === this.pickLine).sort((a, b) => b.z - a.z);
          for (let i = 0; i < need && i < row.length; i++) this.items.splice(this.items.indexOf(row[i]), 1);
          this.carry(need, t);
          this.from.copy(this.cur);
          this.to.copy(this.cur);
          this.to.y += 0.16;
          this.begin("up", 0.36 * this.cycleK);
        }
        break;
      }
      case "transfer": {
        this.transferPoint(this.from, this.to, e, this.cur);
        this.yaw = lerp(this.yawFrom, this.yawTo, e);
        this.lift = lerp(this.liftFrom, this.liftTo, e);
        if (k >= 1) {
          this.from.copy(this.cur);
          this.placePoint(this.task!, this.to);
          this.begin("down2", 0.5 * this.cycleK);
        }
        break;
      }
      case "release": {
        if (f.gripper === "pence") this.gripper.setOpen(e);
        if (k >= 1) {
          const st = this.stations[this.station];
          const t = this.task!;
          this.carry(0, null);
          this.placeTask(st, t, 0);
          st.next++;
          if (st.next >= st.tasks.length) {
            st.state = "full";
            st.timer = 0;
          }
          this.from.copy(this.cur);
          this.to.copy(this.cur);
          this.to.y += 0.1;
          this.begin("up2", 0.3 * this.cycleK);
        }
        break;
      }
    }
    if (this.riser.lift) this.riser.setHeight(this.lift);
    this.solveAt(this.cur);
  }

  private hosePts = Array.from({ length: 12 }, () => new THREE.Vector3());

  private updateHose() {
    const clips = this.robot.clips;
    const pts = this.hosePts;
    const root = this.robot.root;
    root.updateMatrixWorld(true);
    pts[0].copy(this.hoseRoot);
    pts[0].y = Math.max(0.2, this.lift - 0.2);
    clips[0].getWorldPosition(pts[1]);
    for (let i = 1; i < clips.length; i++) clips[i].getWorldPosition(pts[i + 1]);
    const n = clips.length + 1;
    this.gripper.hoseAnchor.getWorldPosition(pts[n]);
    // slack point between wrist clip and gripper
    pts[n + 1].copy(pts[n]);
    const mid = pts[n - 1].clone().lerp(pts[n], 0.5);
    mid.y -= 0.03;
    pts[n].copy(mid);
    this.gripper.hoseAnchor.getWorldPosition(pts[n + 1]);
    this.hose.update(pts.slice(0, n + 2));
  }

  private publish(force: boolean) {
    const st = this.stations[this.station];
    if (!st) return;
    const per = Math.max(1, this.fitR.plan.perLayer);
    const layer = Math.min(this.fitR.stack.layers, Math.floor(st.placed / per) + (st.placed % per ? 1 : 0));
    const waiting = Math.max(0, this.items.length - this.lines.length * 3);
    const live = { station: this.station as 0 | 1, placed: st.placed, layer, waiting };
    const key = `${live.station}|${live.placed}|${live.layer}|${live.waiting}`;
    if (!force && key === this.lastLive) return;
    this.lastLive = key;
    this.store.set({ live });
  }

  private drawScreen() {
    const { ctx, texture, canvas } = this.screen;
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#101211";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#2b2e2c";
    ctx.fillRect(0, 0, w, 18);
    ctx.fillStyle = "#f5a800";
    ctx.fillRect(6, 6, 6, 6);
    ctx.fillStyle = "#cfd2cc";
    ctx.font = "600 10px monospace";
    ctx.fillText(`PAZI ${this.model.name}`, 18, 13);
    const { L, W } = palletSize(this.cfg);
    const s = Math.min((w - 30) / L, (h - 34) / W);
    const ox = w / 2;
    const oy = 18 + (h - 18) / 2;
    ctx.strokeStyle = "#6b6f6a";
    ctx.strokeRect(ox - (L * s) / 2, oy - (W * s) / 2, L * s, W * s);
    for (const sl of this.fitR.plan.layers[0]) {
      ctx.fillStyle = sl.turned ? "#d8b07a" : "#c19a6b";
      ctx.fillRect(ox + (sl.z - sl.dz / 2) * s + 1, oy + (sl.x - sl.dx / 2) * s + 1, sl.dz * s - 2, sl.dx * s - 2);
    }
    texture.needsUpdate = true;
  }

  /* ------------------------------------------------------- operator marker */

  private zoneAt(x: number, z: number): Zone {
    const inside = (ex: number, ez: number, r: number) => {
      const qx = Math.abs(x) - (ex - r);
      const qz = Math.abs(z) - (ez - r);
      const d = Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - r;
      return d < 0;
    };
    if (inside(this.zones.stop.ex, this.zones.stop.ez, 0.3)) return "stop";
    if (inside(this.zones.slow.ex, this.zones.slow.ez, 0.6)) return "slow";
    return "out";
  }

  private placeMarker() {
    if (!this.marker) return;
    const op = this.store.get().operator;
    // default spot: just outside the slow zone on the empty-pallet side, which stays in frame
    // next to the hero copy (the front-right corner falls under the status strip)
    const p = op ?? { x: -(this.zones.slow.ex + 0.45), z: -(this.zones.slow.ez - 0.3) };
    this.marker.position.x = p.x;
    this.marker.position.z = p.z;
    const zone = this.zoneAt(p.x, p.z);
    (this.markerRing!.material as THREE.MeshStandardMaterial).color.set(zone === "out" ? "#ecece6" : "#f5a800");
    this.showZone(zone);
    if (this.store.get().zone !== zone) this.store.set({ zone });
  }

  /** The hazard pattern is a warning, not decoration: it appears only while the operator is in a zone. */
  private showZone(zone: Zone) {
    if (!this.stopHazard || !this.stopPlain) return;
    const warn = zone !== "out";
    this.stopHazard.visible = warn;
    this.stopPlain.visible = !warn;
  }

  private pick(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect();
    this.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hit = new THREE.Vector3();
    return this.raycaster.ray.intersectPlane(this.floorPlane, hit) ? hit : null;
  }

  private onDown = (e: PointerEvent) => {
    if (!this.marker) return;
    const hit = this.pick(e);
    if (!hit) return;
    if (hit.distanceTo(new THREE.Vector3(this.marker.position.x, 0, this.marker.position.z)) < 0.45) {
      this.dragging = true;
      this.canvas.setPointerCapture?.(e.pointerId);
      this.canvas.style.cursor = "grabbing";
      e.preventDefault();
      this.kick();
    }
  };

  private onMove = (e: PointerEvent) => {
    if (!this.marker) return;
    if (!this.dragging) {
      const hit = this.pick(e);
      const near = hit && hit.distanceTo(new THREE.Vector3(this.marker.position.x, 0, this.marker.position.z)) < 0.45;
      this.canvas.style.cursor = near ? "grab" : "";
      return;
    }
    const hit = this.pick(e);
    if (!hit) return;
    const x = THREE.MathUtils.clamp(hit.x, -4.5, 4.5);
    const z = THREE.MathUtils.clamp(hit.z, -3.5, 3.5);
    this.store.set({ operator: { x, z } });
  };

  private onUp = () => {
    if (!this.dragging) return;
    this.dragging = false;
    this.canvas.style.cursor = "";
  };
}

function roundCylSafe(R: number, h: number) {
  return new THREE.CylinderGeometry(R, R, h, 32);
}
