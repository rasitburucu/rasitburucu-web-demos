"use client";

import { forwardRef, memo } from "react";
import { motion } from "framer-motion";
import { villas, typologies, type Villa } from "@/content/onikitas/villas";
import { tr } from "@/content/onikitas/tr";
import {
  COAST_PATH,
  PLAN_H,
  PLAN_W,
  ROAD_PATH,
  contourPaths,
  layerWeights,
  shadowPath,
  shapes,
  sunArcPath,
  sunLayers,
  sunPoint,
  azimuthAt,
  toPath,
  trees,
} from "@/lib/onikitas/geometry";

const INK = "#3b3a2e";
const TILE = "#b5532c";
const TILE_INK = "#9c4424";
const AEGEAN = "#1e3442";

// Static art is computed once per module.
const CONTOURS = contourPaths();
const TREES = trees();
const SUN_ARC = sunArcPath();
const SHADOWS = sunLayers.map((layer) => shapes.map((s) => shadowPath(layer, s)).join(" "));

type Props = {
  mode: "interactive" | "mini";
  hour: number;
  selected?: string | null;
  hovered?: string | null;
  highlight?: string | null; // mini mode
  focusId?: string | null;
  dimmed?: Set<string>;
  introState?: "hidden" | "drop" | "static";
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  onKeyNav?: (e: React.KeyboardEvent, id: string) => void;
  onFocusVilla?: (id: string) => void;
  className?: string;
  titleId?: string;
};

