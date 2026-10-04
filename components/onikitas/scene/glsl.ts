// Shared GLSL. The reveal front is a ragged line that crosses the maquette from
// east to west as the morning sun climbs; behind it clay becomes material.

export const NOISE = /* glsl */ `
float oki_hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float oki_noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = oki_hash(i), b = oki_hash(i + vec2(1.0, 0.0));
  float c = oki_hash(i + vec2(0.0, 1.0)), d = oki_hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float oki_fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ s += a * oki_noise(p); p *= 2.02; a *= 0.5; } return s; }
`;

export const REVEAL = /* glsl */ `
uniform float uReveal;
float oki_front(vec3 wp){
  if (uReveal <= 0.0005) return -1e4;
  if (uReveal >= 0.9995) return 1e4;
  float c = -wp.x * 0.92 + wp.z * 0.3;
  c = 66.0 * tanh(c / 60.0);
  float rag = (oki_noise(wp.xz * 0.16) - 0.5) * 9.0 + (oki_noise(wp.xz * 0.9) - 0.5) * 2.2;
  return mix(-74.0, 74.0, uReveal) - c + rag;
}
// 0 clay .. 1 real. bias > 0 reveals earlier (sun-facing surfaces).
float oki_reveal(vec3 wp, float bias){ return smoothstep(-1.4, 1.4, oki_front(wp) + bias); }
float oki_edge(vec3 wp, float bias){ float f = oki_front(wp) + bias; return exp(-f * f * 0.55); }
`;

// Clay of the maquette: model board, a chalky white with a little travertine
// warmth in it, so its shaded side reads warm stone, not cold grey.
export const CLAY = /* glsl */ `const vec3 OKI_CLAY = vec3(0.875, 0.858, 0.83);`;
