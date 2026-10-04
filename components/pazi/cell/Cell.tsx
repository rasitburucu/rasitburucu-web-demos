"use client";

// The live cell on a page: decides between WebGL and the vector drawing, loads
// three.js only after first paint, and hands the canvas to the engine.
// The drawing is always rendered first, so the area is never empty and the
// page works without WebGL; the canvas fades in over it once it has a frame.

import { useEffect, useRef, useState } from "react";
import { fit } from "@/lib/pazi/plan";
import { cell } from "@/lib/pazi/store";
import { kaliteKademesi } from "@/lib/pazi/tier";
import { IsoCell } from "./IsoCell";

type Props = {
  className?: string;
  frame?: { x: number; y: number };
  /** Framing below 900 px wide (defaults to centred). */
  frameNarrow?: { x: number; y: number };
  operator?: boolean;
  zoom?: number;
  /** Zoom below 900 px wide (defaults to zoom × 1.18). */
  zoomNarrow?: number;
  /** Ask for the vector drawing even on capable devices (e.g. small previews). */
  vectorOnly?: boolean;
};

type Mode = "pending" | "webgl" | "vector";

export function Cell({ className, frame, frameNarrow, operator, zoom, zoomNarrow, vectorOnly }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [ready, setReady] = useState(false);
  const [narrow, setNarrow] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = matchMedia("(max-width: 900px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const f = narrow ? (frameNarrow ?? { x: 0.5, y: 0.52 }) : frame;
  const frameX = f?.x;
  const frameY = f?.y;

  useEffect(() => {
    if (narrow === null) return;
    if (vectorOnly) {
      setMode("vector");
      return;
    }
    const q = kaliteKademesi();
    const params = new URLSearchParams(location.search);
    if (q.kademe === "yok" || q.kademe === "dusuk" || params.get("cizim") === "1") {
      setMode("vector");
      return;
    }
    setMode("webgl");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches || params.get("hareket") === "0";
    // ?yakin=2.5 frames the cell closer (inspection and stills)
    const close = Number(params.get("yakin")) || 0;
    let engine: { dispose(): void } | null = null;
    let alive = true;
    // give the first paint (headline, inputs) the main thread, then load three.js
    const start = () =>
      import("./engine")
        .then(({ CellEngine }) => {
          if (!alive || !canvasRef.current) return;
          let first = true;
          engine = new CellEngine(canvasRef.current, cell, {
            quality: q.kademe === "yuksek" ? "high" : "mid",
            reduced,
            frame: frameX !== undefined && frameY !== undefined ? { x: frameX, y: frameY } : undefined,
            operator,
            zoom: close > 0 ? close : narrow ? (zoomNarrow ?? (zoom ?? 1) * 1.18) : (zoom ?? 1),
            onFrame: () => {
              if (first) {
                first = false;
                setReady(true);
              }
            },
          });
          if (process.env.NODE_ENV !== "production") (window as unknown as { __pz?: unknown }).__pz = engine;
        })
        .catch(() => alive && setMode("vector"));
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const handle = idle ? idle(start, { timeout: 900 }) : window.setTimeout(start, 120);
    return () => {
      alive = false;
      if (!idle) window.clearTimeout(handle);
      engine?.dispose();
    };
  }, [vectorOnly, operator, zoom, zoomNarrow, frameX, frameY, narrow]);

  // tell the page how the cell is drawn: the drag hint and the view/speed
  // controls only make sense when the 3D cell is running
  useEffect(() => {
    if (vectorOnly) return;
    if (cell.get().render !== mode) cell.set({ render: mode });
  }, [mode, vectorOnly]);

  // the drawing shows the first pallet about 60% full; tell the status bar
  useEffect(() => {
    if (mode !== "vector") return;
    const sync = () => {
      const s = cell.get();
      const f = fit(s.config, s.lock);
      const placed = Math.max(1, Math.ceil(f.stack.layers * 0.6)) * f.plan.perLayer;
      if (s.live.placed !== placed) cell.set({ live: { ...s.live, placed } });
    };
    sync();
    return cell.subscribe(sync);
  }, [mode]);

  return (
    <div className={`pz-cell ${className ?? ""}`} data-mode={mode} data-ready={ready ? "true" : "false"}>
      <div className="pz-cell-vector" aria-hidden="true">
        <IsoCell />
      </div>
      {mode === "webgl" ? <canvas ref={canvasRef} className="pz-cell-canvas" aria-hidden="true" /> : null}
    </div>
  );
}
