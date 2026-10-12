import Link from "next/link";
import { sayfalar, tr } from "@/content/vaziyet/tr";

/** logo: a cork plot tile with the cobalt house standing on it */
export function Mark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true" className="vz-mark">
      <path d="M3 20 L15 26 L27 20 L15 14 Z" fill="#C89B68" />
      <path d="M3 20 L15 26 L15 27.6 L3 21.6 Z" fill="#9E7445" />
      <path d="M15 26 L27 20 L27 21.6 L15 27.6 Z" fill="#7A5530" />
      <path d="M9 17 L15 20 L21 17 L21 11.5 L15 8.5 L9 11.5 Z" fill="#3157D5" />
      <path d="M15 20 L21 17 L21 11.5 L15 14.5 Z" fill="#1B3790" />
      <path d="M9 11.5 L15 8.5 L21 11.5 L15 14.5 Z" fill="#5C7FF0" />
    </svg>
  );
}

export function Strip() {
  const s = tr.strip;
  return (
    <div className="vz-strip">
      <p>
        {s.text}{" "}
        <a href={s.href} rel="author">
          {s.link}
        </a>
      </p>
    </div>
  );
}

export function Ornek({ children }: { children?: React.ReactNode }) {
  return <span className="vz-ornek">{children ?? tr.ornek}</span>;
}

export function Footer() {
  const f = tr.footer;
  const b = tr.brand;
  const k = f.kunye;
  return (
    <footer className="vz-footer" data-vz-bar-hide>
      <div className="vz-wrap">
        <div className="vz-footer-cols">
          <div>
            <h2 className="vz-footer-h">{f.marka}</h2>
            <p className="vz-footer-word">
              <Mark size={28} />
              {b.ad}
            </p>
            <p>{b.satir}</p>
            <p className="vz-muted-m">{f.fabrika}</p>
          </div>
          <div>
            <h2 className="vz-footer-h">{f.ziyaret}</h2>
            <address>
              {f.adres.map((l) => (
                <span key={l}>{l}</span>
              ))}
              <span className="vz-muted-m">[{f.adresNot}]</span>
            </address>
            <p>
              {f.saat} <span className="vz-muted-m">[{tr.ornek}]</span>
            </p>
            <p>{f.randevu}</p>
          </div>
          <div>
            <h2 className="vz-footer-h">{f.iletisim}</h2>
            <p>
              <a href={b.phoneHref} className="vz-tnum">
                {b.phone}
              </a>{" "}
              <span className="vz-muted-m">[{b.phoneNote}]</span>
            </p>
            <p>
              {b.email} <span className="vz-muted-m">[{b.emailNote}]</span>
            </p>
          </div>
          <div>
            <h2 className="vz-footer-h">{f.sayfalar}</h2>
            <ul>
              {sayfalar.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="vz-footer-note">{f.note}</p>
        <details className="vz-kunye">
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
              <dt>{k.photos}</dt>
              <dd>{k.photosText}</dd>
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
        <p className="vz-footer-copy">{f.copyright}</p>
      </div>
    </footer>
  );
}
