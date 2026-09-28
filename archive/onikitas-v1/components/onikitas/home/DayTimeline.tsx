"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { tr } from "@/content/onikitas/tr";
import { azimuthAt } from "@/lib/onikitas/geometry";

const START = 7;
/** Gnomon shadow as a wedge pointing up from the centre, length 0..1. */
const wedge = (l: number) => {
  const len = 22 + 76 * l;
  return `M0 0 L-7 ${-len * 0.62} L0 ${-len} L7 ${-len * 0.62} Z`;
};
const END = 22;

/** A day told by the hour, with a sundial whose shadow follows the scroll. */
export function DayTimeline() {
  const d = tr.day;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 70%"] });
  const hour = useTransform(scrollYProgress, [0, 1], [START, END]);
  const [active, setActive] = useState(0);

  useMotionValueEvent(hour, "change", (h) => {
    let idx = 0;
    d.entries.forEach((e, i) => {
      if (h >= e.hour - 0.8) idx = i;
    });
    setActive((prev) => (prev === idx ? prev : idx));
  });

  // gnomon shadow points away from the sun; at night it fades out
  const rotate = useTransform(hour, (h) => azimuthAt(Math.min(h, 20.5)) + 180);
  const shadowOpacity = useTransform(hour, [START, 8, 19.6, 20.6], [0.35, 0.85, 0.85, 0]);
  const shadowLen = useTransform(hour, [START, 13, 20], [1, 0.35, 1]);
  const wedgePath = useTransform(shadowLen, (l) => wedge(l));
  const night = useTransform(hour, [19.5, 21], [0, 1]);

  return (
    <section ref={ref} aria-labelledby="onk-day-h" className="mx-auto max-w-[1600px] px-4 py-24 sm:px-8 lg:px-12 lg:py-36">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 id="onk-day-h" className="text-[clamp(2.4rem,5vw,4.5rem)] leading-none">
              {d.heading}
            </h2>
            <p className="measure mt-4 text-olive-soft">{d.intro}</p>
            <figure className="mt-10 w-full max-w-[360px]" aria-label={d.dialLabel}>
              <svg viewBox="0 0 240 240" className="h-auto w-full" aria-hidden>
                <motion.circle cx="120" cy="120" r="112" fill="#1e3442" style={{ opacity: reduce ? 0 : night }} />
                <circle cx="120" cy="120" r="112" fill="none" stroke="#3b3a2e" strokeOpacity="0.35" />
                <circle cx="120" cy="120" r="84" fill="none" stroke="#3b3a2e" strokeOpacity="0.15" />
                {Array.from({ length: 17 }, (_, i) => {
                  const h = 6 + i;
                  const az = azimuthAt(Math.min(Math.max(h, 6.5), 21)) + 180;
                  const a = ((az - 90) * Math.PI) / 180;
                  const r1 = h % 3 === 0 ? 96 : 102;
                  // round so server and client print identical attributes
                  const pt = (r: number, dy = 0) => [Math.round((120 + Math.cos(a) * r) * 100) / 100, Math.round((120 + Math.sin(a) * r + dy) * 100) / 100];
                  const [x1, y1] = pt(r1);
                  const [x2, y2] = pt(110);
                  const [tx, ty] = pt(82, 4);
                  return (
                    <g key={h}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#3b3a2e"
                        strokeOpacity={h % 3 === 0 ? 0.7 : 0.3}
                      />
                      {h % 3 === 0 ? (
                        <text x={tx} y={ty} fontSize="10" textAnchor="middle" fill="#5e5b4c" style={{ fontFamily: "var(--font-plex-mono), monospace" }}>
                          {String(h).padStart(2, "0")}
                        </text>
                      ) : null}
                    </g>
                  );
                })}
                <g transform="translate(120 120)">
                  <motion.g style={reduce ? { rotate: azimuthAt(16.5) + 180 } : { rotate, opacity: shadowOpacity }}>
                    {/* invisible disc keeps the group's box centred on the gnomon */}
                    <circle r="112" fill="none" />
                    <motion.path d={reduce ? wedge(0.8) : wedgePath} fill="#3b3a2e" fillOpacity="0.55" />
                  </motion.g>
                </g>
                <circle cx="120" cy="120" r="6" fill="#b5532c" />
              </svg>
              <figcaption className="sr-only">{d.dialLabel}</figcaption>
            </figure>
          </div>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {d.entries.map((e, i) => {
            const on = reduce || i === active;
            return (
              <li
                key={e.time}
                className="border-t border-olive/20 py-8 lg:flex lg:min-h-[34vh] lg:gap-10 lg:py-10"
              >
                <p className={`font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none tabular-nums transition-opacity duration-500 lg:w-40 lg:shrink-0 ${on ? "" : "lg:opacity-30"}`}>
                  <time>{e.time}</time>
                </p>
                <p className={`mt-3 max-w-[38ch] text-[1.1rem] leading-relaxed transition-colors duration-500 lg:mt-2 ${on ? "text-olive" : "lg:text-olive-soft"}`}>{e.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
