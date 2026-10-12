"use client";

// The walk as a strip map (after Ogilby's road strips): the route straightened
// out, start on the left, our door on the right. Each piece is drawn in its
// surface, flights of steps as rungs with their count, turns as small arrows,
// landmarks on the side where you pass them. Dashed edge: a sample measurement.

import { useEffect, useMemo, useRef } from "react";
import type { Lang } from "@/lib/yedipencere/dates";
import { fill, metres } from "@/lib/yedipencere/format";
import type { Leg, Piece, Walk } from "@/lib/yedipencere/route";
import { COPY } from "@/content/yedipencere/copy";
import { arrival as ARRIVAL } from "@/content/yedipencere/arrival";
import { BEGONVIL, BEGONVIL_D, INK, INK2 } from "../draw/geom";
import { shortName } from "./names";

const L = 64;
const R = 920;
const BY = 108;
const BH = 28;

const FILLS: Record<Piece["surface"], string> = {
  paving_stones: "url(#yp-tas)",
  sett: "url(#yp-arnavut)",
  asphalt: "#E4E3DF",
  stone: "#F7F6F2",
  rock: "#F7F6F2",
};

type Item = { x: number; text: string; cls: string; w: number };

/** Two or three label rows above the band, first fit wins. */
function rows(items: Item[], max = 3) {
  const ends = Array(max).fill(-Infinity) as number[];
  return items
    .sort((a, b) => a.x - b.x)
    .map((it) => {
      let r = 0;
      while (r < max - 1 && ends[r] > it.x - it.w / 2 - 8) r++;
      ends[r] = it.x + it.w / 2;
      return { ...it, row: r };
    });
}

