// Top view of one pallet layer, to scale, with pallet dimensions and any
// overhang hatched in black/yellow. Pallet length runs left to right.

import type { Config, LayerPlan as Plan } from "@/lib/pazi/plan";
import { palletSize } from "@/lib/pazi/plan";
import { fmt } from "@/lib/pazi/format";

export function LayerPlan({ config, plan, layer = 0, title, compact }: { config: Config; plan: Plan; layer?: 0 | 1; title: string; compact?: boolean }) {
  const { L, W } = palletSize(config);
  const pad = compact ? 40 : 56;
  const s = 0.36; // px per mm
  const vw = L * s + pad * 2;
  const vh = W * s + pad * 2;
  const slots = plan.layers[layer];
  const ox = pad + (L * s) / 2;
  const oy = pad + (W * s) / 2;
  const id = `pz-hatch-${layer}-${compact ? "c" : "f"}`;
  const boards = W > 900 ? 7 : 5;
  // the plan's Z (length) is drawn along screen X, the plan's X (width) along screen Y
  return (
    <svg viewBox={`0 0 ${vw.toFixed(0)} ${vh.toFixed(0)}`} className="pz-lplan" role="img" aria-label={title}>
      <defs>
        <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#f5a800" />
          <rect width="4" height="8" fill="#151615" />
        </pattern>
        <clipPath id={`${id}-out`}>
          <path d={`M0 0H${vw}V${vh}H0Z M${pad} ${pad}V${pad + W * s}H${pad + L * s}V${pad}Z`} clipRule="evenodd" fillRule="evenodd" />
        </clipPath>
      </defs>
      {/* pallet deck boards */}
      <rect x={pad} y={pad} width={L * s} height={W * s} fill="#cdb18a" />
      {Array.from({ length: boards }, (_, i) => {
        const bw = (W * s) / (boards * 1.6);
        const y = pad + (i * (W * s - bw)) / (boards - 1);
        return <rect key={i} x={pad} y={y} width={L * s} height={bw} fill="#b89c75" opacity="0.55" />;
      })}
      <rect x={pad} y={pad} width={L * s} height={W * s} fill="none" stroke="#151615" strokeWidth="1.5" />
      {slots.map((sl, i) => {
        const x = ox + (sl.z - sl.dz / 2) * s;
        const y = oy + (sl.x - sl.dx / 2) * s;
        const w = sl.dz * s;
        const h = sl.dx * s;
        return (
          <g key={i}>
            <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} fill={sl.turned ? "#d8b583" : "#c39b6a"} stroke="#151615" strokeWidth="1" />
            {/* tape runs along the product's length */}
            {sl.turned ? (
              <rect x={x + 1} y={y + h / 2 - 3} width={w - 2} height="6" fill="#a57c4c" opacity="0.7" />
            ) : (
              <rect x={x + w / 2 - 3} y={y + 1} width="6" height={h - 2} fill="#a57c4c" opacity="0.7" />
            )}
            {plan.overhang > 0 ? <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} fill={`url(#${id})`} clipPath={`url(#${id}-out)`} /> : null}
          </g>
        );
      })}
      {/* dimensions */}
      <g className="pz-dim" fontSize={compact ? 13 : 12}>
        <line x1={pad} y1={pad - 18} x2={pad + L * s} y2={pad - 18} stroke="#151615" />
        <line x1={pad} y1={pad - 24} x2={pad} y2={pad - 12} stroke="#151615" />
        <line x1={pad + L * s} y1={pad - 24} x2={pad + L * s} y2={pad - 12} stroke="#151615" />
        <text x={pad + (L * s) / 2} y={pad - 26} textAnchor="middle">
          {fmt(L)}
        </text>
        <line x1={pad - 18} y1={pad} x2={pad - 18} y2={pad + W * s} stroke="#151615" />
        <line x1={pad - 24} y1={pad} x2={pad - 12} y2={pad} stroke="#151615" />
        <line x1={pad - 24} y1={pad + W * s} x2={pad - 12} y2={pad + W * s} stroke="#151615" />
        <text x={pad - 26} y={pad + (W * s) / 2} textAnchor="middle" transform={`rotate(-90 ${pad - 26} ${pad + (W * s) / 2})`}>
          {fmt(W)}
        </text>
      </g>
    </svg>
  );
}
