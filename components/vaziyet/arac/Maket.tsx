"use client";

// "Maket": the same plot as the plan, tilted into a table-top model. Loaded
// only when the visitor asks for it (next/dynamic). It opens straight from
// above, framed exactly like the SVG plan underneath, then tilts (620 ms) so
// the plan seems to lift into the model. Fixed camera: no free orbit.
// Shows what the plan cannot: the eave-height limit as a clear acrylic sheet
// on four posts, and any part of the house above it or past a setback in red.
// No network: textures are drawn on canvases, light is local (RoomEnvironment).
// Labels are plain DOM spans over the canvas, placed by projection each frame.
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { Durum, Sonuc } from "@/lib/vaziyet/hesap";
import type { Model } from "@/content/vaziyet/modeller";
import { tr } from "@/content/vaziyet/tr";

type Props = {
  durum: Durum;
  sonuc: Sonuc;
  hedef: 0 | 1;
  inis?: string;
  azHareket: boolean;
  onHazir: () => void;
  onDuz: () => void;
};

type Etiket = { id: string; p: [number, number, number]; metin: string; cls?: string; dus?: boolean };

const ZEMIN = 0.45; // cork board thickness (m at model scale)
const c = tr.arac.cizim;

export function Maket(props: Props) {
  const katman = useRef<HTMLDivElement>(null);
  const { durum, sonuc } = props;
  const { W, D } = durum;
  const { b, ev, m } = sonuc;

  const etiketler = useMemo<Etiket[]>(() => {
    const e: Etiket[] = [{ id: "yol", p: [W / 2, 0.3, 2.1], metin: c.cephe(W), cls: "vz-maket-etiket--yol" }];
    if (sonuc.alanVar && b.y0 > 1.6) e.push({ id: "on", p: [W / 2, ZEMIN + 0.05, -b.y0 / 2], metin: c.on(durum.on) });
    e.push({ id: "ev", p: [(ev.x0 + ev.x1) / 2, ZEMIN + m.mahya + 1.2, -(ev.y0 + ev.y1) / 2], metin: `${m.ad} ${m.m2}`, cls: "vz-maket-etiket--ev", dus: true });
    for (const t of sonuc.tasmalar)
      e.push({
        id: `t-${t.taraf}`,
        p: [(t.r.x0 + t.r.x1) / 2, ZEMIN + m.sacak + 0.5, -(t.r.y0 + t.r.y1) / 2],
        metin: c.metre(t.m),
        cls: "vz-maket-etiket--kirmizi",
        dus: true,
      });
    if (sonuc.alanVar) e.push({ id: "pleksi", p: [b.x0, ZEMIN + durum.hmax, -b.y1], metin: c.yukseklik(durum.hmax), cls: "vz-maket-etiket--pleksi" });
    const kuzeyX = W + 2.7 + sonuc.kuzey[0] * 2.3;
    const kuzeyY = D - 2.0 + sonuc.kuzey[1] * 2.3;
    e.push({ id: "k", p: [kuzeyX, 0.05, -kuzeyY], metin: c.kuzey, cls: "vz-maket-etiket--k" });
    return e;
  }, [W, D, b, ev, m, durum.on, durum.hmax, sonuc.alanVar, sonuc.tasmalar, sonuc.kuzey]);

  return (
    <div className="vz-maket-kap">
      <Canvas
        className="vz-maket"
        orthographic
        shadows="percentage"
        frameloop="demand"
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 80, 0], near: 0.1, far: 600, zoom: 1 }}
        style={{ touchAction: "pan-y" }}
      >
        <color attach="background" args={["#1d5444"]} />
        <Sahne {...props} etiketler={etiketler} katman={katman} />
      </Canvas>
      <div className="vz-maket-etiketler" ref={katman} aria-hidden="true">
        {etiketler.map((e) => (
          <span key={e.id} data-id={e.id} className={`vz-maket-etiket ${e.cls ?? ""}`}>
            {e.metin}
          </span>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ textures
function izgaraDokusu() {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 500; // 10 × 10 m, 50 px per metre
  const g = cv.getContext("2d")!;
  g.fillStyle = "#1d5444";
  g.fillRect(0, 0, 500, 500);
  for (let i = 0; i <= 10; i++) {
    const ana = i % 5 === 0;
    g.strokeStyle = ana ? "#3a7562" : "#2a6251";
    g.lineWidth = ana ? 3 : 1.6;
    g.beginPath();
    g.moveTo(i * 50, 0);
    g.lineTo(i * 50, 500);
    g.moveTo(0, i * 50);
    g.lineTo(500, i * 50);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function mantarDokusu() {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 256; // 4 × 4 m
  const g = cv.getContext("2d")!;
  g.fillStyle = "#c89b68";
  g.fillRect(0, 0, 256, 256);
  let s = 7;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 1400; i++) {
    const x = r() * 256;
    const y = r() * 256;
    const rad = 0.6 + r() * 2.2;
    g.fillStyle = r() < 0.72 ? "rgba(150,104,58,0.55)" : "rgba(226,192,146,0.6)";
    g.beginPath();
    g.arc(x, y, rad, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

// ------------------------------------------------------------------ scene
function Sahne({
  durum,
  sonuc,
  hedef,
  inis,
  azHareket,
  onHazir,
  onDuz,
  etiketler,
  katman,
}: Props & { etiketler: Etiket[]; katman: RefObject<HTMLDivElement | null> }) {
  const { camera, size, invalidate, gl, scene } = useThree();
  const cam = camera as THREE.OrthographicCamera;
  const { W, D } = durum;
  const { b, ev, m } = sonuc;

  const tilt = useRef(0);
  const tiltAnim = useRef<{ from: number; to: number; t0: number } | null>(null);
  const dus = useRef(0);
  const dusAnim = useRef<number | null>(null);
  const evGrup = useRef<THREE.Group>(null);
  const kirmiziGrup = useRef<THREE.Group>(null);
  const hazir = useRef(false);
  const hedefRef = useRef(hedef);
  hedefRef.current = hedef;
  const cb = useRef({ onHazir, onDuz });
  cb.current = { onHazir, onDuz };

  const izgara = useMemo(() => izgaraDokusu(), []);
  const mantar = useMemo(() => mantarDokusu(), []);

  // local light for the acrylic's reflections, no download
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    invalidate();
    return () => {
      scene.environment = null;
      env.dispose();
      pm.dispose();
    };
  }, [gl, scene, invalidate]);

  // camera: straight down (matches the SVG plan) → tilted table view
  const q0 = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), []);
  const q1 = useMemo(() => {
    const az = THREE.MathUtils.degToRad(-30);
    const el = THREE.MathUtils.degToRad(38);
    const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
    // a Camera, not a plain Object3D: cameras look down their -Z when aimed
    const o = new THREE.Camera();
    o.position.copy(dir);
    o.up.set(0, 1, 0);
    o.lookAt(0, 0, 0);
    return o.quaternion.clone();
  }, []);

  const hedefNokta = useMemo(() => new THREE.Vector3(W / 2, 0, -D / 2), [W, D]);
  // what must stay in frame: the plan's own box at t = 0, plus the tall things
  const noktalar = useMemo(() => {
    const p: THREE.Vector3[] = [];
    const duz = (x: number, y: number, h = 0) => p.push(new THREE.Vector3(x, h, -y));
    duz(-1.6, -8.2);
    duz(W + 5.2, -8.2);
    duz(W + 5.2, D + 1.6);
    duz(-1.6, D + 1.6);
    const ust = Math.max(durum.hmax, m.mahya) + ZEMIN + 0.6;
    for (const [x, y] of [
      [b.x0, b.y0],
      [b.x1, b.y0],
      [b.x1, b.y1],
      [b.x0, b.y1],
      [ev.x0, ev.y0],
      [ev.x1, ev.y1],
      [ev.x0, ev.y1],
      [ev.x1, ev.y0],
    ])
      duz(x, y, ust);
    return p;
  }, [W, D, b, ev, durum.hmax, m.mahya]);

  const R = 120;
  const kadraj = (q: THREE.Quaternion) => {
    const sag = new THREE.Vector3(1, 0, 0).applyQuaternion(q);
    const yuk = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    let u0 = Infinity;
    let u1 = -Infinity;
    let v0 = Infinity;
    let v1 = -Infinity;
    const d = new THREE.Vector3();
    for (const p of noktalar) {
      d.copy(p).sub(hedefNokta);
      const u = d.dot(sag);
      const v = d.dot(yuk);
      u0 = Math.min(u0, u);
      u1 = Math.max(u1, u);
      v0 = Math.min(v0, v);
      v1 = Math.max(v1, v);
    }
    let w = u1 - u0;
    let h = v1 - v0;
    const cu = (u0 + u1) / 2;
    const cv = (v0 + v1) / 2;
    const A = size.width / Math.max(1, size.height);
    if (w / h > A) h = w / A;
    else w = h * A;
    cam.left = cu - w / 2;
    cam.right = cu + w / 2;
    cam.top = cv + h / 2;
    cam.bottom = cv - h / 2;
    cam.zoom = 1;
    cam.quaternion.copy(q);
    cam.position.copy(hedefNokta).add(new THREE.Vector3(0, 0, 1).applyQuaternion(q).multiplyScalar(R));
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
  };

  const uygula = () => kadraj(q0.clone().slerp(q1, ease(tilt.current)));

  // DOM labels follow their 3D points
  const v = useMemo(() => new THREE.Vector3(), []);
  const etiketleriYerlestir = () => {
    const el = katman.current;
    if (!el) return;
    for (const e of etiketler) {
      const s = el.querySelector<HTMLElement>(`[data-id="${e.id}"]`);
      if (!s) continue;
      v.set(e.p[0], e.p[1] + (e.dus ? dus.current : 0), e.p[2]).project(cam);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      s.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  };

  // target view changes
  useEffect(() => {
    if (!hazir.current) return;
    if (azHareket) {
      tilt.current = hedef;
      uygula();
      invalidate();
      if (hedef === 0) cb.current.onDuz();
      return;
    }
    tiltAnim.current = { from: tilt.current, to: hedef, t0: performance.now() };
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hedef]);

  // the house lands when the model or its turn changes
  useEffect(() => {
    if (!inis || azHareket || !hazir.current) return;
    dus.current = 6;
    dusAnim.current = performance.now();
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inis]);

  // re-frame when the plot, the labels or the canvas change
  useEffect(() => {
    uygula();
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noktalar, etiketler, size.width, size.height]);

  useFrame(() => {
    if (!hazir.current) {
      hazir.current = true;
      uygula();
      etiketleriYerlestir();
      // first frame drawn flat, exactly over the plan: show it, then tilt
      requestAnimationFrame(() => {
        cb.current.onHazir();
        if (hedefRef.current === 1) {
          if (azHareket) {
            tilt.current = 1;
            uygula();
          } else tiltAnim.current = { from: 0, to: 1, t0: performance.now() + 140 };
        }
        invalidate();
      });
      return;
    }
    let devam = false;
    const a = tiltAnim.current;
    if (a) {
      const x = Math.min(1, Math.max(0, (performance.now() - a.t0) / 620));
      tilt.current = a.from + (a.to - a.from) * x;
      if (x < 1) devam = true;
      else {
        tiltAnim.current = null;
        if (a.to === 0) cb.current.onDuz();
      }
    }
    uygula();
    if (dusAnim.current !== null) {
      const x = Math.min(1, (performance.now() - dusAnim.current) / 420);
      dus.current = 6 * (1 - easeOut(x));
      if (x < 1) devam = true;
      else dusAnim.current = null;
    }
    if (evGrup.current) evGrup.current.position.y = ZEMIN + dus.current;
    if (kirmiziGrup.current) kirmiziGrup.current.position.y = dus.current;
    etiketleriYerlestir();
    if (devam) invalidate();
  });

  // ---------------------------------------------------------------- geometry
  const matBoy = Math.max(W, D) + 120;
  useEffect(() => {
    izgara.repeat.set(matBoy / 10, matBoy / 10);
    izgara.needsUpdate = true;
    mantar.repeat.set(W / 4, D / 4);
    mantar.needsUpdate = true;
    invalidate();
  }, [izgara, mantar, matBoy, W, D, invalidate]);

  const seritSekli = useMemo(() => {
    if (!sonuc.alanVar) return null;
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(W, 0);
    s.lineTo(W, D);
    s.lineTo(0, D);
    s.closePath();
    const h = new THREE.Path();
    h.moveTo(b.x0, b.y0);
    h.lineTo(b.x0, b.y1);
    h.lineTo(b.x1, b.y1);
    h.lineTo(b.x1, b.y0);
    h.closePath();
    s.holes.push(h);
    return new THREE.ShapeGeometry(s);
  }, [W, D, b, sonuc.alanVar]);

  // dashed buildable line, as small flat dashes
  const tireler = useMemo(() => {
    const out: { x: number; y: number; l: number; yatay: boolean }[] = [];
    if (!sonuc.alanVar) return out;
    const kenar = (x0: number, y0: number, x1: number, y1: number) => {
      const yatay = y0 === y1;
      const L = yatay ? Math.abs(x1 - x0) : Math.abs(y1 - y0);
      for (let s = 0; s < L; s += 0.8) {
        const l = Math.min(0.5, L - s);
        if (yatay) out.push({ x: Math.min(x0, x1) + s + l / 2, y: y0, l, yatay });
        else out.push({ x: x0, y: Math.min(y0, y1) + s + l / 2, l, yatay });
      }
    };
    kenar(b.x0, b.y0, b.x1, b.y0);
    kenar(b.x0, b.y1, b.x1, b.y1);
    kenar(b.x0, b.y0, b.x0, b.y1);
    kenar(b.x1, b.y0, b.x1, b.y1);
    return out;
  }, [b, sonuc.alanVar]);

  const agaclar = useMemo(() => {
    if (W < 9 || D < 9) return [] as [number, number][];
    const aday: [number, number][] = [
      [1.9, D - 1.9],
      [W - 1.9, D - 2.3],
      [1.7, 2.0],
      [W - 1.7, 2.6],
      [W / 2 + 0.3, D - 1.6],
    ];
    return aday.filter(([x, y]) => !(x + 1.1 > ev.x0 - 0.6 && x - 1.1 < ev.x1 + 0.6 && y + 1.1 > ev.y0 - 0.6 && y - 1.1 < ev.y1 + 0.6)).slice(0, 4);
  }, [W, D, ev]);

  const cx = (ev.x0 + ev.x1) / 2;
  const cy = (ev.y0 + ev.y1) / 2;
  const kuzeyAci = Math.atan2(sonuc.kuzey[0], sonuc.kuzey[1]);
  const isikHedef = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    isikHedef.position.set(W / 2, 0, -D / 2);
    isikHedef.updateMatrixWorld();
  }, [isikHedef, W, D]);
  const golgeAlan = Math.max(W, D) / 2 + 12;
  const yolTire = Math.max(1, Math.floor((W + 1.2) / 2.2));

  return (
    <>
      <hemisphereLight args={["#f4f7f2", "#1a3d33", 1.15]} />
      <primitive object={isikHedef} />
      <directionalLight
        position={[W / 2 - 22, 34, -D / 2 - 24]}
        intensity={2.1}
        color="#fff4e4"
        castShadow
        target={isikHedef}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-golgeAlan}
        shadow-camera-right={golgeAlan}
        shadow-camera-top={golgeAlan}
        shadow-camera-bottom={-golgeAlan}
        shadow-camera-near={1}
        shadow-camera-far={140}
        shadow-bias={-0.0004}
      />

      {/* cutting mat */}
      <mesh rotation-x={-Math.PI / 2} position={[W / 2, 0, -D / 2]} receiveShadow>
        <planeGeometry args={[matBoy, matBoy]} />
        <meshStandardMaterial map={izgara} roughness={0.96} />
      </mesh>

      {/* road: grey card with a dashed centre line */}
      <mesh position={[W / 2, 0.1, 3.825]} receiveShadow castShadow>
        <boxGeometry args={[W + 2.4, 0.2, 6.75]} />
        <meshStandardMaterial color="#8c9996" roughness={0.95} />
      </mesh>
      {Array.from({ length: yolTire }, (_, i) => (
        <mesh key={i} position={[0.6 + i * 2.2, 0.205, 3.8]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[1.2, 0.12]} />
          <meshBasicMaterial color="#e8eeec" />
        </mesh>
      ))}

      {/* cork plot */}
      <mesh position={[W / 2, ZEMIN / 2, -D / 2]} castShadow receiveShadow>
        <boxGeometry args={[W, ZEMIN, D]} />
        {[0, 1, 2, 3, 4, 5].map((i) =>
          i === 2 ? (
            <meshStandardMaterial key={i} attach={`material-${i}`} map={mantar} roughness={0.92} />
          ) : (
            <meshStandardMaterial key={i} attach={`material-${i}`} color={i % 2 ? "#8a6338" : "#9e7445"} roughness={0.9} />
          ),
        )}
      </mesh>
      {seritSekli && (
        <mesh geometry={seritSekli} rotation-x={-Math.PI / 2} position={[0, ZEMIN + 0.004, 0]} receiveShadow>
          <meshStandardMaterial color="#6e4a26" transparent opacity={0.42} depthWrite={false} roughness={1} />
        </mesh>
      )}
      {tireler.map((t, i) => (
        <mesh key={i} position={[t.x, ZEMIN + 0.008, -t.y]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={t.yatay ? [t.l, 0.1] : [0.1, t.l]} />
          <meshBasicMaterial color="#fff4e0" />
        </mesh>
      ))}

      {/* sponge trees */}
      {agaclar.map(([x, y]) => (
        <group key={`${x}-${y}`} position={[x, ZEMIN, -y]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.13, 2.0, 8]} />
            <meshStandardMaterial color="#6b4e2e" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow>
            <icosahedronGeometry args={[1.12, 2]} />
            <meshStandardMaterial color="#3e8a4e" roughness={1} flatShading />
          </mesh>
        </group>
      ))}

      {/* the house: acrylic body, gable roof, engraved windows */}
      <group ref={evGrup} position={[cx, ZEMIN, -cy]} rotation-y={(-durum.rot * Math.PI) / 180}>
        <Ev m={m} />
      </group>

      {/* parts past a setback line, and above the height limit, in red */}
      <group ref={kirmiziGrup}>
        {sonuc.tasmalar.map((t) => {
          const w = t.r.x1 - t.r.x0;
          const d = t.r.y1 - t.r.y0;
          return (
            <mesh key={t.taraf} position={[(t.r.x0 + t.r.x1) / 2, ZEMIN + m.sacak / 2, -(t.r.y0 + t.r.y1) / 2]} castShadow>
              <boxGeometry args={[w + 0.04, m.sacak + 0.02, d + 0.04]} />
              <meshStandardMaterial color="#e5392d" emissive="#5a0e08" emissiveIntensity={0.35} roughness={0.45} />
            </mesh>
          );
        })}
        {m.sacak > durum.hmax && (
          <mesh position={[cx, ZEMIN + (durum.hmax + m.sacak) / 2, -cy]}>
            <boxGeometry args={[ev.x1 - ev.x0 + 0.05, m.sacak - durum.hmax + 0.02, ev.y1 - ev.y0 + 0.05]} />
            <meshStandardMaterial color="#e5392d" emissive="#5a0e08" emissiveIntensity={0.35} roughness={0.45} />
          </mesh>
        )}
      </group>

      {/* height limit: a clear sheet on four posts over the buildable area */}
      {sonuc.alanVar && <Pleksi b={b} h={durum.hmax} />}

      {/* north arrow, flat on the mat */}
      <group position={[W + 2.7, 0.02, -(D - 2.0)]} rotation-y={-kuzeyAci}>
        <mesh rotation-x={-Math.PI / 2}>
          <ringGeometry args={[1.5, 1.58, 48]} />
          <meshBasicMaterial color="#9fbfb3" />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, -0.2]}>
          <planeGeometry args={[0.14, 1.9]} />
          <meshBasicMaterial color="#f3f6f2" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.01, -1.15]}>
          <circleGeometry args={[0.38, 3]} />
          <meshBasicMaterial color="#f3f6f2" />
        </mesh>
      </group>
    </>
  );
}

