"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { prefersReduced, setLenis } from "@/lib/revak/lenis";
import { useFlowMode } from "./Header";

/**
 * Weighted scroll on the reading pages (home, kampüs, kabul). Off on the
 * admissions flows, where focus moves between fields and native scroll is the
 * honest choice, and off for reduced motion. Recreated per page so a client
 * navigation starts from the position Next.js restored.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const flow = useFlowMode();

  useEffect(() => {
    if (flow || prefersReduced()) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -96 } });
    setLenis(lenis);
    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, [pathname, flow]);

  return null;
}

/* ---------- arch -> flow page transition (View Transitions API) ---------- */

let pending: (() => void) | null = null;

/** Resolves the running view transition once the new route has committed. */
export function RouteSignal() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pending) return;
    const done = pending;
    pending = null;
    // Two frames: let Next.js restore scroll before the new state is captured.
    requestAnimationFrame(() => requestAnimationFrame(done));
  }, [pathname]);
  return null;
}

type VTDoc = Document & { startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> } };

/**
 * Navigate while the clicked arch photo morphs into the level plate on the
 * flow page (`view-transition-name: rv-arch` on both). Falls back to a plain
 * navigation when the API is missing or motion is reduced.
 */
export function archNavigate(push: (href: string) => void, href: string, from: HTMLElement | null) {
  const doc = document as VTDoc;
  if (!doc.startViewTransition || !from || prefersReduced()) {
    push(href);
    return;
  }
  from.style.setProperty("view-transition-name", "rv-arch");
  document.documentElement.dataset.rvVt = "arch";
  const vt = doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        from.style.removeProperty("view-transition-name");
        pending = resolve;
        setTimeout(resolve, 1200); // never hang the page on a slow route
        push(href);
      }),
  );
  vt.finished.finally(() => {
    delete document.documentElement.dataset.rvVt;
  });
}
