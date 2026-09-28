"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { tr } from "@/content/onikitas/tr";
import { useBooking, useSmoothScroll } from "../shell/Shell";

/**
 * Hero signature: the page is a limewashed wall and the sun moves with the
 * scroll. A soft pergola shadow slides across wall and arch as the hero
 * leaves the viewport. Reduced motion: the shadow rests in one place.
 */
export function HeroMotion({ image, children }: { image: React.ReactNode; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const shadowX = useTransform(scrollYProgress, [0, 1], ["-18%", "62%"]);
  const shadowSkew = useTransform(scrollYProgress, [0, 1], [-16, -34]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0.75, 1, 0.9]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <section ref={ref} aria-labelledby="onk-hero-title" className="relative isolate overflow-hidden">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-y-8 px-4 pb-10 pt-4 sm:px-8 lg:min-h-[calc(100dvh-104px)] lg:grid-cols-12 lg:gap-x-8 lg:px-12 lg:pb-14 lg:pt-6">
        <div className="relative order-1 h-[40svh] min-h-[250px] lg:order-2 lg:col-span-5 lg:col-start-8 lg:h-auto">
          <div className="onk-arch-open arch absolute inset-0 overflow-hidden bg-travertine">
            <motion.div className="h-full w-full" style={reduce ? undefined : { scale: imageScale, y: imageY }}>
              {image}
            </motion.div>
          </div>
        </div>
        <div className="relative z-10 order-2 flex flex-col justify-end lg:order-1 lg:col-span-7">{children}</div>
      </div>

      {/* The moving sun: a broad soft shadow with pergola slats inside it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden mix-blend-multiply"
        style={{ maskImage: "linear-gradient(180deg, transparent, #000 160px)", WebkitMaskImage: "linear-gradient(180deg, transparent, #000 160px)" }}
      >
        <motion.div
          className="absolute -top-[30%] left-0 h-[160%] w-[70%]"
          style={
            reduce
              ? { x: "8%", skewX: -20, opacity: 0.85 }
              : { x: shadowX, skewX: shadowSkew, opacity: shadowOpacity }
          }
        >
          <div
            className="absolute inset-0"
            style={{
              background: "#3b3a2e",
              opacity: 0.1,
              filter: "blur(38px)",
              maskImage: "linear-gradient(90deg, transparent, #000 22%, #000 70%, transparent)",
            }}
          />
          <div
            className="absolute inset-y-0 left-[18%] right-[22%]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(59,58,46,0.11) 0 30px, transparent 30px 70px)",
              filter: "blur(9px)",
              maskImage: "linear-gradient(180deg, transparent 8%, #000 30%, #000 75%, transparent 95%)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

export function HeroActions() {
  const { open } = useBooking();
  const { scrollTo } = useSmoothScroll();
  return (
    <div className="onk-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
      <a
        href="#plan"
        className="btn-tile"
        onClick={(e) => {
          e.preventDefault();
          scrollTo("#plan");
        }}
      >
        {tr.hero.explore}
      </a>
      <button type="button" className="btn-line" onClick={() => open()}>
        {tr.hero.book}
      </button>
    </div>
  );
}
