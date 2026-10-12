"use client";

// Site access answers (road width, ramp, overhead line, crane pad). Asked on
// the production page and again in the quote form; kept for this tab only.
import { useCallback, useEffect, useState } from "react";

export type Cevap = "evet" | "hayir" | "bilmiyorum";
export type Erisim = Partial<Record<"yol" | "rampa" | "hat" | "vinc", Cevap>>;

const ANAHTAR = "vaziyet-erisim-v1";

export function useErisim() {
  const [erisim, setErisim] = useState<Erisim>({});
  useEffect(() => {
    try {
      const s = sessionStorage.getItem(ANAHTAR);
      if (s) setErisim(JSON.parse(s));
    } catch {
      /* private mode */
    }
  }, []);
  const yaz = useCallback((id: keyof Erisim, c: Cevap) => {
    setErisim((e) => {
      const n = { ...e, [id]: c };
      try {
        sessionStorage.setItem(ANAHTAR, JSON.stringify(n));
      } catch {
        /* private mode */
      }
      return n;
    });
  }, []);
  return { erisim, yaz };
}

/** "iyi" when every answer is the good one, "sorun" if any is bad, else "belirsiz" */
export function erisimSonuc(e: Erisim, iyi: Record<string, Cevap>): "bos" | "iyi" | "belirsiz" | "sorun" {
  const ids = Object.keys(iyi);
  const cevaplar = ids.map((id) => e[id as keyof Erisim]);
  if (cevaplar.every((c) => !c)) return "bos";
  if (ids.some((id) => e[id as keyof Erisim] && e[id as keyof Erisim] !== "bilmiyorum" && e[id as keyof Erisim] !== iyi[id])) return "sorun";
  if (ids.every((id) => e[id as keyof Erisim] === iyi[id])) return "iyi";
  return "belirsiz";
}
