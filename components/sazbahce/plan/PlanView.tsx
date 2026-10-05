"use client";

import { useEffect, useId, useRef, useState } from "react";
import { tr } from "@/content/sazbahce/tr";
import { BARN, FRAMES, PLATFORM, PIER, YARD, meadowPath, shoreX, type Item, type Layout } from "@/lib/sazbahce/plan";
import { AREAS, type AreaKey } from "@/lib/sazbahce/venue";
import { PlanBase } from "./PlanBase";

const INK = "#1D3830";
const AYVA = "#E8AF56";
const f1 = (n: number) => n.toFixed(1);

const LABELS = {
  lake: tr.planner.lake,
  iskele: tr.areas.iskele.plan,
  cayir: tr.areas.cayir.plan,
  ambar: tr.areas.ambar.plan,
  avlu: tr.areas.avlu.plan,
  entrance: tr.planner.entrance,
  north: tr.planner.north,
  scale: tr.planner.scale,
};

function areaShape(a: AreaKey): string {
  if (a === "cayir") return meadowPath();
  if (a === "ambar") return `M${BARN.x - 5} ${BARN.y - 5}h${BARN.w + 10}v${BARN.h + 10}h${-BARN.w - 10}Z`;
  if (a === "avlu") return `M${YARD.x - 5} ${YARD.y - 5}h${YARD.w + 10}v${YARD.h + 10}h${-YARD.w - 10}Z`;
  const kx = shoreX(PIER.y);
  return `M${PLATFORM.x - 8} ${PLATFORM.y - 8}h${PLATFORM.w + 16}v${PIER.y - PLATFORM.y - PIER.half}h${kx - PLATFORM.x - PLATFORM.w + 8}v${PIER.half * 2 + 16}h${-(kx - PLATFORM.x - PLATFORM.w + 8)}v${PLATFORM.y + PLATFORM.h - PIER.y - PIER.half}h${-PLATFORM.w - 16}Z`;
}

function seatsAround(x: number, y: number, r: number, n: number) {
  let d = "";
  for (let j = 0; j < n; j++) {
    const a = (j / n) * Math.PI * 2;
    const sx = x + Math.cos(a) * (r + 3.8);
    const sy = y + Math.sin(a) * (r + 3.8);
    d += `M${f1(sx)} ${f1(sy)}h0.01`;
  }
  return d;
}

function ItemShape({ it }: { it: Item }) {
  switch (it.k) {
    case "round":
      return (
        <>
          <circle cx={f1(it.x)} cy={f1(it.y)} r={it.r} fill="#FBFBF7" stroke={INK} strokeWidth="1.2" />
          <path d={seatsAround(it.x, it.y, it.r, it.seats)} stroke={INK} strokeWidth="3.6" strokeLinecap="round" />
        </>
      );
    case "long": {
      const vertical = it.h > it.w;
      const per = it.seats / 2;
      let d = "";
      for (let j = 0; j < per; j++) {
        const t = (j + 0.5) / per;
        if (vertical) d += `M${f1(it.x - 3.6)} ${f1(it.y + t * it.h)}h0.01M${f1(it.x + it.w + 3.6)} ${f1(it.y + t * it.h)}h0.01`;
        else d += `M${f1(it.x + t * it.w)} ${f1(it.y - 3.6)}h0.01M${f1(it.x + t * it.w)} ${f1(it.y + it.h + 3.6)}h0.01`;
      }
      return (
        <>
          <rect x={f1(it.x)} y={f1(it.y)} width={it.w} height={it.h} fill="#FBFBF7" stroke={INK} strokeWidth="1.1" />
          <path d={d} stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        </>
      );
    }
    case "desk": {
      let d = "";
      for (let j = 0; j < it.seats; j++) {
        const t = (j + 0.5) / it.seats;
        if (it.side === "s") d += `M${f1(it.x + t * it.w)} ${f1(it.y + it.h + 3.4)}h0.01`;
        else if (it.side === "w") d += `M${f1(it.x - 3.4)} ${f1(it.y + t * it.h)}h0.01`;
        else d += `M${f1(it.x + it.w + 3.4)} ${f1(it.y + t * it.h)}h0.01`;
      }
      return (
        <>
          <rect x={f1(it.x)} y={f1(it.y)} width={it.w} height={it.h} fill="#FBFBF7" stroke={INK} strokeWidth="1" />
          <path d={d} stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
        </>
      );
    }
    case "high":
      return (
        <>
          <circle cx={f1(it.x)} cy={f1(it.y)} r="9" fill="none" stroke={INK} strokeWidth="0.6" strokeDasharray="1.5 2.5" />
          <circle cx={f1(it.x)} cy={f1(it.y)} r="3.6" fill="#FBFBF7" stroke={INK} strokeWidth="1.1" />
        </>
      );
    default:
      // a chair seen from above, facing west (the altar): seat and a back rail on its east side
      return (
        <>
          <rect x={f1(it.x - 2.4)} y={f1(it.y - 2.6)} width="4.4" height="5.2" rx="0.8" fill="#FBFBF7" stroke={INK} strokeWidth="0.9" />
          <path d={`M${f1(it.x + 2.4)} ${f1(it.y - 3)}v6`} stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        </>
      );
  }
}

