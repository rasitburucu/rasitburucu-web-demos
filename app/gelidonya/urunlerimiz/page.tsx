import type { Metadata } from "next";
import { tr } from "@/content/gelidonya/tr";
import { MAHSUL } from "@/content/gelidonya/urunler";
import { Sezon, seasonText } from "@/components/gelidonya/home/Sections";
import { AmbalajPlakasi } from "@/components/gelidonya/ui/Cizimler";
import { AliciFormu } from "@/components/gelidonya/pages/AliciFormu";
import { WaButton } from "@/components/gelidonya/shell/Wa";

export const metadata: Metadata = {
  title: "Ürün ve ihracat",
  description:
    "Kendi seralarımızda yetiştirdiğimiz domates ve mevsim sebzesi: ambalaj seçenekleri, 12 aylık tedarik takvimi, alıcının istediği belgeler, fiyat ve hasat takvimi isteme. Konsept çalışma.",
  alternates: { canonical: "/web/gelidonya/urunlerimiz/" },
};

export default function UrunlerimizPage() {
  const p = tr.urunlerimiz;
  const c = p.productsCols;
  const exp = tr.iletisim.roles[2];
  return (
    <>
      <header className="gd-page-head">
        <div className="gd-wrap gd-page-head-in">
          <div className="gd-page-head-text">
            <h1 className="gd-h1">{p.title}</h1>
            <p className="gd-lead">{p.lead}</p>
            <p className="gd-btn-row">
              <a href="#talep" className="gd-btn gd-btn--dark">
                {p.headCta}
              </a>
            </p>
          </div>
          <dl className="gd-belge">
            <dt>{p.headCall}</dt>
            <dd>
              <a href={exp.href} className="gd-person-phone gd-tnum">
                {exp.phone}
              </a>
            </dd>
            <dd>
              {tr.iletisim.exportMail} [{tr.brand.emailNote}]
            </dd>
          </dl>
        </div>
      </header>

      <section className="gd-sec gd-sec--white" aria-labelledby="gd-u-products">
        <div className="gd-wrap">
          <h2 id="gd-u-products" className="gd-h2">
            {p.productsTitle}
          </h2>
          <div className="gd-table-wrap">
            <table className="gd-table gd-table--cards">
              <thead>
                <tr>
                  <th scope="col">{c.urun}</th>
                  <th scope="col">{c.tip}</th>
                  <th scope="col">{c.pack}</th>
                  <th scope="col">{c.season}</th>
                </tr>
              </thead>
              <tbody>
                {MAHSUL.map((m) => (
                  <tr key={m.id}>
                    <th scope="row">{m.name}</th>
                    <td data-label={c.tip}>{m.type}</td>
                    <td data-label={c.pack}>{m.pack.join(" · ")}</td>
                    <td data-label={c.season}>
                      {seasonText(m.months, tr.months)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="gd-gap">{p.packNote}</p>
          <div className="gd-plate-gap">
            <AmbalajPlakasi />
          </div>
          <div className="gd-split gd-split--gap">
            <div className="gd-prose">
              <h3 className="gd-h3">{p.loadTitle}</h3>
              <ul className="gd-bullets">
                {p.load.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <p className="gd-gap">{p.loadNote}</p>
            </div>
            <div className="gd-prose">
              <h3 className="gd-h3">{p.docsTitle}</h3>
              <ul className="gd-bullets">
                {p.docs.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="gd-gap">{p.docsNote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="gd-sec" aria-labelledby="gd-u-season">
        <div className="gd-wrap">
          <h2 id="gd-u-season" className="gd-h2">
            {p.seasonTitle}
          </h2>
          <Sezon caption={tr.urunKapi.seasonCaption} />
          <p className="gd-note">{tr.seralarimiz.seasonNote}</p>
        </div>
      </section>

      <section
        className="gd-sec gd-sec--white"
        id="talep"
        aria-labelledby="gd-a-title"
      >
        <div className="gd-wrap gd-req">
          <aside className="gd-person" aria-labelledby="gd-u-contact">
            <h2 id="gd-u-contact" className="gd-h3">
              {p.contactTitle}
            </h2>
            <p>{p.contactText}</p>
            <p className="gd-person-role">{exp.role}</p>
            <a href={exp.href} className="gd-person-phone gd-tnum">
              {exp.phone}
            </a>
            <span className="gd-muted">[{tr.brand.phoneNote}]</span>
            <p className="gd-muted">
              {tr.iletisim.exportMail} <span>[{tr.brand.emailNote}]</span>
            </p>
            <WaButton message={p.waMessage} />
          </aside>
          <AliciFormu />
        </div>
      </section>
    </>
  );
}
