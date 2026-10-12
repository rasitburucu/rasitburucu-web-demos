"use client";

// From the street door to the room door, every flight drawn to scale of its
// count: the threshold, the timber stair, the two steps into the sea wing, the
// steep belvedere stair. The line climbs and the counter counts with it.

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/yedipencere/dates";
import { stepsWord } from "@/lib/yedipencere/format";
import { ROOM, type RoomId } from "@/lib/yedipencere/house";
import { COPY } from "@/content/yedipencere/copy";
import { BEGONVIL, INK } from "./geom";

const Z = 82;
const K1 = 50;
const K2 = 18;

const zig = (xa: number, ya: number, xb: number, yb: number, n: number) => {
  const dx = (xb - xa) / n;
  const dy = (yb - ya) / n;
  let d = "";
  for (let i = 0; i < n; i++) d += ` h${dx.toFixed(2)} v${dy.toFixed(2)}`;
  return d;
};

/** The walk as an SVG path, and where the room door is. */
export function stairPath(room: RoomId): { d: string; end: [number, number] } {
  const fl = ROOM[room].flights;
  let d = `M8 ${Z + 4} H21 v-4 H70`;
  let end: [number, number] = [300, Z];
  if (fl.includes("avluKapi")) {
    d += " H250 v-4 H300";
    end = [300, Z - 4];
  } else if (fl.includes("ana")) {
    d += zig(70, Z, 150, K1, 20);
    if (fl.includes("denizKanadi")) {
      d += " H220" + zig(220, K1, 232, K1 - 6, 2) + " H300";
      end = [300, K1 - 6];
    } else if (fl.includes("koskMerdiveni")) {
      d += " H176" + zig(176, K1, 236, K2, 14);
      if (fl.includes("koskOda")) {
        d += " H256" + zig(256, K2, 268, K2 - 6, 2) + " H300";
        end = [300, K2 - 6];
      } else {
        d += " H300";
        end = [300, K2];
      }
    } else {
      d += " H300";
      end = [300, K1];
    }
  } else d += " H300";
  return { d, end };
}

export function StairPath({ room, lang, animate }: { room: RoomId; lang: Lang; animate: boolean }) {
  const steps = ROOM[room].steps;
  const { d, end } = stairPath(room);
  const pathRef = useRef<SVGPathElement>(null);
  const [count, setCount] = useState(animate ? 0 : steps);

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animate || reduce) {
      setCount(steps);
      p.style.strokeDasharray = "";
      p.style.strokeDashoffset = "";
      return;
    }
    const L = p.getTotalLength();
    p.style.transition = "none";
    p.style.strokeDasharray = `${L}`;
    p.style.strokeDashoffset = `${L}`;
    p.getBoundingClientRect();
    p.style.transition = "stroke-dashoffset 1.1s cubic-bezier(.45,0,.2,1)";
    p.style.strokeDashoffset = "0";
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1100);
      setCount(Math.round(steps * k));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [room, steps, animate]);

  const t = COPY[lang];
  return (
    <svg className="yp-stair" viewBox="0 0 332 100" role="img" aria-label={`${t.card.door} → ${ROOM[room].name}: ${steps} ${stepsWord(steps, lang)}`}>
      <path d={`M40 ${Z}H322M128 ${K1}H322M168 ${K2}H322`} stroke="#E1DED8" strokeWidth="1" />
      <rect x="8" y={Z - 26} width="13" height="30" fill="url(#yp-ahsap)" stroke={INK} strokeWidth="1.2" />
      <text x="4" y={Z + 15} className="yp-stair-note">
        {t.card.door}
      </text>
      <path ref={pathRef} d={d} fill="none" stroke={BEGONVIL} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      <rect x={end[0] - 2} y={end[1] - 18} width="22" height="18" fill="#FAFAF8" stroke={INK} strokeWidth="1.2" />
      <line x1={end[0] + 9} y1={end[1] - 18} x2={end[0] + 9} y2={end[1]} stroke={INK} strokeWidth="0.8" />
      <text x={end[0] + 9} y={end[1] + 13} textAnchor="middle" className="yp-stair-room">
        {ROOM[room].name}
      </text>
      <text x="44" y="24" className="yp-stair-count" aria-hidden="true">
        {count}
        <tspan className="yp-stair-unit" dx="6">
          {stepsWord(count, lang)}
        </tspan>
      </text>
    </svg>
  );
}
