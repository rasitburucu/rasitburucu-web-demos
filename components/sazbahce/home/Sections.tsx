import Link from "next/link";
import { tr } from "@/content/sazbahce/tr";
import type { ImageKey } from "@/content/sazbahce/images";
import { AREAS, VENUE } from "@/lib/sazbahce/venue";
import { Photo } from "../ui/Photo";
import { PlanView } from "../plan/PlanView";

const h = tr.home;

export function AreasBand() {
  return (
    <section className="sb-band sb-areas" aria-labelledby="sb-areas-h">
      <div className="sb-wrap">
        <div className="sb-band-head">
          <h2 id="sb-areas-h" className="sb-h2">
            {h.areas.title}
          </h2>
          <p className="sb-lede">{h.areas.sub}</p>
        </div>
      </div>
      <ul className="sb-areas-row">
        {AREAS.map((k) => {
          const a = tr.areas[k];
          const v = VENUE[k];
          return (
            <li key={k}>
              <Link href={`${tr.base}/alanlar/#${k}`} className="sb-areas-card">
                <span className="sb-areas-ph">
                  <span className="sb-badge">{tr.render}</span>
                  <Photo k={k as ImageKey} sizes="(max-width: 759px) 78vw, 24vw" alt={a.photoAlt} />
                  <span className="sb-areas-mini" aria-hidden="true">
                    <PlanView area={k} frame={k} layout={null} label="" />
                  </span>
                </span>
                <span className="sb-areas-name">{a.name}</span>
                <span className="sb-areas-meta">
                  {a.kind}. {v.ceremonyOnly ? tr.planner.upTo(v.cap) : tr.planner.capacity(v.min, v.cap)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="sb-wrap sb-areas-foot">
        <Link href={`${tr.base}/alanlar/`} className="sb-btn sb-btn--line">
          {h.areas.more}
        </Link>
        <span className="sb-sample">{h.areas.photosNote}</span>
      </div>
    </section>
  );
}

export function KnowBand() {
  return (
    <section className="sb-band sb-know" aria-labelledby="sb-know-h">
      <div className="sb-wrap sb-know-in">
        <div>
          <h2 id="sb-know-h" className="sb-h2">
            {h.know.title}
          </h2>
          <p className="sb-sample">{h.know.sample}</p>
        </div>
        <dl className="sb-know-list">
          {h.know.items.map((i) => (
            <div key={i.q}>
              <dt>{i.q}</dt>
              <dd>{i.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function SplitBand() {
  return (
    <section className="sb-split" aria-label={`${h.corporate.title}, ${h.visit.title}`}>
      <article className="sb-split-item">
        <Photo k="ambar2" sizes="(max-width: 899px) 100vw, 50vw" alt={tr.areas.ambar.photo2Alt} />
        <div className="sb-split-text">
          <h2 className="sb-h3">{h.corporate.title}</h2>
          <p>{h.corporate.body}</p>
          <Link href={`${tr.base}/kurumsal/`} className="sb-btn sb-btn--accent">
            {h.corporate.cta}
          </Link>
        </div>
      </article>
      <article className="sb-split-item">
        <Photo k="sazlik" sizes="(max-width: 899px) 100vw, 50vw" />
        <div className="sb-split-text">
          <h2 className="sb-h3">{h.visit.title}</h2>
          <p>{h.visit.body}</p>
          <Link href={`${tr.base}/ziyaret/`} className="sb-btn sb-btn--accent">
            {h.visit.cta}
          </Link>
        </div>
      </article>
    </section>
  );
}
