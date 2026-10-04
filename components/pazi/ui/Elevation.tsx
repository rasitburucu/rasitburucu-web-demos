// Side elevation of a model, drawn from the same link lengths, housings and
// gripper as the 3D arm (components/pazi/cell/robot.ts). World units are mm
// with y up; the SVG flips y. Pose: upper arm straight up, forearm level,
// wrist down, carrying the model's demo product over the first pallet station
// (the product and gripper the model page runs in 3D, chosen by `fit`).
//
// Every drawing has the same view width, so drawings shown at the same
// rendered width share one scale. `renderWidth` is the expected on-screen
// width; line weights and type are sized from it so they read alike anywhere.

import type { CSSProperties, ReactNode } from "react";
import { tr } from "@/content/pazi/tr";
import { MODEL_DEMO } from "@/components/pazi/model/demo";
import { DEFAULT_CONFIG, MODELS, PALLET_DECK, STATION_GAP_M, fit, type ModelSpec } from "@/lib/pazi/plan";
import { fmt } from "@/lib/pazi/format";

type Pt = [number, number];

/** Pallet side seen in this view (EUR, X = pallet width). */
const PALLET_W = 800;
/** Room left of the J1 axis for the height dimensions, and right of the longest reach. */
const LEFT = 310;
const RIGHT = Math.max(...MODELS.map((m) => m.reach)) + 60;
const VIEW_W = LEFT + RIGHT;

const C = {
  ink: "#151615",
  ink2: "#4a4d48",
  ink3: "#6a6d67",
  line: "#8d8f88",
  panel: "#ecece6",
  paint: "#e6e7e2",
  shade: "#cfd0ca",
  cap: "#2a2d2f",
  ring: "#9a9ea2",
  hub: "#6d7175",
  rubber: "#3d4145",
  metal: "#b9bcbf",
  alu: "#c6c9c5",
  kraft: "#d7bb92",
  tape: "#bb935f",
  wood: "#d3bd98",
  bag: "#ebe7da",
  yellow: "#f5a800",
};

const r1 = (v: number) => Math.round(v * 10) / 10;
const P = (x: number, y: number) => `${r1(x)} ${r1(-y)}`;
const poly = (pts: Pt[], close = true) => `M ${pts.map(([x, y]) => P(x, y)).join(" L ")}${close ? " Z" : ""}`;
const box = (x0: number, y0: number, x1: number, y1: number) => poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const line = (x0: number, y0: number, x1: number, y1: number) => `M ${P(x0, y0)} L ${P(x1, y1)}`;

function rbox(x0: number, y0: number, x1: number, y1: number, rad: number) {
  const r = r1(Math.min(rad, (x1 - x0) / 2, (y1 - y0) / 2));
  const [L, R, T, B] = [x0, x1, -y1, -y0].map(r1);
  return `M ${r1(L + r)} ${T} H ${r1(R - r)} A ${r} ${r} 0 0 1 ${R} ${r1(T + r)} V ${r1(B - r)} A ${r} ${r} 0 0 1 ${r1(R - r)} ${B} H ${r1(L + r)} A ${r} ${r} 0 0 1 ${L} ${r1(B - r)} V ${r1(T + r)} A ${r} ${r} 0 0 1 ${r1(L + r)} ${T} Z`;
}

const circ = (cx: number, cy: number, r: number) =>
  `M ${r1(cx - r)} ${r1(-cy)} a ${r1(r)} ${r1(r)} 0 1 0 ${r1(2 * r)} 0 a ${r1(r)} ${r1(r)} 0 1 0 ${r1(-2 * r)} 0 Z`;

/** Tapered tube from a to b; `from`/`to` pick a band across it (-1..1), the whole tube by default. */
function tube(a: Pt, b: Pt, ra: number, rb: number, from = 1, to = -1) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const nx = -(b[1] - a[1]) / len;
  const ny = (b[0] - a[0]) / len;
  return poly([
    [a[0] + nx * ra * from, a[1] + ny * ra * from],
    [b[0] + nx * rb * from, b[1] + ny * rb * from],
    [b[0] + nx * rb * to, b[1] + ny * rb * to],
    [a[0] + nx * ra * to, a[1] + ny * ra * to],
  ]);
}

