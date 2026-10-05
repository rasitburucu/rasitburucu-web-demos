import { tr } from "@/content/sazbahce/tr";
import { parseIso } from "@/lib/sazbahce/availability";
import { capacity, setupFor } from "@/lib/sazbahce/plan";
import type { Plan } from "@/lib/sazbahce/store";
import { ceremonyStart, clock, clockAt, sunTimes } from "@/lib/sazbahce/sun";
import { longDate } from "./Calendar";

const s = tr.summary;

export function slotText(plan: Plan): string {
  const d = parseIso(plan.date);
  if (plan.slot === "gunbatimi") return s.slotSunset(clock(ceremonyStart(d)), clockAt(sunTimes(d).set));
  const x = tr.slots[plan.slot];
  return `${x.label}, ${x.range}`;
}

/** Rows of the request summary. `full` adds catering, extras and contact choice. */
export function summaryRows(plan: Plan, full = false): [string, string][] {
  const d = parseIso(plan.date);
  const cap = capacity(plan.area, plan.ceremony, plan.setup);
  const area = `${tr.areas[plan.area].name}${plan.guests > cap ? ` (${s.over})` : ""}`;
  const rows: [string, string][] = [
    [s.rows.date, longDate(d)],
    [s.rows.ceremony, tr.ceremonies[plan.ceremony]],
    [s.rows.guests, s.guests(plan.guests)],
    [s.rows.area, area],
    [s.rows.slot, slotText(plan)],
  ];
  if (plan.ceremony === "kurumsal") rows.push([s.rows.setup, tr.setups[setupFor(plan.ceremony, plan.setup)]]);
  if (full) {
    const rp = tr.requestPage;
    rows.push([s.rows.catering, rp.catering[plan.catering] ?? plan.catering]);
    rows.push([s.rows.extras, plan.extras.length ? plan.extras.map((e) => rp.extras[e] ?? e).join(", ") : rp.noExtras]);
    rows.push([s.rows.reach, rp.contact.reachOptions[plan.reach]]);
  }
  return rows;
}

export function summaryText(plan: Plan, full = false): string {
  return [s.shareIntro, ...summaryRows(plan, full).map(([k, v]) => `${k}: ${v}`)].join("\n");
}

/** Native share sheet on phones, clipboard elsewhere. Returns true when copied. */
export async function shareSummary(plan: Plan, full = false): Promise<"shared" | "copied" | "failed"> {
  const text = summaryText(plan, full);
  try {
    if (navigator.share) {
      await navigator.share({ title: s.shareTitle, text });
      return "shared";
    }
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
