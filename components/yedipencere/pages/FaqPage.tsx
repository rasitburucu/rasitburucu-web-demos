import Link from "next/link";
import type { Lang } from "@/lib/yedipencere/dates";
import { href } from "@/lib/yedipencere/paths";
import { COPY } from "@/content/yedipencere/copy";
import { Arrow } from "../ui/icons";

const anchor = (i: number) => `soru-${i + 1}`;

export function FaqPage({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <div className="yp-page">
      <header className="yp-page-head">
        <h1 className="yp-h1">{t.faq.title}</h1>
        <p className="yp-lead">{t.faq.lead}</p>
      </header>
      <div className="yp-faq">
        <ul className="yp-faq-index">
          {t.faq.groups.map((g, i) => (
            <li key={g.title}>
              <a href={`#${anchor(i)}`}>{g.title}</a>
            </li>
          ))}
        </ul>
        <div>
          {t.faq.groups.map((g, i) => (
            <section key={g.title} className="yp-faq-group" aria-labelledby={anchor(i)}>
              <h2 id={anchor(i)}>{g.title}</h2>
              {g.items.map((it) => (
                <details key={it.q}>
                  <summary>{it.q}</summary>
                  <p>{it.a}</p>
                </details>
              ))}
            </section>
          ))}
          <p style={{ marginTop: 28 }}>
            <Link href={href(lang, "arrival")} className="yp-more">
              {t.faq.more} <Arrow />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
