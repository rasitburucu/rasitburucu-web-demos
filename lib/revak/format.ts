// Turkish date and phone formatting without Intl, so server and browser always
// print the same string.
import { parseIso } from "./schedule";

export const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
export const WEEKDAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
export const WEEKDAYS_SHORT = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

/** "15 Kasım" */
export function dayMonth(iso: string) {
  const d = parseIso(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** "15 Kasım 2026, Pazar" */
export function longDate(iso: string) {
  const d = parseIso(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${WEEKDAYS[d.getDay()]}`;
}

/** "Çar 30 Eylül" */
export function shortDate(iso: string) {
  const d = parseIso(iso);
  return `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export const digits = (s: string) => s.replace(/\D/g, "");

/** Mask a Turkish mobile number as "5xx xxx xx xx" (the +90 prefix is shown separately). */
export function formatPhone(raw: string) {
  let d = digits(raw);
  if (d.startsWith("90") && d.length > 10) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  d = d.slice(0, 10);
  const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean);
  return parts.join(" ");
}

export const phoneOk = (v: string) => /^5\d{9}$/.test(digits(v));
export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Age in whole years on a given date (default: 1 September of the start year). */
export function ageOn(birthIso: string, onIso: string) {
  const b = parseIso(birthIso);
  const o = parseIso(onIso);
  let a = o.getFullYear() - b.getFullYear();
  if (o.getMonth() < b.getMonth() || (o.getMonth() === b.getMonth() && o.getDate() < b.getDate())) a--;
  return a;
}
