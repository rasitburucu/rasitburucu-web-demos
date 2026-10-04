"use client";

// Vector version of the cell: the same layer plan, drawn in true isometric
// projection. Shown on devices without (capable) WebGL, before the canvas has
// its first frame, and in print. No animation loop; products drop in with CSS
// when the configuration changes (off under reduced motion).

import { useMemo } from "react";
import { fit, palletSize, PALLET_DECK, STATION_GAP_M, type Config } from "@/lib/pazi/plan";
import { useCell } from "@/lib/pazi/store";
import { depthSort, type Aabb } from "@/lib/pazi/iso-depth";

const C30 = Math.cos(Math.PI / 6);
const S30 = 0.5;
const S = 100; // px per metre

type P = [number, number];
const iso = (x: number, y: number, z: number): P => [(x - z) * C30 * S, (x + z) * S30 * S - y * S];
const pts = (a: P[]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

/** The three visible faces of an axis-aligned box (min corner x0,y0,z0, size w,h,d). */
function boxFaces(x0: number, y0: number, z0: number, w: number, h: number, d: number) {
  const x1 = x0 + w;
  const y1 = y0 + h;
  const z1 = z0 + d;
  return {
    top: pts([iso(x0, y1, z0), iso(x1, y1, z0), iso(x1, y1, z1), iso(x0, y1, z1)]),
    right: pts([iso(x1, y0, z0), iso(x1, y1, z0), iso(x1, y1, z1), iso(x1, y0, z1)]),
    front: pts([iso(x0, y0, z1), iso(x1, y0, z1), iso(x1, y1, z1), iso(x0, y1, z1)]),
  };
}

/** Axis-aligned bounds of a Box (centre x/z, base y). */
const bounds = (x: number, y: number, z: number, w: number, h: number, d: number): Aabb => ({ x0: x - w / 2, x1: x + w / 2, y0: y, y1: y + h, z0: z - d / 2, z1: z + d / 2 });

function Box({ x, y, z, w, h, d, tone, i }: { x: number; y: number; z: number; w: number; h: number; d: number; tone: [string, string, string]; i?: number }) {
  const f = boxFaces(x - w / 2, y, z - d / 2, w, h, d);
  return (
    <g className={i !== undefined ? "pz-iso-drop" : undefined} style={i !== undefined ? ({ "--i": i } as React.CSSProperties) : undefined}>
      <polygon points={f.right} fill={tone[1]} />
      <polygon points={f.front} fill={tone[2]} />
      <polygon points={f.top} fill={tone[0]} />
    </g>
  );
}

const CARD: [string, string, string] = ["#d6b285", "#b48a5c", "#9f7a4f"];
const BAG: [string, string, string] = ["#efede6", "#d4d2ca", "#c3c1b9"];
const SHRINK: [string, string, string] = ["#b9ccd4", "#93abb6", "#7f98a4"];
const WOOD: [string, string, string] = ["#cdb18a", "#a88e68", "#957c58"];
const STEEL: [string, string, string] = ["#c7cacc", "#9fa3a6", "#8c9093"];
const PAINT: [string, string, string] = ["#f0f0ec", "#d2d3ce", "#bfc0bb"];
const GRAPHITE: [string, string, string] = ["#4a4e51", "#34383a", "#2a2d2f"];
const PEDESTAL: [string, string, string] = ["#dcddd8", "#bfc1bc", "#aeb0ab"];

type Placed = { x: number; y: number; z: number; w: number; d: number; k: number };

export function IsoCell({ config: override }: { config?: Config }) {
  const stored = useCell((s) => s.config);
  const lock = useCell((s) => s.lock);
  const zone = useCell((s) => s.zone);
  const config = override ?? stored;
  const f = useMemo(() => fit(config, lock), [config, lock]);
  const { L: Lmm, W: Wmm } = palletSize(config);
  const L = Lmm / 1000;
  const W = Wmm / 1000;
  const u = config.u / 1000;
  const g = config.g / 1000;
  const y = config.y / 1000;
  const lh = f.stack.layerH / 1000;
  const deck = PALLET_DECK / 1000;
  const tone = config.kind === "torba" ? BAG : config.kind === "shrink" ? SHRINK : CARD;
  const fillLayers = Math.max(1, Math.ceil(f.stack.layers * 0.6));

  const stations = [1, -1].map((side) => {
    const cx = side * (STATION_GAP_M + W / 2);
    const boxes: Placed[] = [];
    const layers = side === 1 ? fillLayers : Math.min(1, f.stack.layers);
    for (let k = 0; k < layers; k++) {
      const layer = f.plan.layers[k % 2];
      for (const s of layer) {
        boxes.push({ x: cx + side * (s.x / 1000), y: deck + k * lh, z: s.z / 1000, w: s.turned ? u : g, d: s.turned ? g : u, k });
      }
    }
    return { cx, boxes };
  });

  // zones
  const ex = STATION_GAP_M + W + 0.32;
  const ez = L / 2 + 0.36;
  const rect = (hx: number, hz: number) => pts([iso(-hx, 0, -hz), iso(hx, 0, -hz), iso(hx, 0, hz), iso(-hx, 0, hz)]);

  // conveyor
  const cw = Math.max(0.5, g + 0.14);
  const convFaces = boxFaces(-cw / 2, 0.64, -3.4, cw, 0.1, 3.4 - 0.42);
  const convBoxes = [0, 1, 2].map((k) => -0.42 - u / 2 - k * (u + 0.004) - k * 0.3);

  // robot: a schematic arm in the same pose family as the 3D one, reaching over the first station
  const riserH = 0.62;
  const link = (f.model ?? { link: { d1: 0.236, a2: 0.75, a3: 0.62 } }).link;
  // the target is the nearest box of the top layer
  const top = stations[0].boxes.reduce((m, b) => Math.max(m, b.k), -1);
  const last = stations[0].boxes.filter((b) => b.k === top).reduce<Placed | undefined>((m, b) => (!m || b.x + b.z >= m.x + m.z ? b : m), undefined);
  const tx = last ? last.x * 0.9 : 0.8;
  const tz = last ? last.z * 0.9 : 0;
  const ty = (last ? last.y + y : deck) + 0.34;
  const shoulder: [number, number, number] = [0, riserH + link.d1, 0];
  const reach = Math.hypot(tx, tz);
  const dir = [tx / (reach || 1), tz / (reach || 1)];
  const elbow: [number, number, number] = [dir[0] * reach * 0.32, shoulder[1] + link.a2 * 0.82, dir[1] * reach * 0.32];
  const wrist: [number, number, number] = [tx, ty, tz];
  const sh = iso(...shoulder);
  const elP = iso(...elbow);
  const wrP = iso(...wrist);
  const toolP = iso(tx, ty - 0.2, tz);
  const all = [iso(-ex - 1, 0, -3.6), iso(ex + 1, 0, ez + 1), iso(-ex - 1, 0, ez + 1), iso(ex + 1, 0, -3.6), iso(0, 2.2, 0)];
  const minX = Math.min(...all.map((p) => p[0]));
  const maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1]));
  const maxY = Math.max(...all.map((p) => p[1]));

  // Everything that stands in the cell goes into one depth-sorted list, so a
  // nearer pallet covers the pedestal behind it and the arm is drawn over what
  // it reaches above (see lib/pazi/iso-depth.ts).
  const pad = 0.08; // joint caps are wider than the link they sit on
  const span = (a: number, b: number): [number, number] => [Math.min(a, b) - pad, Math.max(a, b) + pad];
  const [e0, e1] = span(elbow[0], wrist[0]);
  const [s0, s1] = span(0, elbow[0]);
  const [ez0, ez1] = span(elbow[2], wrist[2]);
  const [sz0, sz1] = span(0, elbow[2]);
  const gripKind = f.grip.family === "pence" ? STEEL : GRAPHITE;
  const scene: { key: string; box: Aabb; node: React.ReactNode }[] = [];
  stations.forEach((st, si) => {
    scene.push({ key: `deck${si}`, box: bounds(st.cx, 0, 0, W, deck, L), node: <Box x={st.cx} y={0} z={0} w={W} h={deck} d={L} tone={WOOD} /> });
    st.boxes.forEach((b, i) =>
      scene.push({ key: `p${si}-${i}`, box: bounds(b.x, b.y, b.z, b.w, y, b.d), node: <Box x={b.x} y={b.y} z={b.z} w={b.w} h={y} d={b.d} tone={tone} i={i} /> }),
    );
  });
  scene.push({
    key: "conveyor",
    box: { x0: -cw / 2, x1: cw / 2, y0: 0.64, y1: 0.74, z0: -3.4, z1: -0.42 },
    node: (
      <g>
        <polygon points={convFaces.right} fill={STEEL[1]} />
        <polygon points={convFaces.front} fill={STEEL[2]} />
        <polygon points={convFaces.top} fill={STEEL[0]} />
      </g>
    ),
  });
  convBoxes.forEach((cz) => scene.push({ key: `cb${cz}`, box: bounds(0, 0.74, cz, g, y, u), node: <Box x={0} y={0.74} z={cz} w={g} h={y} d={u} tone={tone} /> }));
  scene.push({ key: "pedestal", box: bounds(0, 0, 0, 0.28, riserH, 0.28), node: <Box x={0} y={0} z={0} w={0.28} h={riserH} d={0.28} tone={PEDESTAL} /> });
  scene.push({ key: "riser", box: bounds(0, riserH, 0, 0.24, link.d1, 0.24), node: <Box x={0} y={riserH} z={0} w={0.24} h={link.d1} d={0.24} tone={PAINT} /> });
  // matte white arm: lower link with the shoulder cap, upper link with elbow, wrist and the tool post
  scene.push({
    key: "arm1",
    box: { x0: s0, x1: s1, y0: shoulder[1] - pad, y1: elbow[1] + pad, z0: sz0, z1: sz1 },
    node: (
      <g>
        <g strokeLinecap="round" strokeLinejoin="round" fill="none">
          <polyline points={pts([sh, elP])} strokeWidth="27" stroke="#8f918b" />
          <polyline points={pts([sh, elP])} strokeWidth="24" stroke="#f0f0ec" />
        </g>
        <Joint p={sh} big />
      </g>
    ),
  });
  scene.push({
    key: "arm2",
    // its floor is the bottom of the tool post, so the tool plate under it is drawn first
    box: { x0: e0, x1: e1, y0: ty - 0.2, y1: Math.max(elbow[1], ty) + pad, z0: ez0, z1: ez1 },
    node: (
      <g>
        <g strokeLinecap="round" strokeLinejoin="round" fill="none">
          <polyline points={pts([elP, wrP])} strokeWidth="27" stroke="#8f918b" />
          <polyline points={pts([elP, wrP])} strokeWidth="24" stroke="#f0f0ec" />
          <polyline points={pts([wrP, toolP])} strokeWidth="18" stroke="#8f918b" />
          <polyline points={pts([wrP, toolP])} strokeWidth="15" stroke="#f0f0ec" />
        </g>
        <Joint p={elP} />
        <Joint p={wrP} />
      </g>
    ),
  });
  // the tool, at the size the fit gave it (lib/pazi/gripper.ts)
  scene.push({
    key: "tool",
    box: bounds(tx, ty - 0.235, tz, f.grip.plate.w / 1000, 0.035, f.grip.plate.l / 1000),
    node: <Box x={tx} y={ty - 0.235} z={tz} w={f.grip.plate.w / 1000} h={0.035} d={f.grip.plate.l / 1000} tone={gripKind} />,
  });

  return (
    <svg className="pz-iso" viewBox={`${minX.toFixed(0)} ${minY.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(maxY - minY).toFixed(0)}`} preserveAspectRatio="xMidYMid meet" role="presentation">
      <polygon points={rect(ex + 0.95, ez + 0.95)} fill="none" stroke="#f5a800" strokeWidth="5" strokeLinejoin="round" />
      {/* stop zone: plain yellow band at rest; the black/yellow hazard only while someone is inside */}
      <polygon points={rect(ex, ez)} fill="none" stroke="#f5a800" strokeWidth="6" strokeLinejoin="round" />
      {zone !== "out" ? <polygon points={rect(ex, ez)} fill="none" stroke="#151615" strokeWidth="6" strokeDasharray="10 8" strokeLinejoin="round" /> : null}
      {stations.map((st, si) => (
        <polygon
          key={si}
          points={pts([iso(st.cx - W / 2 - 0.08, 0, -L / 2 - 0.08), iso(st.cx + W / 2 + 0.08, 0, -L / 2 - 0.08), iso(st.cx + W / 2 + 0.08, 0, L / 2 + 0.08), iso(st.cx - W / 2 - 0.08, 0, L / 2 + 0.08)])}
          fill="none"
          stroke="#f5a800"
          strokeWidth="4"
        />
      ))}
      {depthSort(scene).map((it) => (
        <g key={it.key}>{it.node}</g>
      ))}
    </svg>
  );
}

function Joint({ p, big }: { p: P; big?: boolean }) {
  return (
    <g>
      <circle cx={p[0]} cy={p[1]} r={big ? 15 : 13} fill="#f0f0ec" stroke="#8f918b" strokeWidth="1.5" />
      <circle cx={p[0]} cy={p[1]} r={big ? 9 : 7.5} fill="#2a2d2f" stroke="#9a9ea2" strokeWidth="1.2" />
    </g>
  );
}
