import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tr } from "@/content/revak/tr";
import { IMAGES } from "@/content/revak/images";
import { kademeCommon as c, kademeler, type KademeCopy } from "@/content/revak/kademe";
import { KADEMELER, isKademe } from "@/lib/revak/levels";
import { numerals } from "@/lib/revak/format";
import { Crumb, CtaBand, Ledger, Sample } from "@/components/revak/ui/Bits";
import { Icon } from "@/components/revak/ui/Icon";
import { KademeWindow } from "@/components/revak/kademe/Window";
import { Lessons } from "@/components/revak/kademe/Lessons";
import { DaySun } from "@/components/revak/kademe/DaySun";

const ROMAN = ["I", "II", "III", "IV"];

// One template, four rhythms: each level puts its own concern first
// (anaokulu: uyum; lise: ders yolu ve üniversite) and stands in its own hour of light.
type Block = "guide" | "lang" | "lessons" | "day";
const ORDER: Record<KademeCopy["slug"], Block[]> = {
  anaokulu: ["guide", "lang", "lessons", "day"],
  ilkokul: ["lang", "lessons", "day", "guide"],
  ortaokul: ["lessons", "lang", "day", "guide"],
  lise: ["lessons", "lang", "guide", "day"],
};

export function generateStaticParams() {
  return KADEMELER.map((kademe) => ({ kademe }));
}

export async function generateMetadata({ params }: { params: Promise<{ kademe: string }> }): Promise<Metadata> {
  const { kademe } = await params;
  if (!isKademe(kademe)) return {};
  return { title: kademeler[kademe].metaTitle, robots: { index: false, follow: false } };
}

