// Damar — kitap açılımı denemesi (three.js, repodaki node_modules/three).
// Her plaka dokusu tarayıcıda, GPU'da üretilir: blok = 3B gürültü hacmi, plaka = z dilimi.
import * as THREE from 'three';
import { MARBLE_VERT, MARBLE_FRAG, STONES, FINISHES, SLAB, uniformValues, lin } from './marble-glsl.js';

const q = new URLSearchParams(location.search);
const state = {
  stone: q.get('stone') || 'eflatun',
  view: q.get('view') || 'book2',
  finish: q.get('finish') || 'polished',
  slab: +(q.get('slab') || 21),
  anim: q.get('anim') !== '0',
  res: +(q.get('res') || 2048),
};

// ---------- example block ----------
const BLOCK = { id: 'DM-0412', count: 46 };
const SOLD = new Set([...Array(20).keys()].map((i) => i + 1).concat([27, 28, 29, 38]));
const need = (v) => (v === 'book4' || v === 'wall' ? 4 : v === 'slab' ? 1 : 2);
const okStart = (n, k) => {
  for (let i = 0; i < k; i++) {
    const s = n + i;
    if (s < 1 || s > BLOCK.count || SOLD.has(s)) return false;
  }
  return true;
};
const freeCount = () => { let c = 0; for (let i = 1; i <= BLOCK.count; i++) if (!SOLD.has(i)) c++; return c; };
function snapStart(n, k, dir = 1) {
  for (let step = 0; step < BLOCK.count; step++) {
    const c = n + step * dir;
    if (okStart(c, k)) return c;
  }
  for (let c = 1; c <= BLOCK.count; c++) if (okStart(c, k)) return c;
  return 21;
}

// ---------- renderer ----------
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(innerWidth, innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
const maxAniso = renderer.capabilities.getMaxAnisotropy();

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
// Simple light rooms for reflections: a softbox studio and a room with one tall window.
function lightRoom(kind) {
  const env = new THREE.Scene();
  const box = new THREE.Mesh(new THREE.BoxGeometry(20, 10, 20), new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: new THREE.Color(kind === 'room' ? 0.42 : 0.2, kind === 'room' ? 0.4 : 0.2, kind === 'room' ? 0.37 : 0.2) }));
  box.position.y = 4;
  if (kind !== 'room') box.material.color.setScalar(0.3);
  env.add(box);
  const lamp = (w, h, x, y, z, ry, rx, k) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.98, k * 0.94), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0);
    env.add(m);
  };
  if (kind === 'room') {
    lamp(4.5, 6, -9.9, 4, 1, Math.PI / 2, 0, 7);          // tall window on the left wall
    lamp(6, 3, 2, 8.9, 2, 0, Math.PI / 2, 1.2);           // ceiling bounce
  } else {
    lamp(5, 3, -5, 6, 6, Math.PI / 5, -0.3, 6);           // key softbox, front left
    lamp(3, 6, 7, 4, 4, -Math.PI / 3, 0, 2.5);            // strip on the right
    lamp(8, 2, 0, 8.9, 0, 0, Math.PI / 2, 1.5);           // overhead
  }
  const t = pmrem.fromScene(env, 0.02).texture;
  env.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
  return t;
}
const ENV = { studio: lightRoom('studio'), room: lightRoom('room') };
scene.environment = ENV.studio;
scene.environmentIntensity = 0.85;
const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.05, 120);
const root = new THREE.Group();
scene.add(root);

// ---------- marble generator ----------
const genUniforms = {};
for (const [k, v] of Object.entries(uniformValues({ stone: 'eflatun', pxPerM: 600 }))) genUniforms[k] = { value: v };
const genMat = new THREE.RawShaderMaterial({
  vertexShader: MARBLE_VERT,
  fragmentShader: MARBLE_FRAG,
  glslVersion: THREE.GLSL3,
  uniforms: genUniforms,
  depthTest: false,
  depthWrite: false,
});
const genScene = new THREE.Scene();
const genQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), genMat);
genQuad.frustumCulled = false;
genScene.add(genQuad);
const genCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

