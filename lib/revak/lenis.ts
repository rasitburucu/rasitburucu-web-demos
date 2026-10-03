"use client";

// The live Lenis instance (owned by <SmoothScroll/> in the layout). Kept apart
// from lib/revak/motion.ts so pages without GSAP do not pull GSAP in.

import type Lenis from "lenis";

let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scroll the page to an absolute Y, through Lenis when it runs. */
export function scrollToY(y: number, immediate = false) {
  if (lenis) lenis.scrollTo(y, immediate ? { immediate: true } : { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: immediate || prefersReduced() ? "auto" : "smooth" });
}
