"use client";

import { MODELLER, type Model, type ModelId } from "@/content/vaziyet/modeller";
import { tr } from "@/content/vaziyet/tr";

/** Small isometric cobalt house, all five drawn at the same scale. */
export function EvIkon({ m, olcek = 1.85, className }: { m: Model; olcek?: number; className?: string }) {
  const c = 0.866 * olcek;
  const s = 0.5 * olcek;
  const P = (x: number, y: number, z: number): [number, number] => [(x - y) * c, (x + y) * s - z * olcek];
  const { w, d, sacak: h, mahya: r } = m;
  // walls facing the viewer: x = w (right) and y = d (left-front)
  const yuzY = [P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)];
  const yuzX = [P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)];
  const ucgen = [P(w, 0, h), P(w, d, h), P(w, d / 2, r)];
  const catiArka = [P(0, 0, h), P(w, 0, h), P(w, d / 2, r), P(0, d / 2, r)];
  const catiOn = [P(0, d, h), P(w, d, h), P(w, d / 2, r), P(0, d / 2, r)];
  const tum = [...yuzY, ...yuzX, ...catiArka];
  const xs = tum.map((p) => p[0]);
  const ys = tum.map((p) => p[1]);
  // a fixed frame so the five icons keep their relative size
  const W = 62;
  const H = 42;
  const dx = W / 2 - (Math.min(...xs) + Math.max(...xs)) / 2;
  const dy = H - 3 - Math.max(...ys);
  const yol = (pts: [number, number][]) => `M${pts.map((p) => `${(p[0] + dx).toFixed(2)} ${(p[1] + dy).toFixed(2)}`).join(" L")} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className={className ?? "vz-evikon"}>
      <path d={yol(yuzY)} fill="#2949b5" />
      <path d={yol(yuzX)} fill="#1e3a95" />
      <path d={yol(ucgen)} fill="#1e3a95" />
      <path d={yol(catiArka)} fill="#3b62e0" />
      <path d={yol(catiOn)} fill="#5a7cf0" />
      {m.katSayisi === 2 && <path d={`M${(P(0, d, h / 2)[0] + dx).toFixed(2)} ${(P(0, d, h / 2)[1] + dy).toFixed(2)} L${(P(w, d, h / 2)[0] + dx).toFixed(2)} ${(P(w, d, h / 2)[1] + dy).toFixed(2)}`} stroke="#1b3790" strokeWidth={0.6} />}
    </svg>
  );
}

export function Raf({ secili, onSec }: { secili: ModelId; onSec: (id: ModelId) => void }) {
  const t = tr.arac;
  return (
    <div className="vz-raf">
      <p className="vz-raf-baslik" id="vz-raf-baslik">
        {t.rafBaslik}
      </p>
      <div className="vz-raf-liste" role="group" aria-labelledby="vz-raf-baslik">
        {MODELLER.map((m) => (
          <button key={m.id} type="button" className="vz-raf-btn" aria-pressed={m.id === secili} onClick={() => onSec(m.id)}>
            <EvIkon m={m} />
            <span className="vz-raf-ad">{m.ad}</span>
            <span className="vz-raf-oda">
              {m.m2} m² · {m.oda}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