let live = [];   // render targets of the current view
function makeTex(req, wpx) {
  const reg = req.region;
  const hpx = Math.max(16, Math.round((wpx * reg.h) / reg.w));
  const rt = new THREE.WebGLRenderTarget(wpx, hpx, {
    depthBuffer: false,
    stencilBuffer: false,
    colorSpace: req.mode === 1 ? THREE.NoColorSpace : THREE.SRGBColorSpace,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
  });
  rt.texture.anisotropy = maxAniso;
  const u = uniformValues({ ...req, pxPerM: wpx / reg.w, encode: false });
  for (const k in u) if (genUniforms[k]) genUniforms[k].value = u[k];
  const strip = 256;
  for (let y = 0; y < hpx; y += strip) {
    rt.scissor.set(0, y, wpx, Math.min(strip, hpx - y));
    rt.scissorTest = true;
    renderer.setRenderTarget(rt);
    renderer.render(genScene, genCam);
  }
  rt.scissorTest = false;
  renderer.setRenderTarget(null);
  live.push(rt);
  return rt.texture;
}

// ---------- materials ----------
function faceMaterial(map, bump) {
  const f = FINISHES[state.finish];
  const m = new THREE.MeshPhysicalMaterial({
    map,
    roughness: f.roughness,
    metalness: 0,
    ior: 1.55,
    specularIntensity: 1,
    clearcoat: state.finish === 'polished' ? 0.3 : 0,
    clearcoatRoughness: 0.035,
  });
  if (bump) { m.bumpMap = bump; m.bumpScale = 4.0; }
  return m;
}
function edgeMaterial() {
  const s = STONES[state.stone];
  const c = new THREE.Color().setRGB(...lin(s.base[1]), THREE.LinearSRGBColorSpace).multiplyScalar(0.86);
  return new THREE.MeshStandardMaterial({ color: c, roughness: 0.82 });
}
function sawnMaterial() {
  const s = STONES[state.stone];
  const c = new THREE.Color().setRGB(...lin(s.base[1]), THREE.LinearSRGBColorSpace).multiplyScalar(0.72);
  return new THREE.MeshStandardMaterial({ color: c, roughness: 0.95 });
}
const plain = (hex, rough = 0.9) => new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), roughness: rough });

// texture request helper: slab number n, side 0 face-up / 1 flipped
function tex(n, side, region, opts = {}, wpx = state.res) {
  const base = { stone: state.stone, finish: state.finish, slab: n, side, region, ...opts };
  const map = makeTex(base, wpx);
  const bump = state.finish === 'antiqued' ? makeTex({ ...base, mode: 1 }, Math.min(wpx, 1536)) : null;
  return { map, bump };
}

// box slab: front face (+z) carries the texture, back is the sawn face
function slabBox(w, h, t, faces) {
  const geo = new THREE.BoxGeometry(w, h, t);
  const edge = edgeMaterial();
  const mats = [edge, edge, edge, edge, faceMaterial(faces.map, faces.bump), sawnMaterial()];
  const mesh = new THREE.Mesh(geo, mats);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// ---------- studio for flat views ----------
let key, fill;
function lights(kind) {
  if (key) { scene.remove(key); scene.remove(key.target); }
  if (fill) scene.remove(fill);
  key = new THREE.DirectionalLight(0xfff6ec, kind === 'room' ? 1.25 : 0.8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 4;
  fill = new THREE.HemisphereLight(0xf1efe9, 0xb9b2a8, kind === 'room' ? 0.25 : 0.2);
  scene.add(key, key.target, fill);
  scene.environment = ENV[kind === 'room' ? 'room' : 'studio'];
  scene.environmentIntensity = kind === 'room' ? 0.8 : 0.9;
  renderer.toneMappingExposure = kind === 'room' ? 1.38 : 1.5;
}
function studio(halfW, top) {
  scene.background = new THREE.Color('#c9c5be');
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), plain('#bdb8b0', 0.95));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), plain('#cdc8c0', 0.97));
  back.position.set(0, 15, -1.2);
  back.receiveShadow = true;
  root.add(back);
  key.position.set(-halfW * 1.6, top * 2.2, 7);
  key.target.position.set(0, top * 0.4, 0);
  const s = Math.max(halfW, top) * 1.6;
  Object.assign(key.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 0.5, far: 40 });
  key.shadow.camera.updateProjectionMatrix();
}

