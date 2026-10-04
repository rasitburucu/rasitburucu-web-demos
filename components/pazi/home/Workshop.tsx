// Isometric cut-away of the Gebze trial workshop (concept drawing, not a real
// plan): loading door, sample pallet, the trial cell, the video/report room.
// Floor, walls and floor markings are drawn first; everything that stands in
// the room goes through one depth sort so nothing nearer is hidden by what is
// behind it (lib/pazi/iso-depth.ts).

import { depthSort, type Aabb } from "@/lib/pazi/iso-depth";

const C = Math.cos(Math.PI / 6);
const S = 46;
type P = [number, number];
const iso = (x: number, y: number, z: number): P => [(x - z) * C * S, (x + z) * 0.5 * S - y * S];
const pts = (a: P[]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

function Box({ x, y, z, w, h, d, c }: { x: number; y: number; z: number; w: number; h: number; d: number; c: [string, string, string] }) {
  const x1 = x + w;
  const y1 = y + h;
  const z1 = z + d;
  return (
    <g stroke="#151615" strokeWidth="0.8" strokeLinejoin="round">
      <polygon points={pts([iso(x1, y, z), iso(x1, y1, z), iso(x1, y1, z1), iso(x1, y, z1)])} fill={c[1]} />
      <polygon points={pts([iso(x, y, z1), iso(x1, y, z1), iso(x1, y1, z1), iso(x, y1, z1)])} fill={c[2]} />
      <polygon points={pts([iso(x, y1, z), iso(x1, y1, z), iso(x1, y1, z1), iso(x, y1, z1)])} fill={c[0]} />
    </g>
  );
}

type Item = { key: string; box: Aabb; node: React.ReactNode };
const bx = (x: number, y: number, z: number, w: number, h: number, d: number): Aabb => ({ x0: x, x1: x + w, y0: y, y1: y + h, z0: z, z1: z + d });
const solid = (key: string, x: number, y: number, z: number, w: number, h: number, d: number, c: [string, string, string]): Item => ({
  key,
  box: bx(x, y, z, w, h, d),
  node: <Box x={x} y={y} z={z} w={w} h={h} d={d} c={c} />,
});

const CARD: [string, string, string] = ["#d6b285", "#b48a5c", "#9f7a4f"];
const WOOD: [string, string, string] = ["#cdb18a", "#a88e68", "#957c58"];
const PANEL: [string, string, string] = ["#f2f2ee", "#dcddd7", "#cfd0ca"];
const GRAPH: [string, string, string] = ["#4a4e51", "#34383a", "#2a2d2f"];
const STEEL: [string, string, string] = ["#c7cacc", "#9fa3a6", "#8c9093"];

function pallet(id: string, x: number, z: number, layers: number): Item[] {
  const out = [solid(`${id}-p`, x, 0, z, 0.8, 0.14, 1.2, WOOD)];
  for (let k = 0; k < layers; k++)
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 3; j++) out.push(solid(`${id}-${k}${i}${j}`, x + i * 0.4, 0.14 + k * 0.25, z + j * 0.4, 0.4, 0.25, 0.4, CARD));
  return out;
}

function Marker({ p, n }: { p: P; n: number }) {
  return (
    <g>
      <line x1={p[0]} y1={p[1]} x2={p[0]} y2={p[1] - 46} stroke="#151615" strokeWidth="1.2" />
      <circle cx={p[0]} cy={p[1] - 58} r="12" fill="#151615" />
      <text x={p[0]} y={p[1] - 54} textAnchor="middle" fill="#f5a800" className="pz-ws-num">
        {n}
      </text>
    </g>
  );
}

