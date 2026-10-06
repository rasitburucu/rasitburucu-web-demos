import type { Metadata } from "next";
import Link from "next/link";
import { tr } from "@/content/gelidonya/tr";
import { URUNLER, SOURCE_URL, VIYOLLER } from "@/content/gelidonya/urunler";
import { nf } from "@/lib/gelidonya/hesap";
import { Resim } from "@/components/gelidonya/ui/Resim";
import { AsiKarsilastirma } from "@/components/gelidonya/ui/Cizimler";
import { Surec } from "@/components/gelidonya/home/Sections";

export const metadata: Metadata = {
  title: "Fidelik ve sipariş",
  description:
    "Aşılı ve aşısız domates, biber, patlıcan, hıyar, karpuz ve kavun fidesi: gövde, viyol, süre, anaç; sipariş, kaparo ve teslim; dikimden sonraki ilk hafta. Konsept çalışma.",
  alternates: { canonical: "/web/gelidonya/fidelik/" },
};

export default function FidelikPage() {
  const p = tr.fidelik;
  const c = p.cols;
  return (
    <>
      <header className="gd-page-head gd-page-head--img">
        <div className="gd-wrap gd-page-head-in">
          <div className="gd-page-head-text">
            <h1 className="gd-h1">{p.title}</h1>
            <p className="gd-lead">{p.lead}</p>
          </div>
          <dl className="gd-belge">
            <dt>{p.belge}</dt>
            <dd>
              {p.belgeNo}: {p.belgeValue} · {p.belgeDate}: {p.belgeValue}
            </dd>
          </dl>
        </div>
        <Resim k="ziyaret" className="gd-page-img" alt={p.imageAlt} sizes="100vw" priority />
      </header>

      <section className="gd-sec gd-sec--white" aria-labelledby="gd-f-table">
        <div className="gd-wrap">
          <h2 id="gd-f-table" className="gd-h2">
            {p.tableTitle}
          </h2>
          <div className="gd-table-wrap">
            <table className="gd-table gd-table--cards">
              <thead>
                <tr>
                  <th scope="col">{c.urun}</th>
                  <th scope="col">{c.asi}</th>
                  <th scope="col">{c.govde}</th>
                  <th scope="col">{c.viyol}</th>
                  <th scope="col">{c.sure}</th>
                  <th scope="col" className="gd-num">
                    {c.tepe}
                  </th>
                  <th scope="col">{c.kaynak}</th>
                </tr>
              </thead>
              <tbody>
                {URUNLER.map((u) => (
                  <tr key={u.id}>
                    <th scope="row">{u.name}</th>
                    <td data-label={c.asi}>{u.graft.map((g) => tr.calc.graftNames[g]).join(", ")}</td>
                    <td data-label={c.govde}>{u.stems.map((s) => tr.calc.stemNames[s]).join(" ya da ")}</td>
                    <td data-label={c.viyol}>{u.trays.map((t) => tr.calc.trayValue(t)).join(", ")}</td>
                    <td data-label={c.sure}>
                      {u.weeks.asili ? `${tr.calc.graftNames.asili} ${p.weeksValue(u.weeks.asili)}` : ""}
                      {u.weeks.asisiz ? `, ${tr.calc.graftNames.asisiz.toLocaleLowerCase("tr")} ${p.weeksValue(u.weeks.asisiz)}` : ""}
                    </td>
                    <td data-label={c.tepe} className="gd-num">
                      {nf(u.heads)}
                    </td>
                    <td data-label={c.kaynak} className="gd-src">
                      {u.headsSourced ? (
                        <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
                          {p.sourced}
                          <span className="gd-sr"> {tr.iletisim.newTab}</span>
                        </a>
                      ) : (
                        p.unsourced
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

      <section className="gd-sec" aria-labelledby="gd-f-graft">
        <div className="gd-wrap">
          <h2 id="gd-f-graft" className="gd-h2">
            {p.graftTitle}
          </h2>
          <div className="gd-plate-row">
            <AsiKarsilastirma />
            <div className="gd-plate-text">
              {[p.grafted, p.plain].map((g) => (
                <div key={g.title} className="gd-prose">
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

      <section className="gd-sec gd-sec--white" aria-labelledby="gd-f-root">
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
                <h3 className="gd-h3">{r.title}</h3>
                <p className="gd-muted">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="gd-wrap gd-split gd-split--gap">
          <div className="gd-prose">
            <h2 className="gd-h2" id="gd-f-tray">
              {p.trayTitle}
            </h2>
            <p>{p.trayLead}</p>
          </div>
          <div className="gd-table-wrap">
            <table className="gd-table gd-table--cards" aria-labelledby="gd-f-tray">
              <thead>
                <tr>
                  <th scope="col">{p.trayCols.cells}</th>
                  <th scope="col">{p.trayCols.use}</th>
                  <th scope="col">{p.trayCols.basis}</th>
                </tr>
              </thead>
              <tbody>
                {VIYOLLER.map((v) => (
                  <tr key={v.cells}>
                    <th scope="row" className="gd-tnum">
                      {tr.calc.trayValue(v.cells)}
                    </th>
                    <td data-label={p.trayCols.use}>{v.use}</td>
                    <td data-label={p.trayCols.basis} className="gd-src">
                      {v.basis}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="gd-sec" id="siparis" aria-labelledby="gd-f-order">
        <div className="gd-wrap">
          <div className="gd-sec-head gd-sec-head--narrow">
            <h2 id="gd-f-order" className="gd-h2">
              {p.orderTitle}
            </h2>
            <p className="gd-lead">{p.orderLead}</p>
          </div>
          <Surec headingLevel={3} withLink={false} preset={{ urun: "biber", graft: "asisiz", stems: 1, tray: 136, donum: 5, week: null }} />
          <div className="gd-order-grid">
            <div className="gd-prose">
              <h3 className="gd-h3">{p.when}</h3>
              <p>{p.whenText}</p>
              <h3 className="gd-h3">{p.channelTitle}</h3>
              <p>{p.channelText}</p>
              <table className="gd-table gd-table--plain">
                <thead>
                  <tr>
                    <th scope="col">{p.channelCols.bolge}</th>
                    <th scope="col">{p.channelCols.kanal}</th>
                  </tr>
                </thead>
                <tbody>
                  {p.channels.map((ch) => (
                    <tr key={ch.bolge}>
                      <th scope="row">{ch.bolge}</th>
                      <td>{ch.kanal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="gd-prose">
              <h3 className="gd-h3">{p.pickupTitle}</h3>
              <ul className="gd-bullets">
                {p.pickup.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="gd-sec gd-sec--white" aria-labelledby="gd-f-farmer">
        <div className="gd-wrap">
          <div className="gd-sec-head gd-sec-head--narrow">
            <h2 id="gd-f-farmer" className="gd-h2">
              {p.farmerTitle}
            </h2>
            <p className="gd-lead">{p.farmerLead}</p>
          </div>
          <ul className="gd-tips">
            {p.farmer.map((f) => (
              <li key={f.title}>
                <h3 className="gd-h3">{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
          <p className="gd-sec-more">
            <Link href={`${tr.base}/hazir-fide/`} className="gd-btn gd-btn--dark">
              {p.cta}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