// irregular raw slab outline (single slab view)
function rawSlabGeometry(W, H, t, seed) {
  const pts = [];
  const rnd = mulberry(seed);
  const n = 60;
  const jag = (i) => (rnd() - 0.5) * 0.018;
  const push = (x, y) => pts.push(new THREE.Vector2(x, y));
  for (let i = 0; i < n; i++) push((W * i) / n, 0 + Math.abs(jag(i)));
  for (let i = 0; i < n * 0.6; i++) push(W - Math.abs(jag(i)) - (i < 3 ? 0.03 : 0), (H * i) / (n * 0.6));
  for (let i = 0; i < n; i++) push(W - (W * i) / n, H - Math.abs(jag(i)) - (i > n - 4 ? 0.05 * rnd() : 0));
  for (let i = 0; i < n * 0.6; i++) push(Math.abs(jag(i)) + (i < 2 ? 0.04 : 0), H - (H * i) / (n * 0.6));
  const shape = new THREE.Shape(pts);
  const uvGen = {
    generateTopUV(g, v, a, b, c) {
      return [a, b, c].map((i) => new THREE.Vector2(v[i * 3] / W, v[i * 3 + 1] / H));
    },
    generateSideWallUV() {
      return [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)];
    },
  };
  const geo = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false, UVGenerator: uvGen, curveSegments: 1 });
  geo.translate(-W / 2, 0, -t);
  return geo;
}
function mulberry(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- views ----------
let anims = [];
let camTarget = new THREE.Vector3();
let camBase = new THREE.Vector3();
const dimsEl = document.getElementById('dims');

function clearView() {
  for (const rt of live) rt.dispose();
  live = [];
  root.traverse((o) => {
    if (o.isMesh) {
      o.geometry.dispose();
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
    }
  });
  root.clear();
  anims = [];
}

function frame(pos, target, fov) {
  camera.fov = fov;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  if (innerWidth <= 760) {
    // the control panel covers the lower half on phones: lift the subject into the upper half
    const d = pos.distanceTo(target);
    const up = d * Math.tan(THREE.MathUtils.degToRad(fov / 2)) * 0.48;
    pos = pos.clone(); target = target.clone();
    pos.y -= up; target.y -= up;
  }
  camBase.copy(pos);
  camTarget.copy(target);
  camera.position.copy(pos);
  camera.lookAt(target);
}
// distance so that a w×h rectangle fits, leaving room for the panel on the left
function fitDistance(w, h, fov, margin = 1.18) {
  const vf = THREE.MathUtils.degToRad(fov);
  const aspect = innerWidth / innerHeight;
  const usable = innerWidth > 900 ? (innerWidth - 330) / innerWidth : 1;
  const dh = (h * margin) / 2 / Math.tan(vf / 2);
  const dw = (w * margin) / 2 / Math.tan(vf / 2) / (aspect * usable);
  return Math.max(dh, dw);
}
const panelShift = (d, fov) => {
  if (innerWidth <= 900) return 0;
  const vf = THREE.MathUtils.degToRad(fov);
  const halfW = Math.tan(vf / 2) * d * (innerWidth / innerHeight);
  return -halfW * (330 / innerWidth);
};

function viewSlab() {
  const W = SLAB.w, H = SLAB.h, t = SLAB.t;
  lights('studio');
  studio(W / 2, H);
  const faces = tex(state.slab, 0, { x: 0, y: 0, w: W, h: H }, {}, Math.round(state.res * 1.25));
  const geo = rawSlabGeometry(W, H, t, 7 + state.slab);
  const mesh = new THREE.Mesh(geo, [faceMaterial(faces.map, faces.bump), edgeMaterial()]);
  mesh.castShadow = mesh.receiveShadow = true;
  const holder = new THREE.Group();
  holder.add(mesh);
  holder.position.set(0, 0.02, 0);
  holder.rotation.x = -0.07;     // leaning on an A-frame
  root.add(holder);
  const fov = 30, d = fitDistance(W, H, fov, 1.25);
  const sx = panelShift(d, fov);
  if (q.get('cam') === 'close') {
    // raking view of the upper right corner: shows gloss, matte and relief
    key.position.set(6, 1.5, 0.9);          // grazing from the right: relief shows, gloss catches
    key.target.position.set(0.4, 1.3, 0);
    key.intensity = 1.6;
    frame(new THREE.Vector3(1.55, 0.75, 1.5), new THREE.Vector3(0.45, 1.45, 0), 36);
  } else frame(new THREE.Vector3(sx + 0.35, H * 0.58, d), new THREE.Vector3(sx, H * 0.5, 0), fov);
  dimsEl.textContent = `Slab ${state.slab} of block ${BLOCK.id} · ${W.toFixed(2)} × ${H.toFixed(2)} m · ${t * 100} cm · ${FINISHES[state.finish].name.toLowerCase()}`;
}

function viewBook2() {
  const W = SLAB.h, H = SLAB.w, t = SLAB.t;   // stood on the short edge
  lights('studio');
  studio(W, H);
  const n = state.slab;
  const reg = { x: 0, y: 0, w: W, h: H };
  const a = tex(n, 0, reg, { portrait: true });
  const b = tex(n + 1, 1, reg, { portrait: true, mirrorX: true });
  const A = slabBox(W, H, t, a);
  A.position.set(-W / 2 - 0.0005, H / 2 + 0.01, t / 2);
  root.add(A);
  const pivot = new THREE.Group();
  pivot.position.set(0, 0, t);
  const B = slabBox(W, H, t, b);
  B.position.set(W / 2 + 0.0005, H / 2 + 0.01, -t / 2);
  pivot.add(B);
  root.add(pivot);
  pivot.rotation.y = state.anim ? -Math.PI : 0;
  if (state.anim) anims.push({ t0: null, delay: 350, dur: 1500, update: (k) => (pivot.rotation.y = -Math.PI * (1 - ease(k))) });
  const fov = 30, d = fitDistance(W * 2, H, fov);
  const sx = panelShift(d, fov);
  frame(new THREE.Vector3(sx + 0.3, H * 0.52, d), new THREE.Vector3(sx, H * 0.5, 0), fov);
  dimsEl.textContent = `Bookmatch ×2 · slabs ${n}–${n + 1} · each ${W.toFixed(2)} × ${H.toFixed(2)} m · panel ${(W * 2).toFixed(2)} × ${H.toFixed(2)} m`;
}

function viewBook4() {
  const W = SLAB.w, H = SLAB.h, t = SLAB.t;
  lights('studio');
  studio(W, H * 2);
  const n = state.slab;
  const reg = { x: 0, y: 0, w: W, h: H };
  const lift = H + 0.01;      // horizontal seam height above the floor
  const A = slabBox(W, H, t, tex(n, 0, reg));
  A.position.set(-W / 2 - 0.0005, lift + H / 2 + 0.0005, t / 2);
  root.add(A);
  // B: vertical hinge, top pair
  const pB = new THREE.Group();
  pB.position.set(0, lift, t);
  const B = slabBox(W, H, t, tex(n + 1, 1, reg, { mirrorX: true }));
  B.position.set(W / 2 + 0.0005, H / 2 + 0.0005, -t / 2);
  pB.add(B);
  root.add(pB);
  // C and D: horizontal hinge under the top pair
  const pC = new THREE.Group();
  pC.position.set(0, lift, t);
  const C = slabBox(W, H, t, tex(n + 2, 0, reg, { mirrorY: true }));
  C.position.set(-W / 2 - 0.0005, -H / 2 - 0.0005, -t / 2);
  const D = slabBox(W, H, t, tex(n + 3, 1, reg, { mirrorX: true, mirrorY: true }));
  D.position.set(W / 2 + 0.0005, -H / 2 - 0.0005, -t / 2);
  pC.add(C, D);
  root.add(pC);
  if (state.anim) {
    pB.rotation.y = -Math.PI;
    pC.rotation.x = -Math.PI;
    pC.visible = false;
    anims.push({ t0: null, delay: 300, dur: 1300, update: (k) => (pB.rotation.y = -Math.PI * (1 - ease(k))) });
    anims.push({ t0: null, delay: 1650, dur: 1400, update: (k) => { pC.visible = k > 0; pC.rotation.x = -Math.PI * (1 - ease(k)); } });
  }
  const fov = 30, d = fitDistance(W * 2, H * 2, fov);
  const sx = panelShift(d, fov);
  frame(new THREE.Vector3(sx + 0.4, lift * 1.0, d), new THREE.Vector3(sx, lift, 0), fov);
  dimsEl.textContent = `Bookmatch ×4 · slabs ${n}–${n + 3} · each ${W.toFixed(2)} × ${H.toFixed(2)} m · panel ${(W * 2).toFixed(2)} × ${(H * 2).toFixed(2)} m`;
}

function viewWall() {
  // quad-matched feature wall, 4.80 × 3.00 m, four quarters of 2.40 × 1.50 m
  lights('room');
  scene.background = new THREE.Color('#d9d4cc');
  const n = state.slab;
  const qw = 2.4, qh = 1.5, jt = 0.0015;
  const reg = { x: SLAB.w - qw, y: 0.2, w: qw, h: qh };
  const quarters = [
    [tex(n, 0, reg), -1, 1],
    [tex(n + 1, 1, reg, { mirrorX: true }), 1, 1],
    [tex(n + 2, 0, reg, { mirrorY: true }), -1, -1],
    [tex(n + 3, 1, reg, { mirrorX: true, mirrorY: true }), 1, -1],
  ];
  const wallZ = 0;
  const seamY = qh + 0.0;
  for (const [f, sx, sy] of quarters) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(qw - jt, qh - jt), faceMaterial(f.map, f.bump));
    m.position.set((sx * qw) / 2, seamY + (sy * qh) / 2, wallZ + 0.021);
    m.receiveShadow = true;
    root.add(m);
  }
  // wall around and floor
  const plaster = plain('#d8d2c8', 0.96);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), plaster);
  wall.position.set(0, 3, wallZ - 0.01);
  wall.receiveShadow = true;
  root.add(wall);
  const backing = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.0, 0.02), plain('#8d8a86', 0.6));
  backing.position.set(0, 1.5, wallZ + 0.01);
  root.add(backing);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), plain('#b9ab98', 0.8));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);
  // low oak bench for scale
  const oak = plain('#a07f5d', 0.6);
  const bench = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.4), oak);
  seat.position.y = 0.43;
  const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.41, 0.36), oak);
  l1.position.set(-0.9, 0.205, 0);
  const l2 = l1.clone();
  l2.position.x = 0.9;
  bench.add(seat, l1, l2);
  bench.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  bench.position.set(0.4, 0, 0.75);
  root.add(bench);
  key.position.set(-5, 6.5, 6);
  key.target.position.set(0, 1.2, 0);
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 0.5, far: 30 });
  key.shadow.camera.updateProjectionMatrix();
  const fov = 40, d = fitDistance(4.8, 3.0, fov, 1.12);
  const sx = panelShift(d, fov);
  frame(new THREE.Vector3(sx + 0.5, 1.55, d), new THREE.Vector3(sx, 1.5, 0), fov);
  dimsEl.textContent = `Feature wall · four-way match from slabs ${n}–${n + 3} · 4.80 × 3.00 m · 1 mm joints`;
}

