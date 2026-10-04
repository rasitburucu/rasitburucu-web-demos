import Link from "next/link";
import type { CSSProperties } from "react";
import { tr } from "@/content/pazi/tr";
import { MODELS, type ModelSpec } from "@/lib/pazi/plan";
import { fmt, fmt1 } from "@/lib/pazi/format";
import { DrawIn } from "../ui/DrawIn";
import { Elevation } from "../ui/Elevation";

export const modelRows: { key: keyof typeof tr.models.rows; value: (m: ModelSpec) => string }[] = [
  { key: "payload", value: (m) => `${m.payload} kg` },
  { key: "reach", value: (m) => `${fmt(m.reach)} mm` },
  { key: "repeat", value: (m) => `±${m.repeatability.toLocaleString("tr-TR")} mm` },
  { key: "axes", value: () => "6" },
  { key: "stackFixed", value: (m) => `${fmt(m.stackFixed)} mm` },
  { key: "stackLift", value: (m) => `${fmt(m.stackLift)} mm` },
  { key: "cycles", value: (m) => `${fmt1(m.cycles)} /dk` },
  { key: "mass", value: (m) => `${m.mass} kg` },
  { key: "ip", value: (m) => m.ip },
];

export function Models() {
  const t = tr.models;
  return (
    <section id={t.id} className="pz-models" aria-labelledby="pz-models-title">
      <div className="pz-wrap">
        <div className="pz-models-head">
          <h2 id="pz-models-title" className="pz-h2">
            {t.title}
          </h2>
          <p className="pz-lead">{t.lead}</p>
        </div>
        <DrawIn className="pz-sheet">
          <table className="pz-spec">
            <caption className="pz-sr">{t.caption}</caption>
            <thead>
              <tr className="pz-spec-draw">
                <td className="pz-spec-corner">
                  <p className="pz-spec-key-title">{t.elevation}</p>
                  <p className="pz-spec-key-note">{t.sameScale}</p>
                  <ul className="pz-spec-key">
                    <li>
                      <svg viewBox="0 0 28 8" aria-hidden="true">
                        <path d="M0 4h28" stroke="#6a6d67" strokeWidth="1" strokeDasharray="9 2.2 1.2 2.2" />
                      </svg>
                      {t.legend.axis}
                    </li>
                    <li>
                      <svg viewBox="0 0 28 12" aria-hidden="true">
                        <path d="M0 12 L12 0 M8 12 L20 0 M16 12 L28 0 M24 12 L28 8" stroke="#8d8f88" strokeWidth="0.8" />
                        <path d="M0 11.5 Q 16 11.5 27.5 0" fill="none" stroke="#8d8f88" strokeWidth="1.2" />
                      </svg>
                      {t.legend.reach}
                    </li>
                    <li>
                      <svg viewBox="0 0 28 12" aria-hidden="true">
                        <rect x="0.5" y="0.5" width="13" height="8" rx="1" fill="#d7bb92" stroke="#151615" strokeWidth="0.8" />
                        <rect x="0.5" y="9" width="27" height="2.5" fill="#d3bd98" stroke="#151615" strokeWidth="0.6" />
                      </svg>
                      {t.legend.load}
                    </li>
                  </ul>
                </td>
                {MODELS.map((m, i) => (
                  <td key={m.id} className="pz-spec-fig" style={{ "--col": `${i * 140}ms` } as CSSProperties}>
                    <Elevation model={m} className="pz-spec-elev" />
                  </td>
                ))}
              </tr>
              <tr className="pz-spec-names">
                <td />
                {MODELS.map((m) => (
                  <th key={m.id} scope="col">
                    <span className="pz-spec-name">{m.name}</span>
                    <span className="pz-spec-fit">{t.fit[m.id]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modelRows.map((r) => (
                <tr key={r.key}>
                  <th scope="row">{t.rows[r.key]}</th>
                  {MODELS.map((m) => (
                    <td key={m.id} className="pz-mono">
                      {r.value(m)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td />
                {MODELS.map((m) => (
                  <td key={m.id}>
                    <Link href={`/pazi/modeller/${m.id}/`} className="pz-btn pz-spec-open">
                      {`${m.name}: ${t.open}`}
                    </Link>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
          <p className="pz-sheet-note">{t.note}</p>
        </DrawIn>
      </div>
    </section>
  );
}
