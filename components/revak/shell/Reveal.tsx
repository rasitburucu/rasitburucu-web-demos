"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One observer for the whole demo: arch-framed photos marked [data-reveal]
 * open upward the first time they enter the viewport. CSS only hides them when
 * <html> has the `js` class, so without JavaScript every photo is visible.
 */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-demo=revak] [data-reveal]:not([data-shown])"));
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-shown", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    // The closed arch (clip-path inset 100% on the <picture>) has no visible area, so the
    // browser's own lazy loading never starts the image until the arch begins to open, and
    // on a slow connection it opened on an empty frame. Fetch and decode it well ahead.
    const ahead = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          ahead.unobserve(e.target);
          const img = e.target.querySelector("img");
          if (!img) continue;
          img.loading = "eager";
          img.decode?.().catch(() => {});
        }
      },
      { rootMargin: "0px 0px 250% 0px" },
    );
    els.forEach((el) => ahead.observe(el));
    return () => {
      io.disconnect();
      ahead.disconnect();
    };
  }, [pathname]);
  return null;
}
