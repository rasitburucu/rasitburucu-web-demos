import type { Metadata } from "next";
import Link from "next/link";
import { veli as v } from "@/content/revak/okul";
import { Crumb } from "@/components/revak/ui/Bits";
import { Icon } from "@/components/revak/ui/Icon";
import { SealMark } from "@/components/revak/flow/kit";

export const metadata: Metadata = { title: v.metaTitle, robots: { index: false, follow: false } };

// An honest door: the parent portal of a real school would live behind this form.
// Here the form is printed, sealed shut, and every field is disabled; beside it,
// what the portal would hold and where its public counterpart sits on this site.
export default function VeliPage() {
  return (
    <section className="rv-veli" aria-labelledby="rv-veli-title">
      <div className="rv-wrap">
        <Crumb current={v.crumb} />
        <div className="rv-veli-grid">
          <div>
            <h1 className="rv-display rv-veli-title" id="rv-veli-title">
              {v.title}
            </h1>
            <p className="rv-lede">{v.text}</p>

            <h2 className="rv-h3 rv-veli-listtitle">{v.listTitle}</h2>
            <p className="rv-veli-listintro">{v.listIntro}</p>
            <ul className="rv-veli-list">
              {v.list.map((x) => (
                <li key={x.title}>
                  <div>
                    <h3>{x.title}</h3>
                    <p>{x.text}</p>
                  </div>
                  <Link href={x.href} className="rv-textlink">
                    {x.link}
                    <Icon name="arrow" size={18} />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/revak/" className="rv-btn rv-btn--line rv-veli-back">
              <Icon name="arrowLeft" size={18} />
              {v.back}
            </Link>
          </div>

          <form className="rv-veli-form" aria-labelledby="rv-veli-form-t">
            <fieldset disabled>
              <legend id="rv-veli-form-t">{v.formTitle}</legend>
              <div className="rv-field">
                <label className="rv-label" htmlFor="rv-veli-e">
                  {v.email}
                </label>
                <input id="rv-veli-e" className="rv-input" type="email" autoComplete="off" />
              </div>
              <div className="rv-field">
                <label className="rv-label" htmlFor="rv-veli-p">
                  {v.password}
                </label>
                <input id="rv-veli-p" className="rv-input" type="password" autoComplete="off" />
              </div>
              <button type="button" className="rv-btn rv-btn--ink">
                {v.submit}
              </button>
            </fieldset>
            <div className="rv-veli-seal">
              <SealMark name={v.closed} ring={v.sealRing} label={v.sealLabel} />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
