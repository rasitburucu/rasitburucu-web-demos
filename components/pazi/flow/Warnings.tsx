import { tr } from "@/content/pazi/tr";
import type { Fit, Warning } from "@/lib/pazi/plan";

// Real warnings get the black/yellow hatching; information stays plain.
const HARD: Warning[] = ["over-cobot", "too-slow", "two-cells", "no-reach", "overhang"];

export function Warnings({ fit, only }: { fit: Fit; only?: Warning[] }) {
  const list = fit.warnings.filter((w) => !only || only.includes(w));
  if (!list.length) return null;
  return (
    <ul className="pz-warns" aria-live="polite">
      {list.map((w) => (
        <li key={w} className={`pz-warn${HARD.includes(w) ? " pz-warn-hard" : ""}`}>
          {w === "overhang" ? `${tr.overhangMm(fit.plan.overhang)} ` : ""}
          {tr.warnings[w]}
        </li>
      ))}
    </ul>
  );
}
