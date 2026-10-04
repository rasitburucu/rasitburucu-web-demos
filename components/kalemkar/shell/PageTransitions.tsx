"use client";

/**
 * Page transitions inside the concept (same-document View Transitions).
 *
 * A click on an internal link is wrapped in document.startViewTransition: the
 * old page dips out (160 ms), the new one rises in by 8 px (380 ms). The sini
 * on screen is the same object on every page, so it is named "kk-sini" just
 * before the old snapshot and again on the new page: the home tray glides
 * into the reservation table, and back.
 *
 * Links marked data-kk-novt (the floor plan: first tap selects) are left alone.
 * Only one element may carry a name, so names are set in JS on the largest
 * visible sini and cleared when the transition ends. Browsers without the API,
 * modified clicks, other origins, same-page hashes and back/forward keep
 * Next's normal navigation. Reduced motion: a 120 ms cross-fade, no travel.
 */

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const NAME = "kk-sini";

function visibleSini(): HTMLElement | null {
  let best: HTMLElement | null = null;
  let area = 0;
  document.querySelectorAll<HTMLElement>("[data-demo='kalemkar'] .kk-sini").forEach((el) => {
    if (getComputedStyle(el).visibility === "hidden") return;
    const r = el.getBoundingClientRect();
    const w = Math.min(r.right, innerWidth) - Math.max(r.left, 0);
    const h = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
    const a = w > 0 && h > 0 ? w * h : 0;
    if (a > area) {
      area = a;
      best = el;
    }
  });
  return best;
}

function clearNames() {
  document.querySelectorAll<HTMLElement>("[data-demo='kalemkar'] .kk-sini").forEach((el) => {
    el.style.viewTransitionName = "";
  });
}

function nameSini() {
  clearNames();
  const el = visibleSini();
  if (el) el.style.viewTransitionName = NAME;
}

export function PageTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<null | (() => void)>(null);

  // New page committed: name its sini, then let the transition capture it.
  // (No requestAnimationFrame here: rendering is paused during the update.)
  useEffect(() => {
    const done = pending.current;
    if (!done) return;
    pending.current = null;
    nameSini();
    done();
  }, [pathname]);

  useEffect(() => {
    if (typeof document.startViewTransition !== "function") return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.closest("[data-demo='kalemkar']")) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download") || a.hasAttribute("data-kk-novt")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !url.pathname.startsWith(`${BASE_PATH}/kalemkar`)) return;
      if (url.pathname === location.pathname) return; // same page (hash): native jump
      e.preventDefault();
      const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const root = document.documentElement;
      root.dataset.kkVt = calm ? "calm" : "on";
      nameSini();
      const target = url.pathname.slice(BASE_PATH.length) + url.search + url.hash;
      const vt = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            pending.current = resolve;
            router.push(target);
            // Never hold the page frozen if the route is slow or does not change.
            window.setTimeout(() => {
              if (pending.current === resolve) pending.current = null;
              resolve();
            }, 1200);
          }),
      );
      vt.finished.finally(() => {
        delete root.dataset.kkVt;
        clearNames();
      });
    };
    // Capture phase: runs before Next's Link handler, which then sees
    // defaultPrevented and steps aside.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
