"use client";

import { useEffect, useRef, useState } from "react";
import { on, store } from "@/lib/onikitas/store";
import { tr } from "@/content/onikitas/tr";

// Twelve stones drop onto the horizon, one per real loading milestone
// (fonts, scene code, textures, geometry, shader compile, first frames).

const STONES = Array.from({ length: 12 }, (_, i) => {
  // fixed, SSR-stable variation (no Math.random)
  const w = [30, 26, 34, 28, 31, 25, 33, 27, 29, 32, 26, 30][i];
  const h = [18, 16, 20, 17, 19, 15, 21, 16, 18, 20, 16, 18][i];
  const r = [-4, 3, -2, 5, -1, 2, -5, 4, -3, 1, -2, 3][i];
  return { w, h, r };
});

export function Loader({ mode }: { mode: "pending" | "webgl" | "stills" }) {
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const start = useRef(0);

  useEffect(() => {
    start.current = performance.now();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    const step = () => {
      setShown((s) => {
        const next = Math.min(store.load, s + 1);
        return next;
      });
    };
    timer = window.setInterval(step, reduce ? 40 : 120);
    const off = on("load", step);
    return () => {
      clearInterval(timer);
      off();
    };
  }, []);

  useEffect(() => {
    if (shown < 12 || leaving) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const min = reduce ? 200 : 1900;
    const wait = Math.max(0, min - (performance.now() - start.current)) + (reduce ? 0 : 380);
    const t = window.setTimeout(() => {
      setLeaving(true);
      document.documentElement.dataset.loaded = "true";
    }, wait);
    const t2 = window.setTimeout(() => setGone(true), wait + (reduce ? 300 : 1500));
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [shown, leaving]);

  // hard stop: never trap the page behind the loader
  useEffect(() => {
    const t = window.setTimeout(() => {
      store.load = 12;
      setShown(12);
    }, 15000);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;
  return (
    <div className="oki-loader" data-leaving={leaving ? "true" : "false"} data-mode={mode} role="status" aria-live="polite" aria-busy={!leaving}>
      <span className="sr-only">{tr.loader.label}</span>
      <div className="oki-loader__inner" aria-hidden="true">
        <p className="oki-loader__coords">{tr.loader.coords}</p>
        <p className="oki-loader__time">{tr.loader.time}</p>
        <div className="oki-loader__ground">
          <div className="oki-loader__stones">
            {STONES.map((s, i) => (
              <span
                key={i}
                className="oki-stone"
                data-in={i < shown ? "true" : "false"}
                style={{ width: s.w, height: s.h, rotate: `${s.r}deg` }}
              />
            ))}
          </div>
          <span className="oki-loader__horizon" />
        </div>
        <p className="oki-loader__count">{String(shown).padStart(2, "0")}</p>
      </div>
    </div>
  );
}
