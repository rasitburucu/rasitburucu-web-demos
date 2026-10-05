// The drawn shore: lake, reeds, willows with their evening shadows, the pier,
// the barn, the walled yard and the lanterns. Static and deterministic (seeded),
// so server and client draw the same map. Everything here is decoration for
// sighted readers; the plan's <svg> carries one label for assistive tech.

import { memo } from "react";
import { BARN, BARN_DOOR, LANTERNS, PATHS, PIER, PLATFORM, TREES, YARD, YARD_GATE, meadowPath, shoreX, type Tree } from "@/lib/sazbahce/plan";

const INK = "#1D3830";
const f1 = (n: number) => n.toFixed(1);

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const Y0 = -320;
const Y1 = 1000;

function lakePath() {
  let d = `M-700 ${Y0} L${f1(shoreX(Y0))} ${Y0}`;
  for (let y = Y0; y <= Y1; y += 8) d += ` L${f1(shoreX(y))} ${y}`;
  return `${d} L-700 ${Y1}Z`;
}

function contour(offset: number, i: number) {
  let p = "";
  for (let y = Y0; y <= Y1; y += 10) {
    const x = shoreX(y) - offset - 9 * Math.sin(y / 64 + i * 1.7);
    p += `${y === Y0 ? "M" : "L"}${f1(x)} ${y}`;
  }
  return p;
}

function shoreline() {
  let k = "";
  for (let y = Y0; y <= Y1; y += 4) k += `${y === Y0 ? "M" : "L"}${f1(shoreX(y))} ${y}`;
  return k;
}

/** One path per reed bed: short leaning strokes, denser at the water's edge. */
function reeds(a: number, b: number, n: number, seed: number) {
  const r = rng(seed);
  let d = "";
  for (let i = 0; i < n; i++) {
    const y = a + r() * (b - a);
    const depth = Math.pow(r(), 1.6) * 54;
    const x = shoreX(y) - 4 - depth;
    const h = 5 + r() * 8;
    const lean = (r() - 0.35) * 5;
    d += `M${f1(x)} ${f1(y)}l${f1(lean)} ${f1(-h)}`;
  }
  return d;
}

function reedBed(a: number, b: number) {
  let d = "";
  for (let y = a; y <= b; y += 10) d += `${y === a ? "M" : "L"}${f1(shoreX(y) - 2)} ${y}`;
  for (let y = b; y >= a; y -= 10) d += `L${f1(shoreX(y) - 46 - 10 * Math.sin(y / 23))} ${y}`;
  return `${d}Z`;
}

/** Sun glitter on the water: short warm dashes, densest far out (west). */
function glitter() {
  const r = rng(91);
  let d = "";
  for (let i = 0; i < 120; i++) {
    const y = 120 + (r() - 0.5) * 420 * r();
    const x = -260 + r() * (shoreX(y) - 40 + 260);
    const w = 3 + r() * 12;
    d += `M${f1(x)} ${f1(y)}h${f1(w)}`;
  }
  return d;
}

function crown(t: Tree, seed: number) {
  const r = rng(seed);
  const n = 44;
  const lobes = t.kind === "willow" ? 7 : 5;
  const ph = r() * 6;
  let p = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = t.r * (0.92 + 0.06 * Math.sin(a * lobes + ph) + 0.025 * r());
    p += `${i ? "L" : "M"}${f1(t.x + Math.cos(a) * rr)} ${f1(t.y + Math.sin(a) * rr)}`;
  }
  return `${p}Z`;
}

/** Willow: long drooping strands from the trunk; other trees: a few short branches. */
function strands(t: Tree, seed: number) {
  const r = rng(seed);
  const n = t.kind === "willow" ? 30 : 10;
  let d = "";
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const r1 = t.r * r() * 0.22;
    const r2 = t.r * (t.kind === "willow" ? 0.62 + r() * 0.34 : 0.4 + r() * 0.3);
    const bend = t.kind === "willow" ? 0.32 : 0.15;
    d += `M${f1(t.x + Math.cos(a) * r1)} ${f1(t.y + Math.sin(a) * r1)}Q${f1(t.x + Math.cos(a + bend) * r2 * 0.6)} ${f1(t.y + Math.sin(a + bend) * r2 * 0.6)} ${f1(t.x + Math.cos(a) * r2)} ${f1(t.y + Math.sin(a) * r2)}`;
  }
  return d;
}

