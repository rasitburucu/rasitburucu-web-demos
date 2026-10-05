"use client";

// Gelidonya: one order shared by the first screen, the delivery bench and the
// phone's bottom bar. Nothing leaves the browser.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { calc, defaultWeek, deliveryWeeks, DEMO_TODAY, fideById, LIMITS, type Order } from "./hesap";

type Ctx = {
  order: Order;
  today: number;
  weeks: number[];
  result: ReturnType<typeof calc>;
  /** bumps when the amount grows, so the trays know to animate in */
  grow: number;
  setFide: (id: string) => void;
  setUnit: (u: Order["unit"]) => void;
  setAmount: (n: number) => void;
  step: (dir: 1 | -1) => void;
  setDelivery: (t: number) => void;
  setSpare: (b: boolean) => void;
};

const OrderCtx = createContext<Ctx | null>(null);

const START_ID = "domates-a";
const startWeeks = deliveryWeeks(DEMO_TODAY, fideById(START_ID));
const START: Order = { fideId: START_ID, unit: "donum", amount: 3, delivery: defaultWeek(startWeeks, DEMO_TODAY), spare: false };

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [order, setOrder] = useState<Order>(START);
  const [today, setToday] = useState(DEMO_TODAY);
  const [grow, setGrow] = useState(0);

  // the real date, once in the browser (the static page is built with a fixed one)
  useEffect(() => {
    const now = Date.now();
    const d = new Date(now);
    const t = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    if (t === DEMO_TODAY) return;
    setToday(t);
    setOrder((o) => {
      const ws = deliveryWeeks(t, fideById(o.fideId));
      return ws.includes(o.delivery) ? o : { ...o, delivery: defaultWeek(ws, t) };
    });
  }, []);

  const weeks = useMemo(() => deliveryWeeks(today, fideById(order.fideId)), [today, order.fideId]);
  const result = useMemo(() => calc(order), [order]);

  const setFide = useCallback(
    (id: string) => {
      setOrder((o) => {
        const ws = deliveryWeeks(today, fideById(id));
        return { ...o, fideId: id, delivery: ws.includes(o.delivery) ? o.delivery : defaultWeek(ws, today) };
      });
      setGrow((g) => g + 1);
    },
    [today],
  );

  const setUnit = useCallback((u: Order["unit"]) => {
    setOrder((o) => {
      if (o.unit === u) return o;
      const r = calc({ ...o, spare: false });
      const f = r.f;
      const amount = u === "adet" ? Math.min(LIMITS.adet.max, Math.max(LIMITS.adet.min, r.base)) : Math.max(1, Math.round(r.base / f.rate));
      return { ...o, unit: u, amount };
    });
  }, []);

  const setAmount = useCallback((n: number) => {
    setOrder((o) => {
      const lim = LIMITS[o.unit];
      const amount = Math.min(lim.max, Math.max(0, Math.round(n)));
      if (amount > o.amount) setGrow((g) => g + 1);
      return { ...o, amount };
    });
  }, []);

  const step = useCallback((dir: 1 | -1) => {
    setOrder((o) => {
      const lim = LIMITS[o.unit];
      const amount = Math.min(lim.max, Math.max(lim.min, o.amount + dir * lim.step));
      if (amount > o.amount) setGrow((g) => g + 1);
      return { ...o, amount };
    });
  }, []);

  const setDelivery = useCallback((t: number) => setOrder((o) => ({ ...o, delivery: t })), []);
  const setSpare = useCallback((b: boolean) => {
    setOrder((o) => ({ ...o, spare: b }));
    if (b) setGrow((g) => g + 1);
  }, []);

  const value = useMemo(
    () => ({ order, today, weeks, result, grow, setFide, setUnit, setAmount, step, setDelivery, setSpare }),
    [order, today, weeks, result, grow, setFide, setUnit, setAmount, step, setDelivery, setSpare],
  );
  return <OrderCtx.Provider value={value}>{children}</OrderCtx.Provider>;
}

export function useOrder() {
  const c = useContext(OrderCtx);
  if (!c) throw new Error("useOrder outside OrderProvider");
  return c;
}

export function useOptionalOrder() {
  return useContext(OrderCtx);
}
