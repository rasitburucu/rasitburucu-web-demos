import type { Metadata } from "next";
import { tr } from "@/content/gelidonya/tr";
import { RandevuFormu } from "@/components/gelidonya/pages/RandevuFormu";
import { Resim } from "@/components/gelidonya/ui/Resim";
import { HaritaKesiti } from "@/components/gelidonya/ui/Cizimler";

export const metadata: Metadata = {
  title: "İletişim ve ziyaret",
  description: "Gelidonya fideliğini ve seralarını ziyaret edin: randevu, adres, telefon ve çalışma saatleri. Konsept çalışma.",
  alternates: { canonical: "/web/gelidonya/iletisim/" },
};

// Different from the other inner pages on purpose: the page opens as a split
// (contact facts beside the view a visitor gets of the nursery), and the
// booking form follows in a single narrow column.
export default function IletisimPage() {
  const p = tr.iletisim;
  const b = tr.brand;
  const c = tr.contact;
  return (
    <>
      <section className="gd-visit" aria-labelledby="gd-visit-title">
        <div className="gd-visit-text">
          <h1 id="gd-visit-title" className="gd-h1">
            {p.title}
          </h1>
          <p className="gd-lead">{p.lead}</p>
          <dl className="gd-visit-facts">
            <div>
              <dt>{p.callTitle}</dt>
              <dd>
                <a href={b.phoneHref} className="gd-contact-big gd-tnum">
                  {b.phone}
                </a>
                <span className="gd-muted">
                  {p.callText} [{b.phoneNote}]
                </span>
              </dd>
            </div>
            <div>
              <dt>{p.addressTitle}</dt>
              <dd>
                <address className="gd-addr">
                  {c.address.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </address>
                <a href={c.mapsHref} target="_blank" rel="noopener noreferrer" className="gd-link">
                  {p.mapLink}
                  <span className="gd-sr"> {p.newTab}</span>
                </a>
              </dd>
            </div>
            <div>
              <dt>{p.hoursTitle}</dt>
              <dd>
                {c.hours.map((h) => (
                  <span key={h}>{h}</span>
                ))}
                <span>
                  {b.email} <span className="gd-muted">[{b.emailNote}]</span>
                </span>
              </dd>
            </div>
          </dl>
        </div>
        <Resim k="ziyaret" className="gd-visit-img" alt={p.imageAlt} sizes="(max-width: 899px) 100vw, 52vw" priority />
      </section>
      <section className="gd-block gd-block--white" aria-label={p.formTitle}>
        <div className="gd-wrap gd-visit-grid">
          <div className="gd-visit-form">
            <RandevuFormu />
          </div>
          <aside className="gd-visit-side" aria-labelledby="gd-map-title">
            <h2 id="gd-map-title" className="gd-h3">
              {p.mapTitle}
            </h2>
            <figure className="gd-figure gd-map">
              <HaritaKesiti />
            </figure>
            <p>{p.mapText}</p>
            <p className="gd-demo">{p.mapNote}</p>
            <div className="gd-bigphone">
              <p>{p.bigPhoneTitle}</p>
              <a href={b.phoneHref} className="gd-bigphone-n gd-tnum">
                {b.phone}
              </a>
              <span className="gd-muted">[{b.phoneNote}]</span>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
