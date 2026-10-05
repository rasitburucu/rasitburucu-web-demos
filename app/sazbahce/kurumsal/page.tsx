import type { Metadata } from "next";
import { tr } from "@/content/sazbahce/tr";
import { SETUPS, VENUE, type AreaKey } from "@/lib/sazbahce/venue";
import { Photo } from "@/components/sazbahce/ui/Photo";
import { CorporatePlanner } from "@/components/sazbahce/pages/CorporatePlanner";

export const metadata: Metadata = {
  title: tr.meta.corporateTitle,
  description: tr.meta.corporateDescription,
  robots: { index: false, follow: false },
};

const c = tr.corporatePage;
const MATRIX: AreaKey[] = ["ambar", "cayir", "avlu"];

export default function CorporatePage() {
  return (
    <div className="sb-page">
      <header className="sb-wrap sb-page-head sb-page-head--split">
        <div>
          <h1 className="sb-h1">{c.title}</h1>
          <p className="sb-lede">{c.lead}</p>
        </div>
        <div className="sb-page-head-photo">
          <Photo k="ambar2" sizes="(max-width: 899px) 100vw, 44vw" alt={c.photoAlt} priority />
        </div>
      </header>

      <section className="sb-wrap sb-section" aria-labelledby="sb-corp-h">
        <div className="sb-section-head">
          <h2 id="sb-corp-h" className="sb-h2">
            {c.plannerTitle}
          </h2>
          <p className="sb-lede">{c.plannerSub}</p>
        </div>
        <CorporatePlanner />
      </section>

      <section className="sb-wrap sb-section sb-corp-cols" aria-label={`${c.matrixTitle}, ${c.dayTitle}`}>
        <div>
          <h2 className="sb-h3">{c.matrixTitle}</h2>
          <div className="sb-table-scroll">
            <table className="sb-table sb-table--matrix">
              <thead>
                <tr>
                  <th scope="col">{tr.planner.setupLabel}</th>
                  {MATRIX.map((a) => (
                    <th key={a} scope="col">
                      {tr.areas[a].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SETUPS.map((s) => (
                  <tr key={s}>
                    <th scope="row">{tr.setups[s]}</th>
                    {MATRIX.map((a) => (
                      <td key={a}>{VENUE[a].setups[s] ?? c.none}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="sb-sample">{c.matrixNote}</p>
        </div>
        <div>
          <h2 className="sb-h3">{c.dayTitle}</h2>
          <ol className="sb-day-list">
            {c.day.map((d) => (
              <li key={d.t + d.a}>
                <span className="sb-day-t">{d.t}</span>
                <span>
                  {d.a}
                  <small>{d.w}</small>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sb-wrap sb-section sb-corp-tech" aria-labelledby="sb-tech-h">
        <div className="sb-corp-tech-photo">
          <Photo k="ambarUzun" sizes="(max-width: 899px) 100vw, 40vw" />
        </div>
        <div>
          <h2 id="sb-tech-h" className="sb-h3">
            {c.techTitle}
          </h2>
          <dl className="sb-tech">
            {c.tech.map((x) => (
              <div key={x.k}>
                <dt>{x.k}</dt>
                <dd>{x.v}</dd>
              </div>
            ))}
          </dl>
          <p className="sb-sample">{c.techNote}</p>
        </div>
      </section>
    </div>
  );
}