const itemKey = (it: Item) => `${it.k}${Math.round(it.x)}:${Math.round(it.y)}`;

function LayoutLayer({ layout }: { layout: Layout }) {
  const { pist, altar, screen, aisle } = layout;
  let planks = "";
  if (pist) for (let x = pist.x + 8; x < pist.x + pist.w; x += 8) planks += `M${f1(x)} ${pist.y}v${pist.h}`;
  return (
    <g className="sb-layout">
      {screen && (
        <g>
          <path d={`M${screen.x1} ${screen.y1}H${screen.x2}`} stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
          <text className="sb-l-fixed" x={(screen.x1 + screen.x2) / 2} y={screen.y1 + 13} textAnchor="middle" fontSize="10" fontFamily="var(--sb-sans)" fill={INK}>
            {tr.planner.sahne}
          </text>
        </g>
      )}
      {pist && (
        <g className="sb-t" key={`pist${pist.w}${pist.x}`}>
          <rect x={f1(pist.x)} y={pist.y} width={pist.w} height={pist.h} fill={AYVA} stroke={INK} strokeWidth="1.3" />
          <path d={planks} stroke="#A57A2C" strokeWidth="0.5" />
          <text className="sb-l-fixed" x={f1(pist.x + pist.w / 2)} y={pist.y + pist.h / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="var(--sb-sans)" fill={INK}>
            {pist.label === "sahne" ? tr.planner.sahne : tr.planner.pist}
          </text>
        </g>
      )}
      {aisle && <rect className="sb-t" x={f1(aisle.x)} y={f1(aisle.y)} width={f1(aisle.w)} height={aisle.h} fill="#D9C7A4" opacity="0.85" />}
      {altar && (
        <g className="sb-t">
          <rect x={f1(altar.x)} y={f1(altar.y)} width={altar.w} height={altar.h} fill={AYVA} stroke={INK} strokeWidth="1.2" />
        </g>
      )}
      {layout.items.map((it, i) => (
        <g key={itemKey(it)} className="sb-t" style={{ animationDelay: `${(i % 28) * 14}ms` }}>
          <ItemShape it={it} />
        </g>
      ))}
    </g>
  );
}

type Box = [number, number, number, number];

function frameBox(frame: keyof typeof FRAMES, w: number, h: number, close = false): Box {
  const narrow = close || w < 560;
  const [cx, cy, sw, sh] = FRAMES[frame][narrow ? "narrow" : "wide"];
  const aspect = w / Math.max(h, 1);
  let vw = sw;
  let vh = sw / aspect;
  if (vh < sh) {
    vh = sh;
    vw = sh * aspect;
  }
  // keep the top ~64 px for the reading box: shift the frame up by that much
  const top = 64 * (vh / Math.max(h, 1));
  const vh2 = vh + top;
  const vw2 = vw * (vh2 / vh);
  return [cx - vw2 / 2, cy - vh / 2 - top, vw2, vh2];
}

const ease = (t: number) => 1 - Math.pow(1 - t, 4);

/** Hide plan labels that the current framing would cut (a half "LÜ" at the edge reads as a mistake). */
function clipLabels(svg: SVGSVGElement, b: Box, px: number) {
  const pad = 6 * (b[2] / Math.max(px, 1));
  svg.querySelectorAll<SVGGraphicsElement>(".sb-plan-labels text, .sb-plan-depth text, .sb-plan-labels .sb-plan-north").forEach((t) => {
    t.style.visibility = "";
    const r = t.getBBox();
    const m = t.getCTM();
    const s = svg.getCTM();
    // bbox is in the element's own space; the north arrow group is translated
    let x = r.x;
    let y = r.y;
    if (m && s) {
      const local = s.inverse().multiply(m);
      x = local.a * r.x + local.e;
      y = local.d * r.y + local.f;
      const w = r.width * local.a;
      const h = r.height * local.d;
      const inside = x >= b[0] + pad && y >= b[1] + pad && x + w <= b[0] + b[2] - pad && y + h <= b[1] + b[3] - pad;
      t.style.visibility = inside ? "" : "hidden";
    }
  });
}

type Props = {
  area: AreaKey;
  frame?: keyof typeof FRAMES;
  layout: Layout | null;
  onPick?: (a: AreaKey) => void;
  /** Areas that cannot be picked (e.g. not offered for this event). */
  disabled?: AreaKey[];
  label?: string;
  className?: string;
  /** Always use the close framing (corporate planner). */
  close?: boolean;
  children?: React.ReactNode;
};

/** The shore plan with a layout on it. Picks an area on click; glides to its framing. */
export function PlanView({ area, frame, layout, onPick, disabled = [], label = tr.planner.planLabel, className, close = false, children }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const box = useRef<Box | null>(null);
  const [size, setSize] = useState<[number, number] | null>(null);
  const target = frame ?? area;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (width > 0 && height > 0) setSize([Math.round(width), Math.round(height)]);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!size || !svg.current) return;
    const to = frameBox(target, size[0], size[1], close);
    const from = box.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const apply = (b: Box) => {
      box.current = b;
      svg.current?.setAttribute("viewBox", b.map((n) => n.toFixed(1)).join(" "));
      // plan units per screen pixel: labels and the north arrow keep one size at every zoom
      svg.current?.style.setProperty("--sb-k", (b[2] / size[0]).toFixed(3));
    };
    const done = () => svg.current && clipLabels(svg.current, to, size[0]);
    if (!from || reduce) {
      apply(to);
      done();
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 600);
      const k = ease(t);
      apply(from.map((v, i) => v + (to[i] - v) * k) as Box);
      if (t < 1) raf = requestAnimationFrame(step);
      else done();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, size, close]);

  const initial = FRAMES[target].wide;
  return (
    <div ref={wrap} className={`sb-plan ${className ?? ""}`}>
      <svg
        ref={svg}
        viewBox={`${initial[0] - initial[2] / 2} ${initial[1] - initial[3] / 2} ${initial[2]} ${initial[3]}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={label}
      >
        <PlanBase uid={uid} part="ground" labels={LABELS} />
        <path d={areaShape(area)} className="sb-plan-sel" />
        {layout && <LayoutLayer layout={layout} />}
        <g className="sb-plan-canopy">
          <PlanBase uid={uid} part="canopy" labels={LABELS} />
        </g>
        {onPick && (
          <g className="sb-plan-hits">
            {AREAS.filter((a) => a !== area && !disabled.includes(a)).map((a) => (
              <a
                key={a}
                href={`#alan-${a}`}
                aria-label={tr.planner.pick(tr.areas[a].name)}
                onClick={(e) => {
                  e.preventDefault();
                  onPick(a);
                }}
              >
                <path d={areaShape(a)} />
              </a>
            ))}
          </g>
        )}
      </svg>
      {children}
    </div>
  );
}
