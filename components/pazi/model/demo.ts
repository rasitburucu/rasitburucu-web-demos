import type { Config } from "@/lib/pazi/plan";

/** A typical product for each model, used for its demonstration cycle and sheet drawing. */
export const MODEL_DEMO: Record<string, Partial<Config>> = {
  p12: { kind: "koli", u: 300, g: 200, y: 200, kg: 6, rate: 10, maxH: 1000, pattern: "oto" },
  p20: { kind: "koli", u: 400, g: 300, y: 250, kg: 12, rate: 8, maxH: 1400, pattern: "oto" },
  p30: { kind: "torba", u: 600, g: 400, y: 120, kg: 25, rate: 5, maxH: 1300, pattern: "oto" },
};
