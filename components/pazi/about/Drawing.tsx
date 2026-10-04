// The teardown as a technical drawing: side elevation of the P30 in the same
// pose, colours and line weights as ui/Elevation.tsx, every service module in
// its own group. Used when WebGL is missing or weak, and as the first paint
// before three.js arrives. The groups nest like the arm's kinematic chain, so
// moving a proximal module carries the distal ones with it; Teardown.tsx sets
// each group's translation from the same timeline as the 3D scene.

import type { ReactNode } from "react";
import { MODELS } from "@/lib/pazi/plan";
import { sizeGripper } from "@/lib/pazi/gripper";
import type { PartId } from "./model";

type Pt = [number, number];

const spec = MODELS.find((m) => m.id === "p30") ?? MODELS[MODELS.length - 1];
const d1 = spec.link.d1 * 1000;
const a2 = spec.link.a2 * 1000;
const a3 = spec.link.a3 * 1000;
const wr = spec.link.wrist * 1000;
const r = spec.link.r * 1000;
const R1 = r * 1.28;
const R2 = r * 1.06;
const R3 = r * 0.78;
const yE = d1 + a2;
const h1 = wr * 0.42;
const y5 = yE - h1;
const y6 = y5 - R3 * 0.62;
const yF = yE - wr;
const w3h = y6 - yF - 12;
// the claw the fit sizes for the 25 kg bag (600 × 400 × 120 mm), as in the 3D scene
const claw = sizeGripper({ kind: "torba", u: 600, g: 400, y: 120, kg: 25 });
const clawW = claw.plate.w;
const tineD = claw.claw?.depth ?? 186;
// the control box stands clear of the claw once the wrist and claw have come off to the right
const CTRL = { x0: 1090, x1: 1350, y0: 60, y1: 680 };
const SCAN_X = -470;

/** viewBox in drawing units (mm), y flipped. */
export const VIEW = { x: -600, y: -1440, w: 2080, h: 1490 };

/** Direction of the J2 axis drawn obliquely (towards the viewer): shoulder internals travel along it. */
const OB: Pt = [-0.87, 0.5];

/** Full-out travel of each module (mm, y up), in its parent group. */
export const TRAVEL: Record<PartId, Pt> = {
  hose: [-150, 70],
  gripper: [0, -230],
  toolFlange: [0, -95],
  wrist: [130, 0],
  forearm: [170, 0],
  elbow: [0, 170],
  upperArm: [0, 100],
  shoulderCover: [OB[0] * 390, OB[1] * 390],
  brake: [OB[0] * 295, OB[1] * 295],
  motor: [OB[0] * 200, OB[1] * 200],
  gearbox: [OB[0] * 110, OB[1] * 110],
  base: [0, 110],
  mount: [0, 70],
  controller: [110, 0],
  scanner: [0, 110],
};

/** The J5/J6 piece drops off the J4 housing while the wrist comes off (same amount). */
export const WRIST_LOWER: Pt = [0, -45];

/** Which modules carry each part (proximal first), the part itself last. */
export const CHAIN: Record<PartId, PartId[]> = {
  hose: ["hose"],
  gripper: ["mount", "base", "upperArm", "elbow", "forearm", "wrist", "toolFlange", "gripper"],
  toolFlange: ["mount", "base", "upperArm", "elbow", "forearm", "wrist", "toolFlange"],
  wrist: ["mount", "base", "upperArm", "elbow", "forearm", "wrist"],
  forearm: ["mount", "base", "upperArm", "elbow", "forearm"],
  elbow: ["mount", "base", "upperArm", "elbow"],
  upperArm: ["mount", "base", "upperArm"],
  shoulderCover: ["mount", "base", "shoulderCover"],
  brake: ["mount", "base", "brake"],
  motor: ["mount", "base", "motor"],
  gearbox: ["mount", "base", "gearbox"],
  base: ["mount"],
  mount: [],
  controller: ["controller"],
  scanner: ["scanner"],
};

