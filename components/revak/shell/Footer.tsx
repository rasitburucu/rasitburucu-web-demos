import Link from "next/link";
import { tr } from "@/content/revak/tr";
import { credits } from "@/content/revak/credits";
import { Mark } from "../ui/Icon";
import { KvkkLink } from "../ui/Drawer";

const f = tr.footer;
const c = tr.contact;

export function Footer() {
  const photos = credits.filter((x) => x.group === "photo");
  return (
    <footer className="rv-footer" id="iletisim">
      <div className="rv-wrap">
        <div className="rv-footer-top">
          <div className="rv-footer-brand">
            <Mark size={44} />
            <p className="rv-footer-name">{tr.brand.full}</p>
          </div>

          <div className="rv-footer-col">
            <h2>{f.contactTitle}</h2>
            <address>
              {c.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p>
              <a href={c.phoneHref}>{c.phone}</a>
              <br />
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </p>
            <p className="rv-footer-muted">{c.hours}</p>
            <p className="rv-footer-links">
              <Link href="/revak/iletisim/" className="rv-footer-link">
                {f.contactPage}
              </Link>
              <a href={c.mapsHref} target="_blank" rel="noopener noreferrer" className="rv-footer-link">
                {f.directions}
              </a>
            </p>
          </div>

          <div className="rv-footer-col">
            <h2>{f.linksTitle}</h2>
            <ul>
              {f.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
              <li>
                <KvkkLink className="rv-footer-btnlink" />
              </li>
            </ul>
          </div>

          <div className="rv-footer-col">
            <h2>{f.parentsTitle}</h2>
            <ul>
              {f.parentLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rv-footer-base">
          <p className="rv-footer-note">{f.note}</p>
          <details className="rv-credits">
            <summary>{f.creditsTitle}</summary>
            <p>{f.renders}</p>
            <p>{f.creditsLead}</p>
            <ul>
              {photos.map((p) => (
                <li key={p.url}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    {p.author}
                  </a>{" "}
                  <span>({p.use})</span>
                </li>
              ))}
            </ul>
            <p>{f.fonts}</p>
          </details>
          <p className="rv-footer-muted">{f.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

export function Strip() {
  return (
    <div className="rv-strip">
      <p className="rv-strip-full">
        {tr.strip.text} <a href={tr.strip.href}>{tr.strip.link}</a>
      </p>
      {/* phones: one short line; the full sentence is the footer note */}
      <p className="rv-strip-short">
        <a href={tr.strip.href}>{tr.strip.short}</a>
      </p>
    </div>
  );
}