/** Catmull-Rom through the points, as cubic Béziers. */
function smooth(pts: Pt[]) {
  let d = `M ${P(...pts[0])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${P(...c1)} ${P(...c2)} ${P(...p2)}`;
  }
  return d;
}

const rot = ([x, y]: Pt, [px, py]: Pt, a: number): Pt => [px + x * Math.cos(a) - y * Math.sin(a), py + x * Math.sin(a) + y * Math.cos(a)];

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Top of the drawing (SVG y) for a model at a rendered width. */
export function elevationTop(model: ModelSpec, renderWidth = 340) {
  const k = VIEW_W / renderWidth;
  return -(model.link.d1 * 1000 + model.reach + 12 * k);
}

export function Elevation({
  model,
  className,
  labels = true,
  top: forcedTop,
  renderWidth = 340,
}: {
  model: ModelSpec;
  className?: string;
  labels?: boolean;
  top?: number;
  /** Expected rendered width in CSS px; sizes line weights and type. */
  renderWidth?: number;
}) {
  const k = VIEW_W / renderWidth; // mm per screen pixel
  const sw = 1.1 * k;
  const fine = 0.55 * k;
  const fs = 9.5 * k;

  const d1 = model.link.d1 * 1000;
  const a2 = model.link.a2 * 1000;
  const a3 = model.link.a3 * 1000;
  const wr = model.link.wrist * 1000;
  const r = model.link.r * 1000;
  const R1 = r * 1.28; // shoulder housing
  const R2 = r * 1.06; // elbow housing
  const R3 = r * 0.78; // wrist housings
  const yE = d1 + a2; // J3 and J4 axis height
  const h1 = wr * 0.42;
  const y5 = yE - h1; // J5 axis
  const y6 = y5 - R3 * 0.62; // top of the J6 housing
  const yF = yE - wr; // tool flange face
  const w3h = y6 - yF - 12;
  const reach = model.reach;

  // demo product and gripper, as on the model page
  const demo = { ...DEFAULT_CONFIG, ...MODEL_DEMO[model.id] };
  const f = fit(demo, model.id);
  const claw = f.gripper === "pence";
  const bag = demo.kind === "torba";
  const gH = claw ? 120 : 112;
  const hold = yF - gH;
  const items: [number, number][] = f.double
    ? [
        [a3 - demo.u, a3],
        [a3, a3 + demo.u],
      ]
    : [[a3 - demo.g / 2, a3 + demo.g / 2]];
  const clawW = Math.max(360, demo.g + 60);
  const lowest = Math.min(hold - demo.y, claw ? yF - 70 - 192 : Infinity);

  // pallet station and the layers already on it
  const px0 = STATION_GAP_M * 1000;
  const px1 = px0 + PALLET_W;
  const pcx = (px0 + px1) / 2;
  const layers = Math.max(0, Math.floor((lowest - PALLET_DECK - 40) / demo.y));
  const perRow = Math.max(1, Math.floor(PALLET_W / demo.g));

  // view box
  const top = forcedTop ?? elevationTop(model, renderWidth);
  const below = 36 * k;
  const vb = `${-LEFT} ${r1(top)} ${VIEW_W} ${r1(below - top)}`;
  const id = `pz-el-${model.id}`;

  const ln = { pathLength: 1, className: "pz-el-ln", stroke: C.ink, strokeWidth: sw, strokeLinejoin: "round" as const };
  const detail = { pathLength: 1, className: "pz-el-ln", stroke: C.ink, strokeWidth: fine, strokeLinejoin: "round" as const };

  /** A joint cap seen face on: dark disc, bright ring, anodised hub, centre mark. */
  const cap = (cx: number, cy: number, R: number) => (
    <>
      <path d={circ(cx, cy, R)} fill={C.paint} {...ln} />
      <path d={circ(cx, cy, R * 0.86)} fill={C.cap} {...detail} />
      <path d={circ(cx, cy, R * 0.8)} fill="none" stroke={C.ring} strokeWidth={fine} />
      <path d={circ(cx, cy, R * 0.32)} fill={C.hub} {...detail} />
    </>
  );

  /** Product seen from the side: koli with its tape, or a filled bag. */
  const product = (x0: number, x1: number, y0: number, h: number, key: string, context = false) => {
    const w = x1 - x0;
    const cx = (x0 + x1) / 2;
    const s = context ? fine : sw * 0.9;
    if (bag) {
      const b = h * 0.42;
      const d = `M ${P(x0 + b, y0)} Q ${P(cx, y0 - h * 0.08)} ${P(x1 - b, y0)} Q ${P(x1 + h * 0.06, y0)} ${P(x1, y0 + h / 2)} Q ${P(x1 + h * 0.06, y0 + h)} ${P(x1 - b, y0 + h)} Q ${P(cx, y0 + h * 1.1)} ${P(x0 + b, y0 + h)} Q ${P(x0 - h * 0.06, y0 + h)} ${P(x0, y0 + h / 2)} Q ${P(x0 - h * 0.06, y0)} ${P(x0 + b, y0)} Z`;
      return (
        <g key={key}>
          <path d={d} fill={C.bag} {...ln} strokeWidth={s} />
          <path d={line(x0 + h * 0.3, y0 + h * 0.2, x0 + h * 0.3, y0 + h * 0.8)} stroke={C.ink3} strokeWidth={fine} strokeDasharray={`${2 * k} ${1.5 * k}`} />
          <path d={line(x1 - h * 0.3, y0 + h * 0.2, x1 - h * 0.3, y0 + h * 0.8)} stroke={C.ink3} strokeWidth={fine} strokeDasharray={`${2 * k} ${1.5 * k}`} />
          <path d={`M ${P(x0 + w * 0.3, y0 + h * 0.62)} Q ${P(cx, y0 + h * 0.5)} ${P(x1 - w * 0.25, y0 + h * 0.66)}`} fill="none" stroke={C.ink3} strokeWidth={fine} />
        </g>
      );
    }
    return (
      <g key={key}>
        <path d={rbox(x0, y0, x1, y0 + h, 6)} fill={C.kraft} {...ln} strokeWidth={s} />
        <path d={box(cx - 24, y0 + h - Math.min(70, h * 0.35), cx + 24, y0 + h)} fill={C.tape} stroke="none" />
        <path d={line(x0 + 8, y0 + h - 14, x1 - 8, y0 + h - 14)} stroke={C.tape} strokeWidth={fine} />
      </g>
    );
  };

  // hose: base rear, along the back of the upper arm, over the elbow, along the forearm, down the wrist
  const hosePts: Pt[] = [
    [-R1 - 6, 70],
    [-r * 1.25, d1 + a2 * 0.18],
    [-r * 1.2, d1 + a2 * 0.82],
    [-r * 0.98, yE + r * 0.98],
    [a3 * 0.2, yE + r * 1.05],
    [a3 * 0.85, yE + r * 0.95],
    [a3 - R3 * 1.1, y5],
    [a3 - (claw ? 60 : 70), yF - (claw ? 18 : 4)],
  ];
  const clips = [1, 2, 4, 5, 6].map((i) => {
    const [x, y] = hosePts[i];
    const tx = hosePts[i + 1][0] - hosePts[i - 1][0];
    const ty = hosePts[i + 1][1] - hosePts[i - 1][1];
    const tl = Math.hypot(tx, ty);
    const nx = (-ty / tl) * 19;
    const ny = (tx / tl) * 19;
    return line(x + nx, y + ny, x - nx, y - ny);
  });

  // dimensions
  const aL = 5.5 * k;
  const aW = 1.9 * k;
  const arrow = (x: number, y: number, dx: number, dy: number) => {
    const bx = x - dx * aL;
    const by = y - dy * aL;
    return poly([
      [x, y],
      [bx - dy * aW, by + dx * aW],
      [bx + dy * aW, by - dx * aW],
    ]);
  };
  const tw = (s: string) => s.length * 0.62 * fs;
  /** Vertical dimension at x from y0 up to y1; text on the left (or right). */
  const dimV = (key: string, x: number, y0: number, y1: number, text: string, right = false) => {
    const inside = y1 - y0 > tw(text) + 2 * aL + 4 * k;
    const tx = right ? x + 2.4 * k + fs * 0.75 : x - 2.4 * k;
    return (
      <g key={key}>
        <path d={inside ? line(x, y0, x, y1) : line(x, y0 - aL - 3 * k, x, y1 + aL + 3 * k)} fill="none" />
        <path d={inside ? arrow(x, y1, 0, 1) : arrow(x, y1, 0, -1)} className="pz-el-arrow" />
        <path d={inside ? arrow(x, y0, 0, -1) : arrow(x, y0, 0, 1)} className="pz-el-arrow" />
        <text transform={`translate(${P(tx, (y0 + y1) / 2)}) rotate(-90)`} textAnchor="middle">
          {text}
        </text>
      </g>
    );
  };
  /** Horizontal dimension at y from x0 to x1; text above (or below). */
  const dimH = (key: string, y: number, x0: number, x1: number, text: string, under = false) => {
    const inside = x1 - x0 > tw(text) + 2 * aL + 4 * k;
    return (
      <g key={key}>
        <path d={inside ? line(x0, y, x1, y) : line(x0 - aL - 3 * k, y, x1 + aL + 3 * k, y)} fill="none" />
        <path d={inside ? arrow(x1, y, 1, 0) : arrow(x1, y, -1, 0)} className="pz-el-arrow" />
        <path d={inside ? arrow(x0, y, -1, 0) : arrow(x0, y, 1, 0)} className="pz-el-arrow" />
        <text x={r1((x0 + x1) / 2)} y={r1(-(under ? y - 2.6 * k - fs * 0.75 : y + 2.4 * k))} textAnchor="middle">
          {text}
        </text>
      </g>
    );
  };

  const xA = -(R1 * 1.42 + 12 * k); // shoulder and upper arm chain
  const yH = yE + R2 + 24 * k; // forearm dimension
  const xW = a3 + R3 + 14 * k; // wrist dimension
  const yS = -21 * k; // station dimensions under the floor
  const ext = (x0: number, y0: number, x1: number, y1: number) => line(x0, y0, x1, y1);

  // reach envelope: arc about the shoulder axis; front half hatched
  const xf = Math.sqrt(reach * reach - d1 * d1);
  const ang = (40 * Math.PI) / 180;
  const rx = Math.cos(ang);
  const ry = Math.sin(ang);

  // title block, top right
  const tbW = 112 * k;
  const tbH = 51 * k;
  const tbX = RIGHT - 6 * k - tbW;
  const tbY = -top - 6 * k; // world y of its top edge
  const scaleMm = [1000, 500, 250, 200, 100].find((v) => v / k <= 100) ?? 100;

  const centre: ReactNode = (
    <path
      d={[
        line(0, yS - 3 * k, 0, yH + 4 * k),
        line(-R2 - 8 * k, yE, a3 + R3 + 8 * k, yE),
        line(a3, yH + 4 * k, a3, lowest - 6 * k),
        line(a3 - R3 - 5 * k, y5, a3 + R3 + 5 * k, y5),
        line(-R1 - 5 * k, d1, R1 + 5 * k, d1),
      ].join(" ")}
      fill="none"
      stroke={C.ink3}
      strokeWidth={0.5 * k}
      strokeDasharray={`${9 * k} ${2.2 * k} ${1.2 * k} ${2.2 * k}`}
    />
  );

  const label = tr.models.drawing.label({
    name: model.name,
    d1: fmt(d1),
    a2: fmt(a2),
    a3: fmt(a3),
    wrist: fmt(wr),
    reach: fmt(reach),
    gripper: tr.grippers[f.gripper].toLocaleLowerCase("tr"),
    load: tr.fields.kinds[demo.kind].toLocaleLowerCase("tr"),
    gap: fmt(px0),
  });

  return (
    <svg viewBox={vb} className={className} role="img" aria-label={label} style={{ fontFamily: "var(--pz-f-mono)" }}>
      <defs>
        <pattern id={`${id}-floor`} patternUnits="userSpaceOnUse" width={r1(4.5 * k)} height={r1(4.5 * k)} patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2={r1(4.5 * k)} stroke={C.ink3} strokeWidth={r1(0.6 * k)} />
        </pattern>
        <pattern id={`${id}-reach`} patternUnits="userSpaceOnUse" width={r1(7 * k)} height={r1(7 * k)} patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2={r1(7 * k)} stroke={C.line} strokeWidth={r1(0.5 * k)} />
        </pattern>
      </defs>

      {/* reach envelope */}
      <g className="pz-el-fade" style={delay(1000)}>
        <path d={`M ${P(0, 0)} L ${P(xf, 0)} A ${r1(reach)} ${r1(reach)} 0 0 0 ${P(0, d1 + reach)} Z`} fill={`url(#${id}-reach)`} opacity="0.55" />
      </g>
      <g style={delay(150)}>
        <path
          d={`M ${P(xf, 0)} A ${r1(reach)} ${r1(reach)} 0 1 0 ${P(-xf, 0)}`}
          fill="none"
          {...detail}
          className="pz-el-ln pz-el-arc"
          stroke={C.line}
          strokeWidth={0.9 * k}
        />
      </g>

      {/* floor */}
      <g style={delay(0)}>
        <path d={box(-LEFT + 6 * k, -7 * k, RIGHT - 6 * k, 0)} fill={`url(#${id}-floor)`} stroke="none" className="pz-el-fade" />
        <path d={line(-LEFT + 6 * k, 0, RIGHT - 6 * k, 0)} {...ln} strokeWidth={1.4 * k} fill="none" />
      </g>

      {/* pallet station and the layers already placed */}
      <g style={delay(80)}>
        <path d={box(px0, 0, px1, 22)} fill={C.wood} {...detail} />
        {[px0, pcx - 72.5, px1 - 145].map((bx) => (
          <path key={bx} d={box(bx, 22, bx + 145, 100)} fill={C.wood} {...detail} />
        ))}
        <path d={box(px0, 100, px1, 122)} fill={C.wood} {...detail} />
        <path d={box(px0, 122, px1, PALLET_DECK)} fill={C.wood} {...detail} />
        {Array.from({ length: layers }, (_, l) =>
          Array.from({ length: perRow }, (_, i) => {
            const x0 = pcx - (perRow * demo.g) / 2 + i * demo.g;
            return product(x0, x0 + demo.g, PALLET_DECK + l * demo.y, demo.y, `l${l}-${i}`, true);
          }),
        )}
      </g>

      {/* hose with its clips, behind the arm */}
      <g style={delay(650)}>
        <path d={smooth(hosePts)} fill="none" {...ln} stroke={C.rubber} strokeWidth={22} strokeLinecap="round" />
        <path d={smooth(hosePts)} fill="none" stroke="#6b7075" strokeWidth={5} strokeLinecap="round" className="pz-el-fade" />
        {clips.map((d, i) => (
          <path key={i} d={d} {...ln} stroke={C.ink} strokeWidth={9} strokeLinecap="butt" fill="none" />
        ))}
      </g>

      {/* upper arm, shoulder and base */}
      <g style={delay(220)}>
        <path d={tube([0, d1], [0, yE], r * 1.02, r * 0.84)} fill={C.paint} {...ln} />
        <path d={tube([0, d1], [0, yE], r * 1.02, r * 0.84, -0.38, -1)} fill={C.shade} stroke="none" />
        <g transform={`translate(${P(0, d1 + a2 * 0.5)}) rotate(-90)`} fontSize={r1(Math.min(7.5 * k, r * 1.05))} className="pz-el-fade">
          <text x={r1(-3 * k)} y={r1(0.36 * Math.min(7.5 * k, r * 1.05))} textAnchor="end" fontFamily="var(--pz-f-sans)" fontWeight="800" fill={C.ink}>
            PAZI
          </text>
          <rect x={r1(-0.6 * k)} y={r1(-0.4 * Math.min(7.5 * k, r * 1.05))} width={r1(1.2 * k)} height={r1(0.8 * Math.min(7.5 * k, r * 1.05))} fill={C.yellow} />
          <text x={r1(3 * k)} y={r1(0.36 * Math.min(7.5 * k, r * 1.05))} fill={C.ink3}>
            {model.name}
          </text>
        </g>
      </g>
      <g style={delay(120)}>
        <path d={rbox(-R1 * 1.42, 0, R1 * 1.42, 22, 5)} fill={C.hub} {...ln} />
        {[0, 1, 2, 3, 4, 5, 6, 7]
          .map((i) => (i / 8) * Math.PI * 2 + 0.2)
          .filter((a) => Math.sin(a) >= 0)
          .map((a) => {
            const bx = Math.cos(a) * R1 * 1.24;
            return <path key={a} d={box(bx - 7.5, 22, bx + 7.5, 30)} fill={C.metal} {...detail} />;
          })}
        <path d={box(-R1, 22, R1, d1)} fill={C.paint} {...ln} />
        <path d={box(R1 * 0.38, 22, R1, d1)} fill={C.shade} stroke="none" />
        <path d={box(-R1 - 0.5, 22 + (d1 - 22) * 0.28, R1 + 0.5, 36 + (d1 - 22) * 0.28)} fill={C.cap} {...detail} />
        {cap(0, d1, R1)}
      </g>

      {/* forearm (nearer the viewer than the upper arm) and elbow */}
      <g style={delay(360)}>
        <path d={tube([0, yE], [a3, yE], r * 0.88, r * 0.64)} fill={C.paint} {...ln} />
        <path d={tube([0, yE], [a3, yE], r * 0.88, r * 0.64, -0.38, -1)} fill={C.shade} stroke="none" />
        {cap(0, yE, R2)}
      </g>

      {/* wrist: J4 housing, neck, J5 across, J6 down to the tool flange */}
      <g style={delay(470)}>
        <path d={box(a3 - R3 * 0.92, y5, a3 + R3 * 0.92, yE)} fill={C.paint} {...ln} />
        <path d={box(a3 + R3 * 0.3, y5, a3 + R3 * 0.92, yE)} fill={C.shade} stroke="none" />
        <path d={box(a3 - R3 * 0.9, y6 - w3h, a3 + R3 * 0.9, y6)} fill={C.paint} {...ln} />
        <path d={box(a3 + R3 * 0.3, y6 - w3h, a3 + R3 * 0.9, y6)} fill={C.shade} stroke="none" />
        <path d={box(a3 - R3 * 0.915, y6 - w3h * 0.62 - 4, a3 + R3 * 0.915, y6 - w3h * 0.62 + 4)} fill={C.yellow} {...detail} />
        <path d={box(a3 - R3 * 0.62, yF, a3 + R3 * 0.62, yF + 12)} fill={C.metal} {...detail} />
        <path d={rbox(a3 - R3, y5 - R3, a3 + R3, y5 + R3, R3 * 0.16)} fill={C.paint} {...ln} />
        <path d={box(a3 + R3 * 0.3, y5 - R3, a3 + R3 * 0.98, y5 + R3)} fill={C.shade} stroke="none" />
        <path d={box(a3 + R3 - 7, y5 - R3 * 0.86, a3 + R3, y5 + R3 * 0.86)} fill={C.cap} {...detail} />
        {cap(a3, yE, R3)}
      </g>

      {/* gripper */}
      <g style={delay(580)}>
        <path d={poly([[a3 - 40, yF], [a3 + 40, yF], [a3 + 45, yF - 30], [a3 - 45, yF - 30]])} fill={C.hub} {...detail} />
        {claw ? (
          <>
            <path d={rbox(a3 - clawW * 0.4, yF - 53, a3 + clawW * 0.4, yF - 17, 18)} fill={C.metal} {...detail} />
            <path d={rbox(a3 - clawW / 2, yF - 70, a3 + clawW / 2, yF - 30, 6)} fill={C.alu} {...ln} />
            <path d={line(a3 - clawW / 2 + 10, yF - 50, a3 + clawW / 2 - 10, yF - 50)} stroke={C.ink3} strokeWidth={fine} />
            <path d={rbox(a3 - 25, yF - 115, a3 + 25, yF - 65, 6)} fill={C.hub} {...detail} />
            <path d={box(a3 - clawW * 0.35, yF - 124, a3 + clawW * 0.35, yF - 112)} fill={C.cap} {...detail} />
          </>
        ) : (
          <>
            <path d={rbox(a3 - 145, yF - 37, a3 - 100, yF - 13, 4)} fill={C.metal} {...detail} />
            <path d={rbox(a3 - 105, yF - 47.5, a3 - 35, yF - 2.5, 6)} fill={C.rubber} {...detail} />
            {(() => {
              const pw = f.double ? Math.max(240, 2 * demo.u * 0.86) : Math.max(200, demo.g * 0.82);
              return (
                <>
                  <path d={box(a3 - pw * 0.45, yF - 72, a3 + pw * 0.45, yF - 32)} fill={C.alu} {...ln} />
                  <path d={rbox(a3 - 22.5, yF - 77.5, a3 + 22.5, yF - 32.5, 4)} fill={C.alu} {...detail} />
                  <path d={`${line(a3 - 12, yF - 32.5, a3 - 12, yF - 40)} ${line(a3 + 12, yF - 32.5, a3 + 12, yF - 40)}`} stroke={C.ink} strokeWidth={fine} />
                  <path d={box(a3 - pw / 2, yF - 90, a3 + pw / 2, yF - 78)} fill={C.hub} {...detail} />
                  <path d={rbox(a3 - pw * 0.49, yF - 112, a3 + pw * 0.49, yF - 90, 6)} fill={C.rubber} {...detail} />
                </>
              );
            })()}
          </>
        )}
      </g>

      {/* carried product; the claw's tines close round it */}
      <g style={delay(690)}>
        {items.map(([x0, x1], i) => product(x0, x1, hold - demo.y, demo.y, `c${i}`))}
        {claw
          ? [-1, 1].map((side) => {
              const pv: Pt = [a3 + (side * clawW) / 2, yF - 70];
              const a = side * 0.05;
              const tine = poly(([[-6, 10], [6, 10], [6, -190], [-6, -190]] as Pt[]).map((p) => rot(p, pv, a)));
              const fx = -side * 50;
              const foot = poly(([[fx - 50, -182], [fx + 50, -182], [fx + 50, -190], [fx - 50, -190]] as Pt[]).map((p) => rot(p, pv, a)));
              return (
                <g key={side}>
                  <path d={tine} fill={C.metal} {...ln} />
                  <path d={foot} fill={C.metal} {...detail} />
                  <path d={circ(pv[0], pv[1], 9)} fill={C.hub} {...detail} />
                </g>
              );
            })
          : null}
      </g>

      {/* centre lines and axis marks */}
      <g className="pz-el-fade" style={delay(950)}>
        {centre}
      </g>

      {labels ? (
        <g className="pz-el-dim pz-el-fade" style={delay(1050)} stroke={C.ink2} strokeWidth={fine} fill={C.ink2} fontSize={r1(fs)}>
          <g fill="none">
            <path d={ext(-R1 - 2 * k, d1, xA - 2.5 * k, d1)} />
            <path d={ext(-R2 - 2 * k, yE, xA - 2.5 * k, yE)} />
            <path d={ext(0, yE + R2 + 2 * k, 0, yH + 2.5 * k)} />
            <path d={ext(a3, yE + R3 + 2 * k, a3, yH + 2.5 * k)} />
            <path d={ext(a3 + R3 + 2 * k, yE, xW + 2.5 * k, yE)} />
            <path d={ext(a3 + R3 * 0.62 + 2 * k, yF, xW + 2.5 * k, yF)} />
            <path d={ext(px0, -8 * k, px0, yS - 2.5 * k)} />
            <path d={ext(px1, -8 * k, px1, yS - 2.5 * k)} />
            <path d={line(r1(reach - 14 * k) * rx, d1 + r1(reach - 14 * k) * ry, reach * rx, d1 + reach * ry)} />
          </g>
          <g stroke="none">
            {dimV("d1", xA, 0, d1, fmt(d1))}
            {dimV("a2", xA, d1, yE, fmt(a2))}
            {dimH("a3", yH, 0, a3, fmt(a3))}
            {dimV("w", xW, yF, yE, fmt(wr), true)}
            {dimH("gap", yS, 0, px0, fmt(px0), true)}
            {dimH("pw", yS, px0, px1, fmt(PALLET_W), true)}
            <path d={arrow(reach * rx, d1 + reach * ry, rx, ry)} className="pz-el-arrow" />
            <text x={r1((reach + 4 * k) * rx + 2 * k)} y={r1(-(d1 + (reach + 4 * k) * ry))} fontSize={r1(fs * 1.05)} fill={C.ink}>
              {`R ${fmt(reach)}`}
            </text>
          </g>
        </g>
      ) : null}

      {/* title block */}
      <g className="pz-el-fade" style={delay(1150)}>
        <path d={box(tbX, tbY - tbH, tbX + tbW, tbY)} fill={C.panel} stroke={C.ink} strokeWidth={0.9 * k} />
        <path d={`${line(tbX, tbY - 21 * k, tbX + tbW, tbY - 21 * k)} ${line(tbX, tbY - 34 * k, tbX + tbW, tbY - 34 * k)}`} stroke={C.ink} strokeWidth={0.5 * k} />
        <text x={r1(tbX + 5 * k)} y={r1(-(tbY - 15.5 * k))} fontFamily="var(--pz-f-sans)" fontWeight="860" fontSize={r1(13 * k)} fill={C.ink}>
          {model.name}
        </text>
        <text x={r1(tbX + tbW - 5 * k)} y={r1(-(tbY - 14 * k))} fontFamily="var(--pz-f-sans)" fontWeight="700" fontSize={r1(8.5 * k)} fill={C.ink} textAnchor="end">
          {tr.models.drawing.view}
        </text>
        <text x={r1(tbX + 5 * k)} y={r1(-(tbY - 30 * k))} fontFamily="var(--pz-f-sans)" fontWeight="500" fontSize={r1(8 * k)} fill={C.ink2}>
          {`${tr.models.drawing.unit}, ${tr.models.drawing.sample}`}
        </text>
        {Array.from({ length: 5 }, (_, i) => (
          <rect
            key={i}
            x={r1(tbX + 5 * k + (i * scaleMm) / 5)}
            y={r1(-(tbY - 38 * k))}
            width={r1(scaleMm / 5)}
            height={r1(3 * k)}
            fill={i % 2 ? C.panel : C.ink}
            stroke={C.ink}
            strokeWidth={0.5 * k}
          />
        ))}
        <text x={r1(tbX + 5 * k)} y={r1(-(tbY - 47.5 * k))} fontSize={r1(7 * k)} fill={C.ink2}>
          0
        </text>
        <text x={r1(tbX + 5 * k + scaleMm)} y={r1(-(tbY - 47.5 * k))} fontSize={r1(7 * k)} fill={C.ink2} textAnchor="end">
          {`${fmt(scaleMm)} mm`}
        </text>
      </g>
    </svg>
  );
}
