// Numbers and units in both languages, without Intl (identical on server and client).

import type { Lang } from "./dates";

const group = (n: number, sep: string) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);

/** "8.600 TL" · "TRY 8,600" */
export const money = (n: number, lang: Lang) => (lang === "tr" ? `${group(n, ".")} TL` : `TRY ${group(n, ",")}`);

/** "1.068 m" · "1,068 m" */
export const metres = (n: number, lang: Lang) => `${group(n, lang === "tr" ? "." : ",")} m`;

/** "3,40 m" · "3.40 m" */
export const height = (m: number, lang: Lang) => `${m.toFixed(2).replace(".", lang === "tr" ? "," : ".")} m`;

/** "+3,40" · "±0,00": a level mark as on the drawings */
export const level = (m: number, lang: Lang) => (Math.abs(m) < 0.005 ? "±0,00" : `${m > 0 ? "+" : "−"}${Math.abs(m).toFixed(2).replace(".", lang === "tr" ? "," : ".")}`);

export const stepsWord = (n: number, lang: Lang) => (lang === "tr" ? "basamak" : n === 1 ? "step" : "steps");
export const steps = (n: number, lang: Lang) => `${n} ${stepsWord(n, lang)}`;
export const nights = (n: number, lang: Lang) => (lang === "tr" ? `${n} gece` : `${n} ${n === 1 ? "night" : "nights"}`);
export const guests = (n: number, lang: Lang) => (lang === "tr" ? `${n} kişi` : `${n} ${n === 1 ? "guest" : "guests"}`);
export const minutes = (n: number, lang: Lang) => (lang === "tr" ? `${n} dakika` : `${n} min`);
export const cm = (n: number) => `${n} cm`;

/** Fill "{n}" style slots. */
export const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
