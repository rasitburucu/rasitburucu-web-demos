"use client";

// "Kat kat kurulum": the cell drawn from the side. As the steps scroll past, the
// arm sets down one more layer on the pallet; each layer is one step. The arm's
// joints are solved with the same two-link geometry as the 3D robot and eased
// with CSS. Reduced motion: every layer is shown, the arm rests over the stack.
// The layers are the product picked in the hero plate (bag by default), so the
// drawing keeps telling the visitor's own case.

import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/pazi/tr";
import type { ProductKind } from "@/lib/pazi/plan";
import { useCell } from "@/lib/pazi/store";

const VW = 760;
const H = 470; // floor line
const DECK = 30;
const LAYER = 56;
const PX = 230; // pallet left
const PW = 400; // pallet width
// products per layer as seen from the side (alternate layers turn 90°)
const PER_LAYER: Record<ProductKind, number[]> = {
  torba: [2, 3, 2, 3, 2],
  koli: [3, 4, 3, 4, 3],
  shrink: [3, 4, 3, 4, 3],
};
// [current layer, placed layer, detail]
const TONE: Record<ProductKind, [string, string, string]> = {
  torba: ["#f3f1ea", "#e2e0d8", "#bdbab0"],
  koli: ["#d6b285", "#c19a6b", "#a57c4c"],
  shrink: ["#c3d4db", "#a9bfc8", "#7f98a4"],
};

/** One product seen from the side: a filled sack, a taped carton or a shrink-wrapped pack. */
function Product({ kind, x, y, w, h, fill, detail }: { kind: ProductKind; x: number; y: number; w: number; h: number; fill: string; detail: string }) {
  if (kind === "torba") {
    // a filled sack: soft corners, a bulging middle, sewn seams at both ends
    const r = Math.min(16, h / 2.6);
    return (
      <g>
        <rect x={x} y={y + 3} width={w} height={h - 3} rx={r} fill={fill} stroke={detail} strokeWidth="1.2" />
        <path d={`M${x + 10} ${y + h * 0.3} Q${x + w / 2} ${y + h * 0.12} ${x + w - 10} ${y + h * 0.3}`} fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" />
        <line x1={x + 9} y1={y + 9} x2={x + 9} y2={y + h - 6} stroke={detail} strokeDasharray="2 3" />
        <line x1={x + w - 9} y1={y + 9} x2={x + w - 9} y2={y + h - 6} stroke={detail} strokeDasharray="2 3" />
      </g>
    );
  }
  if (kind === "shrink") {
    // bottles under film: necks show through, a highlight runs along the film
    const n = Math.max(2, Math.round(w / 34));
    const bw = w / n;
    return (
      <g>
        <rect x={x} y={y + 2} width={w} height={h - 3} rx="5" fill={fill} />
        {Array.from({ length: n }, (_, k) => (
          <path
            key={k}
            d={`M${x + k * bw + bw * 0.18} ${y + h - 2} V${y + h * 0.42} Q${x + k * bw + bw * 0.5} ${y + h * 0.16} ${x + k * bw + bw * 0.82} ${y + h * 0.42} V${y + h - 2}`}
            fill="none"
            stroke={detail}
            strokeWidth="1.3"
          />
        ))}
        <rect x={x + 6} y={y + 8} width={w - 12} height="3" rx="1.5" fill="#fff" opacity="0.55" />
      </g>
    );
  }
  return (
    <g>
      <rect x={x} y={y + 2} width={w} height={h - 3} fill={fill} />
      <rect x={x} y={y + 2} width={w} height="4" fill="#000" opacity="0.06" />
      <rect x={x + w / 2 - 9} y={y + 2} width="18" height="12" fill={detail} opacity="0.85" />
    </g>
  );
}
// arm (svg units)
const SX = 96;
const RISER = 120;
const D1 = 30;
const SY = H - RISER - D1;
const A2 = 196;
const A3 = 176;
const HANG = 44;
const GRIP = 18;

function solve(tx: number, ty: number) {
  const px = tx - SX;
  const py = -(ty - SY);
  const D = Math.min(A2 + A3 - 1, Math.hypot(px, py));
  const a1 = Math.atan2(py, px) + Math.acos(Math.min(1, (A2 * A2 + D * D - A3 * A3) / (2 * A2 * D)));
  const a2 = a1 - (Math.PI - Math.acos(Math.min(1, (A2 * A2 + A3 * A3 - D * D) / (2 * A2 * A3))));
  const phi1 = 90 - (a1 * 180) / Math.PI;
  const psi = (-a2 * 180) / Math.PI;
  return { phi1, phi2: psi - phi1, wrist: -psi };
}

