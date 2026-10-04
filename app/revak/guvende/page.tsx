import type { Metadata } from "next";
import Link from "next/link";
import { tr } from "@/content/revak/tr";
import { guvende as g } from "@/content/revak/guvende";
import { Crumb, CtaBand, Ledger, Sample } from "@/components/revak/ui/Bits";
import { Scenarios } from "@/components/revak/guvende/Scenarios";

export const metadata: Metadata = { title: g.metaTitle, robots: { index: false, follow: false } };

// A quiet page: a sticky index on the left, airy sections on the right.
// The arcade's meaning (a sheltered walk) turned into text.
export default function GuvendePage() {
  return (
    <>
      <section className="rv-pagehead rv-gv-head" aria-labelledby="rv-gv-title">
        <div className="rv-wrap">
          <Crumb trail={[{ href: "/revak/okulumuz/", label: tr.nav.groups[0].label }]} current={g.crumb} />
          <div className="rv-pagehead-grid">
            <h1 className="rv-display rv-gv-title" id="rv-gv-title">
              {g.title}
            </h1>
            <p className="rv-lede">{g.intro}</p>
          </div>
        </div>
      </section>

      <div className="rv-wrap rv-gv-grid">
        <nav className="rv-gv-index" aria-label={g.indexLabel}>
          <p>{g.indexLabel}</p>
          <ol>
            {g.index.map((x) => (
              <li key={x.id}>
                <a href={`#${x.id}`}>{x.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="rv-gv-body">
          <section className="rv-gv-sec" id="olursa" aria-labelledby="rv-gv-s">
            <h2 className="rv-h2" id="rv-gv-s">
              {g.scenariosTitle}
            </h2>
            <p className="rv-kd-intro">{g.scenariosIntro}</p>
            <Scenarios items={g.scenarios} label={g.scenariosLabel} />
          </section>

          <section className="rv-gv-sec" id="rehberlik" aria-labelledby="rv-gv-r">
            <h2 className="rv-h2" id="rv-gv-r">
              {g.guidanceTitle}
            </h2>
            <p className="rv-kd-intro">{g.guidanceIntro}</p>
            <dl className="rv-gv-levels">
              {g.guidance.map((x) => (
                <div key={x.level}>
                  <dt>{x.level}</dt>
                  <dd>{x.text}</dd>
                </div>
              ))}
            </dl>
            <h3 className="rv-h3 rv-gv-sub">{g.bullyingTitle}</h3>
            <ul className="rv-gv-list">
              {g.bullying.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <Link href="/revak/almanak/" className="rv-textlink">
              {g.seminarsLink}
            </Link>
          </section>

          <section className="rv-gv-sec" id="koruma" aria-labelledby="rv-gv-k">
            <h2 className="rv-h2" id="rv-gv-k">
              {g.protectionTitle}
            </h2>
            <p className="rv-kd-intro">{g.protectionIntro}</p>
            <div className="rv-gv-two">
              <div>
                <h3 className="rv-h3 rv-gv-sub">{g.protectionStepsTitle}</h3>
                <ol className="rv-gv-steps">
                  {g.protectionSteps.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="rv-h3 rv-gv-sub">{g.protectionRulesTitle}</h3>
                <ul className="rv-gv-list">
                  {g.protectionRules.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="rv-gv-sec" id="saglik" aria-labelledby="rv-gv-h">
            <div className="rv-gv-sechead">
              <h2 className="rv-h2" id="rv-gv-h">
                {g.healthTitle}
              </h2>
              <Sample>{tr.sample.policy}</Sample>
            </div>
            <p className="rv-kd-intro">{g.healthIntro}</p>
            <Ledger head={g.healthHead} rows={g.health} caption={g.healthTitle} className="rv-ledger--two" />
          </section>

          <section className="rv-gv-sec" id="acil" aria-labelledby="rv-gv-a">
            <h2 className="rv-h2" id="rv-gv-a">
              {g.safetyTitle}
            </h2>
            <p className="rv-kd-intro">{g.safetyIntro}</p>
            <dl className="rv-gv-safety">
              {g.safety.map((x) => (
                <div key={x.title}>
                  <dt>{x.title}</dt>
                  <dd>{x.text}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <CtaBand
        id="rv-gv-cta"
        title={g.closing.title}
        text={g.closing.text}
        primary={{ href: "/revak/kabul/kampus-turu/?tur=yerinde", label: tr.hero.secondary }}
        secondary={{ href: "/revak/iletisim/", label: tr.nav.groups[5].label }}
      />
    </>
  );
}