const FILL = { willow: "#CFDCC6", walnut: "#B7C9AE", tree: "#C3D3BB" } as const;

function TreeShape({ t, i }: { t: Tree; i: number }) {
  return (
    <g>
      <path d={crown(t, 11 + i * 7)} fill={FILL[t.kind]} stroke="#3E5F52" strokeWidth="0.8" />
      {/* West side catches the last light. */}
      <circle cx={f1(t.x - t.r * 0.32)} cy={f1(t.y - t.r * 0.12)} r={f1(t.r * 0.55)} fill="#F1D9A6" opacity="0.32" />
      <path d={strands(t, 5 + i * 13)} fill="none" stroke="#557566" strokeWidth="0.7" strokeLinecap="round" />
      <circle cx={f1(t.x)} cy={f1(t.y)} r="1.8" fill={INK} />
    </g>
  );
}

/** The barn as a floor plan (roof lifted): plank floor, thick walls, doors, the roof ridge dashed. */
function Barn({ tiles }: { tiles: string }) {
  const { x, y, w, h } = BARN;
  return (
    <g>
      <path d={`M${x + w} ${y + 6} l34 8 v${h - 4} l-34 2Z`} fill={INK} opacity="0.1" />
      <rect x={x} y={y} width={w} height={h} fill="#F1EADB" />
      <rect x={x} y={y} width={w} height={h} fill={`url(#${tiles})`} opacity="0.55" />
      <path d={`M${x + w / 2} ${y + 6}v${h - 12}`} stroke="#9B8C74" strokeWidth="0.8" strokeDasharray="6 5" />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={INK} strokeWidth="3.2" />
      {/* West door to the meadow, loading door to the north (gaps in the wall) */}
      <path d={`M${x} ${BARN_DOOR.y0 + 1}V${BARN_DOOR.y1 - 1}M${x + w / 2 - 16} ${y}h32`} stroke="#F1EADB" strokeWidth="4.2" />
      <path d={`M${x - 1} ${BARN_DOOR.y0}l-12 6M${x - 1} ${BARN_DOOR.y1}l-12 -6`} stroke={INK} strokeWidth="0.9" />
    </g>
  );
}

function Yard({ stone }: { stone: string }) {
  const { x, y, w, h } = YARD;
  return (
    <g>
      <path d={`M${x + w} ${y + 4} l20 6 v${h - 2} l-20 0Z`} fill={INK} opacity="0.08" />
      <rect x={x} y={y} width={w} height={h} fill="#ECE6DA" />
      <rect x={x} y={y} width={w} height={h} fill={`url(#${stone})`} opacity="0.8" />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={INK} strokeWidth="5" />
      {/* Gate in the west wall */}
      <path d={`M${x} ${YARD_GATE.y0}V${YARD_GATE.y1}`} stroke="#ECE6DA" strokeWidth="7" />
    </g>
  );
}

function Pier() {
  const kx = shoreX(PIER.y);
  const { x0, y, half } = PIER;
  const planks: string[] = [];
  for (let px = x0 + 4; px < kx; px += 6) planks.push(`M${px} ${y - half}v${half * 2}`);
  const deck: string[] = [];
  for (let py = PLATFORM.y + 2; py < PLATFORM.y + PLATFORM.h; py += 6) deck.push(`M${PLATFORM.x} ${py}h${PLATFORM.w}`);
  const posts: string[] = [];
  for (let px = x0 + 8; px < kx; px += 36) posts.push(`M${px} ${y - half - 2}h0.1M${px} ${y + half + 2}h0.1`);
  return (
    <g>
      <rect x={PLATFORM.x + 5} y={PLATFORM.y + 5} width={kx - PLATFORM.x} height={PLATFORM.h} fill={INK} opacity="0.08" />
      <rect x={x0} y={y - half} width={kx - x0} height={half * 2} fill="#E6DCC6" stroke={INK} strokeWidth="1.2" />
      <path d={planks.join("")} stroke="#9E8F70" strokeWidth="0.6" />
      <rect x={PLATFORM.x} y={PLATFORM.y} width={PLATFORM.w} height={PLATFORM.h} fill="#E6DCC6" stroke={INK} strokeWidth="1.2" />
      <path d={deck.join("")} stroke="#9E8F70" strokeWidth="0.6" />
      <path d={posts.join("")} stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
    </g>
  );
}

