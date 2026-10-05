import type { Metadata } from "next";
import { tr } from "@/content/sazbahce/tr";
import type { ImageKey } from "@/content/sazbahce/images";
import { layout } from "@/lib/sazbahce/plan";
import { AREAS, SETUPS, VENUE, type AreaKey, type Ceremony } from "@/lib/sazbahce/venue";
import { Photo } from "@/components/sazbahce/ui/Photo";
import { PlanView } from "@/components/sazbahce/plan/PlanView";
import { PlanWith, homePlan, requestPage } from "@/components/sazbahce/pages/PlanWith";

export const metadata: Metadata = {
  title: tr.meta.areasTitle,
  description: tr.meta.areasDescription,
  robots: { index: false, follow: false },
};

const t = tr.areasPage;

// A typical evening drawn on each area's plan.
const SAMPLE: Record<AreaKey, { ceremony: Ceremony; guests: number }> = {
  cayir: { ceremony: "dugun", guests: 240 },
  ambar: { ceremony: "dugun", guests: 160 },
  avlu: { ceremony: "kina", guests: 110 },
  iskele: { ceremony: "nikah", guests: 90 },
};

export default function AreasPage() {
  return (
    <div className="sb-page">
      <header className="sb-wrap sb-page-head">
        <h1 className="sb-h1">{t.title}</h1>
        <p className="sb-lede">{t.lead}</p>
        <nav aria-label={t.index} className="sb-index">
          <ul>
            {AREAS.map((k) => (
              <li key={k}>
                <a href={`#${k}`} className="sb-chip sb-chip--link">
                  {tr.areas[k].name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {AREAS.map((k) => {
        const a = tr.areas[k];
        const v = VENUE[k];
        const s = SAMPLE[k];
        const l = layout({ area: k, ceremony: s.ceremony, guests: s.guests });
        return (
          <section key={k} id={k} className="sb-dossier" aria-labelledby={`h-${k}`}>
            <div className="sb-wrap sb-dossier-grid">
              <div className="sb-dossier-photo">
                <span className="sb-badge">{tr.render}</span>
                <Photo k={k as ImageKey} sizes="(max-width: 899px) 100vw, 58vw" alt={a.photoAlt} />
              </div>
              <div className="sb-dossier-text">
                <h2 id={`h-${k}`} className="sb-h2">
                  {a.name}
                </h2>
                <p className="sb-dossier-kind">
                  {a.kind}. {a.season}.
                </p>
                <p className="sb-dossier-lead">{a.lead}</p>
                {a.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <div className="sb-row">
                  <PlanWith
                    patch={k === "iskele" ? { area: k, ceremony: "nikah" } : { area: k }}
                    href={homePlan}
                    label={t.planWith}
                    className="sb-btn sb-btn--accent"
                  />
                  <PlanWith
                    patch={k === "iskele" ? { area: k, ceremony: "nikah" } : { area: k }}
                    href={requestPage}
                    label={t.request}
                    className="sb-btn sb-btn--line"
                  />
                </div>
              </div>
              <figure className="sb-dossier-plan">
                <PlanView area={k} layout={l} label={t.planCaption(a.name)} />
                <figcaption className="sb-sample">{t.planCaption(a.name)}</figcaption>
              </figure>
              <div className="sb-dossier-facts">
                <h3 className="sb-dossier-h">{t.capacity}</h3>
                <table className="sb-table">
                  <thead>
                    <tr>
                      <th scope="col">{t.setup}</th>
                      <th scope="col">{t.people}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SETUPS.filter((x) => v.setups[x]).map((x) => (
                      <tr key={x}>
                        <th scope="row">{k === "iskele" ? tr.ceremonies.nikah : tr.setups[x]}</th>
                        <td>{v.setups[x]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <dl className="sb-facts">
                  <div>
                    <dt>{t.season}</dt>
                    <dd>{a.season}</dd>
                  </div>
                  <div>
                    <dt>{t.size}</dt>
                    <dd>{t.sizeValue(v.m2)}</dd>
                  </div>
                </dl>
              </div>
              <div className="sb-dossier-notes">
                <h3 className="sb-dossier-h">{t.notes}</h3>
                <ul className="sb-notes">
                  {a.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
                <div className="sb-dossier-photo2">
                  <Photo k={`${k}2` as ImageKey} sizes="(max-width: 899px) 100vw, 30vw" alt={a.photo2Alt} />
                </div>
              </div>
            </div>
          </section>
        );
      })}
      <p className="sb-wrap sb-sample sb-page-foot">{t.sample}</p>
    </div>
  );
}