export function Steps() {
  const s = tr.steps;
  const kind = useCell((st) => st.config.kind);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-step]") ?? []);
    if (!("IntersectionObserver" in window)) {
      setActive(items.length - 1);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        // only the step crossing the middle band of the viewport intersects
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const n = s.items.length;
  const shown = reduced ? n - 1 : active;
  const topOf = (i: number) => H - DECK - LAYER * (i + 1);
  // the arm hovers over the layer it has just set down
  const target = solve(PX + PW * 0.3, topOf(shown) - GRIP - HANG - 6);
  const rot = (deg: number, x: number, y: number) => ({ transform: `rotate(${deg.toFixed(2)}deg)`, transformOrigin: `${x}px ${y}px` }) as React.CSSProperties;

  return (
    <section id={s.id} className="pz-steps" aria-labelledby="pz-steps-title">
      <div className="pz-wrap pz-steps-grid">
        <div className="pz-steps-art">
          <div className="pz-steps-sticky">
            <svg viewBox={`0 40 ${VW} ${H - 10}`} className="pz-steps-svg" role="img" aria-label={`${s.title}: ${shown + 1} / ${n}, ${s.items[shown].name}`}>
              {/* floor */}
              <rect x="0" y={H} width={VW} height="6" fill="#f5a800" />
              <line x1="0" y1={H + 16} x2={VW} y2={H + 16} stroke="#9fa199" strokeDasharray="2 6" />
              {/* pallet */}
              <g transform={`translate(${PX} ${H - DECK})`}>
                <rect x="0" y="0" width={PW} height="8" fill="#cdb18a" />
                {[0, PW / 2 - 20, PW - 40].map((x) => (
                  <rect key={x} x={x} y="8" width="40" height="16" fill="#b39672" />
                ))}
                <rect x="0" y="24" width={PW} height="6" fill="#cdb18a" />
              </g>
              {s.items.map((it, i) => {
                const k = PER_LAYER[kind][i];
                const y = topOf(i);
                const bw = (PW - (k - 1) * 3) / k;
                const on = i <= shown;
                return (
                  <g key={it.name} className="pz-layer" data-on={on ? "true" : "false"} style={{ "--d": "260ms" } as React.CSSProperties}>
                    {Array.from({ length: k }, (_, j) => (
                      <Product key={`${kind}-${j}`} kind={kind} x={PX + j * (bw + 3)} y={y} w={bw} h={LAYER} fill={i === shown ? TONE[kind][0] : TONE[kind][1]} detail={TONE[kind][2]} />
                    ))}
                    <line x1={PX + PW + 22} y1={y + 2} x2={PX + PW + 22} y2={y + LAYER - 1} stroke={on ? "#151615" : "#9fa199"} />
                    <line x1={PX + PW + 16} y1={y + 2} x2={PX + PW + 28} y2={y + 2} stroke={on ? "#151615" : "#9fa199"} />
                    <text x={PX + PW + 38} y={y + LAYER / 2 + 7} className="pz-steps-num" fill={i === shown ? "#151615" : "#6a6d67"}>
                      {String(i + 1).padStart(2, "0")}
                    </text>
                  </g>
                );
              })}
              {/* riser and base */}
              <rect x={SX - 26} y={H - RISER} width="52" height={RISER} fill="#c9cbc6" stroke="#151615" strokeWidth="1.2" />
              <rect x={SX - 40} y={H - 4} width="80" height="4" fill="#151615" />
              <rect x={SX - 20} y={SY} width="40" height={D1 + 2} rx="4" fill="#e3e4df" stroke="#151615" strokeWidth="1.2" />
              {/* arm: upper arm → forearm → wrist, nested so each joint turns about its own pin */}
              <g className="pz-arm" style={rot(target.phi1, SX, SY)}>
                <rect x={SX - 12} y={SY - A2} width="24" height={A2} rx="12" fill="#e3e4df" stroke="#151615" strokeWidth="1.2" />
                <g className="pz-arm" style={rot(target.phi2, SX, SY - A2)}>
                  <rect x={SX} y={SY - A2 - 10} width={A3} height="20" rx="10" fill="#e3e4df" stroke="#151615" strokeWidth="1.2" />
                  <g className="pz-arm" style={rot(target.wrist, SX + A3, SY - A2)}>
                    <rect x={SX + A3 - 9} y={SY - A2} width="18" height={HANG} rx="3" fill="#e3e4df" stroke="#151615" strokeWidth="1.2" />
                    <rect x={SX + A3 - 34} y={SY - A2 + HANG} width="68" height={GRIP} fill="#3d4145" />
                    <rect x={SX + A3 - 32} y={SY - A2 + HANG + GRIP - 5} width="64" height="5" fill="#232425" />
                    <circle cx={SX + A3} cy={SY - A2} r="11" fill="#2a2d2f" />
                    <circle cx={SX + A3} cy={SY - A2} r="8" fill="none" stroke="#9a9ea2" />
                  </g>
                  <circle cx={SX} cy={SY - A2} r="14" fill="#2a2d2f" />
                  <circle cx={SX} cy={SY - A2} r="10.5" fill="none" stroke="#9a9ea2" />
                </g>
              </g>
              <circle cx={SX} cy={SY} r="17" fill="#2a2d2f" />
              <circle cx={SX} cy={SY} r="13" fill="none" stroke="#9a9ea2" />
              <text x={SX - 28} y={H + 40} className="pz-steps-cap">
                {s.items[shown].name}
              </text>
            </svg>
          </div>
        </div>
        <div className="pz-steps-copy">
          <h2 id="pz-steps-title" className="pz-h2">
            {s.title}
          </h2>
          <p className="pz-lead">{s.lead}</p>
          <ol ref={list} className="pz-steps-list">
            {s.items.map((it, i) => (
              <li key={it.name} data-step={i} data-current={i === shown ? "true" : "false"}>
                <span className="pz-steps-idx pz-mono" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="pz-h3">{it.name}</h3>
                  <p className="pz-steps-time pz-mono">{it.time}</p>
                  <p>{it.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