export function Workshop({ label }: { label: string }) {
  const H = 3;
  const floor = pts([iso(0, 0, 0), iso(12, 0, 0), iso(12, 0, 8), iso(0, 0, 8)]);
  const minX = iso(0, 0, 8)[0] - 30;
  const maxX = iso(12, 0, 0)[0] + 30;
  const minY = iso(0, H, 0)[1] - 30;
  const maxY = iso(12, -0.3, 8)[1] + 20;
  // Everything that stands in the room. Boxes carry their exact bounds; the arm
  // and the two glass panes are given the box they occupy.
  const A = { base: iso(7.05, 0.85, 4.5), elbow: iso(7.3, 1.9, 4.1), wrist: iso(8.1, 1.6, 4.4), tip: iso(8.1, 1.3, 4.4) };
  const link1 = pts([A.base, A.elbow]);
  const link2 = pts([A.elbow, A.wrist]);
  const scene: Item[] = [
    ...pallet("sample", 2.1, 5.6, 3),
    solid("conveyor", 6.6, 0, 2.0, 0.5, 0.7, 2.2, STEEL),
    ...pallet("left", 5.6, 3.9, 2),
    ...pallet("right", 7.8, 3.9, 4),
    solid("base", 6.9, 0, 4.35, 0.3, 0.7, 0.3, GRAPH),
    {
      // lower link, with the shoulder cap
      key: "arm1",
      box: { x0: 7.05, x1: 7.3, y0: 0.85, y1: 1.9, z0: 4.1, z1: 4.5 },
      node: (
        <g stroke="#e3e4df" strokeLinecap="round" fill="none">
          <polyline points={link1} strokeWidth="9" stroke="#151615" opacity="0.25" transform="translate(3 4)" />
          <polyline points={link1} strokeWidth="8" />
          <circle cx={A.base[0]} cy={A.base[1]} r="4.5" fill="#2a2d2f" stroke="none" />
        </g>
      ),
    },
    {
      // upper link, elbow, wrist and the short tool post
      key: "arm2",
      box: { x0: 7.3, x1: 8.1, y0: 1.3, y1: 1.9, z0: 4.1, z1: 4.4 },
      node: (
        <g stroke="#e3e4df" strokeLinecap="round" fill="none">
          <polyline points={link2} strokeWidth="9" stroke="#151615" opacity="0.25" transform="translate(3 4)" />
          <polyline points={link2} strokeWidth="8" />
          <line x1={A.wrist[0]} y1={A.wrist[1]} x2={A.tip[0]} y2={A.tip[1]} strokeWidth="5" />
          <circle cx={A.elbow[0]} cy={A.elbow[1]} r="4.5" fill="#2a2d2f" stroke="none" />
          <circle cx={A.wrist[0]} cy={A.wrist[1]} r="4.5" fill="#2a2d2f" stroke="none" />
        </g>
      ),
    },
    // video and report room: back panel, the side pane behind the furniture, the
    // furniture, then the front pane in front of it
    solid("room-back", 9.6, 0, 0.2, 2.2, 2.6, 0.08, PANEL),
    {
      key: "room-glass-side",
      box: bx(9.6, 0, 0.2, 0, 2.6, 2.4),
      node: <polygon points={pts([iso(9.6, 0, 0.2), iso(9.6, 0, 2.6), iso(9.6, 2.6, 2.6), iso(9.6, 2.6, 0.2)])} fill="rgba(170,200,214,0.3)" stroke="#151615" strokeWidth="0.8" />,
    },
    solid("room-screen", 10.2, 1.1, 0.3, 1.0, 0.6, 0.04, GRAPH),
    solid("room-desk", 10.1, 0, 1.0, 1.2, 0.74, 0.8, PANEL),
    {
      key: "room-glass-front",
      box: bx(9.6, 0, 2.6, 2.2, 2.6, 0),
      node: <polygon points={pts([iso(9.6, 0, 2.6), iso(11.8, 0, 2.6), iso(11.8, 2.6, 2.6), iso(9.6, 2.6, 2.6)])} fill="rgba(170,200,214,0.35)" stroke="#151615" strokeWidth="0.8" />,
    },
  ];
  return (
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className="pz-ws" role="img" aria-label={label}>
      {/* slab */}
      <polygon points={pts([iso(12, 0, 0), iso(12, -0.3, 0), iso(12, -0.3, 8), iso(12, 0, 8)])} fill="#a9aaa4" stroke="#151615" strokeWidth="0.8" />
      <polygon points={pts([iso(0, 0, 8), iso(12, 0, 8), iso(12, -0.3, 8), iso(0, -0.3, 8)])} fill="#b9bab4" stroke="#151615" strokeWidth="0.8" />
      <polygon points={floor} fill="#d0d1cb" stroke="#151615" strokeWidth="0.8" />
      {/* walls (cut) */}
      <polygon points={pts([iso(0, 0, 0), iso(12, 0, 0), iso(12, H, 0), iso(0, H, 0)])} fill="#e4e5df" stroke="#151615" strokeWidth="0.8" />
      <polygon points={pts([iso(0, 0, 0), iso(0, 0, 8), iso(0, H, 8), iso(0, H, 0)])} fill="#d9dad4" stroke="#151615" strokeWidth="0.8" />
      {/* wall caps */}
      <polygon points={pts([iso(0, H, 0), iso(12, H, 0), iso(12, H, 0.2), iso(0.2, H, 0.2), iso(0.2, H, 8), iso(0, H, 8)])} fill="#151615" />
      {/* roller door on the left wall */}
      <polygon points={pts([iso(0, 0, 5), iso(0, 0, 7.4), iso(0, 2.6, 7.4), iso(0, 2.6, 5)])} fill="#9fa3a6" stroke="#151615" strokeWidth="0.8" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={iso(0, 0.2 + i * 0.2, 5)[0]} y1={iso(0, 0.2 + i * 0.2, 5)[1]} x2={iso(0, 0.2 + i * 0.2, 7.4)[0]} y2={iso(0, 0.2 + i * 0.2, 7.4)[1]} stroke="#7d8184" strokeWidth="0.8" />
      ))}
      <polygon points={pts([iso(0.02, 0, 5), iso(0.02, 0, 7.4), iso(1.2, 0, 7.4), iso(1.2, 0, 5)])} fill="url(#pz-ws-hz)" opacity="0.9" />
      <defs>
        <pattern id="pz-ws-hz" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="#f5a800" />
          <rect width="5" height="10" fill="#151615" />
        </pattern>
      </defs>
      {/* walkway tape */}
      <polyline points={pts([iso(1.6, 0, 8), iso(1.6, 0, 1.4), iso(12, 0, 1.4)])} fill="none" stroke="#f5a800" strokeWidth="3" />
      {/* trial cell: floor markings first, the machines go into the depth sort */}
      <polygon points={pts([iso(4.4, 0, 2.4), iso(9.6, 0, 2.4), iso(9.6, 0, 6.6), iso(4.4, 0, 6.6)])} fill="none" stroke="#f5a800" strokeWidth="3" />
      <polygon points={pts([iso(5.0, 0, 3.0), iso(9.0, 0, 3.0), iso(9.0, 0, 6.0), iso(5.0, 0, 6.0)])} fill="none" stroke="#151615" strokeWidth="2.4" strokeDasharray="6 5" />
      {depthSort(scene).map((it) => (
        <g key={it.key}>{it.node}</g>
      ))}
      <Marker p={iso(0, 2.0, 6.2)} n={1} />
      <Marker p={iso(2.5, 0.9, 6.2)} n={2} />
      <Marker p={iso(7.4, 2.0, 4.2)} n={3} />
      <Marker p={iso(10.7, 2.6, 1.6)} n={4} />
    </svg>
  );
}
