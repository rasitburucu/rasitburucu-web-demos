import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { CLAY, NOISE, REVEAL } from "./glsl";
import { STEP, WORLD } from "@/lib/onikitas/site";

/** Uniform objects shared by every material: one write per frame updates all. */
export const U = {
  uTime: { value: 0 },
  uReveal: { value: 0 },
  uHour: { value: 5.683 },
  uNight: { value: 0 },
  uWind: { value: 0.3 },
  uSunDir: { value: new THREE.Vector3(0, 0.1, -1) },
  uLightDir: { value: new THREE.Vector3(0, 0.1, -1) },
  uSunColor: { value: new THREE.Color() },
  uZenith: { value: new THREE.Color() },
  uHorizon: { value: new THREE.Color() },
  uStars: { value: 0 },
  uHover: { value: -1 },
  uSelected: { value: 6 },
  uSelectAmt: { value: 0 },
  uPlaster: { value: null as THREE.Texture | null },
  uPlasterN: { value: null as THREE.Texture | null },
  uTrav: { value: null as THREE.Texture | null },
  uDepth: { value: null as THREE.Texture | null },
  uWorld: { value: WORLD },
  uLeaves: { value: null as THREE.Texture | null },
  uPointer: { value: new THREE.Vector2() },
  uBeamX: { value: -1.35 },
};

const TRIPLANAR = /* glsl */ `
vec3 oki_tri(sampler2D t, vec3 p, vec3 n, float s){
  vec3 w = pow(abs(n), vec3(4.0)); w /= (w.x + w.y + w.z);
  return texture(t, p.zy * s).rgb * w.x + texture(t, p.xz * s).rgb * w.y + texture(t, p.xy * s).rgb * w.z;
}`;

// Sky colour for a direction: shared by the dome, the sea and the pools.
const SKY_FN = /* glsl */ `
uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uSunDir; uniform vec3 uSunColor; uniform float uNight;
vec3 oki_sky(vec3 d){
  float y = clamp(d.y, 0.0, 1.0);
  vec3 c = mix(uHorizon, uZenith, pow(y, 0.42));
  float sd = max(dot(d, uSunDir), 0.0);
  float up = smoothstep(-0.25, 0.05, uSunDir.y);
  c += uSunColor * (pow(sd, 7.0) * 0.28 + pow(sd, 60.0) * 0.5) * up * (1.0 - uNight);
  return c;
}`;

// ---------- Villas: clay -> limewash / travertine / wood ----------

export function villaMaterial() {
  return new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    roughness: 0.92,
    metalness: 0,
    uniforms: U,
    vertexShader: /* glsl */ `
      attribute float aKind; attribute float aVilla;
      varying float vKind; varying float vVilla; varying vec3 vWp; varying vec3 vWn;
      void main(){
        vKind = aKind; vVilla = aVilla;
        vWp = (modelMatrix * vec4(position, 1.0)).xyz;
        vWn = normalize(mat3(modelMatrix) * normal);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uPlaster; uniform sampler2D uTrav; uniform vec3 uLightDir;
      uniform float uHover; uniform float uSelected; uniform float uSelectAmt; uniform float uTime;
      varying float vKind; varying float vVilla; varying vec3 vWp; varying vec3 vWn;
      ${NOISE}${REVEAL}${CLAY}${TRIPLANAR}
      void main(){
        vec3 n = normalize(vWn);
        float ndl = max(dot(n, uLightDir), 0.0);
        float bias = ndl * 2.6 - 0.8;
        float r = oki_reveal(vWp, bias);
        float pl = oki_tri(uPlaster, vWp, n, 0.42).r;
        vec3 lime = vec3(0.905, 0.878, 0.83) * (0.84 + 0.2 * pl);
        vec3 trav = mix(vec3(0.68, 0.63, 0.55), oki_tri(uTrav, vWp, n, 0.22), 0.42);
        vec3 wood = vec3(0.26, 0.2, 0.14) * (0.8 + 0.4 * oki_noise(vWp.xz * 8.0));
        vec3 real = vKind < 0.5 ? lime : (vKind < 1.5 ? trav : wood);
        vec3 clay = OKI_CLAY * (0.985 + 0.03 * pl);
        vec3 col = mix(clay, real, r);
        float isH = 1.0 - step(0.5, abs(vVilla - uHover));
        float isS = (1.0 - step(0.5, abs(vVilla - uSelected))) * uSelectAmt;
        vec3 tile = vec3(0.71, 0.33, 0.17);
        col = mix(col, col * vec3(1.0, 0.78, 0.66), clamp(isH * 0.55 + isS * 0.5, 0.0, 0.7));
        csm_DiffuseColor = vec4(col, 1.0);
        csm_Emissive = vec3(1.0, 0.62, 0.34) * oki_edge(vWp, bias) * 1.1 + tile * (isH * 0.05 + isS * 0.035);
      }`,
  });
}

