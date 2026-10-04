import Link from "next/link";
import { tr } from "@/content/revak/tr";
import { Icon } from "./Icon";

type Group = (typeof tr.faq.groups)[number];

/** Native <details>: works without JavaScript, keyboard and screen readers for free. */
export function Faq({ title, groups, id = "sss" }: { title: string; groups: Group[]; id?: string }) {
  return (
    <section className="rv-section rv-rule" id={id} aria-labelledby={`${id}-title`}>
      <div className="rv-wrap rv-faq-grid">
        <div className="rv-faq-intro">
          <h2 className="rv-h2" id={`${id}-title`}>
            {title}
          </h2>
          <p>{tr.faq.intro}</p>
          <Link href="/revak/kabul/ucret-bilgisi/" className="rv-btn rv-btn--line">
            {tr.faq.feeCta}
          </Link>
        </div>
        <div>
          {groups.map((g) => (
            <div key={g.title} className="rv-faq-group">
              <h3>{g.title}</h3>
              {g.items.map((q) => (
                <details key={q.q} className="rv-faq-item">
                  <summary>
                    {q.q}
                    <Icon name="plus" size={22} />
                  </summary>
                  <p className="rv-faq-a">{q.a}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
