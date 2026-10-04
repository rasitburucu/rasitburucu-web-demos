import type Lenis from "lenis";

// In-page travel shared by every link and button that moves the day: through
// Lenis when it runs (so the hours pass, not jump), natively otherwise. After
// arriving, focus can move to the control the reader came for, so keyboard
// and screen reader users land where the eye lands.

export function lenisOf(): Lenis | null {
  return (window as unknown as { __okiLenis?: Lenis | null }).__okiLenis ?? null;
}

/** Focus targets by anchor id: where a keyboard user should land. */
const FOCUS_FOR: Record<string, string> = {
  ziyaret: "[data-dial-panel] [role='slider']",
  evler: "#evler-title",
};

function focusLater(get: () => HTMLElement | null) {
  // two frames: the director marks the arrived chapter visible, then focus
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      get()?.focus({ preventScroll: true });
    }),
  );
}

export function goTo(id: string, focus?: () => HTMLElement | null) {
  const target = document.getElementById(id);
  if (!target) return false;
  const sel = FOCUS_FOR[id];
  const getFocus = focus ?? (sel ? () => document.querySelector<HTMLElement>(sel) : null);
  const lenis = lenisOf();
  if (lenis) {
    // Absolute target from the real scroll position. Lenis adds an element's
    // rect to its own last known scroll, which lags behind when the page was
    // just moved natively (touch, focus, scrollIntoView) and lands short.
    const y = window.scrollY;
    if (Math.abs(lenis.animatedScroll - y) > 1) lenis.scrollTo(y, { immediate: true, force: true });
    lenis.scrollTo(target.getBoundingClientRect().top + y, {
      duration: 1.8,
      onComplete: () => {
        if (getFocus) focusLater(getFocus);
      },
    });
  } else {
    target.scrollIntoView({ block: "start" });
    if (getFocus) focusLater(getFocus);
  }
  return true;
}
