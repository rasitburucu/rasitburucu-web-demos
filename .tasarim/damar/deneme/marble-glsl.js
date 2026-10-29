// Damar — kitap açılımı denemesi: prosedürel mermer (tek kaynak).
// Bir blok 3B gürültü hacmi olarak düşünülür; her plaka bu hacmin z derinliğindeki bir dilimidir.
// Ardışık plakalar yalnız testere payı (kerf) kadar farklı derinlikten gelir, bu yüzden aynalanınca
// neredeyse birebir eşleşir. Bu dosya hem three.js denemesinde hem yön maketlerinde kullanılır.
//
// Simplex noise: Ian McEwan, Ashima Arts — webgl-noise, MIT lisansı
// https://github.com/ashima/webgl-noise (Stefan Gustavson ile). Kod matematikten yeniden yazıldı.

export const MARBLE_VERT = /* glsl */ `
precision highp float;
in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const MARBLE_FRAG = /* glsl */ `
precision highp float;
precision highp int;
in vec2 vUv;
out vec4 fragColor;

uniform vec2  uSize;     // metres covered by this texture (w, h)
uniform vec2  uOffset;   // where that area starts on the slab, metres
uniform float uZ;        // depth of the visible face inside the block, metres
uniform float uSeed;     // block id
uniform float uPxPerM;   // texture pixels per metre (line widths are physical)
uniform vec2  uMirror;   // -1 flips that axis (book-match)
uniform float uPortrait; // 1: slab stood on its short edge (veins follow the long side)
uniform vec2  uSlab;     // full slab size, metres (for portrait rotation)
uniform int   uMode;     // 0 colour, 1 height (antiqued finish relief)
uniform float uEncode;   // 1: write sRGB bytes (plain canvas), 0: write linear (sRGB render target)

uniform vec3 uBase0;
uniform vec3 uBase1;
uniform vec3 uBase2;
uniform vec3 uVeinA;
uniform vec3 uVeinB;
uniform vec3 uVeinC;
uniform vec3 uHalo;
uniform vec4 uFlow;   // angle(rad), lines per metre, share of lines that exist, warp (m)
uniform vec4 uFlow2;  // cross family: angle, lines per metre, share, width scale
uniform vec4 uWidth;  // main min mm, main max mm, secondary mm, hairline mm
uniform vec4 uAmt;    // secondary, hairline, halo, deep veins
uniform vec4 uCloud;  // cloud scale (1/m), cloud contrast, tint share, grain
uniform vec4 uFinish; // lift, desaturate, contrast cut, cross-vein strength
uniform vec4 uLayer;  // medium lines x, fine lines x, meander (m), jag

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p, int oct) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 6; i++) {
    if (i >= oct) break;
    s += a * snoise(p);
    p = p * 2.03 + vec3(1.7, 9.2, 3.1);
    a *= 0.5;
  }
  return s;
}

float hash11(float n) { return fract(sin(n * 0.1031 + 17.13) * 43758.5453123); }

// Veins are level sets of a warped linear field: long, open lines (no closed loops).
float flowField(vec3 w, float ang, float perM, float meander, float jag, float salt) {
  vec2 dir = vec2(cos(ang), sin(ang));
  return dot(w.xy, dir) * perM
       + meander * perM * fbm(w * 0.5 + vec3(13.0 + salt, 4.0, 0.0), 3)
       + jag * perM * (abs(snoise(w * 0.8 + vec3(salt, 2.0, 0.0))) - 0.35)
       + 0.06 * jag * perM * snoise(w * 4.0 + vec3(salt, 7.0, 0.0));
}

