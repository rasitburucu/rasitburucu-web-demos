import Link from "next/link";
import { navPages, tr } from "@/content/pazi/tr";
import { Mark, Wordmark } from "../ui/Mark";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";

export function ConceptStrip() {
  const s = tr.strip;
  return (
    <div className="pz-strip">
      <p>
        {s.text}{" "}
        <a href={s.href} rel="author">
          {s.link}
        </a>
      </p>
    </div>
  );
}

export function Header() {
  const n = tr.nav;
  return (
    <header className="pz-header">
      <div className="pz-header-in">
        <Link href="/pazi/" className="pz-brand" aria-label={n.home}>
          <Mark size={34} />
          <Wordmark />
        </Link>
        <DesktopNav />
        <Link href={n.ctaHref} className="pz-btn pz-btn-primary pz-header-cta">
          {n.cta}
        </Link>
        <MobileMenu />
      </div>
    </header>
  );
}

export function Footer() {
  const f = tr.footer;
  const b = tr.brand;
  const t = tr.trial;
  const k = f.kunye;
  return (
    <footer className="pz-footer">
      <div className="pz-footer-tape" aria-hidden="true" />
      <div className="pz-wrap pz-footer-in">
        <div className="pz-footer-lead">
          <p className="pz-footer-title">{f.title}</p>
          <Link href={tr.nav.ctaHref} className="pz-btn pz-btn-primary">
            {tr.nav.cta}
          </Link>
        </div>
        <div className="pz-footer-cols">
          <div className="pz-footer-brandcol">
            <div className="pz-footer-brand">
              <Mark size={28} />
              <Wordmark />
            </div>
            <p>{b.city}</p>
          </div>
          <div>
            <h2>{f.visit}</h2>
            <address>
              {t.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p>{t.hours}</p>
            <p>
              <a href={t.mapsHref} target="_blank" rel="noopener noreferrer">
                {t.directions}
                <span className="pz-sr"> (yeni sekmede açılır)</span>
              </a>
            </p>
          </div>
          <div>
            <h2>{f.contact}</h2>
            <p>
              <a href={b.phoneHref}>{b.phone}</a>
              <br />
              <a href={`mailto:${b.email}`}>{b.email}</a>
            </p>
          </div>
          <div>
            <h2>{f.pages}</h2>
            <ul>
              {navPages.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pz-footer-base">
          <p className="pz-footer-note">{f.note}</p>
          <details className="pz-kunye">
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
          <p className="pz-footer-copy">{f.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