// ---------- Windows: clay openings, glass by day, lamps at night ----------

export function windowMaterial() {
  return new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    roughness: 0.18,
    metalness: 0.0,
    uniforms: U,
    vertexShader: /* glsl */ `
      attribute float aOn; attribute float aOff;
      varying float vOn; varying float vOff; varying vec3 vWp;
      void main(){ vOn = aOn; vOff = aOff; vWp = (modelMatrix * vec4(position, 1.0)).xyz; }`,
    fragmentShader: /* glsl */ `
      uniform float uHour;
      varying float vOn; varying float vOff; varying vec3 vWp;
      ${NOISE}${REVEAL}${CLAY}
      void main(){
        float r = oki_reveal(vWp, 0.0);
        vec3 col = mix(OKI_CLAY * 0.5, vec3(0.07, 0.085, 0.1), r);
        float lit = clamp(smoothstep(vOn, vOn + 0.07, uHour) + (1.0 - smoothstep(vOff - 0.06, vOff, uHour)), 0.0, 1.0);
        csm_DiffuseColor = vec4(col * (1.0 - lit * 0.8), 1.0);
        csm_Emissive = vec3(1.0, 0.6, 0.3) * lit * 3.2;
      }`,
  });
}

// ---------- Terrain: stacked contour layers -> hillside ----------

