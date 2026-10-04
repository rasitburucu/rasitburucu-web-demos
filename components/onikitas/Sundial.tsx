"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { emit, on, store } from "@/lib/onikitas/store";
import { DIAL_MAX, DIAL_MIN, formatHour, parseHour } from "@/lib/onikitas/chapters";
import { tr, villas } from "@/content/onikitas/tr";
import { goTo } from "@/lib/onikitas/goto";
import dynamic from "next/dynamic";

// The visit form loads on first use (warmed when the request button is
// approached), so the page's first JavaScript does not carry it; once loaded it
// stays mounted and keeps an unfinished request, as before.
const loadDialog = () => import("./VisitDialog");
const VisitDialog = dynamic(() => loadDialog().then((m) => m.VisitDialog), { ssr: false });

// The one conversion: pick the light, pick the house, ask for a visit. The
// request opens a modal form (VisitDialog); in this concept nothing is sent.
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

// a tick every quarter hour, a label every hour
const TICKS = Array.from({ length: (DIAL_MAX - DIAL_MIN) * 4 + 1 }, (_, i) => DIAL_MIN + i / 4);
const LABELS = Array.from({ length: DIAL_MAX - DIAL_MIN + 1 }, (_, i) => DIAL_MIN + i);

/** A house's best hour, on the dial. */
const bestHour = (i: number) => snap(parseHour(villas[i].hour));

/** The registry row's "Bu evi gör" button of a house, whichever layout is showing. */
const rowButton = (i: number) => {
  const a = document.getElementById(`evler-gor-${i}`);
  return a && a.offsetParent ? a : document.getElementById(`evler-kart-gor-${i}`);
};

export function Sundial() {
  // opens on the selected house's best hour (Villa VII: 20:00)
  const [hour, setHour] = useState(() => bestHour(store.selected));
  const [sel, setSel] = useState(store.selected);
  // the close-up (camera at the house), the way back to the registry, the panel's side
  const [focus, setFocus] = useState(store.focus);
  const [fromList, setFromList] = useState(store.fromList);
  const [side, setSide] = useState(store.panel);
  const [scene, setScene] = useState(false);
  // once the visitor moves the sun, picking a house no longer moves it
  const own = useRef(false);
  const svg = useRef<SVGSVGElement>(null);
  const face = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const cta = useRef<HTMLButtonElement>(null);
  const [asking, setAsking] = useState(false);
  const [dialogWanted, setDialogWanted] = useState(false);
  const closeAsk = useCallback(() => setAsking(false), []);
  // latest value for key repeat, which can outrun a render
  const hourRef = useRef(hour);
  const groupId = useId();

  const commit = useCallback((h: number) => {
    const v = snap(h);
    hourRef.current = v;
    setHour(v);
    store.dialHour = v;
    emit("dial");
  }, []);

  // a house picked anywhere (its stone, the 3D slope, the registry) brings the
  // sun to that house's best hour, unless the visitor has set the hour
  useEffect(
    () =>
      on("selected", () => {
        setSel(store.selected);
        if (!own.current) commit(bestHour(store.selected));
      }),
    [commit],
  );
  useEffect(() => {
    const sync = () => {
      setFocus(store.focus);
      setFromList(store.fromList);
      // the close-up exists only where the 3D scene runs (not on the stills)
      const webgl = document.documentElement.dataset.mode === "webgl";
      setScene(webgl);
      // while the camera is at a house, the evening question steps aside so
      // the house can fill the screen beside the panel (back on closing)
      document.documentElement.dataset.close = webgl && store.dialOn && store.focus >= 0 ? "true" : "false";
    };
    sync();
    const offF = on("focus", sync);
    const offD = on("dial", sync);
    return () => {
      offF();
      offD();
    };
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
    own.current = true;
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
    own.current = true;
    commit(h);
  };

  const choose = (i: number) => {
    store.selected = i;
    store.focus = i;
    emit("selected");
    emit("focus");
  };
  const closeUp = () => {
    store.focus = -1;
    emit("focus");
  };
  const backToList = () => {
    const i = store.fromList;
    store.focus = -1;
    store.fromList = -1;
    emit("focus");
    // the row lands a third of the way down the screen, its button focused
    goTo(rowButton(i)?.id ?? "evler", () => rowButton(i), Math.round(window.innerHeight * 0.35));
  };
  const flipSide = () => {
    const next = store.panel === "r" ? "l" : "r";
    store.panel = next;
    document.documentElement.dataset.panel = next;
    setSide(next);
    emit("panel");
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
    <div
      className="oki-dial"
      onKeyDown={(e) => {
        // Escape leaves the close-up (not while the visit form is open)
        if (e.key !== "Escape" || store.focus < 0 || (e.target as Element).closest("dialog")) return;
        e.preventDefault();
        closeUp();
      }}
    >
      <button type="button" className="oki-dial__side" data-panel-side onClick={flipSide}>
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" data-dir={side === "r" ? "l" : "r"}>
          <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        {side === "r" ? tr.dial.side.toLeft : tr.dial.side.toRight}
      </button>
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
            // the two end labels lift off the horizon line, along the arc
            const at = h === DIAL_MIN ? h + 0.32 : h === DIAL_MAX ? h - 0.32 : h;
            const p = pointAt(at, LABEL_R);
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
        <button
          ref={cta}
          type="button"
          className="oki-cta"
          aria-haspopup="dialog"
          onPointerEnter={() => void loadDialog()}
          onFocus={() => void loadDialog()}
          onClick={() => {
            setDialogWanted(true);
            setAsking(true);
          }}
        >
          {tr.dial.cta}
        </button>
        {scene && focus >= 0 ? (
          <button type="button" className="oki-dial__text" data-close-up onClick={closeUp}>
            {tr.dial.closeUp}
          </button>
        ) : null}
        {fromList >= 0 ? (
          <button type="button" className="oki-dial__text" data-back-list onClick={backToList}>
            {tr.dial.backToList}
          </button>
        ) : null}
      </div>
      {dialogWanted ? <VisitDialog open={asking} onClose={closeAsk} villa={sel} time={time} returnFocus={cta} /> : null}
    </div>
  );
}
