import type { Metadata } from "next";
import { tr } from "@/content/revak/tr";
import { okulumuz as o } from "@/content/revak/okul";
import { Crumb, CtaBand } from "@/components/revak/ui/Bits";
import { Photo } from "@/components/revak/ui/Photo";
import { ArchParts } from "@/components/revak/okul/ArchParts";

export const metadata: Metadata = { title: o.metaTitle, robots: { index: false, follow: false } };

// The school's own page: a wide render opening, the arch as a diagram of how the
// school holds together, the values as a lintel inscription, roles instead of faces.
export default function OkulumuzPage() {
  return (
    <>
      <section className="rv-ok-head" aria-labelledby="rv-ok-title">
        <div className="rv-wrap">
          <Crumb current={o.crumb} />
          <h1 className="rv-display rv-ok-title" id="rv-ok-title">
            {o.title}
          </h1>
        </div>
        <div className="rv-ok-band">
          <Photo k="revakWide" priority sizes="100vw" />
          <div className="rv-wrap">
            <p className="rv-ok-intro">{o.intro}</p>
          </div>
        </div>
      </section>

      <section className="rv-section rv-ok-arch" aria-labelledby="rv-ok-arch">
        <div className="rv-wrap rv-ok-arch-grid">
          <div>
            <h2 className="rv-h2" id="rv-ok-arch">
              {o.archTitle}
            </h2>
            <p className="rv-kd-intro">{o.archIntro}</p>
          </div>
          <ArchParts parts={o.parts} label={o.archLabel} />
        </div>
      </section>

      {/* The values as a lintel inscription, one line each */}
      <section className="rv-ok-lintel" aria-labelledby="rv-ok-values">
        <div className="rv-wrap">
          <h2 className="rv-ok-lintel-title" id="rv-ok-values">
            {o.valuesTitle}
          </h2>
          <ul>
            {o.values.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rv-section rv-ok-org" id="yonetim" aria-labelledby="rv-ok-org">
        <div className="rv-wrap">
          <div className="rv-kd-guide-head">
            <h2 className="rv-h2" id="rv-ok-org">
              {o.orgTitle}
            </h2>
            <p className="rv-kd-intro">{o.orgIntro}</p>
          </div>
          <div className="rv-org">
            <div className="rv-org-spine">
              <div className="rv-org-box rv-org-box--top">
                <strong>{o.org.top.name}</strong>
                <span>{o.org.top.text}</span>
              </div>
              <div className="rv-org-box rv-org-box--head">
                <strong>{o.org.head.name}</strong>
                <span>{o.org.head.text}</span>
              </div>
              <div className="rv-org-box rv-org-box--side">
                <strong>{o.org.parents.name}</strong>
                <span>{o.org.parents.text}</span>
              </div>
            </div>
            <ul className="rv-org-row">
              {o.org.rows.map((r) => (
                <li key={r.name} className="rv-org-box">
                  <strong>{r.name}</strong>
                  <span>{r.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="rv-h3 rv-ok-account-title">{o.accountTitle}</h3>
          <dl className="rv-ok-account">
            {o.account.map((a) => (
              <div key={a.name}>
                <dt>{a.name}</dt>
                <dd>{a.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand
        id="rv-ok-cta"
        title={o.closing.title}
        text={o.closing.text}
        primary={{ href: "/revak/kabul/kampus-turu/", label: tr.hero.secondary }}
        secondary={{ href: "/revak/egitim/", label: tr.nav.groups[1].items[0].label }}
      />
    </>
  );
}