export function terrainMaterial() {
  return new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    roughness: 0.97,
    metalness: 0,
    uniforms: U,
    vertexShader: /* glsl */ `
      attribute float aStepY; attribute vec3 aStepN; attribute float aPad;
      varying vec3 vWp; varying vec3 vWn; varying float vPad; varying float vH;
      ${NOISE}${REVEAL}
      void main(){
        vec3 w0 = (modelMatrix * vec4(position, 1.0)).xyz;
        float rv = oki_reveal(w0, 0.0);
        vec3 p = position;
        p.y = mix(aStepY, position.y, rv);
        csm_Position = p;
        vec3 nn = normalize(mix(aStepN, normal, rv));
        csm_Normal = nn;
        vWp = (modelMatrix * vec4(p, 1.0)).xyz;
        vWn = nn; vPad = aPad; vH = position.y;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTrav;
      varying vec3 vWp; varying vec3 vWn; varying float vPad; varying float vH;
      ${NOISE}${REVEAL}${CLAY}
      void main(){
        vec3 n = normalize(vWn);
        float slope = 1.0 - n.y;
        vec2 tp = mix(vWp.xz, vec2(vWp.x + vWp.z, vWp.y * 1.4), smoothstep(0.3, 0.65, slope));
        float n1 = oki_fbm(vWp.xz * 0.07);
        float n2 = oki_noise(tp * 0.55);
        float n3 = oki_noise(tp * 2.6);
        // clay: plaster board, a hairline where each contour layer ends
        float ph = fract(vH / ${STEP.toFixed(3)});
        float line = 1.0 - smoothstep(0.0, 0.045, min(ph, 1.0 - ph));
        vec3 clay = OKI_CLAY * (0.975 + 0.035 * n3) * (1.0 - line * 0.07 * (1.0 - vPad));
        // real: dry grass, maquis, limestone
        vec3 dry = vec3(0.36, 0.31, 0.21);
        vec3 maquis = vec3(0.12, 0.145, 0.085);
        vec3 rock = vec3(0.5, 0.48, 0.43);
        vec3 real = mix(dry, maquis, smoothstep(0.3, 0.55, n1 + 0.18 * (n2 - 0.5)));
        real = mix(real, rock, smoothstep(0.3, 0.55, slope + (n2 - 0.5) * 0.35));
        real = mix(real, vec3(0.6, 0.56, 0.48), 1.0 - smoothstep(0.35, 1.9, vH));
        vec3 trav = mix(vec3(0.64, 0.6, 0.52), texture(uTrav, vWp.xz * 0.12).rgb, 0.4);
        float top = smoothstep(0.86, 0.985, vPad) * smoothstep(0.22, 0.08, slope);
        float wall = smoothstep(0.3, 0.55, vPad) * (1.0 - top) * smoothstep(0.4, 0.62, slope);
        // dry-stone courses, like the terrace walls of the peninsula
        vec2 sc = vec2((vWp.x + vWp.z) * 2.3, vWp.y * 3.6);
        float row = floor(sc.y);
        vec2 cell = vec2(floor(sc.x + oki_hash(vec2(row, 3.0)) * 3.0), row);
        vec2 f = fract(vec2(sc.x + oki_hash(vec2(row, 3.0)) * 3.0, sc.y));
        float joint = smoothstep(0.0, 0.12, min(min(f.x, 1.0 - f.x) * 1.6, min(f.y, 1.0 - f.y)));
        vec3 stone = mix(vec3(0.44, 0.41, 0.36), vec3(0.58, 0.55, 0.48), oki_hash(cell)) * mix(0.8, 1.0, joint);
        real = mix(real, stone, wall);
        real = mix(real, trav, top);
        real *= (0.86 + 0.28 * n3) * mix(0.88, 1.0, wall);
        float r = oki_reveal(vWp, 0.0);
        csm_DiffuseColor = vec4(mix(clay, real, r), 1.0);
        csm_Emissive = vec3(1.0, 0.6, 0.32) * oki_edge(vWp, 0.0) * 0.85;
      }`,
  });
}

// ---------- Olive trees (instanced): model lollipops -> silver-green olives ----------

export function treeMaterial() {
  return new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    roughness: 0.9,
    metalness: 0,
    uniforms: U,
    vertexShader: /* glsl */ `
      uniform float uTime; uniform float uWind;
      varying vec3 vWp; varying float vK; varying float vLocalY; varying float vGust;
      void main(){
        vec4 base = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        vK = fract(sin(dot(base.xz, vec2(12.9898, 78.233))) * 43758.5453);
        float g = sin(uTime * 1.1 + base.x * 0.21 + base.z * 0.17) * 0.5 + 0.5;
        float flutter = sin(uTime * 4.3 + vK * 30.0 + position.y * 3.0);
        float bend = max(position.y - 0.5, 0.0);
        vec3 p = position;
        p.x += (g * 0.9 + flutter * 0.08) * uWind * 0.16 * bend;
        p.z += (g * 0.4 + flutter * 0.06) * uWind * 0.08 * bend;
        csm_Position = p;
        vGust = g * uWind;
        vLocalY = position.y;
        vWp = (modelMatrix * instanceMatrix * vec4(p, 1.0)).xyz;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vWp; varying float vK; varying float vLocalY; varying float vGust;
      ${NOISE}${REVEAL}${CLAY}
      void main(){
        float r = oki_reveal(vWp, 0.0);
        vec3 leaf = mix(vec3(0.15, 0.17, 0.11), vec3(0.28, 0.3, 0.22), vK);
        // olive leaves turn their silver undersides in the wind
        float silver = smoothstep(0.55, 0.95, oki_noise(vWp.xz * 1.7 + vGust * 3.0)) * vGust;
        leaf = mix(leaf, vec3(0.5, 0.52, 0.46), silver * 0.8);
        vec3 bark = vec3(0.12, 0.1, 0.08);
        vec3 real = vLocalY < 0.62 ? bark : leaf;
        vec3 clay = OKI_CLAY * (vLocalY < 0.62 ? 0.8 : 0.97);
        csm_DiffuseColor = vec4(mix(clay, real, r), 1.0);
      }`,
  });
}

