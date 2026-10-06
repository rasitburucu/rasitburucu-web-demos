import Link from "next/link";
import { navPages, tr } from "@/content/gelidonya/tr";

export function Strip() {
  const s = tr.strip;
  return (
    <div className="gd-strip">
      <p>
        {s.text}{" "}
        <a href={s.href} rel="author">
          {s.link}
        </a>
      </p>
    </div>
  );
}

export function Wordmark() {
  return <span className="gd-word">{tr.brand.word}</span>;
}

export function Footer() {
  const f = tr.footer;
  const b = tr.brand;
  const c = tr.contact;
  const k = f.kunye;
  return (
    <footer className="gd-footer" data-gd-bar-hide>
      <div className="gd-wrap">
        <div className="gd-footer-cols">
          <div>
            <h2 className="gd-footer-word">
              <Wordmark />
            </h2>
            <p>{b.line}</p>
          </div>
          <div>
            <h2>{f.visit}</h2>
            <address>
              {c.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            {c.hours.map((h) => (
              <p key={h}>{h}</p>
            ))}
            <p>
              <Link href={`${tr.base}/iletisim/#harita`}>{tr.ziyaret.map}</Link>
            </p>
          </div>
          <div>
            <h2>{f.contact}</h2>
            <p>
              <a href={b.phoneHref} className="gd-tnum">
                {b.phone}
              </a>{" "}
              <span className="gd-muted">[{b.phoneNote}]</span>
            </p>
            <p>
              {b.email} <span className="gd-muted">[{b.emailNote}]</span>
            </p>
          </div>
          <div>
            <h2>{f.pages}</h2>
            <ul>
              {navPages.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="gd-footer-belge">{f.belge}</p>
        <p className="gd-footer-note">{f.note}</p>
        <details className="gd-kunye">
          <summary>{k.title}</summary>
          <dl>
            <div>
              <dt>{k.design}</dt>
              <dd>
                <a href={k.designHref}>{k.designBy}</a>
              </dd>
            </div>
            <div>
              <dt>{k.three}</dt>
              <dd>{k.threeText}</dd>
            </div>
            <div>
              <dt>{k.maps}</dt>
              <dd>{k.mapsText}</dd>
            </div>
            <div>
              <dt>{k.fonts}</dt>
              <dd>{k.fontsText}</dd>
            </div>
            <div>
              <dt>{k.year}</dt>
              <dd>{k.yearText}</dd>
            </div>
          </dl>
        </details>
        <p className="gd-footer-copy">{f.copyright}</p>
      </div>
    </footer>
  );
}
