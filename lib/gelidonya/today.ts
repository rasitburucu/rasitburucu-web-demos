"use client";

import { useEffect, useState } from "react";
import { DEMO_TODAY } from "./hesap";

/** The static page is built with a fixed date; the browser swaps in the real one. */
export function useToday() {
  const [today, setToday] = useState(DEMO_TODAY);
  useEffect(() => {
    const d = new Date();
    const t = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    if (t !== DEMO_TODAY) setToday(t);
  }, []);
  return today;
}
