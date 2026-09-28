"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import { BookingDrawer } from "../booking/BookingDrawer";
import type { TypologyId } from "@/content/onikitas/villas";

// ---------- Smooth scroll ----------

type ScrollApi = {
  stop: () => void;
  start: () => void;
  scrollTo: (target: string | HTMLElement, offset?: number) => void;
};

const ScrollCtx = createContext<ScrollApi>({ stop() {}, start() {}, scrollTo() {} });
export const useSmoothScroll = () => useContext(ScrollCtx);

// ---------- Booking ----------

export type ViewingType = "onsite" | "video" | "phone";
export type Slot = { date: string; time: string };
export type BookingPrefill = {
  villas?: string[];
  type?: ViewingType;
  date?: string;
  step?: 0 | 1 | 2;
};

type BookingApi = {
  open: (prefill?: BookingPrefill) => void;
  close: () => void;
  isOpen: boolean;
};

const BookingCtx = createContext<BookingApi>({ open() {}, close() {}, isOpen: false });
export const useBooking = () => useContext(BookingCtx);

// ---------- Plan filters (shared by the plan and the typology section) ----------

export type PlanFilters = { bedrooms: number[]; view: ("sea" | "grove")[]; onlyAvailable: boolean };
type PlanApi = {
  filters: PlanFilters;
  setFilters: (f: PlanFilters | ((f: PlanFilters) => PlanFilters)) => void;
  focusType: (t: TypologyId) => void;
};
const emptyFilters: PlanFilters = { bedrooms: [], view: [], onlyAvailable: false };
const PlanCtx = createContext<PlanApi>({ filters: emptyFilters, setFilters() {}, focusType() {} });
export const usePlanFilters = () => useContext(PlanCtx);

export function Shell({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // Lenis without autoRaf: the rAF loop only runs while a scroll is
    // animating and stops when the page is at rest (no always-running loop).
    const lenis = new Lenis({ autoRaf: false, lerp: 0.09, anchors: { offset: -88 } });
    lenisRef.current = lenis;
    let rafId = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      rafId = lenis.isScrolling ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (rafId) return;
      (lenis as unknown as { time: number }).time = performance.now();
      rafId = requestAnimationFrame(loop);
    };
    kickRef.current = kick;
    const offVirtual = lenis.on("virtual-scroll", kick);
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.('a[href*="#"]')) requestAnimationFrame(kick);
    };
    document.addEventListener("click", onClick);
    return () => {
      offVirtual();
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      kickRef.current = () => {};
    };
  }, []);

  const scroll = useMemo<ScrollApi>(
    () => ({
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      scrollTo: (target, offset = -88) => {
        const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
        if (!el) return;
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, { offset, duration: 1.2 });
          kickRef.current();
        }
        else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
      },
    }),
    [],
  );

  const [bookingOpen, setBookingOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>({});
  const open = useCallback((p?: BookingPrefill) => {
    setPrefill(p ?? {});
    setBookingOpen(true);
  }, []);
  const close = useCallback(() => setBookingOpen(false), []);
  const booking = useMemo(() => ({ open, close, isOpen: bookingOpen }), [open, close, bookingOpen]);

  const [filters, setFilters] = useState<PlanFilters>(emptyFilters);
  const focusType = useCallback(
    (t: TypologyId) => {
      const beds = t === "tas" ? 3 : t === "zeytin" ? 4 : 5;
      setFilters({ bedrooms: [beds], view: [], onlyAvailable: false });
      scroll.scrollTo("#plan");
    },
    [scroll],
  );
  const plan = useMemo(() => ({ filters, setFilters, focusType }), [filters, focusType]);

  return (
    <ScrollCtx.Provider value={scroll}>
      <BookingCtx.Provider value={booking}>
        <PlanCtx.Provider value={plan}>
          {children}
          <BookingDrawer open={bookingOpen} prefill={prefill} onClose={close} />
        </PlanCtx.Provider>
      </BookingCtx.Provider>
    </ScrollCtx.Provider>
  );
}