function TurnMark({ x, turn }: { x: number; turn: Leg["turn"] }) {
  if (!turn || turn === "straight") return null;
  const right = turn.includes("right");
  const s = right ? 1 : -1;
  return (
    <path
      d={`M${x - 5 * s} ${BY - 4}V${BY - 12}H${x + 5 * s}M${x + 2 * s} ${BY - 15}L${x + 5 * s} ${BY - 12}L${x + 2 * s} ${BY - 9}`}
      fill="none"
      stroke={INK}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export function Strip({ walk, lang, roomName, roomSteps, startName }: { walk: Walk; lang: Lang; roomName: string; roomSteps: number; startName: string }) {
  const t = COPY[lang].arrival;
  const a = ARRIVAL[lang];
  const lineRef = useRef<SVGPathElement>(null);

  // piece widths: true to length, but no piece narrower than 26 units
  const geo = useMemo(() => {
    const total = walk.pieces.reduce((s, p) => s + p.m, 0);
    const raw = walk.pieces.map((p) => Math.max(26, (p.m / total) * (R - L)));
    const k = (R - L) / raw.reduce((s, w) => s + w, 0);
    let x = L;
    const pieces = walk.pieces.map((p, i) => {
      const w = raw[i] * k;
      const out = { p, x, w };
      x += w;
      return out;
    });
    // metres → x along the drawn strip
    const at = (m: number) => {
      let acc = 0;
      for (const g of pieces) {
        if (m <= acc + g.p.m) return g.x + ((m - acc) / g.p.m) * g.w;
        acc += g.p.m;
      }
      return R;
    };
    return { pieces, at };
  }, [walk]);

  const labels = useMemo(() => {
    const items: Item[] = [];
    let start = 0;
    walk.legs.forEach((leg) => {
      const x0 = geo.at(leg.at);
      const x1 = geo.at(leg.at + leg.m);
      start = x0;
      const mid = (start + x1) / 2;
      if (leg.kind === "steps") {
        const word = leg.dir === "down" ? fill(t.stepsDown, { n: leg.steps }) : fill(t.stepsUp, { n: leg.steps });
        const text = leg.stepsSample ? `${word} · ${COPY[lang].measuredSample}` : word;
        items.push({ x: mid, text, cls: "yp-strip-steps", w: text.length * 6.6 });
      } else if (leg.name && x1 - x0 > 44) {
        const text = shortName(leg, lang);
        items.push({ x: mid, text, cls: "yp-strip-name", w: text.length * 6.9 });
      }
    });
    walk.landmarks.forEach((lm) => {
      const name = lang === "en" && lm.nameEn ? lm.nameEn : lm.name;
      const text = `${name} (${lm.side === "left" ? (lang === "tr" ? "solda" : "left") : lang === "tr" ? "sağda" : "right"})`;
      items.push({ x: geo.at(lm.at), text, cls: "yp-strip-lm", w: text.length * 6.4 });
    });
    return rows(items, 2);
  }, [walk, geo, lang, t]);

  const ticks = useMemo(() => {
    const out: number[] = [];
    for (let m = 100; m < walk.m; m += 100) out.push(m);
    return out;
  }, [walk.m]);

  useEffect(() => {
    const p = lineRef.current;
    if (!p) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      p.style.strokeDasharray = "";
      p.style.strokeDashoffset = "";
      return;
    }
    const len = p.getTotalLength();
    p.style.transition = "none";
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;
    p.getBoundingClientRect();
    p.style.transition = "stroke-dashoffset 1.2s cubic-bezier(.45,0,.2,1)";
    p.style.strokeDashoffset = "0";
  }, [walk]);

  const label = `${startName} → ${t.door}: ${metres(walk.m, lang)}`;

  return (
    <svg className="yp-strip" viewBox="0 0 1000 210" role="img" aria-label={label}>
      {/* start */}
      <circle cx={L} cy={BY + BH / 2} r="8" fill="#FAFAF8" stroke={INK} strokeWidth="1.6" />
      <circle cx={L} cy={BY + BH / 2} r="2.6" fill={INK} />
      <text x={L - 8} y="30" className="yp-strip-start">
        {startName}
      </text>
      <text x={L - 8} y="48" className="yp-strip-hand">
        {t.handover} · {t.serviceSample}
      </text>
      <line x1={L} y1="54" x2={L} y2={BY + BH / 2 - 9} stroke={INK} strokeWidth="0.8" />

      {/* pieces */}
      {geo.pieces.map(({ p, x, w }, i) => {
        const sample = p.surfaceSample || p.stepsSample;
        if (p.kind === "steps") {
          const n = Math.max(4, Math.round(w / 4));
          return (
            <g key={i}>
              <rect x={x} y={BY} width={w} height={BH} fill="#FAFAF8" stroke={INK} strokeWidth="1.2" strokeDasharray={sample ? "4 3" : undefined} />
              <path d={Array.from({ length: n - 1 }, (_, k) => `M${(x + ((k + 1) * w) / n).toFixed(1)} ${BY}V${BY + BH}`).join("")} stroke={INK} strokeWidth="1" />
              <path
                d={p.dir === "down" ? `M${x + w / 2} ${BY + 6}V${BY + BH - 6}M${x + w / 2 - 4} ${BY + BH - 10}L${x + w / 2} ${BY + BH - 6}L${x + w / 2 + 4} ${BY + BH - 10}` : `M${x + w / 2} ${BY + BH - 6}V${BY + 6}M${x + w / 2 - 4} ${BY + 10}L${x + w / 2} ${BY + 6}L${x + w / 2 + 4} ${BY + 10}`}
                stroke={BEGONVIL_D}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          );
        }
        return (
          <g key={i}>
            <rect x={x} y={BY} width={w} height={BH} fill={FILLS[p.surface]} stroke={INK} strokeWidth={sample ? 0.9 : 1.2} strokeDasharray={sample ? "4 3" : undefined} />
            {p.slope && <path d={`M${x + 4} ${BY + BH - 5}L${x + w - 4} ${BY + 5}`} stroke={BEGONVIL} strokeWidth="1.8" fill="none" />}
          </g>
        );
      })}

      {/* turns at the start of each leg */}
      {walk.legs.slice(1).map((leg, i) => (
        <TurnMark key={i} x={geo.at(leg.at)} turn={leg.turn} />
      ))}

      {/* walking line */}
      <path ref={lineRef} d={`M${L} ${BY - 1.5}H${R}`} stroke={BEGONVIL} strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* labels */}
      {labels.map((it, i) => (
        <g key={i}>
          {it.row > 0 && <line x1={it.x} y1={86 - it.row * 18 + 4} x2={it.x} y2={BY - 16} stroke="#B9B0A8" strokeWidth="0.6" />}
          <text x={it.x} y={86 - it.row * 18} textAnchor="middle" className={it.cls}>
            {it.text}
          </text>
        </g>
      ))}

      {/* distance */}
      {ticks.map((m) => {
        const x = geo.at(m);
        return (
          <g key={m}>
            <line x1={x} y1={BY + BH} x2={x} y2={BY + BH + 8} stroke={INK} strokeWidth="0.9" />
            <text x={x} y={BY + BH + 22} textAnchor="middle" className="yp-strip-km">
              {m}
            </text>
          </g>
        );
      })}

      {/* door */}
      <rect x={R} y={BY - 8} width="18" height={BH + 16} fill="url(#yp-ahsap)" stroke={INK} strokeWidth="1.5" />
      <line x1={R + 9} y1={BY - 8} x2={R + 9} y2={BY + BH + 8} stroke={INK} strokeWidth="0.8" />
      <text x={R + 18} y="30" textAnchor="end" className="yp-strip-start">
        {t.door}
      </text>
      <text x={R + 18} y="48" textAnchor="end" className="yp-strip-hand">
        {fill(t.insideAfter, { oda: roomName, basamak: `${roomSteps} ${lang === "tr" ? "basamak" : roomSteps === 1 ? "step" : "steps"}` })}
      </text>
      <line x1={R + 9} y1="54" x2={R + 9} y2={BY - 8} stroke={INK} strokeWidth="0.8" />

      {/* heights at both ends, as level marks */}
      {[
        [L, walk.ele0, "start"],
        [R + 18, walk.ele1, "end"],
      ].map(([x, ele, anchor]) => (
        <g key={String(anchor)}>
          <path d={`M${Number(x) - (anchor === "end" ? 12 : 0)} ${BY + BH + 48} l6 -6 h-12 z`} fill="none" stroke={INK} strokeWidth="0.8" />
          <text x={Number(x) + (anchor === "end" ? -24 : 10)} y={BY + BH + 46} textAnchor={anchor === "end" ? "end" : "start"} className="yp-strip-km">
            {`+${ele} m`}
          </text>
        </g>
      ))}

      {/* legend */}
      <g className="yp-strip-legend" transform={`translate(${L} 200)`}>
        {(
          [
            ["url(#yp-tas)", a.surfaces.paving_stones],
            ["url(#yp-arnavut)", a.surfaces.sett],
            ["#E4E3DF", a.surfaces.asphalt],
          ] as const
        ).map(([fillv, txt], i) => (
          <g key={i} transform={`translate(${i * 150} 0)`}>
            <rect x="0" y="-9" width="22" height="11" fill={fillv} stroke={INK} strokeWidth="0.8" />
            <text x="28" y="0" className="yp-strip-km">
              {txt}
            </text>
          </g>
        ))}
        <g transform="translate(450 0)">
          <rect x="0" y="-9" width="22" height="11" fill="none" stroke={INK2} strokeWidth="0.9" strokeDasharray="4 3" />
          <text x="28" y="0" className="yp-strip-km">
            {COPY[lang].measuredSample}
          </text>
        </g>
        <g transform="translate(640 0)">
          <path d="M2 0 L20 -9" stroke={BEGONVIL} strokeWidth="1.8" />
          <text x="28" y="0" className="yp-strip-km">
            {t.slope}
          </text>
        </g>
      </g>
    </svg>
  );
}
