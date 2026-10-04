import { tr } from "@/content/kalemkar/tr";
import { Photo } from "../ui/Photo";
import { Opening } from "./Opening";

export function Chef() {
  const c = tr.chef;
  return (
    <section className="kk-chef" id="sef" aria-labelledby="kk-chef-title">
      <div className="kk-wrap kk-chef-grid">
        <figure className="kk-chef-hands">
          <Photo k="sinide" sizes="(max-width: 767px) 92vw, 36vw" />
          <figcaption>{c.capHands}</figcaption>
        </figure>
        <div className="kk-chef-text">
          <h2 id="kk-chef-title" className="kk-h2">
            {c.title}
          </h2>
          <p className="kk-chef-name">{c.name}</p>
          {c.paras.map((p) => (
            <p key={p.slice(0, 16)}>{p}</p>
          ))}
          <blockquote className="kk-quote">
            <p>“{c.quote}”</p>
            <footer>{c.quoteBy}</footer>
          </blockquote>
        </div>
        <figure className="kk-chef-copper">
          <Photo k="bakirci" sizes="(max-width: 767px) 70vw, 24vw" />
          <figcaption>{c.capCopper}</figcaption>
        </figure>
      </div>
    </section>
  );
}

export function Know() {
  const k = tr.know;
  return (
    <section className="kk-know" aria-labelledby="kk-know-title">
      <div className="kk-wrap kk-know-grid">
        <h2 id="kk-know-title" className="kk-h2">
          {k.title}
        </h2>
        <div className="kk-know-list">
          {k.items.map((i) => (
            <details key={i.q} className="kk-know-item">
              <summary>
                <span>{i.q}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8h10M8 3v10" />
                </svg>
              </summary>
              <div className="kk-know-a">
                <p>{i.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OpeningSection() {
  return (
    <section className="kk-opening" aria-labelledby="kk-open-title">
      <div className="kk-wrap">
        <Opening />
      </div>
    </section>
  );
}
