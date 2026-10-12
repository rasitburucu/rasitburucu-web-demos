import Link from "next/link";
import { href, type Locale } from "@/content/damar/routes";
import { dict, num } from "@/lib/damar/dict";
import { ContainerSection } from "../ui/Drawings";
import { ArrowRight, Check } from "../ui/Icons";

// who handles each leg: 1 = Damar, 0 = the buyer; and where the risk passes
const WHO: { cells: number[]; risk: number }[] = [
  { cells: [1, 1, 1, 1, 0, 0, 0], risk: 4 }, // FOB: on board at İzmir
  { cells: [1, 1, 1, 1, 1, 1, 0], risk: 4 }, // CIF: still on board at İzmir
  { cells: [0, 0, 0, 0, 0, 0, 0], risk: 0 }, // EXW: from our yard
];

export function ShippingPage({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const s = d.shipping;
  return (
    <>
      <header className="dm-phead dm-wrap">
        <h1 className="dm-h1">{s.h1}</h1>
        <p className="dm-lede">{s.lede}</p>
      </header>

      <section className="dm-onpage dm-sheetband" aria-labelledby="dm-terms-h">
        <div className="dm-wrap dm-terms">
          <div className="dm-terms-head">
            <h2 id="dm-terms-h" className="dm-h2">
              {s.termsTitle}
            </h2>
            <p className="dm-note-ink">{s.termsNote}</p>
          </div>
          <ul className="dm-terms-list">
            {s.terms.map((t) => (
              <li key={t.k}>
                <h3 className="dm-h3">{t.k}</h3>
                <p>{t.d}</p>
              </li>
            ))}
          </ul>
          <figure className="dm-journey">
            <figcaption className="dm-journey-title">{s.journeyTitle}</figcaption>
            <div className="dm-scroll" role="region" aria-label={s.journeyTitle} tabIndex={0}>
              <table className="dm-journey-grid">
                <thead>
                  <tr>
                    <td />
                    {s.journey.map((j) => (
                      <th key={j} scope="col">
                        {j}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.termsRows.map((row, r) => (
                    <tr key={row}>
                      <th scope="row">{row}</th>
                      {WHO[r].cells.map((who, c) => (
                        <td key={c} data-who={who ? "us" : "you"} data-risk={WHO[r].risk === c + 1 ? "after" : WHO[r].risk === 0 && c === 0 ? "before" : undefined}>
                          <span className="dm-sr">{who ? s.us : s.you}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="dm-journey-key" aria-hidden="true">
              <li data-who="us">{s.us}</li>
              <li data-who="you">{s.you}</li>
              <li data-risk>{s.risk}</li>
            </ul>
          </figure>
        </div>
      </section>

      <section className="dm-wrap dm-load" aria-labelledby="dm-load-h">
        <div className="dm-load-text">
          <h2 id="dm-load-h" className="dm-h2">
            {s.loadTitle}
          </h2>
          <p>{s.loadText}</p>
          <dl className="dm-load-bars">
            <div>
              <dt>{s.loadWeight}</dt>
              <dd>
                <span className="dm-bar" style={{ "--v": 1 } as React.CSSProperties} />
                <span className="dm-num">27 t</span>
              </dd>
            </div>
            <div>
              <dt>{s.loadVolume}</dt>
              <dd>
                <span className="dm-bar" style={{ "--v": 0.29 } as React.CSSProperties} />
                <span className="dm-num">≈ {num(locale, 9.4, 1)} / 33 m³</span>
              </dd>
            </div>
          </dl>
          <dl className="dm-load-m2">
            <div>
              <dt>{s.load2}</dt>
              <dd className="dm-num">≈ 470 m²</dd>
            </div>
            <div>
              <dt>{s.load3}</dt>
              <dd className="dm-num">≈ 310 m²</dd>
            </div>
          </dl>
          <p className="dm-note">{s.loadLimits}</p>
        </div>
        <figure className="dm-load-fig">
          <div className="dm-plate-paper">
            <ContainerSection label={s.loadFigure} />
          </div>
          <figcaption>{s.loadNote}</figcaption>
        </figure>
      </section>

      <section className="dm-onpage dm-sheetband" aria-labelledby="dm-times-h">
        <div className="dm-wrap dm-shipgrid">
          <div>
            <h2 id="dm-times-h" className="dm-h2">
              {s.timesTitle}
            </h2>
            <dl className="dm-times">
              {s.times.map((t) => (
                <div key={t.k}>
                  <dt>{t.k}</dt>
                  <dd>{t.v}</dd>
                </div>
              ))}
            </dl>
            <p className="dm-note-ink">{s.timesNote}</p>
            <h2 className="dm-h2 dm-pay-h">{s.payTitle}</h2>
            <p className="dm-pay">{s.payText}</p>
            <p className="dm-note-ink">{s.payNote}</p>
          </div>
          <div>
            <h2 className="dm-h2">{s.packTitle}</h2>
            <p className="dm-pack">{s.packText}</p>
            <h2 className="dm-h2 dm-docs-h">{s.docsTitle}</h2>
            <ul className="dm-docs">
              {s.docs.map((doc) => (
                <li key={doc}>
                  <Check />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="dm-wrap dm-timeline" aria-labelledby="dm-steps-h">
        <h2 id="dm-steps-h" className="dm-h2">
          {s.stepsTitle}
        </h2>
        <ol className="dm-tl">
          {s.steps.map((st, i) => (
            <li key={st.t}>
              <span className="dm-tl-n dm-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="dm-h3">{st.t}</h3>
                <p>{st.d}</p>
              </div>
              <p className="dm-tl-when">{st.when}</p>
            </li>
          ))}
        </ol>
        <Link href={`${href(locale, "samples")}#quote`} className="dm-btn dm-btn--page">
          {s.cta}
          <ArrowRight />
        </Link>
      </section>
    </>
  );
}
