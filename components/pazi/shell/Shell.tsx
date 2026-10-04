import Link from "next/link";
import { tr } from "@/content/pazi/tr";
import { Mark, Wordmark } from "../ui/Mark";
import { MobileMenu } from "./MobileMenu";

export function ConceptStrip() {
  const c = tr.concept;
  return (
    <div className="pz-strip">
      <p>
        {c.text}{" "}
        <span className="pz-strip-by">
          {c.by}{" "}
          <a href={c.href} rel="author">
            {c.author}
          </a>
        </span>
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
        <nav className="pz-nav" aria-label={n.label}>
          <ul>
            {n.items.map((i) => (
              <li key={i.href}>
                <Link href={i.href}>{i.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/pazi/fizibilite/" className="pz-btn pz-btn-primary pz-header-cta">
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
  return (
    <footer className="pz-footer">
      <div className="pz-footer-tape" aria-hidden="true" />
      <div className="pz-wrap pz-footer-in">
        <div className="pz-footer-lead">
          <p className="pz-footer-title">{f.title}</p>
          <Link href="/pazi/fizibilite/" className="pz-btn pz-btn-primary">
            {tr.nav.cta}
          </Link>
        </div>
        <div className="pz-footer-cols">
          <div>
            <h2>{f.contact}</h2>
            <p>
              <a href={`mailto:${b.email}`}>{b.email}</a>
            </p>
            <address>
              {tr.trial.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
          </div>
          <div>
            <h2>{f.pages}</h2>
            <ul>
              {f.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/pazi/kaynaklar/">{f.credits}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>{tr.story.title}</h2>
            <p className="pz-footer-meaning">{b.meaning}</p>
            <p>{tr.story.text.join(" ")}</p>
          </div>
        </div>
        <div className="pz-footer-base">
          <div className="pz-footer-brand">
            <Mark size={28} />
            <Wordmark />
          </div>
          <p>{f.concept}</p>
          <p>{f.privacy}</p>
        </div>
      </div>
    </footer>
  );
}
