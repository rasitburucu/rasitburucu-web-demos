"use client";

// One plot per visit: the home check, the model pages and the quote page all
// read and write the same state. It starts from the address (a shared link or
// a model page's "Arsama koy"), else from this tab's session, else from the
// sample plot. Nothing leaves the browser.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { VARSAYILAN, type Durum } from "./hesap";
import { coz } from "./url";

const ANAHTAR = "vaziyet-arsa-v1";

type Ctx = {
  durum: Durum;
  /** true once the address / session has been read (before that the sample plot is shown) */
  hazir: boolean;
  guncelle: (p: Partial<Durum>) => void;
  ayarla: (d: Durum) => void;
};

const DurumCtx = createContext<Ctx>({ durum: VARSAYILAN, hazir: false, guncelle: () => {}, ayarla: () => {} });

function oturumdan(): Durum | null {
  try {
    const s = sessionStorage.getItem(ANAHTAR);
    if (!s) return null;
    const v = JSON.parse(s) as Partial<Durum>;
    return { ...VARSAYILAN, ...v };
  } catch {
    return null;
  }
}

export function DurumProvider({ children }: { children: React.ReactNode }) {
  const [durum, setDurum] = useState<Durum>(VARSAYILAN);
  const [hazir, setHazir] = useState(false);
  const ilk = useRef(true);

  useEffect(() => {
    const kayitli = oturumdan();
    const adres = coz(location.search, kayitli ?? VARSAYILAN);
    const d = adres ?? kayitli;
    if (d) setDurum(d);
    setHazir(true);
  }, []);

  useEffect(() => {
    if (ilk.current) {
      ilk.current = false;
      return;
    }
    try {
      sessionStorage.setItem(ANAHTAR, JSON.stringify(durum));
    } catch {
      /* private mode: the check still works, it just forgets on reload */
    }
  }, [durum]);

  const guncelle = useCallback((p: Partial<Durum>) => setDurum((d) => ({ ...d, ...p })), []);
  const ayarla = useCallback((d: Durum) => setDurum(d), []);
  const v = useMemo(() => ({ durum, hazir, guncelle, ayarla }), [durum, hazir, guncelle, ayarla]);
  return <DurumCtx.Provider value={v}>{children}</DurumCtx.Provider>;
}

export const useDurum = () => useContext(DurumCtx);