function viewIsland() {
  lights('room');
  scene.background = new THREE.Color('#d9d4cc');
  const n = state.slab;
  const L = 1.7, Dp = 1.25, Hh = 0.92, et = 0.06;     // half length, depth, height, edge
  const reg = { x: SLAB.w - L - Hh, y: 0.3 - et, w: L + Hh, h: Dp + et };
  const A = tex(n, 0, reg, {}, Math.round(state.res * 1.25));
  const B = tex(n + 1, 1, reg, { mirrorX: true }, Math.round(state.res * 1.25));
  const uTop = Hh / (L + Hh);          // where the top begins in the left texture
  const vFront = et / (Dp + et);       // where the top begins (front edge) in v
  const matA = faceMaterial(A.map, A.bump), matB = faceMaterial(B.map, B.bump);

  // helper: plane with explicit uv corners [u0,v0,u1,v1] mapped to (left,bottom,right,top)
  const quadPlane = (w, h, uvs) => {
    const g = new THREE.PlaneGeometry(w, h);
    const uv = g.attributes.uv;
    // PlaneGeometry order: (0,1) top-left, (1,1) top-right, (0,0) bottom-left, (1,0) bottom-right
    uv.setXY(0, uvs[0][0], uvs[0][1]);
    uv.setXY(1, uvs[1][0], uvs[1][1]);
    uv.setXY(2, uvs[2][0], uvs[2][1]);
    uv.setXY(3, uvs[3][0], uvs[3][1]);
    return g;
  };
  const group = new THREE.Group();
  // tops (horizontal). After rotation.x = -PI/2: local +y points to -z (back)
  const topL = new THREE.Mesh(quadPlane(L, Dp, [[uTop, 1], [1, 1], [uTop, vFront], [1, vFront]]), matA);
  topL.rotation.x = -Math.PI / 2;
  topL.position.set(-L / 2, Hh, 0);
  const topR = new THREE.Mesh(quadPlane(L, Dp, [[0, 1], [1 - uTop, 1], [0, vFront], [1 - uTop, vFront]]), matB);
  topR.rotation.x = -Math.PI / 2;
  topR.position.set(L / 2, Hh, 0);
  // front mitred edges (vertical strips facing +z)
  const edgeL = new THREE.Mesh(quadPlane(L, et, [[uTop, vFront], [1, vFront], [uTop, 0], [1, 0]]), matA);
  edgeL.position.set(-L / 2, Hh - et / 2, Dp / 2);
  const edgeR = new THREE.Mesh(quadPlane(L, et, [[0, vFront], [1 - uTop, vFront], [0, 0], [1 - uTop, 0]]), matB);
  edgeR.position.set(L / 2, Hh - et / 2, Dp / 2);
  // waterfall ends (vertical, facing out). Left end faces -x: local +x points to +z after rotation.y = -PI/2
  const wfL = new THREE.Mesh(quadPlane(Dp, Hh, [[uTop, 1], [uTop, vFront], [0, 1], [0, vFront]]), matA);
  wfL.rotation.y = -Math.PI / 2;
  wfL.position.set(-L, Hh / 2, 0);
  const wfR = new THREE.Mesh(quadPlane(Dp, Hh, [[1 - uTop, vFront], [1 - uTop, 1], [1, vFront], [1, 1]]), matB);
  wfR.rotation.y = Math.PI / 2;
  wfR.position.set(L, Hh / 2, 0);
  // waterfall front edges (thin strips)
  const edgeMat = edgeMaterial();
  const wfeL = new THREE.Mesh(new THREE.PlaneGeometry(et, Hh), edgeMat);
  wfeL.position.set(-L + et / 2, Hh / 2, Dp / 2);
  const wfeR = wfeL.clone();
  wfeR.position.x = L - et / 2;
  // inner faces of the waterfalls and underside, cabinet body
  const body = new THREE.Mesh(new THREE.BoxGeometry(2 * L - 2 * et, Hh - et - 0.1, Dp - 0.16), plain('#4b4038', 0.5));
  body.position.set(0, 0.1 + (Hh - et - 0.1) / 2, -0.03);
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(2 * L - 2 * et - 0.08, 0.1, Dp - 0.3), plain('#191715', 0.8));
  plinth.position.set(0, 0.05, -0.06);
  const innerL = new THREE.Mesh(new THREE.BoxGeometry(et * 0.98, Hh, Dp), edgeMat);
  innerL.position.set(-L + et / 2, Hh / 2, 0);
  const innerR = innerL.clone();
  innerR.position.x = L - et / 2;
  const slabUnder = new THREE.Mesh(new THREE.BoxGeometry(2 * L, et * 0.98, Dp), edgeMat);
  slabUnder.position.set(0, Hh - et / 2, 0);
  group.add(topL, topR, edgeL, edgeR, wfL, wfR, wfeL, wfeR, body, plinth, innerL, innerR, slabUnder);
  group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  // nudge the visible faces outward so they win against the boxes behind them
  topL.position.y += 0.0008; topR.position.y += 0.0008;
  edgeL.position.z += 0.0008; edgeR.position.z += 0.0008;
  wfL.position.x -= 0.0008; wfR.position.x += 0.0008;
  root.add(group);

  // room
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), plain('#c6b8a4', 0.78));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), plain('#d9d3ca', 0.96));
  wall.position.set(0, 3, -2.6);
  wall.receiveShadow = true;
  root.add(wall);
  key.position.set(-4.5, 6, 3.5);
  key.target.position.set(0, 0.6, 0);
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 0.5, far: 25 });
  key.shadow.camera.updateProjectionMatrix();
  const fov = 30;
  const shift = innerWidth > 900 ? -0.75 : 0;
  if (q.get('cam') === 'top') { camera.up.set(0, 0, -1); frame(new THREE.Vector3(0, 9, 0), new THREE.Vector3(0, 0, 0), 30); }
  else if (q.get('cam') === 'end') frame(new THREE.Vector3(3.4, 1.5, 1.6), new THREE.Vector3(1.5, 0.6, 0), 34);
  else frame(new THREE.Vector3(1.3 + shift, 3.5, 5.7), new THREE.Vector3(0.15 + shift, 0.5, 0), fov);
  dimsEl.textContent = `Island · top ${(2 * L).toFixed(2)} × ${Dp.toFixed(2)} m, bookmatched from slabs ${n}–${n + 1} · ${et * 100} cm mitred edge · veins run over the waterfall ends`;
}