export default async function KademePage({ params }: { params: Promise<{ kademe: string }> }) {
  const { kademe } = await params;
  if (!isKademe(kademe)) notFound();
  const k = kademeler[kademe];
  const l = tr.levels.items[kademe];
  const i = KADEMELER.indexOf(kademe);
  const prev = KADEMELER[i - 1];
  const next = KADEMELER[i + 1];
  const apply = `/revak/kabul/on-kayit/?kademe=${kademe}`;
  const tour = `/revak/kabul/kampus-turu/?tur=yerinde&kademe=${kademe}`;

  const blocks: Record<Block, React.ReactNode> = {
    lang: (
      <section key="lang" className="rv-section rv-rule rv-kd-lang" aria-labelledby="rv-kd-lang">
        <div className="rv-wrap rv-kd-split">
          <div className="rv-kd-split-head">
            <h2 className="rv-h2" id="rv-kd-lang">
              {k.lang.title}
            </h2>
            <p className="rv-kd-intro">{k.lang.intro}</p>
          </div>
          <div>
            <div className="rv-kd-tablehead">
              <Sample>{tr.sample.schedule}</Sample>
            </div>
            <Ledger head={k.lang.head} rows={k.lang.rows} caption={k.lang.title} />
            <p className="rv-kd-note">{k.lang.note}</p>
          </div>
        </div>
      </section>
    ),
    lessons: (
      <section key="lessons" className="rv-section rv-rule rv-kd-lessons" aria-labelledby="rv-kd-lessons">
        <div className="rv-wrap">
          <div className="rv-kd-lessons-head">
            <h2 className="rv-h2" id="rv-kd-lessons">
              {k.lessons.title}
            </h2>
            <p className="rv-kd-intro">{numerals(k.lessons.intro)}</p>
            <Sample>{tr.sample.schedule}</Sample>
          </div>
          <Lessons
            id={`rv-ls-${kademe}`}
            cols={k.lessons.cols}
            colLabel={k.lessons.colLabel}
            rows={k.lessons.rows}
            c={{ ekLabel: c.ekLabel, totalLabel: c.totalLabel, lesson: c.lesson, none: c.none, caption: k.lessons.title }}
          />
          <p className="rv-kd-note">{k.lessons.note}</p>
        </div>
      </section>
    ),
    day: (
      <section key="day" className="rv-section rv-kd-day" aria-labelledby="rv-kd-day">
        <div className="rv-wrap rv-kd-day-grid">
          <div className="rv-kd-day-main">
            <h2 className="rv-h2" id="rv-kd-day">
              {k.day.title}
            </h2>
            <p className="rv-kd-intro">{k.day.intro}</p>
            <DaySun stops={k.day.stops} label={c.sunLabel} />
          </div>
          <aside className="rv-hourcard" aria-labelledby="rv-kd-hours">
            <div className="rv-hourcard-head">
              <h3 id="rv-kd-hours">{k.hours.title}</h3>
              <Sample>{tr.sample.schedule}</Sample>
            </div>
            <dl>
              {k.hours.rows.map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{r.time}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>
    ),
    guide: (
      <section key="guide" className="rv-section rv-rule rv-kd-guide" aria-labelledby="rv-kd-guide">
        <div className="rv-wrap">
          <div className="rv-kd-guide-head">
            <h2 className="rv-h2" id="rv-kd-guide">
              {k.guide.title}
            </h2>
            <p className="rv-kd-intro">{k.guide.intro}</p>
          </div>
          <ol className="rv-kd-steps">
            {k.guide.steps.map((s) => (
              <li key={s.when + s.title}>
                <p className="rv-kd-step-when">{s.when}</p>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    ),
  };

  return (
    <div className="rv-kd" data-k={kademe} style={{ "--sun": k.sun } as React.CSSProperties}>
      {/* 1. The level plate: the walk's arch for this level, held still in its hour */}
      <section className="rv-kh" aria-labelledby="rv-kh-title">
        <div className="rv-wrap rv-kh-grid">
          <div className="rv-kh-text">
            <Crumb trail={[{ href: "/revak/egitim/", label: c.crumb }]} current={l.name} />
            <p className="rv-kh-folio">
              <span className="rv-num">
                {ROMAN[i]} / {ROMAN[3]}
              </span>
              <span>{l.range}</span>
            </p>
            <h1 className="rv-display" id="rv-kh-title">
              {l.name}
            </h1>
            <p className="rv-lede rv-kh-lede">{k.lede}</p>
            <div className="rv-kh-actions">
              <Link href={apply} className="rv-btn rv-btn--seal">
                {c.apply}
              </Link>
              <Link href={tour} className="rv-textlink">
                {c.tour}
              </Link>
            </div>
          </div>
          <figure className="rv-kh-arch">
            <KademeWindow image={k.image} sun={k.sun} alt={IMAGES[k.image].alt} />
            <figcaption className="rv-kh-hour">
              <span>{c.hourLabel}</span>
              <strong className="rv-num">{k.hour}</strong>
              <span>{k.hourName}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 2. Class setup: four facts set as one ruled line */}
      <section className="rv-kd-setup" aria-labelledby="rv-kd-setup">
        <div className="rv-wrap">
          <h2 className="rv-sr" id="rv-kd-setup">
            {k.setupTitle}
          </h2>
          <dl className="rv-setup">
            {k.setup.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{numerals(s.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {ORDER[kademe].map((b) => blocks[b])}

      {/* Level-specific questions: native <details> */}
      <section className="rv-section rv-rule" aria-labelledby="rv-kd-faq">
        <div className="rv-wrap rv-faq-grid">
          <div className="rv-faq-intro">
            <h2 className="rv-h2" id="rv-kd-faq">
              {c.faqTitle}
            </h2>
            <p>{tr.faq.intro}</p>
          </div>
          <div>
            {k.faq.map((q) => (
              <details key={q.q} className="rv-faq-item">
                <summary>
                  {q.q}
                  <Icon name="plus" size={22} />
                </summary>
                <p className="rv-faq-a">{q.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Down the arcade: the neighbouring levels */}
      <nav className="rv-kd-walk" aria-label={tr.levels.rulerLabel}>
        <div className="rv-wrap rv-kd-walk-in">
          {prev ? (
            <Link href={`/revak/egitim/${prev}/`} className="rv-kd-walk-link" rel="prev">
              <Icon name="arrowLeft" size={20} />
              <span>
                <small>{c.prev}</small>
                {tr.levels.items[prev].name}
              </span>
            </Link>
          ) : (
            <Link href="/revak/egitim/" className="rv-kd-walk-link">
              <Icon name="arrowLeft" size={20} />
              <span>
                <small>{c.crumb}</small>
                {c.allLevels}
              </span>
            </Link>
          )}
          <ol className="rv-kd-walk-dots" aria-hidden="true">
            {KADEMELER.map((x) => (
              <li key={x} className={x === kademe ? "is-here" : undefined} />
            ))}
          </ol>
          {next ? (
            <Link href={`/revak/egitim/${next}/`} className="rv-kd-walk-link rv-kd-walk-link--next" rel="next">
              <span>
                <small>{c.next}</small>
                {tr.levels.items[next].name}
              </span>
              <Icon name="arrow" size={20} />
            </Link>
          ) : (
            <Link href="/revak/egitim/" className="rv-kd-walk-link rv-kd-walk-link--next">
              <span>
                <small>{c.crumb}</small>
                {c.allLevels}
              </span>
              <Icon name="arrow" size={20} />
            </Link>
          )}
        </div>
      </nav>

      <CtaBand id="rv-kd-cta" title={k.closing.title} text={k.closing.text} primary={{ href: tour, label: tr.hero.secondary }} secondary={{ href: apply, label: c.apply }} />
    </div>
  );
}
