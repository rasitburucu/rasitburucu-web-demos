import type { Metadata } from "next";
import Link from "next/link";
import { tr } from "@/content/gelidonya/tr";
import { FIDELER, SOURCE_URL } from "@/content/gelidonya/urunler";
import { nf } from "@/lib/gelidonya/hesap";
import { Resim } from "@/components/gelidonya/ui/Resim";
import { AsiNoktasi } from "@/components/gelidonya/ui/Cizimler";

export const metadata: Metadata = {
  title: "Fidelik",
  description: "Aşılı ve aşısız domates, biber, patlıcan, hıyar, karpuz ve kavun fidesi. Örnek dekar değerleri, anaç seçimi ve sipariş akışı. Konsept çalışma.",
  alternates: { canonical: "/web/gelidonya/fidelik/" },
};

export default function FidelikPage() {
  const p = tr.fidelik;
  const c = p.cols;
  return (
    <>
      <header className="gd-page-head">
        <div className="gd-wrap">
          <h1 className="gd-h1">{p.title}</h1>
          <p className="gd-lead">{p.lead}</p>
        </div>
      </header>
      <Resim k="fidelik" className="gd-page-img" alt={p.imageAlt} sizes="100vw" priority />

      <section className="gd-block gd-block--white" aria-labelledby="gd-f-table">
        <div className="gd-wrap">
          <h2 id="gd-f-table" className="gd-h2">
            {p.tableTitle}
          </h2>
          <div className="gd-table-wrap">
            <table className="gd-table gd-table--cards">
              <thead>
                <tr>
                  <th scope="col">{c.product}</th>
                  <th scope="col">{c.kind}</th>
                  <th scope="col">{c.rate}</th>
                  <th scope="col">{c.cells}</th>
                  <th scope="col">{c.weeks}</th>
                  <th scope="col">{c.source}</th>
                </tr>
              </thead>
              <tbody>
                {FIDELER.map((f) => (
                  <tr key={f.id}>
                    <th scope="row">{f.name}</th>
                    <td data-label={c.kind}>{f.kind}</td>
                    <td className="gd-num" data-label={c.rate}>{nf(f.rate)}</td>
                    <td data-label={c.cells}>{p.cellsValue(f.cells)}</td>
                    <td data-label={c.weeks}>{p.weeksValue(f.weeks)}</td>
                    <td className="gd-src" data-label={c.source}>
                      {f.id.startsWith("domates") ? (
                        <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
                          {f.source}
                          <span className="gd-sr"> {tr.iletisim.newTab}</span>
                        </a>
                      ) : (
                        f.source
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="gd-note">{p.tableNote}</p>
        </div>
      </section>

      <section className="gd-block" aria-labelledby="gd-f-graft">
        <div className="gd-wrap">
          <h2 id="gd-f-graft" className="gd-h2">
            {p.graftTitle}
          </h2>
          <div className="gd-figure-row gd-figure-row--flip">
            <figure className="gd-figure">
              <AsiNoktasi />
            </figure>
            <div className="gd-two gd-two--stack">
              {[p.grafted, p.plain].map((g) => (
                <div key={g.title}>
                  <h3 className="gd-h3">{g.title}</h3>
                  {g.text.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="gd-block gd-block--white" aria-labelledby="gd-f-root">
        <div className="gd-wrap gd-split">
          <div className="gd-prose">
            <h2 id="gd-f-root" className="gd-h2">
              {p.rootTitle}
            </h2>
            <p>{p.rootText}</p>
            <p className="gd-gap">{p.rootNote}</p>
          </div>
          <ul className="gd-rows">
            {p.roots.map((r) => (
              <li key={r.title}>
                <h3>{r.title}</h3>
                <p className="gd-muted">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gd-block" aria-labelledby="gd-f-flow">
        <div className="gd-wrap gd-split">
          <h2 id="gd-f-flow" className="gd-h2">
            {p.flowTitle}
          </h2>
          <ol className="gd-rows gd-steps">
            {p.flow.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p className="gd-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="gd-block gd-block--white" aria-labelledby="gd-f-rules">
        <div className="gd-wrap gd-split">
          <div className="gd-prose">
            <h2 id="gd-f-rules" className="gd-h2">
              {p.rulesTitle}
            </h2>
            <p className="gd-gap">{p.rulesNote}</p>
            <p>
              <Link href={`${tr.base}/#siparis`} className="gd-btn gd-btn--dark gd-btn--big">
                {p.cta}
              </Link>
            </p>
          </div>
          <ul className="gd-bullets">
            {p.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