// ---------- Sea and pools ----------

export function waterMaterial(pool: boolean) {
  return new THREE.ShaderMaterial({
    uniforms: { ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog), ...U, uPool: { value: pool ? 1 : 0 } },
    fog: true,
    vertexShader: /* glsl */ `
      #include <common>
      #include <fog_pars_vertex>
      varying vec3 vWp;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWp = wp.xyz;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */ `
      #include <common>
      #include <fog_pars_fragment>
      uniform float uTime; uniform float uPool; uniform sampler2D uDepth; uniform float uWorld; uniform vec3 uLightDir;
      varying vec3 vWp;
      ${NOISE}${REVEAL}${CLAY}${SKY_FN}
      vec2 waveGrad(vec2 p){
        float e = 0.06;
        float a = oki_noise(p), b = oki_noise(p + vec2(e, 0.0)), c = oki_noise(p + vec2(0.0, e));
        return vec2(b - a, c - a) / e;
      }
      void main(){
        vec3 V = normalize(cameraPosition - vWp);
        float dist = length(cameraPosition - vWp);
        float s = uPool > 0.5 ? 2.2 : 0.55;
        vec2 g = waveGrad(vWp.xz * s + vec2(uTime * 0.13, uTime * 0.07)) * 0.6
               + waveGrad(vWp.xz * s * 2.7 - vec2(uTime * 0.09, -uTime * 0.16)) * 0.35;
        float amp = (uPool > 0.5 ? 0.05 : 0.11) / (1.0 + dist * 0.012);
        vec3 N = normalize(vec3(-g.x * amp, 1.0, -g.y * amp));
        float fres = 0.02 + 0.98 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
        vec3 R = reflect(-V, N);
        vec3 sky = oki_sky(R);
        vec2 uv = vWp.xz / uWorld + 0.5;
        float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
        float depth = uPool > 0.5 ? 0.25 : mix(1.0, texture(uDepth, uv).r, inside);
        vec3 shallow = uPool > 0.5 ? vec3(0.05, 0.3, 0.34) : vec3(0.05, 0.28, 0.3);
        vec3 deep = vec3(0.012, 0.05, 0.075);
        vec3 body = mix(shallow, deep, smoothstep(0.0, 0.65, depth));
        float day = 1.0 - uNight;
        body *= 0.12 + 0.88 * day * clamp(uLightDir.y * 2.5 + 0.35, 0.0, 1.0);
        vec3 col = mix(body, sky, fres * (uPool > 0.5 ? 0.6 : 0.85));
        float spec = pow(max(dot(R, uLightDir), 0.0), uPool > 0.5 ? 180.0 : 320.0);
        col += uSunColor * spec * (uPool > 0.5 ? 1.2 : 2.4) * mix(1.0, 0.35, uNight);
        // foam where the sea touches the rocks
        float shore = (1.0 - smoothstep(0.0, 0.05, depth)) * inside * (1.0 - uPool);
        col = mix(col, vec3(0.8, 0.82, 0.8) * (0.4 + 0.6 * day), shore * smoothstep(0.35, 0.7, oki_noise(vWp.xz * 1.4 + uTime * 0.3)));
        // clay: a flat plaster base, lit softly by the low sun
        vec3 acrylic = vec3(0.5, 0.58, 0.64) * (0.78 + 0.22 * clamp(uLightDir.y * 3.0, 0.0, 1.0));
        vec3 clay = mix(acrylic, sky, fres * 0.55) + uSunColor * spec * 0.6;
        if (uPool > 0.5) clay = OKI_CLAY * 0.95;
        float r = oki_reveal(vWp, 0.0);
        gl_FragColor = vec4(mix(clay, col, r), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  });
}

// ---------- Sky dome ----------

export function skyMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: U,
    side: THREE.BackSide,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main(){
        vDir = normalize((modelMatrix * vec4(position, 1.0)).xyz - cameraPosition);
        vec4 p = projectionMatrix * viewMatrix * vec4((modelMatrix * vec4(position, 1.0)).xyz, 1.0);
        gl_Position = p.xyww;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uStars; uniform float uTime;
      varying vec3 vDir;
      ${NOISE}${SKY_FN}
      void main(){
        vec3 d = normalize(vDir);
        vec3 c = oki_sky(d);
        // sun disc
        float sd = dot(d, uSunDir);
        c += uSunColor * smoothstep(0.9993, 0.9997, sd) * 6.0 * (1.0 - uNight) * step(0.0, uSunDir.y + 0.02);
        // stars
        if (uStars > 0.0) {
          vec3 q = d * 380.0;
          vec2 cell = floor(q.xy + q.z * 1.37);
          float h = oki_hash(cell);
          float tw = 0.6 + 0.4 * sin(uTime * 2.0 + h * 50.0);
          float star = step(0.9972, h) * tw * smoothstep(0.02, 0.25, d.y);
          c += vec3(0.85, 0.9, 1.0) * star * uStars * 1.6;
        }
        // grain against banding
        c += (oki_hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
}

// ---------- Limewash wall with olive-leaf shadows (the opening) ----------

export function wallMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: /* glsl */ `
      varying vec2 vP; varying vec3 vN; varying vec3 vWp;
      void main(){
        vP = position.xy;
        vN = normal;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWp = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uPlaster; uniform sampler2D uPlasterN; uniform sampler2D uLeaves;
      uniform float uTime; uniform vec2 uPointer; uniform vec3 uSunColor; uniform vec3 uZenith; uniform float uBeamX;
      varying vec2 vP; varying vec3 vN; varying vec3 vWp;
      ${NOISE}
      void main(){
        vec2 uv = vP * 0.34;
        float pl = texture(uPlaster, uv).r;
        vec3 nt = texture(uPlasterN, uv).xyz * 2.0 - 1.0;
        // face normal in wall space is +z; the reveal faces keep their own shading
        float face = step(0.5, abs(vN.z));
        vec3 n = normalize(vec3(nt.xy * 1.6, 1.0));
        // grazing morning light from the upper left, nudged by the pointer
        vec3 L = normalize(vec3(-0.78 + uPointer.x * 0.12, 0.42 + uPointer.y * 0.08, 0.46));
        float diff = max(dot(n, L), 0.0);
        // light patch from an unseen opening, skewed like a real sunbeam
        vec2 q = vP - vec2(uBeamX + uPointer.x * 0.18, 0.15 + uPointer.y * 0.1);
        q.x += q.y * 0.42;
        float beam = smoothstep(1.75, 1.35, abs(q.x)) * smoothstep(1.55, 1.1, abs(q.y));
        // olive leaves: two layers, the far one softer, both moving in the breeze
        float t = uTime;
        vec2 sway = vec2(sin(t * 0.7 + vP.y * 1.3), cos(t * 0.53 + vP.x)) * 0.012 + vec2(oki_noise(vP * 0.8 + t * 0.35) - 0.5) * 0.02;
        vec2 lu = vP * 0.2 + vec2(0.55, 0.5) + sway + uPointer * 0.015;
        float near = texture(uLeaves, lu).r;
        float far = texture(uLeaves, lu * 0.72 + vec2(0.21, 0.08) - sway * 0.6).g;
        float shade = mix(1.0, 0.18, near) * mix(1.0, 0.55, far);
        vec3 lime = vec3(0.93, 0.905, 0.86) * (0.86 + 0.18 * pl);
        vec3 amb = mix(vec3(0.46, 0.5, 0.57), uZenith * 1.1, 0.35) * (0.62 + 0.18 * diff);
        vec3 sun = uSunColor * vec3(1.0, 0.93, 0.85) * beam * shade * (0.55 + 0.9 * diff) * 1.25;
        vec3 col = lime * (amb + sun);
        // the window reveal (thickness): deeper, cooler
        col = mix(col * vec3(0.72, 0.75, 0.8), col, face);
        col += (oki_hash(gl_FragCoord.xy + t) - 0.5) / 255.0;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
}