// Lines at the integer levels of f. x: crisp coverage, y: distance to the line centre in px
// (1e6 when that line is absent), z: presence 0..1, w: line id
vec4 veinLines(float f, vec3 w, float share, float wmin, float wmax, float salt) {
  float id = floor(f + 0.5);
  float fr = f - id;
  float presence = smoothstep(-0.55, 0.45, snoise(vec3(w.xy * 0.6, id * 1.93 + salt)));
  float exists = step(1.0 - share, hash11(id * 12.9898 + uSeed * 3.7 + salt));
  float dpx = abs(fr) / max(fwidth(f), 1e-6);
  float along = snoise(vec3(w.xy * 1.7, uZ * 1.2 + id * 3.17 + salt));
  // fine detail changes quickly with depth: two slabs a saw-cut apart are twins, not copies
  float along2 = snoise(vec3(w.xy * 5.3, uZ * 60.0 + id * 1.31 + salt));
  float wmm = mix(wmin, wmax, pow(hash11(id * 78.233 + uSeed + salt), 1.6))
            * presence * (0.2 + 0.8 * smoothstep(-0.8, 0.8, along)) * (0.75 + 0.35 * along2);
  float hw = wmm * 0.0005 * uPxPerM;
  float soft = 0.8 + 1.6 * smoothstep(-0.6, 0.8, along2);            // photographic, not vector-sharp
  float cov = exists * (1.0 - smoothstep(max(hw - 0.5 * soft, 0.0), hw + soft, dpx)) * step(0.05, wmm);
  cov *= smoothstep(0.0, 0.9, hw + 0.35);                            // sub-pixel lines fade instead of aliasing
  return vec4(cov, exists > 0.5 ? dpx : 1e6, exists * presence, id);
}

vec3 toSRGB(vec3 c) {
  c = max(c, 0.0);
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(vec3(0.0031308), c));
}

