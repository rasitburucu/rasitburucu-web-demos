// Isometric cut-away of the Gebze trial workshop (concept drawing, not a real
// plan): loading door, sample pallet, the trial cell, the video/report room.

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

const CARD: [string, string, string] = ["#d6b285", "#b48a5c", "#9f7a4f"];
const WOOD: [string, string, string] = ["#cdb18a", "#a88e68", "#957c58"];
const PANEL: [string, string, string] = ["#f2f2ee", "#dcddd7", "#cfd0ca"];
const GRAPH: [string, string, string] = ["#4a4e51", "#34383a", "#2a2d2f"];
const STEEL: [string, string, string] = ["#c7cacc", "#9fa3a6", "#8c9093"];

function Pallet({ x, z, layers }: { x: number; z: number; layers: number }) {
  const out = [<Box key="p" x={x} y={0} z={z} w={0.8} h={0.14} d={1.2} c={WOOD} />];
  for (let k = 0; k < layers; k++)
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 3; j++) out.push(<Box key={`${k}${i}${j}`} x={x + i * 0.4} y={0.14 + k * 0.25} z={z + j * 0.4} w={0.4} h={0.25} d={0.4} c={CARD} />);
  return <g>{out}</g>;
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
      {/* sample pallet by the door */}
      <Pallet x={2.1} z={5.6} layers={3} />
      {/* trial cell */}
      <polygon points={pts([iso(4.4, 0, 2.4), iso(9.6, 0, 2.4), iso(9.6, 0, 6.6), iso(4.4, 0, 6.6)])} fill="none" stroke="#f5a800" strokeWidth="3" />
      <polygon points={pts([iso(5.0, 0, 3.0), iso(9.0, 0, 3.0), iso(9.0, 0, 6.0), iso(5.0, 0, 6.0)])} fill="none" stroke="#151615" strokeWidth="2.4" strokeDasharray="6 5" />
      <Box x={6.6} y={0} z={2.0} w={0.5} h={0.7} d={2.2} c={STEEL} />
      <Pallet x={5.6} z={3.9} layers={2} />
      <Pallet x={7.8} z={3.9} layers={4} />
      <Box x={6.9} y={0} z={4.35} w={0.3} h={0.7} d={0.3} c={GRAPH} />
      {/* arm */}
      <g stroke="#e3e4df" strokeLinecap="round" fill="none">
        <polyline points={pts([iso(7.05, 0.85, 4.5), iso(7.3, 1.9, 4.1), iso(8.1, 1.6, 4.4)])} strokeWidth="9" stroke="#151615" opacity="0.25" transform="translate(3 4)" />
        <polyline points={pts([iso(7.05, 0.85, 4.5), iso(7.3, 1.9, 4.1), iso(8.1, 1.6, 4.4)])} strokeWidth="8" />
        <line x1={iso(8.1, 1.6, 4.4)[0]} y1={iso(8.1, 1.6, 4.4)[1]} x2={iso(8.1, 1.3, 4.4)[0]} y2={iso(8.1, 1.3, 4.4)[1]} strokeWidth="5" />
      </g>
      {[iso(7.05, 0.85, 4.5), iso(7.3, 1.9, 4.1), iso(8.1, 1.6, 4.4)].map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="4.5" fill="#2a2d2f" />
      ))}
      {/* video and report room, glass front */}
      <Box x={9.6} y={0} z={0.2} w={2.2} h={2.6} d={0.08} c={PANEL} />
      <polygon points={pts([iso(9.6, 0, 2.6), iso(11.8, 0, 2.6), iso(11.8, 2.6, 2.6), iso(9.6, 2.6, 2.6)])} fill="rgba(170,200,214,0.35)" stroke="#151615" strokeWidth="0.8" />
      <polygon points={pts([iso(9.6, 0, 0.2), iso(9.6, 0, 2.6), iso(9.6, 2.6, 2.6), iso(9.6, 2.6, 0.2)])} fill="rgba(170,200,214,0.3)" stroke="#151615" strokeWidth="0.8" />
      <Box x={10.1} y={0} z={1.0} w={1.2} h={0.74} d={0.8} c={PANEL} />
      <Box x={10.2} y={1.1} z={0.3} w={1.0} h={0.6} d={0.04} c={GRAPH} />
      <Marker p={iso(0, 2.0, 6.2)} n={1} />
      <Marker p={iso(2.5, 0.9, 6.2)} n={2} />
      <Marker p={iso(7.4, 2.0, 4.2)} n={3} />
      <Marker p={iso(10.7, 2.6, 1.6)} n={4} />
    </svg>
  );
}
