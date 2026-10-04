"use client";

// "Çit yok, sınır var." The cell's top view at scale, with the two scanner
// fields. Drag the operator marker (or use the buttons / arrow keys): in the
// warning field the arm slows, in the protective field it stops, and it picks
// up again on its own when the person steps out.

import { useCallback, useEffect, useRef, useState } from "react";
import { tr } from "@/content/pazi/tr";
import { STATION_GAP_M } from "@/lib/pazi/plan";
import type { Zone } from "@/lib/pazi/store";
import dynamic from "next/dynamic";

// the working cell drawn in the plan: its markup is in the page, its animation code loads with the section
const PlanCell = dynamic(() => import("../cell/PlanCell").then((m) => m.PlanCell));

const S = 100; // px per metre
const TAG_W = 118; // "Sürükleyin" pill, in plan units
const TAG_H = 30;
const W = 0.8;
const L = 1.2;
const EX = STATION_GAP_M + W + 0.32;
const EZ = L / 2 + 0.36;
const SX = EX + 0.95;
const SZ = EZ + 0.95;
const VB = { x: -340, y: -300, w: 680, h: 560 };

function sdRound(x: number, z: number, ex: number, ez: number, r: number) {
  const qx = Math.abs(x) - (ex - r);
  const qz = Math.abs(z) - (ez - r);
  return Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - r;
}
const zoneAt = (x: number, z: number): Zone => (sdRound(x, z, EX, EZ, 0.3) < 0 ? "stop" : sdRound(x, z, SX, SZ, 0.6) < 0 ? "slow" : "out");

const SPOTS: Record<Zone, { x: number; z: number }> = {
  out: { x: 2.85, z: 1.9 },
  slow: { x: 1.95, z: 1.45 },
  stop: { x: 1.3, z: 0.75 },
};

