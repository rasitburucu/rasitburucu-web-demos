import type { Metadata } from "next";
import Link from "next/link";
import { tr } from "@/content/revak/tr";
import { Photo } from "@/components/revak/ui/Photo";
import { DayTimeline, RouteCheck } from "@/components/revak/kampus/Interactive";

const k = tr.kampus;

export const metadata: Metadata = { title: k.metaTitle, robots: { index: false, follow: false } };

export default function KampusPage() {
  return (
    <>
      <section className="rv-pagehead" aria-labelledby="rv-kampus-title">
        <div className="rv-wrap">
          <nav className="rv-crumb" aria-label={tr.crumb}>
            <Link href="/revak/">{tr.brand.full}</Link> / {tr.nav.items[2].label}
          </nav>
          <div className="rv-pagehead-grid">
            <h1 className="rv-display" id="rv-kampus-title">
              {k.title}
            </h1>
            <p className="rv-lede">{k.intro}</p>
          </div>
        </div>
      </section>

      <div className="rv-wrap rv-kampus-hero">
        <Photo k="avlu" priority sizes="(max-width: 1400px) 100vw, 1300px" alt={k.heroAlt} />
      </div>

      <section className="rv-section rv-fac" aria-labelledby="rv-fac-title">
        <div className="rv-wrap">
          <h2 className="rv-h2" id="rv-fac-title">
            {k.facilitiesTitle}
          </h2>
          <ul className="rv-fac-list">
            {k.facilities.map((f) => (
              <li key={f.name} className="rv-fac-item">
                <Photo k={f.image} arch className="rv-parallax" sizes="(max-width: 520px) 92vw, (max-width: 860px) 46vw, 36vw" />
                <h3>{f.name}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <DayTimeline />

      <section className="rv-section rv-transport" id="servis" aria-labelledby="rv-transport-title">
        <div className="rv-wrap rv-transport-grid">
          <div>
            <h2 className="rv-h2" id="rv-transport-title">
              {k.transport.title}
            </h2>
            <p className="rv-lede">{k.transport.intro}</p>
          </div>
          <RouteCheck />
        </div>
      </section>

      <section className="rv-section rv-rule rv-care" id="guvenlik" aria-labelledby="rv-care-title">
        <div className="rv-wrap">
          <h2 className="rv-h2" id="rv-care-title">
            {k.care.title}
          </h2>
          <div className="rv-care-grid">
            <div className="rv-care-qa">
              {k.care.items.map((q) => (
                <div key={q.q}>
                  <h3>{q.q}</h3>
                  <p>{q.a}</p>
                </div>
              ))}
            </div>
            <div className="rv-menu-card">
              <h3>{k.care.menuTitle}</h3>
              <p>{k.care.menuNote}</p>
              <ul>
                {k.care.menu.map((m) => (
                  <li key={m.day}>
                    <strong>{m.day}</strong>
                    <span>{m.dish}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="rv-section rv-ink rv-on-ink" aria-labelledby="rv-kampus-cta">
        <div className="rv-wrap rv-cta-band">
          <div>
            <h2 className="rv-h2" id="rv-kampus-cta">
              {k.closing.title}
            </h2>
            <p>{k.closing.text}</p>
          </div>
          <div className="rv-actions">
            <Link href="/revak/kabul/kampus-turu/" className="rv-btn rv-btn--seal">
              {tr.hero.secondary}
            </Link>
            <Link href="/revak/kabul/on-kayit/" className="rv-btn rv-btn--line">
              {tr.hero.primary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