/** Label anchor of each part with the arm assembled (mm, y up). */
export const ANCHOR: Record<PartId, Pt> = {
  hose: [-r * 1.3, d1 + a2 * 0.5],
  gripper: [a3 + clawW / 2 - 20, yF - 50],
  toolFlange: [a3 + R3 * 0.62, yF + 6],
  wrist: [a3 + R3, y5],
  forearm: [a3 * 0.55, yE - r * 0.6],
  elbow: [R2 * 0.7, yE + R2 * 0.7],
  upperArm: [r * 0.9, d1 + a2 * 0.58],
  shoulderCover: [-R1 * 0.6, d1 + R1 * 0.6],
  brake: [-R1 * 0.45, d1 + R1 * 0.45],
  motor: [-R1 * 0.52, d1 + R1 * 0.52],
  gearbox: [-R1 * 0.6, d1 + R1 * 0.6],
  base: [R1, d1 * 0.55],
  mount: [R1 * 1.42, 11],
  controller: [(CTRL.x0 + CTRL.x1) / 2, (CTRL.y0 + CTRL.y1) / 2],
  scanner: [SCAN_X + 30, 150],
};

const C = {
  ink: "#151615",
  ink2: "#4a4d48",
  ink3: "#6a6d67",
  line: "#8d8f88",
  paint: "#e6e7e2",
  shade: "#cfd0ca",
  cap: "#2a2d2f",
  ring: "#9a9ea2",
  hub: "#6d7175",
  rubber: "#3d4145",
  metal: "#b9bcbf",
  alu: "#c6c9c5",
  graphite: "#34383a",
  yellow: "#f5a800",
  stop: "#b3321f",
  led: "#5fd38a",
};

const r1 = (v: number) => Math.round(v * 10) / 10;
const P = (x: number, y: number) => `${r1(x)} ${r1(-y)}`;
const poly = (pts: Pt[], close = true) => `M ${pts.map(([x, y]) => P(x, y)).join(" L ")}${close ? " Z" : ""}`;
const box = (x0: number, y0: number, x1: number, y1: number) => poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const line = (x0: number, y0: number, x1: number, y1: number) => `M ${P(x0, y0)} L ${P(x1, y1)}`;
const circ = (cx: number, cy: number, rad: number) =>
  `M ${r1(cx - rad)} ${r1(-cy)} a ${r1(rad)} ${r1(rad)} 0 1 0 ${r1(2 * rad)} 0 a ${r1(rad)} ${r1(rad)} 0 1 0 ${r1(-2 * rad)} 0 Z`;
function rbox(x0: number, y0: number, x1: number, y1: number, rad: number) {
  const q = r1(Math.min(rad, (x1 - x0) / 2, (y1 - y0) / 2));
  const [L, R, T, B] = [x0, x1, -y1, -y0].map(r1);
  return `M ${r1(L + q)} ${T} H ${r1(R - q)} A ${q} ${q} 0 0 1 ${R} ${r1(T + q)} V ${r1(B - q)} A ${q} ${q} 0 0 1 ${r1(R - q)} ${B} H ${r1(L + q)} A ${q} ${q} 0 0 1 ${L} ${r1(B - q)} V ${r1(T + q)} A ${q} ${q} 0 0 1 ${r1(L + q)} ${T} Z`;
}
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

/** A module's group; Teardown.tsx moves it by its id. */
function G({ id, children }: { id: PartId; children: ReactNode }) {
  return <g data-td={id}>{children}</g>;
}

