"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { tr } from "@/content/onikitas/tr";

type P = [number, number];

// Schematic Bodrum peninsula (not to scale), 800 × 520.
const COAST: P[] = [
  [830, 178], [742, 186], [676, 158], [606, 170], [548, 150], [500, 118], [452, 104], [410, 126], [366, 108],
  [318, 138], [262, 118], [214, 126], [170, 160], [128, 176], [98, 226], [112, 268], [82, 312], [118, 350],
  [146, 404], [206, 426], [270, 414], [334, 446], [404, 436], [468, 452], [530, 436], [572, 458], [626, 430],
  [668, 448], [728, 420], [830, 428],
];

function smooth(points: P[], closeRight = true) {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  if (closeRight) d += " L830 520 L830 -10 Z";
  return d;
}

const COAST_D = smooth(COAST, false);
const LAND_D = `${COAST_D} L840 428 L840 178 Z`;

const SITE: P = [236, 214];
const PLACES: Record<string, { p: P; anchor: "start" | "end"; dx: number; dy: number }> = {
  marina: { p: [206, 150], anchor: "end", dx: -12, dy: -6 },
  gumusluk: { p: [118, 268], anchor: "end", dx: -12, dy: 4 },
  turkbuku: { p: [452, 122], anchor: "start", dx: 10, dy: -10 },
  bodrum: { p: [560, 426], anchor: "start", dx: 10, dy: 20 },
  airport: { p: [770, 60], anchor: "end", dx: -12, dy: -2 },
};

function arc(a: P, b: P, bend = 0.22) {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return `M${a[0]} ${a[1]} Q${(mx - dy * bend).toFixed(1)} ${(my + dx * bend).toFixed(1)} ${b[0]} ${b[1]}`;
}

export function Location() {
  const l = tr.location;
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [focus, setFocus] = useState<string | null>(null);

  return (
    <section id="konum" aria-labelledby="onk-loc-h" className="on-dark bg-aegean text-lime">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-36">
        <div className="lg:col-span-4">
          <h2 id="onk-loc-h" className="text-[clamp(2.4rem,5vw,4.5rem)] leading-none">
            {l.heading}
          </h2>
          <p className="mt-4 max-w-[36ch] text-aegean-soft">{l.intro}</p>
          <ul className="mt-10 border-t border-lime/20">
            {l.places.map((pl) => (
              <li
                key={pl.id}
                className={`flex items-baseline justify-between gap-4 border-b border-lime/15 py-4 transition-colors ${focus === pl.id ? "text-lime" : ""}`}
                onMouseEnter={() => setFocus(pl.id)}
                onMouseLeave={() => setFocus(null)}
              >
                <span>{pl.name}</span>
                <span className="shrink-0">
                  <span className="font-display text-[2rem] leading-none">{pl.minutes}</span>{" "}
                  <span className="label-mono text-aegean-soft">{tr.units.minutes}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.82rem] text-aegean-soft">{l.timesNote}</p>
        </div>

        <figure className="lg:col-span-8">
          <svg ref={ref} viewBox="0 0 800 520" className="h-auto w-full" role="img" aria-labelledby="onk-map-t">
            <title id="onk-map-t">{l.mapTitle}</title>
            <path d={LAND_D} fill="#f2eee6" fillOpacity="0.04" />
            <path d={COAST_D} fill="none" stroke="#f2eee6" strokeOpacity="0.55" strokeWidth="1.2" />
            {/* inland ridge lines */}
            <g fill="none" stroke="#f2eee6" strokeOpacity="0.1">
              <path d="M150 250 C260 230 360 250 480 230 C560 216 640 240 800 230" />
              <path d="M180 320 C300 300 400 330 520 310 C600 298 700 320 800 300" />
              <path d="M220 190 C320 180 420 190 520 180" />
            </g>
            {/* islands */}
            <g fill="none" stroke="#f2eee6" strokeOpacity="0.3">
              <path d="M420 500 C470 482 560 486 600 506" />
              <ellipse cx="60" cy="140" rx="22" ry="9" />
              <ellipse cx="40" cy="420" rx="16" ry="7" />
            </g>

            {l.places.map((pl, i) => {
              const place = PLACES[pl.id];
              const hot = focus === pl.id;
              return (
                <g key={pl.id}>
                  <motion.path
                    d={arc(SITE, place.p, pl.id === "airport" ? -0.18 : 0.2)}
                    fill="none"
                    stroke={hot ? "#d9825e" : "#f2eee6"}
                    strokeOpacity={hot ? 1 : 0.7}
                    strokeWidth={hot ? 1.8 : 1.1}
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={inView || reduce ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <circle cx={place.p[0]} cy={place.p[1]} r="4" fill="#1e3442" stroke="#f2eee6" strokeWidth="1.2" />
                  <text
                    x={place.p[0] + place.dx}
                    y={place.p[1] + place.dy}
                    textAnchor={place.anchor}
                    fontSize="13"
                    fill={hot ? "#d9825e" : "#f2eee6"}
                  >
                    {pl.name}
                  </text>
                </g>
              );
            })}

            <g transform={`translate(${SITE[0]} ${SITE[1]})`}>
              <circle r="15" fill="none" stroke="#d9825e" strokeOpacity="0.5" />
              <rect x="-6" y="-6" width="12" height="12" fill="#b5532c" />
              <text x="20" y="5" fontSize="15" fill="#f2eee6" style={{ fontFamily: "var(--font-gloock), serif" }}>
                {l.site}
              </text>
            </g>

            <g transform="translate(760 470)" fill="#f2eee6" fillOpacity="0.7">
              <path d="M0 -16 L6 6 L0 2 L-6 6 Z" />
              <text y="-22" fontSize="11" textAnchor="middle" style={{ fontFamily: "var(--font-plex-mono), monospace" }}>
                K
              </text>
            </g>
          </svg>
          <figcaption className="label-mono mt-3 text-aegean-soft">{l.mapNote}</figcaption>
        </figure>
      </div>
    </section>
  );
}
