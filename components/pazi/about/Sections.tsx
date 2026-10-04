import Link from "next/link";
import { tr } from "@/content/pazi/tr";

/** "Nasıl çalışıyoruz": a spec-sheet table, the way the model sheets read. */
export function Principles() {
  const p = tr.about.principles;
  return (
    <section id={p.id} className="pz-pr" aria-labelledby="pz-pr-title">
      <div className="pz-wrap pz-pr-grid">
        <div className="pz-pr-copy">
          <h2 id="pz-pr-title" className="pz-h2">
            {p.title}
          </h2>
          <p className="pz-lead">{p.lead}</p>
        </div>
        <table className="pz-pr-sheet">
          <thead>
            <tr>
              <th scope="col">{p.head.what}</th>
              <th scope="col">{p.head.how}</th>
              <th scope="col">{p.head.when}</th>
            </tr>
          </thead>
          <tbody>
            {p.items.map((i) => (
              <tr key={i.title}>
                <th scope="row">{i.title}</th>
                <td>{i.text}</td>
                <td>
                  <span className="pz-pr-when pz-mono">{i.when}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Gebze workshop note with the two ways forward. */
export function WorkshopNote() {
  const w = tr.about.workshop;
  const t = tr.trial;
  const mail = `mailto:${tr.brand.trialEmail}?subject=${encodeURIComponent(t.mailSubject)}&body=${encodeURIComponent(t.mailBody)}`;
  return (
    <section id={w.id} className="pz-ws-note" aria-labelledby="pz-ws-title">
      <div className="pz-wrap pz-ws-grid">
        <div>
          <h2 id="pz-ws-title" className="pz-h2">
            {w.title}
          </h2>
          <p className="pz-lead">{w.text}</p>
        </div>
        <div className="pz-ws-side">
          <address className="pz-trial-addr">
            {t.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
            <span className="pz-mono">{t.hours}</span>
          </address>
          <div className="pz-trial-actions">
            <a href={mail} className="pz-btn pz-btn-primary">
              {w.cta}
            </a>
            <Link href="/pazi/fizibilite/" className="pz-btn">
              {w.flow}
            </Link>
          </div>
          <p className="pz-ws-flow">{w.flowLead}</p>
        </div>
      </div>
    </section>
  );
}
