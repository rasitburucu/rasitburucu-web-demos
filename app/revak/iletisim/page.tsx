import type { Metadata } from "next";
import Link from "next/link";
import { tr } from "@/content/revak/tr";
import { iletisim as t } from "@/content/revak/okul";
import { Crumb, CtaBand, Sample } from "@/components/revak/ui/Bits";
import { Icon } from "@/components/revak/ui/Icon";

export const metadata: Metadata = { title: t.metaTitle, robots: { index: false, follow: false } };

/** A drawn location sketch (not a map): road, village, forest edge, the school's arch. */
function Sketch() {
  const L = t.mapLabels;
  return (
    <svg className="rv-sketch" viewBox="0 0 520 380" role="img" aria-label={t.mapAlt}>
      <g className="rv-sketch-forest">
        {Array.from({ length: 46 }, (_, i) => {
          const x = 18 + ((i * 53) % 230);
          const y = 30 + ((i * 37) % 150);
          return <circle key={i} cx={x} cy={y} r={9 + (i % 4) * 2} />;
        })}
      </g>
      <path className="rv-sketch-sea" d="M300 0 Q360 22 420 12 T520 18" />
      <path className="rv-sketch-road" d="M470 380 C430 300 400 250 330 210 S220 150 160 40" />
      <path className="rv-sketch-lane" d="M330 210 C310 240 290 260 262 276" />
      <circle className="rv-sketch-village" cx="352" cy="232" r="26" />
      <g transform="translate(250 288)" className="rv-sketch-school">
        <path d="M-14 0 V-19 A14 14 0 0 1 14 -19 V0 H8 V-18 A8 8 0 0 0 -8 -18 V0 Z" />
      </g>
      <g className="rv-sketch-metro" transform="translate(470 352)">
        <rect x="-11" y="-11" width="22" height="22" rx="2" />
        <text y="5" textAnchor="middle">M</text>
      </g>
      <g className="rv-sketch-label">
        <text x="60" y="210">{L.forest}</text>
        <text x="400" y="40" textAnchor="middle">{L.sea}</text>
        <text x="352" y="276" textAnchor="middle">{L.village}</text>
        <text x="250" y="312" textAnchor="middle" className="rv-sketch-label--school">{L.school}</text>
        <text x="455" y="330" textAnchor="end">{L.metro}</text>
        <text x="300" y="160" transform="rotate(-38 300 160)" textAnchor="middle">{L.road}</text>
      </g>
    </svg>
  );
}

export default function IletisimPage() {
  const c = tr.contact;
  return (
    <>
      <section className="rv-pagehead" aria-labelledby="rv-il-title">
        <div className="rv-wrap">
          <Crumb current={t.crumb} />
          <div className="rv-pagehead-grid">
            <h1 className="rv-display" id="rv-il-title">
              {t.title}
            </h1>
            <p className="rv-lede">{t.intro}</p>
          </div>
        </div>
      </section>

      {/* The register of units: who to call for what */}
      <section className="rv-section rv-tight-top" aria-labelledby="rv-il-units">
        <div className="rv-wrap">
          <div className="rv-il-unitshead">
            <h2 className="rv-h3" id="rv-il-units">
              {t.unitsTitle}
            </h2>
            <Sample>{tr.sample.contact}</Sample>
          </div>
          <ul className="rv-units">
            {t.units.map((u) => (
              <li key={u.name}>
                <h3>{u.name}</h3>
                <p className="rv-units-for">{u.for}</p>
                <p className="rv-units-reach">
                  <a href={`tel:${u.tel}`}>
                    <Icon name="phone" size={16} />
                    {u.phone}
                  </a>
                  <a href={`mailto:${u.email}`}>{u.email}</a>
                </p>
                <p className="rv-units-hours">{u.hours}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rv-section rv-rule" aria-labelledby="rv-il-ways">
        <div className="rv-wrap rv-il-grid">
          <figure className="rv-il-map">
            <Sketch />
            <figcaption>
              <address>
                {c.address.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </address>
              <a href={c.mapsHref} target="_blank" rel="noopener noreferrer" className="rv-textlink">
                <Icon name="pin" size={18} />
                {t.mapLink}
              </a>
            </figcaption>
          </figure>
          <div>
            <h2 className="rv-h2" id="rv-il-ways">
              {t.waysTitle}
            </h2>
            <dl className="rv-il-ways">
              {t.ways.map((w) => (
                <div key={w.title}>
                  <dt>{w.title}</dt>
                  <dd>{w.text}</dd>
                </div>
              ))}
            </dl>
            <Link href="/revak/kampus/#servis" className="rv-textlink">
              {t.servisLink}
              <Icon name="arrow" size={18} />
            </Link>
            <h3 className="rv-h3 rv-il-hours-title">{t.hoursTitle}</h3>
            <dl className="rv-il-hours">
              {t.hours.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <CtaBand
        id="rv-il-cta"
        title={t.closing.title}
        text={t.closing.text}
        primary={{ href: "/revak/kabul/kampus-turu/", label: tr.hero.secondary }}
        secondary={{ href: "/revak/kabul/on-kayit/", label: tr.hero.primary }}
      />
    </>
  );
}