export function TeardownDrawing({ label, renderWidth = 900 }: { label: string; renderWidth?: number }) {
  const k = VIEW.w / renderWidth; // mm per screen pixel
  const sw = 1.1 * k;
  const fine = 0.55 * k;
  const ln = { stroke: C.ink, strokeWidth: sw, strokeLinejoin: "round" as const };
  const detail = { stroke: C.ink, strokeWidth: fine, strokeLinejoin: "round" as const };

  const cap = (cx: number, cy: number, R: number, withHousing = true) => (
    <>
      {withHousing ? <path d={circ(cx, cy, R)} fill={C.paint} {...ln} /> : null}
      <path d={circ(cx, cy, R * 0.86)} fill={C.cap} {...detail} />
      <path d={circ(cx, cy, R * 0.8)} fill="none" stroke={C.ring} strokeWidth={fine} />
      <path d={circ(cx, cy, R * 0.32)} fill={C.hub} {...detail} />
    </>
  );

  const hosePts: Pt[] = [
    [R1 + 60, 18],
    [R1 + 10, 60],
    [-r * 1.25, d1 + a2 * 0.18],
    [-r * 1.2, d1 + a2 * 0.82],
    [-r * 0.98, yE + r * 0.98],
    [a3 * 0.2, yE + r * 1.05],
    [a3 * 0.85, yE + r * 0.95],
    [a3 - R3 * 1.1, y5],
    [a3 - 60, yF - 18],
  ];

  // dashed centre lines, one per travelling module (opacity follows the module)
  const guide = (id: PartId, from: Pt, dir: Pt, len: number) => (
    <path
      key={id}
      data-tg={id}
      d={line(from[0], from[1], from[0] + dir[0] * len, from[1] + dir[1] * len)}
      fill="none"
      stroke={C.ink3}
      strokeWidth={0.6 * k}
      strokeDasharray={`${9 * k} ${2.4 * k} ${1.4 * k} ${2.4 * k}`}
      opacity="0"
    />
  );

  return (
    <svg viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} className="pz-td-svg" role="img" aria-label={label} style={{ fontFamily: "var(--pz-f-mono)" }}>
      <defs>
        <pattern id="pz-td-floor" patternUnits="userSpaceOnUse" width={r1(4.5 * k)} height={r1(4.5 * k)} patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2={r1(4.5 * k)} stroke={C.ink3} strokeWidth={r1(0.6 * k)} />
        </pattern>
      </defs>

      {/* floor */}
      <path d={box(VIEW.x + 20, -8 * k, VIEW.x + VIEW.w - 20, 0)} fill="url(#pz-td-floor)" stroke="none" />
      <path d={line(VIEW.x + 20, 0, VIEW.x + VIEW.w - 20, 0)} {...ln} strokeWidth={1.4 * k} fill="none" />

      {/* centre lines behind everything */}
      <g className="pz-td-guides">
        {guide("shoulderCover", [0, d1], OB, 470)}
        {guide("gripper", [a3, yF], [0, -1], 420)}
        {guide("base", [0, 0], [0, 1], d1 + 200)}
        {guide("elbow", [0, yE], [0, 1], 160)}
        {guide("wrist", [a3 - R3, yE], [1, 0], 170)}
      </g>

      {/* cable line, behind the arm */}
      <G id="hose">
        <path d={smooth(hosePts)} fill="none" {...ln} stroke={C.rubber} strokeWidth={22} strokeLinecap="round" />
        <path d={smooth(hosePts)} fill="none" stroke="#6b7075" strokeWidth={5} strokeLinecap="round" />
      </G>

      {/* scanner */}
      <path d={rbox(SCAN_X - 70, 0, SCAN_X + 70, 30, 4)} fill={C.graphite} {...detail} />
      <G id="scanner">
        <path d={rbox(SCAN_X - 55, 30, SCAN_X + 55, 160, 12)} fill={C.yellow} {...ln} />
        <path d={`M ${P(SCAN_X - 46, 95)} A ${r1(46)} ${r1(46)} 0 0 1 ${P(SCAN_X + 46, 95)} Z`} fill="#0d0e0e" {...detail} />
      </G>

      {/* control box: drives and rail inside, the door slides off */}
      <g>
        {[CTRL.x0 + 30, CTRL.x1 - 30].map((x) => (
          <path key={x} d={box(x - 18, 0, x + 18, CTRL.y0)} fill={C.rubber} {...detail} />
        ))}
        <path d={rbox(CTRL.x0, CTRL.y0, CTRL.x1, CTRL.y1, 12)} fill={C.graphite} {...ln} />
        <path d={box(CTRL.x0 + 20, CTRL.y0 + 30, CTRL.x1 - 20, CTRL.y1 - 30)} fill={C.cap} {...detail} />
        {[0, 1, 2].map((i) => {
          const x = CTRL.x0 + 45 + i * 65;
          return (
            <g key={i}>
              <path d={rbox(x, CTRL.y0 + 290, x + 50, CTRL.y0 + 550, 4)} fill="#3d4145" {...detail} />
              <path d={circ(x + 38, CTRL.y0 + 530, 5)} fill={C.led} stroke="none" />
            </g>
          );
        })}
        <path d={rbox(CTRL.x0 + 40, CTRL.y0 + 110, CTRL.x1 - 40, CTRL.y0 + 150, 4)} fill={C.metal} {...detail} />
      </g>
      <G id="controller">
        <path d={rbox(CTRL.x0 + 6, CTRL.y0 + 6, CTRL.x1 - 6, CTRL.y1 - 6, 8)} fill={C.paint} {...ln} />
        <path d={box(CTRL.x0 + 40, CTRL.y1 - 120, CTRL.x0 + 160, CTRL.y1 - 70)} fill={C.hub} {...detail} />
        <path d={rbox(CTRL.x1 - 50, CTRL.y0 + 260, CTRL.x1 - 30, CTRL.y0 + 360, 4)} fill={C.cap} {...detail} />
        <path d={circ(CTRL.x1 - 75, CTRL.y1 - 110, 34)} fill={C.yellow} {...detail} />
        <path d={circ(CTRL.x1 - 75, CTRL.y1 - 110, 22)} fill={C.stop} {...detail} />
      </G>

      {/* the arm: mounting flange stays on the floor */}
      <path d={rbox(-R1 * 1.42, 0, R1 * 1.42, 22, 5)} fill={C.hub} {...ln} />
      {[0, 1, 2, 3, 4, 5, 6, 7]
        .map((i) => (i / 8) * Math.PI * 2 + 0.2)
        .filter((a) => Math.sin(a) >= 0)
        .map((a) => {
          const bx = Math.cos(a) * R1 * 1.24;
          return <path key={a} d={box(bx - 7.5, 22, bx + 7.5, 30)} fill={C.metal} {...detail} />;
        })}
      <G id="mount">
        {/* J1 base housing */}
        <path d={box(-R1, 22, R1, d1)} fill={C.paint} {...ln} />
        <path d={box(R1 * 0.38, 22, R1, d1)} fill={C.shade} stroke="none" />
        <path d={box(-R1 - 0.5, 22 + (d1 - 22) * 0.28, R1 + 0.5, 36 + (d1 - 22) * 0.28)} fill={C.cap} {...detail} />
        <G id="base">
          {/* upper arm chain first, so the shoulder face sits in front of it */}
          <G id="upperArm">
            <path d={tube([0, d1], [0, yE], r * 1.02, r * 0.84)} fill={C.paint} {...ln} />
            <path d={tube([0, d1], [0, yE], r * 1.02, r * 0.84, -0.38, -1)} fill={C.shade} stroke="none" />
            <g transform={`translate(${P(0, d1 + a2 * 0.5)}) rotate(-90)`} fontSize={r1(r * 0.9)}>
              <text x={-12} y={r1(r * 0.32)} textAnchor="end" fontFamily="var(--pz-f-sans)" fontWeight="800" fill={C.ink}>
                PAZI
              </text>
              <rect x={-3} y={r1(-r * 0.36)} width={6} height={r1(r * 0.72)} fill={C.yellow} />
              <text x={12} y={r1(r * 0.32)} fill={C.ink3}>
                {spec.name}
              </text>
            </g>
            <G id="elbow">
              <G id="forearm">
                <path d={tube([0, yE], [a3, yE], r * 0.88, r * 0.64)} fill={C.paint} {...ln} />
                <path d={tube([0, yE], [a3, yE], r * 0.88, r * 0.64, -0.38, -1)} fill={C.shade} stroke="none" />
                <G id="wrist">
                  <path d={box(a3 - R3 * 0.92, y5, a3 + R3 * 0.92, yE)} fill={C.paint} {...ln} />
                  <path d={box(a3 + R3 * 0.3, y5, a3 + R3 * 0.92, yE)} fill={C.shade} stroke="none" />
                  {cap(a3, yE, R3)}
                  <g data-td-lower="">
                    <path d={box(a3 - R3 * 0.9, y6 - w3h, a3 + R3 * 0.9, y6)} fill={C.paint} {...ln} />
                    <path d={box(a3 + R3 * 0.3, y6 - w3h, a3 + R3 * 0.9, y6)} fill={C.shade} stroke="none" />
                    <path d={box(a3 - R3 * 0.915, y6 - w3h * 0.62 - 4, a3 + R3 * 0.915, y6 - w3h * 0.62 + 4)} fill={C.yellow} {...detail} />
                    <path d={rbox(a3 - R3, y5 - R3, a3 + R3, y5 + R3, R3 * 0.16)} fill={C.paint} {...ln} />
                    <path d={box(a3 + R3 * 0.3, y5 - R3, a3 + R3 * 0.98, y5 + R3)} fill={C.shade} stroke="none" />
                    <path d={box(a3 + R3 - 7, y5 - R3 * 0.86, a3 + R3, y5 + R3 * 0.86)} fill={C.cap} {...detail} />
                    <G id="toolFlange">
                      <path d={box(a3 - R3 * 0.62, yF, a3 + R3 * 0.62, yF + 12)} fill={C.metal} {...detail} />
                      <path d={poly([[a3 - 40, yF], [a3 + 40, yF], [a3 + 45, yF - 30], [a3 - 45, yF - 30]])} fill={C.hub} {...detail} />
                      <G id="gripper">
                        <path d={rbox(a3 - clawW * 0.4, yF - 53, a3 + clawW * 0.4, yF - 30, 12)} fill={C.metal} {...detail} />
                        <path d={rbox(a3 - clawW / 2, yF - 70, a3 + clawW / 2, yF - 30, 6)} fill={C.alu} {...ln} />
                        <path d={line(a3 - clawW / 2 + 10, yF - 50, a3 + clawW / 2 - 10, yF - 50)} stroke={C.ink3} strokeWidth={fine} />
                        <path d={rbox(a3 - 25, yF - 115, a3 + 25, yF - 70, 6)} fill={C.hub} {...detail} />
                        <path d={box(a3 - clawW * 0.35, yF - 124, a3 + clawW * 0.35, yF - 112)} fill={C.cap} {...detail} />
                        {[-1, 1].map((side) => {
                          const px = a3 + (side * clawW) / 2;
                          const fx = -side * 50;
                          return (
                            <g key={side}>
                              <path d={box(px - 6, yF - 70 - tineD - 4, px + 6, yF - 60)} fill={C.metal} {...ln} />
                              <path d={box(px + fx - 50, yF - 70 - tineD - 4, px + fx + 50, yF - 70 - tineD + 4)} fill={C.metal} {...detail} />
                              <path d={circ(px, yF - 70, 9)} fill={C.hub} {...detail} />
                            </g>
                          );
                        })}
                      </G>
                    </G>
                  </g>
                </G>
              </G>
              {cap(0, yE, R2)}
            </G>
          </G>
          {/* shoulder housing (face on) with its internals behind the cover */}
          <path d={circ(0, d1, R1)} fill={C.paint} {...ln} />
          <G id="gearbox">
            <path d={circ(0, d1, R1 * 0.84)} fill={C.metal} {...ln} />
            <path d={circ(0, d1, R1 * 0.6)} fill={C.alu} {...detail} />
            <path d={poly(Array.from({ length: 6 }, (_, i) => [Math.cos((i / 6) * Math.PI * 2) * R1 * 0.34, d1 + Math.sin((i / 6) * Math.PI * 2) * R1 * 0.34] as Pt))} fill={C.hub} {...detail} />
          </G>
          <G id="motor">
            <path d={circ(0, d1, R1 * 0.74)} fill={C.graphite} {...ln} />
            <path d={circ(0, d1, R1 * 0.56)} fill="none" stroke={C.ring} strokeWidth={sw} />
            <path d={circ(0, d1, R1 * 0.12)} fill={C.metal} {...detail} />
          </G>
          <G id="brake">
            <path d={circ(0, d1, R1 * 0.66)} fill="#3d4145" {...ln} />
            <path d={circ(0, d1, R1 * 0.5)} fill={C.cap} {...detail} />
            <path d={circ(0, d1, R1 * 0.2)} fill={C.metal} {...detail} />
          </G>
          <G id="shoulderCover">{cap(0, d1, R1, false)}</G>
        </G>
      </G>
    </svg>
  );
}

/** Parts that sit inside the J5/J6 piece of the wrist. */
export const IN_WRIST_LOWER: PartId[] = ["toolFlange", "gripper"];