export function Safety() {
  const t = tr.safety;
  const [op, setOp] = useState(SPOTS.out);
  const zone = zoneAt(op.x, op.z);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef(false);
  // the "Sürükleyin" label shows until the visitor moves the marker by any means;
  // the first time the plan is on screen the marker slides a little and comes back
  const [touched, setTouched] = useState(false);
  const [demo, setDemo] = useState(false);
  const touchedRef = useRef(false);
  const touch = useCallback(() => {
    touchedRef.current = true;
    setTouched(true);
    setDemo(false);
  }, []);

  useEffect(() => {
    const el = svg.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (e) => {
        if (!e[0]?.isIntersecting) return;
        io.disconnect();
        if (!touchedRef.current) setDemo(true);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toWorld = useCallback((clientX: number, clientY: number) => {
    const s = svg.current;
    if (!s) return null;
    const pt = s.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const m = s.getScreenCTM();
    if (!m) return null;
    const p = pt.matrixTransform(m.inverse());
    return { x: Math.max(-3.2, Math.min(3.2, p.x / S)), z: Math.max(-2.6, Math.min(2.4, p.y / S)) };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.shiftKey ? 0.4 : 0.12;
    const m: Record<string, [number, number]> = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d] };
    const v = m[e.key];
    if (!v) return;
    e.preventDefault();
    touch();
    setOp((o) => ({ x: Math.max(-3.2, Math.min(3.2, o.x + v[0])), z: Math.max(-2.6, Math.min(2.4, o.z + v[1])) }));
  };

  const rr = (ex: number, ez: number, r: number) => {
    const x = -ex * S;
    const y = -ez * S;
    return { x, y, width: ex * 2 * S, height: ez * 2 * S, rx: r * S };
  };

  return (
    <section id={t.id} className="pz-safety" aria-labelledby="pz-safety-title" data-zone={zone}>
      <div className="pz-wrap pz-safety-grid">
        <div className="pz-safety-plan">
          <svg
            ref={svg}
            viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
            className="pz-plan-svg"
            role="group"
            aria-label={t.planTitle}
            onPointerMove={(e) => {
              if (!drag.current) return;
              const p = toWorld(e.clientX, e.clientY);
              if (p) setOp(p);
            }}
            onPointerUp={() => (drag.current = false)}
            onPointerLeave={() => (drag.current = false)}
          >
            <defs>
              <pattern id="pz-hz" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="14" height="14" fill="#f5a800" />
                <rect width="7" height="14" fill="#151615" />
              </pattern>
              <pattern id="pz-grid" width="50" height="50" patternUnits="userSpaceOnUse" x="0" y="0">
                <path d="M50 0H0V50" fill="none" stroke="#2c2f2d" strokeWidth="1" />
              </pattern>
            </defs>
            <rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} fill="url(#pz-grid)" />
            {/* fields */}
            <rect {...rr(SX, SZ, 0.6)} fill={zone === "slow" ? "rgba(245,168,0,0.12)" : "none"} stroke="#f5a800" strokeWidth="5" />
            <rect {...rr(EX, EZ, 0.3)} fill={zone === "stop" ? "rgba(245,168,0,0.16)" : "none"} stroke="url(#pz-hz)" strokeWidth="9" />
            {/* reach */}
            <circle r={1.75 * S} fill="none" stroke="#6a6d67" strokeDasharray="3 6" />
            {/* the cell at work, from above: conveyor, pallets, the arm (cell/PlanCell.tsx) */}
            <PlanCell zone={zone} />
            {/* scale bar */}
            <g transform={`translate(${VB.x + 24} ${VB.y + VB.h - 26})`} className="pz-plan-scale">
              <rect width="100" height="6" fill="#ecece6" />
              <rect width="50" height="6" fill="#151615" stroke="#ecece6" />
              <text y="-8" fill="#a9aba4">
                1 m
              </text>
            </g>
            {/* operator marker: footprint disc with a dashed handle ring, four move arrows and a label until first use */}
            <g
              className="pz-op"
              transform={`translate(${op.x * S} ${op.z * S})`}
              tabIndex={0}
              role="img"
              aria-label={`${t.marker}: ${t.places[zone]}`}
              aria-describedby="pz-safety-howto"
              onKeyDown={onKey}
              onPointerDown={(e) => {
                drag.current = true;
                touch();
                (e.target as Element).setPointerCapture?.(e.pointerId);
              }}
            >
              <g className={demo ? "pz-op-body is-demo" : "pz-op-body"} onAnimationEnd={() => setDemo(false)}>
                <circle className="pz-op-hit" r="46" fill="transparent" />
                <circle className="pz-op-ring" r="33" />
                <g className="pz-op-arrows" aria-hidden="true">
                  {[0, 90, 180, 270].map((a) => (
                    <path key={a} d="M-6 -40L0 -49L6 -40Z" transform={`rotate(${a})`} />
                  ))}
                </g>
                <circle className="pz-op-disc" r="22" fill="#151615" stroke={zone === "out" ? "#ecece6" : "#f5a800"} strokeWidth="4" />
                {/* footprints: sole + heel, the standard floor pictogram */}
                <g fill="#ecece6">
                  <g transform="translate(-6.5 3) rotate(-10)">
                    <ellipse cx="0" cy="-4" rx="3.8" ry="6.2" />
                    <ellipse cx="0" cy="6.4" rx="3" ry="3.2" />
                  </g>
                  <g transform="translate(6.5 -4) rotate(10)">
                    <ellipse cx="0" cy="-4" rx="3.8" ry="6.2" />
                    <ellipse cx="0" cy="6.4" rx="3" ry="3.2" />
                  </g>
                </g>
                {touched ? null : <DragTag x={op.x * S} y={op.z * S} text={t.drag} />}
              </g>
            </g>
          </svg>
          <ul className="pz-plan-legend">
            <li data-k="slow">{t.legend.slow}</li>
            <li data-k="stop">{t.legend.stop}</li>
            <li data-k="reach">{t.legend.reach}</li>
          </ul>
        </div>
        <div className="pz-safety-copy">
          <h2 id="pz-safety-title" className="pz-h2">
            {t.title}
          </h2>
          <p className="pz-lead">{t.lead}</p>
          <div className="pz-safety-status" aria-live="polite">
            <span className="pz-lamp" aria-hidden="true" />
            <span className="pz-safety-word">{t.status[zone]}</span>
            <p>{t.statusLong[zone]}</p>
          </div>
          <p id="pz-safety-howto" className="pz-safety-howto">
            {t.howto}
          </p>
          <p id="pz-safety-btnlead" className="pz-safety-btnlead">
            {t.buttonsLead}
          </p>
          <div className="pz-safety-btns" role="group" aria-labelledby="pz-safety-btnlead">
            {(["out", "slow", "stop"] as Zone[]).map((z) => (
              <button
                key={z}
                type="button"
                className="pz-btn pz-btn-ink"
                aria-pressed={zone === z}
                onClick={() => {
                  touch();
                  setOp(SPOTS[z]);
                }}
              >
                {t.places[z]}
              </button>
            ))}
          </div>
          <dl className="pz-safety-lines">
            {t.lines.map((l) => (
              <div key={l.title}>
                <dt>{l.title}</dt>
                <dd>{l.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/** Yellow "Sürükleyin" pill above the marker (below it near the top edge), kept inside the plan. */
function DragTag({ x, y, text }: { x: number; y: number; text: string }) {
  const below = y < VB.y + TAG_H + 70;
  const half = TAG_W / 2 + 6;
  const cx = Math.max(VB.x + half, Math.min(VB.x + VB.w - half, x)) - x; // label centre, marker-relative
  const top = below ? 58 : -58 - TAG_H;
  const tail = below ? "M-7 58L0 50L7 58Z" : "M-7 -58L0 -50L7 -58Z";
  return (
    <g className="pz-op-tag" aria-hidden="true">
      <path d={tail} />
      <rect x={cx - TAG_W / 2} y={top} width={TAG_W} height={TAG_H} rx="3" />
      <text x={cx} y={top + TAG_H / 2 + 5.5} textAnchor="middle">
        {text}
      </text>
    </g>
  );
}
