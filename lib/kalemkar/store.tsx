"use client";

// Booking state shared by the home sentence, the floor plan, the reservation
// flow and the private-invitation form.
//
// Privacy rule for this concept (same as Revak):
// - Personal data (names, phone, e-mail, allergy and diet notes) lives only in
//   React memory. It survives client-side navigation and is gone on reload.
// - Only non-personal choices (experience, party size, date, time, menu,
//   pairing) are mirrored to sessionStorage under "kalemkar:secim".
// Nothing is sent over the network.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Deneyim, MenuKey } from "./availability";

export type Guest = { ad: string; notlar: string[]; diger: string };

export type Booking = {
  deneyim: Deneyim;
  kisi: number;
  tarih?: string;
  saat?: string;
  menu: MenuKey;
  eslesme: boolean;
  // personal, memory only
  misafirler: Guest[];
  ozelGun?: string;
  not?: string;
  ad?: string;
  telefon?: string;
  eposta?: string;
  kod?: string;
};

const KEY = "kalemkar:secim";
const DENEYIM: Deneyim[] = ["salon", "tezgah", "ozel"];
const MENU: MenuKey[] = ["sofra", "kisa", "tezgah"];

export const emptyGuest = (): Guest => ({ ad: "", notlar: [], diger: "" });
export const initial: Booking = { deneyim: "salon", kisi: 2, menu: "sofra", eslesme: false, misafirler: [emptyGuest(), emptyGuest()] };

type Ctx = { booking: Booking; update: (p: Partial<Booking>) => void; reset: () => void; ready: boolean };
const BookingCtx = createContext<Ctx | null>(null);

/** Keep one guest row per seat, preserving what was typed. */
export function fitGuests(list: Guest[], n: number) {
  const out = list.slice(0, n);
  while (out.length < n) out.push(emptyGuest());
  return out;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<Booking>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as Partial<Booking>;
        const clean: Partial<Booking> = {};
        if (DENEYIM.includes(s.deneyim as Deneyim)) clean.deneyim = s.deneyim;
        if (typeof s.kisi === "number" && s.kisi >= 1 && s.kisi <= 34) clean.kisi = Math.round(s.kisi);
        if (typeof s.tarih === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s.tarih)) clean.tarih = s.tarih;
        if (typeof s.saat === "string" && /^\d{2}\.\d{2}$/.test(s.saat)) clean.saat = s.saat;
        if (MENU.includes(s.menu as MenuKey)) clean.menu = s.menu;
        if (typeof s.eslesme === "boolean") clean.eslesme = s.eslesme;
        setBooking((b) => {
          const next = { ...b, ...clean };
          return { ...next, misafirler: fitGuests(next.misafirler, Math.min(next.kisi, 14)) };
        });
      }
    } catch {
      /* storage blocked: memory only */
    }
    setReady(true);
  }, []);

  const update = useCallback((p: Partial<Booking>) => {
    setBooking((b) => {
      const next = { ...b, ...p };
      if (p.kisi !== undefined) next.misafirler = fitGuests(next.misafirler, Math.min(next.kisi, 14));
      try {
        const keep = { deneyim: next.deneyim, kisi: next.kisi, tarih: next.tarih, saat: next.saat, menu: next.menu, eslesme: next.eslesme };
        sessionStorage.setItem(KEY, JSON.stringify(keep));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setBooking(initial);
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ booking, update, reset, ready }), [booking, update, reset, ready]);
  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking outside BookingProvider");
  return ctx;
}

/** Read one query parameter after mount (static export: no server params). */
export function readParam(name: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

/** The current time, set after mount so server HTML never holds a date. */
export function useNow(intervalMs = 0) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    if (!intervalMs) return;
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
