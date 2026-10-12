"use client";

// One room's way on the section: drawn from the street door when the drawing
// comes into view, with the count of each flight and a running total.

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/yedipencere/dates";
import { stepsWord } from "@/lib/yedipencere/format";
import { BEGONVIL, BEGONVIL_D, INK } from "./geom";

type Props = {
  d: string;
  end: [number, number];
  flights: { n: number; x: number; y: number }[];
  steps: number;
  lang: Lang;
};

export function RouteLine({ d, end, flights, steps, lang }: Props) {
  const ref = useRef<SVGPathElement>(null);
  const [count, setCount] = useState(steps);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const L = p.getTotalLength();
    p.style.strokeDasharray = `${L}`;
    p.style.strokeDashoffset = `${L}`;
    setShown(false);
    setCount(0);
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        p.getBoundingClientRect();
        p.style.transition = "stroke-dashoffset 1.6s cubic-bezier(.45,0,.2,1)";
        p.style.strokeDashoffset = "0";
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / 1600);
          setCount(Math.round(steps * k));
          if (k < 1) raf = requestAnimationFrame(tick);
          else setShown(true);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.45 },
    );
    io.observe(p);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [d, steps]);

  return (
    <g className="yp-route" data-shown={shown || undefined}>
      <path className="yp-route-halo" d={d} fill="none" stroke="#FAFAF8" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
      <path className="yp-route-path" ref={ref} d={d} fill="none" stroke={BEGONVIL} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <g className="yp-route-marks">
        {flights.map((fl, i) => (
          <text key={i} x={fl.x - 10} y={fl.y - 10} textAnchor="end" className="yp-route-n">
            {fl.n}
          </text>
        ))}
        <circle className="yp-route-end" cx={end[0]} cy={end[1]} r="5.5" fill={BEGONVIL} stroke="#FAFAF8" strokeWidth="2" />
      </g>
      <g aria-hidden="true" className="yp-route-counter">
        <rect x="18" y="14" width="190" height="56" fill="#FAFAF8" fillOpacity="0.92" />
        <text x="26" y="58" className="yp-route-count">
          {count}
        </text>
        <text x={26 + String(steps).length * 30 + 12} y="58" className="yp-route-unit" fill={BEGONVIL_D}>
          {stepsWord(count, lang)}
        </text>
        <line x1="26" y1="66" x2="200" y2="66" stroke={INK} strokeWidth="0.6" />
      </g>
    </g>
  );
}
