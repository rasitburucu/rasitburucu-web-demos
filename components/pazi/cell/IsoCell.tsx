"use client";

// Vector version of the cell: the same layer plan, drawn in true isometric
// projection. Shown on devices without (capable) WebGL, before the canvas has
// its first frame, and in print. No animation loop; products drop in with CSS
// when the configuration changes (off under reduced motion).

import { useMemo } from "react";
import { fit, palletSize, PALLET_DECK, STATION_GAP_M, type Config } from "@/lib/pazi/plan";
import { useCell } from "@/lib/pazi/store";

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

export function IsoCell({ config: override }: { config?: Config }) {
  const stored = useCell((s) => s.config);
  const lock = useCell((s) => s.lock);
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
    const boxes: { x: number; y: number; z: number; w: number; d: number; k: number }[] = [];
    const layers = side === 1 ? fillLayers : Math.min(1, f.stack.layers);
    for (let k = 0; k < layers; k++) {
      const layer = f.plan.layers[k % 2];
      for (const s of layer) {
        boxes.push({ x: cx + side * (s.x / 1000), y: deck + k * lh, z: s.z / 1000, w: s.turned ? u : g, d: s.turned ? g : u, k });
      }
    }
    // painter's order: by layer, then back to front
    boxes.sort((a, b) => a.k - b.k || a.x + a.z - (b.x + b.z));
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
  const last = stations[0].boxes[stations[0].boxes.length - 1];
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

  return (
    <svg className="pz-iso" viewBox={`${minX.toFixed(0)} ${minY.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(maxY - minY).toFixed(0)}`} preserveAspectRatio="xMidYMid meet" role="presentation">
      <polygon points={rect(ex + 0.95, ez + 0.95)} fill="none" stroke="#f5a800" strokeWidth="5" strokeLinejoin="round" />
      <polygon points={rect(ex, ez)} fill="none" stroke="#151615" strokeWidth="6" strokeDasharray="10 8" strokeLinejoin="round" />
      <polygon points={rect(ex, ez)} fill="none" stroke="#f5a800" strokeWidth="6" strokeDasharray="10 8" strokeDashoffset="9" strokeLinejoin="round" />
      {stations.map((st, si) => (
        <g key={si}>
          <polygon
            points={pts([iso(st.cx - W / 2 - 0.08, 0, -L / 2 - 0.08), iso(st.cx + W / 2 + 0.08, 0, -L / 2 - 0.08), iso(st.cx + W / 2 + 0.08, 0, L / 2 + 0.08), iso(st.cx - W / 2 - 0.08, 0, L / 2 + 0.08)])}
            fill="none"
            stroke="#f5a800"
            strokeWidth="4"
          />
          <Box x={st.cx} y={0} z={0} w={W} h={deck} d={L} tone={WOOD} />
          {st.boxes.map((b, i) => (
            <Box key={`${b.x}-${b.y}-${b.z}`} x={b.x} y={b.y} z={b.z} w={b.w} h={y} d={b.d} tone={tone} i={i} />
          ))}
        </g>
      ))}
      <g>
        <polygon points={convFaces.right} fill={STEEL[1]} />
        <polygon points={convFaces.front} fill={STEEL[2]} />
        <polygon points={convFaces.top} fill={STEEL[0]} />
        {convBoxes.map((z) => (
          <Box key={z} x={0} y={0.74} z={z} w={g} h={y} d={u} tone={tone} />
        ))}
      </g>
      <Box x={0} y={0} z={0} w={0.28} h={riserH} d={0.28} tone={GRAPHITE} />
      <Box x={0} y={riserH} z={0} w={0.2} h={link.d1} d={0.2} tone={PAINT} />
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        <polyline points={pts([sh, elP, wrP])} strokeWidth="19" stroke="#151615" />
        <polyline points={pts([sh, elP, wrP])} strokeWidth="15" stroke="#eeeeea" />
        <polyline points={pts([wrP, toolP])} strokeWidth="13" stroke="#151615" />
        <polyline points={pts([wrP, toolP])} strokeWidth="9" stroke="#eeeeea" />
      </g>
      {[sh, elP, wrP].map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === 0 ? 12 : 10} fill="#2a2d2f" stroke="#9a9ea2" strokeWidth="1.5" />
      ))}
      <rect x={toolP[0] - 18} y={toolP[1]} width="36" height="9" fill="#3d4145" stroke="#151615" />
    </svg>
  );
}
