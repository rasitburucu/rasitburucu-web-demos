"use client";

// Shared state that links the admissions flows: a level or contact entered in
// one flow prefills the others.
//
// Privacy rule for this concept:
// - Personal data (names, phone, e-mail, school) lives only in React memory.
//   It survives client-side navigation between Revak pages and is gone on reload.
// - Only non-personal choices (kademe, sınıf, akademik yıl, tour type) are
//   mirrored to sessionStorage under "revak:prefill", so a reload or a new tab
//   in the same session still opens the flow on the right level.
// Nothing is sent over the network.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Kademe = "anaokulu" | "ilkokul" | "ortaokul" | "lise";
export const KADEMELER: Kademe[] = ["anaokulu", "ilkokul", "ortaokul", "lise"];
export const isKademe = (v: unknown): v is Kademe => typeof v === "string" && (KADEMELER as string[]).includes(v);

export type Shared = {
  kademe?: Kademe;
  sinif?: string;
  yil?: string;
  veliAd?: string;
  telefon?: string;
  eposta?: string;
  ogrenciAd?: string;
  ogrenciSoyad?: string;
  okul?: string;
};

const STORAGE_KEY = "revak:prefill";
const PERSISTED: (keyof Shared)[] = ["kademe", "sinif", "yil"];

type Ctx = { shared: Shared; update: (p: Partial<Shared>) => void; ready: boolean };
const SharedCtx = createContext<Ctx | null>(null);

export function RevakProvider({ children }: { children: React.ReactNode }) {
  const [shared, setShared] = useState<Shared>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Shared;
        const clean: Shared = {};
        if (isKademe(saved.kademe)) clean.kademe = saved.kademe;
        if (typeof saved.sinif === "string") clean.sinif = saved.sinif;
        if (typeof saved.yil === "string") clean.yil = saved.yil;
        setShared((s) => ({ ...clean, ...s }));
      }
    } catch {
      /* storage blocked: memory only */
    }
    setReady(true);
  }, []);

  const update = useCallback((p: Partial<Shared>) => {
    setShared((s) => {
      const next = { ...s, ...p };
      try {
        const keep: Partial<Shared> = {};
        for (const k of PERSISTED) if (next[k]) (keep as Record<string, unknown>)[k] = next[k];
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(keep));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ shared, update, ready }), [shared, update, ready]);
  return <SharedCtx.Provider value={value}>{children}</SharedCtx.Provider>;
}

export function useShared() {
  const ctx = useContext(SharedCtx);
  if (!ctx) throw new Error("useShared outside RevakProvider");
  return ctx;
}

/** Read one query parameter after mount (static export: no server params). */
export function readParam(name: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}
