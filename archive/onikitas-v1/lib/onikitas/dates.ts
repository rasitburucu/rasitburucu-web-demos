// Date helpers for the viewing flow. Computed on the client only (after
// mount) so static HTML never bakes in a stale "today".

export type DayOption = { iso: string; weekday: string; day: string; month: string; sunday: boolean };

export function nextDays(count: number, locale = "tr-TR", from = new Date()): DayOption[] {
  const out: DayOption[] = [];
  const d = new Date(from);
  d.setHours(12, 0, 0, 0);
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    const sunday = d.getDay() === 0;
    if (sunday) continue; // sales office closed on Sundays
    out.push({
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      weekday: d.toLocaleDateString(locale, { weekday: "short" }),
      day: d.toLocaleDateString(locale, { day: "numeric" }),
      month: d.toLocaleDateString(locale, { month: "short" }),
      sunday,
    });
  }
  return out;
}

export function formatDay(iso: string, locale = "tr-TR") {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
}
