"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { typologies, typologyStats, type TypologyId } from "@/content/onikitas/villas";
import { tr } from "@/content/onikitas/tr";
import { Photo } from "../Photo";
import { usePlanFilters } from "../shell/Shell";

const ORDER: TypologyId[] = ["tas", "zeytin", "kule"];
const fmt = (n: number) => n.toLocaleString("tr-TR");

export function Typologies() {
  const c = tr.typologies;
  const [active, setActive] = useState<TypologyId>("zeytin");
  const reduce = useReducedMotion();
  const { focusType } = usePlanFilters();
  const id = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKey = (e: React.KeyboardEvent) => {
    const i = ORDER.indexOf(active);
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % ORDER.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + ORDER.length) % ORDER.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ORDER.length - 1;
    else return;
    e.preventDefault();
    setActive(ORDER[next]);
    tabRefs.current[ORDER[next]]?.focus();
  };

  const t = typologies[active];
  const stats = typologyStats(active);
  const item = c.items[active];

  return (
    <section id="tipler" aria-labelledby="onk-types-h" className="mx-auto max-w-[1600px] px-4 py-24 sm:px-8 lg:px-12 lg:py-36">
      <h2 id="onk-types-h" className="text-[clamp(2.4rem,5vw,4.5rem)] leading-none">
        {c.heading}
      </h2>
      <p className="measure mt-4 text-olive-soft">{c.intro}</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div role="tablist" aria-label={c.tabsLabel} aria-orientation="vertical" className="flex gap-2 overflow-x-auto lg:col-span-3 lg:flex-col lg:gap-0 lg:overflow-visible" onKeyDown={onKey}>
          {ORDER.map((k) => {
            const ty = typologies[k];
            const st = typologyStats(k);
            const on = k === active;
            return (
              <button
                key={k}
                ref={(el) => {
                  tabRefs.current[k] = el;
                }}
                role="tab"
                id={`${id}-tab-${k}`}
                aria-selected={on}
                aria-controls={`${id}-panel`}
                tabIndex={on ? 0 : -1}
                type="button"
                onClick={() => setActive(k)}
                className={`group relative shrink-0 border-olive/20 py-4 pr-6 text-left transition-colors lg:border-b ${on ? "text-olive" : "text-olive/60 hover:text-olive"}`}
              >
                <span className="block font-display text-[clamp(2.2rem,3.6vw,3.6rem)] leading-none">{ty.name}</span>
                <span className="label-mono mt-2 block text-olive-soft">
                  {ty.layout} · {st.interior[0]}-{st.interior[1]} m²
                </span>
                <span
                  aria-hidden
                  className={`absolute bottom-0 left-0 h-[2px] bg-tile transition-[width] duration-500 ${on ? "w-full lg:w-16" : "w-0"}`}
                />
              </button>
            );
          })}
        </div>

        <div className="relative aspect-[4/5] w-full max-w-[560px] lg:col-span-5 lg:max-w-none">
          <div className="arch absolute inset-0 overflow-hidden bg-travertine">
            <AnimatePresence initial={false}>
              <motion.div
                key={item.image}
                className="absolute inset-0"
                initial={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
                animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 0.61, 0.21, 1] }}
              >
                <Photo k={item.image} sizes="(min-width:1024px) 38vw, 92vw" className="h-full w-full object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="flex flex-col justify-end lg:col-span-4">
          <p className="max-w-[40ch] text-[1.15rem] leading-relaxed">{item.body}</p>
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-olive/25 pt-6">
            <div>
              <dt className="text-sm text-olive-soft">{c.interior}</dt>
              <dd className="label-mono mt-1 !text-[1rem]">
                {stats.interior[0]}-{stats.interior[1]} m²
              </dd>
            </div>
            <div>
              <dt className="text-sm text-olive-soft">{c.plot}</dt>
              <dd className="label-mono mt-1 !text-[1rem]">
                {fmt(stats.plot[0])}-{fmt(stats.plot[1])} m²
              </dd>
            </div>
            <div>
              <dt className="text-sm text-olive-soft">{tr.plan.bedrooms}</dt>
              <dd className="label-mono mt-1 !text-[1rem]">
                {t.bedrooms} + salon, {t.bathrooms} banyo
              </dd>
            </div>
            <div>
              <dt className="text-sm text-olive-soft">{tr.plan.table.status}</dt>
              <dd className={`mt-1 ${stats.available ? "text-tile-ink" : ""}`}>
                {c.available(stats.available)} <span className="text-olive-soft">/ {stats.count}</span>
              </dd>
            </div>
          </dl>
          <div className="mt-8">
            <button type="button" className="btn-line" onClick={() => focusType(active)}>
              {c.seePlans}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
