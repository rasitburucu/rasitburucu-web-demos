import Link from "next/link";
import { tr } from "@/content/sazbahce/tr";
import type { ImageKey } from "@/content/sazbahce/images";
import { ceremonyStart, clock, sunTimes } from "@/lib/sazbahce/sun";
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

const MONTHS = [3, 4, 5, 6, 7, 8, 9];

export function SunsetBand() {
  const rows = MONTHS.map((m) => {
    const d = new Date(2027, m, 15);
    return { m, set: sunTimes(d).set, start: ceremonyStart(d) };
  });
  const W = 1000;
  const H = 200;
  const lo = 17 * 60 + 30;
  const hi = 21 * 60;
  const x = (i: number) => 70 + (i * (W - 140)) / (rows.length - 1);
  const y = (min: number) => H - 20 - ((min - lo) / (hi - lo)) * (H - 50);
  const line = (k: "set" | "start") => rows.map((r, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(r[k]).toFixed(1)}`).join("");
  return (
    <section className="sb-band sb-sunset" aria-labelledby="sb-sunset-h">
      <div className="sb-wrap sb-sunset-in">
        <div className="sb-sunset-text">
          <h2 id="sb-sunset-h" className="sb-h2">
            {h.sunset.title}
          </h2>
          <p className="sb-lede">{h.sunset.sub}</p>
          <p className="sb-sample">{h.sunset.note}</p>
        </div>
        <figure className="sb-sunset-fig">
          <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="sb-sunset-svg">
            {[18, 19, 20, 21].map((hh) => (
              <g key={hh}>
                <path d={`M40 ${y(hh * 60).toFixed(1)}H${W - 20}`} stroke="#C9D2CB" strokeWidth="1" />
              </g>
            ))}
            <path d={line("start")} fill="none" stroke="#B8862F" strokeWidth="2" strokeDasharray="5 5" />
            <path d={line("set")} fill="none" stroke="#1D3830" strokeWidth="2.4" />
            {rows.map((r, i) => (
              <g key={r.m}>
                <circle cx={x(i)} cy={y(r.set)} r="5" fill="#E8AF56" stroke="#1D3830" strokeWidth="1.5" />
                <circle cx={x(i)} cy={y(r.start)} r="3.5" fill="#F3F5F1" stroke="#B8862F" strokeWidth="1.5" />
              </g>
            ))}
          </svg>
          <table className="sb-sunset-table">
            <caption className="sb-sr">{h.sunset.caption}</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sb-sr">{h.sunset.caption}</span>
                </th>
                {rows.map((r) => (
                  <th key={r.m} scope="col">
                    {tr.monthsShort[r.m]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <i className="sb-key sb-key--set" aria-hidden="true" />
                  {h.sunset.sunset}
                </th>
                {rows.map((r) => (
                  <td key={r.m}>{clock(r.set)}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">
                  <i className="sb-key sb-key--start" aria-hidden="true" />
                  {h.sunset.ceremony}
                </th>
                {rows.map((r) => (
                  <td key={r.m}>{clock(r.start)}</td>
                ))}
              </tr>
            </tbody>
          </table>
          <figcaption className="sb-sample">{h.sunset.caption}</figcaption>
        </figure>
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
