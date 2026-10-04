import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tr } from "@/content/pazi/tr";
import { MODELS, modelById } from "@/lib/pazi/plan";
import { modelRows } from "@/components/pazi/home/Models";
import { Elevation } from "@/components/pazi/ui/Elevation";
import { Mark, Wordmark } from "@/components/pazi/ui/Mark";
import { PrintButton } from "@/components/pazi/print/PrintButton";
import { IsoCell } from "@/components/pazi/cell/IsoCell";
import { MODEL_DEMO } from "@/components/pazi/model/demo";
import { DEFAULT_CONFIG } from "@/lib/pazi/plan";

export const dynamicParams = false;

export function generateStaticParams() {
  return MODELS.map((m) => ({ model: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> {
  const { model } = await params;
  const m = modelById(model);
  return m ? { title: `${tr.sheet.title}: Pazı ${m.name}` } : {};
}

export default async function ModelSheet({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  const m = modelById(model);
  if (!m) notFound();
  const s = tr.sheet;
  return (
    <div className="pz-paper-wrap">
      <div className="pz-paper-bar">
        <Link href={`/pazi/modeller/${m.id}/`} className="pz-btn pz-btn-ghost">
          {s.back}
        </Link>
        <PrintButton />
      </div>
      <article className="pz-paper" aria-labelledby="pz-paper-title">
        <header className="pz-paper-head">
          <span className="pz-brand">
            <Mark size={30} />
            <Wordmark />
          </span>
          <div className="pz-paper-meta">
            <div>{s.title}</div>
            <div>{`PZ-${m.name}-01`}</div>
          </div>
        </header>
        <div>
          <h1 id="pz-paper-title" className="pz-paper-title">{`Pazı ${m.name}`}</h1>
          <p className="pz-paper-sub">{`${s.who}: ${tr.models.fit[m.id]}`}</p>
        </div>
        <div className="pz-paper-grid">
          <section>
            <h2>{s.title}</h2>
            <dl>
              {modelRows.map((r) => (
                <div key={r.key} style={{ display: "contents" }}>
                  <dt>{tr.models.rows[r.key]}</dt>
                  <dd>{r.value(m)}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section>
            <h2>{tr.models.elevation}</h2>
            <Elevation model={m} className="pz-model-elev" />
          </section>
        </div>
        <section>
          <h2>{s.cellTitle}</h2>
          <div className="pz-paper-iso">
            <IsoCell config={{ ...DEFAULT_CONFIG, ...MODEL_DEMO[m.id] }} />
          </div>
          <p className="pz-paper-sub" style={{ marginTop: "2mm" }}>{s.cellNote}</p>
        </section>
        <section>
          <h2>{s.safety}</h2>
          <p style={{ margin: 0 }}>{s.safetyText}</p>
        </section>
        <footer className="pz-paper-notes">
          <p style={{ margin: 0 }}>{s.concept}</p>
          <p style={{ margin: "1mm 0 0" }}>{`${tr.brand.name}, ${tr.brand.city}, ${tr.brand.email}`}</p>
        </footer>
      </article>
    </div>
  );
}
