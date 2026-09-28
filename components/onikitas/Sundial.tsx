"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { emit, on, store } from "@/lib/onikitas/store";
import { DIAL_MAX, DIAL_MIN, formatHour } from "@/lib/onikitas/chapters";
import { tr, villas } from "@/content/onikitas/tr";

// The one conversion: pick the light, pick the house. The request button is a
// showpiece in this concept (no form, no e-mail, no server).
//
// Geometry, in viewBox units (400 x 236). One radius for the sun's path; the
// ticks sit outside it, the hour labels well inside it, so the sun's halo can
// ride the path at any hour without touching a label.

const CX = 200;
const CY = 196;
const R = 160;
const TICK_IN = R + 3;
const TICK_OUT = R + 9;
const TICK_OUT_MAJOR = R + 13;
const LABEL_R = R - 31;
const HALO_R = 16;
const SUN_R = 10;
const r2 = (v: number) => Math.round(v * 100) / 100;

function angleFor(h: number) {
  return Math.PI - ((h - DIAL_MIN) / (DIAL_MAX - DIAL_MIN)) * Math.PI;
}
function pointAt(h: number, rad = R) {
  const a = angleFor(h);
  return { x: r2(CX + rad * Math.cos(a)), y: r2(CY - rad * Math.sin(a)) };
}
const snap = (h: number) => Math.min(DIAL_MAX, Math.max(DIAL_MIN, Math.round(h * 12) / 12));

const TICKS = Array.from({ length: DIAL_MAX - DIAL_MIN + 1 }, (_, i) => DIAL_MIN + i);
const LABELS = [6, 9, 12, 15, 18, 21];

export function Sundial() {
  const [hour, setHour] = useState(19 + 40 / 60);
  const [sel, setSel] = useState(6);
  const svg = useRef<SVGSVGElement>(null);
  const face = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  // latest value for key repeat, which can outrun a render
  const hourRef = useRef(hour);
  const groupId = useId();

  useEffect(
    () =>
      on("selected", () => {
        setSel(store.selected);
      }),
    [],
  );

  const commit = useCallback((h: number) => {
    const v = snap(h);
    hourRef.current = v;
    setHour(v);
    store.dialHour = v;
    emit("dial");
  }, []);

  const fromPointer = (e: React.PointerEvent) => {
    const el = svg.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const sx = 400 / b.width;
    const x = (e.clientX - b.left) * sx - CX;
    const y = CY - (e.clientY - b.top) * sx;
    let a = Math.atan2(Math.max(y, -40), x);
    if (a < 0) a = x < 0 ? Math.PI : 0;
    commit(DIAL_MIN + ((Math.PI - a) / Math.PI) * (DIAL_MAX - DIAL_MIN));
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 1 : 1 / 6;
    let h = hourRef.current;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") h += step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") h -= step;
    else if (e.key === "PageUp") h += 1;
    else if (e.key === "PageDown") h -= 1;
    else if (e.key === "Home") h = DIAL_MIN;
    else if (e.key === "End") h = DIAL_MAX;
    else return;
    e.preventDefault();
    commit(h);
  };

  const choose = (i: number) => {
    setSel(i);
    store.selected = i;
    emit("selected");
  };
  const onRadioKey = (e: React.KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % 12;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i + 11) % 12;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = 11;
    else return;
    e.preventDefault();
    choose(n);
    document.getElementById(`${groupId}-${n}`)?.focus();
  };

  // dragging must never select the hour labels or the page behind the panel
  const endDrag = () => {
    dragging.current = false;
    document.documentElement.classList.remove("oki-noselect");
  };
  useEffect(() => () => document.documentElement.classList.remove("oki-noselect"), []);

  const time = formatHour(hour);
  const v = villas[sel];

  const sun = pointAt(hour);
  const start = pointAt(DIAL_MIN);
  // The travelled path is always the upper semicircle's minor arc (<= 180deg),
  // so the large-arc flag is always 0. (With 1, SVG drew the long way round a
  // bigger circle once the hour passed 13:30 and the arc left the panel.)

  return (
    <div className="oki-dial">
      <div
        ref={face}
        className="oki-dial__face"
        role="slider"
        tabIndex={0}
        aria-label={tr.dial.label}
        aria-valuemin={DIAL_MIN}
        aria-valuemax={DIAL_MAX}
        aria-valuenow={r2(hour)}
        aria-valuetext={time}
        aria-describedby={`${groupId}-hint`}
        onKeyDown={onKey}
      >
        <svg
          ref={svg}
          viewBox="0 0 400 236"
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            face.current?.focus({ preventScroll: true });
            dragging.current = true;
            document.documentElement.classList.add("oki-noselect");
            (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
            fromPointer(e);
          }}
          onPointerMove={(e) => dragging.current && fromPointer(e)}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          aria-hidden="true"
        >
          {/* back to front: track, travelled path, halo, ticks, labels, ground, sun */}
          <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`} className="oki-dial__arc" />
          <path d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${sun.x} ${sun.y}`} className="oki-dial__path" />
          <circle cx={sun.x} cy={sun.y} r={HALO_R} className="oki-dial__halo" />
          {TICKS.map((h) => {
            const major = LABELS.includes(h);
            const i = pointAt(h, TICK_IN);
            const o = pointAt(h, major ? TICK_OUT_MAJOR : TICK_OUT);
            return <line key={h} x1={i.x} y1={i.y} x2={o.x} y2={o.y} className="oki-dial__tick" data-major={major || undefined} />;
          })}
          {LABELS.map((h) => {
            const p = pointAt(h, LABEL_R);
            return (
              <text key={h} x={p.x} y={p.y} className="oki-dial__label" textAnchor="middle" dominantBaseline="central">
                {String(h).padStart(2, "0")}
              </text>
            );
          })}
          <line x1={CX - R - 16} y1={CY} x2={CX + R + 16} y2={CY} className="oki-dial__horizon" />
          <circle cx={sun.x} cy={sun.y} r={SUN_R} className="oki-dial__sun" />
        </svg>
        <p className="oki-dial__time" aria-hidden="true">
          {time}
        </p>
      </div>
      <p id={`${groupId}-hint`} className="oki-dial__hint">
        {tr.dial.hint}
      </p>

      <fieldset className="oki-dial__villas">
        <legend>{tr.dial.villaLegend}</legend>
        <div role="radiogroup" aria-label={tr.dial.villaLegend} className="oki-dial__stones">
          {villas.map((vv, i) => (
            <button
              key={vv.no}
              id={`${groupId}-${i}`}
              type="button"
              role="radio"
              aria-checked={sel === i}
              aria-label={`${tr.dial.villaPrefix} ${vv.no}`}
              tabIndex={sel === i ? 0 : -1}
              className="oki-pebble"
              onClick={() => choose(i)}
              onKeyDown={(e) => onRadioKey(e, i)}
              onPointerEnter={() => {
                store.hover = i;
                emit("hover");
              }}
              onPointerLeave={() => {
                store.hover = -1;
                emit("hover");
              }}
            >
              {vv.no}
            </button>
          ))}
        </div>
      </fieldset>

      <p className="oki-dial__choice">
        <span className="oki-dial__villa">
          {tr.dial.villaPrefix} {v.no}
        </span>
        <span>
          {v.facing}. {tr.dial.lightsAt(time)}.
        </span>
      </p>

      <div className="oki-dial__actions">
        <button type="button" className="oki-cta">
          {tr.dial.cta}
        </button>
      </div>
    </div>
  );
}
