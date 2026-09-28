"use client";

import * as THREE from "three";
import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { PerformanceMonitor, useTexture } from "@react-three/drei";
import { addLoad, emit, store, type Tier } from "@/lib/onikitas/store";
import { depthMap, FOCUS, makeTrees } from "@/lib/onikitas/site";
import { buildBackdrop, buildTerrain, buildTreeGeometry, buildVillas, treeMatrices } from "./build";
import { skyMaterial, terrainMaterial, treeMaterial, U, villaMaterial, wallMaterial, waterMaterial, windowMaterial } from "./materials";
import { createLight, sampleLight } from "./palette";
import { cameraGoal, wallFrame } from "./rig";
import { makeLeafTexture } from "./leaves";

const Q = {
  high: { seg: 256, trees: 520, shadow: 4096, radius: 3.5, dpr: [1, 1.5] as [number, number] },
  mid: { seg: 200, trees: 360, shadow: 2048, radius: 2, dpr: [1, 1.25] as [number, number] },
  low: { seg: 120, trees: 170, shadow: 1024, radius: 2, dpr: [1, 1] as [number, number] },
};

const damp = (a: number, b: number, lambda: number, dt: number) => a + (b - a) * (1 - Math.exp(-lambda * dt));

// ---------------------------------------------------------------------------

function Textures() {
  const [plaster, plasterN, trav] = useTexture([
    "/onikitas/tex/plaster.webp",
    "/onikitas/tex/plaster-n.webp",
    "/onikitas/tex/travertine.webp",
  ]);
  const gl = useThree((s) => s.gl);
  useLayoutEffect(() => {
    const aniso = Math.min(4, gl.capabilities.getMaxAnisotropy());
    for (const t of [plaster, plasterN, trav]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = aniso;
      t.needsUpdate = true;
    }
    plaster.colorSpace = THREE.SRGBColorSpace;
    trav.colorSpace = THREE.SRGBColorSpace;
    plasterN.colorSpace = THREE.NoColorSpace;
    U.uPlaster.value = plaster;
    U.uPlasterN.value = plasterN;
    U.uTrav.value = trav;
    addLoad(3);
  }, [plaster, plasterN, trav, gl]);
  return null;
}

// ---------------------------------------------------------------------------

function World({ tier }: { tier: Tier }) {
  const q = Q[tier];
  const scene = useThree((s) => s.scene);

  const built = useMemo(() => {
    const terrain = buildTerrain(q.seg);
    const backdrop = buildBackdrop();
    const villas = buildVillas();
    const treeGeo = buildTreeGeometry();
    const trees = makeTrees(q.trees);
    const mats = treeMatrices(trees);
    const size = 128;
    const depth = new THREE.DataTexture(depthMap(size), size, size, THREE.RedFormat, THREE.UnsignedByteType);
    depth.magFilter = depth.minFilter = THREE.LinearFilter;
    depth.needsUpdate = true;
    U.uDepth.value = depth;
    U.uLeaves.value = makeLeafTexture();
    return { terrain, backdrop, villas, treeGeo, mats };
  }, [q.seg, q.trees]);

  const materials = useMemo(
    () => ({
      terrain: terrainMaterial(),
      villa: villaMaterial(),
      windows: windowMaterial(),
      tree: treeMaterial(),
      sea: waterMaterial(false),
      pool: waterMaterial(true),
      sky: skyMaterial(),
      wall: wallMaterial(),
    }),
    [],
  );

  useEffect(() => {
    addLoad(2);
    return () => {
      built.terrain.dispose();
      built.backdrop.dispose();
      built.villas.solid.dispose();
      built.villas.windows.dispose();
      built.villas.pools.dispose();
      built.treeGeo.dispose();
    };
  }, [built]);

  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);

  const trees = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = trees.current;
    if (!m) return;
    built.mats.forEach((mat, i) => m.setMatrixAt(i, mat));
    m.count = built.mats.length;
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [built]);

  // fog follows the horizon colour
  useLayoutEffect(() => {
    scene.fog = new THREE.Fog("#e6bea4", 140, 760);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  // wall with an arched opening, placed on the camera's opening path
  const wall = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-9, -6);
    shape.lineTo(9, -6);
    shape.lineTo(9, 6);
    shape.lineTo(-9, 6);
    shape.lineTo(-9, -6);
    const hole = new THREE.Path();
    const hw = 0.56;
    hole.moveTo(-hw, -0.78);
    hole.lineTo(hw, -0.78);
    hole.lineTo(hw, 0.32);
    hole.absarc(0, 0.32, hw, 0, Math.PI, false);
    hole.lineTo(-hw, -0.78);
    shape.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: false, curveSegments: 28 });
    g.translate(0, 0, -0.5);
    return g;
  }, []);
  const wallRef = useRef<THREE.Mesh>(null);
  useLayoutEffect(() => {
    const f = wallFrame();
    const m = wallRef.current;
    if (!m) return;
    m.position.copy(f.wall);
    m.lookAt(f.wall.clone().sub(f.dir));
  }, []);

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const g = built.villas.solid;
    const a = g.attributes.aVilla as THREE.BufferAttribute;
    const id = e.face ? a.getX(e.face.a) : -1;
    if (store.hover !== id) {
      store.hover = id;
      emit("hover");
    }
  };
  const onOut = () => {
    if (store.hover !== -1) {
      store.hover = -1;
      emit("hover");
    }
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const a = built.villas.solid.attributes.aVilla as THREE.BufferAttribute;
    const id = e.face ? a.getX(e.face.a) : -1;
    if (id < 0) return;
    store.hover = id;
    emit("hover");
    store.selected = id;
    emit("selected");
  };

  return (
    <>
      <mesh material={materials.sky} frustumCulled={false} renderOrder={-10}>
        <sphereGeometry args={[1000, 32, 16]} />
      </mesh>
      <mesh ref={wallRef} geometry={wall} material={materials.wall} name="wall" />
      <mesh geometry={built.backdrop} material={materials.terrain} />
      <mesh geometry={built.terrain} material={materials.terrain} receiveShadow />
      <mesh rotation-x={-Math.PI / 2} material={materials.sea} renderOrder={-1}>
        <planeGeometry args={[4000, 4000, 1, 1]} />
      </mesh>
      <mesh
        geometry={built.villas.solid}
        material={materials.villa}
        castShadow
        receiveShadow
        onPointerMove={onMove}
        onPointerOut={onOut}
        onClick={onClick}
      />
      <mesh geometry={built.villas.windows} material={materials.windows} />
      <mesh geometry={built.villas.pools} material={materials.pool} receiveShadow={false} />
      <instancedMesh
        ref={trees}
        args={[built.treeGeo, materials.tree, built.mats.length]}
        castShadow
        frustumCulled={false}
      />
      <Sun tier={tier} />
      <Director wallRef={wallRef} />
    </>
  );
}

