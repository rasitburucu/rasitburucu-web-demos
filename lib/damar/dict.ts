import { en, type Dict } from "@/content/damar/en";
import { tr } from "@/content/damar/tr";
import type { Locale } from "@/content/damar/routes";

export const dict = (locale: Locale): Dict => (locale === "tr" ? tr : en);

/** Numbers in the visitor's language: 7.5 / 7,5; 1,200 / 1.200. */
export function num(locale: Locale, n: number, digits = 0) {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

/** Metres with two decimals, as on a packing list: 3.20 / 3,20. */
export const metres = (locale: Locale, n: number) => num(locale, n, 2);

/** "3.20 × 1.90 m" */
export const size = (locale: Locale, s: readonly number[]) => `${s.map((v) => metres(locale, v)).join(" × ")} m`;

/** "September 2026" from "2026-09" */
export function month(locale: Locale, ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return `${dict(locale).months[m - 1]} ${y}`;
}

/** en dash range of two numbers: "21–22" */
export const range = (a: number, b: number) => `${a}–${b}`;
