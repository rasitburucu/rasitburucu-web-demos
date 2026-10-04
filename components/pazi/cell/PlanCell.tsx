"use client";

// The working cell drawn from above, at the scale of the safety plan (1 m = 100
// units): bags ride the conveyor to the stop, the arm comes down on one, grips
// it, lifts, swings over and sets it into the layer pattern on the pallet, then
// returns. When one pallet is full it is taken away and the arm carries on with
// the other. The arm is the same P30 the 3D cell runs (cell/layout.ts), solved
// for every frame and drawn as its top view: housings with end caps and parting
// lines, cast tubes, the claw with its fingers, and a shadow that grows with
// height. The operator's zone sets the speed: full, slowed, stopped (it brakes,
// it does not freeze). No three.js here: this ships with the home page.

import { useEffect, useMemo, useRef } from "react";
import { DEFAULT_CONFIG, PALLET_DECK, STATION_GAP_M, fit, type Config } from "@/lib/pazi/plan";
import type { Zone } from "@/lib/pazi/store";
import { armLayout, solveArm, type ArmPose } from "./layout";

const S = 100;
/** The demo job of the plan: the 25 kg bag the home page opens with, on a EUR pallet. */
const JOB: Config = { ...DEFAULT_CONFIG, kind: "torba", u: 600, g: 400, y: 120, kg: 25, rate: 5, shifts: 3, maxH: 1300 };
const PAL_W = 0.8;
const CONV_TOP = 0.74;
const CONV_END = -0.42;
const CONV_START = -3.05;
const BELT = 0.42;
const SPAWN = 3.6;
const HOVER = 0.12;
const PALLET_X = STATION_GAP_M + PAL_W / 2;
/** Tool centre over the front bag at the conveyor stop. */
const PICK_XZ = { x: 0, z: CONV_END - JOB.u / 2000 };

const minJerk = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (10 + x * (-15 + 6 * x));
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const f2 = (n: number) => n.toFixed(2);
const deg = (r: number) => (r * 180) / Math.PI;

type P3 = { x: number; y: number; z: number };
type Slot = { x: number; z: number; dx: number; dz: number; layer: number; turned: boolean };
type Phase = "wait" | "down" | "grip" | "up" | "carry" | "lower" | "release" | "rise" | "back";
const DUR: Record<Phase, number> = { wait: 0, down: 0.5, grip: 0.36, up: 0.42, carry: 1.55, lower: 0.5, release: 0.3, rise: 0.36, back: 1.3 };

/** Layer tint: higher layers lighter, so the stack height reads from above. */
const tint = (layer: number, layers: number) => {
  const k = layers > 1 ? layer / (layers - 1) : 1;
  const c = Math.round(lerp(196, 236, k));
  return `rgb(${c},${c - 2},${c - 8})`;
};

function Bag({ dx, dz, fill }: { dx: number; dz: number; fill?: string }) {
  // top of a woven bag: pinched seams at both ends, printed band, filling label
  const w = dx * S;
  const h = dz * S;
  const along = dz >= dx;
  return (
    <>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={Math.min(w, h) * 0.16} fill={fill ?? "#ecebe4"} stroke="#9a978c" strokeWidth="0.8" />
      {along ? (
        <>
          <rect x={-w / 2 + 2} y={-h * 0.08} width={w - 4} height={h * 0.16} fill="#555a55" />
          <rect x={w * 0.18} y={-h * 0.06} width={w * 0.12} height={h * 0.12} fill="#f5a800" />
          <line x1={-w / 2 + 3} x2={w / 2 - 3} y1={-h / 2 + 4} y2={-h / 2 + 4} stroke="#b9b6aa" strokeWidth="1" />
          <line x1={-w / 2 + 3} x2={w / 2 - 3} y1={h / 2 - 4} y2={h / 2 - 4} stroke="#b9b6aa" strokeWidth="1" />
        </>
      ) : (
        <>
          <rect x={-w * 0.08} y={-h / 2 + 2} width={w * 0.16} height={h - 4} fill="#555a55" />
          <rect x={-w * 0.06} y={h * 0.18} width={w * 0.12} height={h * 0.12} fill="#f5a800" />
          <line y1={-h / 2 + 3} y2={h / 2 - 3} x1={-w / 2 + 4} x2={-w / 2 + 4} stroke="#b9b6aa" strokeWidth="1" />
          <line y1={-h / 2 + 3} y2={h / 2 - 3} x1={w / 2 - 4} x2={w / 2 - 4} stroke="#b9b6aa" strokeWidth="1" />
        </>
      )}
    </>
  );
}

