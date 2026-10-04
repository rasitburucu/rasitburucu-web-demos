import type { Metadata } from "next";
import Link from "next/link";
import { tr } from "@/content/revak/tr";
import { egitim as e } from "@/content/revak/egitim";
import { kademeler } from "@/content/revak/kademe";
import { KADEMELER } from "@/lib/revak/levels";
import { Crumb, CtaBand, Ledger, Sample } from "@/components/revak/ui/Bits";
import { Photo } from "@/components/revak/ui/Photo";
import { Icon } from "@/components/revak/ui/Icon";

export const metadata: Metadata = { title: e.metaTitle, robots: { index: false, follow: false } };

const ROMAN = ["I", "II", "III", "IV"];

export default function EgitimPage() {
  const r = e.report;
  return (
    <>
      {/* 1. Head: the claim of the page, and the four levels as four arches in their hours */}
      <section className="rv-pagehead rv-eg-head" aria-labelledby="rv-eg-title">
        <div className="rv-wrap">
          <Crumb current={e.crumb} />
          <div className="rv-pagehead-grid">
            <h1 className="rv-display" id="rv-eg-title">
              {e.title}
            </h1>
            <p className="rv-lede">{e.intro}</p>
          </div>
          <nav className="rv-eg-levels" aria-label={e.levelsTitle}>
            <ol>
              {KADEMELER.map((k, i) => {
                const l = tr.levels.items[k];
                const kc = kademeler[k];
                return (
                  <li key={k} style={{ "--sun": kc.sun } as React.CSSProperties}>
                    <Link href={`/revak/egitim/${k}/`}>
                      <span className="rv-eg-arch">
                        <Photo k={l.image} arch sizes="(max-width: 860px) 40vw, 18vw" alt="" />
                      </span>
                      <span className="rv-eg-level-meta">
                        <span className="rv-num">{ROMAN[i]}</span>
                        <span>
                          {kc.hour} {kc.hourName}
                        </span>
                      </span>
                      <strong>{l.name}</strong>
                      <span className="rv-eg-range">{l.range}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
            <p className="rv-eg-levels-note">{e.levelsNote}</p>
          </nav>
        </div>
      </section>

      {/* 2. Principles: inscriptions cut in stone, the practice written underneath in ink */}
      <section className="rv-section rv-rule rv-eg-principles" aria-labelledby="rv-eg-pr">
        <div className="rv-wrap">
          <h2 className="rv-h2" id="rv-eg-pr">
            {e.principlesTitle}
          </h2>
          <ol className="rv-kitabe">
            {e.principles.map((p) => (
              <li key={p.line}>
                <p className="rv-kitabe-line">{p.line}</p>
                <p className="rv-kitabe-practice">{p.practice}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. Measurement: a year as an almanac chart, months across */}
      <section className="rv-section rv-ink rv-on-ink rv-eg-measure" id="olcme" aria-labelledby="rv-eg-me">
        <div className="rv-wrap">
          <div className="rv-eg-measure-head">
            <h2 className="rv-h2" id="rv-eg-me">
              {e.measureTitle}
            </h2>
            <p>{e.measureIntro}</p>
          </div>
          <div className="rv-yearchart" role="table" aria-label={e.measureTitle}>
            <div className="rv-yearchart-row rv-yearchart-months" role="row">
              <span role="columnheader">
                <span className="rv-sr">{e.measureTitle}</span>
              </span>
              {e.months.map((m, i) => (
                <span key={m} role="columnheader" aria-label={e.monthsLong[i]}>
                  {m}
                </span>
              ))}
            </div>
            {e.measure.map((m) => (
              <div key={m.name} className="rv-yearchart-row" role="row">
                <div className="rv-yearchart-name" role="rowheader">
                  <strong>{m.name}</strong>
                  <span>{m.text}</span>
                  <span className="rv-yearchart-levels">
                    <span className="rv-sr">{e.measureLevelsLabel}: </span>
                    {m.levels.map((k) => tr.levels.items[k].name).join(", ")}
                  </span>
                </div>
                {e.months.map((mo, i) => (
                  <span key={mo} role="cell" className={m.months.includes(i) ? "is-on" : undefined}>
                    {m.months.includes(i) ? <span className="rv-sr">{e.monthsLong[i]}</span> : null}
                  </span>
                ))}
                <p className="rv-yearchart-m" aria-hidden="true">
                  {m.months.map((i) => e.monthsLong[i]).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. A development report, folded like a letter */}
      <section className="rv-section rv-eg-report" id="rapor" aria-labelledby="rv-eg-rep">
        <div className="rv-wrap rv-eg-report-grid">
          <div>
            <h2 className="rv-h2" id="rv-eg-rep">
              {e.reportTitle}
            </h2>
            <p className="rv-kd-intro">{e.reportIntro}</p>
            <h3 className="rv-h3 rv-eg-inform-title">{e.informTitle}</h3>
            <dl className="rv-eg-inform">
              {e.inform.map((x) => (
                <div key={x.when}>
                  <dt>{x.when}</dt>
                  <dd>{x.text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <details className="rv-report">
            <summary>
              <div className="rv-report-top">
                <p className="rv-report-school">{r.school}</p>
                <span className="rv-report-toggle">
                  <span className="rv-report-open">{e.reportOpen}</span>
                  <span className="rv-report-close">{e.reportClose}</span>
                  <Icon name="chevron" size={18} />
                </span>
              </div>
              <div className="rv-report-who">
                <span>{r.student}</span>
                <span>{r.grade}</span>
                <span>{r.term}</span>
                <Sample>{tr.sample.report}</Sample>
              </div>
              <div className="rv-report-row rv-report-row--first">
                <strong>{r.rows[0][0]}</strong>
                <span>{r.rows[0][1]}</span>
                <em>{r.rows[0][2]}</em>
              </div>
            </summary>
            <div className="rv-report-body">
              {r.rows.slice(1).map((row) => (
                <div key={row[0]} className="rv-report-row">
                  <strong>{row[0]}</strong>
                  <span>{row[1]}</span>
                  <em>{row[2]}</em>
                </div>
              ))}
              <div className="rv-report-self">
                <p>{r.selfTitle}</p>
                <blockquote>{r.self}</blockquote>
              </div>
              <div className="rv-report-sign">
                <span>{r.sign}</span>
                <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true" focusable="false">
                  <circle cx="32" cy="32" r="28" />
                  <circle cx="32" cy="32" r="21" />
                  <path d="M25 40V28a7 7 0 0 1 14 0v12" />
                </svg>
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* 5. Homework and screens, per level */}
      <section className="rv-section rv-rule" aria-labelledby="rv-eg-hw">
        <div className="rv-wrap rv-kd-split">
          <div className="rv-kd-split-head">
            <h2 className="rv-h2" id="rv-eg-hw">
              {e.homeworkTitle}
            </h2>
            <p className="rv-kd-intro">{e.homeworkIntro}</p>
          </div>
          <div>
            <div className="rv-kd-tablehead">
              <Sample>{tr.sample.policy}</Sample>
            </div>
            <Ledger head={e.homeworkHead} rows={e.homework} caption={e.homeworkTitle} />
          </div>
        </div>
      </section>

      <CtaBand
        id="rv-eg-cta"
        title={e.closing.title}
        text={e.closing.text}
        primary={{ href: "/revak/kabul/kampus-turu/?tur=yerinde", label: tr.hero.secondary }}
        secondary={{ href: "/revak/kabul/on-kayit/", label: tr.hero.primary }}
      />
    </>
  );
}
