"use client";

// One seedling sum shared on the home page: the calculator on the first screen
// writes it, the order form further down shows the same order as it would be
// written on paper. Without the provider (other pages) both use the defaults.
import { createContext, useContext, useState } from "react";
import { URUNLER, type Asi } from "@/content/gelidonya/urunler";

export type HesapState = { urun: string; graft: Asi; stems: 1 | 2; tray: number; donum: number; week: number | null };

const first = URUNLER[0];
export const HESAP_START: HesapState = { urun: first.id, graft: first.def.graft, stems: first.def.stems, tray: first.def.tray, donum: 3, week: null };

type Ctx = { s: HesapState; setS: React.Dispatch<React.SetStateAction<HesapState>> };
const HesapCtx = createContext<Ctx | null>(null);

export function HesapProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<HesapState>(HESAP_START);
  return <HesapCtx.Provider value={{ s, setS }}>{children}</HesapCtx.Provider>;
}

/** Shared state when a provider is present, local state otherwise. */
export function useHesap(): Ctx {
  const shared = useContext(HesapCtx);
  const [s, setS] = useState<HesapState>(HESAP_START);
  return shared ?? { s, setS };
}
