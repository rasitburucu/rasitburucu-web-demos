"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { tr } from "@/content/onikitas/tr";
import { imageMeta } from "@/content/onikitas/images";
import { Photo } from "../Photo";
import { useMediaQuery } from "../plan/useMediaQuery";

// height in vh and vertical alignment per slot: a staggered, magazine rhythm
const SLOTS = [
  { h: 60, align: "self-start mt-[6vh]" },
  { h: 44, align: "self-end mb-[8vh]" },
  { h: 70, align: "self-center" },
  { h: 40, align: "self-start mt-[14vh]" },
  { h: 56, align: "self-end mb-[4vh]" },
  { h: 46, align: "self-center" },
  { h: 64, align: "self-start mt-[10vh]" },
];

export function Gallery() {
  const g = tr.gallery;
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pinned = isDesktop && !reduce;

  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!pinned || !track.current) return;
    const el = track.current;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  const items = g.items.map((k, i) => {
    const m = imageMeta[k];
    const slot = SLOTS[i % SLOTS.length];
    return { k, m, slot };
  });

  return (
    <section
      ref={wrap}
      aria-labelledby="onk-gal-h"
      className="relative"
      style={pinned && distance ? { height: `calc(100dvh + ${distance}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-dvh flex-col overflow-hidden" : ""}>
        <div className="mx-auto w-full max-w-[1600px] px-4 pt-20 sm:px-8 lg:px-12 lg:pt-16">
          <h2 id="onk-gal-h" className="text-[clamp(2.4rem,5vw,4.5rem)] leading-none">
            {g.heading}
          </h2>
          <p className="measure mt-3 text-olive-soft">{g.intro}</p>
        </div>
        <motion.div
          ref={track}
          role="list"
          aria-label={g.label}
          className={
            pinned
              ? "flex min-h-0 flex-1 items-stretch gap-[5vw] pl-[max(3rem,calc((100vw-1600px)/2+3rem))] pr-[8vw]"
              : "flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-10 sm:px-8 lg:px-12"
          }
          style={pinned ? { x } : undefined}
        >
          {items.map(({ k, m, slot }, i) => {
            const ratio = m.w / m.h;
            return (
              <figure
                key={k + i}
                role="listitem"
                className={pinned ? `shrink-0 ${slot.align}` : "shrink-0 snap-center"}
                style={
                  pinned
                    ? {
                        height: `min(${slot.h}vh, calc(100dvh - 260px))`,
                        width: `calc(min(${slot.h}vh, calc(100dvh - 260px)) * ${ratio.toFixed(3)})`,
                      }
                    : { height: "56vw", maxHeight: 420, width: `calc(min(56vw, 420px) * ${ratio.toFixed(3)})` }
                }
              >
                <Photo
                  k={k}
                  sizes={pinned ? `${Math.round(slot.h * ratio)}vh` : "80vw"}
                  className={`h-full w-full object-cover ${i === 2 ? "arch" : ""}`}
                />
              </figure>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