export const PlanSvg = memo(
  forwardRef<SVGSVGElement, Props>(function PlanSvg(
    {
      mode,
      hour,
      selected,
      hovered,
      highlight,
      focusId,
      dimmed,
      introState = "static",
      onHover,
      onSelect,
      onKeyNav,
      onFocusVilla,
      className,
      titleId = "onk-plan-title",
    },
    ref,
  ) {
    const weights = layerWeights(hour);
    const [sx, sy] = sunPoint(azimuthAt(hour));
    const interactive = mode === "interactive";
    const active = hovered ?? selected ?? highlight ?? null;

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${PLAN_W} ${PLAN_H}`}
        className={className}
        role={interactive ? "group" : "img"}
        aria-labelledby={`${titleId} ${titleId}-desc`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id={titleId}>{tr.plan.svgTitle}</title>
        <desc id={`${titleId}-desc`}>{tr.plan.svgDesc}</desc>
        <defs>
          <pattern id="onk-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke={INK} strokeWidth="1.3" />
          </pattern>
          <pattern id="onk-sea" width="8" height="5" patternUnits="userSpaceOnUse">
            <line x1="0" y1="2.5" x2="8" y2="2.5" stroke={AEGEAN} strokeOpacity="0.28" strokeWidth="0.8" />
          </pattern>
        </defs>

        <rect width={PLAN_W} height={PLAN_H} fill="#ece6da" />

        {/* sea */}
        <path d={COAST_PATH} fill="url(#onk-sea)" />
        <path d={COAST_PATH} fill="none" stroke={AEGEAN} strokeOpacity="0.5" strokeWidth="1.2" />

        {/* contours */}
        <g fill="none" stroke={INK}>
          {CONTOURS.map((d, i) => (
            <path key={i} d={d} strokeOpacity={i % 4 === 0 ? 0.26 : 0.13} strokeWidth={i % 4 === 0 ? 1.1 : 0.8} />
          ))}
        </g>

        {/* road */}
        <path d={ROAD_PATH} fill="none" stroke={INK} strokeOpacity="0.45" strokeWidth="17" strokeLinecap="round" />
        <path d={ROAD_PATH} fill="none" stroke="#ece6da" strokeWidth="14.5" strokeLinecap="round" />
        <path d={ROAD_PATH} fill="none" stroke={INK} strokeOpacity="0.3" strokeWidth="0.8" strokeDasharray="6 8" />

        {/* olive trees */}
        <g fill="none" stroke={INK} strokeOpacity="0.32">
          {TREES.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={3.8 + (i % 3)} />
              <circle cx={x} cy={y} r="0.9" fill={INK} fillOpacity="0.35" stroke="none" />
            </g>
          ))}
        </g>

        {/* plot lines + pools */}
        <g>
          {shapes.map((s) => (
            <g key={s.id}>
              <path d={toPath(s.plot)} fill="none" stroke={INK} strokeOpacity="0.16" strokeDasharray="2 4" />
              <path d={toPath(s.pool)} fill={AEGEAN} fillOpacity="0.2" stroke={AEGEAN} strokeOpacity="0.5" strokeWidth="0.8" />
            </g>
          ))}
        </g>

        {/* sun path + marker */}
        <path d={SUN_ARC} fill="none" stroke={TILE_INK} strokeOpacity="0.45" strokeWidth="1" strokeDasharray="1 6" strokeLinecap="round" />
        <g transform={`translate(${sx.toFixed(1)} ${sy.toFixed(1)})`} style={{ transition: "transform 0.5s cubic-bezier(.16,1,.3,1)" }}>
          <circle r="9" fill="#ece6da" stroke={TILE_INK} strokeWidth="1.3" />
          <circle r="3.4" fill={TILE_INK} />
        </g>

        {/* pre-drawn shadow layers, crossfaded by the sun slider */}
        <g style={{ mixBlendMode: "multiply" }}>
          {SHADOWS.map((d, i) => (
            <path key={i} d={d} fill={INK} style={{ opacity: weights[i] * 0.24, transition: "opacity 0.45s ease-out" }} />
          ))}
        </g>

        {/* villas */}
        <g>
          {villas.map((v, i) => (
            <VillaStone
              key={v.id}
              v={v}
              index={i}
              interactive={interactive}
              isActive={active === v.id}
              isSelected={selected === v.id}
              isDimmed={!!dimmed?.has(v.id)}
              isFocusable={focusId ? focusId === v.id : i === 0}
              introState={introState}
              onHover={onHover}
              onSelect={onSelect}
              onKeyNav={onKeyNav}
              onFocusVilla={onFocusVilla}
            />
          ))}
        </g>

        <Furniture />
      </svg>
    );
  }),
);

type StoneProps = {
  v: Villa;
  index: number;
  interactive: boolean;
  isActive: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  isFocusable: boolean;
  introState: "hidden" | "drop" | "static";
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  onKeyNav?: (e: React.KeyboardEvent, id: string) => void;
  onFocusVilla?: (id: string) => void;
};

function VillaStone({
  v,
  index,
  interactive,
  isActive,
  isSelected,
  isDimmed,
  isFocusable,
  introState,
  onHover,
  onSelect,
  onKeyNav,
  onFocusVilla,
}: StoneProps) {
  const s = shapes[index];
  const t = typologies[v.type];
  const status = tr.status[v.status];
  const fill = v.status === "available" ? TILE : v.status === "sold" ? "url(#onk-hatch)" : "#f6f2ea";
  const stroke = isActive ? TILE_INK : INK;
  const common = {
    fill,
    stroke,
    strokeWidth: v.status === "reserved" ? 1.8 : isActive ? 2.2 : 1.1,
    strokeDasharray: v.status === "reserved" ? "0.1 3.6" : undefined,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const variants = {
    hidden: { opacity: 0, y: -42 },
    shown: { opacity: 1, y: 0 },
  };

  const body = (
    <>
      {/* hit area */}
      <path d={toPath(s.plot)} fill="transparent" stroke="none" />
      {isActive ? (
        <path d={s.blocks.map((b) => toPath(b.pts)).join(" ")} fill="none" stroke={TILE_INK} strokeOpacity="0.35" strokeWidth="9" strokeLinejoin="round" />
      ) : null}
      {s.blocks.map((b, k) => (
        <path key={k} d={toPath(b.pts)} {...common} />
      ))}
      {v.status === "reserved"
        ? s.blocks.map((b, k) => <path key={`r${k}`} d={toPath(b.pts)} fill="none" stroke={INK} strokeOpacity="0.25" strokeWidth="0.6" />)
        : null}
      <text
        x={s.label[0]}
        y={s.label[1]}
        fontSize="12.5"
        fill={isActive ? TILE_INK : INK}
        fontWeight={isActive ? 600 : 500}
        style={{ fontFamily: "var(--font-plex-mono), monospace" }}
      >
        {v.id}
      </text>
    </>
  );

  const opacity = isDimmed ? 0.3 : 1;

  if (!interactive) {
    return (
      <g opacity={opacity} aria-hidden>
        {body}
      </g>
    );
  }

  return (
    <motion.g
      role="button"
      tabIndex={isFocusable ? 0 : -1}
      aria-label={tr.plan.villaAria(v.id, v.name, t.bedrooms, status)}
      aria-pressed={isSelected}
      data-villa={v.id}
      style={{ cursor: "pointer", outline: "none" }}
      className="onk-stone"
      initial={introState === "static" ? false : "hidden"}
      animate={introState === "hidden" ? "hidden" : { ...variants.shown, opacity }}
      variants={variants}
      transition={
        introState === "drop"
          ? { delay: index * 0.04, type: "spring", stiffness: 260, damping: 22, mass: 0.8, opacity: { duration: 0.25, delay: index * 0.04 } }
          : { duration: 0.3 }
      }
      onMouseEnter={() => onHover?.(v.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => {
        onHover?.(v.id);
        onFocusVilla?.(v.id);
      }}
      onBlur={() => onHover?.(null)}
      onClick={() => onSelect?.(v.id)}
      onKeyDown={(e) => onKeyNav?.(e, v.id)}
    >
      {body}
    </motion.g>
  );
}

/** North arrow, sea arrow, scale bar and the printed legend. */
function Furniture() {
  const p = tr.plan;
  return (
    <g style={{ fontFamily: "var(--font-plex-mono), monospace" }} fill={INK}>
      {/* north arrow */}
      <g transform="translate(944 58)">
        <circle r="22" fill="none" stroke={INK} strokeOpacity="0.5" />
        <path d="M0 -17 L7 9 L0 4 L-7 9 Z" fill={INK} />
        <text y="-28" textAnchor="middle" fontSize="12">
          {p.north}
        </text>
      </g>
      {/* sea arrow */}
      <g transform="translate(66 604)">
        <path d="M44 -30 L6 4" stroke={AEGEAN} strokeWidth="1.4" />
        <path d="M0 10 L14 -2 L4 -6 Z" fill={AEGEAN} />
        <text x="18" y="-36" fontSize="12" fill={AEGEAN}>
          {p.sea}
        </text>
      </g>
      {/* road label */}
      <text x="884" y="80" fontSize="11" fillOpacity="0.7">
        {p.road}
      </text>
      {/* scale bar: ~50 m */}
      <g transform="translate(700 668)">
        <rect width="30" height="5" fill={INK} />
        <rect x="30" width="30" height="5" fill="none" stroke={INK} strokeWidth="1" />
        <text x="0" y="-6" fontSize="10">
          0
        </text>
        <text x="60" y="-6" fontSize="10" textAnchor="end">
          {p.scale}
        </text>
      </g>
      {/* sun path label */}
      <text x="560" y="690" fontSize="10.5" textAnchor="middle" fill={TILE_INK}>
        {p.sunPath}
      </text>
    </g>
  );
}
