import * as THREE from "three";

// The day's light, keyed by hour. Extends the Kireç palette (limewash, travertine,
// olive-shadow, deep Aegean, terracotta) into dawn, golden hour and night.

type Key = {
  h: number;
  zenith: string;
  horizon: string;
  sun: string;
  sunI: number;
  sky: string;
  ground: string;
  hemiI: number;
  stars: number;
};

const KEYS: Key[] = [
  { h: 5.0, zenith: "#1f2c3a", horizon: "#6e6a74", sun: "#ff9e7a", sunI: 0.0, sky: "#56647a", ground: "#3a3630", hemiI: 0.35, stars: 0.6 },
  { h: 5.683, zenith: "#50657b", horizon: "#e9c2a6", sun: "#ffb088", sunI: 1.9, sky: "#9aa8bc", ground: "#7d7064", hemiI: 0.7, stars: 0.12 },
  { h: 6.5, zenith: "#7086a0", horizon: "#ecd2bc", sun: "#ffc89e", sunI: 3.0, sky: "#b3c0cf", ground: "#9a8c7c", hemiI: 0.78, stars: 0 },
  { h: 8.0, zenith: "#83a0b8", horizon: "#e9e1d4", sun: "#ffead2", sunI: 3.6, sky: "#c3cfda", ground: "#a89b88", hemiI: 0.66, stars: 0 },
  { h: 12.0, zenith: "#779cb8", horizon: "#ebe9e3", sun: "#fff8ee", sunI: 3.7, sky: "#c8d3dd", ground: "#ada08c", hemiI: 0.6, stars: 0 },
  { h: 16.0, zenith: "#7e9db5", horizon: "#ede3d3", sun: "#ffecd6", sunI: 3.6, sky: "#c4cdd4", ground: "#ab9b80", hemiI: 0.64, stars: 0 },
  { h: 18.4, zenith: "#7a8ea0", horizon: "#f2cda0", sun: "#ffc482", sunI: 3.4, sky: "#c0bfbd", ground: "#a88c6c", hemiI: 0.74, stars: 0 },
  { h: 19.667, zenith: "#66758a", horizon: "#f4ad70", sun: "#ff9a58", sunI: 4.4, sky: "#c4b0a6", ground: "#a87858", hemiI: 0.82, stars: 0 },
  { h: 20.4, zenith: "#223a50", horizon: "#86646a", sun: "#c86c4c", sunI: 0.3, sky: "#56647a", ground: "#3e343a", hemiI: 0.5, stars: 0.45 },
  { h: 21.5, zenith: "#0b1620", horizon: "#1e3442", sun: "#a6bcd6", sunI: 0.5, sky: "#304560", ground: "#1a1e22", hemiI: 0.34, stars: 1 },
];

type Parsed = {
  h: number;
  c: Record<"zenith" | "horizon" | "sun" | "sky" | "ground", THREE.Color>;
  sunI: number;
  hemiI: number;
  stars: number;
};

const parsed: Parsed[] = KEYS.map((k) => ({
  h: k.h,
  c: {
    zenith: new THREE.Color(k.zenith),
    horizon: new THREE.Color(k.horizon),
    sun: new THREE.Color(k.sun),
    sky: new THREE.Color(k.sky),
    ground: new THREE.Color(k.ground),
  },
  sunI: k.sunI,
  hemiI: k.hemiI,
  stars: k.stars,
}));

export type Light = {
  zenith: THREE.Color;
  horizon: THREE.Color;
  sun: THREE.Color;
  sky: THREE.Color;
  ground: THREE.Color;
  sunI: number;
  hemiI: number;
  stars: number;
  /** Where the sun disc is (may be below the horizon). */
  sunDir: THREE.Vector3;
  /** Direction the shadow-casting light comes from (sun, then moon). */
  lightDir: THREE.Vector3;
  /** 0 day .. 1 full night. */
  night: number;
};

export function createLight(): Light {
  return {
    zenith: new THREE.Color(),
    horizon: new THREE.Color(),
    sun: new THREE.Color(),
    sky: new THREE.Color(),
    ground: new THREE.Color(),
    sunI: 0,
    hemiI: 0,
    stars: 0,
    sunDir: new THREE.Vector3(),
    lightDir: new THREE.Vector3(),
    night: 0,
  };
}

const RISE = 5.85;
const SET = 20.25;
const MAX_ELEV = THREE.MathUtils.degToRad(62);
const MOON = new THREE.Vector3(0.55, 0.62, 0.4).normalize();
const tmp = new THREE.Vector3();

function dirFrom(az: number, el: number, out: THREE.Vector3) {
  // az measured from north (-z) clockwise toward east (+x)
  return out.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
}

export function sampleLight(hour: number, out: Light) {
  const h = THREE.MathUtils.clamp(hour, KEYS[0].h, KEYS[KEYS.length - 1].h);
  let i = 0;
  while (i < parsed.length - 2 && h > parsed[i + 1].h) i++;
  const a = parsed[i];
  const b = parsed[i + 1];
  const k = THREE.MathUtils.clamp((h - a.h) / (b.h - a.h), 0, 1);
  out.zenith.copy(a.c.zenith).lerp(b.c.zenith, k);
  out.horizon.copy(a.c.horizon).lerp(b.c.horizon, k);
  out.sun.copy(a.c.sun).lerp(b.c.sun, k);
  out.sky.copy(a.c.sky).lerp(b.c.sky, k);
  out.ground.copy(a.c.ground).lerp(b.c.ground, k);
  out.sunI = a.sunI + (b.sunI - a.sunI) * k;
  out.hemiI = a.hemiI + (b.hemiI - a.hemiI) * k;
  out.stars = a.stars + (b.stars - a.stars) * k;

  const p = (hour - RISE) / (SET - RISE);
  const el = Math.sin(Math.PI * p) * MAX_ELEV;
  const az = THREE.MathUtils.degToRad(62 + 236 * p);
  dirFrom(az, el, out.sunDir);
  // the casting light never drops below 5 degrees: long dawn shadows, no black-out
  dirFrom(az, Math.max(el, THREE.MathUtils.degToRad(5)), tmp);
  out.night = THREE.MathUtils.smoothstep(hour, 20.0, 20.9);
  out.lightDir.copy(tmp).lerp(MOON, out.night).normalize();
  return out;
}
