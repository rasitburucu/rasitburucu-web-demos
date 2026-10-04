"use client";

import { useId, useState } from "react";

type Part = { id: string; name: string; text: string };

// "Bir kemer nasıl ayakta durur": a cut-stone arch drawn in ink. Each part
// (keystone, voussoirs, impost, piers) maps to one habit of the school. The parts
// are buttons in a list; the drawing follows the selection and is decoration.

const CX = 200;
const CY = 196;
const RI = 90;
const RO = 142;
const N = 9;

function voussoir(i: number) {
  const a0 = Math.PI - (Math.PI / N) * i;
  const a1 = Math.PI - (Math.PI / N) * (i + 1);
  const ro = i === (N - 1) / 2 ? RO + 12 : RO;
  const p = (r: number, a: number) => `${(CX + r * Math.cos(a)).toFixed(1)} ${(CY - r * Math.sin(a)).toFixed(1)}`;
  return `M${p(RI, a0)} L${p(ro, a0)} A${ro} ${ro} 0 0 1 ${p(ro, a1)} L${p(RI, a1)} A${RI} ${RI} 0 0 0 ${p(RI, a0)} Z`;
}

export function ArchParts({ parts, label }: { parts: Part[]; label: string }) {
  const id = useId();
  const [on, setOn] = useState(parts[0].id);
  const cur = parts.find((p) => p.id === on) ?? parts[0];
  const cls = (pid: string) => (pid === on ? "is-on" : undefined);
  return (
    <div className="rv-archparts">
      <svg className="rv-archparts-svg" viewBox="0 0 400 420" aria-hidden="true" focusable="false">
        <g className={cls("ayaklar")}>
          <rect x="44" y="204" width="66" height="200" />
          <rect x="290" y="204" width="66" height="200" />
          <path d="M44 254 H110 M44 304 H110 M44 354 H110 M290 254 H356 M290 304 H356 M290 354 H356" className="rv-archparts-joint" />
        </g>
        <g className={cls("silme")}>
          <rect x="32" y="188" width="90" height="16" />
          <rect x="278" y="188" width="90" height="16" />
        </g>
        <g className={cls("taslar")}>
          {Array.from({ length: N }, (_, i) => (i === (N - 1) / 2 ? null : <path key={i} d={voussoir(i)} />))}
        </g>
        <g className={cls("kilit")}>
          <path d={voussoir((N - 1) / 2)} />
        </g>
        <line x1="10" x2="390" y1="404" y2="404" className="rv-archparts-ground" />
      </svg>
      <div>
        <div className="rv-seg rv-seg--stack" role="group" aria-label={label}>
          {parts.map((p) => (
            <button key={p.id} type="button" aria-pressed={p.id === on} aria-controls={`${id}-t`} onClick={() => setOn(p.id)}>
              {p.name}
            </button>
          ))}
        </div>
        <p className="rv-archparts-text" id={`${id}-t`} aria-live="polite">
          <strong>{cur.name}.</strong> {cur.text}
        </p>
      </div>
    </div>
  );
}