const FREEZE = q.get('k') !== null ? +q.get('k') : null;   // freeze the opening for stills
const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

// ---------- build ----------
const busy = document.getElementById('busy');
let dirty = true;
async function build() {
  window.__ready = false;
  busy.classList.add('on');
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  clearView();
  state.slab = snapStart(state.slab, need(state.view));
  const t0 = performance.now();
  ({ slab: viewSlab, book2: viewBook2, book4: viewBook4, wall: viewWall, island: viewIsland })[state.view]();
  {
    // force the GPU queue to finish so the number is honest (texture generation + first frame)
    renderer.render(scene, camera);
    const gl = renderer.getContext(), px = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
  }
  window.__buildMs = Math.round(performance.now() - t0);
  syncUI();
  busy.classList.remove('on');
  dirty = true;
  if (!anims.length) settle();
}
let settleTimer = 0;
function settle() {
  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => { window.__ready = true; }, 120);
}

// ---------- loop ----------
const pointer = new THREE.Vector2(), pointerTarget = new THREE.Vector2();
addEventListener('pointermove', (e) => {
  pointerTarget.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
});
renderer.setAnimationLoop((now) => {
  let active = false;
  for (const a of anims) {
    if (a.t0 === null) a.t0 = now + (a.delay || 0);
    let k = Math.min(1, Math.max(0, (now - a.t0) / a.dur));
    if (FREEZE !== null) { k = FREEZE; if (!a.frozen) { a.frozen = true; dirty = true; settle(); } }
    a.update(k);
    if (k < 1) active = true;
  }
  if (FREEZE !== null) active = false;
  else if (anims.length && !active) { anims = []; dirty = true; settle(); }
  const before = pointer.clone();
  pointer.lerp(pointerTarget, 0.06);
  if (pointer.distanceTo(before) > 1e-4) active = true;
  camera.position.set(camBase.x + pointer.x * 0.35, camBase.y - pointer.y * 0.18, camBase.z);
  camera.lookAt(camTarget);
  if (active || dirty) {
    renderer.render(scene, camera);
    dirty = false;
  }
});
addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight, false);
  build();
});

