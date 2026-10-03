import type { Metadata } from "next";
import Link from "next/link";
import { tr } from "@/content/revak/tr";
import { Photo } from "@/components/revak/ui/Photo";
import { Faq } from "@/components/revak/ui/Faq";
import { ExamCountdown, SampleQuestions, SessionList } from "@/components/revak/kabul/Interactive";

const k = tr.kabul;

export const metadata: Metadata = { title: k.metaTitle, robots: { index: false, follow: false } };

export default function KabulPage() {
  const faqGroups = tr.faq.groups.filter((g) => g.title === "Kabul" || g.title === "Ücret ve burs");
  return (
    <>
      <section className="rv-pagehead" aria-labelledby="rv-kabul-title">
        <div className="rv-wrap">
          <nav className="rv-crumb" aria-label={tr.crumb}>
            <Link href="/revak/">{tr.brand.full}</Link> / {tr.nav.items[4].label}
          </nav>
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

      {/* The process really is a sequence, so it is numbered */}
      <section className="rv-section rv-rule rv-process" aria-labelledby="rv-process-title">
        <div className="rv-wrap">
          <div className="rv-process-grid">
            <h2 className="rv-h2" id="rv-process-title">
              {k.processTitle}
            </h2>
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

      {/* Fees */}
      <section className="rv-section rv-fees" id="ucret" aria-labelledby="rv-fees-title">
        <div className="rv-wrap rv-fees-grid">
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
      </section>

      <Faq title={k.faqTitle} groups={faqGroups} />
    </>
  );
}
