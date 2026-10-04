import type { Metadata } from "next";
import Link from "next/link";
import { tr } from "@/content/revak/tr";
import { menu, plan } from "@/content/revak/yasam";
import { Photo } from "@/components/revak/ui/Photo";
import { Crumb, CtaBand, Sample } from "@/components/revak/ui/Bits";
import { DayTimeline, RouteCheck, RouteRules } from "@/components/revak/kampus/Interactive";
import { CampusPlan } from "@/components/revak/kampus/Plan";
import { MenuBook } from "@/components/revak/kampus/MenuBook";

const k = tr.kampus;

export const metadata: Metadata = { title: k.metaTitle, robots: { index: false, follow: false } };

export default function KampusPage() {
  return (
    <>
      <section className="rv-pagehead" aria-labelledby="rv-kampus-title">
        <div className="rv-wrap">
          <Crumb current={tr.nav.groups[2].label} />
          <div className="rv-pagehead-grid">
            <h1 className="rv-display" id="rv-kampus-title">
              {k.title}
            </h1>
            <p className="rv-lede">{k.intro}</p>
          </div>
        </div>
      </section>

      <div className="rv-wrap rv-kampus-hero">
        <Photo k="bahceYolu" priority sizes="(max-width: 1400px) 100vw, 1300px" alt={k.heroAlt} />
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

      {/* The campus plan: an ink drawing with keystone markers instead of a 360° tour */}
      <section className="rv-section rv-rule rv-plan-sec" id="plan" aria-labelledby="rv-plan-title">
        <div className="rv-wrap">
          <div className="rv-plan-head">
            <h2 className="rv-h2" id="rv-plan-title">
              {plan.title}
            </h2>
            <p className="rv-kd-intro">{plan.intro}</p>
          </div>
          <CampusPlan />
        </div>
      </section>

      <DayTimeline />

      {/* Lunch: two weeks, two kitchens, allergen marks */}
      <section className="rv-section rv-menu-sec" id="yemek" aria-labelledby="rv-menu-title">
        <div className="rv-wrap">
          <div className="rv-menu-head">
            <h2 className="rv-h2" id="rv-menu-title">
              {menu.title}
            </h2>
            <p className="rv-kd-intro">{menu.intro}</p>
            <Sample>{tr.sample.menu}</Sample>
          </div>
          <MenuBook />
        </div>
      </section>

      <section className="rv-section rv-rule rv-transport" id="servis" aria-labelledby="rv-transport-title">
        <div className="rv-wrap rv-transport-grid">
          <div>
            <h2 className="rv-h2" id="rv-transport-title">
              {k.transport.title}
            </h2>
            <p className="rv-lede">{k.transport.intro}</p>
            <RouteRules />
          </div>
          <RouteCheck />
        </div>
      </section>

      {/* Safety now has its own page; the campus keeps a short pointer */}
      <section className="rv-care-link" id="guvenlik" aria-labelledby="rv-care-title">
        <div className="rv-wrap rv-care-link-in">
          <h2 className="rv-h3" id="rv-care-title">
            {k.care.title}
          </h2>
          <p>{k.care.text}</p>
          <Link href="/revak/guvende/" className="rv-btn rv-btn--line">
            {k.care.link}
          </Link>
        </div>
      </section>

      <CtaBand
        id="rv-kampus-cta"
        title={k.closing.title}
        text={k.closing.text}
        primary={{ href: "/revak/kabul/kampus-turu/", label: tr.hero.secondary }}
        secondary={{ href: "/revak/kabul/on-kayit/", label: tr.hero.primary }}
      />
    </>
  );
}
