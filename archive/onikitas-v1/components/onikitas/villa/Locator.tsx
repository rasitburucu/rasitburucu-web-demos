import { tr } from "@/content/onikitas/tr";
import type { Villa } from "@/content/onikitas/villas";
import { PlanSvg } from "../plan/PlanSvg";

function row(v: Villa): "low" | "mid" | "high" {
  if (v.plan.cx < 380) return "low";
  if (v.plan.cx < 620) return "mid";
  return "high";
}

/** Mini Stone Plan with this villa lit and the sun path drawn over it. */
export function Locator({ villa }: { villa: Villa }) {
  const l = tr.villa.locator;
  return (
    <section aria-labelledby="onk-loc-mini" className="mt-20">
      <h2 id="onk-loc-mini" className="text-[clamp(2rem,3.4vw,3rem)] leading-none">
        {l.heading}
      </h2>
      <p className="mt-3 max-w-[56ch] text-olive-soft">{l.body(l.rows[row(villa)])}</p>
      <div className="mt-6 overflow-hidden shadow-[0_1px_0_#3b3a2e26,0_24px_48px_-32px_#3b3a2e59]">
        <PlanSvg mode="mini" hour={17} highlight={villa.id} titleId={`onk-mini-${villa.id}`} className="block h-auto w-full" />
      </div>
    </section>
  );
}
