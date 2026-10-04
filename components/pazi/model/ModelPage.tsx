"use client";

import Link from "next/link";
import { useEffect } from "react";
import { tr } from "@/content/pazi/tr";
import { DEFAULT_CONFIG, type Config, type ModelSpec } from "@/lib/pazi/plan";
import { cell } from "@/lib/pazi/store";
import { encodeConfig } from "@/lib/pazi/url";
import { Cell } from "../cell/Cell";
import { Hmi } from "../cell/Hmi";
import { Elevation } from "../ui/Elevation";
import { modelRows } from "../home/Models";
import { MODEL_DEMO } from "./demo";

export function ModelPage({ model }: { model: ModelSpec }) {
  const s = tr.sheet;
  const demo: Config = { ...DEFAULT_CONFIG, ...MODEL_DEMO[model.id] };

  useEffect(() => {
    cell.set({ config: { ...DEFAULT_CONFIG, ...MODEL_DEMO[model.id] }, lock: model.id, view: "iso", paused: false, operator: null, zone: "out" });
  }, [model.id]);

  return (
    <>
      <section className="pz-wrap pz-model-hero" aria-labelledby="pz-model-title">
        <div>
          <p className="pz-model-kicker">{s.title}</p>
          <h1 id="pz-model-title" className="pz-model-name">
            {model.name}
          </h1>
          <p className="pz-model-who">{tr.models.fit[model.id]}</p>
          <p className="pz-flow-hint">{tr.models.note}</p>
          <div className="pz-model-actions">
            <Link href={`/pazi/fizibilite/?${encodeConfig(demo, { model: model.id })}`} className="pz-btn pz-btn-primary">
              {s.forThisCta}
            </Link>
            <Link href={`/pazi/modeller/${model.id}/foy/`} className="pz-btn">
              {s.sheetCta}
            </Link>
          </div>
        </div>
        <div>
          <div className="pz-model-cell">
            <Cell frame={{ x: 0.5, y: 0.55 }} zoom={1.35} />
          </div>
          <Hmi />
          <p className="pz-model-cap">{s.cycleLabel}</p>
        </div>
      </section>
      <section className="pz-model-sheet" aria-labelledby="pz-model-sheet-title">
        <div className="pz-wrap pz-model-grid">
          <table className="pz-model-table">
            <caption id="pz-model-sheet-title">{`${s.title}: Pazı ${model.name}`}</caption>
            <tbody>
              {modelRows.map((r) => (
                <tr key={r.key}>
                  <th scope="row">{tr.models.rows[r.key]}</th>
                  <td className="pz-mono">{r.value(model)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <figure className="pz-sheet" style={{ margin: 0 }}>
            <Elevation model={model} className="pz-model-elev" renderWidth={360} />
            <figcaption className="pz-sheet-note">{tr.models.elevation}</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
