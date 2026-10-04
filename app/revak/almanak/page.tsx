import type { Metadata } from "next";
import { tr } from "@/content/revak/tr";
import { almanak as a } from "@/content/revak/almanak";
import { Crumb, CtaBand } from "@/components/revak/ui/Bits";
import { AlmanakList } from "@/components/revak/almanak/List";

export const metadata: Metadata = { title: a.metaTitle, robots: { index: false, follow: false } };

export default function AlmanakPage() {
  return (
    <>
      {/* The almanac's title page: one inscription line and the year in large figures */}
      <section className="rv-pagehead rv-alm-head" aria-labelledby="rv-alm-title">
        <div className="rv-wrap">
          <Crumb current={a.crumb} />
          <div className="rv-alm-titlegrid">
            <h1 className="rv-display" id="rv-alm-title">
              {a.title.replace(/ \d.*/, "")}
              <span className="rv-alm-year" aria-hidden="true">
                2026<span>/</span>27
              </span>
              <span className="rv-sr"> 2026-2027</span>
            </h1>
            <p className="rv-lede">{a.intro}</p>
          </div>
        </div>
      </section>

      <section className="rv-section rv-tight-top" aria-label={a.title}>
        <div className="rv-wrap">
          <AlmanakList />
        </div>
      </section>

      <CtaBand
        id="rv-alm-cta"
        title={tr.closing.title}
        text={tr.closing.text}
        primary={{ href: "/revak/kabul/kampus-turu/", label: tr.hero.secondary }}
        secondary={{ href: "/revak/kabul/on-kayit/", label: tr.hero.primary }}
      />
    </>
  );
}
