"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { tr } from "@/content/onikitas/tr";
import type { ImageKey } from "@/content/onikitas/images";
import { Photo } from "../Photo";

const VIEWS: { key: "morning" | "sunset" | "night"; img: ImageKey }[] = [
  { key: "morning", img: "view-morning" },
  { key: "sunset", img: "view-sunset" },
  { key: "night", img: "view-night" },
];

export function TerraceView() {
  const t = tr.villa.terrace;
  const [active, setActive] = useState<(typeof VIEWS)[number]["key"]>("sunset");
  const reduce = useReducedMotion();
  const current = VIEWS.find((v) => v.key === active)!;

  return (
    <section id="manzara" aria-labelledby="onk-terrace-h" className="mt-24 scroll-mt-28">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="onk-terrace-h" className="text-[clamp(2rem,3.4vw,3rem)] leading-none">
          {t.heading}
        </h2>
        <div className="flex gap-2" role="group" aria-label={t.label}>
          {VIEWS.map((v) => (
            <button key={v.key} type="button" className="chip" aria-pressed={active === v.key} onClick={() => setActive(v.key)}>
              {t[v.key]}
            </button>
          ))}
        </div>
      </div>
      <div className="relative mt-6 aspect-[16/10] overflow-hidden bg-olive">
        <AnimatePresence initial={false}>
          <motion.div
            key={current.img}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: reduce ? 1 : 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Photo k={current.img} sizes="(min-width:1024px) 60vw, 92vw" className="h-full w-full object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