// ---------------------------------------------------------------------------

function Sun({ tier }: { tier: Tier }) {
  const q = Q[tier];
  const light = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const scene = useThree((s) => s.scene);
  const target = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    const l = light.current;
    if (!l) return;
    target.position.set(FOCUS.x, FOCUS.y - 4, FOCUS.z - 2);
    scene.add(target);
    l.target = target;
    const cam = l.shadow.camera;
    cam.left = -46;
    cam.right = 46;
    cam.top = 38;
    cam.bottom = -38;
    cam.near = 1;
    cam.far = 260;
    cam.updateProjectionMatrix();
    l.shadow.mapSize.set(q.shadow, q.shadow);
    l.shadow.bias = -0.0003;
    l.shadow.normalBias = 0.035;
    l.shadow.radius = q.radius;
    l.shadow.map?.dispose();
    l.shadow.map = null;
    return () => {
      scene.remove(target);
    };
  }, [scene, target, q.shadow, q.radius]);

  const L = useMemo(() => createLight(), []);
  useFrame(() => {
    const l = light.current;
    const h = hemi.current;
    if (!l || !h) return;
    sampleLight(U.uHour.value, L);
    l.position.copy(target.position).addScaledVector(L.lightDir, 130);
    l.color.copy(L.sun);
    l.intensity = L.sunI;
    h.color.copy(L.sky);
    h.groundColor.copy(L.ground);
    h.intensity = L.hemiI * 1.9;
    U.uSunDir.value.copy(L.sunDir);
    U.uLightDir.value.copy(L.lightDir);
    U.uSunColor.value.copy(L.sun).multiplyScalar(Math.max(L.sunI, 0.4) * 0.45);
    U.uZenith.value.copy(L.zenith);
    U.uHorizon.value.copy(L.horizon);
    U.uStars.value = L.stars;
    U.uNight.value = L.night;
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(L.horizon);
  }, -1);

  return (
    <>
      <directionalLight ref={light} castShadow />
      <hemisphereLight ref={hemi} />
    </>
  );
}

// ---------------------------------------------------------------------------