// ---------- UI ----------
const VIEWS = [
  ['slab', 'Single slab'],
  ['book2', 'Bookmatch ×2'],
  ['book4', 'Bookmatch ×4'],
  ['wall', 'Wall'],
  ['island', 'Island'],
];
const el = (id) => document.getElementById(id);
function buttons(container, items, key) {
  container.innerHTML = '';
  for (const [val, label, html] of items) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.val = val;
    if (html) b.innerHTML = html; else b.textContent = label;
    b.addEventListener('click', () => { state[key] = val; build(); });
    container.appendChild(b);
  }
}
buttons(el('stones'), Object.entries(STONES).map(([k, s]) => [k, s.name,
  `<span class="stone"><i class="chip" style="background:linear-gradient(135deg, ${s.base[0]} 0 55%, ${s.vein[1]} 56% 62%, ${s.base[1]} 63%)"></i>${s.name}</span>`]), 'stone');
buttons(el('views'), VIEWS, 'view');
buttons(el('finishes'), Object.entries(FINISHES).map(([k, f]) => [k, f.name]), 'finish');
el('prev').addEventListener('click', () => { const k = need(state.view); state.slab = snapStart(state.slab - 1, k, -1); build(); });
el('next').addEventListener('click', () => { const k = need(state.view); state.slab = snapStart(state.slab + 1, k, 1); build(); });
el('replay').addEventListener('click', () => { state.anim = true; build(); });
el('blk-id').textContent = BLOCK.id;
const strip = el('strip');
for (let i = 1; i <= BLOCK.count; i++) strip.appendChild(document.createElement('i'));

function syncUI() {
  for (const [id, key] of [['stones', 'stone'], ['views', 'view'], ['finishes', 'finish']]) {
    for (const b of el(id).children) b.setAttribute('aria-pressed', String(b.dataset.val === state[key]));
  }
  const k = need(state.view);
  const n = state.slab;
  el('sel-text').textContent = k === 1 ? `Slab ${n}` : `Slabs ${n}–${n + k - 1}`;
  [...strip.children].forEach((c, i) => {
    const s = i + 1;
    c.className = s >= n && s < n + k ? 'sel' : SOLD.has(s) ? 'sold' : 'free';
  });
  el('left-text').textContent = `${freeCount()} of ${BLOCK.count} slabs from this block are still available.` +
    (k > 1 ? ` These ${k} were cut one after another, so their veins line up.` : '');
  el('replay').disabled = !(state.view === 'book2' || state.view === 'book4');
}

window.__deneme = {
  set(s) { Object.assign(state, s); return build(); },
  state,
};
build();
