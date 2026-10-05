"use client";

// One plan for the whole visit: the first screen, the request flow and the
// summary read and write the same state. Kept in sessionStorage so a refresh or a
// trip to "Alanlar" does not lose it; nothing leaves the browser.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultDate, isoDay } from "./availability";
import { GUESTS, type AreaKey, type Ceremony, type Setup, type Slot } from "./venue";

export type Plan = {
  date: string;
  ceremony: Ceremony;
  guests: number;
  area: AreaKey;
  slot: Slot;
  setup?: Setup;
  catering: string;
  extras: string[];
  name: string;
  phone: string;
  email: string;
  note: string;
  reach: "telefon" | "whatsapp" | "eposta";
};

const KEY = "sazbahce-plan-v1";

export const initialPlan = (): Plan => ({
  date: isoDay(defaultDate()),
  ceremony: "dugun",
  guests: 180,
  area: "cayir",
  slot: "gunbatimi",
  catering: "aksam",
  extras: [],
  name: "",
  phone: "",
  email: "",
  note: "",
  reach: "telefon",
});

type Ctx = {
  plan: Plan;
  set: (patch: Partial<Plan>) => void;
  /** Local midnight today, known only after mount (static HTML has no "today"). */
  today: Date | null;
  sheet: boolean;
  setSheet: (open: boolean) => void;
};

const PlanCtx = createContext<Ctx | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [today, setToday] = useState<Date | null>(null);
  const [sheet, setSheet] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = new Date();
    setToday(new Date(t.getFullYear(), t.getMonth(), t.getDate()));
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setPlan((p) => ({ ...p, ...(JSON.parse(raw) as Partial<Plan>) }));
    } catch {
      /* private mode: start fresh */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(plan));
    } catch {
      /* ignore */
    }
  }, [plan, loaded]);

  const set = useCallback((patch: Partial<Plan>) => {
    setPlan((p) => {
      const next = { ...p, ...patch };
      next.guests = Math.max(GUESTS.min, Math.min(GUESTS.max, Math.round(next.guests / GUESTS.step) * GUESTS.step));
      // The pier is for the ceremony only: switching to another event moves it to
      // the meadow. Choosing the pier for a wedding stays, and the plan explains.
      if (patch.ceremony && next.area === "iskele" && next.ceremony !== "nikah") next.area = "cayir";
      return next;
    });
  }, []);

  const value = useMemo(() => ({ plan, set, today, sheet, setSheet }), [plan, set, today, sheet]);
  return <PlanCtx.Provider value={value}>{children}</PlanCtx.Provider>;
}

export function usePlan() {
  const c = useContext(PlanCtx);
  if (!c) throw new Error("usePlan outside PlanProvider");
  return c;
}