function Labels({ labels }: { labels: { lake: string; iskele: string; cayir: string; ambar: string; avlu: string; entrance: string; north: string; scale: string } }) {
  const t = { fontFamily: "var(--sb-sans)", fontWeight: 650, fontSize: 12.5, fill: INK, letterSpacing: "0.08em" } as const;
  return (
    <g className="sb-plan-labels">
      <text {...t} className="sb-l-area" x="100" y="256">{labels.iskele}</text>
      <text {...t} className="sb-l-area" x="790" y="168">{labels.ambar}</text>
      <text {...t} className="sb-l-area" x="790" y="451">{labels.avlu}</text>
      <text {...t} className="sb-l-area" x="430" y="604">{labels.cayir}</text>
      <text {...t} className="sb-l-lake" fontWeight={600} fontSize={15} letterSpacing="0.16em" fill="#3F6259" x="60" y="470">{labels.lake}</text>
      <text className="sb-l-small" x="1010" y="628" fontFamily="var(--sb-sans)" fontSize="12" fill="#4F655C" textAnchor="end">{labels.entrance}</text>
      <g className="sb-plan-north" transform="translate(962 56)">
        <circle r="15" fill="#F3F5F1" stroke={INK} />
        <path d="M0 -12 L5 6 L0 2 L-5 6Z" fill={INK} />
        <text y="-20" textAnchor="middle" fontSize="11" fontFamily="var(--sb-sans)" fill={INK}>{labels.north}</text>
      </g>
      <g transform="translate(70 600)">
        <rect x="-6" y="-17" width="126" height="28" fill="#F3F5F1" opacity="0.85" rx="2" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 25} y="0" width="25" height="4" fill={i % 2 ? "#F3F5F1" : INK} stroke={INK} strokeWidth="0.6" />
        ))}
        <text className="sb-l-small" x="0" y="-5" fontSize="10" fontFamily="var(--sb-sans)" fill={INK}>0</text>
        <text className="sb-l-small" x="100" y="-5" fontSize="10" fontFamily="var(--sb-sans)" fill={INK} textAnchor="middle">{labels.scale}</text>
      </g>
    </g>
  );
}

type BaseProps = { uid: string; part: "ground" | "canopy"; labels: Parameters<typeof Labels>[0]["labels"] };

