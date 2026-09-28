"use client";

import { useEffect, useRef, useState } from "react";
import { on, store } from "@/lib/onikitas/store";
import { tr, villas } from "@/content/onikitas/tr";

// A model-maker's pin label: a leader line from the house to a small card.
export function VillaTip() {
  const [id, setId] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const hideTimer = useRef(0);

  useEffect(() => {
    const place = () => {
      const el = box.current;
      if (!el) return;
      const { x, y } = pos.current;
      const w = el.offsetWidth;
      const flip = x + w + 60 > window.innerWidth;
      el.dataset.flip = flip ? "true" : "false";
      el.style.transform = `translate3d(${Math.round(flip ? x - w - 44 : x + 44)}px, ${Math.round(y - 70)}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      place();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    const off = on("hover", () => {
      setId(store.hover);
      requestAnimationFrame(place);
      clearTimeout(hideTimer.current);
      if (store.hover >= 0 && matchMedia("(pointer: coarse)").matches) {
        hideTimer.current = window.setTimeout(() => {
          store.hover = -1;
          setId(-1);
        }, 3800);
      }
    });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      off();
    };
  }, []);

  const v = id >= 0 ? villas[id] : null;
  return (
    <div ref={box} className="oki-tip" data-on={v ? "true" : "false"} aria-hidden="true">
      <span className="oki-tip__leader" />
      {v ? (
        <>
          <p className="oki-tip__no">{v.no}</p>
          <p className="oki-tip__facing">{v.facing}</p>
          <p className="oki-tip__line">{v.line}</p>
          <p className="oki-tip__hour">{tr.tip.loves(v.hour)}</p>
        </>
      ) : null}
    </div>
  );
}