function Pleksi({ b, h }: { b: { x0: number; y0: number; x1: number; y1: number }; h: number }) {
  const w = b.x1 - b.x0;
  const d = b.y1 - b.y0;
  const kenar = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, 0.04, d)), [w, d]);
  const y = ZEMIN + h;
  return (
    <group>
      <mesh position={[(b.x0 + b.x1) / 2, y, -(b.y0 + b.y1) / 2]} renderOrder={2}>
        <boxGeometry args={[w, 0.04, d]} />
        <meshPhysicalMaterial color="#e8f6ff" transparent opacity={0.16} roughness={0.08} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={kenar} position={[(b.x0 + b.x1) / 2, y, -(b.y0 + b.y1) / 2]}>
        <lineBasicMaterial color="#e8f6ff" transparent opacity={0.7} />
      </lineSegments>
      {[
        [b.x0, b.y0],
        [b.x1, b.y0],
        [b.x1, b.y1],
        [b.x0, b.y1],
      ].map(([x, yy]) => (
        <mesh key={`${x}-${yy}`} position={[x, ZEMIN + h / 2, -yy]}>
          <boxGeometry args={[0.07, h, 0.07]} />
          <meshStandardMaterial color="#e8f6ff" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

/** The house in its own frame: centred, ridge along x, front (entrance) facing +z. */
function Ev({ m }: { m: Model }) {
  const { w, d, sacak, mahya } = m;
  const cati = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-d / 2 - 0.25, 0);
    s.lineTo(d / 2 + 0.25, 0);
    s.lineTo(0, mahya - sacak);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: w + 0.5, bevelEnabled: false });
    g.translate(0, 0, -(w + 0.5) / 2);
    g.rotateY(Math.PI / 2);
    return g;
  }, [w, d, sacak, mahya]);
  const pencereler = useMemo(() => {
    const out: { p: [number, number, number]; s: [number, number, number] }[] = [];
    m.katlar.forEach((k, f) => {
      const taban = 0.5 + f * 2.9;
      for (const pn of k.pencereler) {
        const orta = (pn.a + pn.b) / 2;
        const boy = pn.b - pn.a;
        const y = taban + 0.9 + 0.62;
        if (pn.duvar === "on") out.push({ p: [orta - w / 2, y, d / 2 + 0.012], s: [boy, 1.25, 0.05] });
        if (pn.duvar === "arka") out.push({ p: [orta - w / 2, y, -d / 2 - 0.012], s: [boy, 1.25, 0.05] });
        if (pn.duvar === "sol") out.push({ p: [-w / 2 - 0.012, y, d / 2 - orta], s: [0.05, 1.25, boy] });
        if (pn.duvar === "sag") out.push({ p: [w / 2 + 0.012, y, d / 2 - orta], s: [0.05, 1.25, boy] });
      }
      for (const k2 of k.kapilar) if (k2.dis) out.push({ p: [k2.x + k2.w / 2 - w / 2, 0.5 + 1.05, d / 2 + 0.012], s: [k2.w, 2.1, 0.05] });
    });
    return out;
  }, [m, w, d]);
  return (
    <group>
      <mesh position={[0, sacak / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, sacak, d]} />
        <meshPhysicalMaterial color="#3157d5" roughness={0.3} clearcoat={0.7} clearcoatRoughness={0.25} />
      </mesh>
      <mesh geometry={cati} position={[0, sacak, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#4068e4" roughness={0.3} clearcoat={0.7} clearcoatRoughness={0.25} />
      </mesh>
      {m.katSayisi === 2 && (
        <mesh position={[0, 3.4, 0]}>
          <boxGeometry args={[w + 0.03, 0.06, d + 0.03]} />
          <meshStandardMaterial color="#1b3790" roughness={0.5} />
        </mesh>
      )}
      {pencereler.map((p, i) => (
        <mesh key={i} position={p.p}>
          <boxGeometry args={p.s} />
          <meshStandardMaterial color="#14286e" roughness={0.15} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}
