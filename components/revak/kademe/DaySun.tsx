"use client";

import { useState } from "react";
import type { DayStop } from "@/content/revak/kademe";

// A day at one level, read along the sun's path: the hours sit on a low arc from
// morning (left) to evening (right), the arc of the walk's light. Pointing at a
// stop moves the sun to its hour. The arc is decoration; the list carries the meaning.

const W = 600;
const H = 206;
const CX = W / 2;
const RX = 268;
const RY = 150;
const BASE = H - 30;
const hour = (t: string) => {
  const [h, m] = t.split(".").map(Number);
  return h + m / 60;
};
const at = (t: string) => {
  const p = Math.min(1, Math.max(0, (hour(t) - 7.5) / 12));
  const a = Math.PI * (1 - p);
  return { x: CX + RX * Math.cos(a), y: BASE - RY * Math.sin(a) };
};

export function DaySun({ stops, label }: { stops: DayStop[]; label: string }) {
  const [active, setActive] = useState(0);
  const sun = at(stops[active].time);
  return (
    <div className="rv-daysun">
      <svg className="rv-daysun-arc" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
        <path d={`M ${CX - RX} ${BASE} A ${RX} ${RY} 0 0 1 ${CX + RX} ${BASE}`} className="rv-daysun-path" />
        <line x1={CX - RX - 12} x2={CX + RX + 12} y1={BASE} y2={BASE} className="rv-daysun-ground" />
        {stops.map((s, i) => {
          const p = at(s.time);
          return <circle key={s.time} cx={p.x} cy={p.y} r={i === active ? 0 : 3.5} className="rv-daysun-dot" />;
        })}
        <g className="rv-daysun-sun" style={{ transform: `translate(${sun.x}px, ${sun.y}px)` }}>
          <circle r="15" className="rv-daysun-halo" />
          <circle r="8" className="rv-daysun-disc" />
        </g>
        <text x={CX - RX} y={H} className="rv-daysun-tick">07.30</text>
        <text x={CX + RX} y={H} textAnchor="end" className="rv-daysun-tick">19.30</text>
      </svg>
      <ol className="rv-daysun-list" aria-label={label}>
        {stops.map((s, i) => (
          <li
            key={s.time}
            className={i === active ? "is-active" : undefined}
            onMouseEnter={() => setActive(i)}
            onFocusCapture={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <time className="rv-daysun-time">{s.time}</time>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
