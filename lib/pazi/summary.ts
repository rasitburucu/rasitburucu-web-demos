// Plain-text summary of a configuration: the body of the "send to engineer"
// e-mail and the copy fallback. Built from the same calculation as the page.

import { tr } from "@/content/pazi/tr";
import { palletSize, payback, type Config, type Fit } from "./plan";
import { fmt, fmt1, tlRange } from "./format";

export type Contact = { name: string; company: string; email: string; phone: string; city: string; note: string };

export function summaryText(c: Config, f: Fit, link: string, contact?: Contact) {
  const fl = tr.flow;
  const fi = tr.fields;
  const { L, W } = palletSize(c);
  const p = payback(c);
  const lines: string[] = [];
  if (contact) {
    lines.push(`${fl.send.name}: ${contact.name}`, `${fl.send.company}: ${contact.company}`, `${fl.send.email}: ${contact.email}`);
    if (contact.phone) lines.push(`${fl.send.phone}: ${contact.phone}`);
    if (contact.city) lines.push(`${fl.send.city}: ${contact.city}`);
    if (contact.note) lines.push(`${fl.send.note}: ${contact.note}`);
    lines.push("");
  }
  lines.push(`— ${tr.sheet.product} —`);
  lines.push(`${fi.kind}: ${fi.kinds[c.kind]}`);
  lines.push(`${fi.size}: ${fmt(c.u)} × ${fmt(c.g)} × ${fmt(c.y)} mm`);
  lines.push(`${fi.kg}: ${fmt1(c.kg)} kg`);
  lines.push("", `— ${tr.sheet.line} —`);
  lines.push(`${fi.rate}: ${c.rate} /dk`, `${fi.lines}: ${c.lines}`, `${fi.shifts}: ${c.shifts}`);
  lines.push("", `— ${tr.sheet.pallet} —`);
  lines.push(`${fi.pallet}: ${fmt(W)} × ${fmt(L)} mm`, `${fi.maxH}: ${fmt(c.maxH)} mm`, `${fi.sheet}: ${c.sheet ? "evet" : "hayır"}`);
  lines.push(`${fi.pattern}: ${fi.patterns[f.plan.pattern]}`);
  lines.push(`${fl.numbers.perLayer}: ${f.plan.perLayer}`, `${fl.numbers.layers}: ${f.stack.layers}`, `${fl.numbers.total}: ${f.stack.total}`);
  lines.push(`${fl.numbers.height}: ${fmt(f.stack.height)} mm`, `${fl.numbers.load}: ${fmt(f.stack.loadKg)} kg`);
  lines.push("", `— ${tr.sheet.result} (${fl.result.estimate}) —`);
  if (f.status === "ok" && f.model) {
    lines.push(`${fl.result.model}: Pazı ${f.model.name}`, `${fl.result.gripper}: ${tr.grippers[f.gripper]} (${tr.gripSize(f.grip)})`);
    lines.push(`${fl.result.capacity}: ~${fmt1(f.capacity)} /dk`, `${fl.result.required}: ${f.required} /dk`);
    const opts = [f.lift ? fl.result.lift : "", f.double ? fl.result.double : "", c.sheet ? fl.result.sheet : ""].filter(Boolean);
    lines.push(`${fl.result.options}: ${opts.length ? opts.join(", ") : fl.result.none}`);
  } else {
    lines.push(fl.result.customTitle);
    lines.push(`${fl.result.gripper}: ${f.grip.warning ? tr.gripCustom : tr.grippers[f.gripper]} (${tr.gripSize(f.grip)})`);
  }
  for (const w of f.warnings) if (w !== "bag-claw") lines.push(`! ${tr.warnings[w]}`);
  if (p.months || p.never || p.rentGap) {
    lines.push("", `— ${tr.sheet.payback} (${fl.result.estimate}) —`);
    lines.push(`${fl.payback.saving}: ${tlRange(p.saving[0], p.saving[1])}`);
    if (p.months) lines.push(`${fl.payback.months}: ${fl.payback.monthsValue(p.months[0], p.months[1])}`);
    if (p.rentGap) lines.push(`${fl.payback.rentGap}: ${tlRange(p.rentGap[0], p.rentGap[1])}`);
    if (p.never) lines.push(fl.payback.never);
  }
  lines.push("", `${tr.sheet.ref}: ${link}`, "", tr.sheet.concept);
  return lines.join("\n");
}