void main() {
  vec2 uv = vUv;
  if (uMirror.x < 0.0) uv.x = 1.0 - uv.x;
  if (uMirror.y < 0.0) uv.y = 1.0 - uv.y;
  vec2 m = uOffset + uv * uSize;              // metres on the slab face
  if (uPortrait > 0.5) m = vec2(m.y, uSlab.y - m.x);  // veins follow the long side
  vec3 p = vec3(m, uZ);

  // Domain warp: geological folding. z is not warped so neighbouring slabs stay alike.
  vec3 sp = p * 0.8 + vec3(0.0, 0.0, uSeed * 1.37);
  vec2 q = vec2(fbm(sp, 4), fbm(sp + vec3(5.2, 1.3, 2.8), 4));
  vec2 r = vec2(fbm(sp * 1.9 + vec3(q * 1.6, 0.0) + vec3(1.7, 9.2, 0.0), 3),
                fbm(sp * 1.9 + vec3(q * 1.6, 0.0) + vec3(8.3, 2.8, 0.0), 3));
  vec3 w = vec3(p.xy + (q * 0.75 + r * 0.35) * uFlow.w, p.z);

  if (uMode == 1) {
    // Antiqued relief: soft undulation, small pits, softer vein matter eroded a little deeper.
    float und = fbm(vec3(m * 14.0, uZ * 5.0), 4);
    float pit = smoothstep(0.62, 0.9, snoise(vec3(m * 240.0, uZ * 240.0)));
    vec4 v1 = veinLines(flowField(w, uFlow.x, uFlow.y, uLayer.z, uLayer.w, 0.0), w, uFlow.z, uWidth.x, uWidth.y, 0.0);
    float h = 0.5 + 0.28 * und - 0.32 * pit - 0.22 * v1.x;
    fragColor = vec4(vec3(clamp(h, 0.0, 1.0)), 1.0);
    return;
  }

  // Base: smoky clouds, streaks that follow the vein direction, a broad tint.
  vec2 dirA = vec2(cos(uFlow.x), sin(uFlow.x));
  vec2 st = vec2(dot(w.xy, vec2(-dirA.y, dirA.x)), dot(w.xy, dirA));   // along, across the veins
  float cl = fbm(w * uCloud.x + vec3(50.0, 0.0, 0.0), 5);
  float cl2 = fbm(vec3(st.x * 0.45, st.y * 2.4, w.z) * uCloud.x * 1.6 + vec3(31.0 + cl, 0.0, 0.0), 5);
  float tn = fbm(w * uCloud.x * 0.42 + vec3(80.0, 3.0, 0.0), 4);
  vec3 col = mix(uBase0, uBase1, smoothstep(-0.6, 0.7, (0.7 * cl + 0.6 * cl2) * uCloud.y));
  float dark = smoothstep(0.25, 0.75, fbm(w * uCloud.x * 0.7 + vec3(140.0, 0.0, 0.0), 4) + 0.3 * cl2);
  col = mix(col, uBase1 * 0.93, 0.35 * dark);
  col = mix(col, uBase2, uCloud.z * smoothstep(0.05, 0.6, tn));

  // Deep (subsurface) veins: wide, soft, faint.
  float fd = flowField(w + vec3(0.21, -0.13, 0.0), uFlow.x + 0.18, uFlow.y * 0.75, uLayer.z, uLayer.w * 0.5, 41.0);
  vec4 dv = veinLines(fd, w, 0.6, 10.0, 30.0, 41.0);
  float deep = min(dv.z, 1.0) * exp(-dv.y / (0.018 * uPxPerM + 1.0));
  col = mix(col, mix(uHalo, uVeinB, 0.3), uAmt.w * deep);

  // Dominant veins.
  float f1 = flowField(w, uFlow.x, uFlow.y, uLayer.z, uLayer.w, 0.0);
  vec4 v1 = veinLines(f1, w, uFlow.z, uWidth.x, uWidth.y, 0.0);
  // Feathered, patchy smoke beside them.
  float smokeW = (0.012 + 0.04 * smoothstep(-0.3, 0.7, snoise(vec3(w.xy * 1.6, v1.w)))) * uPxPerM;
  float patchy = smoothstep(-0.5, 0.45, snoise(vec3(w.xy * 2.4, v1.w * 2.1 + 5.0)));
  float smoke = v1.z * exp(-pow(v1.y / smokeW, 1.25)) * patchy;
  col = mix(col, mix(uHalo, uVeinB, 0.22), uAmt.z * smoke);

  // Bundles: thin lines running alongside the dominant veins.
  float nearA = exp(-(min(v1.y, 1e5) / uPxPerM) / 0.07);
  vec4 vb = veinLines(f1 * uLayer.x, w, 0.85 * nearA * patchy, uWidth.z * 0.5, uWidth.z * 1.6, 57.0);

  // Cross family (net-like stones).
  float f2 = flowField(w + vec3(0.37, 0.11, 0.0), uFlow2.x, uFlow2.y, uLayer.z * 0.8, uLayer.w, 23.0);
  vec4 v2 = veinLines(f2, w, uFlow2.z, uWidth.x * uFlow2.w, uWidth.y * uFlow2.w, 23.0);
  float smoke2 = v2.z * exp(-pow(v2.y / (0.016 * uPxPerM + 1.0), 1.25));
  col = mix(col, uHalo, uAmt.z * 0.6 * smoke2 * uFinish.w);

  // Ghost network: the medium field drawn wide and faint, gives the cloudy marbled look.
  float fg = flowField(w + vec3(-0.43, 0.27, 0.0), uFlow.x - 0.3, uFlow.y * 1.6, uLayer.z, uLayer.w, 113.0);
  vec4 vg = veinLines(fg, w, 0.55, 2.0, 8.0, 113.0);
  float ghost = min(vg.z, 1.0) * exp(-pow(vg.y / (0.02 * uPxPerM + 1.0), 1.1));
  col = mix(col, mix(uBase2, uHalo, 0.5), 0.45 * uAmt.w * ghost);

  // Medium veins at their own angle: fill the space between the dominant ones.
  vec3 wd = vec3(w.xy, w.z * 25.0);   // depth-sensitive copy for the smaller veins
  float f3 = flowField(wd + vec3(0.29, -0.31, 0.0), uFlow.x - 0.45, uFlow.y * 2.2, uLayer.z * 0.8, uLayer.w * 1.2, 97.0);
  vec4 v3 = veinLines(f3, wd, 0.38, uWidth.z * 0.8, uWidth.z * 4.0, 97.0);
  float smoke3 = v3.z * exp(-pow(v3.y / (0.007 * uPxPerM + 1.0), 1.2));
  col = mix(col, uHalo, uAmt.z * 0.5 * smoke3);

  // Fine feathery lines across the whole slab.
  float f4 = flowField(wd + vec3(-0.11, 0.07, 0.0), uFlow.x - 0.1, uFlow.y * uLayer.y, uLayer.z * 0.7, uLayer.w * 0.6, 71.0);
  vec4 v4 = veinLines(f4, wd, 0.16, uWidth.w * 0.6, uWidth.w * 2.0, 71.0);

  col = mix(col, uVeinC, uAmt.y * v4.x);
  col = mix(col, mix(uVeinB, uVeinA, 0.3), uAmt.x * vb.x);
  col = mix(col, mix(uVeinB, uVeinC, 0.5), uAmt.x * 0.85 * v3.x);
  float tone2 = smoothstep(-0.4, 0.6, snoise(vec3(w.xy * 1.4, v2.w * 3.3)));
  col = mix(col, mix(uVeinB, uVeinA, tone2), v2.x * uFinish.w);
  float tone1 = smoothstep(-0.5, 0.6, snoise(vec3(w.xy * 1.3, v1.w * 1.7)));
  float bodyW = (0.002 + 0.006 * smoothstep(-0.2, 0.8, snoise(vec3(w.xy * 2.7, v1.w + 9.0)))) * uPxPerM + 1.0;
  float body = v1.z * exp(-pow(v1.y / bodyW, 2.0)) * (0.35 + 0.4 * patchy);
  col = mix(col, mix(uVeinB, uHalo, 0.35), body);
  col = mix(col, mix(uVeinA, uVeinB, tone1), v1.x);

  // Calcite grain.
  float gr = 0.6 * snoise(vec3(m * 520.0, uZ * 520.0)) + 0.4 * snoise(vec3(m * 1300.0, uZ * 1300.0 + 3.0));
  col *= 1.0 + uCloud.w * gr;

  // Surface finish: honed and antiqued stone reads lighter and flatter than polished.
  vec3 s = pow(max(col, 0.0), vec3(1.0 / 2.2));
  float l = dot(s, vec3(0.299, 0.587, 0.114));
  s = mix(vec3(l), s, 1.0 - uFinish.y);
  s = (s - 0.5) * (1.0 - uFinish.z) + 0.5 + uFinish.x;
  col = pow(max(s, 0.0), vec3(2.2));

  fragColor = vec4(uEncode > 0.5 ? toSRGB(col) : col, 1.0);
}
`;

// sRGB hex → linear rgb
export function lin(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const x = v / 255;
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return c;
}

const D = Math.PI / 180;

// Fictional stones (names are invented; colours tuned by eye, not measured).
export const STONES = {
  eflatun: {
    name: 'Eflatun',
    note: 'white ground, lilac to violet veining',
    seed: 4.12,
    base: ['#E9E6E9', '#D8D2DA', '#CBBDD0'],
    vein: ['#5C4867', '#8F749C', '#A897B0'],
    halo: '#C4B1CC',
    flow: [32 * D, 0.9, 0.6, 0.5],
    flow2: [-50 * D, 0.8, 0.55, 0.6],
    width: [1.5, 10.0, 0.7, 0.25],
    amt: [0.6, 0.35, 0.7, 0.45],
    cloud: [0.9, 1.1, 0.5, 0.018],
    layer: [26.0, 7.0, 0.35, 0.10],
    cross: 0.8,
  },
  duman: {
    name: 'Duman',
    note: 'smoke grey, white veins',
    seed: 7.31,
    base: ['#858990', '#73777E', '#666A72'],
    vein: ['#E6E7E6', '#C6C8CA', '#AEB2B6'],
    halo: '#9EA2A8',
    flow: [-24 * D, 0.8, 0.6, 0.6],
    flow2: [40 * D, 0.5, 0.3, 0.4],
    width: [1.0, 6.0, 0.6, 0.25],
    amt: [0.55, 0.4, 0.55, 0.4],
    cloud: [0.8, 1.1, 0.35, 0.02],
    layer: [30.0, 8.0, 0.3, 0.12],
    cross: 0.5,
  },
  sirma: {
    name: 'Sırma',
    note: 'warm white, gold and taupe veins',
    seed: 2.57,
    base: ['#F1EEE8', '#E6E1D8', '#DCD2C2'],
    vein: ['#6A645D', '#A28A63', '#B9AFA2'],
    halo: '#E0CDAA',
    flow: [58 * D, 1.15, 0.5, 0.55],
    flow2: [-28 * D, 0.7, 0.35, 0.45],
    width: [1.5, 15.0, 0.7, 0.25],
    amt: [0.55, 0.3, 0.75, 0.45],
    cloud: [0.7, 1.0, 0.45, 0.014],
    layer: [24.0, 6.0, 0.22, 0.2],
    cross: 0.5,
  },
  kiragi: {
    name: 'Kırağı',
    note: 'near white, feathery grey veins',
    seed: 9.04,
    base: ['#E6E7E6', '#D6D8DA', '#C8CCD1'],
    vein: ['#7C838C', '#98A0A8', '#AEB4BB'],
    halo: '#C2C7CC',
    flow: [12 * D, 1.3, 0.5, 0.5],
    flow2: [70 * D, 1.0, 0.15, 0.4],
    width: [0.6, 4.0, 0.5, 0.22],
    amt: [0.65, 0.5, 0.6, 0.5],
    cloud: [1.1, 1.1, 0.55, 0.016],
    layer: [34.0, 9.0, 0.3, 0.06],
    cross: 0.35,
  },
};

export const FINISHES = {
  polished: { name: 'Polished', tr: 'Cilalı', lift: 0.0, desat: 0.0, contrast: 0.0, roughness: 0.06 },
  honed: { name: 'Honed', tr: 'Honlu', lift: 0.045, desat: 0.16, contrast: 0.2, roughness: 0.55 },
  antiqued: { name: 'Antiqued', tr: 'Eskitme', lift: 0.025, desat: 0.12, contrast: 0.14, roughness: 0.72 },
};

// Slab and block geometry (example values)
export const SLAB = { w: 3.2, h: 1.9, t: 0.02, kerf: 0.005 };

// Depth of the face that shows when slab `i` of the block is laid face up (side 0) or flipped (side 1).
export function faceDepth(i, side) {
  const pitch = SLAB.t + SLAB.kerf;
  return side === 0 ? i * pitch + SLAB.t : i * pitch;
}

// Uniform values for a texture request.
// req: { stone, finish, slab, side, region:{x,y,w,h}, mirrorX, mirrorY, portrait, pxPerM, mode }
export function uniformValues(req) {
  const s = STONES[req.stone];
  const f = FINISHES[req.finish || 'polished'];
  const reg = req.region || { x: 0, y: 0, w: SLAB.w, h: SLAB.h };
  return {
    uSize: [reg.w, reg.h],
    uOffset: [reg.x, reg.y],
    uZ: faceDepth(req.slab || 0, req.side || 0) + (req.zOffset || 0),
    uSeed: s.seed,
    uPxPerM: req.pxPerM,
    uMirror: [req.mirrorX ? -1 : 1, req.mirrorY ? -1 : 1],
    uPortrait: req.portrait ? 1 : 0,
    uSlab: [SLAB.w, SLAB.h],
    uMode: req.mode || 0,
    uEncode: req.encode ? 1 : 0,
    uBase0: lin(s.base[0]),
    uBase1: lin(s.base[1]),
    uBase2: lin(s.base[2]),
    uVeinA: lin(s.vein[0]),
    uVeinB: lin(s.vein[1]),
    uVeinC: lin(s.vein[2]),
    uHalo: lin(s.halo),
    uFlow: s.flow,
    uFlow2: s.flow2,
    uWidth: s.width,
    uAmt: s.amt,
    uCloud: s.cloud,
    uFinish: [f.lift, f.desat, f.contrast, s.cross],
    uLayer: s.layer,
  };
}