export function PlanCell({ zone }: { zone: Zone }) {
  const zoneRef = useRef<Zone>(zone);
  zoneRef.current = zone;
  const root = useRef<SVGGElement>(null);

  const job = useMemo(() => {
    const f = fit(JOB);
    const model = f.model!;
    const link = model.link;
    const lay = armLayout(link);
    const grip = f.grip;
    const py = JOB.y / 1000;
    const gH = 0.12;
    // the riser the 3D cell would choose for this job (engine.ts)
    const wPick = CONV_TOP + py + gH + link.wrist;
    const wLow = PALLET_DECK / 1000 + py + gH + link.wrist;
    const wHigh = f.stack.height / 1000 + gH + link.wrist;
    const base = Math.min(1.05, Math.max(0.34, (Math.max(wPick, wHigh) + Math.min(wLow, wPick)) / 2 - link.d1 - 0.12));
    // slots per station in placement order (far side first, like the cell)
    const stations = ([1, -1] as const).map((side) => {
      const slots: Slot[] = [];
      for (let k = 0; k < f.stack.layers; k++) {
        const layer = f.plan.layers[k % 2]
          .map((s) => ({ x: side * (PALLET_X + s.x / 1000), z: s.z / 1000, dx: s.dx / 1000, dz: s.dz / 1000, layer: k, turned: s.turned }))
          .sort((a, b) => Math.hypot(b.x, b.z) - Math.hypot(a.x, a.z) || a.z - b.z);
        slots.push(...layer);
      }
      return { side, slots };
    });
    return { f, link, lay, grip, py, gH, base, stations, layers: f.stack.layers, perLayer: f.plan.perLayer };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const { link, lay, grip, py, gH, base, stations, layers } = job;
    const q = (sel: string) => el.querySelector(sel) as SVGGraphicsElement | null;
    const qa = (sel: string) => Array.from(el.querySelectorAll(sel)) as SVGGraphicsElement[];
    const arm = q("[data-arm]")!;
    const parts = {
      upper: q("[data-upper]")!,
      elbow: q("[data-elbow]")!,
      fore: q("[data-fore]")!,
      w1: q("[data-w1]")!,
      w2: q("[data-w2]")!,
      tool: q("[data-tool]")!,
      hose: q("[data-hose]")!,
      led: q("[data-led]")!,
      lamp: q("[data-lamp]")!,
      shArm: q("[data-sh-arm]")!,
      shTool: q("[data-sh-tool]")!,
      shPath: q("[data-sh-path]")!,
      carried: q("[data-carried]")!,
      rollers: q("[data-rollers]")!,
    };
    const fingers = qa("[data-finger]");
    const conv = qa("[data-conv]");
    const placed = stations.map((_, s) => qa(`[data-slot="${s}"]`));
    const palletG = qa("[data-pallet]");
    const set = (e: Element, k: string, v: string) => e.setAttribute(k, v);

    // ---- state
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pose: ArmPose = { t1: 0, t2: 0, t3: 0, t6: 0 };
    const cur: P3 = { x: PICK_XZ.x, y: CONV_TOP + py + gH + HOVER, z: PICK_XZ.z };
    let yaw = 0;
    let open = 1;
    let carrying = false;
    let phase: Phase = "wait";
    let t = 0;
    let from: P3 = { ...cur };
    let to: P3 = { ...cur };
    let yawFrom = 0;
    let yawTo = 0;
    let station = 0;
    const count = [0, 0];
    const leaving = [-1, -1];
    let items: number[] = [CONV_END - JOB.u / 2000, CONV_END - JOB.u / 2000 - 0.66, -2.2];
    let spawn = SPAWN;
    let roll = 0;
    let speed = 1;

    // first pallet about half built, so the pattern reads at once
    const pre = Math.min(stations[0].slots.length, Math.ceil(layers * 0.5) * job.perLayer);
    count[0] = pre;

    const slotTop = (s: Slot) => PALLET_DECK / 1000 + (s.layer + 1) * py + gH;
    const chooseYaw = (target: number) => {
      const a = yaw + wrap(target - yaw);
      const b = yaw + wrap(target + Math.PI - yaw);
      return Math.abs(a - yaw) <= Math.abs(b - yaw) ? a : b;
    };
    const nextSlot = () => {
      const st = stations[station];
      if (count[station] >= st.slots.length) {
        // full: the pallet leaves, the arm moves on to the other station
        leaving[station] = 0;
        station = 1 - station;
        count[station] = 0;
      }
      return stations[station].slots[count[station]];
    };
    let slot = nextSlot();
    const begin = (p: Phase, a: P3, b: P3) => {
      phase = p;
      t = 0;
      from = { ...a };
      to = { ...b };
    };

    // ---- draw
    const drawPallets = () => {
      for (let s = 0; s < 2; s++) {
        const n = count[s];
        const fade = leaving[s] >= 0 ? 1 - Math.min(1, leaving[s] / 1.2) : 1;
        placed[s].forEach((g, i) => {
          const show = i < n && fade > 0.01;
          g.style.display = show ? "" : "none";
        });
        palletG[s].style.opacity = String(leaving[s] >= 0 ? Math.max(0.25, fade) : 1);
        // a full pallet is taken away (forklift side), then an empty one stands in its place
        set(palletG[s], "transform", leaving[s] >= 0 ? `translate(0 ${f2(Math.min(1, leaving[s] / 1.2) * 60)})` : "");
      }
    };
    const drawConveyor = () => {
      set(parts.rollers, "transform", `translate(0 ${f2(((roll % 0.18) + 0.18) % 0.18 * S)})`);
      conv.forEach((g, i) => {
        const z = items[i];
        if (z === undefined) {
          g.style.display = "none";
          return;
        }
        g.style.display = "";
        set(g, "transform", `translate(0 ${f2(z * S)})`);
      });
    };
    const drawArm = () => {
      const rel = cur.y - base;
      solveArm(link, lay.zt, cur.x, rel, cur.z, yaw, pose);
      const { t1, t2, t3 } = pose;
      const xe = link.a2 * Math.cos(t2);
      const xw = xe + link.a3 * Math.cos(t2 + t3);
      const zf = lay.o1 - lay.o2;
      set(arm, "transform", `rotate(${f2(deg(-t1))})`);
      // upper arm and forearm stretch with the joint angles (projection)
      set(parts.upper, "transform", `scale(${f2(Math.abs(xe) < 0.002 ? 0.2 : xe * S)} 1)`);
      set(parts.elbow, "transform", `translate(${f2(xe * S)} 0)`);
      set(parts.fore, "transform", `translate(${f2(xe * S)} ${f2(zf * S)}) scale(${f2((xw - xe) * S)} 1)`);
      set(parts.w1, "transform", `translate(${f2(xw * S)} ${f2(zf * S)})`);
      set(parts.w2, "transform", `translate(${f2(xw * S)} ${f2(lay.zt * S)})`);
      set(parts.tool, "transform", `translate(${f2(xw * S)} ${f2(lay.zt * S)}) rotate(${f2(deg(t1 - yaw))})`);
      // hose over the tubes
      const hz1 = lay.o1 - lay.ru * 0.4;
      const hz2 = zf + lay.rf * 0.3;
      set(
        parts.hose,
        "d",
        `M${f2(-lay.Rb * S * 1.1)} ${f2(-lay.Rb * S * 0.3)} C ${f2(xe * 0.1 * S)} ${f2(hz1 * S)} ${f2(xe * 0.5 * S)} ${f2(hz1 * S)} ${f2(xe * 0.9 * S)} ${f2(hz1 * S)} S ${f2((xe + (xw - xe) * 0.3) * S)} ${f2(hz2 * S)} ${f2((xe + (xw - xe) * 0.7) * S)} ${f2(hz2 * S)} S ${f2((xw - lay.R3 * 1.2) * S)} ${f2(lay.zt * S)} ${f2((xw - lay.R3 * 1.1) * S)} ${f2(lay.zt * S)}`,
      );
      // fingers: swing in under the bag when closed
      const w = (grip.plate.w / 1000) * S;
      fingers.forEach((fg) => {
        const side = Number(fg.dataset.side);
        set(fg, "transform", `translate(${f2(side * (w / 2 + 4 + open * 7))} 0)`);
      });
      parts.carried.style.display = carrying ? "" : "none";
      // shadows: offset grows with height (light from the upper left of the plan)
      const hT = Math.max(0, cur.y - (carrying ? py : 0) - 0.15);
      set(parts.shTool, "transform", `translate(${f2(cur.x * S + hT * 16)} ${f2(cur.z * S + hT * 11)}) rotate(${f2(deg(-yaw))})`);
      const hA = base + link.d1 + link.a2 * Math.sin(t2) * 0.5;
      set(parts.shArm, "transform", `translate(${f2(hA * 16)} ${f2(hA * 11)}) rotate(${f2(deg(-t1))})`);
      set(parts.shPath, "d", `M0 ${f2(lay.o1 * S)} L${f2(xe * S)} ${f2(lay.o1 * S)} L${f2(xe * S)} ${f2(zf * S)} L${f2(xw * S)} ${f2(zf * S)} L${f2(xw * S)} ${f2(lay.zt * S)}`);
      // speed lamp on the base and LED ring on the wrist
      const z = zoneRef.current;
      const col = z === "stop" ? "#d9442b" : z === "slow" ? "#f5a800" : "#5fd38a";
      set(parts.led, "stroke", col);
      set(parts.lamp, "fill", col);
    };

    const step = (dt: number) => {
      const goal = zoneRef.current === "stop" ? 0 : zoneRef.current === "slow" ? 0.3 : 1;
      speed += (goal - speed) * (1 - Math.exp(-(goal === 0 ? 9 : 4) * dt));
      if (goal === 0 && speed < 0.002) speed = 0;
      const sdt = dt * speed;
      // conveyor: bags ride to the stop and queue behind it
      roll += BELT * sdt;
      spawn -= sdt;
      if (spawn <= 0) {
        const last = items.length ? Math.min(...items) : 0;
        if (last - JOB.u / 1000 - 0.05 > CONV_START) items.push(CONV_START);
        spawn = SPAWN;
      }
      items.sort((a, b) => b - a);
      let limit = CONV_END - JOB.u / 2000;
      items = items.map((z) => {
        const nz = Math.min(limit, z + BELT * sdt);
        limit = nz - JOB.u / 1000 - 0.012;
        return nz;
      });
      for (let s = 0; s < 2; s++) {
        if (leaving[s] < 0) continue;
        leaving[s] += sdt;
        if (leaving[s] > 2.4) {
          leaving[s] = -1;
          if (s !== station) count[s] = 0;
        }
      }

      t += sdt;
      const k = DUR[phase] ? Math.min(1, t / DUR[phase]) : 1;
      const e = minJerk(k);
      const pick: P3 = { x: PICK_XZ.x, y: CONV_TOP + py + gH, z: PICK_XZ.z };
      switch (phase) {
        case "wait": {
          const atStop = items.length && Math.abs(items[0] - (CONV_END - JOB.u / 2000)) < 0.005;
          if (atStop) begin("down", cur, pick);
          break;
        }
        case "down":
        case "up":
        case "lower":
        case "rise":
          cur.x = lerp(from.x, to.x, e);
          cur.y = lerp(from.y, to.y, e);
          cur.z = lerp(from.z, to.z, e);
          if (k >= 1) {
            if (phase === "down") begin("grip", cur, cur);
            else if (phase === "up") {
              const target = { x: slot.x, y: slotTop(slot) + 0.1, z: slot.z };
              yawFrom = yaw;
              yawTo = chooseYaw(slot.turned ? Math.PI / 2 : 0);
              begin("carry", cur, target);
            } else if (phase === "lower") begin("release", cur, cur);
            else {
              yawFrom = yaw;
              yawTo = chooseYaw(0);
              begin("back", cur, { ...pick, y: pick.y + HOVER });
            }
          }
          break;
        case "grip":
          open = 1 - e;
          if (k >= 1) {
            items.shift();
            carrying = true;
            begin("up", cur, { ...cur, y: cur.y + 0.16 });
          }
          break;
        case "release":
          open = e;
          if (k >= 1) {
            carrying = false;
            count[station]++;
            slot = nextSlot();
            begin("rise", cur, { ...cur, y: cur.y + 0.1 });
          }
          break;
        case "carry":
        case "back": {
          // swing around the base axis (polar), up and over, wrist turning on the way
          const pa = Math.atan2(from.z, from.x);
          const pb = pa + wrap(Math.atan2(to.z, to.x) - pa);
          const ra = Math.hypot(from.x, from.z);
          const rb = Math.hypot(to.x, to.z);
          const ang = lerp(pa, pb, e);
          const rad = lerp(ra, rb, e);
          cur.x = Math.cos(ang) * rad;
          cur.z = Math.sin(ang) * rad;
          cur.y = lerp(from.y, to.y, e) + Math.sin(Math.PI * e) * 0.1;
          yaw = lerp(yawFrom, yawTo, minJerk((k - 0.1) / 0.8));
          if (k >= 1) {
            if (phase === "carry") begin("lower", cur, { ...cur, y: slotTop(slot) });
            else begin("wait", cur, cur);
          }
          break;
        }
      }
    };

    const draw = () => {
      drawConveyor();
      drawPallets();
      drawArm();
    };
    draw();
    if (reduced) return;

    let raf = 0;
    let visible = false;
    let last = performance.now();
    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver((en) => {
      visible = en[0]?.isIntersecting ?? false;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(el.ownerSVGElement ?? el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [job]);

  const { lay, grip, stations, layers } = job;
  const L = 1.2;
  const conveyorTop = CONV_START * S;
  const convLen = (CONV_END - CONV_START) * S;
  const pw = (grip.plate.w / 1000) * S;
  const pl = (grip.plate.l / 1000) * S;
  const nf = grip.claw?.fingers ?? 4;
  const zf = lay.o1 - lay.o2;

  return (
    <g ref={root} className="pz-plan-cell" aria-hidden="true">
      <defs>
        {/* a white cylinder seen from above: bright crown, shaded flanks */}
        <linearGradient id="pz-pc-cyl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfc0ba" />
          <stop offset="0.28" stopColor="#f4f4f0" />
          <stop offset="0.5" stopColor="#fbfbf8" />
          <stop offset="0.8" stopColor="#dcddd7" />
          <stop offset="1" stopColor="#a9aaa4" />
        </linearGradient>
        <linearGradient id="pz-pc-cylx" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#bfc0ba" />
          <stop offset="0.3" stopColor="#f4f4f0" />
          <stop offset="0.5" stopColor="#fbfbf8" />
          <stop offset="0.8" stopColor="#dcddd7" />
          <stop offset="1" stopColor="#a9aaa4" />
        </linearGradient>
        <radialGradient id="pz-pc-disc" cx="0.42" cy="0.4" r="0.62">
          <stop offset="0" stopColor="#fbfbf8" />
          <stop offset="0.75" stopColor="#e2e3dd" />
          <stop offset="1" stopColor="#b5b6b0" />
        </radialGradient>
        <clipPath id="pz-pc-belt">
          <rect x={-23} y={conveyorTop} width={46} height={convLen} />
        </clipPath>
      </defs>

      {/* conveyor: frame, moving rollers, bags */}
      <rect x={-27} y={conveyorTop} width={54} height={convLen} fill="#2f3331" stroke="#8c9093" />
      <g clipPath="url(#pz-pc-belt)">
        <g data-rollers>
          {Array.from({ length: Math.ceil(convLen / 9) + 3 }, (_, i) => (
            <rect key={i} x={-23} y={conveyorTop - 18 + i * 9} width={46} height={4.6} rx={2.3} fill="#9da1a3" />
          ))}
        </g>
      </g>
      <rect x={-27} y={conveyorTop} width={3} height={convLen} fill="#c3c6c8" />
      <rect x={24} y={conveyorTop} width={3} height={convLen} fill="#c3c6c8" />
      <rect x={-29} y={CONV_END * S} width={58} height={6} fill="#151615" />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} data-conv style={{ display: "none" }}>
          <Bag dx={JOB.g / 1000} dz={JOB.u / 1000} />
        </g>
      ))}

      {/* pallets and the layers placed on them */}
      {stations.map((st, s) => (
        <g key={st.side} data-pallet>
          <rect x={(st.side * PALLET_X - PAL_W / 2) * S} y={(-L / 2) * S} width={PAL_W * S} height={L * S} fill="#3f382d" />
          {Array.from({ length: 5 }, (_, i) => (
            <rect
              key={i}
              x={(st.side * PALLET_X - PAL_W / 2) * S + 1 + (i * (PAL_W * S - 16)) / 4}
              y={(-L / 2) * S + 1}
              width={14}
              height={L * S - 2}
              fill="#c9ad86"
              stroke="#a58b65"
              strokeWidth="0.6"
            />
          ))}
          {st.slots.map((sl, i) => (
            <g key={i} data-slot={s} transform={`translate(${f2(sl.x * S)} ${f2(sl.z * S)})`} style={{ display: "none" }}>
              <Bag dx={sl.dx} dz={sl.dz} fill={tint(sl.layer, layers)} />
            </g>
          ))}
        </g>
      ))}

      {/* shadows */}
      <g opacity="0.3" fill="#000">
        <g data-sh-tool>
          <rect x={-pw / 2} y={-pl / 2} width={pw} height={pl} rx={4} />
        </g>
        <g data-sh-arm>
          <path data-sh-path fill="none" stroke="#000" strokeWidth={lay.ru * 2 * S} strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </g>

      {/* the arm, in its own frame turned by J1 */}
      <g data-arm>
        {/* tool: claw frame, fingers, the carried bag under it */}
        <g data-tool>
          <g data-carried style={{ display: "none" }}>
            <Bag dx={JOB.g / 1000} dz={JOB.u / 1000} />
          </g>
          <rect x={-pw / 2} y={-pl / 2} width={pw} height={pl} rx={2} fill="rgba(199,202,204,0.55)" stroke="#6f7376" strokeWidth="1.2" />
          <rect x={-3} y={-pl / 2 + 2} width={6} height={pl - 4} fill="#3d4145" />
          <rect x={-pw / 2 + 2} y={-pl * 0.3 - 2} width={pw - 4} height={4} fill="#b9bcbf" />
          <rect x={-pw / 2 + 2} y={pl * 0.3 - 2} width={pw - 4} height={4} fill="#b9bcbf" />
          {[-1, 1].map((side) =>
            Array.from({ length: nf }, (_, i) => (
              <rect key={`${side}-${i}`} data-finger data-side={side} x={-2} y={((i + 0.5) / nf - 0.5) * pl - 3} width={4} height={6} fill="#b9bcbf" stroke="#5b5f62" strokeWidth="0.6" />
            )),
          )}
          <circle r={0.045 * S} fill="#3d4145" />
        </g>
        {/* wrist 2 and 3 over the tool */}
        <g data-w2>
          <rect x={-lay.R3 * S} y={-lay.R3 * S} width={lay.R3 * 2 * S} height={lay.R3 * 2 * S} rx={lay.R3 * 0.25 * S} fill="url(#pz-pc-cylx)" stroke="#8d908a" strokeWidth="0.8" />
          <rect x={lay.R3 * S - 2} y={-lay.R3 * 0.84 * S} width={2.4} height={lay.R3 * 1.68 * S} fill="#2a2d2f" />
          <circle data-led r={lay.R3 * 0.86 * S} fill="none" strokeWidth="1.6" stroke="#5fd38a" />
        </g>
        {/* forearm (unit length, scaled to its projection) */}
        <g data-fore>
          <rect x={0} y={-lay.rf} width={1} height={lay.rf * 2} fill="url(#pz-pc-cyl)" transform={`scale(1 ${S})`} />
        </g>
        {/* wrist 1: socket and module, end caps, parting line */}
        <g data-w1>
          <rect x={-lay.R3 * S} y={-lay.wA * S} width={lay.R3 * 2 * S} height={(lay.wB + lay.wA) * S} rx={lay.R3 * 0.25 * S} fill="url(#pz-pc-cylx)" stroke="#8d908a" strokeWidth="0.8" />
          <rect x={-lay.R3 * 0.84 * S} y={-lay.wA * S - 1.6} width={lay.R3 * 1.68 * S} height={2.4} fill="#2a2d2f" />
          <rect x={-lay.R3 * 0.84 * S} y={lay.wB * S - 0.8} width={lay.R3 * 1.68 * S} height={2.4} fill="#2a2d2f" />
          <line x1={-lay.R3 * S} x2={lay.R3 * S} y1={(lay.wA + lay.gap / 2) * S} y2={(lay.wA + lay.gap / 2) * S} stroke="#101112" strokeWidth="1" />
        </g>
        {/* shoulder: J2 module and the upper arm's cast end */}
        <g>
          <rect x={-lay.R1 * S} y={lay.shA * S} width={lay.R1 * 2 * S} height={(lay.rB - lay.shA) * S} rx={lay.R1 * 0.25 * S} fill="url(#pz-pc-cylx)" stroke="#8d908a" strokeWidth="0.8" />
          <rect x={-lay.R1 * 0.84 * S} y={lay.shA * S - 1.8} width={lay.R1 * 1.68 * S} height={2.8} fill="#2a2d2f" />
          <rect x={-lay.R1 * 0.84 * S} y={lay.rB * S - 1} width={lay.R1 * 1.68 * S} height={2.8} fill="#2a2d2f" />
          <line x1={-lay.R1 * S} x2={lay.R1 * S} y1={(lay.shB + lay.gap / 2) * S} y2={(lay.shB + lay.gap / 2) * S} stroke="#101112" strokeWidth="1.2" />
        </g>
        {/* upper arm (unit length, scaled to its projection) */}
        <g transform={`translate(0 ${f2(lay.o1 * S)})`}>
          <g data-upper>
            <rect x={0} y={-lay.ru} width={1} height={lay.ru * 2} fill="url(#pz-pc-cyl)" transform={`scale(1 ${S})`} />
          </g>
        </g>
        {/* elbow: J3 module and the forearm's cast end */}
        <g data-elbow>
          <rect
            x={-lay.R2 * S}
            y={(zf - lay.fr) * S}
            width={lay.R2 * 2 * S}
            height={(lay.o1 + lay.eA - zf + lay.fr) * S}
            rx={lay.R2 * 0.25 * S}
            fill="url(#pz-pc-cylx)"
            stroke="#8d908a"
            strokeWidth="0.8"
          />
          <rect x={-lay.R2 * 0.84 * S} y={(lay.o1 + lay.eA) * S - 1} width={lay.R2 * 1.68 * S} height={2.6} fill="#2a2d2f" />
          <rect x={-lay.R2 * 0.84 * S} y={(zf - lay.fr) * S - 1.6} width={lay.R2 * 1.68 * S} height={2.6} fill="#2a2d2f" />
          <line x1={-lay.R2 * S} x2={lay.R2 * S} y1={(lay.o1 - lay.eA - lay.gap / 2) * S} y2={(lay.o1 - lay.eA - lay.gap / 2) * S} stroke="#101112" strokeWidth="1.1" />
        </g>
        <path data-hose fill="none" stroke="#2b2e30" strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* base: mounting flange and the status lamp on the J1 rotor */}
      <circle r={lay.R1 * 1.42 * S} fill="none" stroke="#3d4145" strokeWidth="2" opacity="0.9" />
      <circle data-lamp r={3.2} cx={-lay.Rb * S * 0.62} cy={-lay.Rb * S * 0.62} fill="#5fd38a" stroke="#151615" strokeWidth="1" />
    </g>
  );
}
