import { tr } from "@/content/pazi/tr";
import { Workshop } from "./Workshop";

export function Trial() {
  const t = tr.trial;
  const mail = `mailto:${tr.brand.trialEmail}?subject=${encodeURIComponent(t.mailSubject)}&body=${encodeURIComponent(t.mailBody)}`;
  const labels = [t.labels.dock, t.labels.sample, t.labels.cell, t.labels.room];
  return (
    <section id={t.id} className="pz-trial" aria-labelledby="pz-trial-title">
      <div className="pz-wrap pz-trial-grid">
        <figure className="pz-trial-art">
          <Workshop label={t.drawing} />
          <figcaption>
            <ol className="pz-trial-legend">
              {labels.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ol>
          </figcaption>
        </figure>
        <div className="pz-trial-copy">
          <h2 id="pz-trial-title" className="pz-h2">
            {t.title}
          </h2>
          <p className="pz-lead">{t.lead}</p>
          <address className="pz-trial-addr">
            {t.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
            <span className="pz-mono">{t.hours}</span>
          </address>
          <div className="pz-trial-actions">
            <a href={mail} className="pz-btn pz-btn-primary">
              {t.cta}
            </a>
            <a href={t.mapsHref} className="pz-btn" target="_blank" rel="noopener noreferrer">
              {t.directions}
              <span className="pz-sr"> (yeni sekmede açılır)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Service() {
  const s = tr.service;
  return (
    <section id={s.id} className="pz-service" aria-labelledby="pz-service-title">
      <div className="pz-wrap pz-service-grid">
        <div>
          <h2 id="pz-service-title" className="pz-h2">
            {s.title}
          </h2>
          <p className="pz-lead">{s.lead}</p>
        </div>
        <ul className="pz-service-list">
          {s.items.map((i) => (
            <li key={i.title}>
              <h3 className="pz-h3">{i.title}</h3>
              <p>{i.text}</p>
              <p className="pz-service-tag pz-mono">{i.tag}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
