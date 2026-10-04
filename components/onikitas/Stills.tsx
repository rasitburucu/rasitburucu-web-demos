"use client";

import { useEffect, useState } from "react";
import { addLoad, emit, on, store } from "@/lib/onikitas/store";
import { chapters } from "@/lib/onikitas/chapters";
import { tr } from "@/content/onikitas/tr";
import { asset } from "@/lib/asset";

// Curated frames rendered from the live scene, one per hour of the day. Used for
// reduced motion, for browsers without WebGL2 and as the no-JS backdrop.

const FRAMES = chapters.map((c) => asset(`/onikitas/frames/${c.id}.webp`));
const HOURS = [5.7, 7.0, 10.0, 13.0, 16.5, 19.67, 21.3];

function nearest(h: number) {
  let best = 0;
  for (let i = 1; i < HOURS.length; i++) if (Math.abs(HOURS[i] - h) < Math.abs(HOURS[best] - h)) best = i;
  return best;
}

export function Stills({ active, webglReady }: { active: boolean; webglReady: boolean }) {
  const [index, setIndex] = useState(0);
  const [wanted, setWanted] = useState<number[]>([0]);

  useEffect(() => {
    if (!active) return;
    const update = () => {
      const i = store.dialOn && store.dialHour !== null ? nearest(store.dialHour) : store.chapter;
      setIndex(i);
      setWanted((w) => Array.from(new Set([...w, i, Math.min(FRAMES.length - 1, i + 1)])));
    };
    update();
    const a = on("tone", update);
    const b = on("dial", update);
    return () => {
      a();
      b();
    };
  }, [active]);

  const onFirst = () => {
    if (!active || store.ready) return;
    addLoad(11);
    store.ready = true;
    emit("ready");
  };

  useEffect(() => {
    if (!active) return;
    const img = document.querySelector<HTMLImageElement>(".oki-stills img[data-i='0']");
    if (img?.complete) onFirst();
  });

  return (
    <>
    <div className="oki-stills" data-active={active ? "true" : "false"} data-hidden={!active && webglReady ? "true" : "false"} aria-hidden="true">
      {FRAMES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          data-i={i}
          src={i === 0 || wanted.includes(i) ? src : undefined}
          alt=""
          decoding="async"
          fetchPriority={i === 0 ? "high" : "low"}
          data-on={i === index ? "true" : "false"}
          onLoad={i === 0 ? onFirst : undefined}
          onError={i === 0 ? onFirst : undefined}
        />
      ))}
    </div>
    {active ? <p className="sr-only">{tr.fallback.stills}</p> : null}
    </>
  );
}
