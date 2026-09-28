"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { emit, on, store } from "@/lib/onikitas/store";
import { DIAL_MAX, DIAL_MIN, formatHour } from "@/lib/onikitas/chapters";
import { tr, villas } from "@/content/onikitas/tr";

// The one conversion: pick the light, pick the house, open a prefilled e-mail.
// No form, no server. The address is fictional and the copy says so.

const CX = 200;
const CY = 196;
const R = 164;
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
  const [status, setStatus] = useState("");
  const [touched, setTouched] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
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
    setHour(v);
    setTouched(true);
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
    let h = hour;
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

  const time = formatHour(hour);
  const v = villas[sel];
  const subject = tr.dial.subject(v.no, time);
  const body = tr.dial.body(v.acc, time);
  const href = `mailto:${tr.dial.mailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${tr.dial.mailTo}\n${subject}\n\n${body}`);
      setStatus(tr.dial.copied);
    } catch {
      setStatus(tr.dial.copyFailed);
    }
  };

  const sun = pointAt(hour);
  const a = angleFor(hour);
  const elev = Math.sin(a);
  const shadowLen = 34 + 70 * (1 - elev);
  const shadow = { x: r2(CX - Math.cos(a) * shadowLen), y: r2(CY + Math.min(elev, 1) * 14 + 6) };
  const start = pointAt(DIAL_MIN);
  const large = hour - DIAL_MIN > (DIAL_MAX - DIAL_MIN) / 2 ? 1 : 0;

  return (
    <div className="oki-dial">
      <div
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
            dragging.current = true;
            (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
            fromPointer(e);
          }}
          onPointerMove={(e) => dragging.current && fromPointer(e)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
          aria-hidden="true"
        >
          <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`} className="oki-dial__arc" />
          <path d={`M ${start.x} ${start.y} A ${R} ${R} 0 ${large} 1 ${sun.x} ${sun.y}`} className="oki-dial__path" />
          {TICKS.map((h) => {
            const o = pointAt(h, R + 7);
            const i = pointAt(h, R - (LABELS.includes(h) ? 9 : 4));
            return <line key={h} x1={i.x} y1={i.y} x2={o.x} y2={o.y} className="oki-dial__tick" />;
          })}
          {LABELS.map((h) => {
            const p = pointAt(h, R - 26);
            return (
              <text key={h} x={p.x} y={r2(p.y + 4)} className="oki-dial__label" textAnchor="middle">
                {String(h).padStart(2, "0")}
              </text>
            );
          })}
          <line x1={CX - R - 16} y1={CY} x2={CX + R + 16} y2={CY} className="oki-dial__horizon" />
          <line x1={CX} y1={CY} x2={shadow.x} y2={shadow.y} className="oki-dial__shadow" />
          <circle cx={CX} cy={CY} r={3.5} className="oki-dial__pin" />
          <circle cx={sun.x} cy={sun.y} r={22} className="oki-dial__halo" />
          <circle cx={sun.x} cy={sun.y} r={11} className="oki-dial__sun" />
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
        <a className="oki-cta" href={href} onClick={() => setStatus(tr.dial.opened)} data-touched={touched ? "true" : "false"}>
          {tr.dial.cta}
        </a>
        <button type="button" className="oki-link" onClick={copy}>
          {tr.dial.copy}
        </button>
      </div>
      <p className="oki-dial__status" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