/** Per-frame bridge: store -> uniforms and camera. */
function Director({ wallRef }: { wallRef: React.RefObject<THREE.Mesh | null> }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const goal = useMemo(() => ({ pos: new THREE.Vector3(), tgt: new THREE.Vector3() }), []);
  const cur = useMemo(() => ({ pos: new THREE.Vector3(), tgt: new THREE.Vector3(), init: false }), []);
  const s = useRef({ hour: store.hour, reveal: store.reveal, sel: 0 });

  useEffect(() => {
    const portrait = size.width / size.height < 0.9;
    camera.fov = portrait ? 58 : 38;
    U.uBeamX.value = portrait ? -0.35 : -1.35;
    camera.near = 0.05;
    camera.far = 4000;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const still = store.still >= 0;
    U.uTime.value += dt;
    const k = still ? 1 : 1 - Math.exp(-6 * dt);
    s.current.hour += (store.hour - s.current.hour) * k;
    s.current.reveal += (store.reveal - s.current.reveal) * (still ? 1 : 1 - Math.exp(-5 * dt));
    U.uHour.value = s.current.hour;
    U.uReveal.value = s.current.reveal;
    const h = s.current.hour;
    const wind = 0.22 + 0.9 * THREE.MathUtils.smoothstep(h, 13.8, 15.6) * (1 - THREE.MathUtils.smoothstep(h, 18.6, 20.2));
    U.uWind.value = damp(U.uWind.value, wind, 2, dt);
    U.uHover.value = store.hover;
    U.uSelected.value = store.selected;
    s.current.sel = damp(s.current.sel, store.chapter === 5 ? 1 : 0, 3, dt);
    U.uSelectAmt.value = s.current.sel;
    U.uPointer.value.set(
      damp(U.uPointer.value.x, store.px, 3, dt),
      damp(U.uPointer.value.y, store.py, 3, dt),
    );

    cameraGoal(store.chapter, store.t, goal, s.current.sel, store.selected, size.width / size.height < 0.9);
    // pointer parallax, gentler at the wall
    const par = store.chapter === 0 && store.t < 0.5 ? 0.06 : 0.9;
    const fwd = goal.tgt.clone().sub(goal.pos).normalize();
    const right = fwd.clone().cross(camera.up).normalize();
    goal.pos.addScaledVector(right, U.uPointer.value.x * par).addScaledVector(camera.up, U.uPointer.value.y * par * 0.5);

    if (!cur.init || still) {
      cur.pos.copy(goal.pos);
      cur.tgt.copy(goal.tgt);
      cur.init = true;
    } else {
      const kk = 1 - Math.exp(-5.5 * dt);
      cur.pos.lerp(goal.pos, kk);
      cur.tgt.lerp(goal.tgt, kk);
    }
    camera.position.copy(cur.pos);
    camera.lookAt(cur.tgt);
    const w = wallRef.current;
    if (w) w.visible = store.chapter === 0;
    void state;
  }, -2);
  return null;
}

// ---------------------------------------------------------------------------

function Ready() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    let alive = true;
    const done = () => {
      if (!alive) return;
      addLoad(2);
      let frames = 0;
      const tick = () => {
        if (!alive) return;
        if (++frames < 3) return requestAnimationFrame(tick);
        addLoad(1);
        store.ready = true;
        emit("ready");
      };
      requestAnimationFrame(tick);
    };
    const r = gl as THREE.WebGLRenderer & { compileAsync?: (s: THREE.Object3D, c: THREE.Camera) => Promise<unknown> };
    if (r.compileAsync) r.compileAsync(scene, camera).then(done, done);
    else done();
    return () => {
      alive = false;
    };
  }, [gl, scene, camera]);
  return null;
}

// Post-processing is split per tier so phones never download it.
const PostHigh = lazy(() => import("./PostHigh"));
const PostMid = lazy(() => import("./PostMid"));
function Post({ tier }: { tier: Tier }) {
  if (tier === "low") return null;
  return <Suspense fallback={null}>{tier === "high" ? <PostHigh /> : <PostMid />}</Suspense>;
}

// ---------------------------------------------------------------------------

export default function Scene({ tier: initial }: { tier: Tier }) {
  const [tier, setTier] = useState<Tier>(initial);
  const [dpr, setDpr] = useState(Q[initial].dpr[1]);
  useEffect(() => {
    addLoad(3);
  }, []);
  const degrade = () => {
    if (store.still >= 0) return;
    setTier((t) => {
      const next: Tier = t === "high" ? "mid" : "low";
      setDpr(Q[next].dpr[1]);
      return next;
    });
  };
  return (
    <div className="oki-canvas" aria-hidden="true">
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={dpr}
      gl={{ antialias: tier === "low", powerPreference: "high-performance", stencil: false, alpha: false }}
      camera={{ fov: 38, near: 0.05, far: 4000, position: [0, 20, 80] }}
    >
      <PerformanceMonitor onDecline={degrade} flipflops={2} />
      <Suspense fallback={null}>
        <Textures />
        <World tier={tier} />
        <Ready />
      </Suspense>
      <Post tier={tier} />
    </Canvas>
    </div>
  );
}

