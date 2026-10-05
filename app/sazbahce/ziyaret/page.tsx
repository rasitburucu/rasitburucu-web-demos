import type { Metadata } from "next";
import { tr } from "@/content/sazbahce/tr";
import { Photo } from "@/components/sazbahce/ui/Photo";
import { Appointment, RegionMap } from "@/components/sazbahce/pages/Visit";

export const metadata: Metadata = {
  title: tr.meta.visitTitle,
  description: tr.meta.visitDescription,
  robots: { index: false, follow: false },
};

const v = tr.visitPage;

export default function VisitPage() {
  return (
    <div className="sb-page">
      <header className="sb-wrap sb-page-head">
        <h1 className="sb-h1">{v.title}</h1>
        <p className="sb-lede">{v.lead}</p>
      </header>

      <section className="sb-wrap sb-section sb-visit" aria-labelledby="sb-ways-h">
        <figure className="sb-visit-map">
          <RegionMap />
          <figcaption className="sb-sample">{v.mapNote}</figcaption>
        </figure>
        <div>
          <h2 id="sb-ways-h" className="sb-h3">
            {v.waysTitle}
          </h2>
          <dl className="sb-ways">
            {v.ways.map((w) => (
              <div key={w.t}>
                <dt>{w.t}</dt>
                <dd>{w.d}</dd>
              </div>
            ))}
          </dl>
          <p className="sb-sample">{v.distanceNote}</p>
          <p>
            <a href={tr.contact.mapsHref} target="_blank" rel="noopener noreferrer" className="sb-link">
              {tr.contact.directions}
            </a>
          </p>
        </div>
      </section>

      <section className="sb-section sb-visit-band" aria-labelledby="sb-appt-h">
        <div className="sb-wrap sb-visit-appt">
          <div className="sb-visit-photos">
            <Photo k="sazlik" sizes="(max-width: 899px) 100vw, 40vw" />
            <Photo k="liman" sizes="(max-width: 899px) 50vw, 20vw" />
          </div>
          <div>
            <h2 id="sb-appt-h" className="sb-h2">
              {v.appointmentTitle}
            </h2>
            <p className="sb-lede">{v.appointmentSub}</p>
            <p className="sb-sample">{v.hours}</p>
            <Appointment />
          </div>
        </div>
      </section>
    </div>
  );
}
