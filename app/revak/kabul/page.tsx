import type { Metadata } from "next";
import Link from "next/link";
import { tr } from "@/content/revak/tr";
import { belgeler, ilkGun, ucretEk, yas } from "@/content/revak/kabul-ek";
import { Photo } from "@/components/revak/ui/Photo";
import { Faq } from "@/components/revak/ui/Faq";
import { Crumb, Sample } from "@/components/revak/ui/Bits";
import { Icon } from "@/components/revak/ui/Icon";
import { ExamCountdown, SampleQuestions, SessionList } from "@/components/revak/kabul/Interactive";
import { AgeCalc, Documents, Gozlem } from "@/components/revak/kabul/Extra";

const k = tr.kabul;

export const metadata: Metadata = { title: k.metaTitle, robots: { index: false, follow: false } };

export default function KabulPage() {
  const faqGroups = tr.faq.groups.filter((g) => g.title === "Kabul" || g.title === "Ücret ve burs");
  return (
    <>
      <section className="rv-pagehead" aria-labelledby="rv-kabul-title">
        <div className="rv-wrap">
          <Crumb current={tr.nav.groups[3].label} />
          <div className="rv-pagehead-grid">
            <h1 className="rv-display" id="rv-kabul-title">
              {k.title}
            </h1>
            <div className="rv-kabul-headside">
              <Photo k="kabul" arch priority sizes="(max-width: 860px) 60vw, 26vw" className="rv-kabul-arch" />
              <p className="rv-lede">{k.intro}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Four paths, as a numbered-free list of rows */}
      <section className="rv-section rv-tight-top" aria-labelledby="rv-paths-title">
        <div className="rv-wrap">
          <h2 className="rv-sr" id="rv-paths-title">
            {k.pathsTitle}
          </h2>
          <ul className="rv-paths">
            {k.paths.map((p) => (
              <li key={p.id}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <Link href={p.href} className={p.id === "on-kayit" ? "rv-btn rv-btn--seal" : "rv-btn rv-btn--line"}>
                  {p.cta}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Which class? The enrolment-age rule, applied to one child */}
      <section className="rv-section rv-rule rv-yas" id="yas" aria-labelledby="rv-yas-title">
        <div className="rv-wrap">
          <div className="rv-yas-head">
            <h2 className="rv-h2" id="rv-yas-title">
              {yas.title}
            </h2>
            <p className="rv-kd-intro">{yas.intro}</p>
          </div>
          <AgeCalc />
        </div>
      </section>

      {/* The process really is a sequence, so it is numbered */}
      <section className="rv-section rv-rule rv-process" aria-labelledby="rv-process-title">
        <div className="rv-wrap">
          <div className="rv-process-grid">
            <h2 className="rv-h2" id="rv-process-title">
              {k.processTitle}
            </h2>
            <div>
              <ol>
                {k.process.map((s) => (
                  <li key={s.title}>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Gozlem />
            </div>
          </div>
          <h3 className="rv-h3" style={{ marginTop: "clamp(3rem, 5vw, 5rem)" }}>
            {k.datesTitle}
          </h3>
          <ul className="rv-dates">
            {k.dates.map((d) => (
              <li key={d.date}>
                <strong>{d.date}</strong>
                <span>{d.text}</span>
              </li>
            ))}
          </ul>
          <Link href="/revak/almanak/" className="rv-textlink" style={{ marginTop: "1rem" }}>
            {tr.nav.groups[4].label}
            <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>

      {/* Documents and the road to the first day: the registry page */}
      <section className="rv-section rv-rule rv-docs-sec" id="belgeler" aria-labelledby="rv-docs-title">
        <div className="rv-wrap rv-docs-grid">
          <div>
            <h2 className="rv-h2" id="rv-docs-title">
              {belgeler.title}
            </h2>
            <p className="rv-kd-intro">{belgeler.intro}</p>
            <Documents />
          </div>
          <div className="rv-firstday">
            <h3 className="rv-h3">{ilkGun.title}</h3>
            <ol>
              {ilkGun.steps.map((s) => (
                <li key={s.when}>
                  <strong>{s.when}</strong>
                  <span>{s.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Scholarship exam */}
      <section className="rv-section rv-ink rv-on-ink rv-burs" id="bursluluk" aria-labelledby="rv-burs-title">
        <div className="rv-wrap">
          <div className="rv-burs-grid">
            <div>
              <h2 className="rv-h2" id="rv-burs-title">
                {k.burs.title}
              </h2>
              <p className="rv-burs-intro">{k.burs.intro}</p>
              <ExamCountdown />
              <Link href="/revak/kabul/bursluluk/" className="rv-btn rv-btn--seal">
                {k.burs.cta}
              </Link>
            </div>
            <div>
              <h3 className="rv-burs-sub" style={{ marginTop: 0 }}>
                {k.burs.sessionsTitle}
              </h3>
              <SessionList />
              <h3 className="rv-burs-sub">{k.burs.tiersTitle}</h3>
              <table className="rv-tiers">
                <thead>
                  <tr>
                    <th scope="col">{k.burs.tiersHead.rank}</th>
                    <th scope="col">{k.burs.tiersHead.rate}</th>
                  </tr>
                </thead>
                <tbody>
                  {k.burs.tiers.map((t) => (
                    <tr key={t.rank}>
                      <td>{t.rank}</td>
                      <td>{t.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="rv-burs-note">{k.burs.tiersNote}</p>
            </div>
          </div>

          <h3 className="rv-burs-sub" style={{ marginTop: "clamp(3.5rem, 6vw, 6rem)" }}>
            {k.burs.sampleTitle}
          </h3>
          <p className="rv-burs-note" style={{ marginTop: "0.25rem" }}>
            {k.burs.sampleIntro}
          </p>
          <SampleQuestions />
        </div>
      </section>

      {/* Fees: what the price covers, how it is paid, refunded and raised */}
      <section className="rv-section rv-fees" id="ucret" aria-labelledby="rv-fees-title">
        <div className="rv-wrap">
          <div className="rv-fees-grid">
            <div>
              <h2 className="rv-h2" id="rv-fees-title">
                {k.fees.title}
              </h2>
              <p className="rv-lede">{k.fees.text}</p>
              <Link href="/revak/kabul/ucret-bilgisi/" className="rv-btn rv-btn--ink">
                {k.fees.cta}
              </Link>
            </div>
            <ul className="rv-discounts">
              {k.fees.discounts.map((d) => (
                <li key={d.text}>
                  <strong>{d.rate}</strong>
                  <span>{d.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rv-incl">
            <div className="rv-incl-head">
              <h3 className="rv-h3">{ucretEk.includedTitle}</h3>
              <p>{ucretEk.includedIntro}</p>
              <Sample>{tr.sample.policy}</Sample>
            </div>
            <div className="rv-incl-cols">
              <div>
                <h4>{ucretEk.inLabel}</h4>
                <ul className="rv-incl-in">
                  {ucretEk.included.map((x) => (
                    <li key={x}>
                      <Icon name="check" size={18} />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>{ucretEk.outLabel}</h4>
                <ul className="rv-incl-out">
                  {ucretEk.extra.map((x) => (
                    <li key={x}>
                      <Icon name="plus" size={18} />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <dl className="rv-incl-policy">
              {ucretEk.policy.map((p) => (
                <div key={p.name}>
                  <dt>{p.name}</dt>
                  <dd>{p.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Faq title={k.faqTitle} groups={faqGroups} />
    </>
  );
}