function PlanBaseInner({ uid, part, labels }: BaseProps) {
  const id = (s: string) => `sb-${s}-${uid}`;
  if (part === "canopy")
    return (
      <g>
        {/* Crowns sit above the furniture, a little see-through, as on a landscape plan. */}
        <g opacity="0.9">
          {TREES.map((t, i) => (
            <TreeShape key={`${t.x}-${t.y}`} t={t} i={i} />
          ))}
        </g>
        {LANTERNS.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="11" fill="#F2C27A" opacity="0.22" />
            <circle cx={x} cy={y} r="6" fill="#F2C27A" opacity="0.4" />
            <circle cx={x} cy={y} r="2.1" fill="#E8AF56" stroke="#7A5A12" strokeWidth="0.5" />
          </g>
        ))}
        {/* the low sun's light over the water and the west edge of the land */}
        <rect x="-700" y={Y0} width="2200" height={Y1 - Y0} fill={`url(#${id("glow")})`} style={{ mixBlendMode: "multiply" }} pointerEvents="none" />
        <Labels labels={labels} />
      </g>
    );
  return (
    <g>
      <defs>
        <pattern id={id("grass")} width="11" height="11" patternUnits="userSpaceOnUse">
          <path d="M2 8l1-2.6M7 4l1-2.6" stroke="#8DA791" strokeWidth="0.8" />
        </pattern>
        <pattern id={id("tiles")} width="30" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 4.5h30M12 0v4.5" stroke="#C4B79E" strokeWidth="0.5" />
        </pattern>
        <pattern id={id("stone")} width="12" height="9" patternUnits="userSpaceOnUse">
          <path d="M0 4.5h12M6 0v4.5M0 4.5v4.5" stroke="#B9AE98" strokeWidth="0.5" />
        </pattern>
        <linearGradient id={id("water")} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#CFE0DC" />
          <stop offset="0.45" stopColor="#B4CEC9" />
          <stop offset="1" stopColor="#93B4AF" />
        </linearGradient>
        <radialGradient id={id("glow")} cx="-160" cy="170" r="980" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F2C27A" stopOpacity="0.72" />
          <stop offset="0.5" stopColor="#F2C27A" stopOpacity="0.22" />
          <stop offset="1" stopColor="#F2C27A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* paper */}
      <rect x="-700" y={Y0} width="2200" height={Y1 - Y0} fill="#F3F4EE" />
      {/* meadow */}
      <path d={meadowPath()} fill="#E2EBDD" />
      <path d={meadowPath()} fill={`url(#${id("grass")})`} opacity="0.75" />
      {/* lake */}
      <path d={lakePath()} fill={`url(#${id("water")})`} />
      {[30, 64, 108, 164, 232, 310, 400].map((o, i) => (
        <path key={o} d={contour(o, i)} fill="none" stroke="#6F9690" strokeWidth={i < 2 ? 0.9 : 0.7} strokeDasharray={i > 2 ? "5 5" : undefined} opacity={0.62 - i * 0.05} />
      ))}
      <g className="sb-plan-depth" fontFamily="var(--sb-sans)" fontSize="11" fill="#4E7570">
        <text x={f1(shoreX(150) - 82)} y="150">1,5 m</text>
        <text x={f1(shoreX(392) - 270)} y="392">3 m</text>
        <text x={f1(shoreX(700) - 170)} y="700">2 m</text>
      </g>
      <path d={glitter()} stroke="#F6D79B" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
      {/* reed beds */}
      {[[-200, 150], [372, 540], [560, 820]].map(([a, b], i) => (
        <g key={a}>
          <path d={reedBed(a, b)} fill="#A9C2A4" opacity="0.45" />
          <path d={reeds(a, b, Math.round((b - a) * 0.9), 7 + i * 31)} stroke="#486A59" strokeWidth="0.85" opacity="0.8" />
        </g>
      ))}
      {/* the shore: a pale band of wet ground, then the ink line */}
      <path d={shoreline()} fill="none" stroke="#E8E2CF" strokeWidth="7" />
      <path d={shoreline()} fill="none" stroke={INK} strokeWidth="1.6" />
      {/* gravel paths and lanterns */}
      {PATHS.map((d) => (
        <g key={d}>
          <path d={d} fill="none" stroke="#DAD5C5" strokeWidth="13" strokeLinecap="round" />
          <path d={d} fill="none" stroke="#9AA697" strokeWidth="0.8" strokeDasharray="1 5" strokeLinecap="round" />
        </g>
      ))}
      <Pier />
      <Barn tiles={id("tiles")} />
      <Yard stone={id("stone")} />
      {/* Evening shadows: the sun sets over the lake, so they run east. */}
      {TREES.map((t) => (
        <ellipse key={`s${t.x}-${t.y}`} cx={f1(t.x + t.r * 0.95)} cy={f1(t.y + t.r * 0.18)} rx={f1(t.r * 1.32)} ry={f1(t.r * 0.78)} fill={INK} opacity="0.1" />
      ))}
    </g>
  );
}

export const PlanBase = memo(PlanBaseInner);
